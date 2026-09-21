// Usage : node scripts/prix/publier.mjs [--date AAAA-MM-JJ]
//
// Verse le relevé du jour dans `src/data/historique-prix.json`, la seule source de la page
// publique `/suivi-des-prix/`.
//
// Pourquoi un fichier à part, alors que releves/ contient déjà tout : la procédure demande de
// ne garder que les quatre derniers relevés bruts (ils pèsent, et leur détail ne sert qu'à
// l'enquête du lundi). L'historique publié, lui, ne s'élague jamais — c'est justement sa
// valeur. Il est compact : une ligne par relevé, et seulement ce qu'on assume de montrer.
//
// Ce qui n'y entre pas : les prix relevés qu'on n'a pas publiés. Un écart sous le seuil de
// cinq euros n'est pas un mouvement du site, c'est du bruit de marché ; l'annoncer comme une
// mise à jour serait se donner le beau rôle pour un chiffre qu'on n'a pas touché. Un relevé
// sans mouvement s'inscrit quand même, et c'est le plus important : il dit qu'on a regardé.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prixFrancais } from '../greffes.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);

const releves = readdirSync(join(SITE, 'releves')).filter((n) => /^prix-\d{4}-\d\d-\d\d\.json$/.test(n)).sort();
const DATE = arg('--date') ?? releves[releves.length - 1]?.slice(5, 15);
if (!DATE) { console.error('  Aucun relevé.'); process.exit(1); }
const rel = JSON.parse(readFileSync(join(SITE, 'releves', `prix-${DATE}.json`), 'utf8'));

const CHEMIN = join(SITE, 'src', 'data', 'historique-prix.json');
const hist = existsSync(CHEMIN) ? JSON.parse(readFileSync(CHEMIN, 'utf8')) : {
  _: "L'historique publié des relevés de prix, source unique de /suivi-des-prix/. Écrit par scripts/prix/publier.mjs à chaque relevé, jamais à la main. Contrairement à releves/, il ne s'élague pas : c'est la trace du travail.",
  releves: [],
};

const entree = {
  date: DATE,
  controlees: rel.bilan.controlees,
  lues: rel.bilan.lues,
  seuil: rel.seuil,
  mouvements: rel.refs.filter((r) => r.aTraiter && r.releve !== null).map((r) => ({
    nom: r.nom,
    marchand: r.marchand,
    famille: r.source === 'modeles' ? 'Batterie' : (r.famille ?? 'Accessoire'),
    avant: r.publieTexte,
    apres: prixFrancais(r.releve),
    ecart: r.ecart,
    pct: r.pct,
    changeDeTranche: r.franchitUnSeuil ? { avant: r.segmentPublie, apres: r.segmentReleve } : null,
  })).sort((a, b) => Math.abs(b.ecart) - Math.abs(a.ecart)),
  // Seules les ruptures qui demandent une décision : un « disponible sous 1-2 semaines » est un
  // délai de livraison, l'annoncer comme une rupture gonflerait le chiffre sans rien apprendre.
  ruptures: rel.refs.filter((r) => r.ruptureActionnable).map((r) => ({
    nom: r.nom, marchand: r.marchand,
    etat: r.dispoLisible || 'hors stock, sans date annoncée',
  })),
  disparues: rel.refs.filter((r) => r.disparue).map((r) => ({ nom: r.nom, marchand: r.marchand })),
};

const i = hist.releves.findIndex((x) => x.date === DATE);
if (i >= 0) hist.releves[i] = entree; else hist.releves.push(entree);
hist.releves.sort((a, b) => b.date.localeCompare(a.date));   // le plus récent en tête

writeFileSync(CHEMIN, JSON.stringify(hist, null, 1) + '\n', 'utf8');
console.log(`  ✓ historique-prix.json — relevé du ${DATE} : ${entree.mouvements.length} mouvement(s), ${entree.ruptures.length} rupture(s) · ${hist.releves.length} relevés publiés en tout`);
