/**
 * url-langues.js — COMMENT LES LANGUES SE DISENT DANS L'ADRESSE
 *
 * ⭐ UNE SEULE DÉCISION, À UN SEUL ENDROIT.
 *
 * Le `hreflang` ne dit pas « cette page existe en allemand » : il dit **où elle
 * est**. Il lui faut donc la forme des adresses — et c'est la seule chose qui
 * manquait pour le générer.
 *
 * ⛔ ET CE N'EST PAS UNE QUESTION TECHNIQUE. Trois formes possibles, trois
 * conséquences différentes sur le référencement et sur la tenue du site :
 *
 *   · `sous-chemin`  → gldigitallab.fr/de/       une seule propriété, un seul
 *                       certificat, un seul hébergement. **Le plus simple à tenir**,
 *                       et le référencement se partage entre les langues.
 *   · `parametre`    → gldigitallab.fr/?lang=de  ⚠️ le plus faible en référencement :
 *                       les moteurs traitent mal les paramètres, et l'adresse change
 *                       sans que la page change.
 *   · `sous-domaine` → de.gldigitallab.fr        chaque langue a son domaine : le
 *                       référencement se sépare, et **il faut un certificat et une
 *                       configuration par sous-domaine**. *Plus lourd, et ça se
 *                       paie en entretien.*
 *
 * ⇒ **Décision de Gaëtan.** Ci-dessous : les trois, une seule active.
 * *Changer d'avis, c'est changer une ligne — et le générateur suit.*
 *
 * @author Génie IT Tek FR
 * @version 1.0.0
 */

/* ⛔ L'EXTENSION EST ÉCRITE — ET CE N'EST PAS UNE COQUETTERIE.
   ────────────────────────────────────────────────────────────────────────────
   Le premier essai portait `from './langues'`, **sans extension** : c'est la
   convention du site, et **Vite la résout**. Node, lui, ne la résout pas :
       Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/config/langues'
   ⇒ **Tous les modules du site étaient intestables par Node** — et on ne le
   découvre qu'en essayant de les charger hors du bundler.
   ⭐ Avec l'extension, **les deux marchent** : Vite l'accepte, Node aussi.
   *Un fichier qu'on ne peut pas charger tout seul est un fichier qu'on ne peut
   pas éprouver — et un module qu'on ne peut pas éprouver se casse en silence.* */
import { LANGUE_ACCUEIL, CODES } from './langues.js';

/** Le domaine du site. Une seule fois. */
export const DOMAINE = 'https://gldigitallab.fr';

/**
 * ⭐ LA FORME ACTIVE. C'est la ligne à changer si Gaëtan tranche autrement.
 * Valeurs possibles : 'sous-chemin' | 'parametre' | 'sous-domaine'
 *
 * ⚠️ `sous-chemin` est proposé par défaut — **et ce n'est PAS une décision prise**,
 * c'est la forme la moins coûteuse à tenir en attendant. *Un défaut se change ;
 * une absence bloque.*
 */
export const FORME = 'sous-chemin';

/**
 * L'adresse d'une langue pour un chemin donné.
 *
 * ⭐ LA LANGUE D'ACCUEIL N'EST PAS PRÉFIXÉE. `gldigitallab.fr/` et non
 * `gldigitallab.fr/fr/` : *une adresse canonique qui porterait la langue ferait
 * une redirection permanente pour rien, et casserait tous les liens déjà
 * partagés.*
 *
 * @param {string} code - code de langue
 * @param {string} chemin - chemin sans langue ('' pour l'accueil, '/contact', …)
 * @returns {string} l'adresse absolue
 */
export function urlLangue(code, chemin = '') {
  const c = (chemin || '').replace(/^\/+/, '');
  const estAccueil = code === LANGUE_ACCUEIL;

  switch (FORME) {
    case 'parametre':
      // ⚠️ L'accueil garde son adresse nue : seule une autre langue porte le paramètre.
      return estAccueil
        ? `${DOMAINE}/${c ? c : ''}`
        : `${DOMAINE}/${c ? c + '?' : '?'}lang=${code}`;

    case 'sous-domaine':
      return estAccueil
        ? `${DOMAINE}/${c}`
        : `https://${code}.gldigitallab.fr/${c}`;

    case 'sous-chemin':
    default:
      return estAccueil
        ? `${DOMAINE}/${c}`
        : `${DOMAINE}/${code}/${c}`;
  }
}

/**
 * ⭐ LES BALISES `hreflang` D'UNE PAGE — générées, jamais recopiées.
 *
 * ⛔ POURQUOI ON LES GÉNÈRE : sept langues × N pages, écrites à la main, c'est
 * sept occasions d'en oublier une — et **un `hreflang` incomplet est pire que pas
 * de `hreflang`** : *il dit aux moteurs qu'une version existe et ne dit pas où.*
 *
 * ⚠️ ET `x-default` EST OBLIGATOIRE ICI : il désigne la version servie à qui ne
 * parle aucune des langues listées — c'est-à-dire le français. *Sans lui, un
 * moteur choisit à notre place.*
 *
 * @param {string} chemin - chemin sans langue ('' pour l'accueil)
 * @returns {Array<{rel: string, hreflang: string, href: string}>}
 */
export function balisesHreflang(chemin = '') {
  const balises = CODES.map((code) => ({
    rel: 'alternate',
    hreflang: code,
    href: urlLangue(code, chemin),
  }));
  balises.push({ rel: 'alternate', hreflang: 'x-default', href: urlLangue(LANGUE_ACCUEIL, chemin) });
  return balises;
}

/* =============================================================================
   ⚠️ CE QUE CE FICHIER NE DIT PAS
   -----------------------------------------------------------------------------
   · **Il ne dit pas que `sous-chemin` est le bon choix.** Il dit que c'est le
     moins coûteux à tenir, et il attend la décision.
   · **Il ne gère pas la REDIRECTION.** La langue servie par défaut à l'arrivée
     sur `/` est une autre décision — *et une redirection automatique par la
     langue du navigateur peut être mal vécue : on ne redirige pas quelqu'un qui
     a demandé une adresse précise.*
   · **Il ne pose rien dans la page.** Le générateur est ici ; c'est
     `useSEOOptimization` qui l'écrit dans le `<head>`.
   ============================================================================= */
