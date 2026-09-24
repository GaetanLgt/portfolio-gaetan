<script setup>
/* ═══════════════════════════════════════════════════════════════════════════════
   EVA01 — l'assistant IA local, avec mémoire et contrôle humain.

   ⭐ CE QUE CETTE PAGE EST, ET CE QU'ELLE N'EST PAS.

   Ce n'est PAS une page de produit : EVA01 n'est pas à vendre. C'est une ÉTUDE DE
   CAS — la démonstration qu'une IA locale gouvernée existe, tourne, et qu'on peut
   montrer où sont ses limites.

   ⛔ CE QU'ELLE REFUSE D'ÉCRIRE, ET C'EST LE PLUS IMPORTANT :
     · aucun chiffre de performance inventé — quand une mesure n'existe pas, la
       page écrit « mesure en cours » et publie le protocole ;
     · aucun mot d'ordre (« AGI », « autonome », « fait tout ») : ils attirent la
       curiosité et détruisent la crédibilité technique ;
     · aucun ROI. *Un gain annoncé sans base est une invention.*
   ⭐ Le studio a une règle pour ça : *un chiffre sans sujet est un chiffre faux.*
     Ici, chaque nombre porte sa source, sa date et son régime.
   ═══════════════════════════════════════════════════════════════════════════════ */

const CONTRAINTES = [
  { t: 'Exécution locale', d: 'Le poste fait tourner les modèles. Aucun appel sortant n’est requis pour une requête traitée localement.' },
  { t: 'NVIDIA RTX 3080 — 10 Go', d: 'La mémoire vidéo est la contrainte dure : elle décide de la taille du modèle et de la longueur de contexte tenables.' },
  { t: 'Modèles ~7 Md de paramètres', d: 'Servis par Ollama. Le choix se fait sur ce que le poste tient, pas sur un classement de bancs d’essai.' },
  { t: 'Stockage local', d: 'Mémoires, connaissances et données utilisateur restent sur le disque du poste.' },
  { t: 'Identité ≠ mémoire ≠ connaissances', d: 'Trois espaces séparés. Un assistant ne doit pas confondre ce qu’il est censé faire avec ce qu’il a appris dans une conversation.' },
  { t: 'Autonomie graduée N0 → N4', d: 'Chaque agent porte un rôle, un périmètre et un niveau d’autorisation explicite.' },
  { t: 'Connecteurs encadrés', d: 'MCP et API locales : l’assistant atteint des outils, pas un accès illimité au système.' },
]

const BRIQUES = [
  { b: 'Modèle local', v: 'Les requêtes sensibles peuvent rester dans l’environnement contrôlé.' },
  { b: 'Mémoire persistante', v: 'L’assistant retrouve le contexte sans obliger à tout répéter.' },
  { b: 'Base documentaire (RAG)', v: 'Une réponse peut s’appuyer sur une base définie, nommée, et citable.' },
  { b: 'Orchestrateur', v: 'Les tâches sont réparties explicitement, pas laissées au hasard d’un prompt.' },
  { b: 'Connecteurs', v: 'L’assistant atteint des outils précis — sans devenir un accès illimité.' },
  { b: 'Niveaux N0 à N4', v: 'L’utilisateur choisit ce qui est observé, suggéré, préparé, ou exécuté.' },
  { b: 'Journal d’événements', v: 'Une action peut être inspectée, expliquée et corrigée après coup.' },
]

const DECISIONS = [
  {
    t: 'IA locale d’abord',
    c: 'Les données traitées sont personnelles et les projets sensibles.',
    d: 'Exécuter les modèles localement quand le cas d’usage le permet.',
    comp: 'Qualité variable selon le modèle, puissance matérielle finie, stack à entretenir.',
    b: 'Maîtrise accrue des données, et fonctionnement possible sans dépendance permanente au cloud.',
  },
  {
    t: 'Mémoire séparée de l’identité',
    c: 'Un assistant qui mêle sa consigne et son vécu dérive sans qu’on le voie.',
    d: 'Trois espaces distincts : identité, mémoire, connaissances.',
    comp: 'Architecture plus exigeante à écrire et à maintenir.',
    b: 'Comportement plus auditable, correction plus simple, dérives visibles.',
  },
  {
    t: 'Autonomie graduée N0 → N4',
    c: 'Tout automatiser est risqué ; ne rien automatiser retire l’intérêt du système.',
    d: 'Des niveaux d’autorisation explicites, indexés sur l’impact de l’action.',
    comp: 'Davantage de règles, et une validation à chaque franchissement.',
    b: 'L’utilisateur décide de ce qui est observé, préparé, proposé ou exécuté.',
  },
  {
    t: 'Aucune autonomie légitime par défaut',
    c: 'Une action irréversible ne se rattrape pas — et le système ne peut pas juger seul de son impact.',
    d: 'Toute action à effet humain, financier, légal, réputationnel ou irréversible exige une autorisation identifiable.',
    comp: 'Certaines tâches restent plus lentes qu’une automatisation aveugle.',
    b: 'La responsabilité reste attribuable à une personne nommée, à un moment donné.',
  },
]

const SCENARIOS = [
  {
    t: 'A — Retrouver une décision',
    q: '« Qu’avons-nous déjà décidé sur ce projet, et qu’est-ce qui reste ouvert ? »',
    r: 'L’assistant interroge une base de notes définie, restitue des éléments sourcés, sépare les faits des suppositions, et signale ce qu’il n’a pas trouvé.',
    n: 'N0 — observation pure. Rien n’est modifié.',
  },
  {
    t: 'B — Préparer sans publier',
    q: '« Prépare-moi une synthèse de ces échanges. »',
    r: 'L’assistant produit une proposition. Il ne l’envoie pas, ne la publie pas, ne la transmet à personne. L’humain relit, corrige, décide.',
    n: 'N2 — préparation. Le dernier mot reste à l’utilisateur.',
  },
  {
    t: 'C — Action à autorisation forte',
    q: '« Écris ces données dans le système. »',
    r: 'L’assistant affiche le périmètre, le contenu exact et la conséquence prévue. Il attend une validation explicite avant d’exécuter.',
    n: 'N4 — action contrôlée, avec périmètre affiché et trace.',
  },
]

const LIMITES = [
  'Elle ne garantit pas qu’une réponse soit exacte.',
  'Elle ne décide pas à la place d’une personne.',
  'Elle n’accède pas à tous les outils sans autorisation.',
  'Elle ne remplace pas une politique de sécurité.',
  'Elle ne rend pas une donnée sensible inoffensive par magie.',
  'Elle dépend de son matériel, de ses modèles, de ses règles et de la qualité de ses sources.',
  'Elle ne doit envoyer, effacer, acheter, signer ni publier sans politique de validation définie.',
]

/* ⛔ AUCUN CHIFFRE ICI N'EST ESTIMÉ. Les mesures dont le protocole est écrit mais
   dont le relevé n'est pas encore fait portent `mesure en cours`. *Une case vide
   assumée vaut mieux qu'un chiffre plausible.* */
const MESURES = [
  { m: 'Sources documentaires reliées', v: 'mesure en cours', n: 'protocole publié — le poste compte les sources indexées par espace' },
  { m: 'Part de réponses portant une source', v: 'mesure en cours', n: 'protocole : jeu de tests fixe, 30 questions, réponse comptée si elle cite une source interne' },
  { m: 'Temps de réponse par modèle', v: 'mesure en cours', n: 'protocole : trois tâches réelles répétables, cinq passages, médiane retenue' },
  { m: 'Mémoire vidéo occupée', v: 'mesure en cours', n: 'protocole : relevé à vide, à l’indexation et en inférence' },
  { m: 'Actions bloquées en attente de validation', v: 'mesure en cours', n: 'protocole : comptage sur le journal d’événements' },
  { m: 'Décisions d’architecture documentées', v: '4', n: 'les quatre cartes de cette page, datées' },
]
</script>

<template>
  <div class="eva">
    <header class="eva__hero">
      <p class="eva__statut"><span class="eva__pastille" aria-hidden="true"></span> Actif · en expérimentation continue</p>
      <h1>EVA01 — un assistant IA local, avec mémoire et contrôle humain</h1>
      <p class="eva__lede">
        EVA01 explore une question simple : comment faire travailler une IA sur des informations utiles
        <strong>sans confier aveuglément ses données, ses outils et ses décisions</strong> à une plateforme opaque ?
      </p>
      <p class="eva__sig">Données locales. Mémoire contrôlée. Autonomie graduée. Décision humaine.</p>
      <p class="eva__encadre">
        <strong>Ce cas n’est pas une promesse universelle.</strong> Il documente un système construit dans un contexte
        précis, avec ses contraintes, ses compromis et ses limites. Les méthodes décrites s’adaptent après analyse
        de vos données, de vos processus et de vos risques — pas avant.
      </p>
    </header>

    <section>
      <h2>En trente secondes</h2>
      <p>
        Les assistants grand public sont utiles. Ils posent pourtant une question qu’une organisation doit se poser :
        que se passe-t-il lorsque ses notes, ses documents, ses échanges et ses décisions deviennent la matière
        première d’un service qu’elle ne contrôle pas ?
      </p>
      <p>
        EVA01 teste une autre réponse : une IA <strong>opérée localement</strong>, avec une mémoire maîtrisée, des
        rôles limités, et une intervention humaine obligatoire sur toute action sensible.
      </p>
    </section>

    <section>
      <h2>Les contraintes réelles</h2>
      <p>C’est ici que le projet cesse d’être un concept : voici les conditions dans lesquelles il tourne.</p>
      <dl class="eva__grille">
        <div v-for="c in CONTRAINTES" :key="c.t">
          <dt>{{ c.t }}</dt>
          <dd>{{ c.d }}</dd>
        </div>
      </dl>
    </section>

    <section>
      <h2>L’architecture</h2>
      <pre class="eva__schema" aria-label="Schéma de l’architecture EVA01">Utilisateur
    ↓
Interface conversationnelle
    ↓
Orchestrateur EVA01
    ├── Modèle local (Ollama)
    ├── Mémoire persistante
    ├── Base documentaire / RAG
    ├── Règles et niveaux d’autonomie N0 → N4
    ├── Outils et connecteurs encadrés
    └── Journal d’événements
    ↓
Validation humaine avant toute action sensible</pre>
      <table class="eva__table">
        <caption class="sr-only">Chaque brique et sa valeur concrète</caption>
        <thead><tr><th scope="col">Brique</th><th scope="col">Valeur concrète</th></tr></thead>
        <tbody><tr v-for="b in BRIQUES" :key="b.b"><th scope="row">{{ b.b }}</th><td>{{ b.v }}</td></tr></tbody>
      </table>
    </section>

    <section>
      <h2>Les décisions d’architecture</h2>
      <p>Un choix technique ne vaut que par ce qu’il coûte. Voici les quatre qui structurent le système.</p>
      <article v-for="d in DECISIONS" :key="d.t" class="eva__decision">
        <h3>{{ d.t }}</h3>
        <dl>
          <dt>Contexte</dt><dd>{{ d.c }}</dd>
          <dt>Décision</dt><dd>{{ d.d }}</dd>
          <dt>Compromis assumé</dt><dd>{{ d.comp }}</dd>
          <dt>Bénéfice</dt><dd>{{ d.b }}</dd>
        </dl>
      </article>
    </section>

    <section>
      <h2>Trois scénarios, pas une liste de fonctions</h2>
      <article v-for="s in SCENARIOS" :key="s.t" class="eva__scenario">
        <h3>{{ s.t }}</h3>
        <p class="eva__question">{{ s.q }}</p>
        <p>{{ s.r }}</p>
        <p class="eva__niveau">{{ s.n }}</p>
      </article>
    </section>

    <section>
      <h2>Résultats et mesures</h2>
      <p>
        Aucun de ces chiffres n’est estimé. Là où le protocole existe mais où le relevé n’est pas encore fait,
        la page l’écrit — <em>une case vide assumée vaut mieux qu’un chiffre plausible.</em>
      </p>
      <table class="eva__table">
        <thead><tr><th scope="col">Mesure</th><th scope="col">Valeur</th><th scope="col">Protocole</th></tr></thead>
        <tbody>
          <tr v-for="m in MESURES" :key="m.m">
            <th scope="row">{{ m.m }}</th>
            <td :class="{ 'eva__attente': m.v === 'mesure en cours' }">{{ m.v }}</td>
            <td>{{ m.n }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Ce qu’EVA01 ne fait pas, volontairement</h2>
      <ul class="eva__limites">
        <li v-for="l in LIMITES" :key="l">{{ l }}</li>
      </ul>
    </section>

    <section class="eva__cta">
      <h2>Vous voulez identifier ce qu’une IA locale peut réellement faire chez vous ?</h2>
      <p>
        Un diagnostic de cas d’usage : données concernées, processus visé, niveau de risque, architecture
        envisageable, et première expérimentation utile. On commence par ce qui est mesurable.
      </p>
      <RouterLink to="/contact" class="eva__bouton">Demander un diagnostic de cas d’usage</RouterLink>
    </section>

    <footer class="eva__pied">
      <p>
        <strong>Voir aussi</strong> :
        <RouterLink to="/laboratoire">le laboratoire</RouterLink> — où EVA01 et Arkadia se répondent ·
        <RouterLink to="/arkadia">Arkadia</RouterLink> — l’exploitation d’un système vivant.
      </p>
      <p class="eva__maj">Dernière mise à jour : 24 septembre 2026.</p>
    </footer>
  </div>
</template>

<style scoped>
.eva { max-width: 62rem; margin: 0 auto; padding: 3rem 1.25rem 5rem; line-height: 1.7; }
.eva__statut { display: flex; align-items: center; gap: .55rem; font: 500 .78rem/1 ui-monospace, Consolas, monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.eva__pastille { width: .5rem; height: .5rem; border-radius: 50%; background: var(--primaire, #2abfff); box-shadow: 0 0 0 .25rem rgba(42, 191, 255, .18); }
.eva h1 { margin: 1.1rem 0 1rem; font-size: clamp(1.85rem, 4vw, 2.9rem); line-height: 1.15; letter-spacing: -.02em; }
.eva__lede { font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46rem; color: var(--texte, #d7e6f2); }
.eva__sig { margin: 1.4rem 0; font: 500 .92rem/1.6 ui-monospace, Consolas, monospace; letter-spacing: .04em; color: var(--primaire, #2abfff); }
.eva__encadre { margin: 2rem 0 0; padding: 1.1rem 1.25rem; border-left: 3px solid var(--primaire, #2abfff); background: rgba(42, 191, 255, .06); font-size: .95rem; }
.eva section { margin: 3.4rem 0 0; }
.eva h2 { font-size: clamp(1.3rem, 2.6vw, 1.75rem); margin-bottom: 1rem; }
.eva h3 { font-size: 1.05rem; margin: 0 0 .5rem; }
.eva__grille { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr)); margin-top: 1.2rem; }
.eva__grille > div { padding: 1rem 1.1rem; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; }
.eva__grille dt { font-weight: 650; margin-bottom: .35rem; }
.eva__grille dd { margin: 0; font-size: .93rem; color: var(--texte-doux, #a9c0d2); }
.eva__schema { margin: 1.2rem 0; padding: 1.2rem 1.4rem; overflow-x: auto; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; background: rgba(8, 12, 20, .5); font: 400 .84rem/1.75 ui-monospace, Consolas, monospace; color: var(--texte, #d7e6f2); }
.eva__table { width: 100%; margin-top: 1.2rem; border-collapse: collapse; font-size: .93rem; }
.eva__table th, .eva__table td { padding: .7rem .8rem; text-align: left; border-bottom: 1px solid rgba(120, 160, 190, .15); vertical-align: top; }
.eva__table thead th { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.eva__attente { font-style: italic; color: var(--texte-doux, #8ea6b8); }
.eva__decision, .eva__scenario { margin-top: 1.4rem; padding: 1.2rem 1.3rem; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; }
.eva__decision dl { margin: 0; font-size: .93rem; }
.eva__decision dt { font-weight: 650; margin-top: .7rem; color: var(--texte-doux, #a9c0d2); font-size: .8rem; letter-spacing: .06em; text-transform: uppercase; }
.eva__decision dd { margin: .2rem 0 0; }
.eva__question { font-style: italic; color: var(--primaire, #2abfff); }
.eva__niveau { font: 500 .8rem/1.5 ui-monospace, Consolas, monospace; letter-spacing: .05em; color: var(--texte-doux, #8ea6b8); }
.eva__limites { margin-top: 1.2rem; padding-left: 1.1rem; }
.eva__limites li { margin-bottom: .55rem; }
.eva__cta { margin-top: 3.4rem; padding: 1.9rem; border: 1px solid rgba(42, 191, 255, .3); border-radius: .5rem; background: rgba(42, 191, 255, .05); }
.eva__bouton { display: inline-block; margin-top: 1rem; padding: .85rem 1.5rem; border-radius: .35rem; background: var(--primaire, #2abfff); color: #080b14; font-weight: 650; text-decoration: none; }
.eva__bouton:hover, .eva__bouton:focus-visible { background: #7fd8ff; }
.eva__pied { margin-top: 3rem; padding-top: 1.4rem; border-top: 1px solid rgba(120, 160, 190, .18); font-size: .92rem; }
.eva__maj { color: var(--texte-doux, #8ea6b8); font-size: .86rem; }
</style>
