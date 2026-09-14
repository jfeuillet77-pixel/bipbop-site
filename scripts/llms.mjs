#!/usr/bin/env node
/**
 * llms.mjs — le /llms.txt du site, écrit à la fin de chaque build (`postbuild`).
 *
 * llms.txt (https://llmstxt.org) est un fichier Markdown à la racine qu'un modèle lit avant de
 * parcourir un site : un titre, un résumé, puis des listes de liens avec une note par lien.
 * Il ne remplace pas le sitemap — il dit ce que le sitemap ne dit pas : ce que chaque page
 * contient et selon quelle règle elle est écrite.
 *
 * Comme `scripts/sitemap.mjs`, ce script n'invente rien :
 *  - les routes viennent de `src/lib/arborescence.mjs` (plan éditorial) lu dans `dist/`, donc
 *    le llms.txt ne peut pas promettre une URL que le sitemap tait, ni l'inverse ;
 *  - le nom d'un lien est le `<title>` publié de la page, sa note est sa `<meta description>`
 *    publiée : les deux phrases de la fiche SEO, déjà relues page par page
 *    (`design/seo-titles-meta.md`). Une page qui change de copie change de note toute seule ;
 *  - les chiffres du bloc de contexte sont comptés dans `src/data/`, jamais tapés à la main,
 *    et le relevé cité est `RELEVE` de `src/data/modeles.json`, pas la date de l'horloge ;
 *  - le fichier est relu après écriture : s'il ne contient pas exactement un lien par page
 *    publiée du plan, il est refusé.
 *
 * La section « Optional » suit la convention du format : ce qu'un agent peut sauter quand son
 * contexte est compté — ici, les deux pages légales.
 *
 * Échoue si une page publiée n'a pas de `<meta description>` : ça publierait un lien nu.
 *
 *   node scripts/llms.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { arborescence, orphelines, fichierPage, SITE, DOMAINE } from '../src/lib/arborescence.mjs';
import { MODELES, RELEVE } from '../src/data/produits.mjs';

const DIST = join(SITE, 'dist');
const CHEMIN = join(DIST, 'llms.txt');

if (!existsSync(DIST)) {
  console.error('Aucun dist/ — le llms.txt se construit à la fin du build (« npm run build »).');
  process.exit(2);
}

const { sections, pages } = arborescence(DIST);
const problemes = [];

/* --------------------------------------------------- la note publiée d'une page */

/**
 * La `<meta name="description">` telle que construite par Astro. Pas de branche `.astro` ici :
 * ce script lit `dist/`, où toute page est déjà du HTML compilé.
 */
function descriptionPubliee(route) {
  const fichier = fichierPage(DIST, route);
  if (!fichier) return null;
  const tete = readFileSync(fichier, 'utf8').split('</head>')[0];
  const m = tete.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (!m) return null;
  return m[1].replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;|’/g, "'").trim();
}

/** Un lien Markdown ne doit pas casser sur un crochet, un pipe ou un saut de ligne. */
const propre = (s) => s.replace(/[[\]|\n]/g, ' ').replace(/\s+/g, ' ').trim();

/** `- [Titre](https://…): note publiée.` */
function entree(p) {
  const note = descriptionPubliee(p.route);
  if (!note) {
    const vu = fichierPage(DIST, p.route);
    problemes.push(`${p.route} : aucune <meta description> dans ${relative(SITE, vu ?? 'dist')} — ça publierait un lien nu`);
    return `- [${propre(p.titre)}](${p.permalien})`;
  }
  return `- [${propre(p.titre)}](${p.permalien}): ${propre(note)}`;
}

/* ------------------------------------------------------------------ construction */

const NB_AVIS = MODELES.filter((m) => m.avis).length;
const dateReleve = new Date(`${RELEVE}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Les pages légales se lisent en dernier : un agent qui répond à un acheteur n'en a pas besoin. */
const legales = new Set(pages.filter((p) => p.type === 'Légal').map((p) => p.route));

const LIGNES = [
  '# BipBop',
  '',
  `> Guide d'achat des batteries électroniques, en français. ${NB_AVIS} kits testés un par un, ${MODELES.length} modèles suivis, prix relevés chez le marchand le ${dateReleve}.`,
  '',
  "BipBop est un site indépendant. Il aide un débutant, ou un musicien logé en appartement, à choisir sa batterie électronique sans payer une option dont il n'a pas besoin.",
  '',
  'Comment le site écrit :',
  '',
  `- **Un prix publié est un prix relevé**, pas un prix catalogue. Le dernier relevé date du ${dateReleve}, et il est affiché sur chaque page qui cite un prix.`,
  `- **${MODELES.length} modèles sont suivis, ${NB_AVIS} ont un avis complet.** Un avis dit ce qui coince autant que ce qui va.`,
  "- **Aucun lien affilié, aucun article sponsorisé.** BipBop n'a pas de programme d'affiliation : aucune commission ne guide un choix.",
  "- **Une note n'existe que si la grille qui la produit est affichée sur la page.** Aucune valeur chiffrée invérifiable n'est publiée.",
  '',
  'Par où commencer : le [comparatif](https://bipbop.eu/comparatif/) pose trois questions (ton budget, la place dont tu disposes, ce que tu veux jouer) et sort deux modèles. ' +
    `Toutes les pages listées ci-dessous sont publiées et indexables ; l'inventaire complet des URL est dans [le sitemap](${DOMAINE}/sitemap.xml) ` +
    `et [le plan du site](${DOMAINE}/plan-du-site/).`,
  '',
];

for (const section of sections) {
  const dans = section.pages.filter((p) => !legales.has(p.route));
  if (!dans.length) continue;
  LIGNES.push(`## ${section.titre}`, '', ...dans.map(entree), '');
}

const horsOptional = pages.filter((p) => !legales.has(p.route)).length;
const optionnelles = pages.filter((p) => legales.has(p.route));
if (optionnelles.length) {
  LIGNES.push('## Optional', '', ...optionnelles.map(entree), '');
}

const fichier = LIGNES.join('\n');
const liens = (fichier.match(/^- \[/gm) || []).length;
if (liens !== pages.length) {
  problemes.push(`${liens} lien(s) écrit(s) pour ${pages.length} page(s) publiée(s) au plan éditorial — un lien a disparu ou fait double`);
}
if (problemes.length) {
  console.error('llms.txt refusé :');
  for (const p of problemes) console.error('  - ' + p);
  process.exit(1);
}

writeFileSync(CHEMIN, fichier);

/* ------------------------------------------------------------------ rendu */

const oubliees = orphelines(DIST, pages);

console.log(`\nllms.txt · ${liens} lien(s), dont ${horsOptional} hors « Optional » · ${relative(SITE, CHEMIN)}`);
for (const section of sections) {
  console.log(`  ${section.titre.padEnd(22)} ${String(section.pages.length).padStart(2)}`);
}
if (oubliees.length) {
  console.log(`\n${oubliees.length} page(s) construite(s) hors du plan éditorial, non publiées dans le llms.txt :`);
  for (const r of oubliees) console.log(`  - ${r} — ajouter sa ligne au plan Claude Design ou la rendre volontairement invisible`);
}
console.log('');
