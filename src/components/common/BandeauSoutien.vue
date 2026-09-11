<template>
  <!--
    Bandeau de soutien — sobre, daté, réversible.

    POURQUOI CE COMPOSANT EXISTE (11/09/2026, demande de Gaëtan) : un hommage.
    Trois règles ont commandé sa forme, et ce ne sont pas des préférences :

      1. AUCUN ACCENT. Le vert `--accent` est le « point de décision humaine » de
         la charte, sacré et rare. Un hommage n'est pas une décision d'entreprise :
         il ne porte donc pas la couleur qui signale ces décisions. Fonds et textes
         restent dans les neutres de la charte.
      2. AUCUNE ANIMATION. Pas de pulsation, pas de fondu, rien. Sur un hommage,
         le mouvement est indécent — et la règle `prefers-reduced-motion` de la
         maison ne se négocie pas.
      3. DATÉ, PAS PERMANENT. Le bandeau ne s'affiche que le 11 septembre. Un
         hommage oublié en ligne toute l'année ne rend hommage à personne : il
         devient du décor, et le décor sur ce sujet est une faute.

    ⚠️ L'ANNÉE N'EST VOLONTAIREMENT PAS ÉCRITE dans la phrase affichée. Gaëtan a
    cité « 11 septembre 1999 » ; la date universellement connue est 2001. Je n'ai
    pas voulu trancher à sa place un fait que je ne peux pas rattacher à 1999 — ni
    coller un hommage sur la mauvaise date. La formule retenue est donc exacte dans
    les deux cas. FIGER L'ANNÉE EST UN MOT À CHANGER, ligne « texte », ci-dessous.
  -->
  <div v-if="estLeOnzeSeptembre && !estPiloteeParUnRobot" class="bandeau-soutien" role="note" aria-label="Message de soutien">
    <p class="bandeau-soutien__texte">
      En mémoire des victimes du 11 septembre. Soutien aux victimes, aux survivants et à leurs familles.
    </p>
  </div>
</template>

<script setup>
// Le bandeau n'existe que le 11 septembre (mois 8 en base 0). Date locale du
// visiteur : c'est le jour où IL lit la page qui compte, pas celui du serveur —
// le site est statique, il n'a pas d'horloge à lui.
const aujourdHui = new Date();
const estLeOnzeSeptembre = aujourdHui.getMonth() === 8 && aujourdHui.getDate() === 11;

// LE GARDE-FOU CONTRE LE PRÉRENDU — et il est indispensable depuis le 11/09/2026.
//
// L'accueil ET les routes sont prérendus par Chrome (scripts/prerendre.js), qui
// exécute le JavaScript puis photographie le DOM. Un bandeau conditionné à la seule
// date serait donc GRAVÉ dans le HTML statique le 11 septembre — et resterait en ligne
// toute l'année pour tout ce qui n'exécute pas de script : visiteurs sans JavaScript,
// robots d'aperçu de lien, moteurs qui n'exécutent pas. Un hommage oublié n'est plus un
// hommage, c'est du décor — et sur ce sujet, le décor est une faute.
//
// Le prérendu pilote Chrome par le protocole DevTools : `navigator.webdriver` y vaut
// `true`. Un visiteur réel, même dans les outils de développement, l'a à `false`.
// Le bandeau est donc rendu POUR LES VISITEURS, et jamais dans la page écrite sur le
// disque. Rien à nettoyer plus tard, rien qui traîne.
const estPiloteeParUnRobot = typeof navigator !== 'undefined' && navigator.webdriver === true;
</script>

<style>
/* Le bandeau est monté par `v-if` depuis App.vue : quand il n'est pas monté,
   `:has()` ne trouve rien et la navigation reste à `top: 0`. Aucun état à
   propager, donc aucun risque de désynchronisation entre le bandeau et la nav. */
.bandeau-soutien {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;                 /* au-dessus de la nav (100), sous le lien d'évitement (1000) */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.35rem 1rem;
  background: var(--paper-alt);
  border-bottom: 1px solid var(--rule);
}

.bandeau-soutien__texte {
  margin: 0;
  font-size: 0.78rem;
  line-height: 1.3;
  letter-spacing: 0.01em;
  /* `--ink-soft` sur `--paper-alt` = 10,30:1 — très au-dessus du seuil AA.
     Volontairement PAS `--ink` : le texte principal revendiquerait l'attention
     qu'un hommage ne doit pas prendre. */
  color: var(--ink-soft);
  text-align: center;
}

/* La navigation est `fixed` avec `top: 0` : sans ce décalage, le bandeau la
   recouvrirait sur ses 36 premiers pixels. Le `!important` est nécessaire :
   `.navigation[data-v-…]` et cette règle ont la même spécificité, et l'ordre
   d'injection des feuilles n'est pas garanti. */
#app:has(.bandeau-soutien) .navigation {
  top: 2.25rem !important;
}

@media (max-width: 480px) {
  .bandeau-soutien__texte {
    font-size: 0.72rem;
  }
}
</style>
