<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="formation-path" v-if="path">
      <!-- HERO -->
      <section class="path-hero">
        <div class="hero-bg">
          <div class="grid-pattern"></div>
          <div class="hero-glow" :style="{ background: `radial-gradient(ellipse at center, ${path.color}20 0%, transparent 70%)` }"></div>
        </div>
        <div class="container">
          <router-link to="/formation" class="back-link">
            <n-button quaternary size="small">← Retour au catalogue</n-button>
          </router-link>
          
          <div class="hero-content">
            <div class="hero-main">
              <span class="path-icon-large">{{ path.icon }}</span>
              <n-tag round :style="{ background: `${path.color}20`, borderColor: `${path.color}50`, color: path.color }">
                PARCOURS DE FORMATION
              </n-tag>
              <n-h1 :style="{ color: path.color }">{{ path.title }}</n-h1>
              <n-text depth="3" style="font-size: 1.15rem; display: block; margin-bottom: 24px">
                {{ path.subtitle }}
              </n-text>
              
              <n-space :size="24">
                <n-text>⏱️ {{ path.duration }}</n-text>
                <n-text>{{ getLevelIcon(path.level) }} {{ getLevelName(path.level) }}</n-text>
                <n-text>📚 {{ path.formations.length }} formations</n-text>
              </n-space>
            </div>
            
            <div class="hero-sidebar">
              <n-card class="price-card" :style="{ borderColor: `${path.color}50` }">
                <n-space vertical :size="20">
                  <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1)">
                    <n-text strong :style="{ fontSize: '2.5rem', color: path.color, display: 'block' }">
                      {{ path.totalPrice.toLocaleString() }} €
                    </n-text>
                    <n-tag v-if="path.savings > 0" type="success" size="small" style="margin-top: 8px">
                      🎁 Économisez {{ path.savings }} €
                    </n-tag>
                    <n-text depth="3" style="display: block; margin-top: 4px; font-size: 0.85rem">
                      Éligible CPF & OPCO
                    </n-text>
                  </div>
                  
                  <n-space vertical :size="8">
                    <n-text depth="2">✓ {{ path.formations.length }} formations complètes</n-text>
                    <n-text depth="2">✓ {{ path.duration }} de formation</n-text>
                    <n-text depth="2">✓ Supports de cours inclus</n-text>
                    <n-text depth="2">✓ Certifications incluses</n-text>
                    <n-text depth="2">✓ Accompagnement personnalisé</n-text>
                  </n-space>
                  
                  <n-button type="primary" block size="large" :style="{ background: path.color }" @click="showContactModal = true">
                    🎯 S'inscrire au parcours
                  </n-button>
                  <n-button block secondary @click="showContactModal = true">
                    💬 Poser une question
                  </n-button>
                </n-space>
              </n-card>
            </div>
          </div>
        </div>
      </section>

      <!-- DESCRIPTION -->
      <section class="description-section">
        <div class="container">
          <n-space vertical :size="24" style="max-width: 800px">
            <n-h2>📖 Présentation du parcours</n-h2>
            <div class="description-text" v-html="formatDescription(path.description)"></div>
            <n-card v-if="path.timeline" :style="{ background: `${path.color}15` }">
              <n-space align="center" :size="12">
                <span style="font-size: 1.5rem">📅</span>
                <n-text>{{ path.timeline }}</n-text>
              </n-space>
            </n-card>
          </n-space>
        </div>
      </section>

      <!-- FORMATIONS INCLUSES -->
      <section class="formations-section">
        <div class="container">
          <n-space vertical :size="32">
            <div>
              <n-h2>📚 Formations incluses</n-h2>
              <n-text depth="3">Ce parcours comprend {{ path.formations.length }} formations complémentaires</n-text>
            </div>

            <n-timeline size="large">
              <n-timeline-item v-for="(formationId, index) in path.formations" :key="formationId" :color="path.color">
                <template #icon>
                  <n-avatar round size="small" :style="{ background: path.color, color: 'white', fontWeight: 700 }">
                    {{ index + 1 }}
                  </n-avatar>
                </template>
                
                <n-card hoverable v-if="getFormation(formationId)">
                  <template #header>
                    <n-space justify="space-between" align="center">
                      <n-h3 style="margin: 0">{{ getFormation(formationId).title }}</n-h3>
                      <n-tag :style="{ color: path.color }">{{ getFormation(formationId).duration }}</n-tag>
                    </n-space>
                  </template>
                  
                  <n-space vertical :size="16">
                    <n-text depth="3">{{ getFormation(formationId).subtitle }}</n-text>
                    
                    <div>
                      <n-text depth="3" style="font-size: 0.85rem; display: block; margin-bottom: 8px">
                        Vous apprendrez à :
                      </n-text>
                      <n-space vertical :size="4">
                        <n-text v-for="obj in getFormation(formationId).objectives?.slice(0, 4)" :key="obj" depth="2" style="font-size: 0.9rem">
                          <n-text :style="{ color: path.color }">→</n-text> {{ obj }}
                        </n-text>
                      </n-space>
                    </div>
                    
                    <n-space :size="6">
                      <n-tag v-for="tool in getFormation(formationId).tools?.slice(0, 5)" :key="tool" size="tiny">
                        {{ tool }}
                      </n-tag>
                    </n-space>
                  </n-space>

                  <template #action>
                    <n-space justify="space-between" align="center">
                      <n-text depth="3">{{ getFormation(formationId).price.toLocaleString() }} € seul</n-text>
                      <router-link :to="`/formation/${getFormation(formationId).slug}`">
                        <n-button text :style="{ color: path.color }">Voir le détail →</n-button>
                      </router-link>
                    </n-space>
                  </template>
                </n-card>
              </n-timeline-item>
            </n-timeline>
          </n-space>
        </div>
      </section>

      <!-- COMPÉTENCES -->
      <section class="skills-section">
        <div class="container">
          <n-space vertical :size="24">
            <div>
              <n-h2>🛠️ Compétences acquises</n-h2>
              <n-text depth="3">À l'issue de ce parcours, vous maîtriserez :</n-text>
            </div>
            <n-grid :cols="4" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
              <n-gi v-for="skill in path.skills" :key="skill" span="4 s:2 m:2 l:1">
                <n-card size="small">
                  <n-space align="center" :size="8">
                    <n-text type="success">✓</n-text>
                    <n-text>{{ skill }}</n-text>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>
          </n-space>
        </div>
      </section>

      <!-- DÉBOUCHÉS -->
      <section class="outcomes-section">
        <div class="container">
          <n-space vertical :size="24">
            <div>
              <n-h2>🎯 Débouchés professionnels</n-h2>
              <n-text depth="3">Ce parcours vous prépare aux métiers suivants :</n-text>
            </div>
            <n-grid :cols="3" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
              <n-gi v-for="outcome in path.outcomes" :key="outcome" span="3 m:1">
                <n-card>
                  <n-space align="center" :size="12">
                    <span style="font-size: 1.5rem">💼</span>
                    <n-text strong>{{ outcome }}</n-text>
                  </n-space>
                </n-card>
              </n-gi>
            </n-grid>
          </n-space>
        </div>
      </section>

      <!-- FORMATEUR -->
      <section class="instructor-section">
        <div class="container" style="max-width: 800px">
          <n-h2>👨‍🏫 Votre formateur</n-h2>
          <n-card>
            <n-space :size="24" align="start">
              <div class="avatar-placeholder">GL</div>
              <n-space vertical :size="8" style="flex: 1">
                <n-h3 style="margin: 0">Gaëtan Langlet</n-h3>
                <n-text :style="{ color: path.color }">Expert Full-Stack, IA & DevOps</n-text>
                <n-text depth="2" style="line-height: 1.7">
                  Développeur depuis 2018, certifié RNCP Niveau 6. Je forme les développeurs 
                  aux technologies modernes avec une approche pragmatique orientée production.
                </n-text>
              </n-space>
            </n-space>
          </n-card>
        </div>
      </section>

      <!-- COMPARAISON PRIX -->
      <section class="pricing-section">
        <div class="container" style="max-width: 900px">
          <n-h2 style="text-align: center">💰 Avantage Parcours</n-h2>
          <n-grid :cols="2" :x-gap="24" responsive="screen" item-responsive>
            <n-gi span="2 m:1">
              <n-card title="Achat séparé" style="opacity: 0.8">
                <n-list>
                  <n-list-item v-for="formationId in path.formations" :key="formationId">
                    <n-space justify="space-between" style="width: 100%">
                      <n-text depth="2">{{ getFormation(formationId)?.title }}</n-text>
                      <n-text>{{ getFormation(formationId)?.price.toLocaleString() }} €</n-text>
                    </n-space>
                  </n-list-item>
                </n-list>
                <n-divider />
                <n-space justify="space-between">
                  <n-text strong>Total</n-text>
                  <n-text strong style="font-size: 1.25rem">{{ separateTotal.toLocaleString() }} €</n-text>
                </n-space>
              </n-card>
            </n-gi>
            
            <n-gi span="2 m:1">
              <n-card :style="{ borderColor: path.color }" class="bundle-card">
                <template #header>
                  <n-space justify="center">
                    <n-tag :style="{ background: path.color }" size="small">RECOMMANDÉ</n-tag>
                  </n-space>
                </template>
                <n-space vertical align="center" :size="16">
                  <n-h3 style="margin: 0">Parcours complet</n-h3>
                  <n-text strong :style="{ fontSize: '2.5rem', color: path.color }">
                    {{ path.totalPrice.toLocaleString() }} €
                  </n-text>
                  <n-tag v-if="path.savings > 0" type="success">Économie : {{ path.savings }} €</n-tag>
                  <n-list size="small">
                    <n-list-item>✓ Toutes les formations incluses</n-list-item>
                    <n-list-item>✓ Progression pédagogique optimisée</n-list-item>
                    <n-list-item>✓ Accompagnement personnalisé</n-list-item>
                    <n-list-item>✓ Support prioritaire</n-list-item>
                  </n-list>
                  <n-button type="primary" size="large" block :style="{ background: path.color }" @click="showContactModal = true">
                    Choisir ce parcours
                  </n-button>
                </n-space>
              </n-card>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <n-card class="cta-card" :style="{ background: `linear-gradient(135deg, ${path.color}15, rgba(139,92,246,0.1))` }">
            <n-space vertical align="center" :size="24">
              <n-h2 style="margin: 0">Prêt à vous lancer ?</n-h2>
              <n-text depth="3" style="text-align: center; max-width: 500px">
                Contactez-moi pour discuter de votre projet de formation et planifier les sessions.
              </n-text>
              <n-space :size="16">
                <n-button type="primary" size="large" :style="{ background: path.color }" @click="showContactModal = true">
                  🎯 S'inscrire au parcours
                </n-button>
                <router-link to="/contact">
                  <n-button size="large" secondary>💬 Discuter du projet</n-button>
                </router-link>
              </n-space>
            </n-space>
          </n-card>
        </div>
      </section>

      <!-- MODAL -->
      <n-modal v-model:show="showContactModal" preset="card" title="🎓 Inscription au parcours" style="width: 450px; max-width: 90vw">
        <n-text depth="3" style="display: block; margin-bottom: 16px">{{ path.title }}</n-text>
        <n-form @submit.prevent="submitInscription">
          <n-form-item label="Nom *">
            <n-input v-model:value="contactForm.name" placeholder="Votre nom" />
          </n-form-item>
          <n-form-item label="Email *">
            <n-input v-model:value="contactForm.email" type="email" placeholder="votre@email.com" />
          </n-form-item>
          <n-form-item label="Téléphone">
            <n-input v-model:value="contactForm.phone" placeholder="06 00 00 00 00" />
          </n-form-item>
          <n-form-item label="Message">
            <n-input v-model:value="contactForm.message" type="textarea" :rows="3" placeholder="Vos questions ou disponibilités..." />
          </n-form-item>
          <n-button type="primary" block attr-type="submit" :style="{ background: path.color }">
            Envoyer ma demande
          </n-button>
        </n-form>
      </n-modal>
    </div>
    
    <div v-else class="not-found">
      <div class="container" style="text-align: center; padding: 100px 20px">
        <n-h1>🔍 Parcours introuvable</n-h1>
        <n-text depth="3" style="display: block; margin: 16px 0">Ce parcours n'existe pas.</n-text>
        <router-link to="/formation">
          <n-button type="primary">Voir les formations</n-button>
        </router-link>
      </div>
    </div>
  </n-config-provider>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { darkTheme } from 'naive-ui';
import { glThemeOverrides } from '@/config/naiveTheme.js';
import { formations, learningPaths, formationLevels } from '@/data/formationsData.js';

const route = useRoute();
const themeOverrides = glThemeOverrides;
const showContactModal = ref(false);
const contactForm = ref({ name: '', email: '', phone: '', message: '' });

const path = computed(() => learningPaths.find(p => p.slug === route.params.slug));

const separateTotal = computed(() => {
  if (!path.value) return 0;
  return path.value.formations.reduce((sum, fId) => {
    const formation = formations.find(f => f.id === fId);
    return sum + (formation?.price || 0);
  }, 0);
});

function getFormation(id) { return formations.find(f => f.id === id); }
function getLevelName(id) { return formationLevels.find(l => l.id === id)?.name || ''; }
function getLevelIcon(id) { return formationLevels.find(l => l.id === id)?.icon || '📊'; }

function formatDescription(text) {
  return text?.split('\n\n').map(p => p.startsWith('**') ? `<p><strong>${p.replace(/\*\*/g, '')}</strong></p>` : `<p>${p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`).join('') || '';
}

function submitInscription() {
  console.log('Inscription:', path.value?.title, contactForm.value);
  showContactModal.value = false;
  contactForm.value = { name: '', email: '', phone: '', message: '' };
  alert('Merci ! Votre demande a été envoyée. Je vous recontacte sous 24h.');
}
</script>

<style scoped>
.formation-path { min-height: 100vh; background: #0a0a0a; }

.path-hero { position: relative; padding: 6rem 0 4rem; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; }
.grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 50px 50px; }
.hero-glow { position: absolute; inset: 0; }
.path-hero .container { position: relative; z-index: 1; }
.back-link { display: inline-block; margin-bottom: 24px; }
.path-icon-large { font-size: 4rem; display: block; margin-bottom: 16px; }
.hero-content { display: grid; grid-template-columns: 1fr 350px; gap: 48px; align-items: start; }
.price-card { position: sticky; top: 100px; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

section { padding: 64px 0; }
section:nth-child(even) { background: rgba(0,0,0,0.3); }

.description-text { line-height: 1.8; color: #a3a3a3; }
.description-text p { margin-bottom: 16px; }
.description-text strong { color: #f5f5f5; }

.avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #06B6D4, #8B5CF6); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; flex-shrink: 0; }

.bundle-card { text-align: center; }

.cta-card { text-align: center; padding: 48px 24px; }

.not-found { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; }
  .hero-sidebar { order: -1; }
  .price-card { position: static; }
}
</style>
