/**
 * donneesProduits.js — LE CHARGEMENT ET LA VÉRIFICATION DU CATALOGUE.
 *
 * Ce fichier est MINCE, et c'est voulu : les règles pures vivent dans
 * `reglesCatalogue.js`, les données dans `donnees-produits.json`, et il ne reste ici que
 * le raccord entre les deux — charger, vérifier une fois, exposer.
 *
 * ⚠ LA VÉRIFICATION S'EXÉCUTE À L'IMPORT, DONC AVANT TOUT RENDU. Un catalogue incohérent
 * (catégorie inexistante, forme non dessinable, variante en double) fait ÉCHOUER le
 * chargement du module au lieu de produire une page à moitié vide. C'est la règle du
 * studio : *le moteur refuse les données incohérentes*. **Un catalogue faux qui s'affiche
 * proprement est plus dangereux qu'une erreur franche : il fait croire que la chaîne
 * fonctionne.**
 *
 * ⚠ L'ARGENT EST EN CENTIMES ENTIERS, jamais en euros flottants : un total en binaire à
 * virgule finit par afficher 0,30000000000000004.
 *
 * ⚠ LE COMMENTAIRE `_lisezMoi` DU JSON NE SERT À RIEN ICI et ne doit pas être affiché :
 * les champs qui commencent par un souligné sont de la documentation, pas des données.
 */

import catalogue from '@/views/modeles/donnees-produits.json';
import { verifierCatalogue } from './reglesCatalogue.js';

/** Le contrôle du catalogue, fait UNE fois. Rend le nombre de produits vérifiés. */
export const produitsVerifies = verifierCatalogue(catalogue);

export const boutique = catalogue.boutique;
export const categories = catalogue.categories;
export const livraisons = catalogue.livraisons;
export const produits = catalogue.produits;
export const francoDePort = catalogue.boutique.francoDePort;

/** Categorie par identifiant, ou `null`. */
export function trouverCategorie(id) {
  return categories.find((categorie) => categorie.id === id) || null;
}

/** Produit par identifiant, ou `null`.
 *  Un identifiant inconnu n'est PAS une exception : c'est un cas normal (lien profond
 *  périmé, panier d'une visite précédente), que l'appelant doit traiter sans planter. */
export function trouverProduit(id) {
  return produits.find((produit) => produit.id === id) || null;
}

/** Les règles pures, ré-exportées pour que les composants n'aient qu'un seul import. */
export {
  CRITERES_TRI,
  FORMES_DESSINABLES,
  filtrerParCategorie,
  formaterPrix,
  prixUnitaire,
  trierProduits,
  trouverVariante,
} from './reglesCatalogue.js';
