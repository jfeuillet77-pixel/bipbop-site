/**
 * captures.mjs — rend le comparatif dans Chrome et écrit une image par largeur.
 * Le Brief-Responsive §06 réclame un essai visuel en plus des mesures : c'est cet essai-là,
 * rejouable. Sorties dans ../.qwen/tmp/ (hors dépôt).
 *
 *   node scripts/captures.mjs [route]      # défaut : /comparatif/
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(SITE, 'dist');
const OUT = join(SITE, '..', '.qwen', 'tmp', 'captures');
const ROUTE = process.argv[2] || '/comparatif/';
const NOM = basename(ROUTE).replace(/[^a-z0-9-]/gi, '') || 'accueil';

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
const srv = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) p = join(DIST, 'index.html');
  const ext = basename(p).slice(basename(p).lastIndexOf('.'));
  res.writeHead(200, { 'content-type': (MIME[ext] || 'application/octet-stream') + '; charset=utf-8' });
  res.end(readFileSync(p));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;

mkdirSync(OUT, { recursive: true });
const b = await puppeteer.launch({
  executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new', args: ['--no-sandbox'],
});
const page = await b.newPage();

const plans = [
  { nom: `${NOM}-1200`, largeur: 1200, hauteur: 1500 },
  { nom: `${NOM}-900`, largeur: 900, hauteur: 1700 },
  { nom: `${NOM}-390`, largeur: 390, hauteur: 2500 },
];

for (const { nom, largeur, hauteur } of plans) {
  await page.setViewport({ width: largeur, height: hauteur });
  await page.goto(base + ROUTE, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: join(OUT, `${nom}.png`), fullPage: true });
  const m = await page.evaluate(() => {
    const de = document.documentElement;
    const etroites = [...document.querySelectorAll('a,button')]
      .map((e) => Math.round(e.getBoundingClientRect().height))
      .filter((h) => h > 0 && h < 44);
    return {
      scroll: de.scrollWidth, client: de.clientWidth,
      rwd: getComputedStyle(de).getPropertyValue('--rwd').trim(),
      colonnes: getComputedStyle(document.querySelector('[data-rwd="c3"]') || document.body).gridTemplateColumns,
      cartes: document.querySelectorAll('[data-rwd="c3"] > div').length,
      tactiles: etroites.length, plusPetite: etroites.length ? Math.min(...etroites) : null,
      tableau: !!document.querySelector('[data-rwd="tbl"]'),
      deborde: [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > de.clientWidth + 1).length,
    };
  });
  console.log(`${nom.padEnd(20)} défilement ${String(m.scroll).padStart(4)} / fenêtre ${String(m.client).padStart(4)} · sonde ${m.rwd || 'off'} · cartes ${m.cartes} · grilles ${m.colonnes.split(' ').length} · cibles <44px ${m.tactiles}${m.plusPetite ? ` (min ${m.plusPetite}px)` : ''} · éléments hors cadre ${m.deborde}`);
}

// l'état choisi doit se lire sur l'image : on recharge une URL de réponses
await page.setViewport({ width: 1200, height: 1500 });
await page.goto(base + '/comparatif/?b=moins300&p=chambre&u=morceaux', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: join(OUT, 'comparatif-moins300.png'), fullPage: true });

await b.close();
srv.close();
console.log(`\nimages écrites dans ${OUT}`);
