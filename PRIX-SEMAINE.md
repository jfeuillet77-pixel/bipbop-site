# Relevé de prix — lundi 5 octobre 2026

**6 référence(s) à traiter** sur 159 contrôlées. 0 franchissement(s) de tranche, 12 rupture(s), 0 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Alesis Debut Kit | Woodbrass | 279 € | 227 € | -52 € (-18.6 %) | Moins de 300 € |
| Woodbrass DDX50-Mesh | Woodbrass | 429 € | 386,10 € | -42.9 € (-10 %) | 300 à 500 € |
| Yamaha DTX402K | Thomann | 369 € | 346 € | -23 € (-6.2 %) | 300 à 500 € |
| Meinl Tapis 150 x 160 cm | Woodbrass | 105 € | 115 € | +10 € (+9.5 %) | — |
| Roland TDM-20 | Woodbrass | 208 € | 217 € | +9 € (+4.3 %) | — |
| Roland RT-30K Kick Trigger | Thomann | 93 € | 98 € | +5 € (+5.4 %) | — |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Alesis Debut Kit — 279 € → 227 € (-52 €)

Relevé chez Woodbrass le 2026-10-05, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-alesis-debutkit-mesh-kit-4-futs-3-cymbales-p340997.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 254 — « …x(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fff;border-top:1.5px solid #e4d8c6;align-items:center"> Alesis Debut Kit ⟦279 €⟧ Moin… »
- [ ] `Guide-Enfant.dc.html` → `/guides/choisir-batterie-electronique-enfant/` — 5 substitutions mécaniques
- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 279 € est en ligne sur 4 pages — `/avis/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/choisir-batterie-electronique-enfant/`, `/guides/prix-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Woodbrass DDX50-Mesh — 429 € → 386,10 € (-42.9 €)

Relevé chez Woodbrass le 2026-10-05, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-woodbrass-ddx50-mesh-p425216.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 429 € est en ligne sur 1 page — `/avis/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Yamaha DTX402K — 369 € → 346 € (-23 €)

Relevé chez Thomann le 2026-10-05, par page (flux périmé). Lien publié : https://www.thomann.fr/yamaha_dtx402k_e_drum_set.htm

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 266 — « …max(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fff;border-top:1.5px solid #e4d8c6;align-items:center"> Yamaha DTX402K ⟦369 €⟧ 300 … »
- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 369 € est en ligne sur 2 pages — `/avis/`, `/guides/batterie-electronique-moins-500-euros/`. Elles suivront au portage.

**Données** : 2 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Meinl Tapis 150 x 160 cm — 105 € → 115 € (+10 €)

Relevé chez Woodbrass le 2026-10-05, par page. Lien publié : https://www.woodbrass.com/pads-accessoires-meinl-mdr-e-tapis-de-sol-pour-batterie-electronique-150-cm-x-160-p164618.html

> ⚠ **105 € est aussi le prix publié de Roland PD-8, Yamaha HH-65 Hi-Hat Controller.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 105 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

### Roland TDM-20 — 208 € → 217 € (+9 €)

Relevé chez Woodbrass le 2026-10-05, par page. Lien publié : https://www.woodbrass.com/pads-accessoires-roland-tdm-20-tapis-150-x-160-cm-p75964.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 208 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Roland RT-30K Kick Trigger — 93 € → 98 € (+5 €)

Relevé chez Thomann le 2026-10-05, par page (flux périmé). Lien publié : https://www.thomann.fr/roland_rt_30k_kick_trigger.htm

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 93 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 10 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Roland PDX-100 10" V-Pad** | Disponible sous 4-5 semaines | 215 € | 3 relevés | `/guides/ameliorer-batterie-electronique/` |
| **Alesis Nitro Multicore** | actuellement indisponible | 89 € | 3 relevés | `/guides/acheter-batterie-electronique-occasion/` |
| Millenium MPS-750X Pro | Disponible sous 4-5 semaines | 749 € | 3 relevés | — |
| Behringer DH100 | Disponible sous 5-7 semaines | 36 € | 3 relevés | — |
| Roland PDX-6 8" Mesh | actuellement indisponible | 198 € | 3 relevés | — |
| Yamaha PCY-100 10" 3 zones | Disponible sous 8-10 semaines | 129 € | 3 relevés | — |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 3 relevés | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 7-9 semaines | 153 € | 3 relevés | — |
| Tama TDK05 Drum Tuning Key | Disponible sous 2-3 semaines | 3,22 € | 3 relevés | — |
| Yamaha DTX6K2-X | actuellement indisponible | 1 198 € | 1 relevé | — |

**2 référence à traiter maintenants** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis `marchand` + `url` dans `design/prix-reperes.json`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).

- Roland PDX-100 10" V-Pad — /guides/ameliorer-batterie-electronique/ — https://www.thomann.fr/roland_pdx100_10_vdrum_pad.htm
- Alesis Nitro Multicore — /guides/acheter-batterie-electronique-occasion/ — https://www.thomann.fr/alesis_nitro_multicore.htm

Les 8 autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.

### 2 délais courts, pour mémoire — aucune action

- Alesis Strata Club (Thomann) — Disponible sous 1-2 semaines
- Yamaha PCY-135 (Thomann) — Disponible sous 1-2 semaines

## 4. Références disparues du catalogue

Aucune.

## 5. Non relevées

Aucune.

## 6. Les dates de relevé affichées

L'Aide-Mémoire §05 date le comparatif, les guides par budget et la page de sélection **à chaque relevé**, les avis et les duels seulement à chaque modification de fond. Une date rafraîchie sans changement est un mensonge ; une date qui traîne alors qu'on a vérifié le prix est une information perdue.

28 pages affichent une date de relevé antérieure au 2026-10-05 :

- `/avis/alesis-nitro-max/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-450/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-750x/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td-02kv/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/alesis-nitro-max-vs-roland-td-02kv/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/choisir-batterie-electronique-adulte-debutant/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-combien-de-temps/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-batterie-seul/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-bruit-voisins/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-ou-acoustique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/casque-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/tapis-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 17 septembre 2026 » _(ne suit que les modifications de fond)_
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
- `/guides/batterie-electronique-moins-1000-euros/` — « relevés chez Thomann le 28 septembre 2026 » **← à faire suivre à chaque relevé**
- `/les-bases/apprendre-la-batterie/` — « relevés chez des libraires en ligne le 29 septembre 2026 » _(ne suit que les modifications de fond)_

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-10-05.json`. Ce fichier est réécrit à chaque relevé._
