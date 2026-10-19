# Relevé de prix — lundi 19 octobre 2026

**1 référence(s) à traiter** sur 160 contrôlées. 0 franchissement(s) de tranche, 10 rupture(s), 1 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Alesis Nitro Max Expansion Pack | Thomann | 89 € | 98 € | +9 € (+10.1 %) | — |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Alesis Nitro Max Expansion Pack — 89 € → 98 € (+9 €)

Relevé chez Thomann le 2026-10-19, par le flux marchand. Lien publié : https://www.thomann.fr/alesis_nitro_max_expansion_pack.htm

> ⚠ **89 € est aussi le prix publié de Alesis Nitro Multicore, Millenium MPS-150 Drum Module.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Acheter-Occasion.dc.html` → `/guides/acheter-batterie-electronique-occasion/` — 3 substitutions mécaniques
- [ ] `Guide-Faire-Evoluer-Sa-Batterie.dc.html` → `/guides/ameliorer-batterie-electronique/` — 3 substitutions mécaniques, **1 phrase à réécrire**
  - ligne 172 — « …px/1.6 'Work Sans',sans-serif;color:#4a3d31;margin:0">Des coupures aléatoires, un pad qui saute un coup sur dix, un grésillement : dans presque tous les cas c'est le fais… »
- [ ] `Guide-Moins-De-1000-Euros.dc.html` → `/guides/batterie-electronique-moins-1000-euros/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 302 — « …n Pack Un tom et une cymbale de plus, on passe à dix pads ⟦89 €⟧ <div style="width:52px;height:42px;border:2px… »

**Ce que le site publie aujourd'hui** : 89 € est en ligne sur 12 pages — `/avis/millenium-mps-750x/`, `/avis/roland-td-02kv/`, `/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/duels/millenium-mps-150-vs-mps-150x/`, `/duels/millenium-mps-150x-vs-alesis-turbo-mesh/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/guides/acheter-batterie-electronique-occasion/`, `/guides/ameliorer-batterie-electronique/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/pad-batterie-electronique/`, `/les-bases/accessoires-batterie-electronique/`. Elles suivront au portage.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 10 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Alesis Nitro Multicore** | actuellement indisponible | 89 € | 4 relevés | `/guides/acheter-batterie-electronique-occasion/` |
| Behringer DH100 | Disponible sous 3-4 semaines | 36 € | 4 relevés | — |
| Roland PDX-6 8" Mesh | actuellement indisponible | 198 € | 4 relevés | — |
| Yamaha PCY-100 10" 3 zones | Disponible sous 6-8 semaines | 129 € | 4 relevés | — |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 4 relevés | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 5-7 semaines | 153 € | 4 relevés | — |
| Tama TDK05 Drum Tuning Key | actuellement indisponible | 3,22 € | 4 relevés | — |
| Pearl D-50 Drum Throne | actuellement indisponible | 66 € | 2 relevés | — |
| Yamaha DT50K Kick Trigger | Disponible sous 3-4 semaines | 74 € | 1 relevé | — |
| Roland RT-30K Kick Trigger | actuellement indisponible | 98 € | 1 relevé | — |

**1 référence à traiter maintenant** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis `marchand` + `url` dans `design/prix-reperes.json`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).

- Alesis Nitro Multicore — /guides/acheter-batterie-electronique-occasion/ — https://www.thomann.fr/alesis_nitro_multicore.htm

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

27 pages affichent une date de relevé antérieure au 2026-10-19 :

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
- `/guides/acheter-batterie-electronique-occasion/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ameliorer-batterie-electronique/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-750x-vs-mps-850/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ampli-batterie-electronique/` — « relevés chez Thomann et Donner Music le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/pad-entrainement-batterie/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/baguettes-batterie-electronique/` — « relevés chez Thomann et Woodbrass le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/roland-td313/` — « relevés chez Thomann le 28 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-la-batterie/` — « relevés chez des libraires en ligne le 29 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-hd-120/` — « relevés chez Thomann et Woodbrass le 5 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann, revérifiés le 8 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann, revérifiés le 9 octobre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-bruit-voisins/` — « relevés chez Thomann et Woodbrass, revérifiés le 10 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-nitro-pro/` — « relevés chez Thomann le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-electronique-moins-1000-euros/` — « relevés chez Thomann le 12 octobre 2026 » **← à faire suivre à chaque relevé**
- `/guides/enregistrer-batterie-electronique-ordinateur/` — « relevés chez Thomann et Woodbrass le 12 octobre 2026 » _(ne suit que les modifications de fond)_

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-10-19.json`. Ce fichier est réécrit à chaque relevé._
