// Usage : node scripts/prix/telecharger-flux.mjs [--forcer]
//
// Télécharge les deux flux marchands dans releves/flux/. Ce dossier est dans .gitignore :
// le catalogue Thomann pèse 95 Mo et se retélécharge en une minute, il n'a rien à faire
// dans l'historique du dépôt.
//
// Les adresses viennent du `.env` de la racine (THOMANN_FEED_URL, DONNER_FEED_URL) : elles
// portent un jeton d'espace partenaire. Sans elles, le relevé sait se rabattre sur la lecture
// des pages marchandes, il est seulement plus lent et plus fragile.
//
// Trois précautions, parce qu'un flux tronqué donne un relevé qui a l'air juste :
//   - le fichier arrive sous un nom provisoire et ne prend sa place qu'une fois complet ;
//   - l'en-tête et le nombre de lignes sont vérifiés avant de remplacer quoi que ce soit ;
//   - la version précédente est gardée, pour pouvoir revenir en arrière.
//
// Ce que chaque flux sait dire, parce que ce n'est pas le même : Thomann donne un prix et
// AUCUNE disponibilité (9 colonnes, pas de stock) — c'est la page produit qui la porte, et
// c'est le piège n°3 de la procédure. Donner donne le prix ET le stock, mais une ligne par
// variante, et son « Original Price » est le prix barré permanent que la règle I05 interdit
// de publier.
import { existsSync, statSync, renameSync, rmSync, readFileSync, mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOSSIER = join(SITE, 'releves', 'flux');
const FORCER = process.argv.includes('--forcer');

/** Le .env de la racine, lu à la main : pas de dépendance pour trois lignes. */
const env = (() => {
  const f = join(SITE, '.env');
  if (!existsSync(f)) return {};
  return Object.fromEntries(
    readFileSync(f, 'utf8').split('\n').map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
  );
})();

const FLUX = [
  {
    nom: 'Thomann',
    url: process.env.THOMANN_FEED_URL ?? env.THOMANN_FEED_URL,
    cible: join(DOSSIER, 'catalogue-thomann.csv'),
    entete: 'ArticleNumber;Brand;Model;Description;Price;ImageURL;ProductURL;CategoryTree;Referrer URL',
    plancher: 50000, // un flux plus court que cela n'est pas le catalogue Thomann
    gzip: false,
  },
  {
    nom: 'Donner Music',
    url: process.env.DONNER_FEED_URL ?? env.DONNER_FEED_URL,
    cible: join(DOSSIER, 'catalogue-donner.tsv'),
    entete: 'Unique Merchant SKU\tProduct Name\tProduct URL',   // début de l'en-tête Impact
    plancher: 200,
    gzip: true, // Impact sert du gzip sans Content-Encoding : c'est à nous de le détendre
  },
];

mkdirSync(DOSSIER, { recursive: true });
let manquants = 0, echecs = 0;

for (const f of FLUX) {
  if (!f.url) {
    console.log(`  ⚠ ${f.nom} : aucune adresse de flux dans le .env — le relevé lira les pages.`);
    manquants++;
    continue;
  }
  if (!FORCER && existsSync(f.cible)) {
    const jours = (Date.now() - statSync(f.cible).mtimeMs) / 86400000;
    if (jours < 6) {
      console.log(`  · ${f.nom} : téléchargé il y a ${jours.toFixed(1)} jour(s), on le garde (--forcer pour refaire).`);
      continue;
    }
  }

  const provisoire = `${f.cible}.en-cours`;
  const debut = Date.now();
  let brut;
  try {
    const r = await fetch(f.url, { signal: AbortSignal.timeout(600000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    brut = Buffer.from(await r.arrayBuffer());
  } catch (e) {
    console.error(`  ✗ ${f.nom} : ${e.message}. L'ancien catalogue reste en place.`);
    echecs++;
    continue;
  }

  // Le gzip se reconnaît à ses deux premiers octets, pas à la promesse du serveur.
  const corps = brut[0] === 0x1f && brut[1] === 0x8b ? gunzipSync(brut) : brut;
  await writeFile(provisoire, corps);

  const tete = corps.subarray(0, 400).toString('utf8').replace(/^﻿/, '').split('\n')[0].trimEnd();
  let lignes = 0;
  for (let i = 0; i < corps.length; i++) if (corps[i] === 10) lignes++;
  if (!tete.startsWith(f.entete) || lignes < f.plancher) {
    rmSync(provisoire);
    console.error(`  ✗ ${f.nom} : flux inattendu (${lignes} lignes, en-tête « ${tete.slice(0, 60)}… »). Rien n'a été remplacé.`);
    echecs++;
    continue;
  }
  if (existsSync(f.cible)) renameSync(f.cible, `${f.cible}.precedent`);
  renameSync(provisoire, f.cible);
  console.log(`  ✓ ${f.nom} : ${lignes.toLocaleString('fr-FR')} lignes, ${(corps.length / 1e6).toFixed(1)} Mo, en ${Math.round((Date.now() - debut) / 1000)} s`);
}

// Un flux absent n'arrête pas le lundi : le relevé se rabat sur les pages. Deux flux en échec,
// si : ce n'est plus un relevé, c'est un scraping complet qui va se faire jeter par Thomann.
if (echecs === FLUX.length) {
  console.error('  ✗ Aucun flux n\'a pu être téléchargé. Le relevé ne partira pas sur une base saine.');
  process.exit(1);
}
if (manquants) console.log(`  ${manquants} flux sans adresse : renseigner le .env de la racine.`);
