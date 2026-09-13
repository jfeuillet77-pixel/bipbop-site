import { MODELES, LARGEUR_IMPUTEE } from '../src/data/produits.mjs';
import { resultat, classement, OPTIONS } from '../src/lib/comparatif.mjs';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// largeur_maquette n'existe plus dans src/data : c'est une note de design non validée,
// elle ne doit pas se retrouver dans le bundle. On la relit à la source pour comparer.
const SOURCE = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'Claude Design - MàJ', 'data', 'modeles.json');
const BRUT = JSON.parse(readFileSync(SOURCE, 'utf8')).modeles;
const PAR_ID = new Map(BRUT.map((m) => [m.id, m]));
for (const m of MODELES) m.largeur_maquette = PAR_ID.get(m.id)?.largeur_maquette ?? PAR_ID.get(m.id)?.largeur;

const COMBOS = [];
for (const [b] of OPTIONS.budget) for (const [p] of OPTIONS.place) for (const [u] of OPTIONS.usage) COMBOS.push({ budget: b, place: p, usage: u });

// même moteur, mais avec la largeur de la maquette (avant relevé Thomann)
function scoreMaquette(m, etat, PLAFOND = { moins300: 320, '300-500': 530, plus500: 1600 }) {
  const plafond = PLAFOND[etat.budget];
  if (m.prix > plafond) return null;
  const lg = m.largeur_maquette;
  let s = 0;
  s += m.peaux === 'mesh' ? 26 : m.peaux === 'mixte' ? 16 : 0;
  s += m.module * 5; s += (m.prix / plafond) * 14; if (m.avis) s += 4;
  if (etat.place === 'chambre') { s += m.discretion * 7; s += Math.max(0, (130 - lg) * 0.4); }
  if (etat.place === 'salon') { s += m.discretion * 5; s += Math.max(0, (140 - lg) * 0.2); }
  if (etat.place === 'piece') { s += m.pads * 1.8; s += m.cymbales * 2; }
  if (etat.usage === 'apprendre') { s += m.discretion * 8; s += m.peaux === 'mesh' ? 8 : 0; }
  if (etat.usage === 'morceaux') { s += m.module * 4; s += m.bluetooth ? 12 : 0; }
  if (etat.usage === 'potes') { s += m.pads * 2.2; s += m.module * 3; }
  return s;
}
const topMaquette = (etat) => MODELES.map((m) => ({ m, s: scoreMaquette(m, etat) })).filter((x) => x.s !== null)
  .sort((a, b) => b.s - a.s || a.m.prix - b.m.prix).slice(0, 3).map((x) => x.m.nom_complet);

console.log('27 combinaisons · largeur imputée pour les non relevés :', LARGEUR_IMPUTEE, 'cm\n');
console.log('budget      place   usage     1er (corrigé)                        1er (maquette)                 écart');
console.log('-'.repeat(118));
let changements = 0, trio = 0;
for (const etat of COMBOS) {
  const r = resultat(etat);
  const cl = classement(etat).slice(0, 3).map((x) => x.m.nom_complet);
  const mk = topMaquette(etat);
  const d1 = cl[0] !== mk[0];
  const d3 = cl.join('|') !== mk.join('|');
  if (d1) changements++; if (d3) trio++;
  console.log(`${etat.budget.padEnd(11)} ${etat.place.padEnd(7)} ${etat.usage.padEnd(9)} ${cl[0].padEnd(34)} ${mk[0].padEnd(34)} ${d1 ? '★ 1er CHANGE' : d3 ? 'trio modifié' : 'identique'}`);
}
console.log(`\n1er choix différent dans ${changements}/27 cas ; trio modifié dans ${trio}/27 cas`);

const r = resultat({ budget: '300-500', place: 'chambre', usage: 'apprendre' });
console.log('\n--- état par défaut (300-500 · chambre · apprendre) ---');
console.log('1er :', r.top.nomComplet, r.top.prixTexte, '|', r.top.ligneSource);
console.log('  phrase   :', r.top.phrase);
console.log('  raison   :', r.top.raison);
console.log('  chiffres :', r.top.chiffres.map((c) => `${c.libelle} ${c.valeur}`).join(' · '));
console.log('  sacrifice:', r.top.sacrifice);
for (const a of r.alternatives) console.log('alt :', a.role, a.nomComplet, a.prixTexte, '|', a.raison, '|', a.libelleLien);
console.log('\ntous les modèles avec empreinte relevée :');
for (const m of MODELES.filter((x) => x.empreinte)) console.log(`  ${m.nom_complet.padEnd(34)} ${m.empreinte.padEnd(12)} ${String(m.largeur_maquette).padStart(3)} → ${m.largeur} cm`);
