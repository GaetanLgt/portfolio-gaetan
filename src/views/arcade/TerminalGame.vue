<template>
  <div class="terminal-page" :class="{ 'crt-on': crtEnabled }">
    <!-- CRT OVERLAY -->
    <div class="crt-overlay">
      <div class="crt-scanlines"></div>
      <div class="crt-flicker"></div>
      <div class="crt-vignette"></div>
    </div>
    
    <!-- HEADER -->
    <header class="terminal-header">
      <div class="container terminal-header__inner">
        <router-link to="/arcade" class="terminal-back">
          ← ARCADE
        </router-link>
        <div class="terminal-header__title">
          <span class="terminal-header__icon">💻</span>
          <h1>TERMINAL</h1>
        </div>
        <button 
          @click="crtEnabled = !crtEnabled" 
          class="crt-toggle"
          :aria-pressed="crtEnabled"
          aria-label="Activer ou désactiver l'effet CRT"
        >
          CRT: {{ crtEnabled ? 'ON' : 'OFF' }}
        </button>
      </div>
    </header>
    
    <!-- TERMINAL -->
    <section class="terminal-section">
      <div class="container">
        <div class="terminal-window">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <span class="terminal-title">MATRIX SYSTEM v2.0.1</span>
          </div>
          
          <div class="terminal-body" ref="terminalBody" @click="focusInput">
            <!-- Boot Sequence -->
            <div v-if="booting" class="boot-sequence">
              <div v-for="(line, i) in bootLines" :key="i" class="boot-line" :style="{ animationDelay: `${i * 0.1}s` }">
                {{ line }}
              </div>
            </div>
            
            <!-- Terminal Content -->
            <template v-else>
              <!-- Welcome -->
              <div class="terminal-welcome">
                <pre class="ascii-art">
███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗
████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝
██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ 
██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ 
██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗
╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
                </pre>
                <p class="system-info">MATRIX SYSTEM TERMINAL v2.0.1</p>
                <p class="system-info dim">Copyright (c) 2026 GL Digital Lab. All rights reserved.</p>
                <p class="welcome-hint">Type <span class="cmd-highlight">HELP</span> to list available commands.</p>
              </div>
              
              <!-- Output history -->
              <div v-for="(item, index) in history" :key="index" class="terminal-line">
                <template v-if="item.type === 'input'">
                  <span class="terminal-prompt">{{ currentPath }}&gt;</span>
                  <span class="terminal-input-text">{{ item.content }}</span>
                </template>
                <template v-else>
                  <div class="terminal-output" v-html="item.content"></div>
                </template>
              </div>
              
              <!-- Current input -->
              <div class="terminal-input-line">
                <label for="terminal-input" class="sr-only">Commande terminal</label>
                <span class="terminal-prompt" aria-hidden="true">{{ currentPath }}&gt;</span>
                <div class="terminal-input-wrapper">
                  <span class="terminal-input-mirror" aria-hidden="true">{{ currentInput }}</span><span class="terminal-cursor" aria-hidden="true">█</span>
                  <input 
                    id="terminal-input"
                    ref="inputRef"
                    v-model="currentInput"
                    @keydown.enter="executeCommand"
                    @keydown.up="historyUp"
                    @keydown.down="historyDown"
                    @keydown.tab.prevent="autoComplete"
                    type="text"
                    class="terminal-input"
                    spellcheck="false"
                    autocomplete="off"
                    aria-label="Entrez une commande terminal"
                    aria-describedby="terminal-help"
                  />
                </div>
              </div>
              
              <!-- Aide lecteur d'écran -->
              <p id="terminal-help" class="sr-only">
                Tapez HELP pour la liste des commandes. Utilisez flèches haut/bas pour l'historique.
              </p>
              
              <!-- Annonces live -->
              <div aria-live="polite" aria-atomic="true" class="sr-only">
                {{ liveAnnouncement }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue';

const crtEnabled = ref(true);
const booting = ref(true);
const currentInput = ref('');
const history = ref([]);
const commandHistory = ref([]);
const historyIndex = ref(-1);
const terminalBody = ref(null);
const inputRef = ref(null);
const currentDrive = ref('C:');
const currentDir = ref('\\');

const currentPath = computed(() => `${currentDrive.value}${currentDir.value}`);
const liveAnnouncement = ref('');

const bootLines = [
  'BIOS Version 4.51.2026',
  'Initializing system...',
  'Memory Test: 16384 MB OK',
  'Detecting drives...',
  '  A:\\ - SYSTEM',
  '  B:\\ - ARCHIVES', 
  '  C:\\ - PROJECTS',
  '  D:\\ - SECRETS',
  'Loading MATRIX SYSTEM v2.0.1...',
  'Establishing neural link...',
  'Connection established.',
  '',
  'Welcome to the Matrix, Neo.',
  ''
];

// File system structure
const fileSystem = {
  'A:': {
    '\\': {
      type: 'dir',
      contents: ['SYSTEM.DAT', 'CONFIG.SYS', 'BOOT.INI']
    },
    '\\SYSTEM.DAT': { type: 'file', content: 'MATRIX SYSTEM DATA FILE v2.0.1\nEncryption: AES-256\nStatus: ACTIVE' },
    '\\CONFIG.SYS': { type: 'file', content: 'FILES=40\nBUFFERS=20\nDEVICE=NEURAL.SYS\nSHELL=MATRIX.COM' },
    '\\BOOT.INI': { type: 'file', content: '[boot loader]\ntimeout=30\ndefault=MATRIX\n[operating systems]\nMATRIX="GL Digital Lab OS"' }
  },
  'B:': {
    '\\': {
      type: 'dir',
      contents: ['LOGS', 'BACKUP']
    },
    '\\LOGS': {
      type: 'dir',
      contents: ['ACCESS.LOG', 'ERROR.LOG']
    },
    '\\LOGS\\ACCESS.LOG': { type: 'file', content: '[2026-01-05 03:14:15] User NEO connected\n[2026-01-05 03:14:16] Access granted\n[2026-01-05 03:14:20] Browsing PROJECTS' },
    '\\LOGS\\ERROR.LOG': { type: 'file', content: 'No errors found.\nSystem running optimally.' },
    '\\BACKUP': {
      type: 'dir', 
      contents: ['README.TXT']
    },
    '\\BACKUP\\README.TXT': { type: 'file', content: 'Backup directory for archived projects.\nLast backup: 2026-01-01' }
  },
  'C:': {
    '\\': {
      type: 'dir',
      contents: ['ARKADIA', 'GLDIGITALLAB', 'MYLOC', 'ZOMBUNNY', 'MYTV', 'POKEMON']
    },
    '\\ARKADIA': {
      type: 'dir',
      contents: ['README.TXT', 'STATS.DAT']
    },
    '\\ARKADIA\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n         ARKADIA FRANCE\n═══════════════════════════════════════\n\nCluster ARK: Survival Ascended\n150+ joueurs actifs\n9 serveurs interconnectés\n99.8% uptime\n\nStack: Node.js, Discord.js, n8n, Docker\nYear: 2023-2026\n\nType OPEN ARKADIA to visit.' 
    },
    '\\ARKADIA\\STATS.DAT': { type: 'file', content: 'Players: 150+\nServers: 9\nUptime: 99.8%\nDiscord: 120 msg/day\nEvents: Ragnarok (Jan 18)' },
    '\\GLDIGITALLAB': {
      type: 'dir',
      contents: ['README.TXT', 'TECH.DAT']
    },
    '\\GLDIGITALLAB\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n         GL DIGITAL LAB\n═══════════════════════════════════════\n\nPortfolio professionnel\nDesign Matrix immersif\nArcade interactive\n\nStack: Vue 3, Three.js, Vite, GSAP\nYear: 2026\n\nYou are here.' 
    },
    '\\GLDIGITALLAB\\TECH.DAT': { type: 'file', content: 'Frontend: Vue 3 Composition API\n3D: Three.js\nBuild: Vite\nAnimation: GSAP\nHosting: O2Switch' },
    '\\MYLOC': {
      type: 'dir',
      contents: ['README.TXT']
    },
    '\\MYLOC\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n            MYLOC\n═══════════════════════════════════════\n\nGestion de locations immobilières\nCRUD complet + Auth\nDashboard admin\n\nStack: Symfony 5, PHP, Twig, MySQL\nYear: 2022' 
    },
    '\\ZOMBUNNY': {
      type: 'dir',
      contents: ['README.TXT', 'DNA.DAT']
    },
    '\\ZOMBUNNY\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n           ZOMBUNNY\n═══════════════════════════════════════\n\nAlgorithmes génétiques\nSélection naturelle simulée\nMutation + Croisement\n\nStack: Unity, C#, IA Évolutionnaire\nYear: 2020\n\nType OPEN ZOMBUNNY to visit.' 
    },
    '\\ZOMBUNNY\\DNA.DAT': { type: 'file', content: 'GENOME SEQUENCE:\nAAAATTTGGGCCC\nMutation rate: 0.01\nFitness function: Distance\nGenerations: ∞' },
    '\\MYTV': {
      type: 'dir',
      contents: ['README.TXT']
    },
    '\\MYTV\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n         MYTV DATABASE\n═══════════════════════════════════════\n\nExplorateur de séries TV\nAPI TVMaze intégrée\nRecherche + Favoris\n\nStack: Vue.js, API REST, Firebase\nYear: 2021\n\nType OPEN MYTV to visit.' 
    },
    '\\POKEMON': {
      type: 'dir',
      contents: ['README.TXT']
    },
    '\\POKEMON\\README.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n        POKÉMON MEMORY\n═══════════════════════════════════════\n\nJeu Memory collaboratif\nPokeAPI intégrée\nAuth + Profiles\n\nStack: Symfony, PHP, JavaScript, Docker\nYear: 2023\nCollab: Julien Holtz' 
    }
  },
  'D:': {
    '\\': {
      type: 'dir',
      contents: ['CODES.TXT', 'RABBIT.EXE', 'REDPILL.DAT']
    },
    '\\CODES.TXT': { 
      type: 'file', 
      content: '═══════════════════════════════════════\n          SECRET CODES\n═══════════════════════════════════════\n\nTHERE IS NO SPOON\nFOLLOW THE WHITE RABBIT\nKNOCK KNOCK NEO\nTHE ONE\nFREE YOUR MIND\n\nType any code to activate...' 
    },
    '\\RABBIT.EXE': { type: 'file', content: '🐇 Follow me...\n\nExecute? (Y/N)' },
    '\\REDPILL.DAT': { type: 'file', content: 'You take the red pill...\nYou stay in Wonderland...\nAnd I show you how deep\nthe rabbit hole goes.\n\n💊' }
  }
};

const projectUrls = {
  'ARKADIA': '/arkadia',
  'GLDIGITALLAB': '/',
  'MYLOC': 'https://github.com/GaetanLgt/myLoc',
  'ZOMBUNNY': '/zombunny',
  'MYTV': '/tv',
  'POKEMON': 'https://github.com/JulienHltz/Pokemon_MemoryGame'
};

// Commands
const commands = {
  help: () => `
<span class="cmd-title">╔══════════════════════════════════════╗
║         AVAILABLE COMMANDS           ║
╚══════════════════════════════════════╝</span>

<span class="cmd-name">DIR</span>              List directory contents
<span class="cmd-name">CD [path]</span>        Change directory
<span class="cmd-name">CD ..</span>            Go to parent directory
<span class="cmd-name">[drive]:</span>         Change drive (A: B: C: D:)
<span class="cmd-name">TYPE [file]</span>      Display file contents
<span class="cmd-name">READ [file]</span>      Alias for TYPE
<span class="cmd-name">OPEN [project]</span>   Open project in browser
<span class="cmd-name">WHOAMI</span>           Display current user
<span class="cmd-name">SKILLS</span>           List technical skills
<span class="cmd-name">CONTACT</span>          Show contact information
<span class="cmd-name">CLS</span>              Clear screen
<span class="cmd-name">CLEAR</span>            Alias for CLS
<span class="cmd-name">REBOOT</span>           Restart terminal
<span class="cmd-name">HELP</span>             Show this message

<span class="dim">Secret codes may exist... explore D:\\ drive.</span>
`,

  dir: () => {
    const fullPath = currentDir.value === '\\' ? '\\' : currentDir.value;
    const location = fileSystem[currentDrive.value]?.[fullPath];
    
    if (!location || location.type !== 'dir') {
      return '<span class="error">Directory not found.</span>';
    }
    
    let output = `\n<span class="dim"> Volume in drive ${currentDrive.value} is ${getDriveName(currentDrive.value)}</span>\n`;
    output += `<span class="dim"> Directory of ${currentPath.value}</span>\n\n`;
    
    if (currentDir.value !== '\\') {
      output += '<span class="dir-entry">..</span>            <span class="dim">&lt;DIR&gt;</span>\n';
    }
    
    location.contents.forEach(item => {
      const itemPath = currentDir.value === '\\' ? `\\${item}` : `${currentDir.value}\\${item}`;
      const itemData = fileSystem[currentDrive.value]?.[itemPath];
      
      if (itemData?.type === 'dir') {
        output += `<span class="dir-entry">${item.padEnd(15)}</span> <span class="dim">&lt;DIR&gt;</span>\n`;
      } else {
        output += `<span class="file-entry">${item}</span>\n`;
      }
    });
    
    output += `\n<span class="dim">     ${location.contents.length} item(s)</span>`;
    return output;
  },

  cd: (args) => {
    const target = args[0]?.toUpperCase();
    
    if (!target) {
      return `Current directory: ${currentPath.value}`;
    }
    
    if (target === '..') {
      if (currentDir.value === '\\') {
        return '<span class="dim">Already at root directory.</span>';
      }
      const parts = currentDir.value.split('\\').filter(p => p);
      parts.pop();
      currentDir.value = parts.length ? '\\' + parts.join('\\') : '\\';
      return '';
    }
    
    if (target === '\\' || target === '/') {
      currentDir.value = '\\';
      return '';
    }
    
    // Check if directory exists
    const newPath = currentDir.value === '\\' ? `\\${target}` : `${currentDir.value}\\${target}`;
    const location = fileSystem[currentDrive.value]?.[newPath];
    
    if (location?.type === 'dir') {
      currentDir.value = newPath;
      return '';
    }
    
    return `<span class="error">Directory not found: ${target}</span>`;
  },

  type: (args) => {
    const fileName = args[0]?.toUpperCase();
    
    if (!fileName) {
      return '<span class="error">Usage: TYPE [filename]</span>';
    }
    
    const filePath = currentDir.value === '\\' ? `\\${fileName}` : `${currentDir.value}\\${fileName}`;
    const file = fileSystem[currentDrive.value]?.[filePath];
    
    if (!file || file.type !== 'file') {
      return `<span class="error">File not found: ${fileName}</span>`;
    }
    
    return `\n${file.content}\n`;
  },

  open: (args) => {
    const project = args[0]?.toUpperCase();
    
    if (!project) {
      return '<span class="error">Usage: OPEN [project]</span>\nAvailable: ARKADIA, GLDIGITALLAB, MYLOC, ZOMBUNNY, MYTV, POKEMON';
    }
    
    const url = projectUrls[project];
    if (!url) {
      return `<span class="error">Project not found: ${project}</span>`;
    }
    
    window.open(url, '_blank');
    return `<span class="success">► Opening ${project}...</span>`;
  },

  whoami: () => `
<span class="cmd-title">╔══════════════════════════════════════╗
║              USER INFO               ║
╚══════════════════════════════════════╝</span>

Username:    NEO
Real name:   Gaëtan LANGLET
Title:       Full-Stack Developer
Location:    Limoges, France 🇫🇷
Experience:  5+ years
Status:      <span class="success">ONLINE</span>

"I know kung fu." - Actually, I know Symfony.
`,

  skills: () => `
<span class="cmd-title">╔══════════════════════════════════════╗
║           TECHNICAL SKILLS           ║
╚══════════════════════════════════════╝</span>

<span class="skill-cat">[BACKEND]</span>
  Symfony 8 ████████████████████ 100%
  PHP 8.3+  ████████████████████ 100%
  Node.js   ████████████████░░░░  80%
  API REST  ████████████████████ 100%

<span class="skill-cat">[FRONTEND]</span>
  Vue 3     ████████████████████ 100%
  Three.js  ██████████████░░░░░░  70%
  TypeScript████████████████░░░░  80%

<span class="skill-cat">[IA & AUTOMATION]</span>
  n8n       ████████████████████ 100%
  Ollama    ████████████████░░░░  80%
  Docker    ████████████████░░░░  80%

<span class="skill-cat">[DEVOPS]</span>
  Git       ████████████████████ 100%
  CI/CD     ██████████████░░░░░░  70%
  Linux     ████████████████░░░░  80%
`,

  contact: () => `
<span class="cmd-title">╔══════════════════════════════════════╗
║          CONTACT INFORMATION         ║
╚══════════════════════════════════════╝</span>

Email:    contact@gldigitallab.fr
Website:  <a href="https://gldigitallab.fr" target="_blank" class="terminal-link">https://gldigitallab.fr</a>
GitHub:   <a href="https://github.com/GaetanLgt" target="_blank" class="terminal-link">github.com/GaetanLgt</a>
LinkedIn: /in/gaetan-langlet

<span class="dim">Press any key to initiate contact sequence...</span>
<span class="dim">Just kidding. Use email like a normal human.</span>
`,

  cls: () => {
    history.value = [];
    return null;
  },

  clear: () => commands.cls(),
  
  read: (args) => commands.type(args),
  
  ls: () => commands.dir(),

  reboot: () => {
    history.value = [];
    booting.value = true;
    setTimeout(() => {
      booting.value = false;
      nextTick(() => focusInput());
    }, bootLines.length * 100 + 500);
    return null;
  },

  // Secret codes
  'there is no spoon': () => `
<span class="matrix-text">
   ╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
   │                                 │
   │   Do not try and bend the       │
   │   spoon. That's impossible.     │
   │                                 │
   │   Instead, only try to realize  │
   │   the truth... there is no      │
   │   spoon. Then you'll see that   │
   │   it is not the spoon that      │
   │   bends, it is only yourself.   │
   │                                 │
   ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
</span>
`,

  'follow the white rabbit': () => {
    triggerMatrixEffect();
    return `
<span class="matrix-text">
🐇 Follow the white rabbit...

   (\\_/)
   ( •.•)
   />🔴  Want the red pill?

Knock, knock, Neo.
</span>
`;
  },

  'knock knock neo': () => `
<span class="matrix-text">
The Matrix has you...

Wake up, Neo...

Follow the white rabbit.

   ╭────────────────────╮
   │   TRACE PROGRAM    │
   │   ██████████ 100%  │
   │   CALL TRANS OPT:  │
   │   RECEIVED         │
   ╰────────────────────╯
</span>
`,

  'the one': () => `
<span class="matrix-text success">
╔═══════════════════════════════════════╗
║                                       ║
║   You are The One, Neo.               ║
║                                       ║
║   You've been living in a dream       ║
║   world, Neo. This is the world       ║
║   as it exists today...               ║
║                                       ║
║   Welcome to the real world.          ║
║                                       ║
╚═══════════════════════════════════════╝

🔴 💊 🔵
</span>
`,

  'free your mind': () => {
    triggerMatrixEffect();
    return `
<span class="matrix-text">
Free your mind.

   ╱╲
  ╱  ╲
 ╱ 🧠 ╲
╱______╲

"You have to let it all go, Neo.
 Fear, doubt, and disbelief."

 - Morpheus
</span>
`;
  },

  matrix: () => commands['follow the white rabbit'](),
  
  neo: () => `<span class="success">Yes, that's you.</span>`,
  
  morpheus: () => `<span class="matrix-text">"I can only show you the door. You're the one that has to walk through it."</span>`,
  
  trinity: () => `<span class="matrix-text">"The answer is out there, Neo. It's looking for you. And it will find you, if you want it to."</span>`
};

function getDriveName(drive) {
  const names = {
    'A:': 'SYSTEM',
    'B:': 'ARCHIVES',
    'C:': 'PROJECTS',
    'D:': 'SECRETS'
  };
  return names[drive] || 'UNKNOWN';
}

function triggerMatrixEffect() {
  document.body.classList.add('matrix-effect');
  setTimeout(() => {
    document.body.classList.remove('matrix-effect');
  }, 3000);
}

function executeCommand() {
  const input = currentInput.value.trim();
  if (!input) return;
  
  history.value.push({ type: 'input', content: input });
  commandHistory.value.unshift(input);
  historyIndex.value = -1;
  
  const inputLower = input.toLowerCase();
  const [cmd, ...args] = input.split(' ');
  const cmdLower = cmd.toLowerCase();
  
  // Check for drive change (e.g., "C:", "D:")
  if (/^[A-D]:$/i.test(input)) {
    const drive = input.toUpperCase();
    if (fileSystem[drive]) {
      currentDrive.value = drive;
      currentDir.value = '\\';
    } else {
      history.value.push({ type: 'output', content: `<span class="error">Invalid drive: ${drive}</span>` });
    }
    currentInput.value = '';
    scrollToBottom();
    return;
  }
  
  // Check for secret codes (full phrase)
  if (commands[inputLower]) {
    const output = commands[inputLower](args);
    if (output !== null) {
      history.value.push({ type: 'output', content: output });
    }
    currentInput.value = '';
    scrollToBottom();
    return;
  }
  
  // Check for regular commands
  const commandFn = commands[cmdLower];
  if (commandFn) {
    const output = commandFn(args);
    if (output !== null) {
      history.value.push({ type: 'output', content: output });
    }
  } else {
    history.value.push({ 
      type: 'output', 
      content: `<span class="error">'${cmd}' is not recognized as an internal or external command.</span>\nType <span class="cmd-highlight">HELP</span> for available commands.`
    });
  }
  
  currentInput.value = '';
  scrollToBottom();
}

function historyUp() {
  if (historyIndex.value < commandHistory.value.length - 1) {
    historyIndex.value++;
    currentInput.value = commandHistory.value[historyIndex.value];
  }
}

function historyDown() {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    currentInput.value = commandHistory.value[historyIndex.value];
  } else {
    historyIndex.value = -1;
    currentInput.value = '';
  }
}

function autoComplete() {
  const input = currentInput.value.toUpperCase();
  const parts = input.split(' ');
  
  if (parts.length === 1) {
    const cmdNames = Object.keys(commands).filter(c => !c.includes(' '));
    const matches = cmdNames.filter(cmd => cmd.toUpperCase().startsWith(parts[0]));
    if (matches.length === 1) {
      currentInput.value = matches[0].toUpperCase() + ' ';
    }
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
    }
  });
}

function focusInput() {
  inputRef.value?.focus();
}

onMounted(() => {
  // Boot sequence
  setTimeout(() => {
    booting.value = false;
    nextTick(() => focusInput());
  }, bootLines.length * 100 + 500);
});
</script>

<style scoped>
.terminal-page {
  min-height: 100vh;
  background: #000;
  padding-top: 80px;
  position: relative;
}

/* CRT EFFECTS */
.crt-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s;
}

.crt-on .crt-overlay {
  opacity: 1;
}

.crt-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
}

.crt-flicker {
  position: absolute;
  inset: 0;
  background: rgba(16, 185, 129, 0.02);
  animation: crtFlicker 0.1s infinite;
}

@keyframes crtFlicker {
  0% { opacity: 0.9; }
  50% { opacity: 1; }
  100% { opacity: 0.95; }
}

.crt-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.crt-on .terminal-body {
  text-shadow: 0 0 5px rgba(16, 185, 129, 0.8), 0 0 10px rgba(16, 185, 129, 0.4);
}

/* HEADER */
.terminal-header {
  padding: 1rem 0;
  background: #000;
  border-bottom: 1px solid #0f0;
  position: relative;
  z-index: 10;
}

.terminal-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.terminal-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #0f0;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.terminal-back:hover {
  opacity: 1;
}

.terminal-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.terminal-header__icon {
  font-size: 1.5rem;
}

.terminal-header__title h1 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f0;
  letter-spacing: 0.1em;
}

.crt-toggle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #0f0;
  background: transparent;
  border: 1px solid #0f0;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.crt-toggle:hover {
  background: #0f0;
  color: #000;
}

/* TERMINAL WINDOW */
.terminal-section {
  padding: var(--space-lg) 0;
}

.terminal-window {
  max-width: 900px;
  margin: 0 auto;
  border: 2px solid #0f0;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 60px rgba(0, 0, 0, 0.5);
}

.terminal-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #0f0;
  color: #000;
}

.terminal-dots {
  display: flex;
  gap: 0.4rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #000;
}

.terminal-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.terminal-body {
  background: #000;
  padding: 1.5rem;
  height: 550px;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.5;
  color: #0f0;
  cursor: text;
}

/* BOOT SEQUENCE */
.boot-sequence {
  color: #0f0;
}

.boot-line {
  opacity: 0;
  animation: bootFadeIn 0.1s forwards;
}

@keyframes bootFadeIn {
  to { opacity: 1; }
}

/* ASCII ART */
.ascii-art {
  color: #0f0;
  font-size: 0.5rem;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.system-info {
  margin: 0.25rem 0;
}

.system-info.dim {
  opacity: 0.5;
}

.welcome-hint {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

/* TERMINAL LINES */
.terminal-line {
  margin-bottom: 0.25rem;
}

.terminal-prompt {
  color: #0f0;
  margin-right: 0.5rem;
}

.terminal-input-text {
  color: #fff;
}

.terminal-output {
  white-space: pre-wrap;
  color: #0f0;
  margin: 0.5rem 0;
}

/* INPUT */
.terminal-input-line {
  display: flex;
  align-items: center;
}

.terminal-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.terminal-input-mirror {
  color: #fff;
  white-space: pre;
}

.terminal-input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: transparent;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  outline: none;
  caret-color: transparent;
}

.terminal-cursor {
  color: #0f0;
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* OUTPUT STYLES */
:deep(.cmd-title) {
  color: #0f0;
  display: block;
}

:deep(.cmd-name) {
  color: #0ff;
}

:deep(.cmd-highlight) {
  color: #ff0;
  background: rgba(255, 255, 0, 0.1);
  padding: 0 0.3rem;
}

:deep(.error) {
  color: #f00;
}

:deep(.success) {
  color: #0f0;
}

:deep(.dim) {
  opacity: 0.5;
}

:deep(.dir-entry) {
  color: #0ff;
}

:deep(.file-entry) {
  color: #0f0;
}

:deep(.skill-cat) {
  color: #ff0;
  display: block;
  margin-top: 0.5rem;
}

:deep(.terminal-link) {
  color: #0ff;
  text-decoration: underline;
}

:deep(.matrix-text) {
  color: #0f0;
  text-shadow: 0 0 10px #0f0;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .terminal-body {
    height: 450px;
    padding: 1rem;
    font-size: 0.7rem;
  }
  
  .ascii-art {
    font-size: 0.35rem;
  }
  
  .terminal-header__inner {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>

<style>
/* Global matrix effect */
.matrix-effect {
  animation: matrixGlitch 0.15s ease-in-out 5;
}

@keyframes matrixGlitch {
  0%, 100% { filter: none; }
  25% { filter: hue-rotate(90deg) brightness(1.5); }
  50% { filter: hue-rotate(180deg) brightness(2); }
  75% { filter: hue-rotate(270deg) brightness(1.5); }
}
</style>
