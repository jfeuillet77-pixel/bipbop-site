# Relevé de prix — mardi 3 novembre 2026

**9 référence(s) à traiter** sur 160 contrôlées. 1 franchissement(s) de tranche, 14 rupture(s), 1 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Donner BackBeat | Donner Music | 1099,99 € | 1 199,99 € | +100 € (+9.1 %) | 800 à 1600 € |
| Donner DED-300X | Donner Music | 539,99 € | 599,99 € | +60 € (+11.1 %) | 500 à 800 € |
| Donner DED-200 Pro | Donner Music | 599,99 € | 659,99 € | +60 € (+10 %) | 500 à 800 € |
| Alesis Debut Kit | Woodbrass | 240 € | 279 € | +39 € (+16.3 %) | Moins de 300 € |
| Donner DED-200X | Donner Music | 499,99 € | 529,99 € | +30 € (+6 %) | ⚠ 300 à 500 € → 500 à 800 € |
| Donner DED-70 | Donner Music | 199,99 € | 219,99 € | +20 € (+10 %) | Moins de 300 € |
| Donner DED-80 | Donner Music | 219,99 € | 239,99 € | +20 € (+9.1 %) | Moins de 300 € |
| Roland TD-02K | Thomann | 349 € | 333 € | -16 € (-4.6 %) | 300 à 500 € |
| Donner HHCB-12 charleston + pied | Donner Music | 165,99 € | 179,98 € | +13.99 € (+8.4 %) | — |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Donner BackBeat — 1099,99 € → 1 199,99 € (+100 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-backbeat-batteries-electroniques

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 1099,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 1099,99 € est en ligne sur 4 pages — `/avis/`, `/avis/millenium-mps-1000/`, `/guides/batterie-electronique-bluetooth/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

### Donner DED-300X — 539,99 € → 599,99 € (+60 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/batterie-electronique-donner-ded-300x-5-tambours-4-cymbales

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 539,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 539,99 € est en ligne sur 1 page — `/avis/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Donner DED-200 Pro — 599,99 € → 659,99 € (+60 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/ded-200pro-new-electronic-drum-set

**Ce que cet écart invalide** (procédure §05) :

- **L'écart du duel `/duels/alesis-nitro-max-vs-donner-ded-200x/` bouge** : Donner DED-200 Pro vs Alesis Nitro Max Kit, 191 € d'écart → 251 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 599,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 599,99 € est en ligne sur 2 pages — `/avis/`, `/guides/batterie-electronique-bluetooth/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Alesis Debut Kit — 240 € → 279 € (+39 €)

Relevé chez Woodbrass le 2026-11-03, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-alesis-debutkit-mesh-kit-4-futs-3-cymbales-p340997.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 240 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 240 € est en ligne sur 5 pages — `/avis/`, `/avis/millenium-hd-120/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/choisir-batterie-electronique-enfant/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 14 entrées de `design/port-corrections.json` citent 240 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

### Donner DED-200X — 499,99 € → 529,99 € (+30 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-ded-200-set-de-batterie-electronique

**Ce que cet écart invalide** (procédure §05) :

- **Franchit une tranche du hub** : « 300 à 500 € » → « 500 à 800 € ». Le hub Avis et le comparatif rangent le modèle par tranche : une carte sous un intitulé qui ne contient plus son prix est un mensonge visible.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis-Alesis-Nitro-Max.dc.html` → `/avis/alesis-nitro-max/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 225 — « …8c6"> Donner DED-200X ⟦499,99 €⟧ 7 · mesh Une cymbale de plus, casque et tabouret dans le carton, mais un module plus pauvre et {ecart:ded200x-nitromax} de plus. <div dat… »
- [ ] `Avis-Donner-DED-200X.dc.html` → `/avis/donner-ded-200x/` — 4 substitutions mécaniques
- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 215 — « …h:100%;height:100%;object-fit:contain;display:block;padding:10px;box-sizing:border-box"> DONNER · ⟦499,99 €⟧ DED-200X Cinq fûts et quatre cymbales, le kit le plus fourni … »
- [ ] `Duel-Alesis-Nitro-Max-vs-Donner-DED-200.dc.html` → `/duels/alesis-nitro-max-vs-donner-ded-200x/` — 2 substitutions mécaniques
- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 499,99 € est en ligne sur 9 pages — `/avis/alesis-nitro-max/`, `/avis/donner-ded-200x/`, `/avis/`, `/avis/millenium-mps-750x/`, `/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/choisir-batterie-electronique-appartement/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 499,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Donner DED-70 — 199,99 € → 219,99 € (+20 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-ded-70-electronic-drum-set

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 0 substitution mécanique, **2 phrases à réécrire**
  - ligne 153 — « …1;flex:1">Moins de 200 €. Tout en caoutchouc, mais ça se joue vraiment. ⟦199,99 €⟧ <a href="https://donnnermusic.sjv.io/c/6882776/3379894/43895?prodsku=47112746893536&u=h… »
  - ligne 178 — « …:block"> Donner DED-70 SI LE BUDGET SERRE ⟦199,99 €⟧ Caoutchouc 180 sons Moins de 200 € et ça se joue. Le rack est léger, les pads claquent. <div… »

**Ce que le site publie aujourd'hui** : 199,99 € est en ligne sur 4 pages — `/avis/`, `/barometre/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 2 entrées de `design/port-corrections.json` citent 199,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Donner DED-80 — 219,99 € → 239,99 € (+20 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/batterie-electrique-donner-ded-80-5-tambours-et-3-cymbales

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 293 — « …x(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fdf6ec;border-top:1.5px solid #e4d8c6;align-items:center"> Donner DED-80 ⟦219,99 €⟧ M… »
- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 219,99 € est en ligne sur 2 pages — `/avis/`, `/guides/batterie-electronique-moins-300-euros/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 219,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Roland TD-02K — 349 € → 333 € (-16 €)

Relevé chez Thomann le 2026-11-03, par le flux marchand. Lien publié : https://www.thomann.fr/roland_td_02k_v_drums_kit.htm

> ⚠ **349 € est aussi le prix publié de Millenium MPS-350, Nux DM-110 Mesh Kit.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 3 substitutions mécaniques
- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 203 — « …ann.de/prodbilder/557719.jpg" alt="Roland TD-02K" style="width:100%;height:100%;object-fit:contain;display:block"> Roland TD-02K ⟦349 €⟧ Caoutchouc 16 kits Les sons Rolan… »

**Ce que le site publie aujourd'hui** : 349 € est en ligne sur 10 pages — `/avis/`, `/duels/millenium-mps-150x-vs-mps-450/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/guides/batterie-electronique-bluetooth/`, `/guides/batterie-electronique-compacte/`, `/guides/batterie-electronique-metal/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/double-pedale-batterie-electronique/`, `/guides/ou-acheter-batterie-electronique/`, `/guides/prix-batterie-electronique/`. Elles suivront au portage.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 3 entrées de `design/port-corrections.json` citent 349 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

### Donner HHCB-12 charleston + pied — 165,99 € → 179,98 € (+13.99 €)

Relevé chez Donner Music le 2026-11-03, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-hhcb-12-separater-hi-hat

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 165,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 14 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Roland TD-02KV** | Disponible sous 5-7 semaines | 498 € | 1 relevé | `/avis/roland-td-02kv/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/guides/batterie-electronique-compacte/`, `/guides/choisir-batterie-electronique-adulte-debutant/`, `/guides/choisir-batterie-electronique-appartement/`, `/` |
| **Alesis Nitro Multicore** | Disponible sous 5-7 semaines | 89 € | 4 relevés | `/guides/acheter-batterie-electronique-occasion/` |
| **Alesis DRP100** | hors stock, sans date annoncée | 53 € | 1 relevé | `/les-bases/casque-anti-bruit-batterie/` |
| **Roland NE-1 Noise Eater** | hors stock, sans date annoncée | 39 € | 1 relevé | `/les-bases/batterie-electronique-bruit-voisins/` |
| **Vic Firth 12" VF Practice Pad** | Disponible sous 8-10 semaines | 58 € | 1 relevé | `/guides/pad-entrainement-batterie/` |
| Roland PDX-6 8" Mesh | actuellement indisponible | 198 € | 4 relevés | — |
| Yamaha PCY-100 10" 3 zones | Disponible sous 4-5 semaines | 129 € | 4 relevés | — |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 4 relevés | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 3-4 semaines | 153 € | 4 relevés | — |
| Roland RT-30K Kick Trigger | actuellement indisponible | 98 € | 2 relevés | — |
| Yamaha DTX452K | actuellement indisponible | 519 € | 1 relevé | — |
| Yamaha TP70S 7,5 pouces 3 zones | hors stock, sans date annoncée | 149 € | 1 relevé | — |
| Roland OP-TD1C Cymbal Set | hors stock, sans date annoncée | 139 € | 1 relevé | — |
| Nux Kit tom 10 pouces + clamp | hors stock, sans date annoncée | 99 € | 1 relevé | — |

**1 référence à traiter maintenant** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis `marchand` + `url` dans `design/prix-reperes.json`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).

- Alesis Nitro Multicore — /guides/acheter-batterie-electronique-occasion/ — https://www.thomann.fr/alesis_nitro_multicore.htm

À resurveiller au prochain relevé (liées depuis une page, mais en rupture pour la première fois) : Roland TD-02KV · Alesis DRP100 · Roland NE-1 Noise Eater · Vic Firth 12" VF Practice Pad.

Les 9 autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.

### 0 délai court, pour mémoire — aucune action


## 4. Références disparues du catalogue

Une absence du flux n'a jamais suffi : chacune a été confirmée sur sa propre fiche, parce que ce constat déclenche le retrait d'une référence du site. Quatre actions à l'Aide-Mémoire §04 — retirer la ligne du comparatif, poser un bandeau sur la fiche d'avis **sans la supprimer**, remplacer le modèle dans les guides par son successeur plutôt que de le retirer, passer le statut à « retiré » au plan et dans la sélection.

- **Alesis Turbo Mesh Kit** (Thomann) — publié 309 €
  - preuve : absente du flux, et la page répond HTTP 404
  - lien publié : https://www.thomann.fr/alesis_turbo_mesh_kit.htm
  - aucun produit du même nom ailleurs dans le catalogue : c'est bien un retrait (Aide-Mémoire §04).

## 5. Non relevées

Aucune.

## 6. Les dates de relevé affichées

L'Aide-Mémoire §05 date le comparatif, les guides par budget et la page de sélection **à chaque relevé**, les avis et les duels seulement à chaque modification de fond. Une date rafraîchie sans changement est un mensonge ; une date qui traîne alors qu'on a vérifié le prix est une information perdue.

26 pages affichent une date de relevé antérieure au 2026-11-03 :

- `/avis/alesis-nitro-max/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-450/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/alesis-nitro-max-vs-roland-td-02kv/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/choisir-batterie-electronique-adulte-debutant/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-combien-de-temps/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-seul/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-ou-acoustique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/casque-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-150x/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-150x-vs-alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-750x-vs-mps-850/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ampli-batterie-electronique/` — « relevés chez Thomann et Donner Music le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/pad-entrainement-batterie/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/baguettes-batterie-electronique/` — « relevés chez Thomann et Woodbrass le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td313/` — « relevés chez Thomann le 28 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-la-batterie/` — « relevés chez des libraires en ligne le 29 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-hd-120/` — « relevés chez Thomann et Woodbrass le 5 octobre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-bruit-voisins/` — « relevés chez Thomann et Woodbrass, revérifiés le 10 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-nitro-pro/` — « relevés chez Thomann le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/enregistrer-batterie-electronique-ordinateur/` — « relevés chez Thomann et Woodbrass le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ameliorer-batterie-electronique/` — « relevés chez Thomann le 19 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-electronique-moins-1000-euros/` — « relevés chez Thomann le 19 octobre 2026 » **← à faire suivre à chaque relevé**
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann, revérifiés le 21 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann, revérifiés le 22 octobre 2026 » _(ne suit que les modifications de fond)_

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-11-03.json`. Ce fichier est réécrit à chaque relevé._
