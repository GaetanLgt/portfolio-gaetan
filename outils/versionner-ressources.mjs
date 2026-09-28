// versionner-ressources.mjs — GL Digital Lab, 28/09/2026
//
// ⛔ LE DÉFAUT, MESURÉ LE 28/09/2026 : les feuilles de style et le script de navigation
//    sont appelés avec `?v=20260928` — une DATE ÉCRITE À LA MAIN, dans 14 pages.
//    Elle ne change pas quand le fichier change.
//    ⇒ Un visiteur qui a déjà vu le site garde l'ANCIEN CSS dans son cache, et rien ne
//      le lui dit. C'est ce qui m'est arrivé : ma capture après correction était
//      identique à la précédente, même empreinte SHA256.
//    ⭐ *Une version écrite à la main devient fausse sans le dire — exactement comme un
//      chiffre. La seule version qui ne ment pas est une empreinte du CONTENU.*
//
// ⭐ CE QUE FAIT CET OUTIL : il calcule le sha256 de chaque ressource locale appelée
//    par les pages, et réécrit le `?v=` avec les 8 premiers caractères.
//    Deux conséquences, et les deux comptent :
//      ① le cache du navigateur est invalidé EXACTEMENT quand le fichier change ;
//      ② si rien n'a changé, la version reste la même — donc on ne casse pas le cache
//         pour rien.
//
// ⚠️ Il ne touche QUE le paramètre `v`. Les chemins, les ordres et les balises sont
//    laissés tels quels. Et il REFUSE d'écrire si une ressource appelée n'existe pas :
//    *une empreinte calculée sur un fichier absent serait une version inventée.*
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// ⛔⛔ CORRIGÉ LE 28/09/2026 — LE CHEMIN ÉTAIT CELUI DE MA MACHINE, PAS CELUI DU DÉPÔT.
//    J'avais écrit `<racine>/cinematique`, en dur. Sur GitHub Actions,
//    le dépôt est déployé dans `/home/runner/work/portfolio-gaetan/portfolio-gaetan`.
//    ⇒ `ENOENT: no such file or directory, scandir '<racine>/cinematique'`
//      et le DÉPLOIEMENT A ÉCHOUÉ. Le site est resté sur la version précédente.
//    ⭐ *Un outil qui tourne ailleurs que sur la machine qui l'a vu naître ne connaît
//      pas le chemin de cette machine. Le seul chemin qu'il puisse connaître est
//      celui du fichier lui-même.*
//    ⇒ La racine se DÉDUIT de l'emplacement du script : `outils/` → la racine du dépôt.
//      Ça marche sur la machine de Gaëtan ET sur le runner, sans variable à poser.
const ICI = path.dirname(fileURLToPath(import.meta.url));
const C = path.resolve(ICI, '..', 'cinematique');
if (!fs.existsSync(C)) {
  console.error('⛔ cinematique/ introuvable depuis ' + C);
  console.error('   (le script a été déplacé ? il doit vivre dans <racine>/outils/)');
  process.exit(2);
}
const SIMULER = process.argv.includes('--simuler');
console.log('  racine : ' + C);

const sha8 = (abs) => crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);

// Toutes les pages, à toute profondeur
const pages = [];
const marcher = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', 'vendor'].includes(e.name)) marcher(p); }
    else if (e.name.endsWith('.html')) pages.push(p);
  }
};
marcher(C);
console.log('  pages : ' + pages.length);

let corrigees = 0, liens = 0, inchanges = 0;
const absents = [];

for (const page of pages) {
  const rel = path.relative(C, page).replace(/\\/g, '/');
  const prof = rel.includes('/') ? '../'.repeat(rel.split('/').length - 1) : '';
  let t = fs.readFileSync(page, 'utf8');
  const avant = t;

  t = t.replace(/(href|src)="([^"?]+\.(?:css|js|mjs))(\?v=[^"]*)?"/g, (tout, attr, chemin) => {
    // on ne versionne que ce qui est LOCAL (pas de http, pas de //, pas de data:)
    if (/^(https?:)?\/\//.test(chemin) || chemin.startsWith('data:')) return tout;
    liens++;
    // ⛔ CORRIGÉ LE 28/09 — UN CHEMIN ABSOLU N'EST PAS UN CHEMIN RELATIF.
    //    `404.html` appelle `/css/manifeste.css` : depuis la racine du DOMAINE.
    //    Mon premier essai le résolvait depuis le dossier de la page, ne le trouvait
    //    pas, et le signalait « introuvable ». Or il répond 200 en production —
    //    vérifié à la main. *Un outil qui compare un chemin absolu à un chemin relatif
    //    fabrique un faux positif, et un faux positif fait douter d'un fichier sain.*
    const abs = chemin.startsWith('/')
      ? path.join(C, chemin.slice(1))
      : path.resolve(path.dirname(page), chemin);
    if (!fs.existsSync(abs)) { absents.push(rel + ' → ' + chemin); return tout; }
    const v = sha8(abs);
    const nouveau = attr + '="' + chemin + '?v=' + v + '"';
    if (tout === nouveau) inchanges++;
    return nouveau;
  });

  if (t !== avant) {
    if (!SIMULER) fs.writeFileSync(page, t, 'utf8');
    corrigees++;
    console.log('  ' + (SIMULER ? '[simule] ' : 'OK  ') + rel);
  }
}

console.log('');
console.log('  liens de ressources examines : ' + liens);
console.log('  pages reecrites              : ' + corrigees);
console.log('  liens deja a jour            : ' + inchanges);
if (absents.length) {
  console.log('  ⛔ RESSOURCES INTROUVABLES (' + absents.length + ') — la version n a PAS ete posee :');
  absents.slice(0, 12).forEach(a => console.log('     ' + a));
}
if (SIMULER) console.log('  MODE SIMULE : rien n a ete ecrit.');

// ── La preuve : on relit un fichier et on recalcule ────────────────────────
console.log('');
console.log('=== VERIFICATION (relu du disque) ===');
const temoin = path.join(C, 'index.html');
const contenu = fs.readFileSync(temoin, 'utf8');
const attendu = sha8(path.join(C, 'css/manifeste.css'));
const trouve = (contenu.match(/manifeste\.css\?v=([0-9a-f]+)/) || [, 'absent'])[1];
console.log('  sha256(manifeste.css) tronque : ' + attendu);
console.log('  ce que porte index.html       : ' + trouve);
console.log('  ' + (trouve === attendu ? '✅ CONCORDE' : '⛔ NE CONCORDE PAS'));
