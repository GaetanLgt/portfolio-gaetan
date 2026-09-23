/* =============================================================================
   langues.js — LA SOURCE UNIQUE DES LANGUES DU SITE
   =============================================================================

   POURQUOI CE FICHIER EXISTE
   -----------------------------------------------------------------------------
   Sept langues, ce n'est pas sept traductions : c'est **sept endroits qui doivent
   dire la même chose**. La liste des langues apparaît dans le routeur, dans les
   balises `hreflang`, dans l'attribut `lang` de chaque bloc, dans le sélecteur,
   et dans le banc d'essai.

   ⛔ ÉCRIRE CETTE LISTE SEPT FOIS, C'EST SEPT VERSIONS À TENIR — et c'est la
   deuxième qui devient fausse en premier. *La consigne le dit pour les
   traductions ; ça vaut aussi pour leur liste.*

   ⇒ ICI, ET NULLE PART AILLEURS. Tout le reste la LIT.

   ⭐ ET LE BANC D'ESSAI ALLEMAND LIT CETTE LISTE AUSSI : il éprouve les langues
   de `EPREUVES`, pas une liste écrite dans son propre fichier.
   *Un banc qui a sa propre liste éprouve une autre configuration que celle qui
   sera publiée.*
   ============================================================================= */

/**
 * ⭐ LA LANGUE QUI ACCUEILLE — et il n'y en a qu'une.
 *
 * Consigne : « la seule langue qui accueille ». Elle est l'original : les autres
 * en dérivent. *Une traduction ne dit rien de nouveau — elle dit la même chose.*
 */
export const LANGUE_ACCUEIL = 'fr';

/**
 * LES LANGUES, ET CE QUE CHACUNE EST.
 *
 * ⚠️ `role` n'est pas décoratif : il décide de ce qui est GÉNÉRÉ.
 *   · « accueil »   → l'expérience complète, le contenu vit ici
 *   · « passerelle » → une page courte, vraie et lisible : titre, chapeau,
 *                      l'offre, le contact. Pas une copie du site.
 *   · « a-decider » → présente dans le code, ABSENTE du build tant que Gaëtan
 *                      n'a pas tranché. *Le code dit ce qui est décidé, et ce
 *                      qui ne l'est pas — il ne devine pas.*
 *
 * `justification` vient de la consigne, mot pour mot. *Une langue sans raison
 * écrite est une langue qu'on ajoutera par confort, et qu'on ne tiendra pas.*
 */
export const LANGUES = [
  {
    code: 'fr',
    nom: 'Français',
    nomLocal: 'Français',
    role: 'accueil',
    justification: 'la langue du studio — la seule qui accueille',
    dir: 'ltr',
  },
  {
    code: 'en',
    nom: 'Anglais',
    nomLocal: 'English',
    role: 'passerelle',
    justification: 'lecture des pairs',
    dir: 'ltr',
  },
  {
    code: 'de',
    nom: 'Allemand',
    nomLocal: 'Deutsch',
    role: 'passerelle',
    justification: '1er marché européen',
    dir: 'ltr',
    /* ⛔ L'ALLEMAND N'EST PAS « UNE LANGUE DE PLUS » : c'est la BORNE HAUTE des
       mots. Ses composés n'ont pas de limite — Rechtsschutzversicherungsgesellschaften
       fait 39 lettres. *C'est lui qui casse une mise en page, ou qui prouve
       qu'elle tient.* */
    attention: 'mots composés sans limite — 39 lettres',
  },
  {
    code: 'es',
    nom: 'Espagnol',
    nomLocal: 'Español',
    role: 'passerelle',
    justification: 'collectivités comparables',
    dir: 'ltr',
  },
  {
    code: 'it',
    nom: 'Italien',
    nomLocal: 'Italiano',
    role: 'passerelle',
    justification: 'tissu de PME proche',
    dir: 'ltr',
  },
  {
    code: 'nl',
    nom: 'Néerlandais',
    nomLocal: 'Nederlands',
    role: 'passerelle',
    justification: 'voisin très numérisé',
    dir: 'ltr',
  },
  {
    code: 'pt',
    nom: 'Portugais',
    nomLocal: 'Português',
    role: 'passerelle',
    justification: 'diaspora francophone',
    dir: 'ltr',
  },
  {
    /* ⚠️ LE JAPONAIS N'EST PAS UNE HUITIÈME LANGUE EUROPÉENNE.
       La consigne dit « langues européennes uniquement » : il est donc un AJOUT
       DÉLIBÉRÉ, et il a une raison que les autres n'ont pas — le studio a un
       dossier franco-japonais, une veille dessus, et les kanji-emblèmes de ses
       six Lois. *Ce n'est pas du référencement : c'est parler à quelqu'un.*
       ⛔ ET IL EST `a-decider` : **Gaëtan n'a pas tranché.** Le coder ici ne
       l'active pas — la porte de build l'ignorera tant que le rôle n'est pas
       « passerelle ». *On ne publie pas une décision qu'on n'a pas prise.* */
    code: 'ja',
    nom: 'Japonais',
    nomLocal: '日本語',
    role: 'a-decider',
    justification: 'le dossier franco-japonais du studio — ce n’est pas du référencement, c’est parler à quelqu’un',
    dir: 'ltr',
    attention: 'ni césure ni espaces entre les mots ; kinsoku shori ; interligne 1,7-1,8 ; pas de traduction automatique (registre et 敬語)',
  },
];

/**
 * ⭐⭐ LES TROIS BORNES DU BANC D'ESSAI — « le site ne pourra que vivre ».
 *
 * Gaëtan, 23/09/2026 : *« Si tu fais les 3 tests — allemand, français, japonais —
 * le site il ne pourra que vivre. Ça passera sur toutes les langues. »*
 *
 * ⛔ CE N'EST PAS TROIS TESTS, C'EST UN SEUL TEST À TROIS EXTRÉMITÉS :
 *   · **de** — la borne des MOTS (composés sans limite)
 *   · **fr** — la borne des EXPRESSIONS (la langue de référence, verbeuse)
 *   · **ja** — la borne des GLYPHES (denses, sans espaces, coupure différente)
 *
 * **Si les extrémités tiennent, le milieu tient** : es, it, nl, pt, et toute
 * langue ajoutée plus tard. *On ne teste pas sept langues, on teste trois
 * extrêmes — et on en déduit les sept.*
 */
export const EPREUVES = ['de', 'fr', 'ja'];

/** Les langues RÉELLEMENT construites : la porte de build ne regarde que celles-là. */
export const LANGUES_ACTIVES = LANGUES.filter((l) => l.role !== 'a-decider');

/** Toutes les langues publiées, y compris la langue d'accueil. */
export const CODES = LANGUES_ACTIVES.map((l) => l.code);

/** Le nom d'une langue, depuis son code. `undefined` si inconnue — jamais deviné. */
export function langue(code) {
  return LANGUES.find((l) => l.code === code);
}

/* =============================================================================
   ⚠️ CE QUE CE FICHIER NE DIT PAS
   -----------------------------------------------------------------------------
   · **Il ne traduit rien.** Il dit quelles langues existent, et à quel titre.
     *Une liste de langues n'est pas une traduction.*
   · **Il ne fixe pas les ADRESSES.** La forme des URL (`/en/`, `?lang=en`,
     sous-domaine) est une décision qui n'est pas prise — et elle appartient à
     Gaëtan. *Le `hreflang` généré devra la connaître, donc elle vient avant lui.*
   · **Il ne règle pas le cas du japonais.** Il le PORTE, marqué `a-decider`.
   ============================================================================= */
