/**
 * modeles-adresses.js — LES CINQ ADRESSES DU MODÈLE, ÉCRITES UNE SEULE FOIS.
 *
 * ⛔ CE FICHIER EXISTE PARCE QU'UN NOM DE ROUTE ÉCRIT DEUX FOIS FINIT PAR DIVERGER.
 * Le routeur a besoin des CHEMINS ; les composants ont besoin des NOMS pour naviguer
 * (`router.push({ name: … })`). Si les deux les écrivaient chacun de leur côté, une
 * renommée d'un côté casserait la navigation de l'autre — en silence, et sans erreur de
 * compilation. Ici, tout est écrit UNE fois, et les deux le LISENT.
 *
 * ⚠ CE FICHIER NE DOIT IMPORTER AUCUN COMPOSANT. Il est lu par des composants (une carte
 * produit a besoin du nom de la route de la fiche) et par `routes-modele.js`, qui lui
 * importe les composants. S'il importait un composant, on aurait un cycle d'imports :
 * le composant importerait le fichier qui l'importe. *L'ordre des imports ne doit pas
 * décider du comportement d'une page.*
 *
 * ⭐ POURQUOI CINQ VRAIES ADRESSES, ET PLUS UN FRAGMENT D'ADRESSE.
 * La version précédente rangeait les cinq marches dans `#catalogue`, `#panier`, etc.
 * C'était une contrainte de livraison (le routeur n'appartenait pas à la tranche), pas un
 * choix de conception — et ça ne tenait pas : **une adresse en `#` ne s'indexe pas, ne se
 * partage pas, ne s'achète pas.** Un modèle de boutique destiné à la vente avec cinq
 * fragments au lieu de cinq adresses n'est vendable à personne.
 */

/** La racine du modèle : toutes les autres adresses en découlent. */
export const RACINE_MODELE = '/modeles/boutique-boreal';

/**
 * Les cinq marches, dans l'ordre du parcours.
 *
 *   id          la marche, telle que la page la comprend
 *   nom         le NOM DE ROUTE, utilisé par `router.push` et `<RouterLink>`
 *   chemin      l'ADRESSE, utilisée par le routeur
 *   parametre   le nom du paramètre de route, quand l'adresse en porte un
 *   titre       le titre du document (le routeur du site l'impose : `meta.title`)
 *   description la description de la page (idem, `meta.description`)
 *
 * ⚠ `titre` ET `description` NE SONT PAS DÉCORATIFS ICI. Le routeur du site porte un
 * `router.beforeEach` qui écrit `document.title = `${to.meta.title} | Génie IT Tek FR`` :
 * une route sans `meta.title` afficherait donc « undefined | Génie IT Tek FR » dans
 * l'onglet et dans les résultats de recherche. Chaque adresse porte les siens.
 */
export const ADRESSES_MODELE = [
  {
    id: 'vitrine',
    nom: 'ModeleBorealBoutique',
    chemin: RACINE_MODELE,
    libelle: 'Vitrine',
    titre: 'Modèle de boutique — démonstration Atelier Boréal',
    description:
      'Démonstration d\'un modèle de boutique : catalogue filtrable, fiche produit, panier '
      + 'persistant et tunnel de commande simulé — aucun paiement, aucune donnée transmise. '
      + 'Navigation complète au clavier et à la manette Xbox.',
  },
  {
    id: 'catalogue',
    nom: 'ModeleBorealCatalogue',
    chemin: `${RACINE_MODELE}/catalogue`,
    libelle: 'Catalogue',
    titre: 'Catalogue — modèle de boutique Atelier Boréal',
    description:
      'Catalogue de démonstration : filtrer par catégorie, trier par nom ou par prix. '
      + 'Treize objets fictifs, quatre catégories, un compte de résultats annoncé aux '
      + 'lecteurs d\'écran.',
  },
  {
    id: 'fiche',
    nom: 'ModeleBorealProduit',
    chemin: `${RACINE_MODELE}/produit/:id`,
    parametre: 'id',
    libelle: 'Fiche produit',
    titre: 'Fiche produit — modèle de boutique Atelier Boréal',
    description:
      'Fiche produit de démonstration : variantes avec supplément de prix, quantité bornée '
      + 'par le stock réel, état de rupture explicite, ajout au panier. Adresse partageable '
      + 'par produit.',
  },
  {
    id: 'panier',
    nom: 'ModeleBorealPanier',
    chemin: `${RACINE_MODELE}/panier`,
    libelle: 'Panier',
    titre: 'Panier — modèle de boutique Atelier Boréal',
    description:
      'Panier de démonstration : conservation dans le navigateur, modification des '
      + 'quantités, retrait d\'une ligne, seuil de franco de port calculé. Rien n\'est '
      + 'envoyé nulle part.',
  },
  {
    id: 'commande',
    nom: 'ModeleBorealCommande',
    chemin: `${RACINE_MODELE}/commande`,
    libelle: 'Commande',
    titre: 'Commande (démonstration) — modèle de boutique Atelier Boréal',
    description:
      'Tunnel de commande simulé : coordonnées, livraison, récapitulatif et confirmation. '
      + 'Aucun paiement, aucun envoi réseau, aucune donnée conservée.',
  },
];

/** L'adresse d'une marche, ou `null`. */
export function adresseDe(id) {
  return ADRESSES_MODELE.find((adresse) => adresse.id === id) || null;
}

/** L'adresse portant un nom de route, ou `null` — c'est ainsi que la page LIT la marche. */
export function adresseParNom(nomDeRoute) {
  return ADRESSES_MODELE.find((adresse) => adresse.nom === nomDeRoute) || null;
}

/**
 * Le nom de route d'une marche. LÈVE si la marche n'existe pas : une faute de frappe dans
 * un identifiant de marche doit se voir tout de suite, pas produire un bouton qui ne fait
 * rien. *Un bouton silencieux est un défaut qu'on ne trouve jamais.*
 */
export function nomDe(id) {
  const adresse = adresseDe(id);
  if (!adresse) {
    throw new Error(
      `Marche inconnue : « ${id} ». Marches possibles : `
      + `${ADRESSES_MODELE.map((a) => a.id).join(', ')}.`,
    );
  }
  return adresse.nom;
}

/** Les adresses de la barre de navigation, dans l'ordre, sauf celles qu'on écarte.
 *  ⚠ La MARCHE « fiche » EST ÉCARTÉE : une fiche n'a pas d'adresse sans produit, et un
 *  onglet « Fiche produit » qui mènerait à un produit arbitraire serait un mensonge. On y
 *  arrive par une carte du catalogue, et par une adresse partageable. */
export function adressesDeNavigation() {
  return ADRESSES_MODELE.filter((adresse) => adresse.id !== 'fiche');
}
