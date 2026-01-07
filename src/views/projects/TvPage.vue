<template>
  <div class="tv-page">
    <!-- HERO -->
    <section class="tv-hero">
      <div class="container">
        <div class="tv-hero__content">
          <div class="status-badge">
            <span class="status-badge__dot"></span>
            <span class="status-badge__text">SIGNAL ACTIF</span>
          </div>
          
          <h1 class="tv-hero__title">
            <span class="text-gradient">MyTV</span> Database
          </h1>
          
          <p class="tv-hero__subtitle">
            Exploration de séries TV via l'API TVMaze. 
            Un side-project démontrant l'intégration d'APIs externes.
          </p>
          
          <!-- Search Bar -->
          <div class="tv-search">
            <div class="tv-search__input-wrapper">
              <svg class="tv-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <input 
                v-model="searchQuery"
                @keyup.enter="searchShows"
                type="text" 
                class="tv-search__input"
                placeholder="Rechercher une série..."
                aria-label="Rechercher une série"
              />
              <button 
                v-if="searchQuery"
                @click="clearSearch"
                class="tv-search__clear"
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            </div>
            <button 
              @click="searchShows" 
              class="tv-search__btn"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="tv-search__loader"></span>
              <span v-else>SCANNER</span>
            </button>
          </div>
          
          <!-- Quick Tags -->
          <div class="tv-tags">
            <span class="tv-tags__label">Suggestions :</span>
            <button 
              v-for="tag in quickTags" 
              :key="tag"
              @click="quickSearch(tag)"
              class="tv-tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- RESULTS -->
    <section v-if="shows.length > 0 || isLoading" class="tv-results">
      <div class="container">
        <!-- Results Header -->
        <div class="tv-results__header">
          <h2 class="tv-results__title">
            <span class="mono-tag">/// RÉSULTATS</span>
            {{ shows.length }} série{{ shows.length > 1 ? 's' : '' }} trouvée{{ shows.length > 1 ? 's' : '' }}
          </h2>
        </div>
        
        <!-- Grid -->
        <div class="tv-grid">
          <article 
            v-for="show in shows" 
            :key="show.id"
            class="tv-card glass"
            @click="openModal(show)"
          >
            <div class="tv-card__poster">
              <img 
                v-if="show.image?.medium" 
                :src="show.image.medium" 
                :alt="show.name"
                loading="lazy"
              />
              <div v-else class="tv-card__no-image">
                <span>📺</span>
              </div>
              <div class="tv-card__overlay">
                <span class="tv-card__view">VOIR DÉTAILS</span>
              </div>
            </div>
            
            <div class="tv-card__content">
              <h3 class="tv-card__title">{{ show.name }}</h3>
              
              <div class="tv-card__meta">
                <span v-if="show.premiered" class="tv-card__year">
                  {{ show.premiered?.split('-')[0] }}
                </span>
                <span v-if="show.rating?.average" class="tv-card__rating">
                  ⭐ {{ show.rating.average }}
                </span>
                <span v-if="show.status" class="tv-card__status" :class="'tv-card__status--' + show.status.toLowerCase()">
                  {{ show.status }}
                </span>
              </div>
              
              <div v-if="show.genres?.length" class="tv-card__genres">
                <span v-for="genre in show.genres.slice(0, 3)" :key="genre" class="tv-card__genre">
                  {{ genre }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
    
    <!-- EMPTY STATE -->
    <section v-else-if="hasSearched && !isLoading" class="tv-empty">
      <div class="container">
        <div class="tv-empty__content glass">
          <span class="tv-empty__icon">📡</span>
          <h3>Aucun signal détecté</h3>
          <p>Aucune série ne correspond à "{{ lastQuery }}"</p>
          <button @click="clearSearch" class="tv-empty__btn">
            Nouvelle recherche
          </button>
        </div>
      </div>
    </section>
    
    <!-- INITIAL STATE -->
    <section v-else class="tv-initial">
      <div class="container">
        <div class="tv-initial__grid">
          <div class="tv-initial__card glass">
            <span class="tv-initial__icon">🔍</span>
            <h3>Recherche instantanée</h3>
            <p>Tapez le nom d'une série et obtenez les résultats en temps réel via l'API TVMaze.</p>
          </div>
          <div class="tv-initial__card glass">
            <span class="tv-initial__icon">📊</span>
            <h3>Données complètes</h3>
            <p>Notes, genres, statut de diffusion, synopsis... Toutes les infos sur vos séries préférées.</p>
          </div>
          <div class="tv-initial__card glass">
            <span class="tv-initial__icon">⚡</span>
            <h3>Performance</h3>
            <p>Intégration légère sans dépendances lourdes. Lazy loading des images.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="selectedShow" 
          class="tv-modal"
          @click.self="closeModal"
        >
          <div class="tv-modal__content glass">
            <button @click="closeModal" class="tv-modal__close">✕</button>
            
            <div class="tv-modal__grid">
              <!-- Poster -->
              <div class="tv-modal__poster">
                <img 
                  v-if="selectedShow.image?.original || selectedShow.image?.medium" 
                  :src="selectedShow.image?.original || selectedShow.image?.medium" 
                  :alt="selectedShow.name"
                />
                <div v-else class="tv-modal__no-image">📺</div>
              </div>
              
              <!-- Info -->
              <div class="tv-modal__info">
                <h2 class="tv-modal__title">{{ selectedShow.name }}</h2>
                
                <div class="tv-modal__meta">
                  <span v-if="selectedShow.premiered" class="tv-modal__badge">
                    📅 {{ selectedShow.premiered }}
                  </span>
                  <span v-if="selectedShow.rating?.average" class="tv-modal__badge tv-modal__badge--rating">
                    ⭐ {{ selectedShow.rating.average }}/10
                  </span>
                  <span v-if="selectedShow.runtime" class="tv-modal__badge">
                    ⏱️ {{ selectedShow.runtime }} min
                  </span>
                  <span v-if="selectedShow.language" class="tv-modal__badge">
                    🌐 {{ selectedShow.language }}
                  </span>
                </div>
                
                <div v-if="selectedShow.genres?.length" class="tv-modal__genres">
                  <span v-for="genre in selectedShow.genres" :key="genre" class="tv-modal__genre">
                    {{ genre }}
                  </span>
                </div>
                
                <div v-if="selectedShow.summary" class="tv-modal__summary" v-html="selectedShow.summary"></div>
                
                <div class="tv-modal__details">
                  <div v-if="selectedShow.network?.name" class="tv-modal__detail">
                    <span class="tv-modal__label">Diffuseur</span>
                    <span class="tv-modal__value">{{ selectedShow.network.name }}</span>
                  </div>
                  <div v-if="selectedShow.status" class="tv-modal__detail">
                    <span class="tv-modal__label">Statut</span>
                    <span class="tv-modal__value" :class="'status--' + selectedShow.status.toLowerCase()">
                      {{ selectedShow.status }}
                    </span>
                  </div>
                  <div v-if="selectedShow.officialSite" class="tv-modal__detail">
                    <span class="tv-modal__label">Site officiel</span>
                    <a :href="selectedShow.officialSite" target="_blank" rel="noopener" class="tv-modal__link">
                      Visiter →
                    </a>
                  </div>
                </div>
                
                <a 
                  v-if="selectedShow.url"
                  :href="selectedShow.url" 
                  target="_blank" 
                  rel="noopener"
                  class="tv-modal__cta"
                >
                  VOIR SUR TVMAZE →
                </a>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State
const searchQuery = ref('');
const shows = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);
const lastQuery = ref('');
const selectedShow = ref(null);

// Quick search tags
const quickTags = ['Breaking Bad', 'Stranger Things', 'The Office', 'Game of Thrones', 'Dark'];

// Search shows via TVMaze API
async function searchShows() {
  if (!searchQuery.value.trim()) return;
  
  isLoading.value = true;
  hasSearched.value = true;
  lastQuery.value = searchQuery.value;
  
  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery.value)}`
    );
    const data = await response.json();
    shows.value = data.map(item => item.show);
  } catch (error) {
    console.error('[MyTV] API Error:', error);
    shows.value = [];
  } finally {
    isLoading.value = false;
  }
}

// Quick search with tag
function quickSearch(tag) {
  searchQuery.value = tag;
  searchShows();
}

// Clear search
function clearSearch() {
  searchQuery.value = '';
  shows.value = [];
  hasSearched.value = false;
  lastQuery.value = '';
}

// Modal
function openModal(show) {
  selectedShow.value = show;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  selectedShow.value = null;
  document.body.style.overflow = '';
}
</script>

<style scoped>
.tv-page {
  min-height: 100vh;
  padding-top: 80px;
}

/* HERO */
.tv-hero {
  padding: var(--space-xl) 0;
}

.tv-hero__content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

.tv-hero__title {
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.tv-hero__subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
  line-height: 1.7;
}

/* SEARCH */
.tv-search {
  display: flex;
  gap: 0.5rem;
  margin-bottom: var(--space-md);
}

.tv-search__input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.tv-search__icon {
  position: absolute;
  left: 1rem;
  color: var(--text-dark);
  pointer-events: none;
}

.tv-search__input {
  width: 100%;
  padding: 1rem 3rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text-main);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.tv-search__input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.tv-search__input::placeholder {
  color: var(--text-dark);
}

.tv-search__clear {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-dark);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.tv-search__clear:hover {
  color: var(--text-main);
}

.tv-search__btn {
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 120px;
}

.tv-search__btn:hover:not(:disabled) {
  background: #059669;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.tv-search__btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.tv-search__loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--bg);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* TAGS */
.tv-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.tv-tags__label {
  font-size: 0.75rem;
  color: var(--text-dark);
}

.tv-tag {
  padding: 0.35rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 2rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tv-tag:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* RESULTS */
.tv-results {
  padding: var(--space-lg) 0 var(--space-xl);
}

.tv-results__header {
  margin-bottom: var(--space-md);
}

.tv-results__title {
  font-size: 1.25rem;
}

.tv-results__title .mono-tag {
  display: block;
  font-size: 0.7rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

/* GRID */
.tv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

/* CARD */
.tv-card {
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border);
}

.tv-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.15);
  border-color: var(--primary);
}

.tv-card__poster {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: var(--surface);
}

.tv-card__poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tv-card:hover .tv-card__poster img {
  transform: scale(1.05);
}

.tv-card__no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: var(--surface);
}

.tv-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tv-card:hover .tv-card__overlay {
  opacity: 1;
}

.tv-card__view {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 4px;
}

.tv-card__content {
  padding: 1rem;
}

.tv-card__title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tv-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
}

.tv-card__year {
  color: var(--text-muted);
}

.tv-card__rating {
  color: #FBBF24;
}

.tv-card__status {
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.55rem;
  text-transform: uppercase;
}

.tv-card__status--running {
  background: rgba(16, 185, 129, 0.2);
  color: var(--primary);
}

.tv-card__status--ended {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
}

.tv-card__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tv-card__genre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
  padding: 0.15rem 0.35rem;
  background: var(--surface);
  border-radius: 3px;
}

/* EMPTY STATE */
.tv-empty {
  padding: var(--space-xl) 0;
}

.tv-empty__content {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: var(--space-xl);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.tv-empty__icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-sm);
}

.tv-empty__content h3 {
  margin-bottom: 0.5rem;
}

.tv-empty__content p {
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.tv-empty__btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: var(--bg);
  border: none;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  cursor: pointer;
}

/* INITIAL STATE */
.tv-initial {
  padding: var(--space-lg) 0 var(--space-xl);
}

.tv-initial__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.tv-initial__card {
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: center;
}

.tv-initial__icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--space-sm);
}

.tv-initial__card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.tv-initial__card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* MODAL */
.tv-modal {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.tv-modal__content {
  position: relative;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: var(--bg);
}

.tv-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.tv-modal__close:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.tv-modal__grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--space-lg);
}

.tv-modal__poster {
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--surface);
}

.tv-modal__poster img {
  width: 100%;
  height: auto;
  display: block;
}

.tv-modal__no-image {
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.tv-modal__title {
  font-size: 1.75rem;
  margin-bottom: var(--space-sm);
}

.tv-modal__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--space-sm);
}

.tv-modal__badge {
  padding: 0.35rem 0.75rem;
  background: var(--surface);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.tv-modal__badge--rating {
  background: rgba(251, 191, 36, 0.2);
  color: #FBBF24;
}

.tv-modal__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--space-md);
}

.tv-modal__genre {
  padding: 0.25rem 0.6rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
}

.tv-modal__summary {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.tv-modal__summary :deep(p) {
  margin: 0;
}

.tv-modal__details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background: var(--surface);
  border-radius: 0.5rem;
}

.tv-modal__detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tv-modal__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
  text-transform: uppercase;
}

.tv-modal__value {
  font-size: 0.85rem;
  color: var(--text-main);
}

.tv-modal__value.status--running {
  color: var(--primary);
}

.tv-modal__value.status--ended {
  color: #EF4444;
}

.tv-modal__link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.85rem;
}

.tv-modal__link:hover {
  text-decoration: underline;
}

.tv-modal__cta {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: var(--bg);
  text-decoration: none;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s;
}

.tv-modal__cta:hover {
  background: #059669;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .tv-modal__content,
.modal-leave-active .tv-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .tv-modal__content,
.modal-leave-to .tv-modal__content {
  transform: scale(0.95) translateY(20px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .tv-search {
    flex-direction: column;
  }
  
  .tv-search__btn {
    width: 100%;
  }
  
  .tv-initial__grid {
    grid-template-columns: 1fr;
  }
  
  .tv-modal__grid {
    grid-template-columns: 1fr;
  }
  
  .tv-modal__poster {
    max-width: 200px;
    margin: 0 auto;
  }
  
  .tv-modal__details {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .tv-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-sm);
  }
  
  .tv-card__content {
    padding: 0.75rem;
  }
  
  .tv-card__title {
    font-size: 0.8rem;
  }
}
</style>
