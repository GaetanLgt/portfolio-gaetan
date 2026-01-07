/**
 * Site Structure for Holographic Sitemap
 * Structure complète du portfolio GL Digital Lab
 */

export const siteStructure = [
  {
    id: 'core',
    name: 'CORE',
    icon: '🏠',
    color: '#10B981',
    routes: [
      { name: 'Home', path: '/', icon: '🏠' },
      { name: 'Hub / GL Tower', path: '/hub', icon: '🏢' },
      { name: 'Contact', path: '/contact', icon: '📞' },
      { name: 'CV', path: '/cv', icon: '📄' },
      { name: 'Sitemap', path: '/sitemap', icon: '🗺️' },
    ]
  },
  {
    id: 'services',
    name: 'SERVICES',
    icon: '⚡',
    color: '#F59E0B',
    routes: [
      { name: 'Services', path: '/services', icon: '⚡' },
      { name: 'Projets', path: '/projets', icon: '📁' },
    ]
  },
  {
    id: 'parcours',
    name: 'PARCOURS',
    icon: '📍',
    color: '#8B5CF6',
    routes: [
      { name: 'Gaming → Dev', path: '/parcours', icon: '🎮' },
      { name: 'Conseil Agents', path: '/conseil', icon: '🤖' },
      { name: 'Stack IA', path: '/stack-ia', icon: '🧠' },
      { name: 'Carte Holistique', path: '/carte-holistique', icon: '🗺️' },
    ]
  },
  {
    id: 'projects',
    name: 'PROJETS',
    icon: '🚀',
    color: '#EC4899',
    routes: [
      { name: 'ARKADIA', path: '/arkadia', icon: '🦖' },
      { name: 'VoyageoPro', path: '/voyageo-pro', icon: '✈️' },
      { name: 'Workflows', path: '/workflows', icon: '⚙️' },
      { name: 'GL Tower', path: '/tower', icon: '🏢' },
      { name: 'Agents Hub', path: '/agents', icon: '🤖' },
      { name: 'Simulation', path: '/simulation', icon: '💊' },
      { name: 'TV Database', path: '/tv', icon: '📺' },
      { name: 'Zombunny', path: '/zombunny', icon: '🐰' },
    ]
  },
  {
    id: 'multivers',
    name: 'MULTIVERS',
    icon: '🌌',
    color: '#6366F1',
    routes: [
      { name: 'Hub Multivers', path: '/multivers', icon: '🌌' },
      { name: 'Matrix', path: '/matrix', icon: '💊' },
      { name: 'TRON', path: '/tron', icon: '🟦' },
      { name: 'Blade Runner', path: '/blade-runner', icon: '🌃' },
      { name: 'Inception', path: '/inception', icon: '🌀' },
      { name: 'Ghost in Shell', path: '/ghost-in-the-shell', icon: '🤖' },
      { name: 'Iron Man', path: '/iron-man', icon: '🦸' },
      { name: 'Dragon Ball Z', path: '/dragon-ball-z', icon: '🔥' },
      { name: 'Ready Player One', path: '/ready-player-one', icon: '🎮' },
      { name: 'Deadpool', path: '/deadpool', icon: '🤡' },
      { name: 'Cloud Atlas', path: '/cloud-atlas', icon: '☁️' },
      { name: 'V for Vendetta', path: '/v-for-vendetta', icon: '🎭' },
      { name: 'Minority Report', path: '/minority-report', icon: '👁️' },
      { name: 'Jupiter Ascending', path: '/jupiter-ascending', icon: '🪐' },
      { name: 'The Mask', path: '/the-mask', icon: '🥸' },
      { name: 'Asimov', path: '/asimov', icon: '🤖' },
      { name: 'Alice Turing', path: '/alice-turing', icon: '🐇' },
      { name: 'Mecha Mascot', path: '/mecha-mascot', icon: '🤖' },
      { name: 'Jardin de Mam\'', path: '/jardin-de-mam', icon: '🌸' },
      { name: 'Samus & Eléments', path: '/samus-elements', icon: '🔥' },
      { name: 'Leek Wars', path: '/leek-wars', icon: '🥦' },
      { name: 'Terraria', path: '/terraria', icon: '⛏️' },
      { name: 'Howard Duck', path: '/howard-the-duck', icon: '🦆' },
      { name: 'Matrix Resurrections', path: '/matrix-resurrections', icon: '💊' },
    ]
  },
  {
    id: 'apps',
    name: 'APPS',
    icon: '🧰',
    color: '#06B6D4',
    routes: [
      { name: 'Hub Apps', path: '/apps', icon: '🧰' },
      { name: 'JSON Formatter', path: '/apps/json', icon: '📝' },
      { name: 'Color Converter', path: '/apps/colors', icon: '🎨' },
      { name: 'Regex Tester', path: '/apps/regex', icon: '🔍' },
      { name: 'Password Gen', path: '/apps/password', icon: '🔐' },
      { name: 'UUID Generator', path: '/apps/uuid', icon: '🎲' },
      { name: 'Hash Generator', path: '/apps/hash', icon: '#️⃣' },
      { name: 'Base64', path: '/apps/base64', icon: '🔤' },
      { name: 'Timestamp', path: '/apps/timestamp', icon: '⏰' },
      { name: 'Diff Checker', path: '/apps/diff', icon: '↔️' },
      { name: 'QR Code', path: '/apps/qr-code', icon: '📱' },
      { name: 'Prompt Builder', path: '/apps/prompt-builder', icon: '🧠' },
      { name: 'API Tester', path: '/apps/api-tester', icon: '🔌' },
      { name: 'JWT Decoder', path: '/apps/jwt-decoder', icon: '🔑' },
      { name: 'Flowchart', path: '/apps/flowchart', icon: '📈' },
      { name: 'ERD Designer', path: '/apps/erd', icon: '🗃️' },
      { name: 'Wireframe', path: '/apps/wireframe', icon: '🖼️' },
      { name: 'ARK Config', path: '/apps/ark-config', icon: '🦖' },
      { name: 'Print 3D Manager', path: '/apps/print3d-manager', icon: '🖨️' },
      { name: 'Teacher Assistant', path: '/apps/teacher-assistant', icon: '👨‍🏫' },
    ]
  },
  {
    id: 'agents',
    name: 'AGENTS IA',
    icon: '🤖',
    color: '#FBBF24',
    routes: [
      { name: 'JARVIS Router', path: '/apps/agent/jarvis', icon: '🎯' },
      { name: 'EDITH Scanner', path: '/apps/agent/edith', icon: '🛡️' },
      { name: 'ULTRON Monitor', path: '/apps/agent/ultron', icon: '📊' },
      { name: 'FRIDAY KB', path: '/apps/agent/friday', icon: '🎧' },
      { name: 'VISION Content', path: '/apps/agent/vision', icon: '📝' },
      { name: 'VERONICA CI/CD', path: '/apps/agent/veronica', icon: '🚀' },
      { name: 'PEPPER Invoice', path: '/apps/agent/pepper', icon: '💰' },
    ]
  },
  {
    id: 'arcade',
    name: 'ARCADE',
    icon: '🎮',
    color: '#F472B6',
    routes: [
      { name: 'Arcade Hub', path: '/arcade', icon: '🎮' },
      { name: 'Cards', path: '/arcade/cards', icon: '🃏' },
      { name: 'Memory', path: '/arcade/memory', icon: '🧠' },
      { name: 'Terminal', path: '/arcade/terminal', icon: '💻' },
      { name: 'Slots', path: '/arcade/slots', icon: '🎰' },
    ]
  },
  {
    id: 'creations',
    name: 'CRÉATIONS',
    icon: '🎨',
    color: '#00FF41',
    routes: [
      { name: 'Galerie Matrix', path: '/creations', icon: '🎨' },
      { name: 'Gallery Generator', path: '/galerie', icon: '🖼️' },
    ]
  },
  {
    id: 'special',
    name: 'SPÉCIAL',
    icon: '🕳️',
    color: '#EF4444',
    routes: [
      { name: 'THE CONSTRUCT', path: '/construct', icon: '🕳️' },
      { name: 'ARK Admin', path: '/ark-admin', icon: '🦖' },
    ]
  },
  {
    id: 'legal',
    name: 'LÉGAL',
    icon: '📋',
    color: '#6B7280',
    routes: [
      { name: 'Mentions Légales', path: '/mentions-legales', icon: '📋' },
      { name: 'Confidentialité', path: '/confidentialite', icon: '🔒' },
      { name: 'CGV', path: '/cgv', icon: '📃' },
    ]
  },
];

// Helpers
export const getTotalPages = () => siteStructure.reduce((acc, section) => acc + section.routes.length, 0);
export const getSectionById = (id) => siteStructure.find(s => s.id === id);

export default siteStructure;
