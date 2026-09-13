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
5. **22 URLs Woodbrass sans identifiant d'affiliation** (14 % du catalogue) — hors périmètre décidé
   ce jour, mais c'est du revenu qui ne se capte pas.

## Comment reprendre techniquement

```bash
cd bipbop-site
git checkout dev && git pull
npm ci
node scripts/port.mjs --dry   # ce que le portage va écrire, avec ses avertissements
npm run check                 # build + 6 contrôles mesurés dans Chrome
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
