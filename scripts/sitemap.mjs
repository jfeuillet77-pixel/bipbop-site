#!/usr/bin/env node
/**
 * sitemap.mjs — le sitemap XML du site, écrit à la fin de chaque build (`postbuild`).
 *
 * Il ne contient que ce qui est réellement construit : la liste des routes vient du plan
 * éditorial (`src/data/plan.json`), chaque route est vérifiée dans `dist/`, et le fichier est
 * lu par la même fonction que la page « Plan du site » (`src/lib/arborescence.mjs`). Un seul
 * arbre, deux lectures : le plan du site ne peut pas promettre une URL que le sitemap tait,
 * et inversement.
 *
 * Deux règles de prudence :
 *  - une ligne « Publié » dont la page est absente du build fait ÉCHOUER le script. Une URL
 *    morte dans un sitemap est le seul bug qu'on ne voit jamais : personne ne clique dessus ;
 *  - une page construite mais absente du plan est signalée et NON publiée. AGENTS.md interdit
 *    de laisser paraitre un document interne dans un sitemap, donc on n'y entre pas tout seul.
 *
 * `lastmod` vient de git, pas de l'horloge : la date de dernière modification du fichier
 * source. Un rebuild qui ne change rien ne doit pas faire croire à Google que tout a changé.
 * Sans historique git disponible, la ligne est omise plutôt qu'inventée.
 *
 * TROIS FICHIERS, une seule liste. Depuis le 22/09/2026, Search Console tient
 * `/sitemap.xml` en « Impossible de récupérer le sitemap » alors que le fichier répond 200 en
 * HTTP/1.1 comme en HTTP/2, avec et sans compression, XML valide, sans BOM — mesuré sous tous
 * les angles. L'échec est dans l'état que Google garde pour CETTE adresse, pas sur le serveur.
 * On publie donc la même liste à des adresses neuves, qui n'héritent d'aucun échec :
 *
 *   /sitemap-index.xml  l'index, la seule adresse déclarée dans robots.txt et soumise à Google
 *   /sitemap-0.xml      la liste des URL, vers laquelle l'index pointe
 *   /sitemap.xml        la même liste, gardée en vie : llms.txt la cite, et une adresse de
 *                       sitemap qui disparait est une 404 de plus dans les rapports de Google
 *
 *   node scripts/sitemap.mjs
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { arborescence, orphelines, fichierPage, SITE, PAGES, DOMAINE } from '../src/lib/arborescence.mjs';

const DIST = join(SITE, 'dist');
const CHEMIN = join(DIST, 'sitemap.xml');
const CHEMIN_LISTE = join(DIST, 'sitemap-0.xml');
const CHEMIN_INDEX = join(DIST, 'sitemap-index.xml');

if (!existsSync(DIST)) {
  console.error('Aucun dist/ — le sitemap se construit à la fin du build (« npm run build »).');
  process.exit(2);
}

const { sections, pages } = arborescence(DIST);

/* ------------------------------------------------- dernière modification, selon git */

/**
 * Date de dernier commit du FICHIER SOURCE (et non du fichier copié dans dist, qui n'est pas
 * versionné). C'est la date réelle d'écriture de la page, y compris quand elle vient d'un
 * portage qui n'a rien changé.
 */
function derniereModif(route) {
  const source = fichierPage(PAGES, route);
  if (!source) return null;
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cI', '--', relative(SITE, source)], {
      cwd: SITE,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    // %cI donne un horodatage ISO 8601 avec décalage, déjà au format W3C attendu par les sitemaps.
    return date || null;
  } catch {
    return null; // pas de git (build sans dépôt) : lastmod sauté, URL publiée quand même.
  }
}

/* ------------------------------------------------------------------ construction */

const LIGNES = [];
const VUES = new Set();
const problemes = [];
let sansDate = 0;
// `lastmod` de l'index : la plus récente des pages. Les dates de git sont ISO 8601 avec décalage,
// donc comparables comme des chaînes tant qu'elles viennent toutes du même format (%cI).
let PLUS_RECENTE = null;

for (const section of sections) {
  for (const p of section.pages) {
    const url = p.permalien;
    if (!url.startsWith(`${DOMAINE}/`)) problemes.push(`${p.route} : « ${url} » hors de ${DOMAINE}`);
    if (VUES.has(url)) problemes.push(`${p.route} : URL déjà publiée plus haut (${url})`);
    if (/[<>&"]/.test(url)) problemes.push(`${p.route} : caractère interdit dans une URL de sitemap (${url})`);
    VUES.add(url);
    const date = derniereModif(p.route);
    if (!date) sansDate++;
    else if (!PLUS_RECENTE || date > PLUS_RECENTE) PLUS_RECENTE = date;
    LIGNES.push(
      ['  <url>', `    <loc>${url}</loc>`, ...(date ? [`    <lastmod>${date}</lastmod>`] : []), '  </url>'].join('\n')
    );
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...LIGNES,
  '</urlset>',
  '',
].join('\n');

if (problemes.length) {
  console.error('sitemap refusé :');
  for (const p of problemes) console.error('  - ' + p);
  process.exit(1);
}

const xmlIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <sitemap>',
  `    <loc>${DOMAINE}/sitemap-0.xml</loc>`,
  ...(PLUS_RECENTE ? [`    <lastmod>${PLUS_RECENTE}</lastmod>`] : []),
  '  </sitemap>',
  '</sitemapindex>',
  '',
].join('\n');

writeFileSync(CHEMIN, xml);
writeFileSync(CHEMIN_LISTE, xml);
writeFileSync(CHEMIN_INDEX, xmlIndex);

/* ------------------------------------------------------------------ rendu */

const oubliees = orphelines(DIST, pages);

console.log(`\nsitemap · ${pages.length} URL(s) · ${relative(SITE, CHEMIN_INDEX)} → ${relative(SITE, CHEMIN_LISTE)} (+ ${relative(SITE, CHEMIN)}, conservé)`);
for (const section of sections) {
  console.log(`  ${section.titre.padEnd(22)} ${String(section.pages.length).padStart(2)}`);
}
if (sansDate) console.log(`  ${sansDate} URL(s) sans lastmod (date git indisponible)`);
if (oubliees.length) {
  console.log(`\n${oubliees.length} page(s) construite(s) hors du plan éditorial, non publiées dans le sitemap :`);
  for (const r of oubliees) console.log(`  - ${r} — ajouter sa ligne au plan Claude Design ou la rendre volontairement invisible`);
}
console.log('');
