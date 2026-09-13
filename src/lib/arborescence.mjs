/**
 * L'arborescence publiée du site, écrite une fois pour deux usages : la page « Plan du site »
 * et le sitemap XML (`scripts/sitemap.mjs`).
 *
 * Rien n'est ressaisi ici. Les routes viennent du plan éditorial (`src/data/plan.json`,
 * importé des maquettes), les libellés viennent du `<title>` de la page elle-même. Une page
 * qui change de titre change de libellé toute seule ; un libellé tapé à la main dérive.
 *
 * Le plan fait office de liste d'autorisation : une page qu'il ne connait pas n'entre pas dans
 * le sitemap, parce qu'AGENTS.md interdit d'y faire apparaitre un document interne. Une ligne
 * « Publié » dont la page est absente du build fait échouer la lecture : une URL morte dans un
 * sitemap est le seul bug qu'on ne voit jamais, personne ne clique sur un sitemap.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { PLAN } from '../data/produits.mjs';

/**
 * Racine du dépôt. Pas `import.meta.url` : ce fichier est bundlé par Astro dès qu'une page
 * l'importe, et son URL devient alors `dist/.prerender/chunks/…`, hors du dépôt. On remonte
 * depuis le répertoire courant, qui est celui du paquet avec `astro build` comme avec
 * `node scripts/sitemap.mjs`.
 */
function racineDuDepot() {
  let dossier = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(dossier, 'src', 'pages'))) return dossier;
    const parent = dirname(dossier);
    if (parent === dossier) break;
    dossier = parent;
  }
  throw new Error('src/lib/arborescence.mjs : aucun src/pages trouvé en remontant depuis ' + process.cwd());
}

export const SITE = racineDuDepot();
/** `src/pages` : les fichiers sources, ceux que git peut dater et qu'Astro compile. */
export const PAGES = join(SITE, 'src', 'pages');

/** Le domaine canonical du site : https, sans www (décision SEO du 11/09, `www` redirige en 301). */
export const DOMAINE = 'https://bipbop.eu';

/**
 * Pages écrites à la main, donc sans ligne au plan éditorial : `plan.json` se régénère depuis
 * le dossier Claude Design (`scripts/import-data.mjs`), y inscrire une route serait effacé au
 * prochain import. Même esprit que `SANS_MAQUETTE` de `scripts/fidelite.mjs`.
 */
export const HORS_PLAN = [{ route: '/plan-du-site/', type: 'Institutionnel' }];

/** Les deux pages qui ne sont pas une route indexable. */
const NON_INDEXABLES = new Set(['/404.html']);

/** `/avis/` -> `avis` ; `/` -> ''. */
const chemin = (route) => route.replace(/^\/+|\/+$/g, '');

/**
 * Lignes du plan qui ont une route publique. Un permalien entre parenthèses
 * (« (réponse HTTP 404, non indexée) ») ou vide n'est pas une URL : ça ne se publie pas.
 */
function lignesAuPlan() {
  const lignes = [];
  for (const r of PLAN) {
    if (r.statut !== 'Publié') continue;
    const brut = String(r.permalien ?? '').trim();
    if (!/^https?:\/\//.test(brut)) continue;
    const u = new URL(brut);
    if (u.origin !== DOMAINE) {
      throw new Error(`${r.id} : permalien sur « ${u.origin} » — le canonical du site est ${DOMAINE}, en https et sans www`);
    }
    const c = u.pathname.replace(/\/+$/, '').replace(/^\/+/, '');
    lignes.push({ id: r.id, type: r.type, route: c ? `/${c}/` : '/', permalien: u.origin + u.pathname });
  }
  return lignes;
}

/** Un hub se range dans la section de ce qu'il rassemble, pas dans « le point de départ ». */
const HUB_DANS = { '/avis/': 'Avis', '/guides/': 'Guides' };

/** Type du plan -> section. Une ligne « Publié » dont le type n'est pas là fait échouer la
    lecture : elle disparaîtrait du plan du site et du sitemap sans un bruit. */
const SECTION_DU_TYPE = {
  'Accueil': 'Depart',
  'Page clé': 'Depart',
  'Avis': 'Avis',
  'Duel': 'Duels',
  'Guide': 'Guides',
  'Les bases': 'Bases',
  'Institutionnel': 'Site',
  'Légal': 'Site',
};

/** Les sections, dans l'ordre où elles se lisent. */
const SECTIONS = [
  { cle: 'Depart', titre: 'Le point de départ' },
  { cle: 'Avis', titre: 'Les avis' },
  { cle: 'Duels', titre: 'Les duels' },
  { cle: 'Guides', titre: "Les guides d'achat" },
  { cle: 'Bases', titre: 'Les bases' },
  { cle: 'Site', titre: 'Le site' },
];

/** Section d'une ligne du plan. */
function sectionDe({ type, route }) {
  const cle = type === 'Hub' ? HUB_DANS[route] : SECTION_DU_TYPE[type];
  if (!cle || !SECTIONS.some((s) => s.cle === cle)) {
    throw new Error(`route ${route} : type « ${type} » sans section dans src/lib/arborescence.mjs — compléter SECTION_DU_TYPE ou HUB_DANS`);
  }
  return cle;
}

/** Le fichier qui occupe une route : `index.html` porté, `index.astro` écrit à la main. */
export function fichierPage(dossier, route) {
  const base = chemin(route) ? join(dossier, chemin(route)) : dossier;
  for (const nom of ['index.html', 'index.astro']) {
    if (existsSync(join(base, nom))) return join(base, nom);
  }
  return null;
}

/**
 * Le titre publié d'une page, débarrassé du suffixe « — BipBop ». Deux formes selon la source :
 * la balise `<title>` d'une page portée — le premier du `<head>`, les SVG du corps portent les
 * leurs — ou la prop `title` de `BaseLayout` pour une page écrite en Astro, où le `<title>`
 * n'existe pas encore. C'est la lecture que fait déjà `copySeo` de `scripts/port.mjs`.
 * Les entités se décodent en apostrophe droite : c'est celle que le site publie partout.
 */
export function titrePublie(fichier) {
  const brut = readFileSync(fichier, 'utf8');
  if (fichier.endsWith('.astro')) {
    return ((brut.match(/<(?:BaseLayout|Layout)[^>]*?\btitle="([^"]+)"/s) ?? [, ''])[1]).trim();
  }
  const tete = brut.split('</head>')[0];
  return ((tete.match(/<title>([\s\S]*?)<\/title>/) ?? [, ''])[1])
    .replace(/\s*—\s*BipBop\s*$/, '')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;|’/g, "'")
    .trim();
}

/**
 * Libellé dans le plan du site. Le titre publié d'un avis ou d'un duel est une phrase
 * (« Millenium MPS-150X Mesh : tous les fûts en mesh pour 298 €, où est le piège ? ») : dans
 * une liste de liens, on garde ce qui précède les deux-points, c'est-à-dire le nom du modèle.
 * Les guides et les bases sont déjà des questions, ils restent entiers.
 */
function libelleDe(type, titre) {
  if (type !== 'Avis' && type !== 'Duel') return titre;
  const court = titre.split(/\s+:\s+/)[0].trim();
  return court.length > 2 ? court : titre;
}

/**
 * L'arborescence, lue dans un dossier de pages (`src/pages` pour la page Plan du site,
 * `dist` pour le sitemap XML, qui doit décrire ce qui est réellement construit).
 *
 * Échoue si une ligne publiée du plan n'a pas de page : le sitemap publierait une URL 404.
 */
export function arborescence(dossier = PAGES) {
  const lignes = [...lignesAuPlan(), ...HORS_PLAN];
  const pages = [];
  const absentes = [];

  for (const ligne of lignes) {
    const fichier = fichierPage(dossier, ligne.route);
    if (!fichier) {
      absentes.push(`${ligne.id ?? 'hors plan'} ${ligne.route} : annoncé publié, aucun fichier dans ${relative(SITE, dossier)}`);
      continue;
    }
    const titre = titrePublie(fichier);
    if (!titre) absentes.push(`${ligne.id ?? 'hors plan'} ${ligne.route} : aucun titre trouvable dans ${relative(SITE, fichier)}`);
    pages.push({
      route: ligne.route,
      permalien: ligne.permalien ?? new URL(ligne.route, DOMAINE).href,
      type: ligne.type,
      section: sectionDe(ligne),
      titre,
      libelle: libelleDe(ligne.type, titre),
    });
  }

  if (absentes.length) {
    throw new Error(`arborescence incohérente dans ${relative(SITE, dossier)} :\n  - ${absentes.join('\n  - ')}`);
  }

  const rangees = SECTIONS.map((s) => ({
    ...s,
    // Le hub d'une section se lit en premier, le reste garde l'ordre du plan éditorial
    // (tri stable : seule la différence hub / page déplace quoi que ce soit).
    pages: pages.filter((p) => p.section === s.cle).sort((a, b) => (b.type === 'Hub') - (a.type === 'Hub')),
  })).filter((s) => s.pages.length);

  return { sections: rangees, pages };
}

/**
 * Les pages construites que l'arborescence ne revendique pas. Elles ne sont pas une erreur :
 * un document interne, une page d'erreur, un composant. C'est une liste à lire, pas à publier —
 * elle est là pour qu'une page oubliée dans le plan ne disparaisse pas du sitemap en silence.
 */
export function orphelines(dossier = PAGES, pages) {
  if (!existsSync(dossier)) return [];
  const revendiquees = new Set(pages.map((p) => p.route));
  const trouvees = [];
  const files = [];
  (function marcher(dir) {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (statSync(p).isDirectory()) marcher(p);
      else if (nom.endsWith('.html')) files.push(p);
    }
  })(dossier);
  for (const f of files) {
    const r = relative(dossier, f).replace(/\\/g, '/');
    const route = r === 'index.html' ? '/' : r.endsWith('/index.html') ? '/' + r.slice(0, -'index.html'.length) : '/' + r;
    if (revendiquees.has(route) || NON_INDEXABLES.has(route)) continue;
    trouvees.push(route);
  }
  return trouvees.sort();
}
