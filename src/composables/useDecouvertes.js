/**
 * useDecouvertes — LES ZONES QUE LE VISITEUR A TROUVÉES. GL Digital Lab, 13/09/2026.
 *
 * POURQUOI CE FICHIER EXISTE
 * Demande de Gaëtan : « site comme un metroidvania ! ». La leçon retenue de la vidéo de
 * Goyo (`veille-video/fiches/metroid-goyo-2026-09-13.md`) est que le sentiment d'exploration
 * ne vient PAS d'un contenu caché : il vient d'un monde **cohérent**, où l'on sait toujours
 * où l'on est et ce qu'il reste à découvrir. Le contenu non trouvé n'est pas verrouillé —
 * il est *ailleurs*.
 *
 * LE CADRAGE RETENU EST LE B
 * Une couche d'exploration PAR-DESSUS le site, jamais un péage. Deux règles non négociables,
 * écrites ici pour qu'on ne les redécouvre pas :
 *
 *   1. **Chaque zone a une vraie adresse, et un vrai lien.** L'exploration change la façon
 *      de TROUVER, jamais la possibilité d'ACCÉDER. Un contenu qu'on ne peut atteindre qu'en
 *      explorant n'existe ni pour un lecteur d'écran ni pour un moteur de recherche — et le
 *      studio verrouille l'accessibilité (axe 0) et le SEO (100).
 *   2. **Aucune donnée ne sort de la machine du visiteur.** L'état de découverte vit dans
 *      `localStorage`, point. Pas de serveur, pas de cookie, pas d'identifiant, pas de
 *      compteur envoyé quelque part. Le RGPD est réglé par construction, pas par un
 *      bandeau de consentement — et Matomo n'est même pas concerné, puisque rien n'est
 *      transmis.
 *
 * CE QUE CE N'EST PAS
 *   · Ce n'est PAS une progression notée. On ne dit jamais « 3 zones sur 14 ». Le jeu
 *     félicite la curiosité, il ne la note pas — et un tableau de chasse transformerait la
 *     découverte en corvée.
 *   · Ce n'est PAS un verrou. Aucune zone n'est inaccessible faute de découverte.
 *   · Ce n'est PAS un effet : le mode sobre ne coupe donc PAS la carte. Le mode sobre coupe
 *     des effets, jamais du contenu ni de la navigation — règle écrite dans `mode-sobre.js`.
 */
import { ref, computed, watch } from 'vue';
// La topographie vient du MANIFESTE, pas d'une liste recopiée ici. C'était l'un des
// quatre endroits où elle vivait, et c'est celui qui a divergé en premier (le sitemap
// avait oublié `/soute` que cette liste connaissait). Une source, désormais.
import { COMPARTIMENTS } from '../config/topographie.js';

const CLE = 'gldl-zones-decouvertes';

/**
 * LA TOPOGRAPHIE DE LA CARTE — dérivée du manifeste `src/config/topographie.js`.
 *
 * Elle vivait ici, recopiée à la main, et c'était l'un des quatre endroits où la
 * topographie du site existait. On n'en garde qu'un : le manifeste. **Ajouter un
 * compartiment au site et l'oublier ici n'est plus possible.**
 *
 * ⚠️ L'IDENTIFIANT EST STABLE, ET IL EST ÉCRIT CHEZ LE VISITEUR. `id` sert de clé dans le
 * `localStorage` : le renommer effacerait la progression de ceux qui ont déjà exploré.
 * Il vit donc dans le manifeste, à côté du nom affiché — qui, lui, peut changer sans
 * conséquence.
 */
export const ZONES = COMPARTIMENTS;

/** Nombre de zones à avoir trouvées pour que le tuyau vert s'ouvre. */
export const SEUIL_SOUTE = 4;

function lire() {
  if (typeof window === 'undefined') return [];   // prérendu : rien à lire, et surtout ne pas planter
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return [];
    const tableau = JSON.parse(brut);
    if (!Array.isArray(tableau)) return [];
    // On ne garde que des identifiants CONNUS : un stockage bricolé à la main ne doit pas
    // pouvoir inventer des zones, ni faire croire à une progression qui n'existe pas.
    return tableau.filter((id) => ZONES.some((z) => z.id === id));
  } catch {
    return [];   // stockage indisponible ou corrompu : on repart d'une carte vierge
  }
}

/** Les identifiants des zones trouvées. */
export const zonesTrouvees = ref(lire());

/** Le visiteur a-t-il trouvé une zone ? */
export function aTrouve(id) {
  return zonesTrouvees.value.includes(id);
}

/**
 * Marque une zone comme trouvée. Idempotent : repasser sur la passerelle ne « compte » pas
 * deux fois, et ne réécrit rien si la zone est déjà connue.
 */
export function marquerTrouvee(id) {
  if (!ZONES.some((z) => z.id === id)) return;
  if (zonesTrouvees.value.includes(id)) return;
  zonesTrouvees.value = [...zonesTrouvees.value, id];
}

watch(zonesTrouvees, (liste) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(liste));
  } catch {
    /* stockage indisponible : la carte vaut pour la session en cours, et c'est tout */
  }
}, { deep: true });

/** Combien de zones trouvées. Sert à l'état du tuyau, JAMAIS à noter le visiteur. */
export const nbTrouvees = computed(() => zonesTrouvees.value.length);

/**
 * Le tuyau vert est-il ouvert ?
 *
 * ⚠️ CE N'EST PAS UN VERROU D'ACCÈS. La soute reste joignable à tout moment par un lien
 * ordinaire (`/sitemap`, pied de page). Ce booléen ne décide que de l'apparence d'un détail
 * dans le décor du hero — celui qui ne réagit pas au début, et qui s'ouvre plus tard.
 * Confondre les deux ferait exactement ce que le cadrage interdit.
 */
export const tuyauOuvert = computed(() => nbTrouvees.value >= SEUIL_SOUTE);

/** Réinitialiser — utile au développement, et à un visiteur qui veut refaire le voyage. */
export function oublierLeVoyage() {
  zonesTrouvees.value = [];
}
