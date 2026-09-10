/**
 * MODE SOBRE — engagement de la charte du studio.
 *
 * Principe : un interrupteur qui coupe TOUS les effets du site — pluie de code,
 * scène 3D, Grille, scanlines, glitchs, balayages, particules, bruit. Neutre
 * (il n'ajoute rien, il retire), réversible (un second clic rétablit tout), et
 * mémorisé d'une visite à l'autre.
 *
 * Pourquoi c'est un engagement et pas un gadget : un visiteur qui a des
 * difficultés visuelles, un appareil modeste, une connexion lente ou simplement
 * l'esprit au travail n'a pas à subir une direction artistique. Le mode sobre
 * est aussi ce qui permet de vendre ce site à une collectivité sans avoir à
 * défendre ses effets.
 *
 * Il est distinct de `prefers-reduced-motion` : celui-ci est une préférence du
 * système d'exploitation, le mode sobre est un choix explicite du visiteur.
 * Les deux se cumulent sans se contredire.
 */
import { ref, watch } from 'vue';

const CLE = 'gldl-mode-sobre';

/** Lu une seule fois au chargement, puis conservé en mémoire. */
function lirePreference() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLE) === '1';
  } catch {
    // Navigation privée ou stockage refusé : on ne casse rien, on repart à zéro.
    return false;
  }
}

export const modeSobre = ref(lirePreference());

watch(modeSobre, (actif) => {
  if (typeof window === 'undefined') return;
  try {
    if (actif) window.localStorage.setItem(CLE, '1');
    else window.localStorage.removeItem(CLE);
  } catch {
    /* stockage indisponible : le mode reste actif pour la session en cours */
  }
});

export function basculerModeSobre() {
  modeSobre.value = !modeSobre.value;
}
