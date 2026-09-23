# Chantier 5 — les contenus à produire

23 septembre 2026. Chaque requête de `Mots-clés SEO.csv` (1 095 requêtes, 59 410 recherches/mois)
a été rangée vers une page existante, une page du plan éditorial ou une page à créer. Le
classement est fait par motifs, rejouable (script de travail, pas versionné) ; les volumes d'une
cible sont la somme de ses requêtes. La difficulté est la moyenne pondérée par le volume (0 à 100).

## Avancement

- **23/09** : plan éditorial refondu dans `plan-editorial.csv` (vagues, P64 à P76). Hubs Yamaha
  (P64) et Alesis (P65) publiés.
- **23/09, suite** : page mère `/marques/` (P76) publiée ; les trois pages passent 1 200 mots.
  Reste de la vague 1 : P70, P66, P67, P68, P69 et le H2 « batterie silencieuse » du guide
  appartement (ordre dans `design/plan-de-reprise.md`).
- **Roland TD-07, TD-17, TD-1DMK** : plus vendues en France (ni Thomann ni Woodbrass, 23/09). Pas
  ajoutées au catalogue ; le hub Roland (P71) les explique et renvoie vers la TD313 (P72).

## Où va la demande aujourd'hui

| | Volume/mois | Part |
|---|---|---|
| Déjà couvert par une page publiée | 21 100 | 36 % |
| Pages à créer (hors plan) | 30 350 | 51 % |
| Pages du plan éditorial encore « À produire » | 2 550 | 4 % |
| Hors sujet (cadre photo, batterie de casque Sennheiser, tongue drum, Alesis SR-18, requêtes locales…) | 5 410 | 9 % |

**Le plan éditorial restant vise surtout des requêtes sans volume.** Ses 24 lignes pèsent
2 550 recherches/mois, dont 12 avis entre 0 et 350. Les grosses grappes (marques, ampli, pad
d'entraînement, apprendre la batterie) n'y figurent pas.

## Ce que je propose de produire, par vagues

Critères : volume, facilité (un site de dix jours ne gagne que sur les requêtes faciles), et
**sans dépendance** (données déjà dans `src/data/`, pas de décision de catalogue à prendre).

### Vague 1 — gros volume, facile, données prêtes

| # | Page | Type | Requêtes phares | Vol. | Diff. | Données |
|---|---|---|---|---|---|---|
| 1 | Batterie électronique Yamaha : laquelle choisir | Hub marque (nouveau gabarit) | yamaha batterie électronique 480, yamaha dtx 320, dtx series 260 | 4 450 | 16 | 4 modèles au catalogue, 1 avis |
| 2 | Batterie électronique Alesis : laquelle choisir | Hub marque | batterie electronique alesis 590, batterie alesis 390 + la Nitro Mesh Kit | 2 390 + 1 460 | 14 | 7 modèles, 2 avis |
| 3 | Pad d'entraînement : lequel pour travailler sans batterie | Guide accessoire | pad batterie 720 (ambigu), pad d'entraînement 210, practice pad | 2 370 | 13 | 5 pads dans la sélection |
| 4 | Quel ampli pour une batterie électronique | Guide accessoire | ampli batterie électronique 480 + 320, enceinte 170, Roland PM-100 | 2 250 | 15 | 8 amplis dans la sélection |
| 5 | Combien coûte une batterie électronique | Guide | prix batterie électronique 260 + 260, pas cher 110 | 860 | 18 | tout est dans `modeles.json` |
| 6 | Quelles baguettes pour une batterie électronique | Les bases | baguette pour batterie électronique 260 | 610 | 16 | 7 baguettes dans la sélection |

La Nitro Mesh Kit (1 460/mois : « alesis nitro mesh kit » 590) est l'ancienne Nitro, remplacée
par la Nitro Max. Elle ne s'achète plus neuve : pas d'avis (règle M02), mais une section du hub
Alesis qui dit ce qui a changé et renvoie vers la Nitro Max et le guide occasion.

### Vague 2 — gros volume, mais une décision ou une précaution d'abord

| # | Page | Vol. | Diff. | Ce qui bloque |
|---|---|---|---|---|
| 7 | Hub Roland | 2 960 + 2 510 | 20 | **Les Roland cherchées ne sont pas au catalogue** : TD-17 (1 210), TD-07 (770), TD-1 (530). Il n'y a que TD-02K, TD-02KV et TD313. Un hub Roland qui ne parle pas des TD-07 et TD-17 répond à côté. Décision : les ajouter à la sélection (toutes sous le plafond de 1 600 €, règle D05), avec un avis chacune (D06, M06). |
| 8 | Apprendre la batterie : par où commencer | 2 230 | 19 | Rien, mais c'est un pilier qui doit relier seul/prof, combien de temps, adulte débutant et enfant sans les cannibaliser : à écrire après avoir relu ces quatre pages. |
| 9 | Réglages et sons de la Millenium MPS-750X | 6 390 affichés | 22 | **Volumes suspects** : trois requêtes anglaises à exactement 1 900 chacune (« settings », « random hi hat », « module upgrade »), probablement des estimations mondiales. La vraie demande française est sans doute dix fois plus basse. Page peu coûteuse (le module de remplacement à 198 € est dans la sélection), mais le chiffre ne doit pas décider de la priorité. Il faut le manuel constructeur pour ne rien inventer. |
| 10 | Hub Millenium | 1 020 | 18 | Demande éparpillée sur les noms de modèles. Utile surtout pour le maillage : 9 modèles au catalogue, 4 avis. |

### Vague 3 — le plan éditorial existant

À garder, mais pour la conversion et la règle D06 (chaque modèle du comparatif finit par avoir son
avis), pas pour le trafic : les avis MPS-1000 (350), Nitro Pro (250), TD-02K (140), Nux DM-110
(160), puis Debut Kit, DED-70, Rookie, DDX50, DTX402K, Nitro Ultimate, chacun à 50 au plus.

- **Duel MPS-750X vs MPS-850** (140, les deux avis existent) : le plus rapide de tous, à glisser
  en vague 1 si une journée le permet.
- Les bases P51 (module, 160), P53 (accessoires, 830 si l'on y range les requêtes « pad
  batterie électronique »), P55 à P58, P60 : faible volume, mais ce sont elles qui font de
  `/les-bases/` un vrai hub.
- P50 « Thomann ou Woodbrass » (420, difficulté 31) : à élargir en « Où acheter une batterie
  électronique » (Thomann, Woodbrass, Cultura).

### À ne pas produire

- **P32 « meilleure batterie électronique »** : le comparatif répond maintenant à cette requête
  (bloc de lecture du 23/09). Une seconde page lui ferait concurrence.
- **P18 « pad mesh ou caoutchouc »** : déjà couvert par `/les-bases/pad-mesh-batterie-electronique/`
  et par le comparatif.
- **Une page « batterie silencieuse »** (350, difficulté 29) : c'est l'intention du guide
  appartement. Mieux vaut un H2 « batterie silencieuse » dans ce guide qu'une page concurrente.
- **Tout ce qui dépasse 1 600 €** (Roland TD-27, TD-30, TD-50), les boîtes à rythmes et les
  multipads (Yamaha DTX Multi 12) : hors de la cible du site (règle D05).

## Comment ces pages seront écrites

- Sources : fiches marchands, manuels constructeurs, `modeles.json` et la sélection
  d'accessoires. **Aucun protocole de test inventé** (I01), et pas de « testé » tant que la
  question du chantier 6 n'est pas tranchée.
- Prix jamais écrits à la main dans une phrase qui ne se recalcule pas : soit lus dans les
  données au build (comme le bloc du comparatif), soit déclarés au relevé du lundi.
- Une nouvelle page publiée a des conséquences sur 3 à 6 autres (loi 4) : hub, compteurs,
  maillage, plan éditorial, sitemap. Chaque livraison les traite dans le même commit.
- Les hubs de marque sont un nouveau gabarit (S01) : une maquette à dessiner une fois, dans le
  système visuel existant, puis déclinée par marque.

## Décisions qui attendent Jordane

1. **Roland** : ajouter TD-07, TD-17 et TD-1 au catalogue (vague 2, hub Roland).
2. **Chantier 6** : la grille des notes sur 10 (l'afficher ou retirer les notes) et le mot
   « testés ». Tout nouvel avis en hérite.
3. **Affiliation** : les identifiants BipBop chez Thomann, Woodbrass et Donner, pour que la
   mention « on touche une commission » devienne vraie.
