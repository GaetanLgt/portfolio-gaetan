/**
 * Script pour télécharger les fonts depuis Google Fonts en woff2
 * 
 * INSTRUCTIONS :
 * 1. Télécharge les fonts depuis https://fonts.google.com/
 *    - Inter (400, 600, 800)
 *    - JetBrains Mono (400, 500, 700)
 * 
 * 2. Ou utilise google-webfonts-helper :
 *    https://gwfh.mranftl.com/fonts
 *    - Sélectionne Inter et JetBrains Mono
 *    - Choisis les weights nécessaires
 *    - Télécharge en woff2
 * 
 * 3. Place les fichiers dans /public/fonts/ :
 *    - Inter-Regular.woff2
 *    - Inter-SemiBold.woff2
 *    - Inter-ExtraBold.woff2
 *    - JetBrainsMono-Regular.woff2
 *    - JetBrainsMono-Medium.woff2
 *    - JetBrainsMono-Bold.woff2
 * 
 * Alternative rapide avec curl (Linux/Mac) :
 * 
 * # Inter
 * curl -o public/fonts/Inter-Regular.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2"
 * curl -o public/fonts/Inter-SemiBold.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2"
 * curl -o public/fonts/Inter-ExtraBold.woff2 "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2"
 * 
 * # JetBrains Mono
 * curl -o public/fonts/JetBrainsMono-Regular.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
 * curl -o public/fonts/JetBrainsMono-Medium.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8-axjPVmUsaaDhw.woff2"
 * curl -o public/fonts/JetBrainsMono-Bold.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2"
 */

console.log('📝 Instructions pour télécharger les fonts :');
console.log('');
console.log('1. Va sur https://gwfh.mranftl.com/fonts');
console.log('2. Cherche "Inter" et "JetBrains Mono"');
console.log('3. Sélectionne les weights : 400, 500, 600, 700, 800');
console.log('4. Télécharge en woff2');
console.log('5. Place les fichiers dans /public/fonts/');
console.log('');
console.log('Fichiers attendus :');
console.log('  - Inter-Regular.woff2');
console.log('  - Inter-SemiBold.woff2');
console.log('  - Inter-ExtraBold.woff2');
console.log('  - JetBrainsMono-Regular.woff2');
console.log('  - JetBrainsMono-Medium.woff2');
console.log('  - JetBrainsMono-Bold.woff2');
