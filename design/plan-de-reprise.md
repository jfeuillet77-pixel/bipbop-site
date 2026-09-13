# Plan de reprise — état du chantier au 13 septembre 2026 (soir)

**Objectif : publier la totalité des 38 pages de site désignées par Claude Design.**
Il est atteint. Les 38 routes existent, sont buildées et passent les deux contrôles. Ce qui reste :
**ouvrir le site aux moteurs**, puis relire ce que la machine n'a pas pu écrire (plus bas, §3).

## Ce qui a changé de méthode

Jusqu'ici chaque page était **retapée à la main** depuis sa maquette, ce qui créait des écarts
(crochets responsive oubliés, compteurs faux, formules qui dérivent) qu'un outil
(`scripts/fidelite.mjs`) devait ensuite rattraper. Depuis ce soir, **`scripts/port.mjs` porte les
37 pages statiques** depuis `Claude Design - MàJ/`, corps et styles mot pour mot : la fidélité est
tenue par construction au lieu d'être vérifiée après coup. Décision prise par Jordane, avec
l'instruction de tout re-porter, pages déjà publiées comprises.

| | Avant le portage | Après |
|---|---|---|
| Routes buildées | 21 / 38 | **38 / 38** |
| Pages identiques à leur maquette | 6 / 21 | **37 / 37** |
| Problèmes `npm run check` | 12 | **0** |
| Pages dépassant à 390 px | 8 | **0** |
| Liens internes cassés | — | **0 sur 773** |

Les deux contrôles sortent au vert. Une page reste hors de ce comptage, `/comparatif/` : seule page
dynamique du dossier, elle se maintient à la main en Astro.

## Ce qui reste, dans l'ordre

### 1. Fait ce soir — la liste d'attente du hub `/avis/`

La maquette annonçait « 23 AU PROGRAMME » avec **14 lignes** de liste d'attente, là où la base compte
**22 modèles sans avis**. Décision de Jordane : publier les 22, avec les phrases rédigées. Le tableau
ne se corrige plus, il se **construit** : `design/liste-attente-avis.csv` (22 ×
`cle ; libellé affiché ; phrase`) est régénéré par `scripts/greffes.mjs` dans le balisage même de la
maquette, **prix et segment lus dans `src/data/modeles.json`**, badge et intitulé calculés depuis la
base. Les 14 lignes du design restent mot pour mot et dans leur ordre ; les 8 rédigées se placent en
fin de segment.

Si la base gagne un 23ᵉ modèle sans avis que le CSV ne cite pas, **le portage échoue** en le nommant :
le hub ne peut plus devenir faux silencieusement, et les prix du hub se mettent à jour avec la base.

**Ce que ça laisse à ta relecture :** les 8 phrases (`design/hub-avis-liste-attente.md` §1) et, pour
les 17 pages neuves, un **titre copié de leur `<h1>`** et une **description copiée de leur chapeau** —
ils sont exacts, jamais relus. La liste complète s'affiche dans les avertissements de
`node scripts/port.mjs`.

### 2. Ouverture SEO — plus rien ne la retient

Retirer `<meta name="robots" content="noindex, nofollow">` des 38 routes et débloquer
`public/robots.txt`. Les deux lignes à changer sont dans `scripts/port.mjs` (les 37 pages portées)
et `src/layouts/BaseLayout.astro` (le comparatif) — à changer ensemble, sinon une route traîne.

**Une seule ligne reste hors du dépôt, côté tableau de bord Netlify** : Forms → Notifications →
`contact@bipbop.eu`. Le formulaire de contact fonctionne (vérifié en POST → 200 traité par le
service de formulaires, pas par le fichier statique) et **aucune adresse e-mail n'est publiée dans
le code** — c'est voulu. Détail d'installation : la détection des formulaires ne vaut que pour le
déploiement suivant son activation, et une règle `[[redirects]] from="/*" status=404` avale les
POST — les deux pièges sont racontés dans le JOURNAL du 13 septembre (soir).

**Fait depuis, et consigné** : registre légal des deux pages (Jordane Feuillet, Netlify, Google
Analytics déclaré sans outil installé — choix assumé de Jordane, ligne « Envoi des e-mails »
retirée, adresse/SIREN/TVA non publiés), encart e-mail supprimé de Contact, formulaire réel. Tout
est dans `scripts/greffes.mjs`, rien dans les pages.

### 2 bis. Les deux sitemaps sont en place, leur déclaration attend l'ouverture

Écrits le 13/09 au soir, dans la foulée. **Ils se régénèrent tout seuls à chaque build** :
`npm run build` appelle `scripts/sitemap.mjs` (`postbuild`), qui pose `dist/sitemap.xml` —
38 URL, `lastmod` pris du dernier commit du fichier source, jamais de l'horloge.

Les deux lectures partagent **une seule arborescence**, `src/lib/arborescence.mjs` : les routes
viennent du plan éditorial, les libellés du `<title>` publié de chaque page. Rien n'est ressaisi,
donc le plan du site ne peut pas promettre une URL que le sitemap tait. Deux garde-fous : une
ligne « Publié » sans page dans `dist/` **fait échouer le build** (une URL morte dans un sitemap
ne se voit jamais), et une page construite hors du plan est signalée sans être publiée — c'est la
règle d'AGENTS.md sur les documents internes.

`/plan-du-site/` est la **deuxième page écrite à la main** du dépôt, après `/comparatif/`. Elle
est déclarée où il faut : `SANS_MAQUETTE` dans `scripts/fidelite.mjs`, `HORS_PLAN` dans la lib
(`plan.json` se régénère depuis Claude Design, on ne peut pas y inscrire une route). Son lien en
pied de page est une **greffe** (`grefferPlanDuSite` dans `scripts/greffes.mjs`) : les maquettes ne
le contiennent pas, il aurait disparu au portage suivant. Profits de bord : `BaseLayout` publie
désormais un `canonical` (il manquait au comparatif) et `public/robots.txt` dit en commentaire les
trois gestes de l'ouverture.

**La ligne `Sitemap:` de robots.txt est volontairement en commentaire.** Tant que
`Disallow: /` tient, la déclarer livrerait la liste complète des URL à Google avant l'ouverture,
sans même qu'il puisse lire les `noindex`. Elle se décommente au moment du §2, pas avant.

### 3. Questions ouvertes, sans urgence de publication

1. **Grille de notation** — décision du 13/09 : les notes `/10` restent publiées. 9 pages en
   portent une, aucune autre. Il manque un barème qui dise ce que recouvre un `7,2` contre un
   `8,4` (règle I02), et les échelles `discretion` et `module` de la base, qui entrent dans le
   score du comparatif sans jamais être expliquées au lecteur.
2. **Empreinte au sol** — `MPS-750X` et `MPS-850` publient « 140 × 90 » et « 150 × 100 » en disant
   « siège compris », là où Thomann garantit 140 × 80 et où le comparatif affiche la mesure du
   marchand. Deux définitions coexistent sur le même site.
3. **Faute dans la DED-200X** — « Deux cymbales de crash au lieu **d** une », sans apostrophe. Elle
   est revenue au portage : la page est verbatim. À corriger dans Claude Design, ou en une entrée
   `port-corrections.json` (une des 8 phrases rédigées du hub est concernée aussi).
4. **Priorité des lignes P24/P25** du plan éditorial — « Moyenne » par déduction après avoir réparé
   le décalage de colonnes. Champ interne, non publié.
5. **Affiliation** — sans objet pour l'instant, et la question change de nature. Les maquettes
   étaient taguées pour **un autre site de Jordane** (`?offid=1&affid=3711` sur 126 URLs Thomann,
   passerelle shareasale `donnnermusic.sjv.io` pour les 12 liens Donner). Décision du 13/09 au
   soir : **BipBop ne publie aucun lien affilié**, le nettoyage est mécanique et un contrôle fait
   échouer le build si un traçant survit. Le point soulevé ici (« 22 URLs Woodbrass sans
   identifiant ») ne se pose plus : aucun marchand n'en porte. Le jour où tu actives l'affiliation
   sur BipBop, il faudra **ton identifiant BipBop** — pas celui des maquettes — et le décider pour
   les trois marchands à la fois.

## Comment reprendre techniquement

```bash
cd bipbop-site
git checkout dev && git pull
npm ci
node scripts/port.mjs --dry   # ce que le portage va écrire, avec ses avertissements
npm run check                 # build (sitemap.xml inclus) + 7 contrôles mesurés dans Chrome
npm run fidelite              # chaque page contre sa maquette, segment par segment
npm run data                  # relance l'import si data/ du dossier Claude Design a bougé
node scripts/captures.mjs /guides/pack-complet/   # rendu visuel
```

**Règle de travail qui découle du portage** (elle est dans `AGENTS.md`) : une page se change dans
Claude Design, puis `node scripts/port.mjs`. Rien ne se retape dans `src/pages/` — une correction
manuelle y est écrasée au portage suivant. Un écart qu'on veut garder (prix, faute) s'inscrit dans
`design/port-corrections.json`, avec sa raison.

Le dossier `Claude Design - MàJ/` **n'est dans aucun dépôt git** : les corrections apportées à
`data/modeles.json` (version 2, empreintes relevées) et `data/plan-editorial.csv` (2 lignes
reconstruites) n'ont d'autre filet que les copies `.avant-phase0` posées à côté. Si tu ré-exportes
le dossier depuis Claude Design, **relis `design/ecarts-maquettes.md` avant de réimporter** : il
garde la trace de ce qui avait été corrigé ici et qui disparaîtrait. Les sources Astro retirées par
le portage sont dans `design/port-seche/` (et dans l'historique git).
