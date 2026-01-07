<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #06B6D4">📢 VISION</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📢</span> Content Generator</h1>
          <p>Générez du contenu optimisé SEO pour vos projets</p>
        </div>

        <!-- CONTENT TYPE -->
        <div class="type-section">
          <h3>📝 Type de contenu</h3>
          <div class="type-grid">
            <button v-for="type in contentTypes" :key="type.id" :class="['type-btn', { active: contentType === type.id }]" @click="contentType = type.id">
              <span class="type-icon">{{ type.icon }}</span>
              <span class="type-name">{{ type.name }}</span>
            </button>
          </div>
        </div>

        <!-- INPUT -->
        <div class="input-section">
          <div class="input-group">
            <label>🎯 Sujet / Brief <span class="required">*</span></label>
            <textarea v-model="brief" placeholder="Décrivez votre entreprise, service ou produit en détail..." class="brief-input"></textarea>
          </div>
          
          <div class="input-row">
            <div class="input-group">
              <label>🏢 Nom de l'entreprise <span class="required">*</span></label>
              <input type="text" v-model="companyName" placeholder="GL Digital Lab" class="text-input">
            </div>
            <div class="input-group">
              <label>📍 Localisation</label>
              <input type="text" v-model="location" placeholder="Limoges, Nouvelle-Aquitaine" class="text-input">
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label>🏷️ Mots-clés SEO <span class="required">*</span></label>
              <input type="text" v-model="keywords" placeholder="développement web, Symfony, Vue.js" class="text-input">
            </div>
            <div class="input-group">
              <label>🎯 Audience cible</label>
              <input type="text" v-model="targetAudience" placeholder="PME, startups, décideurs" class="text-input">
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label>🎭 Ton</label>
              <select v-model="tone" class="select-input">
                <option value="professional">Professionnel</option>
                <option value="casual">Décontracté</option>
                <option value="enthusiastic">Enthousiaste</option>
                <option value="authoritative">Expert / Autoritaire</option>
                <option value="friendly">Amical / Proche</option>
              </select>
            </div>
            <div class="input-group">
              <label>⭐ Points forts (optionnel)</label>
              <input type="text" v-model="highlights" placeholder="10 ans d'expérience, 50+ projets, 100% satisfaction" class="text-input">
            </div>
          </div>

          <div class="input-row">
            <div class="input-group">
              <label>🛠️ Technologies / Services clés</label>
              <input type="text" v-model="technologies" placeholder="Symfony, Vue.js, Docker, PostgreSQL" class="text-input">
            </div>
            <div class="input-group">
              <label>📞 Call-to-Action</label>
              <input type="text" v-model="ctaText" placeholder="Demander un devis gratuit" class="text-input">
            </div>
          </div>

          <button @click="generateContent" class="generate-btn" :disabled="generating || !brief || !companyName">
            {{ generating ? '🔄 Génération en cours...' : '✨ Générer le contenu' }}
          </button>
        </div>

        <!-- GENERATED CONTENT -->
        <div v-if="generatedContent" class="output-section">
          <div class="output-header">
            <h3>📄 Contenu généré</h3>
            <div class="output-actions">
              <button @click="copyContent" :class="{ copied }">{{ copied ? '✓ Copié' : '📋 Copier' }}</button>
              <button @click="downloadMarkdown">💾 .md</button>
              <button @click="downloadHtml">📄 .html</button>
              <button @click="regenerate">🔄 Régénérer</button>
            </div>
          </div>

          <!-- SEO Score -->
          <div class="seo-card">
            <div class="seo-score" :class="getSeoClass(seoScore)">
              <span class="score-value">{{ seoScore }}</span>
              <span class="score-label">SEO</span>
            </div>
            <div class="seo-details">
              <div class="seo-item" v-for="item in seoChecks" :key="item.name" :class="item.ok ? 'ok' : 'warn'">
                <span class="seo-icon">{{ item.ok ? '✓' : '!' }}</span>
                <span class="seo-text">{{ item.name }}</span>
              </div>
            </div>
          </div>

          <!-- Content Editor -->
          <div class="content-output">
            <div class="content-field">
              <label>🏷️ Titre SEO</label>
              <input type="text" v-model="generatedContent.title" class="title-input">
              <span class="char-count" :class="{ warn: generatedContent.title.length > 70, good: generatedContent.title.length >= 50 && generatedContent.title.length <= 70 }">{{ generatedContent.title.length }}/70</span>
            </div>
            
            <div class="content-field">
              <label>📝 Meta Description</label>
              <textarea v-model="generatedContent.metaDescription" class="meta-input"></textarea>
              <span class="char-count" :class="{ warn: generatedContent.metaDescription.length > 160, good: generatedContent.metaDescription.length >= 120 && generatedContent.metaDescription.length <= 160 }">{{ generatedContent.metaDescription.length }}/160</span>
            </div>
            
            <div class="content-field">
              <label>📄 Contenu principal</label>
              <div class="body-editor" contenteditable="true" @input="onBodyEdit" v-html="generatedContent.body"></div>
            </div>
          </div>

          <!-- Stats -->
          <div class="content-stats">
            <div class="stat"><span class="stat-icon">📝</span> {{ wordCount }} mots</div>
            <div class="stat"><span class="stat-icon">⏱️</span> {{ readTime }} min de lecture</div>
            <div class="stat"><span class="stat-icon">📊</span> {{ keywordDensity }}% densité KW</div>
            <div class="stat"><span class="stat-icon">📑</span> {{ headingsCount }} sections</div>
          </div>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h3>📦 Templates prêts à l'emploi</h3>
          <div class="templates-grid">
            <button @click="loadTemplate('gldigital')">🏢 GL Digital Lab</button>
            <button @click="loadTemplate('agency')">💼 Agence Web</button>
            <button @click="loadTemplate('saas')">☁️ SaaS B2B</button>
            <button @click="loadTemplate('ecommerce')">🛒 E-commerce</button>
            <button @click="loadTemplate('freelance')">👨‍💻 Freelance</button>
            <button @click="loadTemplate('restaurant')">🍽️ Restaurant</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const contentType = ref('landing');
const brief = ref('');
const companyName = ref('');
const location = ref('');
const keywords = ref('');
const targetAudience = ref('');
const tone = ref('professional');
const highlights = ref('');
const technologies = ref('');
const ctaText = ref('');
const generating = ref(false);
const generatedContent = ref(null);
const copied = ref(false);

const contentTypes = [
  { id: 'landing', icon: '🚀', name: 'Landing Page' },
  { id: 'about', icon: '📖', name: 'Page À Propos' },
  { id: 'service', icon: '⚙️', name: 'Page Service' },
  { id: 'blog', icon: '📝', name: 'Article Blog' },
  { id: 'product', icon: '🛒', name: 'Fiche Produit' },
  { id: 'email', icon: '📧', name: 'Newsletter' }
];

const seoScore = ref(0);
const seoChecks = ref([]);

const wordCount = computed(() => {
  if (!generatedContent.value?.body) return 0;
  return generatedContent.value.body.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;
});

const readTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 200)));

const headingsCount = computed(() => {
  if (!generatedContent.value?.body) return 0;
  return (generatedContent.value.body.match(/<h[23]>/g) || []).length;
});

const keywordDensity = computed(() => {
  if (!generatedContent.value?.body || !keywords.value) return 0;
  const text = generatedContent.value.body.toLowerCase().replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const kws = keywords.value.toLowerCase().split(',').map(k => k.trim()).filter(k => k);
  let count = 0;
  kws.forEach(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    count += (text.match(regex) || []).length;
  });
  return words.length > 0 ? ((count / words.length) * 100).toFixed(1) : 0;
});

function getSeoClass(score) {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'warning';
  return 'poor';
}

function onBodyEdit(e) {
  if (generatedContent.value) {
    generatedContent.value.body = e.target.innerHTML;
  }
}

async function generateContent() {
  if (!brief.value || !companyName.value) return;
  generating.value = true;
  
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
  
  const name = companyName.value.trim();
  const loc = location.value.trim();
  const kws = keywords.value.split(',').map(k => k.trim()).filter(k => k);
  const mainKw = kws[0] || 'solutions digitales';
  const secondKw = kws[1] || '';
  const thirdKw = kws[2] || '';
  const audience = targetAudience.value.trim() || 'entreprises';
  const techs = technologies.value.split(',').map(t => t.trim()).filter(t => t);
  const points = highlights.value.split(',').map(h => h.trim()).filter(h => h);
  const cta = ctaText.value.trim() || 'Contactez-nous';
  
  const toneConfig = {
    professional: {
      greeting: 'Bienvenue chez',
      we: 'Nous',
      action: 'Découvrez',
      expertise: 'Notre expertise',
      verb: 'accompagnons',
      style: 'rigoureux et méthodique'
    },
    casual: {
      greeting: 'Hey, bienvenue chez',
      we: 'On',
      action: 'Venez découvrir',
      expertise: 'Notre savoir-faire',
      verb: 'accompagne',
      style: 'accessible et pragmatique'
    },
    enthusiastic: {
      greeting: 'Rejoignez',
      we: 'Nous',
      action: 'Lancez-vous avec',
      expertise: 'Notre passion',
      verb: 'propulsons',
      style: 'dynamique et innovant'
    },
    authoritative: {
      greeting: 'Faites confiance à',
      we: 'Nous',
      action: 'Bénéficiez de',
      expertise: 'Notre maîtrise',
      verb: 'garantissons',
      style: 'expert et reconnu'
    },
    friendly: {
      greeting: 'Enchanté ! Voici',
      we: 'On',
      action: 'Travaillons ensemble sur',
      expertise: 'Notre approche',
      verb: 'accompagne',
      style: 'humain et accessible'
    }
  };
  
  const t = toneConfig[tone.value];
  
  let content = {};
  
  switch (contentType.value) {
    case 'landing':
      content = generateLanding(name, loc, brief.value, kws, mainKw, secondKw, audience, techs, points, cta, t);
      break;
    case 'about':
      content = generateAbout(name, loc, brief.value, kws, mainKw, audience, techs, points, t);
      break;
    case 'service':
      content = generateService(name, loc, brief.value, kws, mainKw, audience, techs, points, cta, t);
      break;
    case 'blog':
      content = generateBlog(name, brief.value, kws, mainKw, audience, t);
      break;
    case 'product':
      content = generateProduct(name, brief.value, kws, mainKw, audience, points, cta, t);
      break;
    case 'email':
      content = generateNewsletter(name, brief.value, kws, mainKw, audience, cta, t);
      break;
    default:
      content = generateLanding(name, loc, brief.value, kws, mainKw, secondKw, audience, techs, points, cta, t);
  }
  
  generatedContent.value = content;
  calculateSeoScore(content, kws, mainKw);
  generating.value = false;
}

function generateLanding(name, loc, brief, kws, mainKw, secondKw, audience, techs, points, cta, t) {
  const techList = techs.length > 0 ? techs.slice(0, 4).join(', ') : 'technologies modernes';
  const locText = loc ? ` à ${loc}` : '';
  const pointsList = points.length > 0 ? points : ['Expertise technique', 'Accompagnement personnalisé', 'Solutions sur-mesure'];
  
  return {
    title: `${name} | ${capitalize(mainKw)}${locText} - Expert ${secondKw || 'Digital'}`,
    metaDescription: `${name}${locText}, expert en ${mainKw}. ${t.we} ${t.verb} les ${audience} avec des solutions ${t.style}. ${cta} !`,
    body: `<h2>${t.greeting} ${name}</h2>
<p><strong>${brief}</strong></p>

<p>Dans un environnement digital en constante évolution, ${name} se positionne comme votre partenaire stratégique pour tous vos projets de ${mainKw}. Notre mission : transformer vos ambitions en réalités numériques performantes et durables.</p>

${points.length > 0 ? `<div class="highlights">
<p>🏆 <strong>${pointsList.join(' • ')}</strong></p>
</div>` : ''}

<h2>Pourquoi choisir ${name} ?</h2>
<p>${t.expertise} en ${kws.slice(0, 3).join(', ')} nous permet d'offrir aux ${audience} des solutions parfaitement adaptées à leurs enjeux business. Chaque projet est unique, notre approche l'est aussi.</p>

<h3>Nos engagements qualité</h3>
<ul>
<li><strong>Excellence technique</strong> — Maîtrise de ${techList} et veille technologique permanente</li>
<li><strong>Approche sur-mesure</strong> — Analyse approfondie de vos besoins, solutions personnalisées</li>
<li><strong>Accompagnement complet</strong> — De la conception à la mise en production, et au-delà</li>
<li><strong>Transparence totale</strong> — Communication claire, devis détaillés, pas de surprise</li>
</ul>

<h2>Nos domaines d'expertise</h2>
<p>Que vous ayez besoin de ${mainKw}, ${secondKw || 'conseil digital'} ou d'un accompagnement technique, notre équipe mobilise les compétences nécessaires pour atteindre vos objectifs.</p>

${techs.length > 0 ? `<h3>Technologies maîtrisées</h3>
<p>Notre stack technique : <strong>${techs.join(', ')}</strong>. Nous sélectionnons les outils les plus adaptés à chaque projet pour garantir performance, sécurité et évolutivité.</p>` : ''}

<h2>Prêt à concrétiser votre projet ?</h2>
<p>${t.action} notre expertise. Premier échange gratuit et sans engagement pour analyser vos besoins et vous proposer une solution adaptée.</p>

<p><strong>👉 ${cta}</strong></p>`
  };
}

function generateAbout(name, loc, brief, kws, mainKw, audience, techs, points, t) {
  const locText = loc ? ` à ${loc}` : '';
  
  return {
    title: `À Propos de ${name} | Notre Histoire, Nos Valeurs${locText}`,
    metaDescription: `Découvrez ${name}, expert en ${mainKw}${locText}. Notre équipe accompagne les ${audience} avec passion et rigueur. Notre histoire, nos valeurs, notre vision.`,
    body: `<h2>Notre histoire</h2>
<p>${brief}</p>

<p>${name} est né d'une conviction forte : les ${audience} méritent des solutions digitales de qualité, conçues avec rigueur et livrées avec passion. Depuis notre création, nous mettons notre expertise au service de projets ambitieux.</p>

<h2>Notre mission</h2>
<p>Chez ${name}, nous croyons que le ${mainKw} doit être un levier de croissance concret pour nos clients. C'est pourquoi nous privilégions toujours l'efficacité et les résultats mesurables plutôt que les effets de mode.</p>

<h2>Nos valeurs fondamentales</h2>
<ul>
<li><strong>Excellence</strong> — Nous visons la qualité dans chaque ligne de code, chaque décision</li>
<li><strong>Transparence</strong> — Communication honnête, pas de jargon inutile, des engagements tenus</li>
<li><strong>Innovation pragmatique</strong> — Veille technologique au service de solutions éprouvées</li>
<li><strong>Proximité</strong> — Un interlocuteur dédié qui comprend vos enjeux métier</li>
</ul>

<h2>Notre approche</h2>
<p>Chaque collaboration commence par une écoute attentive. Nous prenons le temps de comprendre votre contexte, vos objectifs et vos contraintes avant de proposer des solutions vraiment adaptées.</p>

<p>${t.we} ${t.verb} nos clients sur le long terme, en bâtissant des relations de confiance basées sur des résultats concrets.</p>

${points.length > 0 ? `<h2>Nos chiffres clés</h2>
<p>🏆 ${points.join(' • ')}</p>` : ''}`
  };
}

function generateService(name, loc, brief, kws, mainKw, audience, techs, points, cta, t) {
  const techList = techs.length > 0 ? techs.join(', ') : 'technologies de pointe';
  const locText = loc ? ` à ${loc}` : '';
  
  return {
    title: `${capitalize(mainKw)}${locText} | Services ${name}`,
    metaDescription: `${name} propose des services de ${mainKw} pour ${audience}. Développement sur-mesure, maintenance et accompagnement technique. ${cta}.`,
    body: `<h2>Nos services en ${mainKw}</h2>
<p>${brief}</p>

<h2>Développement sur-mesure</h2>
<p>Nous concevons des solutions ${mainKw} parfaitement adaptées à vos besoins spécifiques. Pas de template générique ni de compromis : chaque projet est pensé et développé pour répondre précisément à vos objectifs.</p>

<h2>Notre méthodologie</h2>
<ul>
<li><strong>Audit & Analyse</strong> — Étude approfondie de vos besoins et de l'existant</li>
<li><strong>Proposition technique</strong> — Solution détaillée avec chiffrage transparent</li>
<li><strong>Développement itératif</strong> — Livraisons régulières, feedback continu</li>
<li><strong>Tests & Validation</strong> — Qualité garantie avant mise en production</li>
<li><strong>Formation & Support</strong> — Autonomie et accompagnement post-livraison</li>
</ul>

<h2>Technologies utilisées</h2>
<p>Notre stack technique : <strong>${techList}</strong>. Nous choisissons les outils les plus adaptés à chaque contexte pour garantir performance, sécurité et maintenabilité.</p>

<h2>Maintenance & Évolution</h2>
<p>Notre engagement ne s'arrête pas à la livraison. Nous proposons des contrats de maintenance pour faire évoluer votre solution et garantir sa pérennité dans le temps.</p>

<h2>Intéressé par nos services ?</h2>
<p>${t.action} notre expertise. Contactez-nous pour un premier échange gratuit.</p>

<p><strong>👉 ${cta}</strong></p>`
  };
}

function generateBlog(name, brief, kws, mainKw, audience, t) {
  return {
    title: `${capitalize(mainKw)} : Guide Complet et Bonnes Pratiques [2024]`,
    metaDescription: `Tout savoir sur ${mainKw} : définition, bonnes pratiques et conseils d'experts. Guide complet par ${name} pour les ${audience}.`,
    body: `<h2>Introduction : Pourquoi ${mainKw} est essentiel en 2024</h2>
<p>${brief}</p>

<p>Dans cet article, nous allons explorer les fondamentaux du ${mainKw} et vous donner les clés pour réussir vos projets. Que vous soyez débutant ou confirmé, ce guide vous apportera des informations concrètes et actionnables.</p>

<h2>Qu'est-ce que ${mainKw} ?</h2>
<p>Le ${mainKw} désigne l'ensemble des pratiques et technologies permettant de [définition contextuelle]. C'est un domaine en constante évolution qui offre de nombreuses opportunités pour les ${audience}.</p>

<h2>Les fondamentaux à maîtriser</h2>
<p>Avant de se lancer, il est essentiel de comprendre certains concepts clés :</p>
<ul>
<li><strong>Concept 1</strong> — Explication et importance</li>
<li><strong>Concept 2</strong> — Application pratique</li>
<li><strong>Concept 3</strong> — Erreurs courantes à éviter</li>
</ul>

<h2>Bonnes pratiques recommandées</h2>
<p>Voici les recommandations que ${t.we} appliquons chez ${name} :</p>
<ul>
<li>Toujours commencer par une analyse approfondie des besoins</li>
<li>Privilégier la qualité à la quantité</li>
<li>Documenter chaque étape pour faciliter la maintenance</li>
<li>Tester régulièrement et automatiser quand c'est possible</li>
<li>Mesurer les résultats pour améliorer continuellement</li>
</ul>

<h2>Les erreurs à éviter absolument</h2>
<p>Notre expérience nous a montré que certaines erreurs reviennent fréquemment. Les voici, avec nos conseils pour les éviter.</p>

<h2>Conclusion</h2>
<p>Le ${mainKw} est un domaine passionnant qui offre de réelles opportunités pour les ${audience}. En suivant ces bonnes pratiques, vous maximisez vos chances de succès.</p>

<p><em>Besoin d'accompagnement ? ${name} est à votre disposition pour vous aider dans vos projets.</em></p>`
  };
}

function generateProduct(name, brief, kws, mainKw, audience, points, cta, t) {
  return {
    title: `${capitalize(mainKw)} - Solution ${name} | Fonctionnalités & Tarifs`,
    metaDescription: `Découvrez ${mainKw} par ${name}. Fonctionnalités avancées, interface intuitive, support réactif. Idéal pour ${audience}. ${cta}.`,
    body: `<h2>Présentation de la solution</h2>
<p>${brief}</p>

<h2>Fonctionnalités principales</h2>
<ul>
<li><strong>Interface intuitive</strong> — Prise en main rapide, aucune formation requise</li>
<li><strong>Performance optimisée</strong> — Vitesse et fiabilité garanties</li>
<li><strong>Personnalisation avancée</strong> — Adaptable à vos processus métier</li>
<li><strong>Sécurité renforcée</strong> — Protection de vos données conforme RGPD</li>
<li><strong>Intégrations</strong> — Compatible avec vos outils existants</li>
</ul>

<h2>Pour qui ?</h2>
<p>Cette solution s'adresse aux ${audience} qui souhaitent optimiser leur ${mainKw} sans compromis sur la qualité.</p>

${points.length > 0 ? `<h2>Pourquoi nous choisir ?</h2>
<p>🏆 ${points.join(' • ')}</p>` : ''}

<h2>Avantages concurrentiels</h2>
<ul>
<li>Solution éprouvée et constamment améliorée</li>
<li>Support technique réactif et compétent</li>
<li>Mises à jour régulières incluses</li>
<li>Tarification transparente, sans frais cachés</li>
</ul>

<h2>Prêt à essayer ?</h2>
<p><strong>👉 ${cta}</strong></p>`
  };
}

function generateNewsletter(name, brief, kws, mainKw, audience, cta, t) {
  return {
    title: `[${name}] Actualités ${mainKw} - Newsletter`,
    metaDescription: `Newsletter ${name} : actualités, conseils et nouveautés en ${mainKw} pour les ${audience}.`,
    body: `<p>Bonjour,</p>

<p>${brief}</p>

<h2>📌 À la une cette semaine</h2>
<p>Chez ${name}, nous travaillons constamment pour vous offrir les meilleures solutions en ${mainKw}. Voici les actualités importantes.</p>

<h2>💡 Conseil de la semaine</h2>
<p>[Insérez ici un conseil pratique lié à votre expertise en ${mainKw}]</p>

<h2>🎯 Ce que nous préparons</h2>
<ul>
<li>Nouveauté 1 à venir</li>
<li>Amélioration 2 en cours</li>
<li>Événement 3 à ne pas manquer</li>
</ul>

<h2>📞 Besoin d'aide ?</h2>
<p>Notre équipe est disponible pour répondre à vos questions et vous accompagner dans vos projets.</p>

<p><strong>👉 ${cta}</strong></p>

<p>À très bientôt,</p>
<p><strong>L'équipe ${name}</strong></p>`
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function calculateSeoScore(content, kws, mainKw) {
  const titleLength = content.title.length;
  const metaLength = content.metaDescription.length;
  const bodyText = content.body.toLowerCase();
  const titleLower = content.title.toLowerCase();
  
  seoChecks.value = [
    { name: 'Titre (50-70 caractères)', ok: titleLength >= 50 && titleLength <= 70 },
    { name: 'Meta description (120-160)', ok: metaLength >= 120 && metaLength <= 160 },
    { name: 'Mot-clé principal dans titre', ok: titleLower.includes(mainKw.toLowerCase()) },
    { name: 'Mot-clé dans meta', ok: content.metaDescription.toLowerCase().includes(mainKw.toLowerCase()) },
    { name: 'Structure H2 présente', ok: content.body.includes('<h2>') },
    { name: 'Sous-titres H3', ok: content.body.includes('<h3>') },
    { name: 'Longueur > 300 mots', ok: wordCount.value >= 300 },
    { name: 'Listes à puces', ok: content.body.includes('<li>') },
    { name: 'Texte en gras', ok: content.body.includes('<strong>') },
    { name: 'CTA présent', ok: content.body.includes('👉') }
  ];
  
  seoScore.value = Math.round((seoChecks.value.filter(c => c.ok).length / seoChecks.value.length) * 100);
}

function regenerate() {
  generateContent();
}

async function copyContent() {
  const text = `# ${generatedContent.value.title}\n\n> ${generatedContent.value.metaDescription}\n\n${htmlToMarkdown(generatedContent.value.body)}`;
  await navigator.clipboard.writeText(text);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function htmlToMarkdown(html) {
  return html
    .replace(/<h2>/g, '\n## ')
    .replace(/<\/h2>/g, '\n')
    .replace(/<h3>/g, '\n### ')
    .replace(/<\/h3>/g, '\n')
    .replace(/<p>/g, '\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<ul>/g, '')
    .replace(/<\/ul>/g, '')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<em>/g, '_')
    .replace(/<\/em>/g, '_')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function downloadMarkdown() {
  const content = `# ${generatedContent.value.title}\n\n> ${generatedContent.value.metaDescription}\n\n${htmlToMarkdown(generatedContent.value.body)}`;
  downloadFile(content, 'content.md', 'text/markdown');
}

function downloadHtml() {
  const content = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${generatedContent.value.title}</title>
  <meta name="description" content="${generatedContent.value.metaDescription}">
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; color: #333; }
    h1 { color: #1a1a1a; }
    h2 { color: #2563eb; margin-top: 2rem; }
    h3 { color: #4b5563; }
    ul { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    strong { color: #1a1a1a; }
  </style>
</head>
<body>
  <article>
    <h1>${generatedContent.value.title}</h1>
    ${generatedContent.value.body}
  </article>
</body>
</html>`;
  downloadFile(content, 'content.html', 'text/html');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function loadTemplate(type) {
  const templates = {
    gldigital: {
      brief: 'GL Digital Lab est une agence web spécialisée dans le développement d\'applications sur-mesure avec Symfony et Vue.js. Nous accompagnons les PME de Nouvelle-Aquitaine dans leur transformation digitale avec une approche pragmatique et orientée résultats.',
      company: 'GL Digital Lab',
      location: 'Limoges, Nouvelle-Aquitaine',
      keywords: 'développement web, Symfony, Vue.js, agence web Limoges',
      audience: 'PME et ETI',
      highlights: '50+ projets livrés, 100% clients satisfaits, Expert Symfony certifié',
      technologies: 'Symfony 7, Vue.js 3, PostgreSQL, Docker, API REST',
      cta: 'Demander un audit gratuit',
      tone: 'professional',
      type: 'landing'
    },
    agency: {
      brief: 'Agence digitale créative spécialisée dans la création de sites web et d\'applications mobiles. Notre équipe pluridisciplinaire accompagne les marques ambitieuses dans leur stratégie digitale.',
      company: 'Digital Agency',
      location: 'Paris',
      keywords: 'agence digitale, création site web, application mobile, stratégie digitale',
      audience: 'marques et entreprises',
      highlights: '10 ans d\'expérience, 200+ projets, Équipe de 15 experts',
      technologies: 'React, Node.js, Figma, AWS',
      cta: 'Démarrer un projet',
      tone: 'enthusiastic',
      type: 'landing'
    },
    saas: {
      brief: 'Plateforme SaaS de gestion de projet nouvelle génération. Collaborez efficacement avec votre équipe grâce à des outils intuitifs et des fonctionnalités IA innovantes.',
      company: 'ProjectFlow',
      location: '',
      keywords: 'gestion de projet, SaaS, collaboration, productivité équipe',
      audience: 'équipes et startups',
      highlights: '10 000+ utilisateurs, 4.8/5 satisfaction, 99.9% uptime',
      technologies: '',
      cta: 'Essai gratuit 14 jours',
      tone: 'friendly',
      type: 'product'
    },
    ecommerce: {
      brief: 'Boutique en ligne spécialisée dans les produits artisanaux français. Découvrez une sélection unique de créations locales, livrées chez vous avec soin.',
      company: 'Artisans de France',
      location: 'France',
      keywords: 'artisanat français, produits locaux, boutique en ligne, made in France',
      audience: 'particuliers',
      highlights: 'Livraison 48h, Satisfait ou remboursé, Artisans sélectionnés',
      technologies: '',
      cta: 'Découvrir la collection',
      tone: 'friendly',
      type: 'product'
    },
    freelance: {
      brief: 'Développeur web freelance passionné avec plus de 8 ans d\'expérience. Je conçois des sites web performants et des applications sur-mesure pour entrepreneurs et PME.',
      company: 'Alex Dev',
      location: 'Lyon',
      keywords: 'développeur freelance, création site web, développeur Lyon',
      audience: 'entrepreneurs et TPE',
      highlights: '8 ans d\'expérience, 80+ clients satisfaits, Disponibilité rapide',
      technologies: 'WordPress, PHP, JavaScript, MySQL',
      cta: 'Discuter de votre projet',
      tone: 'friendly',
      type: 'about'
    },
    restaurant: {
      brief: 'Restaurant gastronomique proposant une cuisine française moderne avec des produits locaux et de saison. Une expérience culinaire unique dans un cadre élégant.',
      company: 'La Table du Chef',
      location: 'Bordeaux',
      keywords: 'restaurant gastronomique, cuisine française, Bordeaux, produits locaux',
      audience: 'gourmets et amateurs de bonne cuisine',
      highlights: '1 étoile Michelin, Produits 100% locaux, Chef primé',
      technologies: '',
      cta: 'Réserver une table',
      tone: 'authoritative',
      type: 'landing'
    }
  };
  
  const tpl = templates[type];
  if (tpl) {
    brief.value = tpl.brief;
    companyName.value = tpl.company;
    location.value = tpl.location;
    keywords.value = tpl.keywords;
    targetAudience.value = tpl.audience;
    highlights.value = tpl.highlights;
    technologies.value = tpl.technologies;
    ctaText.value = tpl.cta;
    tone.value = tpl.tone;
    contentType.value = tpl.type;
  }
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.back-link:hover { color: var(--primary); }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(6,182,212,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-main); }

.type-section, .input-section, .output-section, .templates-section { margin-bottom: 2rem; }

.type-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem; }
.type-btn { display: flex; flex-direction: column; align-items: center; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; }
.type-btn:hover { border-color: #06B6D4; background: rgba(6,182,212,0.05); }
.type-btn.active { background: rgba(6,182,212,0.15); border-color: #06B6D4; }
.type-icon { font-size: 1.25rem; margin-bottom: 0.25rem; }
.type-name { font-size: 0.75rem; color: var(--text-muted); }

.input-group { margin-bottom: 1rem; }
.input-group label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem; }
.required { color: #EF4444; }
.brief-input { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); font-size: 0.9rem; resize: vertical; }
.brief-input:focus { outline: none; border-color: #06B6D4; }
.input-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.text-input, .select-input { width: 100%; padding: 0.6rem 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.4rem; color: var(--text-main); font-size: 0.9rem; }
.text-input:focus, .select-input:focus { outline: none; border-color: #06B6D4; }
.generate-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #06B6D4, #0891B2); border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; color: white; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
.generate-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(6,182,212,0.3); }
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem; }
.output-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.output-actions button { padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; cursor: pointer; color: var(--text-muted); font-size: 0.8rem; transition: all 0.2s; }
.output-actions button:hover { border-color: var(--primary); color: var(--primary); }
.output-actions button.copied { background: var(--primary); border-color: var(--primary); color: #000; }

.seo-card { display: flex; align-items: flex-start; gap: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.seo-score { width: 70px; height: 70px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.seo-score.excellent { background: rgba(16,185,129,0.2); color: #10B981; border: 2px solid #10B981; }
.seo-score.good { background: rgba(59,130,246,0.2); color: #3B82F6; border: 2px solid #3B82F6; }
.seo-score.warning { background: rgba(245,158,11,0.2); color: #F59E0B; border: 2px solid #F59E0B; }
.seo-score.poor { background: rgba(239,68,68,0.2); color: #EF4444; border: 2px solid #EF4444; }
.score-value { font-size: 1.5rem; line-height: 1; }
.score-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; }
.seo-details { display: flex; flex-wrap: wrap; gap: 0.4rem; flex: 1; }
.seo-item { display: flex; align-items: center; gap: 0.3rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; white-space: nowrap; }
.seo-item.ok { background: rgba(16,185,129,0.15); color: #10B981; }
.seo-item.warn { background: rgba(245,158,11,0.15); color: #F59E0B; }
.seo-icon { font-weight: 600; }

.content-output { margin-bottom: 1rem; }
.content-field { margin-bottom: 1rem; position: relative; }
.content-field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; font-weight: 500; }
.title-input { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.4rem; color: #06B6D4; font-size: 1.1rem; font-weight: 600; }
.title-input:focus { outline: none; border-color: #06B6D4; }
.meta-input { width: 100%; padding: 0.6rem 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.4rem; color: var(--text-secondary); font-size: 0.9rem; min-height: 70px; resize: vertical; }
.meta-input:focus { outline: none; border-color: #06B6D4; }
.char-count { position: absolute; right: 0.5rem; bottom: 0.5rem; font-size: 0.7rem; color: var(--text-muted); background: var(--bg-primary); padding: 0.1rem 0.3rem; border-radius: 0.2rem; }
.char-count.warn { color: #EF4444; }
.char-count.good { color: #10B981; }

.body-editor { padding: 1.25rem; background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-radius: 0.5rem; min-height: 300px; line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem; }
.body-editor:focus { outline: none; border-color: #06B6D4; }
.body-editor h2 { font-size: 1.3rem; margin: 1.75rem 0 0.75rem; color: var(--text-main); font-weight: 600; }
.body-editor h2:first-child { margin-top: 0; }
.body-editor h3 { font-size: 1.1rem; margin: 1.25rem 0 0.5rem; color: var(--text-main); font-weight: 600; }
.body-editor p { margin-bottom: 0.85rem; }
.body-editor ul { margin: 0.75rem 0; padding-left: 1.5rem; }
.body-editor li { margin-bottom: 0.4rem; }
.body-editor strong { color: var(--text-main); }

.content-stats { display: flex; gap: 1.25rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border-radius: 0.5rem; flex-wrap: wrap; border: 1px solid var(--border); }
.stat { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--text-muted); }
.stat-icon { font-size: 1rem; }

.templates-section { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--border); }
.templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.6rem; }
.templates-grid button { padding: 0.7rem 0.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.templates-grid button:hover { border-color: #06B6D4; color: #06B6D4; background: rgba(6,182,212,0.05); }

@media (max-width: 768px) { 
  .input-row { grid-template-columns: 1fr; }
  .seo-card { flex-direction: column; align-items: center; text-align: center; }
  .seo-details { justify-content: center; }
}
</style>
