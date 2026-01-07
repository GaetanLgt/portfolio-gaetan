<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="formation-hub">
      <!-- HERO -->
      <section class="hub-hero">
        <div class="hero-bg">
          <div class="grid-pattern"></div>
          <div class="hero-glow"></div>
        </div>
        <div class="container">
          <n-space vertical align="center" :size="24">
            <n-tag type="primary" round size="large">🎓 GL Academy</n-tag>
            <h1>Formations Développement Web & IA</h1>
            <p class="hero-subtitle">
              Montez en compétences avec un formateur expert terrain.<br>
              Petits groupes, approche pratique, certifications reconnues.
            </p>
            
            <n-space :size="32" justify="center" class="hero-stats">
              <n-statistic label="Formations" :value="formations.length">
                <template #prefix><span class="stat-icon">📚</span></template>
              </n-statistic>
              <n-statistic label="Parcours" :value="learningPaths.length">
                <template #prefix><span class="stat-icon">🎯</span></template>
              </n-statistic>
              <n-statistic label="Heures de contenu" value="150+">
                <template #prefix><span class="stat-icon">⏱️</span></template>
              </n-statistic>
              <n-statistic label="Éligible" value="CPF">
                <template #prefix><span class="stat-icon">✅</span></template>
              </n-statistic>
            </n-space>

            <n-space :size="16">
              <n-button type="primary" size="large" @click="scrollToFormations">
                🔍 Explorer les formations
              </n-button>
              <n-button size="large" secondary @click="scrollToParcours">
                🎯 Voir les parcours
              </n-button>
            </n-space>
          </n-space>
        </div>
      </section>

      <!-- VALUE PROPS -->
      <section class="value-section">
        <div class="container">
          <n-grid :cols="4" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="prop in valueProps" :key="prop.title" span="4 m:2 l:1">
              <n-card hoverable class="value-card">
                <template #header>
                  <span class="value-icon">{{ prop.icon }}</span>
                </template>
                <n-h3>{{ prop.title }}</n-h3>
                <n-text depth="3">{{ prop.description }}</n-text>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- PARCOURS -->
      <section class="parcours-section" ref="parcoursRef">
        <div class="container">
          <n-space vertical :size="32">
            <div class="section-header">
              <n-h2>🎯 Parcours de Formation</n-h2>
              <n-text depth="3">Progressez avec des formations complémentaires et économisez</n-text>
            </div>

            <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
              <n-gi v-for="path in learningPaths" :key="path.id" span="3 m:3 l:1">
                <n-card hoverable class="path-card" :style="{ '--path-color': path.color }">
                  <template #header>
                    <n-space align="center" :size="12">
                      <span class="path-icon">{{ path.icon }}</span>
                      <div>
                        <n-h3 style="margin: 0">{{ path.title }}</n-h3>
                        <n-text depth="3" style="font-size: 0.85rem">{{ path.subtitle }}</n-text>
                      </div>
                    </n-space>
                  </template>
                  
                  <n-space vertical :size="16">
                    <n-space :size="16">
                      <n-tag size="small">⏱️ {{ path.duration }}</n-tag>
                      <n-tag size="small">📚 {{ path.formations.length }} formations</n-tag>
                    </n-space>
                    
                    <n-space vertical :size="4">
                      <n-text depth="3" style="font-size: 0.8rem">Compétences :</n-text>
                      <n-space :size="6">
                        <n-tag v-for="skill in path.skills.slice(0, 4)" :key="skill" size="tiny" round>
                          {{ skill }}
                        </n-tag>
                      </n-space>
                    </n-space>

                    <n-divider />
                    
                    <n-space justify="space-between" align="center">
                      <div>
                        <n-text strong style="font-size: 1.5rem; color: var(--path-color)">
                          {{ path.totalPrice.toLocaleString() }} €
                        </n-text>
                        <n-tag v-if="path.savings > 0" type="success" size="small" style="margin-left: 8px">
                          -{{ path.savings }} €
                        </n-tag>
                      </div>
                      <router-link :to="`/formation/parcours/${path.slug}`">
                        <n-button type="primary" size="small">Découvrir →</n-button>
                      </router-link>
                    </n-space>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>
          </n-space>
        </div>
      </section>

      <!-- CATALOGUE FORMATIONS -->
      <section class="catalogue-section" ref="formationsRef">
        <div class="container">
          <n-space vertical :size="32">
            <div class="section-header">
              <n-h2>📚 Catalogue des Formations</n-h2>
              <n-text depth="3">{{ filteredFormations.length }} formations disponibles</n-text>
            </div>

            <!-- FILTRES -->
            <n-card class="filters-card">
              <n-space :size="16" align="center" wrap>
                <n-select
                  v-model:value="selectedCategory"
                  :options="categoryOptions"
                  placeholder="Catégorie"
                  style="width: 180px"
                  clearable
                />
                <n-select
                  v-model:value="selectedLevel"
                  :options="levelOptions"
                  placeholder="Niveau"
                  style="width: 160px"
                  clearable
                />
                <n-select
                  v-model:value="sortBy"
                  :options="sortOptions"
                  placeholder="Trier par"
                  style="width: 180px"
                />
                <n-button quaternary @click="resetFilters" v-if="selectedCategory || selectedLevel">
                  ✕ Réinitialiser
                </n-button>
              </n-space>
            </n-card>

            <!-- GRID FORMATIONS -->
            <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
              <n-gi v-for="formation in filteredFormations" :key="formation.id" span="3 m:3 l:1">
                <n-card hoverable class="formation-card">
                  <template #header>
                    <n-space justify="space-between" align="center">
                      <n-space :size="8">
                        <n-tag v-if="formation.new" type="success" size="small">🆕 Nouveau</n-tag>
                        <n-tag v-if="formation.featured" type="warning" size="small">⭐ Populaire</n-tag>
                        <n-tag v-if="formation.certification" type="info" size="small">📜 Certifiante</n-tag>
                      </n-space>
                    </n-space>
                  </template>

                  <n-space vertical :size="12">
                    <n-h3 style="margin: 0">{{ formation.title }}</n-h3>
                    <n-text depth="3">{{ formation.subtitle }}</n-text>
                    
                    <n-space :size="12">
                      <n-tag size="small" round>
                        {{ getCategoryIcon(formation.category) }} {{ getCategoryName(formation.category) }}
                      </n-tag>
                      <n-tag size="small" round>
                        {{ getLevelIcon(formation.level) }} {{ getLevelName(formation.level) }}
                      </n-tag>
                    </n-space>

                    <n-space :size="16">
                      <n-text depth="3">⏱️ {{ formation.duration }}</n-text>
                      <n-text depth="3">{{ getFormatIcon(formation.format) }} {{ getFormatName(formation.format) }}</n-text>
                    </n-space>

                    <n-space :size="6" style="margin-top: 8px">
                      <n-tag v-for="tool in formation.tools?.slice(0, 4)" :key="tool" size="tiny">
                        {{ tool }}
                      </n-tag>
                      <n-tag v-if="formation.tools?.length > 4" size="tiny">
                        +{{ formation.tools.length - 4 }}
                      </n-tag>
                    </n-space>
                  </n-space>

                  <template #action>
                    <n-space justify="space-between" align="center" style="width: 100%">
                      <div>
                        <n-text strong style="font-size: 1.25rem; color: #06B6D4">
                          {{ formation.price.toLocaleString() }} €
                        </n-text>
                        <n-text v-if="formation.priceInfo" depth="3" style="font-size: 0.75rem; display: block">
                          {{ formation.priceInfo }}
                        </n-text>
                      </div>
                      <router-link :to="`/formation/${formation.slug}`">
                        <n-button type="primary">Voir le programme</n-button>
                      </router-link>
                    </n-space>
                  </template>
                </n-card>
              </n-gi>
            </n-grid>
          </n-space>
        </div>
      </section>

      <!-- WORKSHOPS -->
      <section class="workshops-section" v-if="workshops.length">
        <div class="container">
          <n-space vertical :size="32">
            <div class="section-header">
              <n-h2>🛠️ Workshops & Ateliers</n-h2>
              <n-text depth="3">Sessions courtes et intensives sur des sujets précis</n-text>
            </div>

            <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
              <n-gi v-for="workshop in workshops" :key="workshop.id" span="3 m:3 l:1">
                <n-card hoverable class="workshop-card">
                  <n-space vertical :size="12">
                    <n-h4 style="margin: 0">{{ workshop.title }}</n-h4>
                    <n-text depth="3">{{ workshop.description }}</n-text>
                    
                    <n-space :size="12">
                      <n-tag type="info" size="small">📅 {{ formatDate(workshop.date) }}</n-tag>
                      <n-tag size="small">⏱️ {{ workshop.duration }}</n-tag>
                      <n-tag type="warning" size="small">{{ workshop.spotsLeft }} places</n-tag>
                    </n-space>

                    <n-divider style="margin: 8px 0" />

                    <n-space justify="space-between" align="center">
                      <n-text strong style="font-size: 1.25rem; color: #06B6D4">
                        {{ workshop.price }} €
                      </n-text>
                      <n-button type="primary" size="small">S'inscrire</n-button>
                    </n-space>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>
          </n-space>
        </div>
      </section>

      <!-- FORMATEUR -->
      <section class="instructor-section">
        <div class="container">
          <n-space vertical :size="32">
            <div class="section-header">
              <n-h2>👨‍🏫 Votre Formateur</n-h2>
            </div>

            <n-card class="instructor-card">
              <n-space :size="32" align="start">
                <div class="instructor-avatar">
                  <div class="avatar-placeholder">GL</div>
                </div>
                <n-space vertical :size="16" style="flex: 1">
                  <div>
                    <n-h3 style="margin: 0">Gaëtan Langlet</n-h3>
                    <n-text type="primary">Expert Full-Stack, IA & DevOps</n-text>
                  </div>
                  <n-text depth="2" style="line-height: 1.7">
                    Développeur depuis 2018, certifié RNCP Niveau 6. Je forme les développeurs 
                    aux technologies modernes avec une approche pragmatique orientée production. 
                    Mes formations mêlent théorie et pratique avec des cas d'usage réels.
                  </n-text>
                  <n-space :size="24">
                    <n-statistic label="Projets livrés" value="50+">
                      <template #prefix>🚀</template>
                    </n-statistic>
                    <n-statistic label="Apprenants formés" value="100+">
                      <template #prefix>👥</template>
                    </n-statistic>
                    <n-statistic label="Note moyenne" value="4.9/5">
                      <template #prefix>⭐</template>
                    </n-statistic>
                  </n-space>
                </n-space>
              </n-space>
            </n-card>
          </n-space>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <n-card class="cta-card">
            <n-space vertical align="center" :size="24">
              <n-h2 style="margin: 0">🏢 Formation sur-mesure pour votre entreprise ?</n-h2>
              <n-text depth="3" style="text-align: center; max-width: 600px">
                Vous avez des besoins spécifiques ? Je conçois des programmes adaptés 
                à votre contexte, votre stack et vos objectifs.
              </n-text>
              <router-link to="/contact">
                <n-button type="primary" size="large">
                  📧 Discutons de votre projet
                </n-button>
              </router-link>
            </n-space>
          </n-card>
        </div>
      </section>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue';
import { darkTheme } from 'naive-ui';
import { glThemeOverrides } from '@/config/naiveTheme.js';
import { formations, learningPaths, workshops, formationCategories, formationLevels } from '@/data/formationsData.js';

const themeOverrides = glThemeOverrides;
const formationsRef = ref(null);
const parcoursRef = ref(null);

// Filtres
const selectedCategory = ref(null);
const selectedLevel = ref(null);
const sortBy = ref('featured');

const categoryOptions = computed(() => [
  { label: 'Toutes les catégories', value: null },
  ...formationCategories.map(c => ({ label: `${c.icon} ${c.name}`, value: c.id }))
]);

const levelOptions = computed(() => [
  { label: 'Tous les niveaux', value: null },
  ...formationLevels.map(l => ({ label: `${l.icon} ${l.name}`, value: l.id }))
]);

const sortOptions = [
  { label: '⭐ Populaires', value: 'featured' },
  { label: '💰 Prix croissant', value: 'price-asc' },
  { label: '💰 Prix décroissant', value: 'price-desc' },
  { label: '⏱️ Durée', value: 'duration' }
];

const filteredFormations = computed(() => {
  let result = [...formations];
  
  if (selectedCategory.value) {
    result = result.filter(f => f.category === selectedCategory.value);
  }
  if (selectedLevel.value) {
    result = result.filter(f => f.level === selectedLevel.value);
  }
  
  switch (sortBy.value) {
    case 'featured':
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'duration':
      result.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
      break;
  }
  
  return result;
});

const valueProps = [
  { icon: '👨‍💻', title: 'Formateur expert', description: 'Développeur en activité avec une expérience terrain réelle sur des projets professionnels.' },
  { icon: '🎯', title: 'Orienté pratique', description: '80% de pratique, 20% de théorie. Vous repartez avec des compétences immédiatement applicables.' },
  { icon: '👥', title: 'Petits groupes', description: '8 personnes maximum pour un accompagnement personnalisé et des échanges riches.' },
  { icon: '📜', title: 'Certifications', description: 'Certifications GL Digital Lab reconnues et formations éligibles CPF/OPCO.' }
];

function getCategoryName(id) { return formationCategories.find(c => c.id === id)?.name || ''; }
function getCategoryIcon(id) { return formationCategories.find(c => c.id === id)?.icon || '📚'; }
function getLevelName(id) { return formationLevels.find(l => l.id === id)?.name || ''; }
function getLevelIcon(id) { return formationLevels.find(l => l.id === id)?.icon || '📊'; }
function getFormatName(format) { return { online: 'En ligne', presential: 'Présentiel', hybrid: 'Hybride' }[format] || ''; }
function getFormatIcon(format) { return { online: '💻', presential: '🏢', hybrid: '🔄' }[format] || '📍'; }

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function resetFilters() {
  selectedCategory.value = null;
  selectedLevel.value = null;
}

function scrollToFormations() {
  formationsRef.value?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToParcours() {
  parcoursRef.value?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<style scoped>
.formation-hub {
  min-height: 100vh;
  background: #0a0a0a;
}

/* HERO */
.hub-hero {
  position: relative;
  padding: 8rem 0 6rem;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
}

.hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);
  pointer-events: none;
}

.hub-hero .container {
  position: relative;
  z-index: 1;
}

.hub-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f5f5f5, #a3a3a3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a3a3a3;
  line-height: 1.8;
  margin: 0;
}

.hero-stats {
  margin-top: 1rem;
}

.stat-icon {
  font-size: 1.25rem;
  margin-right: 4px;
}

/* SECTIONS */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  padding: 5rem 0;
}

section:nth-child(even) {
  background: rgba(0,0,0,0.3);
}

.section-header {
  text-align: center;
  margin-bottom: 1rem;
}

/* VALUE PROPS */
.value-card {
  text-align: center;
  height: 100%;
}

.value-icon {
  font-size: 2.5rem;
}

/* PATH CARDS */
.path-card {
  height: 100%;
  transition: all 0.3s ease;
}

.path-card:hover {
  transform: translateY(-4px);
  border-color: var(--path-color) !important;
}

.path-icon {
  font-size: 2rem;
}

/* FORMATION CARDS */
.formation-card {
  height: 100%;
  transition: all 0.3s ease;
}

.formation-card:hover {
  transform: translateY(-4px);
  border-color: #06B6D4 !important;
}

/* FILTERS */
.filters-card {
  background: rgba(255,255,255,0.02);
}

/* WORKSHOP CARDS */
.workshop-card {
  height: 100%;
}

/* INSTRUCTOR */
.instructor-card {
  max-width: 800px;
  margin: 0 auto;
}

.instructor-avatar {
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06B6D4, #8B5CF6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

/* CTA */
.cta-card {
  text-align: center;
  background: linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1));
  border-color: rgba(6,182,212,0.3);
  padding: 3rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hub-hero {
    padding: 5rem 0 4rem;
  }
  
  .hub-hero h1 {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .instructor-card :deep(.n-space) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
