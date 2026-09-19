/**
 * CONTACT — LA SOURCE UNIQUE DES COORDONNÉES PUBLIQUES. GL Digital Lab, 20/09/2026.
 *
 * POURQUOI CE FICHIER EXISTE
 * Les mêmes deux coordonnées étaient RECOPIÉES À LA MAIN dans huit fichiers
 * (pied de page, page contact, dossier, mentions légales, confidentialité,
 * terminal du poste). Mesuré le 20/09/2026 : 25 occurrences du courriel et
 * 14 du téléphone, chacune écrite deux fois quand ce n'était pas trois
 * (`href` + texte affiché). Huit occasions de diverger, et aucune ne se voit
 * à la relecture — c'est le même motif que la topographie, qui a fini par
 * produire `/soute` construite, liée, éprouvée… et absente du sitemap.
 *
 * ⚠️ CE QUI N'EST PAS ICI, ET QUI NE DOIT PAS Y ÊTRE
 *   · `contact@gldigitallab.fr` (InvoiceGenerator.vue) n'est PAS recopiée ici.
 *     C'est peut-être l'adresse ÉMETTRICE de l'entreprise, pas son adresse de
 *     contact : les deux peuvent légitimement différer, et les confondre
 *     silencieusement serait pire que la divergence. Signalé, non tranché —
 *     la décision appartient à Gaëtan.
 *   · Les données de l'InvoiceGenerator (`siret: '123 456 789 00012'`, adresse
 *     « Somme, France ») ne sont PAS reprises : ce sont des valeurs d'exemple
 *     d'un outil interne, pas des données d'entreprise publiées.
 *
 * CE QU'ON Y METTRAIT SI ÇA EXISTAIT : pas de jeton de couleur, pas de style —
 * ce fichier porte des DONNÉES, jamais de la mise en forme.
 */

/* ── Le courriel ────────────────────────────────────────────────────────────
   `courriel` sert à construire le protocole `mailto:` ; `courrielAffiche` est
   ce que lit le visiteur. Les deux sont identiques aujourd'hui — ils sont
   séparés pour que l'adresse technique puisse changer sans changer le libellé
   (et réciproquement), sans qu'on réécrive huit fichiers. */
export const COURRIEL = 'gtn.langlet+lab@gmail.com';

/** Le numéro sous une forme appelable : `tel:` veut l'indicatif, sans espaces. */
export const TELEPHONE_TEL = '+33686474610';

/** Le numéro tel qu'il se lit en France. */
export const TELEPHONE_AFFICHE = '06 86 47 46 10';

/** Le nom qui signe le contact — utilisé dans les intitulés de bouton. */
export const NOM_COMMERCIAL = 'GL Digital Lab';

/* ── Liens de réseaux sociaux ───────────────────────────────────────────────
   Ils existaient déjà, écrits en dur dans le pied de page. On ne les
   duplique pas « au cas où » : on les rapatrie pour qu'il n'y ait qu'un
   endroit où les changer. */
export const RESEAUX = [
  { nom: 'GitHub', url: 'https://github.com/GaetanLgt' },
  { nom: 'LinkedIn', url: 'https://www.linkedin.com/in/gldigitallab/' },
];

/* ── L'OBJET DU COURRIEL PRÉ-REMPLI ─────────────────────────────────────────
   Constaté le 20/09/2026 : un `mailto:` nu ouvre le client de messagerie avec
   un message VIDE. Le visiteur doit écrire un objet lui-même, et l'objet qu'il
   écrit n'est presque jamais celui qui aide à trier. On en propose donc un.

   ⚠️ L'ENCODAGE N'EST PAS UN DÉTAIL DE CONFORT, C'EST LE LIEN QUI MARCHE OU
   PAS. Un espace laissé brut, une apostrophe laissée brute ou un accent laissé
   en clair et le client de messagerie reçoit une chaîne tronquée — au mieux un
   objet bancal, au pire un `mailto:` que le système refuse d'ouvrir. On encode
   donc avec `encodeURIComponent` (RFC 6068 : les espaces deviennent `%20`,
   jamais `+`, qui est la convention des formulaires et pas celle des URI) et
   on ne code le texte à la main dans AUCUN gabarit : `buildMailto()` est le
   seul chemin, et son résultat est mesuré par `npm run audit:contact`. */
export const OBJET_COURRIEL = 'Prise de contact — GL Digital Lab';

/** Les deux intitulés de bouton, écrits une fois pour ne pas diverger.
 *  Ils sont lisibles HORS CONTEXTE, comme l'exige WCAG 2.4.4 : un lecteur
 *  d'écran qui extrait la liste des liens n'a pas le titre de la section sous
 *  les yeux, donc « Écrire » seul ne dit pas à qui. */
export const LIBELLE_ECRIRE = `Écrire à ${NOM_COMMERCIAL}`;
export const LIBELLE_APPELER = `Appeler ${NOM_COMMERCIAL}`;

/**
 * Construit l'URI `mailto:` complète, objet pré-rempli.
 * @param {string} [objet] objet à pré-remplir (par défaut : OBJET_COURRIEL)
 * @param {string} [destinataire] adresse visée (par défaut : COURRIEL)
 * @returns {string} une URI `mailto:` directement utilisable dans un `href`
 */
export function buildMailto(objet = OBJET_COURRIEL, destinataire = COURRIEL) {
  return `mailto:${destinataire}?subject=${encodeURIComponent(objet)}`;
}

/** Le lien d'appel direct. `tel:` veut l'indicatif, sans espaces ni tirets. */
export function buildTel(numero = TELEPHONE_TEL) {
  return `tel:${numero}`;
}

/* ── LES LIENS PRÊTS À POSER DANS UN `href` ─────────────────────────────────
   Deux constantes calculées plutôt que deux appels dans chaque gabarit : un
   gabarit qui appelle une fonction au rendu est un gabarit où l'on peut se
   tromper d'argument. Ici, il n'y a rien à se tromper. */
export const LIEN_COURRIEL = buildMailto();
export const LIEN_TELEPHONE = buildTel();
