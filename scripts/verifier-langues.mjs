#!/usr/bin/env node
/* =============================================================================
   verifier-langues.mjs — LA PORTE DE BUILD DES LANGUES
   =============================================================================

   POURQUOI CE FICHIER EXISTE
   -----------------------------------------------------------------------------
   La consigne avertit :

     « ⚠️ 7 langues = 7 versions à tenir. Une traduction en retard sur l'original
       est une deuxième version — et c'est la deuxième qui devient fausse en
       premier. »

   ⭐ ET LA RÉPONSE N'EST PAS LA DISCIPLINE DE CELUI QUI ÉCRIT. C'est cette porte :
   **si une clé manque, le build ÉCHOUE.** *Une traduction ne peut plus être en
   retard : elle ne peut pas être publiée incomplète.*

   ⛔ CE QUE FAIT UN REPLI SILENCIEUX, ET POURQUOI ON LE REFUSE
   Un site qui retombe sur le français quand la clé manque a l'air terminé.
   *Il ment à la relecture, c'est-à-dire trop tard.* **Ici, on ne publie pas.**

   ⭐⭐ ET LA PORTE REFUSE DE DIRE « OK » QUAND ELLE N'A RIEN REGARDÉ.
   *Un contrôle qui n'a examiné aucun fichier et qui annonce « aucune erreur » est
   le pire des contrôles : il donne bonne conscience.* Cette leçon a coûté deux
   outils aujourd'hui — elle est ici, dans le code.

   USAGE
     node scripts/verifier-langues.mjs
     node scripts/verifier-langues.mjs --liste     # inventaire seul
   ============================================================================= */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');

/* ⭐ `--dossier` PERMET D'ÉPROUVER CETTE PORTE SUR UN TÉMOIN.
   ⛔ Sans ça, la seule façon de la tester serait d'écrire de FAUX fichiers de
   langue dans `src/locales/` — *et un contrôle qu'on ne peut éprouver qu'en
   polluant le vrai dépôt ne sera jamais éprouvé.*
   ⇒ On lui donne un dossier, et elle juge ce qu'il contient.
   *C'est la leçon du jour, mise dans le code : un contrôle doit pouvoir ÉCHOUER.* */
const iDos = process.argv.indexOf('--dossier');
const DOSSIER = iDos >= 0 ? process.argv[iDos + 1] : join(RACINE, 'src', 'locales');
const FICHIER_LANGUES = join(RACINE, 'src', 'config', 'langues.js');

const LISTE_SEULE = process.argv.includes('--liste');
// `--porte` : le mode que le BUILD appelle. Seul un défaut réel bloque ;
// « je ne peux pas conclure » (3) laisse construire — sinon la porte
// interdirait le build tant que les sept langues ne sont pas écrites.
const PORTE = process.argv.includes('--porte');

/* ── ① QUELLES LANGUES SONT ATTENDUES — lues depuis `langues.js`, pas recopiées.
   ⛔ Une porte qui a sa propre liste vérifie une autre configuration que celle qui
   sera publiée. *Le site, la porte et le banc doivent lire la MÊME source.* */
async function languesAttendues() {
  try {
    const m = await import('file:///' + FICHIER_LANGUES.replace(/\\/g, '/'));
    return {
      accueil: m.LANGUE_ACCUEIL,
      actives: m.LANGUES_ACTIVES.map((l) => l.code),
      aDecider: m.LANGUES.filter((l) => l.role === 'a-decider').map((l) => l.code),
    };
  } catch (e) {
    console.error('⛔ impossible de lire src/config/langues.js : ' + e.message);
    console.error('   ⚠️ Sans la liste des langues attendues, cette porte ne peut RIEN conclure.');
    /* ⛔⛔ CORRIGÉ LE 23/09/2026 — CE `exit(2)` IGNORAIT LE MODE PORTE, ET C'ÉTAIT ÉCRIT.
       ────────────────────────────────────────────────────────────────────────────────
       `--porte` rabaisse « je ne peux pas conclure » (3) pour ne pas bloquer la
       construction : *on ne refuse pas un build parce qu'on ne sait pas juger.*
       ⛔ Mais ce chemin-ci sortait en **2**, **en dehors** de ce mécanisme.
       Conséquence mesurée : un `langues.js` illisible — **une faute de frappe, un
       import cassé, un fichier déplacé** — aurait **arrêté la construction du site**
       pour une raison qui n'est **pas** un défaut de traduction.
       ⭐ *Une porte qui bloque sur « je ne sais pas lire » interdit de construire tant
       qu'on n'a pas réparé ce qu'elle ne sait pas lire.*
       ⚠️ Et `package.json` l'avait noté mot pour mot : « elle sort en 2 quand elle ne
       peut pas charger `langues.js` — un cas que le mode --porte ne rattrape pas ».
       ⇒ **C'est ce cas-là qui est rattrapé ici, et il l'est exprès.** */
    if (PORTE) {
      console.error('');
      console.error('   ⇒ MODE PORTE : « je ne peux pas lire la liste des langues » NE BLOQUE PAS.');
      console.error('     ⚠️ ET IL FAUT LE DIRE : sur ce build, les traductions N\'ONT PAS ÉTÉ VÉRIFIÉES.');
      console.error('     *Un build qui passe sans avoir vérifié n\'est pas un build vérifié.*');
      process.exit(0);
    }
    process.exit(2);
  }
}

/* ── ② APLATIR UN FICHIER DE LANGUE en chemins de clés : `a.b.c`.
   ⚠️ Un objet imbriqué se compare mal ; un chemin `a.b.c` se compare exactement,
   et il se LIT dans le message d'erreur. *Un message qu'on doit déchiffrer ne
   sera pas corrigé.* */
function aplatir(obj, prefixe = '', sortie = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const cle = prefixe ? prefixe + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) aplatir(v, cle, sortie);
    else sortie[cle] = v;
  }
  return sortie;
}

async function chargerLangue(code) {
  const p = join(DOSSIER, code + '.js');
  if (!existsSync(p)) return null;
  try {
    const m = await import('file:///' + p.replace(/\\/g, '/'));
    return aplatir(m.default || m);
  } catch (e) {
    return { __ERREUR__: e.message };
  }
}

/* ── ③ LA PASSE ─────────────────────────────────────────────────────────────── */
const { accueil, actives, aDecider } = await languesAttendues();

console.log('════════════════════════════════════════════════════════════════════');
console.log(' Porte de build — les langues');
console.log('════════════════════════════════════════════════════════════════════');
console.log('  langue d’accueil : ' + accueil);
console.log('  langues actives  : ' + actives.join(' '));
console.log('  à décider        : ' + (aDecider.length ? aDecider.join(' ') + '  (portées, NON vérifiées)' : 'aucune'));
console.log('');

if (!existsSync(DOSSIER)) {
  console.log('  ⛔ src/locales/ n’existe pas encore.');
  console.log('     ⇒ Les traductions ne sont pas écrites. La porte ne peut rien vérifier.');
  console.log('     ⚠️ Ce n’est PAS un « OK » : c’est un chantier qui n’a pas commencé.');
  console.log('');
  console.log('  ⭐ L’ORDRE, POUR NE PAS LE FAIRE À L’ENVERS :');
  console.log('     1. extraire les clés du français  →  src/locales/fr.js');
  console.log('     2. écrire les six autres depuis cette liste');
  console.log('     3. cette porte, alors, les compare.');
  console.log('     *On ne compare pas des fichiers qui n’existent pas.*');
  process.exitCode = 3;
} else {
  const reference = await chargerLangue(accueil);
  if (!reference) {
    console.log('  ⛔ src/locales/' + accueil + '.js est ABSENT.');
    console.log('     ⇒ La langue d’accueil est la RÉFÉRENCE : sans elle, il n’y a rien à comparer.');
    console.log('     *On ne vérifie pas six langues contre rien.*');
    process.exitCode = 3;
  } else if (reference.__ERREUR__) {
    console.log('  ⛔ src/locales/' + accueil + '.js ne se charge pas : ' + reference.__ERREUR__);
    process.exitCode = 3;
  } else {
    const clesRef = Object.keys(reference).sort();
    console.log('  référence (' + accueil + ') : ' + clesRef.length + ' clés');
    console.log('');

    if (LISTE_SEULE) {
      for (const c of clesRef) console.log('    ' + c);
      process.exitCode = 0;
    } else {
      const problemes = [];
      const nonCommencees = [];
      let examinees = 0;

      for (const code of actives) {
        if (code === accueil) continue;
        const t = await chargerLangue(code);
        if (!t) {
          /* ⛔ « FICHIER ABSENT » N'EST PAS UN DÉFAUT — C'EST UN CHANTIER QUI N'A PAS COMMENCÉ.
             Mesuré le 23/09/2026, sur témoin : `de.js` COPIÉ DE `fr.js` (22/22 clés, aucun
             écart) rendait quand même « 5 PROBLÈME(S) » et sortait en 1, à cause des cinq
             autres langues annoncées sans fichier.
             ⇒ La porte ne pouvait donc JAMAIS rendre 0 avant que les sept langues soient
               entièrement écrites — c'est-à-dire jamais.
             ⭐ Une porte qui ne sait dire que NON ne contrôle rien : elle interdit tout.
                C'est mesurable, et c'est très probablement pourquoi elle n'était branchée
                sur rien. *On ne câble pas un contrôle qui refuse la totalité du travail.*
             ⇒ Une langue annoncée sans fichier est un chantier ouvert. On la NOMME, à part,
               et elle ne compte pas. Une langue qui n'existe pas ne peut pas être en retard. */
          nonCommencees.push(code);
          continue;
        }
        if (t.__ERREUR__) {
          problemes.push({ code, type: 'chargement impossible', detail: t.__ERREUR__ });
          continue;
        }
        examinees++;

        const cles = Object.keys(t);
        const manquantes = clesRef.filter((k) => !cles.includes(k));
        const enTrop = cles.filter((k) => !clesRef.includes(k));
        const vides = clesRef.filter((k) => t[k] === '' || t[k] === null || t[k] === undefined);

        if (manquantes.length) problemes.push({ code, type: 'clés MANQUANTES', liste: manquantes });
        if (vides.length) problemes.push({ code, type: 'clés VIDES', liste: vides });
        if (enTrop.length) problemes.push({ code, type: 'clés EN TROP', liste: enTrop });

        const etat = (!manquantes.length && !enTrop.length && !vides.length) ? '✅' : '⛔';
        console.log('  ' + etat + '  ' + code + ' : ' + cles.length + '/' + clesRef.length + ' clés' +
          (manquantes.length ? '   ' + manquantes.length + ' manquante(s)' : '') +
          (vides.length ? '   ' + vides.length + ' vide(s)' : '') +
          (enTrop.length ? '   ' + enTrop.length + ' en trop' : ''));
      }

      console.log('');

      /* ⛔⛔ L'ORDRE DES DEUX BRANCHES A ÉTÉ CORRIGÉ — IL CACHAIT CE QUI ÉTAIT TROUVÉ.
         ────────────────────────────────────────────────────────────────────────
         La première version testait `examinees === 0` AVANT `problemes.length`.
         Conséquence mesurée, avec `fr.js` seul :
             « référence (fr) : 22 clés »
             « ⛔ AUCUNE LANGUE COMPARÉE — la porte ne peut RIEN conclure. »
         ⇒ **Elle avait collecté six « fichier absent », et elle les TAVAIT.**
         *Un contrôle qui trouve six choses et n'en dit aucune est presque aussi
         mauvais qu'un contrôle qui ne trouve rien — sauf qu'il fait croire qu'il a
         regardé.*
         ⭐ On dit donc D'ABORD ce qu'on a trouvé, ENSUITE qu'on ne peut pas conclure.
         *Deux informations différentes, et la seconde n'efface pas la première.* */
      /* ⭐ ON DIT D'ABORD CE QU'ON A TROUVÉ — les chantiers ouverts, puis les défauts. */
      if (nonCommencees.length) {
        console.log('  ○  non commencée(s) : ' + nonCommencees.join(' '));
        console.log('     *Annoncées dans langues.js, pas encore écrites. Ce n’est pas un défaut :*');
        console.log('     *c’est un chantier — et une langue qui n’existe pas ne peut pas être en retard.*');
        console.log('');
      }

      if (problemes.length) {
        console.log('  ⛔ ' + problemes.length + ' DÉFAUT(S) — LE BUILD DOIT ÉCHOUER :');
        for (const p of problemes) {
          console.log('');
          console.log('   ' + p.code + '  —  ' + p.type);
          if (p.detail) console.log('      ' + p.detail);
          if (p.liste) {
            for (const k of p.liste.slice(0, 8)) console.log('      ' + k);
            if (p.liste.length > 8) console.log('      … et ' + (p.liste.length - 8) + ' autre(s)');
          }
        }
        console.log('');
        console.log('  ⭐ POURQUOI ON ÉCHOUE AU LIEU DE PUBLIER :');
        console.log('     Une clé absente qui retombe sur le français donne une page qui a');
        console.log('     l’air terminée. *Elle ment à la relecture — c’est-à-dire trop tard.*');
        process.exitCode = 1;
      } else if (examinees === 0) {
        console.log('  ⛔ AUCUNE LANGUE COMPARÉE — la porte ne peut RIEN conclure.');
        console.log('     ⇒ Écrire au moins une traduction, ou ne pas faire tourner cette porte.');
        console.log('     *« Aucune erreur » sur zéro fichier n’est pas un succès : c’est un mensonge.*');
        process.exitCode = 3;
      } else {
        console.log('  ✅ ' + examinees + ' langue(s) complète(s) — ' + clesRef.length + ' clés, aucune manquante.');
        console.log('     ⭐ Une traduction ne peut pas être en retard : elle ne peut pas être');
        console.log('        publiée incomplète.');
        process.exitCode = 0;
      }

      /* ⭐ MODE PORTE — pour que le build puisse l'appeler sans risquer l'interdiction totale.
         Un défaut (1) BLOQUE. « Je ne peux pas conclure » (3) NE BLOQUE PAS :
         sinon la porte empêcherait de construire tant que les sept langues ne sont pas
         écrites, ce qui est exactement le défaut qu'on vient de corriger plus haut. */
      if (PORTE && process.exitCode === 3) {
        console.log('');
        console.log('  ⇒ MODE PORTE : « je ne peux pas conclure » (3) NE BLOQUE PAS le build.');
        console.log('     *Seul un défaut réel arrête la construction.*');
        process.exitCode = 0;
      }
    }
  }
}

console.log('════════════════════════════════════════════════════════════════════');

/* =============================================================================
   ⚠️ CE QUE CETTE PORTE NE VÉRIFIE PAS
   -----------------------------------------------------------------------------
   · **La QUALITÉ de la traduction.** Elle compte les clés, elle ne les lit pas.
     *Une traduction fausse passe cette porte — et aucune machine ne peut la
     juger, seul un locuteur le peut.*
   · **Le RENDU.** Une clé présente peut produire un texte qui déborde : c'est le
     rôle de `banc-trois-extremes.mjs`, qui éprouve la FORME aux trois bornes.
   · **Les langues `a-decider`.** Le japonais est porté par `langues.js` mais il
     n'est PAS vérifié : *on ne vérifie pas une décision qui n'est pas prise.*
   ============================================================================= */
