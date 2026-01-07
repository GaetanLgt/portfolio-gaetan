/**
 * useTechFeed - Composable pour le Neural Feed
 * Gère la logique métier du feed de veille tech
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { signals as defaultSignals } from '../data/techfeed/signals.js';
import { categories as defaultCategories } from '../data/techfeed/categories.js';
import { quotes as defaultQuotes } from '../data/techfeed/quotes.js';

export function useTechFeed(options = {}) {
  const {
    signals = defaultSignals,
    categories = defaultCategories,
    quotes = defaultQuotes
  } = options;

  // State
  const activeTab = ref('all');
  const currentTime = ref('');
  const typingText = ref('');
  const currentQuoteIndex = ref(0);
  const feedItems = ref([...signals]);

  // Typing animation
  const fullTypingText = 'Veille Tech & IA • Neo\'s Radar • GL Digital Lab';
  let typingInterval = null;

  // Clock
  let clockInterval = null;

  // Computed
  const tabs = computed(() => categories);

  const filteredItems = computed(() => {
    if (activeTab.value === 'all') return feedItems.value;
    return feedItems.value.filter(item => item.categoryId === activeTab.value);
  });

  const featuredItem = computed(() => {
    return filteredItems.value.find(item => item.type === 'featured');
  });

  const regularItems = computed(() => {
    const featured = featuredItem.value;
    if (!featured) return filteredItems.value;
    return filteredItems.value.filter(item => item.id !== featured.id);
  });

  const currentQuote = computed(() => quotes[currentQuoteIndex.value]);

  const stats = computed(() => ({
    signals: feedItems.value.length,
    categories: categories.length,
    quotes: quotes.length
  }));

  // Methods
  function getCountByCategory(catId) {
    if (catId === 'all') return feedItems.value.length;
    return feedItems.value.filter(item => item.categoryId === catId).length;
  }

  function setActiveTab(tabId) {
    activeTab.value = tabId;
  }

  function nextQuote() {
    currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;
  }

  function randomQuote() {
    currentQuoteIndex.value = Math.floor(Math.random() * quotes.length);
  }

  function openItem(item) {
    if (item.url && item.url !== '#') {
      window.open(item.url, '_blank');
    }
  }

  function startTyping() {
    let i = 0;
    typingInterval = setInterval(() => {
      if (i <= fullTypingText.length) {
        typingText.value = fullTypingText.slice(0, i);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
  }

  function updateClock() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  function init() {
    randomQuote();
    startTyping();
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  function cleanup() {
    if (typingInterval) clearInterval(typingInterval);
    if (clockInterval) clearInterval(clockInterval);
  }

  // Lifecycle
  onMounted(init);
  onUnmounted(cleanup);

  return {
    // State
    activeTab,
    currentTime,
    typingText,
    currentQuoteIndex,
    feedItems,
    
    // Computed
    tabs,
    filteredItems,
    featuredItem,
    regularItems,
    currentQuote,
    stats,
    
    // Methods
    getCountByCategory,
    setActiveTab,
    nextQuote,
    randomQuote,
    openItem,
    
    // Raw data access
    allSignals: signals,
    allCategories: categories,
    allQuotes: quotes
  };
}

export default useTechFeed;
