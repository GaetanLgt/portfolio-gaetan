<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="challenges-hub">
      <!-- HERO -->
      <section class="hero-section">
        <div class="hero-bg">
          <div class="grid-pattern"></div>
          <div class="hero-glow"></div>
        </div>
        <div class="container">
          <n-space vertical align="center" :size="24">
            <n-tag type="success" round size="large">🚀 GL Academy</n-tag>
            <h1>Challenges de développement<br>qui construisent de vraies compétences</h1>
            <p class="hero-subtitle">
              GL Academy propose des challenges professionnels design-to-code qui reflètent le travail réel.<br>
              Rejoignez <strong>{{ totalSubmissions.toLocaleString() }}</strong> développeurs qui construisent des projets portfolio impressionnants.
            </p>
            
            <n-space :size="16">
              <n-button type="primary" size="large" @click="scrollToChallenges">
                🔍 Explorer les challenges
              </n-button>
              <router-link to="/formation">
                <n-button size="large" secondary>📚 Voir les formations</n-button>
              </router-link>
            </n-space>

            <n-space :size="48" class="social-proof" justify="center">
              <div class="proof-item">
                <n-text strong style="font-size: 2rem; color: #06B6D4">{{ challenges.length }}</n-text>
                <n-text depth="3">Challenges</n-text>
              </div>
              <div class="proof-item">
                <n-text strong style="font-size: 2rem; color: #10B981">5</n-text>
                <n-text depth="3">Niveaux</n-text>
              </div>
              <div class="proof-item">
                <n-text strong style="font-size: 2rem; color: #8B5CF6">{{ totalSubmissions.toLocaleString() }}+</n-text>
                <n-text depth="3">Soumissions</n-text>
              </div>
              <div class="proof-item">
                <n-text strong style="font-size: 2rem; color: #F59E0B">Figma</n-text>
                <n-text depth="3">Inclus</n-text>
              </div>
            </n-space>
          </n-space>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="testimonials-section">
        <div class="container">
          <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="testimonial in testimonials" :key="testimonial.name" span="2 m:1">
              <n-card class="testimonial-card">
                <n-space vertical :size="16">
                  <n-text depth="2" style="font-style: italic; line-height: 1.7">"{{ testimonial.text }}"</n-text>
                  <n-space align="center" :size="12">
                    <n-avatar round :style="{ background: testimonial.color }">{{ testimonial.initials }}</n-avatar>
                    <div>
                      <n-text strong>{{ testimonial.name }}</n-text>
                      <n-text depth="3" style="display: block; font-size: 0.85rem">{{ testimonial.role }}</n-text>
                    </div>
                  </n-space>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="how-section">
        <div class="container">
          <n-h2 style="text-align: center; margin-bottom: 2rem">Comment ça marche</n-h2>
          <n-grid :cols="4" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="(step, i) in howItWorks" :key="step.title" span="4 s:2 m:2 l:1">
              <n-card class="step-card">
                <n-space vertical align="center" :size="16">
                  <n-badge :value="i + 1" :color="step.color">
                    <span style="font-size: 2.5rem">{{ step.icon }}</span>
                  </n-badge>
                  <n-h3 style="margin: 0; text-align: center">{{ step.title }}</n-h3>
                  <n-text depth="3" style="text-align: center">{{ step.description }}</n-text>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- LEVELS -->
      <section class="levels-section">
        <div class="container">
          <n-h2 style="text-align: center; margin-bottom: 2rem">5 niveaux de difficulté</n-h2>
          <n-space justify="center" :size="16" wrap>
            <n-tag 
              v-for="level in challengeLevels" 
              :key="level.id"
              :style="{ background: `${level.color}20`, color: level.color, border: `1px solid ${level.color}50`, cursor: 'pointer' }"
              size="large"
              round
              @click="toggleLevel(level.id)"
            >
              {{ level.icon }} {{ level.name }}
            </n-tag>
          </n-space>
        </div>
      </section>

      <!-- CHALLENGES GRID -->
      <section class="challenges-section" ref="challengesRef">
        <div class="container">
          <n-space justify="space-between" align="center" style="margin-bottom: 2rem" wrap>
            <n-h2 style="margin: 0">🎯 Challenges</n-h2>
            <n-space :size="12" wrap>
              <n-select v-model:value="selectedCategory" :options="categoryOptions" placeholder="Catégorie" style="width: 160px" clearable />
              <n-select v-model:value="selectedLevel" :options="levelOptions" placeholder="Niveau" style="width: 160px" clearable />
              <n-switch v-model:value="showPremiumOnly">
                <template #checked>Premium</template>
                <template #unchecked>Tous</template>
              </n-switch>
            </n-space>
          </n-space>

          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="challenge in filteredChallenges" :key="challenge.id" span="3 m:3 l:1">
              <n-card hoverable class="challenge-card" :class="{ 'premium': challenge.premium }">
                <div class="challenge-image" :style="{ background: getLevelColor(challenge.level) + '20' }">
                  <span class="challenge-emoji">{{ getCategoryIcon(challenge.category) }}</span>
                  <n-tag v-if="challenge.premium" class="premium-badge" type="warning" size="small">⭐ Premium</n-tag>
                  <n-tag v-if="challenge.figmaIncluded" class="figma-badge" size="small">Figma</n-tag>
                </div>

                <n-space vertical :size="12">
                  <n-space :size="8">
                    <n-tag :style="{ background: getLevelColor(challenge.level) + '20', color: getLevelColor(challenge.level) }" size="small" round>
                      {{ getLevelIcon(challenge.level) }} {{ getLevelName(challenge.level) }}
                    </n-tag>
                    <n-tag size="small">{{ getCategoryIcon(challenge.category) }} {{ getCategoryName(challenge.category) }}</n-tag>
                  </n-space>

                  <n-h3 style="margin: 0">{{ challenge.title }}</n-h3>
                  <n-text depth="3" style="font-size: 0.9rem">{{ challenge.description }}</n-text>

                  <n-space :size="6">
                    <n-tag v-for="skill in challenge.skills.slice(0, 3)" :key="skill" size="tiny">{{ skill }}</n-tag>
                    <n-tag v-if="challenge.skills.length > 3" size="tiny">+{{ challenge.skills.length - 3 }}</n-tag>
                  </n-space>

                  <n-space justify="space-between" style="margin-top: 8px">
                    <n-text depth="3" style="font-size: 0.85rem">⏱️ {{ challenge.estimatedTime }}</n-text>
                    <n-text depth="3" style="font-size: 0.85rem">👥 {{ challenge.submissions.toLocaleString() }}</n-text>
                  </n-space>
                </n-space>

                <template #action>
                  <n-button type="primary" block @click="openChallenge(challenge)">Commencer</n-button>
                </template>
              </n-card>
            </n-gi>
          </n-grid>

          <n-empty v-if="filteredChallenges.length === 0" description="Aucun challenge correspondant" style="margin-top: 3rem" />
        </div>
      </section>

      <!-- LEARNING PATHS -->
      <section class="paths-section">
        <div class="container">
          <n-h2 style="text-align: center; margin-bottom: 0.5rem">🛤️ Parcours d'apprentissage</n-h2>
          <n-text depth="3" style="display: block; text-align: center; margin-bottom: 2rem">
            Des séquences de challenges pour progresser de façon structurée
          </n-text>

          <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="path in learningPaths" :key="path.id" span="2 l:1">
              <n-card hoverable class="path-card">
                <n-space vertical :size="16">
                  <n-space justify="space-between" align="center">
                    <n-h3 style="margin: 0">{{ path.title }}</n-h3>
                    <n-tag :style="{ background: getLevelColor(path.level) + '20', color: getLevelColor(path.level) }" round>
                      {{ getLevelIcon(path.level) }} {{ getLevelName(path.level) }}
                    </n-tag>
                  </n-space>
                  <n-text depth="3">{{ path.description }}</n-text>
                  <n-space :size="12">
                    <n-text depth="3">📚 {{ path.challenges.length }} challenges</n-text>
                    <n-text depth="3">⏱️ {{ path.duration }}</n-text>
                  </n-space>
                  <n-progress :percentage="0" :show-indicator="false" />
                  <n-button block secondary>Commencer ce parcours</n-button>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- WHY CHOOSE -->
      <section class="why-section">
        <div class="container">
          <n-h2 style="text-align: center; margin-bottom: 2rem">Pourquoi choisir GL Academy</n-h2>
          <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="reason in whyChoose" :key="reason.title" span="2 m:1">
              <n-card class="reason-card">
                <n-space :size="16" align="start">
                  <span style="font-size: 2rem">{{ reason.icon }}</span>
                  <div>
                    <n-h3 style="margin: 0 0 8px">{{ reason.title }}</n-h3>
                    <n-text depth="3">{{ reason.description }}</n-text>
                  </div>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <n-card class="cta-card">
            <n-space vertical align="center" :size="24">
              <n-h2 style="margin: 0">Prêt à construire votre portfolio ?</n-h2>
              <n-text depth="3" style="text-align: center; max-width: 500px">
                Rejoignez des milliers de développeurs qui améliorent leurs compétences avec des projets concrets.
              </n-text>
              <n-space :size="16">
                <n-button type="primary" size="large" @click="scrollToChallenges">🚀 Commencer gratuitement</n-button>
                <router-link to="/formation">
                  <n-button size="large" secondary>📚 Explorer les formations</n-button>
                </router-link>
              </n-space>
            </n-space>
          </n-card>
        </div>
      </section>

      <!-- MODAL -->
      <n-modal v-model:show="showChallengeModal" preset="card" :title="selectedChallenge?.title" style="width: 700px; max-width: 95vw">
        <template v-if="selectedChallenge">
          <n-space vertical :size="24">
            <n-text depth="2" style="line-height: 1.7">{{ selectedChallenge.longDescription }}</n-text>
            
            <div>
              <n-h4>Ce que vous apprendrez</n-h4>
              <n-list>
                <n-list-item v-for="learning in selectedChallenge.learnings" :key="learning">
                  <template #prefix><n-text type="success">✓</n-text></template>
                  {{ learning }}
                </n-list-item>
              </n-list>
            </div>

            <div>
              <n-h4>Technologies</n-h4>
              <n-space :size="8">
                <n-tag v-for="tool in selectedChallenge.tools" :key="tool">{{ tool }}</n-tag>
              </n-space>
            </div>

            <n-divider />

            <n-space justify="space-between" align="center">
              <n-space :size="16">
                <n-text depth="3">⏱️ {{ selectedChallenge.estimatedTime }}</n-text>
                <n-text depth="3">👥 {{ selectedChallenge.submissions.toLocaleString() }} soumissions</n-text>
              </n-space>
              <n-tag v-if="selectedChallenge.premium" type="warning">⭐ Premium</n-tag>
            </n-space>
          </n-space>
        </template>
        <template #action>
          <n-space justify="end">
            <n-button @click="showChallengeModal = false">Fermer</n-button>
            <n-button type="primary">📥 Télécharger le starter</n-button>
          </n-space>
        </template>
      </n-modal>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue';
import { darkTheme } from 'naive-ui';
import { glThemeOverrides } from '@/config/naiveTheme.js';
import { challenges, challengeLevels, challengeCategories, learningPaths } from '@/data/challengesData.js';

const themeOverrides = glThemeOverrides;
const challengesRef = ref(null);
const showChallengeModal = ref(false);
const selectedChallenge = ref(null);

const selectedCategory = ref(null);
const selectedLevel = ref(null);
const showPremiumOnly = ref(false);

const totalSubmissions = computed(() => challenges.reduce((sum, c) => sum + c.submissions, 0));

const filteredChallenges = computed(() => {
  let result = challenges;
  if (selectedCategory.value) result = result.filter(c => c.category === selectedCategory.value);
  if (selectedLevel.value) result = result.filter(c => c.level === selectedLevel.value);
  if (showPremiumOnly.value) result = result.filter(c => c.premium);
  return result;
});

const categoryOptions = computed(() => [
  { label: 'Toutes', value: null },
  ...challengeCategories.map(c => ({ label: `${c.icon} ${c.name}`, value: c.id }))
]);

const levelOptions = computed(() => [
  { label: 'Tous', value: null },
  ...challengeLevels.map(l => ({ label: `${l.icon} ${l.name}`, value: l.id }))
]);

const testimonials = [
  { name: 'Marie L.', initials: 'ML', role: 'Développeuse Front-end', color: '#8B5CF6', text: 'Les challenges GL Academy m\'ont permis de construire un portfolio qui a impressionné les recruteurs. J\'ai décroché mon premier CDI grâce à ces projets !' },
  { name: 'Thomas B.', initials: 'TB', role: 'Reconversion dev', color: '#06B6D4', text: 'Après ma reconversion, ces exercices pratiques m\'ont donné la confiance nécessaire pour postuler. La progression est parfaitement calibrée.' },
];

const howItWorks = [
  { icon: '🎯', title: 'Choisissez un challenge', description: 'Parcourez 15+ challenges professionnels sur 5 niveaux.', color: '#06B6D4' },
  { icon: '💻', title: 'Codez le design', description: 'Téléchargez les assets et le Figma, puis codez.', color: '#8B5CF6' },
  { icon: '📤', title: 'Soumettez', description: 'Partagez votre solution et obtenez du feedback.', color: '#10B981' },
  { icon: '🤝', title: 'Progressez', description: 'Aidez les autres et montez en niveau.', color: '#F59E0B' },
];

const whyChoose = [
  { icon: '🎨', title: 'Designs professionnels', description: 'Chaque challenge utilise des designs créés par des designers pro, comme dans le monde réel.' },
  { icon: '📚', title: 'Progression structurée', description: '5 niveaux de difficulté pour progresser de débutant à expert avec des parcours guidés.' },
  { icon: '💼', title: 'Portfolio qui impressionne', description: 'Construisez des projets concrets qui démontrent vos compétences aux recruteurs.' },
  { icon: '🤖', title: 'Prêt pour l\'IA', description: 'Apprenez à travailler efficacement avec les outils IA tout en gardant vos compétences de base.' },
];

function getLevelColor(id) { return challengeLevels.find(l => l.id === id)?.color || '#06B6D4'; }
function getLevelName(id) { return challengeLevels.find(l => l.id === id)?.name || ''; }
function getLevelIcon(id) { return challengeLevels.find(l => l.id === id)?.icon || '📊'; }
function getCategoryName(id) { return challengeCategories.find(c => c.id === id)?.name || ''; }
function getCategoryIcon(id) { return challengeCategories.find(c => c.id === id)?.icon || '📚'; }

function toggleLevel(id) { selectedLevel.value = selectedLevel.value === id ? null : id; }
function scrollToChallenges() { challengesRef.value?.scrollIntoView({ behavior: 'smooth' }); }
function openChallenge(challenge) { selectedChallenge.value = challenge; showChallengeModal.value = true; }
</script>

<style scoped>
.challenges-hub { min-height: 100vh; background: #0a0a0a; }

/* HERO */
.hero-section { position: relative; padding: 8rem 0 5rem; text-align: center; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; }
.grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 50px 50px; }
.hero-glow { position: absolute; top: -50%; left: 50%; transform: translateX(-50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%); }
.hero-section .container { position: relative; z-index: 1; }
.hero-section h1 { font-size: 2.75rem; font-weight: 800; background: linear-gradient(135deg, #f5f5f5, #a3a3a3); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; line-height: 1.2; }
.hero-subtitle { font-size: 1.15rem; color: #a3a3a3; line-height: 1.8; margin: 0; }
.hero-subtitle strong { color: #10B981; }
.social-proof { margin-top: 2rem; }
.proof-item { text-align: center; }

/* SECTIONS */
.container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
section { padding: 5rem 0; }
section:nth-child(even) { background: rgba(0,0,0,0.3); }

/* TESTIMONIALS */
.testimonial-card { border-left: 3px solid #8B5CF6; }

/* STEPS */
.step-card { text-align: center; height: 100%; }

/* CHALLENGES */
.challenge-card { height: 100%; transition: all 0.3s; }
.challenge-card:hover { transform: translateY(-4px); border-color: #06B6D4; }
.challenge-card.premium { border-color: rgba(245,158,11,0.3); }
.challenge-image { height: 120px; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 16px; }
.challenge-emoji { font-size: 3rem; }
.premium-badge { position: absolute; top: 8px; right: 8px; }
.figma-badge { position: absolute; top: 8px; left: 8px; }

/* PATHS */
.path-card { transition: all 0.3s; }
.path-card:hover { transform: translateY(-4px); border-color: #06B6D4; }

/* CTA */
.cta-card { text-align: center; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1)); border-color: rgba(16,185,129,0.3); padding: 3rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-section { padding: 5rem 0 3rem; }
  .hero-section h1 { font-size: 1.75rem; }
  .hero-subtitle { font-size: 1rem; }
  .social-proof { flex-direction: column; gap: 1rem !important; }
}
</style>
