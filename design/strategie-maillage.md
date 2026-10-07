# Stratégie de maillage : cinq pages réceptrices

Décidée le 07/10/2026 (Jordane : « une stratégie de maillage interne qui privilégie quelques pages
stratégiques réceptrices de liens »). Toute page neuve, et toute repasse de maillage, s'y réfère.

## Pourquoi cinq pages et pas toutes

Un site de 50 pages sans liens externes n'a qu'une autorité à distribuer : celle que Google
accorde à l'accueil et aux quelques liens entrants. Chaque lien interne en transmet une part. Si
toutes les pages se citent également, rien ne ressort. On concentre donc les liens sur les pages
qui visent les requêtes les plus cherchées, et chaque page neuve leur en apporte.

## Les réceptrices

Volumes : `Mots-clés SEO.csv` (mensuels, France). Positions : Search Console, 28 jours au 07/10.

| # | Page | Requête principale | Volume du groupe | Position au 07/10 |
|---|---|---|---|---|
| R1 | `/guides/choisir-batterie-electronique-adulte-debutant/` | batterie électronique débutant | ≈ 1 000 (débutant, pour débutant, adulte débutant) | 40 à 59 |
| R2 | `/guides/choisir-batterie-electronique-enfant/` | batterie électronique enfant | ≈ 1 000 | 15 à 42 |
| R3 | `/comparatif-batterie-electronique/` | comparatif, meilleure, quelle batterie électronique choisir | ≈ 470 (meilleure, quelle choisir, comparatif) | 35 à 50 |
| R4 | `/guides/acheter-batterie-electronique-occasion/` | batterie électronique occasion | 590 | pas encore d'impression |
| R5 | `/guides/prix-batterie-electronique/` | prix batterie électronique, pas chère | ≈ 790 (prix, pas cher, prix d'une) | pas encore d'impression |

**L'accueil** vise la tête de requête « batterie électronique » (2 400) et « batterie électrique »
(1 900). Il reçoit déjà tous les liens du logo et de la navigation : on ne lui en ajoute pas dans
les textes. Le plan éditorial lui donnait « batterie electronique debutant » comme requête
(P02) : c'est la requête de R1 depuis le recentrage du 29/09, et la Search Console du 07/10 ne
montre l'accueil sur aucune requête « débutant ». Pour éviter la cannibalisation, P02 vise
désormais « batterie électronique ». Son title n'a pas été touché : on ne change plus aucun title
avant la relecture de la Search Console du 21/10.

## Les ancres

Varier, toujours en clair dans une phrase, jamais « cliquez ici ». Trois ancres sur quatre portent
la requête ou une variante proche, la quatrième est descriptive.

- **R1** : « choisir une batterie électronique quand on débute », « batterie électronique pour
  débutant », « notre guide pour adulte débutant », « le premier kit d'un adulte »
- **R2** : « batterie électronique pour enfant », « choisir le kit d'un enfant », « quel kit à
  quel âge »
- **R3** : « comparatif des batteries électroniques », « trouver la batterie électronique qui te
  correspond », « les 31 kits côte à côte » (le compte en jeton `{n:modeles}` là où c'est possible)
- **R4** : « acheter une batterie électronique d'occasion », « ce qu'il faut vérifier sur un kit
  d'occasion »
- **R5** : « combien coûte une batterie électronique », « le vrai prix d'une batterie
  électronique », « budget réel, casque et siège compris »

## Les règles

1. **Toute page neuve renvoie vers une réceptrice**, celle de son sujet : un avis ou un duel de kit
   d'entrée de gamme vers R1 ou R2, un guide budget vers R5 et R3, un « les bases » vers R1. Le
   lien se place dans le corps, dans le premier tiers de la page si c'est naturel.
2. **Deux ou trois pages publiées proches renvoient vers la page neuve.** C'est ce qui évite
   l'orpheline et fait découvrir la page sans attendre le sitemap.
3. **Chaque réceptrice reçoit au moins dix liens dans les textes.** Aujourd'hui on les compte par
   `grep` dans `dist/` après build (voir plus bas). On ne dépasse pas un lien vers la même
   réceptrice par page.
4. **Les réceptrices se citent entre elles** : R1 ↔ R2 (adulte ou enfant), R1 → R3, R5 → R4 (le
   prix bas, c'est aussi l'occasion), R3 → R1 et R2.
5. Pas de lien depuis le pied de page ou la navigation vers une réceptrice : un lien répété sur
   toutes les pages pèse moins qu'un lien de texte, et le pied de page appartient aux greffes.

## Où on en est (build du 07/10/2026)

Pages de `dist/` qui contiennent au moins un lien vers chaque réceptrice :

| R1 adulte débutant | R2 enfant | R3 comparatif | R4 occasion | R5 prix |
|---|---|---|---|---|
| 10 | 8 | 52 (navigation) | 9 | **3** |

R3 est dans la navigation de toutes les pages : son compte ne dit rien des liens de texte, il
n'est pas prioritaire. **R5 passe en premier** dans les prochaines pages et repasses, puis R2.

## Compter

```bash
npm run build
for r in choisir-batterie-electronique-adulte-debutant choisir-batterie-electronique-enfant \
         comparatif-batterie-electronique acheter-batterie-electronique-occasion prix-batterie-electronique; do
  printf '%-48s %s\n' "$r" "$(grep -rl --include=index.html "href=\"/[a-z-]*/*$r/\"" dist | wc -l)"
done
```
