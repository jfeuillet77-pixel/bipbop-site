/**
 * Les greffes : ce qu'on publie diffère de la maquette, et c'est écrit quelque part.
 *
 * Un portage (`scripts/port.mjs`) recopie la maquette mot pour mot. Là où le texte de la
 * maquette est faux ou incomplet, la modification ne se tape pas dans la page générée — elle
 * est ici, déterministe, et rejouée à chaque portage. Le contrôle de fidélité
 * (`scripts/fidelite.mjs`) applique les mêmes greffes à la maquette avant de comparer : un
 * écart qu'il reste à dire est un vrai écart, une correction déclarée n'en est pas un.
 *
 * Deux sortes de greffes :
 *  - `design/port-corrections.json`  une chaîne remplacée par une autre, avec sa raison ;
 *  - `design/liste-attente-avis.csv` le tableau « en préparation » du hub Avis, reconstruit
 *    depuis `src/data/modeles.json` — la maquette n'en liste que 14 lignes sur 22.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');

function lireCsv(chemin) {
  const lignes = readFileSync(chemin, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const entetes = lignes[0].split(';');
  return lignes.slice(1).map((l) => {
    const c = l.split(';');
    return Object.fromEntries(entetes.map((e, i) => [e.trim(), (c[i] ?? '').trim()]));
  });
}

/** 219,99 -> « 219,99 € » ; 1198 -> « 1 198 € » avec une espace ordinaire, comme la maquette. */
export function prixFrancais(prix) {
  const decimals = Number.isInteger(prix) ? 0 : 2;
  const nu = prix
    .toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replace(/[\u202F\u00A0]/g, ' ');
  return `${nu} €`;
}

/** Les quatre tranches de prix telles que le hub les écrit. */
export function segmentDe(prix) {
  if (prix < 300) return 'Moins de 300 €';
  if (prix < 500) return '300 à 500 €';
  if (prix < 800) return '500 à 800 €';
  if (prix <= 1600) return '800 à 1600 €';
  throw new Error(`aucun segment pour ${prix} € — les tranches du hub ne couvrent pas ce modèle`);
}

/* -------------------------------- les liens marchands --------------------------------

   BipBop ne publie AUCUN lien affilié : le site n'a pas encore de programme d'affiliation,
   et les liens tagués qui viennent des maquettes appartiennent à un autre site de Jordane
   (`?offid=1&affid=3711` sur 126 URLs Thomann, la passerelle shareasale
   `donnnermusic.sjv.io/c/6882776/...` pour Donner). Publiés tels quels, ils enverraient
   les clics — et les commissions — sur ce compte-là.

   Les maquettes restent la source du texte ; seule l'adresse de destination est nettoyée,
   le contenu ne change pas d'un caractère. La règle est écrite ici parce qu'elle doit
   tenir au portage suivant : effacée de la page, elle y reviendrait avec la maquette.      */

/** Paramètres de traçage, où qu'ils soient. */
const PARAMS_DE_TRAÇAGE = /^(affid|offid|at|a_aid|pubref|irclickid|intsrc|sPartner|utm_.+|gclid|fbclid|msclkid)$/i;

/** Domaines qui ne sont pas le marchand mais une passerelle de tracking. */
const PASSERELLES = [/(^|\.)sjv\.io$/i, /(^|\.)shareasale\.com$/i, /(^|\.)anrdoezrs\.net$/i, /(^|\.)linksynergy\.com$/i, /(^|\.)awin1\.com$/i, /(^|\.)refer\d?\.com$/i, /(^|\.)dpbolvw\.net$/i];

/**
 * L'adresse publique d'un lien marchand : sans traçage, et hors passerelle si possible.
 * Renvoie `null` quand la passerelle ne dit pas où elle mène — dans ce cas le lien ne
 * part pas, plutôt que de publier un traquant dont on ignore la destination.
 */
export function urlPublique(brute) {
  let url;
  try { url = new URL(brute); } catch { return brute; }          // mailto:, #ancre, chemin relatif…
  if (PASSERELLES.some((r) => r.test(url.hostname))) {
    const cible = url.searchParams.get('u') || url.searchParams.get('url') || url.searchParams.get('target');
    if (!cible) return null;
    try { return urlPublique(decodeURIComponent(cible)); } catch { return urlPublique(cible); }
  }
  let touchée = false;
  for (const p of [...url.searchParams.keys()]) {
    if (PARAMS_DE_TRAÇAGE.test(p)) { url.searchParams.delete(p); touchée = true; }
  }
  if (!touchée) return brute;
  const reste = url.searchParams.toString();
  return url.origin + url.pathname + (reste ? `?${reste}` : '') + url.hash;
}

/** 1. Les remplacements déclarés. `au` introuvable est une erreur, pas un silence. */
export function appliquerCorrections(corps, fichier, { sobre = false } = {}) {
  const notes = [];
  const Corrections = JSON.parse(readFileSync(join(SITE, 'design', 'port-corrections.json'), 'utf8')).corrections ?? [];
  for (const c of Corrections) {
    if (c.fichier !== fichier) continue;
    const occurrences = corps.split(c.au).length - 1;
    if (occurrences === 0) {
      throw new Error(`la correction « ${c.au} » ne trouve plus son texte dans ${fichier} — la maquette a bougé, ou la divergence n'a plus lieu d'être : revoir design/port-corrections.json`);
    }
    if (occurrences > 1) {
      throw new Error(`la correction « ${c.au} » trouve ${occurrences} textes dans ${fichier} — elle est trop courte et en toucherait d'autres (un prix qui en mord un autre, un libellé répété)`);
    }
    corps = corps.split(c.au).join(c.remplace);
    if (!sobre) notes.push(`${fichier} : correction appliquée (${c.au} → ${c.remplace}) — ${c.pourquoi}`);
  }
  return { corps, notes };
}

const CHEMIN_LISTE = join(SITE, 'design', 'liste-attente-avis.csv');
const CHEMIN_BASE = join(SITE, 'src', 'data', 'modeles.json');

/**
 * 2. Le tableau « en préparation » du hub Avis, et les deux compteurs qui en découlent.
 *
 * La maquette liste 14 lignes et annonce « 23 AU PROGRAMME » pour 22 modèles sans avis. Les
 * lignes sont reconstruites avec le balisage de la maquette elle-même : seul le contenu change,
 * et prix comme segment viennent de la base, jamais de la saisie.
 */
export function grefferListeAttente(corps, { sobre = false } = {}) {
  const notes = [];
  const base = JSON.parse(readFileSync(CHEMIN_BASE, 'utf8'));
  const Modeles = Array.isArray(base) ? base : base.modeles;
  const parCle = new Map(Modeles.map((m) => [m.nom_complet, m]));
  const sansAvis = Modeles.filter((m) => !m.avis);
  const publies = Modeles.length - sansAvis.length;

  const Liste = lireCsv(CHEMIN_LISTE);
  const oublies = sansAvis.filter((m) => !Liste.some((l) => l.cle === m.nom_complet));
  if (oublies.length) {
    throw new Error(`liste d'attente incomplète : ${oublies.map((m) => m.nom_complet).join(', ')} — la base a un modèle sans avis que le hub ne cite pas`);
  }

  // Le tableau : 1 ligne d'en-tête + les lignes de données, dans l'ordre de la maquette.
  const rangees = [...corps.matchAll(/<div data-rwd="tblrow" style="display:grid;grid-template-columns:minmax\(150px[\s\S]*?<\/div>\n<\/div>/g)];
  if (rangees.length < 3) throw new Error('aucun tableau « en préparation » trouvé dans la maquette — greffe impossible');
  const donnees = rangees.slice(1);
  const fonds = donnees.map((r) => (r[0].match(/background:(#[0-9a-f]{3,6})/) ?? [])[1] ?? '#fff');
  const gabarit = donnees[0][0];

  const cellules = (l, fond) =>
    gabarit
      .replace(/background:#[0-9a-f]{3,6}/, `background:${fond}`)
      .replace(/(<div style="padding:13px 16px;font-weight:600">)[^<]*(<\/div>)/, `$1${l.affiche}$2`)
      .replace(/(<div style="padding:13px 16px;white-space:nowrap">)[^<]*(<\/div>)/, `$1${l.prix}$2`)
      .replace(/(<div style="padding:13px 16px;color:#4a3d31;white-space:nowrap">)[^<]*(<\/div>)/, `$1${l.segment}$2`)
      .replace(/(<div style="padding:13px 16px;color:#4a3d31;font-size:14px">)[^<]*(<\/div>)/, `$1${l.phrase}$2`);

  const lignes = Liste.map((l, i) => {
    const m = parCle.get(l.cle);
    if (!m) throw new Error(`liste-attente-avis.csv : « ${l.cle} » n'est dans src/data/modeles.json`);
    if (m.avis) throw new Error(`liste-attente-avis.csv : « ${l.cle} » a un avis publié, il n'a plus rien à faire dans la liste d'attente`);
    return cellules({ affiche: l.affiche, prix: prixFrancais(m.prix), segment: segmentDe(m.prix), phrase: l.phrase }, fonds[i % fonds.length]);
  });

  const debut = donnees[0].index;
  const fin = donnees[donnees.length - 1].index + donnees[donnees.length - 1][0].length;
  const remplacees = donnees.length;
  corps = corps.slice(0, debut) + lignes.join('\n') + corps.slice(fin);

  const badge = `${publies} AVIS PUBLIÉS · ${sansAvis.length} AU PROGRAMME`;
  if (/\d+ AVIS PUBLIÉS · \d+ AU PROGRAMME/.test(corps)) corps = corps.replace(/\d+ AVIS PUBLIÉS · \d+ AU PROGRAMME/, badge);
  if (/Les \d+ avis en préparation/.test(corps)) corps = corps.replace(/Les \d+ avis en préparation/, `Les ${sansAvis.length} avis en préparation`);

  if (!sobre) {
    const redigees = Liste.filter((l) => l.source === 'rédigée').length;
    notes.push(`Avis.dc.html : liste d'attente portée à ${lignes.length} lignes (${remplacees} dans la maquette), compteurs recalculés depuis la base — ${redigees} phrases rédigées ici, à relire par Jordane`);
  }
  return { corps, notes, lignes: lignes.length };
}

/** Point d'entrée : toutes les greffes qui regardent une maquette, dans un ordre fixe. */
export function appliquerGreffes(corps, fichier, options = {}) {
  const notes = [];
  if (fichier === 'Avis.dc.html') {
    const g = grefferListeAttente(corps, options);
    corps = g.corps;
    notes.push(...g.notes);
  }
  const c = appliquerCorrections(corps, fichier, options);
  return { corps: c.corps, notes: [...notes, ...c.notes] };
}
