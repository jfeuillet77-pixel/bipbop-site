#!/usr/bin/env node
// Usage : node scripts/indexnow.mjs [--attendre] [--tout] [--essai]
//
// Signale à Bing (et à Yandex, Seznam, Naver : IndexNow est partagé) les pages nouvelles ou
// modifiées, dès qu'elles sont en ligne. Google n'utilise pas IndexNow ; Bing, oui, et c'est
// lui qui nourrit la recherche de ChatGPT et de Copilot.
//
// D'où vient la liste : du sitemap EN LIGNE, pas de git. On compare chaque <lastmod> à celui
// qu'on a déjà signalé (releves/indexnow.json, hors dépôt). Une seule règle pour toutes les
// voies de mise en ligne : le lundi des prix, la page du jour, un push fait à la main.
//
//   --attendre  Netlify met une à deux minutes à déployer : on relit le sitemap toutes les
//               30 s, jusqu'à 10 min, tant qu'il ne montre rien de neuf.
//   --tout      signale toutes les URL du sitemap (premier branchement).
//   --essai     dit ce qui partirait, n'envoie rien.
//   --recentes H  ne regarde que les URL dont le lastmod a moins de H heures, sans mémoire : c'est
//               le mode de la routine cloud, qui repart chaque fois d'un poste vierge et
//               signalerait sinon tout le sitemap à chaque passage.
//
// La clé est publique par construction : public/<clé>.txt doit répondre 200 avec la clé pour
// que Bing accepte l'envoi. Elle ne donne aucun accès à rien.
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const HOTE = 'bipbop.eu';
const SITEMAP = `https://${HOTE}/sitemap-0.xml`;
const ETAT = join(SITE, 'releves', 'indexnow.json');

const argv = process.argv.slice(2);
const ATTENDRE = argv.includes('--attendre');
const TOUT = argv.includes('--tout');
const ESSAI = argv.includes('--essai');
const RECENTES = argv.includes('--recentes') ? Number(argv[argv.indexOf('--recentes') + 1]) : null;

const fichierCle = readdirSync(join(SITE, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!fichierCle) { console.error('Aucune clé IndexNow dans public/ (fichier <32 hex>.txt).'); process.exit(2); }
const CLE = fichierCle.slice(0, 32);

const deja = existsSync(ETAT) ? JSON.parse(readFileSync(ETAT, 'utf8')) : {};

async function lireSitemap() {
  const r = await fetch(SITEMAP, { headers: { 'cache-control': 'no-cache' } });
  if (!r.ok) throw new Error(`${SITEMAP} répond ${r.status}`);
  const xml = await r.text();
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)]
    .map(([, loc, lastmod]) => ({ loc, lastmod: lastmod ?? '' }));
}

const aSignaler = (urls) => urls.filter((u) => TOUT
  || (RECENTES ? Date.now() - Date.parse(u.lastmod) < RECENTES * 3600000 : deja[u.loc] !== u.lastmod));

let urls = await lireSitemap();
let neuves = aSignaler(urls);
if (ATTENDRE && !neuves.length) {
  for (let i = 0; i < 20 && !neuves.length; i++) {
    await new Promise((ok) => setTimeout(ok, 30000));
    urls = await lireSitemap();
    neuves = aSignaler(urls);
  }
}

if (!neuves.length) { console.log('IndexNow : rien de neuf dans le sitemap en ligne.'); process.exit(0); }
console.log(`IndexNow : ${neuves.length} URL à signaler`);
for (const u of neuves.slice(0, 20)) console.log(`   ${u.loc}`);
if (neuves.length > 20) console.log(`   … et ${neuves.length - 20} autres`);
if (ESSAI) process.exit(0);

// La clé doit être en ligne avant l'envoi, sinon Bing répond 403 et retient le refus.
const verif = await fetch(`https://${HOTE}/${CLE}.txt`);
if (!verif.ok || (await verif.text()).trim() !== CLE) {
  console.error(`  ✗ https://${HOTE}/${CLE}.txt n'est pas encore en ligne : rien n'est envoyé.`);
  process.exit(1);
}

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOTE,
    key: CLE,
    keyLocation: `https://${HOTE}/${CLE}.txt`,
    urlList: neuves.map((u) => u.loc),
  }),
});
// 200 : reçu et clé validée. 202 : reçu, clé en cours de validation. Les deux sont des succès.
if (r.status !== 200 && r.status !== 202) {
  console.error(`  ✗ IndexNow répond ${r.status} : ${(await r.text()).slice(0, 300)}`);
  process.exit(1);
}
for (const u of neuves) deja[u.loc] = u.lastmod;
mkdirSync(dirname(ETAT), { recursive: true });
writeFileSync(ETAT, JSON.stringify(deja, null, 2) + '\n');
console.log(`  ✓ envoyé (HTTP ${r.status}).`);
