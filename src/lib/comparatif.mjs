/**
 * comparatif.mjs — moteur de recommandation de /comparatif/.
 *
 * Portage de la classe DCLogic de « Comparatif.dc.html » (Claude Design, 13 sept. 2026).
 * Les poids du score, les seuils et les formulations traduisent 7 règles de métier
 * que le design a choisies ; ils ne se changent pas sans arbitrage éditorial :
 *
 *   1. plafond de segment = 320 / 530 / 1600 € (le « moins de 500 » monte à 530 €)
 *   2. le mesh prime, le mixte compte à moitié
 *   3. la richesse du module se note sur une échelle 2 à 5
 *   4. dans le même budget, le modèle le plus cher est le mieux équipé
 *   5. un avis rédigé fait foi
 *   6. la discrétion pèse plus lourd que l'encombrement
 *   7. l'alternative est un autre modèle du classement, jamais un produit ajouté
 *
 * Ce module sert à la fois au rendu au build (premier état, sans JS) et au navigateur.
 */
import { MODELES, largeurPourScore, empreinteAffichable } from '../data/produits.mjs';
import { avisPublie } from './avis-livres.mjs';

export const OPTIONS = {
  budget: [['moins300', 'Moins de 300 €'], ['300-500', 'Entre 300 et 500 €'], ['plus500', 'Plus de 500 €']],
  place: [['chambre', 'Dans un coin de chambre'], ['salon', 'Dans le salon'], ['piece', "J'ai une pièce pour ça"]],
  usage: [['apprendre', 'Apprendre sans déranger'], ['morceaux', 'Rejouer mes morceaux'], ['potes', 'Jouer avec des potes']],
};

export const ETAT_INITIAL = { budget: '300-500', place: 'chambre', usage: 'apprendre' };

const PLAFOND = { moins300: 320, '300-500': 530, plus500: 1600 };

const metres = (cm) => (cm / 100).toFixed(2).replace('.', ',') + ' m';

/** Score d'un modèle pour un état donné. null = hors budget, donc écarté. */
export function score(m, etat) {
  const plafond = PLAFOND[etat.budget];
  if (m.prix > plafond) return null;
  let s = 0;
  s += m.peaux === 'mesh' ? 26 : m.peaux === 'mixte' ? 16 : 0;
  s += m.module * 5;
  s += (m.prix / plafond) * 14;
  if (m.avis) s += 4;
  if (etat.place === 'chambre') { s += m.discretion * 7; s += Math.max(0, (130 - largeurPourScore(m)) * 0.4); }
  if (etat.place === 'salon') { s += m.discretion * 5; s += Math.max(0, (140 - largeurPourScore(m)) * 0.2); }
  if (etat.place === 'piece') { s += m.pads * 1.8; s += m.cymbales * 2; }
  if (etat.usage === 'apprendre') { s += m.discretion * 8; s += m.peaux === 'mesh' ? 8 : 0; }
  if (etat.usage === 'morceaux') { s += m.module * 4; s += m.bluetooth ? 12 : 0; }
  if (etat.usage === 'potes') { s += m.pads * 2.2; s += m.module * 3; }
  return s;
}

/** Classement complet : score décroissant, puis prix croissant à score égal. */
export function classement(etat) {
  return MODELES
    .map((m) => ({ m, s: score(m, etat) }))
    .filter((x) => x.s !== null)
    .sort((a, b) => b.s - a.s || a.m.prix - b.m.prix);
}

export function raisonPrincipale(m, etat) {
  const bouts = [];
  if (m.peaux === 'mesh') bouts.push('toutes les peaux sont maillées');
  else if (m.peaux === 'mixte') bouts.push('les fûts sont en mesh');
  if (etat.usage === 'apprendre' && m.discretion >= 5) bouts.push('sa pédale sans batte ne frappe pas le plancher');
  else if (etat.usage === 'apprendre' && m.discretion >= 4) bouts.push('elle reste discrète pour les voisins');
  if (etat.usage === 'morceaux' && m.bluetooth) bouts.push('le Bluetooth envoie ta musique dans le casque sans câble');
  if (etat.usage === 'morceaux' && !m.bluetooth && m.module >= 4) bouts.push('son module tient la route sur les sons');
  if (etat.usage === 'potes') bouts.push(`${m.pads} pads, de quoi tenir un morceau entier`);
  if (etat.place === 'chambre' && m.largeur && m.largeur <= 110) bouts.push(`elle tient dans ${metres(m.largeur)} de large`);
  if (etat.place === 'piece') bouts.push(`tu as la place pour ses ${m.pads} pads`);
  if (!bouts.length) bouts.push("c'est le meilleur équilibre de ta tranche de budget");
  const t = bouts.slice(0, 3);
  return 'Dans ton cas, ' + (t.length > 1 ? t.slice(0, -1).join(', ') + ' et ' + t[t.length - 1] : t[0]) + '.';
}

export function raisonAlternative(m, top, rang) {
  if (m.prix < top.prix - 40) {
    return `Tu économises ${Math.round(top.prix - m.prix)} € en acceptant ${m.peaux === 'mesh' ? 'un module plus simple' : 'des pads en caoutchouc'}.`;
  }
  if (m.discretion > top.discretion) return 'Plus discrète que notre choix principal, si le voisin du dessous est sensible.';
  if (m.pads > top.pads) return `${m.pads} pads au lieu de ${top.pads}, si tu veux le kit le plus fourni.`;
  if (m.bluetooth && !top.bluetooth) return 'Elle ajoute le Bluetooth, pratique pour jouer sur ta playlist.';
  if (m.module > top.module) return 'Son module est plus riche, si les sons comptent pour toi.';
  return rang === 1 ? 'Très proche de notre choix, chez une autre marque.' : 'Une alternative sérieuse si la première est en rupture.';
}

export function sacrifice(top, etat) {
  if (top.peaux === 'caoutchouc') return "Aucune peau maillée sur ce modèle. C'est le premier poste sur lequel les fabricants économisent, et celui qui change le plus le toucher.";
  if (top.peaux === 'mixte') return "La caisse claire et les toms sont en mesh, les cymbales restent en caoutchouc. C'est la norme du segment, mais le ressenti sur les cymbales s'en ressent.";
  if (etat.usage === 'morceaux' && !top.bluetooth) return 'Pas de Bluetooth sur ce modèle : il faudra brancher un câble entre ton téléphone et le module à chaque session.';
  if (etat.usage === 'potes' && top.pads < 9) return `Avec ${top.pads} pads, tu seras un peu juste pour des morceaux qui demandent beaucoup de toms. Un pack d'extension se pose plus tard.`;
  if (etat.place === 'chambre' && top.largeur && top.largeur > 115) return `Elle occupe ${empreinteAffichable(top)} au sol : mesure ton coin de chambre avant de commander.`;
  if (etat.budget === 'moins300') return "Sous 300 €, le module reste basique. Les sons lassent au bout de quelques mois, mais on ne change pas de batterie pour ça : on change de module.";
  return "Rien de rédhibitoire. Le seul poste oublié reste le casque, le tapis et le siège, soit environ 130 € en plus du prix affiché.";
}

/** Les quatre chiffres de la carte. Sans empreinte relevée, on montre les cymbales. */
export function chiffres(m) {
  const peau = m.peaux === 'mesh' ? 'Mesh' : m.peaux === 'mixte' ? 'Mixte' : 'Caoutchouc';
  const mesure = m.empreinte
    ? { valeur: m.empreinte.replace(' x ', ' × '), libelle: 'EMPREINTE AU SOL' }
    : { valeur: String(m.cymbales), libelle: 'CYMBALES' };
  return [
    { valeur: String(m.pads), libelle: 'PADS' },
    { valeur: peau, libelle: 'PEAUX' },
    mesure,
    { valeur: m.bluetooth ? 'Oui' : 'Non', libelle: 'BLUETOOTH' },
  ];
}

/** État complet prêt à afficher, à partir de n'importe quelles réponses. */
export function resultat(etat) {
  const cl = classement(etat);
  const top = cl[0] ? cl[0].m : null;
  return {
    etat,
    aResultat: !!top,
    titreResultat: top ? 'Alors voilà ce que je prendrais' : 'Aucun modèle dans ce budget',
    top: top && {
      ...top,
      // Le lien suit ce qui est publié ; le score, lui, suit l'intention éditoriale de la base.
      avis: avisPublie(top),
      nomComplet: `${top.marque} ${top.modele}`,
      ligneSource: `${top.marque} · ${top.prixTexte} chez ${top.marchand}`.toUpperCase(),
      raison: raisonPrincipale(top, etat),
      sacrifice: sacrifice(top, etat),
      libelleAchat: `Voir chez ${top.marchand}`,
      chiffres: chiffres(top),
    },
    alternatives: cl.slice(1, 3).map(({ m: a }, i) => ({
      ...a,
      avis: avisPublie(a),
      nomComplet: `${a.marque} ${a.modele}`,
      role: i === 0 ? 'SI TU HÉSITES' : "L'AUTRE OPTION",
      couleurRole: i === 0 ? '#0f5f5a' : '#a3401f',
      ombre: i === 0 ? '#0f7d76' : '#241c14',
      raison: top ? raisonAlternative(a, top, i) : '',
      lienPrincipal: avisPublie(a) || a.url,
      libelleLien: avisPublie(a) ? "L'avis →" : 'Le prix →',
    })),
  };
}
