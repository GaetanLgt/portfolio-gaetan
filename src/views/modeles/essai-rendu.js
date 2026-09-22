/**
 * essai-rendu.js — LA PAGE D'ESSAI DE LA TRANCHE, ET SON BANC D'ESSAI DE BOUT EN BOUT.
 *
 * ELLE SERT À DEUX CHOSES, ET LA SECONDE EST LA PLUS IMPORTANTE.
 *
 * ① REGARDER. Elle monte la tranche dans une page nue, sans navigation de site ni
 *    prérendu, sur les MÊMES enregistrements de route que le site (`routes-modele.js`).
 *
 * ② ÉPROUVER, DU DÉBUT À LA FIN — ET PAR LES ADRESSES. Avec `?scenario=…`, elle clique sur
 *    les liens comme le ferait un visiteur, et elle VÉRIFIE L'ADRESSE À CHAQUE FOIS
 *    (`window.location.pathname`). Un scénario qui n'affirmerait que le texte affiché
 *    passerait sur des fragments, sur des boutons qui appellent le routeur, ou même sur un
 *    changement d'écran sans navigation : **l'adresse est la seule preuve qu'il y a cinq
 *    routes et non cinq écrans.**
 *
 * ⭐ LA RÈGLE DU STUDIO QUI COMMANDE CE FICHIER : *une partie entière est le seul essai qui
 * traverse toutes les règles.* Un composant qui compile ne prouve rien ; un tunnel traversé
 * jusqu'à la confirmation, dans un vrai navigateur, avec un RECHARGEMENT COMPLET au milieu
 * pour vérifier que le panier tient, si.
 *
 * ⚠ L'HÔTE REPRODUIT CE QUI COMPTE DU ROUTEUR DU SITE, ET RIEN DE PLUS. Son
 * `scrollBehavior` (`{ top: 0 }`) et son `beforeEach` (qui écrit `document.title` à partir
 * de `meta.title`) sont RECOPIÉS de `src/router/index.js` — lus, pas supposés — parce que
 * ce sont eux qui décident du défilement et du titre, et qu'un hôte qui ne les applique
 * pas mesurerait une tranche qui n'existe nulle part.
 *
 * ⚠ CE QUE CE BANC NE PROUVE PAS : la manette (aucun `getGamepads` sans périphérique), la
 * lecture d'écran, et les contrastes (mesurés par axe, à part).
 */

import { createApp, h } from 'vue';
import { createRouter, createWebHistory, RouterView } from 'vue-router';

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

import { ROUTES_MODELE } from './routes-modele.js';

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

/* ────────────────────────────────────────────────────────────────────────────────
   LE ROUTEUR DE L'ESSAI — les enregistrements du modèle, rien d'autre
   ──────────────────────────────────────────────────────────────────────────────── */

const routeur = createRouter({
  history: createWebHistory(),
  routes: [...ROUTES_MODELE],
  // ⚠ RECOPIÉ DE `src/router/index.js` (L544-549), et c'est ce qui permet de répondre à la
  // question « un changement de marche remonte-t-il en haut ? » : oui, `top: 0`.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, behavior: 'smooth' };
  },
});

// ⚠ RECOPIÉ DE `src/router/index.js` (L553-570) : c'est ce crochet qui écrit le titre du
// document à partir de `meta.title`. S'il manquait, le banc ne pourrait pas vérifier que
// les cinq adresses portent bien un titre — et une route sans `meta.title` afficherait
// « undefined | Génie IT Tek FR » dans l'onglet du visiteur.
routeur.beforeEach((to, from, suivant) => {
  document.title = `${to.meta.title} | Génie IT Tek FR`;
  suivant();
});

const Racine = { render: () => h(RouterView) };
const app = createApp(Racine);
app.config.errorHandler = (erreur) => {
  bruits.push(`erreur de rendu Vue : ${erreur && erreur.message}`);
};
app.use(routeur);
app.mount(document.getElementById('app'));

/* ────────────────────────────────────────────────────────────────────────────────
   LE BANC — utile seulement si `?scenario=` est présent
   ──────────────────────────────────────────────────────────────────────────────── */

const parametres = new URLSearchParams(window.location.search);
const scenario = parametres.get('scenario');

if (scenario) {
  const journal = [];
  const noter = (ok, message) => journal.push(`${ok ? '[ok]' : '[KO]'} ${message}`);
  const attendre = (ms = 80) => new Promise((resoudre) => setTimeout(resoudre, ms));

  /** ⭐ L'ADRESSE COURANTE. C'est la mesure centrale de ce banc : sans elle, on ne
   *  mesurerait que des écrans, pas des routes.
   *
   *  ⚠ ELLE EST DÉCODÉE, ET ÇA A ÉTÉ PAYÉ. Un identifiant de produit accentué
   *  (`bloc-accordéon`) apparaît ENCODÉ dans l'adresse : `window.location.pathname` rend
   *  `/produit/bloc-accord%C3%A9on`. Le banc comparait cette forme à l'identifiant du
   *  catalogue, ne trouvait pas, et accusait la page. **Une adresse se compare décodée :
   *  ce que l'adresse CONTIENT et ce qu'elle AFFICHE ne s'écrivent pas pareil.** */
  const chemin = () => decodeURIComponent(window.location.pathname);

  /**
   * ⚠ ON ATTEND UNE CONDITION, PAS UN DÉLAI FIXE. Les cinq routes chargent le composant
   * de la page PARESSEUSEMENT : un `setTimeout(80)` suffisait sur une machine rapide et
   * aurait produit des échecs « fantômes » sur une machine chargée — exactement le genre de
   * faux défaut qui fait « réparer » du code juste. On interroge donc la condition, et on
   * échoue avec le motif si elle n'arrive jamais.
   */
  async function attendreQue(predicat, description, delai = 3000) {
    const debut = Date.now();
    while (Date.now() - debut < delai) {
      try {
        if (predicat()) return true;
      } catch (erreur) { /* la prédicat peut interroger un DOM transitoire : on réessaie */ }
      await attendre(30);
    }
    noter(false, `délai dépassé en attendant : ${description}`);
    return false;
  }

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

  /** Un LIEN par son libellé visible — c'est ainsi qu'on navigue maintenant. */
  const lien = (morceau, racine = document) =>
    Array.from(racine.querySelectorAll('a')).find((a) =>
      a.textContent.replace(/\s+/g, ' ').trim().includes(morceau),
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
    const onglet = lien('Catalogue');
    if (!onglet) {
      noter(false, 'le lien « Catalogue » est introuvable');
      return false;
    }
    onglet.click();
    return attendreQue(() => chemin().endsWith('/catalogue'), 'l\'adresse du catalogue');
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
    window.__essai = { scenario, chemin: chemin(), echecs, bruits, journal };
  }

  /* ──────────────────────────────────────────────────────────────────────────────
     LES SCÉNARIOS
     ────────────────────────────────────────────────────────────────────────────── */

  async function scenarioRendu() {
    noter(document.querySelector('.boreal') !== null, 'la tranche est montée dans la page');
    noter(chemin() === '/modeles/boutique-boreal',
      `l'adresse d'ouverture est la vitrine (mesuré : ${chemin()})`);
    noter(contient('Atelier Boréal'), 'le nom de la boutique est affiché');
    noter(contient('Ce que le modèle contient'), 'la vitrine annonce ce que le modèle contient');
    const onglets = document.querySelectorAll('a.boreal-onglet').length;
    noter(onglets === 4, `la barre compte 4 liens — la fiche n'a pas d'adresse sans produit (mesuré : ${onglets})`);
    noter(document.querySelector('.boreal-bandeau') !== null, 'le bandeau de démonstration est affiché');
    // Les deux appels de la vitrine sont des LIENS : c'est ce qui les rend copiables.
    const appels = Array.from(document.querySelectorAll('.boreal-vitrine__actions a'));
    noter(appels.length === 2, `les deux appels de la vitrine sont des liens (mesuré : ${appels.length})`);
    noter(
      appels.every((a) => a.getAttribute('href') === '/modeles/boutique-boreal/catalogue'),
      `leur adresse est réelle et complète (mesuré : ${appels.map((a) => a.getAttribute('href')).join(', ')})`,
    );
  }

  async function scenarioRoutes() {
    // ① LES CINQ ROUTES SONT DÉCLARÉES, ET CHACUNE DIT SA MARCHE.
    const noms = ['ModeleBorealBoutique', 'ModeleBorealCatalogue', 'ModeleBorealProduit', 'ModeleBorealPanier', 'ModeleBorealCommande'];
    const absentes = noms.filter((nom) => !routeur.hasRoute(nom));
    noter(absentes.length === 0, `les 5 routes sont déclarées dans le routeur (absentes : ${absentes.join(', ') || 'aucune'})`);
    const resolus = routeur.getRoutes().filter((r) => r.meta && r.meta.modele);
    noter(resolus.length === 5, `les 5 routes du modèle portent leur marche dans meta.modele (mesuré : ${resolus.length})`);
    noter(
      resolus.every((r) => typeof r.meta.title === 'string' && r.meta.title.length > 10),
      'chacune porte un titre : le routeur du site écrit le titre du document avec, sans quoi l\'onglet afficherait « undefined »',
    );
    const fiches = routeur.getRoutes().find((r) => r.name === 'ModeleBorealProduit');
    noter(
      fiches && fiches.path.endsWith('/produit/:id'),
      `la fiche porte un paramètre de route (mesuré : ${fiches ? fiches.path : 'absente'})`,
    );

    // ② CHAQUE LIEN DE LA BARRE CHANGE L'ADRESSE — c'est la preuve qu'il y a des routes.
    const parcours = [
      ['Catalogue', '/modeles/boutique-boreal/catalogue'],
      ['Panier', '/modeles/boutique-boreal/panier'],
      ['Commande', '/modeles/boutique-boreal/commande'],
      ['Vitrine', '/modeles/boutique-boreal'],
    ];
    for (const [libelle, adresseAttendue] of parcours) {
      const cible = lien(libelle);
      if (!cible) {
        noter(false, `le lien « ${libelle} » est introuvable`);
        continue;
      }
      cible.click();
      const arrivee = await attendreQue(() => chemin() === adresseAttendue, `l'adresse ${adresseAttendue}`);
      if (arrivee) noter(true, `« ${libelle} » ouvre bien ${adresseAttendue}`);
    }

    // ③ LE BOUTON « PRÉCÉDENT » DU NAVIGATEUR FONCTIONNE : c'est la conséquence directe
    //    d'avoir de vraies adresses, et ça ne marchait pas avec des fragments écrits sans
    //    empiler d'entrée d'historique.
    const avantRetour = chemin();
    window.history.back();
    const retourFait = await attendreQue(() => chemin() !== avantRetour, 'le retour d\'historique');
    if (retourFait) noter(true, `le bouton « précédent » ramène à une autre adresse (${avantRetour} → ${chemin()})`);

    // ④ LE TITRE DU DOCUMENT SUIT L'ADRESSE (crochet du routeur du site).
    lien('Catalogue').click();
    const titreSuivi = await attendreQue(() => document.title.includes('Catalogue'), 'le titre du document');
    if (titreSuivi) noter(true, `le titre du document suit la route (mesuré : « ${document.title} »)`);
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
    await attendre(60);

    const apres = cartes();
    noter(apres > 0 && apres < avant, `le filtre réduit la grille (${avant} → ${apres})`);
    noter(
      chemin() === '/modeles/boutique-boreal/catalogue',
      `filtrer ne change PAS l'adresse : le filtre est un état, pas une marche (mesuré : ${chemin()})`,
    );

    // ⭐ Le compte annoncé doit être le compte RENDU : c'est le seul moyen de savoir que
    // l'annonce faite aux lecteurs d'écran n'est pas un chiffre décoratif.
    const annonce = document.querySelector('.boreal-compte');
    const nombreAnnonce = annonce ? Number((annonce.textContent.match(/(\d+)\s+produit/) || [])[1]) : NaN;
    noter(nombreAnnonce === apres,
      `le compte annoncé (${nombreAnnonce}) égale le nombre de cartes rendues (${apres})`);
    noter(annonce ? annonce.textContent.includes('Papier') : false, 'l\'annonce nomme la catégorie active');
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
    await attendre(60);
    const premierApres = document.querySelector('.boreal-carte__nom').textContent.trim();
    noter(premierAvant !== premierApres,
      `le tri change l'ordre affiché (« ${premierAvant} » → « ${premierApres} »)`);
  }

  async function scenarioFiche() {
    if (!(await allerAuCatalogue())) return;

    const carte = document.querySelector('.boreal-carte');
    const nom = document.querySelector('.boreal-carte__nom').textContent.trim();
    const reference = carte ? carte.getAttribute('data-produit') : '';
    const voirFiche = lien('Voir la fiche');
    if (!voirFiche) {
      noter(false, 'le lien « Voir la fiche » est introuvable');
      return;
    }
    // ⚠ Le lien doit porter une VRAIE adresse dans son `href`, avant même le clic : c'est
    // ce qui le rend copiable et suivable par un moteur de recherche. On la compare
    // DÉCODÉE : dans l'attribut, un identifiant accentué est écrit `%C3%A9`.
    noter(
      decodeURIComponent(voirFiche.getAttribute('href')) === `/modeles/boutique-boreal/produit/${reference}`,
      `le lien de la fiche porte son adresse complète (mesuré : ${voirFiche.getAttribute('href')})`,
    );

    voirFiche.click();
    const arrivee = await attendreQue(
      () => chemin() === `/modeles/boutique-boreal/produit/${reference}`,
      `l'adresse de la fiche de ${reference}`,
    );
    if (!arrivee) return;
    noter(true, `la fiche s'ouvre à son adresse : /produit/${reference}`);
    noter(contient(nom), `la fiche affiche le produit cliqué (« ${nom} »)`);
    noter(document.querySelectorAll('.boreal-choice__option').length > 0, 'les variantes sont proposées');

    // Le prix suit la variante choisie : on coche la dernière et on regarde si ça change.
    const options = document.querySelectorAll('.boreal-choice__option input');
    const prixAvant = document.querySelector('.boreal-fiche__montant').textContent.trim();
    if (options.length > 1) {
      options[options.length - 1].click();
      await attendre(60);
      const prixApres = document.querySelector('.boreal-fiche__montant').textContent.trim();
      noter(prixAvant !== prixApres,
        `changer de variante change le prix affiché (« ${prixAvant} » → « ${prixApres} »)`);
    }

    // L'ajout au panier, puis le lien vers le panier.
    const ajouter = bouton('Ajouter au panier');
    if (!ajouter) {
      noter(false, 'le bouton d\'ajout au panier est introuvable sur la fiche');
      return;
    }
    ajouter.click();
    await attendre(60);
    noter(contient('ajouté au panier') || contient('maximum'), 'l\'ajout est annoncé à l\'écran');

    const voirPanier = lien('Voir le panier');
    noter(voirPanier !== undefined, 'la fiche propose un lien vers le panier');
    if (voirPanier) {
      voirPanier.click();
      await attendreQue(() => chemin() === '/modeles/boutique-boreal/panier', 'l\'adresse du panier');
    }
    noter(chemin() === '/modeles/boutique-boreal/panier', `on arrive au panier par son adresse (mesuré : ${chemin()})`);
    noter(contient('Votre panier'), 'l\'étape panier s\'affiche');
    noter(document.querySelector('.boreal-panier__ligne') !== null, 'une ligne de panier est rendue');
    noter(contient('Sous-total'), 'le sous-total est affiché');

    let memorise = null;
    try {
      memorise = window.localStorage.getItem('modele-boreal.panier.v1');
    } catch (erreur) {
      noter(false, `stockage local illisible : ${erreur.message}`);
    }
    noter(typeof memorise === 'string' && memorise.includes('idProduit'),
      'le panier est mémorisé dans le stockage local');
  }

  async function scenarioQuantite() {
    if (!(await allerAuCatalogue())) return;
    const ajouter = bouton('Ajouter');
    if (!ajouter) {
      noter(false, 'le bouton « Ajouter » est introuvable');
      return;
    }
    ajouter.click();
    await attendre(60);
    lien('Panier').click();
    await attendreQue(() => chemin().endsWith('/panier'), 'l\'adresse du panier');

    const plus = document.querySelector('.boreal-panier__quantite button:last-child');
    const valeurAvant = document.querySelector('.boreal-quantite__valeur').textContent.trim();
    if (!plus) {
      noter(false, 'le bouton d\'augmentation de quantité est introuvable');
      return;
    }
    plus.click();
    await attendre(60);
    const valeurApres = document.querySelector('.boreal-quantite__valeur').textContent.trim();
    noter(Number(valeurApres) === Number(valeurAvant) + 1,
      `la quantité augmente réellement (${valeurAvant} → ${valeurApres})`);

    const retirer = bouton('Retirer');
    noter(retirer !== undefined, 'chaque ligne porte un bouton de retrait');
    if (retirer) {
      retirer.click();
      await attendre(60);
      noter(document.querySelector('.boreal-panier__ligne') === null, 'le retrait vide réellement le panier');
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
    await attendre(60);
    lien('Panier').click();
    await attendreQue(() => chemin().endsWith('/panier'), 'l\'adresse du panier');

    const commander = lien('Passer commande');
    if (!commander) {
      noter(false, 'le lien « Passer commande » est introuvable');
      return;
    }
    noter(
      commander.getAttribute('href') === '/modeles/boutique-boreal/commande',
      `le lien de commande porte son adresse (mesuré : ${commander.getAttribute('href')})`,
    );
    commander.click();
    const auTunnel = await attendreQue(
      () => chemin() === '/modeles/boutique-boreal/commande' && contient('Coordonnées'),
      'l\'adresse du tunnel de commande',
    );
    if (!auTunnel) return;
    noter(true, 'le tunnel s\'ouvre à /modeles/boutique-boreal/commande');

    // ① ENVOYER UN FORMULAIRE VIDE DOIT ÊTRE REFUSÉ, ET LE DIRE.
    const continuer = bouton('Continuer vers la livraison');
    if (!continuer) {
      noter(false, 'le bouton de validation des coordonnées est introuvable');
      return;
    }
    continuer.click();
    await attendre(80);
    noter(document.querySelector('.boreal-erreur--resume') !== null,
      'un formulaire vide est refusé, avec un résumé d\'erreurs affiché');
    noter(contient('champ') && contient('corriger'), 'le refus compte les champs à corriger');
    noter(document.querySelector('[aria-invalid="true"]') !== null, 'au moins un champ porte aria-invalid');
    noter(!contient('Mode de livraison'), 'l\'étape suivante n\'est PAS atteinte tant que le formulaire est refusé');
    noter(chemin() === '/modeles/boutique-boreal/commande',
      'les sous-étapes du tunnel ne changent pas l\'adresse : la saisie en cours est un état, pas une marche');

    // ② LE REMPLIR, CHAMP PAR CHAMP, COMME LE FERAIT UN VISITEUR.
    saisir('prenom', 'Camille');
    saisir('nom', 'Duperré');
    saisir('courriel', 'camille.duperre@exemple.fr');
    saisir('adresse', '12 rue des Embarcadères');
    saisir('codePostal', '4400'); // ⚠ EXPRÈS : quatre chiffres au lieu de cinq
    saisir('ville', 'Nantes');
    await attendre(60);
    continuer.click();
    await attendre(80);
    noter(
      contient('cinq chiffres') || document.querySelector('[aria-invalid="true"]') !== null,
      'un code postal français à quatre chiffres est refusé, et le motif est donné',
    );

    saisir('codePostal', '44000');
    await attendre(60);
    continuer.click();
    await attendreQue(() => contient('Mode de livraison'), 'l\'étape livraison');
    noter(contient('Mode de livraison'), 'une fois valide, l\'étape livraison s\'ouvre');

    const voirRecap = bouton('Voir le récapitulatif');
    if (!voirRecap) {
      noter(false, 'le bouton du récapitulatif est introuvable');
      return;
    }
    voirRecap.click();
    await attendre(80);
    noter(contient('Votre commande'), 'le récapitulatif s\'affiche');
    noter(contient('Camille'), 'l\'adresse saisie est reportée dans le récapitulatif');
    noter(contient('aucun paiement'), 'la démonstration est écrite noir sur blanc à l\'étape de validation');

    const valider = bouton('Valider la commande');
    if (!valider) {
      noter(false, 'le bouton de validation finale est introuvable');
      return;
    }
    valider.click();
    await attendre(120);
    noter(contient('Numéro de démonstration'), 'la confirmation affiche un numéro de démonstration');
    noter(contient('Camille'), 'l\'adresse de livraison est rappelée après validation');
    noter(document.querySelector('.boreal-panier__ligne') === null || !contient('Votre panier'),
      'le panier a bien été vidé après la validation');
    let restant = '';
    try {
      restant = window.localStorage.getItem('modele-boreal.panier.v1') || '';
    } catch (erreur) { restant = ''; }
    noter(restant === '[]', `le panier vidé est aussitôt réécrit dans le stockage local (mesuré : « ${restant} »)`);

    // ③ LA SORTIE DU TUNNEL EST UN LIEN, DONC UNE ADRESSE.
    const retour = lien('Revenir à la boutique');
    noter(
      retour !== undefined && retour.getAttribute('href') === '/modeles/boutique-boreal/catalogue',
      `« Revenir à la boutique » porte son adresse (mesuré : ${retour ? retour.getAttribute('href') : 'absent'})`,
    );
  }

  /**
   * ⭐ LE SCÉNARIO DU RECHARGEMENT, EN DEUX LANCEMMENTS DE NAVIGATEUR.
   * `recharge1` remplit le panier et s'arrête sur `/panier`. `recharge2` ouvre DIRECTEMENT
   * l'adresse du panier, dans un navigateur neuf, SANS AUCUNE INTERACTION : ce que le banc
   * y trouve ne peut donc venir que du stockage local du navigateur. *C'est la seule
   * manière de prouver à la fois qu'un lien partageable rouvre la bonne chose, et que le
   * panier survit à un rechargement complet.*
   */
  async function scenarioRecharge1() {
    if (!(await allerAuCatalogue())) return;
    const ajouter = bouton('Ajouter');
    if (!ajouter) {
      noter(false, 'le bouton « Ajouter » est introuvable');
      return;
    }
    ajouter.click();
    await attendre(80);
    lien('Panier').click();
    await attendreQue(() => chemin().endsWith('/panier'), 'l\'adresse du panier');
    noter(document.querySelector('.boreal-panier__ligne') !== null, 'phase 1 : le panier contient une ligne');
    noter(contient('Sous-total'), 'phase 1 : le sous-total est affiché');
    noter(chemin() === '/modeles/boutique-boreal/panier', 'phase 1 : on termine sur l\'adresse du panier');
  }

  async function scenarioRecharge2() {
    // Aucun clic, aucune interaction : on regarde ce que l'adresse seule rend.
    noter(chemin() === '/modeles/boutique-boreal/panier',
      `phase 2 : le navigateur s'ouvre directement sur l'adresse du panier (mesuré : ${chemin()})`);
    noter(contient('Votre panier'), 'phase 2 : la marche du panier est bien celle de l\'adresse');
    const ligne = document.querySelector('.boreal-panier__ligne');
    noter(ligne !== null, 'phase 2 : la ligne du panier est là SANS aucune interaction');
    if (ligne) {
      noter(contient(ligne.querySelector('.boreal-panier__nom').textContent.trim()),
        'phase 2 : le nom du produit mémorisé est affiché');
      noter(ligne.querySelector('.boreal-quantite__valeur').textContent.trim() !== '',
        'phase 2 : la quantité mémorisée est affichée');
    }
  }

  async function scenarioFicheInconnue() {
    noter(chemin().includes('/produit/'), `l'adresse ouverte est une fiche (mesuré : ${chemin()})`);
    noter(contient('Ce produit n\'existe pas'), 'un identifiant inconnu est dit au lieu de laisser une page blanche');
    noter(document.querySelector('.boreal') !== null, 'la page est montée : pas d\'écran vide');
    noter(document.getElementById('titre-modele') !== null, 'le titre de niveau 1 est là malgré l\'erreur');

    const retour = lien('Revenir au catalogue');
    noter(retour !== undefined, 'un chemin de retour est proposé');
    if (retour) {
      noter(retour.getAttribute('href') === '/modeles/boutique-boreal/catalogue',
        `le retour est un lien vers le catalogue (mesuré : ${retour.getAttribute('href')})`);
      retour.click();
      const arrivee = await attendreQue(() => chemin() === '/modeles/boutique-boreal/catalogue', 'le retour au catalogue');
      if (arrivee) noter(true, 'le retour au catalogue fonctionne réellement');
    }
  }

  async function scenarioAdresses() {
    // Chaque adresse est ouverte DIRECTEMENT (c'est le lancement du navigateur qui l'a fait),
    // et on vérifie que la marche rendue est bien celle de l'adresse — pas la vitrine.
    const attendues = {
      '/modeles/boutique-boreal': ['Ce que le modèle contient', 'vitrine'],
      '/modeles/boutique-boreal/catalogue': ['Le catalogue', 'catalogue'],
      '/modeles/boutique-boreal/panier': ['Votre panier', 'panier'],
      '/modeles/boutique-boreal/commande': ['Commande', 'commande'],
    };
    const cle = Object.keys(attendues).find((adresse) => adresse === chemin());
    if (!cle) {
      noter(false, `adresse inattendue pour ce scénario : ${chemin()}`);
      return;
    }
    const [marqueur, marche] = attendues[cle];
    noter(contient(marqueur), `l'adresse ${cle} rend bien « ${marqueur} »`);
    const ongletCourant = document.querySelector('a.boreal-onglet[aria-current="page"]');
    noter(ongletCourant !== null, `un onglet porte aria-current sur ${cle}`);
    noter(
      ongletCourant !== null && ongletCourant.getAttribute('href') === cle,
      `l'onglet marqué courant correspond à l'adresse (attendu ${cle}, mesuré `
        + `${ongletCourant ? ongletCourant.getAttribute('href') : 'aucun'})`,
    );
    noter(document.getElementById('titre-modele') !== null, `le titre de niveau 1 est présent sur ${marche}`);
  }

  const scenarios = {
    rendu: scenarioRendu,
    routes: scenarioRoutes,
    filtre: scenarioFiltre,
    fiche: scenarioFiche,
    quantite: scenarioQuantite,
    commande: scenarioCommande,
    recharge1: scenarioRecharge1,
    recharge2: scenarioRecharge2,
    'fiche-inconnue': scenarioFicheInconnue,
    adresses: scenarioAdresses,
  };

  const executer = scenarios[scenario];
  if (!executer) {
    noter(false, `scénario inconnu : « ${scenario} »`);
    rendreCompte();
  } else {
    // ⚠ ON ATTEND QUE LE ROUTEUR SOIT PRÊT AVANT DE CLIQUER : le composant de la page est
    // chargé paresseusement, et un banc qui clique dans une page encore vide conclurait
    // « lien introuvable » — un faux défaut, exactement ce qu'on cherche à ne pas produire.
    routeur.isReady().then(async () => {
      try {
        await attendre(120);
        await executer();
      } catch (erreur) {
        noter(false, `le scénario a levé une erreur : ${erreur && erreur.message}`);
      }
      await rendreCompte();
    });
  }
}
