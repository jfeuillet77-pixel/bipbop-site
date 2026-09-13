# Journal BipBop

## 13 septembre 2026 — Reprise sur « Claude Design - MàJ » : socle responsive, données, comparatif interactif

### Contexte
Jordane livre un nouveau dossier de conception, `Claude Design - MàJ/` : 46 maquettes (38 pages de
site + 8 documents internes, dont 3 écrits pour l'agent), une base produits et le comparatif
enfin dynamique. Il demande d'abord une analyse du dossier, puis lance la reprise sur le périmètre
**phases 0 + 1 + 2** : réparer la source, poser le socle, livrer le comparatif.

### Analyse préalable
Le dossier a été audité avec ses propres outils : les 5 contrôles de fin de séance de l'`Aide-Memoire`
§06 ont été passés au crible des 46 maquettes. Résultat : le dossier échoue à ses propres tests, et
les constats sont consignés dans `design/ecarts-maquettes.md`. Les deux plus lourds :

- **4 prix** de la liste d'attente du hub Avis contredisaient la source (dont Donner DED-300X à
  699,99 € au lieu de 539,99 €) — et les flux livrés dans `uploads/` ont permis de trancher sans
  sortir du dossier ;
- **`Avis-Donner-DED-200X.dc.html`** a un bloc responsive amputé (deux `!important` perdus, tout le
  palier 620 px de `data-rwd="def"` absent), et le bloc « à recopier tel quel » du `Brief-Responsive`
  §03 **n'est pas celui qui est livré** : il lui manque la sonde `html{--rwd:on}` que le §05 utilise
  pour vérifier que le bloc est actif.

### Ce qui a été fait

**Phase 0 — la source, pas les maquettes.** Corrigé dans `Claude Design - MàJ/data/` (qui est la
source de vérité, contrairement aux pages) : `modeles.json` passe en **version 2** avec l'empreinte
au sol réellement relevée chez Thomann et la valeur d'origine conservée sous `largeur_maquette` ;
les 2 lignes décalées de `plan-editorial.csv` sont reconstruites. Les `.dc.html` ne sont **pas**
modifiés — un export ultérieur de Claude Design les écraserait ; les 4 prix et les compteurs faux
sont donc traités côté implémentation et tracés dans le registre d'écarts.

**Phase 1 — le socle.**
- `src/styles/responsive.css` : les 3 paliers, en **un seul exemplaire**, importé par `BaseLayout`.
  Équivalence avec le bloc des 42 pages saines prouvée règle par règle (34 règles, ensembles identiques).
- Décision d'architecture : les 15 pages existantes sont en classes + variables, les maquettes en
  styles en ligne. **Les deux sont compatibles** avec les crochets (sélecteurs d'attributs +
  `!important`) : aucune conversion en inline, ce qui économisait un tiers du chantier.
- `scripts/import-data.mjs` : importe les 31 modèles, 126 accessoires et 64 entrées du plan.
  La jointure base ↔ sélection ne peut pas se faire par nom (14 libellés divergents, aucun id
  commun) : elle se fait par **URL produit**. 9 routes d'avis réécrites de `.dc.html` vers la route
  publique, via la colonne `permalien` du plan.
- `scripts/verif.mjs` : les 5 contrôles de l'`Aide-Memoire` §06 + la procédure `Brief-Responsive` §05,
  mesurés dans Chrome réel à 1024/900/768/390 px. `npm run check`. Un **6ᵉ contrôle** a été ajouté,
  que les maquettes ne prévoient pas : aucune note interne (`role_editorial`, `largeur_maquette`,
  rôles éditoriaux) ne doit se retrouver dans le build — le JavaScript Astro est bundlé puis
  téléchargé, donc une colonne interne importée dans un composant est publiée même si elle
  ne s'affiche jamais. Le vérificateur fouille `dist/` (HTML, JS, CSS, JSON, maps) sur ce point.
  Sensibilité vérifiée en le faisant tourner sur les maquettes : il y retrouve exactement les
  4 prix litigieux et le compteur 23/22, sans bruit parasite.
- `Header.astro` : crochets `data-pad data-hdr` / `data-nav`, CTA « Par où commencer ? » réservé au
  comparatif (37 pages sur 38 ont « Trouver ma batterie »), et cibles tactiles ≥ 44 px sous 860 px —
  le point que le brief laisse à la charge de l'intégration.
- `AGENTS.md` et `README.md` réécrits. Le README annonçait **Astro 5** : le projet est sous
  **Astro 7.3.2** (`package.json` et `node_modules` concordent). Il pointait aussi vers l'ancien
  dossier de design, et sa table de correspondance manuelle est remplacée par la table du plan.

**Phase 2 — le comparatif interactif.** Il fonctionne.
- `src/lib/comparatif.mjs` : portage de la classe `DCLogic` de la maquette. Les poids du score,
  les seuils et les formulations ne bougent pas — ils codent 7 règles de métier du design.
  Le `DCLogic` et les balises `sc-for`/`sc-if` ne tournent pas hors du moteur de conception :
  c'était une spécification de comportement, pas du code à copier.
- `src/lib/comparatif-ui.mjs` : un seul exemplaire du balisage, partagé par le rendu au build et
  par le navigateur. Ce qui s'affiche avant exécution du JS est ce que le JS afficherait.
- `src/pages/comparatif/index.astro` : état par défaut rendu **au build** (la page se lit et se
  référence sans JavaScript), puis hydraté. Statut dans l'URL `?b=&p=&u=`, rechargeable et partageable.
- Vérifié dans Chrome (`scripts/test-comparatif-nav.mjs`) : clics, `aria-pressed`, URL, « Recommencer »,
  rechargement à froid depuis une URL partagée, rendu sans JS. Les 27 combinaisons de réponses sont
  calculées et lisibles (`scripts/test-comparatif.mjs`).
- `src/lib/avis-livres.mjs` : le moteur ne lie un avis que si la page existe vraiment. La base en
  déclare 9, le site en publie 3 ; sans ça, le comparatif mettait 6 liens morts en ligne.

### Arbitrages pris

1. **Empreinte au sol** (demandé à Jordane, réponse : relevé marchand). 12 modèles sur 31 ont une
   « Surface au sol requise » dans le flux Thomann ; **10 des 12 contredisaient la base**, qui notait
   la largeur du rack et non l'encombrement. Les 19 autres n'ont **rien** dans les trois flux, y
   compris la Nitro Max : pour eux **aucun chiffre n'est affiché**, la carte montre les cymbales à la
   place, et le classement interne utilise la médiane des modèles relevés (120 cm) pour que l'absence
   de donnée ne favorise ni ne pénalise. Ce chiffre ne se voit jamais.
   **Effet mesuré** : 1er choix changé dans 3 cas sur 27, trio modifié dans 11. Dont l'état par défaut,
   qui passait de la Roland TD-02KV à la **Nitro Max** — donc rejoignait enfin le rôle éditorial que
   `selection-modeles.csv` lui attribue (« recommandation principale »). Avant correction, le moteur
   du comparatif contredisait le reste du site.
2. **Woodbrass** : 22 des 157 références (14 %) n'ont **aucun identifiant d'affiliation**. Décision :
   hors périmètre, porté tel quel, tracé ici et dans le registre.
3. **Corriger la source mais pas les maquettes** : voir phase 0.
4. `priorite` = « Moyenne » sur les deux lignes du plan reconstruites est **une supposition**, à
   confirmer par Jordane. Le champ est interne et ne se publie pas.

### État des contrôles à la fin de la session

`npm run check` sur les 16 pages actuelles : **liens au vert, prix au vert, navigation au vert**
sur les 15 pages Astro. Restent 3 compteurs faux sur `/avis/` (il annonce 3 avis publiés là où la
base en dit 9) et 8 pages qui dépassent encore à 390 px — **les deux sont attendus** : ce sont
précisément les pages à resynchroniser, avec leurs crochets `data-*`. `/comparatif/` passe les
quatre largeurs. Le 404 est un fichier HTML brut hors `BaseLayout` (pas de `data-nav`, 557 px à
390 px) : il repart dans la vague D.

### Ce qui reste à faire

- **Cibles tactiles** : `scripts/captures.mjs` en décompte **28 sous 44 px** sur `/comparatif/`
  (minimum 16 px) à 1200 px, 21 à 390 px. Seuls les liens de l'en-tête ont été traités. Les
  liens du pied de page, les intitulés de chiffres mono et les liens « L'avis → » des cartes sont
  les plus exposés. Le `Brief-Responsive` §06 laisse ce point à l'intégration : il est **à faire
  sur les 38 pages**, pas seulement sur l'en-tête.
- **Vague A** : 6 avis (`/avis/alesis-turbo-mesh`, `donner-ded-200x`, `millenium-mps-450`,
  `millenium-mps-750x`, `millenium-mps-850`, `yamaha-dtx432k`) — débloque les compteurs du hub Avis
  et les 6 liens que le comparatif attend.
- **Vague B** : 8 guides. **Vague C** : 6 « Les bases » + 2 duels. **Vague D** : 404 + hubs et
  Accueil avec les compteurs finaux.
- **Resync des 14 pages restantes** : crochets `data-*` + corrections de copy. Le delta est faible
  par page (bloc responsive, kit mascotte, bandeau cookies) mais touche 14 fichiers.
- **Grille des notes** : `discretion` et `module` sont des échelles 2→5 entrant dans le score,
  publiées sans grille. La règle I02 (« aucune note chiffrée sans grille explicitée ») l'exige —
  à arbitrer avec le design, probablement dans `Design-System` et sur `/comparatif/`.

### Pause de session
Phases 0, 1 et 2 terminées et vérifiées. Commit sur `dev`, poussé. **Pas de merge sur `main`** :
Netlify build à chaque push et la reprise n'est qu'à un tiers. Prochaine session : vague A.

## 13 septembre 2026 — Comparatif : diagnostic des filtres inactifs (aucune modification de code)

### Contexte
Jordane signale que les filtres de `https://bipbop.eu/comparatif/` ne fonctionnent pas et demande si c'est normal, quel serait le plan d'activation et ce que ça coûterait. Session purement analytique : lecture de code et de données, chiffrage. **Aucun fichier du site n'a été modifié.**

### Diagnostic — oui, c'est normal
La page est une maquette statique du Lot 1, pas une fonctionnalité cassée.

- Zéro `<script>` dans tout `src/`. Les 9 boutons `.filtre-option` portent une classe `selected` codée en dur dans `src/pages/comparatif/index.astro`.
- Les résultats sont écrits à la main (Nitro Max + DED-200X), d'où le compteur « 2 modèles sur 31 » figé.
- `Comparatif.dc.html` est lui aussi statique (uniquement `support.js` et un bloc meta) : Claude Design n'a jamais spécifié de comportement, donc la règle de fidélité au design ne bloque pas l'ajout de JavaScript.
- La page n'a aucun `@media`, alors que 9 autres pages du site en ont un. Grille de filtres figée à 3 colonnes, résultats figés à `1.35fr 1fr`.

### État des données
- `Formulaire de périmètre et données/data/selection-modeles.csv` contient **30** modèles (la page en annonce 31), avec seulement : segment, marque, modèle, prix, marchand, rôle, URL. Pas d'image, pas de specs, pas de texte éditorial.
- Dérivable des catalogues locaux (`Archives/`) : le segment prix, la présence de peaux maillées et du Bluetooth. Les 20 modèles Thomann de la sélection y sont tous, avec des descriptions de 540 à 1 900 caractères.
- **Non dérivable : l'encombrement.** Aucune description des catalogues locaux ne contient de dimensions. Le filtre « Tu la mets où ? » exige donc soit de consulter les 30 fiches produit en ligne, soit d'accepter un critère approché.
- Le tag « 1,10 m de large » affiché sur la Nitro Max n'est sourcé nulle part : il vient du design, il est à vérifier.

### Trois options chiffrées
Base tarifaire vérifiée sur la grille officielle Alibaba Cloud Model Studio (qwen3.7-plus, région International, palier ≤ 256K) et le taux BCE du 10/09/2026. Hypothèse : ~85 % des tokens d'entrée servis par le cache.

| Option | Périmètre | Tokens cumulés | Coût avec cache | Plafond sans cache |
|---|---|---|---|---|
| 1 | Filtre budget seul actif, filtres 2 et 3 neutralisés | 0,6 – 1,2 M | 0,09 – 0,16 € | 0,22 – 0,44 € |
| 2 | Trois filtres, encombrement approché depuis les catalogues locaux | 2 – 3,5 M | 0,28 – 0,48 € | 0,73 – 1,28 € |
| 3 | Trois filtres, encombrement vérifié sur les 30 fiches en ligne | 4 – 7 M | 0,52 – 0,89 € | 1,44 – 2,50 € |

Les 30 consultations de fiches produit de l'option 3 pèsent 150 à 450 k tokens de lecture, soit 0,05 à 0,15 €. C'est du volume, pas de l'argent : l'écart entre les options se compte en euros. Le vrai critère de choix est le risque éditorial d'afficher des encombrements non vérifiés. Recommandation : option 1 puis option 2.

Ces chiffres sont un plancher. L'audit de 44 fichiers mené auparavant avait coûté ~25 $ avec 7 agents, bien au-dessus de ce que ce barème donnerait à volume équivalent — prévoir 3 à 5× par prudence.

### Arbitrages en attente de Jordane
- Le mapping exact des filtres « Tu la mets où ? » et « Tu veux faire quoi ? » vers des attributs produit réels. Ces deux filtres sont des questions marketing sans règle de correspondance définie.
- Un modèle sans avis rédigé a-t-il droit à une carte complète ou à une simple mention ?

### Ce qui rend ce plan en partie caduc
Le 13 septembre, Jordane annonce avoir utilisé Claude Design pour corriger plusieurs choses, **ajouter le JavaScript** et optimiser la version mobile du site, et vouloir incorporer tout ça. Rien n'était encore déposé dans le dépôt à la clôture de cette session (working tree propre, aucun fichier modifié depuis le 11 au soir).

Conséquence : ne pas réimplémenter la logique de filtrage ni le responsive depuis zéro. Récupérer et lire d'abord les nouveaux fichiers `.dc.html`, puis intégrer. Seuls le jeu de données (images, specs, phrases BipBop pour 30 modèles) et la question de l'encombrement restent valables quel que soit le code livré.

### Pause de session
Entrée de journal commitée sur `dev`. **Non mergée sur `main`** : la modification est purement documentaire, il n'y a rien à voir en ligne, et un push sur `main` déclencherait un build Netlify pour rien. Le chantier comparatif reste en attente des fichiers Claude Design de Jordane.

---

## 11 septembre 2026 — Chantier mascotte, passe 1 : le kit de marque en place

### Contexte
Brief-Mascotte.dc.html lancé le 11 septembre. Trois croquis de direction dessinés (design/mascotte/croquis/), puis Jordane partage Assets-Mascotte.dc.html : le kit de marque officiel qui fixe le personnage, les six fichiers SVG et leurs neuf emplacements. Les croquis deviennent sans objet, le kit arbitre.

### Ce qui a été fait
- Six fichiers SVG recopiés à la géométrie exacte du kit dans `public/` : bipbop-mascotte, bipbop-avatar, bipbop-tete, bipbop-mono, bipbop-marque, bipbop-marque-claire. Contour porté par le groupe racine (encre, épaisseur 10/11/6), aucun attribut id.
- Six composants Astro dans `src/components/mascotte/` : le kit impose l'inclusion en ligne dans le HTML, pas de balise image.
- Emplacements branchés : en-tête 34 px (marque), pied de page 32 px (marque claire), favicon SVG + apple-touch-icon PNG 180 px généré, signature d'article 44 px (avatar), encart « BipBop dit » 52 px bordure jaune, hero accueil 96 px, comparatif 76 px, À propos rectangle 120 × 152 (corps entier), 404 rectangle 200 × 250 avec ombre dure et bulle, bandeau contact en version claire.
- favicon.ico régénéré à la marque (c'était encore le logo Astro).
- Anciens fichiers mascotte-*.svg et favicon.svg supprimés, plus aucune référence.
- `design/mascotte/mascotte-usages.csv` : le tableau des emplacements. Le kit annonçait data/mascotte-usages.csv mais le fichier n'a pas été livré ; reconstruit depuis la section 02 du kit.

### Arbitrages à revoyer par Jordane
- À propos et 404 : les maquettes .dc.html montrent un cercle placeholder, le kit impose un rectangle arrondi (le personnage est plus haut que large). Suivi le kit.
- Encart « BipBop dit » : bordure jaune (maquette) sur fond jaune (kit), les deux sources divergeaient sur le fond.
- Le comparatif fait dire à BipBop « Je teste des batteries toute la journée » : contraire au brief (il collecte, il ne teste pas). Copie hors périmètre de cette passe, signalé, non modifiée.

### Reste à produire (passe 2)
- Les quatre poses : perplexe (404), approbatrice (badge « notre choix »), au travail (À propos), en train de parler (encart). En attendant, la pose neutre occupe ces emplacements, sans simulation par rotation ou déformation (règle 04 du kit).
- Les règles d'usage (taille minimale, zone de protection, fonds autorisés et interdits).
- L'image de partage 1200 × 630.

### Pause de session
Passe 1 commitée sur `dev`, mergée sur `main` et déployée le 11 septembre 2026 pour revue. La passe 2 reprendra dans une prochaine session : tout le contexte nécessaire est dans cette entrée, dans `design/mascotte/mascotte-usages.csv` et dans les deux fichiers Claude Design (`Brief-Mascotte.dc.html`, `Assets-Mascotte.dc.html` à la racine du projet).

---

## 11 septembre 2026 — Lot 1 terminé et déployé

### Ce qui a été fait
- Création du projet Astro 5 dans `bipbop-site/`
- Implémentation du Design System (CSS variables, Bricolage Grotesque + Work Sans + IBM Plex Mono)
- 16 pages du Lot 1 implémentées :
  - Accueil, Comparatif interactif
  - Hub Avis + 3 avis (Alesis Nitro Max, Millenium MPS-150X, Roland TD-02KV)
  - Hub Guides + 2 guides (Appartement, Moins de 500 €)
  - Duel Nitro Max vs DED-200X
  - Les Bases Pad Mesh
  - À propos, Contact, Mentions légales, Politique confidentialité, 404
- Dépôt GitHub créé : github.com/jfeuillet77-pixel/bipbop-site
- Déploiement Netlify : bipbop.netlify.app (public)
- Domaine bipbop.eu connecté (DNS vérifié, HTTPS activé)
- www.bipbop.eu en propagation DNS
- noindex + robots.txt bloquant en place (phase de test)

### Décisions
- Canonical : bipbop.eu (non-www), www redirige en 301
- Stack : Astro 5 + Netlify (statique)
- Liens affiliés Thomann : offid=1&affid=3711

---

## 11 septembre 2026 — Audit de fidélité au design Claude Design

### Problème
La page "À propos" publiée ne correspondait pas au design Claude Design — elle avait été simplifiée/réécrite au lieu d'être reproduite fidèlement. Jordane a demandé un audit complet de toutes les pages.

### Règle mise en place
**Règle absolue** : les fichiers `Formulaire de périmètre et données/*.dc.html` sont la source de vérité unique. Ne JAMAIS simplifier, résumer ou réinventer le contenu. Documentée dans le README.md et en mémoire.

### Audit complet — 16 pages vérifiées par lots de 2

| Lot | Pages | Résultat |
|---|---|---|
| 1 | Accueil, Comparatif | ✅ Déjà conformes |
| 2 | Hub Avis, Avis Nitro Max | Hub Avis ❌ → corrigé. Avis Nitro Max ✅ |
| 3 | Avis MPS-150X, Avis TD-02KV | ❌ Les deux → corrigés (contenu inventé, sections absentes, notes wrong) |
| 4 | Hub Guides, Guide Appartement | ❌ Les deux → corrigés (structure, images, FAQ, budget, checklist absents) |
| 5 | Guide Moins 500 €, Duel | ❌ Les deux → corrigés (tableaux, sections, sidebar absents) |
| 6 | Les Bases Pad Mesh, Contact | ❌ Les deux → corrigés (encarts, tableaux, formulaire, sidebar absents) |
| 7 | Mentions Légales, Politique Confidentialité | ❌ Les deux → corrigés (tableaux, sections, encarts absents) |
| 8 | 404 | ❌ Manquante → créée (404 géant, mascotte, pages utiles) |

### Résultat
- **13 pages réécrites** pour reproduire fidèlement les designs Claude Design
- **1 page créée** (404)
- **2 pages déjà conformes** (Accueil, Comparatif)
- **1 page déjà conforme** (Avis Nitro Max)
- Merge sur `main`, déployé sur Netlify

---

## À faire ensuite (Lot 2 — 4-8 semaines)

### Pages restantes du plan éditorial (38 pages)
- Guide < 300 €
- Guide < 1 000 €
- Guide enfant 6-12 ans
- Guide adulte qui débute
- Pack complet prêt à jouer
- Mesh vs caoutchouc
- Électronique vs acoustique
- Acheter d'occasion
- Avis Yamaha DTX432K
- Avis Donner DED-200X
- Avis Millenium MPS-450
- Avis Millenium MPS-750X
- Avis Millenium MPS-1000
- Avis Alesis Nitro Pro
- Avis Alesis Nitro Ultimate
- Avis Alesis Turbo Mesh
- Avis Yamaha DTX402K
- Avis Roland TD-02K
- Avis Nux DM-110
- Avis Woodbrass DDX50-Mesh
- Duel Nitro Max vs TD-02KV
- Duel MPS-150X vs Turbo Mesh
- Hub duels
- Hub les bases
- Casque pour batterie électronique
- Tapis de batterie
- Siège de batterie
- Baguettes pour débutants
- Brancher sa batterie à un PC
- Enregistrer sa batterie
- Choisir ses premiers cours
- Batterie pour gaucher
- Entretenir sa batterie électronique
- Comparatif complet (tous les modèles)
- Page sélection produits
- Guide du projet
- Design system (page publique)
- Brief mascotte

### Retraits du noindex
Quand le site est prêt pour le SEO :
1. Retirer `<meta name="robots" content="noindex, nofollow">` de BaseLayout.astro
2. Remplacer public/robots.txt par :
   ```
   User-agent: *
   Allow: /
   Sitemap: https://bipbop.eu/sitemap-index.xml
   ```
3. Générer un sitemap (plugin Astro ou manuel)

### Champs à compléter avant publication SEO
- Mentions légales : adresse postale, SIREN, TVA, email (surlignés en jaune dans le design)
- Politique confidentialité : nom raison sociale, email, hébergeur, outil analytics (surlignés en jaune)
