<template>
  <!--
    COUCHE CONSOLE — D5 « LE POSTE » (site concept flagship)

    Purement décorative (aria-hidden, pointer-events: none) : scanlines de tube,
    vignette, cadres techniques d'angle, bande hachurée d'alerte et lecture
    d'horloge. Zéro WebGL, zéro requête : ce sont des dégradés CSS et une
    horloge — donc aucun coût de rendu et aucun poids réseau.

    MAKOTO : la lecture affiche l'HEURE RÉELLE de la machine du visiteur.
    Aucun « sync ratio » ni pourcentage inventé — une métrique fausse
    présentée comme réelle est interdite, même en décor.
  -->
  <div class="console" aria-hidden="true">
    <div class="console__scanlines"></div>
    <div class="console__vignette"></div>

    <span class="console__bracket console__bracket--tl"></span>
    <span class="console__bracket console__bracket--tr"></span>
    <span class="console__bracket console__bracket--bl"></span>
    <span class="console__bracket console__bracket--br"></span>

    <div class="console__bar">
      <span class="console__tape"></span>
      <span class="console__tag">POSTE 01 · HARPONVILLE · SOMME</span>
      <span class="console__tag console__tag--dim">POSTE DE CONTRÔLE</span>
      <span class="console__clock">{{ heure }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const heure = ref('--:--:--');
let minuteur = null;

const tic = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  heure.value = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

onMounted(() => {
  tic();
  // 1 s : une horloge n'a pas besoin de plus, et un rAF permanent pour un
  // élément décoratif serait du gaspillage de batterie.
  minuteur = setInterval(tic, 1000);
});

onUnmounted(() => {
  if (minuteur) clearInterval(minuteur);
});
</script>

<style scoped>
.console {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

/* ── Scanlines de tube : 3px de période, très faible opacité. Sur un fond
   très sombre c'est ce qui donne la matière « écran » sans baver sur le texte. */
.console__scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 255, 65, 0.030) 0 1px,
    transparent 1px 3px
  );
  mix-blend-mode: screen;
}

/* ── Vignette : concentre le regard au centre du poste. */
.console__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 78% 70% at 50% 45%,
    transparent 42%,
    rgba(0, 0, 0, 0.42) 100%
  );
}

/* ── Cadres techniques d'angle (motif Evangelion / console militaire). */
.console__bracket {
  position: absolute;
  width: 26px;
  height: 26px;
  border: 1px solid var(--neon-cyan);
  opacity: 0.55;
}
.console__bracket--tl { top: 18px; left: 18px; border-right: 0; border-bottom: 0; }
.console__bracket--tr { top: 18px; right: 18px; border-left: 0; border-bottom: 0; }
.console__bracket--bl { bottom: 18px; left: 18px; border-right: 0; border-top: 0; }
.console__bracket--br { bottom: 18px; right: 18px; border-left: 0; border-top: 0; }

/* ── Barre d'état : bande hachurée + étiquettes mono + horloge réelle. */
.console__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  color: var(--neon-cyan);
  background: linear-gradient(to top, rgba(1, 3, 4, 0.72), transparent);
}

.console__tape {
  width: 46px;
  height: 8px;
  flex: none;
  background: var(--hatch-action);
  opacity: 0.85;
}

.console__tag {
  white-space: nowrap;
}
.console__tag--dim {
  color: var(--ink-soft);
  opacity: 0.75;
}

.console__clock {
  margin-left: auto;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

/* ── Mobile : la barre d'état et les cadres saturent un petit écran, et la
   vignette assombrit un contenu déjà dense. Les scanlines restent (elles ne
   coûtent rien et portent la DA). */
@media (max-width: 768px) {
  .console__bar,
  .console__bracket { display: none; }
  .console__vignette { opacity: 0.6; }
}

/* ── Mode sobre / reduced-motion : la couche est conservée mais statique.
   Elle ne bouge déjà pas — on baisse seulement son intensité pour ne pas
   ajouter de bruit visuel à qui demande moins d'effets. */
@media (prefers-reduced-motion: reduce) {
  .console__scanlines { opacity: 0.5; }
  .console__vignette { opacity: 0.7; }
}
</style>
