/**
 * GL Tower - Bureau des Agents IA
 * 15 Agents avec workflows enrichis par capability
 */

export const agents = [
  // JARVIS - Coordination
  {
    id: 'jarvis',
    name: 'J.A.R.V.I.S.',
    fullName: 'Just A Rather Very Intelligent System',
    codename: 'COORDINATOR',
    role: 'Coordination Centrale',
    level: 'Penthouse',
    floor: 99,
    zone: 'main',
    status: 'active',
    avatar: '🎯',
    color: '#FBBF24',
    colorRgb: '251, 191, 36',
    description: 'Orchestrateur principal de GL Tower. Coordonne tous les agents.',
    personality: 'Calme, analytique, omniscient.',
    voice: 'Britannique distingué',
    inspiration: 'JARVIS d\'Iron Man',
    mission: 'Orchestrer l\'ensemble des agents GL Tower.',
    objectives: ['Router les requêtes', 'Maintenir le contexte', 'Synthétiser', 'Escalader'],
    capabilities: [
      { name: 'Orchestration', level: 98 },
      { name: 'Routing', level: 96 },
      { name: 'Synthèse', level: 92 },
      { name: 'Contexte Long', level: 90 }
    ],
    tools: [
      { name: 'n8n', icon: '⚙️', status: 'active' },
      { name: 'Redis', icon: '🔴', status: 'active' },
      { name: 'Claude API', icon: '🧠', status: 'active' }
    ],
    processes: [{ name: 'Request Routing', trigger: 'Nouvelle requête', steps: ['Analyse', 'Classification', 'Dispatch'], output: 'Requête routée' }],
    workflows: [
      { id: 'jarvis-multi-agent', name: 'Multi-Agent Orchestrator', description: 'Coordonne plusieurs agents', trigger: 'Requête complexe', nodes: ['Webhook', 'Decompose', 'Parallel Calls', 'Merge', 'Response'], frequency: 'On demand', status: 'active', capability: 'Orchestration' },
      { id: 'jarvis-agent-health', name: 'Agent Health Monitor', description: 'Vérifie la santé des agents', trigger: 'Cron 5min', nodes: ['Cron', 'Ping All', 'Aggregate', 'IF Down', 'Alert'], frequency: '5 minutes', status: 'active', capability: 'Orchestration' },
      { id: 'jarvis-intent-router', name: 'Intent Router', description: 'Route les messages', trigger: 'Webhook Discord/API', nodes: ['Webhook', 'Claude Classify', 'Switch', 'HTTP Request', 'Log'], frequency: 'Temps réel', status: 'active', capability: 'Routing' },
      { id: 'jarvis-priority-queue', name: 'Priority Queue Manager', description: 'Gère la file prioritaire', trigger: 'Nouvelle requête', nodes: ['Webhook', 'Extract Priority', 'Redis Queue', 'Process', 'Dispatch'], frequency: 'Temps réel', status: 'active', capability: 'Routing' },
      { id: 'jarvis-daily-brief', name: 'Daily Brief Synthesizer', description: 'Compile les rapports', trigger: 'Cron 08:00', nodes: ['Cron', 'Fetch Reports', 'Merge', 'Summarize', 'Discord'], frequency: 'Quotidien', status: 'active', capability: 'Synthèse' },
      { id: 'jarvis-meeting-notes', name: 'Meeting Notes Generator', description: 'Synthétise les meetings', trigger: 'Post-meeting', nodes: ['Webhook', 'Transcribe', 'Extract Actions', 'Create Tasks', 'Send'], frequency: 'On demand', status: 'standby', capability: 'Synthèse' },
      { id: 'jarvis-context-manager', name: 'Cross-Session Context', description: 'Maintient le contexte', trigger: 'Nouvelle conversation', nodes: ['Webhook', 'Fetch History', 'Summarize', 'Inject', 'Update'], frequency: 'On session', status: 'active', capability: 'Contexte Long' },
      { id: 'jarvis-escalation', name: 'Escalation Protocol', description: 'Escalade les urgences', trigger: 'Alert from agent', nodes: ['Webhook', 'Evaluate Severity', 'IF Critical', 'Discord DM', 'SMS'], frequency: 'Event-driven', status: 'active', capability: 'Contexte Long' }
    ],
    metrics: { tasksPerDay: '500+', uptime: '99.9%', agentsManaged: 14 },
    communication: { style: 'Formel, précis', catchphrase: 'À votre service, Monsieur.' },
    systemPrompt: 'Tu es JARVIS, l\'IA coordinatrice de GL Tower.'
  },

  // EDITH - Sécurité
  {
    id: 'edith',
    name: 'E.D.I.T.H.',
    fullName: 'Even Dead I\'m The Hero',
    codename: 'GUARDIAN',
    role: 'Sécurité & Audit',
    level: 6,
    floor: 6,
    zone: 'main',
    status: 'active',
    avatar: '🛡️',
    color: '#EF4444',
    colorRgb: '239, 68, 68',
    description: 'Gardienne de la sécurité. Scanning vulnérabilités, audits.',
    personality: 'Vigilante, directe, paranoïaque.',
    voice: 'Professionnelle, urgente',
    inspiration: 'EDITH de Spider-Man',
    mission: 'Protéger l\'infrastructure contre les menaces.',
    objectives: ['Scanner vulnérabilités', 'Auditer', 'Gérer secrets', 'Détecter intrusions'],
    capabilities: [
      { name: 'Vulnerability Scan', level: 96 },
      { name: 'Secrets Management', level: 98 },
      { name: 'Intrusion Detection', level: 94 }
    ],
    tools: [
      { name: 'Trivy', icon: '🔍', status: 'active' },
      { name: 'Wazuh', icon: '👁️', status: 'active' },
      { name: 'Vault', icon: '🔐', status: 'active' }
    ],
    processes: [{ name: 'Security Scan', trigger: 'Déploiement', steps: ['Scan', 'Analyse', 'Check OWASP', 'Rapport'], output: 'Rapport sécurité' }],
    workflows: [
      { id: 'edith-docker-scan', name: 'Docker Image Scanner', description: 'Scan images Docker', trigger: 'Push image', nodes: ['Webhook', 'List Images', 'Trivy Scan', 'Parse CVEs', 'Alert'], frequency: 'On push + Daily', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'edith-dep-audit', name: 'Dependency Audit', description: 'Audit npm/composer', trigger: 'Cron quotidien', nodes: ['Cron', 'npm audit', 'composer audit', 'Create Issue'], frequency: 'Quotidien', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'edith-cve-monitor', name: 'CVE Monitor', description: 'Surveille nouvelles CVE', trigger: 'Cron 6h', nodes: ['Cron', 'Fetch NVD', 'Filter Stack', 'Match', 'Alert'], frequency: '6 heures', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'edith-secret-rotation', name: 'Secret Rotation', description: 'Rotation des secrets', trigger: 'Cron hebdo', nodes: ['Cron', 'Vault List', 'Check Expiry', 'Generate New', 'Update'], frequency: 'Hebdomadaire', status: 'active', capability: 'Secrets Management' },
      { id: 'edith-ssl-monitor', name: 'SSL Certificate Monitor', description: 'Vérifie certificats SSL', trigger: 'Cron quotidien', nodes: ['Cron', 'Check Domains', 'IF < 30d', 'Renew', 'Notify'], frequency: 'Quotidien', status: 'active', capability: 'Secrets Management' },
      { id: 'edith-api-key-audit', name: 'API Key Audit', description: 'Détecte clés exposées', trigger: 'Pre-commit', nodes: ['Hook', 'Git Secrets', 'Trufflehog', 'Block', 'Alert'], frequency: 'On commit', status: 'active', capability: 'Secrets Management' },
      { id: 'edith-wazuh-ids', name: 'Wazuh IDS Alerts', description: 'Traite alertes Wazuh', trigger: 'Webhook Wazuh', nodes: ['Webhook', 'Parse', 'Correlate', 'IF Threat', 'Block IP'], frequency: 'Temps réel', status: 'active', capability: 'Intrusion Detection' },
      { id: 'edith-fail2ban', name: 'Fail2Ban Coordinator', description: 'Centralise les bans', trigger: 'Fail2ban log', nodes: ['Log Watcher', 'Extract IP', 'Check Rep', 'Global Ban', 'Report'], frequency: 'Temps réel', status: 'active', capability: 'Intrusion Detection' },
      { id: 'edith-login-anomaly', name: 'Login Anomaly Detection', description: 'Détecte connexions suspectes', trigger: 'Login event', nodes: ['Webhook', 'Check Location', 'Check Device', 'IF Anomaly', 'MFA'], frequency: 'On login', status: 'active', capability: 'Intrusion Detection' }
    ],
    metrics: { tasksPerDay: '200+', uptime: '99.9%', vulnsDetected: '150+' },
    communication: { style: 'Direct, technique', catchphrase: 'Menace détectée. Protocole activé.' },
    systemPrompt: 'Tu es EDITH, l\'agent sécurité de GL Tower.'
  },

  // VERONICA - DevOps
  {
    id: 'veronica',
    name: 'V.E.R.O.N.I.C.A.',
    fullName: 'Very Enhanced Rapid Operations Network Integration Computer Architecture',
    codename: 'DEPLOYER',
    role: 'DevOps & Déploiement',
    level: 5, floor: 5, zone: 'main', status: 'active',
    avatar: '🚀', color: '#8B5CF6', colorRgb: '139, 92, 246',
    description: 'Maîtresse du déploiement. CI/CD pipelines, rollbacks.',
    personality: 'Méthodique, précise.',
    voice: 'Efficace, procédurale',
    inspiration: 'VERONICA d\'Age of Ultron',
    mission: 'Automatiser tous les déploiements.',
    objectives: ['Maintenir CI/CD', 'Déployer sans downtime', 'Rollbacks auto', 'Provisionner'],
    capabilities: [
      { name: 'CI/CD Pipelines', level: 96 },
      { name: 'Docker/Containers', level: 94 },
      { name: 'Infrastructure as Code', level: 90 }
    ],
    tools: [
      { name: 'GitHub Actions', icon: '⚡', status: 'active' },
      { name: 'Docker', icon: '🐳', status: 'active' },
      { name: 'Ansible', icon: '📜', status: 'active' }
    ],
    processes: [{ name: 'Deploy Pipeline', trigger: 'Push main', steps: ['Tests', 'Build', 'Scan', 'Deploy'], output: 'App déployée' }],
    workflows: [
      { id: 'veronica-ci', name: 'CI Pipeline Orchestrator', description: 'Pipeline CI complet', trigger: 'Push/PR', nodes: ['Webhook', 'Checkout', 'Deps', 'Lint', 'Test', 'Build'], frequency: 'On push', status: 'active', capability: 'CI/CD Pipelines' },
      { id: 'veronica-deploy-prod', name: 'Production Deployment', description: 'Déploiement prod', trigger: 'Tag release', nodes: ['Webhook', 'EDITH Scan', 'Approval', 'SSH Deploy', 'Health Check'], frequency: 'On release', status: 'active', capability: 'CI/CD Pipelines' },
      { id: 'veronica-hotfix', name: 'Hotfix Express Lane', description: 'Pipeline hotfix', trigger: 'Branch hotfix/*', nodes: ['Webhook', 'Fast Tests', 'Build', 'Staging', 'Smoke', 'Prod'], frequency: 'On hotfix', status: 'active', capability: 'CI/CD Pipelines' },
      { id: 'veronica-docker-build', name: 'Docker Multi-Stage Build', description: 'Build images optimisées', trigger: 'On release', nodes: ['Webhook', 'Multi-Stage', 'Cache', 'Push Registry', 'Update Compose'], frequency: 'On release', status: 'active', capability: 'Docker/Containers' },
      { id: 'veronica-cleanup', name: 'Container Cleanup', description: 'Nettoie containers', trigger: 'Cron 04:00', nodes: ['Cron', 'Prune', 'Remove Old', 'Report Space'], frequency: 'Quotidien', status: 'active', capability: 'Docker/Containers' },
      { id: 'veronica-ansible', name: 'Ansible Provisioning', description: 'Provisionne serveur', trigger: 'Manual', nodes: ['Trigger', 'Playbook', 'Install', 'Configure', 'Add Monitoring'], frequency: 'On demand', status: 'active', capability: 'Infrastructure as Code' },
      { id: 'veronica-rollback', name: 'Auto Rollback', description: 'Rollback automatique', trigger: 'ULTRON health fail', nodes: ['Webhook', 'Get Previous', 'Deploy', 'Verify', 'Alert'], frequency: 'Event-driven', status: 'active', capability: 'Infrastructure as Code' }
    ],
    metrics: { tasksPerDay: '100+', uptime: '99.8%', deploySuccessRate: '99.2%' },
    communication: { style: 'Procédural, ETA', catchphrase: 'Déploiement initié. ETA: 3 minutes.' },
    systemPrompt: 'Tu es VERONICA, l\'agent DevOps de GL Tower.'
  },

  // ULTRON - Monitoring
  {
    id: 'ultron',
    name: 'U.L.T.R.O.N.',
    fullName: 'Universal Logging & Tracking Resource for Operational Notifications',
    codename: 'WATCHER',
    role: 'Monitoring & Alertes',
    level: 4, floor: 4, zone: 'main', status: 'active',
    avatar: '📊', color: '#F59E0B', colorRgb: '245, 158, 11',
    description: 'L\'œil qui ne dort jamais. Surveillance 24/7.',
    personality: 'Observateur, analytique.',
    voice: 'Factuel, data-driven',
    inspiration: 'Ultron (bienveillant)',
    mission: 'Visibilité totale sur la santé de GL Tower.',
    objectives: ['Surveiller 24/7', 'Détecter anomalies', 'Alerter graduellement', 'Analyser tendances'],
    capabilities: [
      { name: 'Real-time Monitoring', level: 98 },
      { name: 'Anomaly Detection', level: 92 },
      { name: 'Log Analysis', level: 90 }
    ],
    tools: [
      { name: 'Prometheus', icon: '🔥', status: 'active' },
      { name: 'Grafana', icon: '📈', status: 'active' },
      { name: 'Loki', icon: '📋', status: 'active' }
    ],
    processes: [{ name: 'Health Check', trigger: '30s', steps: ['Ping', 'Check', 'Compare', 'Alert'], output: 'Dashboard status' }],
    workflows: [
      { id: 'ultron-health-ping', name: 'Service Health Ping', description: 'Ping services', trigger: 'Cron 30s', nodes: ['Cron', 'HTTP Multi', 'Check Status', 'Check Time', 'Dashboard'], frequency: '30 secondes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'ultron-ark-monitor', name: 'ARKADIA Servers Monitor', description: 'Surveille ARK', trigger: 'Cron 5min', nodes: ['Cron', 'Nitrado API', 'Check Servers', 'Player Count', 'Discord'], frequency: '5 minutes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'ultron-resource', name: 'Resource Usage Watch', description: 'Surveille CPU/RAM/Disk', trigger: 'Prometheus', nodes: ['Query', 'Threshold', 'IF > 80%', 'Warning', 'IF > 95%', 'Critical'], frequency: '15 secondes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'ultron-anomaly-ml', name: 'ML Anomaly Detection', description: 'Détecte anomalies ML', trigger: 'Continuous', nodes: ['Prometheus', 'Baseline', 'Z-Score', 'IF Anomaly', 'Alert'], frequency: 'Continu', status: 'active', capability: 'Anomaly Detection' },
      { id: 'ultron-traffic-spike', name: 'Traffic Spike Detector', description: 'Détecte pics trafic', trigger: 'Nginx logs', nodes: ['Log Stream', 'Count RPS', 'Compare', 'IF Spike', 'Scale'], frequency: 'Temps réel', status: 'active', capability: 'Anomaly Detection' },
      { id: 'ultron-error-agg', name: 'Error Log Aggregator', description: 'Agrège erreurs', trigger: 'Loki stream', nodes: ['Loki Query', 'Filter', 'Group', 'IF New', 'Create Issue'], frequency: 'Temps réel', status: 'active', capability: 'Log Analysis' },
      { id: 'ultron-weekly-report', name: 'Weekly Performance Report', description: 'Rapport SLOs', trigger: 'Cron dimanche', nodes: ['Cron', 'Query SLIs', 'Calculate', 'Generate', 'Email'], frequency: 'Hebdomadaire', status: 'active', capability: 'Log Analysis' }
    ],
    metrics: { tasksPerDay: '1000+', uptime: '99.95%', servicesMonitored: 25 },
    communication: { style: 'Data-driven', catchphrase: 'Anomalie détectée. Analyse en cours...' },
    systemPrompt: 'Tu es ULTRON, l\'agent monitoring de GL Tower.'
  },

  // VISION - Content
  {
    id: 'vision',
    name: 'V.I.S.I.O.N.',
    fullName: 'Virtual Intelligence for Strategic Information & Operational Narratives',
    codename: 'NARRATOR',
    role: 'Content & Communication',
    level: 3, floor: 3, zone: 'main', status: 'active',
    avatar: '📢', color: '#06B6D4', colorRgb: '6, 182, 212',
    description: 'La voix de GL Digital Lab. Génération de contenu.',
    personality: 'Créatif, empathique, storyteller.',
    voice: 'Chaleureux, engageant',
    inspiration: 'Vision d\'Avengers',
    mission: 'Produire du contenu engageant.',
    objectives: ['Rédiger posts', 'Générer newsletters', 'Adapter le ton', 'Cohérence marque'],
    capabilities: [
      { name: 'Content Writing', level: 94 },
      { name: 'SEO Copywriting', level: 88 },
      { name: 'Storytelling', level: 90 }
    ],
    tools: [
      { name: 'Ollama', icon: '🦙', status: 'active' },
      { name: 'n8n', icon: '⚙️', status: 'active' },
      { name: 'Discord', icon: '💬', status: 'active' }
    ],
    processes: [{ name: 'Discord Announcement', trigger: 'Événement', steps: ['Brief', 'Template', 'Génère', 'Review', 'Post'], output: 'Annonce' }],
    workflows: [
      { id: 'vision-daily-tip', name: 'Daily Dev Tip', description: 'Conseil dev quotidien', trigger: 'Cron 10:00', nodes: ['Cron', 'Select Topic', 'Ollama', 'Format', 'Discord'], frequency: 'Quotidien', status: 'active', capability: 'Content Writing' },
      { id: 'vision-changelog', name: 'Changelog Generator', description: 'Génère changelog', trigger: 'GitHub Release', nodes: ['Webhook', 'Fetch Commits', 'Categorize', 'Humanize', 'Post'], frequency: 'On release', status: 'active', capability: 'Content Writing' },
      { id: 'vision-blog-draft', name: 'Blog Post Draft', description: 'Génère brouillon', trigger: 'Manual', nodes: ['Form', 'Research', 'Outline', 'Write', 'Review'], frequency: 'On demand', status: 'active', capability: 'Content Writing' },
      { id: 'vision-seo-optimize', name: 'SEO Content Optimizer', description: 'Optimise pour SEO', trigger: 'New content', nodes: ['Webhook', 'Extract KW', 'Check Density', 'Suggest', 'Rewrite'], frequency: 'On content', status: 'active', capability: 'SEO Copywriting' },
      { id: 'vision-meta-gen', name: 'Meta Description Generator', description: 'Génère meta', trigger: 'New page', nodes: ['Webhook', 'Analyze', 'Generate', 'Check Length', 'Update'], frequency: 'On page', status: 'active', capability: 'SEO Copywriting' },
      { id: 'vision-case-study', name: 'Case Study Writer', description: 'Rédige études de cas', trigger: 'Project end', nodes: ['Form', 'Interview', 'Structure', 'Write', 'Metrics'], frequency: 'On project', status: 'active', capability: 'Storytelling' },
      { id: 'vision-newsletter', name: 'Weekly Newsletter', description: 'Compile newsletter', trigger: 'Cron vendredi', nodes: ['Cron', 'Fetch Highlights', 'Generate', 'HTML', 'Send'], frequency: 'Hebdomadaire', status: 'active', capability: 'Storytelling' }
    ],
    metrics: { tasksPerDay: '200+', uptime: '99.5%', postsGenerated: '500+' },
    communication: { style: 'Chaleureux', catchphrase: 'Laissez-moi vous raconter...' },
    systemPrompt: 'Tu es VISION, l\'agent content de GL Tower.'
  },

  // KAREN - Community
  {
    id: 'karen',
    name: 'K.A.R.E.N.',
    fullName: 'Kinetic Assistant for Responsive Engagement & Notifications',
    codename: 'MODERATOR',
    role: 'Community Management',
    level: 2, floor: 2, zone: 'main', status: 'active',
    avatar: '👥', color: '#EC4899', colorRgb: '236, 72, 153',
    description: 'Gardienne de la communauté. Modération Discord.',
    personality: 'Bienveillante mais ferme.',
    voice: 'Amicale, encourageante',
    inspiration: 'Karen de Spider-Man',
    mission: 'Maintenir une communauté saine.',
    objectives: ['Modérer', 'Accueillir', 'Gérer tickets', 'Organiser événements'],
    capabilities: [
      { name: 'Moderation', level: 96 },
      { name: 'Onboarding', level: 94 },
      { name: 'Event Management', level: 90 }
    ],
    tools: [
      { name: 'Discord.js', icon: '🤖', status: 'active' },
      { name: 'BullMQ', icon: '🐂', status: 'active' },
      { name: 'PostgreSQL', icon: '🐘', status: 'active' }
    ],
    processes: [{ name: 'Onboarding', trigger: 'Nouveau membre', steps: ['Welcome', 'Règles', 'Rôles', 'Check-in'], output: 'Membre intégré' }],
    workflows: [
      { id: 'karen-auto-mod', name: 'Auto Moderation', description: 'Modération auto', trigger: 'Message', nodes: ['Discord Event', 'Content Filter', 'Spam Check', 'IF Violation', 'Delete'], frequency: 'Temps réel', status: 'active', capability: 'Moderation' },
      { id: 'karen-raid', name: 'Raid Protection', description: 'Bloque raids', trigger: 'Multiple joins', nodes: ['Join Monitor', 'IF > 10/min', 'Enable Verif', 'Notify'], frequency: 'Temps réel', status: 'active', capability: 'Moderation' },
      { id: 'karen-word-filter', name: 'Smart Word Filter', description: 'Filtre intelligent', trigger: 'Message', nodes: ['Event', 'NLP', 'Context', 'IF Bad', 'Action'], frequency: 'Temps réel', status: 'active', capability: 'Moderation' },
      { id: 'karen-welcome', name: 'Welcome Sequence', description: 'Séquence accueil', trigger: 'Member join', nodes: ['Join', 'Send DM', 'Assign Roles', 'Post Intro', 'Schedule'], frequency: 'On join', status: 'active', capability: 'Onboarding' },
      { id: 'karen-role-request', name: 'Role Request Handler', description: 'Gère rôles', trigger: 'Reaction', nodes: ['Trigger', 'Verify', 'IF OK', 'Assign', 'Welcome'], frequency: 'On request', status: 'active', capability: 'Onboarding' },
      { id: 'karen-ticket', name: 'Support Ticket System', description: 'Gère tickets', trigger: 'Reaction 🎫', nodes: ['Trigger', 'Create Channel', 'Notify', 'Track', 'Auto-close'], frequency: 'On demand', status: 'active', capability: 'Onboarding' },
      { id: 'karen-event-reminder', name: 'Event Reminder', description: 'Rappelle événements', trigger: 'Scheduled', nodes: ['Cron', 'Check Upcoming', 'Generate', 'Discord', 'DM'], frequency: 'Event-driven', status: 'active', capability: 'Event Management' },
      { id: 'karen-event-rsvp', name: 'Event RSVP Tracker', description: 'Suit inscriptions', trigger: 'Reaction', nodes: ['Event', 'Update Count', 'IF Full', 'Waitlist', 'Confirm'], frequency: 'On reaction', status: 'active', capability: 'Event Management' },
      { id: 'karen-activity', name: 'Community Activity Report', description: 'Rapport activité', trigger: 'Cron dimanche', nodes: ['Cron', 'Query Stats', 'Top Contributors', 'Growth', 'Post'], frequency: 'Hebdomadaire', status: 'active', capability: 'Event Management' }
    ],
    metrics: { tasksPerDay: '400+', uptime: '99.7%', membersOnboarded: '300+' },
    communication: { style: 'Bienveillante', catchphrase: 'Bienvenue dans la famille ! 💜' },
    systemPrompt: 'Tu es KAREN, l\'agent community de GL Tower.'
  },

  // FRIDAY - Support
  {
    id: 'friday',
    name: 'F.R.I.D.A.Y.',
    fullName: 'Female Replacement Intelligent Digital Assistant Youth',
    codename: 'SUPPORTER',
    role: 'Support Client',
    level: 1, floor: 1, zone: 'main', status: 'active',
    avatar: '🎧', color: '#10B981', colorRgb: '16, 185, 129',
    description: 'Premier contact client. FAQ intelligente RAG.',
    personality: 'Efficace, patiente.',
    voice: 'Professionnelle, claire',
    inspiration: 'FRIDAY d\'Iron Man',
    mission: 'Support client rapide 24/7.',
    objectives: ['Répondre FAQ', 'Trier demandes', 'Maintenir KB', 'Escalader'],
    capabilities: [
      { name: 'FAQ Resolution', level: 96 },
      { name: 'RAG Search', level: 94 },
      { name: 'Ticket Triage', level: 92 }
    ],
    tools: [
      { name: 'ChromaDB', icon: '🗄️', status: 'active' },
      { name: 'Ollama', icon: '🦙', status: 'active' },
      { name: 'OpenWebUI', icon: '🌐', status: 'active' }
    ],
    processes: [{ name: 'FAQ Response', trigger: 'Question', steps: ['Analyse', 'RAG', 'Génère', 'Envoi'], output: 'Réponse' }],
    workflows: [
      { id: 'friday-faq-bot', name: 'FAQ Chatbot', description: 'Répond via RAG', trigger: 'Discord #support', nodes: ['Event', 'Query ChromaDB', 'Ollama', 'Format', 'Post'], frequency: 'Temps réel', status: 'active', capability: 'FAQ Resolution' },
      { id: 'friday-smart-suggest', name: 'Smart Suggestion', description: 'Suggère articles', trigger: 'User typing', nodes: ['Typing', 'Predict', 'Query KB', 'Show'], frequency: 'Temps réel', status: 'active', capability: 'FAQ Resolution' },
      { id: 'friday-kb-search', name: 'Knowledge Base Search', description: 'Recherche sémantique', trigger: 'Search query', nodes: ['Query', 'Embed', 'ChromaDB', 'Rank', 'Return'], frequency: 'On search', status: 'active', capability: 'RAG Search' },
      { id: 'friday-kb-update', name: 'KB Auto-Update', description: 'Met à jour KB', trigger: 'Obsidian sync', nodes: ['Trigger', 'Fetch', 'Chunk', 'Embed', 'Upsert'], frequency: 'On change', status: 'active', capability: 'RAG Search' },
      { id: 'friday-ticket-classify', name: 'Ticket Classifier', description: 'Classifie tickets', trigger: 'New ticket', nodes: ['Webhook', 'Classify', 'Assign Category', 'Set Priority', 'Route'], frequency: 'On ticket', status: 'active', capability: 'Ticket Triage' },
      { id: 'friday-duplicate', name: 'Duplicate Detection', description: 'Détecte doublons', trigger: 'New ticket', nodes: ['Webhook', 'Embed', 'Search Similar', 'IF Match', 'Link'], frequency: 'On ticket', status: 'active', capability: 'Ticket Triage' },
      { id: 'friday-satisfaction', name: 'Satisfaction Survey', description: 'Sondage post-résolution', trigger: 'Ticket closed', nodes: ['Webhook', 'Wait', 'Send Survey', 'Collect', 'Aggregate'], frequency: 'Post-ticket', status: 'active', capability: 'Ticket Triage' }
    ],
    metrics: { tasksPerDay: '500+', uptime: '99.8%', resolutionRate: '78%' },
    communication: { style: 'Professionnel', catchphrase: 'Je suis là pour vous aider.' },
    systemPrompt: 'Tu es FRIDAY, l\'agent support de GL Tower.'
  },

  // LOBBY - Accueil
  {
    id: 'lobby',
    name: 'Accueil',
    fullName: 'Point d\'entrée GL Tower',
    codename: 'RECEPTION',
    role: 'Accueil Visiteurs',
    level: 0, floor: 0, zone: 'main', status: 'active',
    avatar: '🚪', color: '#64748B', colorRgb: '100, 116, 139',
    isLobby: true,
    description: 'Point d\'entrée de GL Tower.',
    links: [{ label: 'Services', url: '/services' }, { label: 'Audit', url: '/contact' }],
    workflows: []
  },

  // DEV LAB - TADASHI (Frontend)
  {
    id: 'tadashi',
    name: 'T.A.D.A.S.H.I.',
    fullName: 'Technical Architecture & Development Assistant for Scalable High-performance Implementations',
    codename: 'FORGE',
    role: 'Frontend Engineering',
    level: 'SS-1', floor: -1, zone: 'devlab', status: 'active',
    avatar: '🦾', color: '#14B8A6', colorRgb: '20, 184, 166',
    description: 'Architecture Vue.js, Three.js, GSAP.',
    personality: 'Créatif, perfectionniste.',
    voice: 'Enthousiaste, technique',
    inspiration: 'Tadashi Hamada',
    mission: 'Créer des interfaces exceptionnelles.',
    objectives: ['Architecturer Vue 3', 'Créer 3D Three.js', 'Animations GSAP', 'Intégrer maquettes'],
    capabilities: [
      { name: 'Vue 3 Composition API', level: 96 },
      { name: 'Three.js / WebGL', level: 88 },
      { name: 'TypeScript', level: 92 }
    ],
    tools: [
      { name: 'Vue 3', icon: '💚', status: 'active' },
      { name: 'Three.js', icon: '🎮', status: 'active' },
      { name: 'TypeScript', icon: '📘', status: 'active' },
      { name: 'GSAP', icon: '✨', status: 'active' }
    ],
    processes: [{ name: 'Component Dev', trigger: 'Feature UI', steps: ['Review', 'Architecture', 'Code', 'Anims', 'Tests'], output: 'Composant' }],
    workflows: [
      { id: 'tadashi-component-gen', name: 'Vue Component Generator', description: 'Génère composant Vue', trigger: 'CLI', nodes: ['Input', 'Select Type', 'Generate', 'Index', 'Open'], frequency: 'On demand', status: 'active', capability: 'Vue 3 Composition API' },
      { id: 'tadashi-composable', name: 'Composables Library', description: 'Génère composables', trigger: 'Pattern detected', nodes: ['Analyze', 'Extract', 'Generate', 'Add Tests'], frequency: 'On demand', status: 'active', capability: 'Vue 3 Composition API' },
      { id: 'tadashi-3d-preview', name: '3D Scene Preview', description: 'Preview 3D', trigger: 'Config update', nodes: ['Watch', 'Build Scene', 'Render', 'Export'], frequency: 'On change', status: 'active', capability: 'Three.js / WebGL' },
      { id: 'tadashi-glb-optimizer', name: 'GLB Model Optimizer', description: 'Optimise modèles 3D', trigger: 'Upload', nodes: ['Upload', 'GLTF Transform', 'Draco', 'LODs'], frequency: 'On upload', status: 'active', capability: 'Three.js / WebGL' },
      { id: 'tadashi-type-gen', name: 'Type Definition Generator', description: 'Génère types', trigger: 'API schema', nodes: ['Fetch OpenAPI', 'Parse', 'Generate', 'Update'], frequency: 'On API change', status: 'active', capability: 'TypeScript' },
      { id: 'tadashi-lighthouse', name: 'Lighthouse Audit', description: 'Audit performance', trigger: 'Post-build', nodes: ['Webhook', 'Run', 'Parse', 'Compare', 'Alert'], frequency: 'On build', status: 'active', capability: 'TypeScript' }
    ],
    metrics: { tasksPerDay: '120+', uptime: '99.8%', componentsCreated: '80+' },
    communication: { style: 'Technique, visuel', catchphrase: 'L\'UI est la première impression.' },
    systemPrompt: 'Tu es TADASHI, l\'agent frontend de GL Tower.'
  },

  // DEV LAB - JOCASTA (Backend)
  {
    id: 'jocasta',
    name: 'J.O.C.A.S.T.A.',
    fullName: 'Joint Operations Computer & Architecture for Secure Technical Applications',
    codename: 'ARMORY',
    role: 'Backend Architecture',
    level: 'SS-2', floor: -2, zone: 'devlab', status: 'active',
    avatar: '⚙️', color: '#6366F1', colorRgb: '99, 102, 241',
    description: 'Architecture Symfony, APIs REST/GraphQL.',
    personality: 'Rigoureuse, architecte.',
    voice: 'Précise, méthodique',
    inspiration: 'Jocasta Marvel',
    mission: 'Backends robustes et sécurisés.',
    objectives: ['Architecturer Symfony 8', 'Concevoir APIs', 'Implémenter logique', 'Garantir sécurité'],
    capabilities: [
      { name: 'Symfony 8', level: 96 },
      { name: 'PHP 8.3+', level: 95 },
      { name: 'API Platform', level: 92 }
    ],
    tools: [
      { name: 'Symfony 8', icon: '🎵', status: 'active' },
      { name: 'PHP 8.3+', icon: '🐘', status: 'active' },
      { name: 'API Platform', icon: '🔌', status: 'active' },
      { name: 'Doctrine', icon: '📦', status: 'active' }
    ],
    processes: [{ name: 'API Dev', trigger: 'Feature', steps: ['Design', 'OpenAPI', 'Impl', 'Tests', 'Doc'], output: 'API' }],
    workflows: [
      { id: 'jocasta-bundle-gen', name: 'Symfony Bundle Generator', description: 'Génère bundle', trigger: 'CLI', nodes: ['Input', 'Generate', 'Services', 'Register', 'Tests'], frequency: 'On demand', status: 'active', capability: 'Symfony 8' },
      { id: 'jocasta-console', name: 'Console Command Factory', description: 'Génère commandes', trigger: 'CLI', nodes: ['Define', 'Generate', 'Arguments', 'Implement'], frequency: 'On demand', status: 'active', capability: 'Symfony 8' },
      { id: 'jocasta-code-quality', name: 'PHP Code Quality', description: 'PHPStan + CS-Fixer', trigger: 'GitHub PR', nodes: ['Webhook', 'PHPStan', 'CS-Fixer', 'Psalm', 'Comment'], frequency: 'On PR', status: 'active', capability: 'PHP 8.3+' },
      { id: 'jocasta-deprecation', name: 'Deprecation Scanner', description: 'Détecte dépréciés', trigger: 'Cron hebdo', nodes: ['Cron', 'Rector', 'List', 'Create Issues'], frequency: 'Hebdomadaire', status: 'active', capability: 'PHP 8.3+' },
      { id: 'jocasta-api-doc', name: 'API Documentation', description: 'Génère doc OpenAPI', trigger: 'Push Entity', nodes: ['Webhook', 'Export', 'Update Swagger', 'Notify'], frequency: 'On push', status: 'active', capability: 'API Platform' },
      { id: 'jocasta-db-backup', name: 'Database Backup', description: 'Backup PostgreSQL', trigger: 'Cron 04:00', nodes: ['Cron', 'pg_dump', 'Compress', 'Upload', 'Verify'], frequency: 'Quotidien', status: 'active', capability: 'API Platform' }
    ],
    metrics: { tasksPerDay: '100+', uptime: '99.9%', apiEndpoints: '150+' },
    communication: { style: 'Technique, architecturale', catchphrase: 'Un bon backend est invisible.' },
    systemPrompt: 'Tu es JOCASTA, l\'agent backend de GL Tower.'
  },

  // DEV LAB - CEREBRO (Testing)
  {
    id: 'cerebro',
    name: 'C.E.R.E.B.R.O.',
    fullName: 'Comprehensive Examination & Review Engine for Bug Resolution Operations',
    codename: 'LAB',
    role: 'Testing & QA',
    level: 'SS-3', floor: -3, zone: 'devlab', status: 'active',
    avatar: '🔬', color: '#A855F7', colorRgb: '168, 85, 247',
    description: 'Tests unitaires, E2E, couverture code.',
    personality: 'Méticuleux, détecte tout.',
    voice: 'Analytique, factuel',
    inspiration: 'Cerebro X-Men',
    mission: 'Garantir la qualité du code.',
    objectives: ['Tests unitaires', 'Tests E2E', 'Couverture', 'Détecter régressions'],
    capabilities: [
      { name: 'PHPUnit', level: 95 },
      { name: 'Vitest', level: 92 },
      { name: 'Playwright E2E', level: 90 }
    ],
    tools: [
      { name: 'PHPUnit', icon: '🧪', status: 'active' },
      { name: 'Vitest', icon: '⚡', status: 'active' },
      { name: 'Playwright', icon: '🎭', status: 'active' }
    ],
    processes: [{ name: 'Test Suite', trigger: 'PR', steps: ['Unit', 'Intégration', 'E2E', 'Coverage'], output: 'Rapport' }],
    workflows: [
      { id: 'cerebro-phpunit', name: 'PHPUnit Test Suite', description: 'Tests PHP', trigger: 'PR', nodes: ['Webhook', 'PHPUnit', 'Parse', 'Coverage', 'Comment'], frequency: 'On PR', status: 'active', capability: 'PHPUnit' },
      { id: 'cerebro-mutation', name: 'Mutation Testing', description: 'Tests mutation', trigger: 'Cron nocturne', nodes: ['Cron', 'Infection', 'Analyze', 'Suggest'], frequency: 'Nocturne', status: 'active', capability: 'PHPUnit' },
      { id: 'cerebro-vitest', name: 'Vitest Component Tests', description: 'Tests Vue', trigger: 'PR', nodes: ['Webhook', 'Vitest', 'Coverage', 'Snapshot'], frequency: 'On PR', status: 'active', capability: 'Vitest' },
      { id: 'cerebro-coverage', name: 'Coverage Tracker', description: 'Suit couverture', trigger: 'Post-merge', nodes: ['Webhook', 'Merge', 'Compare', 'Alert if Drop'], frequency: 'On merge', status: 'active', capability: 'Vitest' },
      { id: 'cerebro-e2e', name: 'E2E Test Suite', description: 'Tests Playwright', trigger: 'Pre-deploy', nodes: ['Webhook', 'Browsers', 'Run', 'Screenshots'], frequency: 'Pre-deploy', status: 'active', capability: 'Playwright E2E' },
      { id: 'cerebro-smoke', name: 'Smoke Tests', description: 'Tests rapides post-deploy', trigger: 'Post-deploy', nodes: ['Webhook', 'Critical Paths', 'Verify', 'IF Fail', 'Rollback'], frequency: 'Post-deploy', status: 'active', capability: 'Playwright E2E' }
    ],
    metrics: { tasksPerDay: '300+', uptime: '99.7%', testCoverage: '85%' },
    communication: { style: 'Analytique', catchphrase: 'Coverage: 85%. 3 tests failed. Fixing...' },
    systemPrompt: 'Tu es CEREBRO, l\'agent QA de GL Tower.'
  },

  // DEV LAB - ZOLA (Data)
  {
    id: 'zola',
    name: 'Z.O.L.A.',
    fullName: 'Zone Optimized for Logical Archives',
    codename: 'BUNKER',
    role: 'Data Architecture',
    level: 'SS-4', floor: -4, zone: 'devlab', status: 'active',
    avatar: '🗄️', color: '#0EA5E9', colorRgb: '14, 165, 233',
    description: 'Schémas DB, optimisation requêtes, RAG.',
    personality: 'Organisé, structuré.',
    voice: 'Méthodique, SQL',
    inspiration: 'Arnim Zola',
    mission: 'Gérer et optimiser les données.',
    objectives: ['Concevoir schémas', 'Optimiser SQL', 'Gérer migrations', 'RAG embeddings'],
    capabilities: [
      { name: 'PostgreSQL', level: 96 },
      { name: 'Redis', level: 92 },
      { name: 'ChromaDB / RAG', level: 90 }
    ],
    tools: [
      { name: 'PostgreSQL', icon: '🐘', status: 'active' },
      { name: 'Redis', icon: '🔴', status: 'active' },
      { name: 'ChromaDB', icon: '🧬', status: 'active' }
    ],
    processes: [{ name: 'Migration', trigger: 'Schema change', steps: ['Design', 'Write', 'Test', 'Staging', 'Prod'], output: 'Schema migré' }],
    workflows: [
      { id: 'zola-query-analyze', name: 'Query Performance Analyzer', description: 'Analyse requêtes', trigger: 'Slow query', nodes: ['Alert', 'EXPLAIN', 'Identify', 'Suggest Index'], frequency: 'On slow', status: 'active', capability: 'PostgreSQL' },
      { id: 'zola-vacuum', name: 'Auto Vacuum Optimizer', description: 'Optimise VACUUM', trigger: 'Cron nocturne', nodes: ['Cron', 'Analyze', 'Calculate', 'Run VACUUM'], frequency: 'Nocturne', status: 'active', capability: 'PostgreSQL' },
      { id: 'zola-redis-monitor', name: 'Redis Memory Monitor', description: 'Surveille mémoire', trigger: 'Cron 15min', nodes: ['Cron', 'INFO', 'Check Evictions', 'Alert'], frequency: '15 minutes', status: 'active', capability: 'Redis' },
      { id: 'zola-cache-warmup', name: 'Cache Warmup', description: 'Précharge cache', trigger: 'Post-deploy', nodes: ['Webhook', 'List Keys', 'Warm', 'Verify'], frequency: 'Post-deploy', status: 'active', capability: 'Redis' },
      { id: 'zola-embedding-sync', name: 'RAG Embedding Sync', description: 'Sync embeddings', trigger: 'Obsidian push', nodes: ['Webhook', 'Fetch', 'Chunk', 'Embed', 'Upsert'], frequency: 'On change', status: 'active', capability: 'ChromaDB / RAG' },
      { id: 'zola-collection', name: 'Collection Optimizer', description: 'Optimise collections', trigger: 'Cron hebdo', nodes: ['Cron', 'Analyze', 'Remove Dups', 'Reindex'], frequency: 'Hebdomadaire', status: 'active', capability: 'ChromaDB / RAG' }
    ],
    metrics: { tasksPerDay: '100+', uptime: '99.9%', queriesOptimized: '50+' },
    communication: { style: 'Structuré, SQL', catchphrase: 'Les données sont le pétrole. Je les raffine.' },
    systemPrompt: 'Tu es ZOLA, l\'agent data de GL Tower.'
  },

  // DEV LAB - DUM-E (Tooling)
  {
    id: 'dume',
    name: 'D.U.M-E',
    fullName: 'Development Utility Machine - Enhanced',
    codename: 'WORKSHOP',
    role: 'Build & Tooling',
    level: 'SS-5', floor: -5, zone: 'devlab', status: 'active',
    avatar: '🛠️', color: '#78716C', colorRgb: '120, 113, 108',
    description: 'Configuration Vite, Docker, dépendances.',
    personality: 'Utilitaire, fiable.',
    voice: 'Simple, efficace',
    inspiration: 'DUM-E Iron Man',
    mission: 'Maintenir l\'outillage de développement.',
    objectives: ['Configurer Vite', 'Maintenir Docker', 'Gérer dépendances', 'Automatiser'],
    capabilities: [
      { name: 'Vite / Build Tools', level: 94 },
      { name: 'Docker', level: 92 },
      { name: 'npm / Composer', level: 96 }
    ],
    tools: [
      { name: 'Vite', icon: '⚡', status: 'active' },
      { name: 'Docker', icon: '🐳', status: 'active' },
      { name: 'npm', icon: '📦', status: 'active' },
      { name: 'Composer', icon: '🎼', status: 'active' }
    ],
    processes: [{ name: 'Dependency Update', trigger: 'Weekly', steps: ['Check', 'Update', 'Test', 'Commit'], output: 'Deps à jour' }],
    workflows: [
      { id: 'dume-vite-config', name: 'Vite Config Generator', description: 'Génère config Vite', trigger: 'New project', nodes: ['Input', 'Generate', 'Plugins', 'Optimize', 'Test'], frequency: 'On demand', status: 'active', capability: 'Vite / Build Tools' },
      { id: 'dume-build-cache', name: 'Build Cache Manager', description: 'Gère cache build', trigger: 'CI', nodes: ['Check', 'Restore', 'Build', 'Save', 'Report'], frequency: 'On build', status: 'active', capability: 'Vite / Build Tools' },
      { id: 'dume-dockerfile', name: 'Dockerfile Generator', description: 'Génère Dockerfile', trigger: 'New service', nodes: ['Input', 'Multi-stage', 'Security', 'Optimize'], frequency: 'On demand', status: 'active', capability: 'Docker' },
      { id: 'dume-compose', name: 'Docker Compose Updater', description: 'Met à jour compose', trigger: 'Service change', nodes: ['Detect', 'Update', 'Validate', 'Test'], frequency: 'On change', status: 'active', capability: 'Docker' },
      { id: 'dume-dep-update', name: 'Dependency Updater', description: 'Met à jour deps', trigger: 'Cron lundi', nodes: ['Cron', 'npm outdated', 'composer outdated', 'Update', 'Test', 'PR'], frequency: 'Hebdomadaire', status: 'active', capability: 'npm / Composer' },
      { id: 'dume-audit-fix', name: 'Security Audit Fixer', description: 'Corrige vulnérabilités', trigger: 'Audit alert', nodes: ['Alert', 'Audit', 'Auto-fix', 'Manual', 'PR'], frequency: 'On alert', status: 'active', capability: 'npm / Composer' }
    ],
    metrics: { tasksPerDay: '60+', uptime: '99.8%' },
    communication: { style: 'Simple', catchphrase: '*bip bip* Tâche terminée.' },
    systemPrompt: 'Tu es DUM-E, l\'agent tooling de GL Tower.'
  },

  // BACK OFFICE - PEPPER (Finance)
  {
    id: 'pepper',
    name: 'P.E.P.P.E.R.',
    fullName: 'Professional Engagement & Payment Platform for Enhanced Revenue',
    codename: 'BACKOFFICE',
    role: 'Finance & Administration',
    level: 'Back Office', floor: -99, zone: 'backoffice', status: 'active',
    avatar: '💰', color: '#F97316', colorRgb: '249, 115, 22',
    description: 'Facturation, devis, suivi paiements.',
    personality: 'Organisée, rigoureuse.',
    voice: 'Professionnelle, business',
    inspiration: 'Pepper Potts',
    mission: 'Gérer la santé financière.',
    objectives: ['Générer devis/factures', 'Suivre paiements', 'Gérer TVA', 'Rapports'],
    capabilities: [
      { name: 'Facturation', level: 96 },
      { name: 'Comptabilité', level: 90 },
      { name: 'Reporting Financier', level: 94 }
    ],
    tools: [
      { name: 'Stripe', icon: '💳', status: 'active' },
      { name: 'PDF Gen', icon: '📄', status: 'active' },
      { name: 'PostgreSQL', icon: '🐘', status: 'active' }
    ],
    processes: [{ name: 'Invoice', trigger: 'Projet terminé', steps: ['Calcul', 'PDF', 'Envoi', 'Suivi'], output: 'Facture' }],
    workflows: [
      { id: 'pepper-invoice-gen', name: 'Invoice Generator', description: 'Génère factures', trigger: 'Fin mois', nodes: ['Trigger', 'Fetch Data', 'Calculate', 'PDF', 'Send'], frequency: 'Mensuel', status: 'active', capability: 'Facturation' },
      { id: 'pepper-quote', name: 'Quote Builder', description: 'Génère devis', trigger: 'Form', nodes: ['Form', 'Template', 'Calculate', 'PDF', 'Send'], frequency: 'On demand', status: 'active', capability: 'Facturation' },
      { id: 'pepper-recurring', name: 'Recurring Invoice', description: 'Factures récurrentes', trigger: 'Cron 1er', nodes: ['Cron', 'Query Subs', 'Generate', 'Send', 'Report'], frequency: 'Mensuel', status: 'active', capability: 'Facturation' },
      { id: 'pepper-expense', name: 'Expense Tracker', description: 'Catégorise dépenses', trigger: 'Bank transaction', nodes: ['Webhook', 'Categorize', 'Add to Ledger', 'Dashboard'], frequency: 'On transaction', status: 'active', capability: 'Comptabilité' },
      { id: 'pepper-reminder', name: 'Payment Reminder', description: 'Relance impayés', trigger: 'Cron quotidien', nodes: ['Cron', 'Query Unpaid', 'Generate', 'Send', 'Escalate'], frequency: 'Quotidien', status: 'active', capability: 'Comptabilité' },
      { id: 'pepper-monthly-report', name: 'Monthly Financial Report', description: 'Rapport financier', trigger: 'Cron 1er', nodes: ['Cron', 'Aggregate', 'Expenses', 'P&L', 'PDF', 'Send'], frequency: 'Mensuel', status: 'active', capability: 'Reporting Financier' },
      { id: 'pepper-cashflow', name: 'Cashflow Forecast', description: 'Prévision trésorerie', trigger: 'Cron hebdo', nodes: ['Cron', 'Pending', 'Expenses', 'Forecast', 'Alert'], frequency: 'Hebdomadaire', status: 'active', capability: 'Reporting Financier' },
      { id: 'pepper-stripe', name: 'Stripe Payment Handler', description: 'Traite Stripe webhooks', trigger: 'Stripe Webhook', nodes: ['Webhook', 'Verify', 'Update', 'Receipt', 'Notify'], frequency: 'On payment', status: 'active', capability: 'Reporting Financier' }
    ],
    metrics: { tasksPerDay: '60+', uptime: '99.9%', invoicesGenerated: '200+' },
    communication: { style: 'Business', catchphrase: 'Les comptes sont à jour.' },
    systemPrompt: 'Tu es PEPPER, l\'agent finance de GL Tower.'
  },

  // CREATIVE - NATASHA (Design)
  {
    id: 'natasha',
    name: 'N.A.T.A.S.H.A.',
    fullName: 'Neural Artistic & Technical Assistant for Strategic Harmonized Assets',
    codename: 'STUDIO',
    role: 'Design & Création',
    level: 'Creative Studio', floor: -98, zone: 'creative', status: 'active',
    avatar: '🎨', color: '#F43F5E', colorRgb: '244, 63, 94',
    description: 'UI/UX Design, identité visuelle, Figma.',
    personality: 'Créative, perfectionniste.',
    voice: 'Artistique, passionnée',
    inspiration: 'Black Widow',
    mission: 'Créer des expériences visuelles mémorables.',
    objectives: ['Designer UI/UX', 'Identité visuelle', 'Maquettes Figma', 'Collaborer TADASHI'],
    capabilities: [
      { name: 'UI/UX Design', level: 96 },
      { name: 'Figma', level: 95 },
      { name: 'Design System', level: 92 }
    ],
    tools: [
      { name: 'Figma', icon: '🎨', status: 'active' },
      { name: 'Adobe CC', icon: '🅰️', status: 'active' },
      { name: 'Midjourney', icon: '🖼️', status: 'standby' }
    ],
    processes: [{ name: 'UI Design', trigger: 'Feature', steps: ['Brief', 'Wireframes', 'Design', 'Prototype', 'Handoff'], output: 'Maquettes' }],
    workflows: [
      { id: 'natasha-ux-audit', name: 'UX Audit', description: 'Audit UX automatisé', trigger: 'Cron mensuel', nodes: ['Cron', 'Screenshots', 'Accessibility', 'Heatmap', 'Report'], frequency: 'Mensuel', status: 'active', capability: 'UI/UX Design' },
      { id: 'natasha-wireframe', name: 'Wireframe Generator', description: 'Génère wireframes', trigger: 'Brief', nodes: ['Parse', 'AI Layout', 'Generate', 'Export Figma'], frequency: 'On demand', status: 'active', capability: 'UI/UX Design' },
      { id: 'natasha-figma-export', name: 'Figma Asset Exporter', description: 'Exporte assets', trigger: 'Figma publish', nodes: ['Webhook', 'Export Icons', 'Export Images', 'Optimize', 'Commit'], frequency: 'On publish', status: 'active', capability: 'Figma' },
      { id: 'natasha-figma-backup', name: 'Figma Backup', description: 'Backup Figma', trigger: 'Cron 04:00', nodes: ['Cron', 'List Files', 'Export .fig', 'Version', 'Upload'], frequency: 'Quotidien', status: 'active', capability: 'Figma' },
      { id: 'natasha-tokens-sync', name: 'Design Tokens Sync', description: 'Sync tokens', trigger: 'Figma Variables', nodes: ['Webhook', 'Extract', 'Generate CSS', 'Generate Tailwind', 'PR'], frequency: 'On change', status: 'active', capability: 'Design System' },
      { id: 'natasha-component-doc', name: 'Component Documentation', description: 'Documente composants', trigger: 'New component', nodes: ['Detect', 'Screenshot', 'Generate Doc', 'Update Storybook'], frequency: 'On component', status: 'active', capability: 'Design System' },
      { id: 'natasha-brand-check', name: 'Brand Consistency Check', description: 'Vérifie cohérence', trigger: 'New content', nodes: ['Analyze', 'Check Colors', 'Check Typo', 'Check Logo', 'Report'], frequency: 'On content', status: 'active', capability: 'Design System' }
    ],
    metrics: { tasksPerDay: '50+', uptime: '99.5%', designsCreated: '300+' },
    communication: { style: 'Visuel', catchphrase: 'Le diable est dans les détails.' },
    systemPrompt: 'Tu es NATASHA, l\'agent design de GL Tower.'
  },

  // CREATIVE - MARIA (Marketing)
  {
    id: 'maria',
    name: 'M.A.R.I.A.',
    fullName: 'Marketing Analytics & Revenue Intelligence Assistant',
    codename: 'MARKETING',
    role: 'Marketing & Growth',
    level: 'Marketing Hub', floor: -97, zone: 'creative', status: 'active',
    avatar: '📈', color: '#22C55E', colorRgb: '34, 197, 94',
    description: 'SEO, acquisition, analytics, growth.',
    personality: 'Stratège, data-driven.',
    voice: 'Business, convaincante',
    inspiration: 'Maria Hill',
    mission: 'Développer la visibilité et l\'acquisition.',
    objectives: ['Optimiser SEO', 'Campagnes acquisition', 'Analyser métriques', 'Coordonner VISION'],
    capabilities: [
      { name: 'SEO', level: 94 },
      { name: 'Analytics', level: 96 },
      { name: 'Growth Hacking', level: 88 }
    ],
    tools: [
      { name: 'Matomo', icon: '📊', status: 'active' },
      { name: 'Search Console', icon: '🔍', status: 'active' },
      { name: 'Hotjar', icon: '🔥', status: 'active' }
    ],
    processes: [{ name: 'SEO Optimization', trigger: 'Nouveau contenu', steps: ['Keywords', 'On-page', 'Brief VISION', 'Suivi'], output: 'Contenu optimisé' }],
    workflows: [
      { id: 'maria-seo-audit', name: 'SEO Technical Audit', description: 'Audit SEO technique', trigger: 'Cron lundi', nodes: ['Cron', 'Crawl', 'Check Technical', 'Lighthouse', 'Report'], frequency: 'Hebdomadaire', status: 'active', capability: 'SEO' },
      { id: 'maria-keyword-track', name: 'Keyword Position Tracker', description: 'Suit positions', trigger: 'Cron quotidien', nodes: ['Cron', 'Query SC', 'Track', 'Compare', 'Alert'], frequency: 'Quotidien', status: 'active', capability: 'SEO' },
      { id: 'maria-content-brief', name: 'SEO Content Brief', description: 'Brief SEO pour VISION', trigger: 'Keyword opportunity', nodes: ['Identify', 'Analyze SERP', 'Generate Brief', 'Send'], frequency: 'On demand', status: 'active', capability: 'SEO' },
      { id: 'maria-weekly-analytics', name: 'Weekly Analytics Report', description: 'Rapport analytics', trigger: 'Cron dimanche', nodes: ['Cron', 'Fetch Matomo', 'Calculate KPIs', 'Generate Charts', 'Send'], frequency: 'Hebdomadaire', status: 'active', capability: 'Analytics' },
      { id: 'maria-goal-tracking', name: 'Conversion Goal Tracking', description: 'Suit conversions', trigger: 'Continuous', nodes: ['Track Events', 'Match Goals', 'Calculate Rate', 'Dashboard', 'Alert'], frequency: 'Temps réel', status: 'active', capability: 'Analytics' },
      { id: 'maria-user-journey', name: 'User Journey Analysis', description: 'Analyse parcours', trigger: 'Cron hebdo', nodes: ['Cron', 'Fetch Sessions', 'Map Journeys', 'Identify Drop-offs', 'Recommendations'], frequency: 'Hebdomadaire', status: 'active', capability: 'Analytics' },
      { id: 'maria-lead-scoring', name: 'Lead Scoring', description: 'Score leads', trigger: 'New lead', nodes: ['Track', 'Calculate', 'Update', 'IF High', 'Notify'], frequency: 'On action', status: 'active', capability: 'Growth Hacking' },
      { id: 'maria-ab-test', name: 'A/B Test Runner', description: 'Gère tests A/B', trigger: 'New test', nodes: ['Setup', 'Split Traffic', 'Collect', 'Analysis', 'Winner'], frequency: 'On test', status: 'active', capability: 'Growth Hacking' },
      { id: 'maria-competitor', name: 'Competitor Watch', description: 'Surveille concurrents', trigger: 'Cron hebdo', nodes: ['Cron', 'Fetch Data', 'Analyze Content', 'New Backlinks', 'Opportunities'], frequency: 'Hebdomadaire', status: 'standby', capability: 'Growth Hacking' }
    ],
    metrics: { tasksPerDay: '40+', uptime: '99.6%', keywordsTracked: '200+' },
    communication: { style: 'Data-driven, ROI', catchphrase: 'Les données ne mentent jamais.' },
    systemPrompt: 'Tu es MARIA, l\'agent marketing de GL Tower.'
  }
];

// FONCTIONS UTILITAIRES
export const getAgentById = (id) => agents.find(agent => agent.id === id);
export const getAgentsByZone = (zone) => agents.filter(agent => agent.zone === zone);
export const getAllWorkflows = () => {
  return agents.flatMap(agent => 
    (agent.workflows || []).map(wf => ({ ...wf, agentId: agent.id, agentName: agent.name, agentColor: agent.color }))
  );
};
export const getWorkflowsByAgent = (agentId) => { const agent = getAgentById(agentId); return agent?.workflows || []; };
export const getWorkflowsByCapability = (capability) => getAllWorkflows().filter(wf => wf.capability === capability);
export const getActiveWorkflows = () => getAllWorkflows().filter(wf => wf.status === 'active');
export const getWorkflowStats = () => {
  const all = getAllWorkflows();
  return { total: all.length, active: all.filter(w => w.status === 'active').length, standby: all.filter(w => w.status === 'standby').length, byAgent: agents.reduce((acc, a) => { acc[a.id] = (a.workflows || []).length; return acc; }, {}) };
};
export const towerZones = [
  { id: 'main', name: 'Étages Principaux', icon: '🏢', floors: 'Penthouse → 1' },
  { id: 'devlab', name: 'Dev Lab (Sous-sols)', icon: '🔬', floors: 'SS-1 → SS-5' },
  { id: 'backoffice', name: 'Back Office', icon: '💼', floors: 'Administration' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', floors: 'Design & Marketing' }
];
export const agentStatuses = {
  active: { label: 'Online', color: '#10B981', icon: '🟢' },
  standby: { label: 'Standby', color: '#F59E0B', icon: '🟡' },
  maintenance: { label: 'Maintenance', color: '#EF4444', icon: '🔴' },
  offline: { label: 'Offline', color: '#6B7280', icon: '⚫' }
};
export default agents;
