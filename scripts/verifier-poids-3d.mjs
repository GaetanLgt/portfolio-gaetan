#!/usr/bin/env node
/**
 * verifier-poids-3d.mjs — LE POIDS RÉELLEMENT DÉCLENCHÉ PAR UNE PAGE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ L'ANGLE MORT QU'IL FERME, MESURÉ LE 22/09/2026.
 *
 *   `verifier-poids.mjs` lit LE HTML et valide l'accueil à **340,1 Ko** pour un
 *   seuil de **1 Mo**. Et il a raison : c'est bien ce que pèse ce qu'il lit.
 *   Aucun verrou, en revanche, ne pesait ce que la page VA CHERCHER.
 *
 * ⭐⭐⭐ LA PHRASE QUE CE VERROU EXISTE POUR ÉCRIRE :
 *
 *     « UN VERROU HONNÊTE SUR SA MÉTHODE PEUT ÊTRE AVEUGLE SUR SON OBJET. »
 *
 *   `verifier-poids.mjs` ne ment pas : il annonce son périmètre (« lit le
 *   HTML ») et il le tient. Son angle mort n'est pas sa mesure, c'est son
 *   OBJET — il pèse la page sans peser ce que la page déclenche.
 *   *Le défaut n'est pas dans le chiffre : il est dans ce que le chiffre
 *   laisse dehors, et que personne ne nomme.*
 *
 * ───────────────────────────────────────────────────────────────────────────
 * ⛔⛔ DEUX FOIS CE VERROU S'EST TROMPÉ, ET LES DEUX ERREURS SONT GARDÉES ICI.
 *
 *   C'est le seul document du dépôt qui raconte ses propres faux pas, et c'est
 *   délibéré : *un verrou qui n'a jamais tort est un verrou qu'on n'a pas
 *   éprouvé.* Les deux erreurs ont été trouvées par la MESURE, pas par
 *   relecture — et les deux sont maintenant des assertions.
 *
 *   ERREUR 1 — « galion.glb est cité au premier chargement ».
 *     La recherche portait sur le contenu BRUT de `dist/index.html`. La chaîne
 *     `galion.glb` y apparaît bien… **une fois, dans le JSON-LD**
 *     (`"contentUrl": "https://gldigitallab.fr/galion.glb"`, entité `#galion`).
 *     ⛔ Une DONNÉE STRUCTURÉE n'est pas un TÉLÉCHARGEMENT : le JSON-LD décrit
 *       la ressource à un moteur, il ne la demande jamais.
 *     ⭐ Assertion qui en découle : les blocs `application/ld+json` sont retirés
 *       du HTML AVANT toute recherche de chargement. Et ce verrou le PROUVE en
 *       réexécutant la recherche sur le HTML amputé (voir « l'épreuve »).
 *
 *   ERREUR 2 — « les 12 GLB de dist/models/ sont déclenchés par construction
 *     dynamique (`/models/unite_${cle}.glb`) ».
 *     C'était une DÉDUCTION lue dans la SOURCE (`UnitesHero.vue` porte bien ce
 *     chemin). La mesure l'a démentie : `unite_` et `avatar_` ont **0 occurrence
 *     dans tout `dist/`** — les composants `UnitesHero.vue` et
 *     `CharactersHero.vue` **ne sont importés par PERSONNE** (cherché dans tout
 *     `src/` : `UnitesHero` n'apparaît que dans un COMMENTAIRE d'`App.vue`).
 *     ⛔ Ils ne sont donc pas dans le bundle, et aucun code livré ne construit
 *       ces chemins. **Ces 12 fichiers sont livrés et jamais demandés.**
 *     ⭐ Et le préfixe `/models/`, lui, EST dans le bundle d'entrée — mais il
 *       vient de `DecorTunnel.vue` et désigne une IMAGE (`decor-tunnel-1536.webp`).
 *       *Chercher un préfixe de dossier, c'est déjà supposer ce qu'il désigne.*
 *
 *   ⇒ **CE QUI EST RÉELLEMENT CHARGÉ N'EST PAS CE QU'ON CROYAIT.** Le fichier
 *     pèse, nomme, et distingue quatre états — au lieu d'en supposer un.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * ⛔ ET ON NE CONDAMNE PAS. Le chargement du galion est **différé à dessein** :
 *   `AccueilVaisseau.vue` monte `VaisseauNavigable` en `defineAsyncComponent`
 *   « parce qu'il tire Three.js ». **Ce n'est pas un coût du premier
 *   affichage**, et le confondre avec les 12 requêtes de `verifier-requetes.mjs`
 *   serait une faute de méthode. Ce verrou ne l'AFFIRME pas : il le MESURE.
 *
 *   ⭐ DESIGNER N'EST PAS CONDAMNER. Il rapporte et sort en 0.
 *     Pour condamner le jour où le studio le décidera : `POIDS_3D_BLOQUANT=1`.
 *
 * USAGE
 *   node scripts/verifier-poids-3d.mjs            → mesure et désigne
 *   node scripts/verifier-poids-3d.mjs --detail   → détail par fichier
 *   POIDS_3D_BLOQUANT=1 node scripts/verifier-poids-3d.mjs   → condamne
 *
 * CODES DE SORTIE
 *   0 = mesuré (défauts désignés ; condamne si POIDS_3D_BLOQUANT=1)
 *   1 = POIDS_3D_BLOQUANT=1 ET le poids réellement déclenché dépasse 1 Mo
 *   2 = RIEN MESURÉ (dist/ non construit, ou aucun .glb livré)
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RACINE = process.cwd();
const DIST = join(RACINE, 'dist');
const DETAIL = process.argv.includes('--detail');
const BLOQUANT = process.env.POIDS_3D_BLOQUANT === '1';

/** Le seuil de la charte du studio : « < 1 Mo par page ». */
const SEUIL = 1024 * 1024;

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

const L = (s = '') => console.log('  ' + s);
const ko = (o) => (o / 1024).toFixed(1).replace('.', ',') + ' Ko';
const mo = (o) => (o / 1024 / 1024).toFixed(2).replace('.', ',') + ' Mo';

console.log('\n' + '='.repeat(78));
console.log('  LE POIDS RÉELLEMENT DÉCLENCHÉ PAR UNE PAGE');
console.log('='.repeat(78));

const temoin = join(DIST, 'index.html');
if (!existsSync(temoin)) {
  console.error(rouge('  [KO]  dist/index.html est absent.'));
  console.error(gris('        Ce verrou mesure le BUILD : lancez `npm run build`.'));
  console.error(gris('        ⛔ Rien mesuré n\'est pas un verrou tenu.'));
  process.exit(2);
}

/* ─── 1. INVENTAIRE ────────────────────────────────────────────────────────── */

function marcher(d, acc = []) {
  if (!existsSync(d)) return acc;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) marcher(p, acc);
    else acc.push(p);
  }
  return acc;
}

const tousFichiers = marcher(DIST);
const glb = tousFichiers.filter((f) => f.toLowerCase().endsWith('.glb'));

if (glb.length === 0) {
  console.error(rouge('  [KO]  aucun .glb dans dist/.'));
  console.error(gris('        Soit la 3D a été retirée, soit `public/` n\'a pas été copié.'));
  console.error(gris('        Dans les deux cas on ne peut pas peser : sortie en 2, jamais 0.'));
  process.exit(2);
}

const fiches = glb.map((f) => ({
  rel: relative(DIST, f).replace(/\\/g, '/'),
  base: f.split(/[\\/]/).pop(),
  octets: statSync(f).size,
}));
const totalLivre = fiches.reduce((s, f) => s + f.octets, 0);

/* ─── 2. LE HTML LIVRÉ, DÉPOUILLÉ DE SES DONNÉES STRUCTURÉES ───────────────── */

/*
 * ⭐ L'ASSERTION QUI FERME L'ERREUR 1.
 *   Le JSON-LD DÉCRIT, il ne CHARGE pas. On le retire AVANT toute recherche,
 *   et on garde de côté ce qu'on a retiré — pour pouvoir le MONTRER, et pour
 *   prouver plus bas que la recherche se comporte bien autrement avec et sans.
 */
const htmlBrut = readFileSync(temoin, 'utf8');
const blocsLd = [...htmlBrut.matchAll(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi)].map((m) => m[0]);
const html = htmlBrut.replace(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi, '');

/** Chemins référencés par une balise qui CHARGE réellement. */
function cheminsChargesParBalise(source) {
  const trouves = [];
  const motifs = [
    /<link[^>]+rel=["'][^"']*(?:preload|prefetch|preconnect)["'][^>]*>/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<script[^>]+src=["']([^"']+)["']/gi,
    /<source[^>]+src=["']([^"']+)["']/gi,
    /<link[^>]+rel=["']stylesheet["'][^>]*>/gi,
  ];
  for (const re of motifs) {
    for (const m of source.matchAll(re)) {
      trouves.push(m[0]);
      if (m[1]) trouves.push(m[1]);
    }
  }
  return trouves.join(' ');
}
const chargeParBalise = cheminsChargesParBalise(html);

/* Les fichiers JS/CSS livrés, hors arborescences annexes. */
const scripts = tousFichiers.filter(
  (f) => /\.(js|css)$/i.test(f) && !/[\\/](TARDIS|Arche)[\\/]/.test(f)
);

/* Quels scripts sont chargés D'EMBLÉE (donc présents au premier affichage) ? */
const emblée = new Set();
for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) emblée.add(m[1].split('/').pop());
for (const m of html.matchAll(/rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/gi)) emblée.add(m[1].split('/').pop());
for (const m of html.matchAll(/href=["']([^"']+)["'][^>]*rel=["']modulepreload["']/gi)) emblée.add(m[1].split('/').pop());

const cacheScripts = new Map();
for (const f of scripts) {
  try {
    cacheScripts.set(f, readFileSync(f, 'utf8'));
  } catch {
    /* un fichier illisible ne doit pas faire tomber la mesure */
  }
}

/**
 * Où le nom de ce fichier est-il cité ?
 * ⚠️ On cherche le NOM DE BASE (`galion.glb`), pas un préfixe de dossier : un
 *    préfixe `/models/` peut désigner une image, et l'erreur 2 est née de là.
 */
function citerGLB(f) {
  const parBalise = chargeParBalise.includes(f.base);
  const dansEmblee = [];
  const dansDiffere = [];
  for (const [chemin, contenu] of cacheScripts) {
    if (!contenu.includes(f.base)) continue;
    const nom = chemin.split(/[\\/]/).pop();
    if (emblée.has(nom)) dansEmblee.push(nom);
    else dansDiffere.push(nom);
  }
  /*
   * Le nom peut aussi être CONSTRUIT à l'exécution (`unite_${cle}.glb`) : le
   * nom complet n'existe alors nulle part. On cherche donc la racine littérale
   * du nom (`unite_` pour `unite_wa.glb`). C'est une INFÉRENCE, et elle est
   * dite comme telle dans la sortie — jamais présentée comme une lecture.
   */
  const racine = f.base.replace(/\.[a-z0-9]+$/i, '').replace(/_[a-z0-9]+$/i, '_');
  const constructionDynamique = [];
  if (racine.length >= 4) {
    for (const [chemin, contenu] of cacheScripts) {
      if (contenu.includes(racine)) constructionDynamique.push(chemin.split(/[\\/]/).pop());
    }
  }
  return { parBalise, dansEmblee, dansDiffere, constructionDynamique, racine };
}

const etats = fiches.map((f) => {
  const c = citerGLB(f);
  let etat;
  if (c.parBalise) etat = 'charge';
  else if (c.dansEmblee.length > 0) etat = 'code-emblee';
  else if (c.dansDiffere.length > 0) etat = 'differe';
  else if (c.constructionDynamique.length > 0) etat = 'construit';
  else etat = 'orphelin';
  return { ...f, ...c, etat };
});

const parEtat = (e) => etats.filter((x) => x.etat === e);
const charges = parEtat('charge');
const codeEmblee = parEtat('code-emblee');
const differes = parEtat('differe');
const construits = parEtat('construit');
const orphelins = parEtat('orphelin');

const somme = (l) => l.reduce((s, x) => s + x.octets, 0);

/*
 * ⭐ LE POIDS RÉELLEMENT DÉCLENCHÉ = ce qui est payé parce que l'accueil existe.
 *   · `charge`      : demandé par une balise du HTML → payé avant tout rendu ;
 *   · `differe`     : demandé par un chunk non préchargé → payé après montage ;
 *   · `code-emblee` : le code qui connaît le nom est là, l'asset non → à dire,
 *                     mais il ne se télécharge PAS, donc il n'entre pas ici ;
 *   · `construit`   : nom reconstruit à l'exécution → même statut que differe ;
 *   · `orphelin`    : personne ne le demande → c'est du poids MORT au
 *                     déploiement, pas un coût de chargement. Autre défaut.
 */
const reellementDeclenche = somme(charges) + somme(differes) + somme(construits);
const poidsMort = somme(orphelins);

/* ─── 3. LA SORTIE ─────────────────────────────────────────────────────────── */

L(`build mesuré : dist/ (${statSync(temoin).mtime.toLocaleString('fr-FR')})`);
L(`fichiers .glb livrés : ${fiches.length}  ·  ${totalLivre.toLocaleString('fr-FR')} o (${mo(totalLivre)})`);
L('');

if (DETAIL) {
  L('Inventaire, du plus lourd au plus léger :');
  for (const f of etats.slice().sort((a, b) => b.octets - a.octets)) {
    L(gris(`  ${String(f.octets).padStart(9)} o  ${ko(f.octets).padStart(9)}  ${f.etat.padEnd(12)} ${f.rel}`));
  }
  L('');
}

L('─'.repeat(74));
L('  CE QUE CHAQUE VERROU VOIT, ET CE QU\'IL LAISSE DEHORS');
L('─'.repeat(74));
L(`  ${'verifier-poids.mjs'.padEnd(22)} lit le HTML de l'accueil`);
L(gris(`  ${''.padEnd(22)} → il valide 340,1 Ko contre un seuil de 1 Mo,`));
L(gris(`  ${''.padEnd(22)}   et il a RAISON : c'est ce que pèse ce qu'il lit.`));
L(`  ${'verifier-poids-3d.mjs'.padEnd(22)} pèse ce que la page VA CHERCHER`);
L('');

L('─'.repeat(74));
L('  LES QUATRE ÉTATS — ET LEQUEL COÛTE QUOI');
L('─'.repeat(74));
const ligne = (titre, liste, note) => {
  if (liste.length === 0) return;
  L(`  ${titre} — ${liste.length} fichier(s), ${liste.reduce((s, x) => s + x.octets, 0).toLocaleString('fr-FR')} o`);
  L(gris(`    ${note}`));
  L('');
};
ligne('CHARGÉS par une balise du HTML', charges,
  'ceux-là sont payés AVANT tout affichage. Ils comptent dans le seuil.');
ligne('DIFFÉRÉS — cités par un chunk non préchargé', differes,
  'le nom est connu du code, l\'asset n\'est demandé qu\'au montage asynchrone.');
ligne('CODE PRÉSENT D\'EMBLÉE, asset non demandé', codeEmblee,
  'le code qui connaît le nom est dans le bundle d\'entrée ; l\'asset, lui, ne se télécharge pas.');
ligne('CONSTRUITS à l\'exécution (inférence)', construits,
  'le nom complet n\'existe nulle part : on a cherché la racine littérale.');
ligne('ORPHELINS — livrés, jamais demandés', orphelins,
  'aucun fichier livré ne cite leur nom. Poids MORT au déploiement, pas un coût de chargement.');

if (DETAIL) {
  for (const f of etats) {
    if (f.etat !== 'orphelin' && f.etat !== 'charge') continue;
    L(gris(`  ${f.base.padEnd(20)} racine cherchée « ${f.racine} » → ${f.etat}`));
  }
  L('');
}

/* ─── LE COMPTE ────────────────────────────────────────────────────────────── */

const htmlOctets = statSync(temoin).size;

L('─'.repeat(74));
L('  LE COMPTE');
L('─'.repeat(74));
L(`  3D réellement déclenchée ........... ${String(reellementDeclenche).padStart(9)} o   (${mo(reellementDeclenche)})`);
if (poidsMort > 0) {
  L(`  3D livrée JAMAIS demandée .......... ${String(poidsMort).padStart(9)} o   (${mo(poidsMort)})`);
}
L(`  ─────────────────────────────────────────────────────────`);
L(`  3D présente dans le déploiement .... ${String(totalLivre).padStart(9)} o   (${mo(totalLivre)})`);
L(`  HTML livré de l'accueil ............ ${String(htmlOctets).padStart(9)} o   (${ko(htmlOctets)})`);
L(`  total si TOUT était payé .......... ${String(htmlOctets + totalLivre).padStart(9)} o   (${mo(htmlOctets + totalLivre)})`);
L('');
L(`  seuil de la charte ................. ${String(SEUIL).padStart(9)} o   (1,00 Mo)`);
L('');

if (reellementDeclenche > SEUIL) {
  L(jaune(`  ⚠️  ${mo(reellementDeclenche)} réellement déclenchés, au-dessus du seuil.`));
} else {
  L(vert(`  ${mo(reellementDeclenche)} réellement déclenchés — sous le seuil de 1 Mo.`));
}
if (poidsMort > 0) {
  L('');
  L(jaune(`  ⚠️  ET ${mo(poidsMort)} SONT LIVRÉS SANS ÊTRE DEMANDÉS, PAR PERSONNE.`));
  L(gris('      Le nom exact de ces fichiers n\'apparaît dans AUCUN fichier livré :'));
  for (const f of orphelins) L(gris(`        · ${f.rel}`));
  L(gris('      ⛔ Ce n\'est PAS un défaut du verrou de poids : c\'est du poids MORT'));
  L(gris('         dans le déploiement. Deux coûts différents, deux noms différents.'));
  L(gris('      ⭐ Ce verrou DÉSIGNE. Retirer ces fichiers demande de savoir s\'ils'));
  L(gris('         doivent revenir — et ça, c\'est une décision, pas une mesure.'));
}

L('');
L('  ⭐ CE QUE CE VERROU NE VOIT PAS, ET IL LE DIT :');
L(gris('     · il ne mesure pas le TEMPS de téléchargement — 2,72 Mo sur une ligne'));
L(gris('       lente coûtent plus que ce qu\'un seuil en octets laisse croire ;'));
L(gris('     · il ne mesure pas la MÉMOIRE GPU : un GLB de 2,72 Mo peut en occuper'));
L(gris('       bien davantage décompressé, et c\'est une autre mesure ;'));
L(gris('     · il ne dit pas si la 3D est BELLE, utile, ou nécessaire — c\'est une'));
L(gris('       décision de Gaëtan, pas un chiffre ;'));
L(gris('     · « orphelin » vaut pour CE build : un composant peut être réimporté'));
L(gris('       demain, et ces fichiers redeviendraient vivants.'));
L('='.repeat(78));
L('');

/* ─── L'ÉPREUVE : LE VERROU MORD-IL VRAIMENT ? ──────────────────────────────── */

/*
 * ⭐⭐⭐ ON PROUVE QUE L'ASSERTION MORD — exigence de la loi n°4.
 *   Un contrôle dont on n'a jamais vu l'échec n'est pas un contrôle : c'est une
 *   croyance. On rejoue donc la recherche de `galion.glb` SUR LE HTML BRUT, en
 *   gardant les données structurées, et on vérifie qu'elle trouve — puis sur le
 *   HTML dépouillé, et on vérifie qu'elle NE trouve PLUS dans le HTML.
 *   ⛔ Si les deux réponses étaient identiques, l'assertion ne servirait à rien,
 *     et ce verrou serait vert sans rien prouver.
 */
const L_ = (s) => console.log('  ' + s);
L_('─'.repeat(74));
L_('  L\'ÉPREUVE — LA RECHERCHE SE COMPORTE-T-ELLE VRAIMENT AUTREMENT ?');
L_('─'.repeat(74));
const galion = fiches.find((f) => f.base === 'galion.glb');
if (!galion) {
  L_(gris('  galion.glb n\'est pas livré : l\'épreuve ne s\'applique pas ici.'));
  L_(gris('  ⛔ On le DIT plutôt que d\'afficher un contrôle qui n\'a rien éprouvé.'));
} else {
  const dansBrut = htmlBrut.includes(galion.base);
  const dansDepouille = html.includes(galion.base);
  L_(`  « ${galion.base} » dans le HTML BRUT (JSON-LD compris) ....... ${dansBrut ? 'TROUVÉ' : 'absent'}`);
  L_(`  « ${galion.base} » dans le HTML DÉPOUILLÉ des données struct.. ${dansDepouille ? 'TROUVÉ' : 'absent'}`);
  L_(`  blocs de données structurées retirés : ${blocsLd.length}`);
  L_('');
  if (dansBrut && !dansDepouille) {
    L_(vert('  ✅ L\'assertion MORD : sans elle, ce verrou aurait annoncé un'));
    L_(vert('     téléchargement là où il n\'y a qu\'une DESCRIPTION.'));
  } else if (!dansBrut) {
    L_(jaune('  ⚠️  Le nom n\'apparaît pas dans le HTML brut : la démonstration ne'));
    L_(jaune('     porte pas. On le dit — une épreuve qui ne prouve rien n\'est pas'));
    L_(jaune('     une épreuve tenue.'));
  } else {
    L_(jaune('  ⚠️  Les deux recherches trouvent : l\'assertion ne change rien ICI.'));
    L_(jaune('     Elle reste utile, mais cet état ne la démontre pas.'));
  }
}
L_('='.repeat(78));
L_('');

/* ─── L'INTERRUPTEUR ───────────────────────────────────────────────────────── */

if (!BLOQUANT) {
  L(vert('  Mesuré et désigné. Aucune condamnation : le différé est mesuré.'));
  L(gris('  Pour condamner le jour venu : POIDS_3D_BLOQUANT=1'));
  L('='.repeat(78) + '\n');
  process.exit(0);
}

if (reellementDeclenche > SEUIL) {
  L(rouge(`  POIDS_3D_BLOQUANT=1 — ${mo(reellementDeclenche)} réellement déclenchés > 1,00 Mo.`));
  L('='.repeat(78) + '\n');
  process.exit(1);
}

L(vert('  POIDS_3D_BLOQUANT=1 — le poids réellement déclenché reste sous le seuil.'));
L('='.repeat(78) + '\n');
process.exit(0);
