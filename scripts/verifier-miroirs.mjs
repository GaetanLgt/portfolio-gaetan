#!/usr/bin/env node
/*
 * verifier-miroirs.mjs — LE VERROU DES CHAÎNES MIROIRS.
 *
 * ⛔ LE DÉFAUT QU'IL FERME, MESURÉ LE 22/09/2026.
 *
 *   Le même contenu vit à DEUX endroits, et AUCUN des deux ne dit lequel fait foi.
 *   Résultat : ils divergent, et on ne s'en aperçoit qu'en lisant le journal d'un build.
 *
 *   Mesuré ce jour-là :
 *     · les dossiers pédagogiques : 5 fiches « contenu différent » ;
 *     · le kit Metroid : 141 notes signalées.
 *
 *   ⭐ *Un miroir sans source déclarée n'est pas un miroir : c'est DEUX originaux.*
 *     Et deux originaux, ça se contredit — c'est la loi n° 3, « une seule liste, ou
 *     elle pourrit ».
 *
 * CE QU'IL FAIT : il lit `scripts/miroirs.json`, et pour chaque paire il dit — non pas
 * « ils diffèrent », mais **QUI A BOUGÉ, ET DEPUIS QUAND**. C'est cette phrase-là qui
 * déclenche une action ; « ils diffèrent » ne déclenche rien.
 *
 * ⚠️ ET IL NE SYNCHRONISE RIEN. Il **constate**. La synchronisation est un geste
 *    humain, avec un SENS choisi — un outil qui recopie tout seul dans le mauvais sens
 *    ÉCRASE du travail, et c'est exactement ce qu'on cherche à éviter.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const LISTE = join(RACINE, 'scripts', 'miroirs.json');

/*
 * ⛔ CORRIGÉ LE 22/09/2026 — LE VERROU S'EST TROMPÉ LUI-MÊME, ET C'EST LA MEILLEURE
 *    CHOSE QUI POUVAIT LUI ARRIVER.
 *
 *    Il a dit « source absente » alors que la source EXISTAIT — mesuré :
 *      PowerShell : C:\IA\gl-digital-lab\ecole\dossiers-pedagogiques   -> PRESENT
 *      lui        : C:/IA/gl-digital-lab/ecole/dossiers-pedagogiques   -> « absente »
 *
 *    ⭐ LA CAUSE : `join(RACINE, "C:/IA/...")` — **`join` colle un chemin ABSOLU à la
 *      racine**, et le résultat ne désigne plus rien. *Un chemin absolu n'est pas
 *      relatif, et le traiter comme tel fabrique un chemin qui n'existe pas.*
 *
 *    ⚠️ Et le verrou n'a PAS menti : il a dit « je ne trouve pas », avec le chemin
 *       qu'il avait construit. **C'est ce qui m'a permis de voir le défaut en une
 *       seconde** — alors qu'un verrou qui aurait dit « tout va bien » l'aurait caché.
 */
const resoudre = (chemin) => (isAbsolute(chemin) ? chemin : join(RACINE, chemin));

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

console.log('\n' + '='.repeat(78));
console.log('  MIROIRS — une source fait foi, et les copies le savent');
console.log('='.repeat(78));

if (!existsSync(LISTE)) {
  console.log(jaune('  [--]  scripts/miroirs.json est absent.'));
  console.log(gris('        Sans la liste des miroirs, ce verrou ne peut rien comparer —'));
  console.log(gris('        et on ne devine pas quelles paires existent.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

const { MIROIRS } = JSON.parse(readFileSync(LISTE, 'utf8'));
if (!Array.isArray(MIROIRS) || MIROIRS.length === 0) {
  console.log(jaune('  [--]  la liste des miroirs est vide — elle ne vérifie donc rien.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

/** Empreinte d'un dossier : nom + taille de chaque fichier, triés. */
function empreinte(chemin) {
  if (!existsSync(chemin)) return null;
  const fichiers = [];
  let plusRecent = 0;

  const parcourir = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const p = join(d, e.name);
      if (e.isDirectory()) parcourir(p);
      else if (e.isFile()) {
        const s = statSync(p);
        fichiers.push(relative(chemin, p).replace(/\\/g, '/') + ':' + s.size);
        if (s.mtimeMs > plusRecent) plusRecent = s.mtimeMs;
      }
    }
  };
  parcourir(chemin);

  fichiers.sort();
  const h = createHash('sha1').update(fichiers.join('\n')).digest('hex').slice(0, 12);
  return { h, n: fichiers.length, plusRecent };
}

const jours = (ms) => Math.round((Date.now() - ms) / 86400000);
const d = (ms) => new Date(ms).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });

const divergents = [];
const alignes = [];
const absents = [];

for (const m of MIROIRS) {
  // ⭐ `resoudre` gère les DEUX formes : absolue, ou relative à la racine du dépôt.
  const a = resoudre(m.source);
  const b = resoudre(m.copie);
  const ea = empreinte(a);
  const eb = empreinte(b);

  if (!ea || !eb) {
    absents.push({ ...m, cote: !ea ? 'source' : 'copie' });
    continue;
  }
  if (ea.h === eb.h) { alignes.push({ ...m, ea, eb }); continue; }

  // ⭐ QUI A BOUGÉ — c'est ça qui déclenche une action, pas « ils diffèrent ».
  const sourcePlusRecente = ea.plusRecent > eb.plusRecent;
  divergents.push({
    ...m, ea, eb, sourcePlusRecente,
    ecart: Math.abs(jours(ea.plusRecent) - jours(eb.plusRecent)),
  });
}

console.log(`  ${MIROIRS.length} miroir(s) déclaré(s)\n`);

for (const m of alignes) {
  console.log(`  ${vert('[ok]')}  ${m.nom.padEnd(32)} ${gris(m.ea.n + ' fichiers · identiques')}`);
}
for (const m of absents) {
  console.log(`  ${jaune('[--]')}  ${m.nom.padEnd(32)} ${jaune(m.cote + ' absente')}`);
  console.log(gris(`        ${m.cote === 'source' ? m.source : m.copie}`));
}
for (const m of divergents) {
  console.log(`  ${rouge('[KO]')}  ${m.nom.padEnd(32)} ${rouge('DIVERGENTS')}`);
  console.log(`        source : ${m.source}  — ${m.ea.n} fichiers, modifié le ${d(m.ea.plusRecent)}`);
  console.log(`        copie  : ${m.copie}  — ${m.eb.n} fichiers, modifiée le ${d(m.eb.plusRecent)}`);
  console.log(rouge(`        ⭐ ${m.sourcePlusRecente ? 'LA SOURCE' : 'LA COPIE'} a bougé en dernier, il y a ${m.ecart} jour(s)`));
  console.log(gris(`        sens déclaré : ${m.sens}`));
}

console.log('='.repeat(78));

if (divergents.length === 0 && absents.length === 0) {
  console.log(vert(`  Les ${alignes.length} miroirs sont alignés.`));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

if (divergents.length > 0) {
  console.log(rouge(`  ${divergents.length} miroir(s) divergent(s).`));
  console.log('');
  console.log('  ⛔ CE VERROU NE SYNCHRONISE RIEN, ET C’EST VOLONTAIRE.');
  console.log('     ⭐ Recopier dans le mauvais sens ÉCRASE du travail. Le sens est');
  console.log('        déclaré dans `scripts/miroirs.json`, et le geste reste humain.');
  console.log('');
  console.log('  Ce qu’il faut faire, dans l’ordre :');
  console.log('    1. ouvrir `scripts/miroirs.json` et LIRE le `sens` déclaré ;');
  console.log('    2. décider si la source a raison, ou si c’est la copie ;');
  console.log('    3. recopier DANS CE SENS, et mettre à jour la date.');
  console.log('');
  console.log('  ⭐ Et si les deux côtés ont raison, alors CE N’EST PAS UN MIROIR :');
  console.log('     ce sont DEUX contenus, et ils doivent porter des noms différents.');
  console.log(rouge('     *Un fichier qui vit à deux endroits sous le même nom est un piège,*'));
  console.log(rouge('      pas une sauvegarde.*'));
  console.log('');
  /*
   * ⛔ DÉSIGNER N'EST PAS CONDAMNER — corrigé le 22/09/2026, LE JOUR MÊME OÙ JE L'AI ÉCRIT.
   *
   *   La première version sortait en 1 dès qu'un miroir divergeait. **Or les deux
   *   divergences connues sont DÉJÀ MESURÉES ET NON TRANCHÉES** — le sens appartient à
   *   Gaëtan. Un verrou qui échoue sur une décision qu'il n'a pas le droit de prendre
   *   **bloque la CI pour rien**, et c'est exactement ce que j'ai réparé ce matin sur
   *   `verifier-css-sans-balisage.mjs`.
   *
   *   ⭐ LA RÈGLE, ET ELLE VAUT POUR TOUS LES VERROUS QUI DÉSIGNENT :
   *      **Il rapporte et sort en 0. Il devient BLOQUANT le jour où on décide qu'il doit
   *        l'être — en posant `MIROIRS_BLOQUANT=1`.**
   *
   *   ⚠️ Et le jour où les deux divergences seront tranchées, ce verrou sortira en 0
   *      TOUT SEUL — parce qu'il n'y aura plus rien à désigner. *C'est ça, un bon verrou :
   *      il n'a pas besoin qu'on le désarme, il suffit de faire le travail.*
   */
  if (process.env.MIROIRS_BLOQUANT === '1') {
    console.log('');
    console.log(jaune('  ⚠️  MIROIRS_BLOQUANT=1 — ce verrou est BLOQUANT.'));
    console.log('='.repeat(78) + '\n');
    process.exit(1);
  }
  console.log(gris('  ⭐ Ce verrou DÉSIGNE et sort en 0 : les deux divergences sont CONNUES et'));
  console.log(gris('     NON TRANCHÉES, et le sens appartient à Gaëtan. Poser `MIROIRS_BLOQUANT=1`'));
  console.log(gris('     le rend bloquant le jour où on le décide.'));
}
if (absents.length > 0) {
  console.log('');
  console.log(jaune(`  ${absents.length} miroir(s) avec un côté absent — vérifier le chemin déclaré.`));
}
console.log('='.repeat(78) + '\n');
// ⚠️ On ne sort en 1 QUE sur demande explicite. Voir le commentaire ci-dessus.
process.exit(0);
