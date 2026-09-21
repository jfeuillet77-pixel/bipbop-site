// Usage : node scripts/prix/appliquer.mjs [--appliquer] [--date AAAA-MM-JJ] [--forcer]
//
// Écrit dans `design/prix-reperes.json` les prix du dernier relevé — et rien d'autre.
//
// Ce fichier est la surcharge du dépôt : « Claude Design - MàJ/data/ » reste la source
// d'auteur, prix-reperes ne la dément que lorsqu'un relevé en ligne a tranché depuis, avec sa
// date et sa preuve. `npm run data` l'applique ensuite à src/data/, et un import dont une
// entrée ne correspond à rien échoue exprès.
//
// CE QUE CE SCRIPT NE FAIT PAS, ET POURQUOI
//
// Il ne touche ni aux maquettes, ni à `design/port-corrections.json`, ni à une seule phrase.
// Sur ce site, un prix n'est presque jamais un nombre isolé : il est pris dans un
// raisonnement (« au même prix », « onze euros de moins », « le match à 298 € »), et deux
// modèles partagent souvent le même montant — au 21/09, 498 € désigne à la fois la TD-02KV,
// la MPS-750X et la DTX432K. Une substitution automatique y ferait exactement le dégât que la
// procédure cherche à éviter. Ce travail-là est éditorial : il revient à la session Claude du
// lundi, qui lit PRIX-SEMAINE.md.
//
// Deux refus, parce que ce script tourne sans personne devant :
//   - plus d'un cinquième des références qui bougent d'un coup : ce n'est pas le marché, c'est
//     le relevé. Rien n'est écrit. --forcer passe outre, à la main.
//   - une référence en rupture : son prix ne se publie pas sans décision (piège n°3, et la
//     bascule vers Woodbrass est un choix, pas un calcul).
//
// Sans --appliquer, rien n'est écrit : le script dit ce qu'il ferait.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prixFrancais, segmentDe } from '../greffes.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const APPLIQUER = argv.includes('--appliquer');
const FORCER = argv.includes('--forcer');
const AMPLEUR_MAX = 0.2;

const releves = readdirSync(join(SITE, 'releves')).filter((n) => /^prix-\d{4}-\d\d-\d\d\.json$/.test(n)).sort();
const DATE = arg('--date') ?? releves[releves.length - 1]?.slice(5, 15);
if (!DATE) { console.error('  Aucun relevé.'); process.exit(1); }
const rel = JSON.parse(readFileSync(join(SITE, 'releves', `prix-${DATE}.json`), 'utf8'));

const CHEMIN = join(SITE, 'design', 'prix-reperes.json');
const reperes = JSON.parse(readFileSync(CHEMIN, 'utf8'));
const jj = (d) => d.split('-').reverse().join('/');

/* ------------------------------------- qui bouge, et qui ne bouge pas ------------------------------------ */

const bougent = rel.refs.filter((r) => r.aTraiter);
const ampleur = rel.bilan.controlees ? bougent.length / rel.bilan.controlees : 0;
if (ampleur > AMPLEUR_MAX && !FORCER) {
  console.error(`  ✗ ${Math.round(ampleur * 100)} % des références changeraient de prix d'un coup (seuil : ${AMPLEUR_MAX * 100} %).`);
  console.error(`     Ce n'est pas le marché qui bouge, c'est le relevé qui est douteux : flux tronqué, colonne décalée, jointure cassée.`);
  console.error(`     Vérifier releves/prix-${DATE}.json, puis relancer avec --forcer si le relevé est bon. Rien n'a été écrit.`);
  process.exit(2);
}

const ecrits = [], refuses = [];

for (const r of bougent) {
  if (r.enRupture) {
    refuses.push([r, `en rupture (${r.dispoLisible || r.dispo}) — publier son prix est le piège n°3, et la bascule de marchand est une décision`]);
    continue;
  }
  if (r.releve === null) continue;

  if (r.source === 'modeles') {
    const entrees = (reperes.modeles ??= []);
    const i = entrees.findIndex((e) => e.id === r.id);
    const entree = {
      id: r.id,
      prix: r.releve,
      prixTexte: prixFrancais(r.releve),
      segment: segmentDe(r.releve),
      pourquoi: `${r.marchand} à ${prixFrancais(r.releve)} relevé le ${jj(DATE)} (${r.publieTexte} auparavant), par ${r.origine === 'flux' ? 'le flux partenaire' : 'la page produit'}.`
        + (r.franchitUnSeuil ? ` Le prix franchit une borne : la tranche passe de « ${r.segmentPublie} » à « ${r.segmentReleve} », sinon le segment annonce un prix qui ne contient plus le modèle.` : ''),
    };
    if (i >= 0) entrees[i] = entree; else entrees.push(entree);
    ecrits.push([r, entree.segment !== r.segmentPublie ? 'prix + tranche' : 'prix']);
  } else {
    // Un accessoire n'a ni id ni tranche : il se retrouve par marque + produit, comme l'import.
    const [marque, ...reste] = r.nom.split(' ');
    const produit = reste.join(' ');
    const entrees = (reperes.accessoires ??= []);
    const i = entrees.findIndex((e) => e.marque === marque && e.produit === produit);
    if (i < 0) {
      refuses.push([r, `aucune entrée « ${marque} ${produit} » dans prix-reperes, et une entrée orpheline fait échouer l'import — à créer en connaissance de cause`]);
      continue;
    }
    entrees[i] = { ...entrees[i], prix: prixFrancais(r.releve),
      pourquoi: `${r.marchand} à ${prixFrancais(r.releve)} relevé le ${jj(DATE)} (${r.publieTexte} auparavant).` };
    ecrits.push([r, 'prix']);
  }
}

// La date d'en-tête est celle du relevé : c'est elle que le comparatif et le hub affichent
// sous leurs tableaux de prix. Elle suit chaque relevé, y compris un relevé sans mouvement —
// « prix relevés le 21 septembre » reste vrai quand rien n'a bougé, et c'est même tout
// l'intérêt de le dire.
reperes.base = { ...reperes.base, releve: DATE };
reperes._releve = DATE;

/* ------------------------------------------------ écriture ----------------------------------------------- */

for (const [r, quoi] of ecrits) console.log(`  ✓ ${r.nom.padEnd(34)} ${r.publieTexte.padStart(10)} → ${prixFrancais(r.releve).padStart(10)}   (${quoi})`);
for (const [r, motif] of refuses) console.log(`  ✗ ${r.nom.padEnd(34)} ${r.publieTexte.padStart(10)} → ${prixFrancais(r.releve).padStart(10)}   retenu : ${motif}`);

if (APPLIQUER) {
  writeFileSync(CHEMIN, JSON.stringify(reperes, null, 2) + '\n', 'utf8');
  console.log(`\n  ${ecrits.length} prix écrits dans design/prix-reperes.json, date de relevé au ${jj(DATE)}.`);
  if (refuses.length) console.log(`  ${refuses.length} retenus : ils sont dans PRIX-SEMAINE.md avec leur motif.`);
  console.log(`  Reste le travail éditorial : les phrases qui citent ces montants, et les greffes de design/port-corrections.json.`);
} else {
  console.log(`\n  Essai à blanc : rien n'a été écrit. ${ecrits.length} prix seraient repris, ${refuses.length} retenus.`);
}
