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

    // Options de compression EXPLICITES (ajoutées le 10/09/2026).
    // Pourquoi : `sharp 0.33 → 0.35` a changé le défaut de `.png()`, et la sortie est
    // passée de 41 395 à 49 644 octets (+20 %) sans qu'on ait touché au SVG. Une montée
    // de dépendance ne doit pas dégrader le poids livré en silence.
    // `palette: false` est DÉLIBÉRÉ : la version à palette tombait à 17 429 o, mais la
    // comparaison objective (RMSE 14,6) montrait une perte visible sur les dégradés.
    // On garde donc du SANS PERTE (RMSE 0,000) : 36 576 o, soit 11,6 % de moins qu'avant.
    await sharp(ogSvg)
      .resize(1200, 630)
      .png({ compressionLevel: 9, effort: 10, palette: false })
      .toFile(join(publicDir, 'og-image.png'));
    
    console.log('✅ og-image.png (1200x630) généré !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\n💡 Alternative: utilise https://svgtopng.com pour convertir manuellement');
  }
}

generateOgImage();
