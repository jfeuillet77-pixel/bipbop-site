# Titles et meta descriptions — propositions

**BipBop · 14 septembre 2026 · 2ᵉ passe après tes deux remarques, validée et appliquée le jour même.**

Les 39 copies ci-dessous sont **en ligne** sur bipbop.eu depuis le 14/09/2026. Cette fiche garde la trace de ce qui a été proposé, validé et à quoi ça ressemblait avant — elle est la source de la règle, pas une proposition en attente.

Corrections intégrées depuis la première fiche : **plus aucune mention de la marque dans les
titles**, et **plus aucun montant chiffré dans les titles** (le mot « Prix » reste, « 298 € » sort).
Ça a rendu 9 à 12 caractères par page : la liste en profite pour reprendre les titres complets de
tes maquettes là où ils étaient bons (`C'est quoi un pad mesh et pourquoi tout le monde en parle ?`)
et pour écrire « électronique » sur les pages qui en étaient privées.

39 fichiers, 38 routes indexables plus la 404. 36 titles entre 51 et 60
caractères (espaces compris, apostrophes comptées pour un), toutes les metas entre 120 et 155.
Tout est compté par script, pas à l'œil.

## Les règles appliquées

1. **Pas de marque dans le title.** Elle ne classe rien, ne porte aucune requête et mange 9
   caractères. `scripts/port.mjs` et `BaseLayout.astro` l'ajoutent aujourd'hui automatiquement :
   la retirer est une modification de ces deux fichiers, pas de 39 pages. Voir §« À trancher » 1,
   il y a un piège dans `copySeo()` sans lequel les titles retomberaient sur les `<h1>`.
2. **Pas de montant dans un title.** Le mot « Prix » oui — c'est une requête —, « 298 € » non :
   un prix publié dans un titre est faux dès le prochain relevé hebdomadaire, et le SERP ne le
   corrige pas tout seul. Les montants vivent dans la meta, où ils sont relus en même temps que
   l'article. Exception proposée pour trois pages, §« À trancher » 2.
3. **Title entre 50 et 60 caractères, meta entre 120 et 155.** Trois pages hors plage par nature :
   mentions légales, confidentialité, 404 (aucune requête visée, et la 404 est en `noindex`).
4. **Les 9 pages d'avis portent « Avis » + le nom du modèle + « Prix » + 2026**, vérifié par script
   page par page. Aucun title dupliqué entre deux pages.
5. **Tutoiement** (`AGENTS.md`) : « Trouvez votre batterie électronique | Comparatif & Reco 2026 »
   n'est pas retenu, la question « Quelle batterie électronique choisir ? Comparatif 2026 » l'est.
6. **Chiffres des metas** : prix issus de `src/data/modeles.json` (relevé du 13/09/2026), compteurs
   issus des pages elles-mêmes. Rien d'inventé.

## Ce qui ne va pas aujourd'hui

| | Titres actuels | Metas actuelles |
|---|---|---|
| Au-dessus de la plage (>60 / >155) | **24 sur 39** | **9 sur 39** |
| En dessous (<50 / <120) | **7 sur 39** | **22 sur 39** |
| Portant la marque « BipBop » | **39 sur 39** | — |

Le plus long atteint 87 caractères (« Millenium MPS-850 : cent euros de plus que la MPS-750X, pour quoi exactement ? — BipBop ») : Google coupe autour de 60 et la fin
emportée est justement la promesse qui faisait cliquer. Les metas trop courtes viennent du portage :
`port.mjs` reprend le `<h1>` ou la première phrase du chapeau quand aucune copie n'est écrite en
place — « Une bonne affaire peut faire économiser 40 %. » (45) ou « Tu as déjà la batterie. » (23)
sont des débuts de phrase, pas des metas.

## Les 38 titles d'un coup d'œil

| Route | Title proposé | Long. |
|---|---|---|
| `/` | Batterie électronique : laquelle choisir pour 2026 ? | 52 |
| `/comparatif/` | Quelle batterie électronique choisir ? Comparatif 2026 | 54 |
| `/avis/` | Avis batterie électronique : les modèles testés en 2026 | 55 |
| `/avis/alesis-nitro-max/` | Que vaut l’Alesis Nitro Max Mesh ? Avis et Prix 2026 | 52 |
| `/avis/alesis-turbo-mesh/` | Que vaut l’Alesis Turbo Mesh Kit ? Avis et Prix 2026 | 52 |
| `/avis/donner-ded-200x/` | Que vaut la Donner DED-200X ? Notre avis et prix 2026 | 53 |
| `/avis/millenium-mps-150x/` | Millenium MPS-150X Mesh : avis complet et prix 2026 | 51 |
| `/avis/millenium-mps-450/` | Millenium MPS-450 : avis complet, prix et verdict 2026 | 54 |
| `/avis/millenium-mps-750x/` | Millenium MPS-750X : avis complet, prix et bilan 2026 | 53 |
| `/avis/millenium-mps-850/` | Millenium MPS-850 : avis complet, prix et verdict 2026 | 54 |
| `/avis/roland-td-02kv/` | Que vaut la Roland TD-02KV ? Avis, prix et verdict 2026 | 55 |
| `/avis/yamaha-dtx432k/` | Yamaha DTX432K : avis complet, prix et verdict 2026 | 51 |
| `/duels/alesis-nitro-max-vs-donner-ded-200x/` | Alesis Nitro Max ou Donner DED-200X : laquelle choisir ? | 56 |
| `/duels/mps-150x-vs-turbo-mesh/` | Millenium MPS-150X ou Alesis Turbo Mesh : notre avis | 52 |
| `/duels/nitro-max-vs-td-02kv/` | Alesis Nitro Max ou Roland TD-02KV : laquelle choisir ? | 55 |
| `/guides/` | Guides d’achat batterie électronique : nos réponses 2026 | 56 |
| `/guides/batterie-appartement/` | Quelle batterie électronique choisir en appartement ? | 53 |
| `/guides/batterie-electronique-enfant/` | Batterie électronique pour enfant : quel modèle choisir ? | 57 |
| `/guides/batterie-adulte-debutant/` | Adulte débutant : quelle batterie électronique choisir ? | 56 |
| `/guides/meilleure-batterie-moins-300-euros/` | Meilleure batterie électronique à moins de 300 € en 2026 | 56 — *montant = la requête, §À trancher 2* |
| `/guides/meilleure-batterie-moins-500-euros/` | Meilleure batterie électronique à moins de 500 € en 2026 | 56 — *montant = la requête, §À trancher 2* |
| `/guides/batterie-moins-1000-euros/` | Quelle batterie électronique à moins de 1 000 € choisir ? | 57 — *montant = la requête, §À trancher 2* |
| `/guides/pack-complet/` | Batterie électronique : comment composer le pack complet ? | 58 |
| `/guides/acheter-occasion/` | Batterie électronique d’occasion : le guide des pièges 2026 | 59 |
| `/guides/enregistrer-sa-batterie/` | Enregistrer sa batterie électronique sur un ordinateur | 54 |
| `/guides/faire-evoluer-sa-batterie/` | Faire évoluer sa batterie électronique sans tout changer | 56 |
| `/les-bases/electronique-ou-acoustique/` | Batterie électronique ou acoustique : que choisir ? | 51 |
| `/les-bases/pad-mesh/` | C’est quoi un pad mesh et pourquoi tout le monde en parle ? | 59 |
| `/les-bases/combien-de-temps/` | Combien de temps faut-il pour apprendre la batterie ? | 53 |
| `/les-bases/seul-ou-prof/` | Apprendre la batterie seul ou avec un professeur : le calcul | 60 |
| `/les-bases/installer-sans-deranger/` | Installer sa batterie électronique sans déranger les voisins | 60 |
| `/les-bases/tapis-batterie/` | Faut-il un tapis sous une batterie électronique ? La réponse | 60 |
| `/les-bases/quel-casque/` | Quel casque choisir pour une batterie électronique ? | 52 |
| `/a-propos/` | Qui écrit les avis de BipBop et comment on les fabrique | 55 — *la marque est le sujet de la page* |
| `/contact/` | Contacter l’équipe : une question, une erreur à signaler | 56 |
| `/plan-du-site/` | Plan du site : toutes les pages publiées, rangées par usage | 59 |
| `/mentions-legales/` | Mentions légales de BipBop | 26 — *la marque est le sujet de la page* |
| `/politique-confidentialite/` | Politique de confidentialité de BipBop | 38 — *la marque est le sujet de la page* |

## Les deux formes de titre du silo Avis

Toutes contiennent « Avis », le nom du modèle, « Prix » et l'année. Deux tournures, selon ce que
l'article a à vendre :

- **« Que vaut {modèle} ? Avis et Prix 2026 »** quand l'article porte un contre-pied (la Nitro Max
  recommandée sans être la moins chère, la TD-02KV conseillée en immeuble ancien alors qu'elle a
  moins de mesh, la DED-200X suréquipée mais trop chère, la Turbo Mesh décevante à prix égal). La
  question est cliquable parce que c'est littéralement la question du lecteur.
- **« {marque} {modèle} : avis complet, prix et verdict 2026 »** quand la page tranche net (les
  quatre Millenium, la Yamaha). Le mot « verdict » promet une réponse, pas une lecture.

Le titre de la maquette n'est pas perdu pour autant : il reste le `<h1>` de la page, et un H1 n'a
pas la même contrainte qu'un `<title>`.

### Le point de départ

#### `/` — mot clé : batterie électronique · 2 400/mois

**Title (52)** — Batterie électronique : laquelle choisir pour 2026 ?

**Meta (148)** — Neuf modèles testés, prix vérifiés chaque semaine chez le marchand et un comparatif en trois questions pour te dire lequel acheter selon ton budget.

*Actuel — title 63 : « Apprendre la batterie sans que ton immeuble te déteste — BipBop »*
*Actuel — meta 123 : « On compare les batteries électroniques et on te dit laquelle prendre selon ton budget, ta place et ce que tu veux en faire. »*

→ Le titre actuel est la phrase d'accroche du H1 : percutante, mais elle ne contient pas « batterie électronique », le mot clé le plus volumineux du site (2 400 recherches/mois). L'accroche reste vivante dans le H1 de la page.

#### `/comparatif/` — mot clé : batterie electronique comparatif · 90/mois

**Title (54)** — Quelle batterie électronique choisir ? Comparatif 2026

**Meta (150)** — Trois questions : ton budget, la place dont tu disposes et ce que tu veux jouer. Deux modèles en face, avec une phrase honnête sur chacun et son prix.

*Actuel — title 30 : « Comparatif interactif — BipBop »*
*Actuel — meta 95 : « Trois questions, deux modèles en face. Le comparatif de batteries électroniques pour débutants. »*

→ Ta formulation préférée, qui tient maintenant en entier depuis que la marque est sortie du titre. C'est la page qui convertit : elle garde la requête complète (« choisir ») et l'année.

### Les avis

#### `/avis/` — mot clé : avis batterie électronique

**Title (55)** — Avis batterie électronique : les modèles testés en 2026

**Meta (149)** — Un avis par modèle testé : le prix réel vérifié chez le marchand, ce qui cloche et à qui la batterie convient. Neuf publiés, d’autres chaque semaine.

*Actuel — title 41 : « Tous nos avis, modèle par modèle — BipBop »*
*Actuel — meta 109 : « Dix-neuf avis au programme, un par batterie qu'on estime valoir le coup d'être considérée. Trois sont écrits. »*

→ Mot clé de silo (« avis batterie électronique ») et promesse de fraîcheur. Aucun montant, aucun compte rendu dans le titre : « neuf » est vérifiable dans le build mais il vivrait mal les prochaines publications, il est gardé pour la meta.

#### `/avis/alesis-nitro-max/` — mot clé : alesis nitro max · 590/mois

**Title (52)** — Que vaut l’Alesis Nitro Max Mesh ? Avis et Prix 2026

**Meta (151)** — Huit pads en peau maillée, le Bluetooth, un module qui tient la route et 409 € à sortir. Avis complet sur l’Alesis Nitro Max Mesh, ses défauts compris.

*Actuel — title 76 : « Alesis Nitro Max Mesh : la batterie qu'on conseille les yeux fermés — BipBop »*
*Actuel — meta 123 : « Huit pads en mesh, du Bluetooth, un module qui tient la route et 409 € à sortir. C'est le meilleur premier achat du moment. »*

→ Forme question + Avis + Prix + année, exactement le format demandé. Recommandation n°1 du site et 590 recherches/mois sur « alesis nitro max ». « Alesis » commence par une voyelle : « l'Alesis ».

#### `/avis/alesis-turbo-mesh/` — mot clé : alesis turbo mesh kit · 390/mois

**Title (52)** — Que vaut l’Alesis Turbo Mesh Kit ? Avis et Prix 2026

**Meta (152)** — Avis complet de l’Alesis Turbo Mesh Kit à 298 € : quatre fûts en mesh, un module volontairement simple et ce que la MPS-150X offre en plus au même prix.

*Actuel — title 69 : « Alesis Turbo Mesh : la marque rassure, le kit en donne moins — BipBop »*
*Actuel — meta 143 : « Avis complet de l'Alesis Turbo Mesh Kit à 298 € : peaux maillées, fûts de 8 pouces, et ce que la Millenium MPS-150X offre en plus au même prix. »*

→ Le nom complet du kit est « Turbo Mesh Kit » (c'est aussi la requête, 390/mois), il entre désormais en entier dans le titre depuis que la marque est partie. Le prix réel de la page, 298 €, reste dans la meta.

#### `/avis/donner-ded-200x/` — mot clé : donner ded-200x avis

**Title (53)** — Que vaut la Donner DED-200X ? Notre avis et prix 2026

**Meta (148)** — Neuf pads tous maillés pour 499,99 €. Avis complet sur la Donner DED-200X : le kit le mieux fourni de sa tranche, mais le plus difficile à défendre.

*Actuel — title 65 : « Donner DED-200X : le kit le plus fourni, au mauvais prix — BipBop »*
*Actuel — meta 160 : « Avis complet de la Donner DED-200X à 499,99 € : neuf pads tous maillés, deux crashs, un rack rigide — et un tarif qui la met au niveau de mieux équipée qu'elle. »*

→ L'angle « le kit le plus fourni, au mauvais prix » est l'information utile : elle tient dans la meta. Le titre, lui, ne prend que la requête.

#### `/avis/millenium-mps-150x/` — mot clé : millenium mps 150 · 90/mois

**Title (51)** — Millenium MPS-150X Mesh : avis complet et prix 2026

**Meta (153)** — Cinq pads à peau maillée, grosse caisse comprise, là où la concurrence vend du caoutchouc. Avis complet sur la Millenium MPS-150X Mesh et son vrai piège.

*Actuel — title 86 : « Millenium MPS-150X Mesh : tous les fûts en mesh pour 298 €, où est le piège ? — BipBop »*
*Actuel — meta 160 : « Cinq pads à peau maillée, grosse caisse comprise, à un prix où la concurrence vend encore du caoutchouc. Le piège est réel mais il n'est pas là où tu l'attends. »*

→ Le « où est le piège ? » de la maquette est une excellente accroche de SERP : à 51 caractères sans marque et sans montant, il n'avait plus sa place dans le title, il ouvre la meta.

#### `/avis/millenium-mps-450/` — mot clé : millenium mps 450

**Title (54)** — Millenium MPS-450 : avis complet, prix et verdict 2026

**Meta (150)** — Avis complet de la Millenium MPS-450 à 398 € : caisse claire stéréo, cymbales de 12 pouces, deux entrées trigger et un argument qui gêne la Nitro Max.

*Actuel — title 73 : « Millenium MPS-450 : la batterie qui rend la Nitro Max discutable — BipBop »*
*Actuel — meta 183 : « Avis complet de la Millenium MPS-450 à 398 € : caisse claire stéréo, cymbales de 12 pouces, deux entrées trigger — et l'absence de Bluetooth qui change tout face à l'Alesis Nitro Max. »*

→ « La batterie qui rend la Nitro Max discutable » reste le H1 de la page. Le `<title>` prend la requête, la meta garde la confrontation avec la Nitro Max.

#### `/avis/millenium-mps-750x/` — mot clé : millenium mps-750x · 110/mois

**Title (53)** — Millenium MPS-750X : avis complet, prix et bilan 2026

**Meta (145)** — Huit pads tous maillés, une caisse claire à deux zones et 500 sons pour 498 €. Avis complet sur la Millenium MPS-750X, ses 140 cm au sol compris.

*Actuel — title 85 : « Millenium MPS-750X : huit pads en mesh pour le prix d'une Roland qui en a un — BipBop »*
*Actuel — meta 164 : « Avis complet de la Millenium MPS-750X à 498 € : huit pads tous maillés, caisse claire à deux zones, cymbales de 12 pouces et un rack qui tient — pour 140 cm au sol. »*

→ Gros volume sur la gamme (1 900/mois, mais sur des requêtes techniques de réglage). Ici on capte l'intention « avis ». Le prix de la page (498 €, issu de `modeles.json`) est dans la meta, pas dans le titre.

#### `/avis/millenium-mps-850/` — mot clé : millenium mps 850 · 210/mois

**Title (54)** — Millenium MPS-850 : avis complet, prix et verdict 2026

**Meta (153)** — Avis complet de la Millenium MPS-850 à 598 € : caisse claire de 12 pouces, toms plus grands, module réglable. Excellente batterie, mauvais premier achat.

*Actuel — title 87 : « Millenium MPS-850 : cent euros de plus que la MPS-750X, pour quoi exactement ? — BipBop »*
*Actuel — meta 159 : « Avis complet de la Millenium MPS-850 à 598 € : caisse claire de 12 pouces, toms de 10, module réglable pad par pad. Excellente batterie, mauvais premier achat. »*

→ « Cent euros de plus que la MPS-750X, pour quoi exactement ? » est conservé en meta : c'est la vraie question de l'acheteur, et un comparatif de deux montants n'a rien à faire dans un titre.

#### `/avis/roland-td-02kv/` — mot clé : roland td-02kv · 170/mois

**Title (55)** — Que vaut la Roland TD-02KV ? Avis, prix et verdict 2026

**Meta (153)** — Une pédale sans batte, 120 cm d’emprise et les sons Roland à 498 €. Moins de mesh, mais la seule qu’on recommande en immeuble ancien. Notre avis complet.

*Actuel — title 86 : « Roland TD-02KV : la batterie qu'on achète quand le voisin du dessous dort mal — BipBop »*
*Actuel — meta 174 : « Une pédale sans batte, 120 cm d'emprise au sol et les sons Roland. Elle a moins de mesh que ses concurrentes à 400 €. C'est pourtant elle qu'on recommande en immeuble ancien. »*

→ La meilleure page du site sur l'intention appartement. Le titre prend la requête (« roland td-02kv », 170/mois), la meta garde l'argument « voisin du dessous ».

#### `/avis/yamaha-dtx432k/` — mot clé : yamaha dtx 432 · 20/mois

**Title (51)** — Yamaha DTX432K : avis complet, prix et verdict 2026

**Meta (146)** — Aucun pad en mesh et des pads de 7,5 pouces pour 498 €, mais dix programmes de coaching et la meilleure app d’apprentissage du marché. Notre avis.

*Actuel — title 86 : « Yamaha DTX432K : 498 € sans une seule peau maillée, pourtant on la recommande — BipBop »*
*Actuel — meta 167 : « Avis complet de la Yamaha DTX432K : aucun pad en mesh et des pads de 7,5 pouces, mais dix programmes de coaching et la meilleure application d'apprentissage du marché. »*

→ La meta assume le contre-pied de la page (498 € sans un seul pad mesh, et on la recommande) : c'est ce qui fait cliquer quand les concurrents empilent « avis + prix » sans rien dire.

### Les duels

#### `/duels/alesis-nitro-max-vs-donner-ded-200x/` — mot clé : nitro max vs ded 200x

**Title (56)** — Alesis Nitro Max ou Donner DED-200X : laquelle choisir ?

**Meta (153)** — 91 € séparent ces deux kits, des pads mesh des deux côtés et deux réputations solides. Comparatif pad par pad, avec le verdict et le prix réel de chacun.

*Actuel — title 65 : « Alesis Nitro Max ou Donner DED-200X : laquelle prendre ? — BipBop »*
*Actuel — meta 179 : « Quatre-vingt-onze euros d'écart, des pads mesh des deux côtés, deux modèles qui reviennent sans arrêt dans les recherches. Le moins cher n'est pas celui que la réputation désigne. »*

→ Les deux modèles au complet : c'est la requête tapée. La forme « ou … : laquelle choisir ? » remplace le « vs », que personne ne tape en français. Les 91 € d'écart restent dans la meta.

#### `/duels/mps-150x-vs-turbo-mesh/` — mot clé : mps 150x vs turbo mesh

**Title (52)** — Millenium MPS-150X ou Alesis Turbo Mesh : notre avis

**Meta (145)** — Le même prix au centime près et le même argument : la batterie en peaux maillées la moins chère du marché. Comparatif des deux kits, pad par pad.

*Actuel — title 67 : « Millenium MPS-150X ou Alesis Turbo Mesh : le match à 298 € — BipBop »*
*Actuel — meta 116 : « Exactement le même prix, exactement le même positionnement : la batterie en peaux maillées la moins chère du marché. »*

→ Les deux noms au complet tiennent enfin à 52 caractères. Le prix du match, 298 €, est écrit sur la page et dans la meta : c'est là qu'il fait cliquer, pas dans un titre qui devrait être réécrit à chaque variation de tarif.

#### `/duels/nitro-max-vs-td-02kv/` — mot clé : nitro max vs td 02kv

**Title (55)** — Alesis Nitro Max ou Roland TD-02KV : laquelle choisir ?

**Meta (153)** — 89 € d’écart, huit pads mesh d’un côté, une pédale sans batte de l’autre. Comparatif des deux kits selon ton budget, ta pièce et ce que le voisin entend.

*Actuel — title 62 : « Alesis Nitro Max ou Roland TD-02KV : laquelle prendre — BipBop »*
*Actuel — meta 52 : « Quatre-vingt-neuf euros séparent ces deux batteries. »*

→ Même forme que le duel précédent, pour que les trois duels du silo se ressemblent dans une liste de résultats. Les 89 € d'écart sont dans la meta.

### Les guides d'achat

#### `/guides/` — mot clé : guide d’achat batterie électronique

**Title (56)** — Guides d’achat batterie électronique : nos réponses 2026

**Meta (148)** — Dix-sept guides et articles, un par situation : budget, appartement, âge du joueur, matériel à ajouter après le kit. La réponse est en haut de page.

*Actuel — title 44 : « Une question, un guide, une réponse — BipBop »*
*Actuel — meta 143 : « Chaque guide répond à une seule question, celle que tu tapes dans Google à 23 h. Un tableau, deux ou trois modèles recommandés, le budget réel. »*

→ Titre de silo : « guides d'achat » + le mot clé + l'année. La meta annonce la promesse de lecture (la réponse en haut de page), qui est ce qui distingue ces pages d'un comparatif à rallonge.

#### `/guides/batterie-appartement/` — mot clé : batterie silencieuse · 210/mois

**Title (53)** — Quelle batterie électronique choisir en appartement ?

**Meta (144)** — Ce n’est pas le son qui gêne, c’est le bruit des baguettes et de la pédale dans le plancher. Ce que les voisins entendent et nos quatre modèles.

*Actuel — title 75 : « Quelle batterie électronique choisir quand on vit en appartement ? — BipBop »*
*Actuel — meta 235 : « En appartement, le problème n'est jamais le son de la batterie : c'est le bruit des baguettes sur les pads et celui de la pédale dans le plancher. Voilà ce que tes voisins entendent vraiment et les modèles qui les laissent tranquilles. »*

→ La question que tape le lecteur, avec le mot clé et l'intention « choisir ». Le guide le plus lu du site (neuf lecteurs sur dix) méritait le titre le plus littéral.

#### `/guides/batterie-electronique-enfant/` — mot clé : batterie electronique enfant · 1 000/mois

**Title (57)** — Batterie électronique pour enfant : quel modèle choisir ?

**Meta (150)** — Ce qui compte n’est pas le prix mais la hauteur du siège, la souplesse de la pédale et le rack. Trois modèles, un par tranche d’âge, et le bon casque.

*Actuel — title 66 : « Quelle batterie électronique pour un enfant de 6 à 12 ans — BipBop »*
*Actuel — meta 113 : « Ce qui compte ici n'est pas le prix, c'est la hauteur du siège, la souplesse de la pédale et la solidité du rack. »*

→ 1 000 recherches/mois sur « batterie electronique enfant », le plus gros volume adressable après le générique : le mot clé est en tête et la question complète tient sans la marque.

#### `/guides/batterie-adulte-debutant/` — mot clé : batterie électronique débutant · 480/mois

**Title (56)** — Adulte débutant : quelle batterie électronique choisir ?

**Meta (140)** — Tu n’as jamais tenu une baguette, tu as trente-cinq ans et un salon. Quatre modèles testés, les quatre erreurs classiques et le budget réel.

*Actuel — title 61 : « Quelle batterie pour un adulte qui débute vraiment ? — BipBop »*
*Actuel — meta 68 : « Tu n'as jamais tenu une baguette, tu as trente-cinq ans et un salon. »*

→ Le H1 (« un adulte qui débute vraiment ? ») est très bon mais ne porte pas « électronique », qui est dans la requête. Il reste en H1, le title prend les deux mots clés.

#### `/guides/meilleure-batterie-moins-300-euros/` — mot clé : batterie électronique moins de 300 €

**Title (56)** — Meilleure batterie électronique à moins de 300 € en 2026

**Meta (153)** — Sept modèles tiennent dans ce budget, deux valent vraiment le coup, un troisième si tu es contraint au centime près. Le tableau et les pièges du segment.

*Actuel — title 60 : « La meilleure batterie électronique à moins de 300 € — BipBop »*
*Actuel — meta 37 : « Sept modèles tiennent dans ce budget. »*

→ Le montant reste ici : « moins de 300 € » n'est pas un prix affiché, c'est la requête elle-même, et la page entière est ce budget. Les trois pages de ce type sont marquées, voir « À trancher » §2. La meta était tombée à 37 caractères.

#### `/guides/meilleure-batterie-moins-500-euros/` — mot clé : batterie électronique moins de 500 €

**Title (56)** — Meilleure batterie électronique à moins de 500 € en 2026

**Meta (146)** — Le segment des premiers achats. Neuf modèles sérieux comparés, trois qu’on recommande, les pièges à éviter et le budget réel une fois tout acheté.

*Actuel — title 60 : « La meilleure batterie électronique à moins de 500 € — BipBop »*
*Actuel — meta 153 : « C'est le segment où se joue la grande majorité des premiers achats. Neuf modèles sérieux, trois qu'on recommande, un tableau pour trancher en une minute. »*

→ Idem 300 €, même requête en miroir. La meta tenait en longueur mais laissait tomber les deux arguments qui font cliquer : les trois modèles retenus et le budget réel une fois tout acheté.

#### `/guides/batterie-moins-1000-euros/` — mot clé : prix batterie electronique · 260/mois

**Title (57)** — Quelle batterie électronique à moins de 1 000 € choisir ?

**Meta (153)** — Ici on paie le plus cher pour le moins de différence. Neuf modèles comparés, ce que 500 € de plus achètent réellement et les trois cas où ça se justifie.

*Actuel — title 56 : « Quelle batterie électronique à moins de 1 000 € — BipBop »*
*Actuel — meta 71 : « C'est le segment où l'on paie le plus cher pour le moins de différence. »*

→ Segment peu adressé en volume mais à forte intention d'achat ; la meta vend l'arbitrage (« ce que 500 € de plus achètent réellement »), qui est l'angle utile de la page.

#### `/guides/pack-complet/` — mot clé : pack batterie électronique complète

**Title (58)** — Batterie électronique : comment composer le pack complet ?

**Meta (152)** — Une batterie seule ne se joue pas. Trois paniers complets de 370 à 680 €, l’indispensable, le piège du lot marchand et ce qui peut attendre sans risque.

*Actuel — title 80 : « Le pack complet prêt à jouer : tout ce qu'il faut commander en une fois — BipBop »*
*Actuel — meta 47 : « Une batterie électronique seule ne se joue pas. »*

→ La requête est « pack batterie électronique » : elle est en tête, et la question « comment composer » est celle de l'acheteur qui a déjà son kit. Les trois paniers et la fourchette 370-680 € viennent du chapeau de la page.

#### `/guides/acheter-occasion/` — mot clé : batterie électronique occasion · 590/mois

**Title (59)** — Batterie électronique d’occasion : le guide des pièges 2026

**Meta (153)** — Une bonne affaire fait économiser 40 %. Une mauvaise rend l’instrument inutilisable à cause d’une pièce à 89 €. Les six points à vérifier avant de payer.

*Actuel — title 73 : « Acheter une batterie électronique d'occasion sans se faire avoir — BipBop »*
*Actuel — meta 45 : « Une bonne affaire peut faire économiser 40 %. »*

→ 590 recherches/mois sur « batterie électronique occasion », et l'intention qui pèse derrière est « est-ce que je risque quelque chose ». Les deux chiffres de la page répondent dans la meta : 40 % d'économie possible, une pièce à 89 € introuvable qui ruine l'affaire.

#### `/guides/enregistrer-sa-batterie/` — mot clé : enregistrer batterie électronique

**Title (54)** — Enregistrer sa batterie électronique sur un ordinateur

**Meta (152)** — Un câble à dix euros suffit pour de meilleurs sons que n’importe quel module à mille euros. Audio ou MIDI, les trois méthodes, le branchement pas à pas.

*Actuel — title 72 : « Enregistrer sa batterie électronique et brancher son ordinateur — BipBop »*
*Actuel — meta 109 : « Un câble à dix euros suffit pour obtenir de meilleurs sons que n'importe quel module de moins de mille euros. »*

→ La requête est longue (« enregistrer sa batterie électronique »), elle la prend en entier ; la meta garde l'argument qui fait cliquer : un câble à 10 € bat n'importe quel module à 1 000 €.

#### `/guides/faire-evoluer-sa-batterie/` — mot clé : faire évoluer sa batterie électronique

**Title (56)** — Faire évoluer sa batterie électronique sans tout changer

**Meta (153)** — Cent euros bien placés règlent le problème dans la moitié des cas. Dans l’autre, il faut changer de kit. Le diagnostic en cinq questions, puis le calcul.

*Actuel — title 58 : « Faire évoluer sa batterie plutôt que la remplacer — BipBop »*
*Actuel — meta 61 : « Ta batterie d'entrée de gamme te frustre sur un point précis. »*

→ Forme affirmative plutôt que question : « sans tout changer » dit la peur exacte de l'acheteur et laisse la place à « électronique », que la question faisait tomber.

### Les bases

#### `/les-bases/electronique-ou-acoustique/` — mot clé : batterie électronique ou acoustique

**Title (51)** — Batterie électronique ou acoustique : que choisir ?

**Meta (151)** — La vraie question n’est pas le son : une acoustique sort cent décibels, un marteau-piqueur. Où tu habites et qui dort à côté tranchent en cinq minutes.

*Actuel — title 68 : « Batterie électronique ou batterie acoustique pour débuter ? — BipBop »*
*Actuel — meta 35 : « La vraie question n'est pas le son. »*

→ Le mot « batterie » apparaissait deux fois dans le titre de la maquette (68 caractères) ; le second saute, la question « que choisir ? » gagne la place rendue.

#### `/les-bases/pad-mesh/` — mot clé : pad batterie · 720/mois

**Title (59)** — C’est quoi un pad mesh et pourquoi tout le monde en parle ?

**Meta (148)** — Le mot revient dans toutes les fiches produits sans explication. Rebond, niveau sonore, prix : ce que change une peau maillée sur ta façon de jouer.

*Actuel — title 68 : « C'est quoi un pad mesh et pourquoi tout le monde en parle ? — BipBop »*
*Actuel — meta 144 : « C'est le mot que tu croises dans toutes les fiches produits sans que personne ne prenne trois minutes pour l'expliquer. Voilà ces trois minutes. »*

→ Le titre de la maquette (« C'est quoi un pad mesh et pourquoi tout le monde en parle ? ») était bon à 68 caractères uniquement à cause de la marque. Sans elle il tient en entier, et l'année est inutile sur une page de vocabulaire. 720 recherches/mois sur « pad batterie ».

#### `/les-bases/combien-de-temps/` — mot clé : apprendre la batterie · 590/mois

**Title (53)** — Combien de temps faut-il pour apprendre la batterie ?

**Meta (149)** — Quinze minutes pour ton premier rythme, trois mois pour accompagner une chanson, deux ans pour jouer en groupe. Le calendrier honnête, sans illusion.

*Actuel — title 68 : « Combien de temps faut-il pour savoir jouer de la batterie ? — BipBop »*
*Actuel — meta 39 : « Quinze minutes pour ton premier rythme. »*

→ Autre titre de maquette récupéré intégralement (68 → 53) : la forme « faut-il … pour apprendre la batterie » couvre la requête « apprendre la batterie » (590/mois), que la version courte ratait.

#### `/les-bases/seul-ou-prof/` — mot clé : apprendre la batterie seul · 70/mois

**Title (60)** — Apprendre la batterie seul ou avec un professeur : le calcul

**Meta (152)** — Trois choses ne s’apprennent pas dans une vidéo, faute de quelqu’un qui te regarde jouer. Les autres s’apprennent seul. Combien de cours et à quel prix.

*Actuel — title 59 : « Apprendre la batterie seul ou avec un professeur ? — BipBop »*
*Actuel — meta 105 : « Trois choses ne s'apprennent pas dans une vidéo, parce qu'elles demandent quelqu'un qui te regarde jouer. »*

→ Requête réelle dans le CSV (« apprendre la batterie seul », 70/mois). « le calcul » annonce le verdict chiffré de la page : trois ou quatre cours au démarrage, 25 à 40 € la demi-heure.

#### `/les-bases/installer-sans-deranger/` — mot clé : batterie sans bruit pour voisin

**Title (60)** — Installer sa batterie électronique sans déranger les voisins

**Meta (138)** — Tu as déjà la batterie, reste à la rendre supportable pour le voisinage. Quatre interventions classées par efficacité, de dix à 240 euros.

*Actuel — title 56 : « Installer sa batterie sans déranger les voisins — BipBop »*
*Actuel — meta 23 : « Tu as déjà la batterie. »*

→ Le « électronique » que la marque empêchait d'écrire : c'est lui qui qualifie la requête, le bruit d'une acoustique ne se règle pas avec un tapis. Meta refaite, elle était tombée à 23 caractères.

#### `/les-bases/tapis-batterie/` — mot clé : tapis batterie · 480/mois

**Title (60)** — Faut-il un tapis sous une batterie électronique ? La réponse

**Meta (145)** — Réponse courte : oui, si quelqu’un vit sous toi. Le tapis ne règle qu’une partie du problème, la bonne. Voilà laquelle et avec quoi la compléter.

*Actuel — title 57 : « Faut-il un tapis sous sa batterie électronique ? — BipBop »*
*Actuel — meta 48 : « Réponse courte : oui, si quelqu'un vit sous toi. »*

→ 480 recherches/mois sur « tapis batterie ». La question est conservée, la meta assume le « oui, mais » de la page, qui est ce qui la rend crédible.

#### `/les-bases/quel-casque/` — mot clé : casque batterie electronique · 140/mois

**Title (52)** — Quel casque choisir pour une batterie électronique ?

**Meta (152)** — Un casque fermé, et c’est le seul critère non négociable. Vingt-six euros suffisent pour commencer. Ce qui compte vraiment et les trois achats à éviter.

*Actuel — title 53 : « Quel casque pour une batterie électronique ? — BipBop »*
*Actuel — meta 109 : « C'est l'achat qu'on oublie de prévoir et celui qui décide si tu joueras tous les jours ou deux fois par mois. »*

→ Titre rallongé à 51 par le verbe « choisir », qui est l'intention de la requête (« casque batterie electronique », 140/mois). La meta porte les deux informations cliquables : le critère unique (fermé) et le prix plancher (26 €).

### Les pages du site

#### `/a-propos/` — mot clé : —

**Title (55)** — Qui écrit les avis de BipBop et comment on les fabrique

**Meta (150)** — Un robot tient les prix, une équipe écrit les avis. Comment on choisit les modèles, comment on gagne notre vie et ce qu’on ne fera jamais sur ce site.

*Actuel — title 17 : « À propos — BipBop »*
*Actuel — meta 67 : « Qui est derrière BipBop, comment on gagne notre vie, nos promesses. »*

→ La marque reste ici, et nulle part ailleurs : cette page a pour sujet BipBop lui-même, « BipBop » y est un mot clé, pas un habillage. E-E-A-T se joue dès la SERP : qui écrit, comment. La meta dit franchement le fonctionnement (robot + équipe) et les revenus.

#### `/contact/` — mot clé : —

**Title (56)** — Contacter l’équipe : une question, une erreur à signaler

**Meta (143)** — Pas de service client, une petite équipe qui lit tout. Écris-nous pour un conseil d’achat, une erreur de prix à corriger ou un modèle à tester.

*Actuel — title 69 : « Une question, une erreur à signaler, une envie de discuter ? — BipBop »*
*Actuel — meta 149 : « Il n'y a pas de service client derrière ce site, juste une petite équipe qui lit tout. Pose ta question, on répond en général sous deux jours ouvrés. »*

→ Le H1 de la page (« Une question, une erreur à signaler, une envie de discuter ? ») était à 69 caractères avec la marque ; il tient à 56 en « Contacter l'équipe ». La meta ouvre une porte utile au maillage : proposer un modèle à tester.

#### `/plan-du-site/` — mot clé : —

**Title (59)** — Plan du site : toutes les pages publiées, rangées par usage

**Meta (143)** — Le comparatif, les avis modèle par modèle, les duels, les guides d’achat, les bases et les pages du site. Trente-sept pages classées par usage.

*Actuel — title 21 : « Plan du site — BipBop »*
*Actuel — meta 141 : « Toutes les pages publiées sur BipBop, rangées par usage : comparatif, avis par modèle, duels, guides d'achat, les bases et les pages du site. »*

→ La marque sort du titre même ici. « Trente-sept pages » dans la meta est le compte que la page calcule elle-même depuis `src/lib/arborescence.mjs` ; la copie SEO, elle, est écrite à la main. C'est le seul chiffre de cette fiche qui demande une relecture à chaque nouvelle page.

#### `/mentions-legales/` — mot clé : —

**Title (26)** — Mentions légales de BipBop

**Meta (136)** — Qui édite ce site, qui l’héberge, ce que tu peux faire avec ce qu’on y publie et comment nous écrire. Informations légales de bipbop.eu.

*Actuel — title 25 : « Mentions légales — BipBop »*
*Actuel — meta 80 : « Qui édite ce site, qui l'héberge et ce que tu peux faire avec ce qu'on y publie. »*

→ Hors contrainte de longueur : ces trois pages ne visent aucune requête, elles doivent être identifiables. La marque est gardée parce que c'est l'objet de la page (qui édite, qui héberge).

#### `/politique-confidentialite/` — mot clé : —

**Title (38)** — Politique de confidentialité de BipBop

**Meta (141)** — Ce qu’on sait de toi quand tu lis ce site, ce qu’on en fait et comment tout effacer. Aucune revente de données, mesure d’audience anonymisée.

*Actuel — title 37 : « Politique de confidentialité — BipBop »*
*Actuel — meta 84 : « Ce qu'on sait de toi quand tu lis ce site, ce qu'on en fait et comment tout effacer. »*

→ Hors contrainte, même raison. La meta gagne deux rassurances concrètes (aucune revente, mesure anonymisée) au lieu d'une phrase inachevée.

#### `(404)` — mot clé : —

**Title (54)** — Cette page a disparu comme une baguette sous le canapé

**Meta (150)** — L’adresse comporte peut-être une faute, ou la page a été déplacée. Par où repartir : le comparatif en trois questions, les avis et les guides d’achat.

*Actuel — title 63 : « Cette page a disparu comme une baguette sous le canapé — BipBop »*
*Actuel — meta 82 : « Soit l'adresse comporte une faute, soit on a déplacé la page en faisant le ménage. »*

→ Hors contrainte : la page est en `noindex`, son titre n'a aucun rôle SEO. Il garde la blague de la maquette.

## À trancher avant application

**1. Retirer la marque du title touche trois fichiers, dont un piégé.** Ce n'est pas une
réécriture page à page, c'est une règle de génération :

- `scripts/port.mjs` ligne 229 : `<title>${titre} — BipBop</title>` → `<title>${titre}</title>`.
- `src/layouts/BaseLayout.astro` : `<title>{title} — BipBop</title>` → `<title>{title}</title>`,
  pour `/comparatif/` et `/plan-du-site/`.
- **`scripts/port.mjs` ligne 97, le piège** : `copySeo()` retrouve le titre en place avec la regex
  `<title>(…) — BipBop</title>`. Sans le suffixe dans les fichiers, elle ne matche plus, le
  portage suivant ne trouve « aucun titre en place » et **fait retomber les 37 pages sur le `<h1>`
  de la maquette**, en silence, avec juste un avertissement dans la sortie. Il faut donc élargir
  cette regex en même temps (lire le `<title>` du `<head>` uniquement, comme le fait déjà
  `titrePublie()` de `src/lib/arborescence.mjs`, qui décode lui aussi les entités).

Vérification prévue après application : `npm run port && npm run check && npm run fidelite`, puis
compter les titles hors plage dans `dist/`. Le plan du site et le sitemap se régénèrent depuis ces
mêmes titres, et leurs libellés restent lisibles (vérifié sur les trois duels et les neuf avis).

**2. Trois titles gardent un montant, dis-moi si tu les veux secs :** « Meilleure batterie électronique à moins de 300 € en 2026 »,
« Meilleure batterie électronique à moins de 500 € en 2026 » et « Quelle batterie électronique à moins de 1 000 € choisir ? ». Ce ne sont pas des prix affichés, ce sont
les requêtes elles-mêmes (« batterie électronique moins de 500 » se tape avec le budget) et la
page entière est ce budget : les retirer laisserait trois pages sans identité. Si tu préfères la
règle absolue, les versions sans montant sont prêtes à être écrites (« Quelle batterie
électronique choisir sans se rapprocher du millier ? », à recalibrer).

**3. Deux compteurs que la page contredit elle-même** (je ne les publie pas) : le hub Avis annonce
« 22 AU PROGRAMME » dans son badge et « Vingt-trois avis au programme » dans son chapeau ; le hub
Guides annonce « 11 GUIDES ET 6 ARTICLES » alors que le build contient 10 guides et 7 pages des
bases (17 au total, le compte global est bon, le partage non). Les metas proposées n'affichent que
ce qui est vérifiable : « Neuf publiés » et « Dix-sept guides et articles ». Les chapeaux sont à
corriger dans Claude Design, pas ici.

**4. Bascule 2026 → 2027.** 16 titles et 0 metas portent l'année. Je propose de la
re-exécuter et relire le 1ᵉʳ janvier (le script recalibre les longueurs), pas de la calculer au
portage : une année automatique fait dériver un titre à 61 caractères sans que personne ne le
voie, et « 2027 » dans un titre publié en novembre 2026 est une promesse que la page ne tient pas.

**5. Les metas gardent les prix, et c'est voulu.** Un montant dans une meta se périt moins : elle
est relue à chaque mise à jour du prix, et c'est elle qui déclenche le clic sur une SERP déjà
noyée de titres identiques. Si tu veux la même règle d'airain que les titles, dis-le : les 9 metas
d'avis sont à réécrire sans les montants, et il faudra les remplacer par l'argument (le nombre de
pads, la matière des peaux, l'absence de Bluetooth).

## Où ça s'applique, une fois validé

- **Les trois fichiers ci-dessus** (`port.mjs`, `BaseLayout.astro`, regex `copySeo`) d'abord, puis
  les 37 pages portées : le `<title>` et la `<meta name="description">` se changent dans
  l'en-tête de `src/pages/<route>/index.html`. Contrairement au corps, la copie SEO **survit au
  portage** : `copySeo()` relit ces deux balises dans la page déjà portée et les réécrit à
  l'identique. `npm run fidelite` ne compare que le corps, il ne bougera pas.
- **`/comparatif/` et `/plan-du-site/`** : les props `title` et `description` de `<BaseLayout>`.
- **Garde-fou proposé** : `npm run check` ne contrôle aucune longueur aujourd'hui. J'ajouterais
  bien un contrôle (title 50-60 hors les trois pages exemptes, meta 120-155, aucun title dupliqué,
  aucun montant dans un title, aucune marque dans un title) à `scripts/verif.mjs` : sans lui, la
  règle se démode au prochain portage ou à la prochaine page.
- Un `&` dans un titre ou une meta s'écrit `&amp;` dans le fichier (les longueurs ci-dessus
  comptent le `&` visible, pas l'entité). Aucun de ces titles n'en contient depuis la 2ᵉ passe.

## Ce que je n'ai pas fait

Aucune page modifiée, aucun commit. Les `<h1>` des pages sont laissés tels quels. Les balises
Open Graph (`og:title`, `og:description`) n'existent pas sur les pages portées : c'est le
reste-à-faire de l'ouverture SEO avec Search Console, et elles devraient reprendre ces mêmes
chaînes. Dis-moi si tu veux que je les prépare en même temps que l'application.
