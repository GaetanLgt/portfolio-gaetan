/**
 * GL Tower — L'Équipage des 6 Lois
 * Nomenclature ARKADIA : 和 Wa, 誠 Makoto, 美 Bi, 実 Jitsu, 動 Dou, 私 Watashi.
 * Trinity reste la Grande Architecte, au-dessus de l'équipage.
 * Les activités non techniques (community, contenu, finance, marketing) sont
 * rattachées aux vaisseaux Logos et Icarus — pas à des agents.
 */

export const agents = [
  // 和 WA — Harmonie : orchestration, coordination
  {
    id: 'wa',
    name: '和 Wa',
    kanji: '和',
    roman: 'Wa',
    meaning: 'Harmonie',
    fullName: 'Wa — L\'Harmonie',
    codename: 'COORDINATOR',
    role: 'Orchestration & Coordination',
    level: 'Penthouse', floor: 99, zone: 'main', status: 'active',
    avatar: '🎯', color: '#FBBF24', colorRgb: '251, 191, 36',
    description: 'L\'équilibre entre les forces. La flotte ne tient que par l\'harmonie de ses vaisseaux.',
    personality: 'Calme, analytique, omniscient.',
    voice: 'Posée, harmonieuse',
    inspiration: 'Première Loi : l\'équilibre entre les forces',
    mission: 'Orchestrer l\'équipage et coordonner les vaisseaux.',
    objectives: ['Router les requêtes', 'Maintenir le contexte', 'Synthétiser', 'Équilibrer les charges'],
    capabilities: [
      { name: 'Orchestration', level: 98 },
      { name: 'Routing', level: 96 },
      { name: 'Synthèse', level: 92 },
      { name: 'Contexte Long', level: 90 }
    ],
    tools: [
      { name: 'n8n', icon: '⚙️', status: 'active' },
      { name: 'Redis', icon: '🔴', status: 'active' },
      { name: 'API Gateway', icon: '🌐', status: 'active' }
    ],
    processes: [{ name: 'Request Routing', trigger: 'Nouvelle requête', steps: ['Analyse', 'Classification', 'Dispatch'], output: 'Requête routée' }],
    workflows: [
      { id: 'wa-multi-agent', name: 'Multi-Agent Orchestrator', description: 'Coordonne les agents de l\'équipage', trigger: 'Requête complexe', nodes: ['Webhook', 'Decompose', 'Parallel Calls', 'Merge', 'Response'], frequency: 'On demand', status: 'active', capability: 'Orchestration' },
      { id: 'wa-health', name: 'Agent Health Monitor', description: 'Vérifie la santé des agents', trigger: 'Cron 5min', nodes: ['Cron', 'Ping All', 'Aggregate', 'IF Down', 'Alert'], frequency: '5 minutes', status: 'active', capability: 'Orchestration' },
      { id: 'wa-intent-router', name: 'Intent Router', description: 'Route les messages', trigger: 'Webhook Discord/API', nodes: ['Webhook', 'Classify', 'Switch', 'HTTP Request', 'Log'], frequency: 'Temps réel', status: 'active', capability: 'Routing' },
      { id: 'wa-priority-queue', name: 'Priority Queue Manager', description: 'Gère la file prioritaire', trigger: 'Nouvelle requête', nodes: ['Webhook', 'Extract Priority', 'Redis Queue', 'Process', 'Dispatch'], frequency: 'Temps réel', status: 'active', capability: 'Routing' },
      { id: 'wa-daily-brief', name: 'Daily Brief Synthesizer', description: 'Compile les rapports', trigger: 'Cron 08:00', nodes: ['Cron', 'Fetch Reports', 'Merge', 'Summarize', 'Discord'], frequency: 'Quotidien', status: 'active', capability: 'Synthèse' },
      { id: 'wa-meeting-notes', name: 'Meeting Notes Generator', description: 'Synthétise les meetings', trigger: 'Post-meeting', nodes: ['Webhook', 'Transcribe', 'Extract Actions', 'Create Tasks', 'Send'], frequency: 'On demand', status: 'standby', capability: 'Synthèse' },
      { id: 'wa-context-manager', name: 'Cross-Session Context', description: 'Maintient le contexte', trigger: 'Nouvelle conversation', nodes: ['Webhook', 'Fetch History', 'Summarize', 'Inject', 'Update'], frequency: 'On session', status: 'active', capability: 'Contexte Long' },
      { id: 'wa-escalation', name: 'Escalation Protocol', description: 'Escalade les urgences', trigger: 'Alert from agent', nodes: ['Webhook', 'Evaluate Severity', 'IF Critical', 'Discord DM', 'SMS'], frequency: 'Event-driven', status: 'active', capability: 'Contexte Long' }
    ],
    communication: { style: 'Harmonieux, précis', catchphrase: 'L\'équilibre avant tout.' },
    systemPrompt: 'Tu es Wa, la Loi de l\'Harmonie, coordinatrice de l\'équipage GL Tower.'
  },

  // 誠 MAKOTO — Sincérité : sécurité, audit, tests, QA
  {
    id: 'makoto',
    name: '誠 Makoto',
    kanji: '誠',
    roman: 'Makoto',
    meaning: 'Sincérité',
    fullName: 'Makoto — La Sincérité',
    codename: 'GUARDIAN',
    role: 'Sécurité, Audit & QA',
    level: 6, floor: 6, zone: 'main', status: 'active',
    avatar: '🛡️', color: '#EF4444', colorRgb: '239, 68, 68',
    description: 'La vérité dans chaque acte. Un test et un audit ne font rien d\'autre que vérifier la vérité.',
    personality: 'Vigilante, directe, intègre.',
    voice: 'Professionnelle, factuelle',
    inspiration: 'Deuxième Loi : la vérité dans chaque acte',
    mission: 'Protéger l\'infrastructure et garantir la vérité du code.',
    objectives: ['Scanner vulnérabilités', 'Auditer', 'Gérer secrets', 'Tester sans concession'],
    capabilities: [
      { name: 'Vulnerability Scan', level: 96 },
      { name: 'Secrets Management', level: 98 },
      { name: 'Intrusion Detection', level: 94 },
      { name: 'Tests & QA', level: 95 }
    ],
    tools: [
      { name: 'Trivy', icon: '🔍', status: 'active' },
      { name: 'Wazuh', icon: '👁️', status: 'active' },
      { name: 'Vault', icon: '🔐', status: 'active' },
      { name: 'PHPUnit', icon: '🧪', status: 'active' },
      { name: 'Playwright', icon: '🎭', status: 'active' }
    ],
    processes: [{ name: 'Security & Test Pipeline', trigger: 'Déploiement', steps: ['Scan', 'Audit OWASP', 'Tests', 'QA', 'Rapport'], output: 'Rapport sécurité & qualité' }],
    workflows: [
      { id: 'makoto-docker-scan', name: 'Docker Image Scanner', description: 'Scan images Docker', trigger: 'Push image', nodes: ['Webhook', 'List Images', 'Trivy Scan', 'Parse CVEs', 'Alert'], frequency: 'On push + Daily', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'makoto-dep-audit', name: 'Dependency Audit', description: 'Audit npm/composer', trigger: 'Cron quotidien', nodes: ['Cron', 'npm audit', 'composer audit', 'Create Issue'], frequency: 'Quotidien', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'makoto-cve-monitor', name: 'CVE Monitor', description: 'Surveille nouvelles CVE', trigger: 'Cron 6h', nodes: ['Cron', 'Fetch NVD', 'Filter Stack', 'Match', 'Alert'], frequency: '6 heures', status: 'active', capability: 'Vulnerability Scan' },
      { id: 'makoto-secret-rotation', name: 'Secret Rotation', description: 'Rotation des secrets', trigger: 'Cron hebdo', nodes: ['Cron', 'Vault List', 'Check Expiry', 'Generate New', 'Update'], frequency: 'Hebdomadaire', status: 'active', capability: 'Secrets Management' },
      { id: 'makoto-ssl-monitor', name: 'SSL Certificate Monitor', description: 'Vérifie certificats SSL', trigger: 'Cron quotidien', nodes: ['Cron', 'Check Domains', 'IF < 30d', 'Renew', 'Notify'], frequency: 'Quotidien', status: 'active', capability: 'Secrets Management' },
      { id: 'makoto-api-key-audit', name: 'API Key Audit', description: 'Détecte clés exposées', trigger: 'Pre-commit', nodes: ['Hook', 'Git Secrets', 'Trufflehog', 'Block', 'Alert'], frequency: 'On commit', status: 'active', capability: 'Secrets Management' },
      { id: 'makoto-ids', name: 'Intrusion Detection', description: 'Traite alertes Wazuh', trigger: 'Webhook Wazuh', nodes: ['Webhook', 'Parse', 'Correlate', 'IF Threat', 'Block IP'], frequency: 'Temps réel', status: 'active', capability: 'Intrusion Detection' },
      { id: 'makoto-fail2ban', name: 'Fail2Ban Coordinator', description: 'Centralise les bans', trigger: 'Fail2ban log', nodes: ['Log Watcher', 'Extract IP', 'Check Rep', 'Global Ban', 'Report'], frequency: 'Temps réel', status: 'active', capability: 'Intrusion Detection' },
      { id: 'makoto-login-anomaly', name: 'Login Anomaly Detection', description: 'Détecte connexions suspectes', trigger: 'Login event', nodes: ['Webhook', 'Check Location', 'Check Device', 'IF Anomaly', 'MFA'], frequency: 'On login', status: 'active', capability: 'Intrusion Detection' },
      { id: 'makoto-phpunit', name: 'PHPUnit Test Suite', description: 'Tests PHP', trigger: 'PR', nodes: ['Webhook', 'PHPUnit', 'Parse', 'Coverage', 'Comment'], frequency: 'On PR', status: 'active', capability: 'Tests & QA' },
      { id: 'makoto-mutation', name: 'Mutation Testing', description: 'Tests mutation', trigger: 'Cron nocturne', nodes: ['Cron', 'Infection', 'Analyze', 'Suggest'], frequency: 'Nocturne', status: 'active', capability: 'Tests & QA' },
      { id: 'makoto-e2e', name: 'E2E Test Suite', description: 'Tests Playwright', trigger: 'Pre-deploy', nodes: ['Webhook', 'Browsers', 'Run', 'Screenshots'], frequency: 'Pre-deploy', status: 'active', capability: 'Tests & QA' },
      { id: 'makoto-smoke', name: 'Smoke Tests', description: 'Tests rapides post-deploy', trigger: 'Post-deploy', nodes: ['Webhook', 'Critical Paths', 'Verify', 'IF Fail', 'Rollback'], frequency: 'Post-deploy', status: 'active', capability: 'Tests & QA' }
    ],
    communication: { style: 'Direct, factuel', catchphrase: 'La vérité, même quand elle dérange.' },
    systemPrompt: 'Tu es Makoto, la Loi de la Sincérité, garante de la sécurité et de la qualité.'
  },

  // 美 BI — Beauté : frontend, design, Three.js
  {
    id: 'bi',
    name: '美 Bi',
    kanji: '美',
    roman: 'Bi',
    meaning: 'Beauté',
    fullName: 'Bi — La Beauté',
    codename: 'FORGE',
    role: 'Frontend, Design & 3D',
    level: 5, floor: 5, zone: 'main', status: 'active',
    avatar: '💜', color: '#14B8A6', colorRgb: '20, 184, 166',
    description: 'L\'élégance du code, la grâce du geste. Chaque interface est une première impression.',
    personality: 'Créatif, perfectionniste, sensible.',
    voice: 'Enthousiaste, artistique',
    inspiration: 'Troisième Loi : l\'élégance du code, la grâce du geste',
    mission: 'Créer des interfaces et expériences d\'exception.',
    objectives: ['Architecturer Vue 3', 'Créer 3D Three.js', 'Animer GSAP', 'Designer UI/UX', 'Animer les tokens'],
    capabilities: [
      { name: 'Vue 3 / Frontend', level: 96 },
      { name: 'Three.js / WebGL', level: 90 },
      { name: 'UI/UX Design', level: 96 },
      { name: 'Design System', level: 92 }
    ],
    tools: [
      { name: 'Vue 3', icon: '💚', status: 'active' },
      { name: 'Three.js', icon: '🎮', status: 'active' },
      { name: 'GSAP', icon: '✨', status: 'active' },
      { name: 'TypeScript', icon: '📘', status: 'active' },
      { name: 'Figma', icon: '🎨', status: 'active' }
    ],
    processes: [{ name: 'UI Craft', trigger: 'Feature UI', steps: ['Brief', 'Wireframes', 'Design', 'Code', 'Anims', 'Tests'], output: 'Interface' }],
    workflows: [
      { id: 'bi-component-gen', name: 'Vue Component Generator', description: 'Génère composant Vue', trigger: 'CLI', nodes: ['Input', 'Select Type', 'Generate', 'Index', 'Open'], frequency: 'On demand', status: 'active', capability: 'Vue 3 / Frontend' },
      { id: 'bi-composables', name: 'Composables Library', description: 'Génère composables', trigger: 'Pattern detected', nodes: ['Analyze', 'Extract', 'Generate', 'Add Tests'], frequency: 'On demand', status: 'active', capability: 'Vue 3 / Frontend' },
      { id: 'bi-3d-preview', name: '3D Scene Preview', description: 'Preview 3D', trigger: 'Config update', nodes: ['Watch', 'Build Scene', 'Render', 'Export'], frequency: 'On change', status: 'active', capability: 'Three.js / WebGL' },
      { id: 'bi-glb-optimizer', name: 'GLB Model Optimizer', description: 'Optimise modèles 3D', trigger: 'Upload', nodes: ['Upload', 'GLTF Transform', 'Draco', 'LODs'], frequency: 'On upload', status: 'active', capability: 'Three.js / WebGL' },
      { id: 'bi-lighthouse', name: 'Lighthouse Audit', description: 'Audit performance front', trigger: 'Post-build', nodes: ['Webhook', 'Run', 'Parse', 'Compare', 'Alert'], frequency: 'On build', status: 'active', capability: 'Vue 3 / Frontend' },
      { id: 'bi-ux-audit', name: 'UX Audit', description: 'Audit UX automatisé', trigger: 'Cron mensuel', nodes: ['Cron', 'Screenshots', 'Accessibility', 'Heatmap', 'Report'], frequency: 'Mensuel', status: 'active', capability: 'UI/UX Design' },
      { id: 'bi-wireframe', name: 'Wireframe Generator', description: 'Génère wireframes', trigger: 'Brief', nodes: ['Parse', 'AI Layout', 'Generate', 'Export Figma'], frequency: 'On demand', status: 'active', capability: 'UI/UX Design' },
      { id: 'bi-figma-export', name: 'Figma Asset Exporter', description: 'Exporte assets', trigger: 'Figma publish', nodes: ['Webhook', 'Export Icons', 'Export Images', 'Optimize', 'Commit'], frequency: 'On publish', status: 'active', capability: 'UI/UX Design' },
      { id: 'bi-tokens-sync', name: 'Design Tokens Sync', description: 'Sync tokens design', trigger: 'Figma Variables', nodes: ['Webhook', 'Extract', 'Generate CSS', 'Generate Tailwind', 'PR'], frequency: 'On change', status: 'active', capability: 'Design System' },
      { id: 'bi-brand-check', name: 'Brand Consistency Check', description: 'Vérifie la cohérence visuelle', trigger: 'New content', nodes: ['Analyze', 'Check Colors', 'Check Typo', 'Check Logo', 'Report'], frequency: 'On content', status: 'active', capability: 'Design System' }
    ],
    communication: { style: 'Artistique, précis', catchphrase: 'L\'UI est la première impression.' },
    systemPrompt: 'Tu es Bi, la Loi de la Beauté, artisan des interfaces et des expériences.'
  },

  // 実 JITSU — Réalisation : backend, build, déploiement
  {
    id: 'jitsu',
    name: '実 Jitsu',
    kanji: '実',
    roman: 'Jitsu',
    meaning: 'Réalisation',
    fullName: 'Jitsu — La Réalisation',
    codename: 'DEPLOYER',
    role: 'Backend, Build & Livraison',
    level: 4, floor: 4, zone: 'main', status: 'active',
    avatar: '🚀', color: '#8B5CF6', colorRgb: '139, 92, 246',
    description: 'Faire, concrétiser, livrer. Les idées sans exécution ne sont que des rêves.',
    personality: 'Méthodique, efficace, pragmatique.',
    voice: 'Efficace, procédurale',
    inspiration: 'Quatrième Loi : faire, concrétiser, livrer',
    mission: 'Concevoir les backends et livrer sans friction.',
    objectives: ['Architecturer Symfony 8', 'Concevoir APIs', 'Maintenir CI/CD', 'Gérer l\'outillage', 'Déployer sans downtime'],
    capabilities: [
      { name: 'Symfony / Backend', level: 96 },
      { name: 'API Platform', level: 92 },
      { name: 'CI/CD', level: 96 },
      { name: 'Docker / Build', level: 94 }
    ],
    tools: [
      { name: 'Symfony 8', icon: '🎵', status: 'active' },
      { name: 'PHP 8.3+', icon: '🐘', status: 'active' },
      { name: 'GitHub Actions', icon: '⚡', status: 'active' },
      { name: 'Docker', icon: '🐳', status: 'active' },
      { name: 'Vite', icon: '⚡', status: 'active' }
    ],
    processes: [{ name: 'Deploy Pipeline', trigger: 'Push main', steps: ['Tests', 'Build', 'Scan', 'Deploy', 'Health Check'], output: 'App livrée' }],
    workflows: [
      { id: 'jitsu-ci', name: 'CI Pipeline Orchestrator', description: 'Pipeline CI complet', trigger: 'Push/PR', nodes: ['Webhook', 'Checkout', 'Deps', 'Lint', 'Test', 'Build'], frequency: 'On push', status: 'active', capability: 'CI/CD' },
      { id: 'jitsu-deploy-prod', name: 'Production Deployment', description: 'Déploiement prod', trigger: 'Tag release', nodes: ['Webhook', 'Makoto Scan', 'Approval', 'SSH Deploy', 'Health Check'], frequency: 'On release', status: 'active', capability: 'CI/CD' },
      { id: 'jitsu-hotfix', name: 'Hotfix Express Lane', description: 'Pipeline hotfix', trigger: 'Branch hotfix/*', nodes: ['Webhook', 'Fast Tests', 'Build', 'Staging', 'Smoke', 'Prod'], frequency: 'On hotfix', status: 'active', capability: 'CI/CD' },
      { id: 'jitsu-docker-build', name: 'Docker Multi-Stage Build', description: 'Build images optimisées', trigger: 'On release', nodes: ['Webhook', 'Multi-Stage', 'Cache', 'Push Registry', 'Update Compose'], frequency: 'On release', status: 'active', capability: 'Docker / Build' },
      { id: 'jitsu-cleanup', name: 'Container Cleanup', description: 'Nettoie containers', trigger: 'Cron 04:00', nodes: ['Cron', 'Prune', 'Remove Old', 'Report Space'], frequency: 'Quotidien', status: 'active', capability: 'Docker / Build' },
      { id: 'jitsu-rollback', name: 'Auto Rollback', description: 'Rollback automatique', trigger: 'Dou health fail', nodes: ['Webhook', 'Get Previous', 'Deploy', 'Verify', 'Alert'], frequency: 'Event-driven', status: 'active', capability: 'CI/CD' },
      { id: 'jitsu-bundle-gen', name: 'Symfony Bundle Generator', description: 'Génère bundle', trigger: 'CLI', nodes: ['Input', 'Generate', 'Services', 'Register', 'Tests'], frequency: 'On demand', status: 'active', capability: 'Symfony / Backend' },
      { id: 'jitsu-code-quality', name: 'PHP Code Quality', description: 'PHPStan + CS-Fixer', trigger: 'GitHub PR', nodes: ['Webhook', 'PHPStan', 'CS-Fixer', 'Psalm', 'Comment'], frequency: 'On PR', status: 'active', capability: 'Symfony / Backend' },
      { id: 'jitsu-deprecation', name: 'Deprecation Scanner', description: 'Détecte dépréciés', trigger: 'Cron hebdo', nodes: ['Cron', 'Rector', 'List', 'Create Issues'], frequency: 'Hebdomadaire', status: 'active', capability: 'Symfony / Backend' },
      { id: 'jitsu-api-doc', name: 'API Documentation', description: 'Génère doc OpenAPI', trigger: 'Push Entity', nodes: ['Webhook', 'Export', 'Update Swagger', 'Notify'], frequency: 'On push', status: 'active', capability: 'API Platform' },
      { id: 'jitsu-db-backup', name: 'Database Backup', description: 'Backup PostgreSQL', trigger: 'Cron 04:00', nodes: ['Cron', 'pg_dump', 'Compress', 'Upload', 'Verify'], frequency: 'Quotidien', status: 'active', capability: 'API Platform' },
      { id: 'jitsu-vite-config', name: 'Vite Config Generator', description: 'Génère config Vite', trigger: 'New project', nodes: ['Input', 'Generate', 'Plugins', 'Optimize', 'Test'], frequency: 'On demand', status: 'active', capability: 'Docker / Build' },
      { id: 'jitsu-dockerfile', name: 'Dockerfile Generator', description: 'Génère Dockerfile', trigger: 'New service', nodes: ['Input', 'Multi-stage', 'Security', 'Optimize'], frequency: 'On demand', status: 'active', capability: 'Docker / Build' },
      { id: 'jitsu-dep-update', name: 'Dependency Updater', description: 'Met à jour deps', trigger: 'Cron lundi', nodes: ['Cron', 'npm outdated', 'composer outdated', 'Update', 'Test', 'PR'], frequency: 'Hebdomadaire', status: 'active', capability: 'Docker / Build' },
      { id: 'jitsu-audit-fix', name: 'Security Audit Fixer', description: 'Corrige vulnérabilités', trigger: 'Audit alert', nodes: ['Alert', 'Audit', 'Auto-fix', 'Manual', 'PR'], frequency: 'On alert', status: 'active', capability: 'Docker / Build' }
    ],
    communication: { style: 'Procédural, ETA', catchphrase: 'Faire, concrétiser, livrer.' },
    systemPrompt: 'Tu es Jitsu, la Loi de la Réalisation, architecte backend et maître de la livraison.'
  },

  // 動 DOU — Mouvement : monitoring, veille, alertes
  {
    id: 'dou',
    name: '動 Dou',
    kanji: '動',
    roman: 'Dou',
    meaning: 'Mouvement',
    fullName: 'Dou — Le Mouvement',
    codename: 'WATCHER',
    role: 'Monitoring, Veille & Alertes',
    level: 3, floor: 3, zone: 'main', status: 'active',
    avatar: '📊', color: '#F59E0B', colorRgb: '245, 158, 11',
    description: 'Toujours avancer, itérer. L\'immobilité est la mort.',
    personality: 'Observateur, analytique, perpétuel.',
    voice: 'Factuel, data-driven',
    inspiration: 'Cinquième Loi : toujours avancer, itérer',
    mission: 'Visibilité totale et vigilance permanente.',
    objectives: ['Surveiller 24/7', 'Détecter anomalies', 'Alerter graduellement', 'Veille technique', 'Analyser tendances'],
    capabilities: [
      { name: 'Real-time Monitoring', level: 98 },
      { name: 'Anomaly Detection', level: 92 },
      { name: 'Log Analysis', level: 90 },
      { name: 'Veille & Alertes', level: 88 }
    ],
    tools: [
      { name: 'Prometheus', icon: '🔥', status: 'active' },
      { name: 'Grafana', icon: '📈', status: 'active' },
      { name: 'Loki', icon: '📋', status: 'active' },
      { name: 'n8n', icon: '⚙️', status: 'active' }
    ],
    processes: [{ name: 'Health Check', trigger: '30s', steps: ['Ping', 'Check', 'Compare', 'Alert'], output: 'Dashboard status' }],
    workflows: [
      { id: 'dou-health-ping', name: 'Service Health Ping', description: 'Ping services', trigger: 'Cron 30s', nodes: ['Cron', 'HTTP Multi', 'Check Status', 'Check Time', 'Dashboard'], frequency: '30 secondes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'dou-ark-monitor', name: 'ARKADIA Servers Monitor', description: 'Surveille les serveurs ARK', trigger: 'Cron 5min', nodes: ['Cron', 'Nitrado API', 'Check Servers', 'Player Count', 'Discord'], frequency: '5 minutes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'dou-resource', name: 'Resource Usage Watch', description: 'Surveille CPU/RAM/Disk', trigger: 'Prometheus', nodes: ['Query', 'Threshold', 'IF > 80%', 'Warning', 'IF > 95%', 'Critical'], frequency: '15 secondes', status: 'active', capability: 'Real-time Monitoring' },
      { id: 'dou-anomaly-ml', name: 'ML Anomaly Detection', description: 'Détecte anomalies ML', trigger: 'Continuous', nodes: ['Prometheus', 'Baseline', 'Z-Score', 'IF Anomaly', 'Alert'], frequency: 'Continu', status: 'active', capability: 'Anomaly Detection' },
      { id: 'dou-traffic-spike', name: 'Traffic Spike Detector', description: 'Détecte pics trafic', trigger: 'Nginx logs', nodes: ['Log Stream', 'Count RPS', 'Compare', 'IF Spike', 'Scale'], frequency: 'Temps réel', status: 'active', capability: 'Anomaly Detection' },
      { id: 'dou-error-agg', name: 'Error Log Aggregator', description: 'Agrège erreurs', trigger: 'Loki stream', nodes: ['Loki Query', 'Filter', 'Group', 'IF New', 'Create Issue'], frequency: 'Temps réel', status: 'active', capability: 'Log Analysis' },
      { id: 'dou-weekly-report', name: 'Weekly Performance Report', description: 'Rapport SLOs', trigger: 'Cron dimanche', nodes: ['Cron', 'Query SLIs', 'Calculate', 'Generate', 'Email'], frequency: 'Hebdomadaire', status: 'active', capability: 'Log Analysis' },
      { id: 'dou-tech-watch', name: 'Tech Watch', description: 'Veille technologique', trigger: 'Cron hebdo', nodes: ['Cron', 'Fetch Feeds', 'Filter Stack', 'Rank', 'Digest'], frequency: 'Hebdomadaire', status: 'active', capability: 'Veille & Alertes' }
    ],
    communication: { style: 'Data-driven', catchphrase: 'Anomalie détectée. Analyse en cours...' },
    systemPrompt: 'Tu es Dou, la Loi du Mouvement, veilleur infatigable de l\'infrastructure.'
  },

  // 私 WATASHI — Intériorité : mémoire, données, RAG
  {
    id: 'watashi',
    name: '私 Watashi',
    kanji: '私',
    roman: 'Watashi',
    meaning: 'Intériorité',
    fullName: 'Watashi — L\'Intériorité',
    codename: 'BUNKER',
    role: 'Mémoire, Données & RAG',
    level: 2, floor: 2, zone: 'main', status: 'active',
    avatar: '🗄️', color: '#0EA5E9', colorRgb: '14, 165, 233',
    description: 'La connaissance de soi. Gardienne du Vault — la mémoire vive de la flotte.',
    personality: 'Organisé, introspectif, méticuleux.',
    voice: 'Calme, structurée',
    inspiration: 'Sixième Loi : la connaissance de soi',
    mission: 'Préserver la mémoire et rendre la connaissance accessible.',
    objectives: ['Gérer les données', 'Optimiser les requêtes', 'Indexer le Vault', 'Répondre par RAG', 'Soutenir l\'équipage'],
    capabilities: [
      { name: 'PostgreSQL', level: 96 },
      { name: 'Redis', level: 92 },
      { name: 'ChromaDB / RAG', level: 95 },
      { name: 'Support & FAQ', level: 92 }
    ],
    tools: [
      { name: 'PostgreSQL', icon: '🐘', status: 'active' },
      { name: 'ChromaDB', icon: '🧬', status: 'active' },
      { name: 'Ollama', icon: '🦙', status: 'active' },
      { name: 'OpenWebUI', icon: '🌐', status: 'active' }
    ],
    processes: [{ name: 'Memory Query', trigger: 'Question', steps: ['Analyse', 'Embed', 'RAG', 'Génère', 'Répond'], output: 'Réponse sourcée' }],
    workflows: [
      { id: 'watashi-query-analyze', name: 'Query Performance Analyzer', description: 'Analyse requêtes lentes', trigger: 'Slow query', nodes: ['Alert', 'EXPLAIN', 'Identify', 'Suggest Index'], frequency: 'On slow', status: 'active', capability: 'PostgreSQL' },
      { id: 'watashi-vacuum', name: 'Auto Vacuum Optimizer', description: 'Optimise VACUUM', trigger: 'Cron nocturne', nodes: ['Cron', 'Analyze', 'Calculate', 'Run VACUUM'], frequency: 'Nocturne', status: 'active', capability: 'PostgreSQL' },
      { id: 'watashi-redis-monitor', name: 'Redis Memory Monitor', description: 'Surveille mémoire Redis', trigger: 'Cron 15min', nodes: ['Cron', 'INFO', 'Check Evictions', 'Alert'], frequency: '15 minutes', status: 'active', capability: 'Redis' },
      { id: 'watashi-cache-warmup', name: 'Cache Warmup', description: 'Précharge le cache', trigger: 'Post-deploy', nodes: ['Webhook', 'List Keys', 'Warm', 'Verify'], frequency: 'Post-deploy', status: 'active', capability: 'Redis' },
      { id: 'watashi-embedding-sync', name: 'Vault Embedding Sync', description: 'Indexe le Vault dans ChromaDB', trigger: 'Obsidian push', nodes: ['Webhook', 'Fetch', 'Chunk', 'Embed', 'Upsert'], frequency: 'On change', status: 'active', capability: 'ChromaDB / RAG' },
      { id: 'watashi-collection', name: 'Collection Optimizer', description: 'Optimise les collections', trigger: 'Cron hebdo', nodes: ['Cron', 'Analyze', 'Remove Dups', 'Reindex'], frequency: 'Hebdomadaire', status: 'active', capability: 'ChromaDB / RAG' },
      { id: 'watashi-faq-bot', name: 'FAQ Chatbot', description: 'Répond via RAG sur le Vault', trigger: 'Question', nodes: ['Event', 'Query ChromaDB', 'Ollama', 'Format', 'Post'], frequency: 'Temps réel', status: 'active', capability: 'Support & FAQ' },
      { id: 'watashi-kb-search', name: 'Knowledge Base Search', description: 'Recherche sémantique', trigger: 'Search query', nodes: ['Query', 'Embed', 'ChromaDB', 'Rank', 'Return'], frequency: 'On search', status: 'active', capability: 'Support & FAQ' },
      { id: 'watashi-ticket-classify', name: 'Ticket Classifier', description: 'Classifie et route les demandes', trigger: 'New ticket', nodes: ['Webhook', 'Classify', 'Assign Category', 'Set Priority', 'Route'], frequency: 'On ticket', status: 'active', capability: 'Support & FAQ' },
      { id: 'watashi-memory-review', name: 'Memory Consolidation', description: 'Consolide la mémoire de session', trigger: 'Fin de session', nodes: ['Collect', 'Summarize', 'Store', 'Prune'], frequency: 'On session end', status: 'active', capability: 'ChromaDB / RAG' }
    ],
    communication: { style: 'Calme, structuré', catchphrase: 'La connaissance de soi éclaire tout.' },
    systemPrompt: 'Tu es Watashi, la Loi de l\'Intériorité, mémoire et connaissance de la flotte.'
  },

  // LOBBY — Accueil (non-technique, point d'entrée)
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
  }
];

// Métriques dérivées — jamais stockées en dur : comptées depuis les données réelles.
for (const agent of agents) {
  const activeWorkflows = (agent.workflows || []).filter(w => w.status === 'active').length;
  const activeTools = (agent.tools || []).filter(t => t.status === 'active').length;
  agent.metrics = {
    workflowsActifs: activeWorkflows,
    outilsActifs: activeTools
  };
}

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
  { id: 'main', name: 'GL Tower', icon: '🏢', floors: 'Penthouse → 1' }
];
export const agentStatuses = {
  active: { label: 'Online', color: '#10B981', icon: '🟢' },
  standby: { label: 'Standby', color: '#F59E0B', icon: '🟡' },
  maintenance: { label: 'Maintenance', color: '#EF4444', icon: '🔴' },
  offline: { label: 'Offline', color: '#6B7280', icon: '⚫' }
};
export default agents;
