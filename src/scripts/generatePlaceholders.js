/**
 * Gallery Placeholders Generator
 * Génère des images placeholder SVG pour la galerie
 * Usage: node generatePlaceholders.js
 */

const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../assets/gallery/placeholders');

// Créer le dossier si nécessaire
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Items de la galerie avec leurs couleurs
const items = [
  // Univers
  { id: 'matrix-rain', category: 'univers', title: 'Matrix Rain', color: '#00ff41' },
  { id: 'tron-grid', category: 'univers', title: 'Tron Grid', color: '#00d4ff' },
  { id: 'blade-runner-city', category: 'univers', title: 'Blade Runner City', color: '#ff6b2b' },
  { id: 'inception-layers', category: 'univers', title: 'Inception Layers', color: '#d4af37' },
  { id: 'ghost-shell', category: 'univers', title: 'Ghost in Shell', color: '#e91e63' },
  
  // UI/UX
  { id: 'dashboard-dark', category: 'ui-ux', title: 'Dashboard Dark', color: '#00d4ff' },
  { id: 'mobile-app', category: 'ui-ux', title: 'Mobile App', color: '#8b5cf6' },
  { id: 'landing-page', category: 'ui-ux', title: 'Landing Page', color: '#10b981' },
  { id: 'admin-panel', category: 'ui-ux', title: 'Admin Panel', color: '#f59e0b' },
  
  // Branding
  { id: 'logo-gl', category: 'branding', title: 'Logo GL Digital', color: '#10b981' },
  { id: 'logo-arkadia', category: 'branding', title: 'Logo Arkadia', color: '#ff6b35' },
  { id: 'identity-system', category: 'branding', title: 'Identity System', color: '#8b5cf6' },
  
  // 3D
  { id: 'gl-tower-3d', category: '3d', title: 'GL Tower 3D', color: '#00ff41' },
  { id: 'spaceship', category: '3d', title: 'Spaceship', color: '#00d4ff' },
  { id: 'terrain-gen', category: '3d', title: 'Terrain Gen', color: '#14b8a6' },
  
  // Génératif
  { id: 'neural-feed', category: 'generatif', title: 'Neural Feed', color: '#00ff41' },
  { id: 'particle-system', category: 'generatif', title: 'Particle System', color: '#e91e63' },
  { id: 'flow-field', category: 'generatif', title: 'Flow Field', color: '#8b5cf6' },
  
  // Projets
  { id: 'voyageo-pro', category: 'projets', title: 'Voyageo Pro', color: '#3b82f6' },
  { id: 'arkadia-cluster', category: 'projets', title: 'Arkadia Cluster', color: '#ff6b35' },
  { id: 'gl-factory', category: 'projets', title: 'GL Factory', color: '#10b981' },
  
  // Infographie
  { id: 'tech-stack', category: 'infographie', title: 'Tech Stack', color: '#14b8a6' },
  { id: 'workflow-diagram', category: 'infographie', title: 'Workflow', color: '#f59e0b' },
  { id: 'architecture-map', category: 'infographie', title: 'Architecture', color: '#8b5cf6' },
  
  // Apps
  { id: 'mobile-controls', category: 'apps', title: 'Mobile Controls', color: '#00d4ff' },
  { id: 'tech-feed-app', category: 'apps', title: 'Tech Feed', color: '#00ff41' },
  { id: 'admin-hub', category: 'apps', title: 'Admin Hub', color: '#e91e63' }
];

// Générateur SVG placeholder
function generateSVG(item, width = 800, height = 600) {
  const { title, color, category } = item;
  
  // Pattern de fond selon la catégorie
  const patterns = {
    'univers': `
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    `,
    'ui-ux': `
      <rect x="50" y="50" width="300" height="200" rx="8" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
      <rect x="370" y="50" width="380" height="500" rx="8" fill="${color}" opacity="0.05" stroke="${color}" stroke-width="1"/>
      <circle cx="200" cy="400" r="80" fill="${color}" opacity="0.1"/>
    `,
    'branding': `
      <circle cx="400" cy="300" r="150" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
      <circle cx="400" cy="300" r="100" fill="${color}" opacity="0.1"/>
      <circle cx="400" cy="300" r="50" fill="${color}" opacity="0.2"/>
    `,
    '3d': `
      <polygon points="400,100 600,400 200,400" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
      <polygon points="400,150 550,380 250,380" fill="${color}" opacity="0.1"/>
      <line x1="400" y1="100" x2="400" y2="500" stroke="${color}" stroke-width="1" opacity="0.3"/>
    `,
    'generatif': `
      <circle cx="200" cy="200" r="100" fill="${color}" opacity="0.1"/>
      <circle cx="400" cy="350" r="150" fill="${color}" opacity="0.08"/>
      <circle cx="600" cy="200" r="80" fill="${color}" opacity="0.12"/>
      <circle cx="300" cy="450" r="60" fill="${color}" opacity="0.15"/>
    `,
    'projets': `
      <rect x="100" y="150" width="250" height="300" rx="12" fill="${color}" opacity="0.1" stroke="${color}" stroke-width="1"/>
      <rect x="450" y="150" width="250" height="300" rx="12" fill="${color}" opacity="0.08" stroke="${color}" stroke-width="1"/>
    `,
    'infographie': `
      <rect x="100" y="400" width="80" height="150" fill="${color}" opacity="0.3"/>
      <rect x="220" y="300" width="80" height="250" fill="${color}" opacity="0.4"/>
      <rect x="340" y="200" width="80" height="350" fill="${color}" opacity="0.5"/>
      <rect x="460" y="250" width="80" height="300" fill="${color}" opacity="0.4"/>
      <rect x="580" y="350" width="80" height="200" fill="${color}" opacity="0.3"/>
    `,
    'apps': `
      <rect x="300" y="50" width="200" height="400" rx="20" fill="none" stroke="${color}" stroke-width="2" opacity="0.5"/>
      <rect x="320" y="80" width="160" height="340" rx="4" fill="${color}" opacity="0.05"/>
      <circle cx="400" cy="480" r="20" fill="${color}" opacity="0.3"/>
    `
  };

  const pattern = patterns[category] || patterns['univers'];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- Pattern -->
  ${pattern}
  
  <!-- Scan line effect -->
  <line x1="0" y1="300" x2="800" y2="300" stroke="${color}" stroke-width="1" opacity="0.1"/>
  
  <!-- Title -->
  <text x="400" y="300" font-family="monospace" font-size="24" fill="${color}" text-anchor="middle" filter="url(#glow)" opacity="0.9">
    ${title.toUpperCase()}
  </text>
  
  <!-- Category tag -->
  <rect x="320" y="330" width="160" height="24" rx="4" fill="${color}" opacity="0.2"/>
  <text x="400" y="347" font-family="monospace" font-size="11" fill="${color}" text-anchor="middle" opacity="0.7">
    ${category.toUpperCase()}
  </text>
  
  <!-- Corner decorations -->
  <path d="M 20 20 L 20 60 M 20 20 L 60 20" stroke="${color}" stroke-width="2" opacity="0.5"/>
  <path d="M 780 20 L 780 60 M 780 20 L 740 20" stroke="${color}" stroke-width="2" opacity="0.5"/>
  <path d="M 20 580 L 20 540 M 20 580 L 60 580" stroke="${color}" stroke-width="2" opacity="0.5"/>
  <path d="M 780 580 L 780 540 M 780 580 L 740 580" stroke="${color}" stroke-width="2" opacity="0.5"/>
</svg>`;
}

// Générer tous les placeholders
console.log('🎨 Génération des placeholders...\n');

items.forEach(item => {
  const svg = generateSVG(item);
  const filename = `${item.id}.svg`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✓ ${filename} (${item.category})`);
});

console.log(`\n✅ ${items.length} placeholders générés dans ${outputDir}`);

// Générer aussi un index JSON
const indexData = {
  generated: new Date().toISOString(),
  count: items.length,
  items: items.map(item => ({
    ...item,
    file: `${item.id}.svg`,
    path: `/assets/gallery/placeholders/${item.id}.svg`
  }))
};

fs.writeFileSync(
  path.join(outputDir, 'index.json'),
  JSON.stringify(indexData, null, 2)
);

console.log('✓ index.json généré');
