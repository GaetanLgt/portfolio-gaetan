/**
 * reglesCatalogue.js — LES RÈGLES PURES DU CATALOGUE. Aucune donnée, aucun import.
 *
 * ⚠ POURQUOI CE FICHIER EST SÉPARÉ DE `donneesProduits.js`, ET C'EST UNE RAISON DE BANC
 * D'ESSAI, PAS DE GOÛT. Un contrôle qu'on n'a jamais vu MORDRE n'est pas un contrôle.
 * Pour prouver que la vérification du catalogue refuse vraiment un catalogue faux, il
 * faut pouvoir l'appeler sur des catalogues faux — or `donneesProduits.js` importe le
 * JSON, et Node ne sait pas relire un `import … .json` sans attribut d'import. En
 * séparant les RÈGLES des DONNÉES, le banc d'essai `banc-donnees-boreal.mjs` importe ce
 * fichier-ci (du JavaScript pur, exécutable partout) et lui sert sept catalogues abîmés.
 *
 * *Une règle qui ne peut pas être appelée seule ne peut pas être éprouvée.*
 */

/** Les formes de pictogramme que `PictogrammeProduit.vue` sait réellement dessiner.
 *  Une forme hors de cette liste est une DONNÉE FAUSSE : le produit s'afficherait avec
 *  un trou à la place de l'image. On refuse donc le catalogue plutôt que de le rendre. */
export const FORMES_DESSINABLES = ['plume', 'flacon', 'carnet', 'lampe', 'cylindre', 'plaque'];

/**
 * Vérifie un catalogue et lève une erreur explicite au premier défaut trouvé.
 * @param {object} donnees catalogue à vérifier
 * @param {string[]} formes les formes réellement dessinables
 * @returns {number} le nombre de produits contrôlés (un compte, jamais une impression)
 */
export function verifierCatalogue(donnees, formes = FORMES_DESSINABLES) {
  if (!donnees || typeof donnees !== 'object') {
    throw new Error('Catalogue illisible : le fichier de données n\'a pas rendu d\'objet.');
  }
  if (!Array.isArray(donnees.produits) || donnees.produits.length === 0) {
    throw new Error('Catalogue vide : « produits » doit être une liste non vide.');
  }
  if (!Array.isArray(donnees.categories) || donnees.categories.length === 0) {
    throw new Error('Catalogue vide : « categories » doit être une liste non vide.');
  }

  const idsCategories = new Set();
  for (const categorie of donnees.categories) {
    if (!categorie || typeof categorie.id !== 'string' || categorie.id === '') {
      throw new Error('Catégorie sans identifiant : un filtre ne peut pas viser une catégorie anonyme.');
    }
    if (idsCategories.has(categorie.id)) {
      throw new Error(`Catégorie « ${categorie.id} » déclarée deux fois.`);
    }
    if (typeof categorie.libelle !== 'string' || categorie.libelle === '') {
      throw new Error(`Catégorie « ${categorie.id} » sans libellé : elle s'afficherait vide.`);
    }
    idsCategories.add(categorie.id);
  }

  const formesAutorisees = new Set(formes);
  const idsProduits = new Set();
  let controles = 0;

  for (const produit of donnees.produits) {
    const ou = produit && produit.id ? `produit « ${produit.id} »` : `produit n° ${controles + 1}`;

    if (!produit || typeof produit.id !== 'string' || produit.id === '') {
      throw new Error(`${ou} : identifiant manquant (une fiche sans adresse ne s'ouvre pas).`);
    }
    if (idsProduits.has(produit.id)) {
      throw new Error(`Identifiant de produit « ${produit.id} » en double dans le catalogue.`);
    }
    if (typeof produit.nom !== 'string' || produit.nom === '') {
      throw new Error(`${ou} : nom manquant.`);
    }
    if (!idsCategories.has(produit.categorie)) {
      throw new Error(
        `${ou} : la catégorie « ${produit.categorie} » n'existe pas. ` +
        'Le filtre de la grille ne pourrait jamais le montrer.',
      );
    }
    if (!Number.isInteger(produit.prix) || produit.prix <= 0) {
      throw new Error(`${ou} : prix invalide (${produit.prix}) — attendu un entier de centimes > 0.`);
    }
    if (!Number.isInteger(produit.stock) || produit.stock < 0) {
      throw new Error(`${ou} : stock invalide (${produit.stock}) — attendu un entier >= 0.`);
    }
    if (!formesAutorisees.has(produit.forme)) {
      throw new Error(
        `${ou} : forme « ${produit.forme} » inconnue du dessinateur. ` +
        `Formes possibles : ${formes.join(', ')}.`,
      );
    }
    if (typeof produit.resume !== 'string' || produit.resume === '') {
      throw new Error(`${ou} : résumé manquant (la carte de la grille serait muette).`);
    }
    if (!Array.isArray(produit.variantes) || produit.variantes.length === 0) {
      throw new Error(`${ou} : aucune variante. Une fiche sans variante n'a rien à choisir.`);
    }

    const idsVariantes = new Set();
    for (const variante of produit.variantes) {
      if (!variante || typeof variante.id !== 'string' || variante.id === '') {
        throw new Error(`${ou} : variante sans identifiant.`);
      }
      if (idsVariantes.has(variante.id)) {
        throw new Error(`${ou} : variante « ${variante.id} » déclarée deux fois.`);
      }
      if (typeof variante.libelle !== 'string' || variante.libelle === '') {
        throw new Error(`${ou} : variante « ${variante.id} » sans libellé.`);
      }
      if (!Number.isInteger(variante.supplement)) {
        throw new Error(
          `${ou} : supplément de la variante « ${variante.id} » invalide ` +
          `(${variante.supplement}) — attendu un entier de centimes, éventuellement négatif.`,
        );
      }
      if (produit.prix + variante.supplement <= 0) {
        throw new Error(
          `${ou} : la variante « ${variante.libelle} » donne un prix nul ou négatif ` +
          `(${produit.prix + variante.supplement} centimes).`,
        );
      }
      idsVariantes.add(variante.id);
    }

    if (typeof produit.description !== 'string' || produit.description === '') {
      throw new Error(`${ou} : description manquante (la fiche produit serait vide).`);
    }
    if (typeof produit.matiere !== 'string' || produit.matiere === '') {
      throw new Error(`${ou} : matière manquante.`);
    }

    idsProduits.add(produit.id);
    controles += 1;
  }

  // Les livraisons : le tunnel affiche leur prix, donc un prix faux se voit à l'écran.
  if (!Array.isArray(donnees.livraisons) || donnees.livraisons.length === 0) {
    throw new Error('Aucun mode de livraison : l\'étape « livraison » du tunnel serait vide.');
  }
  const idsLivraisons = new Set();
  for (const livraison of donnees.livraisons) {
    if (!livraison || typeof livraison.id !== 'string' || livraison.id === '') {
      throw new Error('Mode de livraison sans identifiant.');
    }
    if (idsLivraisons.has(livraison.id)) {
      throw new Error(`Mode de livraison « ${livraison.id} » déclaré deux fois.`);
    }
    if (!Number.isInteger(livraison.prix) || livraison.prix < 0) {
      throw new Error(`Mode de livraison « ${livraison.id} » : prix invalide (${livraison.prix}).`);
    }
    if (typeof livraison.libelle !== 'string' || livraison.libelle === '') {
      throw new Error(`Mode de livraison « ${livraison.id} » sans libellé.`);
    }
    idsLivraisons.add(livraison.id);
  }

  if (!donnees.boutique || !Number.isInteger(donnees.boutique.francoDePort) || donnees.boutique.francoDePort <= 0) {
    throw new Error('Seuil de franco de port invalide : attendu un entier de centimes > 0.');
  }

  return controles;
}

/* ────────────────────────────────────────────────────────────────────────────────
   LECTURES ET CALCULS PURS
   ──────────────────────────────────────────────────────────────────────────────── */

/** Variante par identifiant dans un produit donné, ou `null`. */
export function trouverVariante(produit, idVariante) {
  if (!produit) return null;
  return produit.variantes.find((variante) => variante.id === idVariante) || null;
}

/** Prix d'une unité, variante comprise, en centimes entiers. */
export function prixUnitaire(produit, idVariante) {
  if (!produit) throw new Error('prixUnitaire : produit absent.');
  const variante = trouverVariante(produit, idVariante);
  if (!variante) {
    throw new Error(
      `prixUnitaire : la variante « ${idVariante} » n'existe pas pour « ${produit.id} ».`,
    );
  }
  return produit.prix + variante.supplement;
}

/**
 * Formate des centimes en euros, à la française.
 * ⚠ Le séparateur rendu par Intl contient une ESPACE INSÉCABLE : ne jamais comparer
 * cette sortie à une chaîne écrite à la main dans un contrôle, on se tromperait de
 * caractère avant de se tromper de chiffre.
 */
const formateurEuros = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

export function formaterPrix(centimes) {
  return formateurEuros.format(centimes / 100);
}

/** Comparaison de textes française, insensible aux accents et à la casse. */
const collateur = new Intl.Collator('fr', { sensitivity: 'base' });

/** Les critères de tri proposés par la grille — la liste ET l'ordre sont écrits ici,
 *  une seule fois, et la grille les lit. Ajouter un tri se fait ICI, et nulle part ailleurs. */
export const CRITERES_TRI = [
  { id: 'nom-croissant', libelle: 'Nom (A → Z)' },
  { id: 'nom-decroissant', libelle: 'Nom (Z → A)' },
  { id: 'prix-croissant', libelle: 'Prix croissant' },
  { id: 'prix-decroissant', libelle: 'Prix décroissant' },
];

/**
 * Trie une liste de produits SANS LA MODIFIER (copie d'abord : trier le tableau du
 * catalogue en place ferait bouger l'ordre partout ailleurs, y compris dans les fiches).
 */
export function trierProduits(liste, critereId) {
  const copie = [...liste];
  switch (critereId) {
    case 'prix-croissant':
      return copie.sort((a, b) => a.prix - b.prix || collateur.compare(a.nom, b.nom));
    case 'prix-decroissant':
      return copie.sort((a, b) => b.prix - a.prix || collateur.compare(a.nom, b.nom));
    case 'nom-decroissant':
      return copie.sort((a, b) => collateur.compare(b.nom, a.nom));
    case 'nom-croissant':
      return copie.sort((a, b) => collateur.compare(a.nom, b.nom));
    default:
      throw new Error(
        `Critère de tri inconnu : « ${critereId} ». ` +
        `Critères possibles : ${CRITERES_TRI.map((c) => c.id).join(', ')}.`,
      );
  }
}

/** Filtre par catégorie ; `'toutes'` (ou une valeur vide) rend la liste entière. */
export function filtrerParCategorie(liste, categorieId, categories = []) {
  if (!categorieId || categorieId === 'toutes') return [...liste];
  if (categories.length > 0 && !categories.some((c) => c.id === categorieId)) {
    throw new Error(`Catégorie inconnue : « ${categorieId} ».`);
  }
  return liste.filter((produit) => produit.categorie === categorieId);
}
