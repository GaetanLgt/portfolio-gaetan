<template>
  <!--
    DÉMARRAGE DU POSTE — D5 (site concept flagship)

    REFONTE MAKOTO (10/09/2026). La version précédente affichait une séquence
    INVENTÉE : « MOUNTING_VOLUMES », « LOADING_SYMFONY_CONTAINER », des
    horodatages fixes 00:00→00:08 et une barre alimentée par Math.random().
    Une métrique fausse présentée comme réelle est interdite — surtout ici :
    c'est la première chose qu'un client voit d'une agence qui vend la
    vérifiabilité.

    Cette version n'affiche QUE des étapes réellement mesurées :
      · le DOM est monté,
      · document.fonts.ready a résolu (les polices de signature sont là),
      · le runtime Vue est actif,
      · la première peinture a eu lieu (deux frames).
    Chaque ligne porte sa durée réelle en millisecondes. Si une étape dépasse
    son délai, elle est marquée « DÉLAI » — jamais « OK ».

    Contraintes tenues (Opquast / signature qualité) : non bloquant (failsafe
    3 s), sautable au clic et au clavier, aucun mouvement en reduced-motion,
    et surtout BEAUCOUP plus court que l'ancien (≈ 300 ms au lieu de ~2,5 s).
  -->
  <Transition name="loader">
    <div
      v-if="!loaded"
      class="loader"
      role="status"
      aria-live="polite"
      aria-label="Démarrage du poste"
      tabindex="0"
      @click="sauter"
      @keydown.escape="sauter"
      @keydown.enter="sauter"
    >
      <div class="loader__content">
        <div class="loader__head">
          <span class="loader__seal" aria-hidden="true"></span>
          <span class="loader__title">MND CONTROL</span>
          <span class="loader__sub">POSTE 01 · HARPONVILLE · SOMME</span>
        </div>

        <!-- Journal : uniquement des faits mesurés -->
        <div class="loader__terminal">
          <div
            v-for="(etape, i) in etapes"
            :key="i"
            class="loader__log"
            :class="{
              'loader__log--ok': etape.statut === 'ok',
              'loader__log--delai': etape.statut === 'delai',
              'loader__log--actif': etape.statut === 'actif'
            }"
          >
            <span class="loader__log-label">{{ etape.label }}</span>
            <span class="loader__log-ms">{{ etape.ms }} ms</span>
            <span class="loader__log-status">{{ LIBELLE[etape.statut] }}</span>
          </div>
        </div>

        <div class="loader__progress">
          <div class="loader__progress-bar" :style="{ width: pourcent + '%' }"></div>
        </div>

        <div class="loader__foot">
          <span>{{ pourcent }} %</span>
          <span class="loader__skip">CLIQUER POUR PASSER</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['loaded']);

const LIBELLE = { ok: 'OK', delai: 'DÉLAI', actif: '...' };

const loaded = ref(false);
const etapes = ref([]);
const total = 4;
const t0 = performance.now();

const pourcent = computed(() =>
  Math.min(100, Math.round((etapes.value.filter((e) => e.statut !== 'actif').length / total) * 100))
);

let termine = false;
let failsafe = null;

const ajouter = (label, statut) => {
  etapes.value.push({ label, ms: Math.round(performance.now() - t0), statut });
};

const majDerniere = (statut) => {
  const d = etapes.value[etapes.value.length - 1];
  if (d) d.statut = statut;
};

/** Attend une promesse, mais jamais plus que `ms` — renvoie true si tenue. */
const avecDelai = (promesse, ms) =>
  new Promise((res) => {
    let fini = false;
    const minuteur = setTimeout(() => {
      if (!fini) { fini = true; res(false); }
    }, ms);
    Promise.resolve(promesse).then(
      () => { if (!fini) { fini = true; clearTimeout(minuteur); res(true); } },
      () => { if (!fini) { fini = true; clearTimeout(minuteur); res(false); } }
    );
  });

const deuxFrames = () =>
  new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => res())));

const finir = () => {
  if (termine) return;
  termine = true;
  if (failsafe) clearTimeout(failsafe);
  loaded.value = true;
  emit('loaded');
};

const sauter = () => finir();

onMounted(async () => {
  // Failsafe : le poste ne bloque jamais le visiteur, quoi qu'il arrive.
  failsafe = setTimeout(finir, 3000);

  // 1. Le composant est monté → le DOM existe. Fait.
  ajouter('NOYAU_WEB', 'ok');

  // 2. Les polices de signature sont-elles réellement disponibles ?
  ajouter('POLICES_SIGNATURE', 'actif');
  const polices = await avecDelai(document.fonts?.ready, 2000);
  majDerniere(polices ? 'ok' : 'delai');

  // 3. Le runtime réactif est actif (sinon rien ne s'afficherait).
  ajouter('RUNTIME_VUE', 'ok');

  // 4. Première peinture effectuée : deux frames ont été rendues.
  ajouter('PREMIERE_PEINTURE', 'actif');
  await deuxFrames();
  majDerniere('ok');

  // Court temps de pose pour que la séquence soit lisible, puis on libère.
  // Supprimé si le visiteur a demandé moins de mouvement : il veut du contenu,
  // pas une chorégraphie.
  const repos = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 320;
  setTimeout(finir, repos);
});

onUnmounted(() => {
  if (failsafe) clearTimeout(failsafe);
});
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
}

.loader:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: -4px;
}

.loader__content {
  width: 100%;
  max-width: 440px;
  padding: 0 var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── En-tête : le sceau MND (cercle-à-point) + l'identification du poste ── */
.loader__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
}

.loader__seal {
  position: relative;
  width: 18px;
  height: 18px;
  flex: none;
  border: 1px solid var(--accent);
  border-radius: 50%;
  box-shadow: var(--glow-accent);
}
.loader__seal::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  transform: translate(-50%, -50%);
  background: var(--accent);
  border-radius: 50%;
}

.loader__title {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--accent);
}

.loader__sub {
  margin-left: auto;
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
}

/* ── Journal : cadre technique + hachures d'alerte en lisière ── */
.loader__terminal {
  border: 1px solid var(--rule);
  border-left: 3px solid var(--alert);
  background: var(--surface);
  padding: 0.85rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.loader__log {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--ink-soft);
  animation: logAppear 0.25s ease forwards;
}

@keyframes logAppear {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.loader__log-label {
  flex: 1;
  letter-spacing: 0.1em;
}

.loader__log-ms {
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
}

.loader__log-status {
  width: 3.2em;
  text-align: right;
  letter-spacing: 0.1em;
}

.loader__log--ok .loader__log-status { color: var(--accent); }
.loader__log--delai .loader__log-status { color: var(--alert); }
.loader__log--delai .loader__log-label { color: var(--alert); }
.loader__log--actif .loader__log-status { color: var(--neon-cyan); animation: pulse-slow 1s infinite; }

/* ── Barre : progression = étapes réellement terminées, rien d'autre ── */
.loader__progress {
  height: 2px;
  background: var(--surface-light);
  overflow: hidden;
}

.loader__progress-bar {
  height: 100%;
  background: var(--action);
  transition: width 0.2s ease-out;
  box-shadow: var(--glow-action);
}

.loader__foot {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  color: var(--ink-faint);
}

.loader__skip {
  color: var(--neon-cyan);
  opacity: 0.75;
}

.loader-leave-active {
  transition: opacity 0.35s ease;
}
.loader-leave-to {
  opacity: 0;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

/* ── Reduced-motion : séquence affichée sans animation. Le temps de pose est
   également supprimé côté script (voir POSEREDUIT). ── */
@media (prefers-reduced-motion: reduce) {
  .loader__log { animation: none; }
  .loader__log--actif .loader__log-status { animation: none; }
  .loader-leave-active { transition: none; }
}
</style>
