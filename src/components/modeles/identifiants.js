/**
 * identifiants.js — DES IDENTIFIANTS UNIQUES, COMPTÉS, ET DÉTERMINISTES.
 *
 * POURQUOI CE FICHIER N'EST PAS UNE LIGNE DANS UN COMPOSANT. `aria-describedby` et
 * `<label for>` ont besoin d'un identifiant unique sur la page. Or :
 *   · `useId()` n'existe pas dans Vue 3.4 (il arrive en 3.5) — l'importer ferait échouer
 *     le build ou rendrait `undefined` ;
 *   · un compteur déclaré DANS `<script setup>` repart à zéro pour chaque instance :
 *     les champs porteraient tous `-1`, et deux champs auraient le même identifiant ;
 *   · `Math.random()` rend l'identifiant NON DÉTERMINISTE, donc différent entre le HTML
 *     prérendu et l'hydratation côté navigateur. Un `aria-describedby` qui change entre
 *     les deux, c'est un lien d'accessibilité qui casse au chargement.
 *
 * Ce compteur vit donc au niveau du MODULE : il s'incrémente dans l'ordre de création des
 * composants, et cet ordre est le même au prérendu et à l'hydratation.
 */

let compteur = 0;

/** Rend un identifiant unique, lisible, et reproductible dans l'ordre d'appel. */
export function identifiantChamp(nom) {
  compteur += 1;
  return `modele-${nom}-${compteur}`;
}
