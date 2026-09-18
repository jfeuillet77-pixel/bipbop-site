# BipBop — Site d'affiliation batteries électroniques

Site statique **Astro 7** déployé sur Netlify. Domaine : **bipbop.eu**

## ⚠️ RÈGLE ABSOLUE — Source de vérité du design

**Les maquettes Claude Design du dossier `../Claude Design - MàJ/` sont la source de vérité
unique pour le contenu, la structure, le ton et le design de chaque page.**

> Le dossier `../Formulaire de périmètre et données/` est **périmé** (20 pages, Lot 1 d'origine).
> Ne jamais réimplémenter une page depuis ce dossier : aucune de ses 20 pages n'est identique à
> sa version actuelle, et 26 pages n'y existent pas.

### Ce qu'il faut faire

- **Reproduire FIDÈLEMENT** le contenu textuel, la structure HTML, les sections, le ton et les
  éléments visuels du fichier `.dc.html` correspondant lors de l'implémentation de chaque page.
- Chaque section, chaque paragraphe, chaque titre, chaque encart, chaque sidebar, chaque badge
  et chaque CTA doit être présent dans la page Astro telle qu'il apparaît dans le `.dc.html`.
- Le layout (nombre de colonnes, sidebar, grille, etc.) doit correspondre exactement au design.
- Conserver les **crochets `data-*`** du responsive : [design/crochets-responsive.md](design/crochets-responsive.md).

### Ce qu'il ne faut JAMAIS faire

- **Ne JAMAIS simplifier, résumer, réécrire ou réinventer** le contenu d'un fichier `.dc.html`.
- **Ne JAMAIS supprimer des sections** présentes dans le design.
- **Ne JAMAIS remplacer du contenu** par une version « plus courte » ou « plus simple ».
- **Ne JAMAIS prendre d'initiative** sur le contenu éditorial — tout vient du `.dc.html`.
- **Ne JAMAIS recopier un prix depuis une autre page** : il vient de `src/data/`.

### Pourquoi

Une implémentation approximative (page réécrite au lieu d'être reproduite fidèlement) oblige à
refaire le travail et fait perdre du temps et de l'argent. La priorité est la fidélité au
design, pas l'économie de tokens.

## La hiérarchie quand deux sources se contredisent

Énoncée par `Guide-Du-Projet` §02 : *« Un prix affiché sur une page doit toujours pouvoir être
retrouvé dans un de ces fichiers. Si les deux divergent, c'est la page qui a tort. »*

1. `src/data/modeles.json`, `accessoires.json`, `plan.json` — **les chiffres**, importés de
   `../Claude Design - MàJ/data/`
2. `../Claude Design - MàJ/<Page>.dc.html` — **le contenu, la structure, le design**
3. [design/ecarts-maquettes.md](design/ecarts-maquettes.md) — **les divergences déjà constatées
   entre les deux**, et ce que le site affiche. À lire avant de soupçonner un bug d'implémentation.

## Les documents de méthode (à lire avant d'écrire une page)

Trois maquettes ne sont pas des pages du site : elles expliquent **comment travailler**.

| Fichier | Apporte |
|---|---|
| `Brief-Responsive.dc.html` | le système de crochets `data-*`, les 3 paliers, la règle des tableaux |
| `Aide-Memoire-Mises-A-Jour.dc.html` | les conséquences inter-pages de chaque publication : 7 vérifications pour un avis, 5 pour un guide, 6 endroits où un prix apparaît, 5 contrôles de fin de séance |
| `Procedure-Mise-A-Jour-Prix.dc.html` | le rythme hebdomadaire, les seuils d'intervention, les 3 pièges de prix |

Aucun de ces trois, ni `Guide-Du-Projet`, `Design-System`, `Selection-Produits`,
`Brief-Mascotte`, `Assets-Mascotte`, ne doit être publié, apparaitre dans un sitemap ou dans la
navigation. Idem pour `support.js` et `doc-page.js` : c'est le moteur de l'outil de conception,
pas du code de production.

## Stack

- **Framework :** Astro 7 (`^7.3.2`) — sortie `static`
- **Hébergement :** Netlify (statique)
- **Domaines :** bipbop.eu (primaire), bipbop.fr (secondaire) — OVH
- **DNS :** Nameservers Netlify

## Correspondance maquette → route

**Elle n'est pas maintenue à la main** — c'est exactement le genre de table qui dérive.
La table de vérité est la colonne `permalien` de `data/plan-editorial.csv`, reprise dans
`src/data/plan.json` et exposée par `ROUTES` / `routeDeMaquette()` dans `src/data/produits.mjs`.

Sur les 811 liens internes que contiennent les maquettes, **toutes** les cibles sont couvertes
par cette table. Une nouvelle page doit y figurer avant d'être liée depuis une autre.

Règle d'écriture : `/section/slug/` avec barre oblique finale (règle S09), fichier
`src/pages/<section>/<slug>/index.astro`.

## Commandes

| Commande | Action |
|---|---|
| `npm run dev` | serveur de développement (localhost:4321) |
| `npm run data` | réimporte `modeles.json`, `accessoires.json`, `plan.json` depuis le dossier Claude Design, puis applique `design/prix-reperes.json` (les valeurs vérifiées en ligne après l'export de l'auteur) |
| `npm run build` | build de production dans `./dist/`, puis `scripts/sitemap.mjs` pose `dist/sitemap.xml` (`postbuild`) |
| `npm run sitemap` | régénère `dist/sitemap.xml` seul, sans rebuild |
| `npm run verif` | les 8 contrôles de fin de séance sur `dist/` (après un build) |
| `npm run prix` | le relevé hebdomadaire : relit les 31 modèles et les accessoires chez Thomann, Woodbrass et Donner Music, et sort la liste des écarts (`releves/prix-<date>.jsonl`) |
| `npm run check` | `build` + `verif` |
| `npm run preview` | prévisualiser le build |

`scripts/verif.mjs` contrôle dans l'ordre : liens internes, véracité des compteurs, cohérence
de chaque prix avec la source, uniformité de la navigation, largeur de défilement réelle dans
Chrome à 1024 / 900 / 768 / 390 px, fuites de notes internes, marqueurs de traçage, et longueur
des copies SEO (titles 50-60, descriptions 120-155 — les pages légales y figurent en exception
assumée, pas en angle mort). Son code de sortie est non nul s'il reste un problème :
c'est le garde-fou de chaque vague de publication.

```bash
npm run check                                          # tout le site
node scripts/verif.mjs /comparatif/ /avis/             # deux pages seulement
node scripts/test-comparatif.mjs                       # les 27 combinaisons du comparatif
node scripts/test-comparatif-nav.mjs                   # clics, URL, repli sans JS, dans Chrome
DIST="../Claude Design - MàJ" node scripts/verif.mjs   # auditer les maquettes elles-mêmes
```

## Structure

```
bipbop-site/
├── src/
│   ├── pages/          → une route = un dossier + index.astro
│   ├── layouts/        → BaseLayout : <head>, en-tête, pied, cookies, responsive.css
│   ├── components/     → Header, Footer, CookieBanner, mascotte/
│   ├── lib/            → moteur du comparatif, arborescence (plan du site + sitemap), gabarits partagés
│   ├── data/           → produits et plan éditorial, importés du dossier Claude Design
│   └── styles/         → global.css (variables) + responsive.css (les 3 paliers)
├── scripts/            → port.mjs, import-data.mjs, sitemap.mjs, verif.mjs, tests du comparatif
├── design/             → docs internes : crochets, écarts maquettes, mascotte
├── public/             → assets statiques + data/modeles.json servi au navigateur
└── dist/               → build
```

## Git

- Branche de travail : **dev** (push quotidien)
- Branche de production : **main** (merge en fin de cycle seulement, Netlify build à chaque push)
- Ne JAMAIS mettre de secret dans une URL de remote
- L'état du chantier, les arbitrages pris et ce qui reste à faire s'écrivent dans `JOURNAL.md`
