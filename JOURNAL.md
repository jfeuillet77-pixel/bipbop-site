# Journal BipBop

## 11 septembre 2026 — Chantier mascotte, passe 1 : le kit de marque en place

### Contexte
Brief-Mascotte.dc.html lancé le 11 septembre. Trois croquis de direction dessinés (design/mascotte/croquis/), puis Jordane partage Assets-Mascotte.dc.html : le kit de marque officiel qui fixe le personnage, les six fichiers SVG et leurs neuf emplacements. Les croquis deviennent sans objet, le kit arbitre.

### Ce qui a été fait
- Six fichiers SVG recopiés à la géométrie exacte du kit dans `public/` : bipbop-mascotte, bipbop-avatar, bipbop-tete, bipbop-mono, bipbop-marque, bipbop-marque-claire. Contour porté par le groupe racine (encre, épaisseur 10/11/6), aucun attribut id.
- Six composants Astro dans `src/components/mascotte/` : le kit impose l'inclusion en ligne dans le HTML, pas de balise image.
- Emplacements branchés : en-tête 34 px (marque), pied de page 32 px (marque claire), favicon SVG + apple-touch-icon PNG 180 px généré, signature d'article 44 px (avatar), encart « BipBop dit » 52 px bordure jaune, hero accueil 96 px, comparatif 76 px, À propos rectangle 120 × 152 (corps entier), 404 rectangle 200 × 250 avec ombre dure et bulle, bandeau contact en version claire.
- favicon.ico régénéré à la marque (c'était encore le logo Astro).
- Anciens fichiers mascotte-*.svg et favicon.svg supprimés, plus aucune référence.
- `design/mascotte/mascotte-usages.csv` : le tableau des emplacements. Le kit annonçait data/mascotte-usages.csv mais le fichier n'a pas été livré ; reconstruit depuis la section 02 du kit.

### Arbitrages à revoyer par Jordane
- À propos et 404 : les maquettes .dc.html montrent un cercle placeholder, le kit impose un rectangle arrondi (le personnage est plus haut que large). Suivi le kit.
- Encart « BipBop dit » : bordure jaune (maquette) sur fond jaune (kit), les deux sources divergeaient sur le fond.
- Le comparatif fait dire à BipBop « Je teste des batteries toute la journée » : contraire au brief (il collecte, il ne teste pas). Copie hors périmètre de cette passe, signalé, non modifiée.

### Reste à produire (passe 2)
- Les quatre poses : perplexe (404), approbatrice (badge « notre choix »), au travail (À propos), en train de parler (encart). En attendant, la pose neutre occupe ces emplacements, sans simulation par rotation ou déformation (règle 04 du kit).
- Les règles d'usage (taille minimale, zone de protection, fonds autorisés et interdits).
- L'image de partage 1200 × 630.

### Pause de session
Passe 1 commitée sur `dev`, mergée sur `main` et déployée le 11 septembre 2026 pour revue. La passe 2 reprendra dans une prochaine session : tout le contexte nécessaire est dans cette entrée, dans `design/mascotte/mascotte-usages.csv` et dans les deux fichiers Claude Design (`Brief-Mascotte.dc.html`, `Assets-Mascotte.dc.html` à la racine du projet).

---

## 11 septembre 2026 — Lot 1 terminé et déployé

### Ce qui a été fait
- Création du projet Astro 5 dans `bipbop-site/`
- Implémentation du Design System (CSS variables, Bricolage Grotesque + Work Sans + IBM Plex Mono)
- 16 pages du Lot 1 implémentées :
  - Accueil, Comparatif interactif
  - Hub Avis + 3 avis (Alesis Nitro Max, Millenium MPS-150X, Roland TD-02KV)
  - Hub Guides + 2 guides (Appartement, Moins de 500 €)
  - Duel Nitro Max vs DED-200X
  - Les Bases Pad Mesh
  - À propos, Contact, Mentions légales, Politique confidentialité, 404
- Dépôt GitHub créé : github.com/jfeuillet77-pixel/bipbop-site
- Déploiement Netlify : bipbop.netlify.app (public)
- Domaine bipbop.eu connecté (DNS vérifié, HTTPS activé)
- www.bipbop.eu en propagation DNS
- noindex + robots.txt bloquant en place (phase de test)

### Décisions
- Canonical : bipbop.eu (non-www), www redirige en 301
- Stack : Astro 5 + Netlify (statique)
- Liens affiliés Thomann : offid=1&affid=3711

---

## 11 septembre 2026 — Audit de fidélité au design Claude Design

### Problème
La page "À propos" publiée ne correspondait pas au design Claude Design — elle avait été simplifiée/réécrite au lieu d'être reproduite fidèlement. Jordane a demandé un audit complet de toutes les pages.

### Règle mise en place
**Règle absolue** : les fichiers `Formulaire de périmètre et données/*.dc.html` sont la source de vérité unique. Ne JAMAIS simplifier, résumer ou réinventer le contenu. Documentée dans le README.md et en mémoire.

### Audit complet — 16 pages vérifiées par lots de 2

| Lot | Pages | Résultat |
|---|---|---|
| 1 | Accueil, Comparatif | ✅ Déjà conformes |
| 2 | Hub Avis, Avis Nitro Max | Hub Avis ❌ → corrigé. Avis Nitro Max ✅ |
| 3 | Avis MPS-150X, Avis TD-02KV | ❌ Les deux → corrigés (contenu inventé, sections absentes, notes wrong) |
| 4 | Hub Guides, Guide Appartement | ❌ Les deux → corrigés (structure, images, FAQ, budget, checklist absents) |
| 5 | Guide Moins 500 €, Duel | ❌ Les deux → corrigés (tableaux, sections, sidebar absents) |
| 6 | Les Bases Pad Mesh, Contact | ❌ Les deux → corrigés (encarts, tableaux, formulaire, sidebar absents) |
| 7 | Mentions Légales, Politique Confidentialité | ❌ Les deux → corrigés (tableaux, sections, encarts absents) |
| 8 | 404 | ❌ Manquante → créée (404 géant, mascotte, pages utiles) |

### Résultat
- **13 pages réécrites** pour reproduire fidèlement les designs Claude Design
- **1 page créée** (404)
- **2 pages déjà conformes** (Accueil, Comparatif)
- **1 page déjà conforme** (Avis Nitro Max)
- Merge sur `main`, déployé sur Netlify

---

## À faire ensuite (Lot 2 — 4-8 semaines)

### Pages restantes du plan éditorial (38 pages)
- Guide < 300 €
- Guide < 1 000 €
- Guide enfant 6-12 ans
- Guide adulte qui débute
- Pack complet prêt à jouer
- Mesh vs caoutchouc
- Électronique vs acoustique
- Acheter d'occasion
- Avis Yamaha DTX432K
- Avis Donner DED-200X
- Avis Millenium MPS-450
- Avis Millenium MPS-750X
- Avis Millenium MPS-1000
- Avis Alesis Nitro Pro
- Avis Alesis Nitro Ultimate
- Avis Alesis Turbo Mesh
- Avis Yamaha DTX402K
- Avis Roland TD-02K
- Avis Nux DM-110
- Avis Woodbrass DDX50-Mesh
- Duel Nitro Max vs TD-02KV
- Duel MPS-150X vs Turbo Mesh
- Hub duels
- Hub les bases
- Casque pour batterie électronique
- Tapis de batterie
- Siège de batterie
- Baguettes pour débutants
- Brancher sa batterie à un PC
- Enregistrer sa batterie
- Choisir ses premiers cours
- Batterie pour gaucher
- Entretenir sa batterie électronique
- Comparatif complet (tous les modèles)
- Page sélection produits
- Guide du projet
- Design system (page publique)
- Brief mascotte

### Retraits du noindex
Quand le site est prêt pour le SEO :
1. Retirer `<meta name="robots" content="noindex, nofollow">` de BaseLayout.astro
2. Remplacer public/robots.txt par :
   ```
   User-agent: *
   Allow: /
   Sitemap: https://bipbop.eu/sitemap-index.xml
   ```
3. Générer un sitemap (plugin Astro ou manuel)

### Champs à compléter avant publication SEO
- Mentions légales : adresse postale, SIREN, TVA, email (surlignés en jaune dans le design)
- Politique confidentialité : nom raison sociale, email, hébergeur, outil analytics (surlignés en jaune)
