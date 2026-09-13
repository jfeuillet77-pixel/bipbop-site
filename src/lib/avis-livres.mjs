/**
 * avis-livres.mjs — la liste des avis réellement publiés sur ce site.
 *
 * data/modeles.json déclare un avis pour 9 modèles. Le site n'en a pas forcément 9 :
 * tant qu'une page n'existe pas, le comparatif ne doit pas y envoyer le lecteur
 * (règle M03 : « tout nouveau lien doit pointer vers une page existante »).
 *
 * La liste est générée par scripts/import-data.mjs, qui tourne avant chaque build
 * (script `prebuild`). Un simple import JSON : identique côté serveur au build, côté
 * navigateur après hydratation, et dans les scripts de test passés en Node.
 */
import AVIS from '../data/avis.json' with { type: 'json' };

export const AVIS_LIVRES = new Set(AVIS);

/** L'URL d'avis d'un modèle, ou null si la page n'est pas encore publiée. */
export const avisPublie = (modele) => (modele.avis && AVIS_LIVRES.has(modele.avis) ? modele.avis : null);
