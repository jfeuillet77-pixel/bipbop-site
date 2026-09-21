#!/usr/bin/env node
/**
 * releve-prix.mjs — le relevé hebdomadaire que réclame Procedure-Mise-A-Jour-Prix (§06).
 *
 *   node scripts/releve-prix.mjs            # les 31 modèles + les accessoires, contre le web FR
 *   node scripts/releve-prix.mjs --only modeles
 *   node scripts/releve-prix.mjs --resume releves/prix-2026-09-17.jsonl   # ne relit que les ratés
 *
 * Une lane par marchand : Thomann renvoie du 429 dès deux requêtes simultanées. Le relevé
 * atterrit dans releves/prix-<date>.jsonl (la procédure demande d'en garder quatre).
 *
 * Comment se lit un prix chez chaque marchand — microdata chez Thomann, JSON-LD chez
 * Woodbrass, variantes Shopify chez Donner — est documenté et implémenté une seule fois,
 * dans `scripts/prix/marchands.mjs`.
 *
 * Ce script interroge les pages une par une. Le rendez-vous du lundi
 * (`scripts/prix/semaine.mjs`) part des flux marchands, qui donnent les 131 prix Thomann et
 * Donner sans une seule requête : c'est lui qui tourne tout seul. Celui-ci reste pour
 * revérifier une référence à la main, ou pour relever quand un flux est indisponible.
 */
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// Comment se lit un prix chez chaque marchand vit dans un seul fichier, partagé avec le
// rendez-vous du lundi (`scripts/prix/`) : deux copies de ces regex dériveraient, et une
// dérive ici publie un prix faux.
import { sleep, money, segmentDe, lirePage } from './prix/marchands.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const only = arg('--only');
const LIMIT = Number(arg('--limit') ?? Infinity);
const FORCE = argv.includes('--force');
const SEUIL = Number(arg('--seuil') ?? 5); // « en dessous de cinq euros, ne touche à rien »
const AUJOURD_HUI = new Date().toISOString().slice(0, 10);
const SORTIE = arg('--out') ?? join(SITE, 'releves', `prix-${AUJOURD_HUI}.jsonl`);

/** Une seule requête à la fois chez Thomann ; les deux autres marchands encaissent l'aller-retour. */
const LANES = { Thomann: { latence: 4600 }, Woodbrass: { latence: 1400 }, 'Donner Music': { latence: 1400 } };

/* ------------------------------------ la base à vérifier ---------------------------------- */

const lignes = [];
{
  const base = JSON.parse(await readFile(join(SITE, 'src', 'data', 'modeles.json'), 'utf8'));
  if (only !== 'accessoires')
    for (const m of base.modeles)
      lignes.push({ source: 'modeles', id: m.id, nom: m.nom_complet ?? `${m.marque} ${m.modele}`, marchand: m.marchand, value: Number(m.prix), texte: m.prixTexte ?? `${m.prix} €`, url: m.url, segment: m.segment ?? null });
  if (only !== 'modeles')
    for (const a of JSON.parse(await readFile(join(SITE, 'src', 'data', 'accessoires.json'), 'utf8')))
      lignes.push({ source: 'accessoires', id: `${a.cat} · ${a.marque} ${a.produit}`, nom: `${a.marque} ${a.produit}`, marchand: a.marchand, value: money(a.prix), texte: a.prix, url: a.url, segment: a.cat });
}
const cibles = lignes.slice(0, LIMIT);

/* -------------------------------------- reprise sur incident -------------------------------- */
if (!FORCE) {
  const deja = arg('--resume');
  if (deja) {
    const parUrl = new Map();
    for (const l of (await readFile(deja, 'utf8')).split('\n')) {
      if (!l.trim()) continue;
      try { const o = JSON.parse(l); if (typeof o.live === 'number') parUrl.set(o.url, o); } catch { /* ligne tronquée */ }
    }
    let n = 0;
    for (const r of cibles) {
      const a = parUrl.get(r.url);
      if (a) { Object.assign(r, { live: a.live, liveName: a.liveName, availability: a.availability, dispoLisible: a.dispoLisible, http: a.http, resume: true }); n++; }
    }
    if (n) console.log(`${n} relevés repris depuis ${deja}`);
  }
} else {
  await writeFile(SORTIE, '');
}

await mkdir(dirname(SORTIE), { recursive: true });
console.log(`${cibles.length} références à relever · lanes ${Object.entries(LANES).map(([m, l]) => `${m} ${l.latence / 1000}s`).join(' / ')} → ${SORTIE.replace(SITE + '/', '')}`);

let faits = 0;
async function lane(marchand) {
  const cfg = LANES[marchand] ?? { latence: 2000 };
  for (const r of cibles.filter((x) => x.marchand === marchand)) {
    if (typeof r.live === 'number') { faits++; continue; }
    r.live = null; r.erreur = null;
    for (let essai = 1; essai <= 4 && r.live === null; essai++) {
      try {
        const lu = await lirePage(r);
        if (r.http === 429 || r.http === 503) {
          const attente = 20000 * essai;
          console.log(`  ${r.http} sur ${r.nom} — ${attente / 1000}s d'attente`);
          await sleep(attente); continue;
        }
        if (lu) { Object.assign(r, { live: lu.price, liveName: lu.name, availability: lu.availability, dispoLisible: lu.dispoLisible, strike: lu.strike }); break; }
        if (r.erreur && r.erreur !== 'prix non lisible dans la page') break;
      } catch (e) {
        r.erreur = String(e.message ?? e).slice(0, 90);
        await sleep(4000 * essai);
      }
    }
    r.ecart = r.live !== null && r.value ? Math.round((r.live - r.value) * 100) / 100 : null;
    r.pct = r.ecart !== null && r.value ? Math.round((r.ecart / r.value) * 1000) / 10 : null;
    r.tranche = r.live !== null && r.source === 'modeles' ? segmentDe(r.live) : null;
    r.changementDeTranche = !!(r.tranche && r.segment && r.tranche !== r.segment);
    faits++;
    const drapeau = r.changementDeTranche ? ` ⚠ change de segment (${r.segment} → ${r.tranche})` : r.availability && r.availability !== 'InStock' ? ` [${r.availability}${r.dispoLisible ? ` · ${r.dispoLisible}` : ''}]` : '';
    console.log(`  [${faits}/${cibles.length}] ${r.marchand} · ${r.nom} : publié ${r.texte} → ${r.live ?? '—'}${r.erreur ? ` (${r.erreur})` : ''}${drapeau}`);
    await appendFile(SORTIE, JSON.stringify(r) + '\n');
    await sleep(cfg.latence + Math.random() * cfg.latence * 0.6);
  }
}
await Promise.all(Object.keys(LANES).map(lane));

/* -------------------------------------------- le bilan -------------------------------------------- */
const lus = cibles.filter((r) => typeof r.live === 'number');
const aTraiter = lus.filter((r) => Math.abs(r.ecart) >= SEUIL);
const bruit = lus.filter((r) => r.ecart && Math.abs(r.ecart) < SEUIL);
const ruptures = lus.filter((r) => r.availability && r.availability !== 'InStock');
const introuvables = cibles.filter((r) => typeof r.live !== 'number');

console.log(`\n═══════════ relevé du ${AUJOURD_HUI} ═══════════`);
console.log(`${lus.length}/${cibles.length} prix lus · ${lus.length - aTraiter.length - bruit.length} identiques · seuil d'intervention ${SEUIL} €`);
console.log(`\nÀ TRAITER (${aTraiter.length})`);
for (const r of aTraiter.sort((a, b) => Math.abs(b.ecart) - Math.abs(a.ecart)))
  console.log(`  ✗ ${r.nom.padEnd(46)} ${r.texte.padStart(9)} → ${r.live} €  (${r.ecart > 0 ? '+' : ''}${r.ecart} €, ${r.pct}%)${r.changementDeTranche ? `  ⚠ ${r.segment} → ${r.tranche}` : ''}`);
console.log(`\nBRUIT, sous le seuil (${bruit.length}) — on n'y touche pas`);
for (const r of bruit) console.log(`  · ${r.nom.padEnd(46)} ${r.texte.padStart(9)} → ${r.live} €  (${r.ecart > 0 ? '+' : ''}${r.ecart} €)`);
console.log(`\nRUPTURES (${ruptures.length}) — un prix affiché sur une réf. épuisée est le piège n°3`);
for (const r of ruptures) console.log(`  · ${r.nom.padEnd(46)} ${r.dispoLisible || r.availability}`);
console.log(`\nNON LUES (${introuvables.length}) — fiche morte ou markup changé, à ouvrir à la main`);
for (const r of introuvables) console.log(`  ? ${r.nom.padEnd(46)} ${r.http ?? ''} ${r.erreur ?? ''}`);
console.log(`\nDétail : ${SORTIE.replace(SITE + '/', '')}`);
