<template>
  <div class="garden-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- AMBIENT : Petals falling -->
    <div class="garden-ambient" aria-hidden="true">
      <div class="floating-petals">
        <span class="petal petal--1">🌸</span>
        <span class="petal petal--2">🪻</span>
        <span class="petal petal--3">🌺</span>
        <span class="petal petal--4">🌸</span>
        <span class="petal petal--5">🪻</span>
      </div>
      <div class="garden-light"></div>
    </div>

    <!-- HERO -->
    <section id="main-content" class="garden-hero" aria-labelledby="hero-title">
      <div class="container">
        <div class="hero-badge">
          <span class="badge-flower">🌺</span>
          <span class="badge-text">Pour Mam', avec amour</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-main">Le Jardin de Mam'</span>
          <span class="title-sub">Là où les dahlias fleurissent et où tout finit par aller</span>
        </h1>

        <p class="hero-intro">
          Une page pour faire pousser ses conseils, ses fleurs et ses souvenirs.
          Parce qu'un jardin, c'est bien plus que de la terre et des graines —
          c'est tout ce qu'on y a semé d'amour et de petites phrases qu'on n'oublie jamais.
        </p>

        <button class="hero-cta" @click="scrollToContent">
          <span>Entrer dans le jardin</span>
          <span class="cta-icon">🌿</span>
        </button>
      </div>
    </section>

    <!-- QUI EST MAM' -->
    <section id="portrait" class="portrait-section" aria-labelledby="portrait-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon">☕</span>
          <h2 id="portrait-title">Qui est Mam' au jardin ?</h2>
        </div>

        <div class="portrait-content">
          <div class="portrait-card">
            <div class="card-decoration">
              <span class="dahlia">🌺</span>
            </div>
            <div class="card-text">
              <p>
                Mam' — ou <em>"Oui Mère"</em> comme on dit avec ce ton de la haute société 
                qui la fait sourire — c'est celle qui commence chaque journée 
                avec son café au lit. Un rituel sacré. Et puis, invariablement, 
                cette phrase qui revient comme une évidence :
              </p>
              
              <blockquote class="mam-quote">
                « J'ai mon jardin à faire. »
              </blockquote>

              <p>
                Son jardin, c'est son royaume. Son refuge. L'endroit où tout peut 
                être réparé, où tout finit par pousser, où les problèmes 
                semblent moins graves une fois les mains dans la terre.
              </p>

              <p>
                Elle aime particulièrement les <strong>dahlias</strong> — ces fleurs généreuses 
                aux mille pétales qui explosent de couleurs à la fin de l'été. 
                Elle les bichonne, les tuteure, les protège du gel. 
                Et quand quelque chose ne va pas, elle a toujours la même réponse, 
                répétée comme un mantra apaisant :
              </p>

              <blockquote class="mam-quote mam-quote--main">
                « Ça va aller ! Ça va aller. »
              </blockquote>

              <p>
                Et bizarrement, avec elle, ça finit toujours par aller.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SI J'AVAIS UN MARTEAU -->
    <section class="marteau-section" aria-labelledby="marteau-title">
      <div class="container">
        <div class="section-header section-header--marteau">
          <span class="section-icon">🔨</span>
          <h2 id="marteau-title">Si j'avais un marteau...</h2>
          <p class="section-subtitle">La chanson qu'elle adore</p>
        </div>

        <div class="marteau-content">
          <div class="marteau-card">
            <div class="marteau-visual">
              <span class="marteau-emoji">🔨</span>
              <span class="note note--1">🎵</span>
              <span class="note note--2">🎶</span>
              <span class="note note--3">🎵</span>
            </div>
            
            <div class="marteau-text">
              <p>
                Il y a des chansons qui collent à une personne. Pour Mam', 
                c'est <strong>"Si j'avais un marteau"</strong> de Claude François. 
                Cette chanson joyeuse et pleine d'énergie qui parle de construire, 
                de réparer, de faire du bruit pour dire qu'on est là.
              </p>
              
              <blockquote class="marteau-lyrics">
                🎵 Si j'avais un marteau, je cognerais le jour,<br>
                je cognerais la nuit, j'y mettrais tout mon cœur... 🎵
              </blockquote>

              <p>
                Quand elle l'entend, ses yeux s'illuminent. Elle fredonne, 
                elle tape du pied, et pendant quelques minutes, 
                elle redevient cette jeune femme qui croit que tout est possible 
                avec un bon marteau et de la bonne volonté.
              </p>

              <div class="marteau-message">
                <p>
                  🔨 <em>Mam', si j'avais un marteau, je te construirais 
                  le plus beau jardin du monde. En attendant, 
                  je te construis cette page.</em>
                </p>
              </div>

              <div class="marteau-link">
                <a 
                  href="https://www.youtube.com/watch?v=pN5BTkyOoFo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="youtube-btn"
                >
                  <span class="btn-icon">▶️</span>
                  <span>Écouter sur YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LA BELLE BÂTISSE -->
    <section class="batisse-section" aria-labelledby="batisse-title">
      <div class="container">
        <div class="section-header section-header--alt">
          <span class="section-icon">🏠</span>
          <h2 id="batisse-title">La belle bâtisse</h2>
          <p class="section-subtitle">Une métaphore qu'on n'oublie pas</p>
        </div>

        <div class="batisse-content">
          <div class="batisse-card">
            <div class="batisse-visual">
              <div class="house-icon">🏚️</div>
              <div class="arrow">→</div>
              <div class="house-icon house-icon--renovated">🏡</div>
            </div>
            
            <div class="batisse-text">
              <p class="batisse-intro">
                Dans la famille, on a cette façon de dire les choses importantes avec humour, 
                pour que ça passe mieux. Un jour, je lui ai dit :
              </p>

              <blockquote class="batisse-quote">
                « T'es une belle bâtisse, mais il serait temps de commencer 
                les travaux de rénovation. La toiture fuit, la cave prend l'eau, 
                et la façade est bonne pour un ravalement. »
              </blockquote>

              <p class="batisse-reply">
                Et mon cousin, dans un éclair de lucidité, a ajouté :
              </p>

              <blockquote class="batisse-quote batisse-quote--reply">
                « Oui, et en plus l'électricité est à refaire — elle pète les plombs. »
              </blockquote>

              <p class="batisse-moral">
                On a ri. Mais le message est passé. Prendre soin de soi, 
                c'est comme entretenir une maison : ça demande de l'attention, 
                de la patience, et parfois des gros travaux. 
                <strong>On y travaille, Mam'.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SES CONSEILS -->
    <section class="conseils-section" aria-labelledby="conseils-title">
      <div class="container">
        <div class="section-header">
          <span class="section-icon">🌱</span>
          <h2 id="conseils-title">Ses conseils de jardinage</h2>
          <p class="section-subtitle">Ce qu'elle répète, saison après saison</p>
        </div>

        <div class="conseils-grid">
          <div class="conseil-card">
            <div class="conseil-number">01</div>
            <h3>« Ça va aller, ça va aller »</h3>
            <p class="conseil-pratique">
              Face à une plante qui fait la tête, un semis qui ne lève pas, 
              une gelée tardive qui a tout grillé... Ne pas paniquer. 
              La nature est plus résistante qu'on ne le croit.
            </p>
            <p class="conseil-note">
              <em>Elle dit ça en arrosant tranquillement, comme si les plantes 
              l'entendaient et se rassuraient aussi.</em>
            </p>
          </div>

          <div class="conseil-card">
            <div class="conseil-number">02</div>
            <h3>« J'ai mon jardin à faire »</h3>
            <p class="conseil-pratique">
              Avoir un rituel. Un moment sacré dans la journée où on sort, 
              on observe, on touche la terre. Même 10 minutes. 
              C'est ça qui crée le lien avec le jardin.
            </p>
            <p class="conseil-note">
              <em>Pour elle, c'est après le café. Immuable.</em>
            </p>
          </div>

          <div class="conseil-card">
            <div class="conseil-number">03</div>
            <h3>Les dahlias, c'est la récompense</h3>
            <p class="conseil-pratique">
              Planter les tubercules après les dernières gelées (mi-mai). 
              Sol riche, soleil généreux, arrosage régulier. 
              Tuteurer les grandes variétés. Pincer les tiges pour plus de fleurs.
            </p>
            <p class="conseil-note">
              <em>Elle les attend tout l'été. Quand ils explosent en août, 
              c'est la fête.</em>
            </p>
          </div>

          <div class="conseil-card">
            <div class="conseil-number">04</div>
            <h3>Observer avant d'agir</h3>
            <p class="conseil-pratique">
              Avant de planter, regarder où va le soleil, où stagne l'eau, 
              où le vent souffle. Le jardin vous parle, il suffit d'écouter.
            </p>
            <p class="conseil-note">
              <em>Elle peut rester des heures à simplement regarder son jardin, 
              café à la main.</em>
            </p>
          </div>

          <div class="conseil-card">
            <div class="conseil-number">05</div>
            <h3>Un jardin, ça se mérite</h3>
            <p class="conseil-pratique">
              Pas de raccourcis. La patience est la première qualité du jardinier. 
              Ce qui pousse lentement pousse bien.
            </p>
            <p class="conseil-note">
              <em>Comme les travaux de rénovation d'une belle bâtisse...</em>
            </p>
          </div>

          <div class="conseil-card">
            <div class="conseil-number">06</div>
            <h3>Plante ce qui te fait sourire</h3>
            <p class="conseil-pratique">
              Inutile de suivre les tendances. Le plus beau jardin est celui 
              qui te ressemble. Plante tes couleurs, tes odeurs, tes souvenirs.
            </p>
            <p class="conseil-note">
              <em>Pour elle, c'est les dahlias. Pour toi, ce sera peut-être 
              autre chose. Et c'est parfait comme ça.</em>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- LES DAHLIAS -->
    <section class="dahlias-section" aria-labelledby="dahlias-title">
      <div class="container">
        <div class="section-header section-header--dahlia">
          <span class="section-icon">🌺</span>
          <h2 id="dahlias-title">Les Dahlias de Mam'</h2>
          <p class="section-subtitle">Sa fleur fétiche, celle qui lui ressemble</p>
        </div>

        <div class="dahlia-showcase">
          <div class="dahlia-intro">
            <p>
              Le dahlia, c'est une fleur qui ne fait pas les choses à moitié. 
              Généreuse, colorée, un peu exubérante — elle explose de pétales 
              comme une célébration permanente. Pas étonnant que Mam' l'ait choisie.
            </p>
          </div>

          <div class="dahlia-types">
            <div class="dahlia-type">
              <div class="type-visual">🌺</div>
              <h4>Dahlia Décoratif</h4>
              <p>Grosses fleurs doubles aux pétales larges et plats. Le classique majestueux.</p>
            </div>
            <div class="dahlia-type">
              <div class="type-visual">🎆</div>
              <h4>Dahlia Cactus</h4>
              <p>Pétales enroulés comme des flammes. Spectaculaire et un brin rebelle.</p>
            </div>
            <div class="dahlia-type">
              <div class="type-visual">🌼</div>
              <h4>Dahlia Pompon</h4>
              <p>Petites boules parfaites. Mignon et résistant.</p>
            </div>
            <div class="dahlia-type">
              <div class="type-visual">⭐</div>
              <h4>Dahlia Étoile</h4>
              <p>Simple mais élégant. La discrétion lumineuse.</p>
            </div>
          </div>

          <div class="dahlia-tips">
            <h4>📋 Fiche culture rapide</h4>
            <ul>
              <li><strong>Plantation :</strong> Mi-mai, après les Saints de Glace</li>
              <li><strong>Exposition :</strong> Plein soleil (6h minimum)</li>
              <li><strong>Sol :</strong> Riche, drainé, enrichi de compost</li>
              <li><strong>Arrosage :</strong> Régulier, sans mouiller le feuillage</li>
              <li><strong>Floraison :</strong> Juillet à octobre (le bonheur !)</li>
              <li><strong>Hivernage :</strong> Déterrer les tubercules avant le gel, stocker au sec</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- MERCI MAM' -->
    <section class="merci-section" aria-labelledby="merci-title">
      <div class="container">
        <div class="merci-content">
          <div class="merci-visual">
            <span class="big-dahlia">🌺</span>
          </div>

          <h2 id="merci-title">Merci, Mam'</h2>

          <div class="merci-text">
            <p>
              Merci pour le café du matin. Pour les dahlias qui explosent en août. 
              Pour les <em>"ça va aller"</em> qui finissent toujours par être vrais.
            </p>
            <p>
              Et merci d'avoir ri à notre métaphore de la belle bâtisse — 
              on continue les travaux, promis. La toiture ne fuit presque plus, 
              et l'électricité tient le coup.
            </p>
            <p>
              Et merci pour ce jardin que tu m'apprends à aimer. 
              Chaque fois que je plante quelque chose, c'est un peu de toi qui repousse.
            </p>
          </div>

          <blockquote class="final-quote">
            « J'ai mon jardin à faire. »
            <cite>— Mam', chaque jour</cite>
          </blockquote>

          <p class="merci-closing">
            Moi aussi maintenant. Et je pense à toi à chaque coup de bêche. 💚
          </p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="garden-footer">
      <div class="container">
        <p class="footer-tagline">
          🌺 Un jardin pour Mam' — Là où tout finit par aller 🌺
        </p>
        <router-link to="/" class="footer-back">
          ← Retour au portfolio
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script setup>
const scrollToContent = () => {
  document.getElementById('portrait')?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.garden-page {
  --cream: #fef9f3;
  --sage: #7d9d74;
  --sage-dark: #5a7a52;
  --terracotta: #c9735b;
  --dahlia: #d64c7a;
  --dahlia-light: #e8a4b8;
  --earth: #6b5344;
  --gold: #d4a03c;
  --text: #3d3d3d;
  --text-light: #666;
  
  background: var(--cream);
  color: var(--text);
  min-height: 100vh;
  padding-top: 80px; /* Header nav */
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.8;
}

/* AMBIENT */
.garden-ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.floating-petals {
  position: absolute;
  inset: 0;
}

.petal {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.4;
  animation: petal-fall 15s linear infinite;
}

.petal--1 { left: 10%; animation-delay: 0s; }
.petal--2 { left: 30%; animation-delay: 3s; }
.petal--3 { left: 50%; animation-delay: 6s; }
.petal--4 { left: 70%; animation-delay: 9s; }
.petal--5 { left: 90%; animation-delay: 12s; }

@keyframes petal-fall {
  0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

.garden-light {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse, rgba(254, 249, 243, 0.8) 0%, transparent 70%);
}

/* CONTAINER */
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* HERO */
.garden-hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 6rem 0;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: rgba(125, 157, 116, 0.15);
  border: 1px solid var(--sage);
  border-radius: 2rem;
  margin-bottom: 2rem;
}

.badge-flower { font-size: 1.25rem; }

.badge-text {
  font-size: 0.85rem;
  color: var(--sage-dark);
  letter-spacing: 0.05em;
}

.hero-title { margin-bottom: 2rem; }

.title-main {
  display: block;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 400;
  color: var(--dahlia);
  margin-bottom: 0.5rem;
}

.title-sub {
  display: block;
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--text-light);
  font-style: italic;
}

.hero-intro {
  font-size: 1.15rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--sage);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-cta:hover {
  background: var(--sage-dark);
  transform: translateY(-2px);
}

/* SECTION HEADER */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 400;
  color: var(--earth);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--text-light);
  font-style: italic;
}

.section-header--alt h2 { color: var(--terracotta); }
.section-header--dahlia h2 { color: var(--dahlia); }
.section-header--marteau h2 { color: var(--gold); }

/* PORTRAIT SECTION */
.portrait-section {
  padding: 6rem 0;
  position: relative;
  z-index: 1;
}

.portrait-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  position: relative;
}

.card-decoration {
  position: absolute;
  top: -20px;
  right: 30px;
}

.dahlia { font-size: 3rem; }

.card-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.card-text p:last-child { margin-bottom: 0; }

.mam-quote {
  font-size: 1.5rem;
  font-style: italic;
  color: var(--sage-dark);
  text-align: center;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-left: 4px solid var(--sage);
  background: rgba(125, 157, 116, 0.08);
}

.mam-quote--main {
  font-size: 1.75rem;
  color: var(--dahlia);
  border-left-color: var(--dahlia);
  background: rgba(214, 76, 122, 0.08);
}

/* MARTEAU SECTION */
.marteau-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, transparent, rgba(212, 160, 60, 0.08));
  position: relative;
  z-index: 1;
}

.marteau-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.marteau-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(212, 160, 60, 0.1), rgba(212, 160, 60, 0.05));
  border-radius: 0.5rem;
  position: relative;
}

.marteau-emoji {
  font-size: 4rem;
  animation: hammer-swing 1.5s ease-in-out infinite;
}

@keyframes hammer-swing {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

.note {
  font-size: 1.5rem;
  position: absolute;
  animation: note-float 2s ease-in-out infinite;
}

.note--1 { top: 20%; right: 25%; animation-delay: 0s; }
.note--2 { top: 30%; left: 25%; animation-delay: 0.5s; }
.note--3 { bottom: 25%; right: 30%; animation-delay: 1s; }

@keyframes note-float {
  0%, 100% { transform: translateY(0) rotate(-10deg); opacity: 0.6; }
  50% { transform: translateY(-10px) rotate(10deg); opacity: 1; }
}

.marteau-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  text-align: center;
}

.marteau-lyrics {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--gold);
  text-align: center;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-left: 4px solid var(--gold);
  background: rgba(212, 160, 60, 0.08);
}

.marteau-message {
  background: rgba(125, 157, 116, 0.1);
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

.marteau-message p {
  margin: 0;
  font-size: 1.1rem;
}

.marteau-link {
  text-align: center;
  margin-top: 2rem;
}

.youtube-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #ff0000;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.youtube-btn:hover {
  background: #cc0000;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.2);
}

.btn-icon { font-size: 1.25rem; }

/* BÂTISSE SECTION */
.batisse-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, transparent, rgba(201, 115, 91, 0.05));
  position: relative;
  z-index: 1;
}

.batisse-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.batisse-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(201, 115, 91, 0.08);
  border-radius: 0.5rem;
}

.house-icon { font-size: 4rem; }

.house-icon--renovated {
  animation: gentle-glow 2s ease-in-out infinite;
}

@keyframes gentle-glow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.arrow {
  font-size: 2rem;
  color: var(--terracotta);
}

.batisse-text p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.batisse-intro { text-align: center; }

.batisse-quote {
  font-size: 1.15rem;
  font-style: italic;
  color: var(--earth);
  padding: 1.5rem 2rem;
  margin: 1.5rem 0;
  border-left: 4px solid var(--terracotta);
  background: rgba(201, 115, 91, 0.08);
}

.batisse-quote--reply {
  border-left-color: var(--sage);
  background: rgba(125, 157, 116, 0.08);
  color: var(--sage-dark);
}

.batisse-reply {
  text-align: center;
  font-style: italic;
}

.batisse-moral {
  text-align: center;
  font-size: 1.15rem;
}

/* CONSEILS SECTION */
.conseils-section {
  padding: 6rem 0;
  position: relative;
  z-index: 1;
}

.conseils-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.conseil-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.conseil-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.conseil-number {
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--dahlia-light);
  margin-bottom: 0.5rem;
}

.conseil-card h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--sage-dark);
  margin-bottom: 1rem;
}

.conseil-pratique {
  font-size: 0.95rem;
  color: var(--text);
  margin-bottom: 1rem;
}

.conseil-note {
  font-size: 0.85rem;
  color: var(--text-light);
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* DAHLIAS SECTION */
.dahlias-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, transparent, rgba(214, 76, 122, 0.05));
  position: relative;
  z-index: 1;
}

.dahlia-showcase {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

.dahlia-intro {
  text-align: center;
  font-size: 1.15rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.dahlia-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.dahlia-type {
  text-align: center;
  padding: 1.5rem;
  background: rgba(214, 76, 122, 0.05);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.dahlia-type:hover {
  background: rgba(214, 76, 122, 0.1);
  transform: translateY(-3px);
}

.type-visual {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.dahlia-type h4 {
  font-size: 1rem;
  color: var(--dahlia);
  margin-bottom: 0.5rem;
}

.dahlia-type p {
  font-size: 0.85rem;
  color: var(--text-light);
}

.dahlia-tips {
  background: rgba(125, 157, 116, 0.1);
  padding: 2rem;
  border-radius: 0.75rem;
}

.dahlia-tips h4 {
  font-size: 1.1rem;
  color: var(--sage-dark);
  margin-bottom: 1rem;
}

.dahlia-tips ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
}

.dahlia-tips li {
  font-size: 0.95rem;
  padding-left: 1.5rem;
  position: relative;
}

.dahlia-tips li::before {
  content: '🌱';
  position: absolute;
  left: 0;
  font-size: 0.8rem;
}

/* MERCI SECTION */
.merci-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, transparent, rgba(214, 76, 122, 0.08));
  position: relative;
  z-index: 1;
}

.merci-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.merci-visual { margin-bottom: 2rem; }

.big-dahlia {
  font-size: 5rem;
  display: inline-block;
  animation: gentle-sway 3s ease-in-out infinite;
}

@keyframes gentle-sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.merci-section h2 {
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--dahlia);
  margin-bottom: 2rem;
}

.merci-text p {
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
}

.final-quote {
  font-size: 1.5rem;
  font-style: italic;
  color: var(--sage-dark);
  margin: 3rem 0;
  padding: 2rem;
  background: rgba(125, 157, 116, 0.1);
  border-radius: 0.5rem;
}

.final-quote cite {
  display: block;
  font-size: 1rem;
  margin-top: 1rem;
  color: var(--text-light);
}

.merci-closing {
  font-size: 1.25rem;
  color: var(--earth);
  font-weight: 500;
}

/* FOOTER */
.garden-footer {
  padding: 4rem 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-tagline {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.footer-back {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  color: var(--sage-dark);
  text-decoration: none;
  border: 1px solid var(--sage);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.footer-back:hover {
  background: var(--sage);
  color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .portrait-card,
  .batisse-card,
  .dahlia-showcase,
  .marteau-card {
    padding: 2rem;
  }
  
  .batisse-visual {
    flex-direction: column;
  }
  
  .arrow {
    transform: rotate(90deg);
  }
  
  .mam-quote,
  .mam-quote--main,
  .marteau-lyrics {
    font-size: 1.25rem;
    padding: 1rem 1.5rem;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .petal,
  .big-dahlia,
  .house-icon--renovated,
  .marteau-emoji,
  .note {
    animation: none !important;
  }
}
</style>
