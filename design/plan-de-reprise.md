# Plan de reprise — état du chantier au 14 septembre 2026

**Objectif : publier la totalité des 38 pages de site désignées par Claude Design.**
Il est atteint. Les 38 routes existent, sont buildées et passent les deux contrôles. **Le site est
ouvert aux moteurs depuis le 13 septembre au soir** (§2 fait) et **ses titles et meta descriptions
sont écrits depuis le 14** (§2 ter fait). Ce qui reste : déclarer le sitemap dans Search Console,
les balises sociales, et relire ce que la machine n'a pas pu écrire (§3).

## Les prix, depuis le 21 septembre 2026 : automatiques

Le chantier « tenir les prix à jour » est fermé. `scripts/prix/` tourne **chaque lundi à 8 h 17**
(launchd) et va jusqu'au push sur `dev`. Ce qu'il faut savoir pour reprendre :

- **La commande** : `npm run prix:semaine` pour le lancer à la main, `npm run prix:rendez-vous`
  pour poser ou retirer (`--retirer`) la tâche, `--etat` pour savoir où elle en est.
- **Le journal** : `releves/journal.log` (et `releves/launchd.log` pour ce que launchd voit).
  Les deux sont dans `.gitignore`.
- **À lire après un lundi** : `PRIX-SEMAINE.md` à la racine. Il est réécrit à chaque relevé.
- **Le `.env` de la racine** porte `THOMANN_FEED_URL` et `DONNER_FEED_URL`. Il n'est pas versionné :
  sur un clone frais, il faut le recréer, sinon le relevé se rabat sur 156 lectures de pages et
  Thomann finit par jeter.
- **Ce que le lundi ne décide jamais** : une phrase. Il écrit les prix dans
  `design/prix-reperes.json`, ouvre une session Claude pour les réécritures, et refuse de livrer si
  le dépôt était déjà modifié, si un contrôle échoue, ou si la session s'est interrompue.

### Ce qui attend une décision de Jordane

- **Woodbrass n'a pas de flux.** Ses 24 références sont relevées page par page, et une référence
  Woodbrass retirée répond HTTP 200 sur une page de catégorie : on ne sait donc pas détecter une
  disparition chez eux comme on sait le faire chez Thomann et Donner. S'il existe un flux
  partenaire Woodbrass, le brancher ferme le dernier angle mort.
- **Deux ruptures à resurveiller au relevé du 28/09** : Roland PDX-100 (`/guides/ameliorer-batterie-electronique/`,
  « sous 6-8 semaines ») et Alesis Nitro Multicore (`/guides/acheter-batterie-electronique-occasion/`, « actuellement
  indisponible »). Si elles durent un deuxième relevé, la procédure justifie de basculer le lien
  vers Woodbrass — encore faut-il qu'il les ait, ce qui n'a pas pu être vérifié : leur moteur de
  recherche ne répond pas à une requête construite à la main.
- **La regex `PLAFONDS` de `scripts/prix/rapport.mjs` est morte depuis sa création** (trouvée le
  22/09) : elle attend « moins-de-300-euros » là où les routes écrivent « moins-300-euros », donc
  le contrôle des plafonds des trois guides par budget n'a jamais rien vérifié. La réparer change
  le comportement du rendez-vous du lundi — à trancher avant, pas pendant.
- **La Donner BackBeat est épuisée** dans ses deux variantes depuis le 21/09, à 1 099,99 €. Si ça
  dure, c'est un candidat au retrait de l'Aide-Mémoire §04.
- **22 pages affichent une date de relevé antérieure au 21/09** (§6 du rapport). L'Aide-Mémoire §05
  ne redate à chaque relevé que le comparatif, les guides par budget et la page de sélection : les
  avis et les duels ne suivent que les modifications de fond. Reste à trancher si une page dont on
  a revérifié le prix sans le changer mérite une date rafraîchie.


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

Les deux contrôles sortent au vert. Une page reste hors de ce comptage, `/comparatif-batterie-electronique/` : seule page
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

**Ce que ça laisse à ta relecture :** les 8 phrases (`design/hub-avis-liste-attente.md` §1). Les
titles et les descriptions des 17 pages neuves — un temps **copiés de leur `<h1>` et de leur
chapeau** — ont été réécrits et validés page par page le 14 septembre (§2 ter).

### 2. Ouverture SEO — faite le 13 septembre 2026 au soir

Trois gestes, faits ensemble (un seul des trois ne rouvre rien) :

1. `<meta name="robots" content="noindex, nofollow">` retiré du gabarit de head de
   `scripts/port.mjs` (les 37 pages portées) et de `src/layouts/BaseLayout.astro` (les pages
   écrites à la main). **Seule la 404 garde son `noindex`** : pas de permalien, pas de sitemap,
   servie en statut 404 — le meta l'empêche d'être indexée sur son URL directe.
2. `public/robots.txt` débloqué (`Allow: /`) et la ligne `Sitemap:` déclarée. Le fichier porte
   maintenant la trace des trois gestes, pour la prochaine fois qu'il faudrait refermer.
3. `node scripts/port.mjs && npm run build` relancé, `npm run check` 7/7, `npm run fidelite`
   37/37, puis **vérification en HTTP** sur bipbop.eu — pas dans le dépôt.

**Reste hors du dépôt, côté compte Google** : vérifier la propriété `bipbop.eu` dans Search Console
et y soumettre `https://bipbop.eu/sitemap.xml`. Le site est ouvert, mais rien ne le dit à Google.

**Depuis le 22/09, cette action est devenue urgente** : vingt URL publiées ont été renommées pour
porter leur requête cible (journal du 22/09), les anciennes répondent en 301 depuis
`public/_redirects` et le sitemap porte les nouvelles. Tant que Search Console ne l'a pas relu,
Google continue de proposer les anciennes adresses.

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

### 2 bis. Les deux sitemaps sont en place et déclarés

Écrits le 13/09 au soir, dans la foulée. **Ils se régénèrent tout seuls à chaque build** :
`npm run build` appelle `scripts/sitemap.mjs` (`postbuild`), qui pose `dist/sitemap.xml` —
38 URL, `lastmod` pris du dernier commit du fichier source, jamais de l'horloge.

Les deux lectures partagent **une seule arborescence**, `src/lib/arborescence.mjs` : les routes
viennent du plan éditorial, les libellés du `<title>` publié de chaque page. Rien n'est ressaisi,
donc le plan du site ne peut pas promettre une URL que le sitemap tait. Deux garde-fous : une
ligne « Publié » sans page dans `dist/` **fait échouer le build** (une URL morte dans un sitemap
ne se voit jamais), et une page construite hors du plan est signalée sans être publiée — c'est la
règle d'AGENTS.md sur les documents internes.

`/plan-du-site/` est la **deuxième page écrite à la main** du dépôt, après `/comparatif-batterie-electronique/`. Elle
est déclarée où il faut : `SANS_MAQUETTE` dans `scripts/fidelite.mjs`, `HORS_PLAN` dans la lib
(`plan.json` se régénère depuis Claude Design, on ne peut pas y inscrire une route). Son lien en
pied de page est une **greffe** (`grefferPlanDuSite` dans `scripts/greffes.mjs`) : les maquettes ne
le contiennent pas, il aurait disparu au portage suivant. Profits de bord : `BaseLayout` publie
désormais un `canonical` (il manquait au comparatif) et `public/robots.txt` dit en commentaire les
trois gestes de l'ouverture.

**La ligne `Sitemap:` de robots.txt est déclarée depuis l'ouverture (§2).** Elle avait été laissée
en commentaire le temps du `noindex` : sous `Disallow: /`, la déclarer aurait livré la liste
complète des URL à Google sans même qu'il puisse lire les `noindex`. Les deux conditions sont
levées, le fichier `robots.txt` publié porte `Allow: /` et le sitemap.

### 2 ter. Copie SEO — faite le 14 septembre 2026

Les 39 fichiers du site ont un **title de 50 à 60 caractères** et une **meta de 120 à 155**, écrits
pour le clic et non pour la description interne. La règle vient de Jordane, elle est consignée dans
`AGENTS.md` (§« Copie SEO : la règle, et où elle vit ») et la fiche validée page par page dans
`design/seo-titles-meta.md` : **jamais la marque dans un title** (elle ne porte aucune requête et
coûte 9 caractères), **jamais de montant dans un title** (le mot « Prix » oui, `298 €` non — un prix
publié dans un titre est faux dès le relevé suivant), les 9 avis portent « Avis » + le modèle +
« Prix » + l'année.

Exceptions actées : les trois guides dont le budget est la requête, et les trois
pages qui nomment le site (`/a-propos/`, mentions légales, confidentialité).

Avant : 24 titles sur 39 au-dessus de 60 (jusqu'à 87), 39 sur 39 portant la marque, 22 metas sous
120 caractères (des résidus de chapeau recopiés par le portage).

**Le point à retenir, parce qu'il coûte cher à découvrir deux fois :** la copie SEO ne se tapait pas
où on croyait l'écrire. `copySeo()` lit `design/port-seche/<route>/index.astro` **en priorité** (les
20 sources Astro retirées par le portage y sont) et ne relit le `<head>` de la page portée qu'à
défaut. Et le title se reliait par la regex `<title>(…) — BipBop</title>` : sans le suffixe, les 37
pages portées retombaient sur le `<h1>` de leur maquette, en silence. Les deux ont été corrigés
ensemble ; `node scripts/port.mjs` relancé deux fois ne change plus un octet.

**Ce que ça laisse à ta relecture :** les libellés de `/plan-du-site/` (ceux coupés aux deux-points
et les autres cohabitent), et les deux compteurs que les pages contredisent elles-mêmes, notés au journal du 14/09.

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
node scripts/captures.mjs /guides/pack-batterie-electronique-complet/   # rendu visuel
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
