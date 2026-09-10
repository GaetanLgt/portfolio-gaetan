/**
 * ÉTAT RÉEL DU POSTE — D5
 *
 * Un tout petit magasin partagé entre la scène 3D (qui décide de son palier de
 * post-traitement) et la barre d'autodiagnostic (qui l'affiche). Il existe pour
 * une raison précise : la barre de diagnostic ne doit afficher QUE ce qui a été
 * réellement mesuré. Elle lisait auparavant des valeurs codées en dur
 * (« A11Y: PASS », « CLUSTER_STATUS: STABLE », un FPS figé à 60).
 *
 * Module volontairement minuscule : il ne dépend pas de three, donc la barre de
 * diagnostic ne tire pas 570 Ko de WebGL juste pour afficher un chiffre.
 */
import { ref } from 'vue';

/**
 * Palier de post-traitement réellement appliqué : 'haut' | 'moyen' | 'statique'.
 * Vaut 'statique' tant que la scène 3D n'a rien décidé — c'est la vérité au
 * démarrage, pas une valeur par défaut flattée.
 */
export const palierPoste = ref('statique');

/** Raison du dernier changement de palier, pour l'explication au survol. */
export const motifPoste = ref('');
