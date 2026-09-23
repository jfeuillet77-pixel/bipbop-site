#!/usr/bin/env node
/**
 * data.mjs — couche de données du site.
 *
 * Générée par scripts/import-data.mjs depuis « Claude Design - MàJ/data/ ».
 * Ne pas éditer à la main : corriger la source et relancer l'import.
 *
 * Règle D01 du guide-agent : ces fichiers sont la source unique.
 * Si une page et ici divergent, c'est la page qui a tort.
 */
import modeles from './modeles.json' with { type: 'json' };
import accessoires from './accessoires.json' with { type: 'json' };
import plan from './plan.json' with { type: 'json' };

export const MODELES = modeles.modeles;
export const RELEVE = modeles.releve;
export const ACCESSOIRES = accessoires;
export const PLAN = plan;

/** Clé de jointure : les 3 fichiers de produits n'ont pas d'id commun. */
export const cleProduit = (marque, modele) => `${marque} ${modele}`.toLowerCase().replace(/[^a-z0-9]+/g, '');

const PAR_CLE = new Map(MODELES.map((m) => [cleProduit(m.marque, m.modele), m]));
export const modeleParCle = (cle) => PAR_CLE.get(cle);

/** Maquette Claude Design → route publique, via la colonne fichier_maquette du plan. */
export const ROUTES = new Map();
for (const r of PLAN) {
  if (!r.fichier_maquette?.endsWith('.dc.html')) continue;
  const path = '/' + (r.permalien || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/|\/$/g, '');
  // `path` commence déjà par « / » : le préfixer encore donnait « //avis/… » (latent jusqu'au 23/09/2026,
  // première utilisation de la table, par la greffe des grilles).
  ROUTES.set(r.fichier_maquette, path === '/' ? '/' : path + '/');
}
/** Route d'un fichier maquette, ou null si le plan ne la connaît pas. */
export const routeDeMaquette = (fichier) => ROUTES.get(fichier) ?? null;

/** Libellé court affiché dans les cartes et les tableaux. */
export function nomCourt(m) {
  return m.modele
    .replace(/\s+(E-Drum|V-Drum|V-Drum|Drum)?\s*(Mesh\s*)?(Set|Kit)$/i, '')
    .replace(/\s+Mesh$/i, '')
    .trim();
}

/** Empreinte au sol : null quand elle n'a pas été relevée chez le marchand. */
export const empreinteAffichable = (m) => (m.empreinte ? m.empreinte.replace(' x ', ' × ') : null);

/** Valeur utilisée par le seul classement interne quand l'empreinte manque (jamais affichée). */
export const LARGEUR_IMPUTEE = modeles.empreinte?.valeur_pour_le_classement ?? 120;
export const largeurPourScore = (m) => m.largeur ?? LARGEUR_IMPUTEE;

export const prixDe = (v) => +String(v).replace('€', '').replace(/\s|\u202f/g, '').replace(',', '.');

/** Prix autorisés sur le site : les nôtres, ceux des accessoires, et rien d'autre. */
export const PRIX_CONNUS = new Set([
  ...MODELES.map((m) => prixDe(m.prix)),
  ...ACCESSOIRES.map((a) => prixDe(a.prix)),
]);
