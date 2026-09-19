// ============================================================
// reduire-planche-armure.mjs — GL Digital Lab — 19/09/2026
//
// MET UNE PLANCHE DE CONCEPTION AU FORMAT DU SITE, ET LE MESURE.
//
// POURQUOI CE FICHIER EXISTE
//   La planche du projet `armure-neo` est un PNG de 832 × 1216 pesant 1 076 519
//   octets. Le verrou de la charte est « moins de 1 Mo par page, octets SERVIIS » :
//   un binaire de cette taille sur une page qui sert déjà ses scripts, ses polices
//   et sa feuille de style rapproche la page du seuil sans rien apporter au
//   visiteur. Les sources de production, elles, vivent HORS du dépôt du site (dans
//   l'arbre du studio) et ne sont pas versionnées ici.
//
//   `scripts/optimize-images.js` ne fait pas ce travail : il balaie la RACINE de
//   `public/` à la recherche de PNG, sans redimensionner, et compare des fichiers
//   qui vivent déjà dans le dépôt. Ici, la source est ailleurs, la largeur cible
//   compte, et la mesure avant / après est le résultat qu'on veut lire.
//
// ⚠️ LA SOURCE N'EST JAMAIS MODIFIÉE. Elle est lue, pas écrite : c'est la pièce de
//    production du studio, elle reste où elle est. Seule la copie servie est écrite.
//
// USAGE
//   node scripts/reduire-planche-armure.mjs <source> <destination> [largeur]
//
//   Exemple, celui qui a produit la planche publiée le 19/09/2026 :
//     node scripts/reduire-planche-armure.mjs \
//       "...\armure-neo\concepts\armure-01-front.png" \
//       "public/armure/planche-01-front.webp" 900
//
//   Mesure obtenue : 832 × 1216, PNG, 1 076 519 o → 832 × 1216, WebP, 43 564 o.
//   ⚠️ La largeur n'a PAS été agrandie : `withoutEnlargement` laisse 832 px, parce
//      qu'agrandir ne fabriquerait aucun détail et ferait grossir le fichier.
// ============================================================
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import sharp from 'sharp';

const [source, destination, largeurArg] = process.argv.slice(2);
if (!source || !destination) {
  console.error('  usage : node scripts/reduire-planche-armure.mjs <source> <destination> [largeur]');
  process.exit(2);
}

const LARGEUR = Number(largeurArg || 900);
if (!Number.isFinite(LARGEUR) || LARGEUR < 64) {
  console.error('  largeur invalide : ' + largeurArg);
  process.exit(2);
}

const avant = statSync(source).size;
const meta = await sharp(source).metadata();

// `withoutEnlargement` : une source plus étroite que la cible n'est PAS agrandie.
let tube = sharp(source).resize({ width: LARGEUR, withoutEnlargement: true });
const cible = extname(destination).toLowerCase();
if (cible === '.webp') tube = tube.webp({ quality: 82, effort: 6 });
else if (cible === '.jpg' || cible === '.jpeg') tube = tube.jpeg({ quality: 82, mozjpeg: true });
else if (cible === '.png') tube = tube.png({ compressionLevel: 9, palette: true });
else {
  console.error('  format de sortie non pris en charge : ' + cible);
  process.exit(2);
}

const sortie = await tube.toBuffer();
writeFileSync(destination, sortie);

/*
 * ⚠️ ON RELIT LE FICHIER ÉCRIT, ON NE CROIT PAS LA VARIABLE — et on ÉCHOUE si les deux
 * ne s'accordent pas. Un outil qui annonce « 43 564 octets » sans vérifier ce qui est
 * sur le disque annonce un chiffre, pas une mesure. C'est exactement le défaut que ce
 * dépôt combat : une affirmation qui a la forme d'un fait sans en être un.
 */
const apres = statSync(destination).size;
const metaSortie = await sharp(readFileSync(destination)).metadata();

console.log('  source       : ' + source);
console.log('  destination  : ' + destination);
console.log('  dimensions   : ' + meta.width + ' × ' + meta.height + '  →  ' + metaSortie.width + ' × ' + metaSortie.height);
console.log('  format       : ' + meta.format + '  →  ' + metaSortie.format);
console.log('  octets       : ' + avant + '  →  ' + apres + '  (' + (100 - (apres / avant) * 100).toFixed(1) + ' % de moins)');
if (sortie.length !== apres) {
  console.error('  ⛔ le fichier écrit ne fait pas la taille annoncée : ' + sortie.length + ' ≠ ' + apres);
  process.exit(1);
}
