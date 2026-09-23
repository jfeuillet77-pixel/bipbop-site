# BipBop — règles de travail

**Une session = lire dans cet ordre** : `design/plan-de-reprise.md` (où on en est, quoi faire,
quelles questions attendent Jordane), `README.md` (règle de fidélité),
`design/crochets-responsive.md` (comment rendre une page responsive ici),
`design/ecarts-maquettes.md` (ce que la maquette contredit avec sa propre source).

**Depuis le 23/09/2026, Claude Design n'est plus utilisé** (décision de Jordane). Le dossier
`../Claude Design - MàJ/` garde son nom (six scripts le citent) mais c'est désormais Claude qui
écrit les maquettes, directement dans ce dossier, puis les porte. Il a son **propre dépôt git,
local et sans remote** : committer chaque modification de maquette là-bas, avec sa raison. Ne pas
le verser dans ce dépôt-ci : `bipbop-site` est **public** sur GitHub, et les maquettes contiennent
les documents internes et les identifiants partenaires d'un autre site. Plus de ré-export à
craindre : `design/maillage-avis.py` et les copies `.avant-*` ne servent plus qu'à l'historique.

## Les cinq lois non négociables

1. **On ne retape pas une maquette, on la porte.** `node scripts/port.mjs` écrit les 37 pages
   statiques depuis `../Claude Design - MàJ/<Page>.dc.html`, corps et `<style>` mot pour mot. Une
   page se modifie dans sa maquette, puis se re-porte — jamais à la main dans `src/pages/` :
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
   **La repasse est systématique** (Jordane, 23/09/2026) : après chaque publication, lire le
   contrôle 11 de `npm run check`. Il bloque une page orpheline ou absente de son hub, et liste les
   pages qui citent un modèle sans lien vers son avis. `python3 design/maillage-avis.py` pose les
   liens de tableau et de première mention. Dans les textes construits (`marques.mjs`), aucun compte
   écrit en dur : `{n:modeles}`, `{n:avis:Marque}`… se recalculent au build.
5. **`npm run check` et `npm run fidelite` doivent passer** avant un commit. `check` lance
   d'abord `npm test`, puis le build, puis les 10 contrôles : il mesure réellement la largeur de
   défilement dans Chrome à 1024 / 900 / 768 / 390 px et relit le balisage de chaque page.
   `fidelite` compare chaque page à sa maquette segment par segment. Une page peut paraître
   correcte et casser — `/guides/` a servi neuf jours avec ses sections hors du cadre, du premier
   portage le 13/09/2026 au signalement de Jordane le 22/09 (daté en repassant le contrôle 9 sur
   chaque version du fichier dans git).

   `tests/` ne teste que le 9e contrôle, celui du balisage, parce que c'est le seul qui juge une
   structure plutôt que de comparer deux valeurs : son silence ressemble exactement à un site
   sain. `tests/cas/faux-amis.html` est le cas qui compte — ce que le contrôle doit laisser
   passer. Ajouter un cas quand un défaut de mise en page passe en production.

**Exceptions à la loi 1** : trois pages se maintiennent à la main, aucune maquette ne les contient.
`/comparatif-batterie-electronique/` est la seule page dynamique du dossier (`DCLogic`, 42 liaisons `{{ }}`) — elle reste
en `src/pages/comparatif-batterie-electronique/index.astro`. `/plan-du-site/` (le plan du site HTML) se **construit**
depuis `src/lib/arborescence.mjs`, qui est aussi la seule source de `dist/sitemap.xml` écrit par
`scripts/sitemap.mjs` à chaque build. `/suivi-des-prix/` se **construit** depuis
`src/data/historique-prix.json`, que le relevé hebdomadaire remplit : aucun chiffre n'y est écrit à
la main. Chacune est déclarée dans `SANS_MAQUETTE` de `scripts/fidelite.mjs`, et les deux dernières
dans `HORS_PLAN` de la lib — `plan.json` se régénère depuis Claude Design, on ne peut pas y inscrire
une route. Les liens qu'aucune maquette ne contient mais qu'on publie partout (« Plan du site » et
« Suivi des prix » au pied de page) passent par la greffe `grefferLiensDuPied()` de
`scripts/greffes.mjs`, jamais par une édition des 37 pages, et `src/components/Footer.astro` porte
les mêmes dans le même ordre pour les trois pages sans maquette. `404.html` se porte aussi (route
sans permalien).

**Les hubs de marque** (`/marques/batterie-electronique-<marque>/`, depuis le 23/09/2026) n'ont pas de
maquette non plus : `src/components/HubMarque.astro` les construit depuis `modeles.json` (liste,
prix, peaux, phrase) et `src/data/marques.mjs` (la rédaction, qui appelle les modèles par jeton :
`{prix:id}`, `{nom:id}`, `{avis:id}`, jamais un prix en dur). `fidelite` les saute, `titrePublie()`
lit leur titre dans `marques.mjs`. Un nouveau hub = une entrée dans `marques.mjs`, une page d'une
ligne et sa ligne « Publié » au plan (type « Marque »). La page mère `/marques/` (`HubMarques.astro`, texte dans
`INDEX_MARQUES`) décrit toutes les marques du catalogue : une marque qui y entre sans paragraphe
fait échouer le build. Les jetons se résolvent dans `src/lib/jetons.mjs`, partagé par les deux.

**Le `<head>` social et structuré ne s'écrit dans aucune page.** `scripts/donnees-structurees.mjs`
(`postbuild`, après le sitemap et le llms.txt) pose l'Open Graph et un JSON-LD sur les 39 pages de
`dist/` : `Organization` et `WebSite`, `BreadcrumbList`, `Article` daté par git sur les guides,
les bases et les duels, `Product` + `Review` sur les avis (note lue dans le verdict affiché, prix
lu dans `modeles.json`), `ItemList` sur les hubs. L'image de partage `public/bipbop-partage.png`
se régénère avec `npm run image-partage` si la mascotte change. Le contrôle 10 relit le résultat.

## Le rendez-vous du lundi : les prix

`scripts/prix/` tient les prix à jour tout seul, chaque lundi à 8 h 17 (launchd, posé par
`npm run prix:rendez-vous`). `npm run prix:semaine` fait la même chose à la demande.

Huit étapes, dans cet ordre : télécharger les deux flux partenaires → relever → écrire
`PRIX-SEMAINE.md` → écrire les prix dans `design/prix-reperes.json` → **une session Claude pour les
réécritures** → `npm run data` et `npm run port` → verser le relevé dans l'historique publié →
`npm run check` et `npm run fidelite` → commit sur `dev`, fusion dans `main`, push des deux.

`main` est la branche que Netlify déploie, `dev` celle où l'on travaille : un commit sur `dev` ne
met rien en ligne. La fusion est en `--no-ff` (le lundi doit se voir comme un bloc dans l'historique)
et jamais forcée — si `main` a divergé, le lundi s'arrête en le disant et le travail reste sur `dev`.

**D'où vient chaque chiffre**, parce que ce n'est pas la même source pour tout le monde :

| | Prix | Disponibilité | Disparition du catalogue |
|---|---|---|---|
| Thomann (121 réf.) | flux partenaire | page produit — le flux ne la donne pas | flux, **confirmée sur la fiche** |
| Donner (11 réf.) | flux Impact, par variante | flux (`Stock Availability`) | flux, **confirmée sur la fiche** |
| Woodbrass (24 réf.) | page, JSON-LD | page, JSON-LD | — (aucun flux) |

Les adresses des flux portent un jeton d'espace partenaire : elles vivent dans le `.env` de la
racine, jamais dans le dépôt. Les catalogues bruts (95 Mo) atterrissent dans `releves/flux/`, qui
est dans `.gitignore`.

**Ce que le lundi fait tout seul, et ce qu'il ne fait pas.** Il écrit les prix dans
`design/prix-reperes.json` — c'est de la donnée, avec sa date et sa preuve. Il ne touche **jamais**
à une phrase : sur ce site un prix est presque toujours pris dans un raisonnement (« au même prix »,
« onze euros de moins », « le match à 298 € »), et deux modèles partagent souvent le même montant.
Réécrire ces phrases est le travail de la session Claude, qui lit `PRIX-SEMAINE.md` — un rapport qui
cherche l'ancien montant dans les 46 maquettes et les 39 pages portées, et sépare, ligne par ligne,
ce qui se substitue de ce qui se réécrit.

**Trois refus de livrer**, parce que le script tourne sans personne devant : dépôt déjà modifié au
démarrage (quelqu'un travaille, on ne balaye pas son travail), `check` ou `fidelite` en échec,
session éditoriale interrompue. Dans les trois cas le relevé et le rapport restent sur le disque.

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

**Grille de notation : à l'essai sur un seul avis** (Nitro Max, depuis le 23/09/2026), dans la
carte « Le verdict » : cinq critères pour un premier achat, poids, note sur 10, une ligne de
raison. La note du verdict EST la moyenne pondérée (8,3), jamais l'inverse. Jordane compare avant
de généraliser ou de retirer ; en attendant, les autres avis gardent leur note sans grille.

**Aucune mention d'affiliation non plus, tant qu'on n'est pas affilié** (Jordane, 23/09/2026). Les
maquettes gardent leurs « Liens affiliés », « on touche une commission », « Comment on gagne
notre vie » ; `retirerMentionsAffiliation()` de `scripts/greffes.mjs` les retire au portage, et
`Footer.astro` et le comparatif les conditionnent. Un seul interrupteur : `src/data/affiliation.json`
(`actif`). Le passer à `true` le jour où les liens portent les identifiants BipBop fait revenir
toutes les mentions à l'identique ; son champ `pour_reactiver` liste ce qu'il faut revoir en même
temps. Le contrôle 7 fait échouer `check` si une page parle de commission pendant que c'est `false`.

Aucun protocole de test inventé · **jamais « tester » ni « testé »** : on dit « analysé » (Jordane, 23/09/2026), et pour un geste du lecteur « essai », « essayer », « vérifier » ; le contrôle 7 l'impose · aucune note chiffrée sans grille affichée · aucune signature
individuelle · aucun article sponsorisé · ne jamais reprendre un **prix barré Donner** · ne
jamais utiliser un **prix de bundle Thomann** comme prix du modèle · **ne jamais inventer une URL
produit** · pas de virgule avant « et » ni avant « ou » · pas de tiret cadratin · tutoiement du
premier au dernier mot.

## Copie SEO : la règle, et où elle vit

Décidée par Jordane le 14/09/2026, appliquée aux 39 fichiers du site (`design/seo-titles-meta.md`
garde la fiche validée page par page) :

- **`<title>` entre 50 et 60 caractères**, espaces compris. La fiche est produite et relue par
  script, jamais à l'œil.
- **Jamais la marque dans un title.** Elle ne porte aucune requête et mange 9 caractères. Elle
  reste tolérée sur les trois pages où elle est le sujet : `/a-propos/`, mentions légales,
  confidentialité.
- **Jamais de montant dans un title.** Le mot « Prix » oui (c'est une requête), `298 €` non : un
  prix publié dans un titre est faux dès le relevé suivant. Seules exceptions : les trois guides
  dont le budget EST la requête (« à moins de 300 € »).
- **Un article fait au moins 1 200 mots** (Jordane, 23/09/2026) : guide, hub de marque, page de
  fond. Du contenu utile (budget réel, connectique, défauts, questions), jamais du remplissage.
- **Meta description entre 120 et 155**, avec le mot clé, un chiffre vérifiable et une raison de
  cliquer. Les montants, eux, vivent là.
- Un avis porte « Avis » + le nom du modèle + « Prix » + l'année.

**Où écrire la copie**, parce que le portage a deux sources et pas une :

1. `design/port-seche/<route>/index.astro` si le fichier existe (20 pages y sont passées) :
   `copySeo()` lit le `<BaseLayout title= description=>` **en priorité**, et une édition du
   `<head>` de la page portée serait écrasée au portage suivant. **Ce dossier est dans
   `.gitignore`** : la copie n'y est pas versionnée. Après une édition là, écrire la même chaîne
   dans le `<head>` de `src/pages/<route>/index.html` avant de committer — sinon un autre poste,
   ou un clone frais, régénérera l'ancienne.
2. Sinon, le `<head>` de `src/pages/<route>/index.html` : ces deux balises-là survivent au portage
   (c'est le seul contenu de `src/pages/` autorisé, le corps reste interdit, loi 1).
3. `/comparatif-batterie-electronique/` et `/plan-du-site/` : les props de `<BaseLayout>` dans leur `.astro`.

Le suffixe « — BipBop » était ajouté par `scripts/port.mjs` et `BaseLayout.astro` ; il n'est plus
écrit depuis le 14/09. Si quelqu'un le remettait, `copySeo()` retomberait sur les `<h1>` des
maquettes : la regex de lecture du title ne doit plus dépendre du suffixe.

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
