/* =============================================================================
   fr.js — LA LANGUE D'ACCUEIL, ET LA RÉFÉRENCE DES AUTRES
   =============================================================================

   ⭐ CE FICHIER EST LA SOURCE. Les six autres langues s'y comparent, clé par clé,
   et **le build REFUSE de produire si une seule manque** (`scripts/verifier-langues.mjs`).
   *Une traduction ne peut pas être en retard : elle ne peut pas être publiée
   incomplète.*

   ⛔ PREMIÈRE TRANCHE : LA PAGE DES APPLICATIONS SEULE (`src/views/core/AppsPage.vue`).
   Ce n'est pas un oubli — c'est **une tranche verticale** : on prouve la chaîne
   entière (source → `t()` → page rendue) sur un morceau petit et vrai, avant de
   l'étendre aux 3 095 chaînes du site.
   *Une chaîne qu'on n'a pas prouvée sur un cas ne marche pas sur trois mille.*

   ⭐⭐ ET LA RÈGLE LA PLUS IMPORTANTE DE CE FICHIER : **TOUT NE SE TRADUIT PAS.**
   Les NOMS des applications — `Wa Router`, `Makoto Scanner`, `Jitsu Pipeline` — sont
   des **noms propres**. Ils ne sont PAS ici, et c'est volontaire.
   *Un système qui traduirait « Makoto Scanner » serait faux du premier coup, et
   personne ne s'en apercevrait avant de le lire en allemand.*
   ⇒ Se traduisent : le rôle, la description, et l'habillage de la page.

   ⚠️ LES CLÉS SONT EN FRANÇAIS, ET C'EST DÉLIBÉRÉ. *Une clé en anglais oblige à
   traduire deux fois : une fois pour la lire, une fois pour la rendre.* La clé est
   un chemin, pas une phrase.

   @author Génie IT Tek FR
   @version 1.0.0
   ============================================================================= */

export default {
  /* ── L'HABILLAGE DE LA PAGE ─────────────────────────────────────────────── */
  apps: {
    badge: 'APPLICATIONS',
    titreAvant: 'Les outils de',
    titrePrincipal: "L'ÉQUIPAGE",
    chapeau:
      "Les applications que le studio utilise et montre. Chacune est un outil réel, " +
      "décrit sans promesse excessive — y compris ce qu'elle ne fait pas.",
    sectionTitre: 'Nos applications',
    /* ⚠️ Ce paragraphe porte du BALISAGE (`<strong>chez nous</strong>`). On ne met
       donc pas de HTML dans la traduction : on coupe en deux morceaux, et le
       composant les assemble. *Mettre du HTML dans une chaîne traduite, c'est
       demander à un traducteur de ne pas casser une balise — et il la cassera.* */
    noteAvant: 'Ces outils tournent ',
    noteFort: 'chez nous',
    noteApres:
      ". Aucun n'est un service en ligne auquel vous vous abonnez : ils servent à " +
      'produire les livraisons du studio.',
  },

  /* ── LES RÔLES DES APPLICATIONS ─────────────────────────────────────────── */
  /* ⛔ LES NOMS NE SONT PAS ICI. `Wa Router`, `Makoto Scanner`, `Dou Monitor`,
     `Watashi Knowledge Base`, `Jitsu Pipeline`, `SEO Content Generator` et
     `Invoice Generator` restent tels quels dans toutes les langues. */
  appsRole: {
    wa: 'Orchestrateur multi-agent',
    makoto: 'Audit de sécurité',
    dou: 'Supervision système',
    watashi: 'Base de connaissances',
    jitsu: 'Générateur CI/CD',
    seo: 'Contenu optimisé',
    facture: 'Devis et factures',
  },

  /* ── LES DESCRIPTIONS ───────────────────────────────────────────────────── */
  appsDesc: {
    wa: "Oriente une demande vers le bon outil de l'équipage et rassemble les réponses.",
    makoto:
      "Relève les vulnérabilités d'un projet et de ses dépendances, avec le détail " +
      'de chaque constat.',
    dou:
      'Surveille les services et les métriques de la machine : ports, processus, ' +
      'disponibilité.',
    watashi:
      'Indexe des documents et répond de façon citée, ancrée sur les sources fournies.',
    jitsu:
      "Produit des configurations d'intégration continue pour GitHub Actions et GitLab CI.",
    seo:
      'Rédige et structure du contenu en respectant les règles de référencement technique.',
    facture: "Génère les documents commerciaux du studio à partir d'un modèle.",
  },
};

/* =============================================================================
   ⚠️ CE QUE CE FICHIER NE DIT PAS
   -----------------------------------------------------------------------------
   · **Il ne couvre que la page des applications.** Les 3 095 chaînes du site
     restent à extraire. *C'est une tranche verticale, pas un inventaire.*
   · **Il ne traduit pas les noms propres** — décision écrite plus haut, et elle
     vaut pour toutes les langues.
   · **Il ne dit rien des ADRESSES.** La forme des URL (`/en/`, `?lang=en`) est une
     décision de Gaëtan — elle vit dans `src/config/url-langues.js`.
   ============================================================================= */
