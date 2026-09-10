/**
 * MODE SOBRE — INVERSÉ LE 10/09/2026. Désormais ACTIF PAR DÉFAUT.
 *
 * Pourquoi ce renversement, après relecture par Gaëtan : le site ouvrait sur
 * une pluie de code, une scène 3D, du post-traitement, des scanlines et six
 * univers superposés. Le verdict a été net — trop sombre, trop chargé, la 3D
 * nuit au sérieux, et le propos se noie. Un visiteur qui cherche un artisan
 * pour un site web recevait un spectacle avant de recevoir une réponse.
 *
 * La nouvelle règle : **le site s'ouvre clair et sobre**. Le décor de science-
 * fiction n'a pas disparu, il est devenu ce qu'il aurait dû être depuis le
 * début — une proposition, pas une imposition. Un bouton dans le pied de page
 * l'active pour qui le veut.
 *
 * Conséquence assumée : la direction artistique n'est plus la première chose
 * qu'on voit. C'est exactement ce qui était demandé.
 *
 * Note : le mode sobre coupe les effets visuels (pluie, 3D, Grille, scanlines,
 * halos, bruit, animations). Il ne touche jamais au contenu, aux prix, aux
 * liens ni aux repères d'accessibilité.
 */
import { ref, watch } from 'vue';

const CLE = 'gldl-decor-scifi';

/**
 * true = le visiteur a demandé le décor de science-fiction.
 * FAUX PAR DÉFAUT : le site s'ouvre sobre.
 */
function lirePreference() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLE) === '1';
  } catch {
    return false;
  }
}

/** Le décor est-il actif ? Faux au premier chargement, toujours. */
export const decorActif = ref(lirePreference());

/** Raccourci de lecture : le mode sobre est simplement l'inverse. */
export const modeSobre = ref(!lirePreference());

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
    if (actif) window.localStorage.setItem(CLE, '1');
    else window.localStorage.removeItem(CLE);
  } catch {
    /* stockage indisponible : le réglage vaut pour la session en cours */
  }
});
