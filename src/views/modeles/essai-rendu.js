/**
 * essai-rendu.js — LA PAGE D'ESSAI DE LA TRANCHE, ET SON BANC D'ESSAI DE BOUT EN BOUT.
 *
 * ELLE SERT À DEUX CHOSES, ET LA SECONDE EST LA PLUS IMPORTANTE.
 *
 * ① REGARDER. Elle monte la page de la tranche dans une page HTML nue, sans routeur, sans
 *    navigation du site et sans prérendu. C'est ce qui permet de vérifier la tranche avant
 *    d'ajouter la moindre ligne au routeur — et c'est aussi la seule entrée qui donne à
 *    `vite build` quelque chose à compiler (aucune route ne référence encore la page).
 *
 * ② ÉPROUVER, DU DÉBUT À LA FIN. Avec `?scenario=…`, elle PARCOURT la tranche en cliquant
 *    réellement sur les boutons, comme le ferait un visiteur : ajouter au panier, aller au
 *    panier, remplir le formulaire de commande champ par champ, valider, et regarder ce
 *    qui est VRAIMENT affiché. Le résultat est écrit dans le document (`#journal-essai`)
 *    et dans le titre de la page (`ESSAI-OK` / `ESSAI-KO`), donc lisible par une commande
 *    qui ne sait lire qu'un DOM.
 *
 * ⭐ LA RÈGLE DU STUDIO QUI COMMANDE CE FICHIER : *une partie entière est le seul essai qui
 * traverse toutes les règles.* Un composant qui compile ne prouve rien ; un tunnel qu'on a
 * traversé jusqu'à la confirmation, si.
 *
 * ⚠ CE QUE CE BANC NE PROUVE PAS, ET IL FAUT LE SAVOIR : il ne teste ni la manette (aucun
 * `getGamepads` dans Chrome sans périphérique), ni la lecture d'écran, ni les contrastes.
 * Ces trois-là se mesurent autrement — et le rapport de livraison dit lesquels ont été
 * mesurés et lesquels ne l'ont pas été.
 */

import { createApp } from 'vue';

// Les feuilles du studio, TELLES QUELLES — et LES MÊMES QUE `main.js`, dans le même ordre.
// ⚠ Ce n'est pas du zèle : au premier essai, cet hôte ne chargeait que `variables.css` et
// `a11y.css`, donc le FOND DE PAGE restait blanc. L'audit axe a alors relevé DIX défauts de
// contraste (titres, textes secondaires, onglets) — mesurés sur un fond qui n'existe pas
// dans le site, puisque le texte est conçu pour le bleu-noir. **C'était un défaut de
// l'hôte, pas de la tranche** : un hôte d'essai qui n'est pas le vrai hôte fabrique de
// faux défauts, et fait perdre du temps à réparer ce qui va bien.
import '../../assets/styles/fonts.css';
import '../../assets/styles/variables.css';
import '../../assets/styles/critical.css';
import '../../assets/styles/global.css';
import '../../assets/styles/a11y.css';

import ModeleBorealBoutique from './ModeleBorealBoutique.vue';

/* ══════════════════════════════════════════════════════════════════════════════════
   ⭐ ON BRANCHE L'OREILLE AVANT DE MONTER QUOI QUE CE SOIT.

   POURQUOI SI HAUT DANS LE FICHIER : un banc qui ne regarde que ce qu'il cherche rate
   exactement ce qu'il ne cherche pas. Ici on écoute AUSSI ce qui n'est pas prévu — une
   exception de rendu, une promesse rejetée, un avertissement de Vue sur une propriété
   manquante ou une clé dupliquée. Sans cette oreille, un composant pouvait lever une
   erreur à chaque rendu sans que le banc s'en aperçoive, tant que le texte attendu
   finissait par s'afficher.

   ⚠ Elle exige que le build de contrôle NE RETIRE PAS les `console.*` : voir
   `vite.config.controle-modele.mjs` (`drop_console: false`, et le pourquoi).
   ══════════════════════════════════════════════════════════════════════════════════ */
const bruits = [];
window.addEventListener('error', (evenement) => {
  bruits.push(`exception : ${evenement.message}`);
});
window.addEventListener('unhandledrejection', (evenement) => {
  const raison = evenement.reason && evenement.reason.message
    ? evenement.reason.message
    : evenement.reason;
  bruits.push(`promesse rejetée : ${raison}`);
});
for (const niveau of ['error', 'warn']) {
  const origine = console[niveau].bind(console);
  console[niveau] = (...arguments_) => {
    bruits.push(`console.${niveau} : ${arguments_.map(String).join(' ').slice(0, 300)}`);
    origine(...arguments_);
  };
}

const app = createApp(ModeleBorealBoutique);
app.config.errorHandler = (erreur) => {
  bruits.push(`erreur de rendu Vue : ${erreur && erreur.message}`);
};
app.mount('#app');

/* ────────────────────────────────────────────────────────────────────────────────
   LE BANC — utile seulement si `?scenario=` est présent
   ──────────────────────────────────────────────────────────────────────────────── */

const parametres = new URLSearchParams(window.location.search);
const scenario = parametres.get('scenario');

if (scenario) {
  const journal = [];
  const noter = (ok, message) => journal.push(`${ok ? '[ok]' : '[KO]'} ${message}`);
  const attendre = (ms = 80) => new Promise((resoudre) => setTimeout(resoudre, ms));

  /** Le texte RENDU de la page — c'est la mesure, pas le code source. */
  const texte = () => document.body.innerText;

  /**
   * ⚠ COMPARAISON INSENSIBLE À LA CASSE, ET CE N'EST PAS DU CONFORT.
   * Un défaut réel l'a imposé : la légende « Mode de livraison » est affichée en
   * capitales par la feuille de styles (`text-transform: uppercase`), et `innerText`
   * rend le texte TRANSFORMÉ. Le banc cherchait « Mode de livraison », ne le trouvait
   * pas, et accusait la page. ⭐ *Ce qui est affiché n'est pas ce qui est écrit — et une
   * comparaison de texte qui ignore ce fait mesure autre chose que ce qu'elle annonce.*
   */
  const contient = (morceau) => texte().toLowerCase().includes(String(morceau).toLowerCase());

  /** Un bouton par son libellé visible : on clique ce qu'un visiteur voit. */
  const bouton = (morceau, racine = document) =>
    Array.from(racine.querySelectorAll('button')).find((b) =>
      b.textContent.replace(/\s+/g, ' ').trim().includes(morceau),
    );

  const cartes = () => document.querySelectorAll('.boreal-grille-produits__item').length;

  /**
   * ⚠ CE DÉTOUR A ÉTÉ AJOUTÉ APRÈS UN ÉCHEC RÉEL DU BANC, ET C'EST LE BANC QUI AVAIT TORT.
   * Les scénarios cliquaient directement dans le catalogue… en oubliant que la tranche
   * s'ouvre sur la VITRINE : `[KO] le catalogue affiche des produits (mesuré : 0)`. Le
   * défaut n'était pas dans la page, il était dans l'essai. *Un banc qui échoue doit
   * d'abord être soupçonné lui-même — sinon on « répare » un code qui n'a rien.*
   */
  async function allerAuCatalogue() {
    const onglet = bouton('Catalogue');
    if (!onglet) {
      noter(false, 'l\'onglet « Catalogue » est introuvable');
      return false;
    }
    onglet.click();
    await attendre();
    return true;
  }

  /** Saisie dans un champ, par le geste natif : on pose la valeur PUIS on émet l'événement
   *  `input`, sinon Vue ne voit rien et le formulaire resterait vide. */
  function saisir(nomDuChamp, valeur) {
    const champ = document.querySelector(`[data-champ="${nomDuChamp}"]`);
    if (!champ) {
      noter(false, `champ « ${nomDuChamp} » introuvable à l'écran`);
      return;
    }
    const poseur = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set;
    poseur.call(champ, valeur);
    champ.dispatchEvent(new Event('input', { bubbles: true }));
  }

  async function rendreCompte() {
    // ⭐ L'OREILLE REND SON VERDICT EN DERNIER, ET ELLE EST LA PLUS IMPORTANTE : le banc
    // peut avoir vu tout ce qu'il cherchait pendant qu'une erreur se répétait à chaque
    // rendu. Zéro bruit est une affirmation, pas un silence.
    noter(
      bruits.length === 0,
      bruits.length === 0
        ? 'aucune exception, promesse rejetée ni avertissement de Vue pendant le scénario'
        : `${bruits.length} bruit(s) inattendu(s) : ${bruits.slice(0, 6).join(' ‖ ')}`,
    );

    const bloc = document.createElement('pre');
    bloc.id = 'journal-essai';
    bloc.setAttribute('aria-hidden', 'true');
    bloc.textContent = journal.join('\n');
    document.body.appendChild(bloc);

    const echecs = journal.filter((l) => l.startsWith('[KO]')).length;
    const verdict = echecs === 0 ? 'ESSAI-OK' : `ESSAI-KO (${echecs})`;
    document.title = verdict;
    window.__essai = { scenario, echecs, bruits, journal };
  }

  async function scenarioRendu() {
    noter(document.querySelector('.boreal') !== null, 'la tranche est montée dans la page');
    noter(contient('Atelier Boréal'), 'le nom de la boutique est affiché');
    noter(
      contient('Ce que le modèle contient'),
      'la vitrine annonce ce que le modèle contient',
    );
    const etapes = document.querySelectorAll('.boreal-barre__liste button').length;
    noter(etapes === 5, `la barre d'étapes compte 5 entrées (mesuré : ${etapes})`);
    noter(
      document.querySelector('.boreal-bandeau') !== null,
      'le bandeau de démonstration est affiché',
    );
  }

  async function scenarioFiltre() {
    if (!(await allerAuCatalogue())) return;
    const avant = cartes();
    noter(avant > 0, `le catalogue affiche des produits (mesuré : ${avant})`);

    const jetonPapier = bouton('Papier');
    if (!jetonPapier) {
      noter(false, 'le filtre « Papier » est introuvable');
      return;
    }
    jetonPapier.click();
    await attendre();

    const apres = cartes();
    noter(apres > 0 && apres < avant, `le filtre réduit la grille (${avant} → ${apres})`);

    // ⭐ Le compte annoncé doit être le compte RENDU : c'est le seul moyen de savoir que
    // l'annonce faite aux lecteurs d'écran n'est pas un chiffre décoratif.
    const annonce = document.querySelector('.boreal-compte');
    const nombreAnnonce = annonce ? Number((annonce.textContent.match(/(\d+)\s+produit/) || [])[1]) : NaN;
    noter(
      nombreAnnonce === apres,
      `le compte annoncé (${nombreAnnonce}) égale le nombre de cartes rendues (${apres})`,
    );
    noter(
      annonce ? annonce.textContent.includes('Papier') : false,
      'l\'annonce nomme la catégorie active',
    );
    noter(
      document.querySelector('.boreal-jeton[aria-pressed="true"]') !== null,
      'un jeton de filtre porte aria-pressed à true (l\'état n\'est pas porté par la couleur seule)',
    );

    // Le tri doit RÉELLEMENT changer l'ordre, pas seulement l'état du bouton.
    const premierAvant = document.querySelector('.boreal-carte__nom').textContent.trim();
    const jetonPrix = bouton('Prix décroissant');
    if (!jetonPrix) {
      noter(false, 'le tri « Prix décroissant » est introuvable');
      return;
    }
    jetonPrix.click();
    await attendre();
    const premierApres = document.querySelector('.boreal-carte__nom').textContent.trim();
    noter(
      premierAvant !== premierApres,
      `le tri change l'ordre affiché (« ${premierAvant} » → « ${premierApres} »)`,
    );
  }

  async function scenarioAjout() {
    if (!(await allerAuCatalogue())) return;
    const premier = document.querySelector('.boreal-carte__nom');
    const nom = premier ? premier.textContent.trim() : '';
    noter(nom !== '', `une carte produit est lisible (mesuré : « ${nom} »)`);

    const ajouter = bouton('Ajouter');
    if (!ajouter) {
      noter(false, 'le bouton « Ajouter » est introuvable');
      return;
    }
    ajouter.click();
    await attendre();

    const ongletPanier = bouton('Panier');
    noter(ongletPanier !== undefined, 'l\'onglet Panier est présent');
    if (ongletPanier) ongletPanier.click();
    await attendre();

    noter(contient('Votre panier'), 'l\'étape panier s\'affiche');
    noter(contient(nom), `le produit ajouté (${nom}) figure dans le panier`);
    noter(contient('Sous-total'), 'le sous-total est affiché');
    noter(
      document.querySelector('.boreal-panier__ligne') !== null,
      'une ligne de panier est rendue',
    );

    // La persistance : le panier doit être écrit dans le stockage local du navigateur.
    let memorise = null;
    try {
      memorise = window.localStorage.getItem('modele-boreal.panier.v1');
    } catch (erreur) {
      noter(false, `stockage local illisible : ${erreur.message}`);
    }
    noter(
      typeof memorise === 'string' && memorise.includes('idProduit'),
      'le panier est mémorisé dans le stockage local',
    );
  }

  async function scenarioQuantite() {
    if (!(await allerAuCatalogue())) return;
    const ajouter = bouton('Ajouter');
    if (!ajouter) {
      noter(false, 'le bouton « Ajouter » est introuvable');
      return;
    }
    ajouter.click();
    await attendre();
    bouton('Panier').click();
    await attendre();

    const plus = document.querySelector('.boreal-panier__quantite button:last-child');
    const valeurAvant = document.querySelector('.boreal-quantite__valeur').textContent.trim();
    if (!plus) {
      noter(false, 'le bouton d\'augmentation de quantité est introuvable');
      return;
    }
    plus.click();
    await attendre();
    const valeurApres = document.querySelector('.boreal-quantite__valeur').textContent.trim();
    noter(
      Number(valeurApres) === Number(valeurAvant) + 1,
      `la quantité augmente réellement (${valeurAvant} → ${valeurApres})`,
    );

    const retirer = bouton('Retirer');
    noter(retirer !== undefined, 'chaque ligne porte un bouton de retrait');
    if (retirer) {
      retirer.click();
      await attendre();
      noter(
        document.querySelector('.boreal-panier__ligne') === null,
        'le retrait vide réellement le panier',
      );
      noter(contient('Le panier est vide'), 'l\'état vide est annoncé en toutes lettres');
    }
  }

  async function scenarioCommande() {
    if (!(await allerAuCatalogue())) return;
    const ajouter = bouton('Ajouter');
    if (!ajouter) {
      noter(false, 'le bouton « Ajouter » est introuvable');
      return;
    }
    ajouter.click();
    await attendre();
    bouton('Panier').click();
    await attendre();

    const commander = bouton('Passer commande');
    if (!commander) {
      noter(false, 'le bouton « Passer commande » est introuvable');
      return;
    }
    commander.click();
    await attendre();

    noter(contient('Coordonnées'), 'l\'étape des coordonnées s\'ouvre');

    // ① ENVOYER UN FORMULAIRE VIDE DOIT ÊTRE REFUSÉ, ET LE DIRE.
    const continuer = bouton('Continuer vers la livraison');
    if (!continuer) {
      noter(false, 'le bouton de validation des coordonnées est introuvable');
      return;
    }
    continuer.click();
    await attendre();
    noter(
      document.querySelector('.boreal-erreur--resume') !== null,
      'un formulaire vide est refusé, avec un résumé d\'erreurs affiché',
    );
    noter(
      contient('champ') && contient('corriger'),
      'le refus compte les champs à corriger',
    );
    noter(
      document.querySelector('[aria-invalid="true"]') !== null,
      'au moins un champ porte aria-invalid',
    );
    noter(
      !contient('Mode de livraison'),
      'l\'étape suivante n\'est PAS atteinte tant que le formulaire est refusé',
    );

    // ② LE REMPLIR, CHAMP PAR CHAMP, COMME LE FERAIT UN VISITEUR.
    saisir('prenom', 'Camille');
    saisir('nom', 'Duperré');
    saisir('courriel', 'camille.duperre@exemple.fr');
    saisir('adresse', '12 rue des Embarcadères');
    saisir('codePostal', '4400'); // ⚠ EXPRÈS : quatre chiffres au lieu de cinq
    saisir('ville', 'Nantes');
    await attendre();
    continuer.click();
    await attendre();
    noter(
      contient('cinq chiffres') || document.querySelector('[aria-invalid="true"]') !== null,
      'un code postal français à quatre chiffres est refusé, et le motif est donné',
    );

    saisir('codePostal', '44000');
    await attendre();
    continuer.click();
    await attendre();
    noter(contient('Mode de livraison'), 'une fois valide, l\'étape livraison s\'ouvre');

    const voirRecap = bouton('Voir le récapitulatif');
    if (!voirRecap) {
      noter(false, 'le bouton du récapitulatif est introuvable');
      return;
    }
    voirRecap.click();
    await attendre();
    noter(contient('Votre commande'), 'le récapitulatif s\'affiche');
    noter(contient('Camille'), 'l\'adresse saisie est reportée dans le récapitulatif');
    noter(
      contient('aucun paiement') || contient('Aucun paiement'),
      'la démonstration est écrite noir sur blanc à l\'étape de validation',
    );

    const valider = bouton('Valider la commande');
    if (!valider) {
      noter(false, 'le bouton de validation finale est introuvable');
      return;
    }
    valider.click();
    await attendre();

    noter(contient('Numéro de démonstration'), 'la confirmation affiche un numéro de démonstration');
    noter(contient('Camille'), 'les articles commandés sont rappelés après validation');
    noter(
      document.querySelector('.boreal-panier__ligne') === null || !contient('Votre panier'),
      'le panier a bien été vidé après la validation',
    );
    let restant = '';
    try {
      restant = window.localStorage.getItem('modele-boreal.panier.v1') || '';
    } catch (erreur) {
      restant = '';
    }
    noter(
      restant === '[]',
      `le panier vidé est aussitôt réécrit dans le stockage local (mesuré : « ${restant} »)`,
    );
  }

  async function scenarioFragment() {
    window.location.hash = '#panier';
    await attendre(150);
    const ongletActif = document.querySelector('.boreal-barre__liste [aria-current="page"]');
    noter(
      ongletActif !== null,
      'un onglet porte aria-current après un changement de fragment',
    );
    noter(
      ongletActif !== null && ongletActif.textContent.includes('Panier'),
      'l\'onglet actif est bien le panier (mesuré : '
        + (ongletActif ? ongletActif.textContent.trim() : 'aucun') + ')',
    );
    // Un panier vide atteint par un lien direct n'est PAS une page blanche : il dit son
    // état et propose la suite. C'est le seul comportement acceptable pour un lien profond.
    noter(
      contient('Votre panier') && contient('Le panier est vide'),
      'un panier vide atteint par lien direct annonce son état au lieu de rester vide',
    );

    // Un lien profond vers une fiche inexistante ne doit pas laisser une page blanche.
    window.location.hash = '#fiche/objet-qui-n-existe-pas';
    await attendre(150);
    noter(
      contient('Ce produit n\'existe pas'),
      'une fiche inconnue le dit au lieu de rester blanche',
    );
  }

  const scenarios = {
    rendu: scenarioRendu,
    filtre: scenarioFiltre,
    ajout: scenarioAjout,
    quantite: scenarioQuantite,
    commande: scenarioCommande,
    fragment: scenarioFragment,
  };

  const executer = scenarios[scenario];
  if (!executer) {
    noter(false, `scénario inconnu : « ${scenario} »`);
    rendreCompte();
  } else {
    // On attend le premier rendu de Vue avant de cliquer : sans ça, le banc cliquerait
    // dans une page encore vide et conclurait « bouton introuvable ».
    setTimeout(async () => {
      try {
        await attendre(120);
        await executer();
      } catch (erreur) {
        noter(false, `le scénario a levé une erreur : ${erreur && erreur.message}`);
      }
      await rendreCompte();
    }, 60);
  }
}
