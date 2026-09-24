/**
 * jetons.mjs — le rendu des textes rédigés dans src/data/marques.mjs.
 *
 * Un texte n'écrit jamais un prix ni un nom de modèle en dur : il les appelle par jeton, et ce
 * module les résout au build depuis src/data/ (le relevé du lundi tient donc les phrases à jour).
 *
 *   {prix:id} {nom:id} {avis:id}      un modèle : prix relevé, nom complet, nom en lien vers l'avis
 *   {ecart:a-b}                       l'écart de prix entre deux modèles
 *   {acc:alias} {accprix:alias}       un accessoire de ACCESSOIRES_CITES : nom, prix
 *   {budget:id+alias+alias}           un modèle et des accessoires, additionnés
 *   {diff:id-id+alias}                l'écart entre deux budgets (24/09/2026) : « équipement compris »
 *   {n:modeles} {n:avis:Marque}       un compte lu dans la base, en lettres jusqu'à seize ({N:…} : majuscule)
 *   {n:prix:300-500} {n:peaux:mesh}   les modèles d'une fourchette de prix (borne haute exclue), d'un type de peaux
 *   {c:…}                              le même compte, toujours en chiffres (tableaux)
 *   [texte](/route/)  **gras**        lien interne, gras
 *
 * Il échoue sur un modèle ou un accessoire inconnu plutôt que de publier un trou. Il pose aussi
 * les espaces insécables de la règle R03 et l'élision (« l'Alesis », mais « la Yamaha »).
 */
import { execFileSync } from 'node:child_process';
import { MODELES, ACCESSOIRES, RELEVE, prixDe } from '../data/produits.mjs';
import { avisPublie } from './avis-livres.mjs';
import { ACCESSOIRES_CITES } from '../data/marques.mjs';

export const LIEN = 'color:inherit;text-decoration:underline;text-underline-offset:3px';
const PAR_ID = new Map(MODELES.map((m) => [m.id, m]));

/** Même format que prixFrancais() de scripts/greffes.mjs : « 1 598 € », « 499,99 € ». */
export function euros(v) {
  const n = Math.round(v * 100) / 100;
  const d = Number.isInteger(n) ? 0 : 2;
  return n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/[  ]/g, ' ') + ' €';
}
export const prixF = (m) => euros(m.prix);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const nowrap = (s) => `<span style="white-space:nowrap">${s}</span>`;

export function modele(id, ou = '') {
  const m = PAR_ID.get(id);
  if (!m) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : modèle « ${id} » absent de modeles.json`);
  return m;
}
function accessoire(alias, ou) {
  const ref = ACCESSOIRES_CITES[alias];
  const a = ref && ACCESSOIRES.find((x) => x.marque === ref.marque && x.produit === ref.produit);
  if (!a) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : accessoire « ${alias} » absent de la sélection`);
  return { nom: `${a.marque} ${a.produit}`, prix: prixDe(a.prix) };
}

const LETTRES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
/** {n:modeles} {n:marques} {n:modeles:Yamaha} {n:avis} {n:avis:Millenium} : un compte lu dans la
    base, en lettres jusqu'à seize, en chiffres au-delà. {N:…} met une majuscule. */
function compte(expr, ou) {
  const [quoi, marque] = expr.split(':');
  if (quoi === 'prix') {
    const [bas, haut] = (marque ?? '').split('-').map(Number);
    if (!(bas >= 0 && haut > bas)) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : fourchette « ${marque} » illisible`);
    return MODELES.filter((m) => m.prix >= bas && m.prix < haut).length;
  }
  if (quoi === 'peaux') {
    const n = MODELES.filter((m) => m.peaux === marque).length;
    if (!n) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : aucun modèle aux peaux « ${marque} »`);
    return n;
  }
  const ms = marque ? MODELES.filter((m) => m.marque === marque) : MODELES;
  if (marque && !ms.length) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : aucune marque « ${marque} » dans modeles.json`);
  if (quoi === 'modeles') return ms.length;
  if (quoi === 'avis') return ms.filter((m) => avisPublie(m)).length;
  if (quoi === 'marques') return new Set(MODELES.map((m) => m.marque)).size;
  throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : compte « ${expr} » inconnu`);
}
const enLettres = (n) => (n <= 16 ? LETTRES[n] : String(n));

/** Texte à jetons -> HTML. `ou` nomme la page, pour un message d'erreur lisible. */
export function rendre(t, ou = '') {
  const budget = (e) => e.split('+').reduce((s, x) => s + (PAR_ID.has(x) ? modele(x, ou).prix : accessoire(x, ou).prix), 0);
  return t
    .replace(/\b(la|le) \{(avis|nom):([a-z0-9]+)\}/g, (tout, art, k, id) =>
      /^[aeiouéèê]/i.test(modele(id, ou).nom_complet) ? `l'{${k}:${id}}` : tout)
    .replace(/\{n:([a-z]+(?::[A-Za-z0-9-]+)?)\}/g, (_, e) => enLettres(compte(e, ou)))
    .replace(/\{c:([a-z]+(?::[A-Za-z0-9-]+)?)\}/g, (_, e) => String(compte(e, ou)))
    .replace(/\{N:([a-z]+(?::[A-Za-z0-9-]+)?)\}/g, (_, e) => { const t = enLettres(compte(e, ou)); return t[0].toUpperCase() + t.slice(1); })
    .replace(/\{ecart:([a-z0-9]+)-([a-z0-9]+)\}/g, (_, a, c) => nowrap(euros(modele(a, ou).prix - modele(c, ou).prix)))
    .replace(/\{diff:([a-z0-9+]+)-([a-z0-9+]+)\}/g, (_, a, b) => {
      const d = budget(a) - budget(b);
      if (d <= 0) throw new Error(`jetons${ou ? ' (' + ou + ')' : ''} : {diff:${a}-${b}} vaut ${euros(d)}, la phrase qui le cite ne tient plus`);
      return nowrap(euros(d));
    })
    .replace(/\{budget:([a-z0-9+]+)\}/g, (_, e) => nowrap(euros(budget(e))))
    .replace(/\{accprix:([a-z]+)\}/g, (_, a) => nowrap(euros(accessoire(a, ou).prix)))
    .replace(/\{acc:([a-z]+)\}/g, (_, a) => esc(accessoire(a, ou).nom))
    .replace(/\{prix:([a-z0-9]+)\}/g, (_, id) => nowrap(prixF(modele(id, ou))))
    .replace(/\{nom:([a-z0-9]+)\}/g, (_, id) => esc(modele(id, ou).nom_complet))
    .replace(/\{avis:([a-z0-9]+)\}/g, (_, id) => {
      const m = modele(id, ou);
      const r = avisPublie(m);
      return r ? `<a href="${r}" style="${LIEN}">${esc(m.nom_complet)}</a>` : esc(m.nom_complet);
    })
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, (_, txt, href) => `<a href="${href}" style="${LIEN}">${txt}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/ ([:?!;])/g, '&nbsp;$1')
    .replace(/« /g, '«&nbsp;').replace(/ »/g, '&nbsp;»');
}

/** « MIS À JOUR LE » d'une page construite depuis marques.mjs : le plus récent du dernier commit
    du texte et du dernier relevé de prix (règle M01 : la date est vraie). */
export function dateMaj() {
  let git = null;
  try {
    git = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src/data/marques.mjs'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null;
  } catch { /* build hors dépôt : on garde le relevé */ }
  const d = [git, RELEVE].filter(Boolean).sort().at(-1);
  return new Date(d + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
}

/** Pour un title ou une meta description : les mêmes jetons, en texte brut (ni balise ni entité). */
export function rendreTexte(t, ou = '') {
  return rendre(t, ou).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '\u00a0').replace(/&amp;/g, '&').replace(/&lt;/g, '<');
}
