# Écarts entre les maquettes Claude Design et le site

Chaque ligne : une divergence **constatée**, sa preuve, et ce que le site affiche.
Le site suit les fichiers de `data/`, jamais une page : c'est écrit noir sur blanc dans
`Guide-Du-Projet` §02 — *« Un prix affiché sur une page doit toujours pouvoir être retrouvé
dans un de ces fichiers. Si les deux divergent, c'est la page qui a tort. »*

Maquettes : dossier `Claude Design - MàJ/` du 13 septembre 2026.
Rien ici n'est une simplification du design : ce sont des chiffres que la maquette contredit
avec sa propre source de vérité.

## 1. Quatre prix de la liste d'attente du hub Avis

Constat dans `Avis.dc.html`, section « Les 14 avis en préparation ». Vérifiés dans les flux
livrés sous `uploads/`.

| Modèle | Maquette | Source de vérité | Flux |
|---|---|---|---|
| Millenium HD-120 E-Drum Set | 198 € | **219 €** | `catalogue-batteries-electroniques-fa78e8dd.csv`, 219,00 |
| Alesis Nitro Pro | 599 € | **698 €** | même flux, 698,00 |
| Donner DED-300X | 699,99 € | **539,99 €** | `catalogue-donner…csv`, courant 539.99 (barré 899.99, règle I05 : ne jamais le reprendre) |
| Yamaha DTX6K2-X | 1 199 € | **1 198 €** | même flux Thomann, 1198,00 |

Le site affiche la colonne « Source de vérité ».

## 2. Trois compteurs incompatibles sur `Avis.dc.html`

- Badge de tête : « 9 AVIS PUBLIÉS · **23** AU PROGRAMME ». 9 + 23 = 32, pour 31 modèles.
- Intitulé de section : « Les **14** avis en préparation », et le tableau affiche 14 lignes.
- La base dit **22** modèles sans avis (31 − 9). **8 sont absents du tableau** :
  DED-70, DTX452K, DED-200 Pro, Nitro Pro XL, MPS-750X Pro, BackBeat, TD313, Strata Club.

Le site affiche « 9 avis publiés · 22 au programme » et les 22 lignes.

## 3. Empreinte au sol : 10 valeurs de la base contredites par le marchand

`data/modeles.json` notait une `largeur` unique, sans source. Le flux Thomann donne une
**surface au sol requise** en deux dimensions, qui inclut la pédale et la charley : ce n'est
pas la même mesure, et c'est bien celle dont le lecteur a besoin pour sa chambre.

| Modèle | Base | Thomann | Retenu |
|---|---|---|---|
| Millenium MPS-150X Mesh | 110 cm | **140 × 80** | 140 |
| Millenium MPS-750X Mesh | 125 cm | **140 × 80** | 140 |
| Millenium MPS-850 | 130 cm | **140 × 80** | 140 |
| Yamaha DTX6K2-X | 130 cm | **140 × 100** | 140 |
| Roland TD-02K | 100 cm | **120 × 80** | 120 |
| Roland TD-02KV | 100 cm | **120 × 80** | 120 |
| Millenium HD-120 | 105 cm | **100 × 60** | 100 |
| Yamaha DTX432K | 105 cm | **100 × 100** | 100 |
| Yamaha DTX452K | 110 cm | **100 × 100** | 100 |
| Alesis Turbo Mesh Kit | 105 cm | **110 × 80** | 110 |

Deux valeurs concordantes conservées sans changement : Rookie (100 × 50), MPS-450 (120 × 80).

**19 modèles sur 31 n'ont aucune empreinte** dans les trois flux (10 chez Thomann, dont la
**Nitro Max**, recommandation principale du site ; 6 Donner ; 3 Woodbrass). Pour eux :

- **aucun chiffre d'encombrement n'est affiché**, nulle part ;
- la carte de résultat montre les **cymbales** à la place de la ligne « EMPREINTE AU SOL » ;
- pour le seul classement interne, ils sont notés à la **médiane des modèles relevés (120 cm)**,
  pour que l'absence de donnée ne favorise ni ne pénalise personne. Ce chiffre ne se voit jamais.

La valeur d'origine de la maquette est conservée dans chaque enregistrement sous
`largeur_maquette` : rien n'est détruit, tout est rouvrable.

**Effet mesuré sur le comparatif** (27 combinaisons de réponses) : le premier choix change dans
**3 cas sur 27**, le trio de tête dans 11. Dont l'état par défaut, qui passait de la Roland
TD-02KV à l'**Alesis Nitro Max** — c'est-à-dire qu'il rejoint enfin le rôle éditorial que
`selection-modeles.csv` attribue à la Nitro Max (« Avis complet ✓ · recommandation principale »).
Avant la correction, le moteur du comparatif contredisait le reste du site.

## 4. Bloc responsive : quatre versions différentes

`Brief-Responsive` §03 affirme que le bloc « est identique sur les vingt-quatre pages livrées »
et donne un bloc à recopier « tel quel ». En réalité :

- **42 pages** portent le bloc canonique (34 règles) ;
- **3 documents internes** y ajoutent une règle `data-rwd="def"` au palier 1080 px ;
- **`Avis-Donner-DED-200X.dc.html`** a perdu deux `!important` et tout le palier 620 px
  de `data-rwd="def"` : sa table de définition restera sur deux colonnes sur un téléphone ;
- **le bloc documenté au §03 n'est pas celui qui est livré** : il lui manque `html{--rwd:on}`,
  la sonde par laquelle le §05 étape 3 dit de vérifier que le bloc est actif. Recopier le §03
  à la lettre rendrait donc la procédure de contrôle inapplicable.

Le site importe **le bloc réellement livré** (celui des 42 pages), une seule fois, depuis
`src/styles/responsive.css`. Les divergences ci-dessus disparaissent par construction.

## 5. Inventaire périmé dans `Guide-Du-Projet.dc.html`

Le texte annoncé « 32 fichiers · 16 à publier · 57 règles · 61 pages dont 17 publiées »
ne décrit pas la livraison reçue : **46 maquettes · 38 pages de site · 61 règles ·
64 entrées dont 40 publiées**. Seule page du dossier à faire l'inventaire du dossier.

## 6. Deux lignes décalées dans `plan-editorial.csv`

P24 (Quel casque) et P25 (Tapis) omettaient deux colonnes (`gabarit` et `priorite`) avec deux
champs vides en fin de ligne : le maillage sortant tombait dans `priorite`. Corrigées sur place ;
`gabarit` = « Article informationnel » (convention des autres lignes), `priorite` = « Moyenne »
**— cette priorité est une supposition de notre part, à confirmer.**

## 8. Deux découvertes faites en portant la vague A

**a) Le hub Avis écrit ses propres phrases.** Les 9 cartes du hub ne reprennent **pas** le champ
`phrase` de `modeles.json` — celui-ci sert au comparatif. Exemple, Millenium MPS-150X :

- carte du hub : « Le mesh au prix plancher. Le module est pauvre, le toucher ne l'est pas »
- `modeles.json` : « Tous les fûts en mesh à 298 €, avec une caisse claire de 10 pouces. »

Les huit cartes comparées sont toutes différentes, et pas seulement de ponctuation. Le hub porte
donc un texte éditorial qui n'existe nulle part ailleurs : il ne peut pas être déduit de la base,
et la base ne peut pas le remplacer. Conséquence pour le portage du hub : **la structure et les
compteurs viennent des données, le texte vient de la maquette du hub.**

**b) Deux pages disent une empreinte que le marchand ne donne pas.** `Avis-Millenium-MPS-750X`
écrit « 140 × 90 cm » et `Avis-Millenium-MPS-850` « 150 × 100 cm », quand la fiche Thomann de ces
deux modèles indique **140 × 80** dans les deux cas. Deux pages sur deux, dans le même sens, et
toujours avec la mention « siège compris » : ce n'est pas une faute de frappe isolée mais une
**définition différente** — l'encombrement mesuré avec le siège, la batterie étant posée dessus.

Le comparatif, lui, affiche la mesure du marchand. Il faut trancher une définition, pas deux
chiffres : soit le site publie l'empreinte batterie seule (ce que le marchand garantit), soit il
publie l'empreinte avec siège et il le dit de façon visible partout où un chiffre apparaît.

## 9. Bois de fil non traité, hors périmètre

- **22 URLs Woodbrass** de la sélection ne portent **aucun identifiant d'affiliation** : elles
  ne rapportent rien. 124 Thomann (`offid=1&affid=3711`) et 11 Donner (`donnnermusic.sjv.io/c/…`)
  sont correctement tagués. Décision du 13/09 : porté tel quel, hors périmètre de la reprise.
- `modeles.json` déclarait 7 « champs » filtrables ; le moteur du comparatif en consomme **9**
  (`cymbales` et `bluetooth` s'y ajoutent sans être documentés).
- `notes` de `discretion` et `module` : échelles 2→5 utilisées dans un score, publiées sans
  grille explicite. La règle I02 (« aucune note chiffrée sans grille explicitée ») demande
  d'afficher ces échelles. **Reste à faire**, à arbitrer avec le design.
- Une virgule avant « et » (règle R01) dans `Comparatif.dc.html`.
