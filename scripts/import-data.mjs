#!/usr/bin/env node
/**
 * import-data.mjs — importe les fichiers de « Claude Design - MàJ/data/ » dans le site.
 *
 *   node scripts/import-data.mjs
 *
 * Séparateurs différents selon la source (Thomann et sélection : « ; », Donner : tabulation).
 * Toutes les colonnes source sont conservées, y compris celles que le site n'affiche pas.
 * Les champs `avis` des maquettes pointent vers des fichiers .dc.html : ils sont
 * réécrits en routes publiques grâce à la colonne fichier_maquette du plan éditorial.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(SITE, '..', 'Claude Design - MàJ', 'data');

/* ------------------------------- CSV → objets ------------------------------- */

function parseCsv(txt, delim) {
  const rows = [];
  let row = [], val = '', dans = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (dans) {
      if (c === '"') { if (txt[i + 1] === '"') { val += '"'; i++; } else dans = false; }
      else val += c;
      continue;
    }
    if (c === '"') dans = true;
    else if (c === delim) { row.push(val); val = ''; }
    else if (c === '\n') { row.push(val); rows.push(row); row = []; val = ''; }
    else if (c !== '\r') val += c;
  }
  if (val !== '' || row.length) { row.push(val); rows.push(row); }
  const [hdr, ...body] = rows.filter((r) => r.some((x) => x.trim() !== ''));
  return body.map((r) => Object.fromEntries(hdr.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const lu = (f) => readFileSync(join(SOURCE, f), 'utf8').replace(/^\uFEFF/, '');
const MODE = { ';' : ';', tab: '\t' };

const acc = parseCsv(lu('selection-accessoires.csv'), ';');
const plan = parseCsv(lu('plan-editorial.csv'), ';');
const modeles = JSON.parse(lu('modeles.json'));
const selModeles = parseCsv(lu('selection-modeles.csv'), ';');

/* --------------------- maquette → route publique (du plan) ------------------- */

const ROUTES = new Map();
for (const r of plan) {
  if (!r.fichier_maquette?.endsWith('.dc.html')) continue;
  const p = (r.permalien || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '');
  ROUTES.set(r.fichier_maquette, p === '' ? '/' : '/' + p + '/');
}

let reecrits = 0, inconnus = [];
for (const m of modeles.modeles) {
  if (!m.avis) continue;
  const route = ROUTES.get(m.avis);
  if (route) { m.avis = route; reecrits++; }
  else inconnus.push(`${m.marque} ${m.modele} → ${m.avis}`);
}

/* ------------------------ jointure avec la sélection -------------------------
   Les noms diffèrent entre les deux fichiers (« MPS-150X Mesh » côté base,
   « MPS-150X E-Drum Mesh Set » côté sélection) et aucun id n'est commun :
   la seule clé fiable est l'URL produit, identique et unique dans les deux. */

const SEL = new Map(selModeles.map((r) => [r.url.split('?')[0], r]));
let sansSeg = 0;
for (const m of modeles.modeles) {
  const r = SEL.get(m.url.split('?')[0]);
  if (r) {
    m.segment = r.seg;
    m.role_editorial = r.role;      // note interne : ne se publie jamais telle quelle
    m.nom_marchand = r.modele;      // libellé commercial long, jamais utilisé en carte
  } else { m.segment = null; m.nom_marchand = null; sansSeg++; }
  m.nom_complet = `${m.marque} ${m.modele}`;
}

/* --------------------------------- écritures -------------------------------- */

/**
 * Tout ce qui part dans src/data/ est bundlé dans le JavaScript du navigateur : le bundle
 * se télécharge et se lit. Les notes internes n'y passent donc pas.
 * Règle D01 du guide-agent : « la colonne rôle est une note interne, elle ne se publie
 * jamais telle quelle ». La valeur d'origine de largeur reste dans le fichier source du
 * dossier Claude Design, qui en est la seule copie conservée.
 */
const NOTES_INTERNES = ['role_editorial', 'largeur_maquette'];
const modèlePublic = (m) => Object.fromEntries(Object.entries(m).filter(([k]) => !NOTES_INTERNES.includes(k)));
const modelesPublic = { ...modeles, modeles: modeles.modeles.map(modèlePublic) };

const write = (p, o) => {
  mkdirSync(dirname(join(SITE, p)), { recursive: true });
  writeFileSync(join(SITE, p), JSON.stringify(o, null, 1) + '\n', 'utf8');
};

write('src/data/modeles.json', modelesPublic);
write('src/data/accessoires.json', acc);
write('src/data/plan.json', plan);
// Pas de copie dans public/ : le comparatif importe la base au build.

/* Quels avis sont réellement publiés sur ce site — la base en annonce plus que le site
   n'en contient, et le comparatif ne doit jamais envoyer le lecteur dans une page vide. */
const dossierAvis = join(SITE, 'src', 'pages', 'avis');
const avisPublicies = existsSync(dossierAvis)
  ? readdirSync(dossierAvis, { withFileTypes: true })
      .filter((e) => e.isDirectory() && existsSync(join(dossierAvis, e.name, 'index.astro')))
      .map((e) => `/avis/${e.name}/`)
      .sort()
  : [];
write('src/data/avis.json', avisPublicies);

const nbr = (n) => String(n).padStart(3);
console.log(`import terminé
  ${nbr(modeles.modeles.length)} modèles   (relevé ${modeles.releve}, version ${modeles.version})
  ${nbr(acc.length)} accessoires en ${new Set(acc.map((a) => a.cat)).size} familles
  ${nbr(plan.length)} entrées du plan éditorial
  ${nbr(reecrits)} liens d'avis réécrits de .dc.html → route publique
  segments joints : ${modeles.modeles.length - sansSeg}/${modeles.modeles.length}
  avis publiés sur ce site : ${avisPublicies.length} (la base en annonce ${reecrits})`);
if (inconnus.length) console.log(`  ⚠ ${inconnus.length} avis sans route connue :\n     ` + inconnus.join('\n     '));
const nonSourc = modeles.modeles.filter((m) => !m.empreinte).length;
console.log(`  empreintes au sol : ${modeles.modeles.length - nonSourc} sourcées, ${nonSourc} à ne surtout pas afficher`);
if (sansSeg) console.log('  ⚠ modèles sans segment joint :', modeles.modeles.filter((m) => !m.segment).map((m) => m.nom_complet).join(', '));
