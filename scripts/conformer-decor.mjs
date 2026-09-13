// ============================================================
// conformer-decor.mjs — GL Digital Lab — 13/09/2026
//
// Ramène une image générée SUR COMFYUI au poids d'une page web.
//
// POURQUOI CET OUTIL
// Une sortie ComfyUI pèse ~0,9 Mo en PNG : c'est à lui seul plus que le seuil
// visé pour une page entière (1 Mo). Ce qui sort de la carte graphique n'est pas
// ce qui part sur le réseau — il manque une étape, et cette étape est mesurable.
// Le 13/09, deux candidats ont été générés (16,5 s et 15,8 s sur RTX 3080) :
// un tunnel à la bonne forme mais de palette beige, et un fond noir/émeraude à
// la bonne palette mais sans tunnel. Les deux pèsent ~0,86 Mo en sortie brute.
//
// Économie : `sharp` est déjà dans les dépendances du dépôt — LOCAL, gratuit,
// aucune dépendance ajoutée. (ImageMagick et cwebp sont absents de la machine ;
// ffmpeg existe mais `sharp` est plus direct.)
//
// Usage :
//   node scripts/conformer-decor.mjs <source> [--largeur 1600] [--qualite 80]
//                                    [--sortie nom.webp] [--dossier public]
// ============================================================
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const source = args[0];
if (!source) {
  console.error('Usage : node scripts/conformer-decor.mjs <source> [--largeur 1600] [--qualite 80] [--sortie nom.webp]');
  process.exit(2);
}
const option = (nom, defaut) => {
  const i = args.indexOf('--' + nom);
  return i === -1 ? defaut : args[i + 1];
};

const largeur = Number(option('largeur', 1600));
const qualite = Number(option('qualite', 80));
const dossier = option('dossier', 'public');
const sortie = option('sortie', path.basename(source).replace(/\.[^.]+$/, '') + `-${largeur}.webp`);
const cheminSortie = path.join(dossier, sortie);

mkdirSync(dossier, { recursive: true });

const octetsSource = statSync(source).size;

const info = await sharp(source).metadata();
const image = sharp(source).resize({ width: largeur, withoutEnlargement: true });

// ⚠️ On produit AUSSI une version AVIF : à qualité visuelle comparable elle est
// souvent plus légère, mais elle n'est pas acceptée partout — on mesure les deux
// au lieu de supposer. Le `<picture>` du site choisira, le WebP servant de repli.
const webp = await image.clone().webp({ quality: qualite, effort: 6 }).toBuffer();
writeFileSync(cheminSortie, webp);

const avif = await image.clone().avif({ quality: qualite, effort: 6 }).toBuffer();
const cheminAvif = cheminSortie.replace(/\.webp$/, '.avif');
writeFileSync(cheminAvif, avif);

const ko = (o) => (o / 1024).toFixed(1).replace('.', ',') + ' Ko';
const pourcent = (o) => ((1 - o / octetsSource) * 100).toFixed(1).replace('.', ',') + ' %';

// ⚠️ LARGEUR RÉELLE, pas la largeur demandée. `withoutEnlargement: true` empêche
// d'agrandir : demander 1600 px sur une source de 1024 px sort une image de
// 1024 px. Annoncer « 1600 px » ferait croire à une définition qui n'existe pas —
// exactement le genre de chiffre flatteur qu'un outil ne doit pas produire.
const sortieInfo = await sharp(webp).metadata();

console.log('');
console.log('=== CONFORMATION D\'UN DÉCOR GÉNÉRÉ SUR COMFYUI ===');
console.log('  source    : ' + source);
console.log('  dimensions: ' + info.width + '×' + info.height + '  (' + info.format + ')');
console.log('  largeur demandée : ' + largeur + ' px, qualité ' + qualite
  + (sortieInfo.width === largeur ? '' : '  ⚠️ SORTIE RÉELLE : ' + sortieInfo.width + ' px (source plus petite, pas d\'agrandissement)'));
console.log('');
console.log('  brut (sortie ComfyUI) : ' + ko(octetsSource));
console.log('  webp                  : ' + ko(webp.length) + '   (-' + pourcent(webp.length) + ')  -> ' + cheminSortie);
console.log('  avif                  : ' + ko(avif.length) + '   (-' + pourcent(avif.length) + ')  -> ' + cheminAvif);
console.log('');
console.log('  Rappel de la marge disponible sur la page : le budget est de 1 Mo.');
