/**
 * AUDIO DIÉGÉTIQUE DU POSTE — désactivé par défaut, synthétisé, mémorisé.
 *
 * PRINCIPE, et c'est le point important : le son est ÉTEINT tant que le visiteur
 * ne l'a pas demandé explicitement. Un site d'agence qui fait du bruit à
 * l'arrivée est une nuisance, pas une expérience — et les navigateurs bloquent
 * de toute façon toute lecture automatique. Ici, rien ne se déclenche avant un
 * clic volontaire sur l'interrupteur.
 *
 * Aucun fichier son : tout est SYNTHÉTISÉ par l'API Web Audio du navigateur.
 * Zéro octet téléchargé, zéro licence à gérer, et le timbre est celui qu'on
 * veut. C'est aussi ce qui rend le mode sobre facile à tenir : couper le son,
 * c'est ne plus rien générer.
 *
 * Ce que ça produit, volontairement pauvre : de courts signaux d'interface —
 * un « top » de console quand une commande s'exécute, un souffle très bas quand
 * le pavillon se hisse. Pas de musique, pas d'ambiance permanente : un décor
 * sonore continu est insupportable au bout d'une minute.
 */
import { ref, watch } from 'vue';

const CLE = 'gldl-audio-poste';

function lirePreference() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(CLE) === '1';
  } catch {
    return false;
  }
}

export const audioActif = ref(lirePreference());

let contexte = null;

/** Le contexte audio ne se crée qu'au premier clic volontaire : c'est la règle
 *  des navigateurs, et c'est aussi la bonne manière de respecter le visiteur. */
function obtenirContexte() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!contexte) contexte = new AC();
  if (contexte.state === 'suspended') contexte.resume();
  return contexte;
}

watch(audioActif, (actif) => {
  if (typeof window === 'undefined') return;
  try {
    if (actif) window.localStorage.setItem(CLE, '1');
    else window.localStorage.removeItem(CLE);
  } catch {
    /* stockage indisponible : le réglage vaut pour la session en cours */
  }
  if (!actif && contexte) {
    // On suspend plutôt que de détruire : réactiver est instantané.
    contexte.suspend();
  }
});

/** Un court signal d'interface. `type` : 'console' | 'pavillon'. */
export function jouerSignal(type = 'console') {
  if (!audioActif.value) return;

  // Le mode sobre coupe le son comme le reste : il n'y a pas d'exception.
  if (typeof document !== 'undefined'
      && document.getElementById('app')?.classList.contains('app--sobre')) return;

  const ctx = obtenirContexte();
  if (!ctx) return;

  const t = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  if (type === 'pavillon') {
    // Hissage : un souffle grave qui monte, très court.
    const souffle = ctx.createOscillator();
    souffle.type = 'sine';
    souffle.frequency.setValueAtTime(90, t);
    souffle.frequency.exponentialRampToValueAtTime(150, t + 0.18);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    souffle.connect(gain);
    souffle.start(t);
    souffle.stop(t + 0.36);
    return;
  }

  // Console : deux tops brefs, nets, sans réverbération.
  [880, 1320].forEach((freq, i) => {
    const top = ctx.createOscillator();
    const enveloppe = ctx.createGain();
    top.type = 'square';
    top.frequency.value = freq;
    const debut = t + i * 0.045;
    enveloppe.gain.setValueAtTime(0, debut);
    enveloppe.gain.linearRampToValueAtTime(0.035, debut + 0.005);
    enveloppe.gain.exponentialRampToValueAtTime(0.0001, debut + 0.07);
    top.connect(enveloppe);
    enveloppe.connect(gain);
    top.start(debut);
    top.stop(debut + 0.09);
  });
}

export function basculerAudio() {
  audioActif.value = !audioActif.value;
  // Retour immédiat : on joue le signal au moment où on l'active, pour que le
  // visiteur sache à quoi il vient de consentir.
  if (audioActif.value) jouerSignal('console');
}
