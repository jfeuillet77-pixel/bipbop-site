# BipBop — règles de travail

**Une session = lire dans cet ordre** : `design/plan-de-reprise.md` (où on en est, quoi faire,
quelles questions attendent Jordane), `README.md` (règle de fidélité),
`design/crochets-responsive.md` (comment rendre une page responsive ici),
`design/ecarts-maquettes.md` (ce que la maquette contredit avec sa propre source).

## Les cinq lois non négociables

1. **On ne retape pas une maquette, on la porte.** `node scripts/port.mjs` écrit les 37 pages
   statiques depuis `../Claude Design - MàJ/<Page>.dc.html`, corps et `<style>` mot pour mot. Une
   page se modifie dans Claude Design, puis se re-porte — jamais à la main dans `src/pages/` :
   l'édition serait écrasée au portage suivant. Écrire une page à la main, c'est créer les dérives
   que `npm run fidelite` aurait ensuite à réparer.
2. **Un écart assumé avec la maquette se déclare, il ne se tape pas.** Prix faux, faute : une
   entrée dans `design/port-corrections.json` avec sa raison et sa source, appliquée à chaque
   portage. Le portage échoue si le texte d'origine a bougé, ce qui force la relecture.
   Sinon c'est `src/data/` qui a raison et la divergence s'écrit dans `design/ecarts-maquettes.md`.
3. **Le responsive vient de la maquette, tel quel.** Le bloc `<!--responsive-->` porte les crochets
   `data-rwd` / `data-pad` / `data-mar` / `data-big` / `data-sticky` / `data-hdr` et leurs
   `@media 1080 / 860 / 620`. Les styles étant en ligne, un sélecteur qui cible `style="…"` ne
   matche jamais rien. Un tableau de 4 colonnes ou plus **défile**, il ne se replie pas.
4. **Publier une page a des conséquences sur 3 à 6 autres.** Les listes de l'`Aide-Memoire`
   §01 à §04 ne sont pas optionnelles : hubs, compteurs, maillage, comparatif, plan éditorial.
5. **`npm run check` et `npm run fidelite` doivent passer** avant un commit. `check` mesure
   réellement la largeur de défilement dans Chrome à 1024 / 900 / 768 / 390 px ; `fidelite`
   compare chaque page à sa maquette segment par segment. Une page peut paraître correcte et casser.

**Exceptions à la loi 1** : `/comparatif/` est la seule page dynamique du dossier (`DCLogic`,
42 liaisons `{{ }}`) — elle reste en `src/pages/comparatif/index.astro` et se maintient à la main.
`404.html` se porte aussi (route sans permalien).

## Ce qui ne se publie jamais

`support.js`, `doc-page.js`, `_at.json`, `_x.json`, les 5 CSV et le JSON brut de `data/`,
et les 8 documents internes (`Guide-Du-Projet`, `Design-System`, `Selection-Produits`,
`Brief-Mascotte`, `Assets-Mascotte`, `Brief-Responsive`, `Aide-Memoire-Mises-A-Jour`,
`Procedure-Mise-A-Jour-Prix`). Aucun ne doit apparaitre dans un sitemap ou une navigation.

## Interdits de contenu

**Aucun lien affilié** — le site n'a pas de programme d'affiliation, et les tags des maquettes
(`?offid=1&affid=3711` chez Thomann, passerelle `donnnermusic.sjv.io` chez Donner) appartiennent à
un autre site de Jordane. `urlPublique()` les retire au portage et à l'import ; le contrôle 7 de
`verif.mjs` fait échouer `npm run check` si un marqueur de traçage survit. Ne jamais « réparer » un
lien affilié à la main dans une page : la maquette le ramènerait.

Aucun protocole de test inventé · aucune note chiffrée sans grille affichée · aucune signature
individuelle · aucun article sponsorisé · ne jamais reprendre un **prix barré Donner** · ne
jamais utiliser un **prix de bundle Thomann** comme prix du modèle · **ne jamais inventer une URL
produit** · pas de virgule avant « et » ni avant « ou » · pas de tiret cadratin · tutoiement du
premier au dernier mot.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
