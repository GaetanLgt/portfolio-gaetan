/**
 * runes.js — les runes viking du studio, en données exploitables.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI L'ALPHABET EST LIBRE
 * ───────────────────────────────────────────────────────────────────────────
 * L'ALPHABET EST DU DOMAINE PUBLIC. Le Futhark ancien (24 runes) est un système
 * d'écriture historique, tombé dans le domaine public depuis plus d'un millénaire.
 * Ce n'est donc PAS une franchise protégée : on peut graver des runes sans
 * autorisation de qui que ce soit. C'est précisément pour cela qu'on les choisit.
 *
 * (Justification reprise mot pour mot de `C:\IA\ArkAdiA\outils\runes_viking.py`,
 * qui la porte déjà et qui est dans le vrai. On ne la réécrit pas : on la cite.)
 *
 * D'OÙ VIENNENT CES TRAITS
 * ───────────────────────────────────────────────────────────────────────────
 * Ce fichier est une TRADUCTION, pas une définition. La source unique reste
 * `C:\IA\ArkAdiA\outils\runes_viking.py` (5 575 octets, 111 lignes, mesuré le
 * 22/09/2026), qui sert deux objets imprimables du studio — le sceau et le socle
 * de la maquette. **Une seule définition = une seule vérité** : on recopie les
 * 22 tracés tels quels, on ne les redessine pas, on ne les « améliore » pas.
 * Le `.py` n'est PAS modifié par ce fichier. Si un défaut existe dans la source,
 * il est CONSIGNÉ ici (voir ECARTS_SOURCE) et signalé, jamais comblé en silence.
 *
 * CONVENTION DE COORDONNÉES — MESURÉE, PAS DÉDUITE
 * ───────────────────────────────────────────────────────────────────────────
 * L'en-tête du `.py` annonce « y de 0 (bas) à 1 (haut) ». **C'est faux pour le
 * rendu.** Les tracés sont écrits dans la convention de l'écran : y = 0 en HAUT.
 * La preuve est dans les formes — Thurisaz (ᚦ) a sa pointe en y = 0.00 et sa
 * hampe sous la pointe vers y = 1.00 : lu tel quel, c'est la rune ; inversé, on
 * obtient un triangle pointant vers le bas et un Úruz couché en « M », c'est-à-dire
 * deux runes fausses. Le rendu SVG utilise donc les coordonnées SANS inversion.
 * C'est un écart de la source, et il est reporté dans ECARTS_SOURCE.
 *
 * ⚠️ AUCUN CODE COULEUR ICI. La couleur vient de `currentColor` et des jetons de
 * `src/assets/styles/variables.css`. Un jeton écrit à la main dans ce fichier
 * deviendrait faux à la prochaine bascule de direction artistique sans le dire.
 */

/**
 * Rapport largeur / hauteur d'une rune gravée.
 * Porté depuis `largeur()` du `.py` (`largeur_rune = hauteur * 0.72`).
 * ⭐ Plus haute que large : c'est la proportion d'une rune gravée, et c'est aussi
 * ce qui la rend RECONNAISSABLE (un carré trapu devient un motif).
 */
export const RATIO_LARGEUR = 0.72;

/** Écart entre deux runes, en fraction de la hauteur. Porté de `positions()`. */
export const ECART_DEFAUT = 0.42;

/** Largeur d'une césure (l'espace), en fraction de la hauteur. Portée du `.py`. */
export const LARGEUR_CESURE = 0.5;

/**
 * Les 22 tracés réellement définis par la source.
 *
 * Chaque rune : sa lettre latine (la clé), son nom, son sens attesté en une ligne
 * (les poèmes runiques), et ses segments en boîte normalisée [x1, y1, x2, y2].
 * x : 0 à gauche → 1 à droite. y : 0 EN HAUT → 1 en bas (convention écran, voir
 * l'en-tête : c'est ce que la source dessine vraiment).
 */
export const RUNES = {
  // Fehu, Uruz, Thurisaz
  F: { nom: 'Fehu', sens: 'le bétail', segments: [[0.24, 0.0, 0.24, 1.0], [0.24, 0.62, 0.74, 1.0], [0.24, 0.3, 0.74, 0.68]] },
  U: { nom: 'Uruz', sens: "l'aurochs", segments: [[0.24, 1.0, 0.24, 0.34], [0.24, 0.34, 0.5, 0.0], [0.5, 0.0, 0.76, 0.34], [0.76, 0.34, 0.76, 1.0]] },
  T: { nom: 'Thurisaz', sens: "l'épine", segments: [[0.24, 1.0, 0.24, 0.32], [0.24, 0.32, 0.5, 0.0], [0.5, 0.0, 0.76, 0.32], [0.5, 0.6, 0.5, 1.0]] },

  // Ansuz, Raidho, Kaunan
  A: { nom: 'Ansuz', sens: 'le dieu', segments: [[0.26, 0.0, 0.26, 1.0], [0.26, 0.7, 0.78, 1.0], [0.26, 0.4, 0.78, 0.7]] },
  R: { nom: 'Raidho', sens: 'la chevauchée', segments: [[0.26, 0.0, 0.26, 1.0], [0.26, 1.0, 0.7, 0.76], [0.7, 0.76, 0.26, 0.52], [0.4, 0.38, 0.8, 0.0]] },
  K: { nom: 'Kaunan', sens: 'la torche', segments: [[0.78, 1.0, 0.26, 0.5], [0.26, 0.5, 0.78, 0.0]] },

  // Gebo, Wunjo, Hagalaz
  G: { nom: 'Gebo', sens: 'le don', segments: [[0.2, 0.82, 0.8, 0.18], [0.2, 0.18, 0.8, 0.82]] },
  W: { nom: 'Wunjo', sens: 'la joie', segments: [[0.22, 0.0, 0.22, 1.0], [0.78, 0.0, 0.78, 1.0], [0.22, 1.0, 0.5, 0.62], [0.78, 1.0, 0.5, 0.62]] },
  H: { nom: 'Hagalaz', sens: 'la grêle', segments: [[0.24, 0.0, 0.24, 1.0], [0.76, 0.0, 0.76, 1.0], [0.24, 0.62, 0.76, 0.38]] },

  // Nauthiz, Isa, Jera
  N: { nom: 'Nauthiz', sens: 'le besoin', segments: [[0.3, 0.0, 0.3, 1.0], [0.72, 0.0, 0.72, 1.0], [0.3, 0.16, 0.72, 0.84]] },
  // Isa : UN SEUL trait. Le `.py` porte la virgule finale pour que Python lise un
  // tuple de traits et non un quadruplet de flottants ; en JS le tableau imbriqué
  // rend la même chose, mais le commentaire reste : c'est le piège de la source.
  I: { nom: 'Isa', sens: 'la glace', segments: [[0.5, 0.0, 0.5, 1.0]] },
  J: { nom: 'Jera', sens: "l'année", segments: [[0.34, 1.0, 0.34, 0.42], [0.34, 0.42, 0.66, 0.1], [0.66, 0.1, 0.66, 0.72], [0.66, 0.72, 0.2, 1.0]] },

  // Eihwaz, Perthro, Algiz
  E: { nom: 'Eihwaz', sens: "l'if", segments: [[0.5, 0.0, 0.5, 1.0], [0.5, 1.0, 0.22, 0.72], [0.5, 0.0, 0.78, 0.28]] },
  P: { nom: 'Perthro', sens: 'le sort', segments: [[0.3, 0.0, 0.3, 1.0], [0.3, 1.0, 0.74, 0.8], [0.74, 0.8, 0.74, 0.52], [0.74, 0.52, 0.3, 0.34]] },
  Z: { nom: 'Algiz', sens: "l'élan", segments: [[0.5, 0.0, 0.5, 1.0], [0.5, 0.74, 0.24, 1.0], [0.5, 0.74, 0.76, 1.0]] },

  // Sowilo, Tiwaz, Berkano
  S: { nom: 'Sowilo', sens: 'le soleil', segments: [[0.74, 1.0, 0.26, 0.58], [0.26, 0.58, 0.74, 0.42], [0.74, 0.42, 0.26, 0.0]] },
  D: { nom: 'Tiwaz', sens: 'Týr', segments: [[0.22, 0.0, 0.22, 1.0], [0.78, 0.0, 0.78, 1.0], [0.22, 0.0, 0.78, 1.0], [0.22, 1.0, 0.78, 0.0]] },
  B: { nom: 'Berkano', sens: 'le bouleau', segments: [[0.26, 0.0, 0.26, 1.0], [0.26, 1.0, 0.76, 0.78], [0.76, 0.78, 0.26, 0.52], [0.26, 0.52, 0.76, 0.26], [0.76, 0.26, 0.26, 0.0]] },

  // Ehwaz, Mannaz, Laguz
  M: { nom: 'Ehwaz', sens: 'le cheval', segments: [[0.22, 0.0, 0.22, 1.0], [0.78, 0.0, 0.78, 1.0], [0.22, 1.0, 0.5, 0.52], [0.5, 0.52, 0.78, 1.0]] },
  L: { nom: 'Laguz', sens: "l'eau", segments: [[0.32, 1.0, 0.32, 0.0], [0.32, 1.0, 0.74, 0.42]] },
  Y: { nom: 'Mannaz', sens: "l'homme", segments: [[0.26, 1.0, 0.26, 0.0], [0.74, 1.0, 0.74, 0.0]] },

  // Ingwaz, Dagaz, Othala — le commentaire annonce TROIS runes, une seule suit.
  O: { nom: 'Othala', sens: "l'héritage", segments: [[0.3, 1.0, 0.3, 0.24], [0.3, 0.24, 0.7, 0.24], [0.7, 0.24, 0.7, 1.0], [0.3, 0.62, 0.7, 0.62]] },
};

/**
 * ⭐ LA RÈGLE DES GRAVEURS : une rune note un SON, pas une lettre.
 * Le Futhark ancien n'a pas de lettre pour C, Q, V, X — on écrit le son approchant.
 * Porté de `EQUIVALENCES` du `.py`.
 */
export const EQUIVALENCES = { C: 'K', Q: 'K', V: 'U', X: 'S' };

/**
 * Les seuls mots du studio écrits en runes. Rien d'autre n'est inventé ici.
 * (Confirmé par le dirigeant le 22/09/2026 : « les mots ARKADIA, MND, ça me va
 * très bien. »)
 */
export const MOTS = ['ARKADIA', 'MND'];

/**
 * LES RUNES DU FUTHARK ANCIEN QUI N'ONT AUCUN TRACÉ DANS LA SOURCE.
 * ⛔ On ne les invente pas. On les nomme, et on s'arrête là.
 * Conséquence pratique : un mot qui contiendrait ces sons lève une erreur claire.
 */
export const SANS_TRACE = [
  { lettre: null, nom: 'Ingwaz', sens: 'Ing', note: "note le son « ng » — aucune lettre latine simple" },
  { lettre: 'D', nom: 'Dagaz', sens: 'le jour', note: 'la lettre D est déjà prise par la clé « D » de la source (Tiwaz)' },
];

/**
 * ÉCARTS CONSTATÉS ENTRE LA SOURCE ET ELLE-MÊME — mesurés, pas supposés.
 * ⛔ Ce ne sont PAS des correctifs : la source n'est pas touchée. C'est ce qu'un
 * lecteur doit savoir avant de s'y fier les yeux fermés.
 */
export const ECARTS_SOURCE = [
  {
    quoi: 'Compte des runes',
    detail: "L'en-tête et les commentaires annoncent 24 runes (Futhark ancien complet) ; TRACES définit 22 clés. Il manque Ingwaz et Dagaz.",
  },
  {
    quoi: 'Orientation annoncée',
    detail: "L'en-tête dit « y de 0 (bas) à 1 (haut) ». Les formes disent l'inverse : Thurisaz a sa pointe en y=0. Le rendu SVG lit les coordonnées telles quelles.",
  },
  {
    quoi: 'Clé « D » — nom contre dessin',
    detail: 'Le commentaire du groupe nomme « Tiwaz », le tracé est celui de Dagaz (deux barres verticales barrées de deux diagonales croisées). Tiwaz (la flèche vers le haut) ne figure nulle part dans la source.',
  },
  {
    quoi: 'Clé « Y » (Mannaz)',
    detail: 'Le tracé est DEUX barres verticales parallèles. Mannaz est deux barres reliées par un X : il manque les deux diagonales. En l’état, cette clé ne dessine aucune rune du Futhark ancien.',
  },
  {
    quoi: 'Entrée morte dans EQUIVALENCES',
    detail: 'La source porte 5 entrées dont « C_ » : une clé de DEUX caractères, qui ne peut jamais correspondre à une lettre d’un mot. Elle n’est jamais atteinte. Non recopiée ici.',
  },
];

/** Index par nom de rune ('Fehu' → clé 'F'), pour accepter la lettre OU le nom. */
const PAR_NOM = Object.create(null);
for (const [cle, rune] of Object.entries(RUNES)) {
  PAR_NOM[rune.nom.toLowerCase()] = cle;
}

/** Toutes les clés, dans l'ordre de la source (ordre du Futhark ancien). */
export const LETTRES = Object.keys(RUNES);

/**
 * Résout une lettre OU un nom de rune vers sa clé.
 * Rend `null` si rien ne correspond — on ne devine pas.
 */
export function cleDe(reference) {
  if (typeof reference !== 'string' || reference.length === 0) return null;
  const brut = reference.trim();
  const majuscule = brut.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(RUNES, majuscule)) return majuscule;
  if (Object.prototype.hasOwnProperty.call(EQUIVALENCES, majuscule)) return EQUIVALENCES[majuscule];
  const parNom = PAR_NOM[brut.toLowerCase()];
  return parNom === undefined ? null : parNom;
}

/** Rend la rune (nom, sens, segments) d'une lettre ou d'un nom, ou `null`. */
export function runeDe(reference) {
  const cle = cleDe(reference);
  if (cle === null) return null;
  return { lettre: cle, ...RUNES[cle] };
}

/**
 * Les runes d'un mot, une entrée par caractère ; `null` pour une césure.
 * ⭐ Porté de `runes_pour()` du `.py`, y compris son `raise ValueError` :
 * **une lettre sans rune fait échouer, elle ne passe pas en silence.**
 * Un mot à moitié gravé qui s'affiche quand même est un défaut, pas une tolérance.
 */
export function runesPour(mot) {
  if (typeof mot !== 'string') {
    throw new Error(`MotEnRunes : un mot est attendu (chaîne), reçu ${typeof mot}.`);
  }
  const resultat = [];
  for (const lettre of mot.toUpperCase()) {
    // La césure n'est pas une lettre : c'est un blanc dans la gravure.
    if (lettre === ' ') {
      resultat.push(null);
      continue;
    }
    const rune = runeDe(lettre);
    if (rune === null) {
      throw new Error(
        `la lettre ${JSON.stringify(lettre)} n'a pas de rune dans le Futhark ancien ` +
          `(mot : ${JSON.stringify(mot)}). Runes disponibles : ${LETTRES.join(', ')} — ` +
          `équivalences : ${Object.entries(EQUIVALENCES).map(([a, b]) => `${a}→${b}`).join(', ')}.`
      );
    }
    resultat.push(rune);
  }
  return resultat;
}

/**
 * Largeur totale d'un mot gravé, en unités de hauteur (1 = la hauteur d'une rune).
 * Porté de `largeur()` du `.py`.
 */
export function largeurMot(mot, ecartRatio = ECART_DEFAUT) {
  const runes = runesPour(mot);
  return runes.reduce((total, rune) => total + (rune === null ? LARGEUR_CESURE : RATIO_LARGEUR), 0)
    + ecartRatio * Math.max(0, runes.length - 1);
}

/**
 * ASSERTION DE STRUCTURE — le contrôle vit au point de passage obligé (l'import),
 * et il porte sur la STRUCTURE, pas sur les ingrédients : un trait qui n'est pas
 * quatre nombres finis dans [0, 1] fait échouer le chargement au lieu de dessiner
 * une rune fausse. Un garde-fou qui ne couvre qu'un chemin est une porte.
 */
export function verifierRunes() {
  const problemes = [];
  for (const [cle, rune] of Object.entries(RUNES)) {
    if (!rune.nom || !rune.sens) problemes.push(`rune « ${cle} » : nom ou sens manquant`);
    if (!Array.isArray(rune.segments) || rune.segments.length === 0) {
      problemes.push(`rune « ${cle} » : aucun segment`);
      continue;
    }
    rune.segments.forEach((seg, i) => {
      if (!Array.isArray(seg) || seg.length !== 4) {
        problemes.push(`rune « ${cle} », trait ${i} : ${seg.length ?? '?'} nombre(s) au lieu de 4`);
        return;
      }
      seg.forEach((valeur, j) => {
        if (typeof valeur !== 'number' || !Number.isFinite(valeur)) {
          problemes.push(`rune « ${cle} », trait ${i}, valeur ${j} : ${valeur} n'est pas un nombre fini`);
        } else if (valeur < 0 || valeur > 1) {
          problemes.push(`rune « ${cle} », trait ${i}, valeur ${j} : ${valeur} sort de la boîte [0, 1]`);
        }
      });
    });
  }
  // Le compte est CALCULÉ ici, jamais écrit à la main ailleurs.
  const attendues = LETTRES.length + SANS_TRACE.length;
  if (attendues !== 24) {
    problemes.push(`le Futhark ancien compte 24 runes ; ${LETTRES.length} tracées + ${SANS_TRACE.length} sans tracé = ${attendues}`);
  }
  if (problemes.length > 0) {
    throw new Error('runes.js : données incohérentes —\n  · ' + problemes.join('\n  · '));
  }
  return { tracees: LETTRES.length, sansTrace: SANS_TRACE.length, total: attendues };
}

verifierRunes();
