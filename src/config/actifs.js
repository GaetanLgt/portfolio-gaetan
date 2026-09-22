/*
 * actifs.js — LA LISTE DES ACTIFS LIVRÉS, ÉCRITE UNE SEULE FOIS.
 *
 * ⭐ POURQUOI CE FICHIER EXISTE
 *
 *   Le 22/09/2026, un `git checkout <commit> -- src/views/core/HomePage.vue` d'urgence
 *   a restauré le fichier et EFFACÉ les modifications d'un autre chantier. **Le build
 *   est resté VERT**, le site s'est déployé, et il ne contenait plus rien du travail.
 *
 *   ⛔ *Un verrou qui contrôle la QUALITÉ ne contrôle pas la PRÉSENCE.*
 *
 * CE FICHIER EST LA LISTE — et elle vit ICI, à un seul endroit (loi n° 3 :
 * « une seule liste, ou elle pourrit »).
 *
 * ⛔⛔⛔ CORRIGÉ LE 22/09/2026, ET LA CORRECTION VIENT D'UN AUTRE CHANTIER.
 *
 *   La première version cherchait `vaisseau-vue` — **une CLASSE CSS** que le composant
 *   s'était donnée à lui-même. Le sous-agent qui l'écrivait l'a dit, et il avait raison :
 *
 *     « Un verrou de présence adossé au nom d'une classe mesure le nom, pas la présence. »
 *
 *   ⚠️ **Conséquence** : si quelqu'un renomme `.vaisseau-vue` — un refactoring anodin
 *      qui ne casse RIEN — **le verrou aurait crié au loup sur un travail présent.**
 *      Et un verrou qui crie à tort apprend à être ignoré. **C'est le défaut qu'on a
 *      réparé deux fois ce jour-là (`css-sans-balisage`, `a11y-rendu`).**
 *
 *   ⭐ LA RÈGLE QUI EN SORT, ET ELLE VAUT MIEUX QUE LA CORRECTION :
 *
 *        UN VERROU DE PRÉSENCE MESURE CE QUI ÉTAIT LÀ AVANT LE CODE.
 *        Le canon, le contenu, les noms DÉCIDÉS.
 *        Jamais les noms que le code s'est donnés à lui-même.
 *
 *   ⭐⭐ ET ON MESURE DEUX CHEMINS, PAS UN :
 *      · **l'ANCRE CANONIQUE** — un nom qui est un CONTRAT, documenté dans le composant
 *        (`data-vaisseau`), et qui ne se renomme pas ; *si quelqu'un le renomme, c'est
 *        un vrai signal, pas un accident* ;
 *      · **LE CONTENU DU CANON** — les sept noms des compartiments, qui viennent de
 *        `SITE-VAISSEAU-ARCHITECTURE.md` et **pas** d'un composant.
 *
 *      *Deux chemins : si l'un casse, l'autre tient.* **C'est la loi n° 4 appliquée
 *      dans le bon sens — au lieu d'une porte, deux.*
 *
 * ⚠️ COMMENT ÉCRIRE UN ACTIF, ET COMMENT NE PAS L'ÉCRIRE
 *
 *   ✅ Un motif qui DISPARAÎTRAIT si le travail était perdu.
 *   ⛔ JAMAIS un motif qui survit à tout — un texte de navigation, un nom de police,
 *      une balise de coquille. **Un motif qui est toujours là ne vérifie rien.**
 *
 * ⭐ ET LA RÈGLE : un actif ne s'ajoute ici QUE s'il a été livré, vérifié, et vu.
 *    Une liste remplie d'avance devient une liste de vœux — et un verrou qui échoue
 *    sur un vœu s'apprend à être ignoré.
 */

/* ⭐ LES SEPT COMPARTIMENTS — le canon, pas la plomberie.
 *   Ils viennent de `SITE-VAISSEAU-ARCHITECTURE.md` § 2, et ils sont écrits en français
 *   dans le composant. **Ils survivent à un renommage de classe ; ils disparaissent
 *   vraiment si le travail disparaît.** */
const SEPT = ['Le pont', 'La soute', 'La cale', 'Le gaillard', 'La vigie', 'Le journal de bord', 'La proue'];

export const ACTIFS = [
  /*
   * ⛔ L'ACTIF « ANCRE DU NAVIRE » A ÉTÉ RETIRÉ LE 22/09/2026, ET C'EST MA PROPRE
   *    RÈGLE QUI ME L'A DIT.
   *
   *    J'avais mis ici un actif cherchant `data-vaisseau` — **un nom canonique que
   *    j'avais DÉCIDÉ, mais que personne n'avait encore écrit dans le composant.**
   *    Le verrou sortait donc en `[KO]` sur un VŒU.
   *
   *    ⭐ Or la règle est écrite en tête de ce fichier : « un actif ne s'ajoute ici QUE
   *      s'il a été livré, vérifié et vu. **Une liste remplie d'avance devient une liste
   *      de vœux — et un verrou qui échoue sur un vœu s'apprend à être ignoré.** »
   *
   *    ⛔ Et c'est exactement le défaut qu'on a réparé deux fois aujourd'hui. On ne le
   *       refait pas ici, dans le verrou censé le surveiller.
   *
   *    ⏳ À AJOUTER QUAND L'ANCRE SERA POSÉE, dans le même commit :
   *       { nom: 'l’ancre du navire', fichier: 'index.html', motifs: ['data-vaisseau'],
   *         pourquoi: 'l’ancre canonique — un contrat, pas un détail de style' }
   */
  {
    nom: 'les sept compartiments',
    fichier: 'index.html',
    // ⭐ LES SEPT NOMS DU CANON — et c'est le chemin qui TIENT AUJOURD'HUI.
    //    Ils viennent de `SITE-VAISSEAU-ARCHITECTURE.md` § 2, **pas d'un composant**.
    //    *Ils survivent à un renommage de classe ; ils disparaissent vraiment si le
    //    travail disparaît.* **C'est ça, un actif.**
    motifs: SEPT,
    pourquoi: 'les sept noms du canon (SITE-VAISSEAU § 2), écrits dans la page',
  },
  {
    nom: 'le plan du navire',
    fichier: 'index.html',
    motifs: ['LE PLAN DU NAVIRE'],
    pourquoi: 'le titre du plan — un texte en français, pas une classe',
  },
  {
    nom: 'le jeu jouable',
    fichier: 'index.html',
    motifs: ['le-pont/index.html'],
    pourquoi: 'l’iframe du jeu — il est sur le disque et il répond',
  },
  {
    nom: 'le jeu lui-même',
    fichier: 'le-pont/index.html',
    motifs: ['ArkAdiA', 'Faim', 'Autonomie'],
    pourquoi: 'la page du jeu, autonome et sans requête réseau',
  },
  {
    nom: 'la section du vaisseau',
    fichier: 'index.html',
    motifs: ['ARKADIA', 'SS00999'],
    pourquoi: 'la fiche de la machine, mesurée et publiée',
  },
  /*
   * ⚠️ CE QUI N'EST PAS ICI, ET POURQUOI.
   *
   *   · **Le galion texturé** (`galion.glb` avec ses images) — *2 790 Ko sur le disque,
   *     1 925 Ko en ligne au 22/09.* ⭐ On ne l'ajoute pas tant qu'il n'est pas EN LIGNE :
   *     ce verrou dit le PRÉSENT, pas l'intention. **Il s'ajoutera quand il sera déployé.**
   *   · **Le défilement-orbitale** — *en cours, non livré. Même règle.*
   */
];
