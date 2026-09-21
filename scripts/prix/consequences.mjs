/**
 * consequences.mjs — « cherche l'ancienne valeur sur tout le site avant de conclure ».
 *
 * C'est la méthode de l'Aide-Mémoire §03, faite par machine : un prix qui reste à trois
 * endroits sur six est pire qu'un prix uniformément périmé, parce que le lecteur voit la
 * contradiction. Ce module trouve les six endroits, et surtout il dit lesquels sont une
 * substitution de montant et lesquels sont une phrase à réécrire.
 *
 * La distinction est tout le sujet. « <span>298 €</span> » se remplace sans réfléchir.
 * « Le problème est qu'au même prix, la MPS-150X donne plus » ne se remplace pas : le
 * raisonnement lui-même est devenu faux, et personne ne peut le réécrire avec une regex.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/** Les espaces qu'une maquette met entre le nombre et l'euro, y compris insécables et entités. */
const ESP = '(?:\\s|&nbsp;|&#160;|&#8239;|\\u00a0|\\u202f)*';

/**
 * Le motif d'un montant écrit à la française, sous toutes ses graphies :
 * 1598 → « 1598 € », « 1 598 € », « 1&nbsp;598 € » ; 165.99 → « 165,99 € ».
 * Le garde-fou de gauche et de droite évite de mordre sur 1 309 € en cherchant 309 €.
 */
export function motifMontant(valeur) {
  const entier = Math.trunc(valeur);
  const cents = Math.round((valeur - entier) * 100);
  const milliers = entier >= 1000
    ? `(?:${entier}|${String(entier).slice(0, -3)}${ESP}${String(entier).slice(-3)})`
    : String(entier);
  const decimale = cents ? `[.,]${String(cents).padStart(2, '0')}` : `(?:[.,]00)?`;
  // Quatre regards en arrière : ni collé à un chiffre, ni précédé d'un séparateur de milliers
  // sous l'une de ses quatre graphies. Sans eux, chercher « 309 € » trouve « 1 309 € ».
  const gauche = `(?<![\\d.,])(?<!\\d[ \\u00a0\\u202f])(?<!\\d&nbsp;)(?<!\\d&#160;)`;
  return new RegExp(`${gauche}${milliers}${decimale}${ESP}(?:€|EUR\\b)`, 'gi');
}

/**
 * Les tournures qui font qu'un montant ne se remplace pas tout seul : la phrase tient un
 * raisonnement sur l'écart, pas seulement sur le chiffre. Liste tirée des corrections déjà
 * écrites à la main dans design/port-corrections.json le 17/09.
 */
const COMPARAISONS = [
  /m[êe]me prix/i, /prix identique/i, /au centime pr[èe]s/i, /[àa]\s+\w+\s+euros?\s+pr[èe]s/i,
  /(?:de|en)\s+(?:plus|moins)\b/i, /plus\s+ch[èe]re?/i, /moins\s+ch[èe]re?/i,
  /moins\s+de\s+\d/i, /sous\s+(?:les\s+)?\d/i, /au-?dessus\s+de\s+\d/i, /jusqu'?[àa]\s+\d/i,
  /[ée]cart/i, /diff[ée]rence/i, /\b(?:onze|douze|treize|quatorze|quinze|vingt|trente|quarante|cinquante|soixante|quatre-vingt)/i,
  /budget\s+de\s+\d/i, /pour\s+\d+\s*€?\s+de\s+(?:plus|moins)/i,
];

/** Le texte autour d'une occurrence, nettoyé de ses balises — ce qu'un lecteur lit. */
function phrase(source, index, longueur) {
  const avant = source.slice(Math.max(0, index - 260), index);
  const apres = source.slice(index + longueur, index + longueur + 260);
  const nu = (s) => s.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');
  return (nu(avant) + '⟦' + source.slice(index, index + longueur).replace(/<[^>]*>/g, '') + '⟧' + nu(apres)).trim();
}

const ligneDe = (source, index) => source.slice(0, index).split('\n').length;

/**
 * Toutes les occurrences d'un montant dans un fichier, chacune jugée « mécanique » ou
 * « à réécrire ». Une occurrence dont la phrase porte une comparaison chiffrée est à réécrire,
 * même si le montant y est isolé : c'est la phrase qui devient fausse, pas le nombre.
 */
export function occurrences(chemin, valeur, racine) {
  if (!existsSync(chemin) || statSync(chemin).isDirectory()) return [];
  const source = readFileSync(chemin, 'utf8');
  const out = [];
  for (const m of source.matchAll(motifMontant(valeur))) {
    const ctx = phrase(source, m.index, m[0].length);
    const comparaison = COMPARAISONS.find((r) => r.test(ctx));
    out.push({
      fichier: relative(racine, chemin),
      ligne: ligneDe(source, m.index),
      texte: m[0].replace(/\s+/g, ' '),
      contexte: ctx.length > 300 ? ctx.slice(0, 300) + '…' : ctx,
      mecanique: !comparaison,
      motif: comparaison ? String(comparaison).replace(/^\/|\/i$/g, '') : null,
    });
  }
  return out;
}

/** Les fichiers d'un dossier qui peuvent porter un prix, sans descendre dans node_modules. */
export function fichiersTexte(racine, extensions, exclure = []) {
  const out = [];
  const marcher = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (exclure.some((x) => p.includes(x))) continue;
      if (e.isDirectory()) marcher(p);
      else if (extensions.some((x) => e.name.endsWith(x))) out.push(p);
    }
  };
  if (existsSync(racine)) marcher(racine);
  return out;
}
