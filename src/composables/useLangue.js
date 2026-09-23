/**
 * useLangue - Composable Vue 3 pour les langues du site
 *
 * ⭐ LA LANGUE SE LIT, ELLE NE SE DEVINE PAS. Ce composable ne traduit rien :
 * il dit QUELLE langue est active, et il rend les textes qu'on lui a donnés.
 * La liste des langues vient de `@/config/langues` — une seule source.
 *
 * @author Génie IT Tek FR
 * @version 1.0.0
 */

import { ref, computed, readonly } from 'vue';
import { LANGUES, LANGUES_ACTIVES, LANGUE_ACCUEIL, langue as trouverLangue } from '@/config/langues';
/* ⭐ LA LANGUE D'ACCUEIL EST CHARGÉE STATIQUEMENT — ajouté le 23/09/2026.
 *
 * ⛔ CE QUE ÇA RÉPARE. Elle passait par le même `await import()` dynamique que les
 * autres — donc par une promesse. Et **le prérendu mourait dessus** :
 *
 *   MESURE DU 23/09/2026, sur un `dist/` vidé et aucun Chrome au départ :
 *      1-11.  onze pages ÉCRITES, dont /ressources/tutoriels et /components
 *      12.    /apps   ⛔ « RENDU ILLISIBLE » — *ce que le moteur voit : (aucune réponse)*
 *      13.    /liens  ⛔ idem
 *      14+.   /ia-de-bord et les 19 suivantes ⛔ EN ÉCHEC EN CASCADE
 *   ⇒ **8 pages écrites sur 32**, à cause d'une seule page.
 *
 *   ⚠️ Et « (aucune réponse) » n'est pas « la page est vide » : c'est `Runtime.evaluate`
 *   qui ne revient jamais. *Si le texte avait été trop court, le moteur aurait rendu
 *   un objet, pas rien.* **Une promesse qui pend fige le moteur de rendu.**
 *
 * ⭐ POURQUOI ELLE N'A AUCUNE RAISON D'ÊTRE DYNAMIQUE : c'est la langue par défaut,
 *   celle qu'on sert à presque tous les visiteurs. *La charger « à la demande »
 *   n'économise rien, et elle introduit un risque sur le chemin le plus fréquent.*
 *   Les AUTRES langues gardent l'import dynamique — là, l'économie est réelle.
 *
 * ⚠️ CE QUE ÇA CHANGE POUR LE VISITEUR : `fr.js` (5 Ko) entre dans le paquet initial.
 *   *C'est le prix d'un chemin qui ne peut pas pendre.* */
import frStatique from '@/locales/fr.js';

/* -----------------------------------------------------------------------------
   L'ÉTAT, AU NIVEAU DU MODULE — comme `useMatomo` et `mode-sobre`.
   *Un état par instance de composant ferait diverger l'en-tête de la page et le
   corps : la même page pourrait se croire en allemand dans un bloc et en français
   dans un autre. C'est exactement ce que `lang` doit empêcher.*
   -------------------------------------------------------------------------- */
const CLE_STOCKAGE = 'gl_langue';

/** Le code de la langue active. Toujours une langue RÉELLE — jamais une supposition. */
const langueActive = ref(LANGUE_ACCUEIL);

/** Les traductions chargées, par code. Vide tant que rien n'est chargé. */
const textes = ref({});

/** Vrai quand la langue active n'a pas de textes chargés. */
const chargee = ref(false);

/* ⛔ LES CLÉS MANQUANTES SONT GARDÉES, PAS IGNORÉES.
   *Une clé absente qui se replie en silence sur le français produit une page qui a
   l'air juste — c'est la « deuxième version qui devient fausse en premier » de la
   consigne. On les accumule ici, et la porte de build les lit.* */
const manquantes = ref(new Set());

/**
 * Charge les textes d'une langue.
 *
 * ⚠️ `import()` DYNAMIQUE : les sept langues ne sont pas dans le paquet initial.
 * *On ne fait pas payer 3 095 chaînes × 7 au visiteur qui lit la page d'accueil
 * en français.* Le morceau n'est téléchargé que si on change de langue.
 *
 * @param {string} code - code de langue ('fr', 'en', …)
 * @returns {Promise<boolean>} vrai si les textes sont chargés
 */
async function charger(code) {
  if (textes.value[code]) { chargee.value = true; return true; }
  const l = trouverLangue(code);
  if (!l || l.role === 'a-decider') {
    /* ⛔ Une langue `a-decider` n'est PAS chargée : Gaëtan n'a pas tranché.
       *Le code dit ce qui est décidé — il ne publie pas une décision qu'il n'a pas prise.* */
    return false;
  }
  /* ⭐ LA LANGUE D'ACCUEIL NE PASSE PAS PAR UNE PROMESSE — 23/09/2026.
     Voir l'en-tête : c'est ce `await` qui figeait le moteur de rendu du prérendu,
     sur `/apps`, et faisait tomber les 20 pages suivantes. */
  if (code === LANGUE_ACCUEIL) {
    textes.value = { ...textes.value, [code]: frStatique || {} };
    chargee.value = true;
    return true;
  }
  try {
    const m = await import(`../locales/${code}.js`);
    textes.value = { ...textes.value, [code]: m.default || {} };
    chargee.value = true;
    return true;
  } catch (_) {
    /* ⚠️ Pas encore de fichier de langue : ce n'est PAS une erreur tant que la
       traduction n'est pas écrite. On le dit par le retour, pas par une exception. */
    chargee.value = false;
    return false;
  }
}

/**
 * ⭐ LE CŒUR — et c'est ici que se joue la tenue des sept langues.
 *
 * `t(cle)` rend le texte de la langue active. Et si la clé manque :
 *   · **en développement** → une exception, avec la clé ET la langue nommées ;
 *   · **en production** → la clé entre crochets, VISIBLE à l'écran.
 *
 * ⛔ POURQUOI PAS UN REPLI SILENCIEUX SUR LE FRANÇAIS : il donnerait une page qui
 * a l'air terminée. *Un repli invisible est un mensonge qui ne se voit qu'à la
 * relecture — c'est-à-dire trop tard.*
 * ⭐ Un `[cle.manquante]` en clair se corrige en cinq secondes : on le voit.
 *
 * @param {string} cle - la clé de traduction
 * @returns {string}
 */
function t(cle) {
  const code = langueActive.value;
  const paquet = textes.value[code];
  const v = paquet && paquet[cle];

  if (v !== undefined && v !== null) return v;

  manquantes.value = new Set(manquantes.value).add(code + ':' + cle);
  if (import.meta.env.DEV) {
    throw new Error(
      `[i18n] clé « ${cle} » absente en « ${code} ». ` +
      `Écrire la traduction, ou retirer la clé de la source.`
    );
  }
  return `[${cle}]`;
}

/**
 * Change la langue active — et POSE `lang` sur `<html>`.
 *
 * ⚠️ Le `lang` du document n'est pas décoratif : il commande la CÉSURE, les règles
 * de COUPURE japonaises (kinsoku), la prononciation des lecteurs d'écran, et la
 * traduction automatique du navigateur. *Sans lui, `hyphens: auto` ne coupe rien,
 * même quand la propriété est écrite.*
 *
 * @param {string} code
 */
async function definirLangue(code) {
  const l = trouverLangue(code);
  if (!l || l.role === 'a-decider') return false;

  langueActive.value = code;
  document.documentElement.lang = code;
  document.documentElement.dir = l.dir || 'ltr';

  await charger(code);
  try { localStorage.setItem(CLE_STOCKAGE, code); } catch (_) { /* mode privé : sans effet */ }
  return true;
}

/**
 * Détecte la langue au démarrage : le stockage d'abord, le navigateur ensuite,
 * le français en dernier.
 *
 * ⚠️ Le navigateur ne propose QUE ce que le site a. *`navigator.language` renvoie
 * « ja » sur un poste japonais : sans ce filtre, on chargerait une langue qui
 * n'existe pas, et la page se retrouverait vide sans rien dire.*
 */
function detecter() {
  let choix = null;
  try { choix = localStorage.getItem(CLE_STOCKAGE); } catch (_) {}
  if (choix && trouverLangue(choix) && trouverLangue(choix).role !== 'a-decider') return choix;

  const pref = (navigator.languages && navigator.languages[0]) || navigator.language || '';
  const base = String(pref).toLowerCase().split('-')[0];
  if (LANGUES_ACTIVES.some((l) => l.code === base) && base !== LANGUE_ACCUEIL) return base;

  return LANGUE_ACCUEIL;
}

/**
 * Le composable.
 * @returns {object}
 */
export function useLangue() {
  return {
    langue: readonly(langueActive),
    langues: LANGUES_ACTIVES,
    toutes: LANGUES,
    chargee: readonly(chargee),
    manquantes: readonly(manquantes),
    /** La langue active, en objet complet — nom, direction, justification. */
    courante: computed(() => trouverLangue(langueActive.value)),
    /** Le code de la langue qui accueille — pour savoir si on est sur l'original. */
    accueil: LANGUE_ACCUEIL,
    /** Vrai si la langue active EST la langue d'accueil. */
    estOriginal: computed(() => langueActive.value === LANGUE_ACCUEIL),
    t,
    definirLangue,
    detecter,
    charger,
  };
}

/* =============================================================================
   ⚠️ CE QUE CE COMPOSABLE NE FAIT PAS
   -----------------------------------------------------------------------------
   · **Il ne traduit rien.** Il lit `src/locales/<code>.js` — des fichiers qui
     n'existent pas encore. *Une infrastructure n'est pas un contenu.*
   · **Il ne pose pas les URL.** `/en/` ou `?lang=en` ? *La décision n'est pas
     prise, et elle est à Gaëtan. Ce composable n'en dépend pas — mais le
     `hreflang`, si.*
   · **Il ne règle pas le japonais.** Il refuse une langue `a-decider`, donc `ja`
     ne se chargera pas tant que son rôle n'aura pas changé. *Le refus est voulu.*
   ============================================================================= */
