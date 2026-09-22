/**
 * routes-modele.js — LES ENREGISTREMENTS DE ROUTE DU MODÈLE, DÉRIVÉS DES ADRESSES.
 *
 * ⛔ À LIRE AVANT DE BRANCHER : NE PAS ÉTALER CES ENREGISTREMENTS DANS LE ROUTEUR.
 *
 * ⭐ CE N'EST PAS UN AVIS, C'EST MESURÉ. `scripts/prerendre.js` L204 construit sa liste
 * d'URL à prérendre avec l'expression `/path:\s*'([^']+)'/g` lue dans
 * `src/router/index.js` : il ne comprend que des CHEMINS ÉCRITS EN CLAIR, entre guillemets
 * simples. Un `...ROUTES_MODELE` étalé dans le tableau `routes` ne contiendrait AUCUN
 * `path: '…'` dans ce fichier : les cinq adresses seraient construites à l'exécution, le
 * prérendu ne les verrait pas, et **elles n'existeraient pas pour un moteur de recherche**
 * — exactement le défaut qu'on est en train de corriger en quittant les fragments.
 *
 * ⚠ DEUXIÈME CONSÉQUENCE, MESURÉE ELLE AUSSI, ET ELLE COMPTE POUR UNE BOUTIQUE :
 * la même ligne filtre les chemins contenant `:` ou `*`
 * (`.filter((p) => !p.includes(':') && !p.includes('*'))`). La route de la fiche
 * (`/produit/:id`) est donc ÉCARTÉE du prérendu : aucune page produit n'a de HTML
 * prérendu. Pour qu'une fiche produit existe pour un robot, ses adresses doivent venir du
 * PLAN DE SITE (`src/config/topographie.js` → `public/sitemap.xml`), que le prérendu
 * parcourt aussi. Une boutique dont les fiches produits ne s'indexent pas n'est pas une
 * boutique : c'est le point à trancher avec Gaëtan.
 *
 * → CE FICHIER SERT DONC À DEUX CHOSES, ET À ELLES SEULES :
 *    ① il donne aux composants et à la page le NOM de chaque route (par
 *       `modeles-adresses.js`), pour qu'aucun nom ne soit écrit deux fois ;
 *    ② il donne au banc d'essai un routeur complet, identique à celui du site.
 *    Le routeur du site, lui, doit recevoir les cinq enregistrements ÉCRITS EN CLAIR,
 *    recopiés depuis `modeles-adresses.js`. Le mode d'emploi exact est dans le rapport de
 *    livraison ; il tient en cinq blocs de six lignes.
 */

import { ADRESSES_MODELE } from './modeles-adresses.js';

/**
 * Le composant de la tranche, chargé PARESSEUSEMENT : il n'a pas à peser sur le premier
 * chargement du site, et une visite qui ne va pas sur le modèle ne le télécharge jamais.
 *
 * ⚠ LES CINQ ROUTES POINTENT VERS LE MÊME COMPOSANT, ET C'EST DÉLIBÉRÉ. La page est
 * l'orchestrateur : elle garde l'en-tête, la barre de navigation, l'état du panier et le
 * branchement de la manette communs aux cinq marches. Cinq composants séparés auraient
 * dupliqué cet en-tête cinq fois — cinq occasions de le faire diverger. Ce qui change
 * d'une adresse à l'autre, c'est ce que la page REND, et la page le sait par `meta.modele`.
 * Le routeur du site n'a donc qu'UN composant à importer pour cinq adresses.
 */
const ModeleBorealBoutique = () => import('./ModeleBorealBoutique.vue');

export const ROUTES_MODELE = ADRESSES_MODELE.map((adresse) => ({
  path: adresse.chemin,
  name: adresse.nom,
  component: ModeleBorealBoutique,
  meta: {
    // `meta.modele` est ce par quoi la page SAIT quelle marche elle sert. La marche n'est
    // donc pas stockée : elle est LUE dans la route. *Une seule source de vérité : l'adresse.*
    modele: adresse.id,
    title: adresse.titre,
    description: adresse.description,
  },
}));

export default ROUTES_MODELE;
