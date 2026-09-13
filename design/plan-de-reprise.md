# Plan de reprise — état du chantier au 13 septembre 2026

**Objectif acté par Jordane : publier la totalité des pages désignées par Claude Design.**
Soit **38 pages de site** (les 8 autres fichiers du dossier sont des documents internes, ils ne
se publient pas).

## Où on en est

| | Nombre | État |
|---|---|---|
| Pages de site publiées | **21 / 38** | dont 6 livrées aujourd'hui |
| Pages identiques à leur maquette au segment près | **6 / 21** | les 6 avis de la vague A |
| Pages à créer | **17** | listées ci-dessous |
| Pages existantes à resynchroniser | **15** | crochets responsive + deltas de texte |

Le site est toujours en **phase de test** : `noindex, nofollow` actif sur les 38 routes,
`public/robots.txt` bloquant. À retirer à l'ouverture SEO, pas avant.

## Ce qui bloque la mise en ligne complète

Trois familles de travail, dans l'ordre où les mener.

### 1. Créer les 17 pages qui manquent

**8 guides** — gabarit `Guide` (colonne de lecture + sommaire collant) :

```
/guides/acheter-occasion                     Guide-Acheter-Occasion.dc.html
/guides/batterie-adulte-debutant             Guide-Adulte-Debutant.dc.html
/guides/batterie-electronique-enfant         Guide-Enfant.dc.html
/guides/batterie-moins-1000-euros            Guide-Moins-De-1000-Euros.dc.html
/guides/enregistrer-sa-batterie              Guide-Enregistrer-Sa-Batterie.dc.html
/guides/faire-evoluer-sa-batterie            Guide-Faire-Evoluer-Sa-Batterie.dc.html
/guides/meilleure-batterie-moins-300-euros   Guide-Moins-De-300-Euros.dc.html
/guides/pack-complet                         Guide-Pack-Complet.dc.html
```

**6 « Les bases »** — gabarit `Article informationnel` :

```
/les-bases/combien-de-temps                  Les-Bases-Combien-De-Temps.dc.html
/les-bases/electronique-ou-acoustique        Les-Bases-Electronique-Ou-Acoustique.dc.html
/les-bases/installer-sans-deranger           Guide-Installer-Sans-Deranger.dc.html   ← nommé « Guide » dans le dossier, classé « Les bases » par le plan
/les-bases/quel-casque                       Les-Bases-Quel-Casque.dc.html
/les-bases/seul-ou-prof                       Les-Bases-Seul-Ou-Prof.dc.html
/les-bases/tapis-batterie                    Les-Bases-Tapis-Batterie.dc.html
```

**2 duels** — gabarit `Duel` :

```
/duels/mps-150x-vs-turbo-mesh                Duel-Millenium-MPS-150X-vs-Alesis-Turbo-Mesh.dc.html
/duels/nitro-max-vs-td-02kv                   Duel-Alesis-Nitro-Max-vs-Roland-TD-02KV.dc.html
```

**Le 404** — `src/pages/404.html` est un fichier HTML brut, hors `BaseLayout` : pas de navigation,
pas de CSS responsive, 557 px de large à 390 px. À porter en `404.astro`.

### 2. Resynchroniser les 15 pages héritées

Elles viennent de l'ancienne livraison. Deux écarts de nature différente :

**a) Crochets responsive absents** — 8 pages dépassent encore à 390 px (mesuré dans Chrome) :
`/`, `/avis/alesis-nitro-max/`, `/avis/millenium-mps-150x/`, `/avis/roland-td-02kv/`,
`/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/guides/batterie-appartement/`,
`/guides/meilleure-batterie-moins-500-euros/`, `/les-bases/pad-mesh/`.
Il faut poser les `data-rwd` / `data-pad` / `data-mar` / `data-big` / `data-sticky` / `data-hdr`
sur chaque grille, marge et gros titre. Voir `design/crochets-responsive.md`.

**b) Textes qui ont bougé entre les deux versions de Claude Design** — le contrôle de fidélité
les nomme un par un (`npm run fidelite`). Constats déjà établis :

- `/les-bases/pad-mesh/` : « Douze modèles passés en revue » → la maquette dit « Neuf » ;
- `/guides/batterie-appartement/` : plaque de mousse 25 € → **55 €**, « si plancher sensible »
  → « si étage » ;
- les 3 avis publiés + `/contact/` + `/a-propos/` + légaux : encart « aller au comparatif »
  changé de libellé et de phrase ;
- `/guides/` : hub à 3 guides, la maquette en annonce 11 ; `/avis/` : hub à 3 avis, 9 existent.

### 3. Clôture de la vague A, en attente

Le **hub `/avis/`** n'est pas encore porté. Deux contraintes découvertes en l'ouvrant :

- ses 9 cartes portent **leur propre texte**, différent du champ `phrase` de `modeles.json`
  (comparé sur 8 cartes : toutes différentes). Structure et compteurs viennent des données,
  le texte vient de la maquette du hub ;
- sa liste d'attente affiche **14 lignes pour 22 modèles sans avis** : 8 phrases manquent.
  **Ne pas les inventer.** Option retenue par défaut : garder 14 lignes, titre « Les 14 avis en
  préparation », badge de tête corrigé à « 9 publiés · 22 au programme ».

## Questions ouvertes, à trancher par toi (pas par moi)

1. **Grille de notation** — les 9 avis affichent une note `/10` et **aucune grille n'existe**
   dans les 46 fichiers. Règle I02 du guide-agent : aucune note chiffrée sans grille explicitée.
   Pareil pour les échelles `discretion` et `module` de la base, qui entrent dans le score du
   comparatif. Fournir la grille, ou retirer les notes.
2. **Définition de l'empreinte au sol** — `MPS-750X` et `MPS-850` publient « 140 × 90 » et
   « 150 × 100 » en disant « siège compris », là où Thomann garantit 140 × 80 et où le
   comparatif affiche la mesure du marchand. Deux définitions coexistent sur le même site.
3. **Faute dans la DED-200X** — « Deux cymbales de crash au lieu **d** une », sans apostrophe.
   Un caractère, à corriger dans Claude Design ou ici.
4. **Priorité des lignes P24/P25** du plan éditorial — j'ai mis « Moyenne » par déduction après
   avoir réparé le décalage de colonnes. Champ interne, non publié.
5. **22 URLs Woodbrass sans identifiant d'affiliation** (14 % du catalogue) — hors périmètre
   décidé ce jour, mais c'est du revenu qui ne se capte pas.

## Dans quel ordre finir

1. Clôture vague A : hub Avis + les 3 avis existants resynchronisés. **Débloque les 3 compteurs
   faux** et le seul point encore incohérent visible par un lecteur.
2. Vague B : les 8 guides (gabarit commun, le plus gros bloc).
3. Vague C : 6 « Les bases » + 2 duels.
4. Vague D : 404 + hubs Guides et Accueil + **resync des 8 pages sans crochets**, avec les
   compteurs finaux partout.
5. Retirer le `noindex` et ouvrir `robots.txt` — seulement quand les 38 pages sont là et que
   `npm run check` et `npm run fidelite` sortent tous les deux au vert.

## Comment reprendre techniquement

```bash
cd bipbop-site
git checkout dev && git pull
npm ci                    # astro 7.3.2, puppeteer-core (Chrome du système, rien à télécharger)
npm run check             # build + les 6 contrôles de fin de séance
npm run fidelite          # chaque page contre sa maquette, segment par segment
npm run data              # relance l'import si data/ du dossier Claude Design a bougé
```

`npm run check` sort en échec aujourd'hui, **c'est normal et voulu** : 12 problèmes restants =
3 compteurs du hub Avis + 1 navigation de 404 + 8 pages sans crochets. Chacun correspond à une
ligne du plan ci-dessus. Le jour où il sort au vert, le site est publiable.

Le dossier `Claude Design - MàJ/` **n'est dans aucun dépôt git** : les corrections apportées à
`data/modeles.json` (version 2, empreintes relevées) et `data/plan-editorial.csv` (2 lignes
reconstruites) n'ont d'autre filet que les copies `.avant-phase0` posées à côté. Si tu ré-exportes
le dossier depuis Claude Design, **relis `design/ecarts-maquettes.md` avant de réimporter** :
il garde la trace de ce qui avait été corrigé ici et qui disparaîtrait.
