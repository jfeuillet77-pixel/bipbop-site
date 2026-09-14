/**
 * Portage mécanique des maquettes Claude Design -> pages du site.
 *
 * Une maquette `.dc.html` est déjà un document complet : styles inline, bloc responsive
 * `<!--responsive-->` avec ses crochets `data-*`, texte intégral. Ce document est la source
 * de vérité. Ce script ne le réécrit pas, il le déplace : il sort le `<helmet>` du `<body>`
 * vers le `<head>`, retire l'échafaudage Claude Design, et pose les cinq choses que le design
 * ne contient pas — titre, description, canonical, robots, langues.
 *
 * La fidélité n'est donc plus contrôlée après coup : elle est tenue par construction.
 * `npm run fidelite` ne sert plus qu'à repérer une maquette qui aurait bougé depuis le portage.
 *
 * Ce que le script NE fait pas : le comparatif (`Comparatif.dc.html`), seule page dynamique
 * du dossier, déjà portée avec le moteur DCLogic.
 *
 * A ne pas brancher sur `prebuild` : le dossier `Claude Design - MàJ/` n'est pas dans le dépôt.
 * Un build Netlify qui exécuterait ce script n'y trouverait aucune maquette et effacerait les
 * 37 pages. Le portage reste une étape locale, volontaire, dont le résultat est committé.
 *
 *   node scripts/port.mjs            # portage réel
 *   node scripts/port.mjs --dry      # rendu sans écrire, avec les avertissements
 *   node scripts/port.mjs --neuf     # ne touche aucune route déjà publiée
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appliquerGreffes, urlPublique } from './greffes.mjs';

const SITE = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');
const MAQUETTES = join(SITE, '..', 'Claude Design - MàJ');
const PAGES = join(SITE, 'src', 'pages');
const SECHE = join(SITE, 'design', 'port-seche');

const DRY = process.argv.includes('--dry');
const NEUF = process.argv.includes('--neuf');

/** Maquettes qui ne se portent pas : la seule page dynamique du dossier est déjà portée. */
const EXCLUES = new Set(['Comparatif.dc.html']);

// ---------------------------------------------------------------- table maquette -> route

function lirePlan() {
  const brut = readFileSync(join(MAQUETTES, 'data', 'plan-editorial.csv'), 'utf8');
  const lignes = brut.split(/\r?\n/).filter((l) => l.trim());
  const entetes = lignes[0].split(/";"/).map((s) => s.replace(/^"|"$/g, ''));
  const iFichier = entetes.indexOf('fichier_maquette');
  const iPerm = entetes.indexOf('permalien');
  const iTitre = entetes.indexOf('titre');
  const table = new Map();
  for (const l of lignes.slice(1)) {
    const c = l.split(/";"/).map((s) => s.replace(/^"|"$/g, ''));
    const fichier = c[iFichier];
    if (!fichier || !fichier.endsWith('.dc.html') || table.has(fichier)) continue; // « toutes les pages » n'est pas un fichier
    // Guide-du-Projet et les documents internes n'ont pas de permalien : ils ne se publient pas.
    if (!/^https?:/.test(c[iPerm]) && fichier !== '404.dc.html') continue;
    table.set(fichier, { permalien: c[iPerm], titrePlan: c[iTitre] });
  }
  return table;
}

/** `https://bipbop.eu/avis/` -> `/avis/` ; le 404 n'a pas de route publique. */
function cheminDeRoute(fichier, permalien) {
  if (fichier === '404.dc.html') return '404.html';
  const url = new URL(permalien);
  const chemin = url.pathname.replace(/\/+$/, '') || '/';
  return chemin === '/' ? 'index.html' : chemin.replace(/^\//, '') + '/index.html';
}

// ---------------------------------------------------------- titres et descriptions en place

/** Chemin de la source Astro qui occupe aujourd'hui cette route, s'il y en a une. */
function sourceAstro(route) {
  const seche = route.endsWith('/index.html')
    ? join(SECHE, dirname(route), 'index.astro')
    : join(SECHE, route.replace(/\.html$/, '.astro'));
  const candidates = route.endsWith('/index.html')
    ? [join(PAGES, dirname(route), 'index.astro'), seche]
    : [join(PAGES, route.replace(/\.html$/, '.astro')), join(PAGES, dirname(route), basename(route, '.html') + '.astro'), seche];
  for (const chemin of candidates) if (existsSync(chemin)) return chemin;
  return null;
}

/** Récupère le `title` et la `description` déjà rédigés, dans la source Astro ou dans la page portée. */
function copySeo(route) {
  const chemin = sourceAstro(route);
  if (chemin) {
    const src = readFileSync(chemin, 'utf8');
    const t = src.match(/<(?:BaseLayout|Layout)[^>]*?\btitle="([^"]+)"/);
    const d = src.match(/\bdescription="([^"]+)"/);
    return { title: t?.[1] ?? null, description: d?.[1] ?? null, source: chemin };
  }
  // Une page déjà portée : sa copie SEO vit dans son <head>, il faut la retrouver là aussi,
  // sinon le deuxième portage d'une même page effacerait ce que le premier avait repris.
  // Le titre se relit dans le `<head>` uniquement : le corps des maquettes porte ses propres
  // balises `<title>` (SVG), et depuis la passe SEO du 14/09 la marque n'est plus dans les
  // titles — le suffixe ne sert donc plus de discriminant. Même lecture que `titrePublie()`
  // de src/lib/arborescence.mjs.
  const page = join(PAGES, route);
  if (existsSync(page)) {
    const src = readFileSync(page, 'utf8');
    const tete = src.split('</head>')[0];
    const t = tete.match(/<title>([\s\S]*?)<\/title>/);
    const d = src.match(/<meta name="description" content="([^"]*)"/);
    if (t || d) return { title: t?.[1] ?? null, description: d?.[1] ?? null, source: page };
  }
  return { title: null, description: null, source: null };
}

/**
 * Faute de titre écrit, on prend le `<h1>` de la maquette, mot pour mot.
 * Faute de description, on prend la première phrase du chapeau, coupée où la maquette la coupe.
 * Rien n'est rédigé ici : c'est du quote, pas de l'invention.
 */
function h1(texte) {
  const m = texte.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? depouille(m[1]) : null;
}
function chapeau(texte) {
  const apres = texte.slice(texte.indexOf('</h1>'));
  const m = apres.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (!m) return null;
  const nu = depouille(m[1]).replace(/\s+/g, ' ').trim();
  const phrase = nu.match(/^.*?[.!?](?:\s|$)/);
  const coupe = phrase ? phrase[0].trim() : nu;
  return coupe.length > 158 ? coupe.slice(0, 155).replace(/[\s,;]+$/, '') + '…' : coupe;
}
function depouille(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// --------------------------------------------------------------------- transformation

const AVERTISSEMENTS = [];

function porter(fichier, table) {
  const brut = readFileSync(join(MAQUETTES, fichier), 'utf8');
  const entree = table.get(fichier);
  if (!entree) return null;

  let texte = brut;

  // 1. échafaudage Claude Design
  const casque = texte.match(/<helmet[^>]*>([\s\S]*?)<\/helmet>/);
  const contenuCasque = casque ? casque[1].trim() : '';
  if (casque) texte = texte.replace(casque[0], '');
  texte = texte.replace(/<\/?x-dc[^>]*>/g, '');
  texte = texte.replace(/<script[^>]+src="\.?\/?support\.js"[^>]*><\/script>/g, '');

  // 2. corps
  const corps = texte.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  if (!corps) throw new Error(fichier + ' : pas de <body>');
  let corpsNu = corps[1].replace(/\s*<\/?x-dc[^>]*>\s*/g, '').trim();

  // 3. liens internes -> permaliens
  const liens = new Map();
  corpsNu = corpsNu.replace(/href="(\.\/)?([^"]+?)\.dc\.html([^"]*)"/g, (tout, _pt, nom, reste) => {
    const source = nom + '.dc.html';
    const cible = table.get(source);
    if (!cible) {
      AVERTISSEMENTS.push(`${fichier} : lien vers « ${source} » sans ligne dans le plan éditorial — supprimé`);
      return 'href="#" data-port-supprime="' + source + '"';
    }
    const route = cheminDeRoute(source, cible.permalien);
    const absolue = route === '404.html' || route === 'index.html' ? '/' : '/' + route.replace(/\/index\.html$/, '/');
    liens.set(source, absolue);
    return `href="${absolue}${reste}"`;
  });

  // 4. assets -> racine servie
  corpsNu = corpsNu.replace(/(href|src)="\.?\/?assets\/([^"]+)"/g, '$1="/$2"');

  // 4bis. aucun lien affilié ne sort du site : les URLs des maquettes sont taguées pour un
  // autre site de Jordane (Thomann « ?offid=1&affid=3711 », Donner via passerelle shareasale).
  // Le nettoyage porte sur l'adresse seulement — le texte du lien reste celui du design.
  let nettoyes = 0, retirer = 0;
  corpsNu = corpsNu.replace(/href="(https?:\/\/[^"]+)"/g, (tout, brut) => {
    const propre = urlPublique(brut.replace(/&amp;/g, '&'));
    if (propre === null) {
      retirer++;
      AVERTISSEMENTS.push(`${fichier} : passerelle de tracking sans destination lisible, lien retiré — ${brut.slice(0, 64)}`);
      return 'href="#" data-lien-retire="passerelle-sans-destination"';
    }
    if (propre !== brut.replace(/&amp;/g, '&')) nettoyes++;
    return `href="${propre.replace(/&/g, '&amp;')}"`;
  });
  if (nettoyes || retirer) {
    AVERTISSEMENTS.push(`${fichier} : ${nettoyes} lien(s) marchand(s) débarrassé(s) de leur traçage${retirer ? ` , ${retirer} retiré(s)` : ''}`);
  }

  // 5. ce qui reste de dynamique dans le corps mérite un regard humain
  for (const m of corpsNu.matchAll(/<script\b(?! src)[^>]*>([\s\S]{0,80})/g)) {
    AVERTISSEMENTS.push(`${fichier} : <script> dans le corps porté — à relire\n      ${m[1].replace(/\s+/g, ' ').slice(0, 72)}`);
  }
  for (const m of corpsNu.matchAll(/sc-for|sc-if|\{\{[^}]*\}\}/g)) {
    AVERTISSEMENTS.push(`${fichier} : directif Claude Design resté dans le corps (${m[0].slice(0, 28)}) — la page n'est plus statique`);
    break;
  }

  // 5bis. les écarts déclarés avec la maquette : voir scripts/greffes.mjs
  const greffe = appliquerGreffes(corpsNu, fichier);
  corpsNu = greffe.corps;
  AVERTISSEMENTS.push(...greffe.notes);

  // 6. head
  const route = cheminDeRoute(fichier, entree.permalien);
  const enPlace = copySeo(route);
  const titre = enPlace.title || h1(corpsNu);
  const description = enPlace.description || chapeau(corpsNu);
  if (!enPlace.title) AVERTISSEMENTS.push(`${fichier} : titre repris du <h1> de la maquette`);
  if (!enPlace.description) AVERTISSEMENTS.push(`${fichier} : description reprise du chapeau de la maquette — à relire`);
  if (!titre) throw new Error(fichier + ' : aucun titre trouvable');

  const casquePort = contenuCasque
    .replace(/<script[^>]+src="\.?\/?support\.js"[^>]*><\/script>/g, '')
    .replace(/(href|src)="\.?\/?assets\/([^"]+)"/g, '$1="/$2"');

  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<meta name="description" content="${description ?? ''}">`,
    // Site ouvert aux moteurs depuis le 13/09 au soir : plus de « noindex, nofollow » sur les
    // pages publiées. La 404 fait exception — pas de permalien, pas de sitemap, servie en statut
    // 404 par Netlify, et le meta évite qu'on l'indexe sur son URL directe.
    route === '404.html' ? '<meta name="robots" content="noindex, nofollow">' : null,
    '<link rel="apple-touch-icon" href="/bipbop-touch-180.png">',
    /^https?:/.test(entree.permalien) ? `<link rel="canonical" href="${entree.permalien}">` : null,
    `<title>${titre}</title>`,
    casquePort,
  ].filter(Boolean).join('\n');

  return {
    route,
    fichier,
    contenu:
      '<!DOCTYPE html>\n<html lang="fr">\n<head>\n' + head + '\n</head>\n<body>\n' + corpsNu + '\n</body>\n</html>\n',
    stats: {
      lignes: corpsNu.split('\n').length,
      liens: liens.size,
      crochets: (corpsNu.match(/\sdata-(rwd|pad|mar|big|sticky|hdr)=/g) || []).length,
      titre,
    },
  };
}

// ------------------------------------------------------------------------- exécution

const table = lirePlan();
const maquettes = readdirSync(MAQUETTES)
  .filter((f) => f.endsWith('.dc.html') && table.has(f) && !EXCLUES.has(f))
  .sort();

const portees = [];
for (const fichier of maquettes) {
  const route = cheminDeRoute(fichier, table.get(fichier).permalien);
  const cible = join(PAGES, route);
  if (NEUF && existsSync(cible)) continue;
  try {
    portees.push(porter(fichier, table));
  } catch (e) {
    AVERTISSEMENTS.push(`${fichier} : ÉCHEC — ${e.message}`);
  }
}

if (!DRY) {
  // les sources remplacées sont archivées hors de src/ pour qu'Astro ne les route plus
  if (!existsSync(SECHE)) mkdirSync(SECHE, { recursive: true });
}

let deplaces = 0;
for (const p of portees) {
  const cible = join(PAGES, p.route);
  if (DRY) {
    afficher(p, cible);
    continue;
  }
  mkdirSync(dirname(cible), { recursive: true });

  // la source Astro qu'elle remplace est archivée hors de src/ (git la garde aussi)
  const astro = sourceAstro(p.route);
  if (astro && astro.startsWith(PAGES + '/')) {
    const seche = join(SECHE, relative(PAGES, astro));
    mkdirSync(dirname(seche), { recursive: true });
    writeFileSync(seche, readFileSync(astro));
    rmSync(astro);
    deplaces++;
  }
  // l'ancien 404 brut, hors BaseLayout, est remplacé par la page portée
  const orphelin = join(PAGES, p.route.replace(/\/index\.html$/, '') + '.html');
  if (p.route !== '404.html' && orphelin !== cible && existsSync(orphelin)) rmSync(orphelin);

  writeFileSync(cible, p.contenu);
  afficher(p, cible);
}

function afficher(p) {
  const route = '/' + p.route.replace(/(^|\/)index\.html$/, '$1');
  console.log(
    `${DRY ? '[dry] ' : '      '}${route}`.padEnd(48) +
      `${String(p.stats.lignes).padStart(4)} l  ${String(p.stats.crochets).padStart(3)} crochets  ${String(p.stats.liens).padStart(2)} liens` +
      (p.stats.titre ? `  ${p.stats.titre.slice(0, 44)}` : '  SANS TITRE')
  );
}

console.log(`\n${portees.length} maquettes portées, ${deplaces} sources Astro déplacées dans design/port-seche/.`);
if (AVERTISSEMENTS.length) {
  console.log(`\n${AVERTISSEMENTS.length} avertissements :`);
  for (const a of [...new Set(AVERTISSEMENTS)]) console.log('  — ' + a);
}
