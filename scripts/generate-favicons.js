/**
 * Script de génération des favicons
 * Utilise Sharp pour convertir le SVG en PNG
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/generate-favicons.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// SVG source
const faviconSvg = readFileSync(join(publicDir, 'favicon.svg'));

// Tailles à générer
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

async function generateFavicons() {
  console.log('🎨 Génération des favicons...\n');

  for (const { name, size } of sizes) {
    try {
      // Options explicites — même raison que dans generate-og-image.js : le défaut de
      // `.png()` a changé avec `sharp 0.35`, et la sortie était devenue plus lourde sans
      // qu'on ait touché au SVG. `palette: false` : on garde du sans perte (vérifié au
      // RMSE), la version à palette dégradait les images.
      await sharp(faviconSvg)
        .resize(size, size)
        .png({ compressionLevel: 9, effort: 10, palette: false })
        .toFile(join(publicDir, name));

      console.log(`✅ ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Erreur pour ${name}:`, error.message);
    }
  }

  console.log('\n✅ Favicons PNG générés dans /public/');
  console.log('\n📋 Prochaines étapes:');
  console.log('   1. Convertir favicon-32x32.png en favicon.ico sur https://convertico.com');
  console.log('   2. Générer og-image.png depuis og-image.svg sur https://svgtopng.com');
}

generateFavicons();
