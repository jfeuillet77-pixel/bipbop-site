import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const srv = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) p = join(DIST, 'index.html');
  res.writeHead(200, { 'content-type': (MIME[basename(p).slice(basename(p).lastIndexOf('.'))] || 'application/octet-stream') + '; charset=utf-8' });
  res.end(readFileSync(p));
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}`;

const b = await puppeteer.launch({ executablePath: process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const page = await b.newPage();
await page.setViewport({ width: 1200, height: 900 });

const titre = () => page.$eval('#titre-resultat', (e) => e.textContent.trim());
const choix = () => page.$eval('#zone-resultat', (e) => {
  const n = e.querySelector('[data-big="c"]');
  const alt = [...e.querySelectorAll('[style*="letter-spacing:-.02em"]')].map((x) => x.textContent.trim()).filter((t) => /Alesis|Millenium|Roland|Yamaha|Donner|Nux|Woodbrass/.test(t));
  return { principal: n?.textContent.trim(), alternatives: alt.slice(1, 3), sacrifice: e.querySelector('[style*="color:#e0d5c8"]')?.textContent.trim().slice(0, 58) };
});
const actifs = () => page.$$eval('[data-choisir]', (bs) => bs.filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.textContent.trim()));

console.log('— état initial (aucun clic) —');
await page.goto(base + '/comparatif/', { waitUntil: 'networkidle0' });
console.log('  titre       :', await titre());
console.log('  actif       :', (await actifs()).join(' · '));
console.log('  choix       :', JSON.stringify(await choix()));

const clics = [
  ['moins300', "Moins de 300 €"], ['plus500', 'Plus de 500 €'],
];
for (const [valeur, libelle] of clics) {
  await page.evaluate((v) => document.querySelector(`[data-choisir="budget"][data-valeur="${v}"]`).click(), valeur);
  console.log(`\n— clic budget « ${libelle} » —`);
  console.log('  URL         :', page.url().replace(base, ''));
  console.log('  actif       :', (await actifs()).join(' · '));
  console.log('  choix       :', JSON.stringify(await choix()));
}

await page.evaluate(() => document.querySelector('[data-choisir="usage"][data-valeur="potes"]').click());
console.log('\n— clic usage « Jouer avec des potes » —');
console.log('  actif       :', (await actifs()).join(' · '));
console.log('  choix       :', JSON.stringify(await choix()));

console.log('\n— URL partagée ?p=piece&b=plus500&u=morceaux (rechargement à froid) —');
await page.goto(base + '/comparatif/?p=piece&b=plus500&u=morceaux', { waitUntil: 'networkidle0' });
console.log('  actif       :', (await actifs()).join(' · '));
console.log('  choix       :', JSON.stringify(await choix()));

console.log('\n— « Recommencer » —');
await page.evaluate(() => document.querySelector('[data-reinitialiser]').click());
console.log('  actif       :', (await actifs()).join(' · '));
console.log('  URL         :', page.url().replace(base, ''));

console.log('\n— sans JavaScript (rendu au build seul) —');
const np = await b.newPage();
await np.setJavaScriptEnabled(false);
await np.goto(base + '/comparatif/', { waitUntil: 'load' });
console.log('  contenu     :', (await np.$eval('#zone-resultat', (e) => e.textContent.replace(/\s+/g, ' ').trim())).slice(0, 120));
await np.close();
await b.close();
srv.close();
