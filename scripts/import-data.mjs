#!/usr/bin/env node
/**
 * import-data.mjs — importe les fichiers de « Claude Design - MàJ/data/ » dans le site.
 *
 *   node scripts/import-data.mjs
 *
 * Séparateurs différents selon la source (Thomann et sélection : « ; », Donner : tabulation).
 * Toutes les colonnes source sont conservées, y compris celles que le site n'affiche pas.
 * Les champs `avis` des maquettes pointent vers des fichiers .dc.html : ils sont
 * réécrits en routes publiques grâce à la colonne fichier_maquette du plan éditorial.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { urlPublique } from './greffes.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(SITE, '..', 'Claude Design - MàJ', 'data');

/**
 * Les routes d'avis réellement publiées sur ce site. La base en annonce plus que le site n'en
 * contient, et le comparatif ne doit jamais envoyer le lecteur dans une page vide.
 * Une page d'avis est soit une source Astro, soit une page portée depuis une maquette.
 */
function avisPubliciesSurLeSite() {
  const dossier = join(SITE, 'src', 'pages', 'avis');
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier, { withFileTypes: true })
    .filter((e) => e.isDirectory() && ['index.astro', 'index.html'].some((n) => existsSync(join(dossier, e.name, n))))
    .map((e) => `/avis/${e.name}/`)
    .sort();
}

/*
 * « Claude Design - MàJ/ » est une source d'auteur, pas une dépendance de build : il n'est pas
 * dans le dépôt, donc il n'existe pas sur Netlify. Sans lui, les JSON déjà commités dans
 * src/data/ restent tels quels et le build continue. `avis.json` se reconstruit quand même,
 * puisqu'il ne dépend que des pages publiées ici — figer cette liste ferait disparaître les
 * liens « L'avis → » du comparatif sans changer l'aspect d'aucune page.
 */
if (!existsSync(SOURCE)) {
  const liste = avisPubliciesSurLeSite();
  writeFileSync(join(SITE, 'src', 'data', 'avis.json'), JSON.stringify(liste, null, 1) + '\n', 'utf8');
  console.log(`import ignoré — « ${SOURCE} » absent : src/data/ reste tel que committé, avis.json recalculé (${liste.length} routes)`);
  process.exit(0);
}

/* ------------------------------- CSV → objets ------------------------------- */

function parseCsv(txt, delim) {
  const rows = [];
  let row = [], val = '', dans = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (dans) {
      if (c === '"') { if (txt[i + 1] === '"') { val += '"'; i++; } else dans = false; }
      else val += c;
      continue;
    }
    if (c === '"') dans = true;
    else if (c === delim) { row.push(val); val = ''; }
    else if (c === '\n') { row.push(val); rows.push(row); row = []; val = ''; }
    else if (c !== '\r') val += c;
  }
  if (val !== '' || row.length) { row.push(val); rows.push(row); }
  const [hdr, ...body] = rows.filter((r) => r.some((x) => x.trim() !== ''));
  return body.map((r) => Object.fromEntries(hdr.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const lu = (f) => readFileSync(join(SOURCE, f), 'utf8').replace(/^\uFEFF/, '');
const MODE = { ';' : ';', tab: '\t' };

const acc = parseCsv(lu('selection-accessoires.csv'), ';');
const plan = parseCsv(lu('plan-editorial.csv'), ';');
const modeles = JSON.parse(lu('modeles.json'));
const selModeles = parseCsv(lu('selection-modeles.csv'), ';');

/* --------------------- maquette → route publique (du plan) ------------------- */

const ROUTES = new Map();
for (const r of plan) {
  if (!r.fichier_maquette?.endsWith('.dc.html')) continue;
  const p = (r.permalien || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '');
  ROUTES.set(r.fichier_maquette, p === '' ? '/' : '/' + p + '/');
}

let reecrits = 0, inconnus = [];
for (const m of modeles.modeles) {
  if (!m.avis) continue;
  const route = ROUTES.get(m.avis);
  if (route) { m.avis = route; reecrits++; }
  else inconnus.push(`${m.marque} ${m.modele} → ${m.avis}`);
}

/* ------------------------ jointure avec la sélection -------------------------
   Les noms diffèrent entre les deux fichiers (« MPS-150X Mesh » côté base,
   « MPS-150X E-Drum Mesh Set » côté sélection) et aucun id n'est commun : la clé
   est l'URL produit. Elle doit être prise ENTIÈRE : chez Donner, les six modèles
   partagent la même URL d'affiliateur et ne se distinguent que par leur paramètre
   prodsku. Tronquer après le « ? » les collapsait sur une seule ligne et leur donnait
   à tous le segment du même modèle. */

const cleUrl = (u) => String(u || '').replace(/&amp;/g, '&').trim();
const SEL = new Map(selModeles.map((r) => [cleUrl(r.url), r]));
let sansSeg = 0;
for (const m of modeles.modeles) {
  const r = SEL.get(cleUrl(m.url));
  if (r) {
    m.segment = r.seg;
    m.role_editorial = r.role;      // note interne : ne se publie jamais telle quelle
    m.nom_marchand = r.modele;      // libellé commercial long, jamais utilisé en carte
  } else { m.segment = null; m.nom_marchand = null; sansSeg++; }
  m.nom_complet = `${m.marque} ${m.modele}`;
}

/* ---------------------------------- la surcharge du dépôt ----------------------------------
   « Claude Design - MàJ/data/ » est la source d'auteur, mais ses prix sont des instantanés.
   `design/prix-reperes.json` porte les valeurs vérifiées en ligne depuis (`npm run prix`), avec
   leur date et leur preuve : un export plus vieux que le dernier relevé ne peut pas les faire
   revenir tout seul. Le fichier source n'est pas réécrit pour autant, il garde ce que l'auteur y
   a mis. Une entrée qui ne correspond à rien fait échouer l'import — une surcharge orpheline est
   une erreur à corriger, pas un état acceptable. */
const CHEMIN_SURCHARGE = join(SITE, 'design', 'prix-reperes.json');
const SURCHARGE = existsSync(CHEMIN_SURCHARGE) ? JSON.parse(readFileSync(CHEMIN_SURCHARGE, 'utf8')) : null;
const surchargés = { prix: 0, accessoires: 0, retires: 0 };
if (SURCHARGE) {
  // L'en-tête de la base (date de relevé, version) se surcharge aussi : c'est lui que le
  // comparatif et le hub affichent sous leurs tableaux de prix.
  for (const [champ, valeur] of Object.entries(SURCHARGE.base ?? {})) {
    if (champ.startsWith('_')) continue;
    modeles[champ] = valeur;
  }
  for (const e of SURCHARGE.modeles ?? []) {
    const m = modeles.modeles.find((x) => x.id === e.id);
    if (!m) { console.error(`✗ prix-reperes: aucun modèle « ${e.id} » dans la base de l'auteur — surcharge périmée ou identifiants changés.`); process.exit(1); }
    for (const champ of ['prix', 'prixTexte', 'segment']) if (e[champ] !== undefined) m[champ] = e[champ];
    surchargés.prix++;
  }
  for (const e of SURCHARGE.accessoires ?? []) {
    const a = acc.find((x) => x.marque === e.marque && x.produit === e.produit);
    if (!a) { console.error(`✗ prix-reperes: aucune ligne « ${e.marque} ${e.produit} » dans la sélection d'accessoires.`); process.exit(1); }
    for (const champ of ['prix', 'marchand', 'url', 'role']) if (e[champ] !== undefined) a[champ] = e[champ];
    surchargés.accessoires++;
  }
  for (const e of SURCHARGE.retires ?? []) {
    const i = acc.findIndex((x) => x.marque === e.marque && x.produit === e.produit);
    if (i >= 0) { acc.splice(i, 1); surchargés.retires++; }
    else console.log(`  ⚠ prix-reperes: « ${e.marque} ${e.produit} » n'est déjà plus dans la sélection — retrait sans effet`);
  }
}

/* Un segment doit contenir son prix : s'il n'y en a plus 31 sur 31, c'est la
   jointure qui a dérapé et il faut le savoir ici, pas sur une page publiée. */
const BORNES = { 'Moins de 300 €': [0, 300], '300 à 500 €': [300, 500], '500 à 800 €': [500, 800], '800 à 1600 €': [800, 1600] };
const segmentsFaux = modeles.modeles.filter((m) => {
  const b = BORNES[m.segment];
  return b && !(b[0] <= m.prix && m.prix <= b[1]);
});

/* --------------------------------- écritures -------------------------------- */

/**
 * Tout ce qui part dans src/data/ est bundlé dans le JavaScript du navigateur : le bundle
 * se télécharge et se lit. Les notes internes n'y passent donc pas.
 * Règle D01 du guide-agent : « la colonne rôle est une note interne, elle ne se publie
 * jamais telle quelle ». La valeur d'origine de largeur reste dans le fichier source du
 * dossier Claude Design, qui en est la seule copie conservée.
 */
const NOTES_INTERNES = ['role_editorial', 'largeur_maquette'];

/**
 * Le traçage affilié des maquettes ne part pas dans la base publiée : 126 URLs Thomann portent
 * « ?offid=1&affid=3711 » et les Donner passent par une passerelle shareasale, les deux tagués
 * pour un autre site de Jordane. La jointure du dessus se fait sur l'URL brute — chez Donner, les
 * six modèles ne se distinguent QUE par leur paramètre prodsku —, donc on nettoie ici, après.
 */
let liensNettoyes = 0, liensRetires = 0;
const sansTracage = (u) => {
  const brute = String(u || '').replace(/&amp;/g, '&');
  if (!brute.startsWith('http')) return u;
  const propre = urlPublique(brute);
  if (propre === null) {
    liensRetires++;
    console.log(`  ⚠ lien retiré de la base — passerelle de tracking sans destination : ${brute.slice(0, 72)}`);
    return null;
  }
  if (propre !== brute) liensNettoyes++;
  return propre;
};

const modèlePublic = (m) => {
  const { url, ...reste } = Object.fromEntries(Object.entries(m).filter(([k]) => !NOTES_INTERNES.includes(k)));
  return { ...reste, url: sansTracage(url) };
};
const modelesPublic = { ...modeles, modeles: modeles.modeles.map(modèlePublic) };
for (const a of acc) a.url = sansTracage(a.url);

const write = (p, o) => {
  mkdirSync(dirname(join(SITE, p)), { recursive: true });
  writeFileSync(join(SITE, p), JSON.stringify(o, null, 1) + '\n', 'utf8');
};

write('src/data/modeles.json', modelesPublic);
write('src/data/accessoires.json', acc);
write('src/data/plan.json', plan);
// Pas de copie dans public/ : le comparatif importe la base au build.

/* Quels avis sont réellement publiés sur ce site — la base en annonce plus que le site
   n'en contient, et le comparatif ne doit jamais envoyer le lecteur dans une page vide. */
const avisPublicies = avisPubliciesSurLeSite();
write('src/data/avis.json', avisPublicies);

const nbr = (n) => String(n).padStart(3);
console.log(`import terminé
  ${nbr(modeles.modeles.length)} modèles   (relevé ${modeles.releve}, version ${modeles.version})
  ${nbr(acc.length)} accessoires en ${new Set(acc.map((a) => a.cat)).size} familles
  ${nbr(plan.length)} entrées du plan éditorial
  ${nbr(reecrits)} liens d'avis réécrits de .dc.html → route publique
  segments joints : ${modeles.modeles.length - sansSeg}/${modeles.modeles.length}
  liens marchands : ${liensNettoyes} débarrassés de leur traçage, ${liensRetires} retirés (aucun lien affilié ne se publie)
  avis publiés sur ce site : ${avisPublicies.length} (la base en annonce ${reecrits})`);
if (SURCHARGE)
  console.log(`  surcharge du dépôt (design/prix-reperes.json, relevé ${SURCHARGE._releve}) : ${surchargés.prix} modèles, ${surchargés.accessoires} accessoires retouchés, ${surchargés.retires} retirés`);
if (inconnus.length) console.log(`  ⚠ ${inconnus.length} avis sans route connue :\n     ` + inconnus.join('\n     '));
const nonSourc = modeles.modeles.filter((m) => !m.empreinte).length;
console.log(`  empreintes au sol : ${modeles.modeles.length - nonSourc} sourcées, ${nonSourc} à ne surtout pas afficher`);
if (sansSeg) console.log('  ⚠ modèles sans segment joint :', modeles.modeles.filter((m) => !m.segment).map((m) => m.nom_complet).join(', '));
if (segmentsFaux.length) {
  console.log(`\n  ✗ ${segmentsFaux.length} SEGMENT(S) INCOHÉRENTS avec le prix — jointure à corriger, ne pas publier :`);
  for (const m of segmentsFaux) console.log(`     ${m.nom_complet.padEnd(30)} ${m.prixTexte.padStart(9)}  seg=«${m.segment}»`);
  process.exit(1);
}
