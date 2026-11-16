# Relevé de prix — lundi 16 novembre 2026

**13 référence(s) à traiter** sur 160 contrôlées. 1 franchissement(s) de tranche, 21 rupture(s), 2 disparition(s).

| Source | Ce qu'elle a donné |
| --- | --- |
| Thomann | flux partenaire (prix) + page (disponibilité) |
| Donner Music | flux Impact, variantes et stock |
| Woodbrass | page, JSON-LD |

Seuil d'intervention : **5 €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.

## 1. Ce qui a bougé

| Référence | Marchand | Publié | Relevé | Écart | Tranche |
| --- | --- | ---: | ---: | ---: | --- |
| Donner BackBeat | Donner Music | 1 199,99 € | 879,99 € | -320 € (-26.7 %) | 800 à 1600 € |
| Millenium MPS-1000 | Thomann | 999 € | 888 € | -111 € (-11.1 %) | 800 à 1600 € |
| Donner DED-200X | Donner Music | 529,99 € | 429,99 € | -100 € (-18.9 %) | ⚠ 500 à 800 € → 300 à 500 € |
| Alesis Strike Amp 8 MK2 | Thomann | 290 € | 222 € | -68 € (-23.4 %) | — |
| Millenium MPS-750X Mesh | Thomann | 498 € | 444 € | -54 € (-10.8 %) | 300 à 500 € |
| Alesis Debut Kit | Woodbrass | 279 € | 239 € | -40 € (-14.3 %) | Moins de 300 € |
| Donner DED-70 | Donner Music | 219,99 € | 189,99 € | -30 € (-13.6 %) | Moins de 300 € |
| Alesis Nitro Max Kit | Thomann | 409 € | 379 € | -30 € (-7.3 %) | 300 à 500 € |
| Alesis Nitro Amp | Thomann | 98 € | 69 € | -29 € (-29.6 %) | — |
| Millenium HD-120 E-Drum Set | Thomann | 219 € | 198 € | -21 € (-9.6 %) | Moins de 300 € |
| Millenium Rookie E-Drum Set | Thomann | 179 € | 159 € | -20 € (-11.2 %) | Moins de 300 € |
| Millenium DM-30 Drum Monitor | Thomann | 149 € | 129 € | -20 € (-13.4 %) | — |
| Donner DT-50 | Donner Music | 72,99 € | 65,99 € | -7 € (-9.6 %) | — |

## 2. Le travail, référence par référence

Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, `src/data/` et `design/`.
**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.

### Donner BackBeat — 1 199,99 € → 879,99 € (-320 €)

Relevé chez Donner Music le 2026-11-16, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-backbeat-batteries-electroniques

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 1 199,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 1 199,99 € est en ligne sur 4 pages — `/avis/`, `/avis/millenium-mps-1000/`, `/guides/batterie-electronique-bluetooth/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 5 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 1 199,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

### Millenium MPS-1000 — 999 € → 888 € (-111 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/millenium_mps_1000_e_drum_set.htm

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 1 substitution mécanique
- [ ] `Guide-Moins-De-1000-Euros.dc.html` → `/guides/batterie-electronique-moins-1000-euros/` — 3 substitutions mécaniques, **1 phrase à réécrire**
  - ligne 173 — « …otesque',sans-serif;letter-spacing:-.028em;margin:0 0 16px;scroll-margin-top:20px">Les neuf modèles du segment Neuf batteries entre 498 et ⟦999 €⟧, classées du moins cher… »

**Ce que le site publie aujourd'hui** : 999 € est en ligne sur 9 pages — `/avis/`, `/avis/millenium-mps-1000/`, `/avis/millenium-mps-750x-pro/`, `/guides/batterie-electronique-bluetooth/`, `/guides/batterie-electronique-confirme/`, `/guides/batterie-electronique-metal/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/double-pedale-batterie-electronique/`, `/guides/prix-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Donner DED-200X — 529,99 € → 429,99 € (-100 €)

Relevé chez Donner Music le 2026-11-16, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-ded-200-set-de-batterie-electronique

**Ce que cet écart invalide** (procédure §05) :

- **Franchit une tranche du hub** : « 500 à 800 € » → « 300 à 500 € ». Le hub Avis et le comparatif rangent le modèle par tranche : une carte sous un intitulé qui ne contient plus son prix est un mensonge visible.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 529,99 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 529,99 € est en ligne sur 9 pages — `/avis/alesis-nitro-max/`, `/avis/donner-ded-200x/`, `/avis/`, `/avis/millenium-mps-750x/`, `/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/choisir-batterie-electronique-appartement/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 24 entrées de `design/port-corrections.json` citent 529,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

### Alesis Strike Amp 8 MK2 — 290 € → 222 € (-68 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/alesis_strike_amp_8_mk2.htm

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

Aucune maquette n'écrit 290 €. Le prix ne vit que dans la base : `npm run data` suffira.

**Ce que le site publie aujourd'hui** : 290 € est en ligne sur 1 page — `/guides/ampli-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Millenium MPS-750X Mesh — 498 € → 444 € (-54 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/millenium_mps_750x_e_drum_mesh_set.htm

**Ce que cet écart invalide** (procédure §05) :

- **L'écart du duel `/duels/alesis-nitro-max-vs-millenium-mps-750x/` bouge** : Millenium MPS-750X Mesh vs Alesis Nitro Max Kit, 89 € d'écart → 65 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.
- **L'écart du duel `/duels/millenium-mps-750x-vs-mps-850/` bouge** : Millenium MPS-750X Mesh vs Millenium MPS-850, 100 € d'écart → 154 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.

> ⚠ **498 € est aussi le prix publié de Roland TD-02KV, Yamaha DTX432K.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis-Alesis-Nitro-Max.dc.html` → `/avis/alesis-nitro-max/` — 1 substitution mécanique
- [ ] `Avis-Donner-DED-200X.dc.html` → `/avis/donner-ded-200x/` — 1 substitution mécanique, **1 phrase à réécrire**
  - ligne 215 — « …"> Millenium MPS-750X ⟦498 €⟧ 8 pads Un pad de moins, des cymbales de 12 pouces, un rack plus lourd. Notre choix à ce prix. <div data-rwd="tblrow" style="display:grid;gri… »
- [ ] `Avis-Millenium-MPS-450.dc.html` → `/avis/millenium-mps-450/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 232 — « …#e4d8c6"> Roland TD-02KV ⟦498 €⟧ 1 mesh Cent euros de plus, trois toms en caoutchouc, mais une pédale qui ne tape pas. <p style="font:400 14px/1.5 'Work Sans',sans-serif;… »
- [ ] `Avis-Millenium-MPS-850.dc.html` → `/avis/millenium-mps-850/` — 1 substitution mécanique, **3 phrases à réécrire**
  - ligne 181 — « …rcle> BipBop dit Si tu hésites entre la MPS-850 à 598 € et la MPS-750X à ⟦498 €⟧ plus son pack d'extension à 125 €, regarde le montage. Pour vingt-cinq euros de plus, il … »
  - ligne 226 — « …> Millenium MPS-750X ⟦498 €⟧ Tout mesh Cent euros de moins, huit pads, mais des cymbales plus grandes et le Bluetooth. <div data-rwd="tblrow" style="display:g… »
  - ligne 241 — « …iv> Yamaha DTX432K ⟦498 €⟧ Aucun Cent euros de moins, aucune peau maillée, mais la meilleure application. <p style="font:400 14px/1.5 'Work Sans',san… »
- [ ] `Avis-Yamaha-DTX432K.dc.html` → `/avis/yamaha-dtx432k/` — 8 substitutions mécaniques, **2 phrases à réécrire**
  - ligne 228 — « …"> Millenium MPS-750X ⟦498 €⟧ Tout mesh Même prix, cinq fûts en peau maillée, mais aucun coaching. <div data-rwd="tblrow" style="display:grid;grid-template-columns:1.4fr … »
  - ligne 231 — « …#e4d8c6"> Roland TD-02KV ⟦498 €⟧ 1 mesh Même prix, une pédale qui ne frappe rien. Le choix appartement. <div data-rwd="tblrow" style="display:grid;grid-template-columns:1… »
- [ ] `Avis.dc.html` → `/avis/` — 4 substitutions mécaniques
- [ ] `Duel-Alesis-Nitro-Max-vs-Roland-TD-02KV.dc.html` → `/duels/alesis-nitro-max-vs-roland-td-02kv/` — 2 substitutions mécaniques
- [ ] `Duel-Millenium-MPS-750X-vs-MPS-850.dc.html` → `/duels/millenium-mps-750x-vs-mps-850/` — 2 substitutions mécaniques
- [ ] `Guide-Adulte-Debutant.dc.html` → `/guides/choisir-batterie-electronique-adulte-debutant/` — 3 substitutions mécaniques
- [ ] `Guide-Faire-Evoluer-Sa-Batterie.dc.html` → `/guides/ameliorer-batterie-electronique/` — 1 substitution mécanique
- [ ] `Guide-Moins-De-1000-Euros.dc.html` → `/guides/batterie-electronique-moins-1000-euros/` — 3 substitutions mécaniques
- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 8 substitutions mécaniques, **1 phrase à réécrire**
  - ligne 174 — « …pacing:-.028em;margin:0 0 16px;scroll-margin-top:20px">Ce que 200 € de plus changent vraiment Entre une batterie à 298 € et une batterie à ⟦498 €⟧, la différence ne se jo… »
- [ ] `Les-Bases-Electronique-Ou-Acoustique.dc.html` → `/les-bases/batterie-electronique-ou-acoustique/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 498 € est en ligne sur 32 pages — `/avis/alesis-nitro-max/`, `/avis/donner-ded-200x/`, `/avis/`, `/avis/millenium-mps-450/`, `/avis/millenium-mps-750x/`, `/avis/millenium-mps-750x-pro/`, `/avis/millenium-mps-850/`, `/avis/roland-td-02kv/`, `/avis/roland-td313/`, `/avis/woodbrass-ddx50/`, `/avis/yamaha-dtx432k/`, `/duels/alesis-nitro-max-vs-millenium-mps-750x/`, `/duels/alesis-nitro-max-vs-nitro-pro/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/duels/millenium-mps-750x-vs-mps-850/`, `/guides/acheter-batterie-electronique-occasion/`, `/guides/ameliorer-batterie-electronique/`, `/guides/batterie-electronique-bluetooth/`, `/guides/batterie-electronique-compacte/`, `/guides/batterie-electronique-metal/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/black-friday-batterie-electronique/`, `/guides/choisir-batterie-electronique-ado/`, `/guides/choisir-batterie-electronique-adulte-debutant/`, `/guides/choisir-batterie-electronique-appartement/`, `/guides/double-pedale-batterie-electronique/`, `/guides/pack-batterie-electronique-complet/`, `/guides/prix-batterie-electronique/`, `/`, `/les-bases/batterie-electronique-ou-acoustique/`. Elles suivront au portage.

**Données** : 4 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 6 entrées de `design/port-corrections.json` citent 498 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(4 occurrences dans les documents internes, qui ne se publient jamais.)_

### Alesis Debut Kit — 279 € → 239 € (-40 €)

Relevé chez Woodbrass le 2026-11-16, par page. Lien publié : https://www.woodbrass.com/kit-electroniques-alesis-debutkit-mesh-kit-4-futs-3-cymbales-p340997.html

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 314 — « …x(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fff;border-top:1.5px solid #e4d8c6;align-items:center"> Alesis Debut Kit ⟦279 €⟧ Moin… »
- [ ] `Guide-Enfant.dc.html` → `/guides/choisir-batterie-electronique-enfant/` — 5 substitutions mécaniques
- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 279 € est en ligne sur 5 pages — `/avis/`, `/avis/millenium-hd-120/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/choisir-batterie-electronique-enfant/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 5 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 9 entrées de `design/port-corrections.json` citent 279 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Donner DED-70 — 219,99 € → 189,99 € (-30 €)

Relevé chez Donner Music le 2026-11-16, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/donner-ded-70-electronic-drum-set

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 317 — « …x(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fdf6ec;border-top:1.5px solid #e4d8c6;align-items:center"> Donner DED-80 ⟦219,99 €⟧ M… »
- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 219,99 € est en ligne sur 3 pages — `/avis/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 6 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 12 entrées de `design/port-corrections.json` citent 219,99 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(1 occurrence dans les documents internes, qui ne se publient jamais.)_

### Alesis Nitro Max Kit — 409 € → 379 € (-30 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/alesis_nitro_max_kit.htm

**Ce que cet écart invalide** (procédure §05) :

- **L'écart du duel `/duels/alesis-nitro-max-vs-donner-ded-200x/` bouge** : Alesis Nitro Max Kit vs Donner DED-200 Pro, 251 € d'écart → 281 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.
- **L'écart du duel `/duels/alesis-nitro-max-vs-roland-td-02kv/` bouge** : Alesis Nitro Max Kit vs Roland TD-02KV, 89 € d'écart → 119 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.
- **L'écart du duel `/duels/alesis-nitro-max-vs-millenium-mps-750x/` bouge** : Alesis Nitro Max Kit vs Millenium MPS-750X Mesh, 89 € d'écart → 65 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.
- **L'écart du duel `/duels/millenium-mps-450-vs-alesis-nitro-max/` bouge** : Alesis Nitro Max Kit vs Millenium MPS-450, 11 € d'écart → 19 €, **et il s'inverse : le moins cher n'est plus le même, le verdict lui-même peut basculer**. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.
- **L'écart du duel `/duels/alesis-nitro-max-vs-nitro-pro/` bouge** : Alesis Nitro Max Kit vs Alesis Nitro Pro XL, 320 € d'écart → 350 €. L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis-Alesis-Nitro-Max.dc.html` → `/avis/alesis-nitro-max/` — 4 substitutions mécaniques, **1 phrase à réécrire**
  - ligne 98 — « …la batterie qu'on conseille les yeux fermés (ou presque) Cinq fûts en mesh, trois cymbales, du Bluetooth, un module qui tient la route et ⟦409 €⟧ à sortir. C'est le meill… »
- [ ] `Avis-Alesis-Turbo-Mesh.dc.html` → `/avis/alesis-turbo-mesh/` — 1 substitution mécanique
- [ ] `Avis-Donner-DED-200X.dc.html` → `/avis/donner-ded-200x/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 218 — « …d8c6"> Alesis Nitro Max ⟦409 €⟧ 8 pads Moins chère affichée, sans casque ni siège. Un meilleur module, le Bluetooth. <div data-rwd="tblrow" style="display:grid;grid-templ… »
- [ ] `Avis-Millenium-MPS-150X.dc.html` → `/avis/millenium-mps-150x/` — 1 substitution mécanique, **1 phrase à réécrire**
  - ligne 122 — « …nderline;text-underline-offset:3px">MPS-150X contre MPS-450 dit ce que cent euros de plus apportent. Si tu hésites entre attendre deux mois pour mettre ⟦409 €⟧ dans une N… »
- [ ] `Avis-Millenium-MPS-450.dc.html` → `/avis/millenium-mps-450/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 226 — « …d8c6"> Alesis Nitro Max ⟦409 €⟧ Tout mesh Onze euros de plus pour le Bluetooth et une meilleure revente. <div data-rwd="tblrow" style="display:grid;grid-template-columns:… »
- [ ] `Avis-Millenium-MPS-850.dc.html` → `/avis/millenium-mps-850/` — 0 substitution mécanique, **2 phrases à réécrire**
  - ligne 123 — « …e. Pas à un débutant complet. Six cents euros pour un premier kit, c'est de l'argent mal placé : tu apprendras exactement la même chose sur une Nitro Max à ⟦409 €⟧. Tu ga… »
  - ligne 231 — « …/div> Alesis Nitro Max ⟦409 €⟧ Tout mesh Cent quatre-vingt-neuf euros de moins et le Bluetooth. Notre choix pour débuter. <div data-rwd="tblrow" style="display:… »
- [ ] `Avis-Yamaha-DTX432K.dc.html` → `/avis/yamaha-dtx432k/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 234 — « …d8c6"> Alesis Nitro Max ⟦409 €⟧ Tout mesh Quatre-vingt-neuf euros de moins et du mesh sur tous les fûts. <p style="font:400 14px/1.5 'Work Sans',sans-serif;color:#786550;… »
- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 167 — « …h:100%;height:100%;object-fit:contain;display:block;padding:10px;box-sizing:border-box"> ALESIS · ⟦409 €⟧ Nitro Max Kit Le Bluetooth et des sons BFD, onze euros de plus q… »
- [ ] `Duel-Alesis-Nitro-Max-vs-Donner-DED-200.dc.html` → `/duels/alesis-nitro-max-vs-donner-ded-200x/` — 1 substitution mécanique, **1 phrase à réécrire**
  - ligne 116 — « …e Grotesque',sans-serif;letter-spacing:-.025em;margin-bottom:12px">Nitro Max Mesh ⟦409 €⟧ prix indicatif Moins chère, du Bluetooth, un module bien plus fourni. Une cymbal… »
- [ ] `Duel-Alesis-Nitro-Max-vs-Roland-TD-02KV.dc.html` → `/duels/alesis-nitro-max-vs-roland-td-02kv/` — 2 substitutions mécaniques
- [ ] `Duel-Millenium-MPS-750X-vs-MPS-850.dc.html` → `/duels/millenium-mps-750x-vs-mps-850/` — 1 substitution mécanique, **1 phrase à réécrire**
  - ligne 276 — « …;? Aucune des deux, si tu n'as jamais joué. La Nitro Max à ⟦409 €⟧ t'apprendra exactement la même chose. La différence paiera un bon casque. Notre guide à moins de 500 € … »
- [ ] `Guide-Adulte-Debutant.dc.html` → `/guides/choisir-batterie-electronique-adulte-debutant/` — 3 substitutions mécaniques
- [ ] `Guide-Moins-De-1000-Euros.dc.html` → `/guides/batterie-electronique-moins-1000-euros/` — 2 substitutions mécaniques, **2 phrases à réécrire**
  - ligne 161 — « …4a3d31;flex:1">Cinq cents euros de moins. Rien de moins pour apprendre. ⟦409 €⟧ L'avis → <h2 id="ecart" data-big="d" style="font:800 32px/1.… »
  - ligne 288 — « …iv> Le conseil de BipBop Si aucun de ces trois cas ne te concerne, prends la Nitro Max à ⟦409 €⟧ et garde la différence. Dans dix-huit mois tu sauras exactement ce qui te… »
- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 6 substitutions mécaniques, **1 phrase à réécrire**
  - ligne 259 — « …eux Millenium dit si l'écart de {ecart:mps450-mps150x} vaut le coup. Notre choix : Alesis Nitro Max, ⟦409 €⟧ <div style="height:190px;borde… »
- [ ] `Les-Bases-Electronique-Ou-Acoustique.dc.html` → `/les-bases/batterie-electronique-ou-acoustique/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 409 € est en ligne sur 35 pages — `/avis/alesis-nitro-max/`, `/avis/alesis-nitro-pro/`, `/avis/alesis-turbo-mesh/`, `/avis/donner-ded-200x/`, `/avis/`, `/avis/millenium-mps-150x/`, `/avis/millenium-mps-450/`, `/avis/millenium-mps-750x/`, `/avis/millenium-mps-850/`, `/avis/roland-td-02kv/`, `/avis/woodbrass-ddx50/`, `/avis/yamaha-dtx432k/`, `/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/duels/alesis-nitro-max-vs-millenium-mps-750x/`, `/duels/alesis-nitro-max-vs-nitro-pro/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/duels/millenium-mps-150x-vs-alesis-turbo-mesh/`, `/duels/millenium-mps-150x-vs-mps-450/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/duels/millenium-mps-750x-vs-mps-850/`, `/guides/acheter-batterie-electronique-occasion/`, `/guides/batterie-electronique-bluetooth/`, `/guides/batterie-electronique-metal/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/black-friday-batterie-electronique/`, `/guides/choisir-batterie-electronique-ado/`, `/guides/choisir-batterie-electronique-adulte-debutant/`, `/guides/choisir-batterie-electronique-appartement/`, `/guides/double-pedale-batterie-electronique/`, `/guides/pack-batterie-electronique-complet/`, `/guides/prix-batterie-electronique/`, `/`, `/les-bases/accessoires-batterie-electronique/`, `/les-bases/batterie-electronique-ou-acoustique/`. Elles suivront au portage.

**Données** : 2 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 5 entrées de `design/port-corrections.json` citent 409 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

### Alesis Nitro Amp — 98 € → 69 € (-29 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/alesis_nitro_amp.htm

> ⚠ **98 € est aussi le prix publié de Alesis Nitro Max Expansion Pack, Millenium CC-15 15" Crash, Roland RT-30K Kick Trigger.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Faire-Evoluer-Sa-Batterie.dc.html` → `/guides/ameliorer-batterie-electronique/` — 2 substitutions mécaniques
- [ ] `Guide-Installer-Sans-Deranger.dc.html` → `/les-bases/batterie-electronique-bruit-voisins/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 98 € est en ligne sur 15 pages — `/duels/alesis-nitro-max-vs-donner-ded-200x/`, `/duels/alesis-nitro-max-vs-millenium-mps-750x/`, `/duels/alesis-nitro-max-vs-nitro-pro/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/duels/millenium-mps-450-vs-alesis-nitro-max/`, `/guides/agrandir-alesis-nitro-max/`, `/guides/ameliorer-batterie-electronique/`, `/guides/ampli-batterie-electronique/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/cadeau-batteur/`, `/guides/cymbale-electronique/`, `/guides/pack-batterie-electronique-complet/`, `/guides/pad-batterie-electronique/`, `/guides/transformer-batterie-acoustique-electronique/`, `/les-bases/batterie-electronique-bruit-voisins/`. Elles suivront au portage.

**Données** : 11 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 9 entrées de `design/port-corrections.json` citent 98 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(2 occurrences dans les documents internes, qui ne se publient jamais.)_

### Millenium HD-120 E-Drum Set — 219 € → 198 € (-21 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/millenium_hd_120_e_drum_set.htm

> ⚠ **219 € est aussi le prix publié de Roland FD-9, Roland KD-10 Kick Pad.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 186 — « …/div> Millenium HD-120 ⟦219 €⟧ Caoutchouc 120 sons Vingt euros de plus que la Donner, mais siège, casque et baguettes dans le carton.</di… »

**Ce que le site publie aujourd'hui** : 219 € est en ligne sur 6 pages — `/avis/`, `/avis/millenium-hd-120/`, `/guides/batterie-electronique-compacte/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/double-pedale-batterie-electronique/`, `/guides/pad-grosse-caisse-batterie-electronique/`. Elles suivront au portage.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 3 entrées de `design/port-corrections.json` citent 219 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

### Millenium Rookie E-Drum Set — 179 € → 159 € (-20 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/millenium_rookie_e_drum_set.htm

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Avis.dc.html` → `/avis/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 308 — « …x(150px,1.2fr) minmax(86px,.55fr) minmax(110px,.7fr) minmax(190px,1.5fr);background:#fff;border-top:1.5px solid #e4d8c6;align-items:center"> Millenium Rookie ⟦179 €⟧ Moin… »
- [ ] `Guide-Enfant.dc.html` → `/guides/choisir-batterie-electronique-enfant/` — 3 substitutions mécaniques
- [ ] `Guide-Moins-De-300-Euros.dc.html` → `/guides/batterie-electronique-moins-300-euros/` — 1 substitution mécanique

**Ce que le site publie aujourd'hui** : 179 € est en ligne sur 8 pages — `/avis/`, `/avis/millenium-hd-120/`, `/guides/batterie-electronique-compacte/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/black-friday-batterie-electronique/`, `/guides/choisir-batterie-electronique-enfant/`, `/guides/ou-acheter-batterie-electronique/`, `/guides/prix-batterie-electronique/`. Elles suivront au portage.

**Données** : 1 occurrence dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 1 entrée de `design/port-corrections.json` citent 179 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(2 occurrences dans les documents internes, qui ne se publient jamais.)_

### Millenium DM-30 Drum Monitor — 149 € → 129 € (-20 €)

Relevé chez Thomann le 2026-11-16, par le flux marchand. Lien publié : https://www.thomann.fr/millenium_dm30_drum_monitor.htm

> ⚠ **149 € est aussi le prix publié de Yamaha TP70S 7,5 pouces 3 zones, Alesis Nitro Amp Pro.**
> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Moins-De-500-Euros.dc.html` → `/guides/batterie-electronique-moins-500-euros/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 206 — « …nt-weight:600;white-space:nowrap">349 € Caoutchouc 16 kits Les sons Roland sans le mesh. On préfère mettre ⟦149 €⟧ de plus. <div style="padding:12px 0 1… »

**Ce que le site publie aujourd'hui** : 149 € est en ligne sur 2 pages — `/guides/ampli-batterie-electronique/`, `/guides/pad-batterie-electronique/`. Elles suivront au portage.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

**Greffes déjà déclarées** : 2 entrées de `design/port-corrections.json` citent 149 €. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.

_(3 occurrences dans les documents internes, qui ne se publient jamais.)_

### Donner DT-50 — 72,99 € → 65,99 € (-7 €)

Relevé chez Donner Music le 2026-11-16, par le flux marchand. Lien publié : https://fr.donnermusic.com/products/siege-de-batterie-mince-donner-dt-50-marron

**Où écrire la correction** — dans les maquettes, jamais dans `src/pages/` (loi 1) :

- [ ] `Guide-Ou-Acheter.dc.html` → `/guides/ou-acheter-batterie-electronique/` — 0 substitution mécanique, **1 phrase à réécrire**
  - ligne 135 — « …if;color:#3a2f26;margin:0 0 18px;text-wrap:pretty">Ses fiches proposent aussi des variantes : la DED-200 Pro seule ou avec un tabouret, par exemple. Le 14 octobre, la var… »

**Ce que le site publie aujourd'hui** : 72,99 € est en ligne sur 1 page — `/guides/ou-acheter-batterie-electronique/`. Elles suivront au portage.

**Données** : 3 occurrences dans `src/data/` et `design/prix-reperes.json` — mécaniques, régénérées par `npm run data`.

_(2 occurrences dans les documents internes, qui ne se publient jamais.)_

## 3. Ruptures de stock

La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.

### 19 ruptures qui demandent une décision

| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |
| --- | --- | ---: | ---: | --- |
| **Thomann E-Drum Rug Black 120** | actuellement indisponible | 59 € | 1 relevé | `/avis/alesis-nitro-max/`, `/avis/alesis-nitro-pro/`, `/avis/alesis-turbo-mesh/`, `/avis/donner-ded-200x/`, `/avis/millenium-hd-120/`, `/avis/millenium-mps-1000/`, `/avis/millenium-mps-150x/`, `/avis/millenium-mps-450/`, `/avis/millenium-mps-750x/`, `/avis/millenium-mps-750x-pro/`, `/avis/millenium-mps-850/`, `/avis/roland-td-02kv/`, `/avis/woodbrass-ddx50/`, `/avis/yamaha-dtx432k/`, `/guides/batterie-electronique-moins-1000-euros/`, `/guides/batterie-electronique-moins-300-euros/`, `/guides/batterie-electronique-moins-500-euros/`, `/guides/pack-batterie-electronique-complet/`, `/les-bases/accessoires-batterie-electronique/`, `/les-bases/batterie-electronique-bruit-voisins/`, `/les-bases/tapis-batterie-electronique/` |
| **Roland TD-02KV** | Disponible sous 4-5 semaines | 498 € | 2 relevés | `/avis/roland-td-02kv/`, `/duels/alesis-nitro-max-vs-roland-td-02kv/`, `/guides/batterie-electronique-compacte/`, `/guides/choisir-batterie-electronique-adulte-debutant/`, `/guides/choisir-batterie-electronique-appartement/`, `/` |
| **Vic Firth SIH3 Headphones** | Disponible sous 4-5 semaines | 92 € | 1 relevé | `/les-bases/casque-anti-bruit-batterie/`, `/les-bases/casque-batterie-electronique/` |
| **Alesis Nitro Multicore** | Disponible sous 5-7 semaines | 89 € | 4 relevés | `/guides/acheter-batterie-electronique-occasion/` |
| **Alesis DRP100** | hors stock, sans date annoncée | 53 € | 2 relevés | `/les-bases/casque-anti-bruit-batterie/` |
| **Roland NE-1 Noise Eater** | hors stock, sans date annoncée | 39 € | 2 relevés | `/les-bases/batterie-electronique-bruit-voisins/` |
| **Vic Firth 12" VF Practice Pad** | Disponible sous 6-8 semaines | 58 € | 2 relevés | `/guides/pad-entrainement-batterie/` |
| **Roland NE-10 Noise Eater** | hors stock, sans date annoncée | 138 € | 1 relevé | `/les-bases/batterie-electronique-bruit-voisins/` |
| Roland PM-03 Monitor System | actuellement indisponible | 229 € | 4 relevés | — |
| Protection Racket E-Drum Kit Bag 28x16 | Disponible sous 12-15 semaines | 153 € | 4 relevés | — |
| Roland RT-30K Kick Trigger | actuellement indisponible | 98 € | 3 relevés | — |
| Roland OP-TD1C Cymbal Set | hors stock, sans date annoncée | 139 € | 2 relevés | — |
| Nux Kit tom 10 pouces + clamp | hors stock, sans date annoncée | 99 € | 2 relevés | — |
| Yamaha DTX6K2-X | Disponible sous 12-15 semaines | 1 198 € | 1 relevé | — |
| Vic Firth American Classic spécial électronique | hors stock, sans date annoncée | 15,90 € | 1 relevé | — |
| Yamaha PCY-135 | Disponible sous 2-3 semaines | 125 € | 1 relevé | — |
| Yamaha KP-65A | Disponible sous 2-3 semaines | 77 € | 1 relevé | — |
| Yamaha RCL500 Clamp | Disponible sous 11-14 semaines | 32 € | 1 relevé | — |
| Yamaha DT50K Kick Trigger | actuellement indisponible | 74 € | 1 relevé | — |

**5 référence à traiter maintenants** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis `marchand` + `url` dans `design/prix-reperes.json`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).

- Roland TD-02KV — /avis/roland-td-02kv/, /duels/alesis-nitro-max-vs-roland-td-02kv/, /guides/batterie-electronique-compacte/, /guides/choisir-batterie-electronique-adulte-debutant/, /guides/choisir-batterie-electronique-appartement/, / — https://www.thomann.fr/roland_td_02kv_v_drums_kit.htm
- Alesis Nitro Multicore — /guides/acheter-batterie-electronique-occasion/ — https://www.thomann.fr/alesis_nitro_multicore.htm
- Alesis DRP100 — /les-bases/casque-anti-bruit-batterie/ — https://www.woodbrass.com/casques-et-bouchons-alesis-dmphones-p211049.html
- Roland NE-1 Noise Eater — /les-bases/batterie-electronique-bruit-voisins/ — https://www.woodbrass.com/pads-accessoires-roland-ne-1-absorbeur-de-sons-noise-eater-p167491.html
- Vic Firth 12" VF Practice Pad — /guides/pad-entrainement-batterie/ — https://www.thomann.fr/vic_firth_12_vf_practice_pad.htm

À resurveiller au prochain relevé (liées depuis une page, mais en rupture pour la première fois) : Thomann E-Drum Rug Black 120 · Vic Firth SIH3 Headphones · Roland NE-10 Noise Eater.

Les 11 autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.

### 2 délais courts, pour mémoire — aucune action

- Yamaha DTX452K (Thomann) — Disponible sous 1-2 semaines
- Roland RSH-10 Smartphone Holder (Thomann) — Disponible sous 1-2 semaines

## 4. Références disparues du catalogue

Une absence du flux n'a jamais suffi : chacune a été confirmée sur sa propre fiche, parce que ce constat déclenche le retrait d'une référence du site. Quatre actions à l'Aide-Mémoire §04 — retirer la ligne du comparatif, poser un bandeau sur la fiche d'avis **sans la supprimer**, remplacer le modèle dans les guides par son successeur plutôt que de le retirer, passer le statut à « retiré » au plan et dans la sélection.

- **Alesis Turbo Mesh Kit** (Thomann) — publié 309 €
  - preuve : absente du flux, et la page répond HTTP 404
  - lien publié : https://www.thomann.fr/alesis_turbo_mesh_kit.htm
  - aucun produit du même nom ailleurs dans le catalogue : c'est bien un retrait (Aide-Mémoire §04).
- **Donner Pupitre de batterie** (Donner Music) — publié 39,99 €
  - preuve : absente du flux, et la page répond HTTP 429
  - lien publié : https://fr.donnermusic.com/products/donner-drum-music-stand
  - **le même produit existe encore sous une autre adresse** — avant de retirer quoi que ce soit, vérifier ces 3 candidats :
    - Donner DT-50 Tabouret de Batterie — 65,99 € (**+26 €** par rapport au prix publié) — https://fr.donnermusic.com/products/siege-de-batterie-mince-donner-dt-50-marron
    - Donner DDA-20SE Enceinte de monitoring de batterie — 129,99 € (**+90 €** par rapport au prix publié) — https://fr.donnermusic.com/products/donner-dda-20se-drum-monitor-speaker
    - Donner DED-70 Batterie électronique adaptée aux adolescents — 189,99 € (**+150 €** par rapport au prix publié) — https://fr.donnermusic.com/products/donner-ded-70-electronic-drum-set
    Si c'est bien le même produit, ce n'est pas un retrait : c'est `url` **et** `prix` à changer ensemble dans `design/prix-reperes.json`, sinon le prix affiché ne vient plus du marchand vers lequel pointe le lien.

## 5. Non relevées

Aucune.

## 6. Les dates de relevé affichées

L'Aide-Mémoire §05 date le comparatif, les guides par budget et la page de sélection **à chaque relevé**, les avis et les duels seulement à chaque modification de fond. Une date rafraîchie sans changement est un mensonge ; une date qui traîne alors qu'on a vérifié le prix est une information perdue.

23 pages affichent une date de relevé antérieure au 2026-11-16 :

- `/avis/alesis-nitro-max/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-450/` — « relevés chez Thomann le 11 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/alesis-nitro-max-vs-roland-td-02kv/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/choisir-batterie-electronique-adulte-debutant/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-ou-acoustique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/casque-batterie-electronique/` — « relevés chez Thomann le 12 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-turbo-mesh/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-150x/` — « relevés chez Thomann le 17 septembre 2026 » _(ne suit que les modifications de fond)_
- `/duels/millenium-mps-750x-vs-mps-850/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/pad-entrainement-batterie/` — « relevés chez Thomann le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/baguettes-batterie-electronique/` — « relevés chez Thomann et Woodbrass le 23 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/apprendre-la-batterie/` — « relevés chez des libraires en ligne le 29 septembre 2026 » _(ne suit que les modifications de fond)_
- `/les-bases/batterie-electronique-bruit-voisins/` — « relevés chez Thomann et Woodbrass, revérifiés le 10 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/alesis-nitro-pro/` — « relevés chez Thomann le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/enregistrer-batterie-electronique-ordinateur/` — « relevés chez Thomann et Woodbrass le 12 octobre 2026 » _(ne suit que les modifications de fond)_
- `/guides/ameliorer-batterie-electronique/` — « relevés chez Thomann le 19 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/yamaha-dtx432k/` — « relevés chez Thomann, revérifiés le 21 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-850/` — « relevés chez Thomann, revérifiés le 22 octobre 2026 » _(ne suit que les modifications de fond)_
- `/avis/` — « relevés chez Thomann, Woodbrass et Donner Music le 3 novembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-hd-120/` — « relevés chez Thomann et Woodbrass le 3 novembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/millenium-mps-750x-pro/` — « relevés chez Thomann le 3 novembre 2026 » _(ne suit que les modifications de fond)_
- `/avis/woodbrass-ddx50/` — « relevés chez Thomann et Woodbrass le 3 novembre 2026 » _(ne suit que les modifications de fond)_
- `/guides/batterie-electronique-moins-1000-euros/` — « relevés chez Thomann le 3 novembre 2026 » **← à faire suivre à chaque relevé**

---

_Écrit par `scripts/prix/rapport.mjs` depuis `releves/prix-2026-11-16.json`. Ce fichier est réécrit à chaque relevé._
