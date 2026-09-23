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
 *   [texte](/route/)  un lien interne
 *
 * Le relevé du lundi change un prix : la phrase suit au build suivant, sans réécriture.
 * Sources des faits techniques : configurations publiées dans le flux Thomann (téléchargé le
 * 23/09/2026) et avis déjà publiés sur le site. Rien n'y est testé ni inventé (règle I01).
 *
 * Règles de rédaction : tutoiement, pas de virgule avant « et » ni « ou », pas de tiret
 * cadratin. Les espaces insécables avant « : ? ! » sont posées au rendu (HubMarque.astro).
 */

export const MARQUES = {
  yamaha: {
    marque: 'Yamaha',
    route: '/marques/batterie-electronique-yamaha/',
    title: 'Batterie électronique Yamaha : laquelle choisir en 2026 ?',
    description:
      'Quatre batteries Yamaha comparées, de la DTX402K à la DTX6K2-X. Laquelle prendre, ce que le coaching vaut vraiment et quand passer à une autre marque.',
    h1: 'Batterie électronique Yamaha : laquelle choisir ?',
    chapeau:
      "Au même prix, Yamaha te donne moins de matériel que ses concurrents. Sa force est ailleurs : la méthode. Trois des quatre modèles qu'on suit partagent le même module d'apprentissage. Voilà lequel prendre et quand regarder ailleurs.",
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
        h2: 'Yamaha ou une autre marque ?',
        id: 'ou-ailleurs',
        texte: [
          "Pour le prix de la {nom:dtx432} ({prix:dtx432}), on trouve huit pads en peau maillée chez Millenium avec la {avis:mps750x} ({prix:mps750x}). Chez Roland, la {avis:td02kv} ({prix:td02kv}) apporte une pédale sans batte et les sons de la marque. Ce que Yamaha vend en plus, c'est la pédagogie. Si tu sais déjà que tu vas t'y tenir, tu la paieras sans t'en servir.",
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
        r: "Non. Sous 1 600 €, les quatre Yamaha qu'on suit sont en caoutchouc, avec une caisse claire en silicone sur la {nom:dtx6k2x}. Si le mesh compte pour toi, regarde la [gamme Alesis](/marques/batterie-electronique-alesis/) ou la {avis:mps150x}.",
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
      'Sept batteries Alesis comparées, du Debut Kit à la Strata Club, toutes en peaux maillées. Laquelle prendre, et ce que la Nitro Max a changé.',
    h1: 'Batterie électronique Alesis : laquelle choisir ?',
    chapeau:
      "Alesis a mis la peau maillée à la portée des petits budgets : les sept modèles qu'on suit en ont tous, de {prix:debut} à {prix:strata}. La vraie question n'est pas « mesh ou pas », c'est où t'arrêter.",
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
