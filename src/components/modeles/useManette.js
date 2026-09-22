/**
 * useManette.js — LA MANETTE XBOX, ET LA NAVIGATION SPATIALE.
 *
 * Consigne du dirigeant, écrite noir sur blanc : « si tu fais des jeux pense à la
 * navigation manette xbox ». Elle vaut ici pour un site, et elle a une conséquence
 * précise : **la tranche doit être parcourable de bout en bout sans clavier** —
 * catalogue, filtre, tri, fiche, variantes, quantité, panier, formulaire, validation.
 *
 * ⚠ LE POINT DIFFICILE, ET IL EST ASSUMÉ : un formulaire de commande contient des champs
 * de TEXTE LIBRE (nom, adresse, courriel). Une manette n'écrit pas de lettres. Prétendre
 * le contraire serait mentir à l'écran. D'où le CLAVIER VIRTUEL (`ClavierManette.vue`) :
 * la manette ouvre un clavier dessiné en SVG plein de boutons, le parcourt au stick, et
 * saisit caractère par caractère. *Sans lui, « zéro touche clavier » serait un slogan.*
 *
 * TROIS PIÈCES, ET ELLES SONT SÉPARÉES À DESSEIN :
 *   1. la LECTURE de la manette — `navigator.getGamepads()`, sondée par `requestAnimationFrame`
 *      quand une manette est là, par un simple intervalle quand il n'y en a pas. Sonder
 *      `getGamepads` à 60 Hz en permanence réveillerait le processeur pour rien sur la
 *      majorité des visites, qui se font à la souris ;
 *   2. les ACTIONS NOMMÉES (valider, retour, ajouter, quantité…). Les composants ne
 *      connaissent pas les numéros de boutons : ils déclarent ce qu'ils savent faire ;
 *   3. la NAVIGATION SPATIALE — déplacer le focus vers l'élément *qui est dans cette
 *      direction*, par géométrie, et non selon un ordre écrit à la main qui deviendrait
 *      faux dès qu'une carte change de place.
 *
 * ⚠ PILE DE PRIORITÉ. Une seule action par nom est exécutée : la plus LOCALE. L'étape
 * « fiche produit » sait ce que veut dire « quantité + » ; le catalogue, non. La pile est
 * relue du haut vers le bas, et le premier composant qui déclare l'action la prend.
 *
 * Rien ici ne touche au réseau, ni au clavier de saisie, ni au `localStorage`.
 */

import { onUnmounted, ref } from 'vue';

/** Numérotation standard d'une manette Xbox (« standard gamepad mapping »).
 *  Ces numéros sont une NORME, pas un choix : le navigateur les expose ainsi. */
export const BOUTON = {
  A: 0,
  B: 1,
  X: 2,
  Y: 3,
  GACHETTE_GAUCHE: 4,
  GACHETTE_DROITE: 5,
  DETENTE_GAUCHE: 6,
  DETENTE_DROITE: 7,
  SELECT: 8,
  START: 9,
  STICK_GAUCHE: 10,
  STICK_DROIT: 11,
  CROIX_HAUT: 12,
  CROIX_BAS: 13,
  CROIX_GAUCHE: 14,
  CROIX_DROITE: 15,
};

/** Ce que la manette SAIT DEMANDER. La liste est écrite une fois, ici. */
export const ACTIONS = [
  'valider',
  'retour',
  'ajouter',
  'panier',
  'etapePrecedente',
  'etapeSuivante',
  'quantiteMoins',
  'quantitePlus',
  'aide',
];

const ZONE_MORTE = 0.45;
const SEUIL_DETENTE = 0.5;
const DELAI_REPETITION_MS = 350;
const INTERVALLE_REPETITION_MS = 130;
const PERIODE_VEILLE_MS = 500;
const EPSILON_DIRECTION_PX = 6;

/* ────────────────────────────────────────────────────────────────────────────────
   ÉTAT OBSERVABLE
   ──────────────────────────────────────────────────────────────────────────────── */

export const manetteConnectee = ref(false);
export const nomManette = ref('');
export const derniereAction = ref('');
export const indexManette = ref(-1);

/* ────────────────────────────────────────────────────────────────────────────────
   PILE DE GESTIONNAIRES
   ──────────────────────────────────────────────────────────────────────────────── */

const pile = [];

/**
 * Déclare les actions qu'un composant sait traiter.
 * @param {Record<string, Function>} actions
 * @returns {Function} la fonction de retrait — à appeler au démontage.
 */
export function enregistrerActionsManette(actions) {
  const entree = { actions };
  pile.push(entree);
  return () => {
    const position = pile.indexOf(entree);
    if (position >= 0) pile.splice(position, 1);
  };
}

/** Enregistre des actions et les retire automatiquement au démontage du composant. */
export function useActionsManette(actions) {
  const retirer = enregistrerActionsManette(actions);
  onUnmounted(retirer);
  return retirer;
}

function declencher(action) {
  for (let i = pile.length - 1; i >= 0; i -= 1) {
    const gestionnaire = pile[i].actions;
    if (gestionnaire && typeof gestionnaire[action] === 'function') {
      derniereAction.value = action;
      gestionnaire[action]();
      return true;
    }
  }
  return false;
}

/* ────────────────────────────────────────────────────────────────────────────────
   NAVIGATION SPATIALE
   ──────────────────────────────────────────────────────────────────────────────── */

const SELECTEUR_FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Un élément est candidat s'il est réellement PEINT : une taille nulle veut dire caché. */
function estVisible(element) {
  if (element.closest('[hidden]')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  const style = window.getComputedStyle(element);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

/** Les candidats, dans l'ordre du document, débarrassés des invisibles. */
export function candidatsFocus() {
  return Array.from(document.querySelectorAll(SELECTEUR_FOCUSABLE)).filter(estVisible);
}

function centre(rect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * L'élément suivant DANS UNE DIRECTION, choisi par géométrie.
 *
 * Le score est une distance pondérée : on pénalise fortement le désalignement
 * perpendiculaire, sinon « à droite » sauterait volontiers deux rangées plus bas.
 * Séparateur d'égalité : la distance perpendiculaire — le plus proche de l'axe.
 */
export function elementDansDirection(depuis, direction, candidats = candidatsFocus()) {
  const rectDepuis = depuis.getBoundingClientRect();
  const centreDepuis = centre(rectDepuis);
  let meilleur = null;
  let meilleurScore = Infinity;

  for (const candidat of candidats) {
    if (candidat === depuis) continue;
    if (depuis.contains(candidat)) continue;
    const rect = candidat.getBoundingClientRect();
    const c = centre(rect);

    const dx = c.x - centreDepuis.x;
    const dy = c.y - centreDepuis.y;

    let principal;
    let perpendiculaire;
    switch (direction) {
      case 'droite': principal = dx; perpendiculaire = Math.abs(dy); break;
      case 'gauche': principal = -dx; perpendiculaire = Math.abs(dy); break;
      case 'bas': principal = dy; perpendiculaire = Math.abs(dx); break;
      case 'haut': principal = -dy; perpendiculaire = Math.abs(dx); break;
      default: return null;
    }

    if (principal < EPSILON_DIRECTION_PX) continue;

    const score = principal + perpendiculaire * 2.2;
    if (score < meilleurScore) {
      meilleurScore = score;
      meilleur = candidat;
    }
  }

  return meilleur;
}

/** Le dernier élément que la manette a mis au focus — pour ne pas repartir de zéro. */
let dernierFocalise = null;

/**
 * Déplace le focus dans une direction. Rend `true` si le focus a bougé.
 */
export function focusElementSuivant(direction) {
  const candidats = candidatsFocus();
  if (candidats.length === 0) {
    derniereAction.value = `${direction} : aucun élément à viser`;
    return false;
  }

  const actif = document.activeElement;
  const pointDeDepart = actif && candidats.includes(actif)
    ? actif
    : (dernierFocalise && candidats.includes(dernierFocalise) ? dernierFocalise : null);

  let cible;
  if (!pointDeDepart) {
    // Aucun focus : la première pression entre dans la page par le premier candidat.
    cible = candidats[0];
  } else {
    cible = elementDansDirection(pointDeDepart, direction, candidats);
    if (!cible) {
      // On est au bord : on le DIT plutôt que de sauter n'importe où.
      derniereAction.value = `${direction} : bord atteint`;
      return false;
    }
  }

  cible.focus({ preventScroll: true });
  cible.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  dernierFocalise = cible;
  derniereAction.value = `focus ${direction}`;
  return true;
}

/** L'action « A » par défaut : activer l'élément courant, ou le focus si rien ne l'est. */
export function activerElementCourant() {
  const actif = document.activeElement;
  if (!actif || actif === document.body) {
    const candidats = candidatsFocus();
    if (candidats.length > 0) {
      candidats[0].focus();
      candidats[0].scrollIntoView({ block: 'nearest' });
      dernierFocalise = candidats[0];
      derniereAction.value = 'focus sur le premier élément';
      return true;
    }
    return false;
  }

  // Un champ de saisie se FOCALISE (le clavier virtuel est déjà ouvert par le composant
  // qui le gère) : le « cliquer » ferait autre chose, et pas ce qu'on veut.
  if (actif instanceof HTMLInputElement || actif instanceof HTMLTextAreaElement) {
    actif.focus();
    derniereAction.value = 'champ de saisie actif';
    return true;
  }

  if (typeof actif.click === 'function') {
    actif.click();
    derniereAction.value = 'validation';
    return true;
  }
  return false;
}

/* ────────────────────────────────────────────────────────────────────────────────
   LECTURE DE LA MANETTE
   ──────────────────────────────────────────────────────────────────────────────── */

let boucleImages = 0;
let veille = 0;
let etaitPresse = [];
let derniereDirection = null;
let prochainRepetition = 0;
let actif = false;

function manetteCourante() {
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') return null;
  const manettes = navigator.getGamepads();
  for (let i = 0; i < manettes.length; i += 1) {
    const manette = manettes[i];
    if (manette && manette.connected) {
      indexManette.value = i;
      return manette;
    }
  }
  indexManette.value = -1;
  return null;
}

function presse(manette, numero) {
  const bouton = manette.buttons[numero];
  if (!bouton) return false;
  if (numero === BOUTON.DETENTE_GAUCHE || numero === BOUTON.DETENTE_DROITE) {
    return bouton.value > SEUIL_DETENTE || bouton.pressed;
  }
  return bouton.pressed;
}

/** Traduit l'état brut de la manette en intentions — une seule fois, ici. */
function traiterBoutons(manette) {
  const etats = [];

  for (let numero = 0; numero < manette.buttons.length; numero += 1) {
    const maintenant = presse(manette, numero);
    etats.push(maintenant);
    const avant = etaitPresse[numero] === true;
    if (maintenant && !avant) {
      switch (numero) {
        case BOUTON.A: declencher('valider'); break;
        case BOUTON.B: declencher('retour'); break;
        case BOUTON.X: declencher('ajouter'); break;
        case BOUTON.Y: declencher('panier'); break;
        case BOUTON.GACHETTE_GAUCHE: declencher('etapePrecedente'); break;
        case BOUTON.GACHETTE_DROITE: declencher('etapeSuivante'); break;
        case BOUTON.DETENTE_GAUCHE: declencher('quantiteMoins'); break;
        case BOUTON.DETENTE_DROITE: declencher('quantitePlus'); break;
        case BOUTON.SELECT: declencher('aide'); break;
        case BOUTON.START: declencher('panier'); break;
        case BOUTON.CROIX_HAUT: focusElementSuivant('haut'); break;
        case BOUTON.CROIX_BAS: focusElementSuivant('bas'); break;
        case BOUTON.CROIX_GAUCHE: focusElementSuivant('gauche'); break;
        case BOUTON.CROIX_DROITE: focusElementSuivant('droite'); break;
        default: break;
      }
    }
  }
  etaitPresse = etats;

  // Stick gauche : direction dominante, avec répétition tant qu'on maintient.
  const horizontal = manette.axes[0] || 0;
  const vertical = manette.axes[1] || 0;
  let direction = null;
  if (Math.abs(horizontal) > Math.abs(vertical)) {
    if (horizontal > ZONE_MORTE) direction = 'droite';
    else if (horizontal < -ZONE_MORTE) direction = 'gauche';
  } else if (vertical > ZONE_MORTE) direction = 'bas';
  else if (vertical < -ZONE_MORTE) direction = 'haut';

  const temps = performance.now();
  if (!direction) {
    derniereDirection = null;
    prochainRepetition = 0;
    return;
  }
  if (direction !== derniereDirection) {
    derniereDirection = direction;
    prochainRepetition = temps + DELAI_REPETITION_MS;
    focusElementSuivant(direction);
    return;
  }
  if (temps >= prochainRepetition) {
    prochainRepetition = temps + INTERVALLE_REPETITION_MS;
    focusElementSuivant(direction);
  }
}

function image() {
  const manette = manetteCourante();
  if (!manette) {
    manetteConnectee.value = false;
    nomManette.value = '';
    etaitPresse = [];
    boucleImages = 0;
    return;
  }
  if (!manetteConnectee.value) {
    manetteConnectee.value = true;
    // Le nom brut d'une manette est long (« Xbox Wireless Controller (STANDARD GAMEPAD
    // Vendor: 045e Product: 0b13) ») : on garde la partie qui identifie le modèle.
    nomManette.value = String(manette.id || 'manette').split('(')[0].trim() || 'manette';
  }
  traiterBoutons(manette);
  boucleImages = window.requestAnimationFrame(image);
}

function veiller() {
  const manette = manetteCourante();
  if (manette && actif) {
    window.clearInterval(veille);
    veille = 0;
    boucleImages = window.requestAnimationFrame(image);
  }
}

/**
 * Démarre l'écoute. À appeler au montage de la page : une page qu'on ne regarde pas
 * n'a pas à sonder les manettes.
 */
export function demarrerManette() {
  if (actif) return;
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  actif = true;

  const manette = manetteCourante();
  if (manette) {
    boucleImages = window.requestAnimationFrame(image);
  } else {
    veille = window.setInterval(veiller, PERIODE_VEILLE_MS);
  }
}

/** Arrête l'écoute et lâche tout : aucune boucle ne survit au démontage. */
export function arreterManette() {
  actif = false;
  if (boucleImages) window.cancelAnimationFrame(boucleImages);
  if (veille) window.clearInterval(veille);
  boucleImages = 0;
  veille = 0;
  etaitPresse = [];
  manetteConnectee.value = false;
  nomManette.value = '';
  indexManette.value = -1;
}

/** Le guichet unique pour les composants. */
export function useManette() {
  return {
    manetteConnectee,
    nomManette,
    derniereAction,
    demarrerManette,
    arreterManette,
    enregistrerActionsManette,
  };
}

/* ────────────────────────────────────────────────────────────────────────────────
   NAVIGATION AU CLAVIER — les mêmes gestes, avec des flèches.
   ⚠ On ne remplace AUCUNE touche native : Tab, Maj+Tab, Entrée, Espace et Échap
   continuent de faire ce qu'ils font toujours. On ajoute les flèches, et on les
   LAISSE PASSER dès que le focus est dans un champ de saisie — sinon on casserait
   le déplacement du curseur dans un texte, ce qui est un défaut, pas une fonction.
   ──────────────────────────────────────────────────────────────────────────────── */

function estChampDeSaisie(element) {
  if (!element) return false;
  if (element instanceof HTMLTextAreaElement) return true;
  if (element instanceof HTMLInputElement) {
    return !['button', 'submit', 'reset', 'checkbox', 'radio'].includes(element.type);
  }
  return element.isContentEditable === true;
}

export function surToucheClavier(evenement) {
  if (estChampDeSaisie(evenement.target)) return;
  switch (evenement.key) {
    case 'ArrowUp': evenement.preventDefault(); focusElementSuivant('haut'); break;
    case 'ArrowDown': evenement.preventDefault(); focusElementSuivant('bas'); break;
    case 'ArrowLeft': evenement.preventDefault(); focusElementSuivant('gauche'); break;
    case 'ArrowRight': evenement.preventDefault(); focusElementSuivant('droite'); break;
    case 'Escape': declencher('retour'); break;
    default: break;
  }
}
