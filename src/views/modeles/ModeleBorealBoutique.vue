<script setup>
/**
 * ModeleBorealBoutique.vue — LA TRANCHE VERTICALE, ASSEMBLÉE.
 *
 * ⚠ CE QUE CE FICHIER EST, ET CE QU'IL N'EST PAS.
 * C'est UNE page et UNE route. Les cinq marches de la démonstration (vitrine, catalogue,
 * fiche, panier, commande) vivent dans l'état local et dans le FRAGMENT D'ADRESSE
 * (`#catalogue`, `#fiche/plume-boreal`, `#panier`, `#commande`), pas dans cinq routes.
 *
 * POURQUOI CE CHOIX, ET IL EST DÉLIBÉRÉ : la tranche est livrée dans un dépôt dont le
 * routeur n'appartient pas à cette livraison. Poser cinq routes aurait voulu dire soit
 * modifier `src/router/index.js` (interdit ici), soit livrer cinq liens morts qui
 * répondraient 404 tant que la ligne n'est pas ajoutée. Avec un fragment d'adresse, LA
 * SEULE LIGNE À AJOUTER AU ROUTEUR OUVRE TOUT, et chaque étape reste atteignable par un
 * lien direct : `#panier` rouvre le panier.
 *
 * ⚠ ET LE FRAGMENT EST ÉCRIT EN `replaceState`, PAS EN AFFECTATION DE `location.hash` :
 * une affectation empile une entrée d'historique par clic, et le bouton « précédent » du
 * navigateur devient inutilisable au bout de dix gestes.
 *
 * ⛔ AUCUN APPEL RÉSEAU DANS CETTE PAGE NI DANS SES ENFANTS. Le panier vit dans le
 * stockage local du navigateur ; la commande est simulée jusqu'au bout.
 */

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

// La feuille de styles de la tranche est importée ICI, une seule fois, et nulle part
// ailleurs : un modèle qui dépend d'un ordre d'imports est un modèle qui casse en silence.
import '@/assets/styles/modeles/boreal.css';

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

const { nombreArticles, panierVide, sousTotal, dernierMessage, ajouter } = usePanier();

/** Les étapes, dans l'ordre du parcours. La liste est écrite une fois.
 *  ⚠ L'étape « vitrine » renvoie au `h1` de la PAGE (`titre-modele`) et non à un titre de
 *  la vitrine : ce titre existe à toutes les étapes, donc le focus après un changement
 *  d'étape ne peut jamais viser un élément qui n'est plus là. */
const ETAPES = [
  { id: 'vitrine', libelle: 'Vitrine', titre: 'titre-modele' },
  { id: 'catalogue', libelle: 'Catalogue', titre: 'titre-catalogue' },
  { id: 'fiche', libelle: 'Fiche produit', titre: 'titre-fiche' },
  { id: 'panier', libelle: 'Panier', titre: 'titre-panier' },
  { id: 'commande', libelle: 'Commande', titre: 'titre-commande' },
];

const etape = ref('vitrine');
const idProduitActif = ref(produits[0].id);
const aideOuverte = ref(false);

const libelleEtape = computed(
  () => (ETAPES.find((e) => e.id === etape.value) || ETAPES[0]).libelle,
);

const indexEtape = computed(() => ETAPES.findIndex((e) => e.id === etape.value));

/* ────────────────────────────────────────────────────────────────────────────────
   LE FRAGMENT D'ADRESSE — lecture, écriture, et la boucle qu'on évite
   ──────────────────────────────────────────────────────────────────────────────── */

function hashPour(etapeVoulue, idProduit) {
  if (etapeVoulue === 'fiche' && idProduit) return `#fiche/${idProduit}`;
  return `#${etapeVoulue}`;
}

function ecrireFragment() {
  const cible = hashPour(etape.value, idProduitActif.value);
  if (window.location.hash === cible) return;
  // `replaceState` n'empile rien et ne déclenche AUCUN `hashchange` : c'est ce qui rend
  // l'écriture sûre — elle ne peut pas rappeler le lecteur ci-dessous.
  if (window.history && typeof window.history.replaceState === 'function') {
    window.history.replaceState(null, '', cible);
  } else {
    window.location.hash = cible;
  }
}

function appliquerFragment() {
  const brut = window.location.hash.replace(/^#/, '');
  if (brut === '') return;
  const [nom, parametre] = brut.split('/');
  const connue = ETAPES.some((e) => e.id === nom);
  if (!connue) return;
  if (nom === 'fiche' && parametre) {
    idProduitActif.value = parametre;
    etape.value = 'fiche';
    return;
  }
  if (nom === 'fiche') return; // une fiche sans produit ne s'ouvre pas : on ne devine pas
  etape.value = nom;
}

/* ────────────────────────────────────────────────────────────────────────────────
   NAVIGATION DANS LA TRANCHE
   ──────────────────────────────────────────────────────────────────────────────── */

const premierRendu = ref(true);

function allerA(nouvelleEtape, idProduit) {
  if (idProduit) idProduitActif.value = idProduit;
  etape.value = nouvelleEtape;
}

function ouvrirFiche(idProduit) {
  allerA('fiche', idProduit);
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

/** Revenir d'une marche : c'est le geste de la manette « B » et de la touche Échap. */
function reculer() {
  const position = indexEtape.value;
  if (position <= 0) return;
  const precedente = ETAPES[position - 1].id;
  // La fiche n'a de sens qu'avec un catalogue derrière : on ne remonte jamais vers elle.
  etape.value = precedente === 'fiche' ? 'catalogue' : precedente;
}

function allerAuPanier() {
  if (panierVide.value) {
    dernierMessage.value =
      'Le panier est vide : ajoutez d\'abord un objet depuis le catalogue ou une fiche produit.';
    etape.value = 'catalogue';
    return;
  }
  etape.value = 'panier';
}

/** Le focus suit la marche : sans ça, une étape change à l'écran et le focus reste
 *  derrière, dans un bouton qui n'existe plus. */
watch(etape, async () => {
  if (premierRendu.value) return;
  ecrireFragment();
  await nextTick();
  const cible = document.getElementById(
    (ETAPES.find((e) => e.id === etape.value) || ETAPES[0]).titre,
  );
  if (cible && typeof cible.focus === 'function') cible.focus();
});

useActionsManette({
  panier: allerAuPanier,
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
  window.addEventListener('hashchange', appliquerFragment);
  appliquerFragment();
  // ⚠ `premierRendu` est abaissé APRÈS le tour de rendu : sans ça, arriver sur `#panier`
  // par un lien direct déplacerait le focus tout seul au chargement, ce qui désoriente
  // — en lecteur d'écran comme à la manette.
  await nextTick();
  premierRendu.value = false;
  if (window.location.hash === '') ecrireFragment();
});

onUnmounted(() => {
  window.removeEventListener('keydown', surToucheClavier);
  window.removeEventListener('hashchange', appliquerFragment);
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
         titres repartait d'un `h2` orphelin ; et un lien profond (`#commande`) ouvrait
         une page sans titre.

         *Un titre qui n'existe que sur la première marche n'est pas le titre de la page :
         c'est le titre d'une marche.* Le `h1` est donc dans l'en-tête, il ne bouge plus
         d'une étape à l'autre, et chaque étape garde ses `h2`.
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

    <nav class="boreal-barre" aria-label="Étapes de la démonstration">
      <ul class="boreal-barre__liste">
        <li v-for="item in ETAPES" :key="item.id">
          <button
            type="button"
            class="boreal-onglet"
            data-manette
            :aria-current="item.id === etape ? 'page' : undefined"
            @click="item.id === 'panier' ? allerAuPanier() : allerA(item.id)"
          >
            {{ item.libelle }}
            <span v-if="item.id === 'panier' && nombreArticles > 0" class="boreal-onglet__compte">
              {{ nombreArticles }}
              <span class="sr-only">article(s) dans le panier</span>
            </span>
          </button>
        </li>
      </ul>

      <p class="boreal-barre__etat">
        Étape {{ indexEtape + 1 }} sur {{ ETAPES.length }} — {{ libelleEtape }}
      </p>
    </nav>

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
        <dd>Valider l'élément visé, cocher une variante, insérer une lettre au clavier à l'écran.</dd>
        <dt>B</dt>
        <dd>Revenir d'une étape.</dd>
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

    <VitrineModele
      v-if="etape === 'vitrine'"
      @entrer="allerA('catalogue')"
      @voir-catalogue="allerA('catalogue')"
    />

    <GrilleProduits
      v-else-if="etape === 'catalogue'"
      @ouvrir-fiche="ouvrirFiche"
      @ajouter-direct="ajouterDirect"
    />

    <FicheProduit
      v-else-if="etape === 'fiche'"
      :id-produit="idProduitActif"
      @retour="allerA('catalogue')"
      @aller-au-panier="allerAuPanier"
    />

    <PanneauPanier
      v-else-if="etape === 'panier'"
      @retour="allerA('catalogue')"
      @commander="allerA('commande')"
    />

    <TunnelCommande
      v-else-if="etape === 'commande'"
      @retour="allerA('panier')"
      @terminer="allerA('catalogue')"
    />

    <p class="boreal-mention boreal-mention--pied">
      Sous-total du panier : {{ formaterPrix(sousTotal) }} ·
      clé de stockage local : <code>modele-boreal.panier.v1</code> ·
      les visuels de cette page sont des tracés SVG écrits dans le code : aucune image,
      aucune police et aucun script ne sont chargés depuis un autre domaine.
    </p>

    <p class="sr-only" role="status">{{ dernierMessage }}</p>
  </div>
</template>
