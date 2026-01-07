/**
 * Script de génération de l'image Open Graph
 * 
 * Usage:
 *   npm install sharp --save-dev
 *   node scripts/generate-og-image.js
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

async function generateOgImage() {
  console.log('🖼️  Génération de og-image.png...\n');

  try {
    const ogSvg = readFileSync(join(publicDir, 'og-image.svg'));
    
    await sharp(ogSvg)
      .resize(1200, 630)
      .png()
      .toFile(join(publicDir, 'og-image.png'));
    
    console.log('✅ og-image.png (1200x630) généré !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Alternative: utilise https://svgtopng.com pour convertir manuellement');
  }
}

generateOgImage();
