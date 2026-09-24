<script setup>
/* ═══════════════════════════════════════════════════════════════════════════════
   ARKADIA — l'écosystème communautaire opéré comme un système critique.

   ⭐ CE QUE CETTE PAGE EST. La deuxième étude de cas du laboratoire. Elle existe pour
   montrer **la capacité à opérer un système vivant** — pas pour raconter du jeu.

   ⛔ ET CE QU'ELLE REFUSE D'ÉCRIRE, QUI EST LE PLUS IMPORTANT.
      Les documents du studio portent des chiffres sur Arkadia ; **deux d'entre eux
      n'ont AUCUNE source vérifiée** : « plus de 150 survivants depuis 2024 » et
      « 64 membres d'équipage ». Ils **n'apparaissent pas ici**, et la page **dit
      pourquoi** — c'est plus crédible qu'un chiffre qui aurait l'air bon.
      ⭐ *Un chiffre sans source est une croyance. Un chiffre sans sujet est un chiffre faux.*

   ⚠️ CE QUI EST VÉRIFIABLE, ET D'OÙ ÇA VIENT : les seuls nombres publiés ici
      — **neuf serveurs**, **depuis 2024**, **18 mois d'exploitation** — viennent de la
      page `/arkadia` du site, où ils sont **déjà publics** depuis le 10/09/2026.
      Ils sont cités avec leur source, jamais repris de mémoire.

   ⭐ ET LA SECTION QUI MANQUE PARTOUT : « Ce que nous ne savons pas encore ». Une
      étude de cas qui n'a que des certitudes est une brochure.
   ═══════════════════════════════════════════════════════════════════════════════ */

const PERIMETRE = [
  { b: 'Serveurs communautaires', e: 'opere', d: 'Neuf serveurs, depuis 2024 — source : page /arkadia, publiée' },
  { b: 'Communauté et règles', e: 'opere', d: 'Des règles publiques, et une modération qui les applique' },
  { b: 'Sauvegardes et restauration', e: 'consolider', d: 'Des sauvegardes existent ; les restaurations testées ne sont pas toutes documentées' },
  { b: 'Supervision et alertes', e: 'consolider', d: 'Une surveillance existe, mais elle n’a pas produit de relevés publiables' },
  { b: 'Communication d’incident', e: 'consolider', d: 'Annonces ponctuelles ; pas de journal d’exploitation tenu dans la durée' },
  { b: 'Documentation d’exploitation', e: 'encours', d: 'Protocoles en cours d’écriture — c’est le point faible reconnu' },
]

const LIB_E = { opere: 'Opéré', consolider: 'À consolider', encours: 'En cours' }

/* ⛔ AUCUN DE CES BLOCS N'EST REMPLI D'UN FAIT INVENTÉ. Les colonnes « Résultat » portent
   ce qu'on sait, et **« à relever »** là où on ne sait pas. */
const LECTURE = [
  { a: 'Gérer neuf serveurs', p: 'Gérer plusieurs applications ou environnements' },
  { a: 'Des joueurs et des modérateurs', p: 'Des utilisateurs, des équipes internes et des administrateurs' },
  { a: 'Sauvegarder un monde de jeu', p: 'Sauvegarder des données métier' },
  { a: 'Mettre à jour un serveur', p: 'Déployer une application métier' },
  { a: 'Écrire et faire appliquer des règles', p: 'Définir des droits, des workflows et une gouvernance' },
  { a: 'Annoncer une maintenance', p: 'Communiquer un changement auprès des utilisateurs' },
  { a: 'Un événement communautaire', p: 'Un pic de trafic, une campagne, une période critique' },
  { a: 'Un conflit de règles', p: 'Gérer une exception et son support' },
]

const APPORT = [
  { t: 'Un système utile s’administre à plus d’une personne', d: 'Si une seule personne sait le faire tourner, ce n’est pas un système : c’est une dépendance. La documentation n’est pas un livrable annexe, c’est ce qui rend le système reprenable.' },
  { t: 'Une sauvegarde non testée est une hypothèse', d: 'Une restauration qu’on n’a jamais faite ne prouve rien. On ne découvre pas qu’une sauvegarde était inutilisable le jour où on en a besoin.' },
  { t: 'La disponibilité est aussi une affaire de communication', d: 'Une panne mal annoncée coûte plus cher qu’une panne courte. Prévenir, dater, expliquer, dire quand ça revient.' },
  { t: 'Les règles simples réduisent plus de support que les outils complexes', d: 'Une règle claire et visible économise des dizaines de questions. Un outil puissant mais illisible en crée autant qu’il en résout.' },
  { t: 'L’automatisation doit réduire les erreurs, pas rendre l’opération illisible', d: 'Une automatisation qu’on ne peut pas expliquer est une dette : le jour où elle se trompe, personne ne sait pourquoi.' },
  { t: 'Toute architecture doit prévoir la reprise, l’export et l’évolution', d: 'Ce qui ne peut pas être exporté n’appartient pas au client, même s’il l’a payé.' },
]

/* ⭐ CE QUI MANQUE, DIT FRANCHEMENT. C'est la section que presque personne n'écrit. */
const TROUS = [
  { t: 'Les incidents ne sont pas documentés', d: 'Il y en a eu. Ils n’ont pas été consignés au moment où ils sont arrivés, donc ils ne peuvent pas être racontés honnêtement aujourd’hui. **Reconstituer un incident de mémoire, c’est écrire une fiction qui a l’air d’un post-mortem.**' },
  { t: 'Aucune mesure de disponibilité n’a été tenue', d: 'Le chiffre « 99,8 % » figure dans une description du site. **Il n’a pas de source** : il n’est donc pas repris ici, et il sera retiré là où il apparaît.' },
  { t: 'Les restaurations testées ne sont pas comptées', d: 'Des sauvegardes ont été faites. **Le nombre de restaurations réellement éprouvées n’est pas relevé.** C’est exactement le genre de chiffre qui se vérifie en le faisant, pas en l’estimant.' },
  { t: 'Le volume de support n’est pas suivi', d: 'Combien de questions répétitives, combien de tickets, combien de fois la même règle a été réexpliquée — **rien de tout ça n’a été compté.**' },
]

const MESURES = [
  { m: 'Durée d’exploitation', v: '18 mois', n: 'source : page /arkadia, publiée le 10/09/2026' },
  { m: 'Serveurs opérés', v: '9', n: 'source : page /arkadia, publiée le 10/09/2026' },
  { m: 'Début d’exploitation', v: '2024', n: 'source : page /arkadia — le mois n’est pas précisé' },
  { m: 'Disponibilité observée', v: 'non mesurée', n: 'aucun relevé tenu — le « 99,8 % » qui circule n’a pas de source' },
  { m: 'Restaurations testées', v: 'à relever', n: 'les sauvegardes existent ; les restaurations éprouvées ne sont pas comptées' },
  { m: 'Temps moyen de reprise', v: 'à relever', n: 'aucun incident n’a été chronométré' },
  { m: 'Volume de support', v: 'à relever', n: 'les questions répétitives ne sont pas comptées' },
  { m: 'Procédures écrites', v: 'en cours', n: 'c’est le point faible reconnu de ce système' },
]
</script>

<template>
  <div class="ark">
    <header class="ark__hero">
      <p class="ark__statut"><span class="ark__pastille" aria-hidden="true"></span> Opéré · en consolidation</p>
      <h1>Arkadia — exploiter un écosystème communautaire comme un système critique</h1>
      <p class="ark__lede">
        Un environnement communautaire ne fonctionne pas comme un site vitrine. Il doit rester
        <strong>disponible, compréhensible, modérable et évolutif</strong> pendant que des utilisateurs
        se connectent, créent, échangent, contestent et signalent des problèmes.
      </p>
      <p class="ark__sig">Neuf serveurs depuis 2024. Des utilisateurs réels. Une panne qui se voit tout de suite.</p>
      <p class="ark__encadre">
        <strong>Ce cas n’est pas une promesse universelle.</strong> Il documente un système construit dans
        un contexte précis, avec ses contraintes, ses compromis et ses limites — <em>y compris celles
        qu’on n’a pas encore mesurées, qui sont dites plus bas.</em>
      </p>
    </header>

    <section>
      <h2>En trente secondes</h2>
      <p>
        Un jeu communautaire est un système exigeant <strong>parce qu’il est vivant</strong> : il est
        imprévisible, toujours observé, et une panne a un effet immédiat sur une expérience collective.
      </p>
      <p>
        C’est pour ça qu’il fait un bon terrain. <strong>Ce qui tient pour neuf serveurs et une
        communauté tient pour plusieurs applications et une équipe</strong> — à condition de dire
        honnêtement ce qui a été mesuré, et ce qui ne l’a pas été.
      </p>
    </section>

    <section>
      <h2>Le périmètre, sans arrondir</h2>
      <p>
        Les blocs d’un système communautaire n’ont pas tous la même maturité. La frise le dit
        plutôt que de le lisser.
      </p>
      <ul class="ark__frise">
        <li v-for="p in PERIMETRE" :key="p.b" :data-etat="p.e">
          <span class="ark__puce" aria-hidden="true"></span>
          <strong>{{ p.b }}</strong>
          <em>{{ LIB_E[p.e] }}</em>
          <span class="ark__quoi">{{ p.d }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h2>Ce que ça vaut pour une organisation</h2>
      <p>
        C’est cette colonne-là qui transforme un cas « gaming » en preuve utile. Les situations
        changent de vocabulaire, pas de nature.
      </p>
      <table class="ark__table">
        <caption class="sr-only">Traduction des situations Arkadia en lecture métier</caption>
        <thead><tr><th scope="col">Situation vécue</th><th scope="col">Ce que ça vaut ailleurs</th></tr></thead>
        <tbody><tr v-for="l in LECTURE" :key="l.a"><th scope="row">{{ l.a }}</th><td>{{ l.p }}</td></tr></tbody>
      </table>
    </section>

    <section>
      <h2>Ce que l’expérience apporte à une PME ou une collectivité</h2>
      <dl class="ark__apport">
        <div v-for="a in APPORT" :key="a.t">
          <dt>{{ a.t }}</dt>
          <dd>{{ a.d }}</dd>
        </div>
      </dl>
    </section>

    <section>
      <h2>Résultats et mesures</h2>
      <p>
        Les seuls chiffres publiés ici viennent de la page <RouterLink to="/arkadia">/arkadia</RouterLink>,
        où ils sont déjà publics. Partout ailleurs, la page écrit <strong>« à relever »</strong> ou
        <strong>« non mesurée »</strong>.
      </p>
      <table class="ark__table">
        <thead><tr><th scope="col">Mesure</th><th scope="col">Valeur</th><th scope="col">Source ou raison de l’absence</th></tr></thead>
        <tbody>
          <tr v-for="m in MESURES" :key="m.m">
            <th scope="row">{{ m.m }}</th>
            <td :class="{ 'ark__attente': m.v === 'à relever' || m.v === 'non mesurée' || m.v === 'en cours' }">{{ m.v }}</td>
            <td>{{ m.n }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>Ce que nous ne savons pas encore</h2>
      <p>
        <em>C’est la section que presque personne n’écrit, et c’est celle qui rend le reste croyable.</em>
      </p>
      <dl class="ark__trous">
        <div v-for="t in TROUS" :key="t.t">
          <dt>{{ t.t }}</dt>
          <dd v-html="t.d"></dd>
        </div>
      </dl>
      <p class="ark__note">
        À partir de cette publication, <strong>l’instrumentation commence</strong> : sauvegardes
        chronométrées, restaurations réellement éprouvées, incidents consignés le jour où ils
        arrivent, questions répétitives comptées. <strong>Les relevés seront publiés datés</strong>,
        même quand ils seront mauvais.
      </p>
    </section>

    <section>
      <h2>Un mot sur les chiffres qui circulent</h2>
      <p>
        Deux nombres figurent dans les documents du studio sans source vérifiée : « plus de
        150 survivants depuis 2024 » et « 64 membres d’équipage ». Un troisième circule sur le site :
        une disponibilité de « 99,8 % ».
      </p>
      <p>
        <strong>Aucun des trois n’apparaît sur cette page</strong>, et ils en seront retirés partout
        où ils apparaissent, tant qu’ils n’auront pas été mesurés.
        <em>Une case vide assumée vaut mieux qu’un chiffre plausible.</em>
      </p>
    </section>

    <section class="ark__cta">
      <h2>Votre activité dépend de plusieurs outils, personnes ou flux critiques ?</h2>
      <p>
        Un audit de résilience : cartographie, dépendances, accès, sauvegardes, procédures,
        points uniques de défaillance et plan d’action priorisé. <strong>On cartographie avant de
        réparer.</strong>
      </p>
      <RouterLink to="/contact" class="ark__bouton">Demander un audit de résilience</RouterLink>
    </section>

    <footer class="ark__pied">
      <p>
        <strong>Voir aussi</strong> :
        <RouterLink to="/eva01">EVA01</RouterLink> — l’IA locale gouvernée ·
        <RouterLink to="/laboratoire">le laboratoire</RouterLink> — où les deux se répondent ·
        <RouterLink to="/arkadia">Arkadia</RouterLink> — la page d’origine.
      </p>
      <p class="ark__maj">Dernière mise à jour : 24 septembre 2026.</p>
    </footer>
  </div>
</template>

<style scoped>
.ark { max-width: 62rem; margin: 0 auto; padding: 3rem 1.25rem 5rem; line-height: 1.7; }
.ark__statut { display: flex; align-items: center; gap: .55rem; font: 500 .78rem/1 ui-monospace, Consolas, monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.ark__pastille { width: .5rem; height: .5rem; border-radius: 50%; background: #ffe650; box-shadow: 0 0 0 .25rem rgba(255, 230, 80, .16); }
.ark h1 { margin: 1.1rem 0 1rem; font-size: clamp(1.85rem, 4vw, 2.9rem); line-height: 1.15; letter-spacing: -.02em; }
.ark__lede { font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46rem; color: var(--texte, #d7e6f2); }
.ark__sig { margin: 1.4rem 0; font: 500 .92rem/1.6 ui-monospace, Consolas, monospace; letter-spacing: .04em; color: var(--primaire, #2abfff); }
.ark__encadre { margin: 2rem 0 0; padding: 1.1rem 1.25rem; border-left: 3px solid var(--primaire, #2abfff); background: rgba(42, 191, 255, .06); font-size: .95rem; }
.ark section { margin: 3.4rem 0 0; }
.ark h2 { font-size: clamp(1.3rem, 2.6vw, 1.75rem); margin-bottom: 1rem; }
.ark__frise { margin: 1.2rem 0 0; padding: 0; list-style: none; }
.ark__frise li { display: flex; flex-wrap: wrap; align-items: baseline; gap: .6rem; padding: .75rem 0; border-bottom: 1px solid rgba(120, 160, 190, .15); }
.ark__puce { width: .55rem; height: .55rem; border-radius: 50%; flex: 0 0 auto; }
.ark__frise li[data-etat="opere"] .ark__puce { background: #3ee8c4; }
.ark__frise li[data-etat="consolider"] .ark__puce { background: #ffe650; }
.ark__frise li[data-etat="encours"] .ark__puce { background: var(--texte-doux, #8ea6b8); }
.ark__frise em { font-style: normal; font: 500 .76rem/1 ui-monospace, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.ark__quoi { flex: 1 1 16rem; font-size: .9rem; color: var(--texte-doux, #a9c0d2); }
.ark__table { width: 100%; margin-top: 1.2rem; border-collapse: collapse; font-size: .93rem; }
.ark__table th, .ark__table td { padding: .7rem .8rem; text-align: left; border-bottom: 1px solid rgba(120, 160, 190, .15); vertical-align: top; }
.ark__table thead th { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.ark__attente { font-style: italic; color: var(--texte-doux, #8ea6b8); }
.ark__apport { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr)); margin-top: 1.2rem; }
.ark__apport > div { padding: 1rem 1.1rem; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; }
.ark__apport dt { font-weight: 650; margin-bottom: .35rem; }
.ark__apport dd { margin: 0; font-size: .93rem; color: var(--texte-doux, #a9c0d2); }
.ark__trous { margin-top: 1.2rem; }
.ark__trous > div { padding: 1rem 1.1rem; margin-bottom: .9rem; border-left: 3px solid #ffe650; background: rgba(255, 230, 80, .05); border-radius: 0 .4rem .4rem 0; }
.ark__trous dt { font-weight: 650; margin-bottom: .35rem; }
.ark__trous dd { margin: 0; font-size: .93rem; color: var(--texte-doux, #a9c0d2); }
.ark__note { margin-top: 1.2rem; font-size: .92rem; color: var(--texte-doux, #a9c0d2); }
.ark__cta { margin-top: 3.4rem; padding: 1.9rem; border: 1px solid rgba(42, 191, 255, .3); border-radius: .5rem; background: rgba(42, 191, 255, .05); }
.ark__bouton { display: inline-block; margin-top: 1rem; padding: .85rem 1.5rem; border-radius: .35rem; background: var(--primaire, #2abfff); color: #080b14; font-weight: 650; text-decoration: none; }
.ark__bouton:hover, .ark__bouton:focus-visible { background: #7fd8ff; }
.ark__pied { margin-top: 3rem; padding-top: 1.4rem; border-top: 1px solid rgba(120, 160, 190, .18); font-size: .92rem; }
.ark__maj { color: var(--texte-doux, #8ea6b8); font-size: .86rem; }
</style>
