<template>
  <!--
    DOSSIER PROFESSIONNEL — page sobre.
    Créée le 10/09/2026 en réponse à une critique de l'audit externe : le site
    concept, avec son récit de corsaire et sa scène 3D, peut sembler
    incompatible avec ce qu'attend un acheteur public (mairie, collectivité,
    administration) — sobriété, neutralité, chiffres, périmètre, limites.

    PRINCIPE DE CETTE PAGE : aucune animation, aucun canvas, aucun effet.
    Elle doit pouvoir être imprimée, lue au clavier, comprise sans JavaScript,
    et citée dans un appel d'offres.

    Elle ne remplace pas la vitrine : elle la complète. La vitrine montre ce
    dont le studio est capable ; cette page dit ce qu'il vend, à quel prix, avec
    quelles limites.
  -->
  <div class="dossier">
    <div class="dossier__conteneur">

      <header class="dossier__entete">
        <div class="dossier__marque">
          <span class="dossier__sceau" aria-hidden="true"></span>
          <span class="dossier__nom">GL Digital Lab</span>
        </div>
        <h1 class="dossier__titre">Dossier professionnel</h1>
        <p class="dossier__sous-titre">
          Studio indépendant — systèmes multi-agents locaux, sites web et
          applications métier. Harponville, Somme (Hauts-de-France).
        </p>
        <p class="dossier__maj">Document à jour au 10 septembre 2026</p>
      </header>

      <!-- ── 1. L'ENTREPRISE ───────────────────────────────────────────── -->
      <!--
        TEXTES JURIDIQUES CORRIGÉS le 10/09/2026 (validation de Gaëtan).
        Avant : « GL Digital Lab — SASU de droit français » (statut déclaré au présent alors que
        la société n'est pas immatriculée : aucun SIREN, aucun SIRET), et « Références légales
        SIREN, SIRET, code APE et numéro de TVA : SUR DEMANDE » — une promesse impossible à tenir,
        puisque ces références n'existent pas encore.
        Après : le même contenu, sans rien affirmer de faux ni promettre ce qui n'existe pas.
        Les obligations citées viennent de la page officielle « Mentions obligatoires sur le site
        internet d'un entrepreneur » (Entreprendre Service Public, vérifiée le 31/07/2023) :
        voir modeles/juridique-textes-a-valider-2026-09-10.md dans le dépôt de l'agence.
      -->
      <section class="dossier__section" aria-labelledby="entreprise">
        <h2 id="entreprise">1. L'entreprise</h2>
        <dl class="dossier__fiche">
          <div><dt>Dénomination</dt><dd>GL Digital Lab — studio indépendant français, en cours d'immatriculation</dd></div>
          <div><dt>Dirigeant</dt><dd>Gaëtan Langlet</dd></div>
          <div><dt>Adresse</dt><dd>Harponville, Somme (80), Hauts-de-France</dd></div>
          <div><dt>Activité</dt><dd>Développement web, applications métier, intégration d'intelligences artificielles exécutées localement ou en France</dd></div>
          <div><dt>Contact</dt><dd><a href="mailto:gtn.langlet+lab@gmail.com">gtn.langlet+lab@gmail.com</a> · <a href="tel:+33686474610">06 86 47 46 10</a></dd></div>
          <div><dt>Références légales</dt><dd>Les références légales (SIREN, SIRET, code APE, numéro de TVA) figureront en pied de facture dès l'immatriculation. Aucune facture n'est émise avant.</dd></div>
        </dl>
        <p class="dossier__note">
          Un seul interlocuteur : Gaëtan Langlet, pas de sous-traitance, pas de chaîne de
          prestataires. C'est un choix, et c'est aussi une limite — elle est décrite au point 6.
        </p>
      </section>

      <!-- ── 2. PRESTATIONS ET PRIX ────────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="offres">
        <h2 id="offres">2. Prestations et prix</h2>
        <p class="dossier__chapeau">
          Prix publics, hors taxes, exprimés en euros. Ils ne sont pas
          « sur devis » : un acheteur doit pouvoir comparer avant de nous écrire.
        </p>
        <table class="dossier__table">
          <caption class="dossier__legende">Prestations, prix de référence et délais</caption>
          <thead>
            <tr>
              <th scope="col">Prestation</th>
              <th scope="col">Prix de référence</th>
              <th scope="col">Délai indicatif</th>
              <th scope="col">Livrable principal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Audit WordPress</th>
              <td>149 à 199 € HT</td>
              <td>48 heures</td>
              <td>Rapport de vulnérabilités et plan de correction chiffré</td>
            </tr>
            <tr>
              <th scope="row">Site web</th>
              <td>à partir de 2 500 € HT</td>
              <td>4 à 6 semaines</td>
              <td>Site jusqu'à 8 pages, formation à l'administration</td>
            </tr>
            <tr>
              <th scope="row">Application métier</th>
              <td>à partir de 8 000 € HT</td>
              <td>après atelier de cadrage</td>
              <td>Outil interne sur mesure, reprise de données, formation</td>
            </tr>
            <tr>
              <th scope="row">IA et automatisation locale</th>
              <td>à partir de 1 500 € HT</td>
              <td>après audit IA</td>
              <td>Prototype sur un cas d'usage réel, exécuté sur votre matériel ou le nôtre</td>
            </tr>
            <tr>
              <th scope="row">Mémoire documentaire (RAG)</th>
              <td>3 000 / 8 000 / 15 000 € HT</td>
              <td>selon volume</td>
              <td>Assistant interne répondant à partir de vos documents, réponses sourcées</td>
            </tr>
          </tbody>
        </table>
        <p class="dossier__note">
          <strong>Ce que le prix ne comprend pas, et qui doit être budgété :</strong>
          l'hébergement et le nom de domaine (frais annuels du prestataire retenu),
          les licences de composants tiers éventuels, la maintenance corrective et
          évolutive, et le temps de vos équipes pour les ateliers de cadrage et la
          recette.
        </p>
      </section>

      <!-- ── 3. MÉTHODE ────────────────────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="methode">
        <h2 id="methode">3. Méthode</h2>
        <ol class="dossier__etapes">
          <li>
            <strong>État des lieux.</strong> Audit factuel de l'existant :
            sécurité, performance, automatisation possible. Risques énoncés en
            une phrase, sans jargon.
          </li>
          <li>
            <strong>Atelier de cadrage.</strong> Périmètre, exclusions, règles
            métier, reprises de données, niveau d'exigence sécurité. C'est cet
            atelier qui fixe le prix ferme.
          </li>
          <li>
            <strong>Construction par étapes visibles.</strong> Chaque livraison
            est testable avant la suivante. Aucune mise en production sans votre
            accord écrit.
          </li>
          <li>
            <strong>Mise en route et transfert.</strong> Déploiement, formation
            de vos équipes, remise de la documentation et des accès.
          </li>
        </ol>
      </section>

      <!-- ── 4. CE QUI EST VÉRIFIABLE ──────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="preuves">
        <h2 id="preuves">4. Éléments vérifiables</h2>
        <ul class="dossier__liste">
          <li>
            <strong>ArkAdiA</strong> — réseau social souverain en production
            publique : comptes, communautés, messagerie temps réel, modération
            humaine, analyse d'audience auto-hébergée. Accessible à l'adresse
            <a class="dossier__lien" href="https://arkadia.gldigitallab.fr" target="_blank" rel="noopener noreferrer">arkadia.gldigitallab.fr</a>. <em>Preuve technique et opérationnelle.</em>
          </li>
          <li>
            <strong>ARKADIA France PvE</strong> — cluster de jeu exploité
            18 mois : 9 serveurs synchronisés, 150 joueurs, sauvegardes
            automatiques, supervision. Service arrêté depuis.
            <em>Preuve d'exploitation dans la durée.</em>
          </li>
          <li>
            <strong>Matériel identifié</strong> — les traitements d'IA sont
            exécutés sur un poste dont les caractéristiques sont publiées et
            datées. <em>Preuve de provenance des traitements.</em>
          </li>
        </ul>
        <p class="dossier__note">
          <strong>Ce que nous ne pouvons pas encore produire :</strong> des
          références clients nominatives sur des projets comparables à votre
          besoin. Le studio est récent sur ce marché et ne dispose pas encore
          d'études de cas client publiables. Nous préférons vous le dire que de
          présenter des références que vous ne pourriez pas vérifier.
        </p>
      </section>

      <!-- ── 5. DONNÉES ────────────────────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="donnees">
        <h2 id="donnees">5. Traitement des données</h2>
        <ul class="dossier__liste">
          <li>
            <strong>Analyse d'audience</strong> : Matomo installé sur notre
            hébergement, en France. Aucun outil d'analyse tiers, aucun traceur
            publicitaire.
          </li>
          <li>
            <strong>Formulaire de contact</strong> : traité par un script hébergé
            sur notre serveur, en France. Aucun transfert de données hors de
            l'Union européenne.
          </li>
          <li>
            <strong>Traitements d'IA</strong> : exécutés sur le poste du studio ou
            sur votre matériel. Ce qui sort et ce qui ne sort pas est décrit
            précisément dans la politique de confidentialité, sans formule
            absolue.
          </li>
          <li>
            <strong>Conservation</strong> : les données de contact sont
            conservées 3 ans à compter du dernier échange.
          </li>
        </ul>
        <p class="dossier__note">
          Nous n'employons pas les formulations du type « vos données ne quittent
          jamais votre réseau » : elles sont trop absolues pour être tenues dans
          tous les cas de figure. Chaque flux est décrit au cas par cas.
        </p>
      </section>

      <!-- ── 6. LIMITES ASSUMÉES ───────────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="limites">
        <h2 id="limites">6. Limites assumées</h2>
        <p class="dossier__chapeau">
          Cette section existe parce qu'un prestataire qui n'énonce pas ses
          limites vous oblige à les découvrir vous-même.
        </p>
        <ul class="dossier__liste">
          <li>
            <strong>Un seul interlocuteur.</strong> En cas d'indisponibilité
            prolongée du dirigeant, l'activité s'interrompt. Aucun plan de
            continuité n'est aujourd'hui formalisé. Pour un projet critique,
            c'est un facteur à prendre en compte.
          </li>
          <li>
            <strong>Une seule machine de calcul.</strong> La capacité de
            traitement est celle d'un poste de travail, pas d'une infrastructure
            industrielle. Elle convient à des traitements documentaires et à des
            agents internes ; elle ne convient pas à une charge concurrente
            élevée.
          </li>
          <li>
            <strong>Pas de haute disponibilité.</strong> Les traitements exécutés
            localement dépendent d'un poste allumé. Aucun engagement de
            disponibilité 24/7 n'est proposé.
          </li>
          <li>
            <strong>Pas de conformité RGAA revendiquée.</strong> Les livrables
            visent le niveau WCAG AA, vérifié par mesure sur les pages que nous
            produisons, mais nous ne délivrons pas d'attestation de conformité
            RGAA ni d'audit par un tiers.
          </li>
          <li>
            <strong>Volume de projets simultanés limité.</strong> Le studio
            conduit un petit nombre de projets en parallèle. Ce point est
            arbitré au cadrage, pas découvert en cours de route.
          </li>
        </ul>
      </section>

      <!-- ── 7. POUR ENGAGER ───────────────────────────────────────────── -->
      <section class="dossier__section" aria-labelledby="contact">
        <h2 id="contact">7. Pour engager</h2>
        <ol class="dossier__etapes">
          <li>Vous écrivez ou appelez, en décrivant le besoin en quelques lignes.</li>
          <li>Nous convenons d'un premier échange de 30 minutes, gratuit et sans engagement.</li>
          <li>Vous recevez sous 24 heures une première lecture : ce qui est faisable, ce qui ne l'est pas, et une fourchette de prix.</li>
          <li>Si le projet se poursuit, l'atelier de cadrage fixe le périmètre et le prix ferme.</li>
        </ol>
        <p class="dossier__contact">
          <a class="dossier__lien" href="mailto:gtn.langlet+lab@gmail.com">gtn.langlet+lab@gmail.com</a><br>
          <a class="dossier__lien" href="tel:+33686474610">06 86 47 46 10</a>
        </p>
        <p class="dossier__note">
          Ce dossier est aussi disponible en version imprimable : utilisez
          l'impression de votre navigateur, la mise en page est prévue pour le
          papier.
        </p>
      </section>

    </div>
  </div>
</template>

<script setup>
/**
 * Page volontairement SANS script : aucun état, aucun effet, aucune animation.
 * Elle doit rester lisible et imprimable même si JavaScript est désactivé.
 */
</script>

<style scoped>
.dossier {
  /* Fond opaque : aucun canvas animé ne passe derrière cette page. */
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.5rem 6rem;
}

.dossier__conteneur {
  max-width: 62rem;
  margin: 0 auto;
}

.dossier__entete {
  border-bottom: 2px solid var(--rule-strong);
  padding-bottom: 1.5rem;
  margin-bottom: 3rem;
}

.dossier__marque {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
}

.dossier__sceau {
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  flex: none;
}
.dossier__sceau::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  transform: translate(-50%, -50%);
  background: var(--accent);
  border-radius: 50%;
}

.dossier__nom {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
}

.dossier__titre {
  font-size: clamp(1.9rem, 5vw, 2.9rem);
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.dossier__sous-titre {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 68ch;
}

.dossier__maj {
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.dossier__section {
  margin-bottom: 3rem;
}

.dossier__section h2 {
  font-size: clamp(1.25rem, 3vw, 1.6rem);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--rule);
}

.dossier__chapeau {
  color: var(--ink-soft);
  line-height: 1.7;
  margin-bottom: 1.25rem;
  max-width: 70ch;
}

.dossier__fiche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0 2rem;
}

.dossier__fiche > div {
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--rule);
}

.dossier__fiche dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  margin-bottom: 0.25rem;
}

.dossier__fiche dd {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.55;
}

.dossier__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.dossier__legende {
  caption-side: top;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  padding-bottom: 0.6rem;
}

.dossier__table th,
.dossier__table td {
  text-align: left;
  vertical-align: top;
  padding: 0.7rem 0.9rem 0.7rem 0;
  border-bottom: 1px solid var(--rule);
}

.dossier__table thead th {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  border-bottom-color: var(--rule-strong);
}

.dossier__table tbody th {
  color: var(--ink);
  font-weight: 600;
}

.dossier__table tbody td {
  color: var(--ink-soft);
}

.dossier__liste,
.dossier__etapes {
  padding-left: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dossier__liste li,
.dossier__etapes li {
  color: var(--ink-soft);
  line-height: 1.7;
  max-width: 72ch;
}

.dossier__liste strong,
.dossier__etapes strong {
  color: var(--ink);
}

.dossier__note {
  margin-top: 1.25rem;
  padding: 0.9rem 1.1rem;
  border-left: 3px solid var(--alert);
  background: var(--paper-alt);
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--ink-soft);
  max-width: 76ch;
}

.dossier__note strong {
  color: var(--ink);
}

.dossier__contact {
  margin-top: 1.5rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  line-height: 1.9;
}

.dossier__lien {
  color: var(--accent);
}

.dossier__lien:hover,
.dossier__lien:focus-visible {
  color: var(--action);
}

/* ── Impression : la page doit sortir proprement sur papier ── */
@media print {
  .dossier {
    padding: 0;
    background: #fff;
    color: #000;
  }
  .dossier__sous-titre,
  .dossier__fiche dd,
  .dossier__chapeau,
  .dossier__liste li,
  .dossier__etapes li,
  .dossier__table tbody td {
    color: #000;
  }
  .dossier__section {
    break-inside: avoid;
  }
  .dossier__section h2 {
    border-bottom-color: #999;
  }
  .dossier__note {
    background: #f2f2f2;
    border-left-color: #666;
  }
}
</style>
