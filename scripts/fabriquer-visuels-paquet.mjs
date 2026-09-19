// ============================================================
// fabriquer-visuels-paquet.mjs — GL Digital Lab — 13/09/2026
//
// Fabrique les QUATRE images que MakePkg exige pour créer un paquet .msixvc.
//
// POURQUOI IL EST ICI (dans le dépôt du SITE, pas dans celui du jeu)
// Il a besoin de `sharp`, qui est une dépendance de ce dépôt-ci. Le mettre ailleurs
// obligerait à installer une seconde copie d'une bibliothèque qui est déjà là.
// Il écrit dans le dossier du jeu, passé en argument.
//
// ⚠️ CES IMAGES SONT DES REMPLACEMENTS, PAS UN LOGO.
// MakePkg refuse de fabriquer un paquet sans elles — mesuré le 13/09/2026 :
//     StoreLogo was not found:  ...\StoreLogo.png
//     Missing logo file - Error Code: 0x80070002
// Tailles IMPOSÉES par la documentation (elles ne sont pas négociables) :
//     StoreLogo.png        100 x 100
//     Logo.png             150 x 150
//     SmallLogo.png         44 x 44
//     SplashScreen.png    1920 x 1080
//
// Elles portent la mention « PLACEHOLDER » et un cadre en pointillés, POUR QU'ON NE LES
// CONFONDE PAS avec un visuel définitif. Le choix d'une identité visuelle de produit est
// une décision de Gaëtan, pas d'un script.
//
// ⚠️ ET ELLES NE PEUVENT PAS PARTIR EN BOUTIQUE : le paquet fabriqué avec `/lt` utilise une
// clé de TEST et ne peut pas être soumis. Le paquet de soumission (`/lk`) exigera les vrais
// visuels — c'est ce qui rend ce remplacement sans danger.
//
// Usage : node scripts/fabriquer-visuels-paquet.mjs "<dossier du jeu>"
// ============================================================
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { statSync } from 'node:fs';

const dossier = process.argv[2];
if (!dossier) {
  console.error('  Usage : node scripts/fabriquer-visuels-paquet.mjs "<dossier du jeu>"');
  process.exit(2);
}

const NOIR = '#03060A';       // le noir de la charte
const EMERAUDE = '#10B981';   // l'émeraude de la charte

const IMAGES = [
  { nom: 'StoreLogo.png',    l: 100,  h: 100,  texte: 'PLACEHOLDER', taille: 13 },
  { nom: 'Logo.png',         l: 150,  h: 150,  texte: 'PLACEHOLDER', taille: 18 },
  { nom: 'SmallLogo.png',    l: 44,   h: 44,   texte: 'PL',          taille: 14 },
  { nom: 'SplashScreen.png', l: 1920, h: 1080, texte: 'PLACEHOLDER — À REMPLACER', taille: 46 },
];

console.log('');
console.log('=== IMAGES DU PAQUET — remplacements, pas un logo ===');
console.log('  dossier : ' + dossier);
console.log('');

for (const im of IMAGES) {
  const svg = `<svg width="${im.l}" height="${im.h}" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="${im.l - 4}" height="${im.h - 4}" fill="none"
        stroke="${EMERAUDE}" stroke-width="2" stroke-dasharray="7 5" opacity="0.85"/>
  <text x="50%" y="50%" fill="${EMERAUDE}" font-family="monospace" font-size="${im.taille}"
        text-anchor="middle" dominant-baseline="middle">${im.texte}</text>
</svg>`;

  const fichier = path.join(dossier, im.nom);
  const buffer = await sharp({
    create: { width: im.l, height: im.h, channels: 3, background: NOIR }
  })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png()
    .toFile(fichier);

  const m = await sharp(fichier).metadata();
  const ko = (statSync(fichier).size / 1024).toFixed(1).replace('.', ',');
  const conforme = (m.width === im.l && m.height === im.h) ? 'conforme' : '*** MAUVAISE TAILLE ***';
  console.log(`  ${im.nom.padEnd(18)} ${m.width}x${m.height}  ${ko.padStart(7)} Ko   ${conforme}`);
}

console.log('');
console.log('  ⚠️  Ces images portent « PLACEHOLDER » : elles prouvent la chaîne de paquetage,');
console.log('      elles ne constituent pas une identité visuelle. À remplacer avant la soumission.');
console.log('');
