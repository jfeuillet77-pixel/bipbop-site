# BipBop — Site d'affiliation batteries électroniques

Site statique Astro 5 déployé sur Netlify. Domaine : **bipbop.eu**

## ⚠️ RÈGLE ABSOLUE — Source de vérité du design

**Les fichiers de design Claude Design (dossier `Formulaire de périmètre et données/*.dc.html`) sont la source de vérité unique pour le contenu, la structure, le ton et le design de chaque page.**

### Ce qu'il faut faire

- **Reproduire FIDÈLEMENT** le contenu textuel, la structure HTML, les sections, le ton et les éléments visuels du fichier `.dc.html` correspondant lors de l'implémentation de chaque page.
- Chaque section, chaque paragraphe, chaque titre, chaque encart, chaque sidebar doit être présent dans la page Astro telle qu'elle apparaît dans le `.dc.html`.
- Le layout (nombre de colonnes, sidebar, grille, etc.) doit correspondre exactement au design.

### Ce qu'il ne faut JAMAIS faire

- **Ne JAMAIS simplifier, résumer, réécrire ou réinventer** le contenu d'un fichier `.dc.html`.
- **Ne JAMAIS supprimer des sections** présentes dans le design.
- **Ne JAMAIS remplacer du contenu** par une version "plus courte" ou "plus simple".
- **Ne JAMAIS prendre d'initiative** sur le contenu éditorial — tout vient du `.dc.html`.

### Pourquoi

Une implémentation approximative (page réécrite au lieu d'être reproduite fidèlement) oblige à refaire le travail et fait perdre du temps et de l'argent. La priorité est la fidélité au design, pas l'économie de tokens.

## Stack

- **Framework :** Astro 5
- **Hébergement :** Netlify (statique)
- **Domaines :** bipbop.eu (primaire), bipbop.fr (secondaire) — OVH
- **DNS :** Nameservers Netlify

## Structure

```
bipbop-site/
├── src/
│   ├── pages/          → Pages Astro (une par route)
│   ├── components/     → Composants réutilisables
│   ├── layouts/        → Layouts (BaseLayout, etc.)
│   └── styles/         → CSS global + variables design system
├── public/             → Assets statiques (favicon, etc.)
├── dist/               → Build de production
└── package.json
```

## Correspondance Design → Implémentation

| Fichier Claude Design | Page Astro |
|---|---|
| `Accueil.dc.html` | `src/pages/index.astro` |
| `Comparatif.dc.html` | `src/pages/comparatif/index.astro` |
| `Avis.dc.html` | `src/pages/avis/index.astro` |
| `Avis-Alesis-Nitro-Max.dc.html` | `src/pages/avis/alesis-nitro-max/index.astro` |
| `Avis-Millenium-MPS-150X.dc.html` | `src/pages/avis/millenium-mps-150x/index.astro` |
| `Avis-Roland-TD-02KV.dc.html` | `src/pages/avis/roland-td-02kv/index.astro` |
| `Guides.dc.html` | `src/pages/guides/index.astro` |
| `Guide-Appartement.dc.html` | `src/pages/guides/batterie-appartement/index.astro` |
| `Guide-Moins-De-500-Euros.dc.html` | `src/pages/guides/meilleure-batterie-moins-500-euros/index.astro` |
| `Duel-Alesis-Nitro-Max-vs-Donner-DED-200.dc.html` | `src/pages/duels/alesis-nitro-max-vs-donner-ded-200x/index.astro` |
| `Les-Bases-Pad-Mesh.dc.html` | `src/pages/les-bases/pad-mesh/index.astro` |
| `A-Propos.dc.html` | `src/pages/a-propos/index.astro` |
| `Contact.dc.html` | `src/pages/contact/index.astro` |
| `Mentions-Legales.dc.html` | `src/pages/mentions-legales/index.astro` |
| `Politique-Confidentialite.dc.html` | `src/pages/politique-confidentialite/index.astro` |
| `404.dc.html` | `src/pages/404.html` |

## Commandes

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement (localhost:4321) |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualiser le build |

## Git

- Branche de travail : **dev** (push quotidien)
- Branche de production : **main** (merge en fin de cycle)
- Ne JAMAIS mettre de secret dans une URL de remote
