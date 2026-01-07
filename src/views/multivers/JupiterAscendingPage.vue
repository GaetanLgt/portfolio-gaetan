<template>
  <div class="jupiter-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- STARFIELD -->
    <div class="starfield" aria-hidden="true">
      <div class="stars stars--1"></div>
      <div class="stars stars--2"></div>
    </div>

    <!-- HERO -->
    <section id="hero" class="jup-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="planet jupiter"></div>
      </div>

      <div class="container" id="main-content">
        <div class="abrasax-seal">
          <div class="seal-ring"></div>
          <span class="seal-text">ABRASAX</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">VOUS ÊTES</span>
          <span class="title-main">L'HÉRITIÈRE</span>
          <span class="title-sub">de quelque chose d'extraordinaire</span>
        </h1>

        <p class="hero-quote">
          « Je ne suis pas votre mère, je suis la récurrence de votre mère. »
        </p>

        <div class="inheritance-display">
          <div class="gene-marker">
            <span class="marker-icon">🧬</span>
            <span class="marker-val">99.97%</span>
            <span class="marker-label">CORRESPONDANCE GÉNÉTIQUE</span>
          </div>
          <div class="gene-marker">
            <span class="marker-icon">👑</span>
            <span class="marker-val">VÉRIFIÉ</span>
            <span class="marker-label">STATUT ROYAL</span>
          </div>
          <div class="gene-marker">
            <span class="marker-icon">🌍</span>
            <span class="marker-val">PROPRIÉTAIRE</span>
            <span class="marker-label">TITRE TERRIEN</span>
          </div>
        </div>

        <button class="gold-btn" @click="scrollTo('bureaucracy')">
          <span>RÉCLAMER VOTRE HÉRITAGE</span>
        </button>
      </div>
    </section>

    <!-- BUREAUCRACY -->
    <section id="bureaucracy" class="jup-section" aria-labelledby="bureau-title">
      <div class="container">
        <h2 id="bureau-title" class="section-title">BUREAUCRATIE GALACTIQUE</h2>
        <p class="section-sub">Formulaire 1-1-7-3-2-4 Alpha à Zêta</p>

        <div class="forms-grid">
          <div v-for="form in forms" :key="form.id" class="form-card">
            <div class="form-header">
              <span class="form-id">{{ form.id }}</span>
              <span class="form-status" :class="form.status">{{ form.statusLabel }}</span>
            </div>
            <h3>{{ form.name }}</h3>
            <p>{{ form.desc }}</p>
            <div class="stamp" v-if="form.status === 'approved'">✓ APPROUVÉ</div>
          </div>
        </div>
      </div>
    </section>

    <!-- HARVEST : Projects -->
    <section id="harvest" class="jup-section harvest-section" aria-labelledby="harvest-title">
      <div class="container">
        <h2 id="harvest-title" class="section-title">LA MOISSON</h2>
        <p class="section-sub">Des projets qui portent leurs fruits</p>

        <div class="harvest-grid">
          <article v-for="p in projects" :key="p.id" class="harvest-card">
            <div class="card-planet" :style="{ background: p.gradient }">
              <span class="planet-icon">{{ p.icon }}</span>
            </div>
            <div class="card-info">
              <h3>{{ p.name }}</h3>
              <p class="card-type">{{ p.type }}</p>
              <p class="card-desc">{{ p.desc }}</p>
              <div class="card-yield">
                <span class="yield-lbl">RENDEMENT :</span>
                <span class="yield-val">{{ p.yield }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- GRAVITY BOOTS : Skills -->
    <section id="skills" class="jup-section" aria-labelledby="skills-title">
      <div class="container">
        <h2 id="skills-title" class="section-title">BOTTES ANTIGRAVITÉ</h2>
        <p class="section-sub">Des technologies qui vous élèvent</p>

        <div class="skills-grid">
          <div v-for="s in skills" :key="s.name" class="skill-card">
            <div class="skill-glow" :style="{ '--color': s.color }"></div>
            <span class="skill-icon">{{ s.icon }}</span>
            <h4>{{ s.name }}</h4>
            <div class="skill-bar"><div class="bar-fill" :style="{ width: s.level + '%', background: s.color }"></div></div>
            <span class="skill-val">{{ s.level }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- AEGIS : Contact -->
    <section id="aegis" class="jup-section aegis-section" aria-labelledby="aegis-title">
      <div class="container">
        <h2 id="aegis-title" class="aegis-title">
          <span class="pre">DEMANDER UNE</span>
          <span class="main">ESCORTE AEGIS</span>
        </h2>
        <p class="aegis-text">Votre héritage attend d'être traité.</p>
        <router-link to="/contact" class="gold-btn">DEMANDER UNE ESCORTE</router-link>
        <p class="aegis-quote">« Les abeilles sont génétiquement conçues pour reconnaître la royauté »</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const forms = [
  { id: 'FORM-117', name: 'Vérification d\'Identité', desc: 'Confirmation du code génétique', status: 'approved', statusLabel: 'approuvé' },
  { id: 'FORM-324', name: 'Demande d\'Héritage', desc: 'Autorisation de transfert d\'actifs', status: 'approved', statusLabel: 'approuvé' },
  { id: 'FORM-892', name: 'Enregistrement du Titre', desc: 'Documents de statut royal', status: 'pending', statusLabel: 'en attente' },
  { id: 'FORM-001', name: 'Propriété Terrestre', desc: 'Acte de propriété planétaire', status: 'processing', statusLabel: 'en cours' }
];

const projects = [
  { id: 1, name: 'ARKADIA', type: 'Système Planétaire', icon: '🛡️', gradient: 'linear-gradient(135deg, #1a4a6e, #0d2840)', desc: 'Écosystème gaming', yield: 'ÉLEVÉ' },
  { id: 2, name: 'GL DIGITAL', type: 'Station Spatiale', icon: '⚡', gradient: 'linear-gradient(135deg, #4a1a6e, #280d40)', desc: 'Centre de commande dev', yield: 'MAXIMUM' },
  { id: 3, name: 'NEURAL OPS', type: 'Cœur IA', icon: '🧠', gradient: 'linear-gradient(135deg, #6e4a1a, #402d0d)', desc: 'Hub d\'intelligence', yield: 'OPTIMAL' },
  { id: 4, name: 'PORTFOLIO', type: 'Portail', icon: '🌐', gradient: 'linear-gradient(135deg, #1a6e4a, #0d4028)', desc: 'Point d\'accès', yield: 'INFINI' }
];

const skills = [
  { name: 'Symfony', icon: '⚙️', level: 95, color: '#4fc3f7' },
  { name: 'Vue.js', icon: '🎨', level: 88, color: '#81c784' },
  { name: 'Docker', icon: '🐳', level: 82, color: '#64b5f6' },
  { name: 'IA/ML', icon: '🧠', level: 78, color: '#ba68c8' }
];

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
</script>

<style scoped>
.jupiter-page {
  --gold: #d4af37;
  --purple: #6a0dad;
  --bg: #0a0510;
  background: var(--bg);
  color: #e0d0f0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.starfield { position: fixed; inset: 0; z-index: 0; }
.stars {
  position: absolute; inset: 0;
  background-image: radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.5), transparent);
  background-size: 200px 200px; animation: drift 100s linear infinite;
}
@keyframes drift { to { transform: translateY(200px); } }

.jup-hero { min-height: 100vh; display: flex; align-items: center; position: relative; padding: 6rem 2rem; }
.hero-bg { position: absolute; inset: 0; }
.planet.jupiter {
  position: absolute; top: 10%; right: -5%; width: 350px; height: 350px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #e8c49a, #a67c52 60%, #8b5a2b);
  box-shadow: inset -30px -30px 60px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.3);
}

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }

.abrasax-seal { display: inline-block; position: relative; margin-bottom: 2rem; }
.seal-ring { width: 80px; height: 80px; border: 3px solid var(--gold); border-radius: 50%; }
.seal-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 0.6rem; color: var(--gold); letter-spacing: 0.2em; }

.hero-title { margin-bottom: 2rem; }
.title-pre { display: block; font-size: 1rem; color: rgba(224,208,240,0.5); letter-spacing: 0.3em; }
.title-main { display: block; font-size: clamp(4rem, 12vw, 8rem); font-weight: 200; color: var(--gold); text-shadow: 0 0 50px rgba(212,175,55,0.5); }
.title-sub { display: block; font-size: 1rem; color: rgba(224,208,240,0.6); font-style: italic; }
.hero-quote { font-style: italic; color: rgba(224,208,240,0.6); max-width: 400px; margin-bottom: 2rem; }

.inheritance-display { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.gene-marker { text-align: center; }
.marker-icon { display: block; font-size: 1.5rem; }
.marker-val { display: block; font-size: 1.1rem; color: var(--gold); }
.marker-label { display: block; font-size: 0.6rem; color: rgba(224,208,240,0.5); }

.gold-btn {
  display: inline-block; padding: 1rem 2rem; background: transparent;
  border: 2px solid var(--gold); color: var(--gold);
  font-size: 0.9rem; letter-spacing: 0.1em; cursor: pointer;
  transition: all 0.3s; text-decoration: none;
}
.gold-btn:hover { background: rgba(212,175,55,0.1); box-shadow: 0 0 30px rgba(212,175,55,0.3); }

.jup-section { min-height: 100vh; padding: 6rem 2rem; }
.section-title { text-align: center; font-size: clamp(1.5rem, 4vw, 2.5rem); color: var(--gold); letter-spacing: 0.2em; margin-bottom: 0.5rem; }
.section-sub { text-align: center; font-size: 0.85rem; color: rgba(224,208,240,0.5); margin-bottom: 3rem; }

.forms-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
.form-card { padding: 1.5rem; background: rgba(20,10,40,0.8); border: 1px solid rgba(212,175,55,0.2); position: relative; transition: all 0.3s; }
.form-card:hover { border-color: var(--gold); }
.form-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.form-id { font-size: 0.7rem; color: #4fc3f7; }
.form-status { font-size: 0.6rem; text-transform: uppercase; }
.form-status.approved { color: #4caf50; }
.form-status.pending { color: #ff9800; }
.form-status.processing { color: #4fc3f7; }
.form-card h3 { font-size: 1rem; color: var(--gold); margin-bottom: 0.25rem; }
.form-card p { font-size: 0.8rem; color: rgba(224,208,240,0.6); }
.stamp { position: absolute; top: 50%; right: 0.5rem; transform: translateY(-50%) rotate(-10deg); padding: 0.25rem 0.5rem; border: 2px solid #4caf50; color: #4caf50; font-size: 0.6rem; }

.harvest-section { background: linear-gradient(180deg, var(--bg), #0f0820); }
.harvest-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
.harvest-card { background: rgba(20,10,40,0.8); border: 1px solid rgba(106,13,173,0.3); overflow: hidden; transition: all 0.3s; }
.harvest-card:hover { border-color: var(--purple); }
.card-planet { height: 100px; display: flex; align-items: center; justify-content: center; }
.planet-icon { font-size: 2.5rem; }
.card-info { padding: 1.25rem; }
.card-info h3 { font-size: 1.1rem; color: var(--gold); }
.card-type { font-size: 0.65rem; color: var(--purple); margin-bottom: 0.5rem; }
.card-desc { font-size: 0.8rem; color: rgba(224,208,240,0.6); margin-bottom: 0.75rem; }
.card-yield { display: flex; justify-content: space-between; }
.yield-lbl { font-size: 0.65rem; color: rgba(224,208,240,0.4); }
.yield-val { font-size: 0.75rem; color: #4caf50; font-weight: bold; }

.skills-grid { display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; }
.skill-card { text-align: center; width: 140px; padding: 1.5rem; background: rgba(20,10,40,0.8); border: 1px solid rgba(212,175,55,0.2); position: relative; }
.skill-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: var(--color); opacity: 0.2; filter: blur(20px); border-radius: 50%; }
.skill-icon { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
.skill-card h4 { font-size: 0.85rem; color: var(--gold); margin-bottom: 0.5rem; }
.skill-bar { height: 4px; background: rgba(255,255,255,0.1); margin-bottom: 0.25rem; }
.bar-fill { height: 100%; }
.skill-val { font-size: 0.75rem; color: rgba(224,208,240,0.6); }

.aegis-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
.aegis-title .pre { display: block; font-size: 1rem; color: rgba(224,208,240,0.5); letter-spacing: 0.2em; }
.aegis-title .main { display: block; font-size: clamp(2rem, 6vw, 4rem); color: var(--gold); text-shadow: 0 0 40px rgba(212,175,55,0.5); margin-bottom: 1rem; }
.aegis-text { color: rgba(224,208,240,0.6); margin-bottom: 2rem; }
.aegis-quote { margin-top: 2rem; font-size: 0.8rem; color: rgba(212,175,55,0.3); font-style: italic; }

@media (max-width: 768px) {
  .inheritance-display { flex-direction: column; gap: 1rem; }
  .planet.jupiter { width: 180px; height: 180px; }
}

@media (prefers-reduced-motion: reduce) {
  .stars { animation: none; }
}
</style>
