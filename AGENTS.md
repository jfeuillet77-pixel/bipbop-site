# BipBop — règles de travail

**Une session = lire dans cet ordre** : `README.md` (règle de fidélité),
`design/crochets-responsive.md` (comment rendre une page responsive ici),
`design/ecarts-maquettes.md` (ce que la maquette contredit avec sa propre source).

## Les cinq lois non négociables

1. **Fidélité à la maquette.** `../Claude Design - MàJ/<Page>.dc.html` dictent contenu, structure,
   ton et layout. Ne jamais simplifier, résumer, réécrire ou inventer une section.
2. **Les chiffres viennent de `src/data/`.** Jamais recopiés depuis une autre page. Si la
   maquette et `src/data/` divergent, c'est la maquette qui a tort — et on l'écrit dans
   `design/ecarts-maquettes.md`.
3. **Le responsive se fait par crochets `data-*`.** Les styles étant en ligne dans les maquettes,
   un sélecteur qui cible `style="…"` ne matche jamais rien. Poser les crochets, ne jamais les
   renommer. Un tableau de 4 colonnes ou plus **défile**, il ne se replie pas.
4. **Publier une page a des conséquences sur 3 à 6 autres.** Les listes de l'`Aide-Memoire`
   §01 à §04 ne sont pas optionnelles : hubs, compteurs, maillage, comparatif, plan éditorial.
5. **`npm run check` doit passer** avant un commit. Il mesure réellement la largeur de défilement
   dans Chrome à 1024 / 900 / 768 / 390 px ; une page peut paraître correcte et casser.

## Ce qui ne se publie jamais

`support.js`, `doc-page.js`, `_at.json`, `_x.json`, les 5 CSV et le JSON brut de `data/`,
et les 8 documents internes (`Guide-Du-Projet`, `Design-System`, `Selection-Produits`,
`Brief-Mascotte`, `Assets-Mascotte`, `Brief-Responsive`, `Aide-Memoire-Mises-A-Jour`,
`Procedure-Mise-A-Jour-Prix`). Aucun ne doit apparaitre dans un sitemap ou une navigation.

## Interdits de contenu

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
