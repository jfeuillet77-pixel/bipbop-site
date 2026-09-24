/**
 * La rédaction du hub /duels/ (24/09/2026, plan P26), lue par src/components/HubDuels.astro.
 *
 * La liste des duels ne s'écrit pas ici : le hub la lit dans le plan éditorial (type « Duel »,
 * statut « Publié ») et range les duels du moins cher au plus cher. Ce fichier donne, pour chaque
 * route publiée, les deux modèles (identifiants de modeles.json), le gagnant (null quand ta
 * situation tranche) et trois phrases. Un duel publié sans entrée ici fait échouer le build :
 * il n'apparaîtrait pas sur son hub sans que personne le voie.
 *
 * Mêmes jetons que marques.mjs ({prix:id}, {avis:id}, {ecart:a-b}, {n:modeles}…) : aucun prix,
 * aucun écart écrit en dur, le lundi les recalcule. Tutoiement, pas de virgule avant « et » ni
 * avant « ou », jamais « tester ».
 */

export const DUELS = {
  '/duels/millenium-mps-150x-vs-alesis-turbo-mesh/': {
    a: 'mps150x',
    b: 'turbo',
    gagnant: 'mps150x',
    resume:
      "La Millenium gagne : un pad de plus, une caisse claire de 10 pouces au lieu de 8 et un rack qui ne bouge pas, pour {ecart:turbo-mps150x} de moins. L'Alesis garde une seule carte, sa marque, qui se revend plus vite.",
    pourA: 'tu veux le plus de batterie possible sous 300 €.',
    pourB: 'tu comptes la revendre dans un an ou deux.',
  },
  '/duels/alesis-nitro-max-vs-donner-ded-200x/': {
    a: 'nitromax',
    b: 'ded200x',
    gagnant: 'nitromax',
    resume:
      "L'Alesis gagne : {diff:ded200x-nitromax+casque+siege} de moins une fois équipée du casque et du siège que la Donner fournit, des sons tirés de la bibliothèque BFD et le Bluetooth. La Donner aligne une deuxième crash, un rack plus rigide et un carton complet.",
    pourA: 'tu veux jouer sur ta playlist dès le premier soir.',
    pourB: 'tu veux neuf pads dès le départ, idéalement pendant une promotion Donner.',
  },
  '/duels/alesis-nitro-max-vs-roland-td-02kv/': {
    a: 'nitromax',
    b: 'td02kv',
    gagnant: null,
    resume:
      "Pas de gagnant absolu. L'Alesis a cinq fûts en peau maillée contre un seul et le Bluetooth, pour {ecart:td02kv-nitromax} de moins. La Roland a la pédale sans batte : rien ne frappe le plancher.",
    pourA: 'tu vis en maison ou au rez-de-chaussée sur dalle.',
    pourB: "quelqu'un vit sous ton plancher ou si tu joues surtout le soir.",
  },
  '/duels/millenium-mps-750x-vs-mps-850/': {
    a: 'mps750x',
    b: 'mps850',
    gagnant: 'mps750x',
    resume:
      'La MPS-750X gagne : des toms et des cymbales plus grands, plus de sons et le Bluetooth, pour {ecart:mps850-mps750x} de moins. La MPS-850 a deux pads de plus et des prises MIDI à cinq broches.',
    pourA: 'tu joues au casque et que tu agrandiras le kit plus tard.',
    pourB: 'tu branches ta batterie sur un synthé ou une boîte à rythmes.',
  },
};

export const INDEX_DUELS = {
  route: '/duels/',
  title: 'Duels de batteries électroniques : laquelle choisir ?',
  // {nb} : le nombre de duels publiés, compté par le hub.
  description:
    "Nitro Max ou DED-200X, MPS-150X ou Turbo Mesh : {nb} duels de batteries électroniques, critère par critère, avec l'écart de prix réel et un verdict.",
  h1: 'Les duels : deux batteries électroniques face à face',
  chapeau:
    "Quand tu hésites entre deux modèles, un comparatif de {n:modeles} batteries ne t'aide plus. Un duel, si : les deux kits critère par critère, l'écart de prix réel et un gagnant, sauf quand c'est ta situation qui doit trancher.",
  reponse: [
    "**Moins de 300 €** : la {avis:mps150x} plutôt que l'{avis:turbo}. Une caisse claire plus grande, un pad de plus et un rack plus solide.",
    "**Autour de 400 €** : la {avis:nitromax} plutôt que la {avis:ded200x}. Une cymbale de moins, mais le Bluetooth et un meilleur module.",
    "**Un voisin sous ton plancher** : la {avis:td02kv} plutôt que la Nitro Max. Rendre l'Alesis aussi discrète coûte plus cher que la Roland elle-même.",
    "**Autour de 500 € chez Millenium** : la {avis:mps750x} plutôt que la {avis:mps850}, sauf si tu branches du matériel MIDI sans passer par un ordinateur.",
  ],
  sections: [
    {
      h2: 'Comment on départage deux batteries',
      id: 'methode',
      texte: [
        "Un duel part d'une hésitation réelle : deux modèles proches par le prix ou par la promesse, que les gens cherchent ensemble. On ne met pas face à face deux batteries que rien ne rapproche.",
        "Les chiffres viennent des fiches des marchands, relevées chaque lundi : le prix chez Thomann, Woodbrass ou Donner, le nombre et la taille des pads, les sons du module, la surface au sol quand le marchand la donne. Quand une fiche se tait, la case le dit plutôt que de deviner.",
        "Vient ensuite le tableau, critère par critère, avec une colonne « Avantage ». On compte les points, sans s'arrêter au décompte : le Bluetooth pèse plus lourd au quotidien qu'une neuvième pièce qu'on frappe une fois par mois. Le verdict dit pourquoi.",
      ],
      liste: [
        "**Le prix réel**, pas le prix barré. Chez Donner, un ancien prix rayé s'affiche presque toujours : on ne le reprend jamais.",
        "**Les peaux** : maillées ou en caoutchouc, sur quels pads. Les cymbales ne sont maillées sur aucune batterie de ces duels : un kit dit « tout mesh » l'est sur ses fûts.",
        "**La taille de la caisse claire**, parce que c'est le pad qu'on frappe le plus. À 10 pouces les deux baguettes tiennent dessus, à 8 pouces il faut viser.",
        "**La pédale de grosse caisse.** Avec une batte, elle cogne dans le sol. Sans batte, elle ne cogne dans rien. En appartement, c'est souvent le seul critère qui compte.",
        "**Le module** : la qualité des sons plus que leur nombre, le Bluetooth et les entrées libres pour agrandir le kit un jour.",
      ],
    },
    {
      h2: "Ce qu'un duel ne dit pas",
      id: 'limites',
      texte: [
        "Un duel compare deux modèles, pas tout le marché. Si aucun des deux ne te va, le [comparatif](/comparatif-batterie-electronique/) te pose trois questions sur ton budget, ta place et ta situation, puis te sort deux modèles parmi les {n:modeles} qu'on suit.",
        "Il ne remplace pas non plus un essai. On analyse les fiches, les manuels et les avis publiés : le ressenti sous la baguette reste le tien. Si tu peux essayer l'un des deux kits en magasin, fais-le, surtout pour la hauteur du rack et la taille des pads.",
        "Enfin, un verdict vaut au prix du jour. Si un écart de cent euros fond pendant une promotion, le gagnant peut changer : chaque duel donne l'écart réel et le remet à jour à chaque relevé.",
      ],
    },
  ],
  avenir: {
    h2: 'Les prochains duels',
    id: 'a-venir',
    texte: "On écrit les duels dans l'ordre de ce que les gens cherchent. Voilà ceux qui arrivent :",
    apres: "Une hésitation qui n'y figure pas ? [Dis-le nous](/contact/) : on écrit en priorité ce qu'on nous demande.",
  },
  faq: [
    {
      q: "Pourquoi certains duels n'ont pas de gagnant ?",
      r: "Parce que la réponse dépend de toi, pas des fiches. Entre la {nom:nitromax} et la {nom:td02kv}, l'Alesis l'emporte presque partout sauf sur la pédale. Si quelqu'un dort sous ton plancher, ce point efface tous les autres. Plutôt que d'inventer un vainqueur, le duel te donne le moyen de trancher.",
    },
    {
      q: 'Faut-il toujours prendre le gagnant ?',
      r: "Non. Le gagnant est le meilleur choix pour la plupart des gens, pas forcément pour toi. Chaque duel finit par deux listes « Prends celle-ci si » : si tu te reconnais dans celle du perdant, c'est lui qu'il te faut.",
    },
    {
      q: 'Les prix des duels sont-ils à jour ?',
      r: "Chaque lundi, on relève les prix chez Thomann, Donner et Woodbrass. Les montants de cette page se recalculent à chaque relevé. Dans les duels, un écart qui change fait réécrire la phrase qui le cite, pas seulement le chiffre. Vérifie quand même le prix sur la fiche du marchand avant de commander.",
    },
    {
      q: 'Pourquoi autant de Millenium dans les duels ?',
      r: "Millenium est la marque maison de Thomann : {n:modeles:Millenium} des {n:modeles} batteries qu'on suit. À prix égal, elle donne souvent plus de matériel qu'une marque connue, ce qui la met naturellement face à elle. Sa faiblesse, c'est la revente : une marque de distributeur part moins vite d'occasion.",
    },
  ],
};
