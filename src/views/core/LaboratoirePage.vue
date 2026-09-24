<script setup>
/* ═══════════════════════════════════════════════════════════════════════════════
   LE LABORATOIRE — la page qui relie EVA01 et Arkadia.

   ⭐ POURQUOI ELLE EXISTE. Un prospect qui arrive par l'IA découvre la robustesse
   opérationnelle ; un prospect qui arrive par Arkadia découvre l'IA locale. Sans
   cette page, ce sont **deux projets personnels** que rien ne relie — et le
   visiteur doit deviner lui-même ce qu'ils prouvent.

   ⛔ CE QU'ELLE REFUSE DE FAIRE : vendre EVA01 ou Arkadia comme des produits. Ce
   ne sont pas des produits, ce sont des TERRAINS. Ce qu'on vend, c'est ce qu'on y
   a appris — et ce que ça change pour le client.

   ⚠️ LES CHIFFRES CITÉS VIENNENT DE LA PAGE /arkadia, PUBLIÉE. Ils sont datés et
   sourcés ici. *Un chiffre sans sujet est un chiffre faux ; un chiffre sans source
   est une croyance.* Les deux chiffres « 150+ survivants » et « 64 membres
   d'équipage » — non vérifiés — **ne figurent nulle part sur cette page**, ni ici
   ni ailleurs sur le site.
   ═══════════════════════════════════════════════════════════════════════════════ */

const MATRICE = [
  { c: 'IA locale', e: 'oui', a: 'non', b: 'Données et intelligence sous contrôle' },
  { c: 'RAG et mémoire', e: 'oui', a: 'non', b: 'Retrouver la connaissance utile, en la citant' },
  { c: 'Agents et autorisations', e: 'oui', a: 'partiel', b: 'Automatiser sans perdre la main' },
  { c: 'Architecture distribuée', e: 'non', a: 'oui', b: 'Faire tenir plusieurs briques ensemble' },
  { c: 'Exploitation continue', e: 'oui', a: 'oui', b: 'Anticiper les incidents, tenir le système' },
  { c: 'Sauvegarde et reprise', e: 'oui', a: 'oui', b: 'Pouvoir revenir en arrière, vraiment' },
  { c: 'Documentation', e: 'oui', a: 'oui', b: 'Transmettre sans dépendre d’une personne' },
  { c: 'Expérience utilisateur', e: 'interface', a: 'communauté', b: 'Réduire la friction d’usage' },
]

const LIBELLE = { oui: 'Oui', non: '—', partiel: 'Partiel', interface: 'Interface', communauté: 'Communauté' }

const APPORT = [
  { t: 'Un système utile s’administre à plus d’une personne', d: 'Si une seule personne sait le faire tourner, ce n’est pas un système : c’est une dépendance. La documentation n’est pas un livrable annexe, c’est ce qui rend le système reprenable.' },
  { t: 'Une sauvegarde non testée est une hypothèse', d: 'Une restauration qu’on n’a jamais faite ne prouve rien. On ne découvre pas qu’une sauvegarde était inutilisable le jour où on en a besoin.' },
  { t: 'La disponibilité est aussi une affaire de communication', d: 'Une panne mal annoncée coûte plus cher qu’une panne courte. Prévenir, dater, expliquer, dire quand ça revient.' },
  { t: 'Les règles simples réduisent plus de support que les outils complexes', d: 'Une règle claire et visible économise des dizaines de questions. Un outil puissant mais illisible en crée autant qu’il en résout.' },
  { t: 'L’automatisation doit réduire les erreurs, pas rendre l’opération illisible', d: 'Une automatisation qu’on ne peut pas expliquer est une dette : le jour où elle se trompe, personne ne sait pourquoi.' },
  { t: 'Toute architecture doit prévoir la reprise, l’export et l’évolution', d: 'Ce qui ne peut pas être exporté n’appartient pas au client, même s’il l’a payé.' },
]

/* ⚠️ CE QUI N'EST PAS MESURÉ SE DIT. Les deux projets n'ont pas la même maturité,
   et cette frise le montre plutôt que de le cacher. */
const MATURITE = [
  { bloc: 'Assistant local, mémoire, règles d’autorisation', etat: 'opéré', quoi: 'EVA01 tourne en continu' },
  { bloc: 'Base documentaire interrogeable avec sources', etat: 'opéré', quoi: 'EVA01' },
  { bloc: 'Serveurs communautaires', etat: 'opéré', quoi: 'Arkadia — 9 serveurs, depuis 2024 (source : page /arkadia)' },
  { bloc: 'Documentation d’exploitation', etat: 'consolider', quoi: 'les deux projets' },
  { bloc: 'Mesures publiées et rejouables', etat: 'encours', quoi: 'protocoles écrits, relevés à faire' },
]
const LIBELLE_ETAT = { opere: 'Opéré', consolider: 'À consolider', encours: 'En cours' }
</script>

<template>
  <div class="labo">
    <header class="labo__hero">
      <h1>Le laboratoire — des systèmes testés dans le réel</h1>
      <p class="labo__lede">
        EVA01 et Arkadia ne sont pas des produits. Ce sont <strong>deux terrains</strong> : l’un pour
        l’intelligence locale gouvernée, l’autre pour l’exploitation d’un système vivant.
        Ce qu’on y apprend se transpose — et c’est ce que cette page met à plat.
      </p>
      <p class="labo__encadre">
        <strong>Ces cas ne sont pas des promesses universelles.</strong> Chacun documente un système construit
        dans un contexte précis, avec ses contraintes et ses compromis. Les méthodes se transposent après
        analyse de vos données, de vos processus et de vos risques.
      </p>
    </header>

    <section>
      <h2>Deux terrains, un seul métier</h2>
      <pre class="labo__schema" aria-label="EVA01 plus Arkadia donne GL Digital Lab">EVA01
  intelligence locale · mémoire · agents · orchestration · contrôle humain
                              +
Arkadia
  infrastructure · communauté · opérations · résilience · continuité
                              =
GL Digital Lab
  des systèmes numériques utiles, gouvernés et exploitables</pre>
    </section>

    <section>
      <h2>Ce que chaque terrain prouve</h2>
      <table class="labo__table">
        <caption class="sr-only">Matrice de preuves : compétence, EVA01, Arkadia, bénéfice client</caption>
        <thead>
          <tr>
            <th scope="col">Compétence</th>
            <th scope="col">EVA01</th>
            <th scope="col">Arkadia</th>
            <th scope="col">Ce que ça change pour vous</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in MATRICE" :key="r.c">
            <th scope="row">{{ r.c }}</th>
            <td class="labo__etat" :data-etat="r.e">{{ LIBELLE[r.e] }}</td>
            <td class="labo__etat" :data-etat="r.a">{{ LIBELLE[r.a] }}</td>
            <td>{{ r.b }}</td>
          </tr>
        </tbody>
      </table>
      <p class="labo__note">
        Cette matrice dit aussi ce que <em>l’un ne fait pas</em>. EVA01 n’est pas un système distribué,
        et Arkadia n’héberge pas de modèle de langage. <strong>Un tableau qui ne montre que des « oui »
        ne prouve rien.</strong>
      </p>
    </section>

    <section>
      <h2>Où en est chaque bloc — sans arrondir</h2>
      <p>
        Les deux projets n’ont pas la même maturité, et le dire vaut mieux que de la lisser.
      </p>
      <ul class="labo__frise">
        <li v-for="m in MATURITE" :key="m.bloc" :data-etat="m.etat">
          <span class="labo__puce" aria-hidden="true"></span>
          <strong>{{ m.bloc }}</strong>
          <em>{{ LIBELLE_ETAT[m.etat] }}</em>
          <span class="labo__quoi">{{ m.quoi }}</span>
        </li>
      </ul>
    </section>

    <section>
      <h2>Ce que ces deux terrains apportent à une PME ou une collectivité</h2>
      <dl class="labo__apport">
        <div v-for="a in APPORT" :key="a.t">
          <dt>{{ a.t }}</dt>
          <dd>{{ a.d }}</dd>
        </div>
      </dl>
    </section>

    <section>
      <h2>Un mot sur les chiffres de cette page</h2>
      <p>
        Les seuls nombres publiés ici — <strong>9 serveurs</strong>, <strong>depuis 2024</strong>,
        <strong>18 mois d’exploitation</strong> — viennent de la page <RouterLink to="/arkadia">Arkadia</RouterLink>,
        où ils sont déjà publics. Aucun autre n’est avancé.
      </p>
      <p>
        Deux chiffres circulent dans les documents du studio sans source vérifiée : « plus de 150 survivants
        depuis 2024 » et « 64 membres d’équipage ». <strong>Ils n’apparaissent nulle part sur ce site</strong>,
        et n’y apparaîtront pas tant qu’ils n’auront pas été mesurés. <em>Un chiffre sans source est une
        croyance, pas une preuve.</em>
      </p>
      <p class="labo__note">
        Là où une mesure manque, la page écrit <strong>« mesure en cours »</strong> avec son protocole —
        pas une estimation. C’est la règle du studio, et elle s’applique aussi à lui.
      </p>
    </section>

    <section class="labo__cta">
      <h2>Par lequel voulez-vous commencer ?</h2>
      <div class="labo__duo">
        <div>
          <h3>IA locale et gouvernée</h3>
          <p>Vos données, vos règles, votre validation. On regarde ce qu’une IA locale peut réellement faire chez vous.</p>
          <RouterLink to="/eva01" class="labo__bouton">Voir l’étude de cas EVA01</RouterLink>
        </div>
        <div>
          <h3>Résilience et exploitation</h3>
          <p>Vos outils, vos dépendances, vos points uniques de défaillance. On cartographie avant de réparer.</p>
          <RouterLink to="/contact" class="labo__bouton labo__bouton--clair">Demander un audit de résilience</RouterLink>
        </div>
      </div>
    </section>

    <footer class="labo__pied">
      <p class="labo__maj">Dernière mise à jour : 24 septembre 2026.</p>
    </footer>
  </div>
</template>

<style scoped>
.labo { max-width: 62rem; margin: 0 auto; padding: 3rem 1.25rem 5rem; line-height: 1.7; }
.labo h1 { margin: 0 0 1rem; font-size: clamp(1.85rem, 4vw, 2.9rem); line-height: 1.15; letter-spacing: -.02em; }
.labo__lede { font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46rem; color: var(--texte, #d7e6f2); }
.labo__encadre { margin: 2rem 0 0; padding: 1.1rem 1.25rem; border-left: 3px solid var(--primaire, #2abfff); background: rgba(42, 191, 255, .06); font-size: .95rem; }
.labo section { margin: 3.4rem 0 0; }
.labo h2 { font-size: clamp(1.3rem, 2.6vw, 1.75rem); margin-bottom: 1rem; }
.labo h3 { font-size: 1.05rem; margin: 0 0 .5rem; }
.labo__schema { margin: 1.2rem 0; padding: 1.2rem 1.4rem; overflow-x: auto; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; background: rgba(8, 12, 20, .5); font: 400 .84rem/1.75 ui-monospace, Consolas, monospace; color: var(--texte, #d7e6f2); }
.labo__table { width: 100%; margin-top: 1.2rem; border-collapse: collapse; font-size: .93rem; }
.labo__table th, .labo__table td { padding: .7rem .8rem; text-align: left; border-bottom: 1px solid rgba(120, 160, 190, .15); vertical-align: top; }
.labo__table thead th { font-size: .78rem; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.labo__etat { font-weight: 650; white-space: nowrap; }
.labo__etat[data-etat="oui"] { color: #3ee8c4; }
.labo__etat[data-etat="partiel"], .labo__etat[data-etat="interface"], .labo__etat[data-etat="communauté"] { color: #ffe650; }
.labo__etat[data-etat="non"] { color: var(--texte-doux, #8ea6b8); }
.labo__note { margin-top: 1rem; font-size: .92rem; color: var(--texte-doux, #a9c0d2); }
.labo__frise { margin: 1.2rem 0 0; padding: 0; list-style: none; }
.labo__frise li { display: flex; flex-wrap: wrap; align-items: baseline; gap: .6rem; padding: .7rem 0; border-bottom: 1px solid rgba(120, 160, 190, .15); }
.labo__puce { width: .55rem; height: .55rem; border-radius: 50%; flex: 0 0 auto; }
.labo__frise li[data-etat="opere"] .labo__puce { background: #3ee8c4; }
.labo__frise li[data-etat="consolider"] .labo__puce { background: #ffe650; }
.labo__frise li[data-etat="encours"] .labo__puce { background: var(--texte-doux, #8ea6b8); }
.labo__frise em { font-style: normal; font: 500 .76rem/1 ui-monospace, Consolas, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--texte-doux, #8ea6b8); }
.labo__quoi { flex: 1 1 14rem; font-size: .9rem; color: var(--texte-doux, #a9c0d2); }
.labo__apport { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr)); margin-top: 1.2rem; }
.labo__apport > div { padding: 1rem 1.1rem; border: 1px solid rgba(120, 160, 190, .18); border-radius: .4rem; }
.labo__apport dt { font-weight: 650; margin-bottom: .35rem; }
.labo__apport dd { margin: 0; font-size: .93rem; color: var(--texte-doux, #a9c0d2); }
.labo__cta { margin-top: 3.4rem; padding: 1.9rem; border: 1px solid rgba(42, 191, 255, .3); border-radius: .5rem; background: rgba(42, 191, 255, .05); }
.labo__duo { display: grid; gap: 1.6rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); margin-top: 1.2rem; }
.labo__bouton { display: inline-block; margin-top: 1rem; padding: .8rem 1.35rem; border-radius: .35rem; background: var(--primaire, #2abfff); color: #080b14; font-weight: 650; text-decoration: none; }
.labo__bouton:hover, .labo__bouton:focus-visible { background: #7fd8ff; }
.labo__bouton--clair { background: transparent; color: var(--primaire, #2abfff); border: 1px solid var(--primaire, #2abfff); }
.labo__bouton--clair:hover, .labo__bouton--clair:focus-visible { background: rgba(42, 191, 255, .14); color: #eaf6ff; }
.labo__pied { margin-top: 3rem; padding-top: 1.4rem; border-top: 1px solid rgba(120, 160, 190, .18); }
.labo__maj { color: var(--texte-doux, #8ea6b8); font-size: .86rem; }
</style>
