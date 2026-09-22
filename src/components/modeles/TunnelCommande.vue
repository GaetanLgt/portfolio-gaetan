<script setup>
/**
 * TunnelCommande.vue — LE TUNNEL SIMULÉ, EN TROIS ÉTAPES.
 *
 * ⛔ CE QUI EST ÉCRIT DANS L'INTERFACE, ET QUI N'EST PAS UNE PRÉCAUTION JURIDIQUE
 * DÉCORATIVE : **aucun paiement, aucun envoi réseau, aucune donnée transmise.** La
 * validation « commande » ne fait que composer un récapitulatif à l'écran et vider le
 * panier. Il n'y a AUCUN appel réseau dans ce fichier, et il ne doit jamais y en avoir :
 * ce modèle est vendu comme démonstration, et un formulaire de commande qui téléphone
 * quelque part sans le dire serait un piège pour l'acheteur du modèle.
 *
 * QUATRE CHOIX D'ACCESSIBILITÉ, ET ILS SE VOIENT DANS LE CODE :
 *   1. LES ÉTAPES SONT ANNONCÉES : `<ol>` avec `aria-current="step"`, donc on sait où on
 *      est sans le deviner à la couleur ;
 *   2. LES ERREURS SONT DITES, PAS SEULEMENT COLORÉES : résumé en `role="alert"`, message
 *      sous le champ, `aria-invalid`, et RETOUR DU FOCUS sur le premier champ fautif ;
 *   3. LA LIVRAISON EST UN GROUPE DE RADIOS NATIFS — la manette les coche avec A, le
 *      clavier avec les flèches, sans qu'on ait rien à réinventer ;
 *   4. LE RÉCAPITULATIF EST FIGÉ AU MOMENT DE LA VALIDATION. Le panier est vidé ensuite :
 *      un récapitulatif qui relirait le panier afficherait « 0 article » sur une commande
 *      qu'on vient d'accepter. *Un reçu qui se recalcule après coup n'est pas un reçu.*
 */

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { formaterPrix, livraisons } from './donneesProduits.js';
import { fraisLivraison, usePanier } from './usePanier.js';
import { useActionsManette } from './useManette.js';
import { nomDe } from '@/views/modeles/modeles-adresses.js';
import ChampTexteManette from './ChampTexteManette.vue';

/** ⚠ LES DEUX SORTIES DU TUNNEL SONT DES LIENS, PAS DES ÉVÉNEMENTS.
 *  « Retour au panier » et « Revenir à la boutique » sont des ADRESSES : elles doivent
 *  pouvoir être copiées, suivies par un moteur de recherche, et fonctionner même si la
 *  page hôte ne réagit pas. Le routeur ne sert donc ici qu'au seul geste de la manette
 *  (« B », qui remonte dans le parcours). */
const routePanier = nomDe('panier');
const routeCatalogue = nomDe('catalogue');
const router = useRouter();

const { lignesDetaillees, sousTotal, panierVide, nombreArticles, vider, dernierMessage } = usePanier();

const ETAPES = [
  { id: 'coordonnees', libelle: 'Coordonnées', rang: 1 },
  { id: 'livraison', libelle: 'Livraison', rang: 2 },
  { id: 'recapitulatif', libelle: 'Récapitulatif', rang: 3 },
];

const etape = ref('coordonnees');

const formulaire = ref({
  prenom: '',
  nom: '',
  courriel: '',
  adresse: '',
  complement: '',
  codePostal: '',
  ville: '',
  pays: 'France',
});

const erreurs = ref({});
const livraisonChoisie = ref(livraisons[0].id);
/** Le récapitulatif figé, et le numéro de démonstration qui va avec. */
const commandeFigee = ref(null);

const numeroEtape = computed(() => {
  const trouvee = ETAPES.find((e) => e.id === etape.value);
  return trouvee ? trouvee.rang : ETAPES.length;
});

const modeLivraison = computed(
  () => livraisons.find((l) => l.id === livraisonChoisie.value) || livraisons[0],
);

const frais = computed(() => fraisLivraison(livraisonChoisie.value, sousTotal.value));
const total = computed(() => sousTotal.value + frais.value);
const livraisonOfferte = computed(() => frais.value === 0);

/** Le résumé des erreurs, en une phrase qui compte vraiment. */
const resumeErreurs = computed(() => {
  const nombre = Object.keys(erreurs.value).length;
  if (nombre === 0) return '';
  return `Formulaire incomplet : ${nombre} champ${nombre > 1 ? 's' : ''} à corriger.`;
});

/* ────────────────────────────────────────────────────────────────────────────────
   VALIDATION — les règles sont écrites ici, une fois, et elles nomment le champ.
   ──────────────────────────────────────────────────────────────────────────────── */

const MOTIF_COURRIEL = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function validerCoordonnees() {
  const valeurs = formulaire.value;
  const trouvees = {};

  if (valeurs.prenom.trim().length < 2) {
    trouvees.prenom = 'Indiquez un prénom d\'au moins deux caractères.';
  }
  if (valeurs.nom.trim().length < 2) {
    trouvees.nom = 'Indiquez un nom d\'au moins deux caractères.';
  }
  if (!MOTIF_COURRIEL.test(valeurs.courriel.trim())) {
    trouvees.courriel = 'Cette adresse de courriel n\'a pas la forme attendue (exemple@domaine.fr).';
  }
  if (valeurs.adresse.trim().length < 4) {
    trouvees.adresse = 'Indiquez le numéro et le nom de la voie.';
  }
  if (valeurs.ville.trim().length < 2) {
    trouvees.ville = 'Indiquez la ville.';
  }
  // Le code postal n'est contrôlé à cinq chiffres QUE pour la France : imposer un format
  // français à une adresse belge ou canadienne serait une faute, pas une vérification.
  const paysFrance = valeurs.pays.trim().toLowerCase() === 'france';
  if (valeurs.codePostal.trim() === '') {
    trouvees.codePostal = 'Indiquez le code postal.';
  } else if (paysFrance && !/^\d{5}$/.test(valeurs.codePostal.trim())) {
    trouvees.codePostal = 'En France, le code postal compte cinq chiffres.';
  }

  return trouvees;
}

function envoyerCoordonnees() {
  const trouvees = validerCoordonnees();
  erreurs.value = trouvees;
  const cles = Object.keys(trouvees);
  if (cles.length > 0) {
    // On remet le focus sur le premier champ fautif : annoncer « 3 champs à corriger »
    // sans y conduire le visiteur, c'est le laisser chercher.
    const cible = document.querySelector(`[data-champ="${cles[0]}"]`);
    if (cible && typeof cible.focus === 'function') cible.focus();
    return;
  }
  etape.value = 'livraison';
}

function numeroDeDemonstration() {
  const maintenant = new Date();
  const deuxChiffres = (n) => String(n).padStart(2, '0');
  const horodatage = `${maintenant.getFullYear()}${deuxChiffres(maintenant.getMonth() + 1)}${deuxChiffres(maintenant.getDate())}`;
  // Quatre chiffres tirés au hasard : c'est un NUMÉRO DE DÉMONSTRATION, il n'identifie
  // rien et n'est envoyé nulle part.
  const tirage = String(Math.floor(Math.random() * 9000) + 1000);
  return `DEMO-${horodatage}-${tirage}`;
}

function validerCommande() {
  if (panierVide.value) {
    dernierMessage.value = 'Le panier est vide : la commande ne peut pas être validée.';
    return;
  }
  commandeFigee.value = {
    numero: numeroDeDemonstration(),
    lignes: lignesDetaillees.value.map((ligne) => ({
      cle: `${ligne.idProduit}-${ligne.idVariante}`,
      nom: ligne.produit.nom,
      variante: ligne.variante.libelle,
      quantite: ligne.quantite,
      totalLigne: ligne.totalLigne,
    })),
    sousTotal: sousTotal.value,
    livraison: {
      libelle: modeLivraison.value.libelle,
      frais: frais.value,
    },
    total: total.value,
    coordonnees: { ...formulaire.value },
    articles: nombreArticles.value,
    horodatage: new Date().toISOString(),
  };
  // Le panier est vidé COMME IL LE SERAIT sur une vraie commande, et le récapitulatif
  // ci-dessus a été figé AVANT : l'écran de confirmation n'a plus besoin du panier.
  vider();
  etape.value = 'confirmation';
}

function revenirEnArriere() {
  if (etape.value === 'confirmation') {
    // Sortie du tunnel vers la boutique, par le NOM de la route : le tunnel navigue
    // lui-même, il n'a plus besoin que la page lui rende ce service.
    router.push({ name: routeCatalogue });
    return;
  }
  const position = ETAPES.findIndex((e) => e.id === etape.value);
  if (position <= 0) {
    router.push({ name: routePanier });
    return;
  }
  etape.value = ETAPES[position - 1].id;
}

function avancer() {
  if (etape.value === 'coordonnees') {
    envoyerCoordonnees();
    return;
  }
  if (etape.value === 'livraison') {
    etape.value = 'recapitulatif';
  }
}

/** Les gâchettes changent d'étape ; « B » remonte, exactement comme le bouton visible. */
useActionsManette({
  retour: revenirEnArriere,
  etapePrecedente: revenirEnArriere,
  etapeSuivante: avancer,
});
</script>

<template>
  <section class="boreal-section" aria-labelledby="titre-commande">
    <header class="boreal-section__entete">
      <h2 id="titre-commande" class="boreal-titre-2" tabindex="-1">Commande — démonstration</h2>
      <p class="boreal-chapeau">
        Parcours complet, entièrement simulé : <strong>aucun paiement, aucun envoi réseau,
        aucune donnée transmise ni conservée</strong>. Ce que vous saisissez ici reste dans
        l'onglet de votre navigateur.
      </p>
    </header>

    <div v-if="panierVide && etape !== 'confirmation'" class="boreal-vide">
      <p>Le panier est vide : il n'y a rien à commander.</p>
      <RouterLink class="boreal-bouton boreal-bouton--principal" data-manette :to="{ name: routePanier }">
        Revenir au panier
      </RouterLink>
    </div>

    <template v-else>
      <ol v-if="etape !== 'confirmation'" class="boreal-etapes" aria-label="Étapes de la commande">
        <li
          v-for="item in ETAPES"
          :key="item.id"
          class="boreal-etapes__item"
          :class="{ 'boreal-etapes__item--courante': item.id === etape }"
        >
          <button
            v-if="item.rang < numeroEtape"
            type="button"
            class="boreal-etapes__lien"
            data-manette
            :aria-label="`Revenir à l'étape ${item.rang} : ${item.libelle}`"
            @click="etape = item.id"
          >
            <span class="boreal-etapes__rang">{{ item.rang }}</span>
            <span class="boreal-etapes__libelle">{{ item.libelle }}</span>
          </button>
          <span
            v-else
            class="boreal-etapes__fixe"
            :aria-current="item.id === etape ? 'step' : undefined"
          >
            <span class="boreal-etapes__rang">{{ item.rang }}</span>
            <span class="boreal-etapes__libelle">{{ item.libelle }}</span>
          </span>
        </li>
      </ol>

      <!-- ════════ ÉTAPE 1 : COORDONNÉES ════════ -->
      <form
        v-if="etape === 'coordonnees'"
        class="boreal-formulaire"
        novalidate
        @submit.prevent="envoyerCoordonnees"
      >
        <p v-if="resumeErreurs" class="boreal-erreur boreal-erreur--resume" role="alert">
          {{ resumeErreurs }}
        </p>

        <div class="boreal-formulaire__duo">
          <ChampTexteManette
            nom="prenom"
            etiquette="Prénom"
            :modele="formulaire.prenom"
            :obligatoire="true"
            :erreur="erreurs.prenom || ''"
            autocomplete="given-name"
            exemple="Camille"
            @maj="(valeur) => (formulaire.prenom = valeur)"
          />
          <ChampTexteManette
            nom="nom"
            etiquette="Nom"
            :modele="formulaire.nom"
            :obligatoire="true"
            :erreur="erreurs.nom || ''"
            autocomplete="family-name"
            exemple="Dupont"
            @maj="(valeur) => (formulaire.nom = valeur)"
          />
        </div>

        <ChampTexteManette
          nom="courriel"
          etiquette="Courriel"
          type="email"
          :modele="formulaire.courriel"
          :obligatoire="true"
          :erreur="erreurs.courriel || ''"
          autocomplete="email"
          exemple="camille@exemple.fr"
          aide="Sert uniquement à afficher la confirmation de cette démonstration. Rien n'est envoyé."
          @maj="(valeur) => (formulaire.courriel = valeur)"
        />

        <ChampTexteManette
          nom="adresse"
          etiquette="Adresse"
          :modele="formulaire.adresse"
          :obligatoire="true"
          :erreur="erreurs.adresse || ''"
          autocomplete="street-address"
          exemple="12 rue des Embarcadères"
          @maj="(valeur) => (formulaire.adresse = valeur)"
        />

        <ChampTexteManette
          nom="complement"
          etiquette="Complément d'adresse (facultatif)"
          :modele="formulaire.complement"
          autocomplete="address-line2"
          @maj="(valeur) => (formulaire.complement = valeur)"
        />

        <div class="boreal-formulaire__duo">
          <ChampTexteManette
            nom="codePostal"
            etiquette="Code postal"
            :modele="formulaire.codePostal"
            :obligatoire="true"
            :erreur="erreurs.codePostal || ''"
            autocomplete="postal-code"
            exemple="44000"
            @maj="(valeur) => (formulaire.codePostal = valeur)"
          />
          <ChampTexteManette
            nom="ville"
            etiquette="Ville"
            :modele="formulaire.ville"
            :obligatoire="true"
            :erreur="erreurs.ville || ''"
            autocomplete="address-level2"
            exemple="Nantes"
            @maj="(valeur) => (formulaire.ville = valeur)"
          />
        </div>

        <ChampTexteManette
          nom="pays"
          etiquette="Pays"
          :modele="formulaire.pays"
          :obligatoire="true"
          autocomplete="country-name"
          aide="Le code postal n'est contrôlé au format français que si le pays est « France »."
          @maj="(valeur) => (formulaire.pays = valeur)"
        />

        <div class="boreal-formulaire__actions">
          <button type="submit" class="boreal-bouton boreal-bouton--action" data-manette>
            Continuer vers la livraison
          </button>
          <RouterLink class="boreal-bouton boreal-bouton--discret" data-manette :to="{ name: routePanier }">
            Retour au panier
          </RouterLink>
        </div>
      </form>

      <!-- ════════ ÉTAPE 2 : LIVRAISON ════════ -->
      <div v-else-if="etape === 'livraison'" class="boreal-livraison">
        <fieldset class="boreal-choice">
          <legend>Mode de livraison</legend>
          <div class="boreal-choice__options">
            <label
              v-for="mode in livraisons"
              :key="mode.id"
              class="boreal-choice__option"
              :class="{ 'boreal-choice__option--active': mode.id === livraisonChoisie }"
            >
              <input
                type="radio"
                name="mode-livraison"
                :value="mode.id"
                :checked="mode.id === livraisonChoisie"
                @change="livraisonChoisie = mode.id"
              />
              <span class="boreal-choice__libelle">{{ mode.libelle }}</span>
              <span class="boreal-choice__prix">
                {{ fraisLivraison(mode.id, sousTotal) === 0 ? 'offerte' : formaterPrix(mode.prix) }}
              </span>
              <span class="boreal-choice__detail">{{ mode.detail }}</span>
            </label>
          </div>
        </fieldset>

        <p class="boreal-recap__total">
          <span>Articles + livraison</span>
          <strong>{{ formaterPrix(total) }}</strong>
        </p>

        <div class="boreal-formulaire__actions">
          <button type="button" class="boreal-bouton boreal-bouton--action" data-manette @click="etape = 'recapitulatif'">
            Voir le récapitulatif
          </button>
          <button type="button" class="boreal-bouton boreal-bouton--discret" data-manette @click="etape = 'coordonnees'">
            Modifier mes coordonnées
          </button>
        </div>
      </div>

      <!-- ════════ ÉTAPE 3 : RÉCAPITULATIF ════════ -->
      <div v-else-if="etape === 'recapitulatif'" class="boreal-recap">
        <h3 class="boreal-titre-3">Votre commande</h3>

        <ul class="boreal-recap__articles" aria-label="Articles commandés">
          <li v-for="ligne in lignesDetaillees" :key="`${ligne.idProduit}-${ligne.idVariante}`">
            <span class="boreal-recap__article-nom">{{ ligne.produit.nom }}</span>
            <span class="boreal-recap__article-variante">{{ ligne.variante.libelle }}</span>
            <span class="boreal-recap__article-quantite">× {{ ligne.quantite }}</span>
            <span class="boreal-recap__article-total">{{ formaterPrix(ligne.totalLigne) }}</span>
          </li>
        </ul>

        <dl class="boreal-recap__lignes">
          <dt>Sous-total</dt>
          <dd>{{ formaterPrix(sousTotal) }}</dd>
          <dt>Livraison — {{ modeLivraison.libelle }}</dt>
          <dd>{{ livraisonOfferte ? 'offerte' : formaterPrix(frais) }}</dd>
        </dl>

        <p class="boreal-recap__total">
          <span>Total de la démonstration</span>
          <strong>{{ formaterPrix(total) }}</strong>
        </p>

        <h3 class="boreal-titre-3">Livré à</h3>
        <address class="boreal-recap__adresse">
          {{ formulaire.prenom }} {{ formulaire.nom }}<br />
          {{ formulaire.adresse }}<template v-if="formulaire.complement"><br />{{ formulaire.complement }}</template><br />
          {{ formulaire.codePostal }} {{ formulaire.ville }}<br />
          {{ formulaire.pays }}<br />
          {{ formulaire.courriel }}
        </address>

        <p class="boreal-avertissement">
          <strong>Démonstration :</strong> le bouton ci-dessous ne déclenche aucun paiement
          et n'envoie rien. Il compose un numéro de commande fictif, affiche la confirmation
          et vide le panier.
        </p>

        <div class="boreal-formulaire__actions">
          <button type="button" class="boreal-bouton boreal-bouton--action" data-manette @click="validerCommande">
            Valider la commande (démonstration)
          </button>
          <button type="button" class="boreal-bouton boreal-bouton--discret" data-manette @click="etape = 'livraison'">
            Modifier la livraison
          </button>
        </div>
      </div>

      <!-- ════════ ÉTAPE 4 : CONFIRMATION ════════ -->
      <div v-else-if="etape === 'confirmation' && commandeFigee" class="boreal-confirmation" role="status">
        <p class="boreal-etiquette boreal-etiquette--succes">Commande simulée acceptée</p>
        <h3 class="boreal-titre-3">Numéro de démonstration : {{ commandeFigee.numero }}</h3>
        <p>
          Aucun paiement n'a été demandé, aucune donnée n'a quitté votre navigateur. Le
          panier a été vidé, comme il le serait sur une commande réelle.
        </p>

        <ul class="boreal-recap__articles" aria-label="Articles de la commande simulée">
          <li v-for="ligne in commandeFigee.lignes" :key="ligne.cle">
            <span class="boreal-recap__article-nom">{{ ligne.nom }}</span>
            <span class="boreal-recap__article-variante">{{ ligne.variante }}</span>
            <span class="boreal-recap__article-quantite">× {{ ligne.quantite }}</span>
            <span class="boreal-recap__article-total">{{ formaterPrix(ligne.totalLigne) }}</span>
          </li>
        </ul>

        <dl class="boreal-recap__lignes">
          <dt>{{ commandeFigee.articles }} article(s)</dt>
          <dd>{{ formaterPrix(commandeFigee.sousTotal) }}</dd>
          <dt>{{ commandeFigee.livraison.libelle }}</dt>
          <dd>
            {{ commandeFigee.livraison.frais === 0 ? 'offerte' : formaterPrix(commandeFigee.livraison.frais) }}
          </dd>
        </dl>

        <p class="boreal-recap__total">
          <span>Total simulé</span>
          <strong>{{ formaterPrix(commandeFigee.total) }}</strong>
        </p>

        <h3 class="boreal-titre-3">Livraison simulée à</h3>
        <address class="boreal-recap__adresse">
          {{ commandeFigee.coordonnees.prenom }} {{ commandeFigee.coordonnees.nom }}<br />
          {{ commandeFigee.coordonnees.adresse }}<template v-if="commandeFigee.coordonnees.complement"><br />{{ commandeFigee.coordonnees.complement }}</template><br />
          {{ commandeFigee.coordonnees.codePostal }} {{ commandeFigee.coordonnees.ville }}<br />
          {{ commandeFigee.coordonnees.pays }}
        </address>

        <div class="boreal-formulaire__actions">
          <RouterLink class="boreal-bouton boreal-bouton--action" data-manette :to="{ name: routeCatalogue }">
            Revenir à la boutique
          </RouterLink>
        </div>
      </div>

      <p class="boreal-mention" role="status">{{ dernierMessage }}</p>
    </template>
  </section>
</template>
