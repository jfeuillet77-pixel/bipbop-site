/**
 * marchands.mjs — comment se lit un prix chez chaque marchand.
 *
 * Une seule implémentation, importée par `scripts/releve-prix.mjs` (le relevé à la demande)
 * et par `scripts/prix/relever.mjs` (le rendez-vous du lundi). Deux copies de ces regex
 * dériveraient, et une dérive ici publie un prix faux.
 *
 * Ce n'est pas le même mécanisme partout :
 *   - Thomann ne publie AUCUN JSON-LD. Le prix est en microdata (`itemprop="price"`, décimale
 *     à la virgule), la dispo en `itemprop="availability"`, et le nom vérifiable dans le bloc
 *     e-commerce GTM (`"item_name"`). Le `itemprop="name"` du fil d'Ariane renvoie « Home ».
 *     Son FLUX, lui, donne le prix mais pas la disponibilité : les deux sont complémentaires.
 *   - Woodbrass donne du JSON-LD. Une référence retirée renvoie HTTP 200 sur une page de
 *     catégorie sans prix : c'est la fiche qui est morte, pas le parseur.
 *   - Donner est un Shopify multi-variantes. Le JSON-LD ne dit que la variante par défaut, qui
 *     est souvent le bundle. Son flux donne une ligne PAR variante, avec le stock.
 *     Le `compare_at_price` / « Original Price » est le prix barré permanent (règle I05) :
 *     jamais publié, jamais utilisé pour calculer quoi que ce soit.
 */
import { readFileSync, existsSync } from 'node:fs';

export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

export const sleep = (ms) => new Promise((s) => setTimeout(s, ms));
export const norm = (s) =>
  String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
export const money = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const m = String(v).replace(/\s| /g, '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
};
export const hote = (u) => { try { return new URL(u).host; } catch { return ''; } };

/** Les tranches du hub (mêmes bornes que segmentDe dans greffes.mjs et que BORNES dans import-data.mjs). */
export function segmentDe(prix) {
  if (prix < 300) return 'Moins de 300 €';
  if (prix < 500) return '300 à 500 €';
  if (prix < 800) return '500 à 800 €';
  if (prix <= 1600) return '800 à 1600 €';
  return 'HORS TRANCHE — au-delà de 1600 €, segmentDe() fait échouer le build';
}

/* ------------------------------- les clés de jointure ------------------------------- */

/** Thomann : le slug de la fiche, seul identifiant stable entre le flux et nos URLs publiques. */
export const slugThomann = (u) => (String(u || '').match(/thomann\.[a-z]+\/([^?#]+\.htm)/i) ?? [])[1] ?? null;

/** Donner : le handle Shopify. Dans le flux il est caché dans le `u=` de la passerelle d'affiliation. */
export const destinationDonner = (u) => {
  const m = String(u || '').match(/[?&]u=([^&]+)/);
  try { return m ? decodeURIComponent(m[1]) : String(u || ''); } catch { return String(u || ''); }
};
export const handleDonner = (u) => (destinationDonner(u).match(/\/products\/([^?#/]+)/) ?? [])[1] ?? null;

/* ---------------------------------- lecture des flux --------------------------------- */

/** Découpe une ligne délimitée en tenant compte des guillemets (le flux Thomann en met). */
function colonnes(ligne, delim) {
  const out = [];
  let val = '', dans = false;
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (dans) {
      if (c === '"') { if (ligne[i + 1] === '"') { val += '"'; i++; } else dans = false; }
      else val += c;
    } else if (c === '"') dans = true;
    else if (c === delim) { out.push(val); val = ''; }
    else if (c !== '\r') val += c;
  }
  out.push(val);
  return out;
}

/**
 * Le catalogue Thomann, réduit aux seuls slugs demandés. 123 000 lignes et 95 Mo : on ne
 * construit jamais la table entière, on ne garde que ce qui nous concerne.
 *
 * Le bundle a son propre article et son propre slug (`..._bundle.htm`) : une jointure par slug
 * ne peut pas confondre le kit et le lot, ce qui est exactement le piège n°2 de la procédure.
 */
export function lireFluxThomann(chemin, slugsVoulus) {
  if (!existsSync(chemin)) return new Map();
  const voulus = slugsVoulus instanceof Set ? slugsVoulus : new Set(slugsVoulus);
  const out = new Map();
  const txt = readFileSync(chemin, 'utf8');
  let debut = txt.indexOf('\n') + 1; // on saute l'en-tête
  while (debut > 0 && debut < txt.length) {
    let fin = txt.indexOf('\n', debut);
    if (fin < 0) fin = txt.length;
    const ligne = txt.slice(debut, fin);
    debut = fin + 1;
    // Filtre grossier avant le découpage : sans lui on parse 123 000 lignes pour en garder 121.
    if (!ligne.includes('thomann.')) continue;
    const c = colonnes(ligne, ';');
    if (c.length < 7) continue;
    const slug = slugThomann(c[6]);
    if (!slug || !voulus.has(slug)) continue;
    out.set(slug, {
      article: c[0], marque: c[1], modele: c[2],
      prix: money(c[4]), image: c[5], url: c[6], categorie: c[7] ?? '',
    });
  }
  return out;
}

/**
 * Cherche une référence PAR SON NOM dans le catalogue Thomann entier, et non parmi les seuls
 * slugs qu'on suit. Sert quand une fiche sort du flux : neuf fois sur dix elle n'a pas disparu,
 * elle a changé d'adresse — la Donner BackBeat le 21/09/2026, retirée de sa page « offre
 * exclusive » et republiée ailleurs, 200 € plus cher. Proposer le candidat évite de conclure à
 * un retrait, qui est la plus lourde des corrections éditoriales.
 */
export function chercherFluxThomann(chemin, requete, max = 3) {
  if (!existsSync(chemin)) return [];
  const mots = norm(requete).split(' ').filter((w) => w.length > 2);
  if (!mots.length) return [];
  const trouves = [];
  const txt = readFileSync(chemin, 'utf8');
  let debut = txt.indexOf('\n') + 1;
  while (debut > 0 && debut < txt.length) {
    let fin = txt.indexOf('\n', debut);
    if (fin < 0) fin = txt.length;
    const ligne = txt.slice(debut, fin);
    debut = fin + 1;
    if (!ligne.includes('thomann.')) continue;
    const c = colonnes(ligne, ';');
    if (c.length < 7) continue;
    const nom = norm(`${c[1]} ${c[2]}`);
    const score = mots.filter((w) => nom.includes(w)).length / mots.length;
    if (score < 0.6) continue;
    // Un bundle porte le nom du kit plus « bundle » : il ne remplace jamais le kit seul.
    trouves.push({ score, bundle: /bundle|set\b.*bundle/i.test(c[2]), nom: `${c[1]} ${c[2]}`, prix: money(c[4]), url: c[6].split('?')[0], article: c[0] });
  }
  return trouves.sort((a, b) => b.score - a.score || a.prix - b.prix).slice(0, max);
}

/** Même idée chez Donner, où le catalogue tient en mémoire. */
export function chercherFluxDonner(parHandle, requete, max = 3) {
  const mots = norm(requete).split(' ').filter((w) => w.length > 2);
  if (!mots.length) return [];
  const trouves = [];
  for (const [handle, variantes] of parHandle) {
    const nom = norm(variantes[0]?.nom ?? handle);
    const score = mots.filter((w) => nom.includes(w)).length / mots.length;
    if (score < 0.6) continue;
    const dispo = variantes.filter((v) => v.prix !== null);
    if (!dispo.length) continue;
    const v = dispo.reduce((a, x) => (x.prix < a.prix ? x : a));
    trouves.push({ score, bundle: false, nom: v.nom, prix: v.prix, url: v.url.split('?')[0], article: v.sku });
  }
  return trouves.sort((a, b) => b.score - a.score || a.prix - b.prix).slice(0, max);
}

/**
 * Le catalogue Donner, groupé par handle : une ligne par variante.
 * `Stock Availability` vaut Y/N — c'est la seule disponibilité qu'un flux nous donne.
 */
export function lireFluxDonner(chemin) {
  if (!existsSync(chemin)) return new Map();
  const lignes = readFileSync(chemin, 'utf8').split('\n');
  const hdr = colonnes(lignes[0] ?? '', '\t').map((h) => h.trim());
  const col = (n) => hdr.indexOf(n);
  const iUrl = col('Product URL'), iNom = col('Product Name'), iPrix = col('Current Price');
  const iStock = col('Stock Availability'), iSku = col('Unique Merchant SKU'), iDevise = col('Currency');
  const iBarre = col('Original Price');
  if (iUrl < 0 || iPrix < 0) return new Map();
  const out = new Map();
  for (const l of lignes.slice(1)) {
    if (!l.trim()) continue;
    const c = colonnes(l, '\t');
    const h = handleDonner(c[iUrl]);
    if (!h) continue;
    if (iDevise >= 0 && c[iDevise] && !/EUR/i.test(c[iDevise])) continue;
    if (!out.has(h)) out.set(h, []);
    out.get(h).push({
      sku: c[iSku], nom: (c[iNom] ?? '').trim(), prix: money(c[iPrix]),
      enStock: (c[iStock] ?? '').trim().toUpperCase() === 'Y',
      barre: money(c[iBarre]),       // prix barré permanent — règle I05, ne se publie jamais
      url: destinationDonner(c[iUrl]),
    });
  }
  return out;
}

/**
 * Le prix Donner qui compte, parmi les variantes.
 *
 * Par défaut la moins chère EN STOCK : c'est celle vers laquelle le lien mène et celle qu'un
 * lecteur verra. `skuEpingle` force une variante précise, pour les rares fiches où le prix
 * publié est un choix éditorial déjà tranché — le pack charleston + pied à 165,99 €, dont le
 * contrôleur seul à 72,99 € est une autre variante (voir design/prix-reperes.json).
 */
export function prixDonner(variantes, skuEpingle = null) {
  if (!variantes?.length) return null;
  if (skuEpingle) {
    const v = variantes.find((x) => x.sku === String(skuEpingle));
    if (v) return { prix: v.prix, nom: v.nom, enStock: v.enStock, sku: v.sku, variantes: variantes.length, epingle: true };
  }
  const dispo = variantes.filter((v) => v.enStock && v.prix !== null);
  const pool = dispo.length ? dispo : variantes.filter((v) => v.prix !== null);
  if (!pool.length) return null;
  const v = pool.reduce((a, b) => (b.prix < a.prix ? b : a));
  return { prix: v.prix, nom: v.nom, enStock: v.enStock, sku: v.sku, variantes: variantes.length, epingle: false };
}

/* --------------------------------- lecture des pages --------------------------------- */

export function lireThomann(html) {
  const price = html.match(/itemprop="price"\s+content="([\d.,]+)"/i);
  const nom =
    html.match(/"item_name":"([^"]+)"/)?.[1] ??
    html.match(/property="og:title"\s+content="([^"]+)"/i)?.[1] ?? '';
  const dispo = (html.match(/itemprop="availability"\s+href="[^"]*?\/(\w+)"/i) ?? [])[1] ?? '';
  // « actuellement indisponible » figure aussi sur des fiches en stock, hors du bloc d'achat : le
  // relevé du 21/09 l'attribuait à 105 références InStock. Une fiche en stock n'a donc pas de
  // libellé, et un délai annoncé passe avant ce texte générique.
  const trouve = (re) => (html.match(re) ?? [])[1];
  const libelle = (dispo === 'InStock' ? '' : trouve(/(Disponible sous [^<]{2,24})/i) ?? trouve(/(actuellement indisponible)/i) ?? '')
    .replace(/\s+/g, ' ').trim();   // le HTML met des retours à la ligne et douze espaces dedans
  if (!price && !dispo) return null;
  return { price: price ? money(price[1]) : null, name: nom.trim(), availability: dispo, dispoLisible: libelle };
}

function blocsLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { out.push(JSON.parse(m[1].trim())); } catch { /* bloc illisible */ }
  }
  return out;
}
function produits(node, acc, profondeur = 0) {
  if (!node || profondeur > 8) return acc;
  if (Array.isArray(node)) { for (const n of node) produits(n, acc, profondeur + 1); return acc; }
  if (typeof node !== 'object') return acc;
  if (/Product/i.test(String(node['@type'] ?? ''))) acc.push(node);
  for (const k of ['@graph', 'mainEntity', 'item', 'itemListElement', 'itemList', 'product'])
    if (node[k] !== undefined) produits(node[k], acc, profondeur + 1);
  return acc;
}
function offres(o, acc, profondeur = 0) {
  if (!o || profondeur > 6) return acc;
  if (Array.isArray(o)) { for (const x of o) offres(x, acc, profondeur + 1); return acc; }
  if (typeof o === 'object') {
    if (o.price !== undefined || o.lowPrice !== undefined || /Offer/i.test(String(o['@type'] ?? ''))) acc.push(o);
    for (const k of ['offers', 'itemOffered']) if (o[k] !== undefined) offres(o[k], acc, profondeur + 1);
  }
  return acc;
}
export function lireJsonLd(html, attendu) {
  const cibles = [];
  for (const bloc of blocsLd(html))
    for (const p of produits(bloc, []))
      for (const o of offres(p.offers ?? p, [])) {
        const prix = money(o.price ?? o.lowPrice ?? o.priceRange);
        if (prix === null || prix <= 0 || !/EUR/i.test(String(o.priceCurrency ?? 'EUR'))) continue;
        cibles.push({
          price: prix, name: String(p.name ?? '').trim(),
          availability: String(o.availability ?? '').split('/').pop(),
          strike: money(o.listPrice ?? o.strikethroughPrice ?? o.highPrice),
        });
      }
  if (!cibles.length) return null;
  const mots = norm(attendu).split(' ').filter((w) => w.length > 2);
  return cibles
    .map((c) => ({ ...c, score: mots.length ? mots.filter((w) => norm(c.name).includes(w)).length / mots.length : 1 }))
    .sort((a, b) => b.score - a.score || a.price - b.price)[0];
}

/** Chez Donner, hors flux : le prix qui compte est celui de la variante la moins chère. */
export async function lireDonner(url) {
  const cible = url.split('?')[0].replace(/\/$/, '') + '.json';
  const res = await fetch(cible, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) return null;
  const p = (await res.json())?.product;
  if (!p?.variants?.length) return null;
  const prix = Math.min(...p.variants.map((v) => money(v.price) ?? Infinity));
  const variante = p.variants.find((v) => money(v.price) === prix);
  if (!Number.isFinite(prix)) return null;
  return {
    price: prix, name: `${p.title}${variante ? ` — ${variante.title}` : ''}`,
    availability: 'InStock', strike: money(variante?.compare_at_price),
  };
}

/**
 * Le nombre de semaines d'attente annoncé, au pire. « Disponible sous 6-8 semaines » -> 8,
 * « actuellement indisponible » -> Infinity, en stock -> 0.
 *
 * La procédure distingue les deux : « une rupture de plus de deux semaines chez Thomann
 * justifie de basculer le lien vers Woodbrass ». Un délai d'une à deux semaines n'est pas une
 * rupture qui demande une décision, c'est un délai de livraison. Les confondre ferait basculer
 * quinze liens par semaine pour rien.
 */
export function semainesDAttente(dispo, libelle) {
  if (!dispo || dispo === 'InStock') return 0;
  if (/indisponible/i.test(libelle ?? '')) return Infinity;
  const bornes = String(libelle ?? '').match(/(\d+)\s*-\s*(\d+)\s*semaines?/i);
  if (bornes) return Number(bornes[2]);
  const une = String(libelle ?? '').match(/(\d+)\s*semaines?/i);
  if (une) return Number(une[1]);
  return Infinity;   // hors stock sans date annoncée : on ne suppose pas que ça revient vite
}

/** Une page marchande, quel que soit le marchand. `r` porte au moins { url, nom, marchand }. */
export async function lirePage(r) {
  if (r.marchand === 'Donner Music') {
    try { const d = await lireDonner(r.url); if (d) return d; } catch { /* on retombe sur la page */ }
  }
  const res = await fetch(r.url, {
    headers: { 'user-agent': UA, 'accept-language': 'fr-FR,fr;q=0.9', accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow', signal: AbortSignal.timeout(45000),
  });
  r.http = res.status;
  r.urlFinale = res.url;     // une fiche retirée répond souvent 200 en redirigeant vers l'accueil
  const html = await res.text();
  if (!res.ok) { r.erreur = `HTTP ${res.status}`; return null; }
  const lu = hote(r.url).includes('thomann') ? lireThomann(html) : lireJsonLd(html, r.nom);
  if (!lu) r.erreur = 'prix non lisible dans la page';
  return lu;
}
