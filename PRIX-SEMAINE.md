# Relevé de prix — lundi 12 octobre 2026

**4 référence(s) à traiter** sur 160 contrôlées. 0 franchissement(s) de tranche, 13 rupture(s), 1 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Woodbrass DDX50-Mesh | Woodbrass | 386,10 € | 429 € | +42.9 € (+11.1 %) | 300 à 500 € |
| Alesis Debut Kit | Woodbrass | 227 € | 240 € | +13 € (+5.7 %) | Moins de 300 € |
| Meinl Tapis 150 x 160 cm | Woodbrass | 115 € | 105 € | -10 € (-8.7 %) | — |
| Roland BT-1 Bar Trigger Pad | Woodbrass | 125 € | 132 € | +7 € (+5.6 %) | — |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Woodbrass DDX50-Mesh — 386,10 € → 429 € (+42.9 €)

Relevé chez Woodbrass le 2026-10-12, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-woodbrass-ddx50-mesh-p425216.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 386,10 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 386,10 € est en ligne sur 1 page — `/avis/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 386,10 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

### Alesis Debut Kit — 227 € → 240 € (+13 €)

Relevé chez Woodbrass le 2026-10-12, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-alesis-debutkit-mesh-kit-4-futs-3-cymbales-p340997.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 227 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 227 € est en ligne sur 4 pages — `/avis/`, `/avis/millenium-hd-120/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/choisir-batterie-electronique-enfant/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 14 entrées de `design/port-corrections.json` citent 227 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

### Meinl Tapis 150 x 160 cm — 115 € → 105 € (-10 €)

Relevé chez Woodbrass le 2026-10-12, par page. Lien publié : https://www.woodbrass.com/pads-accessoires-meinl-mdr-e-tapis-de-sol-pour-batterie-electronique-150-cm-x-160-p164618.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 115 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

### Roland BT-1 Bar Trigger Pad — 125 € → 132 € (+7 €)

Relevé chez Woodbrass le 2026-10-12, par page. Lien publié : https://www.woodbrass.com/pads-accessoires-roland-bt-1-bar-trigger-pad-p150567.html

> ⚠ **125 € est aussi le prix publié de Millenium MPS-750X Expansion Pack, Yamaha PCY-135, Roland FD-8.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis-Millenium-MPS-750X.dc.html` → `/avis/millenium-mps-750x/` — 3 substitutions mécaniques
- [ ] `Avis-Millenium-MPS-850.dc.html` → `/avis/millenium-mps-850/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 181 — « …style="font:700 15px 'Work Sans',sans-serif;color:#ffd166;margin-bottom:6px">BipBop dit Si tu hésites entre la MPS-850 à 598 € et la MPS-750X à 498 € plus son pack d'exte… »
- [ ] `Duel-Millenium-MPS-750X-vs-MPS-850.dc.html` → `/duels/millenium-mps-750x-vs-mps-850/` — 1 substitution mécanique, **4 phrases à réécrire**
  - ligne 99 — « …argin:0 0 22px;max-width:720px;text-wrap:pretty">Deux batteries de la même marque, tout en peaux maillées, sur la même surface au sol. La plus chère a deux pads de plus, … »
  - ligne 150 — « …ns',sans-serif;color:#3a2f26;margin:0 0 12px;max-width:700px">Prends la MPS-750X. Pour cent euros de moins, elle a des toms plus grands, une charleston et une ride plus g… »
  - ligne 217 — « …v> Le conseil de BipBop Fais le calcul du pack. Le pack d'extension de la MPS-750X coûte ⟦125 €⟧ : un tom de 10 pouces à deux zones, une crash de 12 pouces, les supports … »
  - ligne 281 — « …rif;color:#e0d5c8;margin:0 0 18px;max-width:760px">La Millenium MPS-750X gagne. Elle coûte cent euros de moins, ses toms et ses cymbales sont plus grands, son module a pl… »
- [ ] `Guide-Acheter-Occasion.dc.html` → `/guides/acheter-batterie-electronique-occasion/` — 1 substitution mécanique, **1 phrase à réécrire**
  - ligne 259 — « …ntroller.htm?offid=1&affid=3711" rel="sponsored noopener" target="_blank" style="color:#241c14;text-decoration:underline;text-underline-offset:3px">Roland FD-8 V-Drum Hi-… »
- [ ] `Guide-Enregistrer-Sa-Batterie.dc.html` → `/guides/enregistrer-batterie-electronique-ordinateur/` — 1 substitution mécanique
- [ ] `Guide-Faire-Evoluer-Sa-Batterie.dc.html` → `/guides/ameliorer-batterie-electronique/` — 3 substitutions mécaniques

**Ce que le site publie aujourd'hui** : 125 € est en ligne sur 7 pages — `/avis/millenium-mps-750x/`, `/avis/millenium-mps-850/`, `/duels/millenium-mps-750x-vs-mps-850/`, `/guides/acheter-batterie-electronique-occasion/`, `/guides/ameliorer-batterie-electronique/`, `/guides/enregistrer-batterie-electronique-ordinateur/`, `/guides/pad-batterie-electronique/`. Elles suivront au portage.

**Données** : 5 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 125 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(4 occurrences dans les documents internes, qui ne se publient jamais.)_

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 12 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Roland PDX-100 10" V-Pad** | Disponible sous 3-4 semaines | 215 € | 4 relevés | `/guides/ameliorer-batterie-electronique/`, `/guides/pad-batterie-electronique/` |
| **Alesis Nitro Multicore** | actuellement indisponible | 89 € | 4 relevés | `/guides/acheter-batterie-electronique-occasion/` |
| Behringer DH100 | Disponible sous 4-5 semaines | 36 € | 4 relevés | — |
| Roland PDX-6 8" Mesh | actuellement indisponible | 198 € | 4 relevés | — |
| Yamaha PCY-100 10" 3 zones | Disponible sous 7-9 semaines | 129 € | 4 relevés | — |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 4 relevés | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 6-8 semaines | 153 € | 4 relevés | — |
| Yamaha DTX6K2-X | actuellement indisponible | 1 198 € | 2 relevés | — |
| Yamaha DTX452K | Disponible sous 2-3 semaines | 519 € | 1 relevé | — |
| Pearl D-50 Drum Throne | Disponible sous 2-3 semaines | 66 € | 1 relevé | — |
| Roland PD-8 | Disponible sous 3-4 semaines | 105 € | 1 relevé | — |
| Thomann Cover Millenium NonaPad | actuellement indisponible | 15,90 € | 1 relevé | — |

**2 référence à traiter maintenants** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis `marchand` + `url` dans `design/prix-reperes.json`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).

- Roland PDX-100 10" V-Pad — /guides/ameliorer-batterie-electronique/, /guides/pad-batterie-electronique/ — https://www.thomann.fr/roland_pdx100_10_vdrum_pad.htm
- Alesis Nitro Multicore — /guides/acheter-batterie-electronique-occasion/ — https://www.thomann.fr/alesis_nitro_multicore.htm

Les 10 autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.

### 1 délai court, pour mémoire — aucune action

- Tama TDK05 Drum Tuning Key (Thomann) — Disponible sous 1-2 semaines

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

29 pages affichent une date de relevé antérieure au 2026-10-12 :

- `/avis/alesis-nitro-max/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-450/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-750x/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td-02kv/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/alesis-nitro-max-vs-roland-td-02kv/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/choisir-batterie-electronique-adulte-debutant/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-combien-de-temps/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-seul/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-ou-acoustique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/casque-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/tapis-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-150x/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-150x-vs-alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/acheter-batterie-electronique-occasion/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ameliorer-batterie-electronique/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/enregistrer-batterie-electronique-ordinateur/` — « relevés chez Thomann et Woodbrass le 18 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-750x-vs-mps-850/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ampli-batterie-electronique/` — « relevés chez Thomann et Donner Music le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/pad-entrainement-batterie/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/baguettes-batterie-electronique/` — « relevés chez Thomann et Woodbrass le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td313/` — « relevés chez Thomann le 28 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-la-batterie/` — « relevés chez des libraires en ligne le 29 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 5 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-hd-120/` — « relevés chez Thomann et Woodbrass le 5 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-electronique-moins-1000-euros/` — « relevés chez Thomann le 5 octobre 2026 » **← à faire suivre à chaque relevé**
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann, revérifiés le 8 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann, revérifiés le 9 octobre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-bruit-voisins/` — « relevés chez Thomann et Woodbrass, revérifiés le 10 octobre 2026 » _(ne suit que les modifications de fond)_

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-10-12.json`. Ce fichier est réécrit à chaque relevé._
