<template>
  <footer class="footer" role="contentinfo">
    <div class="container">
      <!-- Decorative top line -->
      <div class="footer__deco">
        <div class="footer__deco-line"></div>
        <span class="footer__deco-text">LA MACHINE SERT · L'HUMAIN DÉCIDE</span>
        <div class="footer__deco-line"></div>
      </div>
      
      <div class="footer__grid">
        
        <!-- Brand -->
        <div class="footer__section">
          <div class="footer__brand">
            <div class="footer__logo">
              <div class="logo-icon">GL</div>
              <span class="logo-name">GÉNIE IT TEK FR</span>
            </div>
            <!--
              FORMULATION CORRIGÉE (13/09/2026, décision Gaëtan — option A).

              L'ancienne phrase disait : « Un cercle de six Lois veille sur vos
              outils. Vous restez au centre — l'humain décide. » Trois problèmes,
              et elle s'affichait sur TOUTES les pages :

              1. Elle répétait la bande décorative située vingt pixels plus haut
                 (« LA MACHINE SERT · L'HUMAIN DÉCIDE »). La version courte était
                 la meilleure des deux : on ne garde que celle-là.
              2. « six Lois » est du vocabulaire interne, jamais défini sur le
                 site public. Un dirigeant de PME ne sait pas si c'est un
                 logiciel, une équipe ou une méthode.
              3. Surtout, elle était fausse : « veille sur VOS outils » décrit une
                 surveillance des systèmes du client. Les six agents travaillent
                 dans NOTRE atelier, sur NOS machines, pour produire le travail.
                 Une phrase qui se trompe sur la nature de ce qu'elle décrit,
                 répétée sur chaque page, est exactement ce que la charte
                 interdit.

              Le terme « six Lois » reste en interne, sur décision de Gaëtan. Le
              site public parle au client dans sa langue, et dit une chose
              vérifiable : des agents d'IA tournent ici, en France, sur nos
              propres machines — ce que le poste démontre tous les jours.
            -->
            <p class="footer__tagline">
              Six agents d'IA travaillent dans notre atelier,<br>
              sur nos machines, en France.
            </p>
          </div>
        </div>
        
        <!-- Contact (Opquast N°100, N°102) -->
        <div class="footer__section">
          <h2 class="footer__title">Contact</h2>
          <address class="footer__address">
            <p>Gaëtan LANGLET</p>
            <p>Harponville, Somme (80) — Hauts-de-France</p>
            <p>
              <a :href="LIEN_COURRIEL">{{ COURRIEL }}</a>
            </p>
            <p>
              <a :href="LIEN_TELEPHONE">{{ TELEPHONE_AFFICHE }}</a>
            </p>
          </address>
          <p class="footer__response">SLA réponse : 24h</p>
        </div>
        
        <!-- Navigation Principale — parcours prospect (audit Awwwards D2) -->
        <div class="footer__section">
          <h2 class="footer__title">Navigation</h2>
          <nav class="footer__nav">
            <router-link to="/">Accueil</router-link>
            <router-link to="/services">Offre &amp; audits</router-link>
            <router-link to="/projets">Réalisations</router-link>
            <router-link to="/arkadia">Preuve — ARKADIA France (ARK)</router-link>
            <!-- Dossier professionnel : la porte d'entrée sobre, pour les
                 acheteurs publics et les appels d'offres, qui n'ont pas à
                 traverser le récit du site concept pour trouver les prix. -->
            <router-link to="/dossier">Dossier professionnel (prix, méthode, limites)</router-link>
            <router-link to="/contact">Contact</router-link>
          </nav>
        </div>
        
        <!-- COLONNE « RESSOURCES » RETIRÉE le 13/09/2026 (décision Gaëtan) :
             elle menait vers une page de config de serveur de jeu et une
             bibliothèque de composants, hors offre. Détail au commit. -->
        
        <!-- Legal (Opquast N°45) -->
        <div class="footer__section">
          <h2 class="footer__title">Légal & Site</h2>
          <nav class="footer__nav" aria-label="Navigation légale">
            <router-link to="/sitemap">Plan du site</router-link>
            <!-- LA SOUTE — ajoutée le 13/09/2026 avec la couche d'exploration (cadrage B).
                 ⚠️ CE LIEN EST LA CONDITION DU CADRAGE, pas un détail. Règle posée :
                 une zone doit être atteignable par un lien ORDINAIRE, sinon elle n'existe
                 ni pour un moteur de recherche ni pour un lecteur d'écran. Le « tuyau
                 vert » du hero est une façon amusante d'y arriver — jamais la seule.
                 Le pied de page étant sur toutes les pages, la soute est donc liée
                 partout, discrètement mais réellement. -->
            <router-link to="/soute">La soute (carte complète)</router-link>
            <!-- L'IA DE BORD — ajoutée le 19/09/2026, dans le même esprit que le lien
                 de la soute ci-dessous : une page ne doit jamais dépendre d'un chemin
                 non balisé pour être atteinte. Le pied de page étant sur toutes les
                 pages du site, la pièce qui parle est donc réellement liée partout —
                 condition du référentiel d'accessibilité (axe 0) et du verrou SEO. -->
            <router-link to="/ia-de-bord">L'IA de bord (la pièce qui parle)</router-link>
            <!-- L'ÉTAT DU STUDIO — ajoutée le 19/09/2026, même règle que les deux
                 précédentes : une page doit être atteignable par un lien ordinaire,
                 sinon elle n'existe ni pour un moteur de recherche ni pour un lecteur
                 d'écran. Cette page-là compte double : son objet est précisément de
                 montrer ce qui est vérifiable, et une page de preuve qu'on ne peut pas
                 trouver ne prouve rien à personne. -->
            <router-link to="/etat-du-studio">L'état du studio (le relevé du présent)</router-link>
            <!-- CE QUE NOUS NOUS IMPOSONS — ajoutée le 19/09/2026, même règle que les trois
                 précédentes : une page doit être atteignable par un lien ordinaire, sinon
                 elle n'existe ni pour un moteur de recherche ni pour un lecteur d'écran.
                 Cette page-là en dépend plus encore : son objet est de publier des règles
                 qu'on puisse opposer au studio. **Un engagement qu'on ne peut pas trouver
                 n'oppose rien à personne.** -->
            <router-link to="/ce-que-nous-nous-imposons">Ce que nous nous imposons (nos règles)</router-link>
            <!-- L'ARMATURE — ajoutée le 19/09/2026, même règle que les quatre précédentes :
                 une page doit être atteignable par un lien ordinaire, sinon elle n'existe ni
                 pour un moteur de recherche ni pour un lecteur d'écran. Et elle en dépend
                 plus encore : c'est la seule page du site qui montre un projet du studio
                 AVANT qu'il soit fini — un projet qu'on ne peut pas trouver n'est pas
                 montré, il est caché. -->
            <router-link to="/armure">L'armure (le projet de jeu, en cours)</router-link>
            <!-- ⭐ LE RELAIS DES DIX RÉPONSES — ajouté le 24/09/2026.
                 Ce lien est dans le PIED DE PAGE, donc sur les trente-deux pages du
                 site : c'est le point de maillage le plus fort qui existe ici.
                 ⛔ Le protocole du test éditorial interdit de se contenter d'un lien
                    depuis la page parente — le studio a mesuré que DOUZE pages du site
                    n'ont qu'un seul lien entrant, et que ce sont les moins explorées. -->
            <router-link to="/guides">Les dix réponses (prix, délais, méthode)</router-link>
            <router-link to="/mentions-legales">Mentions légales</router-link>
            <router-link to="/confidentialite">Confidentialité</router-link>
            <router-link to="/cgv">CGV</router-link>
          </nav>
        </div>
        
      </div>

      <!-- PRÉFÉRENCES DU VISITEUR — déplacées ici le 13/09/2026.
           Elles étaient rangées dans le <nav aria-label="Navigation légale">,
           juste après les liens légaux. Ce <nav> contenait donc deux natures de
           contenu : un lecteur d'écran annonçait « navigation légale » et
           tombait sur trois boutons de réglage, un agent IA y voyait des liens
           là où il n'y en avait plus. Et trois réglages affichés au même poids
           que les mentions légales, sur chaque page, c'est trop de place pour
           des fonctions que peu de visiteurs utilisent.
           Elles ont maintenant leur propre groupe, nommé, hors de la
           navigation — la place d'un réglage est à côté d'un réglage. -->
      <div class="footer__preferences">
        <h2 class="footer__preferences-title">Préférences d'affichage</h2>
        <div class="footer__preferences-actions">
          <button 
            type="button" 
            class="footer__cookie-btn" 
            @click="openCookieSettings"
          >
            Gérer les cookies
          </button>
          <!-- DÉCOR DE SCIENCE-FICTION (inversé le 10/09/2026) : le site s'ouvre
               SOBRE. Ce bouton propose le décor à qui le veut. Avant, c'était
               l'inverse : on imposait le spectacle et on offrait le calme. -->
          <button
            type="button"
            class="footer__cookie-btn"
            :aria-pressed="decorActif ? 'true' : 'false'"
            @click="basculerDecor"
          >
            {{ decorActif ? 'Revenir au mode sobre' : 'Activer le décor' }}
          </button>
          <!-- AUDIO DU POSTE : désactivé par défaut. Aucun son ne se déclenche
               tant que le visiteur ne l'a pas demandé. Tout est synthétisé en
               Web Audio : zéro fichier son à télécharger. -->
          <button
            type="button"
            class="footer__cookie-btn"
            :aria-pressed="audioActif ? 'true' : 'false'"
            @click="basculerAudio"
          >
            {{ audioActif ? 'Couper le son' : 'Activer le son' }}
          </button>
        </div>
      </div>
      
      <!-- Bottom -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} Génie IT Tek FR · Tous droits réservés
        </p>
        <!-- Rien n'est affiche tant qu'il n'y a pas de SIRET reel :
             « EN COURS » signale a un prospect qu'aucune facture n'est possible. -->
        <p class="footer__siret" v-if="siret">
          SIRET : {{ siret }}
        </p>
        <div class="footer__social">
          <!-- Les deux adresses de réseaux sociaux vivaient ici en dur ; elles
               viennent désormais du même foyer que le courriel et le téléphone
               (`src/config/contact.js`). Le séparateur est rendu ENTRE les
               liens, pas après le dernier : un `|` orphelin en fin de ligne est
               lu à voix haute par un lecteur d'écran. -->
          <template v-for="(reseau, i) in RESEAUX" :key="reseau.url">
            <span v-if="i > 0" class="footer__separator" aria-hidden="true">|</span>
            <a
              :href="reseau.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="reseau.nom"
            >
              {{ reseau.nom.toUpperCase() }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { decorActif, basculerDecor } from '@/composables/mode-sobre.js';
import { audioActif, basculerAudio } from '@/composables/audio-poste.js';
// Coordonnées publiques : une seule source, `src/config/contact.js`.
// Elles étaient recopiées à la main ici ET dans sept autres fichiers.
import { COURRIEL, TELEPHONE_AFFICHE, LIEN_COURRIEL, LIEN_TELEPHONE, RESEAUX } from '@/config/contact.js';

const currentYear = computed(() => new Date().getFullYear());
const siret = null; // TODO: Remplacer par ton vrai SIRET

// CNIL : Permet de rouvrir le bandeau cookies
function openCookieSettings() {
  // Dispatch un événement global pour rouvrir le CookieBanner
  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
}
</script>

<style scoped>
.footer {
  /* DS clair (D1) : fond papier altéré + filet — le voile noir et l'image
     footer-bg-v2 (thème MND sombre) sont retirés. */
  background-color: var(--surface);
  border-top: 1px solid var(--rule);
  padding: var(--space-lg) 0 var(--space-md);
  /* Espace pour la SelfDiagnosticBar fixe (~2.5rem) */
  padding-bottom: calc(var(--space-md) + 2.5rem);
  position: relative;
  z-index: 10;
}

/* DECO */
.footer__deco {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--space-lg);
}

.footer__deco-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--rule-strong), transparent);
}

.footer__deco-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--ink-soft);
  letter-spacing: 0.2em;
  white-space: nowrap;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(5, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.footer__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* BRAND */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--bg);
}

.logo-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.footer__tagline {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* TITLES */
.footer__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
}

/* ADDRESS */
.footer__address {
  font-style: normal;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.footer__address a {
  color: var(--text-muted);
}

.footer__address a:hover {
  color: var(--primary);
}

.footer__response {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--ink);
  margin-top: var(--space-xs);
}

/* NAV */
.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__nav a {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: var(--transition-base);
  text-decoration: none;
}

.footer__nav a:hover {
  color: var(--primary);
}

/* BOTTOM */
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.footer__siret {
  color: var(--text-dark);
}

.footer__social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer__social a {
  color: var(--text-muted);
  transition: var(--transition-base);
  text-decoration: none;
}

.footer__social a:hover {
  color: var(--primary);
}

.footer__separator {
  color: var(--border);
}

/* Cookie button (CNIL) */
.footer__cookie-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: var(--transition-base);
}

.footer__cookie-btn:hover {
  color: var(--primary);
}

.footer__cookie-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .footer__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .footer__bottom {
    flex-direction: column;
    text-align: center;
  }
}
/* PRÉFÉRENCES DU VISITEUR — groupe propre, hors de la navigation légale.
   Ces trois boutons étaient rangés dans le <nav> des liens légaux. */
.footer__preferences {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--rule);
}

.footer__preferences-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin: 0 0 0.75rem;
}

.footer__preferences-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

</style>
