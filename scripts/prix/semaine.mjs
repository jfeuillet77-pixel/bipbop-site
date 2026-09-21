#!/usr/bin/env node
// Usage : node scripts/prix/semaine.mjs [--sans-claude] [--sans-livraison] [--date AAAA-MM-JJ]
//
// Le rendez-vous du lundi, en une commande : `npm run prix:semaine`.
// C'est ce script que launchd lance chaque lundi à 8 h 17 (scripts/prix/installer-le-rendez-vous.sh).
//
//   0. flux        télécharge les catalogues Thomann et Donner
//   1. relever     prix par les flux, disponibilité par les pages, disparitions par les flux
//   2. rapport     PRIX-SEMAINE.md : ce qui a bougé, et tout ce que ça oblige à mettre à jour
//   3. appliquer   écrit les prix dans design/prix-reperes.json, et la date du relevé
//   4. éditorial   une session Claude qui fait les réécritures — seulement s'il y en a
//   5. données     npm run data, puis npm run port : les 37 pages se réécrivent depuis leurs maquettes
//   6. publier     verse le relevé dans l'historique de /suivi-des-prix/
//   7. contrôle    npm run check et npm run fidelite, les deux lois du commit
//   8. livraison   commit et push sur dev, donc déploiement Netlify
//
// TROIS REFUS DE LIVRER, parce que ce script tourne sans personne devant :
//
//   - le dépôt n'était pas propre au démarrage. Quelqu'un travaillait dessus : le lundi fait son
//     relevé et son rapport, mais il ne commite rien. Balayer le travail en cours d'un `git add -A`
//     serait le pire service à rendre.
//   - un contrôle échoue. `check` mesure la largeur de défilement dans Chrome, `fidelite` compare
//     chaque page à sa maquette. Une page peut paraître correcte et casser : rien ne part.
//   - la session éditoriale s'est arrêtée en erreur, ou le rapport annonce encore du travail
//     qu'elle n'a pas fait. On préfère un site avec un prix d'une semaine à un site incohérent.
//
// Dans les trois cas le travail n'est pas perdu : il est sur le disque, PRIX-SEMAINE.md dit quoi
// faire, et `git status` dit où on en est.
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MAQUETTES = join(SITE, '..', 'Claude Design - MàJ');
process.chdir(SITE);

const argv = process.argv.slice(2);
const arg = (k) => (argv.includes(k) ? argv[argv.indexOf(k) + 1] : undefined);
const SANS_CLAUDE = argv.includes('--sans-claude');
const SANS_LIVRAISON = argv.includes('--sans-livraison');
const DATE = arg('--date') ?? new Date().toISOString().slice(0, 10);

const JOURNAL = join(SITE, 'releves', 'journal.log');
mkdirSync(dirname(JOURNAL), { recursive: true });
const dire = (l = '') => { console.log(l); appendFileSync(JOURNAL, l + '\n'); };

const debut = Date.now();
dire(`\n═══════════════ relevé du ${DATE} · ${new Date().toISOString()} ═══════════════`);

/** Ce qu'on refuse de balayer : un dépôt déjà modifié au démarrage. */
const gitSortie = (...a) => spawnSync('git', a, { encoding: 'utf8' }).stdout?.trim() ?? '';
const branche = gitSortie('branch', '--show-current');
const saleAuDepart = gitSortie('status', '--porcelain');
if (saleAuDepart) {
  dire(`  ⚠ dépôt non propre au démarrage (${saleAuDepart.split('\n').length} fichier(s) modifiés) — le relevé se fera, la livraison non.`);
  for (const l of saleAuDepart.split('\n').slice(0, 12)) dire(`      ${l}`);
}

/* ------------------------------------- les étapes mécaniques ------------------------------------- */

function etape(nom, cmd, args, { fatal = true, timeout = 1800000 } = {}) {
  dire(`\n--- ${nom} ---`);
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64e6, timeout, cwd: SITE });
  const sortie = ((r.stdout ?? '') + (r.stderr ?? '')).trimEnd();
  if (sortie) for (const l of sortie.split('\n')) dire(l);
  if (r.status !== 0) {
    dire(`\n  ✗ « ${nom} » s'est arrêté (code ${r.status ?? r.signal}).`);
    if (fatal) { fin(r.status || 1, `étape « ${nom} » en échec`); }
    return false;
  }
  return true;
}

function fin(code, pourquoi) {
  dire(`\n═══════════════ terminé en ${Math.round((Date.now() - debut) / 1000)} s${code ? ` — ${pourquoi}` : ''} ═══════════════`);
  process.exit(code);
}

etape('flux', process.execPath, ['scripts/prix/telecharger-flux.mjs']);
etape('relever', process.execPath, ['scripts/prix/relever.mjs', '--date', DATE], { timeout: 2400000 });
etape('rapport', process.execPath, ['scripts/prix/rapport.mjs', '--date', DATE]);
etape('appliquer', process.execPath, ['scripts/prix/appliquer.mjs', '--date', DATE, '--appliquer']);

/* --------------------------------------- l'étape éditoriale -------------------------------------- */

const releve = JSON.parse(readFileSync(join(SITE, 'releves', `prix-${DATE}.json`), 'utf8'));
const b = releve.bilan;

// C'est le rapport qui décide, pas le bilan brut : quatorze ruptures dont aucune n'est liée
// depuis une page publiée ne demandent aucune décision, et ouvrir une session pour elles chaque
// lundi userait la seule chose qui distingue ce rendez-vous d'un script de scraping.
const verdict = JSON.parse(readFileSync(join(SITE, 'releves', `a-faire-${DATE}.json`), 'utf8'));
const duTravail = verdict.editorial;

const CONSIGNE = `Tu es la session du lundi de BipBop. Le relevé de prix hebdomadaire vient de tourner.

Lis d'abord PRIX-SEMAINE.md à la racine : il contient le relevé du ${DATE}, ce qui a bougé, et
l'inventaire exact de tout ce que ça oblige à mettre à jour, fichier par fichier et ligne par ligne.
Lis aussi CLAUDE.md : ses cinq lois ne se discutent pas.

TON TRAVAIL — la partie qu'aucun script ne peut faire :

1. Les prix eux-mêmes sont déjà écrits dans design/prix-reperes.json. N'y touche que si le rapport
   signale un prix retenu (rupture, accessoire sans entrée) et que tu décides quoi en faire.

2. Écris les entrées de design/port-corrections.json pour chaque phrase que le rapport marque
   « à réécrire ». C'est le seul endroit où un écart avec une maquette se déclare (loi 2).
   Chaque entrée porte fichier / au / remplace / pourquoi. La chaîne « au » doit apparaitre
   EXACTEMENT UNE FOIS dans le corps porté : si elle est ambiguë, allonge-la. Un portage qui
   échoue est un garde-fou, pas un bug.

3. Réécris vraiment les phrases, ne substitue pas les montants. « Au même prix » quand l'écart
   est devenu de 11 € est faux ; « onze euros de moins » quand il est devenu 9 € est faux aussi.
   Le rapport te donne la phrase entière et son contexte. Quand un écart de duel s'inverse, c'est
   le verdict qu'il faut relire, pas seulement le chiffre.

4. Quand un montant est partagé par plusieurs modèles, le rapport te le dit en tête de section.
   Vérifie de quel modèle parle chaque ligne avant de la toucher.

5. Mets à jour les dates « MIS À JOUR » des seules pages réellement modifiées, et les meta
   descriptions qui citent un montant devenu faux (design/seo-titles-meta.md garde la fiche ;
   120 à 155 caractères ; jamais de montant dans un title).

6. Si une référence a disparu du catalogue ou reste en rupture, applique l'Aide-Mémoire §04 :
   bandeau sur la fiche d'avis sans la supprimer, remplacement dans les guides, ligne retirée du
   comparatif. En cas de doute, ne retire rien et écris ce que tu as constaté dans le journal.

INTERDITS : ne modifie jamais un fichier de src/pages/ (le portage l'écrase), ni une maquette
.dc.html du dossier Claude Design (c'est la source de l'auteur). Pas de lien affilié. Pas de
virgule avant « et » ni avant « ou ». Pas de tiret cadratin. Tutoiement partout.

QUAND TU AS FINI : lance « npm run data && npm run port » et corrige jusqu'à ce que le portage
passe. Puis ajoute au JOURNAL.md une entrée datée du ${DATE} qui dit ce que tu as changé et
pourquoi. Ne commite rien : c'est le script qui livre.`;

let editorialOk = true;
if (!duTravail) {
  dire(`\n--- éditorial ---\n  rien à décider : ${b.controlees} références contrôlées, aucun mouvement au-dessus de ${releve.seuil} €, aucune rupture durable sur une page publiée, aucune disparition.`);
} else if (SANS_CLAUDE) {
  dire(`\n--- éditorial ---\n  ⚠ --sans-claude, alors qu'il y a à faire : ${verdict.raisons.join(' · ')}. Voir PRIX-SEMAINE.md.`);
  editorialOk = false;
} else {
  dire(`\n--- éditorial ---`);
  dire(`  session Claude : ${verdict.raisons.join(' · ')}.`);
  const r = spawnSync('claude', [
    '-p', CONSIGNE,
    '--add-dir', MAQUETTES,                    // les maquettes vivent hors du dépôt
    '--permission-mode', 'acceptEdits',
    '--allowedTools', 'Read', 'Edit', 'Write', 'Grep', 'Glob',
    'Bash(node *)', 'Bash(npm run *)', 'Bash(git diff *)', 'Bash(git status *)',
    '--model', 'opus',
  ], { encoding: 'utf8', maxBuffer: 64e6, timeout: 3600000, cwd: SITE });
  const sortie = ((r.stdout ?? '') + (r.stderr ?? '')).trimEnd();
  if (sortie) for (const l of sortie.split('\n')) dire(`  │ ${l}`);
  if (r.status !== 0) {
    dire(`  ✗ la session éditoriale s'est arrêtée (code ${r.status ?? r.signal}). Rien ne sera livré.`);
    editorialOk = false;
  }
}

/* ------------------------------------ données, page, contrôles ----------------------------------- */

// Aucune de ces étapes n'est fatale : même quand elle casse, on veut atteindre la section
// « livraison », qui est le seul endroit qui dise pourquoi rien n'est parti. Sortir en silence
// au milieu laisserait un dépôt à moitié modifié sans un mot dans le journal.
const construitOk = etape('données', 'npm', ['run', 'data'], { fatal: false })
  && etape('portage', 'npm', ['run', 'port'], { fatal: false });
etape('publier', process.execPath, ['scripts/prix/publier.mjs', '--date', DATE], { fatal: false });

const controleOk = construitOk
  && etape('contrôle', 'npm', ['run', 'check'], { fatal: false, timeout: 1800000 })
  && etape('fidélité', 'npm', ['run', 'fidelite'], { fatal: false });

/* --------------------------------------------- livraison ----------------------------------------- */

dire(`\n--- livraison ---`);
const refus = [
  saleAuDepart && 'le dépôt était déjà modifié au démarrage',
  !editorialOk && 'le travail éditorial n\'est pas fait',
  !construitOk && 'npm run data ou npm run port a échoué',
  construitOk && !controleOk && 'npm run check ou npm run fidelite a échoué',
  SANS_LIVRAISON && '--sans-livraison',
].filter(Boolean);

if (refus.length) {
  dire(`  ✗ rien n'est livré : ${refus.join(', ')}.`);
  dire(`    Le relevé et le rapport sont sur le disque. \`git status\` dit où on en est.`);
  fin(0, '');
}

if (!gitSortie('status', '--porcelain')) {
  dire(`  rien n'a changé dans le dépôt : pas de commit. (${b.controlees} références contrôlées quand même.)`);
  fin(0, '');
}

const mouvements = releve.refs.filter((r) => r.aTraiter);
const titre = mouvements.length
  ? `fix(prix): releve du ${DATE}, ${mouvements.length} prix a jour`
  : `chore(prix): releve du ${DATE}, aucun mouvement`;
const corps = [
  mouvements.length
    ? mouvements.map((r) => `- ${r.nom} : ${r.publieTexte} -> ${r.releve} EUR (${r.ecart > 0 ? '+' : ''}${r.ecart})${r.franchitUnSeuil ? `, change de tranche` : ''}`).join('\n')
    : `Les ${b.controlees} references du site relevees chez les trois marchands, aucun ecart n'atteint\nle seuil de ${releve.seuil} EUR. La date de releve suit, et /suivi-des-prix/ garde la trace du passage.`,
  '',
  `Releve automatique du lundi (scripts/prix/semaine.mjs). Prix Thomann et Donner par leurs flux`,
  `partenaires, Woodbrass et disponibilites par lecture des pages. Detail : releves/prix-${DATE}.json`,
  `et PRIX-SEMAINE.md.`,
  '',
  'Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>',
].join('\n');

spawnSync('git', ['add', '-A'], { cwd: SITE });
const commit = spawnSync('git', ['commit', '-m', titre, '-m', corps], { encoding: 'utf8', cwd: SITE });
dire(((commit.stdout ?? '') + (commit.stderr ?? '')).trimEnd());
if (commit.status !== 0) fin(commit.status, 'le commit a échoué');

const push = spawnSync('git', ['push', 'origin', branche], { encoding: 'utf8', cwd: SITE });
dire(((push.stdout ?? '') + (push.stderr ?? '')).trimEnd());
if (push.status !== 0) {
  dire(`  ✗ le push a échoué. Le commit est fait localement : régler le conflit à la main, puis pousser.`);
  fin(push.status, 'le push a échoué');
}
dire(`  ✓ livré sur ${branche} — Netlify déploie.`);
fin(0, '');
