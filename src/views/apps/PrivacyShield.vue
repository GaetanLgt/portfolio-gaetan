<template>
  <div class="privacy-shield">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">🎓 Formation Cybersécurité</span>
        <h1>🛡️ Privacy Shield</h1>
        <p class="hero-subtitle">Maîtrisez votre vie privée numérique en 7 modules interactifs</p>
        <div class="hero-stats">
          <div class="stat"><span class="stat-value">7</span><span class="stat-label">Modules</span></div>
          <div class="stat"><span class="stat-value">~45</span><span class="stat-label">Minutes</span></div>
          <div class="stat"><span class="stat-value">{{ totalProgress }}%</span><span class="stat-label">Complété</span></div>
        </div>
        <button class="btn-start" @click="started = true; scrollToModules()">
          {{ started ? '📚 Continuer' : '🚀 Commencer' }}
        </button>
      </div>
    </section>

    <!-- MODULES -->
    <section class="modules-section" id="modules" v-if="started">
      <h2>📚 Les 7 Modules</h2>
      <div class="modules-grid">
        <div v-for="(mod, i) in modules" :key="mod.id" class="module-card" :class="{ completed: mod.completed, locked: i > 0 && !modules[i-1].completed }" @click="openModule(mod, i)">
          <span class="module-icon">{{ mod.icon }}</span>
          <div class="module-info">
            <h3>{{ mod.title }}</h3>
            <p>{{ mod.description }}</p>
            <span class="module-duration">⏱️ {{ mod.duration }}</span>
          </div>
          <div class="module-status">
            <span v-if="mod.completed">✅</span>
            <span v-else-if="i > 0 && !modules[i-1].completed">🔒</span>
            <span v-else>{{ mod.progress }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MODULE CONTENT -->
    <section class="module-content" v-if="activeModule">
      <button class="btn-back" @click="activeModule = null">← Retour</button>
      <h2>{{ currentModule?.icon }} {{ currentModule?.title }}</h2>

      <!-- MODULE 1: PASSWORDS -->
      <div v-if="activeModule === 'passwords'" class="module-body">
        <div class="intro-box">
          <p>Un mot de passe fort est votre première ligne de défense. Apprenez à créer et gérer vos accès en sécurité.</p>
        </div>

        <div class="tool-card">
          <h3>🔍 Testeur de mot de passe</h3>
          <div class="input-group">
            <input :type="showPwd ? 'text' : 'password'" v-model="pwdTest" placeholder="Entrez un mot de passe...">
            <button @click="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁️' }}</button>
          </div>
          <div class="strength-bar" v-if="pwdTest">
            <div class="strength-fill" :class="pwdStrength.class" :style="{ width: pwdStrength.percent + '%' }"></div>
          </div>
          <div class="strength-info" v-if="pwdTest">
            <span :class="pwdStrength.class">{{ pwdStrength.label }}</span>
            <span>⏱️ {{ pwdStrength.crackTime }}</span>
          </div>
          <ul class="pwd-checklist" v-if="pwdTest">
            <li :class="{ ok: pwdTest.length >= 12 }">{{ pwdTest.length >= 12 ? '✅' : '❌' }} 12+ caractères</li>
            <li :class="{ ok: /[A-Z]/.test(pwdTest) }">{{ /[A-Z]/.test(pwdTest) ? '✅' : '❌' }} Majuscule</li>
            <li :class="{ ok: /[a-z]/.test(pwdTest) }">{{ /[a-z]/.test(pwdTest) ? '✅' : '❌' }} Minuscule</li>
            <li :class="{ ok: /[0-9]/.test(pwdTest) }">{{ /[0-9]/.test(pwdTest) ? '✅' : '❌' }} Chiffre</li>
            <li :class="{ ok: /[^A-Za-z0-9]/.test(pwdTest) }">{{ /[^A-Za-z0-9]/.test(pwdTest) ? '✅' : '❌' }} Symbole</li>
          </ul>
        </div>

        <div class="tool-card">
          <h3>⚙️ Générateur de mot de passe</h3>
          <label>Longueur : {{ genLength }} <input type="range" v-model="genLength" min="8" max="32"></label>
          <div class="gen-options">
            <label><input type="checkbox" v-model="genOpts.upper"> A-Z</label>
            <label><input type="checkbox" v-model="genOpts.lower"> a-z</label>
            <label><input type="checkbox" v-model="genOpts.nums"> 0-9</label>
            <label><input type="checkbox" v-model="genOpts.symbols"> !@#</label>
          </div>
          <div class="gen-result">
            <code>{{ generatedPwd || 'Cliquez Générer' }}</code>
            <button @click="generatePwd">🎲 Générer</button>
            <button v-if="generatedPwd" @click="copyPwd">📋</button>
          </div>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.passwords" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('passwords', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('passwords')" class="btn-complete" @click="complete('passwords')">✅ Valider</button>
        </div>
      </div>

      <!-- MODULE 2: SOCIAL -->
      <div v-if="activeModule === 'social'" class="module-body">
        <div class="intro-box">
          <p>Les réseaux sociaux collectent énormément de données. Apprenez à maîtriser ce que vous partagez.</p>
        </div>

        <div class="tool-card">
          <h3>✅ Checklist confidentialité</h3>
          <div class="checklist">
            <label v-for="(item, i) in socialChecklist" :key="i"><input type="checkbox" v-model="item.checked"> {{ item.text }} <small>({{ item.platform }})</small></label>
          </div>
          <p class="checklist-progress">{{ socialChecklist.filter(i => i.checked).length }}/{{ socialChecklist.length }} vérifiés</p>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.social" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('social', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('social')" class="btn-complete" @click="complete('social')">✅ Valider</button>
        </div>
      </div>

      <!-- MODULE 3: PHISHING -->
      <div v-if="activeModule === 'phishing'" class="module-body">
        <div class="intro-box">
          <p>Le phishing est l'arnaque la plus répandue. Apprenez à identifier les emails frauduleux.</p>
        </div>

        <div class="tool-card">
          <h3>🎮 Phishing ou Légitime ?</h3>
          <div class="email-preview" v-if="currentPhishing">
            <div class="email-header">
              <span>De : {{ currentPhishing.from }}</span>
              <span>Objet : {{ currentPhishing.subject }}</span>
            </div>
            <div class="email-body" v-html="currentPhishing.body"></div>
          </div>
          <div class="game-btns" v-if="currentPhishing && !currentPhishing.answered">
            <button class="btn-legit" @click="answerPhishing(false)">✅ Légitime</button>
            <button class="btn-phish" @click="answerPhishing(true)">🚨 Phishing</button>
          </div>
          <div v-if="currentPhishing?.answered" class="game-result" :class="{ correct: currentPhishing.correct }">
            <p>{{ currentPhishing.correct ? '✅ Correct !' : '❌ Raté !' }}</p>
            <p>{{ currentPhishing.explanation }}</p>
            <ul v-if="currentPhishing.redFlags"><li v-for="f in currentPhishing.redFlags" :key="f">🚩 {{ f }}</li></ul>
            <button v-if="phishingIdx < phishingExamples.length - 1" @click="nextPhishing">Suivant →</button>
          </div>
          <p class="game-score">Score : {{ phishingScore }}/{{ phishingExamples.length }}</p>
        </div>

        <div class="tool-card">
          <h3>🚩 Signaux d'alerte</h3>
          <div class="tips-grid">
            <div class="tip" v-for="t in phishingTips" :key="t.title">
              <span>{{ t.icon }}</span>
              <h4>{{ t.title }}</h4>
              <p>{{ t.text }}</p>
            </div>
          </div>
        </div>

        <button v-if="phishingIdx >= phishingExamples.length - 1" class="btn-complete" @click="complete('phishing')">✅ Valider</button>
      </div>

      <!-- MODULE 4: COOKIES -->
      <div v-if="activeModule === 'cookies'" class="module-body">
        <div class="intro-box">
          <p>Les cookies et trackers suivent votre activité en ligne. Comprenez comment vous êtes pisté.</p>
        </div>

        <div class="tool-card">
          <h3>🍪 Types de cookies</h3>
          <div class="cookie-types">
            <div v-for="c in cookieTypes" :key="c.name" class="cookie-type" :class="c.danger">
              <span>{{ c.icon }}</span>
              <div><h4>{{ c.name }}</h4><p>{{ c.description }}</p><small>Risque : {{ c.risk }}</small></div>
            </div>
          </div>
        </div>

        <div class="tool-card">
          <h3>🛡️ Solutions recommandées</h3>
          <div class="solutions-grid">
            <a v-for="s in privacySolutions" :key="s.name" :href="s.url" target="_blank" class="solution-card">
              <span>{{ s.icon }}</span>
              <h4>{{ s.name }}</h4>
              <p>{{ s.description }}</p>
            </a>
          </div>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.cookies" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('cookies', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('cookies')" class="btn-complete" @click="complete('cookies')">✅ Valider</button>
        </div>
      </div>

      <!-- MODULE 5: RGPD -->
      <div v-if="activeModule === 'rgpd'" class="module-body">
        <div class="intro-box">
          <p>Le RGPD vous donne des droits sur vos données. Apprenez à les exercer concrètement.</p>
        </div>

        <div class="tool-card">
          <h3>⚖️ Vos 8 droits RGPD</h3>
          <div class="rights-grid">
            <div v-for="r in rgpdRights" :key="r.name" class="right-card" @click="selectedRight = r">
              <span>{{ r.icon }}</span>
              <h4>{{ r.name }}</h4>
              <p>{{ r.short }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedRight" class="modal-overlay" @click.self="selectedRight = null">
          <div class="modal">
            <button class="close" @click="selectedRight = null">✕</button>
            <h3>{{ selectedRight.icon }} {{ selectedRight.name }}</h3>
            <p>{{ selectedRight.detail }}</p>
            <div v-if="selectedRight.letter" class="letter-box">
              <h4>📝 Modèle de courrier</h4>
              <pre>{{ selectedRight.letter }}</pre>
              <button @click="copyLetter">📋 Copier</button>
            </div>
          </div>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.rgpd" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('rgpd', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('rgpd')" class="btn-complete" @click="complete('rgpd')">✅ Valider</button>
        </div>
      </div>

      <!-- MODULE 6: PAYMENTS -->
      <div v-if="activeModule === 'payments'" class="module-body">
        <div class="intro-box">
          <p>Protégez vos transactions en ligne et évitez les arnaques à la carte bancaire.</p>
        </div>

        <div class="tool-card">
          <h3>💳 Bonnes pratiques</h3>
          <div class="practices-grid">
            <div v-for="p in paymentPractices" :key="p.title" class="practice">
              <span>{{ p.icon }}</span>
              <h4>{{ p.title }}</h4>
              <p>{{ p.text }}</p>
            </div>
          </div>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.payments" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('payments', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('payments')" class="btn-complete" @click="complete('payments')">✅ Valider</button>
        </div>
      </div>

      <!-- MODULE 7: WIFI -->
      <div v-if="activeModule === 'wifi'" class="module-body">
        <div class="intro-box">
          <p>WiFi public, Bluetooth, géolocalisation... Maîtrisez les risques liés à la mobilité.</p>
        </div>

        <div class="tool-card">
          <h3>📡 Risques du WiFi public</h3>
          <div class="risks-grid">
            <div v-for="r in wifiRisks" :key="r.title" class="risk">
              <span>{{ r.icon }}</span>
              <h4>{{ r.title }}</h4>
              <p>{{ r.text }}</p>
              <span class="level" :class="r.level">{{ r.level }}</span>
            </div>
          </div>
        </div>

        <div class="tool-card">
          <h3>🛡️ Se protéger</h3>
          <ul class="protect-list">
            <li v-for="s in wifiSolutions" :key="s.title"><strong>{{ s.title }}</strong> - {{ s.text }}</li>
          </ul>
        </div>

        <div class="quiz-section">
          <h3>📝 Quiz</h3>
          <div v-for="(q, i) in quizzes.wifi" :key="i" class="quiz-q">
            <p><strong>{{ i+1 }}.</strong> {{ q.question }}</p>
            <div class="quiz-opts">
              <button v-for="(opt, j) in q.options" :key="j" :class="{ selected: q.selected === j, correct: q.answered && j === q.correct, wrong: q.answered && q.selected === j && j !== q.correct }" @click="answerQ('wifi', i, j)" :disabled="q.answered">{{ opt }}</button>
            </div>
            <p v-if="q.answered" class="explanation">💡 {{ q.explanation }}</p>
          </div>
          <button v-if="quizComplete('wifi')" class="btn-complete" @click="complete('wifi')">✅ Valider</button>
        </div>
      </div>
    </section>

    <!-- CERTIFICATE -->
    <section class="certificate-section" v-if="allComplete && !activeModule">
      <div class="certificate">
        <div class="cert-header">
          <span class="cert-icon">🏆</span>
          <h2>Félicitations !</h2>
        </div>
        <div class="cert-body">
          <span class="shield">🛡️</span>
          <h3>Certificat Privacy Shield</h3>
          <input v-model="userName" placeholder="Votre nom" class="name-input">
          <p class="cert-score">Score : {{ totalProgress }}%</p>
          <p class="cert-date">{{ new Date().toLocaleDateString('fr-FR') }}</p>
          <div class="badges">
            <span v-for="b in earnedBadges" :key="b.id">{{ b.icon }} {{ b.name }}</span>
          </div>
        </div>
        <button class="btn-download" @click="downloadCert">📥 Télécharger</button>
      </div>
    </section>

    <!-- RESOURCES -->
    <section class="resources" v-if="started && !activeModule">
      <h2>📚 Ressources</h2>
      <div class="resources-grid">
        <a href="https://www.cnil.fr/" target="_blank">🏛️ CNIL</a>
        <a href="https://www.cybermalveillance.gouv.fr/" target="_blank">🚨 Cybermalveillance</a>
        <a href="https://www.ssi.gouv.fr/" target="_blank">🔐 ANSSI</a>
        <a href="https://www.signal-spam.fr/" target="_blank">📧 Signal Spam</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';

const started = ref(false);
const activeModule = ref(null);
const userName = ref('');
const showPwd = ref(false);
const pwdTest = ref('');
const genLength = ref(16);
const generatedPwd = ref('');
const genOpts = reactive({ upper: true, lower: true, nums: true, symbols: true });
const selectedRight = ref(null);
const phishingIdx = ref(0);
const phishingScore = ref(0);

const modules = reactive([
  { id: 'passwords', icon: '🔐', title: 'Mots de passe', description: 'Créer et gérer des mots de passe sécurisés', duration: '5 min', progress: 0, completed: false },
  { id: 'social', icon: '📱', title: 'Réseaux sociaux', description: 'Maîtriser sa vie privée sur les réseaux', duration: '7 min', progress: 0, completed: false },
  { id: 'phishing', icon: '📧', title: 'Phishing', description: 'Reconnaître et éviter les arnaques', duration: '5 min', progress: 0, completed: false },
  { id: 'cookies', icon: '🍪', title: 'Cookies & trackers', description: 'Comprendre et bloquer le pistage', duration: '5 min', progress: 0, completed: false },
  { id: 'rgpd', icon: '🏢', title: 'RGPD', description: 'Connaître et exercer ses droits', duration: '10 min', progress: 0, completed: false },
  { id: 'payments', icon: '💳', title: 'Paiements', description: 'Sécuriser ses transactions', duration: '5 min', progress: 0, completed: false },
  { id: 'wifi', icon: '📡', title: 'WiFi & mobilité', description: 'Connexions nomades sécurisées', duration: '5 min', progress: 0, completed: false }
]);

const quizzes = reactive({
  passwords: [
    { question: 'Longueur minimale recommandée ?', options: ['6', '8', '12', '20'], correct: 2, explanation: 'L\'ANSSI recommande 12+ caractères.', selected: null, answered: false },
    { question: 'Même mot de passe sur plusieurs sites ?', options: ['Oui', 'Non, jamais', 'Sites importants', 'Ça dépend'], correct: 1, explanation: 'Un mot de passe unique par service.', selected: null, answered: false },
    { question: 'Meilleur outil pour gérer ses mots de passe ?', options: ['Excel', 'Gestionnaire (Bitwarden)', 'Post-it', 'Mémoire'], correct: 1, explanation: 'Les gestionnaires chiffrent vos mots de passe.', selected: null, answered: false }
  ],
  social: [
    { question: 'Profil "privé" sur Instagram signifie ?', options: ['Invisible', 'Abonnés voient posts', 'Pas de collecte', 'Anonyme'], correct: 1, explanation: 'Privé = abonnés approuvés, mais Instagram collecte toujours.', selected: null, answered: false },
    { question: 'Publier photo de quelqu\'un sans accord ?', options: ['Oui si ami', 'Non jamais', 'Oui si ensemble', 'Réseau privé OK'], correct: 1, explanation: 'Droit à l\'image = toujours demander.', selected: null, answered: false }
  ],
  cookies: [
    { question: '"Tout accepter" sur bannière cookies ?', options: ['Essentiels only', 'Tous y compris pub', 'Ferme bannière', 'Mode incognito'], correct: 1, explanation: '"Tout accepter" = tous les cookies tracking.', selected: null, answered: false },
    { question: 'Navigation privée empêche tracking ?', options: ['Oui', 'Non', 'Pendant session', 'Certains sites'], correct: 2, explanation: 'Privé = pas d\'historique local mais tracking pendant session.', selected: null, answered: false }
  ],
  rgpd: [
    { question: 'Délai de réponse RGPD ?', options: ['24h', '1 semaine', '1 mois', '3 mois'], correct: 2, explanation: '1 mois, extensible à 3 si complexe.', selected: null, answered: false },
    { question: 'Amende maximale RGPD ?', options: ['10 000€', '1M€', '20M€ ou 4% CA', '100M€'], correct: 2, explanation: '20M€ ou 4% du CA mondial annuel.', selected: null, answered: false }
  ],
  payments: [
    { question: 'Qu\'est-ce que 3D Secure ?', options: ['Antivirus', 'Auth bancaire', 'VPN', 'Type de carte'], correct: 1, explanation: '3D Secure = code SMS/app pour valider paiement.', selected: null, answered: false },
    { question: 'Enregistrer sa carte sur sites ?', options: ['Oui pratique', 'Non jamais', 'Sites confiance', 'Sans importance'], correct: 2, explanation: 'Uniquement sur sites de confiance si commandes régulières.', selected: null, answered: false }
  ],
  wifi: [
    { question: 'Banque sur WiFi public ?', options: ['Oui si HTTPS', 'Non jamais', 'Oui avec VPN', 'Dépend WiFi'], correct: 2, explanation: 'VPN indispensable pour opérations sensibles.', selected: null, answered: false },
    { question: 'Que fait un VPN ?', options: ['Accélère', 'Chiffre trafic', 'Bloque pubs', 'Boost WiFi'], correct: 1, explanation: 'VPN = tunnel chiffré, protège des interceptions.', selected: null, answered: false }
  ]
});

const socialChecklist = reactive([
  { text: 'Profil en mode privé', platform: 'Tous', checked: false },
  { text: 'Désactiver géoloc posts', platform: 'Tous', checked: false },
  { text: 'Vérifier visibilité amis', platform: 'Facebook', checked: false },
  { text: 'Désactiver reconnaissance faciale', platform: 'Facebook', checked: false },
  { text: '2FA activée', platform: 'Tous', checked: false }
]);

const phishingExamples = reactive([
  { from: 'securite@lbanque-postale.com', subject: 'URGENT : Compte bloqué', body: '<p>Cher client, activité suspecte. <b>Cliquez ici</b> immédiatement.</p>', isPhishing: true, explanation: 'Adresse fausse (lbanque vs labanque), ton urgent.', redFlags: ['Adresse suspecte', 'Ton alarmiste', 'Lien direct'], answered: false, correct: false },
  { from: 'noreply@amazon.fr', subject: 'Confirmation commande #402', body: '<p>Merci pour votre commande. Détails dans votre espace client.</p>', isPhishing: false, explanation: 'Email légitime : adresse officielle, pas d\'urgence.', answered: false, correct: false },
  { from: 'support@netfIix-billing.com', subject: 'Problème paiement', body: '<p>Paiement échoué. <a href="#">Mettre à jour</a></p>', isPhishing: true, explanation: 'I majuscule au lieu de l, domaine non officiel.', redFlags: ['Domaine -billing.com', 'Caractère I/l', 'Lien paiement'], answered: false, correct: false }
]);

const phishingTips = [
  { icon: '📧', title: 'Vérifier expéditeur', text: 'Domaine exact.' },
  { icon: '🔗', title: 'Ne pas cliquer', text: 'Survoler pour voir URL.' },
  { icon: '⚠️', title: 'Méfiance urgence', text: 'Messages alarmistes = arnaques.' },
  { icon: '🏦', title: 'Aller direct', text: 'Taper l\'URL vous-même.' }
];

const cookieTypes = [
  { icon: '✅', name: 'Essentiels', description: 'Session, panier...', risk: 'Aucun', danger: 'safe' },
  { icon: '📊', name: 'Analytiques', description: 'Audience, performance', risk: 'Faible', danger: 'low' },
  { icon: '🎯', name: 'Publicitaires', description: 'Profil pub ciblée', risk: 'Élevé', danger: 'high' },
  { icon: '🔗', name: 'Tiers', description: 'Facebook, Google...', risk: 'Très élevé', danger: 'critical' }
];

const privacySolutions = [
  { icon: '🦊', name: 'Firefox', description: 'Navigateur respectueux', url: 'https://www.mozilla.org/firefox/' },
  { icon: '🦁', name: 'Brave', description: 'Bloque trackers', url: 'https://brave.com/' },
  { icon: '🛡️', name: 'uBlock Origin', description: 'Extension anti-trackers', url: 'https://ublockorigin.com/' },
  { icon: '🔒', name: 'DuckDuckGo', description: 'Moteur privé', url: 'https://duckduckgo.com/' }
];

const rgpdRights = [
  { icon: '📋', name: 'Accès', short: 'Savoir quelles données', detail: 'Demander copie de toutes vos données.', letter: 'Objet: Demande accès (Art.15 RGPD)\n\nJe souhaite obtenir copie de mes données personnelles...' },
  { icon: '✏️', name: 'Rectification', short: 'Corriger erreurs', detail: 'Faire corriger infos inexactes.', letter: 'Objet: Rectification (Art.16 RGPD)\n\nJe demande rectification de...' },
  { icon: '🗑️', name: 'Effacement', short: 'Supprimer données', detail: 'Demander suppression sous conditions.', letter: 'Objet: Effacement (Art.17 RGPD)\n\nJe demande suppression de...' },
  { icon: '⛔', name: 'Opposition', short: 'Refuser traitements', detail: 'S\'opposer à la prospection.', letter: null },
  { icon: '📦', name: 'Portabilité', short: 'Récupérer données', detail: 'Obtenir données en format lisible.', letter: null },
  { icon: '🔒', name: 'Limitation', short: 'Geler traitement', detail: 'Suspendre utilisation temporairement.', letter: null },
  { icon: '🤖', name: 'Décision auto', short: 'Refuser algo', detail: 'Pas de décision 100% automatisée.', letter: null },
  { icon: '💀', name: 'Post-mortem', short: 'Après décès', detail: 'Directives sur données après mort.', letter: null }
];

const paymentPractices = [
  { icon: '🔒', title: 'HTTPS', text: 'Cadenas obligatoire' },
  { icon: '🔐', title: '3D Secure', text: 'Auth bancaire' },
  { icon: '💳', title: 'Carte virtuelle', text: 'Usage unique' },
  { icon: '📧', title: 'Confirmation', text: 'Vérifier email' }
];

const wifiRisks = [
  { icon: '👀', title: 'Interception', text: 'Données interceptées', level: 'Critique' },
  { icon: '🎭', title: 'Faux hotspots', text: 'WiFi pirates', level: 'Élevé' },
  { icon: '🦠', title: 'Malwares', text: 'Fichiers malveillants', level: 'Élevé' },
  { icon: '🔓', title: 'Sessions volées', text: 'Détournement connexions', level: 'Critique' }
];

const wifiSolutions = [
  { title: 'VPN', text: 'Chiffrer tout le trafic.' },
  { title: 'Éviter sensible', text: 'Pas de banque sur WiFi public.' },
  { title: 'Désactiver auto', text: 'Pas de connexion automatique.' },
  { title: 'Préférer 4G/5G', text: 'Plus sécurisé que WiFi public.' }
];

const allBadges = [
  { id: 'starter', icon: '🌟', name: 'Starter', condition: () => modules.some(m => m.completed) },
  { id: 'pwd', icon: '🔐', name: 'Maître clés', condition: () => modules[0].completed },
  { id: 'social', icon: '👁️', name: 'Gardien social', condition: () => modules[1].completed },
  { id: 'phish', icon: '🎣', name: 'Anti-phishing', condition: () => modules[2].completed },
  { id: 'cookie', icon: '🍪', name: 'Cookie crusher', condition: () => modules[3].completed },
  { id: 'rgpd', icon: '⚖️', name: 'Expert RGPD', condition: () => modules[4].completed },
  { id: 'pay', icon: '💳', name: 'Acheteur sûr', condition: () => modules[5].completed },
  { id: 'wifi', icon: '📡', name: 'Nomade sécurisé', condition: () => modules[6].completed },
  { id: 'master', icon: '🛡️', name: 'Shield Master', condition: () => modules.every(m => m.completed) }
];

const earnedBadges = computed(() => allBadges.filter(b => b.condition()));
const currentModule = computed(() => modules.find(m => m.id === activeModule.value));
const totalProgress = computed(() => Math.round(modules.reduce((a, m) => a + m.progress, 0) / modules.length));
const allComplete = computed(() => modules.every(m => m.completed));
const currentPhishing = computed(() => phishingExamples[phishingIdx.value]);

const pwdStrength = computed(() => {
  const p = pwdTest.value;
  if (!p) return { label: '', class: '', percent: 0, crackTime: '' };
  let score = 0;
  if (p.length >= 8) score += 20;
  if (p.length >= 12) score += 20;
  if (p.length >= 16) score += 10;
  if (/[A-Z]/.test(p)) score += 15;
  if (/[a-z]/.test(p)) score += 10;
  if (/[0-9]/.test(p)) score += 15;
  if (/[^A-Za-z0-9]/.test(p)) score += 20;
  
  if (score < 30) return { label: 'Très faible', class: 'very-weak', percent: score, crackTime: 'Secondes' };
  if (score < 50) return { label: 'Faible', class: 'weak', percent: score, crackTime: 'Minutes' };
  if (score < 70) return { label: 'Moyen', class: 'medium', percent: score, crackTime: 'Heures' };
  if (score < 90) return { label: 'Fort', class: 'strong', percent: score, crackTime: 'Années' };
  return { label: 'Très fort', class: 'very-strong', percent: score, crackTime: 'Siècles' };
});

function scrollToModules() { document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' }); }
function openModule(mod, i) {
  if (i > 0 && !modules[i - 1].completed) return alert('Complétez le module précédent !');
  activeModule.value = mod.id;
}

function generatePwd() {
  const chars = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', nums: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' };
  let pool = '';
  if (genOpts.upper) pool += chars.upper;
  if (genOpts.lower) pool += chars.lower;
  if (genOpts.nums) pool += chars.nums;
  if (genOpts.symbols) pool += chars.symbols;
  if (!pool) pool = chars.lower;
  generatedPwd.value = Array.from({ length: genLength.value }, () => pool[Math.floor(Math.random() * pool.length)]).join('');
}

function copyPwd() { navigator.clipboard.writeText(generatedPwd.value); alert('Copié !'); }
function copyLetter() { navigator.clipboard.writeText(selectedRight.value.letter); alert('Copié !'); }

function answerQ(mod, qi, ai) {
  quizzes[mod][qi].selected = ai;
  quizzes[mod][qi].answered = true;
}

function quizComplete(mod) { return quizzes[mod].every(q => q.answered); }

function complete(modId) {
  const mod = modules.find(m => m.id === modId);
  if (mod) { mod.completed = true; mod.progress = 100; activeModule.value = null; save(); }
}

function answerPhishing(guessPhishing) {
  const ex = phishingExamples[phishingIdx.value];
  ex.answered = true;
  ex.correct = guessPhishing === ex.isPhishing;
  if (ex.correct) phishingScore.value++;
}

function nextPhishing() { phishingIdx.value++; }

function save() {
  localStorage.setItem('privacyShield', JSON.stringify({ modules: modules.map(m => ({ id: m.id, completed: m.completed, progress: m.progress })), started: started.value }));
}

function load() {
  const data = localStorage.getItem('privacyShield');
  if (data) {
    const parsed = JSON.parse(data);
    started.value = parsed.started;
    parsed.modules?.forEach(sm => { const m = modules.find(x => x.id === sm.id); if (m) { m.completed = sm.completed; m.progress = sm.progress; } });
  }
}

function downloadCert() { alert('Téléchargement certificat (à implémenter)'); }

onMounted(load);
</script>

<style scoped>
.privacy-shield { background: linear-gradient(180deg, #0a0a0a, #111827); color: #f5f5f5; padding-top: 80px; padding-bottom: 2rem; }

.hero { padding: 4rem 2rem; text-align: center; }
.hero-content { max-width: 600px; margin: 0 auto; }
.hero-badge { display: inline-block; padding: 0.5rem 1rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(59,130,246,0.3); border-radius: 2rem; color: #60a5fa; margin-bottom: 1rem; }
.hero h1 { font-size: 3rem; background: linear-gradient(135deg, #3b82f6, #10b981); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
.hero-subtitle { color: #9ca3af; margin-bottom: 2rem; }
.hero-stats { display: flex; justify-content: center; gap: 3rem; margin-bottom: 2rem; }
.stat-value { display: block; font-size: 2rem; font-weight: 700; color: #3b82f6; }
.stat-label { font-size: 0.85rem; color: #6b7280; }
.btn-start { padding: 1rem 2rem; font-size: 1.1rem; font-weight: 600; background: linear-gradient(135deg, #3b82f6, #10b981); border: none; border-radius: 0.75rem; color: white; cursor: pointer; transition: all 0.3s; }
.btn-start:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(59,130,246,0.3); }

.modules-section { max-width: 1000px; margin: 0 auto; padding: 2rem; }
.modules-section h2 { text-align: center; margin-bottom: 2rem; }
.modules-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.module-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; cursor: pointer; transition: all 0.3s; }
.module-card:hover { border-color: #3b82f6; transform: translateY(-2px); }
.module-card.completed { border-color: #10b981; background: rgba(16,185,129,0.05); }
.module-card.locked { opacity: 0.5; cursor: not-allowed; }
.module-icon { font-size: 2rem; }
.module-info { flex: 1; }
.module-info h3 { margin: 0 0 0.25rem; font-size: 1rem; }
.module-info p { margin: 0; font-size: 0.8rem; color: #9ca3af; }
.module-duration { font-size: 0.75rem; color: #6b7280; }
.module-status { font-size: 1.25rem; }

.module-content { max-width: 800px; margin: 0 auto; padding: 2rem; }
.btn-back { background: none; border: none; color: #9ca3af; cursor: pointer; margin-bottom: 1rem; }
.btn-back:hover { color: #3b82f6; }
.module-content h2 { margin-bottom: 1.5rem; }

.intro-box { padding: 1rem; background: rgba(59,130,246,0.1); border-left: 4px solid #3b82f6; border-radius: 0 0.5rem 0.5rem 0; margin-bottom: 1.5rem; }
.intro-box p { margin: 0; color: #d1d5db; }

.tool-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.5rem; }
.tool-card h3 { margin: 0 0 1rem; }

.input-group { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.input-group input { flex: 1; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; font-family: monospace; }
.input-group button { padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; cursor: pointer; }

.strength-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 0.5rem; overflow: hidden; }
.strength-fill { height: 100%; transition: all 0.3s; }
.strength-fill.very-weak { background: #ef4444; }
.strength-fill.weak { background: #f97316; }
.strength-fill.medium { background: #eab308; }
.strength-fill.strong { background: #22c55e; }
.strength-fill.very-strong { background: #10b981; }

.strength-info { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.9rem; }
.strength-info .very-weak { color: #ef4444; }
.strength-info .weak { color: #f97316; }
.strength-info .medium { color: #eab308; }
.strength-info .strong { color: #22c55e; }
.strength-info .very-strong { color: #10b981; }

.pwd-checklist { list-style: none; padding: 0; margin: 0; }
.pwd-checklist li { padding: 0.25rem 0; color: #9ca3af; }
.pwd-checklist li.ok { color: #10b981; }

.gen-options { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0; }
.gen-options label { display: flex; align-items: center; gap: 0.25rem; cursor: pointer; }
.gen-result { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.gen-result code { flex: 1; min-width: 150px; padding: 0.75rem; background: rgba(0,0,0,0.5); border-radius: 0.5rem; font-family: monospace; word-break: break-all; }
.gen-result button { padding: 0.75rem 1rem; background: #3b82f6; border: none; border-radius: 0.5rem; color: white; cursor: pointer; }

.checklist { display: flex; flex-direction: column; gap: 0.5rem; }
.checklist label { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.02); border-radius: 0.5rem; cursor: pointer; }
.checklist input { accent-color: #10b981; }
.checklist small { color: #6b7280; margin-left: auto; }
.checklist-progress { margin-top: 1rem; text-align: center; color: #10b981; font-weight: 600; }

.quiz-section { margin-top: 2rem; }
.quiz-section h3 { margin-bottom: 1rem; }
.quiz-q { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; }
.quiz-q p { margin: 0 0 0.75rem; }
.quiz-opts { display: flex; flex-direction: column; gap: 0.5rem; }
.quiz-opts button { padding: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; text-align: left; cursor: pointer; }
.quiz-opts button:hover:not(:disabled) { border-color: #3b82f6; }
.quiz-opts button.selected { border-color: #3b82f6; background: rgba(59,130,246,0.1); }
.quiz-opts button.correct { border-color: #10b981; background: rgba(16,185,129,0.1); }
.quiz-opts button.wrong { border-color: #ef4444; background: rgba(239,68,68,0.1); }
.explanation { margin-top: 0.75rem; padding: 0.5rem; background: rgba(59,130,246,0.1); border-radius: 0.5rem; font-size: 0.9rem; color: #93c5fd; }
.btn-complete { display: block; width: 100%; padding: 1rem; margin-top: 1.5rem; background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 0.75rem; color: white; font-weight: 600; cursor: pointer; }

.email-preview { background: white; color: #1f2937; border-radius: 0.5rem; margin-bottom: 1rem; overflow: hidden; }
.email-header { background: #f3f4f6; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
.email-header span { display: block; font-size: 0.85rem; }
.email-body { padding: 1rem; }
.game-btns { display: flex; gap: 1rem; }
.btn-legit, .btn-phish { flex: 1; padding: 1rem; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
.btn-legit { background: #10b981; color: white; }
.btn-phish { background: #ef4444; color: white; }
.game-result { padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; }
.game-result.correct { background: rgba(16,185,129,0.1); }
.game-result:not(.correct) { background: rgba(239,68,68,0.1); }
.game-result ul { margin: 1rem 0; padding-left: 1rem; list-style: none; }
.game-score { text-align: center; margin-top: 1rem; font-weight: 600; color: #3b82f6; }

.tips-grid, .practices-grid, .risks-grid, .solutions-grid, .rights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
.tip, .practice, .risk, .right-card { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; text-align: center; }
.tip span, .practice span, .risk span, .right-card span { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
.tip h4, .practice h4, .risk h4, .right-card h4 { margin: 0 0 0.25rem; font-size: 0.9rem; }
.tip p, .practice p, .risk p, .right-card p { margin: 0; font-size: 0.8rem; color: #9ca3af; }
.right-card { cursor: pointer; transition: all 0.2s; }
.right-card:hover { border-color: #3b82f6; }

.solution-card { display: block; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; text-decoration: none; color: inherit; text-align: center; transition: all 0.2s; }
.solution-card:hover { border-color: #3b82f6; }
.solution-card span { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
.solution-card h4 { margin: 0 0 0.25rem; color: #f5f5f5; }
.solution-card p { margin: 0; font-size: 0.8rem; color: #9ca3af; }

.cookie-types { display: flex; flex-direction: column; gap: 0.75rem; }
.cookie-type { display: flex; gap: 1rem; padding: 1rem; border-radius: 0.5rem; background: rgba(255,255,255,0.02); }
.cookie-type.safe { border-left: 4px solid #10b981; }
.cookie-type.low { border-left: 4px solid #eab308; }
.cookie-type.high { border-left: 4px solid #f97316; }
.cookie-type.critical { border-left: 4px solid #ef4444; }
.cookie-type span { font-size: 1.25rem; }
.cookie-type h4 { margin: 0; font-size: 0.95rem; }
.cookie-type p { margin: 0.25rem 0; font-size: 0.85rem; color: #9ca3af; }
.cookie-type small { font-size: 0.75rem; }

.risk .level { display: inline-block; margin-top: 0.5rem; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 600; }
.level.Critique { background: rgba(239,68,68,0.2); color: #ef4444; }
.level.Élevé { background: rgba(249,115,22,0.2); color: #f97316; }

.protect-list { padding-left: 1.5rem; }
.protect-list li { margin-bottom: 0.75rem; color: #d1d5db; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
.modal { background: #1f2937; border-radius: 1rem; padding: 2rem; max-width: 500px; width: 100%; position: relative; max-height: 80vh; overflow-y: auto; }
.modal .close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #9ca3af; font-size: 1.25rem; cursor: pointer; }
.modal h3 { margin: 0 0 1rem; }
.letter-box { margin-top: 1rem; }
.letter-box pre { background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; font-size: 0.8rem; white-space: pre-wrap; overflow-x: auto; }
.letter-box button { margin-top: 0.5rem; padding: 0.5rem 1rem; background: #3b82f6; border: none; border-radius: 0.5rem; color: white; cursor: pointer; }

.certificate-section { max-width: 500px; margin: 3rem auto; padding: 2rem; }
.certificate { background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(16,185,129,0.1)); border: 2px solid rgba(59,130,246,0.3); border-radius: 1.5rem; overflow: hidden; text-align: center; }
.cert-header { padding: 1.5rem; background: rgba(0,0,0,0.2); }
.cert-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
.cert-header h2 { margin: 0; }
.cert-body { padding: 2rem; }
.shield { font-size: 4rem; display: block; margin-bottom: 1rem; }
.cert-body h3 { margin: 0 0 1rem; }
.name-input { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; text-align: center; margin-bottom: 1rem; }
.cert-score { font-size: 1.25rem; font-weight: 600; color: #10b981; margin: 0; }
.cert-date { color: #6b7280; margin: 0.5rem 0; }
.badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
.badges span { padding: 0.25rem 0.75rem; background: rgba(59,130,246,0.1); border-radius: 1rem; font-size: 0.8rem; }
.btn-download { display: block; width: 100%; padding: 1rem; background: #3b82f6; border: none; color: white; font-weight: 600; cursor: pointer; border-radius: 0 0 1.5rem 1.5rem; }

.resources { max-width: 800px; margin: 3rem auto; padding: 2rem; text-align: center; }
.resources h2 { margin-bottom: 1.5rem; }
.resources-grid { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.resources-grid a { padding: 1rem 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #f5f5f5; text-decoration: none; transition: all 0.2s; }
.resources-grid a:hover { border-color: #3b82f6; }

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .hero-stats { flex-direction: column; gap: 1rem; }
  .modules-grid { grid-template-columns: 1fr; }
}
</style>
