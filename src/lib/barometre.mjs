/**
 * Les calculs du baromètre des prix (/barometre/ et /barometre/donnees.json), depuis les
 * instantanés quotidiens de src/data/barometre/ (écrits par le workflow extrait-rayon, voir
 * scripts/prix/barometre-instantane.mjs). Aucun chiffre de la page n'est écrit à la main.
 *
 * Le périmètre, qu'il faut pouvoir dire en une phrase sur la page :
 *  - Thomann : les « batteries électroniques complètes » telles que Thomann les classe, HORS LOTS.
 *    Un lot (« Bundle ») est le kit plus un siège, un casque ou des baguettes : le compter ferait
 *    passer le prix d'un pack pour celui d'une batterie (interdit de CLAUDE.md, et 68 des 154
 *    références du 07/10/2026 sont des lots).
 *  - Donner : les fiches produit (pas leurs variantes) qui sont des batteries, pas les tabourets,
 *    enceintes, pupitres ou contrôleurs du même flux. Une même batterie publiée deux fois (une
 *    « offre exclusive ») compte une fois, à son prix le plus bas.
 *  - Le prix barré Donner est MESURÉ (écart au prix demandé), jamais présenté comme un prix.
 *
 * Lu avec fs depuis la racine du dépôt, comme src/lib/arborescence.mjs : la page s'exécute au
 * build dans Node, et scripts/donnees-structurees.mjs relit les mêmes chiffres.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

function racineDuDepot() {
  let dossier = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(dossier, 'src', 'data', 'barometre'))) return dossier;
    const parent = dirname(dossier);
    if (parent === dossier) break;
    dossier = parent;
  }
  throw new Error('src/lib/barometre.mjs : aucun src/data/barometre trouvé en remontant depuis ' + process.cwd());
}

export const DOSSIER = join(racineDuDepot(), 'src', 'data', 'barometre');

/** Les instantanés, du plus ancien au plus récent. */
export function instantanes() {
  return readdirSync(DOSSIER)
    .filter((f) => /^\d{4}-\d\d-\d\d\.json$/.test(f))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(DOSSIER, f), 'utf8')));
}

const LOT = /bundle/i;
const PAS_UNE_BATTERIE = /tabouret|enceinte|table de|pupitre|contr[ôo]leur|si[èe]ge|casque/i;

/** « Donner DED-80 Batterie électronique adaptée… » → « Donner DED-80 ». */
function nomDonner(nom) {
  const net = nom.replace(/【[^】]*】/g, '').trim();
  // « DED-200Max » (fiche « offre exclusive ») s'écrit « DED-200 Max » sur la fiche principale.
  return net.split(/\s+(?:Batteries?\s+[ée]lectr|Kit de batterie|Batterie\s)/i)[0].trim().replace(/(\d)(Max|Pro)\b/, '$1 $2');
}
const cleDonner = (nom) => nomDonner(nom).toLowerCase().replace(/[\s-]+/g, '');

/** Les batteries d'un instantané : { id, marchand, marque, modele, prix, prixBarre? }. */
export function kits(inst) {
  const t = inst.thomann
    .filter(([, , modele, cat]) => cat === 'kit' && !LOT.test(modele))
    .map(([id, marque, modele, , prix]) => ({ id: `t${id}`, marchand: 'Thomann', marque, modele, prix }));
  const parModele = new Map();
  for (const [id, nom, prix, prixBarre, , parent] of inst.donner) {
    if (parent || !/batterie|beat go/i.test(nom) || PAS_UNE_BATTERIE.test(nom) || !prix) continue;
    const cle = cleDonner(nom);
    const deja = parModele.get(cle);
    if (!deja || prix < deja.prix) {
      parModele.set(cle, { id: `d${id}`, marchand: 'Donner', marque: 'Donner', modele: nomDonner(nom).replace(/^Donner\s+/, ''), prix, prixBarre });
    }
  }
  return [...t, ...parModele.values()].filter((k) => typeof k.prix === 'number' && k.prix > 0);
}

export function mediane(valeurs) {
  const v = [...valeurs].sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

const pct = (n, total) => (total ? Math.round((100 * n) / total) : 0);

export const GAMMES = [
  { cle: 'moins-300', libelle: 'Moins de 300 €', min: 0, max: 300 },
  { cle: '300-500', libelle: '300 à 500 €', min: 300, max: 500 },
  { cle: '500-1000', libelle: '500 à 1 000 €', min: 500, max: 1000 },
  { cle: '1000-2000', libelle: '1 000 à 2 000 €', min: 1000, max: 2000 },
  { cle: 'plus-2000', libelle: 'Plus de 2 000 €', min: 2000, max: Infinity },
];

/** Une marque n'a sa médiane affichée qu'avec trois batteries au moins : en dessous, ce n'est pas une médiane. */
export const MIN_MARQUE = 3;

/** Tous les chiffres d'un instantané. */
export function chiffres(inst) {
  const k = kits(inst);
  const prix = k.map((x) => x.prix);
  const marques = [...new Set(k.map((x) => x.marque))];
  const parMarque = marques
    .map((m) => {
      const p = k.filter((x) => x.marque === m).map((x) => x.prix);
      return { marque: m, n: p.length, mediane: mediane(p), min: Math.min(...p), max: Math.max(...p) };
    })
    .sort((a, b) => a.mediane - b.mediane);
  const barres = k
    .filter((x) => x.marchand === 'Donner' && x.prixBarre && x.prixBarre > x.prix)
    .map((x) => ({ modele: x.modele, prix: x.prix, prixBarre: x.prixBarre, ecart: Math.round(100 * (1 - x.prix / x.prixBarre)) }))
    .sort((a, b) => b.ecart - a.ecart);
  const donner = k.filter((x) => x.marchand === 'Donner');
  return {
    date: inst.date,
    n: k.length,
    nThomann: k.filter((x) => x.marchand === 'Thomann').length,
    nDonner: donner.length,
    lotsExclus: inst.thomann.filter(([, , modele, cat]) => cat === 'kit' && LOT.test(modele)).length,
    mediane: Math.round(mediane(prix)),
    min: Math.min(...prix),
    max: Math.max(...prix),
    sous500: { n: prix.filter((p) => p < 500).length, pct: pct(prix.filter((p) => p < 500).length, prix.length) },
    marques: marques.length,
    gammes: GAMMES.map((g) => {
      const n = prix.filter((p) => p >= g.min && p < g.max).length;
      return { cle: g.cle, libelle: g.libelle, n, pct: pct(n, prix.length) };
    }),
    parMarque: parMarque.filter((m) => m.n >= MIN_MARQUE),
    petitesMarques: parMarque.filter((m) => m.n < MIN_MARQUE),
    barres,
    barresDonner: { n: barres.length, sur: donner.length, ecartMedian: barres.length ? Math.round(mediane(barres.map((b) => b.ecart))) : null },
  };
}

/**
 * Évolution à références constantes (le `constantPanel` du baromètre de Skoqo) : pour chaque
 * date, la médiane des seules batteries présentes à TOUTES les dates comparées. Sans ça, une
 * entrée ou une sortie de catalogue ferait bouger la médiane sans qu'aucun prix n'ait changé.
 * null tant qu'il n'y a pas deux dates.
 */
export function evolution(liste = instantanes()) {
  if (liste.length < 2) return null;
  const parDate = liste.map((inst) => ({ date: inst.date, kits: new Map(kits(inst).map((x) => [x.id, x.prix])) }));
  const communs = [...parDate[0].kits.keys()].filter((id) => parDate.every((d) => d.kits.has(id)));
  let precedent = null;
  const points = parDate.map((d) => {
    const p = communs.map((id) => d.kits.get(id));
    const changes = precedent ? communs.filter((id) => precedent.kits.get(id) !== d.kits.get(id)) : [];
    const baisses = precedent ? changes.filter((id) => d.kits.get(id) < precedent.kits.get(id)).length : 0;
    precedent = d;
    return { date: d.date, mediane: Math.round(mediane(p)), changes: changes.length, baisses, hausses: changes.length - baisses };
  });
  return { references: communs.length, depuis: liste[0].date, points };
}

/** Ce que sert /barometre/donnees.json : le dernier état complet, et la série. */
export function donnees() {
  const liste = instantanes();
  const dernier = liste.at(-1);
  return {
    source: 'Baromètre BipBop des prix des batteries électroniques',
    url: 'https://bipbop.eu/barometre/',
    methode: 'Rayon batterie électronique de Thomann (batteries complètes hors lots) et de Donner (fiches batterie), relevé chaque jour par les flux des deux marchands. Médianes en euros TTC, arrondies à l’euro.',
    premiereDate: liste[0]?.date ?? null,
    derniereDate: dernier?.date ?? null,
    chiffres: dernier ? chiffres(dernier) : null,
    evolution: evolution(liste),
    serie: liste.map((inst) => {
      const c = chiffres(inst);
      return { date: c.date, batteries: c.n, mediane: c.mediane, sous500: c.sous500.pct };
    }),
    batteries: dernier ? kits(dernier).map(({ id, marchand, marque, modele, prix }) => ({ id, marchand, marque, modele, prix })) : [],
  };
}
