#!/usr/bin/env node
// Usage : node scripts/prix/archiver-flux.mjs
//
// L'archive quotidienne des prix du rayon batterie électronique : la matière du baromètre des
// prix (décidé le 07/10/2026). Le relevé du lundi ne suit que les 159 références vers lesquelles
// le site envoie, une fois par semaine, et ne garde pas les catalogues. Un baromètre citable par
// la presse a besoin de plus : tout le rayon, chaque jour, et le prix barré quand il existe,
// pour mesurer ce que valent vraiment les promotions du Black Friday (27/11/2026).
//
// Ce qu'on garde, par jour, dans un JSON compressé (une vingtaine de Ko) :
//   - Thomann : toutes les lignes du flux sous « Batteries Electroniques », plus le hardware et
//     les housses pour batteries électroniques. Prix seulement : le flux n'a pas de stock.
//   - Donner : les lignes batterie du flux Impact, avec le prix courant, le prix barré
//     (« Original Price ») et le stock. Le prix barré est archivé pour être MESURÉ ; il ne se
//     publie toujours jamais comme un prix (règle I05).
// Aucun identifiant affilié n'est archivé : les deux flux portent ceux d'un autre site de Jordane.
// Thomann garde son adresse sans paramètres, Donner n'en garde aucune (voir plus bas).
//
// Où : releves/archive/AAAA-MM-JJ.json.gz (hors dépôt, voir .gitignore : un fichier par jour
// salirait le dépôt et ferait refuser sa livraison au relevé du lundi), et une copie dans le
// dossier ARCHIVE_COPIE du .env s'il est renseigné (un dossier synchronisé : l'archive est la
// seule donnée du site qu'on ne pourra jamais retélécharger).
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FLUX = join(SITE, 'releves', 'flux');
const ARCHIVE = join(SITE, 'releves', 'archive');
const DATE = new Date().toISOString().slice(0, 10);

const env = (() => {
  const f = join(SITE, '.env');
  if (!existsSync(f)) return {};
  return Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
})();

// Le téléchargement est celui du lundi, avec ses vérifications. Le lundi à 8 h 17 réutilisera ce
// catalogue s'il a moins de 12 heures.
const t = spawnSync(process.execPath, [join(SITE, 'scripts', 'prix', 'telecharger-flux.mjs')], { encoding: 'utf8', stdio: 'inherit' });
if (t.status !== 0) { console.error('  ✗ flux indisponibles : pas d\'archive aujourd\'hui.'); process.exit(1); }

// `garder` trie les lignes brutes AVANT l'analyse : 124 000 lignes Thomann analysées en objets
// dépassent le tas de Node (2 Go), alors que le rayon en compte 500. Le flux Thomann a une ligne
// par article (124 001 lignes pour 124 000 articles) : le filtre brut ne coupe aucun champ.
function lignes(fichier, sep, garder = null) {
  let txt = readFileSync(fichier, 'utf8').replace(/^﻿/, '');
  if (garder) {
    const brutes = txt.split('\n');
    txt = [brutes[0], ...brutes.slice(1).filter((l) => garder.test(l))].join('\n');
  }
  const out = [];
  let row = [], val = '', dans = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (dans) {
      if (c === '"') { if (txt[i + 1] === '"') { val += '"'; i++; } else dans = false; } else val += c;
      continue;
    }
    if (c === '"' && val === '') dans = true;
    else if (c === sep) { row.push(val); val = ''; }
    else if (c === '\n') { row.push(val); out.push(row); row = []; val = ''; }
    else if (c !== '\r') val += c;
  }
  if (val || row.length) { row.push(val); out.push(row); }
  const [entete, ...corps] = out;
  return corps.map((r) => Object.fromEntries(entete.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const prix = (s) => (s ? Number(String(s).replace(/[^\d,.]/g, '').replace(',', '.')) || null : null);
const propre = (u) => (u || '').split('?')[0];

const RAYON = /Batteries Electroniques|pour Batteries Electroniques/;
const thomann = lignes(join(FLUX, 'catalogue-thomann.csv'), ';', RAYON)
  .filter((r) => RAYON.test(r.CategoryTree))
  .map((r) => ({
    id: r.ArticleNumber, marque: r.Brand, modele: r.Model, prix: prix(r.Price),
    categorie: r.CategoryTree.split(' > ').slice(1).join(' > '), url: propre(r.ProductURL),
  }));

const donner = existsSync(join(FLUX, 'catalogue-donner.tsv'))
  ? lignes(join(FLUX, 'catalogue-donner.tsv'), '\t')
    .filter((r) => /drum|batterie/i.test(`${r['Product Type']} ${r.Category} ${r['Product Name']}`))
    .map((r) => ({
      id: r['Unique Merchant SKU'], nom: r['Product Name'], prix: prix(r['Current Price']),
      prixBarre: prix(r['Original Price']), stock: r['Stock Availability'], parent: r['Parent SKU'],
      // Pas d'adresse : la « Product URL » d'Impact est la passerelle donnnermusic.sjv.io, qui porte
      // l'identifiant affilié de l'autre site. Le SKU suffit à retrouver la fiche.
    }))
  : [];

if (thomann.length < 300) { console.error(`  ✗ ${thomann.length} lignes Thomann seulement : flux suspect, rien n'est archivé.`); process.exit(1); }

const instantane = { date: DATE, sources: { thomann: 'flux partenaire', donner: 'flux Impact' }, thomann, donner };
mkdirSync(ARCHIVE, { recursive: true });
const cible = join(ARCHIVE, `${DATE}.json.gz`);
writeFileSync(cible, gzipSync(JSON.stringify(instantane)));
console.log(`  ✓ archive du ${DATE} : ${thomann.length} lignes Thomann, ${donner.length} lignes Donner → ${cible}`);

if (env.ARCHIVE_COPIE) {
  try {
    mkdirSync(env.ARCHIVE_COPIE, { recursive: true });
    copyFileSync(cible, join(env.ARCHIVE_COPIE, `${DATE}.json.gz`));
    console.log(`  ✓ copie dans ${env.ARCHIVE_COPIE}`);
  } catch (e) {
    console.error(`  ⚠ copie impossible dans ${env.ARCHIVE_COPIE} : ${e.message}`);
  }
}
