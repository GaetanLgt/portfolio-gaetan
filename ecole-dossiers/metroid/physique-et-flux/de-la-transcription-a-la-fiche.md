---
tags: [metroid, flux, veille, methode]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# De la transcription à la fiche

*Deux gestes de sélection s'enchaînent : la machine décide ce qu'elle entend, la fiche décide ce qui compte.*

## L'idée

**Premier geste : la source devient un texte de machine.** Ce n'est pas la vidéo qui entre dans le studio, c'est une **transcription**. Le vault documente deux cas opposés — [[metroid-goyo-2026-09-13]] signale qu'**aucun sous-titre n'était disponible**, ce qui a imposé une **transcription locale** : 531 segments, 37 625 caractères, modèle `large-v3`, pour **271,8 s de calcul** sur 2 012 s d'audio, soit **×7,4 le temps réel** ; [[metroid-pourquoi-si-inconnu]] part d'un texte de **16 921 caractères** lu en entier.

**Second geste : le texte devient une fiche.** Le dossier `veille-video/` rend le partage visible dans ses règles : `fiches/` contient « une fiche par source — le document qu'on relit pour décider » ; `transcriptions/` contient la « **preuve brute, jamais relue en entier** » (`veille-video/README.md`). On garde tout, on ne relit qu'une partie — et ce que la fiche ajoute n'est pas un résumé de plus, c'est un **statut** : [[metroid-goyo-2026-09-13]] est écrite comme une **lettre d'amour assumée, donc une opinion**, dont la § 0 dit qu'elle ne se cite pas comme une mesure ; [[metroid-pourquoi-si-inconnu]] est une **analyse d'audience et de ventes** qui **ne nomme pas ses sources** ([[11-sources-et-verification]] § 3).

## Ce qui est établi

- Fiche du 13/09/2026 : aucune piste de sous-titre (vérifié avant tout téléchargement par `forge-ia/lire-transcription-youtube.mjs`), donc transcription locale — **531 segments**, **37 625 caractères**, `large-v3`, **271,8 s** pour 2 012 s d'audio, **×7,4** ([[metroid-goyo-2026-09-13]]).
- Convention de rangement : une fiche par source dans `fiches/`, une synthèse par lot dans `syntheses/`, la preuve brute dans `transcriptions/`, l'avancement d'un lot dans `journaux/` ; formats `.vtt`, `.whisper.txt`, `-meta.txt`, l'audio étant ignoré par git (`veille-video/README.md`, 11/09/2026).
- Nature des trois sources Metroid : un **avis de joueur** (Goyo), une **analyse d'audience et de ventes**, un **documentaire d'histoire du jeu vidéo** — **seule la troisième nomme ses sources** ([[11-sources-et-verification]] § 3).
- [[10-histoire-de-la-licence]] interdit de citer en livrable les chiffres de la vidéo Edward, **parce qu'elle est sponsorisée et transcrite automatiquement**.

## Ce qui n'est pas établi

- **Aucun taux d'erreur de transcription** n'est mesuré (ni mots justes, ni segments perdus) et **aucun taux de compression** entre transcription et fiche : rien ne mesure ce qui est perdu, ni en caractères, ni en faits.
- Le **coût** du flux n'est chiffré que pour un cas, celui du 13/09 : je n'ai aucune moyenne, et je **ne sais pas** combien de sources du corpus ont été transcrites localement faute de sous-titres.
- Aucun **contrôle systématique** de la fiche contre sa transcription n'est documenté, et je **ne sais pas** qui relit une fiche avant qu'elle serve.

## Sources

- `fiches/metroid-goyo-2026-09-13.md` — [[metroid-goyo-2026-09-13]] (en-tête, § 0 et § 2).
- `fiches/metroid-pourquoi-si-inconnu.md` — [[metroid-pourquoi-si-inconnu]].
- `veille-video/README.md` et `11-sources-et-verification.md` § 3 — [[11-sources-et-verification]].

## Renvois

- [[le-nom-mal-entendu]] — ce que produit la transcription, et qu'on ne corrige pas en silence.
- [[ce-qui-est-verifie-ne-se-recopie-pas]] — le maillon de contrôle, qui n'est pas dans ce flux.
- [[11-sources-et-verification]] — la note de méthode du vault.
