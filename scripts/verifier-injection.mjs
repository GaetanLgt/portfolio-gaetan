#!/usr/bin/env node
/*
 * verifier-injection.mjs — LE VERROU DE LA FRONTIÈRE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE — le défaut a mordu TROIS FOIS en une journée.
 *
 *   Mot du dirigeant, 22/09/2026 :
 *     « C'est une des bosses du code — c'est comme ça qu'on se prend des
 *       injections SQL si tu fais pas gaffe. Donc tu me prends une vérification
 *       au niveau de la sécurité. »
 *
 *   Les trois morsures, mesurées, de la MÊME famille :
 *
 *   1. `\"` DANS UNE CHAÎNE POWERSHELL À GUILLEMETS DOUBLES NE S'ÉCHAPPE PAS.
 *      Le script casse **au parsing** — donc il ne tourne pas du tout, et
 *      l'opérateur a cru que l'action était faite. *Deux occurrences.*
 *   2. UN CHEMIN ABSOLU CONTENANT UN NUMÉRO DE VERSION
 *      (`…\ffmpeg-9.0.1-full_build\…`) : l'outil est passé à 9.0.2, le chemin
 *      est mort, **et tout le son du studio est mort avec lui — en silence**,
 *      parce que rien ne l'appelle au démarrage. Le service affichait
 *      `voix : piper` comme un état, sans jamais l'avoir essayé.
 *   3. UNE EXPRESSION RÉGULIÈRE CONSTRUITE DEPUIS UNE VARIABLE NON ÉCHAPPÉE :
 *      deux scripts de contrôle ont rendu des **résultats faux** en cherchant
 *      un texte contenant des caractères spéciaux.
 *
 *   ⭐⭐ LA LEÇON, ET C'EST TOUTE LA RAISON D'ÊTRE DE CE FICHIER :
 *
 *      **Une donnée qui devient de la commande est une injection.**
 *      Ce n'est pas une question de langage — c'est une question de FRONTIÈRE.
 *
 * LA RÈGLE D'OR, ET ELLE S'APPLIQUE À CE FICHIER AVANT TOUT AUTRE
 * --------------------------------------------------------------
 *   Ce qui n'est pas écrit reste VIDE et est SIGNALÉ comme manquant.
 *   ⛔ Donc : **si je ne sais pas décider si un endroit est dangereux, je ne
 *      tranche pas — je le liste comme « à examiner ».**
 *   ⭐ Et tout ce qui est accepté porte **son motif d'acceptation**, publié.
 *      *Un verrou qui accepte en silence n'est pas un verrou : c'est un tampon.*
 *
 * LES QUATRE CATÉGORIES — et tout constat dit laquelle
 * ---------------------------------------------------
 *   1 · OUTIL ABSENT            un chemin d'exécutable écrit en dur, ou une
 *                               commande nommée, qui N'EXISTE PAS sur la
 *                               machine. *C'est la mort silencieuse.*
 *   2 · COMMANDE CONSTRUITE     une variable entre dans une commande sans
 *                               échappement (`exec(`, `execSync(`, `shell:true`,
 *                               `Invoke-Expression`, `cmd /c`).
 *   3 · MOTIF CONSTRUIT         une variable entre dans un `new RegExp(`
 *                               sans échappement des métacaractères.
 *   4 · ÉCHAPPEMENT DE SHELL    un guillemet échappé qui ne l'est pas
 *                               (`\"` dans une chaîne PowerShell double).
 *                               *Même défaut, autre surface : le script casse
 *                               au parsing et personne ne le sait.*
 *
 * ⛔⛔ LA MESURE EST BORNÉE, ET LA BORNE EST PUBLIÉE
 * -------------------------------------------------
 *   Périmètre : les `.mjs`, `.js` et `.ps1` du dépôt, hors `node_modules`,
 *   `.git`, `dist`, `.astro`, `coverage`, `build`.
 *   Plafond : **200 000 caractères par fichier** — au-delà, le fichier est
 *   signalé « non analysé » plutôt que tronqué en silence.
 *   ⚠️ Le masquage des commentaires est LEXICAL, pas un analyseur syntaxique :
 *   il peut se tromper sur un `//` à l'intérieur d'une chaîne de caractères.
 *   *Un masquage approximatif qui se déclare vaut mieux qu'un faux négatif tu.*
 *
 * CE QUE CET OUTIL NE FAIT PAS
 * ----------------------------
 *   ⛔ Il ne corrige rien. Il désigne — **il ne condamne pas**, sauf si on le
 *      lui demande explicitement (`INJECTION_BLOQUANT=1`).
 *   ⛔ Il ne suit pas une variable sur plusieurs lignes ni à travers un import :
 *      c'est un contrôle de **surface**, ligne à ligne. *Un flux suivi serait un
 *      autre outil ; celui-ci attrape la classe, pas chaque instance.*
 *   ⛔ Il ne juge pas une donnée « utilisateur » ou non. Il ne sait pas d'où
 *      vient une variable : c'est précisément pourquoi il existe une catégorie
 *      « à examiner » au lieu d'un verdict.
 *   ⛔ Il ne remplace pas une revue de sécurité. Il ferme **une** classe : la
 *      donnée qui devient commande.
 *   ⛔ Il ne recasse rien : il lit, il compte, il nomme, et il sort en 0.
 *
 * USAGE + CODES DE SORTIE
 * -----------------------
 *   node scripts/verifier-injection.mjs                    → désigne, sort en 0
 *   INJECTION_BLOQUANT=1 node scripts/verifier-injection.mjs → condamne, sort en 1
 *   node scripts/verifier-injection.mjs --epreuve          → éprouve le verrou
 *       ⭐ Il écrit des témoins portant les quatre défauts connus DANS LE DOSSIER
 *          TEMPORAIRE DU SYSTÈME — **jamais dans le dépôt** — et vérifie que
 *          chaque catégorie mord, et qu'aucun faux positif connu ne revient.
 *          *Un garde-fou qui ne couvre qu'un chemin est une porte : on prouve
 *          qu'il mord en roulant le défaut exprès.*
 *
 *   Codes de sortie :
 *     0 = mesuré (défauts désignés ou non ; condamne seulement si INJECTION_BLOQUANT=1)
 *     1 = INJECTION_BLOQUANT=1 ET au moins un point désigné ·
 *         ou, avec `--epreuve`, un attendu non tenu (le verrou ne mord pas)
 *     2 = le balayage est cassé (aucun fichier parcouru) — *ce n'est pas le code
 *         qui est en cause, c'est la mesure : on le dit au lieu de rendre « vert »*
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, extname, delimiter } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');

const BLOQUANT = process.env.INJECTION_BLOQUANT === '1';
const EXTENSIONS = new Set(['.mjs', '.js', '.ps1']);
const IGNORES = new Set(['node_modules', '.git', 'dist', '.astro', 'coverage', 'build', '.output']);

/* ⛔ LE PLAFOND PAR FICHIER — une borne, pas un confort.
 *    Un fichier de 4 Mo n'est pas un fichier de code : c'est un artefact. On le
 *    dit « non analysé » au lieu de le tronquer en silence et de croire qu'on
 *    l'a mesuré. */
const PLAFOND_OCTETS = 200_000;

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

/* ═══════════════════════════════════════════════════════════════════════════
   LES OUTILS D'ANALYSE
   ═══════════════════════════════════════════════════════════════════════════ */

/** Espaces de la même longueur — et les `\n` sont CONSERVÉS. */
const enEspaces = (s) => s.replace(/[^\n]/g, ' ');

/**
 * MASQUE LES COMMENTAIRES SANS DÉCALER LES LIGNES.
 *
 * ⭐ ASSERTION STRUCTURELLE — la loi du studio, appliquée ici :
 *    un remplacement programmatique porte une assertion, **et sur la structure**.
 *    Ici la structure, c'est le NOMBRE DE LIGNES : si le masquage en ajoute ou
 *    en retire une seule, tous les `fichier:ligne` de la sortie deviennent faux —
 *    et un rapport faux envoie chercher au mauvais endroit.
 *    ⛔ Le masquage n'est pas un analyseur : il ne comprend pas les chaînes. C'est
 *       écrit dans « CE QUE CET OUTIL NE FAIT PAS », au-dessus.
 */
function masquerCommentaires(source, extension) {
  const lignesAvant = source.split('\n').length;
  let t = source;

  if (extension === '.ps1') {
    t = t.replace(/<#[\s\S]*?#>/g, enEspaces);
    t = t.replace(/[ \t]*#[^\n]*/g, (m) => ' '.repeat(m.length));
  } else {
    t = t.replace(/\/\*[\s\S]*?\*\//g, enEspaces);
    // ⚠️ `(^|[^:\w])` : sans cela, le `//` d'une URL `https://…` mangerait la
    //    fin de la ligne. Mesure faite sur les scripts du dépôt.
    t = t.replace(/(^|[^:\w])\/\/[^\n]*/g, (m, avant) => avant + ' '.repeat(m.length - avant.length));
  }

  const lignesApres = t.split('\n').length;
  if (lignesApres !== lignesAvant) {
    throw new Error(
      `ASSERTION ROMPUE — masquage des commentaires : ${lignesAvant} ligne(s) avant, ` +
      `${lignesApres} après. Le décalage rendrait tous les numéros de ligne faux.`
    );
  }
  return t;
}

/** Numéro de ligne (1-based) d'un index dans le texte. */
function ligneDe(texte, index) {
  let n = 1;
  for (let i = 0; i < index && i < texte.length; i++) if (texte[i] === '\n') n++;
  return n;
}

/**
 * LE PREMIER ARGUMENT D'UN APPEL — jusqu'à la virgule de niveau 0.
 * ⚠️ Les guillemets et les échappements sont suivis : sans cela, une virgule
 *    dans une chaîne couperait l'argument n'importe où.
 */
function premierArgument(texte, indexParenthese) {
  let i = indexParenthese + 1;
  let profondeur = 0;
  let guillemet = null;
  const debut = i;

  for (; i < texte.length; i++) {
    const c = texte[i];
    if (guillemet) {
      if (c === '\\') { i++; continue; }
      if (c === guillemet) guillemet = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { guillemet = c; continue; }
    if (c === '(' || c === '[' || c === '{') { profondeur++; continue; }
    if (c === ')' || c === ']' || c === '}') {
      if (profondeur === 0) break;
      profondeur--;
      continue;
    }
    if (c === ',' && profondeur === 0) break;
  }
  return { texte: texte.slice(debut, i).trim(), index: debut, fin: i };
}

/**
 * LE DEUXIÈME ARGUMENT EST-IL UN TABLEAU LITTÉRAL ?
 * ⭐ C'est la question qui sépare l'injection de l'argument : `spawn(cmd, [args])`
 *    n'ouvre aucun shell, donc une donnée y reste une donnée.
 */
function deuxiemeArgEstTableau(texte, indexFinPremier) {
  let i = indexFinPremier;
  while (i < texte.length && /[\s,]/.test(texte[i])) i++;
  return texte[i] === '[';
}

/** Un littéral de chaîne sans interpolation ni concaténation : rien n'y entre. */
function estLitteralPur(arg) {
  if (/^'[^']*'$/.test(arg)) return true;
  if (/^"[^"]*"$/.test(arg)) return true;
  if (/^`[^`]*`$/.test(arg) && !arg.includes('${')) return true;
  return false;
}

/** Une concaténation ou une interpolation : une donnée peut y entrer. */
function contientVariable(arg) {
  if (arg.includes('${')) return true;
  if (/(^|\s)\+(\s|$)/.test(arg)) return true;
  if (/\w\s*\+\s*['"`]/.test(arg)) return true;
  return false;
}

/**
 * LA RÉSOLUTION D'UNE COMMANDE NOMMÉE — le contrôle qui attrape la mort
 * silencieuse.
 * ⭐ On ne DÉDUIT pas qu'un outil existe : on le cherche sur le disque, dans le
 *    PATH, avec les extensions exécutables de la machine. Mesurer, pas déduire.
 */
function resoudreCommande(mot) {
  if (!mot) return null;
  // `FOO=bar cmd` — on saute les affectations, comme le fait un shell.
  let nom = mot;
  while (/^[A-Za-z_]\w*=/.test(nom)) nom = nom.replace(/^[A-Za-z_]\w*=\S*\s*/, '').trim();
  if (!nom) return null;
  nom = nom.split(/\s+/)[0];

  if (/[\\/]/.test(nom)) {
    return existsSync(nom.replace(/\//g, '\\')) ? { trouve: true, ou: nom } : { trouve: false, ou: null };
  }

  const suffixes = extname(nom)
    ? ['']
    : (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean);

  for (const dossier of (process.env.PATH || '').split(delimiter)) {
    if (!dossier) continue;
    for (const suffixe of suffixes) {
      const cible = join(dossier, nom + suffixe);
      try {
        if (existsSync(cible)) return { trouve: true, ou: cible };
      } catch { /* chemin PATH invalide : on passe au suivant */ }
    }
  }
  return { trouve: false, ou: null };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE PARCOURS — on ÉNUMÈRE, on n'écrit aucune liste à la main.
   ⚠️ Une liste écrite à la main devient fausse dès qu'un fichier est ajouté,
      et personne ne s'en aperçoit.
   ═══════════════════════════════════════════════════════════════════════════ */
function parcourir(dossier, trouves = []) {
  let entrees;
  try { entrees = readdirSync(dossier); } catch { return trouves; }
  for (const nom of entrees) {
    if (IGNORES.has(nom)) continue;
    const chemin = join(dossier, nom);
    let st;
    try { st = statSync(chemin); } catch { continue; }
    if (st.isDirectory()) parcourir(chemin, trouves);
    else if (EXTENSIONS.has(extname(nom))) trouves.push(chemin);
  }
  return trouves;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LES CONSTATS
   ═══════════════════════════════════════════════════════════════════════════ */
/* ⚠️ LE CONTEXTE EST MUTABLE, ET C'EST VOULU : le MÊME analyseur sert au dépôt
 *    ET à l'épreuve (`--epreuve`, plus bas). *Ce qui est éprouvé est donc
 *    exactement ce qui tourne sur le dépôt* — une épreuve qui teste une autre
 *    implémentation ne prouve rien. */
let ctx = { constats: [], nonAnalyses: [] };

const ajouter = (c) => ctx.constats.push(c);

const relatif = (p) => p.startsWith(RACINE) ? p.slice(RACINE.length + 1) : p;
const court = (s, n = 96) => { const t = s.replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + ' …' : t; };

/* ═══════════════════════════════════════════════════════════════════════════
   L'ANALYSE D'UN FICHIER
   ═══════════════════════════════════════════════════════════════════════════ */
function analyser(chemin) {
  const extension = extname(chemin);
  const brut = readFileSync(chemin, 'utf8');
  const nom = relatif(chemin);

  if (brut.length > PLAFOND_OCTETS) {
    ctx.nonAnalyses.push({ nom, octets: brut.length });
    return;
  }

  const masque = masquerCommentaires(brut, extension);
  const lignes = masque.split('\n');
  const ligneSource = (index) => (brut.split('\n')[ligneDe(masque, index) - 1] || '').trim();

  let aUnMotif = false;

  /* ── CATÉGORIE 1a · UN CHEMIN ABSOLU VERS UN BINAIRE QUI N'EXISTE PAS ─────
   * ⭐ C'EST LE CONTRÔLE LE PLUS UTILE DU FICHIER : il attrape la MORT
   *    SILENCIEUSE — un outil qui n'existe plus, appelé nulle part au démarrage,
   *    et qui casse au premier appel.
   */
  const cheminsBinaires = [];
  const reBinaire = /[A-Za-z]:[\\/][^\r\n"'`;|<>]*?\.(?:exe|bat|cmd|ps1|py|sh)\b/gi;
  let m;
  while ((m = reBinaire.exec(masque)) !== null) {
    const litteral = m[0];
    // ⚠️ Un chemin peut aussi s'écrire en POSIX absolu : `/usr/bin/…`.
    cheminsBinaires.push({ litteral, index: m.index });
  }
  const rePosix = /\/(?:usr|opt|bin|sbin|snap)\/[^\s"'`;|<>()]*\.(?:sh|py|exe|bin)\b/g;
  while ((m = rePosix.exec(masque)) !== null) {
    cheminsBinaires.push({ litteral: m[0], index: m.index });
  }

  if (cheminsBinaires.length > 0) {
    aUnMotif = true;
    /* ⭐ LA RÈGLE DU REPLI — mesurée, pas supposée.
     *   Trois fichiers de ce dépôt citent DEUX `chrome.exe` : celui de
     *   `Program Files` et celui de `Program Files (x86)`. Ici, seul le premier
     *   existe — le second est un CANDIDAT DE REPLI, testé par `existsSync` juste
     *   à côté. **Ce n'est pas une bombe à retardement, c'est une liste de
     *   recherche.** Sans cette règle, le verrou désignerait trois fichiers sur
     *   un faux défaut — et *un verrou qui désigne tout le monde ne désigne
     *   personne.*
     *   Règle publiée : si le fichier teste l'existence du chemin (existsSync /
     *   Test-Path) ET qu'au moins un des chemins binaires du même fichier
     *   existe, alors un chemin inexistant y est un repli — signalé, non désigné.
     */
    const testeExistence = /existsSync\s*\(|Test-Path/i.test(masque);
    const unExiste = cheminsBinaires.some(({ litteral }) =>
      existsSync(litteral.replace(/\//g, '\\')));

    for (const { litteral, index } of cheminsBinaires) {
      const existe = existsSync(litteral.replace(/\//g, '\\'));
      if (existe) continue;
      const repli = testeExistence && unExiste;
      ajouter({
        fichier: nom,
        ligne: ligneDe(masque, index),
        categorie: 1,
        gravite: repli ? 'repli' : 'designe',
        extrait: litteral,
        sourceLigne: ligneSource(index),
        pourquoi: repli
          ? 'chemin inexistant, MAIS ce fichier teste l’existence de ses candidats et un autre candidat existe — c’est une liste de repli, pas une bombe'
          : 'CHEMIN ABSOLU VERS UN EXÉCUTABLE QUI N’EXISTE PAS — appelé nulle part au démarrage, il casse au premier appel, en silence',
      });
    }
  }

  /* ── CATÉGORIE 2 · UNE VARIABLE ENTRE DANS UNE COMMANDE — ET CATÉGORIE 1b ──
   * ⭐ La frontière exacte : `exec`/`execSync` passent TOUJOURS par un shell —
   *    une donnée non échappée y devient une commande. `spawn`/`execFile` avec
   *    un TABLEAU d'arguments n'ouvrent aucun shell : une donnée y reste un
   *    argument. **Ce n'est pas la même frontière, et les confondre ferait
   *    désigner la moitié du dépôt.**
   * ⭐ Et c'est ici, dans la MÊME boucle, que vit la catégorie 1b : une commande
   *    NOMMÉE, littérale, qui n'existe pas. Un seul parcours d'appels, donc un
   *    seul endroit où une commande se reconnaît — *deux boucles, c'est deux
   *    vérités, et elles divergent.*
   */
  const reAppel = /(?<![.\w])(exec|execSync|execFile|execFileSync|spawn|spawnSync)\s*\(/g;
  while ((m = reAppel.exec(masque)) !== null) {
    const fonction = m[1];
    const indexParen = m.index + m[0].length - 1;
    const arg = premierArgument(masque, indexParen);
    if (!arg || !arg.texte) continue;
    aUnMotif = true;

    const passeParShell = fonction === 'exec' || fonction === 'execSync';
    const ligne = ligneDe(masque, m.index);
    const src = ligneSource(m.index);

    /* ── CATÉGORIE 1b · LA COMMANDE NOMMÉE QUI N'EXISTE PAS ────────────────
     * Même défaut que 1a, autre surface : ce n'est plus un chemin, c'est un nom
     * d'outil. ⛔ On ne le cherche QUE si la commande est un littéral — sinon ce
     * n'est plus un « outil nommé », c'est une donnée, et c'est la catégorie 2.
     * *Un premier lancement comptait `git` comme commande construite en plus de
     * l'outil absent : deux constats pour un fait, corrigé ici.*
     */
    if (estLitteralPur(arg.texte)) {
      const contenu = arg.texte.slice(1, -1);
      /* ⚠️ Un chemin absolu de binaire est déjà le métier de la catégorie 1a :
       *    le compter ici aussi ferait DEUX constats pour un seul fait. */
      const estCheminDeBinaire = /[A-Za-z]:[\\/].*\.(?:exe|bat|cmd|ps1|py|sh)\b/i.test(contenu);
      if (!estCheminDeBinaire && !contenu.includes(process.execPath)) {
        const r = resoudreCommande(contenu);
        if (r !== null && !r.trouve) {
          ajouter({
            fichier: nom, ligne, categorie: 1, gravite: 'designe',
            extrait: contenu,
            sourceLigne: src,
            pourquoi: `« ${contenu.trim().split(/\s+/)[0]} » n’est résoluble NI dans le PATH de cette machine, NI comme chemin existant — appelé ici, il casse`,
          });
        }
      }
      continue;
    }

    if (/\bshell\s*:\s*true\b/.test(masque.slice(m.index, m.index + 400))) {
      ajouter({
        fichier: nom, ligne, categorie: 2, gravite: 'designe',
        extrait: court(`${fonction}(…) avec shell:true`),
        sourceLigne: src,
        pourquoi: '`shell: true` ouvre un shell : ce qui était un argument redevient une commande.',
      });
      continue;
    }

    if (passeParShell && contientVariable(arg.texte)) {
      ajouter({
        fichier: nom, ligne, categorie: 2, gravite: 'designe',
        extrait: court(`${fonction}(${arg.texte})`),
        sourceLigne: src,
        pourquoi: `${fonction} passe TOUJOURS par un shell : cette commande est construite depuis une variable non échappée. Une donnée y devient une commande.`,
      });
      continue;
    }

    /* ⭐ ACCEPTÉ, ET LE MOTIF EST PUBLIÉ.
     *   Sans cette branche, une acceptation serait un SILENCE — et *un verrou qui
     *   accepte en silence n'est pas un verrou : c'est un tampon.*
     */
    if (!passeParShell) {
      const enTableau = deuxiemeArgEstTableau(masque, arg.fin);
      ajouter({
        fichier: nom, ligne, categorie: 2,
        gravite: enTableau ? 'accepte' : 'a-examiner',
        extrait: court(`${fonction}(${arg.texte}…)`),
        sourceLigne: src,
        motif: enTableau
          ? 'le 1ᵉʳ argument n’est pas un littéral, MAIS le 2ᵉ est un tableau et aucun shell n’est ouvert : la donnée reste un argument, elle ne devient pas une commande'
          : 'le 1ᵉʳ argument n’est pas un littéral et le 2ᵉ n’est pas un tableau : ce verrou ne peut pas dire si un shell s’ouvre — à examiner',
        pourquoi: 'frontière `spawn`/`execFile` — pas de shell, donc pas d’injection',
      });
      continue;
    }

    ajouter({
      fichier: nom, ligne, categorie: 2, gravite: 'a-examiner',
      extrait: court(`${fonction}(${arg.texte})`),
      sourceLigne: src,
      pourquoi: `${fonction} passe par un shell et sa commande n’est pas un littéral : ce verrou ne suit pas la variable, donc il ne tranche pas — à examiner à la main.`,
    });
  }

  /* PowerShell — `Invoke-Expression` et `cmd /c` construisent une commande. */
  if (extension === '.ps1') {
    for (const ligne of lignes) {
      if (/Invoke-Expression|\biex\b/i.test(ligne)) {
        aUnMotif = true;
        ajouter({
          fichier: nom, ligne: ligneDe(masque, masque.indexOf(ligne)), categorie: 2, gravite: 'designe',
          extrait: court(ligne.trim()), sourceLigne: ligne.trim(),
          pourquoi: 'Invoke-Expression réinterprète une chaîne comme du code : c’est la porte d’entrée canonique.',
        });
      }
      if (/cmd(?:\.exe)?\s*\/c/i.test(ligne) && /\$/.test(ligne)) {
        aUnMotif = true;
        ajouter({
          fichier: nom, ligne: ligneDe(masque, masque.indexOf(ligne)), categorie: 2, gravite: 'designe',
          extrait: court(ligne.trim()), sourceLigne: ligne.trim(),
          pourquoi: '`cmd /c` avec une variable : la ligne est recomposée par cmd, pas passée en argument.',
        });
      }
    }
  }

  /* ── CATÉGORIE 3 · UNE VARIABLE ENTRE DANS UN MOTIF ──────────────────────
   * ⭐ Même frontière, autre surface. Un métacaractère non échappé ne casse pas
   *    le programme : il rend le RÉSULTAT FAUX — et c'est pire, parce que rien
   *    ne le signale. *« Deux scripts de contrôle ont rendu des résultats faux
   *    aujourd'hui », mesuré.*
   */
  const reRegExp = /new\s+RegExp\s*\(/g;
  while ((m = reRegExp.exec(masque)) !== null) {
    const arg = premierArgument(masque, m.index + m[0].length - 1);
    if (!arg || !arg.texte) continue;
    aUnMotif = true;
    if (estLitteralPur(arg.texte)) continue;
    if (!contientVariable(arg.texte)) continue;

    const contexte = masque.slice(m.index, m.index + 400);
    const echappe =
      /escapeRegExp|echapperRegExp|echapperPourRegExp|echapperMotif/.test(arg.texte) ||
      /\.replace\(\s*\/\[.*?\]/.test(arg.texte) ||
      /\.replace\(\s*\/\[\^\w\s\]/.test(arg.texte);
    const echappementPartiel = /\.replace\(/.test(arg.texte) && !echappe;

    ajouter({
      fichier: nom,
      ligne: ligneDe(masque, m.index),
      categorie: 3,
      gravite: echappe ? 'accepte' : echappementPartiel ? 'a-examiner' : 'designe',
      extrait: court(arg.texte),
      sourceLigne: ligneSource(m.index),
      motif: echappe ? 'les métacaractères du motif sont échappés avant construction' : undefined,
      pourquoi: echappe
        ? 'motif construit depuis une variable, mais échappé — c’est la bonne façon de le faire'
        : echappementPartiel
          ? 'un échappement partiel est présent, mais ce verrou ne peut pas dire s’il couvre TOUS les métacaractères — à examiner'
          : 'MOTIF CONSTRUIT DEPUIS UNE VARIABLE SANS ÉCHAPPEMENT : un `.` ou un `[` dans la valeur change le motif, et le résultat devient faux SANS RIEN SIGNALER',
      contexteIndice: contexte.length,
    });
  }

  /* ── CATÉGORIE 4 · LE GUILLEMET QUI NE S'ÉCHAPPE PAS ─────────────────────
   * ⛔⛔ LE DÉFAUT N° 1, CELUI QUI A MENTI DEUX FOIS : `\"` dans une chaîne
   *    PowerShell à guillemets doubles n'échappe rien. Le script casse AU
   *    PARSING — il ne tourne pas — et l'opérateur croit que c'est fait.
   *    En PowerShell, l'échappement est `` `" `` (backtick) ou `""`.
   */
  if (extension === '.ps1') {
    const reEchappement = /\\"/g;
    while ((m = reEchappement.exec(masque)) !== null) {
      aUnMotif = true;
      ajouter({
        fichier: nom,
        ligne: ligneDe(masque, m.index),
        categorie: 4,
        gravite: 'designe',
        extrait: '\\"',
        sourceLigne: ligneSource(m.index),
        pourquoi: '`\\"` n’échappe RIEN en PowerShell : le script casse au parsing, ne tourne pas, et personne ne s’en aperçoit. Écrire `\\`"` (backtick) ou `""`.',
      });
    }
  }

  return aUnMotif;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA MESURE — une seule implémentation, pour le dépôt COMME pour l'épreuve.
   ⭐ *Ce qui est éprouvé est donc exactement ce qui tourne sur le dépôt.*
   ═══════════════════════════════════════════════════════════════════════════ */
function mesurer(racine) {
  ctx = { constats: [], nonAnalyses: [] };
  const fichiers = parcourir(racine).sort();
  const candidats = new Set();
  const erreurs = [];

  for (const f of fichiers) {
    try {
      if (analyser(f)) candidats.add(relatif(f));
    } catch (e) {
      erreurs.push({ nom: relatif(f), message: e.message });
    }
  }
  return { fichiers, candidats, erreurs, constats: ctx.constats, nonAnalyses: ctx.nonAnalyses };
}

/* ═══════════════════════════════════════════════════════════════════════════
   ⭐⭐⭐ L'ÉPREUVE — LA LOI DU STUDIO : « ON PROUVE QU'IL MORD EN ROUVRANT LE
   DÉFAUT EXPRÈS ».

   ⛔ Un garde-fou qui ne couvre qu'un chemin est une porte. Ici, le risque est
      précis : un motif trop étroit ne mord jamais, **et il est vert** — donc il
      rassure sans protéger.

   ⭐ L'épreuve écrit des TÉMOINS portant les quatre défauts CONNUS, plus les
      quatre faux positifs qui ont failli faire désigner tout le monde, et
      vérifie que l'analyseur :
        · désigne ce qu'il doit désigner (les 4 catégories mordent) ;
        · n'écrase PAS ce qu'il doit épargner (le repli, le tableau d'arguments).

   ⚠️ Les témoins vivent dans le dossier temporaire du système, JAMAIS dans le
      dépôt : *une épreuve qui écrit dans le dépôt se prend pour un chantier.*
   ═══════════════════════════════════════════════════════════════════════════ */
/* ⛔⛔ POURQUOI LES TÉMOINS SONT COMPOSÉS, ET NON ÉCRITS D'UN SEUL BLOC.
 *
 *    MESURÉ sur la première version de cette épreuve : écrits d'un bloc, les
 *    témoins faisaient apparaître `execSync('echo ' + valeur)` **dans la source
 *    de ce fichier** — et ce fichier est analysé par lui-même, comme tous les
 *    autres. Résultat : **le verrou se désignait LUI-MÊME**, 5 constats faux, et
 *    son taux de désignation passait de 45,5 % à 50 %.
 *    *Un verrou qui se désigne lui-même est un verrou qu'on n'écoute plus.*
 *
 *    ⛔ Et on ne s'exclut PAS du balayage pour autant : **un verrou qui se donne
 *       un passe-droit ne vérifie plus rien de lui-même.** Le fichier reste dans
 *       son propre périmètre.
 *
 *    ⭐ On compose donc les noms d'appels. Et ce n'est pas un artifice : un témoin
 *      est une **DONNÉE** écrite sur le disque, pas du code exécuté ici — c'est
 *      exactement le sujet de ce verrou, la frontière entre les deux.
 */
const F_EXEC = 'exec' + 'Sync';
const F_SPAWN = 'spawn';
const C_REGEXP = 'new ' + 'RegExp';
const C_FANTOME = 'C:' + '\\\\Outils\\\\fantome-9.0.1-full_build\\\\outil.exe';
const C_ABSENT = 'outil-absent-du-studio-9.0.1';

const TEMOIN_MJS = [
  `import { execSync, spawn } from 'node:child_process';`,
  ``,
  `const valeur = process.argv[2];`,
  ``,
  `// Catégorie 2 — une variable entre dans une commande : concaténation.`,
  `${F_EXEC}('echo ' + valeur);`,
  `// Catégorie 2 — la même, en interpolation.`,
  `${F_EXEC}(\`tar -xf \${valeur}\`);`,
  ``,
  `// Catégorie 3 — une variable entre dans un motif.`,
  `const motif = ${C_REGEXP}('^' + valeur + '$');`,
  ``,
  `// Catégorie 1 — un outil nommé qui n'existe pas.`,
  `${F_EXEC}('${C_ABSENT} --version');`,
  `// Catégorie 1 — un chemin absolu d'exécutable qui n'existe pas.`,
  `${F_EXEC}('${C_FANTOME} --version');`,
  ``,
  `// ACCEPTÉ — le 2ᵉ argument est un tableau, aucun shell n'est ouvert.`,
  `const chemin = process.env.CHROME_PATH;`,
  `${F_SPAWN}(chemin, ['--headless=new'], { stdio: 'ignore' });`,
  ``,
].join('\n');

const TEMOIN_PS1 = [
  `# Un témoin : il porte le défaut n° 1, celui qui a menti deux fois.`,
  `$nom = "monde"`,
  `Write-Host \\"bonjour $nom\\"`,
  ``,
].join('\n');

function epreuve() {
  const dossier = join(tmpdir(), `epreuve-injection-${process.pid}`);
  mkdirSync(dossier, { recursive: true });
  writeFileSync(join(dossier, 'temoin-injection.mjs'), TEMOIN_MJS, 'utf8');
  writeFileSync(join(dossier, 'temoin-injection.ps1'), TEMOIN_PS1, 'utf8');

  const r = mesurer(dossier);
  const parCle = (cat, gravy) => r.constats.filter((c) => c.categorie === cat && c.gravite === gravy);

  /* ⭐ LES ATTENDUS — écrits AVANT la mesure, et jamais ajustés après.
   *    ⛔ Un attendu qu'on corrige après avoir vu le résultat n'est pas une
   *       épreuve : c'est une description. */
  const attendus = [
    ['catégorie 2 mord sur une concaténation',        parCle(2, 'designe').length >= 2],
    ['catégorie 2 mord sur une interpolation',        parCle(2, 'designe').some((c) => c.extrait.includes('tar -xf'))],
    ['catégorie 3 mord sur un motif construit',       parCle(3, 'designe').length >= 1],
    ['catégorie 1 mord sur un outil nommé absent',    parCle(1, 'designe').some((c) => c.extrait.includes('outil-absent-du-studio'))],
    ['catégorie 1 mord sur un chemin .exe absent',    parCle(1, 'designe').some((c) => c.extrait.includes('fantome-9.0.1'))],
    ['catégorie 4 mord sur un guillemet mal échappé', parCle(4, 'designe').length >= 1],
    ['le tableau d’arguments est ACCEPTÉ, pas désigné', parCle(2, 'accepte').length >= 1],
    ['aucun faux positif sur le spawn accepté',       !r.constats.some((c) => c.gravite === 'designe' && /spawn/.test(c.extrait || ''))],
    ['le masquage ne casse pas la numérotation',      r.erreurs.length === 0],
  ];

  console.log('\n' + '='.repeat(78));
  console.log('  ÉPREUVE DU VERROU — les quatre catégories mordent-elles ?');
  console.log('='.repeat(78));
  console.log(gris(`  Témoins écrits dans ${dossier} — JAMAIS dans le dépôt.`));
  console.log(`  ${r.fichiers.length} fichier(s) témoin(s) · ${r.constats.length} constat(s).`);
  console.log('');

  let rates = 0;
  for (const [quoi, tenu] of attendus) {
    console.log(`  ${tenu ? vert('[ok]') : rouge('[KO]')}  ${quoi}`);
    if (!tenu) rates++;
  }

  console.log('');
  console.log('='.repeat(78));
  if (rates === 0) {
    console.log(vert(`  Épreuve tenue — ${attendus.length} attendu(s) sur ${attendus.length}.`));
    console.log(gris('  ⭐ Le verrou mord, et il épargne ce qu’il doit épargner. On l’a PROUVÉ,'));
    console.log(gris('     on ne l’a pas supposé.'));
  } else {
    console.log(rouge(`  Épreuve RATÉE — ${rates} attendu(s) non tenu(s) sur ${attendus.length}.`));
    console.log(gris('  ⛔ Un motif qui ne mord pas est un motif vert : il rassure sans protéger.'));
  }
  console.log('='.repeat(78) + '\n');

  try { rmSync(dossier, { recursive: true, force: true }); } catch { /* temporaire : le système nettoiera */ }
  process.exit(rates === 0 ? 0 : 1);
}

const MODE_EPREUVE = process.argv.includes('--epreuve');

/* ═══════════════════════════════════════════════════════════════════════════
   L'EXÉCUTION
   ═══════════════════════════════════════════════════════════════════════════ */
if (MODE_EPREUVE) epreuve();

console.log('\n' + '='.repeat(78));
console.log('  INJECTION — la frontière entre une donnée et une commande');
console.log('='.repeat(78));

const { fichiers, candidats, erreurs, constats, nonAnalyses } = mesurer(RACINE);

for (const e of erreurs) console.log(gris(`  [--]  ${e.nom} — non analysé : ${e.message}`));

if (fichiers.length === 0) {
  console.log(rouge('  [KO]  aucun fichier .mjs/.js/.ps1 parcouru.'));
  console.log(gris('        Le balayage est cassé, pas le code. On ne rend pas « vert » un'));
  console.log(gris('        dossier vide : un verrou qui ne mesure rien rassure sans protéger.'));
  console.log('='.repeat(78) + '\n');
  process.exit(2);
}

const designes = constats.filter((c) => c.gravite === 'designe');
const aExaminer = constats.filter((c) => c.gravite === 'a-examiner');
const acceptes = constats.filter((c) => c.gravite === 'accepte');
const replis = constats.filter((c) => c.gravite === 'repli');

const fichiersDesignes = new Set(designes.map((c) => c.fichier));
const tauxScannes = (fichiersDesignes.size / fichiers.length) * 100;
const tauxCandidats = candidats.size > 0 ? (fichiersDesignes.size / candidats.size) * 100 : 0;

console.log('');
console.log(`  ${fichiers.length} fichier(s) parcouru(s) — ${cyan(String(candidats.size))} candidat(s) ` +
  `(au moins un motif examiné) — ${designes.length > 0 ? rouge(String(designes.length)) : vert('0')} point(s) désigné(s) ` +
  `sur ${rouge(String(fichiersDesignes.size))} fichier(s).`);
if (nonAnalyses.length > 0) {
  console.log(gris(`  ${nonAnalyses.length} fichier(s) au-delà du plafond de ${PLAFOND_OCTETS} caractères : non analysés, ` +
    `et SIGNALÉS comme tels (${nonAnalyses.map((n) => n.nom).join(', ')}).`));
}

const LIBELLES = {
  1: 'CATÉGORIE 1 · OUTIL ABSENT — la mort silencieuse',
  2: 'CATÉGORIE 2 · COMMANDE CONSTRUITE — une variable entre dans une commande',
  3: 'CATÉGORIE 3 · MOTIF CONSTRUIT — une variable entre dans une expression régulière',
  4: 'CATÉGORIE 4 · ÉCHAPPEMENT DE SHELL — le guillemet qui ne s’échappe pas',
};

/* ── LE REGROUPEMENT — un fait, une ligne.
 * ⚠️ MESURÉ AU PREMIER LANCEMENT : `git` était désigné QUATRE fois, parce que
 *    `generer-etat.mjs` l'appelle quatre fois. Quatre lignes pour un seul fait,
 *    c'est **un chiffre qui ment sur l'ampleur du problème** — exactement le
 *    défaut que ce studio a payé toute la journée du 22/09.
 *    ⭐ On regroupe, et on LISTE les lignes concernées : l'information est
 *      conservée, le compte redevient honnête.
 */
function regrouper(liste) {
  const parCle = new Map();
  for (const c of liste) {
    const cle = `${c.categorie}|${c.gravite}|${c.fichier}|${c.extrait}|${c.pourquoi}`;
    if (!parCle.has(cle)) parCle.set(cle, { ...c, lignes: [c.ligne] });
    else parCle.get(cle).lignes.push(c.ligne);
  }
  return [...parCle.values()];
}

const designesG = regrouper(designes);
const aExaminerG = regrouper(aExaminer);
const acceptesG = regrouper(acceptes);
const replisG = regrouper(replis);

/* ⭐ UNE SEULE PASSE, GROUPÉE PAR CATÉGORIE : regroupée, elle ne répète pas un
 *   titre — et un titre répété fait croire à deux problèmes là où il n'y en a
 *   qu'un. Chaque constat porte SA marque, donc « désigné » et « à examiner »
 *   restent distincts à la lecture. */
function afficherConstats(regroupes) {
  for (const cat of [1, 2, 3, 4]) {
    const lot = regroupes.filter((c) => c.categorie === cat);
    if (lot.length === 0) continue;
    console.log('');
    console.log(`  ── ${LIBELLES[cat]} ──`);
    for (const c of lot) {
      const marque =
        c.gravite === 'designe' ? rouge('[!!]')
          : c.gravite === 'a-examiner' ? jaune('[??]')
            : gris('[--]');
      const lieux = c.lignes.length > 1
        ? `${c.fichier}:${c.lignes[0]} ${gris(`(+ ${c.lignes.length - 1} appel(s) identique(s) : lignes ${c.lignes.slice(1).join(', ')})`)}`
        : `${c.fichier}:${c.lignes[0]}`;
      console.log(`  ${marque} ${gris(lieux)}`);
      console.log(`        ${court(c.extrait, 110)}`);
      console.log(`        ${gris(c.pourquoi)}`);
    }
  }
}

afficherConstats([...designesG, ...aExaminerG, ...replisG]);

if (acceptesG.length > 0) {
  console.log('');
  console.log('  ── ACCEPTÉS, AVEC LEUR MOTIF ──');
  console.log(gris('     ⭐ Ce qui est accepté doit dire POURQUOI : une acceptation sans motif'));
  console.log(gris('        n’est pas un contrôle, c’est un tampon.'));
  for (const c of acceptesG) {
    const lieux = c.lignes.length > 1 ? `${c.fichier}:${c.lignes[0]} (+${c.lignes.length - 1})` : `${c.fichier}:${c.lignes[0]}`;
    console.log(`  ${vert('[ok]')} ${gris(lieux)}  ${court(c.extrait, 76)}`);
    console.log(`        ${gris(c.motif)}`);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE TAUX DE DÉSIGNATION — mesuré, et publié.
   ⭐ Le défaut qu'on a payé : une première table qui matchait 18 fichiers sur 23
      « ne désignait plus rien ». Une table large épargne par accident, et une
      table large désigne par accident. **On mesure le taux, et on le dit.**
   ═══════════════════════════════════════════════════════════════════════════ */
console.log('');
console.log('  ── LE TAUX DE DÉSIGNATION — la calibration, chiffrée ──');
console.log(`     ${fichiersDesignes.size} / ${fichiers.length} fichier(s) parcouru(s)  →  ${tauxScannes.toFixed(1)} %`);
console.log(`     ${fichiersDesignes.size} / ${candidats.size} fichier(s) candidat(s)  →  ${tauxCandidats.toFixed(1)} %`);
console.log(gris(`     ${designes.length} point(s) désigné(s) regroupés en ${designesG.length} fait(s) distinct(s) · ` +
  `${aExaminer.length} à examiner · ${acceptes.length} accepté(s) · ${replis.length} repli(s) nommé(s)`));

/* ⭐ LES CANDIDATS MUETS — la transparence de la calibration.
 *   Un fichier où la recherche a eu lieu et qui ne produit AUCUN constat, ni
 *   désigné, ni accepté, ni repli. On les nomme : c'est ce qui permet de
 *   vérifier que le taux ne vient pas d'un motif qui ne mord jamais. */
const fichiersAvecConstat = new Set(constats.map((c) => c.fichier));
const candidatsMuet = [...candidats].filter((f) => !fichiersAvecConstat.has(f)).sort();
if (candidatsMuet.length > 0) {
  console.log(gris(`     ${candidatsMuet.length} candidat(s) examiné(s) sans aucun constat : ${candidatsMuet.join(', ')}`));
}

if (tauxCandidats > 50) {
  console.log(jaune('     ⚠️  Plus de la moitié des candidats sont désignés : à ce taux, le verrou'));
  console.log(jaune('         ne désigne plus personne. Il est TROP LARGE — resserrer les motifs.'));
} else if (designes.length === 0) {
  console.log(gris('     Aucun point désigné. ⭐ Ce n’est pas la même chose que « le dépôt est sûr » :'));
  console.log(gris('        c’est « les quatre catégories de ce verrou ne trouvent rien ». Le taux de'));
  console.log(gris(`        candidats (${candidats.size} fichier(s)) dit que la recherche a bien eu lieu.`));
} else {
  console.log(gris('     Taux resserré : les motifs écartent explicitement les listes de repli,'));
  console.log(gris('     les littéraux purs et les tableaux d’arguments sans shell.'));
}

/* ── LE VERDICT ──────────────────────────────────────────────────────────── */
console.log('');
console.log('='.repeat(78));

if (!BLOQUANT) {
  if (designes.length === 0) {
    console.log(vert(`  Les 4 catégories mesurées — ${designes.length} point(s) désigné(s).`));
  } else {
    console.log(jaune(`  ${designes.length} point(s) désigné(s) sur ${fichiersDesignes.size} fichier(s), ` +
      `${aExaminer.length} à examiner.`));
    console.log(gris('  ⛔ Ce verrou DÉSIGNE ; il ne condamne pas. Il le fait exprès : tout l’existant'));
    console.log(gris('     n’est pas échappé, et un garde-fou qui rougit le jour de sa naissance'));
    console.log(gris('     est un garde-fou qu’on apprend à contourner en silence.'));
    console.log(gris('     Pour qu’il condamne : INJECTION_BLOQUANT=1'));
  }
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

console.log(jaune('  ⚠️  INJECTION_BLOQUANT=1 — CE VERROU CONDAMNE.'));
console.log('');
if (designes.length === 0) {
  console.log(vert('  Aucun point désigné : il n’y a rien à condamner.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}
console.log(rouge(`  INJECTION_BLOQUANT=1 — ${designes.length} point(s) désigné(s) :`));
for (const c of designes) {
  console.log(rouge(`    ${c.fichier}:${c.ligne}  [catégorie ${c.categorie}]  ${court(c.extrait, 70)}`));
}
console.log('');
console.log('  Corriger ce qui est signalé — ou nommer l’enfreinte en la disant.');
console.log('='.repeat(78) + '\n');
process.exit(1);
