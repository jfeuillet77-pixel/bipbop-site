/**
 * fidelite.mjs — compare le texte visible d'une maquette Claude Design à celui de la page du site.
 *
 *   node scripts/fidelite.mjs                          # toutes les pages construites
 *   node scripts/fidelite.mjs /avis/alesis-turbo-mesh/ # une seule route
 *
 * Pourquoi cet outil : la règle absolue du projet est de reproduire les maquettes sans
 * réinventer ni résumer. Les 6 contrôles de fin de séance ne voient pas une section supprimée.
 * Ici chaque segment de phrase de la maquette doit se retrouver dans la page, et l'ordre des
 * segments communs doit être conservé.
 *
 * /comparatif-batterie-electronique/ est exclu par nature : sa page est générée depuis la base, pas depuis la
 * maquette. Seule sa charpente (titre, questions, note de relevé) est comparée, et elle est
 * écrite à la main dans le gabarit — la vérifier à l'œil reste nécessaire.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import plan from '../src/data/plan.json' with { type: 'json' };
import { appliquerGreffes, urlPublique } from './greffes.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const MAQUETTES = join(SITE, '..', 'Claude Design - MàJ');
const DIST = join(SITE, 'dist');
// Pages écrites à la main, sans maquette Claude Design à laquelle les comparer :
// /comparatif-batterie-electronique/ (la seule page dynamique du dossier) et /plan-du-site/ (générée depuis le plan
// éditorial par src/lib/arborescence.mjs).
const SANS_MAQUETTE = new Set(['/comparatif-batterie-electronique', '/plan-du-site', '/suivi-des-prix'].map((r) => r.replace(/\/+$/, '')));

/** Segments de phrase comparables : texte nu, entités décodées, un segment par élément. */
function segments(html) {
  let t = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, ' ')
    .replace(/<title>[\s\S]*?<\/title>|<desc>[\s\S]*?<\/desc>/gi, ' ')
    .replace(/<[^>]+>/g, '\u0000');
  t = t
    .replace(/&nbsp;|&#160;|&#8239;|\u202f/g, ' ')
    .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&rsquo;|&#39;|&apos;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&');
  return t
    .split('\u0000')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 1 && !/^[·•|\-–—:,,.;!?()\s]+$/.test(s));
}

/**
 * Le contenu seul, hors chrome partagé. Dans les maquettes, le bandeau cookies vit dans le
 * <head> (bloc piloté par le helmet) tandis que le site le rend en fin de page : les mêmes
 * textes n'ont pas les mêmes positions, et comparer l'ensemble noierait le signal sous le
 * bruit à chaque page. Le chrome a son propre contrôle dans verif.mjs (navigation, pied,
 * compteurs).
 *
 * Maquette : le contenu commence après le CTA jaune de l'en-tête — sa première occurrence,
 * celle du pied de page venant plus loin. Page : entre <main> et </main>, sans ambiguïté.
 */
const FIN_EN_TETE = ['Trouver ma batterie</a>', 'Par où commencer'];
// Le pied commence à <footer>. « LIENS AFFILI » servait aussi de borne, mais la greffe
// d'affiliation (scripts/greffes.mjs) retire ce texte de la page et pas de la maquette brute où
// l'on cherche la borne : les deux côtés n'étaient plus coupés au même endroit (23/09/2026).
const DEBUT_PIED = ['<footer'];

function aprésEnTete(html, marqueurs) {
  let meilleur = -1, taille = 0;
  for (const m of marqueurs) {
    const p = html.indexOf(m);
    if (p >= 0 && (meilleur < 0 || p < meilleur)) { meilleur = p; taille = m.length; }
  }
  return meilleur < 0 ? 0 : meilleur + taille;
}

function corpsMaquette(html) {
  const d = aprésEnTete(html, FIN_EN_TETE);
  const fins = DEBUT_PIED.map((m) => html.indexOf(m)).filter((p) => p >= 0);
  const f = fins.length ? Math.min(...fins) : html.length;
  let corps = f > d ? html.slice(d, f) : html.slice(d);
  // Le portage applique les corrections après avoir nettoyé les href (étape 4bis de port.mjs).
  // Sans ce même nettoyage ici, une correction dont l'ancre traverse un lien marchand n'est
  // jamais retrouvée par ce script. Les segments comparés sont du texte pur : l'attribut, lui,
  // n'entre nulle part dans la comparaison.
  corps = corps.replace(/href="(https?:\/\/[^"]+)"/g, (tout, brut) => {
    const propre = urlPublique(brut.replace(/&amp;/g, '&'));
    return propre === null ? tout : `href="${propre.replace(/&/g, '&amp;')}"`;
  });
  return corps;
}

function corpsPage(html) {
  // Les pages portées portent leur chrome dans le corps, sans balise <main> : on applique
  // la même borne d'en-tête qu'à la maquette, sinon le menu compterait comme du contenu ajouté.
  const o = html.indexOf('<main');
  const d = o >= 0 ? html.indexOf('>', o) + 1 : aprésEnTete(html, FIN_EN_TETE);
  const coupures = [html.indexOf('</main>', d), ...DEBUT_PIED.map((m) => html.indexOf(m, d)).filter((p) => p >= 0)].filter((p) => p >= 0);
  const f = coupures.length ? Math.min(...coupures) : html.length;
  return f > d ? html.slice(d, f) : html.slice(d);
}

function cueillir(dir, acc = []) {
  for (const nom of readdirSync(dir)) {
    const p = join(dir, nom);
    if (statSync(p).isDirectory()) cueillir(p, acc);
    else if (nom.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** dist/avis/index.html → /avis/ ; dist/index.html → / ; dist/404.html → /404.html */
function routeDe(f) {
  const r = relative(DIST, f).replace(/\\/g, '/');
  if (r === 'index.html') return '/';
  if (r.endsWith('/index.html')) return '/' + r.slice(0, -'index.html'.length);
  return '/' + r;
}

const PAR_RACINE = new Map();
if (existsSync(DIST)) for (const f of cueillir(DIST)) PAR_RACINE.set(routeDe(f), f);
else { console.error('Aucun dist/ — lancer « npm run build » d\'abord.'); process.exit(2); }

/** route publique → fichier maquette, via le plan éditorial (même table que le vérificateur).
    Clés normalisées sans barre oblique finale. Une ligne sans permalien public (document
    interne, composant global) n'a pas de route : elle ne doit surtout pas hériter de « / ». */
const cle = (r) => ('/' + String(r || '').replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/g, '').replace(/^\/+/, '')).toLowerCase();
const PUBLIC = (r) => { const s = String(r ?? '').trim(); return s !== '' && !/^\(.*\)$/.test(s); };
const MAQUETTE_DE = new Map();
for (const r of plan) {
  if (!r.fichier_maquette?.endsWith('.dc.html')) continue;
  const c = PUBLIC(r.permalien) ? cle(r.permalien) : '';
  MAQUETTE_DE.set(c || (PUBLIC(r.slug) ? cle(r.slug) : ''), r.fichier_maquette);
}
MAQUETTE_DE.delete('');                       // lignes internes : aucune route publique
for (const r of plan) {                       // le slug dédouble le permalien : /404 ↔ « réponse HTTP 404 »
  if (!r.fichier_maquette?.endsWith('.dc.html') || !PUBLIC(r.slug)) continue;
  const c = cle(r.slug);
  if (c && !MAQUETTE_DE.has(c)) MAQUETTE_DE.set(c, r.fichier_maquette);
}

const seulement = process.argv.slice(2).filter((a) => a.startsWith('/'));
const resultats = [];

for (const [route, fichier] of PAR_RACINE) {
  if (SANS_MAQUETTE.has(cle(route))) continue;
  const c = cle(route);
  const maquette = MAQUETTE_DE.get(c) || MAQUETTE_DE.get(c.replace(/\.html$/, ''));
  if (!maquette) { resultats.push({ route, faute: 'aucune maquette référencée dans le plan éditorial' }); continue; }
  const chemin = join(MAQUETTES, maquette);
  if (!existsSync(chemin)) { resultats.push({ route, maquette, faute: `maquette absente du dossier : ${maquette}` }); continue; }

  // La maquette est comparée augmentée des greffes déclarées (corrections de prix, liste
  // d'attente du hub) : un écart qu'on a décidé d'avoir ne doit pas compter comme une dérive.
  const greffe = appliquerGreffes(corpsMaquette(readFileSync(chemin, 'utf8')), maquette, { sobre: true });
  const dMaq = segments(greffe.corps);
  const dPage = segments(corpsPage(readFileSync(fichier, 'utf8')));
  const pr = new Map();
  dPage.forEach((s, i) => { if (!pr.has(s)) pr.set(s, i); });

  const manquants = dMaq.filter((s) => !pr.has(s));
  const surplus = dPage.filter((s) => !dMaq.includes(s));
  // Ordre : on ne compare que les segments uniques des deux côtés. Un libellé répété
  // (« € », « Lire la suite → », un prix) porte la même position partout et ne dit rien
  // de l'agencement — il ne produirait que des fausses ruptures.
  const unique = (arr) => { const n = new Map(); arr.forEach((s) => n.set(s, (n.get(s) || 0) + 1)); return n; };
  const uMaq = unique(dMaq), uPage = unique(dPage);
  const pos = dMaq
    .filter((s) => uMaq.get(s) === 1 && uPage.get(s) === 1)
    .map((s) => pr.get(s));
  const files = [], pred = [];
  for (const v of pos) {
    let i = 0, j = files.length;
    while (i < j) { const m = (i + j) >> 1; if (files[m] < v) i = m + 1; else j = m; }
    files[i] = v;
    pred.push(i);
  }
  // Remonte la suite croissante par les prédécesseurs : sans cela, on marque à tort
  // « déplacés » des segments parfaitement à leur place (16 signalés pour 1 réel).
  const dansLIS = new Set();
  for (let k = pos.length - 1, cible = files.length - 1; k >= 0 && cible >= 0; k--) {
    if (pred[k] === cible) { dansLIS.add(k); cible--; }
  }
  const uniques = dMaq.filter((s) => uMaq.get(s) === 1 && uPage.get(s) === 1);
  const deplaces = uniques.filter((_, k) => !dansLIS.has(k));
  const ordre = deplaces.length;

  resultats.push({
    route, maquette,
    score: dMaq.length ? (dMaq.length - manquants.length) / dMaq.length : 1,
    nbMaq: dMaq.length, manquants, surplus, ordre, deplaces,
  });
}

const vus = seulement.length ? resultats.filter((r) => seulement.map(cle).includes(cle(r.route))) : resultats;
const defectueuses = vus.filter((r) => r.faute || r.manquants?.length || r.surplus?.length || r.ordre);

console.log(`\nfidélité maquette → page · ${vus.length} page(s) comparée(s)\n` + '═'.repeat(78));
for (const p of defectueuses.sort((a, b) => (a.score ?? 0) - (b.score ?? 0))) {
  console.log(`\n✗ ${p.route}${p.maquette ? `   (${p.maquette})` : ''}${p.score != null ? `   reprise ${Math.round(p.score * 100)} %` : ''}`);
  if (p.faute) { console.log(`   ${p.faute}`); continue; }
  if (p.manquants.length) {
    console.log(`   ${p.manquants.length} segment(s) de la maquette absents de la page :`);
    for (const m of p.manquants.slice(0, 10)) console.log(`     − ${m.slice(0, 94)}`);
    if (p.manquants.length > 10) console.log(`     … ${p.manquants.length - 10} de plus`);
  }
  if (p.surplus.length) {
    console.log(`   ${p.surplus.length} segment(s) ajouté(s), absents de la maquette :`);
    for (const s of p.surplus.slice(0, 10)) console.log(`     + ${s.slice(0, 94)}`);
    if (p.surplus.length > 10) console.log(`     … ${p.surplus.length - 10} de plus`);
  }
  if (p.ordre) {
    console.log(`   ${p.ordre} segment(s) uniques placés dans un ordre différent de la maquette :`);
    for (const d of p.deplaces.slice(0, 8)) console.log(`     ↕ ${d.slice(0, 94)}`);
  }
}
console.log(`\n${'═'.repeat(78)}`);
console.log(defectueuses.length
  ? `✗ ${defectueuses.length} page(s) s'écartent de leur maquette — ${vus.length - defectueuses.length}/${vus.length} identiques\n`
  : `✓ ${vus.length}/${vus.length} pages reproduisent leur maquette au segment près\n`);
process.exit(defectueuses.length ? 1 : 0);
