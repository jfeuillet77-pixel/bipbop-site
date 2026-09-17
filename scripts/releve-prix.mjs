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
 * Comment se lit un prix chez chaque marchand — ce n'est pas le même mécanisme partout :
 *   - Thomann ne publie AUCUN JSON-LD. Le prix est en microdata (`itemprop="price"`, décimale
 *     à la virgule), la dispo en `itemprop="availability"`, et le nom vérifiable dans le bloc
 *     e-commerce GTM (`"item_name"`, `"price"`). Le `itemprop="name"` du fil d'Ariane renvoie « Home ».
 *   - Woodbrass et Donner donnent du JSON-LD. Chez Woodbrass, une référence retirée renvoie
 *     HTTP 200 sur une page de catégorie sans prix : c'est la fiche qui est morte, pas le parseur.
 *   - Donner est un Shopify multi-variantes : le JSON-LD ne dit que la variante par défaut, qui
 *     est souvent le bundle. On relit donc `<slug>.json` et on retient le MINIMUM des variantes.
 *     Le `compare_at_price` de Donner est le prix barré permanent (règle I05) : jamais publié.
 */
import { readFile, writeFile, appendFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
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

const sleep = (ms) => new Promise((s) => setTimeout(s, ms));
const norm = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const money = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const m = String(v).replace(/\s|\u00a0/g, '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const hote = (u) => { try { return new URL(u).host; } catch { return ''; } };

/* ---------------------------------- les trois lectures --------------------------------- */

function lireThomann(html) {
  const price = html.match(/itemprop="price"\s+content="([\d.,]+)"/i);
  if (!price) return null;
  const nom =
    html.match(/"item_name":"([^"]+)"/)?.[1] ??
    html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1] ?? '';
  const dispo = (html.match(/itemprop="availability"\s+href="[^"]*?\/(\w+)"/i) ?? [])[1] ?? '';
  const libelle = (html.match(/(Disponible sous [^<]{2,24}|actuellement indisponible)/i) ?? [])[1] ?? '';
  return { price: money(price[1]), name: nom.trim(), availability: dispo, dispoLisible: libelle };
}

function blocsLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { out.push(JSON.parse(m[1].trim())); } catch { /* bloc illisible */ }
  }
  return out;
}
function produits(node, acc, profondeur = 0) {
  if (!node || profondeur > 8) return acc;
  if (Array.isArray(node)) { for (const n of node) produits(n, acc, profondeur + 1); return acc; }
  if (typeof node !== 'object') return acc;
  if (/Product/i.test(String(node['@type'] ?? ''))) acc.push(node);
  for (const k of ['@graph', 'mainEntity', 'item', 'itemListElement', 'itemList', 'product'])
    if (node[k] !== undefined) produits(node[k], acc, profondeur + 1);
  return acc;
}
function offres(o, acc, profondeur = 0) {
  if (!o || profondeur > 6) return acc;
  if (Array.isArray(o)) { for (const x of o) offres(x, acc, profondeur + 1); return acc; }
  if (typeof o === 'object') {
    if (o.price !== undefined || o.lowPrice !== undefined || /Offer/i.test(String(o['@type'] ?? ''))) acc.push(o);
    for (const k of ['offers', 'itemOffered']) if (o[k] !== undefined) offres(o[k], acc, profondeur + 1);
  }
  return acc;
}
function lireJsonLd(html, attendu) {
  const cibles = [];
  for (const bloc of blocsLd(html))
    for (const p of produits(bloc, []))
      for (const o of offres(p.offers ?? p, [])) {
        const prix = money(o.price ?? o.lowPrice ?? o.priceRange);
        if (prix === null || prix <= 0 || !/EUR/i.test(String(o.priceCurrency ?? 'EUR'))) continue;
        cibles.push({ price: prix, name: String(p.name ?? '').trim(), availability: String(o.availability ?? '').split('/').pop(), strike: money(o.listPrice ?? o.strikethroughPrice ?? o.highPrice) });
      }
  if (!cibles.length) return null;
  const mots = norm(attendu).split(' ').filter((w) => w.length > 2);
  return cibles
    .map((c) => ({ ...c, score: mots.length ? mots.filter((w) => norm(c.name).includes(w)).length / mots.length : 1 }))
    .sort((a, b) => b.score - a.score || a.price - b.price)[0];
}

/** Chez Donner, le prix qui compte est celui de la variante la moins chère : le lien y mène. */
async function lireDonner(url) {
  const cible = url.split('?')[0].replace(/\/$/, '') + '.json';
  const res = await fetch(cible, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) return null;
  const p = (await res.json())?.product;
  if (!p?.variants?.length) return null;
  const prix = Math.min(...p.variants.map((v) => money(v.price) ?? Infinity));
  const variante = p.variants.find((v) => money(v.price) === prix);
  if (!Number.isFinite(prix)) return null;
  return { price: prix, name: `${p.title}${variante ? ` — ${variante.title}` : ''}`, availability: 'InStock', strike: money(variante?.compare_at_price) };
}

async function lire(r) {
  if (r.marchand === 'Donner Music') {
    try { const d = await lireDonner(r.url); if (d) return d; } catch { /* on retombe sur la page */ }
  }
  const res = await fetch(r.url, {
    headers: { 'user-agent': UA, 'accept-language': 'fr-FR,fr;q=0.9', accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow', signal: AbortSignal.timeout(45000),
  });
  r.http = res.status;
  const html = await res.text();
  if (!res.ok) { r.erreur = `HTTP ${res.status}`; return null; }
  const lu = hote(r.url).includes('thomann') ? lireThomann(html) : lireJsonLd(html, r.nom);
  if (!lu) r.erreur = 'prix non lisible dans la page';
  return lu;
}

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
        const lu = await lire(r);
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

/** Les tranches du hub (mêmes bornes que segmentDe dans greffes.mjs). */
function segmentDe(prix) {
  if (prix < 300) return 'Moins de 300 €';
  if (prix < 500) return '300 à 500 €';
  if (prix < 800) return '500 à 800 €';
  if (prix <= 1600) return '800 à 1600 €';
  return 'HORS TRANCHE — au-delà de 1600 €, segmentDe() fait échouer le build';
}

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
