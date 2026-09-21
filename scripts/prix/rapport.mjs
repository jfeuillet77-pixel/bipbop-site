// Usage : node scripts/prix/rapport.mjs [--date AAAA-MM-JJ]
//
// Lit le dernier relevé et écrit PRIX-SEMAINE.md : ce qui a bougé, et surtout tout ce qu'il
// faut mettre à jour pour que ça ne se voie pas. Le rapport ne modifie rien.
//
// Il applique deux documents, à la lettre :
//   Aide-Memoire §03  les six endroits où le même prix apparaît — fiche d'avis, comparatif,
//                     guides par budget, duels, page de sélection, design system. Ils ne sont
//                     pas devinés : le montant publié est cherché dans TOUTES les maquettes et
//                     dans toutes les pages portées, et chaque occurrence est rapportée avec
//                     sa ligne et sa phrase.
//   Procédure §05     les quatre cas où un écart de prix ne corrige pas un chiffre mais
//                     invalide un raisonnement : franchissement de tranche, écart d'un duel,
//                     recommandation devenue plus chère que son alternative, accessoire
//                     « le moins cher » qui ne l'est plus.
//
// Ce rapport est aussi le brief de l'étape éditoriale : c'est lui que lit la session Claude du
// lundi. Il doit donc être exact et complet, jamais allusif.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { occurrences, fichiersTexte } from './consequences.mjs';
import { prixFrancais } from '../greffes.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAQUETTES = join(SITE, '..', 'Claude Design - MàJ');
const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);

const releves = readdirSync(join(SITE, 'releves')).filter((n) => /^prix-\d{4}-\d\d-\d\d\.json$/.test(n)).sort();
const DATE = arg('--date') ?? releves[releves.length - 1]?.slice(5, 15);
if (!DATE) { console.error('  Aucun relevé. Lancer d\'abord scripts/prix/relever.mjs'); process.exit(1); }
const rel = JSON.parse(readFileSync(join(SITE, 'releves', `prix-${DATE}.json`), 'utf8'));

/**
 * Les relevés précédents. La procédure demande d'en garder quatre, et elle dit pourquoi :
 * « c'est ce qui permet de voir qu'un prix baisse depuis trois semaines plutôt que de le
 * constater une fois ». C'est aussi ce qui décide d'une bascule de marchand — elle se justifie
 * après PLUS DE DEUX SEMAINES de rupture, donc jamais au premier relevé qui la voit.
 */
const PRECEDENTS = releves
  .filter((n) => n.slice(5, 15) < DATE)
  .slice(-3)
  .map((n) => JSON.parse(readFileSync(join(SITE, 'releves', n), 'utf8')))
  .reverse();   // du plus récent au plus ancien

/** Depuis combien de relevés consécutifs, celui-ci compris, la référence est-elle en rupture. */
function ruptureDepuis(ref) {
  let n = 1;
  for (const r of PRECEDENTS) {
    const avant = r.refs.find((x) => x.url === ref.url);
    if (!avant?.enRupture) break;
    n++;
  }
  return n;
}

const plan = JSON.parse(readFileSync(join(SITE, 'src/data/plan.json'), 'utf8'));
/** maquette -> route publique, et l'inverse : c'est le plan éditorial qui fait le pont. */
const ROUTE_DE = new Map(), MAQUETTE_DE = new Map();
for (const r of plan) {
  if (!r.fichier_maquette?.endsWith('.dc.html')) continue;
  const p = String(r.permalien || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/+|\/+$/g, '');
  const route = p === '' ? '/' : `/${p}/`;
  ROUTE_DE.set(r.fichier_maquette, route);
  MAQUETTE_DE.set(route, r.fichier_maquette);
}

/** Les trois guides dont l'adresse annonce un plafond : « à moins de N euros ». */
const PLAFONDS = [...MAQUETTE_DE.keys()]
  .map((route) => ({ route, plafond: Number((route.match(/moins-de?-(\d+)-euros/) ?? [])[1]) }))
  .filter((g) => g.plafond);

/** « 1 substitution », « 3 substitutions » : ce site n'écrit pas « occurrence(s) ». */
const pl = (n, mot, pluriel) => `${n} ${n > 1 ? (pluriel ?? mot + 's') : mot}`;

/** `<SITE>/src/pages/guides/pack-complet/index.html` -> `/guides/pack-complet/`. */
const routeDe = (f) => '/' + relative(join(SITE, 'src', 'pages'), f).replace(/(index)?\.(html|astro)$/, '');

/** Les pages que l'Aide-Mémoire §05 redate à chaque relevé de prix, et pas seulement au fond. */
const SUIT_CHAQUE_RELEVE = /^\/(comparatif|guides\/(meilleure-)?batterie-moins-\d+-euros)\//;

const LONGUE = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/* --------------- où le montant publié apparaît, dans la source et dans le publié --------------- */

const SOURCES = {
  maquettes: fichiersTexte(MAQUETTES, ['.dc.html'], ['/uploads/', '/assets/', '/data/']),
  pages: fichiersTexte(join(SITE, 'src/pages'), ['.html', '.astro'], []),
  donnees: [...fichiersTexte(join(SITE, 'src/data'), ['.json'], ['/plan.json']),
            join(SITE, 'design/prix-reperes.json'), join(SITE, 'design/liste-attente-avis.csv')],
  corrections: [join(SITE, 'design/port-corrections.json')],
};

/** Les huit documents internes ne se publient jamais : une occurrence là n'est pas une urgence. */
const INTERNES = new Set(['Guide-Du-Projet', 'Design-System', 'Selection-Produits', 'Brief-Mascotte',
  'Assets-Mascotte', 'Brief-Responsive', 'Aide-Memoire-Mises-A-Jour', 'Procedure-Mise-A-Jour-Prix']);
const estInterne = (f) => INTERNES.has(basename(f).replace(/\.dc\.html$/, ''));

/**
 * Les occurrences du montant, rangées par nature de fichier — parce qu'on n'en fait pas la
 * même chose.
 *
 *   maquettes   la prose. C'est LÀ qu'on écrit la correction (loi 1 : on porte, on ne retape
 *               pas). Chaque occurrence y est jugée mécanique ou à réécrire.
 *   routes      les pages portées. Dérivées des maquettes : elles suivront au portage. On les
 *               compte seulement, pour dire ce qu'un lecteur voit aujourd'hui.
 *   donnees     src/data/ et prix-reperes.json. De la donnée, jamais de la prose : toujours
 *               mécanique, et régénérée par `npm run data`.
 *   corrections les greffes déjà déclarées qui citent ce montant. Un portage échoue si leur
 *               texte « au » a bougé : elles sont à relire, pas à analyser comme des phrases.
 */
/**
 * Les AUTRES références dont le prix publié est le même montant. Un site qui range 31 modèles
 * par tranche en a forcément : au 21/09, 498 € est à la fois la Roland TD-02KV, la Millenium
 * MPS-750X et la Yamaha DTX432K. Une substitution aveugle de « 498 € » corromprait les lignes
 * qui parlent des deux autres. C'est le garde-fou le plus important de ce rapport.
 */
function homonymes(ref, tous) {
  return tous.filter((x) => x !== ref && x.publie !== null && Math.abs(x.publie - ref.publie) < 0.005);
}

/**
 * Les pages publiées qui portent le lien marchand de cette référence. Quatorze ruptures dont
 * deux seulement sont liées depuis une page, ce n'est pas la même liste de travail : sans ce
 * tri, le rapport demande quatorze décisions dont douze ne changent rien pour un lecteur.
 */
function pagesQuiLient(ref) {
  if (!ref.url) return [];
  return SOURCES.pages
    .filter((f) => readFileSync(f, 'utf8').includes(ref.url))
    .map((f) => routeDe(f));
}

function consequences(ref) {
  const dans = (liste) => liste.flatMap((f) => occurrences(f, ref.publie, SITE));
  const maquettes = dans(SOURCES.maquettes.filter((f) => !estInterne(f)));
  return {
    maquettes,
    internes: dans(SOURCES.maquettes.filter((f) => estInterne(f))),
    routes: dans(SOURCES.pages),
    donnees: dans(SOURCES.donnees),
    corrections: dans(SOURCES.corrections),
    aReecrire: maquettes.filter((o) => !o.mecanique),
  };
}

/* --------------------------- §05 : quand un écart change le contenu -------------------------- */

const sansAccent = (x) => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');

/**
 * Les deux modèles d'un duel, lus dans le nom de sa maquette : « Duel-A-vs-B.dc.html ».
 * On retient, de chaque côté, le modèle dont le nom est contenu dans le côté — le plus long
 * d'abord, pour que « MPS-150X » ne soit pas ravi par « MPS-1000 ».
 */
function duellistes(maquette, tous) {
  const m = basename(maquette).match(/^Duel-(.+?)-vs-(.+?)\.dc\.html$/i);
  if (!m) return [];
  const modeles = tous.filter((x) => x.source === 'modeles').sort((a, b) => b.nom.length - a.nom.length);
  return [m[1], m[2]]
    .map((cote) => modeles.find((x) => sansAccent(cote).includes(sansAccent(x.nom)) || sansAccent(x.nom).includes(sansAccent(cote))))
    .filter(Boolean);
}

function raisonnementsCasses(ref, tous) {
  const cassés = [];

  if (ref.franchitUnSeuil)
    cassés.push(`**Franchit une tranche du hub** : « ${ref.segmentPublie} » → « ${ref.segmentReleve} ». `
      + `Le hub Avis et le comparatif rangent le modèle par tranche : une carte sous un intitulé qui ne contient plus son prix est un mensonge visible.`);

  for (const g of PLAFONDS) {
    const dedans = (p) => p !== null && p < g.plafond;
    if (dedans(ref.publie) && !dedans(ref.releve))
      cassés.push(`**Sort de \`${g.route}\`** : ${prixFrancais(ref.releve)} dépasse le plafond de ${g.plafond} € annoncé par l'adresse. `
        + `Le retirer du tableau, le remplacer, puis vérifier qu'il n'était pas la recommandation principale du guide.`);
    if (!dedans(ref.publie) && dedans(ref.releve))
      cassés.push(`**Entre dans \`${g.route}\`** : ${prixFrancais(ref.releve)} passe sous le plafond de ${g.plafond} €. `
        + `Un modèle éligible absent du guide est une recommandation incomplète.`);
  }

  // Un duel repose sur un écart chiffré, cité dans le titre, dans le texte et dans le rail.
  // Les deux modèles se lisent dans le NOM de la maquette (« Duel-A-vs-B.dc.html ») et non dans
  // son contenu : une page de duel cite aussi ses voisines en lien, et les chercher dans le
  // corps faisait croire que la Turbo Mesh affrontait trois modèles à la fois.
  for (const [route, maquette] of MAQUETTE_DE) {
    if (!route.startsWith('/duels/')) continue;
    const paire = duellistes(maquette, tous);
    if (paire.length !== 2 || !paire.includes(ref)) continue;
    const a = paire.find((x) => x !== ref);
    const avant = Math.abs(ref.publie - a.publie);
    const apres = Math.abs((ref.releve ?? ref.publie) - (a.releve ?? a.publie));
    const inverse = Math.sign(ref.publie - a.publie) !== Math.sign((ref.releve ?? ref.publie) - (a.releve ?? a.publie));
    if (Math.round(avant) === Math.round(apres) && !inverse) continue;
    cassés.push(`**L'écart du duel \`${route}\` bouge** : ${ref.nom} vs ${a.nom}, ${Math.round(avant)} € d'écart → ${Math.round(apres)} €`
      + `${inverse ? ", **et il s'inverse : le moins cher n'est plus le même, le verdict lui-même peut basculer**" : ''}. `
      + `L'écart est cité dans le titre, dans le texte et dans le rail : les trois doivent suivre.`);
  }

  return cassés;
}

/* ------------------------------------------ le rapport ----------------------------------------- */

const bougent = rel.refs.filter((r) => r.aTraiter);
const bruit = rel.refs.filter((r) => r.ecart && !r.aTraiter);
const ruptures = rel.refs.filter((r) => r.enRupture);
const disparues = rel.refs.filter((r) => r.disparue);
const illisibles = rel.refs.filter((r) => r.releve === null && !r.disparue);

const L = [];
const dire = (s = '') => L.push(s);

/**
 * Le verdict lisible par une machine, écrit à côté du rapport : `semaine.mjs` s'en sert pour
 * décider s'il ouvre une session éditoriale. Sans lui, quatorze ruptures dont aucune n'est liée
 * depuis une page déclencheraient une session tous les lundis, pour rien.
 */
const verdict = { date: DATE, editorial: false, raisons: [] };
const exige = (r) => { verdict.editorial = true; verdict.raisons.push(r); };

dire(`# Relevé de prix — ${LONGUE(DATE)}`);
dire();
dire(bougent.length
  ? `**${bougent.length} référence(s) à traiter** sur ${rel.bilan.controlees} contrôlées. ${rel.bilan.franchissements} franchissement(s) de tranche, ${ruptures.length} rupture(s), ${disparues.length} disparition(s).`
  : `**Rien à traiter.** ${rel.bilan.lues}/${rel.bilan.controlees} prix relevés, aucun écart n'atteint le seuil de ${rel.seuil} €. ${ruptures.length} rupture(s), ${disparues.length} disparition(s).`);
dire();
dire(`| Source | Ce qu'elle a donné |`);
dire(`| --- | --- |`);
for (const [m, s] of Object.entries(rel.sources)) dire(`| ${m} | ${s} |`);
dire();
dire(`Seuil d'intervention : **${rel.seuil} €**. En dessous, on ne touche à rien — on passerait la semaine à corriger du bruit.`);
dire();

/* 1 — ce qui a bougé */
dire(`## 1. Ce qui a bougé`);
dire();
if (!bougent.length) {
  dire(`Rien au-dessus du seuil.`);
  if (bruit.length) {
    dire();
    dire(`Sous le seuil, pour mémoire (aucune action) :`);
    dire();
    for (const r of bruit) dire(`- ${r.nom} — ${r.publieTexte} → ${prixFrancais(r.releve)} (${r.ecart > 0 ? '+' : ''}${r.ecart} €)`);
  }
} else {
  dire(`| Référence | Marchand | Publié | Relevé | Écart | Tranche |`);
  dire(`| --- | --- | ---: | ---: | ---: | --- |`);
  for (const r of bougent.sort((a, b) => Math.abs(b.ecart) - Math.abs(a.ecart)))
    dire(`| ${r.nom} | ${r.marchand} | ${r.publieTexte} | ${prixFrancais(r.releve)} | ${r.ecart > 0 ? '+' : ''}${r.ecart} € (${r.pct > 0 ? '+' : ''}${r.pct} %) | ${r.franchitUnSeuil ? `⚠ ${r.segmentPublie} → ${r.segmentReleve}` : r.segmentReleve ?? '—'} |`);
}
dire();

/* 2 — le travail, référence par référence */
if (bougent.length) exige(`${pl(bougent.length, 'prix')} au-dessus du seuil de ${rel.seuil} €`);
if (disparues.length) exige(`${pl(disparues.length, 'référence disparue')} du catalogue`);
if (illisibles.length) exige(`${pl(illisibles.length, 'référence')} dont le prix n'a pas pu être lu`);

if (bougent.length) {
  dire(`## 2. Le travail, référence par référence`);
  dire();
  dire(`Chaque occurrence a été cherchée dans les 46 maquettes, les 39 pages portées, \`src/data/\` et \`design/\`.`);
  dire(`**Mécanique** = le montant se remplace tel quel. **À réécrire** = la phrase tient un raisonnement sur l'écart, elle devient fausse et aucune substitution ne la répare.`);
  dire();
  for (const r of bougent) {
    dire(`### ${r.nom} — ${r.publieTexte} → ${prixFrancais(r.releve)} (${r.ecart > 0 ? '+' : ''}${r.ecart} €)`);
    dire();
    dire(`Relevé chez ${r.marchand} le ${DATE}, par ${r.origine === 'flux' ? 'le flux marchand' : r.origine}. Lien publié : ${r.url}`);
    if (r.enRupture) dire(`> ⚠ **En rupture** (${r.dispoLisible || r.dispo}). Publier un prix attractif sur une référence épuisée est le piège n°3 de la procédure.`);
    dire();
    const casses = raisonnementsCasses(r, rel.refs);
    if (casses.length) {
      dire(`**Ce que cet écart invalide** (procédure §05) :`);
      dire();
      for (const c of casses) dire(`- ${c}`);
      dire();
    }
    const c = consequences(r);

    const memePrix = homonymes(r, rel.refs);
    if (memePrix.length) {
      dire(`> ⚠ **${r.publieTexte} est aussi le prix publié de ${memePrix.map((x) => x.nom).join(', ')}.**`);
      dire(`> Toutes les occurrences ci-dessous ne parlent donc pas du même modèle. Aucune substitution automatique n'est appliquée sur ce montant : chaque ligne se lit avant d'être touchée.`);
      dire();
    }

    dire(`**Où écrire la correction** — dans les maquettes, jamais dans \`src/pages/\` (loi 1) :`);
    dire();
    if (!c.maquettes.length) {
      dire(`Aucune maquette n'écrit ${r.publieTexte}. Le prix ne vit que dans la base : \`npm run data\` suffira.`);
    } else {
      const parFichier = new Map();
      for (const o of c.maquettes) (parFichier.get(o.fichier) ?? parFichier.set(o.fichier, []).get(o.fichier)).push(o);
      for (const [f, os] of [...parFichier].sort((a, b) => a[0].localeCompare(b[0]))) {
        const route = ROUTE_DE.get(basename(f));
        const meca = os.filter((o) => o.mecanique).length;
        dire(`- [ ] \`${basename(f)}\`${route ? ` → \`${route}\`` : ''} — ${pl(meca, 'substitution mécanique', 'substitutions mécaniques')}${os.length - meca ? `, **${pl(os.length - meca, 'phrase à réécrire', 'phrases à réécrire')}**` : ''}`);
        for (const o of os.filter((x) => !x.mecanique))
          dire(`  - ligne ${o.ligne} — « …${o.contexte.replace(/\s+/g, ' ').slice(0, 170)}… »`);
      }
    }
    dire();

    const routes = [...new Set(c.routes.map((o) => routeDe(join(SITE, o.fichier))))];
    if (routes.length) {
      dire(`**Ce que le site publie aujourd'hui** : ${r.publieTexte} est en ligne sur ${pl(routes.length, 'page')} — ${routes.map((x) => `\`${x}\``).join(', ')}. Elles suivront au portage.`);
      dire();
    }
    if (c.donnees.length) {
      dire(`**Données** : ${pl(c.donnees.length, 'occurrence')} dans \`src/data/\` et \`design/prix-reperes.json\` — mécaniques, régénérées par \`npm run data\`.`);
      dire();
    }
    if (c.corrections.length) {
      dire(`**Greffes déjà déclarées** : ${pl(c.corrections.length, 'entrée')} de \`design/port-corrections.json\` citent ${r.publieTexte}. À relire : une correction dont le texte « au » ne se trouve plus fait échouer le portage, exprès.`);
      dire();
    }
    if (c.internes.length) {
      dire(`_(${pl(c.internes.length, 'occurrence')} dans les documents internes, qui ne se publient jamais.)_`);
      dire();
    }
  }
}

/* 3 — ruptures */
const actionnables = ruptures.filter((r) => r.ruptureActionnable);
const delais = ruptures.filter((r) => !r.ruptureActionnable);

dire(`## 3. Ruptures de stock`);
dire();
if (!ruptures.length) dire(`Aucune.`);
else {
  dire(`La procédure ne traite pas un délai comme une rupture : « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». En deçà, c'est un délai de livraison et on ne touche à rien.`);
  dire();
  dire(`### ${pl(actionnables.length, 'rupture qui demande une décision', 'ruptures qui demandent une décision')}`);
  dire();
  if (!actionnables.length) dire(`Aucune.`);
  else {
    dire(`| Référence | Attente annoncée | Prix | En rupture depuis | Pages qui la lient |`);
    dire(`| --- | --- | ---: | ---: | --- |`);
    const rangees = actionnables
      .map((r) => ({ r, depuis: ruptureDepuis(r), pages: pagesQuiLient(r) }))
      .sort((a, b) => b.pages.length - a.pages.length || b.depuis - a.depuis);
    for (const { r, depuis, pages } of rangees)
      dire(`| ${pages.length ? '**' + r.nom + '**' : r.nom} | ${r.dispoLisible || 'hors stock, sans date annoncée'} | ${r.releve !== null ? prixFrancais(r.releve) : '—'} | ${pl(depuis, 'relevé')} | ${pages.length ? pages.map((x) => `\`${x}\`` ).join(', ') : '—' } |`);
    dire();
    const aBasculer = rangees.filter((x) => x.pages.length && x.depuis >= 2);
    const nouvelles = rangees.filter((x) => x.pages.length && x.depuis < 2);
    if (aBasculer.length) exige(`${pl(aBasculer.length, 'rupture')} durable(s) sur une référence liée depuis une page publiée`);
    if (aBasculer.length) {
      dire(`**${pl(aBasculer.length, 'référence à traiter maintenant')}** : liée depuis une page publiée ET en rupture depuis au moins deux relevés. La procédure est claire — « une rupture de plus de deux semaines chez Thomann justifie de basculer le lien vers Woodbrass quand il a la référence ». Vérifier le prix chez Woodbrass, puis \`marchand\` + \`url\` dans \`design/prix-reperes.json\`, et la date du relevé de la page qui l'annonce suit. Si personne ne l'a, c'est un retrait (Aide-Mémoire §04).`);
      dire();
      for (const { r, pages } of aBasculer) dire(`- ${r.nom} — ${pages.join(', ')} — ${r.url}`);
    } else {
      dire(`**Rien à basculer cette semaine.** Une bascule de marchand se justifie après PLUS de deux semaines de rupture, jamais au premier relevé qui la voit : un « indisponible » d'un jour ferait changer de marchand pour rien.`);
    }
    if (nouvelles.length) {
      dire();
      dire(`À resurveiller au prochain relevé (liées depuis une page, mais en rupture pour la première fois) : ${nouvelles.map((x) => x.r.nom).join(' · ')}.`);
    }
    const sansPage = rangees.filter((x) => !x.pages.length).length;
    if (sansPage) {
      dire();
      dire(`Les ${sansPage} autres sont dans la base d'accessoires mais aucune page publiée ne les lie : leur rupture ne se voit de nulle part.`);
    }
  }
  dire();
  dire(`### ${pl(delais.length, 'délai court', 'délais courts')}, pour mémoire — aucune action`);
  dire();
  for (const r of delais) dire(`- ${r.nom} (${r.marchand}) — ${r.dispoLisible}`);
}
dire();

/* 4 — disparitions */
dire(`## 4. Références disparues du catalogue`);
dire();
if (!disparues.length) dire(`Aucune.`);
else {
  dire(`Une absence du flux n'a jamais suffi : chacune a été confirmée sur sa propre fiche, parce que ce constat déclenche le retrait d'une référence du site. Quatre actions à l'Aide-Mémoire §04 — retirer la ligne du comparatif, poser un bandeau sur la fiche d'avis **sans la supprimer**, remplacer le modèle dans les guides par son successeur plutôt que de le retirer, passer le statut à « retiré » au plan et dans la sélection.`);
  dire();
  for (const r of disparues) {
    dire(`- **${r.nom}** (${r.marchand}) — publié ${r.publieTexte}`);
    dire(`  - preuve : ${r.preuve ?? 'absente du flux'}`);
    dire(`  - lien publié : ${r.url}`);
    if (r.candidats?.length) {
      dire(`  - **le même produit existe encore sous une autre adresse** — avant de retirer quoi que ce soit, vérifier ces ${pl(r.candidats.length, 'candidat')} :`);
      for (const c of r.candidats)
        dire(`    - ${c.nom} — ${prixFrancais(c.prix)}${Math.abs(c.prix - (r.publie ?? 0)) >= rel.seuil ? ` (**${c.prix > r.publie ? '+' : ''}${Math.round(c.prix - r.publie)} €** par rapport au prix publié)` : ''} — ${c.url}`);
      dire(`    Si c'est bien le même produit, ce n'est pas un retrait : c'est \`url\` **et** \`prix\` à changer ensemble dans \`design/prix-reperes.json\`, sinon le prix affiché ne vient plus du marchand vers lequel pointe le lien.`);
    } else {
      dire(`  - aucun produit du même nom ailleurs dans le catalogue : c'est bien un retrait (Aide-Mémoire §04).`);
    }
  }
}
dire();

/* 5 — ce qui n'a pas pu être lu, et les soupçons non confirmés */
const soupcons = rel.refs.filter((r) => r.absenteDuFlux && !r.disparue);
if (soupcons.length) {
  dire(`## 4 bis. Absentes du flux, mais toujours en vente`);
  dire();
  dire(`Le flux partenaire ne les liste plus, leur fiche les vend encore. Rien à faire aujourd'hui : c'est noté parce qu'une référence qui sort d'un flux en sort souvent définitivement quelques semaines plus tard.`);
  dire();
  for (const r of soupcons) dire(`- ${r.nom} (${r.marchand}) — ${r.preuve}`);
  dire();
}

dire(`## 5. Non relevées`);
dire();
if (!illisibles.length) dire(`Aucune.`);
else {
  dire(`Fiche morte ou markup changé : à ouvrir à la main. Leur prix publié reste en place, il n'est ni confirmé ni infirmé.`);
  dire();
  for (const r of illisibles) dire(`- ${r.nom} (${r.marchand}) — ${r.erreur ?? 'non lue'}${r.http ? ` · HTTP ${r.http}` : ''} — ${r.url}`);
}
dire();

/* 6 — les dates affichées qui ont pris du retard */
dire(`## 6. Les dates de relevé affichées`);
dire();
dire(`L'Aide-Mémoire §05 date le comparatif, les guides par budget et la page de sélection **à chaque relevé**, les avis et les duels seulement à chaque modification de fond. Une date rafraîchie sans changement est un mensonge ; une date qui traîne alors qu'on a vérifié le prix est une information perdue.`);
dire();
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const enDate = (jour, mois, annee) => `${annee}-${String(MOIS.indexOf(mois.toLowerCase()) + 1).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
const retards = [];
for (const f of SOURCES.pages) {
  const txt = readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/relev[ée]s?\s+chez\s+([^<.]{3,60}?)\s+le\s+(\d{1,2})(?:er)?\s+(\w+)\s+(20\d\d)/gi)) {
    const iso = enDate(m[2], m[3], m[4]);
    if (iso < DATE) retards.push({ route: routeDe(f), iso, lisible: m[0].trim() });
  }
}
if (!retards.length) dire(`Toutes les dates affichées sont à jour.`);
else {
  const parRoute = new Map();
  for (const r of retards) if (!parRoute.has(r.route) || parRoute.get(r.route).iso > r.iso) parRoute.set(r.route, r);
  dire(`${pl(parRoute.size, 'page affiche', 'pages affichent')} une date de relevé antérieure au ${DATE} :`);
  dire();
  for (const [route, r] of [...parRoute].sort((a, b) => a[1].iso.localeCompare(b[1].iso)))
    dire(`- \`${route}\` — « ${r.lisible} »${SUIT_CHAQUE_RELEVE.test(route) ? ' **← à faire suivre à chaque relevé**' : ' _(ne suit que les modifications de fond)_'}`);
}
dire();

dire(`---`);
dire();
dire(`_Écrit par \`scripts/prix/rapport.mjs\` depuis \`releves/prix-${DATE}.json\`. Ce fichier est réécrit à chaque relevé._`);

writeFileSync(join(SITE, 'PRIX-SEMAINE.md'), L.join('\n') + '\n', 'utf8');
writeFileSync(join(SITE, 'releves', `a-faire-${DATE}.json`), JSON.stringify(verdict, null, 1) + '\n', 'utf8');
console.log(`  ✓ PRIX-SEMAINE.md — ${bougent.length} à traiter, ${ruptures.length} rupture(s), ${disparues.length} disparition(s), ${illisibles.length} non relevée(s)`);
console.log(verdict.editorial
  ? `    une session éditoriale est nécessaire : ${verdict.raisons.join(' · ')}`
  : `    aucune décision éditoriale à prendre cette semaine`);
if (bougent.length) {
  const aReecrire = bougent.flatMap((r) => consequences(r).aReecrire).length;
  console.log(`    dont ${aReecrire} occurrence(s) qui demandent une réécriture, pas une substitution`);
}
