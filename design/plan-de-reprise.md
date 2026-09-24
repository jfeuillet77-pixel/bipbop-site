# Plan de reprise — état au 24 septembre 2026

## Reprendre ici

Session du 24/09/2026 : suite de l'audit du 23/09 (`design/audit-seo-2026-09-23.md`). **Hub
`/duels/` publié** (P26, construit depuis les données), **MPS-450 recommandation nº1** de `/avis/`,
et une passe de corrections factuelles sur 14 maquettes (voir `JOURNAL.md` du 24/09). Tout est
commité, `dev` est fusionnée dans `main`.
Le 23/09 : audit SEO, chantiers 1 à 7, vague 1 du chantier 5. Règles nouvelles dans `AGENTS.md`.

**Consigne de Jordane (24/09)** : une erreur qui se tranche en lisant la source (prix, compte,
fiche, lien qui mène au mauvais endroit, conseil sans appui) se corrige sans demander, même si
ça réécrit une phrase. Ne remonter que les choix de ligne éditoriale. **Priorité : autorité et
trafic** ; l'affiliation attend un à deux mois.

### Ce qui a changé de fond

- **Claude Design n'existe plus.** Claude écrit les maquettes de `../Claude Design - MàJ/`
  directement, les commite dans leur **dépôt git local** (sans remote : `bipbop-site` est public et
  les maquettes contiennent des documents internes et les identifiants d'un autre site), puis porte.
- **Affiliation muette.** Aucune mention de commission tant que les liens ne portent pas
  d'identifiant BipBop : interrupteur `src/data/affiliation.json` (`actif: false`), greffe
  `retirerMentionsAffiliation()`, contrôle 7.
- **Vocabulaire.** Jamais « tester / testé » : « analysé » ; « essai / vérifier » pour le lecteur.
- **Grilles de notation sur les 9 avis** (`src/data/grilles.json`) : cinq critères, ligne « Pour
  ton profil », note = 6 + (moyenne − 5) × 0,8, jamais sous 6 sans `"exception": true`. Un nouvel
  avis = une entrée dans ce fichier, notée selon son « bareme ».
- **Pages construites depuis les données** : comparatif (`ComparatifLecture.astro`), hubs de
  marque (`HubMarque.astro`), page `/marques/` (`HubMarques.astro`), hub `/duels/`
  (`HubDuels.astro`, 24/09). Texte dans `src/data/marques.mjs` et `src/data/duels.mjs`, prix,
  noms et comptes par jetons (`src/lib/jetons.mjs`). **Un duel publié = aussi une entrée dans
  `duels.mjs`** (deux modèles, gagnant, trois phrases), sinon le build échoue.
- **Nouveaux postbuild** : `donnees-structurees.mjs` (Open Graph + JSON-LD), `typographie.mjs`
  (espaces insécables des prix). **Contrôles** : 10 (données structurées) et 11 (cohérence entre
  pages : orpheline ou absente de son hub = échec ; modèles cités sans lien = liste à relire).
- **Un article fait au moins 1 200 mots.** **La repasse après publication est systématique**
  (contrôle 11, `design/maillage-avis.py`, comptes en jetons).

### La suite, dans l'ordre

Le plan éditorial fait foi : `../Claude Design - MàJ/data/plan-editorial.csv` (lots = vagues,
volumes et raisons dans la colonne notes). Détail et chiffres : `design/plan-contenus-chantier-5.md`.

1. **Vague 1 : faite le 23/09 au soir.** Publiés : duel MPS-750X ou MPS-850, guides pad
   d'entraînement, ampli, prix (chiffres en jetons, voir AGENTS.md), les bases baguettes, H2
   « Une batterie silencieuse, ça existe ? » du guide appartement. Détail dans `JOURNAL.md`.
2. **Vague 2** : P71 hub Roland (même gabarit que Yamaha/Alesis ; section TD-07, TD-17, TD-1DMK
   arrêtées en France, vérifié sur Thomann et Woodbrass le 23/09, la TD313 remplace la TD-17KV2) ;
   P72 avis Roland TD313 ; P73 pilier « Apprendre la batterie » ; P74 réglages MPS-750X (volumes
   anglais suspects, manuel constructeur seulement) ; P75 hub Millenium.
3. **Vague 3** : les avis du plan (MPS-1000, Nitro Pro, Nux, TD-02K… pour la règle D06), hub
   `/les-bases/`, les bases P51 à P60, P50 « où acheter », duels P48 et P49 (ils apparaissent
   déjà sur `/duels/` dans « Les prochains duels »). `/duels/` est publié depuis le 24/09.

**Comment produire une page** : un guide, un duel ou un avis se fait en maquette dans
`../Claude Design - MàJ/` (cloner une maquette du même gabarit, loi 1), commit dans ce dépôt-là,
ligne du plan passée à « Publié » avec son `fichier_maquette`, `node scripts/port.mjs`, puis
`npm run check` et `npm run fidelite`. Un avis ajoute son entrée dans `src/data/grilles.json`. Un
hub de marque = une entrée dans `marques.mjs` et une page d'une ligne. Toujours : 1 200 mots,
faits sourcés (flux Thomann dans `releves/flux/`, fiches, avis publiés), repasse du contrôle 11,
puis `main` (voir « Comment reprendre techniquement » plus bas).

### Ce qui attend Jordane

- **Demander l'indexation** (quota Search Console dépassé le 24/09, à refaire le 25) :
  `/duels/` d'abord, puis `/guides/acheter-batterie-electronique-occasion/`,
  `/les-bases/tapis-batterie-electronique/` et les trois pages `/marques/`.
- **Remote privé pour les maquettes** : accord de Jordane le 24/09. `gh` n'est pas installé :
  créer un dépôt **privé** vide sur github.com (par exemple `bipbop-maquettes`), puis
  `git remote add origin git@github.com:jfeuillet77-pixel/bipbop-maquettes.git && git push -u origin HEAD`
  dans `../Claude Design - MàJ/` (la clé SSH du poste pousse déjà `bipbop-site`).
- **Identifiants d'affiliation BipBop** : dans un à deux mois (Jordane, 24/09). Passer `actif` à
  `true` dans `src/data/affiliation.json` et suivre son champ `pour_reactiver`.
- **Avis MPS-850 : la thèse a changé** (23/09 soir) : faits corrigés, note 8,0 → 7,8. À relire.
- **Auteur nommé** (chantier 6) : question posée le 24/09. AGENTS.md interdit toute signature
  individuelle ; seul Jordane peut lever cette règle.

### À surveiller

- **Lundi 28/09, relevé automatique** : premier lundi avec les grilles, la typographie et le
  contrôle 11 dans `check`. Woodbrass a migré sur Shopify (fiches redirigées vers
  `/products/<nom>-<id>`, JSON-LD présent) : vérifier que ses 24 références sont bien relevées
  (`releves/journal.log`, `PRIX-SEMAINE.md`). Les deux ruptures PDX-100 et Nitro Multicore aussi.
- **Vers le 21/10** : relire la Search Console sur les nouvelles URL (propriété `sc-domain:bipbop.eu`,
  inspection par lots de 10) et relancer un crawl Screaming Frog (MCP `sf`).

### Défauts connus, non corrigés

- `prixTexte` de la base écrit encore certains milliers sans espace (« 1598 € ») : invisible sur le
  site (relu le 24/09, aucune page ne l'affiche ainsi), laissé tel quel parce que le contrôle 3
  compare les pages à ce champ.
- Images produit chargées depuis `thomann.de` sans `width`/`height` ; pas de CSP tant qu'elles y
  restent (chantier 6 de l'audit). Aucun auteur nommé (choix du site : « une seule voix »).
- Contrôle 11 : huit pages citent un modèle sans lien vers son avis (le plus souvent un lien vers
  un duel, voulu).
- Les contrôles ne voient pas un texte resté brut dans une page (code de générateur, jeton non
  résolu) : seule la capture l'a montré le 23/09. Relire la capture de chaque page neuve.
- « 11 guides et 6 articles » sur `/guides/` compte par gabarit : « Installer sa batterie sans
  déranger » est un gabarit guide publié sous `/les-bases/`. Juste, mais surprenant.
- Duel Nitro Max vs TD-02KV : « Revente à trois ans 250 à 290 € / 330 à 380 € » et décotes de 25 et
  35 % sans source. Nitro Max : « prévoir 150 € de plus », le calcul de la sélection donne 129 €.
- DED-200X : la fiche Donner liste dans le « lot pour débutant » un tabouret, des baguettes et un
  casque, pour une variante qu'elle ne précise pas. L'avis dit « baguettes et clé fournies » ; pas
  revérifié sur la variante à 499,99 €.

---

## Archive — état au 14 septembre 2026

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
npm run check                 # tests, build (postbuild compris) + les 11 contrôles de verif.mjs
npm run fidelite              # chaque page contre sa maquette, segment par segment
npm run data                  # relance l'import si data/ du dossier Claude Design a bougé
node scripts/captures.mjs /guides/pack-batterie-electronique-complet/   # rendu visuel
```

**Règle de travail qui découle du portage** (elle est dans `AGENTS.md`) : une page se change dans
Claude Design, puis `node scripts/port.mjs`. Rien ne se retape dans `src/pages/` — une correction
manuelle y est écrasée au portage suivant. Un écart qu'on veut garder (prix, faute) s'inscrit dans
`design/port-corrections.json`, avec sa raison.

Le dossier `Claude Design - MàJ/` a son **propre dépôt git, local et sans remote** depuis le
23/09/2026 (fin de Claude Design) : chaque modification de maquette s'y commite avec sa raison.
Il n'y a plus de ré-export ; `design/ecarts-maquettes.md` garde l'historique des divergences. Les sources Astro retirées par
le portage sont dans `design/port-seche/` (et dans l'historique git).
