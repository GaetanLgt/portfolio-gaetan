/**
 * MODE SOBRE — DÉCOR ACTIF PAR DÉFAUT DEPUIS LE 11/09/2026.
 *
 * HISTORIQUE, parce qu'il a basculé deux fois et qu'on va me demander pourquoi.
 *
 *   · Avant le 10/09 : le site ouvrait sur une pluie de code, une scène 3D, du
 *     post-traitement et six univers superposés. Verdict de Gaëtan — « trop
 *     sombre, trop chargé, la 3D nuit au sérieux, et le propos se noie ».
 *   · 10/09 : basculement. Le site s'ouvre SOBRE, le décor devient optionnel
 *     (un bouton dans le pied de page l'active).
 *   · 11/09 : basculement inverse, décision de Gaëtan — « décor activé par
 *     défaut ». Le décor redevient le défaut, et le mode sobre devient ce qu'on
 *     ACTIVE.
 *
 * CE QUI N'A PAS CHANGÉ, ET QUI N'EST PAS NÉGOCIABLE :
 *   · `prefers-reduced-motion` gagne toujours sur ce réglage. « Actif par
 *     défaut » ne veut pas dire « au-dessus du choix système du visiteur » ;
 *   · le mode sobre reste ATTEIGNABLE en permanence (bouton du pied de page) :
 *     on déplace le défaut, on ne retire pas le choix ;
 *   · le mode sobre ne touche jamais au contenu, aux prix, aux liens, ni aux
 *     repères d'accessibilité. Il coupe des effets, rien d'autre.
 *
 * COÛT MESURÉ : le décor ne pèse presque rien en lui-même (1,3 à 1,6 Ko par
 * fond), mais il tire `three.js` derrière lui — 455 887 octets brut,
 * 111 545 octets gzip. C'est three.js qui coûte, pas le décor. Le chiffre est
 * écrit ici pour qu'on ne le redécouvre pas à chaque bascule.
 *
 * SÉMANTIQUE DE STOCKAGE — elle a changé avec le défaut :
 *   la clé s'appelle désormais `gldl-mode-sobre`, et `'1'` signifie « le visiteur
 *   a demandé le MODE SOBRE ». L'ancienne clé `gldl-decor-scifi` signifiait
 *   l'inverse ; la renommer évite de servir à un visiteur l'inverse de ce qu'il
 *   avait demandé.
 */
import { ref, watch } from 'vue';

const CLE = 'gldl-mode-sobre';

/**
 * true = le visiteur a demandé le décor de science-fiction.
 * VRAI PAR DÉFAUT : le décor de science-fiction est actif.
 */
function lirePreference() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLE) === '1';
  } catch {
    return false;
  }
}

/** Le décor est-il actif ? VRAI au premier chargement. */
export const decorActif = ref(!lirePreference());

/** Le mode sobre est l'inverse : il s'active, il ne se subit plus. */
export const modeSobre = ref(lirePreference());

watch(decorActif, (actif) => {
  modeSobre.value = !actif;
});

export function basculerModeSobre() {
  decorActif.value = !decorActif.value;
}

export function basculerDecor() {
  decorActif.value = !decorActif.value;
}

watch(decorActif, (actif) => {
  if (typeof window === 'undefined') return;
  try {
    if (!actif) window.localStorage.setItem(CLE, '1');
    else window.localStorage.removeItem(CLE);
  } catch {
    /* stockage indisponible : le réglage vaut pour la session en cours */
  }
});
