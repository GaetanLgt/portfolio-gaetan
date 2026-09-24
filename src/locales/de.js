/* =============================================================================
   de.js — L'ALLEMAND, ET C'EST LE BANC D'ESSAI
   =============================================================================

   ⭐ POURQUOI CETTE LANGUE D'ABORD, ET PAS UNE AUTRE.
   La consigne du 23/09/2026 le dit : « L'allemand est le banc d'essai. » Ses mots
   composés n'ont pas de limite — `Rechtsschutzversicherungsgesellschaften` fait
   39 lettres — donc **c'est la langue qui casse une mise en page** si elle doit
   casser. *Éprouver une chaîne sur la langue la plus douce ne prouve rien.*

   ⛔ CE QUE CE FICHIER EST, ET CE QU'IL N'EST PAS
   -----------------------------------------------------------------------------
   · **Il est la traduction de `fr.js`, clé par clé** — ni une clé de plus, ni une
     de moins. `scripts/verifier-langues.mjs` refuse le fichier dans les deux cas.
   · ⚠️ **Il n'est PAS validé par un locuteur.** Une machine a compté les clés, elle
     ne les a pas lues. *Une traduction fausse passe cette porte — et aucune machine
     ne peut la juger.* **À faire relire avant toute mise en ligne.**

   ⭐ LES NOMS PROPRES NE SONT PAS ICI, et c'est la règle de `fr.js` : `Wa Router`,
   `Makoto Scanner`, `Dou Monitor`, `Watashi Knowledge Base`, `Jitsu Pipeline`,
   `SEO Content Generator` et `Invoice Generator` restent tels quels.
   *Traduire un nom d'outil, c'est le rendre introuvable.*

   ⚠️ ET LE DÉCOUPAGE DE `apps.note*` EST CONSERVÉ — CE N'EST PAS UN DÉTAIL.
   Le composant assemble `noteAvant` + `<strong>noteFort</strong>` + `noteApres`.
   ⇒ Le texte fort est **`bei uns`**, et `noteApres` commence par ce qui le suit.
   *Le découpage est une contrainte de rendu, pas une commodité de traduction.*

   @author Génie IT Tek FR
   @version 1.0.0
   ============================================================================= */

export default {
  /* ── L'HABILLAGE DE LA PAGE ─────────────────────────────────────────────── */
  apps: {
    badge: 'ANWENDUNGEN',
    titreAvant: 'Die Werkzeuge der',
    /* ⚠️ `MANNSCHAFT` EST LE MOT LE PLUS LONG DE CETTE PAGE, ET C'EST VOULU :
       c'est le titre principal. S'il doit déborder quelque part, c'est ici — et
       le banc d'essai allemand est fait pour le montrer, pas pour le cacher. */
    titrePrincipal: 'MANNSCHAFT',
    chapeau:
      'Die Anwendungen, die das Studio nutzt und zeigt. Jede ist ein echtes ' +
      'Werkzeug, ohne überzogene Versprechen beschrieben — einschließlich dessen, ' +
      'was sie nicht tut.',
    sectionTitre: 'Unsere Anwendungen',
    noteAvant: 'Diese Werkzeuge laufen ',
    noteFort: 'bei uns',
    noteApres:
      '. Keines davon ist ein Onlinedienst, den Sie abonnieren: sie dienen der ' +
      'Erstellung der Leistungen des Studios.',
  },

  /* ── LES RÔLES DES APPLICATIONS ─────────────────────────────────────────── */
  appsRole: {
    wa: 'Multi-Agent-Orchestrierung',
    makoto: 'Sicherheitsaudit',
    dou: 'Systemüberwachung',
    watashi: 'Wissensdatenbank',
    jitsu: 'CI/CD-Generator',
    seo: 'Optimierter Inhalt',
    facture: 'Angebote und Rechnungen',
  },

  /* ── LES DESCRIPTIONS ───────────────────────────────────────────────────── */
  appsDesc: {
    wa: 'Leitet eine Anfrage an das richtige Werkzeug der Mannschaft weiter und sammelt die Antworten.',
    makoto:
      'Erhebt die Schwachstellen eines Projekts und seiner Abhängigkeiten, mit dem ' +
      'Detail jedes Befunds.',
    dou:
      'Überwacht die Dienste und Messwerte der Maschine: Ports, Prozesse, ' +
      'Verfügbarkeit.',
    watashi:
      'Indexiert Dokumente und antwortet mit Belegen, verankert in den gelieferten Quellen.',
    jitsu:
      'Erzeugt Konfigurationen für die kontinuierliche Integration bei GitHub Actions ' +
      'und GitLab CI.',
    seo:
      'Verfasst und strukturiert Inhalte unter Einhaltung der Regeln der technischen ' +
      'Suchmaschinenoptimierung.',
    facture: 'Erzeugt die kaufmännischen Dokumente des Studios aus einer Vorlage.',
  },
};

/* =============================================================================
   ⚠️ CE QUE CE FICHIER NE DIT PAS
   -----------------------------------------------------------------------------
   · **Il ne couvre que la page des applications** — la tranche verticale. Les
     3 095 chaînes du site restent à extraire. *C'est une tranche, pas un inventaire.*
   · **Il ne dit rien de la forme des adresses** (`/de/`, `?lang=de`) : c'est
     `src/config/url-langues.js`, et la décision est à Gaëtan.
   · ⚠️ **Il ne remplace pas une relecture humaine.** *Les mots composés allemands
     se forgent ; un mot forgé de travers se lit, et se comprend de travers.*
   ============================================================================= */
