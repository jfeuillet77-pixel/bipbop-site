#!/usr/bin/env node
// Usage : node scripts/pages/prochaine.mjs [--liste N]
//
// La prochaine page à écrire, selon le plan éditorial importé (src/data/plan.json : lancer
// `npm run data` avant). Utilisé par la routine de publication (ROUTINE-PUBLICATION.md).
//
// L'ordre, décidé le 07/10/2026 quand le rythme est passé à deux pages par jour :
//   1. ce qui reste des vagues 1 et 2 (les hubs promis pour octobre : /les-bases/, Millenium) ;
//   2. puis la priorité (Critique, Haute, Moyenne, Basse), quelle que soit la vague : un avis
//      « Basse » de la vague 3 ne passe pas devant un guide « Haute » de la vague 4 ;
//   3. à priorité égale, la vague, puis l'id.
// Une ligne dont les notes demandent d'attendre une autre page (« à publier après P164 ») attend
// que celle-ci soit publiée. Une ligne marquée « [session locale] » dans ses notes demande des
// sources que la routine cloud n'a pas (annonces d'occasion, page marchand à lire) : la routine la
// saute, une session sur le poste la reprend (`--locale` la remet dans la file).
//
// Sortie : la ligne en JSON. Code 3 : plus rien « À produire ».
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const plan = JSON.parse(readFileSync(join(SITE, 'src', 'data', 'plan.json'), 'utf8'));
const argv = process.argv.slice(2);
const LOCALE = argv.includes('--locale');
const N = argv.includes('--liste') ? Number(argv[argv.indexOf('--liste') + 1]) || 10 : 0;

const statut = Object.fromEntries(plan.map((l) => [l.id, l.statut]));
const RANG = { Critique: 0, Haute: 1, Moyenne: 2, Basse: 3 };
const vague = (lot) => Number(/Vague\s*(\d+)/i.exec(lot)?.[1] ?? (/^Lot/i.test(lot) ? 0 : 99));
const attend = (l) => [...(l.notes ?? '').matchAll(/publier après ((?:P\d+(?:\s*(?:,|et)\s*)?)+)/gi)]
  .flatMap((m) => m[1].match(/P\d+/g))
  .filter((id) => statut[id] !== 'Publié');

const file = plan
  .filter((l) => l.statut === 'À produire' && !attend(l).length)
  .filter((l) => LOCALE || !/\[session locale\]/i.test(l.notes ?? ''))
  .sort((a, b) => (vague(a.lot) > 2) - (vague(b.lot) > 2)
    || (RANG[a.priorite] ?? 9) - (RANG[b.priorite] ?? 9)
    || vague(a.lot) - vague(b.lot)
    || a.id.localeCompare(b.id, 'fr', { numeric: true }));

if (!file.length) { console.error('Plus aucune ligne « À produire » disponible.'); process.exit(3); }
if (N) {
  for (const l of file.slice(0, N)) console.log(`${l.id}\t${l.priorite}\t${l.lot}\t${l.type}\t${l.titre}`);
  console.log(`… ${file.length} ligne(s) disponible(s) en tout`);
} else {
  console.log(JSON.stringify(file[0], null, 1));
}
