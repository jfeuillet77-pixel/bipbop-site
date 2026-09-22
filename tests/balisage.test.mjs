#!/usr/bin/env node
/**
 * balisage.test.mjs — le 9e contrôle passé sur des cas dont on connaît la réponse.
 *
 * Un contrôle qu'on ne teste pas est une promesse, pas un filet : il peut cesser de voir
 * sans que rien ne le dise, et son silence ressemble exactement à un site sain. Chaque cas de
 * `tests/cas/` porte en commentaire le défaut réel qu'il rejoue, avec sa date — ils viennent
 * tous du 22/09/2026, la séance où `/guides/` sortait de son cadre.
 *
 * `faux-amis.html` est le cas le plus important : il rassemble ce que le contrôle doit laisser
 * passer. Un faux positif coûte plus cher qu'un défaut manqué, parce qu'il apprend à ignorer
 * le contrôle.
 *
 *   npm test
 *
 * Code de sortie 0 si tout passe, 1 sinon.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defautsDeBalisage } from '../scripts/balisage.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const CAS = join(ICI, 'cas');

/** Ce qu'on attend de chaque cas : le nombre de défauts, et un fragment de chacun. */
const ATTENDU = {
  'sain.html': [],
  'faux-amis.html': [],
  'balise-en-trop.html': ["</div> ferme une balise qui n'est pas ouverte"],
  'balise-jamais-fermee.html': ["<div> n'est jamais refermé"],
  'grille-fermee-trop-tot.html': ['grille refermée trop tôt — 2 carte(s) dedans, 2 laissée(s) dehors'],
  'guillemet-dans-un-attribut.html': ['attributs de <img> mal découpés'],
};

const L = '═'.repeat(78);
const fichiers = readdirSync(CAS).filter((n) => n.endsWith('.html')).sort();
console.log(`\ncontrôle du balisage · ${fichiers.length} cas\n${L}`);

let echecs = 0;

/* Un cas sans attente déclarée est un oubli, pas un succès : on le compte comme un échec
   plutôt que de le traverser en silence. */
for (const nom of fichiers) {
  const attendu = ATTENDU[nom];
  const obtenu = defautsDeBalisage(readFileSync(join(CAS, nom), 'utf8'));

  if (!attendu) {
    echecs++;
    console.log(`✗ ${nom}\n     aucun attendu déclaré dans ATTENDU — ajouter le cas ou le retirer`);
    continue;
  }

  const manquants = attendu.filter((fragment) => !obtenu.some((d) => d.includes(fragment)));
  const nombreJuste = obtenu.length === attendu.length;

  if (!manquants.length && nombreJuste) {
    console.log(`✓ ${nom.padEnd(34)} ${attendu.length ? `${attendu.length} défaut(s) vu(s)` : 'muet, comme attendu'}`);
    continue;
  }

  echecs++;
  console.log(`✗ ${nom}`);
  if (!nombreJuste) console.log(`     ${attendu.length} défaut(s) attendu(s), ${obtenu.length} rendu(s)`);
  for (const m of manquants) console.log(`     jamais vu : «${m}»`);
  for (const d of obtenu) console.log(`     rendu     : ${d}`);
}

console.log(L);
console.log(echecs ? `✗ ${echecs} cas sur ${fichiers.length} ne répond pas\n` : `✓ les ${fichiers.length} cas répondent comme prévu\n`);
process.exit(echecs ? 1 : 0);
