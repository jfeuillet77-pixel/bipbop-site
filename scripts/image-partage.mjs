#!/usr/bin/env node
/**
 * image-partage.mjs — l'image que montre un lien vers bipbop.eu quand on le partage
 * (`og:image`, 1200 × 630, le format que lisent Facebook, LinkedIn, X, WhatsApp et Slack).
 *
 * Elle se rend dans Chrome depuis la mascotte publiée (`public/bipbop-mascotte.svg`) et les
 * couleurs du Design System, pour ne pas devenir une image de plus à retoucher à la main : si la
 * mascotte change, on relance ce script. Le PNG est versionné dans `public/` : il ne se
 * régénère pas à chaque build, un build ne doit pas dépendre de Chrome ni de Google Fonts.
 *
 *   node scripts/image-partage.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SORTIE = join(SITE, 'public', 'bipbop-partage.png');
const MASCOTTE = readFileSync(join(SITE, 'public', 'bipbop-mascotte.svg'), 'utf8');

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Work+Sans:wght@500&display=swap">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#efe6d8;overflow:hidden}
  .carte{box-sizing:border-box;width:1200px;height:630px;padding:70px 80px;display:grid;grid-template-columns:1fr 330px;gap:40px;align-items:center}
  .marque{font:800 34px 'Bricolage Grotesque',sans-serif;color:#d2431f;letter-spacing:-.02em;margin-bottom:26px}
  h1{font:800 70px/1.02 'Bricolage Grotesque',sans-serif;letter-spacing:-.035em;color:#241c14;margin:0 0 28px}
  p{font:500 27px/1.4 'Work Sans',sans-serif;color:#5a4c3e;margin:0}
  .mascotte svg{width:330px;height:auto;display:block}
</style></head><body><div class="carte">
  <div>
    <div class="marque">bipbop.eu</div>
    <h1>La batterie électronique, sans jargon.</h1>
    <p>Des avis testés, des prix relevés chaque lundi et une recommandation par situation.</p>
  </div>
  <div class="mascotte">${MASCOTTE}</div>
</div></body></html>`;

const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: true });
try {
  const page = await navigateur.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(SORTIE, await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } }));
  console.log(`image de partage · ${SORTIE.replace(SITE + '/', '')} · 1200 × 630`);
} finally {
  await navigateur.close();
}
