// L'instantané quotidien du baromètre des prix (/barometre/), compact parce qu'il est versionné :
// un fichier par jour dans src/data/barometre/AAAA-MM-JJ.json, que la page lit au build chez
// Netlify (qui n'a ni le Mac ni releves/archive/). Écrit par scripts/prix/archiver-flux.mjs
// --barometre, depuis le workflow GitHub extrait-rayon.
//
// Des lignes en tableaux, une seule fois l'en-tête : un objet par ligne doublerait la taille
// pour rien. Aucune adresse : ni flux, ni fiche, ni passerelle affiliée. L'identifiant suffit
// à retrouver la référence (numéro d'article Thomann, SKU Donner).

/** Les catégories Thomann du rayon, en codes courts. Une catégorie inconnue garde son libellé. */
export const CATEGORIES = {
  'Batteries Electroniques > Batteries Electroniques Complètes': 'kit',
  'Batteries Electroniques > Modules de Sons': 'module',
  'Batteries Electroniques > Pads de Caisse Claire': 'pad-caisse',
  'Batteries Electroniques > Pads de Cymbale': 'pad-cymbale',
  'Batteries Electroniques > Pads de Grosse Caisse': 'pad-grosse-caisse',
  'Batteries Electroniques > Pads de Charleston': 'pad-charleston',
  'Batteries Electroniques > Triggers pour Batteries': 'trigger',
  'Batteries Electroniques > Percussion & Sampling Pads': 'sampling-pad',
  'Batteries Electroniques > Moniteurs pour Batteries Electroniques': 'moniteur',
  'Batteries Electroniques > Accessoires pour Batteries Electroniques': 'accessoire',
  'Hardware pour Batterie & Percussions > Hardware pour Batteries Electroniques': 'hardware',
  'Housses & Etuis pour Batteries > Housses & Etuis pour Batteries Electroniques': 'housse',
};

/** `instantane` : l'objet que construit archiver-flux.mjs (thomann[], donner[]). */
export function compacter({ date, thomann, donner }) {
  const tri = (a, b) => String(a[0]).localeCompare(String(b[0]), 'fr', { numeric: true });
  return {
    date,
    sources: { thomann: 'flux partenaire Thomann, rayon batterie électronique', donner: 'flux Impact Donner, lignes batterie' },
    colonnes: {
      thomann: ['id', 'marque', 'modele', 'categorie', 'prix'],
      donner: ['id', 'nom', 'prix', 'prixBarre', 'stock', 'parent'],
    },
    thomann: thomann.map((t) => [t.id, t.marque, t.modele, CATEGORIES[t.categorie] ?? t.categorie, t.prix]).sort(tri),
    donner: donner.map((d) => [d.id, d.nom, d.prix, d.prixBarre ?? null, d.stock || null, d.parent || null]).sort(tri),
  };
}

/** Une ligne par entrée, pour que git montre un prix qui bouge comme une ligne qui change. */
export function serialiser(c) {
  const lignes = (rows) => rows.map((r) => '  ' + JSON.stringify(r)).join(',\n');
  return `{
 "date": ${JSON.stringify(c.date)},
 "sources": ${JSON.stringify(c.sources)},
 "colonnes": ${JSON.stringify(c.colonnes)},
 "thomann": [
${lignes(c.thomann)}
 ],
 "donner": [
${lignes(c.donner)}
 ]
}
`;
}
