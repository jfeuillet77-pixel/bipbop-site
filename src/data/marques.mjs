/**
 * marques.mjs — le texte des hubs de marque (/marques/batterie-electronique-<marque>/).
 *
 * Les hubs ne sont pas portés d'une maquette : ils se construisent depuis src/data/modeles.json
 * (liste des modèles, prix, peaux, phrase de verdict) et depuis ce fichier, qui ne contient que
 * la rédaction. Aucun prix ni nom de modèle n'y est écrit en dur, on les appelle par jeton :
 *
 *   {prix:nitromax}   le prix relevé, au format du site (« 409 € »)
 *   {nom:nitromax}    le nom complet du modèle
 *   {avis:nitromax}   le nom, en lien vers l'avis s'il est publié (sinon le nom seul)
 *   {ecart:a-b}       l'écart de prix entre deux modèles
 *   {acc:casque}      un accessoire de ACCESSOIRES_CITES, {accprix:casque} son prix
 *   {budget:a+casque} un modèle et des accessoires, additionnés
 *   [texte](/route/)  un lien interne
 *
 * Le relevé du lundi change un prix : la phrase suit au build suivant, sans réécriture.
 * Sources des faits techniques : configurations publiées dans le flux Thomann (téléchargé le
 * 23/09/2026) et avis déjà publiés sur le site. Rien n'y est testé ni inventé (règle I01).
 *
 * Règles de rédaction : tutoiement, pas de virgule avant « et » ni « ou », pas de tiret
 * cadratin. Les espaces insécables avant « : ? ! » sont posées au rendu (HubMarque.astro).
 */

/** Les accessoires que les hubs citent, par alias : nom et prix lus dans la sélection. */
export const ACCESSOIRES_CITES = {
  casque: { marque: 'the t.bone', produit: 'HD 150' },
  siege: { marque: 'Millenium', produit: 'MDT4 Drum Throne Round' },
  tapis: { marque: 'Thomann', produit: 'E-Drum Rug Black 120' },
  baguettes: { marque: 'Millenium', produit: '7A Maple Wood' },
};

export const MARQUES = {
  yamaha: {
    marque: 'Yamaha',
    route: '/marques/batterie-electronique-yamaha/',
    title: 'Batterie électronique Yamaha : laquelle choisir en 2026 ?',
    description:
      '{N:modeles:Yamaha} batteries Yamaha comparées, de la DTX402K à la DTX6K2-X. Laquelle prendre, ce que le coaching vaut vraiment et quand passer à une autre marque.',
    h1: 'Batterie électronique Yamaha : laquelle choisir ?',
    chapeau:
      "Au même prix, Yamaha te donne moins de matériel que ses concurrents. Sa force est ailleurs : la méthode. Trois des {n:modeles:Yamaha} modèles qu'on suit partagent le même module d'apprentissage. Voilà lequel prendre et quand regarder ailleurs.",
    reponse: [
      "**Tu doutes de t'y tenir** : la {avis:dtx432} à {prix:dtx432}, pour ses dix programmes de coaching. Une batterie sur laquelle on s'entraîne vaut mieux qu'une batterie mieux équipée qui prend la poussière.",
      "**Petit budget, en appartement** : la {avis:dtx402} à {prix:dtx402}, la seule de la sélection avec une pédale de grosse caisse sans batte.",
      "**Tu sais déjà que tu vas t'y tenir** : à ce prix, prends plutôt des peaux maillées, comme la {avis:nitromax} à {prix:nitromax}.",
    ],
    sections: [
      {
        h2: 'La gamme DTX402 : un module, trois batteries',
        id: 'gamme',
        texte: [
          "La {nom:dtx402}, la {nom:dtx432} et la {nom:dtx452} partagent le même module, le DTX402 : 287 sons, 10 kits utilisateur, un métronome et une sortie casque. Ce qui les sépare, c'est ce que tu frappes.",
        ],
        liste: [
          "**{nom:dtx402}** ({prix:dtx402}) : quatre pads de 7,5 pouces en caoutchouc, trois cymbales de 10 pouces et une pédale de grosse caisse KU100 sans batte. Elle ne frappe rien, donc elle ne cogne pas dans le plancher. Livrée sans baguettes, ni siège, ni casque.",
          "**{avis:dtx432}** ({prix:dtx432}) : les mêmes pads, mais une vraie tour de grosse caisse KP65 avec sa pédale, un contrôleur de charleston HH65 et dix programmes de coaching.",
          "**{nom:dtx452}** ({prix:dtx452}) : la DTX432K avec une caisse claire à trois zones, la TP70S. Tu peux jouer sur la peau ou sur le cercle, ouvert ou fermé. Elle reste en caoutchouc.",
        ],
        apres: [
          "Aucune des trois n'a de peau maillée. C'est le vrai sacrifice de la gamme : le caoutchouc rebondit plus sec, fatigue davantage le poignet et fait plus de bruit sous la baguette. Le détail est dans [c'est quoi un pad mesh](/les-bases/pad-mesh-batterie-electronique/).",
        ],
      },
      {
        h2: 'Au-dessus : la DTX6K2-X',
        id: 'dtx6',
        texte: [
          "La {nom:dtx6k2x} ({prix:dtx6k2x}) change de catégorie. Son module DTX-PRO propose plus de 400 sons, 200 kits utilisateur et l'import de tes propres échantillons. Sa caisse claire XP80 de 8 pouces a une surface en silicone texturé à trois zones. La charleston et les trois cymbales font 13 pouces, à trois zones elles aussi. Les toms restent en caoutchouc.",
          "Deux choses à savoir avant de commander : elle demande environ 140 × 100 cm au sol. Elle arrive aussi sans pédale de grosse caisse, ni siège, ni baguettes, ni casque. Compte-les dans le budget, le [guide à moins de 1 000 €](/guides/batterie-electronique-moins-1000-euros/) fait le calcul.",
        ],
      },
      {
        h2: "Le budget réel d'une Yamaha",
        id: 'budget',
        texte: [
          "Aucune Yamaha de la sélection n'arrive prête à jouer : la {nom:dtx402} et la {nom:dtx432} sont livrées sans baguettes, sans siège et sans casque. Il faut donc ajouter au minimum :",
        ],
        liste: [
          "un casque fermé, comme le {acc:casque} ({accprix:casque}). C'est le seul critère vraiment non négociable pour commencer ;",
          "un siège réglable en hauteur, comme le {acc:siege} ({accprix:siege}) ;",
          "une paire de baguettes, par exemple les {acc:baguettes} ({accprix:baguettes}).",
        ],
        apres: [
          "Avec ces trois ajouts, la {nom:dtx432} revient à {budget:dtx432+casque+siege+baguettes} et la {nom:dtx402} à {budget:dtx402+casque+siege+baguettes}. En appartement, un tapis comme le {acc:tapis} ({accprix:tapis}) limite ce que le plancher transmet. Le [guide du pack complet](/guides/pack-batterie-electronique-complet/) détaille chaque poste.",
        ],
      },
      {
        h2: 'Brancher une Yamaha : casque, musique, ordinateur',
        id: 'brancher',
        texte: [
          "Sur les trois DTX402, la sortie casque est une prise jack de 6,35 mm, la grosse. Beaucoup de casques sont livrés avec un adaptateur, pas tous : vérifie avant de commander, la [page casque](/les-bases/casque-batterie-electronique/) revient sur ce point.",
          "L'entrée Aux, en mini-jack 3,5 mm, reçoit ton téléphone pour jouer par-dessus un morceau. Il faut un câble : aucune Yamaha de la sélection n'a de Bluetooth. Le port USB transmet le MIDI, c'est-à-dire tes frappes, à un ordinateur ou à une tablette. De quoi piloter un logiciel de batterie ou une application d'apprentissage.",
          "La {nom:dtx6k2x} va plus loin : elle enregistre sur sa mémoire interne ou sur une clé USB, avec un port pour l'ordinateur et un autre pour la clé. Pour enregistrer ton jeu, le [guide dédié](/guides/enregistrer-batterie-electronique-ordinateur/) explique les trois méthodes.",
        ],
      },
      {
        h2: 'Yamaha ou une autre marque ?',
        id: 'ou-ailleurs',
        texte: [
          "Pour le prix de la {nom:dtx432} ({prix:dtx432}), on trouve huit pads en peau maillée chez Millenium avec la {avis:mps750x} ({prix:mps750x}). Chez Roland, la {avis:td02kv} ({prix:td02kv}) apporte une pédale sans batte et les sons de la marque. Ce que Yamaha vend en plus, c'est la pédagogie. Si tu sais déjà que tu vas t'y tenir, tu la paieras sans t'en servir.",
          "Si c'est Alesis qui te fait hésiter, sa gamme Nitro met des peaux maillées sur tous les fûts dès {prix:nitromax}, avec le Bluetooth en plus. La [page Alesis](/marques/batterie-electronique-alesis/) compare ses {n:modeles:Alesis} modèles.",
          "Pour comparer toutes les marques d'un coup, le [comparatif en trois questions](/comparatif-batterie-electronique/) sort deux modèles selon ton budget, ta place et ce que tu veux jouer.",
        ],
      },
    ],
    faq: [
      {
        q: 'Quelle batterie Yamaha pour débuter ?',
        r: "La {avis:dtx432} si tu as peur d'abandonner : ses programmes de coaching notent ta régularité et montrent tes progrès. La {nom:dtx402} si le budget est serré ou si quelqu'un vit sous toi, grâce à sa pédale sans batte.",
      },
      {
        q: 'Y a-t-il une Yamaha en peaux maillées dans la sélection ?',
        r: "Non. Sous 1 600 €, les {n:modeles:Yamaha} Yamaha qu'on suit sont en caoutchouc, avec une caisse claire en silicone sur la {nom:dtx6k2x}. Si le mesh compte pour toi, regarde la [gamme Alesis](/marques/batterie-electronique-alesis/) ou la {avis:mps150x}.",
      },
      {
        q: 'DTX402K ou DTX432K : laquelle prendre ?',
        r: "Même module, même taille de pads. La {nom:dtx432} coûte {ecart:dtx432-dtx402} de plus pour une vraie pédale qui frappe un pad de grosse caisse, un contrôleur de charleston HH65 et les dix programmes de coaching. Si quelqu'un vit sous toi, la pédale sans batte de la {nom:dtx402} devient au contraire un avantage.",
      },
      {
        q: 'Peut-on agrandir une DTX432K ?',
        r: "Un peu : son pad de grosse caisse KP65 a une entrée pour brancher un pad supplémentaire. Pour aller plus loin, le [guide pour faire évoluer sa batterie](/guides/ameliorer-batterie-electronique/) dit quand un ajout vaut le coup et quand il faut changer de kit.",
      },
      {
        q: 'Quelle place faut-il pour une Yamaha ?',
        r: "Environ 100 × 100 cm au sol pour la {nom:dtx432} et la {nom:dtx452}, selon Thomann : l'emprise la plus carrée du segment, facile à caser dans un angle. Compte 140 × 100 cm pour la {nom:dtx6k2x}, plus ta place assise. Thomann ne publie pas de mesure pour la {nom:dtx402}.",
      },
      {
        q: 'Une Yamaha DTX402K suffit-elle en appartement ?',
        r: "Sa pédale sans batte règle le bruit le plus gênant, celui de la grosse caisse dans le plancher. Les pads en caoutchouc restent plus bruyants sous la baguette qu'un pad maillé. Le [guide appartement](/guides/choisir-batterie-electronique-appartement/) compare les solutions. Un [tapis](/les-bases/tapis-batterie-electronique/) fait le reste.",
      },
    ],
  },

  alesis: {
    marque: 'Alesis',
    route: '/marques/batterie-electronique-alesis/',
    title: 'Batterie électronique Alesis : laquelle choisir en 2026 ?',
    description:
      '{N:modeles:Alesis} batteries Alesis comparées, du Debut Kit à la Strata Club, toutes en peaux maillées. Laquelle prendre et ce que la Nitro Max a changé.',
    h1: 'Batterie électronique Alesis : laquelle choisir ?',
    chapeau:
      "Alesis a mis la peau maillée à la portée des petits budgets : les {n:modeles:Alesis} modèles qu'on suit en ont tous, de {prix:debut} à {prix:strata}. La vraie question n'est pas « mesh ou pas », c'est où t'arrêter.",
    reponse: [
      "**Pour un premier achat** : la {avis:nitromax} à {prix:nitromax}. Mesh partout, un bon module et le Bluetooth.",
      "**Budget serré** : la {avis:turbo} à {prix:turbo}. Mais à ce prix, la {avis:mps150x} ({prix:mps150x}) offre des cymbales plus grandes.",
      "**Pour un enfant** : le {nom:debut} à {prix:debut}, le seul kit format enfant avec des peaux maillées.",
    ],
    sections: [
      {
        h2: 'La gamme Alesis, du plus petit au plus complet',
        id: 'gamme',
        texte: ["Tous les modèles ci-dessous ont des peaux maillées sur les fûts. Ce qui change en montant : la taille des pads, le nombre de zones de jeu et la richesse du module."],
        liste: [
          "**{nom:debut}** ({prix:debut}) : le format enfant de la marque, avec des peaux maillées.",
          "**{avis:turbo}** ({prix:turbo}) : quatre fûts de 8 pouces et trois cymbales de 10 pouces, un module de 120 sons sans aucun menu. Le plus petit format du marché : à deux baguettes, on se gêne vite sur la caisse claire.",
          "**{avis:nitromax}** ({prix:nitromax}) : une caisse claire de 10 pouces à deux zones, trois toms de 8 pouces, 440 sons et le Bluetooth pour jouer par-dessus ta musique.",
          "**{nom:nitropro}** ({prix:nitropro}) : la Nitro Max en plus robuste. Rack en acier réglable plus haut, toms à deux zones, pad de grosse caisse qui accepte une double pédale, plus de 500 sons.",
          "**{nom:nitroproxl}** ({prix:nitroproxl}) : la Nitro Pro avec un quatrième tom et une troisième cymbale.",
          "**{nom:nitroultimate}** ({prix:nitroultimate}) : le haut de la gamme Nitro. 640 sons, charleston et ride à deux zones, logiciel BFD Player inclus.",
          "**{nom:strata}** ({prix:strata}) : un autre monde. Module à écran tactile de 7 pouces, caisse claire de 12 pouces, ride de 14 pouces à trois zones. Livrée sans pédale de grosse caisse ni pédale de charleston.",
        ],
      },
      {
        h2: 'Et la Nitro Mesh Kit ?',
        id: 'nitro-mesh',
        texte: [
          "C'est l'ancienne Nitro, celle que beaucoup cherchent encore. La Nitro Max l'a remplacée : même principe, peaux maillées partout, avec une caisse claire plus grande et le Bluetooth en plus. La Nitro Mesh Kit ne se vend plus neuve en France : ni Thomann ni Woodbrass ne la proposent (vérifié le 23 septembre 2026).",
          "D'occasion, elle reste un bon achat si le prix suit. Le [guide de l'occasion](/guides/acheter-batterie-electronique-occasion/) liste les six points à vérifier avant de payer.",
        ],
      },
      {
        h2: "Le budget réel d'une Alesis",
        id: 'budget',
        texte: ["La {nom:nitromax} arrive sans siège ni casque. Pour jouer le soir même, ajoute au minimum :"],
        liste: [
          "un casque fermé : le {acc:casque} ({accprix:casque}) suffit pour commencer. La sortie casque de la Nitro Max est un mini-jack 3,5 mm, le format de ton téléphone ;",
          "un siège réglable en hauteur, comme le {acc:siege} ({accprix:siege}).",
        ],
        apres: [
          "Soit {budget:nitromax+casque+siege} pour une {nom:nitromax} prête à jouer et {budget:nitromax+casque+siege+tapis} avec un {acc:tapis} ({accprix:tapis}) si quelqu'un vit sous toi. Le {nom:debut} fait exception : Woodbrass le livre avec un casque.",
          "Au sommet de la gamme, la {nom:strata} arrive sans pédale de grosse caisse ni pédale de charleston. Ce sont deux achats de plus, à prévoir avant de commander.",
        ],
      },
      {
        h2: "Ce qu'on reproche aux Alesis",
        id: 'defauts',
        texte: [
          "**Des cymbales petites.** Toute la gamme Nitro, de la Max à l'Ultimate, a des cymbales de 10 pouces. À prix proche, la {avis:mps450} ({prix:mps450}) en a de 12 : on les vise moins, on les rate moins.",
          "**Des pads étroits en entrée de gamme.** La {avis:turbo} a quatre fûts de 8 pouces, le plus petit format du marché. À deux baguettes, on se gêne vite sur la caisse claire.",
          "**Un module minimal en bas de gamme.** Celui de la Turbo propose 120 sons et une dizaine de kits, sans aucun menu. C'est reposant, mais on en fait vite le tour. Celui de la Nitro Max, avec 440 sons, 32 kits prêts à jouer et 16 à composer soi-même, tient beaucoup plus longtemps.",
        ],
      },
      {
        h2: 'Brancher une Alesis : casque, musique, ordinateur',
        id: 'brancher',
        texte: [
          "La Turbo et toute la gamme Nitro ont un port USB/MIDI : branchées à un ordinateur, elles pilotent un logiciel de batterie ou une application d'apprentissage. La {nom:nitroultimate} est même livrée avec le logiciel BFD Player.",
          "Le Bluetooth commence à la {nom:nitromax} : tu envoies la musique de ton téléphone dans le module, sans câble. En dessous, la {nom:turbo} et le {nom:debut} passent par l'entrée Aux, avec un câble mini-jack.",
          "Pour enregistrer ton jeu, le [guide dédié](/guides/enregistrer-batterie-electronique-ordinateur/) explique les trois méthodes, du câble à dix euros à l'enregistrement en MIDI.",
        ],
      },
      {
        h2: 'Où s\'arrêter dans la gamme ?',
        id: 'ou-s-arreter',
        texte: [
          "Pour apprendre, la {avis:nitromax} suffit largement : c'est celle qu'on recommande à la majorité des débutants. Au-dessus, la {nom:nitropro} coûte {prix:nitropro} pour un rack plus solide et des toms à deux zones. C'est utile si tu joues déjà, beaucoup moins si tu découvres.",
          "Si tu hésites avec une autre marque, la {avis:nitromax} a deux duels : face à la [Roland TD-02KV](/duels/alesis-nitro-max-vs-roland-td-02kv/) et face à la [Donner DED-200X](/duels/alesis-nitro-max-vs-donner-ded-200x/).",
        ],
      },
    ],
    faq: [
      {
        q: 'Alesis ou Millenium, laquelle choisir ?',
        r: "À budget égal, Millenium donne souvent un peu plus de matériel et Alesis se revend plus vite d'occasion. Le [duel MPS-150X contre Turbo Mesh](/duels/millenium-mps-150x-vs-alesis-turbo-mesh/) détaille l'écart.",
      },
      {
        q: 'Nitro Max ou Nitro Pro ?',
        r: "Pour apprendre, la {avis:nitromax}. La {nom:nitropro} coûte {ecart:nitropro-nitromax} de plus pour un rack en acier, des toms à deux zones et un pad de grosse caisse qui accepte une double pédale. C'est utile si tu joues déjà, pas pour découvrir.",
      },
      {
        q: 'Les Alesis sont-elles livrées avec des cours ?',
        r: "À partir de la Nitro Max, oui : chaque modèle inclut 90 jours gratuits sur Drumeo, une plateforme de cours en ligne. La Nitro Max ajoute 60 leçons exclusives.",
      },
      {
        q: 'Les batteries Alesis sont-elles silencieuses ?',
        r: "Les peaux maillées sont discrètes sous la baguette. Ce qu'on entend en dessous, c'est la pédale de grosse caisse qui tape dans le plancher : un [tapis](/les-bases/tapis-batterie-electronique/) épais règle l'essentiel du problème.",
      },
      {
        q: 'Quelle Alesis pour un enfant ?',
        r: "Le {nom:debut} ({prix:debut}), pensé pour les petits gabarits. Le [guide enfant](/guides/choisir-batterie-electronique-enfant/) dit quel modèle prendre selon l'âge.",
      },
    ],
  },
};

/**
 * La page mère /marques/ : un paragraphe par marque du catalogue, dans l'ordre du tableau.
 * Les marques sans hub dédié y sont décrites quand même ; leur ligne renvoie vers leurs avis.
 */
export const INDEX_MARQUES = {
  route: '/marques/',
  title: 'Batterie électronique : quelle marque choisir en 2026 ?',
  description:
    'Millenium, Alesis, Yamaha, Roland, Donner : ce que vaut chaque marque de batterie électronique, ses prix réels et celle qui colle à ton profil.',
  h1: 'Batterie électronique : quelle marque choisir ?',
  chapeau:
    "Il n'y a pas de meilleure marque, il y a la bonne marque pour ton budget, ton logement et ta motivation. On suit {n:marques} marques et {n:modeles} modèles vendus en France : voilà ce que chacune fait bien, ce qu'elle fait moins bien et où l'acheter.",
  reponse: [
    "**Petit budget, peaux maillées** : Millenium, avec la {avis:mps150x} à {prix:mps150x}.",
    "**Premier achat équilibré** : Alesis, avec la {avis:nitromax} à {prix:nitromax}.",
    "**Tu as peur d'abandonner** : Yamaha, pour les programmes de coaching de la {avis:dtx432} ({prix:dtx432}).",
    "**Quelqu'un vit sous toi** : Roland, pour la pédale sans batte de la {avis:td02kv} ({prix:td02kv}).",
  ],
  // Une entrée par marque du catalogue ; `hub` si une page dédiée existe.
  marques: {
    Millenium: "La marque maison de Thomann. Il n'y a pas de distributeur à rémunérer entre l'usine et toi, d'où des prix bas pour beaucoup de matériel : la {avis:mps450} a des cymbales de 12 pouces à {prix:mps450}, là où la gamme Nitro d'Alesis reste à 10. Le revers : une Millenium se revend plus lentement d'occasion qu'une Alesis. {N:avis:Millenium} de ses modèles ont un avis complet, de la {avis:mps150x} à la {avis:mps850}.",
    Alesis: "La peau maillée à petit prix, sur tous les modèles qu'on suit. Le Bluetooth arrive dès la {avis:nitromax}, qu'on recommande à la majorité des débutants. Ses défauts : des cymbales de 10 pouces sur toute la gamme Nitro et des pads étroits sur la Turbo. Elle se revend bien, ce qui compte si tu n'es pas sûr de t'y tenir.",
    Yamaha: "La méthode avant le matériel. Trois de ses {n:modeles:Yamaha} modèles partagent le module DTX402 et ses programmes de coaching, qui notent ta régularité. En échange, aucune Yamaha de la sélection n'a de peau maillée : les pads en caoutchouc rebondissent plus sec et font plus de bruit sous la baguette.",
    Roland: "Sous 1 600 €, la sélection Roland tient en {n:modeles:Roland} modèles : la {nom:td02k} ({prix:td02k}), la {avis:td02kv} ({prix:td02kv}), dont la pédale sans batte en fait la plus discrète en immeuble ancien. Au-dessus, la {nom:td313} ({prix:td313}). Les TD-07, TD-17 et TD-1DMK, encore très cherchées, ne se vendent plus neuves en France. La TD313 remplace la TD-17KV2.",
    Donner: "Donner vend en direct, sur Donner Music, qui est le seul marchand de ses batteries dans notre sélection. {N:modeles:Donner} modèles, de {prix:ded70} à {prix:backbeat}. La {avis:ded200x} est le kit le mieux fourni de sa tranche, mais le plus difficile à défendre face à la Nitro Max. Un réflexe à prendre : ignore les prix barrés du site Donner, ses remises affichées sont permanentes.",
    Nux: "Un seul modèle suivi, la {nom:dm110} ({prix:dm110}), en peaux maillées et vendue chez Woodbrass. On ne l'a pas encore analysée en détail : elle attend son avis.",
    Woodbrass: "Le revendeur français a sa propre batterie, la {nom:ddx50} ({prix:ddx50}), en peaux maillées. Comme la Nux, elle attend encore son avis.",
  },
  sections: [
    {
      h2: 'Ce qui compte plus que la marque',
      id: 'plus-que-la-marque',
      texte: [
        "À budget égal, deux batteries de marques différentes se ressemblent plus que deux batteries de la même marque à 300 € d'écart. Trois questions pèsent plus lourd que le logo :",
      ],
      liste: [
        "**Les peaux** : maillées ou en caoutchouc. Le mesh rebondit comme une vraie peau et fait moins de bruit sous la baguette. Le détail est dans [c'est quoi un pad mesh](/les-bases/pad-mesh-batterie-electronique/).",
        "**Ce qu'entend le voisin** : c'est la pédale de grosse caisse qui descend dans le plancher, pas le son. Le [guide appartement](/guides/choisir-batterie-electronique-appartement/) classe les modèles sur ce point.",
        "**Le budget réel** : casque, siège et parfois tapis s'ajoutent au prix affiché. Le [guide du pack complet](/guides/pack-batterie-electronique-complet/) fait le compte.",
      ],
      apres: [
        "Le [comparatif en trois questions](/comparatif-batterie-electronique/) croise ces critères pour toutes les marques d'un coup et sort deux modèles.",
      ],
    },
    {
      h2: "Et les marques qu'on ne suit pas ?",
      id: 'hors-selection',
      texte: [
        "Les marchands vendent bien plus que ces {n:marques} marques. Les Roland VAD aux fûts habillés de bois, les Yamaha DTX8 et DTX10, l'Alesis Strata Prime ou les batteries Efnote dépassent toutes 1 600 € : ce sont de très belles batteries, mais pas un premier achat. On s'arrête à ce plafond parce qu'au-delà, le lecteur n'est plus un débutant et nos conseils ne lui servent plus.",
        "À l'autre bout, on écarte les batteries jouets et les kits sans marque vendus sur les places de marché : sans pièces détachées ni revente possible, une panne de pad les rend inutilisables. Si tu tombes sur une marque absente de cette page, pose-toi les trois questions ci-dessus. Et si tu veux qu'on l'analyse, [écris-nous](/contact/).",
      ],
    },
    {
      h2: 'Où acheter une batterie électronique ?',
      id: 'ou-acheter',
      texte: [
        "Trois marchands couvrent la sélection. **Thomann** vend l'essentiel des modèles, dont toute la gamme Millenium, sa marque maison. **Woodbrass**, revendeur français, prend le relais sur ce que Thomann n'a pas : le {nom:debut}, la {nom:dm110} et sa propre {nom:ddx50}. **Donner Music** ne vend que les batteries Donner.",
        "Sur chaque page, le prix affiché est celui du marchand vers lequel mène le lien, relevé chaque lundi. Les prix bougent : vérifie toujours sur la fiche avant de commander. Le [suivi des prix](/suivi-des-prix/) montre ce qui a changé semaine après semaine.",
      ],
    },
  ],
  faq: [
    {
      q: 'Quelle est la meilleure marque de batterie électronique ?',
      r: "Aucune pour tout le monde. Pour un premier achat, on recommande le plus souvent la {avis:nitromax} d'Alesis. Pour un tout petit budget en mesh, Millenium. Pour apprendre avec un programme, Yamaha. Pour le silence en immeuble, Roland.",
    },
    {
      q: 'Pourquoi les batteries Millenium sont-elles moins chères ?',
      r: "Millenium est la marque maison de Thomann : pas de distributeur entre l'usine et toi. C'est pour ça qu'à budget égal, elles offrent souvent des cymbales plus grandes ou plus de pads que la concurrence.",
    },
    {
      q: 'Roland vaut-il son prix pour débuter ?',
      r: "Pour le son et le silence, oui : la {avis:td02kv} est la seule qu'on recommande en immeuble ancien, grâce à sa pédale sans batte. Pour le toucher, moins : au même prix, la {avis:mps750x} de Millenium a des peaux maillées sur tous ses pads.",
    },
    {
      q: 'Faut-il rester sur la même marque pour faire évoluer sa batterie ?',
      r: "Ce n'est pas obligatoire, mais c'est plus simple. Millenium vend ses modules séparément : on peut passer du module d'une {nom:mps150x} à celui d'une {nom:mps750x} en gardant les pads et le faisceau. Entre marques, un pad supplémentaire se branche sur une entrée libre du module, quand il en a une. Le [guide pour faire évoluer sa batterie](/guides/ameliorer-batterie-electronique/) dit quand un ajout vaut le coup et quand il vaut mieux changer de kit.",
    },
    {
      q: 'Une batterie de marque se revend-elle mieux ?',
      r: "Oui. C'est même un vrai critère si tu n'es pas sûr de t'y tenir. Une Alesis d'occasion trouve preneur en quelques jours, une Millenium met plus longtemps. Le [guide de l'occasion](/guides/acheter-batterie-electronique-occasion/) donne les prix à viser.",
    },
  ],
};
