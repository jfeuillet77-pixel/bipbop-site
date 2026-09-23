#!/usr/bin/env node
/**
 * typographie.mjs — les espaces insécables des prix, posées à la fin de chaque build (`postbuild`).
 *
 * Les maquettes écrivent « 250 € » et « 1 598 € » avec des espaces ordinaires : le navigateur
 * coupait alors la ligne entre le nombre et l'euro (« 250 » en fin de ligne, « € » au début de la
 * suivante), ou au milieu des milliers. Décision de Jordane du 23/09/2026 : une espace insécable
 * sur tous les prix, partout. Ici plutôt que dans les pages : un seul endroit voit les 40 pages,
 * portées comme écrites en Astro, et le relevé du lundi continue de lire des « 250 € » ordinaires
 * dans src/pages.
 *
 * Seul le texte du <body> est touché, jamais un attribut, un <script>, un <style> ni le <head>
 * (dont les longueurs de title et de description sont contrôlées au caractère près). L'espace
 * s'écrit `&nbsp;`, que les contrôles (verif, fidelite) ramènent déjà à une espace ordinaire.
 *
 *   node scripts/typographie.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(import.meta.dirname, '..', 'dist');
if (!existsSync(DIST)) {
  console.error('Aucun dist/ — la typographie se pose à la fin du build (« npm run build »).');
  process.exit(2);
}

/** « 1 598,50 € » -> « 1&nbsp;598,50&nbsp;€ » ; « 250 € » -> « 250&nbsp;€ ». */
function insecables(texte) {
  let n = 0;
  const t = texte
    .replace(/(\d{1,3})[  ](\d{3})((?:,\d{2})?)[  ]€/g, (_, a, b, c) => { n++; return `${a}&nbsp;${b}${c}&nbsp;€`; })
    .replace(/(\d)[  ]€/g, (_, d) => { n++; return `${d}&nbsp;€`; });
  return { t, n };
}

function traiter(html) {
  const i = html.indexOf('<body');
  if (i < 0) return { html, n: 0 };
  let n = 0;
  const corps = html.slice(i).replace(/(<(script|style)\b[\s\S]*?<\/\2>)|(<[^>]*>)|([^<]+)/g, (tout, bloc, _t, balise, texte) => {
    if (texte === undefined) return tout;
    const r = insecables(texte);
    n += r.n;
    return r.t;
  });
  return { html: html.slice(0, i) + corps, n };
}

let pages = 0, total = 0;
(function marcher(dir) {
  for (const nom of readdirSync(dir)) {
    const p = join(dir, nom);
    if (statSync(p).isDirectory()) { marcher(p); continue; }
    if (!nom.endsWith('.html')) continue;
    const { html, n } = traiter(readFileSync(p, 'utf8'));
    if (n) { writeFileSync(p, html); pages++; total += n; }
  }
})(DIST);

console.log(`\ntypographie · ${total} prix rendus insécables sur ${pages} page(s)\n`);
