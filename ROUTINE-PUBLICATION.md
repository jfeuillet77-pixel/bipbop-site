# Routine de publication : deux pages par jour

Décidé par Jordane le 07/10/2026 : **deux pages publiées par jour**, prises dans le plan éditorial,
**mises en ligne sans relecture humaine**, avec un maillage interne soigné et un site qui reste
frais. Il n'y a pas de filet : les contrôles ci-dessous sont la relecture. Un contrôle qui échoue
et qu'on ne sait pas corriger = **on ne publie pas ce passage-là**. On n'affaiblit jamais un
contrôle pour passer.

La routine cloud lit ce fichier et l'exécute. Pour changer son comportement, on modifie ce
fichier, pas le prompt de la routine.

## Calendrier des automatismes

| Heure de Paris | Quoi | Où |
|---|---|---|
| 6 h 17 (4 h 17 UTC) tous les jours | Rayon du jour → `src/data/rayon.json` (sur `dev`) | `.github/workflows/extrait-rayon.yml` |
| 7 h 23 tous les jours | Archive du rayon (baromètre), IndexNow | launchd sur le Mac, `scripts/prix/archiver-flux.mjs` |
| 8 h 17 le lundi | Relevé des prix et réécritures | launchd sur le Mac, `scripts/prix/semaine.mjs` |
| **10 h 37 et 17 h 37** (8 h 37 et 15 h 37 UTC) | **Une page neuve par passage** (ce fichier) ; le passage de 17 h 37 rafraîchit aussi une page ancienne | routine cloud |

Les heures UTC ne suivent pas le changement d'heure : à partir du 25/10, tout part une heure plus
tôt à Paris (9 h 37 et 16 h 37). Rien ne chevauche le lundi.

## Étape 0 : se mettre en place

1. Les deux dépôts sont clonés côte à côte : `bipbop-site` (public) et `bipbop-maquettes` (privé).
   Les scripts attendent les maquettes dans `../Claude Design - MàJ` : depuis `bipbop-site`,
   `ln -sfn "$(cd ../bipbop-maquettes && pwd)" "../Claude Design - MàJ"` (adapter si le clone est
   ailleurs : `ls ..`).
2. Dans `bipbop-site` : `git fetch origin && git checkout dev && git merge --ff-only origin/dev`.
   Dans les maquettes : `git checkout main && git merge --ff-only origin/main`.
3. `npm ci`, puis `npm run data`.
4. **Deux pages par jour, pas plus.** `git log origin/dev --since=midnight --format=%s | grep -c '^feat(page)'`
   doit valoir 0 au passage du matin, 1 au plus à celui de l'après-midi. Sinon, s'arrêter.
5. Lire en entier `CLAUDE.md` (les cinq lois et les interdits : il fait foi), la section
   « Reprendre ici » de `design/plan-de-reprise.md`, `design/strategie-maillage.md`, les deux
   dernières entrées de `JOURNAL.md`, et dans les maquettes `Aide-Memoire-Mises-A-Jour.dc.html`
   §01, §02 et §05.

## Étape 1 : choisir la page

`node scripts/pages/prochaine.mjs` donne la ligne (code 3 = plus rien à produire : ne rien publier,
le dire dans le compte rendu). `--liste 10` montre la file.

- **Les notes sont une intention, pas une source.** Volumes, modèles et angles ont été écrits par
  un agent le 07/10 : chaque chiffre et chaque affirmation se revérifie, ou disparaît.
- **Une page qui demande des sources absentes du dépôt** (prix d'occasion relevés sur des
  annonces, fiche marchand qu'aucun fichier ne contient) **ne s'écrit pas en cloud** : ajouter
  ` [session locale]` à la fin de ses notes dans `plan-editorial.csv`, commiter les maquettes, et
  prendre la suivante. Jamais un prix d'occasion de mémoire.
- **Test de non-cannibalisation** : relire `requete_cible` et `titre` des lignes « Publié ». Si la
  page vise la même intention qu'une page publiée, passer sa ligne à « Abandonné » avec la raison,
  et prendre la suivante.

## Étape 2 : les sources

Seules sources autorisées, toutes dans les dépôts :

- `src/data/modeles.json` (la base produits du site), `design/prix-reperes.json` (les prix du
  dernier relevé du lundi, qui priment), `src/data/grilles.json`, `src/data/duels.mjs`,
  `src/data/marques.mjs`.
- `src/data/rayon.json` : tout le rayon Thomann et Donner du jour (prix, catégorie, URL Thomann
  propre). **Lire sa `date`** : au-delà de 3 jours, aucun prix nouveau n'en sort, on écrit des
  pages sans montant neuf ou on en choisit une autre.
- Les maquettes publiées et `../Claude Design - MàJ/data/` (fiches, sélections, guide-agent.csv).
- Connaissances établies (technique MIDI, pédagogie, acoustique) en faits généraux, sans chiffre
  inventé.

**Liens marchands** : uniquement des URL déjà présentes dans `modeles.json`, `prix-reperes.json`
ou le champ `url` de `rayon.json` (Thomann, sans paramètre). Jamais `offid`, `affid`, `clickfire`,
ni la passerelle `sjv.io` de Donner. Jamais une URL produit inventée. Un modèle neuf entre dans
`modeles.json` avec ses champs complets avant d'être cité ; sinon on ne le cite pas.

## Étape 3 : écrire

Exactement comme en séance (`design/plan-de-reprise.md`, « Comment produire une page ») :

1. Cloner une maquette publiée du **même gabarit** (loi 1), dans les maquettes. Au moins 1 200 mots
   utiles pour un guide ou un article. Montants en jetons (`{prix:id}`…) dès que le modèle est dans
   la base. Un verdict qui tranche, et qui dit à qui va chaque option.
2. Passer la ligne à « Publié » avec son `fichier_maquette`. Un avis : son entrée dans
   `src/data/grilles.json` (selon le « bareme »). Un duel : son entrée dans `src/data/duels.mjs`.
   Un hub de marque : son entrée dans `src/data/marques.mjs` et sa page d'une ligne.
3. Copie SEO (title 50 à 60 caractères, sans marque ni montant ; meta 120 à 155), à l'endroit que
   dit `CLAUDE.md`.
4. Les conséquences de l'Aide-Mémoire §01 et §02 : hubs, compteurs, plan éditorial.

## Étape 4 : maillage

Selon `design/strategie-maillage.md` :

1. La page neuve renvoie vers **sa page réceptrice**, avec une ancre de la liste, dans le premier
   tiers si c'est naturel, et vers 3 à 6 pages publiées proches.
2. **Deux à quatre pages publiées** renvoient vers la page neuve, par une phrase naturelle dans
   leur maquette (pas un bloc « voir aussi »). Choisir d'abord celles qui manquent de liens.
3. `python3 design/maillage-avis.py` si la page cite des modèles ; le contrôle 11 doit rester sans
   orpheline.

## Étape 5 (passage de 17 h 37 seulement) : une page à rafraîchir

La page publiée la plus anciennement modifiée (`lastmod` le plus vieux de `dist/sitemap-0.xml`
après le build), hors pages légales :

- revérifier ses prix et ses faits contre les sources de l'étape 2, corriger ce qui a bougé ;
- ajouter les liens vers les pages publiées depuis (deux au plus) ;
- passer sa date « MIS À JOUR » au jour **seulement si le contenu a vraiment changé**
  (Aide-Mémoire §05). Une date qui bouge sans changement est un mensonge que Google finit par lire.

**Corriger sans demander** (consigne de Jordane) : toute erreur factuelle croisée en passant (prix
qui contredit la base, lien qui mène au mauvais endroit, modèle retiré) se corrige dans le même
commit et se note au journal. Un choix de ligne éditoriale se signale, ne se tranche pas.

## Étape 6 : contrôles bloquants

Tous doivent passer. Échec qu'on ne sait pas corriger : `git checkout -- . && git clean -fd` dans
les deux dépôts, rien n'est publié, l'expliquer dans le compte rendu.

1. `node scripts/port.mjs` sans erreur.
2. `npm run check` : tests, build, les 11 contrôles (Chrome compris).
3. `npm run fidelite`.
4. Capture de la page neuve (`node scripts/captures.mjs <route>`) **regardée** : jeton non résolu,
   texte brut, section hors du cadre.
5. Interdits dans les fichiers modifiés : « tester », « testé », tiret cadratin, virgule avant
   « et » ou « ou », vouvoiement, expérience vécue inventée (le site parle au nom de « notre robot
   d'analyse »), mention de commission ou de lien affilié.
6. Superlatifs (« le moins cher », « le seul », « dès X € ») vérifiés contre **toute** la base et
   le rayon, pas seulement les modèles cités.

## Étape 7 : journal, commits, mise en ligne

1. `JOURNAL.md` : une entrée datée, 3 à 8 lignes (page, URL, sources et date du rayon, pages
   maillées, page rafraîchie, corrections faites en passant, ce qui reste à trancher).
2. Maquettes : `git add -A && git commit -m "<id> <titre> (routine du <date>)" && git push origin main`.
3. Site, sur `dev` : `git add -A && git commit` avec le titre
   `feat(page): <id> <titre>` (le compteur de l'étape 0 le lit), le résumé du journal en corps, et
   pour dernière ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Puis
   `git pull --rebase origin dev && git push origin dev`.
4. Mise en ligne : `git checkout main && git merge --ff-only origin/main && git merge --no-ff dev -m "Merge branch 'dev' — page <id>" && git push origin main && git checkout dev`.
   Si `main` a divergé : ne rien forcer, le dire dans le compte rendu.
5. Un conflit sur `JOURNAL.md` se résout en gardant les deux entrées ; sur `src/data/rayon.json`
   ou `historique-prix.json`, en gardant la version distante, puis relancer `npm run check`.

## Compte rendu de fin

Quelques lignes : page publiée (ou raison de l'absence), URL, page rafraîchie, contrôles passés,
pages modifiées, ce qui mériterait l'attention de Jordane. Rien d'autre.
