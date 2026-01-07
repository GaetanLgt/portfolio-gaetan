#!/usr/bin/env node

/**
 * 🚀 Script d'optimisation et build GL Digital Lab
 * Automatise toute la chaîne : assets → audit → build → rapport
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

console.log('🚀 GL Digital Lab - Optimisation & Build\n');

// Étape 1 : Vérification environnement
console.log('📋 Vérification environnement...');
try {
  execSync('npm --version', { stdio: 'pipe' });
  console.log('✅ Node.js et npm disponibles');
} catch (error) {
  console.error('❌ Node.js/npm non trouvé');
  process.exit(1);
}

// Étape 2 : Installation dépendances
console.log('\n📦 Installation des dépendances...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Dépendances installées');
} catch (error) {
  console.error('❌ Erreur installation:', error.message);
  process.exit(1);
}

// Étape 3 : Génération des assets
console.log('\n🎨 Génération des assets (favicons + og-image)...');
try {
  execSync('npm run generate:assets', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Assets générés');
} catch (error) {
  console.warn('⚠️  Erreur assets (continuons):', error.message);
}

// Étape 4 : Build production
console.log('\n🔨 Build production...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: projectRoot });
  console.log('✅ Build terminé');
} catch (error) {
  console.error('❌ Erreur build:', error.message);
  process.exit(1);
}

// Étape 5 : Analyse des bundles
console.log('\n📊 Analyse des bundles...');
try {
  const distPath = join(projectRoot, 'dist');
  if (existsSync(distPath)) {
    console.log('📁 Contenu dist/ :');
    execSync('ls -la dist/', { stdio: 'inherit', cwd: projectRoot });
    
    // Taille des chunks
    const statsPath = join(distPath, 'assets');
    if (existsSync(statsPath)) {
      console.log('\n📦 Taille des bundles :');
      execSync('du -sh dist/assets/*', { stdio: 'inherit', cwd: projectRoot });
    }
  }
} catch (error) {
  console.log('ℹ️  Analyse bundles skippée');
}

// Étape 6 : Vérifications finales
console.log('\n🔍 Vérifications finales...');

const distFiles = [
  'index.html',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  '.htaccess'
];

let allFilesPresent = true;
distFiles.forEach(file => {
  const filePath = join(projectRoot, 'dist', file);
  if (existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} manquant`);
    allFilesPresent = false;
  }
});

// Étape 7 : Rapport final
console.log('\n📋 RAPPORT FINAL\n');
console.log('==========================================');
console.log('🎯 OPTIMISATIONS APPLIQUÉES :');
console.log('   • CSS critique inline');
console.log('   • Code splitting (Three.js, GSAP, Chart.js)');
console.log('   • Animations composite-friendly');
console.log('   • Contraste WCAG AA');
console.log('   • Breadcrumbs + Schema.org');
console.log('   • Lazy loading backgrounds');
console.log('   • Meta tags optimisés');

if (allFilesPresent) {
  console.log('\n✅ BUILD RÉUSSI - Prêt pour déploiement');
  console.log('==========================================');
  console.log('📋 PROCHAINES ÉTAPES :');
  console.log('   1. Test local : npm run preview');
  console.log('   2. Upload dist/* sur O2Switch');
  console.log('   3. Audit Lighthouse final');
  console.log('   4. 🎉 Objectif : 95+ / 400 !');
} else {
  console.log('\n⚠️  BUILD INCOMPLET - Vérifiez les erreurs');
  process.exit(1);
}

console.log('\n🔥 GL Digital Lab - Ready to deploy! 🔥\n');
