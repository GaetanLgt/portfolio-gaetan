// ============================================================
// coloriser-decor.mjs — GL Digital Lab — 13/09/2026
//
// Ramène une sortie ComfyUI à la CHARTE du site : noir `#03060A`, émeraude `#10B981`.
//
// POURQUOI CET OUTIL
// Deux générations du 13/09/2026, deux moitiés de réussite :
//   · `bigASP_v2`      -> le TUNNEL est juste (forme, point de fuite) mais la
//                         palette sort beige rosé : rien à voir avec le site.
//   · `Illustrious-XL` -> la PALETTE est juste (noir + émeraude) mais la forme
//                         n'est pas un tunnel, ce sont des traînées.
// Regénérer jusqu'à tomber sur les deux à la fois, c'est de la loterie à 16 s le
// tirage. La couleur, elle, se corrige de façon DÉTERMINISTE et locale : ce n'est
// plus une génération, c'est un étalonnage — le même geste qu'un rendu 3D qu'on
// passe à la charte en post-production.
//
// ⚠️ DEUX ÉCHECS MESURÉS AVANT D'ARRIVER ICI — ne pas refaire le chemin :
//   1. `grayscale().tint('#10B981')` a rendu une image GRISE : moyenne
//      r=132, v=132, b=132. Sur une image déjà en niveaux de gris, `tint` ne
//      colorise pas.
//   2. `joinChannel(luminance).flatten(noir)` a rendu une image VERT MENTHE PÂLE
//      à point de fuite BLANC — impossible si l'alpha avait joué son rôle, le
//      maximum atteignable étant l'émeraude (16/185/129). La composition par
//      canaux de `sharp` ne se comporte donc pas comme on le croyait.
//   Conclusion : on arrête d'interpréter les conventions de la bibliothèque et on
//   fait le duotone en ARITHMÉTIQUE DIRECTE sur les pixels. Chaque pixel est
//   calculé à la main, donc chaque pixel est explicable.
//
// LA FORMULE : pixel = noir + (émeraude − noir) × luminance^gamma
//   · la luminance est la perception (0.2126 R + 0.7152 V + 0.0722 B) ;
//   · `gamma` > 1 assombrit les tons moyens — c'est ce qui fait descendre le fond
//     au noir au lieu de le laisser gris, et ce qu'aucun réglage linéaire n'obtient ;
//   · par construction, le résultat ne peut PAS sortir de la charte : le noir est
//     le minimum, l'émeraude le maximum. Aucune valeur blanche n'est atteignable.
//
// Économie : `sharp`, déjà dans les dépendances. LOCAL, gratuit, déterministe.
//
// Usage : node scripts/coloriser-decor.mjs <source> [--sortie nom.webp]
//         [--largeur 1600] [--gamma 2.2] [--gain 1.6]
// ============================================================
import sharp from 'sharp';
import { statSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const source = args[0];
if (!source) {
  console.error('Usage : node scripts/coloriser-decor.mjs <source> [--sortie nom.webp] [--largeur 1600] [--gamma 2.2] [--gain 1.6]');
  process.exit(2);
}
const option = (nom, defaut) => {
  const i = args.indexOf('--' + nom);
  return i === -1 ? defaut : args[i + 1];
};

const largeur = Number(option('largeur', 1600));
const gamma = Number(option('gamma', 2.2));
const gain = Number(option('gain', 1.6));
const dossier = option('dossier', 'C:\\IA\\gl-digital-lab\\travail\\conforme');
const sortie = option('sortie', path.basename(source).replace(/\.[^.]+$/, '') + '-charte.webp');
const chemin = path.join(dossier, sortie);

// Les deux teintes de la charte, relevées dans le thème du site — pas inventées.
const NOIR = [0x03, 0x06, 0x0a];        // #03060A
const EMERAUDE = [0x10, 0xb9, 0x81];    // #10B981

mkdirSync(dossier, { recursive: true });
const octetsSource = statSync(source).size;

const cible = sharp(source).resize({ width: largeur, withoutEnlargement: true });
const { data, info } = await cible.removeAlpha()
  .raw().toBuffer({ resolveWithObject: true });

const n = info.width * info.height;
const out = Buffer.alloc(n * 3);
let sommeG = 0;

for (let i = 0, p = 0; i < n; i++, p += info.channels) {
  const r = data[p], v = data[p + 1], b = data[p + 2];
  const lum = (0.2126 * r + 0.7152 * v + 0.0722 * b) / 255;
  // gamma assombrit les tons moyens, gain rattrape les hautes lumières.
  let g = Math.pow(lum, gamma) * gain;
  g = g < 0 ? 0 : g > 1 ? 1 : g;
  sommeG += g;
  const q = i * 3;
  for (let c = 0; c < 3; c++) {
    out[q + c] = Math.round(NOIR[c] + (EMERAUDE[c] - NOIR[c]) * g);
  }
}

const webp = await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .webp({ quality: 82, effort: 6 })
  .toBuffer();
writeFileSync(chemin, webp);

// ── Témoins de conformité ──────────────────────────────────────────────────
// Sans ces chiffres, « c'est aux couleurs de la charte » serait une impression.
const stat = await sharp(webp).stats();
const [r, v, b] = stat.channels.map((c) => Math.round(c.mean));
const gMoyen = sommeG / n;

// Contrôle par construction : aucun pixel ne doit sortir des bornes de la charte.
// ⚠️ Mesuré sur le tampon BRUT, pas sur le WebP : l'encodage WebP est AVEC PERTE,
// donc un pixel peut légèrement franchir une borne (3 -> 1) sans que la formule
// ait le moindre défaut. Contrôler après compression produisait une fausse alerte
// « hors charte » — un outil qui crie au loup finit par ne plus être écouté.
let horsCharte = 0;
for (let c = 0; c < 3; c++) {
  const min = Math.min(NOIR[c], EMERAUDE[c]);
  const max = Math.max(NOIR[c], EMERAUDE[c]);
  for (let i = c; i < out.length; i += 3) {
    if (out[i] < min || out[i] > max) horsCharte++;
  }
}

const ko = (o) => (o / 1024).toFixed(1).replace('.', ',') + ' Ko';
console.log('');
console.log('=== ÉTALONNAGE D\'UN DÉCOR GÉNÉRÉ SUR COMFYUI -> CHARTE ===');
console.log('  source        : ' + source + '  (' + ko(octetsSource) + ')');
console.log('  sortie        : ' + chemin + '  (' + info.width + '×' + info.height + ')');
console.log('  réglage       : gamma ' + gamma + ' · gain ' + gain);
console.log('  poids         : ' + ko(webp.length) + '  (-' + ((1 - webp.length / octetsSource) * 100).toFixed(1).replace('.', ',') + ' %)');
console.log('');
console.log('  couleur moyenne : r=' + r + ' v=' + v + ' b=' + b);
console.log('  luminance^gamma moyenne : ' + gMoyen.toFixed(3) + '   (0 = tout noir, 1 = tout émeraude)');
console.log('  vert dominant   : ' + (v > r && v > b ? 'OUI — la teinte a pris' : 'NON — la teinte n\'a PAS pris'));
console.log('  hors charte     : ' + (horsCharte === 0
  ? 'AUCUN canal ne sort des bornes 03/06/0A ↔ 10/B9/81'
  : '⚠️ ' + horsCharte + ' canal(aux) SORTENT de la charte — la formule a un défaut'));
console.log('');
console.log('  Lecture : une luminance moyenne au-dessus de ~0,35 donne un décor TROP');
console.log('  CLAIR pour le site — augmenter --gamma. En dessous de ~0,08, le décor');
console.log('  disparaît — baisser --gamma ou monter --gain.');
console.log('');
