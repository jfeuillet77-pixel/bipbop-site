#!/usr/bin/env node
/**
 * balisage.mjs — le 9e contrôle de `verif.mjs`, isolé pour être testable.
 *
 * `verif.mjs` fait tout son travail à l'import : il lit `dist/`, imprime son rapport et sort
 * avec un code. On ne peut donc rien lui emprunter sans déclencher une séance de contrôle.
 * Ce module ne contient que la lecture d'un HTML et le jugement qu'on en tire — aucune sortie,
 * aucun `process.exit`, aucun accès au disque. `verif.mjs` l'appelle page par page, et
 * `tests/balisage.test.mjs` le passe sur des cas dont on connaît la réponse.
 *
 *   import { defautsDeBalisage } from './balisage.mjs';
 *   defautsDeBalisage(html)  ->  ['ligne 149 : </div> ferme une balise qui n'est pas ouverte', ...]
 */

/* 9. Balisage — trois défauts que les huit contrôles précédents laissaient passer. Les deux
   premiers constatés le 22/09/2026 sur /guides/ après un signalement de Jordane, le troisième
   trouvé par ce contrôle lui-même en cours d'écriture (voir plus bas).

   a) Une balise mal fermée. Un `</div>` en trop après « Par budget » fermait le cadre
      `max-width:1180px` de la page : « Par situation », « Par type de matériel », « Les bases »
      et le pied de page en sortaient — plus de fond crème, plus de largeur maximale, des marges
      comptées sur la fenêtre. Deux autres pages fermaient si mal leur bandeau cookies que le
      pied de page se retrouvait dedans, donc dans un `display:none`.

   b) Une balise bien comptée mais mal placée. Le `</div>` de la grille « Les bases » fermait
      après la troisième carte au lieu de la sixième : autant d'ouvertures que de fermetures,
      donc (a) ne voyait rien, mais les trois dernières cartes sortaient de la grille et
      s'étalaient sur toute la largeur. C'est le défaut que Jordane a vu en second, et c'est
      celui qui demande de regarder la structure, pas le compte.

   Le contrôle est statique : tout le style du site est en ligne dans l'attribut `style`, donc
   « cet élément est une grille » se lit dans le fichier. Pas de navigateur, pas de dépendance
   au poste — le filet tient là où le contrôle 5 s'abstient. */

const BALISES_VIDES = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
/* HTML referme ces balises tout seul (`<p>` devant un bloc, `<li>` devant un `<li>`). Les
   suivre produirait des écarts que le navigateur ne voit jamais : on ne juge que les éléments
   dont l'ouverture et la fermeture sont écrites à la main. */
const BALISES_IMPLICITES = new Set(['p', 'li', 'td', 'th', 'tr', 'thead', 'tbody', 'tfoot', 'colgroup', 'option', 'dt', 'dd']);
/* Le SVG a ses propres règles de fermeture et ses balises homonymes (`<title>`, `<a>`) :
   on saute le sous-arbre entier. Idem pour le contenu de `<script>` et `<style>`, où un
   `<div>` n'est qu'une chaîne de caractères. */
const OPAQUES = new Set(['svg', 'script', 'style']);

const CARTE = (style) => /border-radius:\s*1[0-9]px/.test(style) && /box-shadow:\s*[0-9]/.test(style) && /background:/.test(style);
const GRILLE = (style) => /display:\s*grid/.test(style);

/** Parcourt un HTML et rend { orphelines, ouvertes, racines } — l'arbre sert au volet (b). */
export function lireBalisage(html) {
  const JETON = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)(\/?)>/g;
  const orphelines = [];
  const pile = [];
  const racines = [];
  let opaque = null, profondeurOpaque = 0, ligne = 1, curseur = 0, dansBody = false;
  for (const m of html.matchAll(JETON)) {
    ligne += (html.slice(curseur, m.index).match(/\n/g) || []).length;
    curseur = m.index;
    if (m[0].startsWith('<!--')) continue;
    const fermante = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '', auto = m[4] === '/';

    if (opaque) {
      if (tag === opaque) profondeurOpaque += fermante ? -1 : auto ? 0 : 1;
      if (profondeurOpaque <= 0) opaque = null;
      continue;
    }
    if (tag === 'body') { dansBody = !fermante; continue; }
    if (!dansBody) continue;
    if (OPAQUES.has(tag) && !fermante && !auto) { opaque = tag; profondeurOpaque = 1; continue; }
    if (BALISES_VIDES.has(tag) || BALISES_IMPLICITES.has(tag) || auto) continue;

    if (!fermante) {
      const style = (attrs.match(/\sstyle="([^"]*)"/) ?? [])[1] || '';
      const noeud = { tag, style, ligne, enfants: [], parent: pile[pile.length - 1] || null };
      (noeud.parent ? noeud.parent.enfants : racines).push(noeud);
      pile.push(noeud);
    } else {
      const i = pile.map((n) => n.tag).lastIndexOf(tag);
      if (i === -1) orphelines.push({ ligne, tag });
      else pile.splice(i);
    }
  }
  return { orphelines, ouvertes: pile.map((n) => ({ ligne: n.ligne, tag: n.tag })), racines };
}

/** (b) une grille refermée trop tôt laisse ses dernières cartes en frères, pleine largeur. */
export function cartesHorsGrille(racines) {
  const sorties = [];
  const visiter = (noeud) => {
    const fratrie = noeud.enfants;
    for (let i = 0; i < fratrie.length; i++) {
      const el = fratrie[i];
      if (GRILLE(el.style) && el.enfants.some((c) => CARTE(c.style))) {
        let n = 0;
        while (i + 1 + n < fratrie.length && CARTE(fratrie[i + 1 + n].style)) n++;
        if (n) sorties.push({ ligne: el.ligne, dedans: el.enfants.filter((c) => CARTE(c.style)).length, dehors: n });
      }
      visiter(el);
    }
  };
  for (const r of racines) visiter({ enfants: [r] });
  return sorties;
}

/* (c) Un guillemet non échappé dans un attribut. Constaté le 22/09/2026 : cinq `alt` portaient
   un nom de produit en pouces — `alt="Millenium 14" Practice Pad"`. Le navigateur referme
   l'attribut sur le pouce, garde `alt="Millenium 14"` et fabrique deux attributs parasites
   (`practice`, `pad"`). Rien ne se voit à l'écran, mais le texte alternatif est tronqué : ce
   qu'entend un lecteur d'écran et ce qu'indexe Google s'arrêtent au milieu du nom. Le contrôle
   relit la zone d'attributs de chaque balise et refuse ce qui ne se découpe pas proprement. */
const ATTRIBUTS_SAINS = /^\s*(?:[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?\s*)*$/;

export function attributsMalFormes(html) {
  const mauvais = [];
  for (const m of html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>])*?)\/?>/g)) {
    const attrs = m[2].replace(/\/$/, '');
    if (ATTRIBUTS_SAINS.test(attrs)) continue;
    mauvais.push({ ligne: html.slice(0, m.index).split('\n').length, tag: m[1], extrait: m[0].replace(/\s+/g, ' ').slice(0, 96) });
  }
  return mauvais;
}

/**
 * Le jugement, en une fonction : rend la liste des défauts d'un document, vide s'il est sain.
 * Quatre défauts par famille suffisent à situer le problème — au-delà, c'est la même cause
 * qui se répète et la liste devient illisible.
 */
export function defautsDeBalisage(html) {
  const { orphelines, ouvertes, racines } = lireBalisage(html);
  const defauts = [];
  for (const o of orphelines.slice(0, 4)) defauts.push(`ligne ${o.ligne} : </${o.tag}> ferme une balise qui n'est pas ouverte`);
  for (const o of ouvertes.slice(0, 4)) defauts.push(`ligne ${o.ligne} : <${o.tag}> n'est jamais refermé`);
  for (const s of cartesHorsGrille(racines).slice(0, 4)) defauts.push(`ligne ${s.ligne} : grille refermée trop tôt — ${s.dedans} carte(s) dedans, ${s.dehors} laissée(s) dehors, pleine largeur`);
  for (const a of attributsMalFormes(html).slice(0, 4)) defauts.push(`ligne ${a.ligne} : attributs de <${a.tag}> mal découpés, guillemet non échappé — ${a.extrait}`);
  return defauts;
}
