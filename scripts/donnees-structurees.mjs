#!/usr/bin/env node
/**
 * donnees-structurees.mjs — Open Graph, JSON-LD et lien vers le llms.txt dans le `<head>` de chaque page construite,
 * écrits à la fin de chaque build (`postbuild`, après le sitemap et le llms.txt).
 *
 * Pourquoi dans `dist/` et pas dans les pages : 37 pages sur 40 sont portées mot pour mot depuis
 * Claude Design (loi 1), les 3 autres passent par `BaseLayout.astro`. Écrire ce balisage dans les
 * deux, c'était deux copies qui dérivent ; dans une maquette, c'était l'écrasement au portage
 * suivant. Ici, il n'y a qu'un endroit, et il voit toutes les pages telles qu'elles sont publiées.
 *
 * Comme le sitemap et le llms.txt, ce script n'invente rien :
 *  - la liste des pages et leur type viennent de `src/lib/arborescence.mjs` (le plan éditorial),
 *    lu dans `dist/` ;
 *  - titre et description sont ceux que la page publie (`<title>`, `<meta description>`) ;
 *  - la note d'un avis est lue dans la page elle-même (« 8,4 /10 », le verdict affiché), jamais
 *    recopiée : la page change de note, le balisage suit ;
 *  - le prix, la marque, l'image et le marchand d'un modèle viennent de `src/data/modeles.json`,
 *    que le relevé du lundi tient à jour ;
 *  - les dates viennent de git (`datesGit`), comme le `lastmod` du sitemap.
 *
 * Il échoue plutôt que publier un balisage faux : avis sans modèle dans la base, avis sans
 * verdict ou avec deux notes différentes, page sans description, image de partage absente.
 *
 * Idempotent : le bloc est encadré par <!--donnees-structurees--> et remplacé s'il existe.
 *
 *   node scripts/donnees-structurees.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { arborescence, fichierPage, datesGit, SITE, DOMAINE } from '../src/lib/arborescence.mjs';
import { MODELES, RELEVE, prixDe } from '../src/data/produits.mjs';

const DIST = join(SITE, 'dist');
const MARQUE = 'BipBop';
const IMAGE = { chemin: '/bipbop-partage.png', largeur: 1200, hauteur: 630, alt: 'BipBop, la batterie électronique sans jargon' };
const LOGO = { chemin: '/bipbop-touch-180.png', largeur: 180, hauteur: 180 };
const DEBUT = '<!--donnees-structurees-->';
const FIN = '<!--/donnees-structurees-->';

/** Le hub de chaque section, et le nom court qu'il porte dans un fil d'Ariane. Un hub n'entre
    dans le fil que s'il est construit : `/duels/` et `/les-bases/` n'existent pas encore, et un
    fil d'Ariane qui mène à une 404 est pire que pas de fil. Ils y entreront seuls le jour où
    leur ligne du plan passera « Publié ». */
const HUBS = {
  Avis: { route: '/avis/', nom: 'Avis' },
  Guides: { route: '/guides/', nom: "Guides d'achat" },
  Duels: { route: '/duels/', nom: 'Duels' },
  Bases: { route: '/les-bases/', nom: 'Les bases' },
};

/** Les types du plan qui sont des articles datés, et les pages qui ont un type schema.org à elles. */
const ARTICLES = new Set(['Guide', 'Les bases', 'Duel']);
const TYPE_DE_PAGE = { '/a-propos/': 'AboutPage', '/contact/': 'ContactPage' };

if (!existsSync(DIST)) {
  console.error('Aucun dist/ — les données structurées se posent à la fin du build (« npm run build »).');
  process.exit(2);
}
if (!existsSync(join(DIST, IMAGE.chemin))) {
  console.error(`${IMAGE.chemin} absent de dist/ — le régénérer avec « node scripts/image-partage.mjs ».`);
  process.exit(1);
}

const { pages } = arborescence(DIST);
const construites = new Set(pages.map((p) => p.route));
const problemes = [];

/* ------------------------------------------------------------------ lecture des pages */

const ENTITES = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&#039;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>', '&#8217;': '’', '&rsquo;': '’', '&nbsp;': ' ' };
const decoder = (s) => s.replace(/&(?:amp|quot|#0?39|apos|lt|gt|#8217|rsquo|nbsp);/g, (e) => ENTITES[e]);
/** Pour un attribut HTML : on repart du texte décodé, pour ne jamais doubler un `&amp;`. */
const attr = (s) => decoder(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function tete(html) {
  const i = html.indexOf('</head>');
  if (i < 0) return null;
  return html.slice(0, i).replace(new RegExp(`${DEBUT}[\\s\\S]*?${FIN}\\n?`), '');
}

/** La note affichée par un avis : « 8,4<span…>/10</span> ». Toutes les occurrences doivent dire
    la même chose, sinon la page se contredit et on ne choisit pas à sa place. */
function verdict(html, route) {
  const notes = [...html.matchAll(/>(\d{1,2},\d)<span[^>]*>\/10<\/span>/g)].map((m) => m[1]);
  if (!notes.length) { problemes.push(`${route} : aucun verdict « X,X /10 » trouvé dans la page`); return null; }
  if (new Set(notes).size > 1) { problemes.push(`${route} : plusieurs notes différentes (${[...new Set(notes)].join(', ')})`); return null; }
  return Number(notes[0].replace(',', '.'));
}

/* ------------------------------------------------------------------ graphe */

const url = (chemin) => new URL(chemin, DOMAINE).href;
const ORGANISATION = {
  '@type': 'Organization',
  '@id': `${DOMAINE}/#organisation`,
  name: MARQUE,
  url: `${DOMAINE}/`,
  logo: { '@type': 'ImageObject', url: url(LOGO.chemin), width: LOGO.largeur, height: LOGO.hauteur },
};
const REF_ORGANISATION = { '@id': ORGANISATION['@id'] };
const SITE_WEB = {
  '@type': 'WebSite',
  '@id': `${DOMAINE}/#site`,
  name: MARQUE,
  url: `${DOMAINE}/`,
  inLanguage: 'fr-FR',
  publisher: REF_ORGANISATION,
};
const IMAGE_OBJET = { '@type': 'ImageObject', url: url(IMAGE.chemin), width: IMAGE.largeur, height: IMAGE.hauteur };

function filAriane(p) {
  const hub = HUBS[p.section];
  const etapes = [{ nom: 'Accueil', url: `${DOMAINE}/` }];
  if (hub && hub.route !== p.route && construites.has(hub.route)) etapes.push({ nom: hub.nom, url: url(hub.route) });
  etapes.push({ nom: p.libelle, url: p.permalien });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${p.permalien}#ariane`,
    itemListElement: etapes.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nom, item: e.url })),
  };
}

function produit(p, html, titre, dates) {
  const m = MODELES.find((x) => x.avis === p.route);
  if (!m) { problemes.push(`${p.route} : avis publié sans modèle dans src/data/modeles.json (champ « avis »)`); return null; }
  const note = verdict(html, p.route);
  if (note === null) return null;
  return {
    '@type': 'Product',
    '@id': `${p.permalien}#produit`,
    name: m.nom_complet,
    brand: { '@type': 'Brand', name: m.marque },
    ...(m.img ? { image: m.img } : {}),
    offers: {
      '@type': 'Offer',
      price: prixDe(m.prix).toFixed(2),
      priceCurrency: 'EUR',
      url: m.url,
      seller: { '@type': 'Organization', name: m.marchand },
    },
    review: {
      '@type': 'Review',
      name: titre,
      url: p.permalien,
      reviewRating: { '@type': 'Rating', ratingValue: note, bestRating: 10, worstRating: 0 },
      author: REF_ORGANISATION,
      publisher: REF_ORGANISATION,
      ...(dates.publiee ? { datePublished: dates.publiee } : {}),
      ...(dates.modifiee ? { dateModified: dates.modifiee } : {}),
      inLanguage: 'fr-FR',
    },
  };
}

function graphe(p, html, titre, description) {
  const dates = datesGit(p.route);
  const accueil = p.route === '/';
  const hub = p.type === 'Hub';
  const page = {
    '@type': TYPE_DE_PAGE[p.route] ?? (hub ? 'CollectionPage' : 'WebPage'),
    '@id': `${p.permalien}#page`,
    url: p.permalien,
    name: titre,
    description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': SITE_WEB['@id'] },
    primaryImageOfPage: IMAGE_OBJET,
    ...(dates.modifiee ? { dateModified: dates.modifiee } : {}),
    ...(accueil ? {} : { breadcrumb: { '@id': `${p.permalien}#ariane` } }),
  };
  const noeuds = [ORGANISATION, SITE_WEB, page];
  if (!accueil) noeuds.push(filAriane(p));

  if (hub) {
    // Le hub rassemble les pages de sa section, dans l'ordre du plan éditorial.
    const membres = pages.filter((x) => x.section === p.section && x.route !== p.route);
    page.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: membres.length,
      itemListElement: membres.map((x, i) => ({ '@type': 'ListItem', position: i + 1, url: x.permalien, name: x.libelle })),
    };
  }
  if (ARTICLES.has(p.type)) {
    noeuds.push({
      '@type': 'Article',
      '@id': `${p.permalien}#article`,
      headline: titre.slice(0, 110),
      description,
      image: IMAGE_OBJET,
      inLanguage: 'fr-FR',
      author: REF_ORGANISATION,
      publisher: REF_ORGANISATION,
      mainEntityOfPage: { '@id': page['@id'] },
      ...(dates.publiee ? { datePublished: dates.publiee } : {}),
      ...(dates.modifiee ? { dateModified: dates.modifiee } : {}),
    });
  }
  if (p.type === 'Avis') {
    const pr = produit(p, html, titre, dates);
    if (pr) { noeuds.push(pr); page.mainEntity = { '@id': pr['@id'] }; }
  }
  return { '@context': 'https://schema.org', '@graph': noeuds };
}

/* ------------------------------------------------------------------ écriture */

let posees = 0;
for (const p of pages) {
  const fichier = fichierPage(DIST, p.route);
  const html = readFileSync(fichier, 'utf8');
  const t = tete(html);
  if (t === null) { problemes.push(`${p.route} : pas de </head> dans ${relative(SITE, fichier)}`); continue; }
  const description = (t.match(/<meta name="description" content="([^"]*)"/) ?? [])[1];
  if (!description) { problemes.push(`${p.route} : aucune meta description — og:description serait vide`); continue; }

  // Le `<title>` tel que la page le publie, apostrophes courbes comprises : `p.titre` est
  // normalisé pour le plan du site, et un partage doit dire exactement ce que dit l'onglet.
  const titre = decoder((t.match(/<title>([\s\S]*?)<\/title>/) ?? [, p.titre])[1].trim());
  const article = ARTICLES.has(p.type) || p.type === 'Avis';
  const json = JSON.stringify(graphe(p, html, titre, decoder(description)))
    // `</script>` dans une chaîne fermerait la balise : on échappe tous les `<`.
    .replace(/</g, '\\u003c');
  const bloc = [
    DEBUT,
    `<meta property="og:type" content="${article ? 'article' : 'website'}">`,
    `<meta property="og:site_name" content="${MARQUE}">`,
    '<meta property="og:locale" content="fr_FR">',
    `<meta property="og:url" content="${p.permalien}">`,
    `<meta property="og:title" content="${attr(titre)}">`,
    `<meta property="og:description" content="${attr(description)}">`,
    `<meta property="og:image" content="${url(IMAGE.chemin)}">`,
    `<meta property="og:image:width" content="${IMAGE.largeur}">`,
    `<meta property="og:image:height" content="${IMAGE.hauteur}">`,
    `<meta property="og:image:alt" content="${attr(IMAGE.alt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    // Recommandé par llmstxt.org pour qu'un agent trouve le llms.txt depuis n'importe quelle page.
    '<link rel="describedby" href="/llms.txt" type="text/markdown">',
    `<script type="application/ld+json">${json}</script>`,
    FIN,
    '',
  ].join('\n');

  const i = html.indexOf('</head>');
  const avant = html.slice(0, i).replace(new RegExp(`${DEBUT}[\\s\\S]*?${FIN}\\n?`), '');
  writeFileSync(fichier, avant + bloc + html.slice(i));
  posees++;
}

if (problemes.length) {
  console.error('données structurées refusées :');
  for (const p of problemes) console.error('  - ' + p);
  process.exit(1);
}

const avis = pages.filter((p) => p.type === 'Avis').length;
const articles = pages.filter((p) => ARTICLES.has(p.type)).length;
const hubsAbsents = Object.values(HUBS).filter((h) => !construites.has(h.route)).map((h) => h.route);
console.log(`\ndonnées structurées · ${posees} page(s) · ${avis} avis notés (prix du relevé du ${RELEVE}) · ${articles} articles datés`);
if (hubsAbsents.length) console.log(`  fil d'Ariane sans hub pour ${hubsAbsents.join(', ')} : pas encore construits`);
console.log('');
