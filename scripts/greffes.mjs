/**
 * Les greffes : ce qu'on publie diffère de la maquette, et c'est écrit quelque part.
 *
 * Un portage (`scripts/port.mjs`) recopie la maquette mot pour mot. Là où le texte de la
 * maquette est faux ou incomplet, la modification ne se tape pas dans la page générée — elle
 * est ici, déterministe, et rejouée à chaque portage. Le contrôle de fidélité
 * (`scripts/fidelite.mjs`) applique les mêmes greffes à la maquette avant de comparer : un
 * écart qu'il reste à dire est un vrai écart, une correction déclarée n'en est pas un.
 *
 * Deux sortes de greffes :
 *  - `design/port-corrections.json`  une chaîne remplacée par une autre, avec sa raison ;
 *  - `design/liste-attente-avis.csv` le tableau « en préparation » du hub Avis, reconstruit
 *    depuis `src/data/modeles.json` — la maquette n'en liste que 14 lignes sur 22.
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '');

function lireCsv(chemin) {
  const lignes = readFileSync(chemin, 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#'));
  const entetes = lignes[0].split(';');
  return lignes.slice(1).map((l) => {
    const c = l.split(';');
    return Object.fromEntries(entetes.map((e, i) => [e.trim(), (c[i] ?? '').trim()]));
  });
}

/** 219,99 -> « 219,99 € » ; 1198 -> « 1 198 € » avec une espace ordinaire, comme la maquette. */
export function prixFrancais(prix) {
  const decimals = Number.isInteger(prix) ? 0 : 2;
  const nu = prix
    .toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replace(/[\u202F\u00A0]/g, ' ');
  return `${nu} €`;
}

/** Les quatre tranches de prix telles que le hub les écrit. */
export function segmentDe(prix) {
  if (prix < 300) return 'Moins de 300 €';
  if (prix < 500) return '300 à 500 €';
  if (prix < 800) return '500 à 800 €';
  if (prix <= 1600) return '800 à 1600 €';
  throw new Error(`aucun segment pour ${prix} € — les tranches du hub ne couvrent pas ce modèle`);
}

/* -------------------------------- les liens marchands --------------------------------

   BipBop ne publie AUCUN lien affilié : le site n'a pas encore de programme d'affiliation,
   et les liens tagués qui viennent des maquettes appartiennent à un autre site de Jordane
   (`?offid=1&affid=3711` sur 126 URLs Thomann, la passerelle shareasale
   `donnnermusic.sjv.io/c/6882776/...` pour Donner). Publiés tels quels, ils enverraient
   les clics — et les commissions — sur ce compte-là.

   Les maquettes restent la source du texte ; seule l'adresse de destination est nettoyée,
   le contenu ne change pas d'un caractère. La règle est écrite ici parce qu'elle doit
   tenir au portage suivant : effacée de la page, elle y reviendrait avec la maquette.      */

/** Paramètres de traçage, où qu'ils soient. */
const PARAMS_DE_TRAÇAGE = /^(affid|offid|at|a_aid|pubref|irclickid|intsrc|sPartner|utm_.+|gclid|fbclid|msclkid)$/i;

/** Domaines qui ne sont pas le marchand mais une passerelle de tracking. */
const PASSERELLES = [/(^|\.)sjv\.io$/i, /(^|\.)shareasale\.com$/i, /(^|\.)anrdoezrs\.net$/i, /(^|\.)linksynergy\.com$/i, /(^|\.)awin1\.com$/i, /(^|\.)refer\d?\.com$/i, /(^|\.)dpbolvw\.net$/i];

/**
 * L'adresse publique d'un lien marchand : sans traçage, et hors passerelle si possible.
 * Renvoie `null` quand la passerelle ne dit pas où elle mène — dans ce cas le lien ne
 * part pas, plutôt que de publier un traquant dont on ignore la destination.
 */
export function urlPublique(brute) {
  let url;
  try { url = new URL(brute); } catch { return brute; }          // mailto:, #ancre, chemin relatif…
  if (PASSERELLES.some((r) => r.test(url.hostname))) {
    const cible = url.searchParams.get('u') || url.searchParams.get('url') || url.searchParams.get('target');
    if (!cible) return null;
    try { return urlPublique(decodeURIComponent(cible)); } catch { return urlPublique(cible); }
  }
  let touchée = false;
  for (const p of [...url.searchParams.keys()]) {
    if (PARAMS_DE_TRAÇAGE.test(p)) { url.searchParams.delete(p); touchée = true; }
  }
  if (!touchée) return brute;
  const reste = url.searchParams.toString();
  return url.origin + url.pathname + (reste ? `?${reste}` : '') + url.hash;
}

/** 1. Les remplacements déclarés. `au` introuvable est une erreur, pas un silence. */
export function appliquerCorrections(corps, fichier, { sobre = false } = {}) {
  const notes = [];
  const Corrections = JSON.parse(readFileSync(join(SITE, 'design', 'port-corrections.json'), 'utf8')).corrections ?? [];
  for (const c of Corrections) {
    if (c.fichier !== fichier) continue;
    const occurrences = corps.split(c.au).length - 1;
    if (occurrences === 0) {
      throw new Error(`la correction « ${c.au} » ne trouve plus son texte dans ${fichier} — la maquette a bougé, ou la divergence n'a plus lieu d'être : revoir design/port-corrections.json`);
    }
    if (occurrences > 1) {
      throw new Error(`la correction « ${c.au} » trouve ${occurrences} textes dans ${fichier} — elle est trop courte et en toucherait d'autres (un prix qui en mord un autre, un libellé répété)`);
    }
    corps = corps.split(c.au).join(c.remplace);
    if (!sobre) notes.push(`${fichier} : correction appliquée (${c.au} → ${c.remplace}) — ${c.pourquoi}`);
  }
  return { corps, notes };
}

const CHEMIN_LISTE = join(SITE, 'design', 'liste-attente-avis.csv');
const CHEMIN_BASE = join(SITE, 'src', 'data', 'modeles.json');

/**
 * 2. Le tableau « en préparation » du hub Avis, et les deux compteurs qui en découlent.
 *
 * La maquette liste 14 lignes et annonce « 23 AU PROGRAMME » pour 22 modèles sans avis. Les
 * lignes sont reconstruites avec le balisage de la maquette elle-même : seul le contenu change,
 * et prix comme segment viennent de la base, jamais de la saisie.
 */
export function grefferListeAttente(corps, { sobre = false } = {}) {
  const notes = [];
  const base = JSON.parse(readFileSync(CHEMIN_BASE, 'utf8'));
  const Modeles = Array.isArray(base) ? base : base.modeles;
  const parCle = new Map(Modeles.map((m) => [m.nom_complet, m]));
  const sansAvis = Modeles.filter((m) => !m.avis);
  const publies = Modeles.length - sansAvis.length;

  const Liste = lireCsv(CHEMIN_LISTE);
  const oublies = sansAvis.filter((m) => !Liste.some((l) => l.cle === m.nom_complet));
  if (oublies.length) {
    throw new Error(`liste d'attente incomplète : ${oublies.map((m) => m.nom_complet).join(', ')} — la base a un modèle sans avis que le hub ne cite pas`);
  }

  // Le tableau : 1 ligne d'en-tête + les lignes de données, dans l'ordre de la maquette.
  const rangees = [...corps.matchAll(/<div data-rwd="tblrow" style="display:grid;grid-template-columns:minmax\(150px[\s\S]*?<\/div>\n<\/div>/g)];
  if (rangees.length < 3) throw new Error('aucun tableau « en préparation » trouvé dans la maquette — greffe impossible');
  const donnees = rangees.slice(1);
  const fonds = donnees.map((r) => (r[0].match(/background:(#[0-9a-f]{3,6})/) ?? [])[1] ?? '#fff');
  const gabarit = donnees[0][0];

  const cellules = (l, fond) =>
    gabarit
      .replace(/background:#[0-9a-f]{3,6}/, `background:${fond}`)
      .replace(/(<div style="padding:13px 16px;font-weight:600">)[^<]*(<\/div>)/, `$1${l.affiche}$2`)
      .replace(/(<div style="padding:13px 16px;white-space:nowrap">)[^<]*(<\/div>)/, `$1${l.prix}$2`)
      .replace(/(<div style="padding:13px 16px;color:#4a3d31;white-space:nowrap">)[^<]*(<\/div>)/, `$1${l.segment}$2`)
      .replace(/(<div style="padding:13px 16px;color:#4a3d31;font-size:14px">)[^<]*(<\/div>)/, `$1${l.phrase}$2`);

  const lignes = Liste.map((l, i) => {
    const m = parCle.get(l.cle);
    if (!m) throw new Error(`liste-attente-avis.csv : « ${l.cle} » n'est dans src/data/modeles.json`);
    if (m.avis) throw new Error(`liste-attente-avis.csv : « ${l.cle} » a un avis publié, il n'a plus rien à faire dans la liste d'attente`);
    return cellules({ affiche: l.affiche, prix: prixFrancais(m.prix), segment: segmentDe(m.prix), phrase: l.phrase }, fonds[i % fonds.length]);
  });

  const debut = donnees[0].index;
  const fin = donnees[donnees.length - 1].index + donnees[donnees.length - 1][0].length;
  const remplacees = donnees.length;
  corps = corps.slice(0, debut) + lignes.join('\n') + corps.slice(fin);

  const badge = `${publies} AVIS PUBLIÉS · ${sansAvis.length} AU PROGRAMME`;
  if (/\d+ AVIS PUBLIÉS · \d+ AU PROGRAMME/.test(corps)) corps = corps.replace(/\d+ AVIS PUBLIÉS · \d+ AU PROGRAMME/, badge);
  if (/Les \d+ avis en préparation/.test(corps)) corps = corps.replace(/Les \d+ avis en préparation/, `Les ${sansAvis.length} avis en préparation`);

  if (!sobre) {
    const redigees = Liste.filter((l) => l.source === 'rédigée').length;
    notes.push(`Avis.dc.html : liste d'attente portée à ${lignes.length} lignes (${remplacees} dans la maquette), compteurs recalculés depuis la base — ${redigees} phrases rédigées ici, à relire par Jordane`);
  }
  return { corps, notes, lignes: lignes.length };
}

/* ----------------------------- les pages légales ------------------------------

   Les maquettes légales arrivent avec des champs en attente, surlignés en jaune :
   `[Nom / raison sociale]`, `[Adresse postale complète]`, `[Outil utilisé]`… Ils ne se
   publient pas tels quels. Les valeurs viennent des décisions de Jordane du 13/09 au soir :

     - responsable de traitement et directeur de publication : Jordane Feuillet ;
     - contact : le formulaire de la page Contact, en tous points — aucune adresse e-mail
       n'est publiée sur le site ;
     - hébergeur : Netlify, Inc. ;
     - mesure d'audience déclarée : Google Analytics (Google Ireland Limited). À la date de
       cette écriture, AUCUN outil de mesure n'est installé dans le code — Jordane a choisi de
       le déclarer quand même. Le jour où il l'installe, brancher le script derrière le
       consentement du bandeau et aligner la durée de conservation (GA4 plafonne à 14 mois,
       la page en dit 25) ;
     - pas de service d'envoi d'e-mails : le site ne fait pas de mailing, la ligne saute.

   Une ligne supprimée l'est du gabarit porté, pas du HTML publié à la main : elle reviendrait
   au portage suivant.                                                                    */

const PLACEHOLDERS = {
  'Politique-Confidentialite.dc.html': {
    'Nom / raison sociale': 'Jordane Feuillet',
    "Nom de l'hébergeur": 'Netlify, Inc.',
    'contact@bipbop.eu': '<a href="/contact/" style="color:#d2431f">la page Contact</a>',
    'Outil utilisé': 'Google Analytics — Google Ireland Limited',
  },
  'Mentions-Legales.dc.html': {
    'Adresse postale complète': 'non publiée — communiquée sur demande via la <a href="/contact/" style="color:#d2431f">page Contact</a>',
    'Numéro': 'non publié — communiqué sur demande via la <a href="/contact/" style="color:#d2431f">page Contact</a>',
    'Numéro ou mention de non-assujettissement': 'non publiée — communiquée sur demande via la <a href="/contact/" style="color:#d2431f">page Contact</a>',
    'contact@bipbop.eu': '<a href="/contact/" style="color:#d2431f">la page Contact</a>',
  },
};

/** Phrases réécrites parce que la décision « aucun lien affilié » les rend fausses. */
const PHRASES_LEGALES = {
  'Politique-Confidentialite.dc.html': [
    { au: 'Une demande par e-mail suffit : on répond sous trente jours au maximum.',
      remplace: 'Une demande depuis la <a href="/contact/" style="color:#d2431f">page Contact</a> suffit : on répond sous trente jours au maximum.' },
    { au: 'Quand tu cliques vers Thomann, un identifiant d\'affiliation est transmis au marchand. Il permet de rattacher une vente au site. Nous ne recevons aucune information nominative en retour.',
      remplace: 'Le site ne porte aucun identifiant d\'affiliation : un clic ouvre la fiche du marchand sans que rien ne rattache ta visite à BipBop. Les éventuelles données que le marchand dépose le sont sur son propre domaine, pour son compte.' },
    { au: 'Déposés par le marchand sur son propre domaine au moment du clic. Durée : variable selon le programme, souvent 30 jours.',
      remplace: 'Déposés par le marchand sur son propre domaine au moment du clic, pas par BipBop. Durée : variable selon le marchand.' },
    { au: 'La mesure d\'audience et les cookies d\'affiliation reposent sur ton consentement',
      remplace: 'La mesure d\'audience et les cookies non essentiels reposent sur ton consentement' },
  ],
  'Mentions-Legales.dc.html': [],
};

/** Retire une ligne complète du tableau, par son libellé de première colonne. */
function retirerLigne(corps, libelle, fichier) {
  const i = corps.indexOf('>' + libelle + '</div>');
  if (i < 0) throw new Error(`${fichier} : ligne « ${libelle} » introuvable — la maquette a bougé`);
  const debut = corps.lastIndexOf('<div data-rwd="sp"', i);
  const fin = corps.indexOf('</div></div>', i);
  if (debut < 0 || fin < 0) throw new Error(`${fichier} : bornes de la ligne « ${libelle} » introuvables`);
  return corps.slice(0, debut) + corps.slice(fin + '</div></div>'.length).replace(/^\n/, '');
}

const MARQUEUR_PLACEHOLDER = /<span style="background:#ffd166;border-bottom:2px solid #241c14;padding:1px 6px;font-weight:600">\[([^\]]+)\]<\/span>/g;

function grefferLegal(corps, fichier, { sobre = false } = {}) {
  const notes = [];
  const table = PLACEHOLDERS[fichier] ?? {};
  let combles = 0;
  corps = corps.replace(MARQUEUR_PLACEHOLDER, (tout, cle) => {
    if (!(cle in table)) return tout;
    combles++;
    return table[cle];
  });
  for (const p of PHRASES_LEGALES[fichier] ?? []) {
    const n = corps.split(p.au).length - 1;
    if (n !== 1) throw new Error(`${fichier} : la phrase « ${p.au.slice(0, 42)}… » trouve ${n} occurrence(s), greffe interrompue`);
    corps = corps.split(p.au).join(p.remplace);
  }
  if (fichier === 'Politique-Confidentialite.dc.html') corps = retirerLigne(corps, 'Envoi des e-mails', fichier);
  const restants = [...corps.matchAll(MARQUEUR_PLACEHOLDER)].map((m) => m[1]);
  if (restants.length) {
    throw new Error(`${fichier} : ${restants.length} champ(s) en attente non renseigné(s) : ${restants.join(', ')} — à ajouter dans scripts/greffes.mjs`);
  }
  if (!sobre) {
    notes.push(`${fichier} : ${combles} champ(s) en attente comblé(s), ${(PHRASES_LEGALES[fichier] ?? []).length} phrase(s) alignée(s) sur la décision « aucun lien affilié »${fichier === 'Politique-Confidentialite.dc.html' ? ', ligne « Envoi des e-mails » retirée' : ''}`);
  }
  return { corps, notes };
}

/* ------------------------- le formulaire de la page Contact -------------------------

   Dans la maquette, le formulaire est décoratif : les champs sont des `<div>`, les options de
   vraies `<span>`, la case de consentement un carré sans input, et le bouton est
   `type="button"`. Il ne peut rien envoyer. Cette greffe remplace le bloc par un formulaire
   Netlify réel — mêmes libellés, mêmes polices, mêmes bordures à 2,5 px, mêmes ombres — en
   gardant l'écriture du design mot pour mot, y compris les trois phrases d'exemple qui
   deviennent les `placeholder`.

   Côté réception : `data-netlify="true"` declare le formulaire à Netlify au build ; l'adresse
   qui reçoit les soumissions se règle dans le tableau de bord Netlify (Forms →
   Notifications), jamais dans la page — Jordane ne veut aucune adresse e-mail publiée.
   Le champ `_champ_invisible` est un honeypot anti-robot ; sans JavaScript, le navigateur
   poste le formulaire et Netlify affiche sa page de confirmation.                    */

const FORMULAIRE_CONTACT = `<form id="form-contact" name="contact" method="POST" action="/contact/" data-netlify="true" netlify-honeypot="_champ_invisible">
<input type="hidden" name="form-name" value="contact">
<div data-rwd="sp2" style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px">
<div style="display:flex;flex-direction:column;gap:7px">
<label for="prenom" style="font:700 13.5px 'Work Sans',sans-serif">Ton prénom</label><input class="champ" id="prenom" name="prenom" type="text" required placeholder="Camille" autocomplete="given-name"></div>
<div style="display:flex;flex-direction:column;gap:7px">
<label for="email" style="font:700 13.5px 'Work Sans',sans-serif">Ton e-mail</label><input class="champ" id="email" name="email" type="email" required placeholder="camille@exemple.fr" autocomplete="email"></div>
</div>
<fieldset style="border:0;margin:0 0 18px;padding:0">
<legend style="font:700 13.5px 'Work Sans',sans-serif;margin-bottom:9px">De quoi veux-tu parler ?</legend>
<div style="display:flex;flex-wrap:wrap;gap:8px">
<label class="pastille"><input type="radio" name="sujet" value="Quelle batterie choisir" checked required><span>Quelle batterie choisir</span></label>
<label class="pastille"><input type="radio" name="sujet" value="Signaler une erreur"><span>Signaler une erreur</span></label>
<label class="pastille"><input type="radio" name="sujet" value="Je suis une marque"><span>Je suis une marque</span></label>
<label class="pastille"><input type="radio" name="sujet" value="Autre"><span>Autre</span></label>
</div></fieldset>
<div style="margin-bottom:18px;display:flex;flex-direction:column;gap:7px">
<label for="message" style="font:700 13.5px 'Work Sans',sans-serif">Ton message</label><textarea class="champ" id="message" name="message" rows="7" required placeholder="Dis-nous ton budget, la place dont tu disposes et si tu vis en appartement. Avec ça on peut déjà répondre quelque chose d'utile."></textarea></div>
<label class="case" style="display:flex;align-items:flex-start;gap:11px;margin-bottom:22px">
<input type="checkbox" name="consentement" value="oui" required><span class="carre" aria-hidden="true"></span>
<span style="font:400 13.5px/1.5 'Work Sans',sans-serif;color:#5a4c3e;max-width:520px">J'accepte que mon message soit conservé le temps d'obtenir une réponse. Voir la <a href="/politique-confidentialite/" style="color:#d2431f">politique de confidentialité</a>.</span></label>
<p id="erreur" hidden role="alert" style="font:600 14px 'Work Sans',sans-serif;color:#8a1f00;background:#fde3dd;border:2.5px solid #241c14;border-radius:12px;padding:12px 14px;margin:0 0 16px"></p>
<input type="text" name="_champ_invisible" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
<button id="envoi" type="submit" style="display:inline-block;font:700 16px 'Work Sans',sans-serif;text-decoration:none;color:#fff;background:#d2431f;border:2.5px solid #241c14;padding:15px 24px;border-radius:13px;box-shadow:5px 5px 0 #241c14;cursor:pointer">Envoyer le message</button>
</form>
<div id="envoye" hidden style="background:#e7f3f2;border:2.5px solid #241c14;border-radius:16px;padding:22px 24px">
<div style="font:800 22px 'Bricolage Grotesque',sans-serif;color:#0f5f5a;margin-bottom:8px">C'est envoyé.</div>
<p style="font:400 15.5px/1.6 'Work Sans',sans-serif;color:#264c49;margin:0">Ton message est arrivé. On répond en général sous 48 heures, et jamais par un robot.</p></div>
<style>
#form-contact .champ{background:#fff;border:2.5px solid #241c14;border-radius:12px;padding:13px 15px;font:400 15px 'Work Sans',sans-serif;color:#241c14;width:100%;box-sizing:border-box}
#form-contact .champ::placeholder{color:#7a6b59}
#form-contact .champ:focus{outline:none;border-color:#0f7d76;box-shadow:0 0 0 3px rgba(15,125,118,.18)}
#form-contact textarea.champ{min-height:150px;line-height:1.6;resize:vertical}
#form-contact .pastille input{position:absolute;opacity:0;width:1px;height:1px}
#form-contact .pastille span{font:500 14px 'Work Sans',sans-serif;padding:9px 14px;border-radius:11px;border:2px solid #e4d8c6;color:#5a4c3e;cursor:pointer;display:inline-block}
#form-contact .pastille:has(input:checked) span{background:#ffd166;border:2.5px solid #241c14;color:#241c14;font-weight:700}
#form-contact .pastille:has(input:focus-visible) span{outline:2.5px solid #0f7d76;outline-offset:2px}
#form-contact .case input{position:absolute;opacity:0;width:1px;height:1px}
#form-contact .case .carre{width:20px;height:20px;flex:none;border-radius:6px;border:2.5px solid #241c14;background:#fff;margin-top:2px;display:block;position:relative}
#form-contact .case:has(input:checked) .carre{background:#ffd166}
#form-contact .case:has(input:checked) .carre::after{content:"";position:absolute;left:5px;top:1px;width:6px;height:11px;border:solid #241c14;border-width:0 2.5px 2.5px 0;transform:rotate(42deg)}
#form-contact .case:has(input:focus-visible) .carre{outline:2.5px solid #0f7d76;outline-offset:2px}
</style>
<script>
(function(){
  var f=document.getElementById('form-contact');if(!f)return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var b=document.getElementById('envoi'),d=new FormData(f);
    b.disabled=true;b.textContent="Envoi en cours…";
    fetch(f.getAttribute('action')||'/contact/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(d).toString()})
    .then(function(r){if(!r.ok)throw new Error(r.status);f.hidden=true;var m=document.getElementById('envoye');m.hidden=false;m.scrollIntoView({behavior:'smooth',block:'center'});})
    .catch(function(){b.disabled=false;b.textContent='Envoyer le message';var e2=document.getElementById('erreur');e2.hidden=false;e2.textContent="L'envoi n'a pas abouti. Réessaie dans un instant — si ça persiste, le message est bien parti vers la page de Netlify, signale-le nous.";});
  });
})();
</script>`;

function grefferContact(corps, { sobre = false } = {}) {
  const notes = [];
  // 1. le bloc décoratif devient un formulaire réel : on remplace l'intérieur du cadre blanc.
  const ouverture = '<div style="background:#fff;border:2.5px solid #241c14;border-radius:20px;padding:28px 30px;box-shadow:6px 6px 0 #241c14">';
  const iOuverture = corps.indexOf(ouverture);
  const iBouton = corps.indexOf('Envoyer le message</button>');
  if (iOuverture < 0 || iBouton < 0 || iBouton < iOuverture) {
    throw new Error('Contact.dc.html : les bornes du formulaire décoratif sont introuvables — la maquette a bougé');
  }
  const iFinBouton = corps.indexOf('\n', iBouton);
  corps = corps.slice(0, iOuverture + ouverture.length) + '\n' + FORMULAIRE_CONTACT + corps.slice(iFinBouton);

  // 2. l'adresse e-mail ne se publie pas : l'encart « Par e-mail, si tu préfères » sort de la page.
  const iEncart = corps.indexOf('Par e-mail, si tu préfères');
  if (iEncart < 0) throw new Error('Contact.dc.html : encart « Par e-mail » introuvable — déjà retiré, ou maquette changée');
  const debutEncart = corps.lastIndexOf('<div style="background:#e7f3f2;', iEncart);
  const iQueue = corps.indexOf('On lit tout.', iEncart);
  const finEncart = corps.indexOf('</div>', iQueue) + '</div>'.length;
  if (debutEncart < 0 || iQueue < 0 || finEncart <= debutEncart) throw new Error('Contact.dc.html : bornes de l\'encart e-mail introuvables');
  corps = corps.slice(0, debutEncart) + corps.slice(finEncart).replace(/^\n/, '');

  if (!sobre) notes.push('Contact.dc.html : formulaire décoratif remplacé par un formulaire Netlify réel (nom, e-mail, sujet, message, consentement, honeypot) et encart e-mail retiré');
  return { corps, notes };
}

/* ------------------------- le lien « Plan du site » au pied de page -------------------------

   Le plan du site (page + sitemap XML) est une bonne pratique SEO et un repère pour les
   lecteurs : il doit être accessible depuis le pied de page, donc depuis les 37 pages portées.
   Les maquettes Claude Design ne le contiennent pas et ne le contiendront pas avant que le
   design soit refait — la ligne est donc greffée, comme tout ce qui diverge d'une maquette.
   Elle est écrite sur le modèle des voisines de la colonne « LE SITE », attribut de style
   compris, pour que le pied de page reste homogène.

   La chaîne cherchée est le texte du dernier lien de la colonne, pas son `href` : dans la
   maquette l'adresse pointe encore vers `Politique-Confidentialite.dc.html` et n'est réécrite
   qu'après. C'est ce texte qui est identique des deux côtés, vérifié sur les 37 pages.        */

const DERNIER_LIEN_LEGAL = '>Politique de confidentialité</a>';
const LIEN_PLAN = '<a href="/plan-du-site/" style="color:#ece2d4;text-decoration:none;display:block;padding:6px 0;font-weight:500" style-hover="color:#ffd166">Plan du site</a>';

export function grefferPlanDuSite(corps, { sobre = false } = {}) {
  const notes = [];
  const occurrences = corps.split(DERNIER_LIEN_LEGAL).length - 1;
  if (occurrences === 0) return { corps, notes, greffe: false }; // page sans pied de page (404, composants)
  if (occurrences > 1) {
    throw new Error(`lien « Politique de confidentialité » trouvé ${occurrences} fois : la greffe du plan du site ne saurait plus où poser le lien`);
  }
  if (corps.includes('href="/plan-du-site/"')) throw new Error('la greffe du plan du site tourne deux fois sur le même corps — vérifier l\u0027ordre dans appliquerGreffes');
  corps = corps.replace(DERNIER_LIEN_LEGAL, DERNIER_LIEN_LEGAL + LIEN_PLAN);
  if (!sobre) notes.push('pied de page : lien « Plan du site » greffé après « Politique de confidentialité » — la maquette ne le contient pas');
  return { corps, notes, greffe: true };
}

/** Point d'entrée : toutes les greffes qui regardent une maquette, dans un ordre fixe.
    Les greffes globales (pied de page) passent en dernier, une correction de texte ne doit
    pas pouvoir déplacer le point où elles s'accrochent. */
export function appliquerGreffes(corps, fichier, options = {}) {
  const notes = [];
  if (fichier === 'Avis.dc.html') {
    const g = grefferListeAttente(corps, options);
    corps = g.corps;
    notes.push(...g.notes);
  }
  if (fichier === 'Contact.dc.html') {
    const g = grefferContact(corps, options);
    corps = g.corps;
    notes.push(...g.notes);
  }
  if (fichier in PLACEHOLDERS) {
    const g = grefferLegal(corps, fichier, options);
    corps = g.corps;
    notes.push(...g.notes);
  }
  const c = appliquerCorrections(corps, fichier, options);
  corps = c.corps;
  notes.push(...c.notes);
  const plan = grefferPlanDuSite(corps, options);
  return { corps: plan.corps, notes: [...notes, ...plan.notes] };
}
