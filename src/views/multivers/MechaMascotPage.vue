<template>
  <div class="ghibli-mascot-page">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO : Introduction poétique -->
    <section class="ghibli-hero" aria-labelledby="hero-title">
      <div class="ghibli-hero__bg" aria-hidden="true">
        <div class="clouds clouds--1"></div>
        <div class="clouds clouds--2"></div>
        <div class="clouds clouds--3"></div>
        <div class="floating-leaves">
          <span class="leaf leaf--1">🍃</span>
          <span class="leaf leaf--2">🌿</span>
          <span class="leaf leaf--3">🍃</span>
          <span class="leaf leaf--4">🌱</span>
        </div>
      </div>
      
      <div class="container">
        <div class="ghibli-hero__content">
          <div class="spirit-badge" aria-hidden="true">
            <span class="spirit-badge__icon">✨</span>
            <span class="spirit-badge__text">Esprit du Code</span>
          </div>
          
          <h1 id="hero-title" class="ghibli-hero__title">
            <span class="title-main">Kōdo no Sei</span>
            <span class="title-jp">コードの精</span>
            <span class="title-sub">L'Esprit Gardien du Numérique</span>
          </h1>
          
          <p class="ghibli-hero__intro">
            Dans la tradition des esprits de la forêt de Miyazaki, voici une mascotte 
            qui incarne la magie cachée dans chaque ligne de code — un compagnon 
            bienveillant pour les créateurs du monde numérique.
          </p>
        </div>
        
        <!-- Mascotte principale SVG -->
        <div class="mascot-display">
          <div class="mascot-glow"></div>
          <svg class="mascot-svg" viewBox="0 0 300 400" fill="none">
            <defs>
              <!-- Gradients doux style aquarelle -->
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e8f5e9"/>
                <stop offset="50%" stop-color="#c8e6c9"/>
                <stop offset="100%" stop-color="#a5d6a7"/>
              </linearGradient>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff9c4"/>
                <stop offset="100%" stop-color="#fff59d"/>
              </linearGradient>
              <radialGradient id="cheekGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffcdd2"/>
                <stop offset="100%" stop-color="#ffcdd2" stop-opacity="0"/>
              </radialGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <!-- Aura / Halo lumineux -->
            <ellipse cx="150" cy="180" rx="100" ry="120" fill="url(#glowGrad)" opacity="0.3" class="aura-pulse"/>
            
            <!-- Corps principal - forme organique arrondie -->
            <g class="mascot-body">
              <!-- Corps -->
              <ellipse cx="150" cy="220" rx="70" ry="90" fill="url(#bodyGrad)" stroke="#81c784" stroke-width="2"/>
              
              <!-- Petites oreilles/antennes végétales -->
              <path d="M100 140 Q85 100 100 80 Q110 95 105 130" fill="#a5d6a7" stroke="#81c784" stroke-width="1.5" class="ear ear--left"/>
              <path d="M200 140 Q215 100 200 80 Q190 95 195 130" fill="#a5d6a7" stroke="#81c784" stroke-width="1.5" class="ear ear--right"/>
              
              <!-- Feuilles décoratives sur la tête -->
              <path d="M130 125 Q120 105 135 95 Q145 110 140 125" fill="#66bb6a" class="head-leaf"/>
              <path d="M160 120 Q165 95 180 90 Q175 110 165 125" fill="#4caf50" class="head-leaf"/>
              
              <!-- Visage -->
              <g class="face">
                <!-- Yeux - grands et expressifs style Ghibli -->
                <g class="eye eye--left">
                  <ellipse cx="125" cy="190" rx="18" ry="22" fill="#fff"/>
                  <ellipse cx="125" cy="192" rx="12" ry="15" fill="#3e2723"/>
                  <ellipse cx="122" cy="188" rx="5" ry="6" fill="#fff"/>
                  <ellipse cx="128" cy="195" rx="2" ry="3" fill="#fff" opacity="0.5"/>
                </g>
                <g class="eye eye--right">
                  <ellipse cx="175" cy="190" rx="18" ry="22" fill="#fff"/>
                  <ellipse cx="175" cy="192" rx="12" ry="15" fill="#3e2723"/>
                  <ellipse cx="172" cy="188" rx="5" ry="6" fill="#fff"/>
                  <ellipse cx="178" cy="195" rx="2" ry="3" fill="#fff" opacity="0.5"/>
                </g>
                
                <!-- Joues rosées -->
                <ellipse cx="100" cy="210" rx="12" ry="8" fill="url(#cheekGrad)" class="cheek"/>
                <ellipse cx="200" cy="210" rx="12" ry="8" fill="url(#cheekGrad)" class="cheek"/>
                
                <!-- Petit nez -->
                <ellipse cx="150" cy="215" rx="5" ry="4" fill="#81c784"/>
                
                <!-- Bouche souriante -->
                <path d="M135 235 Q150 250 165 235" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
              </g>
              
              <!-- Petits bras/pattes -->
              <ellipse cx="85" cy="250" rx="20" ry="15" fill="#c8e6c9" stroke="#81c784" stroke-width="1.5" class="arm arm--left"/>
              <ellipse cx="215" cy="250" rx="20" ry="15" fill="#c8e6c9" stroke="#81c784" stroke-width="1.5" class="arm arm--right"/>
              
              <!-- Pieds -->
              <ellipse cx="120" cy="310" rx="25" ry="15" fill="#c8e6c9" stroke="#81c784" stroke-width="1.5"/>
              <ellipse cx="180" cy="310" rx="25" ry="15" fill="#c8e6c9" stroke="#81c784" stroke-width="1.5"/>
              
              <!-- Symbole du code sur le ventre -->
              <g class="code-symbol" filter="url(#softGlow)">
                <text x="150" y="270" text-anchor="middle" fill="#4caf50" font-family="monospace" font-size="24" font-weight="bold">&lt;/&gt;</text>
              </g>
              
              <!-- Petites particules lumineuses autour -->
              <circle cx="80" cy="160" r="3" fill="#fff9c4" class="sparkle sparkle--1"/>
              <circle cx="220" cy="150" r="2" fill="#fff9c4" class="sparkle sparkle--2"/>
              <circle cx="100" cy="280" r="2.5" fill="#fff9c4" class="sparkle sparkle--3"/>
              <circle cx="200" cy="290" r="2" fill="#fff9c4" class="sparkle sparkle--4"/>
            </g>
          </svg>
          
          <div class="mascot-name">
            <span class="name-main">GL Spirit</span>
            <span class="name-sub">Gardien numérique</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PHILOSOPHIE -->
    <section id="main-content" class="philosophy-section" aria-labelledby="philosophy-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon" aria-hidden="true">🌸</span>
          <h2 id="philosophy-title">Philosophie du Design</h2>
        </div>
        
        <div class="philosophy-grid">
          <div class="philosophy-card">
            <div class="philosophy-card__icon" aria-hidden="true">🍃</div>
            <h3>Inspiration Naturelle</h3>
            <p>
              Comme les kodamas de Princesse Mononoké ou les esprits de Mon Voisin Totoro, 
              cette mascotte incarne le lien entre nature et technologie — rappelant que 
              le code, comme la vie, croît organiquement.
            </p>
          </div>
          
          <div class="philosophy-card">
            <div class="philosophy-card__icon" aria-hidden="true">✨</div>
            <h3>Magie du Quotidien</h3>
            <p>
              Miyazaki trouve l'émerveillement dans les moments simples. Notre esprit 
              célèbre la magie cachée dans chaque fonction, chaque algorithme — 
              transformant l'ordinateur en quelque chose de merveilleux.
            </p>
          </div>
          
          <div class="philosophy-card">
            <div class="philosophy-card__icon" aria-hidden="true">💚</div>
            <h3>Bienveillance</h3>
            <p>
              Pas de robot froid ni de mascotte corporate. Juste un compagnon chaleureux 
              qui accompagne les développeurs, célèbre leurs réussites et les réconforte 
              face aux bugs.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- PALETTE -->
    <section class="palette-section" aria-labelledby="palette-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon" aria-hidden="true">🎨</span>
          <h2 id="palette-title">Palette Ghibli</h2>
          <p class="section-desc">Des couleurs douces et naturelles, comme peintes à l'aquarelle</p>
        </div>
        
        <div class="palette-display">
          <div class="palette-row">
            <div class="color-card color-card--main">
              <div class="color-swatch" style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)"></div>
              <span class="color-name">Vert Forêt</span>
              <span class="color-codes">#E8F5E9 → #A5D6A7</span>
              <span class="color-use">Corps principal</span>
            </div>
            
            <div class="color-card">
              <div class="color-swatch" style="background: linear-gradient(135deg, #fff9c4, #fff59d)"></div>
              <span class="color-name">Lumière Douce</span>
              <span class="color-codes">#FFF9C4 → #FFF59D</span>
              <span class="color-use">Aura, particules</span>
            </div>
            
            <div class="color-card">
              <div class="color-swatch" style="background: #ffcdd2"></div>
              <span class="color-name">Rose Joues</span>
              <span class="color-codes">#FFCDD2</span>
              <span class="color-use">Joues, accents</span>
            </div>
            
            <div class="color-card">
              <div class="color-swatch" style="background: #3e2723"></div>
              <span class="color-name">Brun Profond</span>
              <span class="color-codes">#3E2723</span>
              <span class="color-use">Yeux, contours</span>
            </div>
          </div>
        </div>
        
        <div class="palette-notes">
          <div class="palette-note">
            <span class="note-icon" aria-hidden="true">🖌️</span>
            <p><strong>Rendu aquarelle :</strong> Dégradés doux, pas de contours durs, 
            transparences légères comme les arrière-plans Ghibli.</p>
          </div>
          <div class="palette-note">
            <span class="note-icon" aria-hidden="true">🌿</span>
            <p><strong>Tons naturels :</strong> Verts feuillage, jaunes soleil filtré, 
            bruns terre — la palette de la forêt de Totoro.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPRESSIONS -->
    <section class="expressions-section" aria-labelledby="expressions-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon" aria-hidden="true">😊</span>
          <h2 id="expressions-title">Expressions & Émotions</h2>
          <p class="section-desc">Comme les personnages Ghibli, notre esprit est très expressif</p>
        </div>
        
        <div class="expressions-grid">
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <ellipse cx="35" cy="45" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="35" cy="46" rx="5" ry="7" fill="#3e2723"/>
                <ellipse cx="33" cy="44" rx="2" ry="2.5" fill="#fff"/>
                <ellipse cx="65" cy="45" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="65" cy="46" rx="5" ry="7" fill="#3e2723"/>
                <ellipse cx="63" cy="44" rx="2" ry="2.5" fill="#fff"/>
                <ellipse cx="25" cy="55" rx="6" ry="4" fill="#ffcdd2"/>
                <ellipse cx="75" cy="55" rx="6" ry="4" fill="#ffcdd2"/>
                <path d="M40 65 Q50 75 60 65" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Joyeux</h3>
            <p>Code compilé avec succès !</p>
          </div>
          
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <ellipse cx="35" cy="45" rx="10" ry="12" fill="#fff"/>
                <ellipse cx="35" cy="47" rx="7" ry="9" fill="#3e2723"/>
                <ellipse cx="33" cy="44" rx="3" ry="3" fill="#fff"/>
                <ellipse cx="65" cy="45" rx="10" ry="12" fill="#fff"/>
                <ellipse cx="65" cy="47" rx="7" ry="9" fill="#3e2723"/>
                <ellipse cx="63" cy="44" rx="3" ry="3" fill="#fff"/>
                <ellipse cx="25" cy="58" rx="7" ry="5" fill="#ffcdd2"/>
                <ellipse cx="75" cy="58" rx="7" ry="5" fill="#ffcdd2"/>
                <ellipse cx="50" cy="70" rx="8" ry="6" fill="#5d4037"/>
              </svg>
            </div>
            <h3>Émerveillé</h3>
            <p>Nouvelle techno découverte !</p>
          </div>
          
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <path d="M28 42 Q35 38 42 42" fill="none" stroke="#3e2723" stroke-width="2.5" stroke-linecap="round"/>
                <path d="M58 42 Q65 38 72 42" fill="none" stroke="#3e2723" stroke-width="2.5" stroke-linecap="round"/>
                <ellipse cx="25" cy="55" rx="6" ry="4" fill="#ffcdd2"/>
                <ellipse cx="75" cy="55" rx="6" ry="4" fill="#ffcdd2"/>
                <path d="M40 68 Q50 72 60 68" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>Satisfait</h3>
            <p>Refactoring terminé ~</p>
          </div>
          
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <ellipse cx="35" cy="45" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="35" cy="48" rx="5" ry="6" fill="#3e2723"/>
                <ellipse cx="33" cy="46" rx="2" ry="2" fill="#fff"/>
                <ellipse cx="65" cy="45" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="65" cy="48" rx="5" ry="6" fill="#3e2723"/>
                <ellipse cx="63" cy="46" rx="2" ry="2" fill="#fff"/>
                <path d="M40 70 Q50 65 60 70" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/>
                <text x="75" y="35" font-size="12">💧</text>
              </svg>
            </div>
            <h3>Perplexe</h3>
            <p>Bug mystérieux détecté...</p>
          </div>
          
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <path d="M28 45 Q35 40 42 45" fill="none" stroke="#3e2723" stroke-width="2" stroke-linecap="round"/>
                <path d="M58 45 Q65 40 72 45" fill="none" stroke="#3e2723" stroke-width="2" stroke-linecap="round"/>
                <text x="50" y="68" text-anchor="middle" font-size="20">😴</text>
              </svg>
            </div>
            <h3>Endormi</h3>
            <p>En attente de commits...</p>
          </div>
          
          <div class="expression-card">
            <div class="expression-face">
              <svg viewBox="0 0 100 100" class="face-svg">
                <ellipse cx="50" cy="50" rx="40" ry="45" fill="#c8e6c9"/>
                <ellipse cx="35" cy="43" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="35" cy="45" rx="5" ry="7" fill="#3e2723"/>
                <ellipse cx="34" cy="43" rx="2" ry="2.5" fill="#fff"/>
                <ellipse cx="65" cy="43" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="65" cy="45" rx="5" ry="7" fill="#3e2723"/>
                <ellipse cx="64" cy="43" rx="2" ry="2.5" fill="#fff"/>
                <ellipse cx="25" cy="52" rx="5" ry="3" fill="#ffcdd2"/>
                <ellipse cx="75" cy="52" rx="5" ry="3" fill="#ffcdd2"/>
                <path d="M35 68 Q50 80 65 68" fill="none" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round"/>
                <text x="70" y="30" font-size="14">⭐</text>
              </svg>
            </div>
            <h3>Fier</h3>
            <p>Deploy réussi en prod !</p>
          </div>
        </div>
      </div>
    </section>

    <!-- VARIANTES -->
    <section class="variants-section" aria-labelledby="variants-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon" aria-hidden="true">🌈</span>
          <h2 id="variants-title">Variantes Saisonnières</h2>
          <p class="section-desc">Comme les films Ghibli, notre esprit change avec les saisons</p>
        </div>
        
        <div class="variants-grid">
          <div class="variant-card variant-card--spring">
            <div class="variant-preview">
              <div class="variant-mascot" style="background: linear-gradient(135deg, #f8bbd9, #f48fb1)">
                🌸
              </div>
            </div>
            <h3>Printemps</h3>
            <p>Pétales de cerisier, tons roses et verts tendres</p>
            <div class="variant-colors">
              <span style="background: #f8bbd9"></span>
              <span style="background: #f48fb1"></span>
              <span style="background: #c8e6c9"></span>
            </div>
          </div>
          
          <div class="variant-card variant-card--summer">
            <div class="variant-preview">
              <div class="variant-mascot" style="background: linear-gradient(135deg, #b3e5fc, #81d4fa)">
                🌊
              </div>
            </div>
            <h3>Été</h3>
            <p>Ciel d'été, nuages blancs, bleus rafraîchissants</p>
            <div class="variant-colors">
              <span style="background: #b3e5fc"></span>
              <span style="background: #81d4fa"></span>
              <span style="background: #fff9c4"></span>
            </div>
          </div>
          
          <div class="variant-card variant-card--autumn">
            <div class="variant-preview">
              <div class="variant-mascot" style="background: linear-gradient(135deg, #ffcc80, #ffb74d)">
                🍂
              </div>
            </div>
            <h3>Automne</h3>
            <p>Feuilles dorées, oranges chauds, bruns doux</p>
            <div class="variant-colors">
              <span style="background: #ffcc80"></span>
              <span style="background: #ffb74d"></span>
              <span style="background: #a1887f"></span>
            </div>
          </div>
          
          <div class="variant-card variant-card--winter">
            <div class="variant-preview">
              <div class="variant-mascot" style="background: linear-gradient(135deg, #e3f2fd, #bbdefb)">
                ❄️
              </div>
            </div>
            <h3>Hiver</h3>
            <p>Neige douce, bleus glacés, touches de rouge</p>
            <div class="variant-colors">
              <span style="background: #e3f2fd"></span>
              <span style="background: #bbdefb"></span>
              <span style="background: #ef9a9a"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROMPT IA -->
    <section class="prompt-section" aria-labelledby="prompt-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon" aria-hidden="true">🎨</span>
          <h2 id="prompt-title">Prompt pour Génération IA</h2>
        </div>
        
        <div class="prompt-box">
          <div class="prompt-header">
            <span class="prompt-label">✨ PROMPT GHIBLI</span>
            <button class="copy-btn" @click="copyPrompt" aria-label="Copier le prompt">
              <span v-if="!copied" aria-hidden="true">📋</span>
              <span v-if="!copied">Copier</span>
              <span v-if="copied" aria-hidden="true">✅</span>
              <span v-if="copied">Copié !</span>
            </button>
          </div>
          <pre class="prompt-content">{{ imagePrompt }}</pre>
        </div>
        
        <div class="prompt-tips">
          <h4>Conseils de génération</h4>
          <ul>
            <li><strong>Midjourney :</strong> Ajouter <code>--niji 6</code> pour le mode anime</li>
            <li><strong>Style :</strong> Éviter les détails trop complexes, garder la simplicité Ghibli</li>
            <li><strong>Couleurs :</strong> Demander des tons pastels, aquarelle, naturels</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-box">
          <div class="cta-mascot" aria-hidden="true">✨🌿✨</div>
          <h2 id="cta-title">Donnons vie à cet esprit</h2>
          <p>
            Cette mascotte peut devenir illustration, animation, 
            stickers, avatar — un compagnon pour votre projet.
          </p>
          <router-link to="/contact" class="cta-btn">
            Discutons ensemble 🍃
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const copied = ref(false);

const imagePrompt = `Studio Ghibli style mascot character, cute forest spirit creature, simple round organic body shape.

STYLE: Hayao Miyazaki aesthetic, soft watercolor textures, gentle gradients, no hard edges. Like Totoro meets a kodama.

COLORS: Soft sage green body (#C8E6C9), warm yellow glow (#FFF9C4), pink rosy cheeks (#FFCDD2), deep brown eyes (#3E2723). Natural forest palette.

FEATURES:
- Round, plump body like a friendly spirit
- Very large expressive eyes (Ghibli signature style)
- Small leaf-like ears or antennae
- Tiny stub arms and feet
- Rosy cheeks
- Gentle smile
- Small "</>" code symbol on belly (subtle, glowing)
- Floating sparkles and leaves around

MOOD: Warm, welcoming, magical but approachable. The kind of creature that would help you debug your code at 3am.

BACKGROUND: Simple, soft gradient or transparent. Maybe a few floating leaves.

NO: Sharp edges, complex machinery, dark colors, scary elements, realistic proportions.

--ar 1:1 --niji 6 --stylize 500`;

const copyPrompt = async () => {
  try {
    await navigator.clipboard.writeText(imagePrompt);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Erreur copie:', err);
  }
};
</script>

<style scoped>
/* =====================================================
   GHIBLI MASCOT PAGE
   ===================================================== */
.ghibli-mascot-page {
  background: linear-gradient(180deg, #f1f8e9 0%, #e8f5e9 50%, #dcedc8 100%);
  color: #3e2723;
  min-height: 100vh;
  padding-top: 80px;
}

/* =====================================================
   HERO
   ===================================================== */
.ghibli-hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding: 4rem 0;
  overflow: hidden;
}

.ghibli-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Nuages flottants */
.clouds {
  position: absolute;
  width: 200px;
  height: 60px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50px;
  filter: blur(2px);
}

.clouds::before,
.clouds::after {
  content: '';
  position: absolute;
  background: inherit;
  border-radius: 50%;
}

.clouds::before {
  width: 70px;
  height: 70px;
  top: -30px;
  left: 30px;
}

.clouds::after {
  width: 50px;
  height: 50px;
  top: -20px;
  right: 40px;
}

.clouds--1 {
  top: 15%;
  left: 10%;
  animation: cloud-float 25s ease-in-out infinite;
}

.clouds--2 {
  top: 25%;
  right: 15%;
  animation: cloud-float 30s ease-in-out infinite reverse;
  opacity: 0.6;
}

.clouds--3 {
  bottom: 30%;
  left: 5%;
  animation: cloud-float 35s ease-in-out infinite;
  opacity: 0.5;
  transform: scale(0.7);
}

@keyframes cloud-float {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
}

/* Feuilles flottantes */
.floating-leaves {
  position: absolute;
  inset: 0;
}

.leaf {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.6;
  animation: leaf-fall 15s ease-in-out infinite;
}

.leaf--1 { top: 10%; left: 20%; animation-delay: 0s; }
.leaf--2 { top: 30%; right: 25%; animation-delay: 3s; }
.leaf--3 { bottom: 40%; left: 15%; animation-delay: 6s; }
.leaf--4 { bottom: 20%; right: 20%; animation-delay: 9s; }

@keyframes leaf-fall {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(20px) rotate(15deg); 
    opacity: 0.8;
  }
}

.ghibli-hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.spirit-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.spirit-badge__icon {
  font-size: 1.25rem;
}

.spirit-badge__text {
  font-size: 0.85rem;
  color: #558b2f;
  font-weight: 500;
}

.ghibli-hero__title {
  margin-bottom: 1.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 300;
  color: #33691e;
  font-family: 'Georgia', serif;
}

.title-jp {
  display: block;
  font-size: 1.5rem;
  color: #689f38;
  margin: 0.5rem 0;
  letter-spacing: 0.2em;
}

.title-sub {
  display: block;
  font-size: 1.1rem;
  color: #7cb342;
  font-style: italic;
}

.ghibli-hero__intro {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #5d4037;
  max-width: 500px;
}

/* Mascotte Display */
.mascot-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.mascot-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 249, 196, 0.5) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.mascot-svg {
  width: 280px;
  height: 380px;
  position: relative;
  z-index: 2;
}

.aura-pulse {
  animation: aura-breathe 4s ease-in-out infinite;
}

@keyframes aura-breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

.ear {
  transform-origin: bottom center;
  animation: ear-wiggle 3s ease-in-out infinite;
}

.ear--right {
  animation-delay: 0.5s;
}

@keyframes ear-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(3deg); }
  75% { transform: rotate(-3deg); }
}

.sparkle {
  animation: sparkle-twinkle 2s ease-in-out infinite;
}

.sparkle--1 { animation-delay: 0s; }
.sparkle--2 { animation-delay: 0.5s; }
.sparkle--3 { animation-delay: 1s; }
.sparkle--4 { animation-delay: 1.5s; }

@keyframes sparkle-twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.mascot-name {
  text-align: center;
  margin-top: 1.5rem;
}

.name-main {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: #33691e;
}

.name-sub {
  display: block;
  font-size: 0.85rem;
  color: #689f38;
}

/* =====================================================
   SECTIONS COMMUNES
   ===================================================== */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #33691e;
  font-weight: 400;
  font-family: 'Georgia', serif;
}

.section-desc {
  font-size: 1rem;
  color: #689f38;
  margin-top: 0.5rem;
}

/* =====================================================
   PHILOSOPHIE
   ===================================================== */
.philosophy-section {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.5);
}

.philosophy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.philosophy-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1.5rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.philosophy-card:hover {
  transform: translateY(-5px);
}

.philosophy-card__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.philosophy-card h3 {
  font-size: 1.25rem;
  color: #33691e;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.philosophy-card p {
  font-size: 0.95rem;
  color: #5d4037;
  line-height: 1.7;
}

/* =====================================================
   PALETTE
   ===================================================== */
.palette-section {
  padding: 5rem 0;
}

.palette-display {
  margin-bottom: 2rem;
}

.palette-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.color-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
}

.color-swatch {
  height: 100px;
}

.color-card span {
  display: block;
  padding: 0.25rem 1rem;
}

.color-name {
  font-weight: 600;
  color: #33691e;
  padding-top: 0.75rem !important;
}

.color-codes {
  font-family: monospace;
  font-size: 0.75rem;
  color: #689f38;
}

.color-use {
  font-size: 0.8rem;
  color: #8d6e63;
  padding-bottom: 0.75rem !important;
}

.palette-notes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-note {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.75rem;
}

.note-icon {
  font-size: 1.25rem;
}

.palette-note p {
  font-size: 0.9rem;
  color: #5d4037;
  line-height: 1.6;
}

/* =====================================================
   EXPRESSIONS
   ===================================================== */
.expressions-section {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.5);
}

.expressions-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
}

.expression-card {
  text-align: center;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.expression-card:hover {
  transform: translateY(-3px);
}

.expression-face {
  margin-bottom: 1rem;
}

.face-svg {
  width: 80px;
  height: 80px;
}

.expression-card h3 {
  font-size: 1rem;
  color: #33691e;
  margin-bottom: 0.25rem;
}

.expression-card p {
  font-size: 0.75rem;
  color: #8d6e63;
}

/* =====================================================
   VARIANTES
   ===================================================== */
.variants-section {
  padding: 5rem 0;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.variant-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.variant-card:hover {
  transform: translateY(-5px);
}

.variant-preview {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%);
}

.variant-mascot {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.variant-card h3 {
  font-size: 1.1rem;
  color: #33691e;
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
}

.variant-card p {
  font-size: 0.85rem;
  color: #8d6e63;
  padding: 0 1.5rem;
  line-height: 1.5;
}

.variant-colors {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
}

.variant-colors span {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* =====================================================
   PROMPT
   ===================================================== */
.prompt-section {
  padding: 5rem 0;
  background: rgba(255, 255, 255, 0.5);
}

.prompt-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.prompt-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #33691e;
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 1px solid #81c784;
  color: #33691e;
  border-radius: 2rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #33691e;
  color: #fff;
}

.prompt-content {
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.8;
  color: #5d4037;
  white-space: pre-wrap;
  margin: 0;
  background: #fafafa;
}

.prompt-tips {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
}

.prompt-tips h4 {
  font-size: 1rem;
  color: #33691e;
  margin-bottom: 1rem;
}

.prompt-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.prompt-tips li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #5d4037;
}

.prompt-tips code {
  background: #e8f5e9;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  font-family: monospace;
  color: #33691e;
}

/* =====================================================
   CTA
   ===================================================== */
.cta-section {
  padding: 5rem 0;
}

.cta-box {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.cta-mascot {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-box h2 {
  font-size: 1.75rem;
  color: #33691e;
  font-weight: 400;
  font-family: 'Georgia', serif;
  margin-bottom: 0.75rem;
}

.cta-box p {
  color: #5d4037;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.cta-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #81c784, #66bb6a);
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 2rem;
  box-shadow: 0 4px 15px rgba(102, 187, 106, 0.3);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 187, 106, 0.4);
}

/* =====================================================
   RESPONSIVE
   ===================================================== */
@media (max-width: 1024px) {
  .ghibli-hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .ghibli-hero__intro {
    margin: 0 auto;
  }
  
  .philosophy-grid {
    grid-template-columns: 1fr;
  }
  
  .expressions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .variants-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .palette-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .expressions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .variants-grid {
    grid-template-columns: 1fr;
  }
  
  .mascot-svg {
    width: 200px;
    height: 280px;
  }
}
</style>
