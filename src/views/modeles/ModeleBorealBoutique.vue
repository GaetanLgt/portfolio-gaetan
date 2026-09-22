<script setup>
/**
 * ModeleBorealBoutique.vue — LA TRANCHE VERTICALE, ASSEMBLÉE, SUR CINQ VRAIES ADRESSES.
 *
 * ⭐ LA MARCHE NE SE STOCKE PLUS : ELLE SE LIT DANS LA ROUTE.
 * `route.meta.modele` désigne la marche servie, et cette valeur vient de
 * `modeles-adresses.js` par `routes-modele.js`. Il n'y a donc AUCUN état local qui
 * reproduise l'adresse — *deux sources de vérité pour la même chose, c'est une divergence
 * programmée* — et un lien collé dans un message rouvre exactement la même marche.
 *
 * ⛔ PLUS AUCUN FRAGMENT D'ADRESSE DANS CE FICHIER. La version précédente pilotait les cinq
 * marches par `#catalogue`, `#fiche/<id>`, `#panier`, `#commande` : elle tenait dans une
 * seule route, mais **une adresse en `#` ne s'indexe pas, ne se partage pas, ne s'achète
 * pas.** Le fragment était une contrainte de livraison, pas un choix de conception.
 *
 * ⚠ CE QUI RESTE EN ÉTAT LOCAL, ET RIEN D'AUTRE : le panier (persistant pour lui-même dans
 * `usePanier`), le filtre et le tri (dans la grille), et la saisie du tunnel en cours
 * (dans le tunnel). Ce qui doit survivre à un rechargement et à un partage de lien est dans
 * l'ADRESSE ; le reste est dans l'état. La saisie d'un formulaire en cours est le cas
 * limite assumé : elle ne survit pas à un rechargement, et c'est écrit.
 *
 * ⛔ AUCUN APPEL RÉSEAU DANS CETTE PAGE NI DANS SES ENFANTS. Le panier vit dans le stockage
 * local du navigateur ; la commande est simulée jusqu'au bout.
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// La feuille de styles de la tranche est importée ICI, une seule fois, et nulle part
// ailleurs : un modèle qui dépend d'un ordre d'imports est un modèle qui casse en silence.
import '@/assets/styles/modeles/boreal.css';

import { ADRESSES_MODELE, adresseParNom, adressesDeNavigation, nomDe } from './modeles-adresses.js';
import { boutique, formaterPrix, produits } from '@/components/modeles/donneesProduits.js';
import { usePanier } from '@/components/modeles/usePanier.js';
import {
  arreterManette,
  demarrerManette,
  derniereAction,
  manetteConnectee,
  nomManette,
  surToucheClavier,
  useActionsManette,
} from '@/components/modeles/useManette.js';

// Les cinq marches sont des composants ORDINAIRES, importés directement : la page est
// déjà un morceau paresseux au niveau du routeur, découper à l'intérieur n'apporterait
// que des allers-retours réseau — donc des requêtes, que le studio compte.
import VitrineModele from '@/components/modeles/VitrineModele.vue';
import GrilleProduits from '@/components/modeles/GrilleProduits.vue';
import FicheProduit from '@/components/modeles/FicheProduit.vue';
import PanneauPanier from '@/components/modeles/PanneauPanier.vue';
import TunnelCommande from '@/components/modeles/TunnelCommande.vue';

const route = useRoute();
const router = useRouter();
const { nombreArticles, sousTotal, dernierMessage, ajouter } = usePanier();

const aideOuverte = ref(false);

/** LA MARCHE COURANTE, LUE DANS LA ROUTE — et lue PAR LE NOM, pas par un `meta` du
 *  routeur. ⚠ C'EST UNE CORRECTION, ET ELLE A ÉTÉ PAYÉE.
 *
 *  La première version lisait `route.meta.modele`. Or le routeur du site appartient au
 *  dépôt, et les cinq routes y ont été écrites SANS ce champ : les cinq adresses auraient
 *  donc toutes rendu la vitrine, en silence, sans qu'aucune erreur ne soit levée. Mon banc
 *  d'essai ne pouvait pas le voir — il monte SES enregistrements, où le champ existe.
 *  ⭐ *Un banc qui teste ses propres données ne teste pas l'intégration.*
 *
 *  Le NOM de la route, lui, est déjà la clé qui sert à naviguer : il ne peut pas manquer
 *  là où la navigation fonctionne. On le lit donc en premier, `meta.modele` ne sert plus
 *  que de renfort (mes enregistrements le portent), et le repli est la vitrine — jamais
 *  une page blanche. Le banc `banc-routes-boreal.mjs` compare ensuite les noms du routeur
 *  RÉEL à cette source, pour que la divergence ne puisse plus passer inaperçue. */
const etape = computed(() => {
  const parNom = adresseParNom(route.name);
  if (parNom) return parNom.id;
  const declaree = route.meta && route.meta.modele ? route.meta.modele : '';
  if (ADRESSES_MODELE.some((adresse) => adresse.id === declaree)) return declaree;
  return 'vitrine';
});

const indexEtape = computed(() => {
  const position = ADRESSES_MODELE.findIndex((adresse) => adresse.id === etape.value);
  return position < 0 ? 0 : position;
});
const libelleEtape = computed(
  () => (ADRESSES_MODELE[indexEtape.value] || ADRESSES_MODELE[0]).libelle,
);
const nomRouteCourante = computed(() => (adresseParNom(route.name) || {}).nom || '');

/** L'identifiant de produit porté par l'adresse (`/produit/:id`), ou une chaîne vide.
 *  ⚠ On ne devine PAS l'écran quand le paramètre manque : `FicheProduit` reçoit une chaîne
 *  vide et affiche « ce produit n'existe pas » — un identifiant inconnu ne fait jamais une
 *  page blanche. */
const idProduitActif = computed(() => {
  const brut = route.params && route.params.id ? route.params.id : '';
  return Array.isArray(brut) ? (brut[0] || '') : String(brut);
});

/* ────────────────────────────────────────────────────────────────────────────────
   NAVIGATION — PAR NOM DE ROUTE, JAMAIS PAR CHEMIN ÉCRIT À LA MAIN
   ──────────────────────────────────────────────────────────────────────────────── */

/** Message posé quand une navigation est refusée par le routeur (route non déclarée). */
const incidentNavigation = ref('');

/**
 * Va vers une marche, par son NOM de route. Les paramètres de route sont passés en objet :
 * c'est le routeur qui construit l'adresse, jamais nous.
 *
 * ⚠ L'ÉCHEC EST PARLÉ, PAS AVALÉ. Si la route n'existe pas (modèle branché à moitié), Vue
 * Router rend une promesse rejetée : on l'écrit à l'écran. *Un bouton qui ne fait rien sans
 * rien dire est un défaut qu'on ne trouve jamais.*
 */
async function allerA(idMarche, parametres = {}) {
  const nom = nomDe(idMarche);
  if (!router.hasRoute(nom)) {
    incidentNavigation.value =
      `La route « ${nom} » n'est pas déclarée dans le routeur du site : la marche `
      + `« ${idMarche} » ne peut pas s'ouvrir. C'est un défaut de branchement, pas de la page.`;
    return false;
  }
  incidentNavigation.value = '';
  const echec = await router.push({ name: nom, params: parametres });
  if (echec) {
    // Vue Router 4 rend un « NavigationFailure » (et non une exception) quand la
    // navigation est refusée. On ne le confond pas avec une navigation nulle ni avec un
    // doublon (aller sur l'adresse où l'on est déjà), qui sont des cas normaux.
    const estDoublon = echec.type === 16; // NavigationFailureType.duplicated
    if (!estDoublon) {
      incidentNavigation.value = `Navigation vers « ${nom} » refusée (type ${echec.type}).`;
      return false;
    }
  }
  return true;
}

/** Revenir à la marche précédente, dans l'ORDRE DU PARCOURS — pas dans l'historique.
 *  ⚠ ET C'EST UN CHOIX : ouvert directement sur `/commande` par un lien partagé, un
 *  « retour » d'historique ferait QUITTER le site, ce qui est désorientant. L'ordre du
 *  parcours, lui, ramène toujours à la marche précédente du modèle. */
function reculer() {
  const position = indexEtape.value;
  if (position <= 0) return;
  const precedente = ADRESSES_MODELE[position - 1].id;
  // La fiche n'a pas de sens sans produit derrière : on ne remonte jamais vers elle.
  allerA(precedente === 'fiche' ? 'catalogue' : precedente);
}

function ouvrirPanier() {
  allerA('panier');
}

function ajouterDirect(charge) {
  if (!charge || !charge.idProduit) return;
  const produit = produits.find((p) => p.id === charge.idProduit);
  if (!produit) return;
  if (produit.stock <= 0) {
    // On dit la rupture au lieu d'appeler `ajouter` avec une variante vide : la règle
    // « un ajout sans variante valide échoue » est déjà tenue par `usePanier`, et lui
    // passer une chaîne vide ferait lever une exception pour un cas parfaitement normal.
    dernierMessage.value = `${produit.nom} est en rupture : rien n'a été ajouté au panier.`;
    return;
  }
  ajouter(produit, charge.idVariante || produit.variantes[0].id, 1);
}

/* ────────────────────────────────────────────────────────────────────────────────
   LE FOCUS SUIT LA MARCHE
   ──────────────────────────────────────────────────────────────────────────────── */

/** Le titre à viser au focus après un changement de marche. Le `h1` de la page est visé
 *  pour la vitrine : il existe à toutes les marches, donc la cible existe toujours. */
function titreDeMarche(idMarche) {
  return idMarche === 'vitrine' ? 'titre-modele' : `titre-${idMarche}`;
}

const premierRendu = ref(true);

watch(
  () => [route.name, route.params.id],
  async () => {
    if (premierRendu.value) return;
    await nextTick();
    const cible = document.getElementById(titreDeMarche(etape.value));
    if (cible && typeof cible.focus === 'function') cible.focus();
  },
);

useActionsManette({
  panier: ouvrirPanier,
  retour: reculer,
  aide: () => { aideOuverte.value = !aideOuverte.value; },
});

/* ────────────────────────────────────────────────────────────────────────────────
   MONTAGE — la manette démarre AVANT l'écoute clavier, et c'est volontaire :
   l'écouteur global de la manette marque l'origine du focus, et l'écoute clavier doit
   passer APRÈS lui pour que le clavier virtuel sache qui a donné le focus.
   ──────────────────────────────────────────────────────────────────────────────── */

onMounted(async () => {
  demarrerManette();
  window.addEventListener('keydown', surToucheClavier);
  // ⚠ `premierRendu` est abaissé APRÈS le tour de rendu : sans ça, ouvrir directement
  // `/commande` par un lien partagé déplacerait le focus tout seul au chargement, ce qui
  // désoriente — en lecteur d'écran comme à la manette.
  await nextTick();
  premierRendu.value = false;
});

onUnmounted(() => {
  window.removeEventListener('keydown', surToucheClavier);
  arreterManette();
});
</script>

<template>
  <div class="boreal">
    <!-- ═══════════════════════════════════════════════════════════════════════════
         ⚠ LE `h1` VIT ICI, ET C'EST UNE CORRECTION MESURÉE, PAS UN CHOIX DE MISE EN PAGE.

         Au premier passage de l'audit axe, la vitrine portait le seul `h1` de la page —
         et dès qu'on passait au catalogue, à la fiche, au panier ou au tunnel, **la page
         n'avait plus AUCUN titre de niveau 1**. Axe le dit : `page-has-heading-one`.
         Trois défauts distincts en découlaient : un lecteur d'écran ne savait plus sur
         quelle page il était après le premier changement d'étape ; la hiérarchie des
         titres repartait d'un `h2` orphelin ; et un lien direct (`/commande`) ouvrait
         une page sans titre.

         *Un titre qui n'existe que sur la première marche n'est pas le titre de la page :
         c'est le titre d'une marche.* Le `h1` est donc dans l'en-tête, il ne bouge plus
         d'une adresse à l'autre, et chaque marche garde ses `h2`.
         ═══════════════════════════════════════════════════════════════════════════ -->
    <header class="boreal-entete">
      <p class="boreal-etiquette">Modèle de boutique — démonstration</p>
      <h1 id="titre-modele" class="boreal-titre-1" tabindex="-1">{{ boutique.nom }}</h1>
      <p class="boreal-chapeau boreal-chapeau--large">
        {{ boutique.accroche }} Une boutique de démonstration complète, conçue comme un
        modèle vendable : catalogue, fiche produit, panier persistant et tunnel de commande
        simulé. Tout ce qui est affiché est fictif, et l'interface le répète à chaque étape.
      </p>

      <p class="boreal-bandeau" role="note">
        <span class="boreal-bandeau__marque">Démonstration</span>
        Modèle de boutique « {{ boutique.nom }} » — panier, commande et paiement entièrement
        simulés. Aucune donnée ne quitte votre navigateur.
      </p>
    </header>

    <!-- ⚠ LA BARRE EST FAITE DE LIENS (`<RouterLink>`), PAS DE BOUTONS.
         Trois raisons, et aucune n'est esthétique : un lien a une adresse qu'on peut copier
         dans un message, ouvrir dans un nouvel onglet, ou suivre par un moteur de
         recherche ; un bouton n'en a pas. *Un menu de boutique qui n'est pas fait de liens
         n'est pas un menu : c'est une suite de boutons.* -->
    <nav class="boreal-barre" aria-label="Étapes de la démonstration">
      <ul class="boreal-barre__liste">
        <li v-for="adresse in adressesDeNavigation()" :key="adresse.id">
          <RouterLink
            class="boreal-onglet"
            data-manette
            :to="{ name: adresse.nom }"
            :aria-current="adresse.id === etape ? 'page' : undefined"
          >
            {{ adresse.libelle }}
            <span v-if="adresse.id === 'panier' && nombreArticles > 0" class="boreal-onglet__compte">
              {{ nombreArticles }}
              <span class="sr-only">article(s) dans le panier</span>
            </span>
          </RouterLink>
        </li>
      </ul>

      <p class="boreal-barre__etat">
        Étape {{ indexEtape + 1 }} sur {{ ADRESSES_MODELE.length }} — {{ libelleEtape }}
        <span v-if="idProduitActif" class="boreal-barre__parametre">
          · référence : <code>{{ idProduitActif }}</code>
        </span>
      </p>
    </nav>

    <p v-if="incidentNavigation" class="boreal-avertissement" role="alert">
      {{ incidentNavigation }}
    </p>

    <section class="boreal-manette" aria-labelledby="titre-manette">
      <h2 id="titre-manette" class="boreal-surtitre">Manette &amp; clavier</h2>
      <p class="boreal-manette__etat" role="status">
        <template v-if="manetteConnectee">
          Manette détectée : {{ nomManette }}.
        </template>
        <template v-else>
          Aucune manette détectée. Branchez une manette Xbox et appuyez sur un bouton : elle
          est reconnue automatiquement, sans rien recharger.
        </template>
      </p>
      <p v-if="derniereAction" class="boreal-mention">Dernier geste : {{ derniereAction }}</p>

      <button
        type="button"
        class="boreal-bouton boreal-bouton--discret"
        data-manette
        :aria-expanded="aideOuverte ? 'true' : 'false'"
        aria-controls="aide-manette"
        @click="aideOuverte = !aideOuverte"
      >
        {{ aideOuverte ? 'Masquer les commandes' : 'Voir les commandes de la manette' }}
      </button>

      <dl v-if="aideOuverte" id="aide-manette" class="boreal-legende">
        <dt>Stick gauche / croix directionnelle</dt>
        <dd>Déplacer le focus dans la direction voulue (le focus ne saute jamais au hasard : la distance est calculée).</dd>
        <dt>A</dt>
        <dd>Valider l'élément visé, suivre un lien, cocher une variante, insérer une lettre au clavier à l'écran.</dd>
        <dt>B</dt>
        <dd>Revenir à l'étape précédente du parcours.</dd>
        <dt>X</dt>
        <dd>Ajouter au panier depuis le catalogue ou depuis une fiche produit.</dd>
        <dt>Y ou Start</dt>
        <dd>Aller au panier.</dd>
        <dt>Gâchettes LB / RB</dt>
        <dd>Étape précédente / étape suivante du tunnel de commande.</dd>
        <dt>Détentes LT / RT</dt>
        <dd>Baisser / augmenter la quantité, sur la fiche produit ou sur la ligne du panier visée.</dd>
        <dt>Select</dt>
        <dd>Afficher ou masquer cette aide.</dd>
        <dt>Clavier</dt>
        <dd>Tab et Maj+Tab, Entrée, Espace, Échap, et les flèches pour la même navigation spatiale. Dans un champ de texte, les flèches restent au texte : c'est voulu.</dd>
      </dl>
    </section>

    <VitrineModele v-if="etape === 'vitrine'" />

    <GrilleProduits
      v-else-if="etape === 'catalogue'"
      @ajouter-direct="ajouterDirect"
    />

    <FicheProduit
      v-else-if="etape === 'fiche'"
      :id-produit="idProduitActif"
      @retour="allerA('catalogue')"
      @aller-au-panier="ouvrirPanier"
    />

    <PanneauPanier v-else-if="etape === 'panier'" />

    <TunnelCommande v-else-if="etape === 'commande'" />

    <p class="boreal-mention boreal-mention--pied">
      Sous-total du panier : {{ formaterPrix(sousTotal) }} ·
      clé de stockage local : <code>modele-boreal.panier.v1</code> ·
      les visuels de cette page sont des tracés SVG écrits dans le code : aucune image,
      aucune police et aucun script ne sont chargés depuis un autre domaine.
    </p>

    <p class="sr-only" role="status">{{ dernierMessage }}</p>
  </div>
</template>
