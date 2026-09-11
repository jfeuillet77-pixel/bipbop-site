# Journal BipBop

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

### À faire ensuite (Lot 2 — 4-8 semaines)
- Guide < 300 €
- Guide enfant 6-12 ans
- Mesh vs caoutchouc
- Avis Yamaha DTX432K
- Avis Donner DED-200X
- Avis Millenium MPS-450
- Casque pour batterie électronique
- Tapis de batterie
- Hub duels

### À faire ensuite (Lot 3 — 3-6 mois)
- 38 pages restantes (guides, avis, duels, les bases, hub les bases)

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
