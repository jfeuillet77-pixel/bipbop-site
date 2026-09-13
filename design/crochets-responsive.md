# Crochets responsive — la convention obligatoire

Source : `Brief-Responsive.dc.html` (Claude Design, 11 septembre 2026), condensée ici pour
qu'un contributeur n'ait pas à ouvrir une maquette de 45 ko pour écrire une page.
Le CSS vit dans `src/styles/responsive.css`, importé **une seule fois** par `BaseLayout`.
Ne l'édite pas pour une page : il doit rester identique partout.

## Pourquoi des attributs et pas des classes

Les styles du design sont écrits **en ligne** (`style="grid-template-columns:repeat(3,1fr)"`).
Le navigateur réécrit cette chaîne à la sérialisation (`repeat(3, 1fr)`, avec espaces), donc un
sélecteur qui cherche le contenu de `style` ne matche **jamais** rien. C'est ce qui fait échouer
la plupart des tentatives de responsive sur ce site. On cible donc des attributs `data-*` posés
dans le balisage, et jamais le style.

Conséquence pratique : nos pages utilisent des classes (_variables_ de `global.css`), les
maquettes utilisent des styles en ligne. **Les deux sont compatibles** avec les crochets, parce
que les règles du palier portent `!important`. Il ne faut donc pas convertir les pages en inline.

## Trois paliers, pas plus

Au-delà de **1080 px**, rien ne change : c'est le dessin d'origine, au pixel près.

| Palier | Ce qui se passe |
|---|---|
| **1080 px** | deux colonnes asymétriques → une ; sommaires collants décollés ; pied de page 4 → 2 ; marges 40 → 26 |
| **860 px** | grilles de 3 → 2 ; gros titres 56 → 34 ; en-tête et nav se replient ; marges → 18 |
| **620 px** | tout sur une colonne ; marges → 14 ; titres encore d'un cran |

## Les seize crochets

| Crochet | Sur quoi | Effet |
|---|---|---|
| `data-rwd="tblrow"` | chaque ligne de tableau, en-tête compris | `min-width` 620 puis 540 px. Une ligne ne se replie jamais. |
| `data-rwd="tbl"` | le cadre qui contient les lignes | défilement horizontal ; ne touche ni bordure ni arrondi |
| `data-rwd="sp"` | deux colonnes asymétriques (sommaire + texte, bandeau + visuel) | une colonne à 1080 |
| `data-rwd="sp2"` | deux colonnes égales, blocs de fin de page | une colonne à 860 |
| `data-rwd="c3"` | grille de trois cartes | 3 → 2 à 860 → 1 à 620 |
| `data-rwd="c4"` | quatre cartes ou quatre chiffres | 4 → 3 à 1080 → 1 à 620 |
| `data-rwd="c5"` | cinq ou six éléments | idem `c4` |
| `data-rwd="foot"` | la grille du pied de page | 4 → 2 à 1080 → 1 à 620 |
| `data-rwd="mini"` | colonne fixe étroite (numéro + texte, portrait + texte) | une colonne à 620, alignée à gauche |
| `data-rwd="def"` | tableau de définition : terme à gauche, explication à droite | garde ses deux colonnes jusqu'à 620, puis une colonne **et ses deux cellules d'en-tête disparaissent** : empilées, elles ne rattachent plus à rien |
| `data-sticky` | tout élément en position collante | redevient statique sous 1080. Un sommaire collant bloque la lecture sur téléphone. |
| `data-pad` | tout élément dont la marge **intérieure** horizontale vaut 40 px | 40 → 26 → 18 → 14. Les valeurs verticales ne bougent pas. |
| `data-mar` | tout élément dont la marge **extérieure** horizontale vaut 40 px | même progression |
| `data-big="a\|b\|c\|d"` | tout titre ou chiffre de 26 px et plus | `a` ≥ 100 px, `b` 46-99, `c` 34-45, `d` 26-33 ; chacun son palier de réduction |
| `data-hdr` | la barre d'en-tête | se replie sur deux lignes à 860 ; le bouton reste sur une ligne |
| `data-nav` | la liste des liens de navigation | se replie, écart 16 px à 860 |

## La règle des tableaux

Un comparatif de six colonnes replié sur une colonne devient une bouillie de chiffres sans
en-tête : le lecteur ne sait plus quelle valeur appartient à quel modèle.

- **3 colonnes ou moins** : peut se replier.
- **4 colonnes ou plus** : **doit défiler** (`tbl` sur le cadre, `tblrow` sur chaque ligne).
- Ne **jamais** forcer un comparatif produit sur une colonne.

## Ce que les maquettes ne couvrent pas

Le brief les laisse à la charge de l'intégration ; elles sont déjà en place dans `BaseLayout`
et `Header`, à reproduire sur toute nouvelle page :

1. `viewport` = largeur de l'appareil, échelle initiale 1. Sans elle tout le reste est perdu.
2. **Cibles tactiles ≥ 44 px** de haut pour tout lien et tout bouton (les plus exposées : liens
   du pied de page et des sommaires). Traité dans `Header.astro` sous 860 px.
3. **Rien qui dépende du survol** : un téléphone n'a pas de curseur.
4. Un essai sur un vrai téléphone, en plus des mesures.

## Comment on vérifie

`npm run check` (build + `scripts/verif.mjs`) mesure chaque page dans Chrome à **1024, 900, 768
et 390 px** et contrôle :

- `documentElement.scrollWidth == clientWidth` — si ça défile, la page est cassée, même si elle a
  l'air correcte à l'œil ;
- la sonde `getComputedStyle(html)['--rwd']` vaut bien `on` sous 1080 px et rien au-dessus
  (une page peut sembler adaptée alors que le bloc n'a jamais été appliqué) ;
- le coupable est rapporté par sa largeur : dans ce projet, c'est **toujours** une grille à
  colonnes fixes qui n'a pas reçu son crochet.
