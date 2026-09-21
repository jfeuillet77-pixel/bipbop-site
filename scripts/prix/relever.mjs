// Usage : node scripts/prix/relever.mjs [--sans-dispo] [--limite N] [--date AAAA-MM-JJ]
//
// Le relevé du lundi. Il écrit releves/prix-<date>.json et ne décide rien : ce qu'il faut en
// faire est le travail de `rapport.mjs`.
//
// D'où vient chaque chiffre, et pourquoi ce n'est pas la même source pour tout le monde :
//
//   prix Thomann      flux partenaire, 121 références sur 121, zéro requête. Le flux donne
//                     l'ArticleNumber, donc le bundle (qui a son propre article et son propre
//                     slug) ne peut pas être confondu avec le kit : le piège n°2 disparaît.
//   prix Donner       flux Impact, une ligne par variante, avec le stock. On retient la moins
//                     chère EN STOCK, ou la variante épinglée par son SKU dans prix-reperes.json
//                     quand le prix publié est un choix éditorial déjà tranché.
//   prix Woodbrass    aucun flux fourni : lecture du JSON-LD de la page, une par une.
//   disponibilité     Thomann ne la met PAS dans son flux. Elle se lit sur la page, et c'est le
//                     piège n°3 de la procédure — un prix attractif sur une référence épuisée.
//                     Si la page ne répond pas, la dispo est « inconnue », jamais « en stock ».
//   disparitions      une référence Thomann ou Donner absente d'un flux TÉLÉCHARGÉ CE JOUR a
//                     quitté le catalogue. C'est la seule chose qu'un flux dit et qu'une page
//                     ne dit pas : une fiche retirée répond encore souvent HTTP 200.
//
// --sans-dispo saute les 145 lectures de pages (≈ 10 minutes) : utile pour réessayer le reste
// vite, jamais pour un relevé qu'on publie.
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  sleep, money, segmentDe, lirePage, slugThomann, handleDonner,
  lireFluxThomann, lireFluxDonner, prixDonner, semainesDAttente,
  chercherFluxThomann, chercherFluxDonner,
} from './marchands.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const SANS_DISPO = argv.includes('--sans-dispo');
const LIMITE = Number(arg('--limite') ?? Infinity);
const SEUIL = Number(arg('--seuil') ?? 5);          // « en dessous de cinq euros, ne touche à rien »
const DATE = arg('--date') ?? new Date().toISOString().slice(0, 10);
const GARDER = 4;                                    // la procédure demande d'en garder quatre

/** Une seule requête à la fois chez Thomann : deux en parallèle et c'est du 429. */
const LATENCE = { Thomann: 4600, Woodbrass: 1400, 'Donner Music': 1400 };

const lire = async (p) => JSON.parse(await readFile(join(SITE, p), 'utf8'));

/* --------------------------------- les 156 références --------------------------------- */

const base = await lire('src/data/modeles.json');
const accessoires = await lire('src/data/accessoires.json');
const reperes = existsSync(join(SITE, 'design/prix-reperes.json')) ? await lire('design/prix-reperes.json') : {};
/** Les variantes Donner épinglées par une décision éditoriale (clé « marque produit »). */
const EPINGLES = new Map((reperes.accessoires ?? []).filter((a) => a.sku).map((a) => [`${a.marque} ${a.produit}`, String(a.sku)]));

const refs = [
  ...base.modeles.map((m) => ({
    source: 'modeles', id: m.id, nom: m.nom_complet, marchand: m.marchand, url: m.url,
    publie: m.prix, publieTexte: m.prixTexte, segmentPublie: m.segment ?? null,
  })),
  ...accessoires.map((a) => ({
    source: 'accessoires', id: `${a.cat} · ${a.marque} ${a.produit}`, nom: `${a.marque} ${a.produit}`,
    marchand: a.marchand, url: a.url, publie: money(a.prix), publieTexte: a.prix, famille: a.cat,
    sku: EPINGLES.get(`${a.marque} ${a.produit}`) ?? null,
  })),
].filter((r) => r.url).slice(0, LIMITE);

/* ------------------------------------- les deux flux ------------------------------------ */

const FLUX_TH = join(SITE, 'releves/flux/catalogue-thomann.csv');
const FLUX_DO = join(SITE, 'releves/flux/catalogue-donner.tsv');
const slugs = new Set(refs.map((r) => slugThomann(r.url)).filter(Boolean));
const fluxTh = lireFluxThomann(FLUX_TH, slugs);
const fluxDo = lireFluxDonner(FLUX_DO);
const fluxPresent = { Thomann: fluxTh.size > 0, 'Donner Music': fluxDo.size > 0 };
console.log(`  flux : Thomann ${fluxTh.size}/${slugs.size} slugs retrouvés · Donner ${fluxDo.size} fiches`);

for (const r of refs) {
  r.releve = null; r.origine = null; r.dispo = null; r.dispoLisible = ''; r.absenteDuFlux = false; r.disparue = false; r.erreur = null;
  if (/thomann/i.test(r.url)) {
    const f = fluxTh.get(slugThomann(r.url));
    if (f && f.prix !== null) { r.releve = f.prix; r.origine = 'flux'; r.article = f.article; r.nomMarchand = `${f.marque} ${f.modele}`; }
    else if (fluxPresent.Thomann) r.absenteDuFlux = true;
  } else if (/donner/i.test(r.url)) {
    const v = fluxDo.get(handleDonner(r.url));
    const choix = v ? prixDonner(v, r.sku) : null;
    if (choix) {
      r.releve = choix.prix; r.origine = 'flux'; r.nomMarchand = choix.nom;
      r.dispo = choix.enStock ? 'InStock' : 'OutOfStock';
      r.variantes = choix.variantes; r.varianteEpinglee = choix.epingle;
    } else if (fluxPresent['Donner Music']) r.absenteDuFlux = true;
  }
}

/* --------------------- ce que seule la page peut dire : la disponibilité -------------------- */

/**
 * Thomann : la page, uniquement pour la dispo — le prix du flux fait foi, il vient du même
 * marchand et ne dépend pas d'une regex sur du HTML qui bouge.
 * Woodbrass et tout ce que les flux n'ont pas : la page dit le prix ET la dispo.
 */
const aLire = refs.filter((r) => !SANS_DISPO && (r.origine !== 'flux' || /thomann/i.test(r.url) || r.absenteDuFlux));
let faits = 0;
async function file(marchand) {
  for (const r of aLire.filter((x) => x.marchand === marchand)) {
    for (let essai = 1; essai <= 3; essai++) {
      try {
        const lu = await lirePage(r);
        if (r.http === 429 || r.http === 503) { await sleep(20000 * essai); continue; }
        if (lu) {
          r.dispo = lu.availability || r.dispo;
          r.dispoLisible = lu.dispoLisible ?? '';
          if (r.releve === null && lu.price !== null) { r.releve = lu.price; r.origine = 'page'; r.nomMarchand = lu.name; }
          else if (r.origine === 'flux' && lu.price !== null && Math.abs(lu.price - r.releve) >= 0.01) {
            // Le flux et la page ne disent pas la même chose : la page l'emporte, c'est elle
            // que le lecteur voit en cliquant. L'écart est consigné, il dit l'âge du flux.
            r.fluxDisait = r.releve; r.releve = lu.price; r.origine = 'page (flux périmé)';
          }
          break;
        }
        if (r.erreur && r.erreur !== 'prix non lisible dans la page') break;
      } catch (e) {
        r.erreur = String(e.message ?? e).slice(0, 90);
        await sleep(4000 * essai);
      }
    }
    faits++;
    if (faits % 20 === 0) console.log(`  … ${faits}/${aLire.length} pages lues`);
    await sleep(LATENCE[marchand] ?? 2000);
  }
}
if (aLire.length) {
  console.log(`  ${aLire.length} pages à ouvrir pour la disponibilité (≈ ${Math.round(aLire.filter((r) => r.marchand === 'Thomann').length * 4.6 / 60)} min)`);
  await Promise.all(Object.keys(LATENCE).map(file));
}

/* ------------------------------ le verdict des disparitions ------------------------------ */

/**
 * Une absence du flux n'est qu'un soupçon : un marchand retire aussi des fiches de son flux
 * partenaire sans les retirer de son catalogue (offres exclusives, produits en fin de série).
 * Or ce drapeau déclenche l'Aide-Mémoire §04, c'est-à-dire le RETRAIT d'un modèle du site.
 * Il doit donc être confirmé par la page elle-même, et la page confirme de trois façons :
 * elle ne répond plus, elle redirige ailleurs (une fiche morte renvoie souvent 200 sur
 * l'accueil ou sur une page de catégorie), ou elle ne porte plus aucun prix.
 */
for (const r of refs) {
  if (!r.absenteDuFlux) continue;
  if (SANS_DISPO) { r.disparue = true; r.preuve = 'absente du flux (page non vérifiée)'; continue; }
  const memeFiche = (a, b) => {
    try { return new URL(a).pathname.replace(/\/+$/, '') === new URL(b).pathname.replace(/\/+$/, ''); }
    catch { return false; }
  };
  if (r.http && r.http >= 400) { r.disparue = true; r.preuve = `absente du flux, et la page répond HTTP ${r.http}`; }
  else if (r.urlFinale && !memeFiche(r.urlFinale, r.url)) { r.disparue = true; r.preuve = `absente du flux, et la fiche redirige vers ${r.urlFinale}`; }
  else if (r.releve === null) { r.disparue = true; r.preuve = 'absente du flux, et la page ne porte plus aucun prix'; }
  else r.preuve = `absente du flux, mais la page la vend encore à ${r.releve} € — pas un retrait`;

  // Neuf fois sur dix une fiche qui sort d'un flux n'a pas disparu : elle a changé d'adresse.
  // On cherche donc le produit PAR SON NOM dans le catalogue entier avant de laisser conclure à
  // un retrait, qui est la correction éditoriale la plus lourde de l'Aide-Mémoire.
  r.candidats = (/thomann/i.test(r.url) ? chercherFluxThomann(FLUX_TH, r.nom) : chercherFluxDonner(fluxDo, r.nom))
    .filter((c) => !c.bundle && c.url.split('?')[0] !== r.url.split('?')[0]);
}

/* ------------------------------------ écarts et seuils ----------------------------------- */

for (const r of refs) {
  r.ecart = r.releve !== null && r.publie ? Math.round((r.releve - r.publie) * 100) / 100 : null;
  r.pct = r.ecart !== null && r.publie ? Math.round((r.ecart / r.publie) * 1000) / 10 : null;
  r.aTraiter = r.ecart !== null && Math.abs(r.ecart) >= SEUIL;
  r.segmentReleve = r.releve !== null && r.source === 'modeles' ? segmentDe(r.releve) : null;
  r.franchitUnSeuil = !!(r.segmentReleve && r.segmentPublie && r.segmentReleve !== r.segmentPublie);
  r.enRupture = !!(r.dispo && r.dispo !== 'InStock');
  const attente = r.enRupture ? semainesDAttente(r.dispo, r.dispoLisible) : 0;
  // JSON.stringify écrit `null` pour Infinity : « sans date annoncée » se dit en toutes lettres.
  r.semainesDAttente = Number.isFinite(attente) ? attente : null;
  // « Une rupture de plus de deux semaines justifie de basculer le lien » : en deçà, c'est un
  // délai de livraison, et le signaler comme une rupture ferait agir quinze fois pour rien.
  r.ruptureActionnable = r.enRupture && (r.semainesDAttente === null || r.semainesDAttente > 2);
  delete r.sku;
}

const releve = {
  date: DATE,
  seuil: SEUIL,
  sources: {
    Thomann: fluxPresent.Thomann ? 'flux partenaire (prix) + page (disponibilité)' : 'page seule',
    'Donner Music': fluxPresent['Donner Music'] ? 'flux Impact, variantes et stock' : 'page seule',
    Woodbrass: 'page, JSON-LD',
  },
  bilan: {
    controlees: refs.length,
    lues: refs.filter((r) => r.releve !== null).length,
    aTraiter: refs.filter((r) => r.aTraiter).length,
    sousLeSeuil: refs.filter((r) => r.ecart && !r.aTraiter).length,
    franchissements: refs.filter((r) => r.franchitUnSeuil).length,
    ruptures: refs.filter((r) => r.enRupture).length,
    rupturesActionnables: refs.filter((r) => r.ruptureActionnable).length,
    disparues: refs.filter((r) => r.disparue).length,
    illisibles: refs.filter((r) => r.releve === null && !r.disparue).length,
  },
  refs,
};

await mkdir(join(SITE, 'releves'), { recursive: true });
const sortie = join(SITE, 'releves', `prix-${DATE}.json`);
await writeFile(sortie, JSON.stringify(releve, null, 1) + '\n', 'utf8');

// On garde les quatre derniers : c'est ce qui permet de voir qu'un prix baisse depuis trois
// semaines plutôt que de le constater une fois. L'historique publié, lui, ne s'élague pas.
const tous = await readdir(join(SITE, 'releves'));
for (const prefixe of ['prix', 'a-faire']) {
  const anciens = tous.filter((n) => new RegExp(`^${prefixe}-\\d{4}-\\d\\d-\\d\\d\\.json$`).test(n)).sort();
  for (const n of anciens.slice(0, Math.max(0, anciens.length - GARDER))) {
    await unlink(join(SITE, 'releves', n));
    console.log(`  élagué : ${n}`);
  }
}

const b = releve.bilan;
console.log(`  ✓ relevé du ${DATE} : ${b.lues}/${b.controlees} prix lus · ${b.aTraiter} au-dessus du seuil de ${SEUIL} € · ${b.franchissements} franchissement(s) de tranche · ${b.ruptures} rupture(s) · ${b.disparues} disparue(s) · ${b.illisibles} illisible(s)`);
console.log(`  → releves/prix-${DATE}.json`);
