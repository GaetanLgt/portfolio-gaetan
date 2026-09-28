#!/usr/bin/env node
/**
 * VERIFIER CE QUI SE PUBLIE — la partie MECANISABLE de la regle.
 *
 * ⛔ LE POINT DE DEPART, ET IL EST HONNETE : la regle
 * `vault-agence/REGLE-ce-qui-se-publie-2026-09-28.md` pose QUATRE questions.
 *
 *   ① EST-CE UTILE A QUELQU'UN D'EXTERIEUR ?        -> ⛔ HUMAIN
 *   ② CONTIENT-ELLE CE QUI N'EST PAS A NOUS DIRE ?  -> ✅ en partie mecanisable
 *   ③ EST-CE VERIFIABLE PAR CELUI QUI LIT ?         -> ⛔ HUMAIN
 *   ④ EST-CE QUE CA ENGAGE LE STUDIO ?              -> ⛔ HUMAIN
 *
 * ⇒ ⭐ CE SCRIPT NE VERIFIE QUE LA ②, ET SEULEMENT SA PARTIE FACTUELLE.
 *   ⛔ **Il ne dit pas qu'un document PEUT etre publie. Il dit qu'il ne contient
 *     pas ce qui est interdit d'y mettre.** *La difference est tout : un
 *     document propre peut rester inutile ou prématuré.*
 *
 * ⛔ CE QU'IL REFUSE, ET CHAQUE REGLE A SA RAISON :
 *   · nom de machine ou chemin absolu d'une machine du studio ;
 *   · adresse IP privee ;
 *   · secret, jeton, mot de passe en clair ;
 *   · nom de personne reelle (hors personnalites publiques citees dans un
 *     contexte documente) — ⚠️ **detection imparfaite, voir plus bas.**
 *
 * ⚠️ CE QU'IL NE SAIT PAS VOIR, ET IL LE DIT A CHAQUE FOIS :
 *   · il ne juge PAS l'utilite ;
 *   · il ne juge PAS si le document engage le studio ;
 *   · il ne voit PAS les donnees sensibles EN IMAGE (une capture d'ecran) ;
 *   · sa regle sur les noms propres produit des FAUX POSITIFS — *un filtre
 *     qu'on ne peut pas satisfaire finit par etre desactive.*
 *
 * USAGE :
 *   node forge-ia/verifier-publication.mjs <fichier.md> [...]
 *   node forge-ia/verifier-publication.mjs --auto     # s'eprouve lui-meme
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/* ------------------------------------------------------------------ *
 * ① LES MOTIFS — et chacun a sa raison
 * ------------------------------------------------------------------ */

const MOTIFS = [
  {
    id: 'NOM-MACHINE',
    gravite: 'BLOQUANT',
    motif: /\bEVA-01\b|\bCalcifer\b|neosp/gi,
    pourquoi: 'un nom d\'hote est une prise — et il n\'a aucune utilite pour un lecteur',
  },
  {
    id: 'CHEMIN-ABSOLU',
    gravite: 'BLOQUANT',
    motif: /C:\\IA\\|C:\/IA\/|\/home\/neonator|\/Users\/neosp/gi,
    pourquoi: 'un chemin absolu revele l\'arborescence d\'une machine',
  },
  {
    id: 'IP-PRIVEE',
    gravite: 'BLOQUANT',
    motif: /\b(?:192\.168|10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/g,
    pourquoi: 'une adresse privee situe un reseau',
  },
  {
    id: 'SECRET',
    gravite: 'BLOQUANT',
    // ⚠️ on ne recopie PAS les motifs du hook pre-commit (secrets reels) :
    //    un fichier de verification ne doit pas contenir les cles qu'il traque.
    motif: /(?:api[_-]?key|secret|password|passwd|mot de passe)\s*[:=]\s*["']?[A-Za-z0-9_\-]{16,}/gi,
    pourquoi: 'un secret publie est un secret compromis',
  },
  {
    id: 'BEARER',
    gravite: 'BLOQUANT',
    motif: /Bearer\s+[A-Za-z0-9._\-]{20,}/g,
    pourquoi: 'un jeton d\'acces publie ne se reprend pas',
  },
  {
    id: 'SIREN-SIRET',
    gravite: 'ALERTE',
    motif: /\b(?:SIREN|SIRET)\s*[:=]?\s*\d{9,14}\b/gi,
    pourquoi: 'un identifiant d\'entreprise identifie son porteur — a verifier',
  },
  {
    id: 'NOM-PERSONNE',
    gravite: 'ALERTE',
    // ⚠️ DETECTION IMPARFAITE, ET ELLE EST DECLAREE.
    //    On cherche « M. Dupont », « Mme Martin » — pas un nom seul, qui
    //    produirait un faux positif a chaque mot capitalise.
    motif: /\b(?:M\.|Mme|Mlle|Monsieur|Madame)\s+[A-ZÉÈÀÂÎÔÛ][a-zéèêàâîôûç]{2,}/g,
    pourquoi: '⚠️ FAUX POSITIFS FREQUENTS — a verifier a la main, pas a bloquer',
  },
];

/* ------------------------------------------------------------------ *
 * ② LE CONTROLE
 * ------------------------------------------------------------------ */

export function verifier(chemin) {
  const texte = fs.readFileSync(chemin, 'utf8');
  const lignes = texte.split(/\r?\n/);
  const trouves = [];

  for (const regle of MOTIFS) {
    for (let i = 0; i < lignes.length; i++) {
      const l = lignes[i];
      // ⛔ on ignore les lignes de commentaire qui DECRIVENT un motif
      //    (sinon le fichier de regle se bloque lui-meme)
      if (/^\s*[*/#]/.test(l) && /motif|pourquoi|regle|detect/i.test(l)) continue;
      regle.motif.lastIndex = 0;
      const m = l.match(regle.motif);
      if (m) {
        trouves.push({
          id: regle.id,
          gravite: regle.gravite,
          ligne: i + 1,
          extrait: m[0].slice(0, 40),
          pourquoi: regle.pourquoi,
        });
      }
    }
  }
  return trouves;
}

/* ------------------------------------------------------------------ *
 * ③ L'EPREUVE — le script doit MORDRE, et ne pas mordre a cote
 * ------------------------------------------------------------------ */

const CAS_EPREUVE = [
  { nom: 'nom de machine', texte: 'La machine EVA-01 tourne sous Windows.', fautif: true },
  { nom: 'chemin absolu', texte: 'Le fichier vit dans C:\\IA\\gl-digital-lab\\vault.', fautif: true },
  { nom: 'IP privee', texte: 'Le NAS repond sur 192.168.1.50.', fautif: true },
  { nom: 'secret en clair', texte: 'API_KEY = "abcdef1234567890ghij"', fautif: true },
  { nom: 'Bearer', texte: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6', fautif: true },
  { nom: 'nom de personne', texte: 'M. Dupont a signe le contrat.', fautif: true },
  {
    nom: 'TEXTE PROPRE — doit passer',
    texte: 'Le studio fait tourner douze modeles en local, sans appel externe.\nLes sources sont datees du 28/09/2026.',
    fautif: false,
  },
  {
    nom: 'TEXTE PROPRE avec chiffres — doit passer',
    texte: 'Le disque offre 5 011 Go libres. Le modele pese 42,6 Go.\nMesure du 28/09/2026.',
    fautif: false,
  },
  {
    nom: 'TEXTE PROPRE citant une personnalite publique — doit passer',
    texte: 'Sam Altman a reconnu que OpenAI n avait pas ete assez rapide.',
    fautif: false,
  },
];

const argv = process.argv.slice(2);

if (argv.includes('--auto')) {
  console.log('='.repeat(78));
  console.log('EPREUVE DU VERIFICATEUR DE PUBLICATION');
  console.log('='.repeat(78));
  console.log('');

  let ok = 0;
  let ko = 0;
  let fauxPositifs = 0;

  // ⛔ DOSSIER TEMPORAIRE PORTABLE — CORRIGÉ LE 28/09/2026 APRÈS QUE LE CROCHET
  //    `pre-commit` AIT REFUSÉ CE FICHIER. Il écrivait dans
  //    `C:\IA\gl-digital-lab\_travail\` EN DUR : **le fichier ne marchait que sur
  //    une seule machine**, et le crochet l'a signalé (critère 8, « chemin absolu »).
  //    ⭐ *Le garde-fou a mordu sur le garde-fou — et il avait raison.*
  //    ⇒ On écrit dans le dossier temporaire du système, via `os.tmpdir()`.
  const dossier = os.tmpdir();
  const tmp = path.join(dossier, 'epreuve-pub.md');

  for (const c of CAS_EPREUVE) {
    fs.writeFileSync(tmp, c.texte, 'utf8');
    const t = verifier(tmp);
    const bloquants = t.filter((x) => x.gravite === 'BLOQUANT').length;
    const alertes = t.filter((x) => x.gravite === 'ALERTE').length;

    if (c.fautif) {
      if (bloquants + alertes > 0) {
        ok++;
        console.log(`  ✅ ATTRAPE — ${c.nom} (${bloquants} bloquant, ${alertes} alerte)`);
      } else {
        ko++;
        console.log(`  ⛔ MANQUE  — ${c.nom}`);
      }
    } else {
      if (bloquants > 0) {
        fauxPositifs++;
        console.log(`  ⛔ FAUX POSITIF — ${c.nom}`);
      } else {
        ok++;
        console.log(`  ✅ LAISSE PASSER — ${c.nom}${alertes ? ` (${alertes} alerte, non bloquante)` : ''}`);
      }
    }
  }
  fs.rmSync(tmp, { force: true });

  const fautifs = CAS_EPREUVE.filter((c) => c.fautif).length;
  console.log('');
  console.log('='.repeat(78));
  console.log(`  Fautes attrapees : ${ok - (CAS_EPREUVE.length - fautifs) + fauxPositifs}/${fautifs}`);
  console.log(`  Faux positifs    : ${fauxPositifs}`);
  console.log('');
  if (fauxPositifs === 0 && ko === 0) {
    console.log('  ✅ LE VERIFICATEUR MORD, ET NE MORD PAS A COTE.');
  } else {
    console.log('  ⛔ A REGLER AVANT DE BRANCHER.');
  }
  console.log('');
  console.log('⛔ ET IL NE VERIFIE QUE LA QUESTION 2 DE LA REGLE.');
  console.log('   Les questions 1, 3 et 4 sont HUMAINES. Ce script ne les remplace pas.');
  process.exit(fauxPositifs === 0 && ko === 0 ? 0 : 1);
}

if (argv.length === 0) {
  console.log('VERIFIER CE QUI SE PUBLIE — la partie mecanisable de la regle');
  console.log('');
  console.log('  node forge-ia/verifier-publication.mjs <fichier.md> [...]');
  console.log('  node forge-ia/verifier-publication.mjs --auto');
  console.log('');
  console.log('⛔ Ce script ne verifie QUE la question 2 de la regle :');
  console.log('   « contient-elle ce qui n est pas a nous de dire ? »');
  console.log('   Les 3 autres sont humaines — il ne les remplace pas.');
  process.exit(0);
}

let bloquants = 0;
let alertes = 0;

for (const f of argv) {
  if (!fs.existsSync(f)) {
    console.log(`  ⛔ ${f} — introuvable`);
    continue;
  }
  const t = verifier(f);
  const b = t.filter((x) => x.gravite === 'BLOQUANT');
  const a = t.filter((x) => x.gravite === 'ALERTE');
  bloquants += b.length;
  alertes += a.length;

  if (b.length === 0 && a.length === 0) {
    console.log(`  ✅ ${f} — rien de ce qui est interdit`);
  } else {
    for (const x of b) console.log(`  ⛔ ${f}:${x.ligne} [${x.id}] « ${x.extrait} » — ${x.pourquoi}`);
    for (const x of a) console.log(`  ⚠️ ${f}:${x.ligne} [${x.id}] « ${x.extrait} » — ${x.pourquoi}`);
  }
}

console.log('');
console.log(`  ${bloquants} bloquant(s), ${alertes} alerte(s)`);
console.log('⛔ « Rien de ce qui est interdit » ne veut PAS dire « publiable » :');
console.log('   l utilite, la verifiabilite et l engagement du studio restent a juger.');
process.exit(bloquants > 0 ? 1 : 0);
