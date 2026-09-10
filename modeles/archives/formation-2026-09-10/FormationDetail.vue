<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="formation-detail" v-if="formation">
      <!-- HERO -->
      <section class="detail-hero">
        <div class="hero-bg"><div class="grid-pattern"></div></div>
        <div class="container">
          <router-link to="/formation" class="back-link">
            <n-button quaternary size="small">← Retour au catalogue</n-button>
          </router-link>
          
          <div class="hero-content">
            <div class="hero-main">
              <n-space :size="8" style="margin-bottom: 16px">
                <n-tag v-if="formation.new" type="success" round>🆕 Nouveau</n-tag>
                <n-tag v-if="formation.certification" type="info" round>📜 Certifiante</n-tag>
                <n-tag round :style="{ background: `${categoryColor}20`, color: categoryColor, border: `1px solid ${categoryColor}50` }">
                  {{ categoryIcon }} {{ categoryName }}
                </n-tag>
              </n-space>
              
              <n-h1>{{ formation.title }}</n-h1>
              <n-text depth="3" style="font-size: 1.15rem; display: block; margin-bottom: 24px">
                {{ formation.subtitle }}
              </n-text>
              
              <n-space :size="24" style="margin-bottom: 24px">
                <n-text>⏱️ {{ formation.duration }}</n-text>
                <n-text>{{ levelIcon }} {{ levelName }}</n-text>
                <n-text>{{ formatIcon }} {{ formatName }}</n-text>
                <n-text>👥 8 max</n-text>
              </n-space>
              
              <n-space :size="8">
                <n-tag v-for="tool in formation.tools" :key="tool" size="small">{{ tool }}</n-tag>
              </n-space>
            </div>
            
            <div class="hero-sidebar">
              <n-card class="price-card">
                <n-space vertical :size="20">
                  <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1)">
                    <n-text strong style="font-size: 2.5rem; color: #06B6D4; display: block">
                      {{ formation.price.toLocaleString() }} €
                    </n-text>
                    <n-text v-if="formation.priceInfo" type="success" style="font-size: 0.9rem">
                      {{ formation.priceInfo }}
                    </n-text>
                  </div>
                  
                  <n-space vertical :size="8">
                    <n-text depth="2">✓ Supports de cours inclus</n-text>
                    <n-text depth="2">✓ Groupe de 8 max</n-text>
                    <n-text depth="2">✓ Exercices pratiques</n-text>
                    <n-text v-if="formation.certification" depth="2">✓ Certification</n-text>
                    <n-text depth="2">✓ Support 30 jours</n-text>
                  </n-space>
                  
                  <n-button type="primary" block size="large" @click="scrollToSessions">
                    🎯 Voir les sessions
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

      <!-- CONTENT -->
      <div class="detail-content">
        <div class="container">
          <main class="main-content">
            <!-- DESCRIPTION -->
            <section class="content-section">
              <n-h2>📝 Description</n-h2>
              <div class="description-text" v-html="formatDescription(formation.description)"></div>
            </section>

            <!-- OBJECTIFS -->
            <section class="content-section">
              <n-h2>🎯 Objectifs pédagogiques</n-h2>
              <n-text depth="3" style="display: block; margin-bottom: 16px">
                À l'issue de cette formation, vous serez capable de :
              </n-text>
              <n-list>
                <n-list-item v-for="(obj, i) in formation.objectives" :key="i">
                  <template #prefix>
                    <n-icon color="#10B981" size="18">
                      <CheckmarkCircle />
                    </n-icon>
                  </template>
                  {{ obj }}
                </n-list-item>
              </n-list>
            </section>

            <!-- PRÉREQUIS -->
            <section class="content-section">
              <n-h2>📋 Prérequis</n-h2>
              <n-list>
                <n-list-item v-for="(prereq, i) in formation.prerequisites" :key="i">
                  <template #prefix>
                    <n-text type="primary">•</n-text>
                  </template>
                  <n-text depth="2">{{ prereq }}</n-text>
                </n-list-item>
              </n-list>
            </section>

            <!-- PROGRAMME -->
            <section class="content-section">
              <n-h2>📚 Programme détaillé</n-h2>
              <n-collapse :default-expanded-names="[0]" accordion>
                <n-collapse-item v-for="(module, i) in formation.program" :key="i" :name="i">
                  <template #header>
                    <n-space align="center" :size="12">
                      <n-tag type="primary" size="small" round>{{ String(i + 1).padStart(2, '0') }}</n-tag>
                      <n-text strong>{{ module.title }}</n-text>
                    </n-space>
                  </template>
                  <template #header-extra>
                    <n-tag size="small">{{ module.duration }}</n-tag>
                  </template>
                  
                  <n-space vertical :size="12">
                    <n-text v-if="module.description" depth="3" style="font-style: italic">
                      {{ module.description }}
                    </n-text>
                    <n-list size="small">
                      <n-list-item v-for="(topic, j) in module.topics" :key="j">
                        <template #prefix>
                          <n-text type="primary">→</n-text>
                        </template>
                        <n-text depth="2">{{ topic }}</n-text>
                      </n-list-item>
                    </n-list>
                  </n-space>
                </n-collapse-item>
              </n-collapse>
              
              <n-card style="margin-top: 16px; background: rgba(6,182,212,0.1)">
                <n-space justify="space-between">
                  <n-text>📊 Durée totale :</n-text>
                  <n-text strong>{{ formation.duration }}</n-text>
                </n-space>
              </n-card>
            </section>

            <!-- FORMATEUR -->
            <section class="content-section">
              <n-h2>👨‍🏫 Votre formateur</n-h2>
              <n-card>
                <n-space :size="24" align="start">
                  <div class="avatar-placeholder">GL</div>
                  <n-space vertical :size="8" style="flex: 1">
                    <n-h3 style="margin: 0">{{ formation.instructor?.name }}</n-h3>
                    <n-text type="primary">{{ formation.instructor?.title }}</n-text>
                    <n-text depth="2" style="line-height: 1.7">{{ formation.instructor?.bio }}</n-text>
                  </n-space>
                </n-space>
              </n-card>
            </section>

            <!-- TÉMOIGNAGES -->
            <section v-if="formation.testimonials?.length" class="content-section">
              <n-h2>💬 Témoignages</n-h2>
              <n-grid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
                <n-gi v-for="(test, i) in formation.testimonials" :key="i" span="2 m:1">
                  <n-card>
                    <n-space vertical :size="12">
                      <n-rate :value="test.rating" readonly size="small" />
                      <n-text depth="2" style="font-style: italic">"{{ test.text }}"</n-text>
                      <n-space :size="8">
                        <n-text strong>{{ test.name }}</n-text>
                        <n-text depth="3">{{ test.company }}</n-text>
                      </n-space>
                    </n-space>
                  </n-card>
                </n-gi>
              </n-grid>
            </section>

            <!-- SESSIONS -->
            <section class="content-section" ref="sessionsRef">
              <n-h2>📅 Prochaines sessions</n-h2>
              <n-space vertical :size="12">
                <n-card v-for="(session, i) in formation.nextSessions" :key="i" size="small">
                  <n-space justify="space-between" align="center">
                    <n-space :size="24" align="center">
                      <div class="session-date">
                        <n-text strong style="font-size: 1.75rem; color: #06B6D4; display: block; line-height: 1">
                          {{ formatSessionDate(session.date).day }}
                        </n-text>
                        <n-text depth="3" style="text-transform: uppercase; font-size: 0.8rem">
                          {{ formatSessionDate(session.date).month }}
                        </n-text>
                      </div>
                      <n-space vertical :size="4">
                        <n-text>📍 {{ session.location }}</n-text>
                        <n-tag :type="session.spots <= 3 ? 'warning' : 'default'" size="small">
                          {{ session.spots }} places
                        </n-tag>
                      </n-space>
                    </n-space>
                    <n-button type="primary" size="small">S'inscrire</n-button>
                  </n-space>
                </n-card>
              </n-space>
              
              <n-card style="margin-top: 24px; text-align: center">
                <n-text depth="3">Aucune date ne convient ?</n-text>
                <n-button secondary style="margin-left: 12px" @click="showContactModal = true">
                  📧 Me contacter
                </n-button>
              </n-card>
            </section>

            <!-- FAQ -->
            <section v-if="formation.faq?.length" class="content-section">
              <n-h2>❓ Questions fréquentes</n-h2>
              <n-collapse>
                <n-collapse-item v-for="(item, i) in formation.faq" :key="i" :name="i" :title="item.question">
                  <n-text depth="2">{{ item.answer }}</n-text>
                </n-collapse-item>
              </n-collapse>
            </section>

            <!-- CERTIFICATION -->
            <section v-if="formation.certification" class="content-section">
              <n-card class="certification-card">
                <n-space :size="24" align="center">
                  <span style="font-size: 3rem">📜</span>
                  <n-space vertical :size="4">
                    <n-h3 style="margin: 0">Certification incluse</n-h3>
                    <n-text type="primary">{{ formation.certificationName }}</n-text>
                    <n-text v-if="formation.certificationDescription" depth="3" style="font-size: 0.9rem">
                      {{ formation.certificationDescription }}
                    </n-text>
                  </n-space>
                </n-space>
              </n-card>
            </section>
          </main>
        </div>
      </div>

      <!-- RELATED -->
      <section v-if="relatedFormations.length" class="related-section">
        <div class="container">
          <n-h2 style="text-align: center">🔗 Formations complémentaires</n-h2>
          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
            <n-gi v-for="rel in relatedFormations" :key="rel.id" span="3 m:3 l:1">
              <router-link :to="`/formation/${rel.slug}`" style="text-decoration: none">
                <n-card hoverable>
                  <n-h4 style="margin: 0 0 8px">{{ rel.title }}</n-h4>
                  <n-text depth="3">{{ rel.subtitle }}</n-text>
                  <n-text type="primary" style="display: block; margin-top: 12px">
                    {{ rel.duration }} • {{ rel.price.toLocaleString() }} €
                  </n-text>
                </n-card>
              </router-link>
            </n-gi>
          </n-grid>
        </div>
      </section>

      <!-- MODAL -->
      <n-modal v-model:show="showContactModal" preset="card" title="💬 Une question ?" style="width: 450px; max-width: 90vw">
        <n-form @submit.prevent="submitQuestion">
          <n-form-item label="Nom">
            <n-input v-model:value="contactForm.name" placeholder="Votre nom" />
          </n-form-item>
          <n-form-item label="Email">
            <n-input v-model:value="contactForm.email" type="email" placeholder="votre@email.com" />
          </n-form-item>
          <n-form-item label="Message">
            <n-input v-model:value="contactForm.message" type="textarea" :rows="4" placeholder="Votre question..." />
          </n-form-item>
          <n-button type="primary" block attr-type="submit">Envoyer</n-button>
        </n-form>
      </n-modal>
    </div>
    
    <div v-else class="not-found">
      <div class="container" style="text-align: center; padding: 100px 20px">
        <n-h1>🔍 Formation introuvable</n-h1>
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
import { darkTheme, NIcon } from 'naive-ui';
import { CheckmarkCircle } from '@vicons/ionicons5';
import { glThemeOverrides } from '@/config/naiveTheme.js';
import { formations, formationCategories, formationLevels } from '@/data/formationsData.js';

const route = useRoute();
const themeOverrides = glThemeOverrides;
const sessionsRef = ref(null);
const showContactModal = ref(false);
const contactForm = ref({ name: '', email: '', message: '' });

const formation = computed(() => formations.find(f => f.slug === route.params.slug));
const categoryName = computed(() => formationCategories.find(c => c.id === formation.value?.category)?.name || '');
const categoryIcon = computed(() => formationCategories.find(c => c.id === formation.value?.category)?.icon || '📚');
const categoryColor = computed(() => formationCategories.find(c => c.id === formation.value?.category)?.color || '#3B82F6');
const levelName = computed(() => formationLevels.find(l => l.id === formation.value?.level)?.name || '');
const levelIcon = computed(() => formationLevels.find(l => l.id === formation.value?.level)?.icon || '📊');
const formatName = computed(() => ({ online: 'En ligne', presential: 'Présentiel', hybrid: 'Hybride' }[formation.value?.format] || ''));
const formatIcon = computed(() => ({ online: '💻', presential: '🏢', hybrid: '🔄' }[formation.value?.format] || '📍'));
const relatedFormations = computed(() => formation.value ? formations.filter(f => f.category === formation.value.category && f.id !== formation.value.id).slice(0, 3) : []);

function formatSessionDate(d) { const date = new Date(d); return { day: date.getDate(), month: ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'][date.getMonth()] }; }
function scrollToSessions() { sessionsRef.value?.scrollIntoView({ behavior: 'smooth' }); }
function formatDescription(text) { return text?.split('\n\n').map(p => p.startsWith('**') ? `<p><strong>${p.replace(/\*\*/g, '')}</strong></p>` : `<p>${p.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')}</p>`).join('') || ''; }
function submitQuestion() { console.log('Question:', contactForm.value); showContactModal.value = false; contactForm.value = { name: '', email: '', message: '' }; }
</script>

<style scoped>
.formation-detail { min-height: 100vh; background: #0a0a0a; }

.detail-hero { position: relative; padding: 6rem 0 4rem; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; }
.grid-pattern { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 50px 50px; }
.detail-hero .container { position: relative; z-index: 1; }
.back-link { display: inline-block; margin-bottom: 24px; }
.hero-content { display: grid; grid-template-columns: 1fr 350px; gap: 48px; align-items: start; }
.price-card { position: sticky; top: 100px; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.detail-content { padding: 48px 0; }
.main-content { max-width: 800px; }
.content-section { margin-bottom: 48px; }

.description-text { line-height: 1.8; color: #a3a3a3; }
.description-text p { margin-bottom: 16px; }
.description-text strong { color: #f5f5f5; }

.avatar-placeholder { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #06B6D4, #8B5CF6); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; color: white; flex-shrink: 0; }

.session-date { text-align: center; min-width: 50px; }

.certification-card { background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.1)); border-color: rgba(139,92,246,0.3); }

.related-section { padding: 64px 0; background: rgba(0,0,0,0.3); }

.not-found { min-height: 60vh; display: flex; align-items: center; justify-content: center; }

@media (max-width: 900px) {
  .hero-content { grid-template-columns: 1fr; }
  .hero-sidebar { order: -1; }
  .price-card { position: static; }
}
</style>
