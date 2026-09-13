<template>
  <!-- ══════════════════════════════════════════════════════════════════════════
       LE TUYAU VERT — transposition directe du geste le plus fort de la vidéo de Goyo :
       « un jeu qui te montre des choses dès le début qui semblent suspectes au premier
       coup d'œil, où tu peux rien faire… et tu y reviens quelques heures après. »

       ICI, c'est un petit compartiment scellé, visible dès la première seconde, sur lequel
       RIEN ne se passe. Il s'ouvre quand le visiteur a trouvé quatre compartiments.

       ⚠️ LA CONTRAINTE D'ACCESSIBILITÉ, ET ELLE EST NON NÉGOCIABLE.
       Avant l'ouverture, cet élément N'EST PAS UN CONTRÔLE : c'est un `<span>` décoratif,
       `aria-hidden`, et `pointer-events: none`. Un bouton qui ne fait rien est un défaut
       d'accessibilité — le visiteur au clavier ou au lecteur d'écran perdrait son temps
       sur un piège. Ce qui ne fonctionne pas ne doit pas s'annoncer comme fonctionnel.
       Après l'ouverture, il DEVIENT un vrai lien, annoncé, focalisable, avec un intitulé
       qui dit où il mène.

       ⚠️ ET C'EST UN RACCOURCI, JAMAIS UNE PORTE. `/soute` est liée en permanence depuis le
       pied de page, sur toutes les pages du site. Le tuyau est une façon AMUSANTE d'y
       arriver. Si ce composant disparaissait, la soute resterait atteignable — c'est le
       test qui dit si l'on a construit un jeu ou un péage.
       ══════════════════════════════════════════════════════════════════════════ -->
  <p class="tuyau">
    <RouterLink
      v-if="tuyauOuvert"
      to="/soute"
      class="tuyau__lien"
    >
      <span class="tuyau__voyant" aria-hidden="true">◆</span>
      <span class="tuyau__texte">
        Le compartiment scellé s'est ouvert —
        <strong>descendre à la soute</strong>
      </span>
    </RouterLink>

    <span v-else class="tuyau__scelle" aria-hidden="true">
      <span class="tuyau__voyant">◇</span>
      <span class="tuyau__texte">Compartiment scellé — soupape inerte</span>
    </span>
  </p>
</template>

<script setup>
/**
 * Seul l'état d'OUVERTURE compte ici. Le verrouillage n'empêche rien : il change
 * l'apparence d'un détail. Voir `composables/useDecouvertes.js` pour la règle complète.
 */
import { RouterLink } from 'vue-router';
import { tuyauOuvert } from '@/composables/useDecouvertes.js';
</script>

<style scoped>
.tuyau {
  /* ⚠️ SORTI DU FLUX, ET C'EST MESURÉ, PAS ESTHÉTIQUE.
     Première version : dans le flux du héros, après le sous-titre. Le DOM disait
     « dans le premier écran » (top 596 pour une fenêtre de 705) — et la capture a dit
     l'inverse : `elementFromPoint` au centre du tuyau renvoyait `cookie-banner`.
     Le bandeau de consentement est `position: fixed` de y=507 à y=681. **Tout élément
     placé dans le flux du héros sous y=507 est recouvert à la première visite** — donc
     le tuyau échouait précisément au moment qui compte, celui où l'objet bizarre doit
     se remarquer.
     On le pose donc en absolu dans le héros (qui est `position: relative`), dans la
     zone libre au-dessus du bandeau, sur la moitié droite occupée par le décor.
     *Le DOM disait visible, l'écran disait caché : c'est l'écran qui avait raison.* */
  position: absolute;
  right: 2.5rem;
  top: 9rem;
  z-index: 3;
  margin: 0;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.06em;
}

/* Sur téléphone il n'y a pas de moitié droite libre : on remet dans le flux, sous le
   sous-titre, en assumant que le bandeau peut le recouvrir jusqu'à ce qu'on y réponde. */
@media (max-width: 900px) {
  .tuyau {
    position: static;
    margin: 1.25rem 0 0;
    display: block;
  }
}

/* ── Scellé — décoratif, inerte, et assumé comme tel ──────────────────────── */
.tuyau__scelle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  color: #8fa39c;
  border: 1px dashed rgba(86, 112, 106, 0.45);
  border-radius: 2px;
  /* Rien ne doit se passer : on ne capte même pas le survol, pour qu'aucun curseur
     ne promette une interaction qui n'existe pas. */
  pointer-events: none;
  user-select: none;
}

/* ── Ouvert — un vrai lien, annoncé comme tel ─────────────────────────────── */
.tuyau__lien {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  color: #10b981;
  text-decoration: none;
  border: 1px solid rgba(16, 185, 129, 0.5);
  border-radius: 2px;
}
.tuyau__lien:hover,
.tuyau__lien:focus-visible {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}
.tuyau__lien:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.tuyau__lien strong {
  font-weight: 600;
}

.tuyau__voyant {
  font-size: 0.6rem;
}

/* ── Mouvement : purement cosmétique, donc retiré si le visiteur le demande ── */
@media (prefers-reduced-motion: no-preference) {
  .tuyau__lien .tuyau__voyant {
    animation: tuyau-pulse 2.4s ease-in-out infinite;
  }
}

@keyframes tuyau-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
</style>
