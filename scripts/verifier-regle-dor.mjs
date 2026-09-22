#!/usr/bin/env node
/*
 * ============================================================================
 * verifier-regle-dor.mjs — LE VERROU QUI REND LA RÈGLE D'OR EXÉCUTABLE.
 * ============================================================================
 *
 * POURQUOI CE FICHIER EXISTE — LE DÉFAUT QU'IL FERME, MESURÉ
 * ----------------------------------------------------------
 * La règle d'or est écrite depuis le 14/09/2026 dans l'en-tête de
 * `forge-ia/banka.mjs` (lignes 20 à 28). Là, elle est RESPECTÉE. Partout ailleurs
 * elle est CITÉE — et **une règle citée n'est pas une règle tenue**.
 *
 * Mesuré le 22/09/2026 (`modeles/REGLE-D-OR-ET-BORNE-2026-09-22.md`, § 4) :
 * **neuf violations en une seule journée**, et cinq d'entre elles par l'agent qui
 * écrivait le document. Ce n'est pas une coïncidence : c'est la même faute, neuf
 * fois. Deux exemples, parce qu'ils disent tout :
 *   · un agent a décrit une capture Firefox comme « Page bloquée » alors que le
 *     navigateur de Gaëtan est en anglais — **un texte inventé** ;
 *   · un cumul a écrit « 13 transcriptions vides » ; aucune mesure ne donne 13.
 *     **C'est 9.** Un chiffre plausible et faux.
 *
 * ⭐ Et la leçon qui les tient tous : **le second défaut ne se voit jamais au
 *    moment où on le commet.** *Un champ vide et signalé saute aux yeux ; un champ
 *    plausible et faux ne saute pas aux yeux — c'est exactement pour ça qu'il coûte
 *    un client.*
 *
 * Donc la règle existe, elle est belle, et elle n'est pas outillée. D'où ce fichier.
 *
 * LA RÈGLE D'OR
 * -------------
 * Citée VERBATIM depuis `forge-ia/banka.mjs`, lignes 22 à 28 — jamais reformulée,
 * parce qu'une règle reformulée est une règle qu'on s'approprie :
 *
 *     « Banka n'invente JAMAIS un email, un montant ni une date — même "pour que ce
 *      soit complet". Ce qui n'est pas écrit dans le document reste vide et est
 *      SIGNALÉ comme manquant. Un champ vide et signalé vaut mieux qu'un champ
 *      plausible et faux : le second coûte un client, le premier coûte une ligne de
 *      rapport.
 *      Toute écriture passe par `--ajouter` avec des arguments EXPLICITES : la
 *      machine ne devine rien, elle enregistre ce qu'un humain affirme. »
 *
 * Deux règles qui vont par paire : **(1) on n'invente rien** · **(2) on n'agit que
 * sur du déclaré**. Et « borné » n'est pas un second principe — c'est la règle 2
 * appliquée au TEMPS et à la PORTÉE : *ce qui n'a pas de limite ne peut pas être
 * mesuré, et ce qui ne peut pas être mesuré ne peut pas être tenu.*
 *
 * Ce verrou mesure donc la seule chose qui soit mesurable dans un fichier : **ce que
 * l'outil DÉCLARE de lui-même.** Pas ce qu'il vaut — ce qu'il dit.
 *
 * ⚠️ SUR QUOI IL PORTE, ET C'EST MESURÉ : la table du § 3 du document ci-dessus dit
 *    qu'un SCRIPT porte trois choses dans son en-tête — **des arguments explicites ·
 *    un code de sortie · une section « ce qu'il ne fait pas »**. Ce verrou contrôle
 *    les trois, et c'est exactement le périmètre qu'on lui a donné.
 *
 * CE QUE CET OUTIL NE FAIT PAS
 * ----------------------------
 *   · ⛔ **Il ne CONDAMNE pas — par défaut, il DÉSIGNE.** Tous les scripts du dépôt
 *     ne déclarent pas leurs bornes, et c'est normal : la règle n'a jamais été
 *     appliquée au parc. S'il sortait en 1, **il rendrait la CI rouge le jour de sa
 *     naissance**, et on apprendrait à le contourner. *Un garde-fou qui bloque tout
 *     le premier jour est un garde-fou qu'on désactive.*
 *     ⇒ Il désigne, il compte, il liste — **et il sort en 0**. Pour condamner, il
 *       faut le DEMANDER : `REGLE_OR_BLOQUANT=1`.
 *   · Il n'écrit RIEN. Aucun fichier n'est modifié, aucun remplacement n'est
 *     proposé, aucun `git` n'est appelé. C'est un constat, pas une réparation.
 *     *Une correction automatique sur un en-tête de script est un remplacement à
 *     l'aveugle — le studio a payé ça trois fois en une nuit.*
 *   · Il ne modifie PAS `prerendre.js` ni `auditer-tout.mjs`, **même quand il les
 *     désigne**. Il les lit, c'est tout.
 *   · Il n'analyse QUE `scripts/*.mjs`. Les `.js` (`generate-favicons.js`,
 *     `optimize-and-build.js`, `optimize-images.js`) et le `.php`
 *     (`epreuve-etat-php.php`) du même dossier sont **hors périmètre** — c'est une
 *     borne, pas un oubli.
 *   · Il ne lit QUE l'EN-TÊTE de chaque fichier — les lignes de commentaire du
 *     début, plafonnées à 200 lignes. Un « ce qu'il ne fait pas » écrit au milieu du
 *     corps du fichier ne sera pas vu : *ce n'est pas un en-tête, donc ce n'est pas
 *     une déclaration.*
 *   · ⚠️ **Il ne juge PAS la qualité de la borne déclarée.** Un « plafond de
 *     180 minutes » qui ne borne rien — mesuré le 22/09/2026, `ffprobe` absent,
 *     durée calculée = 0 — sera compté comme UNE BORNE DÉCLARÉE. Ce verrou dit
 *     « c'est écrit » ; **dire si c'est juste appartient à un autre contrôle**, et
 *     ce trou est nommé ici plutôt que caché.
 *   · Il n'ouvre aucun port et ne sort pas de la machine : il ÉCOUTE une fois sur
 *     `127.0.0.1:4178`, referme aussitôt, et n'échange rien.
 *   · Il n'invente aucun chiffre : **tous ses comptes sont calculés**, jamais
 *     écrits à la main dans ce fichier. *Un chiffre écrit à la main devient faux
 *     sans le dire.*
 *
 * USAGE
 * -----
 *   node scripts/verifier-regle-dor.mjs
 *       → le constat complet : chaque script, ses trois déclarations, et les désignés
 *
 *   node scripts/verifier-regle-dor.mjs --liste
 *       → seulement les DÉSIGNÉS, une ligne par script
 *
 *   node scripts/verifier-regle-dor.mjs --motifs
 *       → la table des MOTIFS ACCEPTÉS, avec ce que chacun attrape
 *         ⭐ Sans ça, ce verrou serait un jeu de devinettes.
 *
 *   node scripts/verifier-regle-dor.mjs --epreuve
 *       → l'épreuve du verrou : trois témoins (complet, limites seules, nu) doivent
 *         être diagnostiqués JUSTE. *On prouve qu'il mord en rouvrant le défaut exprès.*
 *
 *   REGLE_OR_BLOQUANT=1 node scripts/verifier-regle-dor.mjs
 *       → le même constat, mais il CONDAMNE (même patron que `CSS_BLOQUANT=1`,
 *         `A11Y_BLOQUANT=1`, `MIROIRS_BLOQUANT=1`)
 *
 * Codes de sortie : 0 = constat rendu (mode par défaut) · épreuve réussie
 *                   1 = REGLE_OR_BLOQUANT=1 et au moins un script désigné ·
 *                       épreuve ratée · ou `scripts/` introuvable
 *
 * ⭐ ENFREINDRE N'EST PAS VIOLER (document du 22/09, § 2 bis) : ce qui distingue les
 *    deux, ce n'est pas la gravité de la règle, **c'est le SILENCE**. On peut
 *    enfreindre. On ne peut pas violer sans le dire. D'où l'interrupteur : nommé,
 *    documenté, et affiché dans la sortie le jour où on s'en sert.
 * ============================================================================
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const SCRIPTS = join(RACINE, 'scripts');

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

const args = process.argv.slice(2);
const MODE_LISTE = args.includes('--liste');
const MODE_MOTIFS = args.includes('--motifs');
const MODE_EPREUVE = args.includes('--epreuve');
const MODE_AIDE = args.includes('--aide') || args.includes('-h');

/* ⭐ L'INTERRUPTEUR — il n'est jamais actif tout seul. Il faut le demander. */
const BLOQUANT = process.env.REGLE_OR_BLOQUANT === '1';

/*
 * LA BORNE DE LECTURE — elle est ici, une seule fois, et elle est nommée.
 * ⚠️ Un plafond qui n'est écrit nulle part ne borne rien : il rassure.
 */
const PLAFOND_LIGNES_EN_TETE = 200;

/*
 * LE PORT DU PRÉRENDU — MESURÉ, PAS DÉDUIT.
 *
 * 22/09/2026 : `scripts/prerendre.js` prend un port FIXE (ligne 40 :
 * `const PORT = Number(option('port', 4178))`) sans vérifier s'il est libre.
 * Résultat mesuré : **deux builds simultanés se sont tués** —
 * `EADDRINUSE: address already in use 127.0.0.1:4178` — et **le prérendu d'un agent
 * a échoué pour une raison qui n'avait rien à voir avec son code.** On a perdu du
 * temps à chercher la mauvaise cause.
 *
 * ⛔ Ce verrou ne RÉPARE pas `prerendre.js` : ce fichier fait partie du build, il
 *    produit 188 pages, et on ne touche pas à un fichier qui produit 188 pages sans
 *    une raison mesurée. **Ici on CONSTATE, et on le dit.**
 */
const PORT_BUILD = 4178;
const DELAI_PORT_MS = 2000;

/* ==========================================================================
 * LA TABLE DES MOTIFS ACCEPTÉS — c'est elle qui rend ce verrou explicable.
 *
 * ⭐ Les formulations varient d'un fichier à l'autre : on cherche le SENS, pas une
 *    chaîne exacte. Mais un verrou dont on ne peut pas lire les règles est un jeu de
 *    devinettes ⇒ `--motifs` les affiche, et la sortie les rappelle en clair.
 *
 * ⚠️ Tout est cherché sur un texte NORMALISÉ : accents retirés, apostrophes
 *    uniformisées, majuscules écrasées. `PÉRIMÈTRE`, `perimetre` et `Perimètre`
 *    sont donc le même mot — sans quoi le verrou raterait la moitié du parc pour une
 *    raison d'encodage, c'est-à-dire pour rien.
 * ========================================================================== */

/* ⭐ DEUX PORTÉES DE RECHERCHE, ET C'EST UNE MESURE QUI L'A IMPOSÉE.
 *
 *   Première version de cette table : un motif « n'est pas un/une/le/la/… » cherché
 *   sur le FLUX de l'en-tête. Résultat mesuré : **18 fichiers sur 23** — le verrou
 *   n'épargnait plus personne, donc il ne désignait plus rien d'utile. *C'est
 *   exactement le défaut que ce fichier combat : un chiffre plausible et faux.*
 *
 *   ⭐ La différence n'est pas le texte, c'est la POSITION : une déclaration de
 *   périmètre est une ligne-vedette — « Ce n'est PAS un score Lighthouse » —, pas
 *   une subordonnée au milieu d'un paragraphe. D'où deux portées :
 *
 *     · `flux`     : cherché sur tout l'en-tête, quand la formulation est nommée
 *                    (« CE QUE CET OUTIL NE FAIT PAS », « LIMITES ») ;
 *     · `parLigne` : cherché sur chaque ligne, avec ancrage au début, quand la
 *                    formulation est une phrase (négation d'identité, opposition).
 *
 *   ⚠️ ET LE TAUX D'ERREUR EST CONNU, IL EST DIT PLUS BAS : `position: 'ligne'`
 *      attrape aussi des phrases de philosophie (« un verrou qui ne peut pas échouer
 *      n'est pas un verrou »). Mesure du 22/09/2026 : sur les 23 scripts, ce faux
 *      positif ne change le verdict d'AUCUN fichier. On le sait, et on l'écrit.
 */
const MOTIFS_NON_FAIT = [
  {
    nom: 'section-négative-nommée',
    portee: 'flux',
    quoi: 'CE QUE CET OUTIL NE FAIT PAS · CE QU\u2019IL NE FAIT PAS · CE QUE CE SCRIPT NE FAIT PAS',
    regex: /ce qu(?:e |')?(?:il|cet outil|ce script|ce verrou|ce fichier)[\s\S]{0,90}?\bne\b[\s\S]{0,40}?\b(pas|rien|jamais)\b/,
  },
  {
    nom: 'négation-de-périmètre',
    portee: 'flux',
    quoi: 'il ne modifie rien · ce verrou ne dit rien avant le build · on ne devine pas ce qui devait être livré',
    regex:
      /\bne (?:fait|touche|modifie|devine|synchronise|decide|envoie|ecrit|supprime|juge|invente|commite|installe|ecrase|remplace|renomme|deplace|mesure|verifie|corrige|genere|conclut|recopie|resout|utilise|teste)\b[\s\S]{0,70}?\b(pas|rien|jamais)\b/,
  },
  {
    nom: 'ce-qu-il-n-est-pas',
    portee: 'flux',
    quoi: 'CE QU\u2019IL N\u2019EST PAS · CE QUE CETTE PASSE N\u2019EST PAS',
    regex: /ce qu(?:e |')?(?:il|elle|cet outil|ce script|ce verrou|cette passe)[\s\S]{0,40}?n'?est pas/,
  },
  {
    /*
     * ⭐ MESURÉ, PAS DEVINÉ : ce motif a été ajouté APRÈS avoir lu 7 en-têtes réels
     * que le verrou désignait à tort. Le studio écrit cette phrase tout le temps.
     *   · « Ce n'est PAS un score Lighthouse : c'est un compte d'octets »
     *     (`verifier-poids.mjs`, l. 34)
     *   · « Ce script n'est PAS un verrou : il n'a pas de seuil à juger »
     *     (`relever-dans-html.mjs`, l. 54)
     *   · « ⚠️ Ce n'est PAS un renoncement » (`generer-arche.mjs`)
     * ⭐ Ancrée en début de ligne, sujet « ce / cet / ce script / cet outil / il ».
     *    Mesure : 5 fichiers sur 23, dont 4 déclarations vraies et 1 discutable.
     */
    nom: 'négation-d-identité',
    portee: 'ligne',
    quoi: 'ce n\u2019est PAS un score · ce script n\u2019est PAS un verrou · ce n\u2019est PAS un renoncement',
    regex: /^(?:[*/·\-–—\s]|⚠️|⛔|⭐)*(?:ce|cet|cette|ce script|ce verrou|cet outil|il)\b[^\n]{0,60}?\bn'est pas\b/,
  },
  {
    /*
     * ⭐ La seconde forme, mesurée elle aussi : `<sujet> n'est pas <participe de
     * périmètre>`.
     *   · « `axe` n'est pas réimplémenté : c'est le paquet `axe-core` du dépôt »
     *     (`verifier-a11y-rendu.mjs`, l. 37) — **c'est ce motif, et lui seul, qui a
     *     sorti ce verrou de la liste des désignés.**
     *   · « Un `mailto:` conforme n'est pas un client de messagerie qui s'ouvre »
     *     (`verifier-contact.mjs`, l. 30)
     * ⚠️ Liste FERMÉE de participes : c'est elle qui empêche le motif de retomber
     *    dans le piège des 18/23. Mesure : 6 fichiers sur 23.
     */
    nom: 'négation-de-réimplémentation',
    portee: 'ligne',
    quoi: 'axe n\u2019est pas réimplémenté · ce n\u2019est pas un verrou · ce n\u2019est pas une correction',
    regex:
      /^(?:[*/·\-–—\s]|⚠️|⛔|⭐)*[^\n]{0,60}?\bn'est pas (?:reimplemente|reimplante|implemente|refait|reecrit|un verrou|un juge|un client|un remplacement|une correction|un outil de|une reecriture)/,
  },
  {
    /*
     * ⭐ La troisième forme studienne : l'OPPOSITION EN PROSE.
     *   · « ⚠️ IL MESURE LA FORME, PAS LE PROTOCCOLE » (`verifier-contact.mjs`, l. 29)
     *   · « **On lit l'arbre, pas le texte.** » (`verifier-build-livre.mjs`)
     * ⚠️ Restreinte à « , pas + le/la/les/l' » — les formes « , pas un/une/des/du »
     *    ont été mesurées et REJETÉES : elles attrapent de la prose narrative
     *    (« c'étaient des absences de la sonde, pas du site », « une décision
     *    écrite, pas un oubli »). Mesure : 9/23 avant restriction, 5/23 après — et
     *    les 5 restants sont des déclarations de périmètre.
     */
    nom: 'opposition-en-prose',
    portee: 'ligne',
    quoi: 'il mesure LA FORME, PAS LE PROTOCOLE · on lit l\u2019arbre, pas le texte',
    regex: /,\s*pas\s+(?:le|la|les|l')/,
  },
  {
    nom: 'limites-déclarées',
    portee: 'flux',
    quoi: 'LIMITES · LIMITES : — une section qui nomme les siennes',
    regex: /\blimites?\b/,
  },
  {
    nom: 'périmètre-déclaré',
    portee: 'flux',
    quoi: 'PÉRIMÈTRE · hors périmètre · hors scope',
    regex: /\b(perimetre|hors (?:perimetre|scope))/,
  },
];

const MOTIFS_CODE_SORTIE = [
  {
    nom: 'codes-de-sortie-nommés',
    quoi: '« Codes de sortie : 0 = … · 1 = … » — la déclaration explicite',
    regex: /\bcodes? de sortie\b/,
  },
  {
    nom: 'exit-numéroté',
    quoi: '`exit 0 = …` · `exit 1 = …` — écrit dans l\u2019en-tête',
    regex: /\bexit\s*[:=]?\s*[01]\b/,
  },
  {
    nom: 'sortie-numérotée',
    quoi: '`sortie : 0` · `sortie 1`',
    regex: /\bsortie\s*[:=]?\s*[01]\b/,
  },
];

const MOTIFS_BORNE = [
  { nom: 'plafond', quoi: 'un PLAFOND nommé', regex: /\bplafond\b/ },
  { nom: 'seuil', quoi: 'un SEUIL nommé', regex: /\bseuil\b/ },
  { nom: 'budget-ou-maximum', quoi: 'budget · maximum · au plus', regex: /\b(budget|maximum|au plus)\b/ },
  { nom: 'limites-déclarées', quoi: 'LIMITES — la même section que pour « ne fait pas »', regex: /\blimites?\b/ },
  { nom: 'périmètre-déclaré', quoi: 'PÉRIMÈTRE · hors périmètre', regex: /\b(perimetre|hors perimetre)\b/ },
  {
    nom: 'grandeur-numérotée',
    quoi: '120 s · 3 Mo · 14 requêtes · 2 000 lignes — une grandeur avec son unité',
    regex: /\d+\s*(?:ms|s|secondes?|minutes?|mo|ko|go|octets?|lignes?|essais|pages?|routes?|requetes?|actifs?)\b/,
  },
  { nom: 'nombre-d-essais', quoi: 'nombre d\u2019essais · N essais', regex: /nombre d'?essais?/ },
  { nom: 'delai-ou-timeout', quoi: 'délai · timeout · échéance', regex: /\b(delai|timeout|echeance)\b/ },
  { nom: 'refus-explicite', quoi: 'on REFUSE · refus si · refuser si', regex: /\b(refus|refuse|refuser)\b/ },
];

/* ==========================================================================
 * LES OUTILS D'ANALYSE
 * ========================================================================== */

/** Retire accents, majuscules et apostrophes exotiques — le SENS, pas la chaîne. */
function normaliser(texte) {
  return String(texte)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2018\u2019\u02bc`\u00b4]/g, "'")
    .toLowerCase();
}

/**
 * L'EN-TÊTE — les lignes de commentaire du début, et rien d'autre.
 * ⭐ On s'arrête à la première ligne de CODE : un « ce qu'il ne fait pas » écrit au
 *    milieu du corps n'est pas une déclaration d'en-tête.
 * ⭐ Et on s'arrête AUSSI au plafond, même si le fichier commence par 600 lignes de
 *    commentaires : la boucle doit être bornée dans les deux sens.
 */
function extraireEntete(source) {
  const lignes = source.split(/\r?\n/);
  const gardees = [];
  let dansBloc = false;

  for (let i = 0; i < lignes.length && gardees.length < PLAFOND_LIGNES_EN_TETE; i++) {
    const brute = lignes[i];
    const l = brute.trim();

    if (i === 0 && l.startsWith('#!')) {
      gardees.push(brute);
      continue;
    }
    if (dansBloc) {
      gardees.push(brute);
      if (l.includes('*/')) dansBloc = false;
      continue;
    }
    if (l === '' || l.startsWith('//')) {
      gardees.push(brute);
      continue;
    }
    if (l.startsWith('/*')) {
      gardees.push(brute);
      if (!l.includes('*/')) dansBloc = true;
      continue;
    }
    break; // première ligne de code : l'en-tête est fini
  }
  return { texte: gardees.join('\n'), lignes: gardees.length };
}

/**
 * LA RECHERCHE — et elle respecte la PORTÉE de chaque motif.
 * ⭐ Voir la table ci-dessus : un motif de flux traverse tout l'en-tête, un motif de
 *    ligne est ancré au début de chaque ligne. C'est cette distinction, mesurée, qui
 *    empêche le verrou d'épargner tout le monde.
 */
function chercher(texteNormalise, table, lignesNormalisees) {
  const lignes = lignesNormalisees || [];
  return table.filter((m) =>
    m.portee === 'ligne'
      ? lignes.some((l) => m.regex.test(l))
      : m.regex.test(texteNormalise)
  );
}

/** Le diagnostic d'UN fichier. Rien d'autre : trois réponses, pas un jugement. */
function analyserFichier(chemin) {
  const nom = basename(chemin);
  let source = '';
  try {
    source = readFileSync(chemin, 'utf8');
  } catch (e) {
    return { nom, lisible: false, raison: e.code || String(e), neFaitPas: [], sortie: [], bornes: [] };
  }
  const entete = extraireEntete(source);
  const t = normaliser(entete.texte);
  const parLigne = entete.texte.split(/\r?\n/).map(normaliser);
  return {
    nom,
    lisible: true,
    lignesEnTete: entete.lignes,
    neFaitPas: chercher(t, MOTIFS_NON_FAIT, parLigne),
    sortie: chercher(t, MOTIFS_CODE_SORTIE),
    bornes: chercher(t, MOTIFS_BORNE),
  };
}

/** Un script est DÉSIGNÉ s'il ne dit pas ce qu'il ne fait pas, ou pas son code de sortie. */
function estDesigne(d) {
  return d.neFaitPas.length === 0 || d.sortie.length === 0;
}

function motifDudit(d) {
  if (!d.lisible) return 'fichier illisible (' + d.raison + ')';
  const manques = [];
  if (d.neFaitPas.length === 0) manques.push('ne déclare pas ce qu\u2019il NE FAIT PAS');
  if (d.sortie.length === 0) manques.push('ne déclare pas son CODE DE SORTIE');
  return manques.join(' · ');
}

/**
 * LE PORT EST-IL LIBRE ? — on écoute une fois, on referme.
 * ⭐ Éprouvé le 22/09/2026 sur ce poste : un second `listen(4178)` rend bien
 *    `EADDRINUSE`. La détection MORD sur Windows — ce n'était pas une évidence,
 *    et une détection qu'on n'a pas éprouvée est une détection qu'on suppose.
 * ⚠️ Bornée : si la réponse ne vient pas en 2 s, on dit « indéterminé » plutôt que
 *    de pendre la CI. *Une mesure qui ne rend pas la main n'est pas une mesure.*
 */
function testerPort(port) {
  return new Promise((resolve) => {
    const serveur = createServer();
    let fini = false;

    const conclure = (resultat) => {
      if (fini) return;
      fini = true;
      clearTimeout(minuteur);
      try {
        serveur.close();
      } catch {
        /* la fermeture d'un serveur jamais ouvert n'est pas un échec */
      }
      resolve(resultat);
    };

    const minuteur = setTimeout(() => conclure({ etat: 'indetermine' }), DELAI_PORT_MS);

    serveur.once('error', (e) => conclure({ etat: 'occupe', code: e.code }));
    serveur.once('listening', () => conclure({ etat: 'libre' }));
    serveur.listen(port, '127.0.0.1');
  });
}

/* ==========================================================================
 * L'ÉPREUVE — prouver que ce verrou MORD, et qu'il ne mord pas à tort.
 *
 * ⭐ Loi de l'atelier n° 4 : « un garde-fou qui ne couvre qu'un chemin est une
 *    porte — on prouve qu'il mord en rouvrant le défaut exprès. »
 * ⭐ Et l'épreuve est BIDIRECTIONNELLE : un témoin NU doit être désigné (sinon le
 *    verrou ne sert à rien), un témoin COMPLET ne doit pas l'être (sinon il accuse
 *    à tort et on apprend à le désactiver).
 * ========================================================================== */

const TEMOINS = [
  {
    nom: 'temoin-complet.mjs',
    source: [
      '#!/usr/bin/env node',
      '/*',
      ' * temoin-complet.mjs — un outil qui DIT ses bornes.',
      ' *',
      ' * POURQUOI CE FICHIER EXISTE : il n\u2019existe pas, c\u2019est un témoin.',
      ' *',
      ' * CE QUE CET OUTIL NE FAIT PAS',
      ' *   · Il ne modifie RIEN sur le disque.',
      ' *   · Il ne devine pas les chemins absents.',
      ' *',
      ' * USAGE : node temoin-complet.mjs',
      ' *',
      ' * Codes de sortie : 0 = constat rendu · 1 = refus',
      ' *',
      ' * BORNE : plafond de 120 secondes, seuil de 14 requêtes, 3 essais au plus.',
      ' */',
      'import { readFileSync } from "node:fs";',
      '',
    ].join('\n'),
    attendu: { neFaitPas: true, sortie: true, borne: true },
  },
  {
    nom: 'temoin-limites-seules.mjs',
    source: [
      '// temoin-limites-seules.mjs',
      '// LIMITES : aucune écriture, aucune requête réseau. Périmètre : ce dossier.',
      'import { join } from "node:path";',
      '',
    ].join('\n'),
    attendu: { neFaitPas: true, sortie: false, borne: true },
  },
  {
    nom: 'temoin-nu.mjs',
    source: [
      '// temoin-nu.mjs — un outil qui ne dit rien de lui-même.',
      '// Il parcourt un dossier et affiche ce qu\u2019il y trouve.',
      'import { readFileSync } from "node:fs";',
      '',
    ].join('\n'),
    attendu: { neFaitPas: false, sortie: false, borne: false },
  },
  {
    /*
     * ⭐ LE TÉMOIN QUI PROUVE LE MOTIF LE PLUS FIN — `négation-de-réimplémentation`.
     *   C'est `verifier-a11y-rendu.mjs` (l. 37) qui a imposé ce motif : sans lui, ce
     *   verrou-là était désigné à tort. Le témoin reprend sa phrase exacte.
     */
    nom: 'temoin-reimplementation.mjs',
    source: [
      '// temoin-reimplementation.mjs — la borne écrite à la mode de verifier-a11y-rendu.',
      '//   `axe` n\u2019est pas réimplémenté : c\u2019est le paquet `axe-core` du dépôt.',
      'import { join } from "node:path";',
      '',
    ].join('\n'),
    attendu: { neFaitPas: true, sortie: false, borne: false },
  },
];

function lancerEpreuve() {
  console.log('\n' + '='.repeat(78));
  console.log('  ÉPREUVE DU VERROU — mord-il, et mord-il JUSTE ?');
  console.log('='.repeat(78));
  console.log(
    `  ${TEMOINS.length} témoins écrits en mémoire, aucun fichier touché sur le disque.\n`
  );

  let echecs = 0;

  for (const temoin of TEMOINS) {
    const entete = extraireEntete(temoin.source);
    const t = normaliser(entete.texte);
    const parLigne = entete.texte.split(/\r?\n/).map(normaliser);
    const obtenu = {
      neFaitPas: chercher(t, MOTIFS_NON_FAIT, parLigne).length > 0,
      sortie: chercher(t, MOTIFS_CODE_SORTIE).length > 0,
      borne: chercher(t, MOTIFS_BORNE).length > 0,
    };

    const ecarts = [];
    for (const cle of ['neFaitPas', 'sortie', 'borne']) {
      if (obtenu[cle] !== temoin.attendu[cle]) {
        ecarts.push(`${cle} attendu=${temoin.attendu[cle]} obtenu=${obtenu[cle]}`);
      }
    }

    if (ecarts.length === 0) {
      console.log(`  ${vert('[ok]')}  ${temoin.nom.padEnd(26)} ${gris('diagnostic juste')}`);
    } else {
      echecs++;
      console.log(`  ${rouge('[KO]')}  ${temoin.nom.padEnd(26)} ${rouge(ecarts.join(' · '))}`);
    }
  }

  console.log('='.repeat(78));
  if (echecs === 0) {
    console.log(vert('  Le verrou mord juste : il désigne le témoin nu, il épargne le témoin complet.'));
    console.log('='.repeat(78) + '\n');
    return 0;
  }
  console.log(rouge(`  ${echecs} témoin(s) sur ${TEMOINS.length} mal diagnostiqué(s).`));
  console.log('  ⛔ Le verrou ne fait pas son travail : ne pas l\u2019activer avant de l\u2019avoir corrigé.');
  console.log('='.repeat(78) + '\n');
  return 1;
}

/* ==========================================================================
 * L'AFFICHAGE DES MOTIFS — parce qu'un verrou muet sur ses règles est un piège.
 * ========================================================================== */

function afficherMotifs() {
  console.log('\n' + '='.repeat(78));
  console.log('  MOTIFS ACCEPTÉS — ce que ce verrou reconnaît, et ce qu\u2019il ne reconnaît pas');
  console.log('='.repeat(78));
  console.log(gris('  ⭐ On cherche le SENS, pas une chaîne exacte. Texte normalisé avant'));
  console.log(gris('     recherche : accents retirés, apostrophes uniformisées, minuscules.'));
  console.log('');

  const tables = [
    ['1 · DÉCLARE CE QU\u2019IL NE FAIT PAS', MOTIFS_NON_FAIT],
    ['2 · DÉCLARE SON CODE DE SORTIE', MOTIFS_CODE_SORTIE],
    ['3 · SE BORNE (constat, pas verdict)', MOTIFS_BORNE],
  ];

  for (const [titre, table] of tables) {
    console.log('  ' + titre);
    for (const m of table) {
      const portee = m.portee === 'ligne' ? 'ligne' : 'flux ';
      console.log(
        `    ${vert('·')} ${m.nom.padEnd(30)} ${gris('[' + portee + '] ' + m.quoi)}`
      );
    }
    console.log('');
  }

  console.log(gris('  ⭐ LA PORTÉE N\u2019EST PAS UN DÉTAIL — c\u2019est une MESURE. Les motifs de'));
  console.log(gris('     LIGNE sont ancrés au début d\u2019une ligne : une déclaration de périmètre'));
  console.log(gris('     est une ligne-vedette, pas une subordonnée au milieu d\u2019un paragraphe.'));
  console.log(gris('     Un motif de ligne cherché sur le flux entier a été essayé : il reconnaissait'));
  console.log(gris('     18 fichiers sur 23, donc il n\u2019épargnait plus personne — et un verrou qui'));
  console.log(gris('     n\u2019épargne plus personne ne désigne plus rien d\u2019utile.'));
  console.log('');
  console.log(gris('  ⛔ CE QU\u2019IL NE RECONNAÎT PAS, ET C\u2019EST DIT :'));
  console.log(gris('     · une borne écrite dans le CORPS du fichier, pas dans son en-tête ;'));
  console.log(gris('     · une borne juste mais fausse — un « plafond » qui ne borne rien compte'));
  console.log(gris('       comme déclaré : c\u2019est un trou nommé, pas un trou caché ;'));
  console.log(gris('     · les .js et .php de scripts/ — ils sont hors périmètre ;'));
  console.log(gris('     · ⚠️ un motif de LIGNE attrape parfois une phrase de PHILOSOPHIE'));
  console.log(gris('       (« un verrou qui ne peut pas échouer n\u2019est pas un verrou »). Mesure du'));
  console.log(gris('       22/09/2026 : ce faux positif ne change le verdict d\u2019AUCUN des 23 scripts,'));
  console.log(gris('       parce que les fichiers concernés sont couverts par un autre motif.'));
  console.log(gris('       **On le sait, on le dit, et le compte par motif est là pour le voir.**'));
  console.log('='.repeat(78) + '\n');
}

/* ==========================================================================
 * LE PROGRAMME
 * ========================================================================== */

if (MODE_AIDE) {
  console.log(`
  verifier-regle-dor.mjs — le verrou qui rend la règle d'or exécutable.

    node scripts/verifier-regle-dor.mjs            constat complet (sortie 0)
    node scripts/verifier-regle-dor.mjs --liste    seulement les désignés
    node scripts/verifier-regle-dor.mjs --motifs   la table des motifs acceptés
    node scripts/verifier-regle-dor.mjs --epreuve  l'épreuve du verrou (témoins)

    REGLE_OR_BLOQUANT=1 node scripts/verifier-regle-dor.mjs   → il CONDAMNE

  Codes de sortie : 0 = constat rendu · épreuve réussie
                    1 = REGLE_OR_BLOQUANT=1 avec au moins un désigné · épreuve ratée
`);
  process.exit(0);
}

if (MODE_EPREUVE) {
  process.exit(lancerEpreuve());
}

if (MODE_MOTIFS) {
  afficherMotifs();
  process.exit(0);
}

console.log('\n' + '='.repeat(78));
console.log('  RÈGLE D\u2019OR — ce que chaque script DÉCLARE de ses propres bornes');
console.log('='.repeat(78));

if (BLOQUANT) {
  console.log(jaune('  ⚠️  REGLE_OR_BLOQUANT=1 — CE VERROU CONDAMNE.'));
  console.log(gris('      Ce n\u2019est pas un défaut : c\u2019est une enfreinte CHOISIE et SIGNALÉE.'));
  console.log(gris('      On peut enfreindre. On ne peut pas violer sans le dire.'));
} else {
  console.log(gris('  Mode CONSTAT : il DÉSIGNE, il n\u2019interdit rien, et il sort en 0.'));
  console.log(gris('  ⭐ DÉSIGNER n\u2019est pas CONDAMNER — l\u2019interrupteur se demande :'));
  console.log(gris('     REGLE_OR_BLOQUANT=1'));
}

if (!existsSync(SCRIPTS)) {
  console.log('');
  console.log(rouge('  [KO]  scripts/ est INTROUVABLE.'));
  console.log(gris('        Soit le dossier a changé, soit on regarde au mauvais endroit :'));
  console.log(gris('        ' + SCRIPTS));
  console.log(gris('        ⭐ On ne devine pas le bon chemin — on le dit et on s\u2019arrête.'));
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

/* --- La découverte : on ÉNUMÈRE le dossier, on n'écrit aucune liste à la main.
 *     ⚠️ Une liste écrite à la main devient fausse dès qu'un script est ajouté, et
 *        personne ne s'en aperçoit. */
const fichiers = readdirSync(SCRIPTS)
  .filter((f) => f.endsWith('.mjs'))
  .sort();

if (fichiers.length === 0) {
  console.log('');
  console.log(rouge('  [KO]  aucun fichier .mjs dans scripts/ — il n\u2019y a rien à mesurer.'));
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

const diagnostics = fichiers.map((f) => analyserFichier(join(SCRIPTS, f)));
const verrous = diagnostics.filter((d) => d.nom.startsWith('verifier-'));
const outils = diagnostics.filter((d) => !d.nom.startsWith('verifier-'));

const designes = diagnostics.filter(estDesigne);
const sansSection = diagnostics.filter((d) => d.neFaitPas.length === 0);
const sansSortie = diagnostics.filter((d) => d.sortie.length === 0);
const sansBorne = diagnostics.filter((d) => d.bornes.length === 0);

console.log('');
console.log(
  `  ${diagnostics.length} script(s) .mjs parcouru(s) — dont ${verrous.length} verrou(x) ` +
    `${gris('verifier-*.mjs')} et ${outils.length} outil(s).`
);
console.log(gris(`  En-tête seul, plafonné à ${PLAFOND_LIGNES_EN_TETE} lignes · hors périmètre : les .js et les .php de scripts/.`));
console.log('');

if (!MODE_LISTE) {
  for (const d of diagnostics) {
    const m1 = d.neFaitPas.length > 0 ? vert('ne-fait-pas ✓') : rouge('ne-fait-pas ✗');
    const m2 = d.sortie.length > 0 ? vert('code-de-sortie ✓') : rouge('code-de-sortie ✗');
    const m3 = d.bornes.length > 0 ? vert('borne ✓') : gris('borne —');
    const marque = estDesigne(d) ? jaune('[!!]') : vert('[ok]');
    const famille = d.nom.startsWith('verifier-') ? gris('verrou') : gris('outil ');
    console.log(`  ${marque} ${famille} ${d.nom.padEnd(32)} ${m1}  ${m2}  ${m3}`);
  }
  console.log('');
}

/* --- LES MOTIFS QUI ONT SERVI ------------------------------------------------
 * ⭐ POURQUOI CE TABLEAU EXISTE — et l'histoire est celle d'un chiffre qui mentait.
 *
 *   1. Première table : un motif « n'est pas un/une/le/la/… » cherché sur le FLUX.
 *      Mesure : **18 scripts sur 23** le déclenchaient. Il n'épargnait plus
 *      personne, donc il ne désignait plus rien d'utile.
 *   2. Après avoir LU sept en-têtes réels : trois déclarations de périmètre
 *      (« ce n'est PAS un score Lighthouse », « axe n'est pas réimplémenté »,
 *      « ce script n'est PAS un verrou ») n'étaient reconnues par aucun motif.
 *      Deux motifs ajoutés, version large ⇒ **16 désignés sur 23**.
 *   3. ⚠️ Or un motif large épargne AUSSI par accident. Le tableau de cette sortie
 *      l'a montré : `négation-d-identité` montait à 18/23. Re-mesure ⇒ portée
 *      « ligne » + liste FERMÉE de participes ⇒ **12 désignés sur 23**.
 *   4. Et l'épreuve à 4 témoins vérifie que le resserrage mord toujours.
 *
 *   ⭐ La leçon vaut pour tout le studio : **élargir un motif ne se décide pas, il
 *      se MESURE.** Sans ce tableau, ce verrou aurait été une boîte noire qui
 *      rassure — exactement ce que la règle d'or interdit.
 *   ⭐ Et ces comptes sont CALCULÉS : aucun n'est écrit à la main ici.
 */
if (!MODE_LISTE) {
  const parNom = new Map();
  for (const d of diagnostics) {
    for (const m of [...d.neFaitPas, ...d.sortie, ...d.bornes]) {
      if (!parNom.has(m.nom)) parNom.set(m.nom, { quoi: m.quoi, n: 0 });
      parNom.get(m.nom).n++;
    }
  }
  const servis = [...parNom.entries()].sort((a, b) => b[1].n - a[1].n);

  console.log(gris('  MOTIFS QUI ONT SERVI — combien de scripts chacun a reconnus'));
  for (const [nom, v] of servis) {
    const part = `${v.n}/${diagnostics.length}`;
    console.log(`    ${nom.padEnd(28)} ${part.padStart(6)}  ${gris(v.quoi.slice(0, 62))}`);
  }
  console.log('');
}

/* --- LE CONSTAT SUR LE PORT -------------------------------------------------- */
const port = await testerPort(PORT_BUILD);

console.log('-'.repeat(78));
console.log(`  LE PORT DU PRÉRENDU — ${PORT_BUILD}`);
console.log('-'.repeat(78));

if (port.etat === 'libre') {
  console.log(`  ${vert('[ok]')}  le port ${PORT_BUILD} est LIBRE — aucun build ne tourne ici.`);
} else if (port.etat === 'occupe') {
  console.log(`  ${jaune('[!!]')}  le port ${PORT_BUILD} est OCCUPÉ (${port.code}).`);
  console.log('');
  console.log('      ⚠️  UN BUILD TOURNE PEUT-ÊTRE AILLEURS — ou un prérendu est resté');
  console.log('          accroché. `scripts/prerendre.js` prend ce port FIXE (ligne 40)');
  console.log('          sans vérifier s\u2019il est libre.');
  console.log('');
  console.log('      ⛔ Mesuré le 22/09/2026 : deux builds simultanés se sont TUÉS —');
  console.log('         `EADDRINUSE: address already in use 127.0.0.1:4178` — et le prérendu');
  console.log('         d\u2019un agent a échoué pour une raison qui n\u2019avait rien à voir avec');
  console.log('         son code. On a cherché la mauvaise cause.');
  console.log('');
  console.log(gris('      ⇒ Ne pas relancer de build maintenant. Vérifier d\u2019abord :'));
  console.log(gris('        Get-CimInstance Win32_Process -Filter "Name=\'node.exe\'" |'));
  console.log(gris('          Where-Object { $_.CommandLine -match \'vite|prerendre\' }'));
} else {
  console.log(`  ${gris('[--]')}  port ${PORT_BUILD} : état INDÉTERMINÉ (pas de réponse en ${DELAI_PORT_MS} ms).`);
  console.log(gris('        On ne conclut pas : « je ne perçois rien » n\u2019est pas « il n\u2019y a rien ».'));
}

/* --- LES DÉSIGNÉS ------------------------------------------------------------ */
console.log('');
console.log('-'.repeat(78));
console.log(`  DÉSIGNÉS — ${designes.length} sur ${diagnostics.length}`);
console.log(gris('  ⭐ Désigner n\u2019est pas condamner : ce verrou sort en 0, et il le dit.'));
console.log('-'.repeat(78));

if (designes.length === 0) {
  console.log(`  ${vert('[ok]')}  aucun : les ${diagnostics.length} scripts déclarent leurs bornes.`);
} else {
  const dVerrous = designes.filter((d) => d.nom.startsWith('verifier-'));
  const dOutils = designes.filter((d) => !d.nom.startsWith('verifier-'));

  for (const [titre, lot] of [
    [`  VERROUS — ${dVerrous.length} (ceux-là, la CI les lance : ils comptent double)`, dVerrous],
    [`  OUTILS — ${dOutils.length}`, dOutils],
  ]) {
    console.log('');
    console.log(gris(titre));
    if (lot.length === 0) {
      console.log(gris('    (aucun)'));
      continue;
    }
    for (const d of lot) {
      console.log(`    ${jaune('·')} ${d.nom.padEnd(32)} ${gris(motifDudit(d))}`);
    }
  }
}

/* --- LE VERDICT -------------------------------------------------------------- */
console.log('');
console.log('='.repeat(78));
console.log(
  `  ${diagnostics.length} script(s) · ${vert(String(diagnostics.length - sansSection.length))} ` +
    `déclarent ce qu\u2019ils NE font PAS · ` +
    `${vert(String(diagnostics.length - sansSortie.length))} déclarent leur code de sortie · ` +
    `${diagnostics.length - sansBorne.length} déclarent une borne.`
);
console.log(
  gris(
    `  Sans section « ne fait pas » : ${sansSection.length} · sans code de sortie : ${sansSortie.length} · ` +
      `sans borne déclarée : ${sansBorne.length}`
  )
);
console.log(gris('  Les comptes ci-dessus sont CALCULÉS, jamais écrits à la main.'));

if (designes.length === 0 && port.etat === 'libre') {
  console.log('');
  console.log(vert('  Tout le parc déclare ses bornes, et aucun build ne tourne.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

console.log('');
console.log(gris('  ⛔ CE QUE CE CONSTAT NE DIT PAS :'));
console.log(gris('     · il ne dit pas que ces scripts sont mauvais — il dit qu\u2019ils ne DÉCLARENT'));
console.log(gris('       pas leur périmètre, ce qui n\u2019est pas la même chose ;'));
console.log(gris('     · il ne dit pas qu\u2019une borne déclarée est une borne JUSTE — le plafond de'));
console.log(gris('       180 minutes qui ne bornait rien comptait comme déclaré ;'));
console.log(gris('     · il ne corrige rien. Le geste de correction est humain, et il appartient'));
console.log(gris('       à celui qui connaît le script ;'));
console.log(gris('     · ⚠️ il ne dit pas qu\u2019un motif retenu est une SECTION — une phrase de'));
console.log(gris('       prose peut le déclencher. **Le compte par motif est là pour ça** :'));
console.log(gris('       un motif qui monte à 20/23 attrape manifestement autre chose.'));

if (BLOQUANT) {
  console.log('');
  console.log(rouge(`  REGLE_OR_BLOQUANT=1 : ${designes.length} script(s) désigné(s)` + (port.etat === 'occupe' ? ` + port ${PORT_BUILD} occupé` : '') + '.'));
  console.log('  ⭐ L\u2019enfreinte est SIGNALÉE, donc elle est légitime — mais elle échoue ici.');
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

console.log('');
console.log(jaune(`  ${designes.length} script(s) désigné(s) — et ce verrou SORT EN 0 malgré tout.`));
console.log(gris('  ⭐ Ce n\u2019est pas de la complaisance : c\u2019est un choix, et il est dit.'));
console.log(gris('     Un verrou neuf qui condamne tout le parc le jour de sa naissance rend la'));
console.log(gris('     CI rouge et s\u2019apprend à être contourné. On désigne d\u2019abord, on condamne'));
console.log(gris('     quand le parc est propre — ou quand Gaëtan le demande : REGLE_OR_BLOQUANT=1.'));
console.log('='.repeat(78) + '\n');
process.exit(0);
