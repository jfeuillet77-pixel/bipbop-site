#!/usr/bin/env node
/**
 * verif.mjs — contrôle de fin de séance, automatisé.
 *
 * Implémente les 5 vérifications de « Aide-Memoire-Mises-A-Jour » §06
 * et les 4 étapes de « Brief-Responsive » §05.
 *
 *   npm run build && node scripts/verif.mjs
 *   node scripts/verif.mjs /comparatif-batterie-electronique/ /avis/
 *   LARGEURS=1024,900,768,390 node scripts/verif.mjs
 *
 * Code de sortie 0 si tout passe, 1 sinon. La base de données a toujours raison
 * sur une page : c'est la règle énoncée par le Guide-Du-Projet §02.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELES, ACCESSOIRES, PLAN, nomCourt, prixDe } from '../src/data/produits.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
/** Réglable : permet de passer au crible les maquettes elles-mêmes, pas seulement le site built. */
const DIST = process.env.DIST ? join(SITE, process.env.DIST) : join(SITE, 'dist');
const LARGEURS = (process.env.LARGEURS || '1024,900,768,390').split(',').map(Number);
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const IGNORE = new Set(['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'favicon.ico']);
/** Une ressource n'est pas une page : le contrôle de liens ne doit porter que sur la navigation. */
const RESSOURCE = /(\.css|\.js|\.mjs|\.svg|\.png|\.jpe?g|\.webp|\.gif|\.ico|\.xml|\.txt|\.webmanifest|\.json|\.woff2?)$/i;

/* --------------------------------- collecte --------------------------------- */

function cueillir(dir, acc = []) {
  for (const nom of readdirSync(dir)) {
    const p = join(dir, nom);
    if (IGNORE.has(nom)) continue;
    if (statSync(p).isDirectory()) cueillir(p, acc);
    else if (nom.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** dist/avis/index.html → /avis/ ; dist/index.html → / ; dist/404.html → /404.html */
function route(f) {
  const r = relative(DIST, f).replace(/\\/g, '/');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -'index.html'.length);
  return '/' + r;
}

const fichiers = existsSync(DIST) ? cueillir(DIST) : [];
if (!fichiers.length) {
  console.error(`Aucun HTML dans ${relative(SITE, DIST)} — lancer « npm run build » d'abord.`);
  process.exit(2);
}
const filtre = process.argv.slice(2).filter((a) => a.startsWith('/'));
const pages = filtre.length ? fichiers.filter((f) => filtre.includes(route(f))) : fichiers;
const lu = (f) => readFileSync(f, 'utf8');

const PUBLIEES = new Set();
for (const f of fichiers) { const r = route(f); PUBLIEES.add(r); PUBLIEES.add(r.replace(/\/$/, '') || '/'); }

/* ---------------------------- 1. aucun lien cassé ---------------------------- */

function verifLiens() {
  const casses = [], relatifs = [];
  let total = 0;
  for (const f of pages) {
    const ici = route(f);
    for (const m of lu(f).matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)) {
      const h = m[1].trim();
      if (!h || /^(https?:|mailto:|tel:|data:|\/\/)/.test(h) || RESSOURCE.test(h)) continue;
      total++;
      if (/\.dc\.html$/.test(h)) { casses.push({ ici, h, pourquoi: 'pointe vers une maquette' }); continue; }
      if (h.startsWith('/')) {
        const cible = h.replace(/\/+$/, '') || '/';
        if (!PUBLIEES.has(cible) && !PUBLIEES.has(cible + '/')) casses.push({ ici, h, pourquoi: 'page inexistante' });
      } else relatifs.push({ ici, h });
    }
  }
  return { total, casses, relatifs };
}

/* ------------------------- 2. les compteurs sont vrais ------------------------ */

const sansBalises = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;|\u202f/g, ' ')
  .replace(/\s+/g, ' ');

const publies = (gabarit) => PLAN.filter((r) => r.gabarit === gabarit && r.statut === 'Publié').length;
const NB_AVIS = MODELES.filter((m) => m.avis).length;
const NB_SANS_AVIS = MODELES.length - NB_AVIS;

/**
 * `src/data/avis.json` est la liste des routes d'avis que le comparatif a le droit de lier
 * (libellé « L'avis → » plutôt que « Le prix → »). Elle se reconstruit au build en parcourant
 * `src/pages/avis/` : si ce parcours ne reconnaît plus le format des pages, la liste se vide
 * sans que la page change d'aspect — et le comparatif cesse de relier les 9 avis qui existent.
 */
const AVIS_SUR_DISQUE = (() => {
  const dossier = join(SITE, 'src', 'pages', 'avis');
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier, { withFileTypes: true })
    .filter((e) => e.isDirectory() && ['index.astro', 'index.html'].some((n) => existsSync(join(dossier, e.name, n))))
    .map((e) => `/avis/${e.name}/`);
})();
const NB_GUIDES = publies('Guide');
const NB_ARTICLES = publies('Article informationnel');

function verifCompteurs() {
  const anomalies = [];
  const reconnus = JSON.parse(readFileSync(join(SITE, 'src', 'data', 'avis.json'), 'utf8'));
  if (reconnus.length !== AVIS_SUR_DISQUE.length) {
    anomalies.push({ ici: 'src/data/avis.json', quoi: 'routes que le comparatif a le droit de lier', annonce: `${reconnus.length}`, attendu: `${AVIS_SUR_DISQUE.length} dossiers d’avis sur le disque` });
  }
  const reference = (t) => {
    const m = t.match(/(\d+)\s+AVIS PUBL/i); return m ? +m[1] : null;
  };
  for (const f of pages) {
    const ici = route(f), html = lu(f), t = sansBalises(html);
    const guette = (regex, attendu, quoi) => {
      for (const m of t.matchAll(regex)) {
        if (+m[1] !== attendu) anomalies.push({ ici, quoi, annonce: m[0].trim(), attendu });
      }
    };
    guette(/(\d+)\s+AVIS PUBLI/gi, NB_AVIS, 'badge avis publiés');
    guette(/(\d+)\s+AU PROGRAMME/gi, NB_SANS_AVIS, 'avis au programme');
    guette(/(\d+)\s+GUIDES?(?: ET \d+ ARTICLE| ET \d+ ARTICLES)? PUBLI/gi, NB_GUIDES, 'guides publiés');
    guette(/ET (\d+) ARTICLES? PUBLI/gi, NB_ARTICLES, 'articles publiés');
    guette(/(\d+)\s+MOD[EÈ]LES SUIVIS/gi, MODELES.length, 'modèles suivis');
    guette(/(\d+)\s+ACCESSOIRES/gi, ACCESSOIRES.length, 'accessoires');

    // intitulé de la liste d'attente vs lignes réellement affichées
    const att = t.match(/les\s+(\d+)\s+avis en préparation/i);
    if (att) {
      const i = html.search(/en préparation/i);
      // La ligne d'en-tête porte le même crochet que les lignes de données : on la retire.
      const rangees = (html.slice(i).match(/<div data-rwd="tblrow"[\s\S]*?<\/div>\n<\/div>/g) || [])
        .filter((r) => !/>Mod<\/|>Modèle</.test(r));
      const lignes = rangees.length;
      if (lignes && +att[1] !== lignes) anomalies.push({ ici, quoi: 'liste d’attente', annonce: `${att[1]} annoncés`, attendu: `${lignes} lignes` });
    }
    if (att && +att[1] !== NB_SANS_AVIS) anomalies.push({ ici, quoi: 'liste d’attente', annonce: `${att[1]} annoncés`, attendu: `${NB_SANS_AVIS} modèles sans avis` });
    // écart entre deux compteurs d'une même page
    const a = t.match(/(\d+)\s+GUIDES?\b/i), b = t.match(/(\d+)\s+GUIDES? PUBLI/i);
    if (a && b && +a[1] !== +b[1] && ici === '/guides/') anomalies.push({ ici, quoi: 'compteurs contradictoires', annonce: `${a[1]} vs ${b[1]}`, attendu: 'identiques' });
  }
  return anomalies;
}

/* --------------------------- 3. aucun prix périmé ---------------------------- */

const ALIAS = [];
for (const m of MODELES) {
  const formes = new Set([`${m.marque} ${m.modele}`, m.modele, nomCourt(m), `${m.marque} ${nomCourt(m)}`]);
  for (const v of formes) if (v && v.length > 4) ALIAS.push({ cle: v.toLowerCase(), m });
}
ALIAS.sort((a, b) => b.cle.length - a.cle.length);
/** Bornes de segment et arrondis de prose : jamais le prix relevé d'un modèle. */
const BORNES = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 2000]);

function verifPrix() {
  const anomalies = new Map();
  for (const f of pages) {
    const ici = route(f), brut = sansBalises(lu(f)), bas = brut.toLowerCase();
    for (const { cle, m } of ALIAS) {
      for (let i = bas.indexOf(cle); i >= 0; i = bas.indexOf(cle, i + 1)) {
        const suite = brut.slice(i + cle.length, i + cle.length + 46);
        const mm = suite.match(/^\s*[·:–-]?\s*(\d{1,5}(?:[ ]?\d{3})*(?:[.,]\d{2})?)\s*€/);
        if (!mm) continue;                       // pas un prix collé au nom : prose, pas une étiquette
        const vu = prixDe(mm[1]);
        if (Math.abs(vu - prixDe(m.prix)) < 0.5) continue;
        // Un prix collé au nom est SON prix, même s'il coïncide avec celui d'un accessoire :
        // l'ancre ci-dessus a déjà écarté la prose comparative (« 111 € de plus, la Nitro Max… »).
        // Sauf si l'accessoire porte ce nom (« Millenium MPS-750X Expansion Pack », 125 €).
        const PorteLeNom = (a) => a.produit.toLowerCase().includes(cle) || a.produit.toLowerCase().includes(cle.replace(`${m.marque.toLowerCase()} `, ''));
        if (ACCESSOIRES.some((a) => PorteLeNom(a) && Math.abs(prixDe(a.prix) - vu) < 0.5)) continue;
        if (BORNES.has(vu)) continue;
        const k = `${ici}|${m.id}|${vu}`;
        if (!anomalies.has(k)) anomalies.set(k, { ici, modele: `${m.marque} ${m.modele}`, attendu: m.prixTexte, trouve: `${mm[1]} €`, contexte: suite.trim().slice(0, 46) });
      }
    }
  }
  return [...anomalies.values()];
}

/* ----------------------- 4. la navigation est partout la même ---------------- */

function verifNav() {
  const signatures = new Map();
  for (const f of pages) {
    // Le crochet responsive porte le même nom dans le CSS (« [data-nav]{…} », en tête de page)
    // et dans le balisage de l'en-tête : on ne retient que l'attribut, pas le sélecteur.
    const html = lu(f);
    const m = html.match(/<(\w+)[^>]*\sdata-nav/);
    const i = m ? html.indexOf(m[0]) : -1;
    let sig;
    if (i < 0) sig = '(aucune navigation marquée data-nav)';
    else {
      const liens = [...html.slice(i, i + 3000).matchAll(/>([^<>]{2,30})<\/a>/g)].map((x) => x[1].trim()).filter(Boolean).slice(0, 4);
      sig = liens.join(' | ');
    }
    if (!signatures.has(sig)) signatures.set(sig, []);
    signatures.get(sig).push(route(f));
  }
  return signatures;
}

/* ----------------- 5. la page tient, mesurée dans un navigateur --------------
   Un serveur HTTP local est indispensable : sous file://, les href absolus
   « /_astro/… » ne résolvent pas, le CSS n'est jamais chargé, et l'on mesurerait
   une page sans aucun de ses styles. */

import { createServer } from 'node:http';

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2' };

function servirDist() {
  const serveur = createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let cible = join(DIST, url);
    if (existsSync(cible) && statSync(cible).isDirectory()) cible = join(cible, 'index.html');
    if (!existsSync(cible) && existsSync(cible + '.html')) cible += '.html';
    if (!existsSync(cible) && !cible.endsWith('index.html')) cible = join(DIST, 'index.html');
    res.writeHead(200, { 'content-type': MIME[basename(cible).slice(basename(cible).lastIndexOf('.'))] || 'application/octet-stream' });
    res.end(readFileSync(cible));
  });
  return new Promise((ok) => serveur.listen(0, '127.0.0.1', () => ok({ serveur, port: serveur.address().port })));
}

async function verifResponsive(puppeteer) {
  const { serveur, port } = await servirDist();
  const base = `http://127.0.0.1:${port}`;
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const results = [];
  try {
    for (const f of pages) {
      const page = await browser.newPage();
      const mesures = {};
      try {
        for (const w of LARGEURS) {
          await page.setViewport({ width: w, height: 900 });
          await page.goto(base + route(f), { waitUntil: 'load', timeout: 20000 });
          await page.evaluate(() => document.fonts && document.fonts.ready);
          mesures[w] = await page.evaluate(() => {
            const de = document.documentElement;
            const coupables = [];
            for (const el of document.querySelectorAll('body *')) {
              const r = el.getBoundingClientRect();
              if (r.width > de.clientWidth + 1 && r.right > de.clientWidth + 1) {
                coupables.push({
                  tag: el.tagName.toLowerCase(),
                  rwd: el.getAttribute('data-rwd') || el.parentElement?.getAttribute?.('data-rwd') || '-',
                  cls: String(el.className || '').slice(0, 24),
                  largeur: Math.round(r.width),
                  texte: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 36),
                });
                if (coupables.length >= 3) break;
              }
            }
            return { scroll: de.scrollWidth, client: de.clientWidth, sonde: getComputedStyle(de).getPropertyValue('--rwd').trim(), css: document.styleSheets.length, coupables };
          });
        }
      } finally { await page.close(); }

      const defauts = [];
      for (const w of LARGEURS) {
        const m = mesures[w];
        if (!m) continue;
        if (m.scroll > m.client + 1) defauts.push(`${w}px : largeur de défilement ${m.scroll} > fenêtre ${m.client}`);
        const attendu = w <= 1080 ? 'on' : '';
        if (m.sonde !== attendu) defauts.push(`${w}px : sonde --rwd = «${m.sonde || 'off'}», attendu «${attendu || 'off'}»`);
      }
      results.push({ page: route(f), mesures, defauts });
    }
  } finally {
    await browser.close();
    serveur.close();
  }
  return results;
}

/* ----------------------------------- rendu ---------------------------------- */

const titre = (n, s) => console.log(`\n${n}. ${s} — `);
const L = '═'.repeat(78);
console.log(`\ncontrôle de fin de séance · ${pages.length} page(s) · largeurs ${LARGEURS.join(' / ')} px\n${L}`);

const liens = verifLiens();
titre(1, `LIENS (${liens.total} internes)`);
console.log(liens.casses.length ? `${liens.casses.length} CASSÉ(S)` : 'ras');
for (const c of liens.casses.slice(0, 30)) console.log(`   ✗ ${c.ici} → ${c.h}  [${c.pourquoi}]`);
if (liens.relatifs.length) console.log(`   ! ${liens.relatifs.length} lien(s) relatif(s) non résolus : ${[...new Set(liens.relatifs.map((r) => r.h))].slice(0, 6).join(', ')}`);

const compteurs = verifCompteurs();
titre(2, 'COMPTEURS');
console.log(compteurs.length ? `${compteurs.length} INCOHÉRENCE(S)` : 'ras');
for (const c of compteurs) console.log(`   ✗ ${c.ici} : ${c.quoi} — ${c.annonce}, la base dit ${c.attendu}`);

const prix = verifPrix();
titre(3, 'PRIX');
console.log(prix.length ? `${prix.length} DIVERGENCE(S) avec la source` : 'ras');
for (const p of prix) console.log(`   ✗ ${p.ici} : ${p.modele} — ${p.trouve} sur la page, ${p.attendu} en source  «${p.contexte}»`);

const nav = verifNav();
titre(4, 'NAVIGATION');
const majorite = [...nav.entries()].sort((a, b) => b[1].length - a[1].length)[0];
console.log(nav.size === 1 ? 'identique partout : ' + majorite[0] : `${nav.size} VARIANTES`);
for (const [sig, pgs] of nav) console.log(`   ${sig === majorite[0] ? '✓' : '✗'} ${String(pgs.length).padStart(3)}p  ${sig}${sig === majorite[0] ? '' : '\n        → ' + pgs.join(', ')}`);

let responsive = [];
try {
  const puppeteer = (await import('puppeteer-core')).default;
  responsive = await verifResponsive(puppeteer);
  const cassees = responsive.filter((r) => r.defauts.length);
  titre(5, 'RESPONSIVE (mesuré)');
  console.log(cassees.length ? `${cassees.length} PAGE(S) CASSÉE(S) sur ${responsive.length}` : `ras sur ${responsive.length} page(s)`);
  for (const r of cassees) {
    console.log(`   ✗ ${r.page}`);
    for (const d of r.defauts) console.log(`        ${d}`);
    for (const w of LARGEURS) for (const c of (r.mesures[w]?.coupables || [])) console.log(`        ${w}px → <${c.tag} data-rwd=${c.rwd}> ${c.largeur}px  «${c.texte}»`);
  }
} catch (e) {
  titre(5, 'RESPONSIVE');
  console.log(`NON MESURÉ — ${e.message.split('\n')[0]}`);
  console.log('   indique le navigateur : CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"');
}

/* ----- 6. aucune note interne ne sort du dépôt (règle D01) -----
   Le JavaScript bundlé par Astro se télécharge et se lit : une note interne importée
   dans un composant est publiée, même si elle ne s'affiche jamais.
   On ne liste que des marqueurs qui ne correspondent à aucune copie du design :
   « Le plancher de prix » est par exemple la phrase éditoriale publiée du Rookie,
   pas le rôle interne — ces deux-là resteraient des faux positifs. */

const INTERDITS = [
  ['role_editorial', 'nom de la colonne interne du guide D01'],
  ['largeur_maquette', 'valeur de design non validée par un marchand'],
  ['Mention comparatif', 'rôle éditorial interne'],
  ['Avis complet ·', 'rôle éditorial interne'],
  ['Avis complet ✓', 'rôle éditorial interne'],
  ['· recommandation principale', 'rôle éditorial interne'],
];

function verifNotesInternes() {
  const fuites = [];
  const parcourir = (dir) => {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (statSync(p).isDirectory()) { parcourir(p); continue; }
      if (!/\.(html|js|css|json|map)$/.test(nom)) continue;
      const txt = readFileSync(p, 'utf8');
      for (const [motif, pourquoi] of INTERDITS) {
        if (txt.includes(motif)) fuites.push({ fichier: relative(DIST, p), motif, pourquoi });
      }
    }
  };
  parcourir(DIST);
  return fuites;
}

const fuites = verifNotesInternes();
titre(6, 'NOTES INTERNES');
console.log(fuites.length ? `${fuites.length} FUITE(S) dans le build` : 'ras — rien d’interne ne sort du dépôt');
for (const f of fuites.slice(0, 12)) console.log(`   ✗ ${f.fichier} contient «${f.motif}» (${f.pourquoi})`);

/* ----- 7. aucun lien affilié ne sort du dépôt -----
   BipBop n'a pas de programme d'affiliation, et les liens des maquettes sont tagués pour un
   autre site de Jordane (`?offid=1&affid=3711` sur 126 URLs Thomann, passerelle shareasale
   `donnnermusic.sjv.io` pour Donner). Le nettoyage se fait au portage et à l'import
   (`urlPublique` dans scripts/greffes.mjs) ; ce contrôle est le filet : une retape, un import
   oublié ou une maquette qui change ne doit pas laisser passer un clic qui partirait en
   commission ailleurs. */

const MARQUEURS_AFFILIES = [
  [/affid=\d+/i, 'paramètre affilié Thomann'],
  [/offid=\d+/i, 'paramètre affilié Thomann'],
  [/\bsjv\.io\b/i, 'passerelle shareasale'],
  [/a_aid=[\w.]+/i, 'paramètre Awin'],
  [/irclickid=/i, 'paramètre Impact'],
  [/utm_(?:source|medium|campaign)=/i, 'paramètre de campagne'],
];

function verifLiensAffilies() {
  const trouvés = [];
  const parcourir = (dir) => {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (statSync(p).isDirectory()) { parcourir(p); continue; }
      if (!/\.(html|js|css|json|map)$/.test(nom)) continue;
      const txt = readFileSync(p, 'utf8');
      for (const [motif, pourquoi] of MARQUEURS_AFFILIES) {
        const n = (txt.match(new RegExp(motif.source, 'gi')) || []).length;
        if (n) trouvés.push({ fichier: relative(DIST, p), pourquoi, n });
      }
    }
  };
  parcourir(DIST);
  return trouvés;
}

const affilies = verifLiensAffilies();
titre(7, 'LIENS AFFILIÉS');
console.log(affilies.length ? `${affilies.length} MARQUEUR(S) DE TRAÇAGE DANS LE BUILD — aucun lien affilié ne se publie` : 'ras — aucun lien traquant dans les 38 routes ni dans la base');
for (const a of affilies.slice(0, 12)) console.log(`   ✗ ${a.fichier} : ${a.n}× ${a.pourquoi}`);

/* 8. Longueurs SEO — la règle du projet : title entre 50 et 60 caractères, meta description
   entre 120 et 155. Une passe de copie retouche des dizaines de metas sans que personne les
   recompte, et aucun des sept contrôles précédents ne regarde leur taille. Constaté le
   18/09/2026 : deux metas réécrites la veille passaient à 165 caractères et partaient
   en production sans un signal. */
/* Les pages légales ne se vendent pas : leur titre est leur nom, et le gonfler à cinquante
   caractères de promesses ne servirait personne. Exception assumée et affichée, pas silencieuse. */
const TITRES_COURTS_ASSUMES = {
  'mentions-legales': 'page légale : le titre est son nom',
  'politique-confidentialite': 'page légale : le titre est son nom',
};

function verifLongueursSeo() {
  const horsFormat = [];
  const exceptions = [];
  const parcourir = (dossier) => {
    for (const e of readdirSync(dossier, { withFileTypes: true })) {
      const p = join(dossier, e.name);
      if (e.isDirectory()) { parcourir(p); continue; }
      if (!e.name.endsWith('.html')) continue;
      const c = readFileSync(p, 'utf8');
      const route = relative(DIST, p).replace(/\\/g, '/').replace(/^\/+/, '').replace(/\/index\.html$/, '') || '/';
      const titre = (c.match(/<title>([^<]*)<\/title>/) ?? [])[1];
      const description = (c.match(/<meta name="description" content="([^"]*)"/) ?? [])[1];
      if (titre === undefined || description === undefined) {
        horsFormat.push({ route, champ: 'absent', attendu: 'title + description', obtenu: '—' });
        continue;
      }
      if (titre.length < 50 || titre.length > 60) {
        const why = TITRES_COURTS_ASSUMES[route];
        if (why) exceptions.push(`${route} (${titre.length}) : ${why}`);
        else horsFormat.push({ route, champ: 'title', attendu: '50-60', obtenu: `${titre.length} · ${titre}` });
      }
      if (description.length < 120 || description.length > 155) horsFormat.push({ route, champ: 'description', attendu: '120-155', obtenu: `${description.length} · ${description.slice(0, 54)}…` });
    }
  };
  parcourir(DIST);
  return { horsFormat, exceptions };
}

const seo = verifLongueursSeo();
titre(8, 'LONGUEURS SEO');
console.log(seo.horsFormat.length ? `${seo.horsFormat.length} COPIE(S) HORS FORMAT — titles 50-60, descriptions 120-155` : 'ras — toutes les routes de copie sont dans les fourchettes');
for (const s of seo.horsFormat.slice(0, 14)) console.log(`   ✗ ${s.route.padEnd(46)} ${s.champ} : attendu ${s.attendu}, obtenu ${s.obtenu}`);
if (seo.exceptions.length) console.log(`   · ${seo.exceptions.length} exception(s) assumée(s) : ${seo.exceptions.join(' · ')}`);

/* 9. Balisage — deux défauts que les huit contrôles précédents laissaient passer, constatés
   le 22/09/2026 sur /guides/ après un signalement de Jordane.

   a) Une balise mal fermée. Un `</div>` en trop après « Par budget » fermait le cadre
      `max-width:1180px` de la page : « Par situation », « Par type de matériel », « Les bases »
      et le pied de page en sortaient — plus de fond crème, plus de largeur maximale, des marges
      comptées sur la fenêtre. Deux autres pages fermaient si mal leur bandeau cookies que le
      pied de page se retrouvait dedans, donc dans un `display:none`.

   b) Une balise bien comptée mais mal placée. Le `</div>` de la grille « Les bases » fermait
      après la troisième carte au lieu de la sixième : autant d'ouvertures que de fermetures,
      donc (a) ne voyait rien, mais les trois dernières cartes sortaient de la grille et
      s'étalaient sur toute la largeur. C'est le défaut que Jordane a vu en second, et c'est
      celui qui demande de regarder la structure, pas le compte.

   Le contrôle est statique : tout le style du site est en ligne dans l'attribut `style`, donc
   « cet élément est une grille » se lit dans le fichier. Pas de navigateur, pas de dépendance
   au poste — le filet tient là où le contrôle 5 s'abstient. */

const BALISES_VIDES = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
/* HTML referme ces balises tout seul (`<p>` devant un bloc, `<li>` devant un `<li>`). Les
   suivre produirait des écarts que le navigateur ne voit jamais : on ne juge que les éléments
   dont l'ouverture et la fermeture sont écrites à la main. */
const BALISES_IMPLICITES = new Set(['p', 'li', 'td', 'th', 'tr', 'thead', 'tbody', 'tfoot', 'colgroup', 'option', 'dt', 'dd']);
/* Le SVG a ses propres règles de fermeture et ses balises homonymes (`<title>`, `<a>`) :
   on saute le sous-arbre entier. Idem pour le contenu de `<script>` et `<style>`, où un
   `<div>` n'est qu'une chaîne de caractères. */
const OPAQUES = new Set(['svg', 'script', 'style']);

const CARTE = (style) => /border-radius:\s*1[0-9]px/.test(style) && /box-shadow:\s*[0-9]/.test(style) && /background:/.test(style);
const GRILLE = (style) => /display:\s*grid/.test(style);

/** Parcourt un HTML et rend { orphelines, ouvertes, racines } — l'arbre sert au volet (b). */
function lireBalisage(html) {
  const JETON = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;
  const orphelines = [];
  const pile = [];
  const racines = [];
  let opaque = null, profondeurOpaque = 0, ligne = 1, curseur = 0, dansBody = false;
  for (const m of html.matchAll(JETON)) {
    ligne += (html.slice(curseur, m.index).match(/\n/g) || []).length;
    curseur = m.index;
    if (m[0].startsWith('<!--')) continue;
    const fermante = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '', auto = m[4] === '/';

    if (opaque) {
      if (tag === opaque) profondeurOpaque += fermante ? -1 : auto ? 0 : 1;
      if (profondeurOpaque <= 0) opaque = null;
      continue;
    }
    if (tag === 'body') { dansBody = !fermante; continue; }
    if (!dansBody) continue;
    if (OPAQUES.has(tag) && !fermante && !auto) { opaque = tag; profondeurOpaque = 1; continue; }
    if (BALISES_VIDES.has(tag) || BALISES_IMPLICITES.has(tag) || auto) continue;

    if (!fermante) {
      const style = (attrs.match(/\sstyle="([^"]*)"/) ?? [])[1] || '';
      const noeud = { tag, style, ligne, enfants: [], parent: pile[pile.length - 1] || null };
      (noeud.parent ? noeud.parent.enfants : racines).push(noeud);
      pile.push(noeud);
    } else {
      const i = pile.map((n) => n.tag).lastIndexOf(tag);
      if (i === -1) orphelines.push({ ligne, tag });
      else pile.splice(i);
    }
  }
  return { orphelines, ouvertes: pile.map((n) => ({ ligne: n.ligne, tag: n.tag })), racines };
}

/** (b) une grille refermée trop tôt laisse ses dernières cartes en frères, pleine largeur. */
function cartesHorsGrille(racines) {
  const sorties = [];
  const visiter = (noeud) => {
    const fratrie = noeud.enfants;
    for (let i = 0; i < fratrie.length; i++) {
      const el = fratrie[i];
      if (GRILLE(el.style) && el.enfants.some((c) => CARTE(c.style))) {
        let n = 0;
        while (i + 1 + n < fratrie.length && CARTE(fratrie[i + 1 + n].style)) n++;
        if (n) sorties.push({ ligne: el.ligne, dedans: el.enfants.filter((c) => CARTE(c.style)).length, dehors: n });
      }
      visiter(el);
    }
  };
  for (const r of racines) visiter({ enfants: [r] });
  return sorties;
}

/* (c) Un guillemet non échappé dans un attribut. Constaté le 22/09/2026 : cinq `alt` portaient
   un nom de produit en pouces — `alt="Millenium 14" Practice Pad"`. Le navigateur referme
   l'attribut sur le pouce, garde `alt="Millenium 14"` et fabrique deux attributs parasites
   (`practice`, `pad"`). Rien ne se voit à l'écran, mais le texte alternatif est tronqué : ce
   qu'entend un lecteur d'écran et ce qu'indexe Google s'arrêtent au milieu du nom. Le contrôle
   relit la zone d'attributs de chaque balise et refuse ce qui ne se découpe pas proprement. */
const ATTRIBUTS_SAINS = /^\s*(?:[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?\s*)*$/;

function attributsMalFormes(html) {
  const mauvais = [];
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)\/?>/g)) {
    const attrs = m[2].replace(/\/$/, '');
    if (ATTRIBUTS_SAINS.test(attrs)) continue;
    mauvais.push({ ligne: html.slice(0, m.index).split('\n').length, tag: m[1], extrait: m[0].replace(/\s+/g, ' ').slice(0, 96) });
  }
  return mauvais;
}

function verifBalisage() {
  const casses = [];
  for (const f of pages) {
    const { orphelines, ouvertes, racines } = lireBalisage(lu(f));
    const defauts = [];
    for (const o of orphelines.slice(0, 4)) defauts.push(`ligne ${o.ligne} : </${o.tag}> ferme une balise qui n'est pas ouverte`);
    for (const o of ouvertes.slice(0, 4)) defauts.push(`ligne ${o.ligne} : <${o.tag}> n'est jamais refermé`);
    for (const s of cartesHorsGrille(racines).slice(0, 4)) defauts.push(`ligne ${s.ligne} : grille refermée trop tôt — ${s.dedans} carte(s) dedans, ${s.dehors} laissée(s) dehors, pleine largeur`);
    for (const a of attributsMalFormes(lu(f)).slice(0, 4)) defauts.push(`ligne ${a.ligne} : attributs de <${a.tag}> mal découpés, guillemet non échappé — ${a.extrait}`);
    if (defauts.length) casses.push({ page: route(f), defauts });
  }
  return casses;
}

const balisage = verifBalisage();
titre(9, 'BALISAGE');
console.log(balisage.length ? `${balisage.length} PAGE(S) MAL FERMÉE(S) sur ${pages.length}` : `ras — ${pages.length} pages se referment comme elles s'ouvrent, aucune carte hors de sa grille, aucun attribut mal découpé`);
for (const b of balisage) {
  console.log(`   ✗ ${b.page}`);
  for (const d of b.defauts) console.log(`        ${d}`);
}

const nbProblemes = liens.casses.length + compteurs.length + prix.length + (nav.size > 1 ? 1 : 0) + responsive.filter((r) => r.defauts.length).length + fuites.length + affilies.length + seo.horsFormat.length + balisage.length;
console.log(`\n${L}`);
console.log(nbProblemes ? `✗ ${nbProblemes} problème(s) à corriger avant publication\n` : '✓ les 9 contrôles de fin de séance sont passés\n');
process.exit(nbProblemes ? 1 : 0);
