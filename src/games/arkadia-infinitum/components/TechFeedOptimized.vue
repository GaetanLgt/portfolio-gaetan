<template>
  <Transition name="feed-morph">
    <div v-if="show" class="neural-feed" @click.self="$emit('close')">
      <!-- Atmospheric Background -->
      <FeedAtmosphere />

      <div class="feed-shell">
        <!-- Header -->
        <FeedHeader 
          :current-time="currentTime"
          :typing-text="typingText"
          :signal-count="stats.signals"
          @close="$emit('close')"
        />

        <!-- Category Navigation -->
        <FeedCategories 
          :tabs="tabs"
          :active-tab="activeTab"
          :get-count="getCountByCategory"
          @select="setActiveTab"
        />

        <!-- Content -->
        <main class="content-matrix">
          <!-- Featured Signal -->
          <FeedFeatured 
            v-if="featuredItem" 
            :item="featuredItem"
            @click="openItem(featuredItem)"
          />

          <!-- Signal Grid -->
          <FeedGrid 
            :items="regularItems"
            @click-item="openItem"
          />
        </main>

        <!-- Wisdom Terminal -->
        <FeedWisdom 
          :quote="currentQuote"
          @shuffle="nextQuote"
        />

        <!-- Status Bar -->
        <FeedStatus :stats="stats" />
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useTechFeed } from '../composables/useTechFeed.js';

// Sub-components (inline pour éviter trop de fichiers)
import FeedAtmosphere from './techfeed/FeedAtmosphere.vue';
import FeedHeader from './techfeed/FeedHeader.vue';
import FeedCategories from './techfeed/FeedCategories.vue';
import FeedFeatured from './techfeed/FeedFeatured.vue';
import FeedGrid from './techfeed/FeedGrid.vue';
import FeedWisdom from './techfeed/FeedWisdom.vue';
import FeedStatus from './techfeed/FeedStatus.vue';

defineProps({
  show: Boolean
});

defineEmits(['close']);

// Use composable
const {
  activeTab,
  currentTime,
  typingText,
  tabs,
  featuredItem,
  regularItems,
  currentQuote,
  stats,
  getCountByCategory,
  setActiveTab,
  nextQuote,
  openItem
} = useTechFeed();
</script>

<style scoped>
@import '../styles/variables.css';

.neural-feed {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay, 2000);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--matrix-bg-deep);
  font-family: 'JetBrains Mono', monospace;
  color: var(--matrix-text-primary);
  overflow: hidden;
}

.feed-shell {
  position: relative;
  width: 100%;
  max-width: 1400px;
  max-height: 95vh;
  margin: 1rem;
  background: var(--matrix-bg-surface);
  border: 1px solid var(--matrix-border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 0 1px rgba(0, 255, 136, 0.1),
    0 25px 80px rgba(0, 0, 0, 0.8),
    0 0 100px rgba(0, 255, 136, 0.1);
  z-index: 1;
}

.content-matrix {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 255, 136, 0.3) transparent;
}

.content-matrix::-webkit-scrollbar {
  width: 6px;
}

.content-matrix::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 3px;
}

/* Transitions */
.feed-morph-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.feed-morph-leave-active {
  transition: all 0.35s ease;
}

.feed-morph-enter-from,
.feed-morph-leave-to {
  opacity: 0;
}

.feed-morph-enter-from .feed-shell {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.feed-morph-leave-to .feed-shell {
  transform: scale(0.98);
  opacity: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .content-matrix {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 600px) {
  .feed-shell {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
}
</style>
