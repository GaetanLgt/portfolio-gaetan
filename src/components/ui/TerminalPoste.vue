<template>
  <!--
    TERMINAL DU POSTE — démonstration scénarisée.
    Décision du directeur artistique (D5 §12), reprise de la doctrine : des
    réponses DÉTERMINISTES, jamais un agent d'IA exposé publiquement.

    Trois raisons, dans l'ordre de gravité :
      a. réputation — un modèle connecté peut dire n'importe quoi sur un site
         qui vend précisément la maîtrise et l'audit ;
      b. coût et dépendance — l'hébergement o2switch n'a pas de GPU, et faire
         dépendre le site public d'un poste domestique est inacceptable en
         continu (coupures, sécurité, disponibilité liée à une personne) ;
      c. honnêteté — un terminal qui « répond » suggère une IA. Si c'est du
         texte écrit à l'avance, il doit le dire.

    RÈGLE D'HONNÊTETÉ : la mention ci-dessous est FIXE et NON MASQUABLE.
    Ne jamais la retirer, ne jamais la rendre conditionnelle. Le jour où un
    agent local répondra vraiment, la mention changera de texte — jamais de
    nature : on ne laisse pas croire à une génération en direct quand c'est
    scripté.

    SANS JAVASCRIPT : la liste des commandes et la mention restent lisibles ;
    seule la zone de réponse est vide. Rien n'est caché derrière le script.
  -->
  <section class="terminal" aria-labelledby="terminal-titre">
    <div class="container">
      <div class="section-header">
        <span class="mono-tag" aria-hidden="true">/// LE POSTE</span>
        <h2 id="terminal-titre">Interrogez le poste</h2>
        <p class="section-header__desc">
          Tapez une commande, ou cliquez-en une. Les réponses sont écrites à
          l'avance — c'est une démonstration, et elle le dit.
        </p>
      </div>

      <div class="terminal__boite">
        <!-- Mention d'honnêteté : fixe, en tête, jamais conditionnelle. -->
        <p class="terminal__mention">
          <span class="terminal__pastille" aria-hidden="true"></span>
          Démonstration scénarisée — commandes et réponses prédéfinies,
          <strong>aucune IA générative n'est connectée à cette interface</strong>.
        </p>

        <!-- Zone de réponse : annoncée aux lecteurs d'écran quand elle change -->
        <div class="terminal__sortie" role="log" aria-live="polite" aria-atomic="true">
          <p v-for="(ligne, i) in lignes" :key="i" class="terminal__ligne" :class="`terminal__ligne--${ligne.type}`">
            <span v-if="ligne.type === 'commande'" class="terminal__invite" aria-hidden="true">poste:~$</span>
            <span>{{ ligne.texte }}</span>
          </p>
        </div>

        <!-- Saisie -->
        <form class="terminal__saisie" @submit.prevent="executer(saisie)">
          <label for="terminal-champ" class="terminal__etiquette">Commande à exécuter</label>
          <div class="terminal__champ-bloc">
            <span class="terminal__invite" aria-hidden="true">poste:~$</span>
            <input
              id="terminal-champ"
              v-model="saisie"
              type="text"
              class="terminal__champ"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="aide"
              aria-describedby="terminal-liste"
            >
            <button type="submit" class="terminal__bouton">Exécuter</button>
          </div>
        </form>

        <!-- Raccourcis : accessibles au clavier comme au clic -->
        <ul id="terminal-liste" class="terminal__commandes">
          <li v-for="c in COMMANDES" :key="c.nom">
            <button type="button" class="terminal__raccourci" @click="executer(c.nom)">
              <code>{{ c.nom }}</code>
              <span class="terminal__aide">{{ c.aide }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { jouerSignal } from '@/composables/audio-poste.js';

/**
 * Table des commandes. Tout le contenu est PUBLIC et déjà présent sur le site :
 * aucune donnée client, aucun chiffre inventé, aucune promesse nouvelle.
 * Si une information n'est pas connue, la réponse le dit (« non mesuré »).
 */
const COMMANDES = [
  { nom: 'aide', aide: 'liste des commandes disponibles' },
  { nom: 'offres', aide: 'prestations et prix publics' },
  { nom: 'lois', aide: 'les six Lois du studio et leur rôle' },
  { nom: 'vaisseau', aide: 'caractéristiques du poste de calcul' },
  { nom: 'donnees', aide: 'ce qui sort et ce qui ne sort pas' },
  { nom: 'contact', aide: 'comment engager' },
];

const REPONSES = {
  aide: [
    'Commandes disponibles :',
    ...COMMANDES.map((c) => `  ${c.nom.padEnd(10)} ${c.aide}`),
    '',
    'Tapez une commande puis Entrée. « effacer » vide la console.',
  ],
  offres: [
    'Prestations et prix publics, hors taxes :',
    '  Audit WordPress .................. 149 à 199 €    (48 heures)',
    '  Site web ......................... dès 2 500 €    (4 à 6 semaines)',
    '  Application métier ............... dès 8 000 €    (après cadrage)',
    '  IA et automatisation locale ...... dès 1 500 €    (après audit)',
    '  Mémoire documentaire (RAG) ....... 3 000 / 8 000 / 15 000 €',
    '',
    'Le détail du périmètre et des exclusions : /dossier',
  ],
  lois: [
    'Six Lois, six postes de production — 和誠美実動私 :',
    '  和  Harmonie       — l\'orchestration entre les agents',
    '  誠  Sincérité      — la vérification : sources citées, rien d\'inventé',
    '  美  Beauté         — l\'interface et la signature visuelle',
    '  実  Réalisation    — le code et les livrables',
    '  動  Mouvement      — l\'automatisation et les flux',
    '  私  Intériorité    — la mémoire documentaire',
    '',
    'Ce ne sont pas des mascottes : ce sont les six postes de travail du studio.',
  ],
  vaisseau: [
    'Poste de calcul — relevé le 10 septembre 2026 :',
    '  Processeur ......... Intel Core i7-11700KF, 8 cœurs / 16 threads',
    '  Mémoire ............ 64 Go à 3600 MT/s',
    '  Calcul graphique ... NVIDIA GeForce RTX 3080, 10 Go',
    '  Système ............ Windows 11 Professionnel',
    '',
    'Une seule machine. C\'est une limite assumée, décrite sur /dossier.',
  ],
  donnees: [
    'Flux de données, sans formule absolue :',
    '  Analyse d\'audience ... Matomo installé sur notre serveur, en France',
    '  Formulaire contact ... script sur notre serveur, en France',
    '  Transfert hors UE .... aucun pour le formulaire',
    '  Traitements IA ....... sur le poste du studio ou sur votre matériel',
    '',
    'Le détail, flux par flux : /confidentialite',
  ],
  contact: [
    'Pour engager :',
    '  1. vous écrivez ou appelez, en décrivant le besoin',
    '  2. premier échange de 30 minutes, gratuit et sans engagement',
    '  3. réponse sous 24 h : faisable, non faisable, fourchette de prix',
    '',
    '  gtn.langlet+lab@gmail.com   ·   06 86 47 46 10   ·   /contact',
  ],
};

const ACCUEIL = [
  'Bienvenue sur le poste. Tapez « aide » pour la liste des commandes.',
];

const lignes = ref(ACCUEIL.map((t) => ({ type: 'sortie', texte: t })));
const saisie = ref('');

const ecrire = (texte, type = 'sortie') => {
  lignes.value.push({ type, texte });
};

const executer = (brut) => {
  const commande = String(brut || '').trim().toLowerCase();
  if (!commande) return;

  ecrire(commande, 'commande');
  saisie.value = '';

  if (commande === 'effacer' || commande === 'clear') {
    lignes.value = [];
    return;
  }

  const reponse = REPONSES[commande];
  if (reponse) {
    reponse.forEach((l) => ecrire(l));
    // Signal d'interface : ne joue QUE si le visiteur a activé le son. La
    // fonction vérifie elle-même les deux conditions (son actif, mode sobre
    // inactif) — l'appelant n'a pas à s'en soucier.
    jouerSignal('console');
  } else {
    ecrire(`Commande inconnue : « ${commande} ». Tapez « aide ».`, 'erreur');
  }
  // On garde la console courte : au-delà, on retire les plus anciennes.
  if (lignes.value.length > 120) {
    lignes.value = lignes.value.slice(-120);
  }
};
</script>

<style scoped>
.terminal {
  padding: var(--space-xl) 0;
}

.terminal__boite {
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  background: var(--paper-alt);
}

/* Mention d'honnêteté : lisible, en tête, jamais masquée. */
.terminal__mention {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid var(--rule);
  background: var(--surface-deep);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  line-height: 1.6;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}

.terminal__mention strong {
  color: var(--alert);
  font-weight: 700;
}

.terminal__pastille {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--alert);
  flex: none;
  margin-top: 0.42em;
}

.terminal__sortie {
  min-height: 11rem;
  max-height: 22rem;
  overflow-y: auto;
  padding: 1.1rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.75;
  color: var(--ink);
  white-space: pre-wrap;
}

.terminal__ligne {
  margin: 0;
  display: flex;
  gap: 0.5rem;
}

.terminal__ligne--commande {
  color: var(--neon-cyan);
}

.terminal__ligne--erreur {
  color: var(--alert);
}

.terminal__invite {
  color: var(--accent);
  flex: none;
}

.terminal__saisie {
  border-top: 1px solid var(--rule);
}

.terminal__etiquette {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.terminal__champ-bloc {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.25rem;
  font-family: var(--font-mono);
}

.terminal__champ {
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0.6rem;
  background: var(--paper);
  border: 1px solid var(--rule);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.8rem;
}

.terminal__champ:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 1px;
}

.terminal__bouton {
  padding: 0.45rem 1rem;
  background: var(--action);
  color: var(--action-ink);
  border: none;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
}

.terminal__bouton:hover {
  background: var(--action-dark);
}

.terminal__commandes {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.9rem 1.25rem 1.1rem;
  border-top: 1px solid var(--rule);
}

.terminal__raccourci {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.35rem 0.7rem;
  background: transparent;
  border: 1px solid var(--rule);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  cursor: pointer;
  text-align: left;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}

.terminal__raccourci:hover,
.terminal__raccourci:focus-visible {
  border-color: var(--accent);
  color: var(--ink);
}

.terminal__raccourci code {
  color: var(--neon-cyan);
  font-weight: 700;
}

.terminal__aide {
  color: var(--ink-faint);
}

@media (max-width: 620px) {
  .terminal__aide {
    display: none;   /* sur petit écran, seule la commande compte */
  }
}
</style>
