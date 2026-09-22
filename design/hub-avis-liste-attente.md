# Hub Avis — liste d'attente complète et registre des notes

## 1. Liste d'attente : les 22 modèles sans avis

La maquette `Avis.dc.html` n'en liste **que 14 sur 22**, et son badge de tête annonce
« 23 au programme » (9 + 23 = 32 pour 31 modèles). Les 8 lignes manquantes sont rédigées ici.

**Ce que j'ai écrit n'est pas inventé** : chaque phrase est une condensation du champ `phrase` de
`data/modeles.json` — texte éditorial déjà présent dans la base, écrit par le design — resserré au
registre des 14 lignes du design (une quinzaine de mots maximum, un seul trait distinctif, un
chiffre quand il décide). Les prix et segments viennent de la base, pas de la maquette : les 4
prix litigieux du hub sont corrigés (`design/ecarts-maquettes.md` §1).

À vérifier par toi avant publication, puisque c'est ma plume et non celle de Claude Design.

### Les 14 lignes du design (référence de ton)

| Modèle | Prix | Segment | Ce qu'on en dira |
|---|---|---|---|
| Millenium Rookie | 179 € | Moins de 300 € | Le plancher de prix. Guide enfant |
| Millenium HD-120 | **219 €** | Moins de 300 € | Pads caoutchouc, le premier kit complet |
| Alesis Debut Kit | 279 € | Moins de 300 € | Format réduit, pensé pour les 7 à 12 ans |
| Donner DED-80 | 219,99 € | Moins de 300 € | Pliable, pour les très petits espaces |
| Roland TD-02K | 349 € | 300 à 500 € | Les sons Roland sans le mesh |
| Millenium MPS-350 | 349 € | 300 à 500 € | Entre la MPS-150X et la MPS-450 |
| Yamaha DTX402K | 369 € | 300 à 500 € | La Yamaha la moins chère |
| Nux DM-110 Mesh | 349 € | 300 à 500 € | Outsider mesh distribué par Woodbrass |
| Woodbrass DDX50-Mesh | 429 € | 300 à 500 € | Pads de 10 pouces au meilleur prix |
| Alesis Nitro Pro | **698 €** | 500 à 800 € | La marche au-dessus de la Nitro Max |
| Donner DED-300X | **539,99 €** | 500 à 800 € | Cinq fûts mesh et module évolué |
| Alesis Nitro Ultimate | 799 € | 500 à 800 € | Le plafond de la cible |
| Millenium MPS-1000 | 999 € | 800 à 1600 € | Le module le plus complet de la gamme |
| Yamaha DTX6K2-X | **1 198 €** | 800 à 1600 € | La première vraie intermédiaire |

### Les 8 lignes rédigées ici

| Modèle | Prix | Segment | Ce qu'on en dira |
|---|---|---|---|
| Donner DED-70 | 199,99 € | Moins de 300 € | Des fûts en mesh sous 200 €, un module dépouillé |
| Yamaha DTX452K | 519 € | 500 à 800 € | La DTX432K, avec la caisse claire en mesh |
| Donner DED-200 Pro | 599,99 € | 500 à 800 € | La DED-200X avec un module enrichi et le Bluetooth |
| Alesis Nitro Pro XL | 729 € | 500 à 800 € | Onze pads, la configuration la plus complète de la gamme |
| Millenium MPS-750X Pro | 749 € | 500 à 800 € | La MPS-750X avec le module le plus complet de la marque |
| Donner BackBeat | 899,99 € | 800 à 1600 € | Le haut de gamme Donner, avec un module tactile |
| Roland TD313 | 1 498 € | 800 à 1600 € | La vitrine Roland : le meilleur module et la meilleure réponse |
| Alesis Strata Club | 1 539 € | 800 à 1600 € | Le haut de gamme Alesis : module tactile et cymbales larges |

**Intitulé de section** : « Les 22 avis en préparation » — et le badge de tête devient
« 9 AVIS PUBLIÉS · 22 AU PROGRAMME ». Les deux dérivent de la base, plus de la maquette.

## 2. Registre des notes sur 10

Décision de Jordane du 13 septembre 2026 : **on garde les notes `/10`.** Il demande en échange
que les absences soient recensées. Voici l'inventaire, mesuré sur le build.

**Neuf pages portent une note, et ce sont les neuf avis.** Aucune autre page du site n'en affiche.

| Page | Note | | Page | Note |
|---|---|---|---|---|
| Nitro Max | 8,4 | | MPS-850 | 8,1 |
| TD-02KV | 8,0 | | DTX432K | 7,8 |
| MPS-750X | 8,3 | | MPS-150X | 7,6 |
| MPS-450 | 8,2 | | DED-200X | 7,4 |
| Turbo Mesh | 7,2 | | | |

**Où la note est absente, et ce que ça implique :**

1. **Le hub `/avis/`** — seule la carte mise en avant (Nitro Max) affiche « Note de 8,4 sur 10 ».
   Les 8 autres cartes montrent prix et segment, **pas la note**, alors que les 8 avis existent et
   sont notés. C'est l'absence la plus visible : le lecteur ne peut pas trier. À corriger au
   portage du hub en reprenant la note de chaque avis.
2. **`/comparatif-batterie-electronique/`** — aucune note affichée, alors que le score interne en intègre une
   (`if (m.avis) s += 4`) et que les cartes renvoient aux avis. Un lecteur qui compare deux
   modèles n'a pas le niveau d'exigence appliqué à chacun.
3. **Les duels** — le duel Nitro Max vs DED-200X publié ne montre aucune note, alors que ses deux
   sujets en ont une (8,4 et 7,4). Les deux duels à venir sont dans le même cas.
4. **Les 22 modèles sans avis** — pas de note, et c'est **correct** : elle sanctionne un test
   écrit. Il ne faut surtout pas en inventer une pour eux.
5. **Guides et « Les bases »** — pas de note, correct aussi : ils traitent des catégories, pas des
   produits.

**Reste ouvert, indépendant de cette décision** : aucune grille n'explique ce que recouvre un
`7,2` contre un `8,4` (règle I02 du guide-agent). Les notes restent publiées sans barème
jusqu'à ce que le design en fournisse un.
