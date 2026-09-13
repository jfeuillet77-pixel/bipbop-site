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
 *   node scripts/sitemap.mjs
 */
import { writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { arborescence, orphelines, fichierPage, SITE, PAGES, DOMAINE } from '../src/lib/arborescence.mjs';

const DIST = join(SITE, 'dist');
const CHEMIN = join(DIST, 'sitemap.xml');

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

for (const section of sections) {
  for (const p of section.pages) {
    const url = p.permalien;
    if (!url.startsWith(`${DOMAINE}/`)) problemes.push(`${p.route} : « ${url} » hors de ${DOMAINE}`);
    if (VUES.has(url)) problemes.push(`${p.route} : URL déjà publiée plus haut (${url})`);
    if (/[<>&"]/.test(url)) problemes.push(`${p.route} : caractère interdit dans une URL de sitemap (${url})`);
    VUES.add(url);
    const date = derniereModif(p.route);
    if (!date) sansDate++;
    LIGNES.push(
      ['  <url>', `    <loc>${url}</loc>`, ...(date ? [`    <lastmod>${date}</lastmod>`] : []), '  </url>'].join('\n')
    );
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!-- Généré par scripts/sitemap.mjs à chaque build. Ne pas éditer : la source est',
  '     src/data/plan.json (les routes) et le <title> de chaque page (les libellés du plan du site). -->',
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

writeFileSync(CHEMIN, xml);

/* ------------------------------------------------------------------ rendu */

const oubliees = orphelines(DIST, pages);

console.log(`\nsitemap.xml · ${pages.length} URL(s) · ${relative(SITE, CHEMIN)}`);
for (const section of sections) {
  console.log(`  ${section.titre.padEnd(22)} ${String(section.pages.length).padStart(2)}`);
}
if (sansDate) console.log(`  ${sansDate} URL(s) sans lastmod (date git indisponible)`);
if (oubliees.length) {
  console.log(`\n${oubliees.length} page(s) construite(s) hors du plan éditorial, non publiées dans le sitemap :`);
  for (const r of oubliees) console.log(`  - ${r} — ajouter sa ligne au plan Claude Design ou la rendre volontairement invisible`);
}
console.log('');
