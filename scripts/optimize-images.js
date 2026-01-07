/**
 * Script d'optimisation des images
 * Convertit les PNG en WebP avec fallback
 * 
 * Usage: node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const QUALITY = 85;

async function optimizeImages() {
  console.log('🖼️  Optimisation des images...\n');
  
  const files = fs.readdirSync(PUBLIC_DIR);
  const pngFiles = files.filter(f => f.endsWith('.png') && !f.includes('favicon'));
  
  for (const file of pngFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputPath = path.join(PUBLIC_DIR, file.replace('.png', '.webp'));
    
    try {
      const info = await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const newSize = info.size;
      const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ ${file} → ${file.replace('.png', '.webp')}`);
      console.log(`   ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (-${savings}%)\n`);
    } catch (err) {
      console.error(`❌ Erreur pour ${file}:`, err.message);
    }
  }
  
  console.log('✨ Optimisation terminée !');
  console.log('\n📝 Note : Mets à jour les références dans le code si tu veux utiliser WebP');
  console.log('   Garde les PNG comme fallback pour les vieux navigateurs');
}

optimizeImages();
