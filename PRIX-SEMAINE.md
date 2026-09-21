# Relevé de prix — lundi 21 septembre 2026

**1 référence(s) à traiter** sur 156 contrôlées. 0 franchissement(s) de tranche, 16 rupture(s), 0 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Donner BackBeat | Donner Music | 899,99 € | 1 099,99 € | +200 € (+22.2 %) | 800 à 1600 € |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Donner BackBeat — 899,99 € → 1 099,99 € (+200 €)

Relevé chez Donner Music le 2026-09-21, par fiche Donner, après recherche du produit déplacé. Lien publié : https://fr.donnermusic.com/products/offre-exclusive-donner-backbeat-batterie-electronique
> ⚠ **En rupture** (les deux variantes épuisées sur la fiche). Publier un prix attractif sur une référence épuisée est le piège n°3 de la procédure.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 899,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 15 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Roland PDX-100 10" V-Pad** | Disponible sous 6-8 semaines | 215 € | 1 relevé | `/guides/faire-evoluer-sa-batterie/` |
| **Alesis Nitro Multicore** | actuellement indisponible | 89 € | 1 relevé | `/guides/acheter-occasion/` |
| Millenium MPS-750X Pro | Disponible sous 6-8 semaines | 749 € | 1 relevé | — |
| Donner BackBeat | les deux variantes épuisées sur la fiche | 1 099,99 € | 1 relevé | — |
| Behringer DH100 | Disponible sous 7-9 semaines | 36 € | 1 relevé | — |
| Rockbag 22200 Drum Carpet | actuellement indisponible | 77 € | 1 relevé | — |
| Yamaha MAT-1 | Disponible sous 2-3 semaines | 79 € | 1 relevé | — |
| Roland PDX-6 8" Mesh | actuellement indisponible | 198 € | 1 relevé | — |
| Yamaha PCY-100 10" 3 zones | Disponible sous 10-13 semaines | 129 € | 1 relevé | — |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 1 relevé | — |
| Roland PM-100 | Disponible sous 2-3 semaines | 398 € | 1 relevé | — |
| Roland RT-30K Kick Trigger | Disponible sous 2-3 semaines | 93 € | 1 relevé | — |
| Millenium Universal Percussion Pad Bag | actuellement indisponible | 39 € | 1 relevé | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 9-12 semaines | 153 € | 1 relevé | — |
| Tama TDK05 Drum Tuning Key | Disponible sous 4-5 semaines | 3,22 € | 1 relevé | — |

**Rien à basculer cette semaine.** Une bascule de marchand se justifie après PLUS de deux semaines de rupture, jamais au premier relevé qui la voit : un « indisponible » d'un jour ferait changer de marchand pour rien.

À resurveiller au prochain relevé (liées depuis une page, mais en rupture pour la première fois) : Roland PDX-100 10" V-Pad · Alesis Nitro Multicore.

Les 13 autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.

### 1 délai court, pour mémoire — aucune action

- Yamaha DT50S Snare Trigger (Thomann) — Disponible sous 1-2 semaines

## 4. Références disparues du catalogue

Aucune.

## 4 bis. Absentes du flux, mais toujours en vente

Le flux partenaire ne les liste plus, leur fiche les vend encore. Rien à faire aujourd'hui : c'est noté parce qu'une référence qui sort d'un flux en sort souvent définitivement quelques semaines plus tard.

- Donner BackBeat (Donner Music) — absente du flux, et la fiche redirige vers https://fr.donnermusic.com/

## 5. Non relevées

Aucune.

## 6. Les dates de relevé affichées

L'Aide-Mémoire §05 date le comparatif, les guides par budget et la page de sélection **à chaque relevé**, les avis et les duels seulement à chaque modification de fond. Une date rafraîchie sans changement est un mensonge ; une date qui traîne alors qu'on a vérifié le prix est une information perdue.

22 pages affichent une date de relevé antérieure au 2026-09-21 :

- `/avis/alesis-nitro-max/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-450/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-750x/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td-02kv/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/nitro-max-vs-td-02kv/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-adulte-debutant/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-moins-1000-euros/` — « relevés chez Thomann le 12 septembre 2026 » **← à faire suivre à chaque relevé**
- `/les-bases/combien-de-temps/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/electronique-ou-acoustique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/installer-sans-deranger/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/quel-casque/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/seul-ou-prof/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/tapis-batterie/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-150x/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/mps-150x-vs-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/acheter-occasion/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/faire-evoluer-sa-batterie/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/enregistrer-sa-batterie/` — « relevés chez Thomann et Woodbrass le 18 septembre 2026 » _(ne suit que les modifications de fond)_

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-09-21.json`. Ce fichier est réécrit à chaque relevé._
