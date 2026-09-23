# Journal BipBop

## 23 septembre 2026 (après-midi) — Premier crawl Screaming Frog, audit SEO, données structurées

**Audit** : `design/audit-seo-2026-09-23.md`, sept chantiers classés par rendement. Premier crawl
Screaming Frog du site (43 URL) : aucune erreur, aucune redirection interne, 9 types d'avertissements
mineurs. Indexation remontée à 36/39 depuis ce matin ; restent inconnus le guide occasion et la
page tapis (590 et 480 recherches/mois), et la politique de confidentialité.

**Chantier 1** : `sitemap-index.xml` resoumis par l'API. La suppression des lignes `llms.txt` et
`sitemap.xml` et la demande d'indexation restent à faire à la main (l'API refuse ou n'a pas l'action).

**Chantier 2, les données structurées** : il n'y en avait aucune, ni Open Graph. Posées en
`postbuild` par `scripts/donnees-structurees.mjs`, dans `dist/` et pas dans les pages : 37 pages
sont portées (loi 1), 3 passent par `BaseLayout`, et un seul point d'écriture les voit toutes.
Les notes des avis sont lues dans le verdict affiché, les prix dans `modeles.json`, les dates dans
git (`datesGit`, désormais partagé avec le sitemap, `--follow` pour traverser le renommage du 22/09).
Le contrôle 10 de `verif.mjs` relit le résultat ; testé en retirant un bloc et en faussant un prix,
les deux sont attrapés. Image de partage `public/bipbop-partage.png` (1200 × 630), rendue par
`npm run image-partage`.

## 23 septembre 2026 — Le sitemap est lu, 33 pages sur 39 sont indexées

Premier diagnostic fait depuis l'API Search Console (serveur MCP `gsc`), et plus sur captures.

**Le sitemap est lu.** `sitemap-index.xml` : téléchargé le 22/09 à 07:56, statut « processed »,
39 URL, 0 erreur, 0 avertissement. Le diagnostic du 22/09 (latence, pas ligne empoisonnée) est
confirmé : l'index a été lu le jour même de sa soumission. `/sitemap.xml` reste « en attente »
(jamais lu), `llms.txt` porte 1 erreur. Ces deux lignes sont à **supprimer à la main** dans
Search Console : l'API refuse les suppressions (`GSC_ALLOW_DESTRUCTIVE` non posé).

**Indexation, inspection URL par URL** : 33/39 « Submitted and indexed ». Les nouvelles URL du
22/09 sont déjà recrawlées et indexées pour la plupart. Restent :

- « Discovered, currently not indexed » : `/guides/acheter-batterie-electronique-occasion/`,
  `/les-bases/batterie-electronique-ou-acoustique/` ;
- « URL is unknown to Google » : `/les-bases/casque-batterie-electronique/`,
  `/les-bases/tapis-batterie-electronique/`, `/les-bases/batterie-electronique-bruit-voisins/`,
  `/politique-confidentialite/`.

Aucune n'est orpheline (3 à 39 pages liantes) ni maigre (700 à 1 900 mots) : c'est le budget de
crawl d'un site de dix jours. Levier : « Demander une indexation » dans l'inspection d'URL.

**Mesuré en ligne** : 20/20 redirections en 301 directe vers une page en 200, canoniques
auto-référentes sur les 39 pages, aucune meta robots, `www` en 301, live identique à `dist/`.

**Trafic, 13 au 22/09** : 4 clics, 142 impressions, position moyenne 23,8. Les impressions
portent encore sur les anciennes URL, en cours de bascule. La page qui en ramasse le plus
(66) est l'ancien guide adulte débutant, sur « batterie électronique débutant » et variantes, en
position 30 à 60 : c'est la requête à travailler. Pages déjà dans le top 10 sans clic :
`/comparatif/` (2,9), `/guides/` (2), `/a-propos/` (4,2), les guides 300 € et 500 € (5,7 et 6,6).

## 22 septembre 2026 — Le sitemap n'est pas cassé, c'est sa ligne dans Search Console qui l'est

Jordane : « Je n'arrive pas à soumettre le sitemap... J'ai ce problème depuis le début, depuis la
publication du site. » Capture à l'appui : « Impossible de récupérer le sitemap », **Type : Inconnu,
Dernière lecture : vide, Pages découvertes : 0**. Google ne l'a donc jamais récupéré une seule fois
— ce n'est pas le rapport en retard qu'on avait diagnostiqué le 15/09.

**Le serveur a été mis hors de cause, cette fois sous tous les angles.** `/sitemap.xml` répond 200
en HTTP/1.1 **et** en HTTP/2, avec brotli, avec gzip, sans compression, en HEAD comme en GET,
toujours `application/xml`, 5 223 octets, XML valide à 39 `<url>`, **aucun BOM ni espace avant
`<?xml`** (vérifié en octets bruts). La même requête avec l'agent Googlebot renvoie le même 200 en
0,19 s. `robots.txt` porte `Allow: /`. **Aucun DS au registre `.eu`** : le domaine n'est pas signé,
donc aucune validation DNSSEC ne peut échouer chez le résolveur de Google — c'était l'hypothèse la
plus sérieuse qui restait, elle tombe. **Aucun AAAA** : pas de piège dual-stack. `www` et `http`
redirigent en 301 vers l'adresse canonique.

**Ce qui reste, et qu'on ne peut pas mesurer d'ici** : l'état que Google garde pour cette
adresse-là. Une ligne « Impossible de récupérer » née des échecs du 13/09 (le site était alors en
`Disallow: /`) survit à la correction du serveur et à une simple re-soumission.

**Le levier, c'est l'adresse.** Proposition de Jordane en voyant le sitemap de Marteline : publier
un **index** plutôt qu'un fichier unique. C'est la bonne idée, pour une raison qu'il faut nommer :
une URL neuve ouvre une ligne neuve dans Search Console, qui n'hérite d'aucun échec. Le format
d'index n'a aucune vertu magique, c'est le changement d'adresse qui compte.

`scripts/sitemap.mjs` écrit donc **trois fichiers pour une seule liste** :

- `/sitemap-index.xml` — l'index, seule adresse déclarée dans `robots.txt` et à soumettre ;
- `/sitemap-0.xml` — les 39 URL, vers lesquelles l'index pointe ;
- `/sitemap.xml` — la même liste, **gardée en vie** : `llms.txt` la cite, et une adresse de sitemap
  qui disparait serait une 404 de plus dans les rapports de Google.

Aucune des deux nouvelles adresses n'a jamais été soumise : la chaîne complète est vierge.

**CORRECTION, une heure plus tard, sur une deuxième capture.** La conclusion ci-dessus
(« Google ne l'a jamais récupéré, la ligne est bloquée ») était trop forte. La liste des sitemaps
envoyés porte une troisième ligne qu'on n'avait pas regardée : `https://bipbop.eu/llms.txt`,
soumis le 14/09, **dernière lecture le 20/09**. Google lit donc bien des fichiers sur ce serveur.
Ce qu'il n'a jamais lu, c'est cette adresse-là — ce qui n'est pas la même chose.

Et cette ligne donne la mesure qui manquait : **six jours entre la soumission et la première
lecture** sur cette propriété. Les deux sitemaps XML ont été soumis le 22/09 même.
« Impossible de récupérer » est l'état affiché tant que rien n'a été lu : un « pas encore », pas un
verdict. Le vrai diagnostic est donc **la latence**, pas une ligne empoisonnée.

Ce que l'index à une adresse neuve garde de valeur : il ne coûte rien, c'est la forme que publient
la plupart des outils, et il élimine une variable si le problème devait durer. Mais ce n'est pas
lui qui débloquera la situation.

**Ce qui reste à faire, et qui ne se fait pas d'ici** : supprimer la ligne
`https://bipbop.eu/llms.txt` — ce n'est pas un sitemap mais du markdown, elle ne peut qu'échouer
indéfiniment et elle pollue le rapport. Garder `sitemap-index.xml`, laisser le temps faire. Et se
rappeler qu'**un sitemap n'est pas nécessaire à l'indexation** : Google explore déjà le site, le
levier immédiat est l'inspection d'URL page par page, pas le sitemap.

`npm run check` : 8/8. `npm run fidelite` : 37/37.

## 22 septembre 2026 — Les URL disent enfin de quoi parlent les pages

Demande de Jordane : « les urls actuelles sont vraiment catastrophiques, pas du tout optimisées
pour le SEO », avec la crainte explicite de toucher à des pages déjà indexées.

**La crainte était fondée, le calendrier l'a désamorcée.** Le site n'est ouvert aux moteurs que
depuis le 13/09 au soir. Au 15/09, `site:bipbop.eu` renvoyait neuf pages et le sitemap était encore
en backoff côté Search Console. Aucune position acquise, aucun lien entrant connu : renommer
maintenant coûte une re-soumission de sitemap, le faire dans six mois coûterait des positions. La
fenêtre était ouverte aujourd'hui, elle se referme toute seule.

**Ce qui n'allait pas, mesuré et pas ressenti.** Seize slugs sur dix-huit ne contenaient pas leur
`requete_cible` du plan éditorial. Sept « bases » ne voulaient rien dire hors contexte
(`/les-bases/combien-de-temps/`, `/les-bases/seul-ou-prof/`, `/les-bases/quel-casque/`). Les trois
guides par budget n'avaient pas la même forme entre eux, deux portaient « meilleure- » et le
troisième non. Deux duels sur trois avaient perdu les marques (`/duels/nitro-max-vs-td-02kv/`) là
où le troisième les gardait.

**Trente et une lignes réécrites, une seule source.** `slug` et `permalien` dans
`Claude Design - MàJ/data/plan-editorial.csv` — vingt routes publiées, onze encore « À produire »
alignées au passage pendant qu'elles ne coûtent rien. Le reste suit tout seul : `port.mjs` recalcule
les routes et réécrit les **811 liens internes** des maquettes depuis les permaliens, `import-data`
régénère `plan.json`, `arborescence.mjs` régénère le sitemap, le plan du site et `llms.txt`. Aucune
maquette ne contient de chemin absolu, c'est ce qui rend l'opération mécanique plutôt que manuelle.

**Le piège, parce qu'il aurait été invisible.** `copySeo()` retrouve le title et la meta à deux
endroits, tous deux indexés par la route : `design/port-seche/<route>/index.astro`, puis le `<head>`
de `src/pages/<route>/index.html`. Renommer la route sans déplacer les dossiers d'abord, et les deux
lectures échouent : le portage retombe sur le `<h1>` et le chapeau de la maquette, **sans un
message**. Les vingt titles et metas validés le 14/09 seraient partis avec. Les dossiers ont donc
été déplacés (`git mv`) **avant** le portage, port-seche compris. Vérifié : zéro avertissement
« titre repris du `<h1>` » au portage, et le contrôle 8 reste au vert.

**Vingt redirections 301, aucune chaîne.** `public/_redirects`, une ancienne adresse par ligne vers
sa destination finale. Aucun ancien dossier ne survit dans `src/pages/` ni dans `dist/` : un
doublon indexable aurait été pire que le mal.

**Une régression rattrapée au passage.** `SUIT_CHAQUE_RELEVE` de `scripts/prix/rapport.mjs` — les
pages que l'Aide-Mémoire §05 redate à chaque relevé — nommait les routes en dur et ne matchait plus
rien après le renommage. Corrigée. **Et un bug préexistant trouvé à côté, pas corrigé** : la regex
de `PLAFONDS` (`moins-de?-(\d+)-euros`) ne matche ni les anciennes routes ni les nouvelles — elle
attend « moins-de-300 » là où les routes écrivent « moins-300 ». Le contrôle des plafonds du rapport
de prix est donc inerte depuis sa création. Le réparer changerait le comportement du rendez-vous du
lundi : c'est une décision de Jordane, pas un effet de bord d'une passe SEO.

**Ce qui reste hors dépôt, côté compte Google** : re-soumettre `/sitemap.xml` dans Search Console
(il porte déjà les 39 nouvelles URL) et surveiller le rapport de couverture deux semaines, le temps
que les vingt anciennes adresses basculent. `PRIX-SEMAINE.md` cite encore les anciennes routes :
c'est un rapport daté du 21/09, il se réécrit au relevé du 28.

`npm run check` : 8/8, 934 liens internes valides. `npm run fidelite` : 37/37.

## 21 septembre 2026 — Les prix se tiennent tout seuls, et le premier relevé automatique trouve un lien mort à 200 €

Demande de Jordane : un « cron » qui tient les prix à jour une fois par semaine, qui fasse **toutes
les mises à jour éditoriales** quand un prix bouge, et une page publique qui montre le travail.
Autonomie complète demandée, jusqu'au push sur `dev`.

**Le rendez-vous du lundi.** `scripts/prix/`, huit étapes, posé dans launchd à 8 h 17
(`npm run prix:rendez-vous`) sur le modèle de celui de `refonte-cdlm`. Il télécharge les deux flux
partenaires, relève, écrit `PRIX-SEMAINE.md`, écrit les prix dans `design/prix-reperes.json`, ouvre
**une session Claude pour les réécritures**, re-porte, publie l'historique, passe `check` et
`fidelite`, commite et pousse. `npm run prix:semaine` fait la même chose à la demande.

**Ce que les flux changent, et ce qu'ils ne changent pas.** Les 121 références Thomann et les 11
Donner viennent désormais du flux partenaire : zéro requête, et le bundle ne peut plus être pris
pour le kit puisqu'il a son propre article. Mais **le flux Thomann ne dit pas la disponibilité**
(neuf colonnes, pas de stock) : elle se lit toujours sur la page, une par une, et c'est le piège
n°3 de la procédure. Woodbrass n'a aucun flux, ses 24 références restent en lecture de page.
Constat du jour : sur la BackBeat, le flux Donner annonce les deux variantes **en stock** et la
fiche Shopify dit **épuisé**. C'est la fiche qui l'emporte — c'est elle que le lecteur voit.

**Le premier relevé a trouvé ce qu'un relevé à la main aurait manqué.** 155 prix sur 156, aucun
écart au-dessus du seuil de 5 €... et la **Donner BackBeat absente du flux**. La fiche répondait
HTTP 200, donc rien ne clochait en apparence : elle **redirigeait vers l'accueil**. Le produit
n'avait pas disparu, il avait été republié sous une autre adresse, à **1 099,99 € au lieu de
899,99 €** — l'ancienne page était une offre promotionnelle. Le site publiait donc un lien mort
**et** un prix faux de 200 €, sur un modèle que le comparatif peut recommander. Lien et prix
corrigés ensemble : séparés, le prix affiché ne viendrait plus du marchand vers lequel pointe le
lien, et c'est la seule règle qu'un lecteur peut vérifier en un clic.

Trois choses en sont sorties, pour que la prochaine fois soit automatique :
- une absence de flux n'est plus un verdict, c'est un **soupçon** : la page est ouverte, et la
  disparition n'est retenue que si elle ne répond plus, redirige ailleurs, ou n'a plus de prix ;
- le relevé **cherche le produit par son nom** dans le catalogue entier avant de laisser conclure
  à un retrait, et le rapport propose les candidats avec leur écart de prix. Testé : il retrouve
  la BackBeat exactement comme je l'ai trouvée à la main ;
- `design/prix-reperes.json` accepte maintenant `url` et `marchand` sur un modèle, pas seulement
  sur un accessoire — une fiche qui déménage ou une bascule de marchand n'a plus besoin de toucher
  la source de l'auteur.

**Quatorze ruptures, deux qui comptent, zéro à traiter.** Le rapport ne les jette plus en vrac :
il sépare le **délai** de la **rupture** (« une rupture de plus de deux semaines justifie de
basculer le lien » — « disponible sous 1-2 semaines » n'en est pas une), il dit **depuis combien de
relevés** chacune dure, et **quelles pages publiées la lient**. Résultat : sur quatorze, deux sont
liées depuis une page (Roland PDX-100 sur `/guides/faire-evoluer-sa-batterie/`, Alesis Nitro
Multicore sur `/guides/acheter-occasion/`), et aucune n'a encore deux relevés d'ancienneté. Rien à
basculer cette semaine, et c'est écrit noir sur blanc plutôt que laissé à l'appréciation.

**Le rapport est le brief, pas un résumé.** Pour chaque prix qui bouge, `PRIX-SEMAINE.md` cherche
l'ancien montant dans les 46 maquettes et les 39 pages portées, et tranche ligne par ligne entre
**substitution mécanique** et **phrase à réécrire** — « au même prix » quand l'écart devient de
11 € ne se répare pas avec une regex. Il calcule les franchissements de tranche, les guides par
budget qu'un modèle quitte ou rejoint, et les écarts de duel qui **s'inversent** (les deux modèles
d'un duel sont lus dans le NOM de sa maquette, pas dans son corps : une page de duel cite aussi ses
voisines, et les chercher dans le texte lui faisait affronter trois adversaires à la fois).
Garde-fou le plus important : quand un montant est **partagé** par plusieurs modèles — au 21/09,
498 € désigne la TD-02KV, la MPS-750X *et* la DTX432K — le rapport le dit en tête de section et
aucune substitution automatique n'est appliquée.

**Ce que le lundi ne fait jamais.** Il n'écrit pas une phrase. Il écrit de la donnée, avec sa date
et sa preuve. Et il refuse de livrer dans trois cas : dépôt déjà modifié au démarrage (quelqu'un
travaille, on ne balaye pas son travail d'un `git add -A`), `check` ou `fidelite` en échec, session
éditoriale interrompue. Un garde-fou de plus : si plus d'un cinquième des références changeaient de
prix d'un coup, ce ne serait pas le marché, ce serait le relevé — rien n'est écrit.

**`/suivi-des-prix/`, la page publique.** Troisième page sans maquette, après `/comparatif/` et
`/plan-du-site/`. Elle ne contient aucun chiffre tapé à la main : tout vient de
`src/data/historique-prix.json`, que le relevé remplit. Elle montre le dernier contrôle, la méthode
en quatre cartes, et l'historique semaine par semaine — **y compris les semaines sans mouvement**,
parce que c'est là qu'on prouve qu'on a regardé. Elle est déclarée dans `SANS_MAQUETTE` et dans
`HORS_PLAN`, donc elle entre seule dans le plan du site et le sitemap. Le lien du pied de page
passe par la greffe, qui devient `grefferLiensDuPied()` et en pose deux.

**Deux dérives corrigées au passage.** `/comparatif/` affichait « prix relevés le 13 septembre »
en dur alors que la base disait le 17 : la date vient maintenant de `base.releve`, elle suivra
chaque relevé toute seule. Et `scripts/releve-prix.mjs` a perdu 100 lignes : les regex de lecture
des marchands vivaient en double, elles sont dans `scripts/prix/marchands.mjs`, importées par les
deux. Le rapport signale aussi les 22 pages dont la date de relevé affichée a pris du retard, en
distinguant celles que l'Aide-Mémoire §05 redate à chaque relevé de celles qui ne suivent que le
fond.

Les deux contrôles sortent au vert : 8/8 sur 40 pages, 37/37 en fidélité, aucun débordement à
390 px sur la page neuve.

## 18 septembre 2026 — Quatre arbitrages de Jordane, une erreur de spec trouvée dans l'affaire, et un huitième contrôle

Quatre questions posées après le relevé du 17, quatre réponses de Jordane : la DED‑70 en second
choix du guide « moins de 300 € », basculer tout de suite les trois ruptures qui ont un équivalent
Woodbrass, une **surcharge versionnée** pour la vérité des prix, et un seul garde‑fou ajouté :
les longueurs de copie.

**La vérité des prix est entrée dans le dépôt.** `design/prix-reperes.json` : deux modèles, quatre
accessoires, un retrait, chacun avec sa date et sa preuve, appliqué par `import-data.mjs` après la
lecture du dossier Claude Design (et l'en‑tête de la base se surcharge aussi — c'est lui que le
comparatif et le hub datent sous leurs tableaux). **Les trois fichiers de l'auteur sont repartis à
leur état d'origine** : je ne suis plus celui qui retape la source de quelqu'un d'autre, mes valeurs
vérifiées sont versionnées avec le reste. Une entrée de surcharge qui ne correspond à rien **fait
échouer l'import** : le 18 au soir elle a refusé de publier parce que j'avais écrit « TM‑1 module
trigger » pour un fichier qui dit « TM‑1 Trigger Module ». C'est le comportement voulu, pas un
ennui. Testé dans le sens qui compte : en remettant l'auteur à 298 / 1 539 / 72,99 avec la RYMP
présente, l'import rejoue exactement l'état corrigé.

**Trois liens changés de marchand, zéro prix changé.** KU100 (88 €), BT‑1 (125 €) et TM‑1 (198 €)
sont En stock chez Woodbrass **au même tarif** que chez Thomann, revérifié en direct le 18/09 — pas
dans le flux du 10/09. Thomann les annonçait « sous 2‑3 semaines », « sous 7‑9 semaines » et « sans
date ». Le TM‑1 porte le badge **NOTRE SÉLECTION** de `/guides/enregistrer-sa-batterie/` : cette
recommandation ne mène plus vers une fiche vide. Deux pièges au passage : chez Woodbrass le « TM‑1 »
existe aussi en **pack à 369 € hors stock**, et le piège a failli être pris pour le module seul ;
et la **photo** de ces trois lignes reste hébergée chez Thomann (même produit, le flux Woodbrass ne
fournit aucune colonne d'image). Les deux pages portent maintenant « prix relevés chez Thomann et
Woodbrass le 18 septembre 2026 ».

**Une erreur de spécification, trouvée en cherchant le second choix.** Le guide « moins de 300 € »
présentait la Donner DED‑70 comme « **Tout en caoutchouc** », et sa colonne Peaux disait
« Caoutchouc ». La fiche Donner dit autre chose : quatre têtes double couche **6,5" Mesh** (caisse
claire + trois toms) et trois **cymbales** en caoutchouc 9". La base, elle, était juste (`peaux:
mixte`, « Pads de fûts en mesh à moins de 200 € ») — c'est la page portée qui avait tort, et
c'était le modèle qu'on venait de remonter. Les deux cellules sont corrigées. **Je n'ai pas
touché à « les pads claquent »** dans la colonne « En une phrase » : c'est une appréciation, pas
une mesure, et ce n'est pas à moi de la réécrire. À noter aussi : « Aujourd'hui deux modèles
mettent de la peau maillée partout » reste vrai (MPS‑150X et DED‑70), mais ne l'est plus pour la
même raison qu'hier.

**Le second choix était déjà là, pas moi.** Sa grille de cartes est `data-rwd="c3"` (trois
colonnes) et jouait sur MPS‑150X (NOTRE CHOIX), Turbo Mesh, Donner DED‑70 (SI 300 € EST TROP). En
disant à Jordane que le guide « n'avait plus de second choix », je confondais l'étiquette retirée
(`NOTRE SECOND CHOIX`, qui était le rôle de la Turbo) et le rôle éditorial : la DED‑70 occupe déjà
le deuxième rang, avec son propre badge. Sa réponse était donc dans la page — aucune carte à créer,
seulement la ligne de spécification à réparer. **Ce qui reste vrai en revanche : la grille est
mesurée à 2 cartes dans un moule de 3** (vérifié au parseur, pas au feeling) — depuis le retrait de
la Turbo, le troisième emplacement est vide sur desktop. Le contrôle de responsive ne le voit pas
(rien ne déborde), c'est une question de composition, pas de casse.
**Et ma faute de compte de la veille** : j'avais écrit « Les cinq autres » là où six modèles moins
le choix moins l'alternative font quatre.

**Huitième contrôle dans `verif.mjs` : les longueurs de copie** (titles 50‑60, descriptions
120‑155). Il a trouvé deux cas réels dès sa première exécution — `mentions-legales` (26) et
`politique-confidentialite` (38). Ce ne sont pas des erreurs : gonfler un titre juridique jusqu'à
cinquante caractères ne sert personne. Elles sont donc **exceptions explicites dans le script, et
affichées à chaque exécution**, pas un `if` silencieux. Les 38 routes passent.

Mesure finale de la passe : 60 corrections de portage, `npm run check` avec les 8 contrôles au
vert, `npm run fidelite` 37/37, et 19 assertions sur `dist/` (liens, prix, cellules, compteurs)
toutes vertes.

**Deux points laissés sur décision du 18/09, pas par oubli.** Le premier : le pied de page, **sur les
39 pages**, annonce « **LIENS AFFILIÉS** — Les liens vers Thomann, Woodbrass et Donner Music nous
rapportent une commission si tu achètes ». La liste des marchands est exacte, mais le journal du
14/09 consigne que le site n'a **pas** de programme d'affiliation et le contrôle n°7 vérifie
justement qu'aucun lien traquant ne sort du dépôt : la page affirme donc une commission que le site
ne touche pas. Présenté à Jordane avec trois issues (réécrire sans la commission, retirer la
mention, laisser), **sa réponse : laisser tel quel.** C'est écrit ici pour que personne ne le
« corrige » par initiative propre ni ne le redécouvre comme une nouveauté dans six mois — à rouvrir
le jour où le programme d'affiliation sera signé. Le second : la grille du guide « moins de 300 € »
rend **deux cartes dans un moule de trois** depuis le retrait de la Turbo. Propositions (monter le
Debut Kit en carte, repasser la grille en deux colonnes, laisser) — **sa réponse : laisser deux
cartes.** Rien à toucher au layout.

**Resté ouvert, non tranché.** Nitro Amp (98 €) et Nitro Multicore (89 €) : en rupture chez Thomann
**sans** équivalent dans le catalogue Woodbrass, et toujours liés depuis `/guides/pack-complet/` et
`/guides/acheter-occasion/`. Les 12 autres ruptures dorment en base, sans page.

## 17 septembre 2026 — Relevé des 157 prix sur le web : trois bougent, dont une qui sort de son segment

Jordane : « Va vérifier que tous les prix des modèles / produits proposés sur le site (batteries,
accessoires) sont toujours exacts. Peux-tu consulter le web pour ça (web FR). » Les trois flux
`Archives/` datent du 10/09 et le dernier relevé publié du 13/09 : ils ne peuvent pas répondre, il
fallait relire les fiches marchandes une par une.

**D'abord vérifié que la base est bien l'unique source.** `scripts/verif.mjs` est au vert sur les 39
pages et mon contrôle croisé des 68 étiquettes de prix d'accessoires dans `dist/` donne zéro
divergence page ↔ `src/data/`. Production testée sur un échantillon : les 22 montants de
`bipbop.eu/avis/alesis-nitro-max/` sont identiques au build local. Donc corriger la base suffit à
faire bouger le comparatif, le hub et ses compteurs ; les pages portées, elles, gardent leur texte.

**Comment se lit un prix, chez chacun.** Thomann ne publie **aucun JSON-LD** : microdata
`itemprop="price"` (virgule décimale), dispo dans `itemprop="availability"`, et le `itemprop="name"`
du fil d'Ariane renvoie « Home » — le nom ne se vérifie que dans le bloc e-commerce GTM. Deux
requêtes simultanées déclenchent le 429 : **une seule lane Thomann à ~5 s d'intervalle**, les 122
fiches en 14 minutes. Woodbrass donne du JSON-LD. Donner est un Shopify **multi-variantes** dont le
JSON-LD ne dit que la variante par défaut, très souvent le bundle : c'est `/<slug>.json` qu'il faut
lire, et retenir le minimum des variantes.

**Résultat : 152 des 156 prix lus sont exacts au centime.** Trois écarts au-dessus du seuil de 5 € de
la procédure, un dessous (Roland RT-30K, 93 → 95 €, on n'y touche pas) :

| Référence | Publié | Réel 17/09 | Ce que ça casse |
|---|---|---|---|
| Alesis Turbo Mesh Kit | 298 € | **309 €** | franchit les 300 €, 9 routes, un duel entier |
| Alesis Strata Club | 1 539 € | **1 598 €** | aucune page, juste le tableau du hub |
| Donner HHCB-12 | 72,99 € | **165,99 €** | le lien vend le pack, pas le contrôleur seul |

Le flux du 10/09 donnait encore 298 et 1 539 : le site n'a jamais été faux, il est dépassé.

**La Turbo n'est pas une correction de chiffre.** Elle sort du segment « Moins de 300 € » et le duel
MPS-150X contre Turbo Mesh reposait textuellement sur l'égalité : H1 « le match à 298 € », « Exactement
le même prix », ligne « Prix 298 € / 298 € → Égalité », eyebrow « MÊME PRIX, MOINS DE MATÉRIEL », meta
« au même prix ». Décision de Jordane : **chiffres et réécriture**, pas les chiffres seuls. 42
corrections dorénavant dans `design/port-corrections.json` — c'est là qu'elles vivent, pas dans les
pages, un portage les écrase sinon. Le piège est réel : « 298 € » apparaît **62 fois** dans `dist/`
parce que la MPS-150X est toujours à 298 € chez Thomann ; seules 16 occurrences étaient les siennes.
D'où la règle déjà écrite dans `port-corrections.json` : une ancre qui mord un autre prix fait échouer
le portage au lieu d'abîmer la page.

**La Turbo sort du guide « moins de 300 € »**, donc le guide change de forme : 7 modèles → 6, la
table des matières et le titre de section suivent, « deux valent vraiment le coup » devient « un »,
« les deux lignes surlignées » devient « la ligne surlignée ». **Il n'a plus de second choix** :
promouvoir un autre modèle du segment est une recommandation, pas une déduction — c'est à Jordane de
le choisir ou d'assumer qu'il n'y en a plus.

**Un bug d'outillage trouvé en route.** `fidelite.mjs` appliquait les corrections au corps **brut** de
la maquette, `port.mjs` au corps **déjà nettoyé** de son traçage : une correction dont l'ancre
traverse un lien marchand ne pouvait donc passer que dans un des deux scripts. Réparé dans
`corpsMaquette()` (mêmes href nettoyés ; les segments comparés sont du texte pur, l'attribut n'entre
pas dans la comparaison).

**La référence Sparedrum RYMP est morte**, pas illisible : l'URL Woodbrass renvoie HTTP 200 sur une
page de catégorie générique sans prix, alors qu'elle était à 18,00 € au flux du 10/09. Retirée de
`selection-accessoires.csv`. Conséquence mesurée une fois de plus par le garde-fou : `/a-propos/`
annonçait « 126 accessoires », la base en dit 125 — le compteur est corrigé par la même mécanique.

**17 références en rupture de stock, prix toujours affichés** (le piège n°3). Aucune n'est une erreur
de prix. Cinq sont liées depuis une page publiée, et l'alternative Woodbrass a été revérifiée **en
ligne**, pas dans le flux du 10/09 : KU100 88 €, BT-1 125 € et TM-1 198 € y sont En stock au même
tarif, alors que Thomann annonce « sous 2-3 semaines », « sous 7-9 semaines » et pas de date. Nitro
Amp et Nitro Multicore n'ont pas d'alternative. **Décision de Jordane : rien basculer pour l'instant,
journaliser.** Le flux Thomann local n'a aucune colonne de stock : on ne peut pas dater une rupture
avec ce qu'on a en magasin, seule la page le dit.

**Ce qui reste vrai mais fragile.** Le Strata Club est à 1 598 €, à 2 € du plafond de tranche : au
relèvement suivant, `segmentDe()` lève et le build casse. `Selection-Produits.dc.html`,
`Design-System.dc.html` et `Guide-Du-Projet.dc.html` citent encore 298 €, 1 539 € et « 126
accessoires » — ce sont des documents internes qui ne se publient pas, mais ce sont les seuls endroits
où le site ne se corrige pas tout seul.

**Deux affirmations ne se corrigeaient pas d'elles-mêmes.** Le duel terminait son tableau par
« Trois critères pour la Millenium, trois pour l'Alesis, cinq égalités » : la ligne Prix étant passée
de « Égalité » à « Millenium », le décompte réel est 4 / 3 / 4. Le guide « moins de 300 € » fermait ses
pièges par « Aucune de ces sept batteries n'est livrée avec un casque », six désormais. `verif.mjs` ne
voit ni l'un ni l'autre : il contrôle les prix collés aux noms et les compteurs publiés, pas les
bilans chiffrés d'un tableau. **Et les badges de date** : les huit pages modifiées affichaient encore
« MISE À JOUR · 11/12 SEPT. 2026 », plus le hub. Étape 5 de la procédure — on rafraîchit la date des
pages réellement touchées, pas des autres : les 30 pages non modifiées gardent leur date.

**Second piège d'outillage, celui-là m'a mordu.** `copySeo()` de `port.mjs` cherche le titre et la
description **d'abord dans la source Astro archivée dans `design/port-seche/`**, et seulement ensuite
dans le `<head>` de la page portée. Pour les pages qui ont encore une copie sèche — dont
`/avis/alesis-turbo-mesh/` — la copie SEO publiée vient donc d'une **archive retirée du circuit** :
j'ai corrigé le `<head>` de la page, le portage suivant l'a ressuscitée en 298 € sans un mot, et c'est
la production qui l'a montré. Il a fallu remettre l'archive à jour aussi pour que la correction tienne.
`design/port-seche/` étant gitignoré, le dépôt n'est pas touché et Netlify ne porte rien — mais sur tout
poste où l'archive est en place, **une meta corrigée en page doit l'être aussi dans l'archive**.

Et une faute à moi, rattrapée en ligne : les deux nouvelles metas que j'avais écrites passaient à
**165 caractères**, hors des 120-155. Elles ne sont signalées ni par les 7 contrôles de `verif.mjs` ni
par `fidelite.mjs` — le contrôle de longueur des metas n'existe nulle part dans le dépôt. Revérifié à la
main sur les 38 pages : titles 50-60, metas 120-155, tout au format. C'est le garde-fou qui manque :
à ajouter à `verif.mjs` si d'autres passes SEO doivent suivre.

**Le relevé demandé par la procédure §06 existe maintenant** : `npm run prix`
(`scripts/releve-prix.mjs`), seuil de 5 € intégré, détection du changement de tranche et des
ruptures, sortie datée dans `releves/prix-<date>.jsonl` — celle du 17/09 y est déjà, la procédure veut
qu'on garde les quatre dernières. `npm run check` : les 7 contrôles au vert. `npm run fidelite` :
37/37 pages reproduisent leur maquette.

## 15 septembre 2026 — Search Console tient le sitemap en rouge, le serveur est propre

Jordane, à propos du « Impossible de récupérer le sitemap » affiché par Search Console : « Tu es sûr
qu'il n'y a pas de Disallow sur le sitemap XML ? »

**D'abord une confusion à défaire, elle revient souvent.** Une directive d'accès ne peut pas vivre
dans un sitemap : `Disallow` n'existe que dans `robots.txt` ou dans un en-tête `X-Robots-Tag`. Un
fichier XML de sitemap ne contient que des `<url>`, et Google n'y cherche pas la même chose. Ce que
la version d'hier affichait en tête était un commentaire, du texte ignoré.

**Mesuré deux fois, depuis deux réseaux différents** (la box de Jordane, puis une sortie par un autre
chemin), le 15/09 à 08h55 : `/sitemap.xml` répond 200 en HTTP/2 et HTTP/1.1, `application/xml`,
4 812 octets, brotli accepté, XML valide, 38 `<loc>`, 12 requêtes de suite sans un seul 5xx, chaîne
TLS complète (4 certificats, `Verify return code: 0`), aucun `x-robots-tag`, **pas de record AAAA**
sur la zone Netlify — donc pas de piège Googlebot dual-stack — et des `lastmod` au 14/09, aucun dans
le futur. `robots.txt` servi : `User-agent` / `Allow` / `Sitemap`, 63 octets. La chaîne « Disallow »
n'apparaît dans **aucun fichier publié** du dépôt (trois mentions en prose dans ce journal et dans
`design/plan-de-reprise.md`).

**Ce qui a déplacé le diagnostic : le site est déjà indexé.** Une recherche `site:bipbop.eu` renvoie
neuf pages, dont `/plan-du-site/`, qui n'existe que depuis le 13/09. Googlebot passe donc sur ce
serveur, l'explore et l'indexe. Le rouge attaché au sitemap n'est plus un problème d'accès mais un
rapport en retard : après les échecs du 13/09 (le `Disallow: /` d'avant l'ouverture), Google applique
un backoff et retarde ses tentatives de plusieurs jours. Le geste qui casse ce backoff est de
**supprimer puis re-soumettre** le sitemap dans Search Console, pas de retoucher le serveur. Résultat
obtenu via un agent de recherche tiers : je ne peux pas garantir que les neuf pages viennent de
l'index Google plutôt que d'un autre moteur.

**Un point trouvé en route, tranché le jour même : `bipbop.fr` n'est branché nulle part.** Le `.eu` est
bien chez Netlify (`*.p01.nsone.net`), le `.fr` est resté chez OVH (A `213.186.33.5`, NS
`dns111.ovh.net` / `ns111.ovh.net`) et son handshake TLS est reset : le domaine ne sert rien du tout.
**Décision du 15/09 : on le laisse en attente** — toute l'énergie va à l'indexation du `.eu`, le
domaine canonical et celui soumis dans Search Console. Le jour où on y touche, ce sera pour un
**301 vers `bipbop.eu`**, jamais pour un site miroir qui dupliquerait le contenu. Une URL soumise dans
Search Console qui contiendrait `bipbop.fr` expliquerait le rouge à elle seule, et il faudrait
trancher plus tôt.

## 15 septembre 2026 — Ce qui ne se publie pas : les commentaires du sitemap et de robots.txt

Jordane, en relisant `/sitemap.xml` : « C'est dingue qu'elle y soit ! Google va lire ça… »

**Ce qui sortait du dépôt.** `scripts/sitemap.mjs` écrivait un commentaire XML de deux lignes en
tête de sitemap — « Généré par scripts/sitemap.mjs à chaque build. Ne pas éditer : la source est
`src/data/plan.json`… » — et `public/robots.txt` portait 11 lignes de `#` racontant les trois
gestes de l'ouverture aux moteurs de 2026, avec les chemins des scripts concernés.

**Pourquoi ça part.** La spec sitemaps autorise les commentaires et les `#` sont légaux dans
robots.txt : techniquement, rien ne casse. Mais un fichier publié n'est pas un fichier de travail.
Son destinataire est un crawler — ce qu'il y lit ne nuit ni à l'affichage ni au classement, mais
lui apprend où vivent nos routes et comment le dépôt est monté. Ce qui explique un fichier se note
dans `JOURNAL.md` et dans l'en-tête du script, pas dans l'artefact servi.

**Ce qui a changé.** Les deux lignes retirées du tableau `xml` de `scripts/sitemap.mjs` ; la
prose explicative reste dans son JSDoc, qui ne se publie pas. `public/robots.txt` réduit à
`User-agent` / `Allow` / `Sitemap` — l'historique de l'ouverture est déjà consigné dans ce journal
(13/09, « les trois gestes »), rien n'est perdu.

**Vérifié.** `npm run check` → 39 pages, **7/7**, 876 liens internes, aucun traquant.
`npm run fidelite` → **37/37**. `dist/sitemap.xml` relu par un parseur : document valide, 38 `<loc>`,
38 `<lastmod>`, **0 nœud commentaire**. `dist/robots.txt` : 4 lignes.

## 14 septembre 2026 — `/llms.txt` : une troisième lecture du même arbre

Jordane : « Peux-tu générer le fichier llms.txt de mon site BipBop.eu ? »

**Ce que c'est.** Un fichier Markdown posé à la racine (`https://bipbop.eu/llms.txt`, format
[llmstxt.org](https://llmstxt.org)) que les modèles lisent avant de parcourir un site : un titre,
un blockquote de résumé, puis des listes de liens avec une note par lien. Il ne remplace pas le
sitemap — il dit ce que le sitemap ne dit pas : ce que contient chaque page et selon quelle règle
elle est écrite. Les moteurs n'ont pas confirmé qu'ils le consomment ; les agents et les outils de
RAG, si. Coût d'entrée faible, c'est un fichier de plus au build.

**Ce qui est publié maintenant.** `scripts/llms.mjs`, branché en `postbuild` derrière
`scripts/sitemap.mjs`, et `npm run llms` pour le lancer seul. Il écrit `dist/llms.txt` : 38 liens
rangés dans les six sections du plan (« Le point de départ », « Les avis », « Les duels », « Les
guides d'achat », « Les bases », « Le site ») plus une section `Optional` pour les deux pages
légales — la convention du format veut qu'`Optional` regroupe ce qu'un agent peut sauter.

**C'est un arbre, trois lectures.** Les routes viennent de `arborescence(DIST)` dans
`src/lib/arborescence.mjs`, exactement comme le sitemap XML et la page `/plan-du-site/`. Le nom
d'un lien est le `<title>` publié de la page, sa note est sa `<meta description>` publiée : la
fiche SEO du 14/09 sert donc aux trois publics, et une page qui change de copie change de note
toute seule. Rien n'est ressaisi dans le script, et aucun lien n'est écrit à la main dans le
fichier. Les deux phrases de contexte qui citent un chiffre (`9` avis, `31` modèles suivis, relevé
du `13 septembre 2026`) sont comptées dans `src/data/` et lues dans `RELEVE`, pas tapées.

**Ce que le fichier affirme, et pourquoi c'est vrai.** « Aucun lien affilié, aucun article
sponsorisé » et « une note n'existe que si la grille qui la produit est affichée » : les
contrôles 6 et 7 de `verif.mjs` font échouer `npm run check` si un traqueur ou une note interne
survit, donc la phrase tient tant que le contrôle de fin de séance est vert. C'est aussi la seule
page du site qui résume la méthode éditoriale en quatre lignes pour un lecteur qui ne cliquera sur
aucune autre.

**Deux garde-fous qui font échouer le script** (même esprit que `sitemap.mjs`) : une page publiée
sans `<meta description>` publierait un lien nu ; et le fichier relu après écriture doit contenir
exactement un lien par page revendiquée par le plan.

**Vérifié.** `npm run build` → 39 pages, `llms.txt · 38 lien(s), dont 36 hors « Optional »`, les
6 sections aux mêmes compteurs que le sitemap. Les 38 URL du fichier sont **identiques** à celles
de `dist/sitemap.xml` (`diff` vide en retirant les 3 liens de la phrase de contexte).
`node scripts/verif.mjs` : **7/7**, 876 liens internes, aucun traquant. `npm run fidelite` :
**37/37**.

**En ligne.** Commit `c7b4fa9` sur `dev`, merge `2eda10c` sur `main` à la demande de Jordane pour
revue, vérifié **en HTTP** sur la production : `https://bipbop.eu/llms.txt` → 200,
`content-type: text/plain; charset=UTF-8`, octet pour octet identique au `dist/` construit,
`www.bipbop.eu/llms.txt` → 301 vers le canonical. Le fichier se régénère à chaque build : une page
ajoutée au plan éditorial y entre toute seule, sans qu'on y touche.

**Ce qui reste ouvert.** `public/robots.txt` n'a rien à changer : `llms.txt` n'est pas un fichier
qu'on déclare, il se trouve. Et si un jour les pages ont une version Markdown lisible par machine,
le format veut que les liens du `llms.txt` pointent dessus plutôt que sur le HTML.

## 14 septembre 2026 — Passe SEO : les 39 titles et metas réécrits, la marque et les prix hors des titres

Jordane : « Les Titles SEO des pages ne sont pas optimisés… ils sont souvent trop longs. » Puis, à
la relecture de la première fiche : « Ne mets pas le nom de la marque dans le Title, ça ne sert à
rien, cela réduit l'espace » et « Pas de prix affichés dans les titles. Tu utilises le mot-clé
"Prix" mais tu ne mets pas de chiffres. » Les deux montants gardés dans les metas et dans les trois
guides de budget ont été validés en 2ᵉ passe.

**État mesuré avant.** 24 titles sur 39 dépassaient 60 caractères (jusqu'à 87, « Millenium MPS-850 :
cent euros de plus que la MPS-750X, pour quoi exactement ? — BipBop »), 7 faisaient moins de 50,
**39 sur 39 portaient la marque**. Côté metas : 9 au-dessus de 155 et 22 sous 120 — des résidus de
chapeau recopiés par le portage faute de copie écrite en place (« Tu as déjà la batterie. », 23
caractères). Le trafic du site venant du SEO seulement, c'était le point à plus fort rendement avant
Search Console.

**Ce qui est publié maintenant.** 36 titles entre 51 et 60 caractères (trois pages hors contrainte :
mentions légales, confidentialité, et la 404 en `noindex`), toutes les metas entre 120 et 155. Les
9 pages d'avis portent « Avis » + le nom du modèle + « Prix » + 2026, vérifié page par page.
Aucun title dupliqué. La marque n'apparaît plus que sur les trois pages où elle est le sujet. Les
montants sont sortis des titles et vivent dans les metas, relues avec l'article. Des titres de
maquette tombés sous le poids du suffixe sont récupérés en entier (`C'est quoi un pad mesh et
pourquoi tout le monde en parle ?`, 68 → 59).

**La leçon de la journée : `src/pages/` n'est pas la source de la copie SEO.** Première tentative,
les 39 copies écrites dans les `<head>` : `node scripts/port.mjs` les a effacées et remises à
l'ancienne. `copySeo()` cherche le titre **d'abord** dans `design/port-seche/<route>/index.astro`,
l'archive des 20 sources Astro retirées par le portage, et ne relit la page portée qu'en l'absence
de ce fichier. La règle est écrite dans `AGENTS.md` (§« Copie SEO : la règle, et où elle vit »),
avec le chemin d'écriture selon les cas.

**Le piège qui allait avec.** La marque était ajoutée par `scripts/port.mjs` (l. 229) et
`BaseLayout.astro`, mais `copySeo()` la re-recognisait avec la regex
`<title>(…) — BipBop</title>`. Retirer le suffixe sans élargir cette lecture fait retomber les 37
pages portées sur le `<h1>` de leur maquette, silencieusement, avec pour seul signal un
avertissement dans la sortie du portage. Les deux ont été changés ensemble, et la regex lit
désormais le `<title>` du seul `<head>` — comme le fait déjà `titrePublie()` de
`src/lib/arborescence.mjs`.

**Un effet de bord assumé.** `libelleDe()` tronque les titres d'avis et de duels aux deux-points pour
les listes du plan du site : « Millenium MPS-450 : avis complet, prix et verdict 2026 » devient
« Millenium MPS-450 » (tant mieux), mais « Que vaut la Roland TD-02KV ? Avis, prix et verdict 2026 »
reste entier faute de deux-points. Deux styles de libellés cohabitent dans `/plan-du-site/`. À
repeindre si ça gêne, ce n'est pas une erreur.

**Contrôles.** `node scripts/port.mjs` relancé deux fois de suite : le second portage ne change plus
un octet (copie survivante, donc). `npm run check` : **7/7**, 0 problème. `npm run fidelite` :
**37/37** pages identiques à leur maquette — la copie SEO n'est pas du corps, elle ne pouvait pas
déclencher l'écart. Dans `dist/` : 39 titles construits, aucun hors plage hormis les trois
exemptées, aucun montant hors des trois guides de budget, sitemap à 38 URL.

**Ce qui reste ouvert.** (a) Search Console : vérifier `bipbop.eu` et soumettre `/sitemap.xml`, seul
geste qui apprenne à Google que le site est libre. (b) Les balises sociales (`og:title`,
`og:description`) n'existent toujours pas : elles devraient reprendre ces mêmes chaînes, et c'est ce
qui fait passer un lien collé dans un message de « rien » à « titre + description + image ».
(c) Aucun contrôle de longueur dans `scripts/verif.mjs` : la règle des 50-60 tient aujourd'hui par la
fiche et par `AGENTS.md`, pas par la machine — un contrôle (longueurs, doublons, montant, marque) est
la seule chose qui l'empêche de se dégrader au prochain portage. (d) Deux compteurs que les pages
contredisent elles-mêmes (badge « 22 AU PROGRAMME » contre « Vingt-trois » dans le chapeau du hub
Avis ; « 11 guides et 6 articles » contre 10 + 7 dans le build) : à corriger dans Claude Design, les
metas publiées n'affichent que ce qui est vérifiable.

## 13 septembre 2026 (fin de nuit, 2) — Le site est ouvert aux moteurs

Jordane : « On ouvre le SEO. C'est le moment. » Il notait au passage que **Screaming Frog
n'arrivait pas à analyser le site** — c'était bien ça : `robots.txt` valait `Disallow: /`, et
l'outil respecte `robots.txt` par défaut. Le crawl n'était pas cassé, il était interdit.

**Les trois gestes, faits ensemble** (un seul des trois ne rouvre rien) :

1. `<meta name="robots" content="noindex, nofollow">` retiré du gabarit de head de
   `scripts/port.mjs` (les 37 pages portées) et de `src/layouts/BaseLayout.astro` (les pages
   écrites à la main). Le portage n'a touché que cette ligne : 36 fichiers, −1 ligne chacun.
2. `public/robots.txt` réécrit : `Allow: /` et `Sitemap: https://bipbop.eu/sitemap.xml`. Le
   fichier garde en tête la trace des trois gestes — c'est la deuxième fois qu'on les cherche.
3. `node scripts/port.mjs && npm run build` relancé, puis `npm run check` (7/7) et
   `npm run fidelite` (37/37).

**La 404 garde son `noindex`, et c'est le seul écart assumé.** Elle n'a ni permalien ni place dans
le sitemap, Netlify la sert en statut 404 — mais son URL directe `/404.html` répond bien 200, et
sans meta elle resterait indexable. Elle est la seule page du `dist` publié à porter un `robots`.

**Ce que l'ouverture ne règle pas.** Rien ne dit à Google que le site est libre : la propriété
`bipbop.eu` reste à vérifier dans Search Console et `/sitemap.xml` à y soumettre. Et le site n'a
**aucune balise sociale** (`og:*` absent des maquettes comme du build, vérifié) — un lien BipBop
collé dans un message part sans titre, sans description, sans image. Ça se décide dans Claude
Design (il faudrait une image 1200 × 630), pas ici.

## 13 septembre 2026 (fin de nuit) — Deux sitemaps, un seul arbre

Jordane demande un sitemap XML pour les moteurs et un plan du site HTML accessible depuis le pied
de page, pour les lecteurs qui veulent comprendre comment le site est rangé. Les deux existent,
et **ils lisent le même fichier** : `src/lib/arborescence.mjs`.

**Ce qui est écrit.** `scripts/sitemap.mjs`, branché en `postbuild` : chaque `npm run build` pose
`dist/sitemap.xml`, 38 URL, dans l'ordre de lecture du plan du site. `src/pages/plan-du-site/`
(devient `/plan-du-site/`), deuxième page écrite à la main du dépôt après `/comparatif/`, qui
range les 37 autres en six sections avec un chapeau par section. Le lien du pied de page est une
**greffe** (`grefferPlanDuSite`) ajoutée aux 37 pages portées plus `Footer.astro`, parce qu'aucune
maquette Claude Design ne le contient.

**Rien n'est ressaisi, c'est le principe de la page.** Les routes viennent du plan éditorial, les
libellés du `<title>` publié de chaque page — un libellé tapé à la main dérive, un titre qui change
change la liste toute seule. Seule règle de retouche : les avis et les duels s'affichent sans leur
phrase (le titre publié de `Millenium MPS-150X Mesh : tous les fûts en mesh pour 298 €, où est le
piège ?` devient `Millenium MPS-150X Mesh`), les guides et les bases gardent leur question entière.

**Deux garde-fous qui font échouer plutôt que de taire.** Une ligne du plan marquée « Publié » sans
page correspondante dans `dist/` bloque le build : une URL morte dans un sitemap est le seul bug
qu'on ne voit jamais, personne ne clique sur un sitemap. Une page construite que le plan ne connait
pas est signalée et **non publiée** — AGENTS.md interdit de laisser paraitre un document interne
dans un sitemap, donc on n'y entre pas tout seul. Le `lastmod` vient du dernier commit du fichier
source, jamais de l'horloge : rebuild sans changement ne doit pas dire à Google que tout a bougé.
Sans dépôt git sous les pieds (build Netlify sur clone sans historique), la ligne saute et l'URL se
publie quand même.

**Trois effets de bord.** `BaseLayout` écrit maintenant un `<link rel="canonical">` — le comparatif
n'en avait aucun, et le canonical non-www est la règle du site. `public/robots.txt` porte en
commentaire les trois gestes de l'ouverture (noindex, robots, re-portage). Et `npm run fidelite`
compte toujours 37/37 : la page neuve est déclarée dans `SANS_MAQUETTE`, la greffe du pied de page
est rejouée sur la maquette avant comparaison.

**La ligne `Sitemap:` de robots.txt reste en commentaire, et c'est voulu.** Tant que `Disallow: /`
tient, la déclarer livrerait l'inventaire complet des URL à Google avant l'ouverture, sans même
qu'il puisse lire les `noindex` pour les écarter. Elle se décommente avec l'ouverture SEO
(§2 du plan de reprise), pas avant. Contrôle : `npm run check` → 7/7 sur 39 pages et 876 liens
internes, `npm run fidelite` → 37/37.

## 13 septembre 2026 (nuit) — Registre légal rempli, formulaire de contact réel, et leçon Netlify

Demande de Jordane en trois points : nommer le responsable de traitement, compléter les
sous-traitants, supprimer l'envoi d'e-mails (pas de mailing) ; retirer l'encart e-mail de la page
Contact ; faire marcher le formulaire, vers `contact@bipbop.eu`.

**Tout est passé par `scripts/greffes.mjs`, rien par les pages** : une page est régénérée à chaque
portage, une retouche manuelle y aurait tenu dix minutes. Trois greffes donc — `grefferLegal()` sur
les deux pages légales, `grefferContact()` sur Contact. Un champ `[en attente]` qui resterait
non renseigné **fait échouer le portage**, au lieu de se publier entre crochets comme hier.

**État légal publié maintenant** : responsable de traitement et directeur de publication « Jordane
Feuillet » ; hébergeur « Netlify, Inc. » ; mesure d'audience déclarée « Google Analytics — Google
Ireland Limited » ; ligne « Envoi des e-mails » retirée du tableau ; adresse postale, SIREN et TVA
non publiés, renvoyés à la page Contact. **Aucune adresse e-mail n'apparaît dans le HTML publié** (`grep contact@bipbop` → 0 dans `src/pages` comme dans `dist`) — la destination des soumissions se
règle dans Netlify, pas dans le code. Quatre phrases de la politique ont aussi été réalignées parce
que la décision « aucun lien affilié » les rendait fausses (elles affirmaient qu'un identifiant
d'affiliation part au clic).

**Choix assumé, à ne pas confondre avec un oubli** : la politique déclare Google Analytics alors
qu'**aucun outil de mesure n'est installé** — Jordane a tranché ainsi quand je le lui ai signalé.
Écrit dans l'en-tête du module, avec les deux choses à faire le jour de l'installation : brancher
le script derrière le consentement du bandeau, et aligner la durée (la page dit 25 mois, GA4
plafonne à 14). Le bandeau réclame donc aujourd'hui un accord pour une mesure qui n'existe pas.

**Le formulaire de la maquette était décoratif** : `<div>` en guise de champs, `<span>` en guise
d'options, un carré sans `input` pour le consentement, bouton `type="button"`. Remplacé par un
formulaire Netlify réel (prénom, e-mail, sujet en radios, message, consentement obligatoire,
honeypot), dans les styles du design ; les trois phrases d'exemple de la maquette sont devenues les
`placeholder`. Capture d'écran à l'appui, la pastille sélectionnée et la case cochée rendent comme
le design, et les 38 pages passent toujours la mesure à 390 px.

**Pourquoi ça ne marchait pas, deux causes, et une leçon.** (1) `[[redirects]] from="/*"
to="/404.html" status=404` dans `netlify.toml` attrapait le POST avant le gestionnaire de
formulaires : règle retirée, elle était inutile — Netlify sert `/404.html` par convention.
(2) La **détection de formulaires était désactivée** sur le site ; Jordane l'a activée, et **ça n'a
rien changé tant qu'un nouveau déploiement n'a pas eu lieu** — Netlify enregistre les formulaires à
la compilation, pas rétroactivement. Après le rebuild (`0f2aafc`) : `POST /contact/` → **200**, en
`cache-control: no-store` sans `etag`, alors que le même fichier en GET répond `public,max-age=0,
must-revalidate` + `etag` — c'est bien le service de formulaires qui répond, pas le statique.
**Leçon à garder : « déployé » et « enregistré » ne sont pas la même chose, et l'un ne prouve pas
l'autre.** Reste à saisir dans Netlify : Forms → Notifications → `contact@bipbop.eu`.

Deux soumissions de test sont dans Netlify (prénom « Test ») — à effacer si ça gêne. Sans
JavaScript, la page est rendue telle quelle sans confirmation : un `public/thank-you.html`
(à ajouter au `IGNORE` de `verif.mjs`, sinon sa navigation manquante fait échouer le contrôle)
couvrirait ce cas si on le demande.

---

## 13 septembre 2026 (nuit) — Les liens marchands partaient en commission chez quelqu'un d'autre

Jordane a repéré `?offid=1&affid=3711` dans une URL Thomann publiée. Ce n'était pas un détail de
plus : **ce tag appartient à un autre site de sa main**, et il donne la règle — *BipBop ne publie
aucun lien affilié pour le moment*. Le site n'a pas de programme d'affiliation ; chaque clic tagué
partait donc créditer l'autre compte.

**L'ampleur, mesurée dans la source :** 126 URLs `thomann.fr` sur `?offid=1&affid=3711` (un seul
identifiant partout), et les 12 liens Donner qui ne vont pas chez Donner mais sur la passerelle
shareasale `donnnermusic.sjv.io/c/6882776/3379894/43895`. Les Woodbrass étaient, elles, déjà
propre — la question ouverte n°5 du plan (« 22 URLs Woodbrass sans identifiant d'affiliation »)
n'a plus d'objet : c'est voulu, pour tous les marchands.

**Ce n'était pas dans les pages, c'était dans les maquettes.** Corriger les pages ne tenait pas un
portage. La règle est donc descendue dans la chaîne, en un seul endroit, `urlPublique()` dans
`scripts/greffes.mjs`, appliqué aux **deux** bouts : `port.mjs` (les 37 pages statiques) et
`import-data.mjs` (`src/data/`, donc le comparatif, qui construit ses liens au build). L'adresse
seule change, le texte du lien reste celui du design. La passerelle shareasale est **remplacée par
sa destination réelle**, lue dans son paramètre `u` : les liens Donner partent maintenant en direct
sur `fr.donnermusic.com/products/…`, chaque modèle avec son propre produit. Une passerelle qui ne
dit pas où elle mène ne se publie pas, le lien saute.

**Ordre important, et piégé :** la jointure de l'import se fait sur l'**URL brute**, parce que chez
Donner les six modèles ne se distinguent que par leur paramètre `prodsku` (c'est le corrigé de la
veille). Nettoyer avant la jointure aurait tout recalé. Le nettoyage se fait donc à l'écriture,
après.

**Un contrôle, pas une confiance :** `verif.mjs` a une famille 7, *LIENS AFFILIÉS*, qui balaie tout
le build — HTML, JS bundlé, JSON — et **fait échouer `npm run check`** si un `affid`, un `sjv.io`,
un `a_aid`, un `irclickid` ou un `utm_source|medium|campaign` survit où que ce soit. Le portage est
mécanique, le traçage l'est aussi dans l'autre sens : sans filet, une maquette ré-exportée ramène
les tags sans que personne ouvre un fichier.

**Mesure après fix :** 0 occurrence de `affid=` et 0 de `sjv.io` dans `src/pages`, `src/data` et
`dist` ; 135 liens nettoyés dans la base, 0 retiré ; production vérifiée en HTTP (`/`, `/avis/`,
`/guides/pack-complet/`, `/comparatif/`), propre et bien déployée. Les 52 URLs marchandes
répondent **200 propres comme taguées** — le balayage rapide donnait 46 × 429, c'est le plafond
anti-bot de Thomann, pas des liens morts ; vérifié en espaçant les requêtes.

---

## 13 septembre 2026 (soir) — On arrête de retaper les maquettes : elles sont portées par script

Jordane a arrêté la séance sur une question juste : *« Claude a mâché le travail, j'ai l'impression
que tu refais tout le travail déjà fait. »* Elle était exacte. Preuve dans les fichiers : une
maquette `.dc.html` fait ~350 lignes de HTML + CSS complets, dont un bloc `<!--responsive-->` qui
porte ses 34 à 39 crochets `data-*` ; une page Astro faisait 198 à 609 lignes de **cette même
maquette recopiée à la main**. La recopie introduisait des écarts (compteurs faux, crochets
oubliés, formules qui dérivent), et `scripts/fidelite.mjs` avait été écrit pour détecter ces
écarts. Les 9 commits « reproduire fidèlement les designs » sont tous là pour réparer une boucle
que notre méthode avait elle-même créée.

**Décision actée : portage mécanique, tout re-porter** — les 21 pages publiées compris. Le
comparatif (seule page dynamique, déjà portée avec le moteur DCLogic) et l'import des prix
restent tels quels.

**`scripts/port.mjs`** fait six choses, toutes triviales : il sort le `<helmet>` du `<body>` vers
le `<head>`, retire `<x-dc>` et `support.js`, garde les deux blocs `<style>` et le corps **mot pour
mot**, réécrit les ~10 liens `.dc.html` en permaliens (table `fichier_maquette → permalien` du plan
éditorial), remplace `assets/…` par `/…`, et pose les quatre choses que le design ne contient pas :
`description`, `canonical`, `robots` (phase de test), `lang`. Titre et description déjà rédigés sont
**repris de la page Astro existante** avant qu'elle soit déplacée dans `design/port-seche/` ; pour
une page neuve, ils sont **cités** de la maquette (`<h1>`, première phrase du chapeau), jamais
rédigés. `--dry` rend sans écrire.

**Résultat mesuré, en une exécution :** 38 pages au build (contre 21). Contrôle de fidélité :
**36 pages sur 37 strictement identiques à leur maquette**, la seule exception étant les 4 prix
corrigés ci-dessous. `npm run check` : **responsive vert sur les 38 pages** — les 8 qui débordaient
à 390 px sont réglées parce que le bloc responsive est copié, pas reproduit ; 773 liens internes,
0 cassé ; navigation identique sur les 38 ; aucun chiffre interne qui fuit. **12 problèmes → 3.**

**La catégorie « 15 pages à resynchroniser » du plan disparaît** : elle n'existait que parce
qu'on réécrivait les pages à la main.

**`design/port-corrections.json`** — les corrections de données ne se font plus dans la page
(générée, donc écrasée au portage suivant) : 4 entrées, chacune avec sa raison. Le portage échoue
exprès si le texte d'origine n'est plus trouvé, ce qui signale que Claude Design a bougé.
Millenium HD-120 198 → **219 €** (aucun catalogue ne donnait 198), Alesis Nitro Pro 599 → **698 €**
(599 € est le prix de la Nitro Max), Donner DED-300X 699,99 → **539,99 €**, Yamaha DTX6K2-X
1 199 → **1 198 €** (la source est à 1198).

**Deux outils corrigés, pas réécrits** : `fidelite.mjs` cherchait un `<main>` que les maquettes
n'ont pas et comptait le menu comme du contenu ajouté — la borne d'en-tête est maintenant
symétrique ; `verif.mjs` détectait la navigation sur la première occurrence de `data-nav`, qui est
un sélecteur CSS dans les pages portées — il ne retient que l'attribut.

**Reste 3 problèmes, tous sur le hub `/avis/`, et tous éditoriaux** : la maquette annonce « 23 au
programme » avec une liste d'attente de **14 lignes**, là où la base compte **22 modèles sans avis**.
Compléter, c'est publier les 8 phrases que j'ai rédigées dans `design/hub-avis-liste-attente.md` —
ma plume, pas celle de Claude Design, donc à trancher par Jordane. Voir le plan.

**Tranché dans la foulée, même séance — Jordane : publier les 22, avec les phrases rédigées.** Le
tableau « en préparation » du hub ne se corrige plus ligne par ligne, il se **construit** :
`design/liste-attente-avis.csv` porte 22 fois `cle ; libellé affiché ; phrase`, et
`scripts/greffes.mjs` régénère les lignes avec le balisage de la maquette, **prix et segment lus
dans `src/data/modeles.json`**. Le badge devient « 9 AVIS PUBLIÉS · 22 AU PROGRAMME » et
l'intitulé « Les 22 avis en préparation », calculés depuis la base. Les 14 lignes du design
restent dans leur ordre et mot pour mot ; les 8 rédigées se placent en fin de segment.
Conséquence heureuse : **les 4 corrections de prix deviennent inutiles** (le tableau sort de la
source) et sortent de `port-corrections.json`, qui se retrouve vide mais gardé comme mécanisme —
avec une règle neuve, une correction doit trouver **exactement une** occurrence (« 198 € » mordait
sur « 1 198 € », et l'aurait changé en « 1 219 € » sans que personne le voie).

La greffe vit dans un module **partagé** avec le contrôle de fidélité : `fidelite.mjs` applique les
mêmes greffes à la maquette avant de comparer, pour qu'un écart déclaré ne compte pas comme une
dérive. Elle échoue si la base gagne un 23ᵉ modèle sans avis que le CSV ne cite pas : le hub ne
peut plus devenir faux silencieusement.

**Les deux contrôles sont au vert.** `npm run check` : 6/6, 0 problème sur 38 pages.
`npm run fidelite` : **37/37 pages reproduisent leur maquette au segment près**. Une limite à dire
clairement : le portage n'est **rejouable** que si `design/port-seche/` est là (il est hors dépôt) ou
si la page existe déjà, pour retrouver les titres et descriptions SEO rédigés à la main. Sans l'un
ni l'autre, `port.mjs` les cite dans la maquette — ce qui s'est produit au deuxième portage de la
soirée et a été réparé depuis (`copySeo` lit maintenant le `<head>` des pages déjà portées).

**Une page sur deux n'a pas encore son titre relu** : les 17 pages neuves portent un titre **copié
de leur `<h1>`** et une description **copiée de leur chapeau** — corrects, mais jamais relus par
Jordane. La liste se lit dans les avertissements de `node scripts/port.mjs`.

**Ce que le portage laisse en suspens, à surveiller :** les pages portées sont verbatim, donc
(a) la faute « au lieu d une » de la DED-200X est réapparue telle que la maquette l'écrit — à
corriger dans Claude Design, ou en une entrée `port-corrections.json` si tu préfères qu'elle tienne
ici ; (b) les prix des pages statiques autres que le hub sont ceux de la maquette, plus ceux de
`modeles.json` (le hub, lui, sort de la base) ; (c) `Header.astro`/`Footer.astro`/`BaseLayout` ne
servent plus qu'au comparatif.

**Le site est toujours en phase de test** : `noindex, nofollow` sur les 38 routes, `robots.txt`
bloquant. Les deux contrôles étant au vert, l'ouverture aux moteurs n'attend plus que la main de
Jordane — deux endroits à changer ensemble, `scripts/port.mjs` et `src/layouts/BaseLayout.astro`.

## 13 septembre 2026 (fin de soirée) — Le site en ligne n'était pas le site déployé

Pour la revue, merge `dev` → `main` et push. Rien ne change en ligne. Test HTTP sur une route neuve
(`/guides/pack-complet/` → 404) alors que `origin/main` la contient, et zéro crochet `data-*` sur
`/` : **la production datait d'avant la chaîne de données**. Cause : `prebuild` enchaîne sur
`import-data.mjs`, qui ouvrait `../Claude Design - MàJ/data/selection-accessoires.csv` sans tester
son existence. Le dossier n'est pas dans le dépôt, donc pas sur Netlify → `ENOENT` → build en
échec → Netlify ressert son dernier succès, sans que rien le signale à un visiteur.
`import-data.mjs` calcule maintenant : source absente → `src/data/` reste tel que committé, le build
continue ; `avis.json` se recalcule quand même, puisqu'il ne dépend que des pages publiées ici.

**Deux bugs du même genre, silencieux, trouvés en chemin :** `import-data.mjs` reconnaissait les
avis publiés en cherchant `index.astro`, alors que les pages portées sont des `index.html` — la
liste était revenue à `[]`, ce qui éteint les liens « L'avis → » du comparatif sans changer l'aspect
d'une page. Et `npm run check` ne pouvait pas le voir : il lisait le nombre d'avis dans la base, pas
sur le disque. Les deux lisent maintenant les deux formats, et `verif.mjs` compare `avis.json` aux
dossiers réels. Après fix : **38 routes en 200 sur bipbop.eu**, hub à « 9 AVIS PUBLIÉS · 22 AU
PROGRAMME ». **Retenir : `git log` ne prouve rien, une requête HTTP prouve.**

---

## 13 septembre 2026 — Pause de session : où on en est, comment reprendre

Objectif acté en fin de session par Jordane : **publier la totalité des 38 pages de site désignées
par Claude Design**. L'inventaire complet, l'ordre à tenir et les 5 questions ouvertes tiennent
dans **`design/plan-de-reprise.md`** — c'est le fichier à ouvrir en premier à la reprise.

**Avancée : 21 pages en ligne sur 38, dont 6 identiques à leur maquette au segment près**
(les 6 avis de la vague A). 17 à créer, 15 existantes à resynchroniser.

**Ajouté à l'outillage pendant la session**, tout est rejouable :

- `npm run check` — build + les 6 contrôles de l'`Aide-Memoire` §06 mesurés dans Chrome réel
  (liens, compteurs, prix, navigation, largeur de défilement à 1024/900/768/390, et un 6ᵉ
  contrôle ajouté ici : aucune note interne dans le bundle) ;
- `npm run fidelite [route]` — comparaison segment à segment entre chaque page et sa maquette.
  C'est l'outil qui manque aux 6 contrôles pour voir une section supprimée ou réécrite ;
- `npm run data` — réimporte la base depuis le dossier Claude Design, et régénère la liste des
  avis réellement publiés (le comparatif s'y cale, il ne peut plus promettre une page vide) ;
- `node scripts/captures.mjs <route>` — rend la page dans Chrome à trois largeurs, pour
  l'essai visuel que le brief réclame en plus des mesures.

**Arbitrages pris pendant la session**, tous motivés dans `design/ecarts-maquettes.md` :

- empreinte au sol relevée chez le marchand plutôt que la largeur de rack notée par le design
  (12 modèles sourcés, 10 valeurs corrigées, 19 sans donnée → aucun chiffre affiché) ;
- Woodbrass sans tag d'affiliation : hors périmètre, porté tel quel ;
- pas de gabarit commun pour les avis : les six maquettes ont six designs réellement différents,
  la MPS-850 l'a prouvé avec son tableau à cinq colonnes et ses vignettes ;
- les fautes et contradictions des maquettes sont **reproduites puis signalées**, jamais
  corrigées en silence — c'est ce qui garantit qu'on puisse les corriger à la source.

**Clos dans la session** : socle responsive centralisé, chaîne de données, comparatif interactif
porté et vérifié dans le navigateur, vague A complète (6 avis).

**Reste ouvert, à trancher par Jordane** : la grille de notation des avis (règle I02), la
définition de l'empreinte au sol (avec ou sans siège), une apostrophe manquante dans la DED-200X,
la priorité des deux lignes du plan que j'ai reconstruites.

### Déploiement
Commit et push sur `dev`, puis merge `dev` → `main` pour la revue en ligne, selon la convention
des fins de session. **Le site reste en phase de test** : `noindex, nofollow` sur les 38 routes et
`robots.txt` bloquant en place — le merge ne l'expose donc pas dans les résultats de recherche.
À retirer seulement quand les 38 pages sont publiées et que `check` et `fidelite` sortent au vert.

## 13 septembre 2026 — Vague A, page 1 : la méthode change pour les cinq suivantes

Reprise de `/comparatif/` terminée (voir l'entrée précédente). Ouverture de la vague A, les
six avis qui manquent au hub et au comparatif.

**Outil ajouté d'abord : `scripts/fidelite.mjs`** (`npm run fidelite`). Les six contrôles de
l'`Aide-Memoire` portent sur les liens, les compteurs, les prix, la navigation et la largeur :
**aucun ne voit une section supprimée ou réécrite**, alors que c'est le défaut qui a coûté cher
en septembre sur « À propos ». L'outil compare segment à segment le texte du contenu de la
maquette et celui de la page, et signale ce qui manque, ce qui s'ajoute, ce qui est déplacé.

Il a trouvé sur-le-champ trois divergences entre l'ancienne et la nouvelle maquette, sur des
pages pourtant passées par la campagne de fidélité :

- `/les-bases/pad-mesh/` : « **Douze** modèles passés en revue » côté site, « **Neuf** » côté
  maquette actuelle ;
- `/guides/batterie-appartement/` : la plaque de mousse passe de **25 € à 55 €** et de
  « si plancher sensible » à « si étage » ;
- les trois avis publiés : l'encart « aller au comparatif » a changé de libellé et de phrase.

À traiter dans la resynchronisation, pas ici.

**Page livrée : `/avis/alesis-turbo-mesh/`** (`Avis-Alesis-Turbo-Mesh.dc.html`). Fidélité 100 %
au segment près, aucun ajout ni déplacement. Responsive mesuré dans Chrome à 1024/900/768/390 :
aucun débordement, la fiche technique s'empile à 620 px avec ses cellules d'en-tête retirées,
le tableau de concurrence à 4 colonnes défile au lieu de s'écraser. Prix, compteurs, navigation
et notes internes au vert.

**Ce que la page a révélé de la famille.** Les neuf avis ont **la charpente identique au crochet
près** : mêmes cinq `h2` dans le même ordre (« À qui elle s'adresse », « La fiche technique,
traduite », « Est-ce que les voisins vont entendre ? », « Le vrai budget… », « Face à la
concurrence »), et les mêmes compteurs de crochets (`sp`, `sp2`, `c3`, `def`, `tbl`, `tblrow`,
`sticky`, `big=a→d`). Seules trois divergences structurelles, toutes expliquées :

| Page | Écart | Cause |
|---|---|---|
| `Avis-Donner-DED-200X` | `rwd=def` compte 1 au lieu de 3 | son bloc responsive est amputé (déjà relevé dans `design/ecarts-maquettes.md`) |
| `Avis-Millenium-MPS-750X`, `…-MPS-850` | `tblrow` 9 au lieu de 8 | tableau de concurrence à cinq modèles, pas quatre |

**Conséquence de méthode pour les cinq restantes** : la charpente étant fixe, un gabarit
`Avis.astro` piloté par le contenu de chaque page est plus sûr que cinq transcriptions
manuelles — chaque page est ensuite tenue au contrôle de fidélité contre **sa** maquette, donc
la garantie n'est pas relâchée. Les paragraphes, lignes de fiche, cartes d'accessoires et lignes
de tableau restent des données, pas du HTML recopié à la main.

**Ordre de publication imposé par les liens**, pas par moi : la Turbo Mesh lie
`/avis/millenium-mps-450/`, que le contrôle de liens signale comme manquante. Donc **MPS-450
ensuite**, puis DED-200X, MPS-750X, MPS-850, DTX432K. Le hub Avis, ses compteurs et sa liste
d'attente se mettent à jour **en fin de vague**, une fois les six pages publiées — l'`Aide-Memoire`
§01 les exige complètes, pas nécessairement page par page.

**Question éditoriale ouverte, non résolue par nous** : la note « 7,2/10 » s'affiche sur la
Turbo Mesh comme sur les huit autres avis, et **aucune grille n'existe nulle part dans les
46 fichiers** — le hub répète « Note de 8,4 sur 10 » sans jamais dire ce que couvre le score.
La règle I02 (« aucune note chiffrée sans grille explicitée ») est donc en défaut sur toute la
famille. C'est la même classe de problème que les échelles `discretion` et `module` de
`modeles.json`, déjà notée. **À fournir par le design** : une note inventée par nous serait
publiée comme une méthode de test que nous n'avons pas.

## 13 septembre 2026 — Reprise sur « Claude Design - MàJ » : socle responsive, données, comparatif interactif

### Contexte
Jordane livre un nouveau dossier de conception, `Claude Design - MàJ/` : 46 maquettes (38 pages de
site + 8 documents internes, dont 3 écrits pour l'agent), une base produits et le comparatif
enfin dynamique. Il demande d'abord une analyse du dossier, puis lance la reprise sur le périmètre
**phases 0 + 1 + 2** : réparer la source, poser le socle, livrer le comparatif.

### Analyse préalable
Le dossier a été audité avec ses propres outils : les 5 contrôles de fin de séance de l'`Aide-Memoire`
§06 ont été passés au crible des 46 maquettes. Résultat : le dossier échoue à ses propres tests, et
les constats sont consignés dans `design/ecarts-maquettes.md`. Les deux plus lourds :

- **4 prix** de la liste d'attente du hub Avis contredisaient la source (dont Donner DED-300X à
  699,99 € au lieu de 539,99 €) — et les flux livrés dans `uploads/` ont permis de trancher sans
  sortir du dossier ;
- **`Avis-Donner-DED-200X.dc.html`** a un bloc responsive amputé (deux `!important` perdus, tout le
  palier 620 px de `data-rwd="def"` absent), et le bloc « à recopier tel quel » du `Brief-Responsive`
  §03 **n'est pas celui qui est livré** : il lui manque la sonde `html{--rwd:on}` que le §05 utilise
  pour vérifier que le bloc est actif.

### Ce qui a été fait

**Phase 0 — la source, pas les maquettes.** Corrigé dans `Claude Design - MàJ/data/` (qui est la
source de vérité, contrairement aux pages) : `modeles.json` passe en **version 2** avec l'empreinte
au sol réellement relevée chez Thomann et la valeur d'origine conservée sous `largeur_maquette` ;
les 2 lignes décalées de `plan-editorial.csv` sont reconstruites. Les `.dc.html` ne sont **pas**
modifiés — un export ultérieur de Claude Design les écraserait ; les 4 prix et les compteurs faux
sont donc traités côté implémentation et tracés dans le registre d'écarts.

**Phase 1 — le socle.**
- `src/styles/responsive.css` : les 3 paliers, en **un seul exemplaire**, importé par `BaseLayout`.
  Équivalence avec le bloc des 42 pages saines prouvée règle par règle (34 règles, ensembles identiques).
- Décision d'architecture : les 15 pages existantes sont en classes + variables, les maquettes en
  styles en ligne. **Les deux sont compatibles** avec les crochets (sélecteurs d'attributs +
  `!important`) : aucune conversion en inline, ce qui économisait un tiers du chantier.
- `scripts/import-data.mjs` : importe les 31 modèles, 126 accessoires et 64 entrées du plan.
  La jointure base ↔ sélection ne peut pas se faire par nom (14 libellés divergents, aucun id
  commun) : elle se fait par **URL produit**. 9 routes d'avis réécrites de `.dc.html` vers la route
  publique, via la colonne `permalien` du plan.
- `scripts/verif.mjs` : les 5 contrôles de l'`Aide-Memoire` §06 + la procédure `Brief-Responsive` §05,
  mesurés dans Chrome réel à 1024/900/768/390 px. `npm run check`. Un **6ᵉ contrôle** a été ajouté,
  que les maquettes ne prévoient pas : aucune note interne (`role_editorial`, `largeur_maquette`,
  rôles éditoriaux) ne doit se retrouver dans le build — le JavaScript Astro est bundlé puis
  téléchargé, donc une colonne interne importée dans un composant est publiée même si elle
  ne s'affiche jamais. Le vérificateur fouille `dist/` (HTML, JS, CSS, JSON, maps) sur ce point.
  Sensibilité vérifiée en le faisant tourner sur les maquettes : il y retrouve exactement les
  4 prix litigieux et le compteur 23/22, sans bruit parasite.
- `Header.astro` : crochets `data-pad data-hdr` / `data-nav`, CTA « Par où commencer ? » réservé au
  comparatif (37 pages sur 38 ont « Trouver ma batterie »), et cibles tactiles ≥ 44 px sous 860 px —
  le point que le brief laisse à la charge de l'intégration.
- `AGENTS.md` et `README.md` réécrits. Le README annonçait **Astro 5** : le projet est sous
  **Astro 7.3.2** (`package.json` et `node_modules` concordent). Il pointait aussi vers l'ancien
  dossier de design, et sa table de correspondance manuelle est remplacée par la table du plan.

**Phase 2 — le comparatif interactif.** Il fonctionne.
- `src/lib/comparatif.mjs` : portage de la classe `DCLogic` de la maquette. Les poids du score,
  les seuils et les formulations ne bougent pas — ils codent 7 règles de métier du design.
  Le `DCLogic` et les balises `sc-for`/`sc-if` ne tournent pas hors du moteur de conception :
  c'était une spécification de comportement, pas du code à copier.
- `src/lib/comparatif-ui.mjs` : un seul exemplaire du balisage, partagé par le rendu au build et
  par le navigateur. Ce qui s'affiche avant exécution du JS est ce que le JS afficherait.
- `src/pages/comparatif/index.astro` : état par défaut rendu **au build** (la page se lit et se
  référence sans JavaScript), puis hydraté. Statut dans l'URL `?b=&p=&u=`, rechargeable et partageable.
- Vérifié dans Chrome (`scripts/test-comparatif-nav.mjs`) : clics, `aria-pressed`, URL, « Recommencer »,
  rechargement à froid depuis une URL partagée, rendu sans JS. Les 27 combinaisons de réponses sont
  calculées et lisibles (`scripts/test-comparatif.mjs`).
- `src/lib/avis-livres.mjs` : le moteur ne lie un avis que si la page existe vraiment. La base en
  déclare 9, le site en publie 3 ; sans ça, le comparatif mettait 6 liens morts en ligne.

### Arbitrages pris

1. **Empreinte au sol** (demandé à Jordane, réponse : relevé marchand). 12 modèles sur 31 ont une
   « Surface au sol requise » dans le flux Thomann ; **10 des 12 contredisaient la base**, qui notait
   la largeur du rack et non l'encombrement. Les 19 autres n'ont **rien** dans les trois flux, y
   compris la Nitro Max : pour eux **aucun chiffre n'est affiché**, la carte montre les cymbales à la
   place, et le classement interne utilise la médiane des modèles relevés (120 cm) pour que l'absence
   de donnée ne favorise ni ne pénalise. Ce chiffre ne se voit jamais.
   **Effet mesuré** : 1er choix changé dans 3 cas sur 27, trio modifié dans 11. Dont l'état par défaut,
   qui passait de la Roland TD-02KV à la **Nitro Max** — donc rejoignait enfin le rôle éditorial que
   `selection-modeles.csv` lui attribue (« recommandation principale »). Avant correction, le moteur
   du comparatif contredisait le reste du site.
2. **Woodbrass** : 22 des 157 références (14 %) n'ont **aucun identifiant d'affiliation**. Décision :
   hors périmètre, porté tel quel, tracé ici et dans le registre.
3. **Corriger la source mais pas les maquettes** : voir phase 0.
4. `priorite` = « Moyenne » sur les deux lignes du plan reconstruites est **une supposition**, à
   confirmer par Jordane. Le champ est interne et ne se publie pas.

### État des contrôles à la fin de la session

`npm run check` sur les 16 pages actuelles : **liens au vert, prix au vert, navigation au vert**
sur les 15 pages Astro. Restent 3 compteurs faux sur `/avis/` (il annonce 3 avis publiés là où la
base en dit 9) et 8 pages qui dépassent encore à 390 px — **les deux sont attendus** : ce sont
précisément les pages à resynchroniser, avec leurs crochets `data-*`. `/comparatif/` passe les
quatre largeurs. Le 404 est un fichier HTML brut hors `BaseLayout` (pas de `data-nav`, 557 px à
390 px) : il repart dans la vague D.

### Ce qui reste à faire

- **Cibles tactiles** : `scripts/captures.mjs` en décompte **28 sous 44 px** sur `/comparatif/`
  (minimum 16 px) à 1200 px, 21 à 390 px. Seuls les liens de l'en-tête ont été traités. Les
  liens du pied de page, les intitulés de chiffres mono et les liens « L'avis → » des cartes sont
  les plus exposés. Le `Brief-Responsive` §06 laisse ce point à l'intégration : il est **à faire
  sur les 38 pages**, pas seulement sur l'en-tête.
- **Vague A** : 6 avis (`/avis/alesis-turbo-mesh`, `donner-ded-200x`, `millenium-mps-450`,
  `millenium-mps-750x`, `millenium-mps-850`, `yamaha-dtx432k`) — débloque les compteurs du hub Avis
  et les 6 liens que le comparatif attend.
- **Vague B** : 8 guides. **Vague C** : 6 « Les bases » + 2 duels. **Vague D** : 404 + hubs et
  Accueil avec les compteurs finaux.
- **Resync des 14 pages restantes** : crochets `data-*` + corrections de copy. Le delta est faible
  par page (bloc responsive, kit mascotte, bandeau cookies) mais touche 14 fichiers.
- **Grille des notes** : `discretion` et `module` sont des échelles 2→5 entrant dans le score,
  publiées sans grille. La règle I02 (« aucune note chiffrée sans grille explicitée ») l'exige —
  à arbitrer avec le design, probablement dans `Design-System` et sur `/comparatif/`.

### Pause de session
Phases 0, 1 et 2 terminées et vérifiées. Commit sur `dev`, poussé. **Pas de merge sur `main`** :
Netlify build à chaque push et la reprise n'est qu'à un tiers. Prochaine session : vague A.

## 13 septembre 2026 — Comparatif : diagnostic des filtres inactifs (aucune modification de code)

### Contexte
Jordane signale que les filtres de `https://bipbop.eu/comparatif/` ne fonctionnent pas et demande si c'est normal, quel serait le plan d'activation et ce que ça coûterait. Session purement analytique : lecture de code et de données, chiffrage. **Aucun fichier du site n'a été modifié.**

### Diagnostic — oui, c'est normal
La page est une maquette statique du Lot 1, pas une fonctionnalité cassée.

- Zéro `<script>` dans tout `src/`. Les 9 boutons `.filtre-option` portent une classe `selected` codée en dur dans `src/pages/comparatif/index.astro`.
- Les résultats sont écrits à la main (Nitro Max + DED-200X), d'où le compteur « 2 modèles sur 31 » figé.
- `Comparatif.dc.html` est lui aussi statique (uniquement `support.js` et un bloc meta) : Claude Design n'a jamais spécifié de comportement, donc la règle de fidélité au design ne bloque pas l'ajout de JavaScript.
- La page n'a aucun `@media`, alors que 9 autres pages du site en ont un. Grille de filtres figée à 3 colonnes, résultats figés à `1.35fr 1fr`.

### État des données
- `Formulaire de périmètre et données/data/selection-modeles.csv` contient **30** modèles (la page en annonce 31), avec seulement : segment, marque, modèle, prix, marchand, rôle, URL. Pas d'image, pas de specs, pas de texte éditorial.
- Dérivable des catalogues locaux (`Archives/`) : le segment prix, la présence de peaux maillées et du Bluetooth. Les 20 modèles Thomann de la sélection y sont tous, avec des descriptions de 540 à 1 900 caractères.
- **Non dérivable : l'encombrement.** Aucune description des catalogues locaux ne contient de dimensions. Le filtre « Tu la mets où ? » exige donc soit de consulter les 30 fiches produit en ligne, soit d'accepter un critère approché.
- Le tag « 1,10 m de large » affiché sur la Nitro Max n'est sourcé nulle part : il vient du design, il est à vérifier.

### Trois options chiffrées
Base tarifaire vérifiée sur la grille officielle Alibaba Cloud Model Studio (qwen3.7-plus, région International, palier ≤ 256K) et le taux BCE du 10/09/2026. Hypothèse : ~85 % des tokens d'entrée servis par le cache.

| Option | Périmètre | Tokens cumulés | Coût avec cache | Plafond sans cache |
|---|---|---|---|---|
| 1 | Filtre budget seul actif, filtres 2 et 3 neutralisés | 0,6 – 1,2 M | 0,09 – 0,16 € | 0,22 – 0,44 € |
| 2 | Trois filtres, encombrement approché depuis les catalogues locaux | 2 – 3,5 M | 0,28 – 0,48 € | 0,73 – 1,28 € |
| 3 | Trois filtres, encombrement vérifié sur les 30 fiches en ligne | 4 – 7 M | 0,52 – 0,89 € | 1,44 – 2,50 € |

Les 30 consultations de fiches produit de l'option 3 pèsent 150 à 450 k tokens de lecture, soit 0,05 à 0,15 €. C'est du volume, pas de l'argent : l'écart entre les options se compte en euros. Le vrai critère de choix est le risque éditorial d'afficher des encombrements non vérifiés. Recommandation : option 1 puis option 2.

Ces chiffres sont un plancher. L'audit de 44 fichiers mené auparavant avait coûté ~25 $ avec 7 agents, bien au-dessus de ce que ce barème donnerait à volume équivalent — prévoir 3 à 5× par prudence.

### Arbitrages en attente de Jordane
- Le mapping exact des filtres « Tu la mets où ? » et « Tu veux faire quoi ? » vers des attributs produit réels. Ces deux filtres sont des questions marketing sans règle de correspondance définie.
- Un modèle sans avis rédigé a-t-il droit à une carte complète ou à une simple mention ?

### Ce qui rend ce plan en partie caduc
Le 13 septembre, Jordane annonce avoir utilisé Claude Design pour corriger plusieurs choses, **ajouter le JavaScript** et optimiser la version mobile du site, et vouloir incorporer tout ça. Rien n'était encore déposé dans le dépôt à la clôture de cette session (working tree propre, aucun fichier modifié depuis le 11 au soir).

Conséquence : ne pas réimplémenter la logique de filtrage ni le responsive depuis zéro. Récupérer et lire d'abord les nouveaux fichiers `.dc.html`, puis intégrer. Seuls le jeu de données (images, specs, phrases BipBop pour 30 modèles) et la question de l'encombrement restent valables quel que soit le code livré.

### Pause de session
Entrée de journal commitée sur `dev`. **Non mergée sur `main`** : la modification est purement documentaire, il n'y a rien à voir en ligne, et un push sur `main` déclencherait un build Netlify pour rien. Le chantier comparatif reste en attente des fichiers Claude Design de Jordane.

---

## 11 septembre 2026 — Chantier mascotte, passe 1 : le kit de marque en place

### Contexte
Brief-Mascotte.dc.html lancé le 11 septembre. Trois croquis de direction dessinés (design/mascotte/croquis/), puis Jordane partage Assets-Mascotte.dc.html : le kit de marque officiel qui fixe le personnage, les six fichiers SVG et leurs neuf emplacements. Les croquis deviennent sans objet, le kit arbitre.

### Ce qui a été fait
- Six fichiers SVG recopiés à la géométrie exacte du kit dans `public/` : bipbop-mascotte, bipbop-avatar, bipbop-tete, bipbop-mono, bipbop-marque, bipbop-marque-claire. Contour porté par le groupe racine (encre, épaisseur 10/11/6), aucun attribut id.
- Six composants Astro dans `src/components/mascotte/` : le kit impose l'inclusion en ligne dans le HTML, pas de balise image.
- Emplacements branchés : en-tête 34 px (marque), pied de page 32 px (marque claire), favicon SVG + apple-touch-icon PNG 180 px généré, signature d'article 44 px (avatar), encart « BipBop dit » 52 px bordure jaune, hero accueil 96 px, comparatif 76 px, À propos rectangle 120 × 152 (corps entier), 404 rectangle 200 × 250 avec ombre dure et bulle, bandeau contact en version claire.
- favicon.ico régénéré à la marque (c'était encore le logo Astro).
- Anciens fichiers mascotte-*.svg et favicon.svg supprimés, plus aucune référence.
- `design/mascotte/mascotte-usages.csv` : le tableau des emplacements. Le kit annonçait data/mascotte-usages.csv mais le fichier n'a pas été livré ; reconstruit depuis la section 02 du kit.

### Arbitrages à revoyer par Jordane
- À propos et 404 : les maquettes .dc.html montrent un cercle placeholder, le kit impose un rectangle arrondi (le personnage est plus haut que large). Suivi le kit.
- Encart « BipBop dit » : bordure jaune (maquette) sur fond jaune (kit), les deux sources divergeaient sur le fond.
- Le comparatif fait dire à BipBop « Je teste des batteries toute la journée » : contraire au brief (il collecte, il ne teste pas). Copie hors périmètre de cette passe, signalé, non modifiée.

### Reste à produire (passe 2)
- Les quatre poses : perplexe (404), approbatrice (badge « notre choix »), au travail (À propos), en train de parler (encart). En attendant, la pose neutre occupe ces emplacements, sans simulation par rotation ou déformation (règle 04 du kit).
- Les règles d'usage (taille minimale, zone de protection, fonds autorisés et interdits).
- L'image de partage 1200 × 630.

### Pause de session
Passe 1 commitée sur `dev`, mergée sur `main` et déployée le 11 septembre 2026 pour revue. La passe 2 reprendra dans une prochaine session : tout le contexte nécessaire est dans cette entrée, dans `design/mascotte/mascotte-usages.csv` et dans les deux fichiers Claude Design (`Brief-Mascotte.dc.html`, `Assets-Mascotte.dc.html` à la racine du projet).

---

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

---

## 11 septembre 2026 — Audit de fidélité au design Claude Design

### Problème
La page "À propos" publiée ne correspondait pas au design Claude Design — elle avait été simplifiée/réécrite au lieu d'être reproduite fidèlement. Jordane a demandé un audit complet de toutes les pages.

### Règle mise en place
**Règle absolue** : les fichiers `Formulaire de périmètre et données/*.dc.html` sont la source de vérité unique. Ne JAMAIS simplifier, résumer ou réinventer le contenu. Documentée dans le README.md et en mémoire.

### Audit complet — 16 pages vérifiées par lots de 2

| Lot | Pages | Résultat |
|---|---|---|
| 1 | Accueil, Comparatif | ✅ Déjà conformes |
| 2 | Hub Avis, Avis Nitro Max | Hub Avis ❌ → corrigé. Avis Nitro Max ✅ |
| 3 | Avis MPS-150X, Avis TD-02KV | ❌ Les deux → corrigés (contenu inventé, sections absentes, notes wrong) |
| 4 | Hub Guides, Guide Appartement | ❌ Les deux → corrigés (structure, images, FAQ, budget, checklist absents) |
| 5 | Guide Moins 500 €, Duel | ❌ Les deux → corrigés (tableaux, sections, sidebar absents) |
| 6 | Les Bases Pad Mesh, Contact | ❌ Les deux → corrigés (encarts, tableaux, formulaire, sidebar absents) |
| 7 | Mentions Légales, Politique Confidentialité | ❌ Les deux → corrigés (tableaux, sections, encarts absents) |
| 8 | 404 | ❌ Manquante → créée (404 géant, mascotte, pages utiles) |

### Résultat
- **13 pages réécrites** pour reproduire fidèlement les designs Claude Design
- **1 page créée** (404)
- **2 pages déjà conformes** (Accueil, Comparatif)
- **1 page déjà conforme** (Avis Nitro Max)
- Merge sur `main`, déployé sur Netlify

---

## À faire ensuite (Lot 2 — 4-8 semaines)

### Pages restantes du plan éditorial (38 pages)
- Guide < 300 €
- Guide < 1 000 €
- Guide enfant 6-12 ans
- Guide adulte qui débute
- Pack complet prêt à jouer
- Mesh vs caoutchouc
- Électronique vs acoustique
- Acheter d'occasion
- Avis Yamaha DTX432K
- Avis Donner DED-200X
- Avis Millenium MPS-450
- Avis Millenium MPS-750X
- Avis Millenium MPS-1000
- Avis Alesis Nitro Pro
- Avis Alesis Nitro Ultimate
- Avis Alesis Turbo Mesh
- Avis Yamaha DTX402K
- Avis Roland TD-02K
- Avis Nux DM-110
- Avis Woodbrass DDX50-Mesh
- Duel Nitro Max vs TD-02KV
- Duel MPS-150X vs Turbo Mesh
- Hub duels
- Hub les bases
- Casque pour batterie électronique
- Tapis de batterie
- Siège de batterie
- Baguettes pour débutants
- Brancher sa batterie à un PC
- Enregistrer sa batterie
- Choisir ses premiers cours
- Batterie pour gaucher
- Entretenir sa batterie électronique
- Comparatif complet (tous les modèles)
- Page sélection produits
- Guide du projet
- Design system (page publique)
- Brief mascotte

### Retraits du noindex
Quand le site est prêt pour le SEO :
1. Retirer `<meta name="robots" content="noindex, nofollow">` de BaseLayout.astro **et** du gabarit
   de head dans `scripts/port.mjs` (les 37 pages portées), puis relancer `node scripts/port.mjs`
2. Remplacer public/robots.txt par :
   ```
   User-agent: *
   Allow: /
   Sitemap: https://bipbop.eu/sitemap.xml
   ```
3. ~~Générer un sitemap~~ — fait : `scripts/sitemap.mjs` écrit `dist/sitemap.xml` à chaque build,
   et `/plan-du-site/` le reprend pour les lecteurs (entrée du 13 septembre, fin de nuit)

### Champs à compléter avant publication SEO
- Mentions légales : adresse postale, SIREN, TVA, email (surlignés en jaune dans le design)
- Politique confidentialité : nom raison sociale, email, hébergeur, outil analytics (surlignés en jaune)
