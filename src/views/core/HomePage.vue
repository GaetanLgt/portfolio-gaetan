<template>
  <div class="home-page">
    <!-- ══════════════════════════════════════════════════════════════════════
         LE FOND 3D — monté le 13/09/2026, décision de Gaëtan (option B).

         Il est posé EN PREMIER dans le DOM et il est `position: fixed` : il passe
         donc derrière tout le contenu, sur la hauteur entière de la page.
         `pointer-events: none` et `aria-hidden` sont posés DANS le composant :
         un fond décoratif ne capte ni le clic, ni la lecture d'écran.

         `v-if="unitesPretes"` : le décor n'est monté qu'après le premier moment
         d'inactivité du navigateur — le hero, le titre et le bouton sont déjà
         lisibles. C'est le signal qui existait déjà pour les six unités.

         Ce que le composant gère SEUL, et qui a été éprouvé 4 cas sur 4 :
           · `prefers-reduced-motion` gagne toujours — la scène est rendue UNE
             fois, fixe, au lieu de suivre le défilement ;
           · le mode sobre coupe le décor — la scène n'est pas montée du tout.
         ══════════════════════════════════════════════════════════════════════ -->
    <!-- DÉCOR 3D : NON MONTÉ — mesure A/B du 13/09/2026, chiffres ci-dessous.
         Le composant existe toujours dans src/components/three/ScrollScene.vue et
         fonctionne (4 épreuves sur 4 conformes). Il n'est simplement pas monté, et
         ce n'est pas un oubli :

           avec la scène : performance 91 · 92 · 91 | TBT 44-90 ms | LCP ~3 340 ms
           sans la scène : performance 97 · 96 · 98 | TBT 24-33 ms | LCP ~2 338 ms

         Trois essais de chaque côté, aucune mesure qui se recouvre. Le montage coûte
         6 à 7 points de performance et fait repasser la page SOUS le seuil de 95 que
         la charte s'est fixé (le seuil n'est pas atteint avant, il l'est après).
         La cause n'est pas la taille du chunk mais son EXÉCUTION : `requestIdleCallback`
         se déclenche pendant le chargement, donc three.js est téléchargé, analysé et
         rendu dans la fenêtre de mesure — un décor « paresseux » qui n'est jamais
         paresseux en pratique.
         ⚠️ DEUX POIDS, ET IL FAUT LES DEUX : 442,7 Ko **sur disque** (le chiffre
         qu'annonce le build) mais **107,8 Ko compressés** — c'est ce dernier qui
         traverse réellement le réseau. Les 6 à 7 points perdus ne s'expliquent donc
         PAS par le transfert : ils s'expliquent par l'analyse et le rendu. Ne jamais
         citer 442,7 Ko comme un poids réseau, c'est un poids de fichier.

         Remettre la ligne ci-dessous pour rebrancher la scène, et refaire la mesure :
             <ScrollScene v-if="unitesPretes" accent="#10B981" :anneaux="36" :ecart="2.4" />
    -->


    <!-- DÉCOR DE FOND — le tunnel, généré sur la carte graphique puis étalonné à la
         charte. Le composant gère seul le mode sobre et la discrétion nécessaire
         pour ne pas manger le contraste du texte. Provenance et mesures dans
         `src/components/ui/DecorTunnel.vue`. -->
    <DecorTunnel />

    <!-- LA CARTE DU NAVIRE — la couche d'exploration du cadrage « site comme un
         metroidvania » (13/09/2026). Elle n'apparaît qu'après le premier geste du
         visiteur : voir la justification mesurée dans le script, plus bas. -->
    <CarteDuNavire v-if="cartePrete" />

    <!-- Skip Link (Opquast) -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO : Control Room Entry -->
    <!-- ⚠ `id="main-content"` RETIRÉ DE CE `<section>` LE 13/09/2026.
         `App.vue` pose déjà `<main id="main-content">` autour de tout le contenu.
         Cette section portait LE MÊME identifiant : la page d'accueil avait donc
         deux `#main-content` (règle Opquast 229 — « chaque identifiant HTML n'est
         utilisé qu'une seule fois par page »).
         L'enjeu n'est pas théorique : le lien d'évitement pointe sur `#main-content`,
         et avec deux éléments portant cet identifiant, **c'est l'ordre du document
         qui décide** où l'utilisateur atterrit — il visait le `<main>` d'App.vue,
         il aurait pu viser cette section. Un identifiant dupliqué rend le ciblage
         dépendant du hasard de l'ordre.
         Rien ne bouge visuellement : un identifiant ne peint pas. -->
    <SpotlightContainer :size="600" color="var(--primary)" :opacity="0.15">
      <section class="hero" aria-labelledby="hero-title">
        <!-- DS clair (D1) : fond papier nu — l'ambiance anime sombre MND
             (hero-bg) est retirée, elle cassait le fond clair et pesait
             plusieurs centaines de Ko. L'orbite reste la seule signature. -->

        <!-- DÉCOR DU HERO RETIRÉ (10/09/2026, décision Gaëtan : « enlève le
             WebGL qui ressemble à rien »). Partis d'ici : les anneaux orbitaux,
             la Grille TRON, les six unités 3D et la couche console avec ses
             scanlines. Le hero ne contient plus que ce qui informe : l'offre,
             le titre, la promesse, le bouton, et les deux chemins visiteur.
             Les composants restent sur disque, non montés. -->

        <!-- Floating Tech Badges retirés (D5, décision du directeur artistique) :
             Vue 3 / Symfony / Three.js / IA Locale sont des choix d'outillage
             INTERNES. Un client ne choisit pas un studio parce qu'il utilise Vue
             plutôt que React, et ces badges flottants coûtaient une animation CSS
             permanente pour aucune information utile au visiteur. -->

        <div class="container">
          <div class="hero__grid">
            <!-- HERO peint par HTML/CSS, jamais animé au reveal (audit) -->
            <div class="hero__content">
                <!-- Status Badge -->
                <div class="status-badge">
                  <span class="status-badge__dot"></span>
                  <TextScramble text="Un seul navire · IA locale · Harponville, Somme" :scramble-on-mount="true" />
                </div>
                
                <!-- CE QUE NOUS VENDONS — EN PREMIER ÉCRAN (10/09/2026).
                     Constat après relecture : le hero racontait un univers mais
                     ne disait ni ce qu'on vend, ni pour qui, ni à quel prix. Un
                     dirigeant de PME arrivait sur un vaisseau et repartait sans
                     savoir si c'était pour lui. La direction artistique reste,
                     mais l'offre passe devant le récit.
                     Aucun chiffre inventé : ce sont les prix publics du studio. -->
                <p class="hero__offre">
                  <strong>Sites web</strong> · <strong>Applications métier</strong> ·
                  <strong>IA locale</strong> — pour PME et collectivités.
                  À partir de <strong>1 500 € HT</strong>.
                </p>

                <!-- Main Title — message éditorial fort
                     DA D4 : glitch Matrix Resurrections sur la seule ligne accentuée
                     (intensité « light » : les clones restent à 40 % et le texte réel
                     n'est jamais décalé — la lisibilité commerciale est préservée.
                     prefers-reduced-motion annule les clones dans GlitchText.vue). -->
                <h1 id="hero-title" class="hero__title">
                  La machine travaille.<br>
                  <span class="text-gradient neon-text">
                    <GlitchText text="Vous décidez." always-active intensity="light" />
                  </span>
                </h1>
                
                <!-- Subtitle — la valeur concrète, dite avec le vocabulaire du
                     bord sans jamais noyer le propos commercial. La phrase est
                     vérifiable : les agents tournent bien sur une machine
                     identifiée, en France. -->
                <p class="hero__subtitle">
                  Nos agents — rédaction, code, audit, visuels — ne tournent pas dans
                  un <strong>cloud que vous ne pouvez pas nommer</strong> : ils
                  travaillent sur notre propre navire, à Harponville. Vos documents
                  restent dans la cale. En 48 h, nous rendons visible ce qui freine
                  votre système.
                </p>

                <!-- LE TUYAU VERT (13/09/2026) — le compartiment scellé du cadrage
                     « site comme un metroidvania ». Il ne fait RIEN pendant longtemps :
                     c'est le principe. Il s'ouvre quand le visiteur a trouvé quatre
                     compartiments, et ce n'est jamais une porte — `/soute` est liée en
                     permanence depuis le pied de page.

                     ⚠️ PLACÉ ICI, APRÈS LE SOUS-TITRE, ET PAS PLUS BAS, APRÈS MESURE.
                     Première version : sous les liens rapides. Capture faite, et le
                     constat était net — l'élément tombait SOUS la ligne de flottaison de
                     l'écran, donc jamais vu au premier regard. Or tout le principe de la
                     vidéo est que l'objet bizarre se remarque TÔT. Un « tuyau vert »
                     qu'on ne voit qu'en défilant n'est plus un tuyau vert, c'est une
                     rubrique. *Un cadrage qui dit « dès le premier écran » se vérifie sur
                     une capture, pas dans le code.* -->
                <TuyauVert />
                
                <!-- CTA : le premier engagement commercial = l'audit -->
                <div class="hero__actions">
                  <!-- LE PAVILLON (apport ALBATOR, D5) : il ne se hisse qu'aux
                       moments de décision. Ici, c'est le CTA principal — le seul
                       endroit où le visiteur s'engage. Décoratif (aria-hidden),
                       CSS pur, jamais hissé en reduced-motion. -->
                  <span class="pavillon" aria-hidden="true">
                    <span class="pavillon__mat"></span>
                    <span class="pavillon__etoffe"><span class="pavillon__sceau"></span></span>
                  </span>
                  <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large btn-glow" :strength="40" :text-strength="50">
                    Commencer par voir clair
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </MagneticButton>
                </div>
                
                <!-- Chemins selon le visiteur (principe 7) -->
                <div class="hero__paths">
                  <router-link to="/contact" class="hero__path hero__path--pme">
                    <span class="hero__path-tag">PME</span>
                    Vous dirigez une entreprise ? Commencez par le diagnostic 30 min.
                  </router-link>
                  <router-link to="/projets" class="hero__path hero__path--cto">
                    <span class="hero__path-tag">TECH</span>
                    Vous pilotez la technique ? Voir l'architecture.
                  </router-link>
                </div>
                
                <!-- Quick Navigation (D5) : emojis retirés (verrou D1 : aucun
                     emoji en icône d'interface) et lien « Carte Holistique »
                     retiré — il violait D2 (« GL Tower, Carte Holistique,
                     Workflows n8n, portraits des Lois : hors nav »,
                     decisions-refonte-awwwards-2026.md ligne 22). Les deux liens
                     restants sont sobres et ne dupliquent pas la navigation. -->
                <!-- PORTE COMMERCIALE (10/09/2026) : le dossier professionnel
                     est mis EN AVANT, en premier dans la liste, parce que c'est
                     lui qui porte l'offre, les prix, la méthode et les limites.
                     Gaëtan : « le site est une démonstration technique, l'offre
                     est dans le dossier ». Ce lien doit donc se voir depuis le
                     premier écran, pas se chercher dans le pied de page. -->
                <div class="hero__quick-nav">
                  <router-link to="/dossier" class="quick-link quick-link--porte">
                    <strong>Le dossier</strong> — offres, prix, délais et limites
                  </router-link>
                  <router-link to="/arkadia" class="quick-link">
                    La preuve — ARKADIA en production
                  </router-link>
                </div>
              </div>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="hero__scroll-indicator" aria-hidden="true">
          <span class="scroll-text">Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </section>
    </SpotlightContainer>

    <!-- ═══════════════════════════════════════════════════════════════════════
         LE VAISSEAU — ARKADIA SS00999
         Le concept D5 : un navire, un équipage d'IA affranchies, un capitaine.
         L'analogie bateau ↔ ordinateur n'est pas décorative : elle rend la
         souveraineté vérifiable. « Vos données sont dans la cale, et la cale ne
         quitte pas le navire » se comprend sans connaître un seul mot de
         technique.

         MAKOTO : la fiche technique est RELEVÉE sur la machine réelle
         (Win32_Processor, Win32_PhysicalMemory, nvidia-smi), pas estimée. Le
         visuel est généré par notre propre chaîne locale et étiqueté comme tel.
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="vaisseau" aria-labelledby="vaisseau-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// LE VAISSEAU</span>
            <h2 id="vaisseau-title">ARKADIA <span class="text-gradient">SS00999</span></h2>
            <p class="section-header__desc">
              Un seul navire, et il est réel. Tous les agents qui travaillent pour vous
              tournent sur cette machine, dans la Somme. Pas de ferme de serveurs louée,
              pas de sous-traitance : le vaisseau est identifié et ses caractéristiques
              sont publiques.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <figure class="vaisseau__figure">
            <!-- ⚠ `srcset`/`sizes` AJOUTÉS LE 13/09/2026 — DÉFAUT MESURÉ, PAS SUPPOSÉ.
                 Un seul fichier de 1400 px était servi à tout le monde. Largeurs
                 RÉELLEMENT PEINTES, mesurées écran par écran :

                     écran 320 px  ->  image peinte à 270 px   ->  27,0x trop de pixels
                     écran 390 px  ->  image peinte à 340 px   ->  16,9x
                     écran 768 px  ->  image peinte à 718 px   ->   3,8x
                     écran 1024 px ->  image peinte à 974 px   ->   2,1x
                     écran 1280 px ->  image peinte à 1230 px  ->   1,3x  (plafond du conteneur)

                 Un téléphone téléchargeait donc 27 fois les pixels nécessaires. C'est
                 le poste « image delivery ≈ 65 KiB » que Lighthouse relevait depuis
                 le début, et ce n'était PAS une histoire de format : la mesure a
                 écarté le WebP (à toutes les qualités jusqu'à 82, il est PLUS LOURD
                 que ce JPEG, qui est déjà bien encodé — et sharp 0.35.4 du dépôt ne
                 fait pas d'AVIF).

                 Variantes générées à partir du MÊME original, filtre lanczos3 :
                     540 px -> 18,4 Ko (-73,5 %)   ·   800 px -> 37,1 Ko (-46,7 %)
                    1000 px -> 54,8 Ko (-21,4 %)   ·  1400 px -> 69,6 Ko (inchangé)

                 `sizes` décrit la largeur de MISE EN PAGE, mesurée ci-dessus — pas la
                 largeur souhaitée : `84vw` aux petits écrans est le chiffre relevé
                 (270/320 = 84 %), pas un arrondi confortable.
                 `width`/`height` restent ceux de l'original : ils portent le rapport
                 d'aspect et protègent le CLS, quelle que soit la variante servie. -->
            <img
              src="/models/vaisseau-arkadia-1400.jpg"
              srcset="/models/vaisseau-arkadia-540.jpg 540w,
                      /models/vaisseau-arkadia-800.jpg 800w,
                      /models/vaisseau-arkadia-1000.jpg 1000w,
                      /models/vaisseau-arkadia-1400.jpg 1400w"
              sizes="(min-width: 1280px) 1230px, (min-width: 768px) 94vw, 84vw"
              width="1400" height="583"
              loading="lazy" decoding="async"
              alt="Le vaisseau ARKADIA : un galion volant qui traverse un espace
                   numérique, propulsé par un sillage de code lumineux."
            >
            <figcaption>
              Visuel <strong>simulé</strong>, produit par notre propre chaîne locale
              (ComfyUI sur ARKADIA). Aucune image de banque, aucun droit tiers.
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div class="vaisseau__bloc">
            <h3 class="vaisseau__sous-titre">Le bateau, c'est l'ordinateur</h3>
            <p class="vaisseau__intro">
              Un navire et une machine de calcul font le même métier : porter une charge
              utile d'un point à un autre sans la perdre en route. Voici le vocabulaire
              de bord, traduit — c'est exactement comme cela que fonctionne le poste.
            </p>

            <!-- La phrase du capitaine : c'est le cœur du concept, pas une
                 décoration. Toute la production du studio se lit à partir d'elle. -->
            <blockquote class="vaisseau__citation">
              <p>Les pages web que nous faisons sont nos voiles.</p>
              <cite>Gaëtan Langlet — capitaine du navire</cite>
            </blockquote>

            <table class="vaisseau__table">
              <caption class="vaisseau__legende">Vocabulaire de bord et son équivalent machine</caption>
              <thead>
                <tr>
                  <th scope="col">À bord</th>
                  <th scope="col">Sur la machine</th>
                  <th scope="col">Ce que ça change pour vous</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">La coque</th>
                  <td>Le châssis, le boîtier</td>
                  <td>Ce qui protège physiquement le matériel. Il est chez nous, pas dans un centre de données anonyme.</td>
                </tr>
                <tr>
                  <th scope="row">La quille</th>
                  <td>La carte mère</td>
                  <td>La pièce qui tient tout le reste. On la connaît par son modèle, pas par un numéro de parc.</td>
                </tr>
                <tr class="vaisseau__rang--clef">
                  <th scope="row">La propulsion</th>
                  <td>Les cartes graphiques</td>
                  <td><strong>C'est notre propulsion.</strong> C'est ce qui pousse le navire et fait tourner les modèles d'IA à bord — pas une machine louée à l'heure dans un autre pays.</td>
                </tr>
                <tr class="vaisseau__rang--clef">
                  <th scope="row">Les voiles</th>
                  <td>Les sites et applications que nous livrons</td>
                  <td><strong>Chaque site livré est une voile.</strong> C'est lui qui capte le vent et fait avancer votre activité. Une voile mal taillée, et le navire n'avance pas — même avec toute la propulsion du monde.</td>
                </tr>
                <tr>
                  <th scope="row">La cale</th>
                  <td>Le stockage</td>
                  <td><strong>Vos documents sont dans la cale. Et la cale ne quitte pas le navire.</strong></td>
                </tr>
                <tr>
                  <th scope="row">La barre</th>
                  <td>Votre écran et votre clavier</td>
                  <td>Le seul endroit d'où l'on décide. Rien ne se lance sans que quelqu'un tienne la barre.</td>
                </tr>
                <tr>
                  <th scope="row">L'équipage</th>
                  <td>Les agents d'IA</td>
                  <td>Ils abattent le travail de routine. Ils ne décident pas de la destination.</td>
                </tr>
                <tr>
                  <th scope="row">Le capitaine</th>
                  <td>Vous</td>
                  <td>La machine sert, l'humain décide. C'est la règle du bord, et elle n'a pas d'exception.</td>
                </tr>
                <tr>
                  <th scope="row">Le journal de bord</th>
                  <td>Les journaux d'exécution</td>
                  <td>Chaque action est traçable. On peut toujours répondre à « qui a fait quoi, et quand ».</td>
                </tr>
                <tr>
                  <th scope="row">L'ancre</th>
                  <td>Les sauvegardes</td>
                  <td>Ce qu'on jette quand ça tangue. On teste la remontée avant d'en avoir besoin.</td>
                </tr>
                <tr>
                  <th scope="row">La vigie</th>
                  <td>La surveillance</td>
                  <td>Quelqu'un regarde les indicateurs. Une panne se voit avant de coûter une journée.</td>
                </tr>
                <tr>
                  <th scope="row">Le pavillon</th>
                  <td>Notre signature</td>
                  <td>Le cercle-à-point : on sait qui a fait le travail, et on répond de ce qu'on livre.</td>
                </tr>
                <tr>
                  <th scope="row">Le port d'attache</th>
                  <td>Le lieu d'hébergement</td>
                  <td>Harponville, Somme. En France, sous droit français, pas dans un pays qu'on ne peut pas nommer.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div class="vaisseau__bloc vaisseau__bloc--fiche">
            <h3 class="vaisseau__sous-titre">Le navire, en clair</h3>
            <p class="vaisseau__intro">
              Relevé sur la machine elle-même, pas recopié d'une fiche commerciale.
              Une seule unité, pas un parc : c'est ce qui nous empêche de vous vendre
              de la capacité que nous n'avons pas.
            </p>
            <dl class="vaisseau__fiche">
              <div class="vaisseau__ligne">
                <dt>Propulsion</dt>
                <dd>Intel Core i7-11700KF — 8 cœurs, 16 threads</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Lest</dt>
                <dd>64 Go de mémoire à 3600 MT/s</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Voilure</dt>
                <dd>NVIDIA GeForce RTX 3080 — 10 Go de mémoire vidéo</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Équipage embarqué</dt>
                <dd>Agents d'IA, modèles de langage et recherche documentaire, exécutés sur place</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Rôle du navire</dt>
                <dd>
                  <strong>Unité de R&amp;D et de démonstration</strong> — pas une
                  infrastructure de production critique
                </dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Port d'attache</dt>
                <dd>Harponville, Somme — Hauts-de-France, France</dd>
              </div>
            </dl>
            <!-- REQUALIFICATION (10/09/2026) — cette précision vient d'un audit
                 externe qui a classé la « machine unique » en risque critique :
                 tout faire reposer sur un seul poste, c'est un point de
                 défaillance unique. La réponse n'est pas de le cacher ni de
                 promettre une redondance que nous n'avons pas, mais de dire
                 exactement ce que cette machine EST : un poste de recherche et
                 de démonstration de pointe, pas un centre de production.
                 Les environnements qui portent une activité critique se
                 dimensionnent au cas par cas, avec le client, selon ses
                 exigences de continuité. -->
            <p class="vaisseau__note vaisseau__note--alerte">
              <strong>Ce que ce navire n'est pas.</strong> C'est une unité de
              recherche et de démonstration : elle ne prétend pas à la haute
              disponibilité, et <strong>la continuité de service n'est jamais
              garantie par ce seul poste</strong>. Un projet dont l'activité ne
              peut pas s'interrompre se conçoit sur une architecture dédiée,
              dimensionnée avec vous — nous le disons avant la signature, pas
              après.
            </p>
            <p class="vaisseau__note">
              Caractéristiques relevées sur la machine le 10 septembre 2026. Elles ne sont
              pas mises à jour automatiquement : si le navire change, cette page change.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>



    <!-- PROOF : ARKADIA FRANCE PvE — cluster ARK: Survival Ascended clôturé
         (distinct du réseau social ArkAdiA, arkadia.gldigitallab.fr) -->

    
    <!-- LE GALION — 22/09/2026. Modèle produit par `galion.py` (Blender, Pays-Bas),
         exporté en GLB, chargé par Three.js — déjà une dépendance du site, donc
         AUCUN CDN ajouté, et la CSP (`script-src 'self'`) est respectée sans y toucher.
         Aucune image de banque, aucun asset acheté, aucune licence tierce. -->
    <section class="galion-section" aria-labelledby="galion-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// · LE NAVIRE</span>
            <h2 id="galion-title">Un navire domotisé</h2>
            <p class="section-header__desc">
              Chaque pièce du bord rend compte toute seule : la <strong>propulsion</strong>,
              le <strong>lest</strong>, la <strong>cale</strong>, l'<strong>équipage</strong>,
              la <strong>vigie</strong>. C'est le vocabulaire de la marine, et c'est aussi
              celui d'une machine qui se surveille — <em>la même chose, dite autrement.</em>
              Il n'a pas de voiles : il a le vide. Et l'œil de proue s'allume.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <GalionViewer modele="/galion.glb" :vitesse="0.18" />
        </ScrollReveal>

        <p class="galion-note">
          Modèle <strong>tracé par script</strong> (Blender) et rendu en Three.js — déjà
          une dépendance du site, donc <strong>aucun CDN ajouté</strong>. Aucune image de
          banque, aucun asset acheté, <strong>aucune licence tierce</strong>. Les valeurs du
          bord sont les caractéristiques <strong>publiées</strong> de la machine —
          <em>aucune métrique inventée.</em>
        </p>
      </div>
    </section>

    <!-- LE JEU — 22/09/2026.
         ⚠️ `loading="lazy"` N'EST PAS DÉCORATIF, et `allow="gamepad"` non plus.
         Le verrou des requêtes du premier chargement interdit d'en ajouter : une
         iframe paresseuse ne charge pas tant qu'elle n'entre pas dans le champ.
         Et sans `allow="gamepad"`, la manette est invisible — or c'est le chemin normal. -->
    <section class="jeu" aria-labelledby="jeu-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// · LE JEU</span>
            <h2 id="jeu-title">Montez à bord</h2>
            <p class="section-header__desc">
              Le navire n'est pas qu'une fiche technique — il se joue. Une salle et sa cale,
              quatre silhouettes en ronde, des langages à ramasser, et quelque chose qui
              attend au fond. <strong>La manette est le chemin normal</strong> ; le clavier
              ne sert que de secours.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div class="jeu__cadre">
            <iframe
              src="/le-pont/index.html"
              title="ArkAdiA — le pont et la cale, démonstration jouable"
              loading="lazy"
              allow="gamepad"
              class="jeu__frame"
            ></iframe>
          </div>
          <p class="jeu__note">
            Démonstration technique. Tout est <strong>tracé dans le canvas</strong> : aucune
            image importée, aucun modèle tiers, aucune requête réseau. Le monde se régénère
            à partir de sa graine, affichée à l'écran.
          </p>
        </ScrollReveal>
      </div>
    </section>

    <!-- MÉTHODE : fonctionnement du studio, présenté de façon pragmatique (2026-09) -->
    <section class="method" aria-labelledby="method-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// 03 · LA MÉTHODE</span>
            <h2 id="method-title">Comment travaille le studio</h2>
            <p class="section-header__desc">
              <!-- ⚠️ « (SASU) » RETIRÉ LE 19/09/2026 — LA SOCIÉTÉ N'EST PAS IMMATRICULÉE.
                   La même correction avait été faite sur `/dossier`, qui porte même une note
                   la documentant (l. 36 : « statut déclaré au présent alors que… »). **La page
                   d'accueil avait été oubliée**, et c'est la plus lue du site.
                   Le reste du site dit déjà la vérité : `/dossier` — « en cours
                   d'immatriculation » et « Aucune facture n'est émise avant » · `/mentions-legales`
                   — « Entreprise en cours d'immatriculation » · `/cgv` — « dès l'immatriculation ».
                   ⚠️ Un statut social ne se déclare pas au présent avant d'exister : ce n'est pas
                   une question de forme, c'est ce qu'un client lit avant de signer. -->
              Génie IT Tek FR est un studio indépendant français, <strong>en cours
              d'immatriculation</strong>, dirigé par un architecte de systèmes multi-agents. Des
              agents IA spécialisés — orchestration, rédaction, code, audit, mémoire — sont nos
              outils de production : contrôlés à chaque étape, jamais un intermédiaire qui décide
              à votre place.
            </p>
          </div>
        </ScrollReveal>

        <div class="method__grid">
          <ScrollReveal v-for="(step, i) in methodSteps" :key="step.title" animation="fade-up" :delay="i * 120">
            <article class="method-step">
              <span class="method-step__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="method-step__title">{{ step.title }}</h3>
              <p class="method-step__text">{{ step.text }}</p>
            </article>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up">
          <div class="method__guarantees">
            <div v-for="g in methodGuarantees" :key="g.title" class="method-guarantee">
              <h3 class="method-guarantee__title">{{ g.title }}</h3>
              <p class="method-guarantee__text">{{ g.text }}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
    
    <!-- CTA FINAL -->
    <section class="cta-final" aria-labelledby="cta-title">
      <div class="container">
        <ScrollReveal animation="zoom">
          <SpotlightContainer :size="400" color="var(--primary)" :opacity="0.15">
            <div class="cta-final__box glass">
              <h2 id="cta-title">Qu'est-ce qu'on fait avancer&nbsp;?</h2>
              <p>Dites-moi ce qui vous ralentit. Je réponds sous 24 h, avec une première estimation gratuite et sans engagement — et si votre besoin n'est pas de notre ressort, je vous le dis aussi.</p>
              <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large" :strength="35" :text-strength="45">
                Parlons-en !
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </MagneticButton>
              <!-- LES DEUX BOUTONS DIRECTS — ajoutés le 19/09/2026, à la demande
                   de Gaëtan : « je veux 2 boutons call-to-action : un qui envoie
                   un mail bien câblé sur l'adresse correspondante, et un avec mon
                   numéro de téléphone ».
                   ⚠️ PLACÉS DANS LA SORTIE QUI EXISTAIT DÉJÀ, à côté du CTA
                   « Parlons-en ! » — aucune section créée, aucune réorganisation
                   de la page. Le motif du dépôt est une section de sortie en fin
                   de page ; on l'utilise, on n'en ajoute pas une deuxième.
                   Ce sont de VRAIS `<a href>` (mailto: objet pré-rempli, tel:) et
                   non des `<button>` avec un `onclick` : c'est ce qui fait qu'un
                   `tel:` compose sur un téléphone. `useMatomo` suit déjà ces deux
                   schémas par un écouteur global posé sur `document` — les boutons
                   sont donc mesurés sans qu'on touche au suivi.
                   Intitulés lisibles HORS CONTEXTE (WCAG 2.4.4) ; contraste par
                   les jetons existants (.btn-primary : texte --action-ink sur
                   --action, 16,80:1 sur le fond ; .btn-outline : --ink, 18,34:1
                   sur le fond de la DA — relevés du verrou). -->
              <div class="cta-final__actions">
                <a class="btn-primary" :href="LIEN_COURRIEL">{{ LIBELLE_ECRIRE }}</a>
                <a class="btn-outline" :href="LIEN_TELEPHONE">{{ LIBELLE_APPELER }}</a>
              </div>
              <ul class="cta-final__trust" aria-label="Garanties">
                <li>✓ Réponse sous 24h</li>
                <li>✓ Premier échange gratuit</li>
                <li>✓ Sans engagement</li>
              </ul>
            </div>
          </SpotlightContainer>
        </ScrollReveal>
      </div>
    </section>
    
  </div>
</template>

<script setup>
// Components
import AnimatedCounter from '@/components/common/AnimatedCounter.vue';
import GaugeCircle from '@/components/common/GaugeCircle.vue';
// Le décor de fond de la page d'accueil : une image générée localement, étalonnée à
// la charte — 59,8 Ko, aucun contexte GPU dans le navigateur du visiteur.
import DecorTunnel from '@/components/ui/DecorTunnel.vue';
// Le compartiment scellé du cadrage « site comme un metroidvania ». Import STATIQUE :
// il tient dans le HTML (aucune requête), il est visible dès le premier écran, et il
// n'est qu'un `<span>` décoratif tant qu'il est fermé.
import TuyauVert from '@/components/ui/TuyauVert.vue';

// ⭐ LE GALION — 22/09/2026. En DIFFÉRÉ, et ce n'est pas une coquetterie.
// `three` pèse lourd, et ce dépôt tient un verrou sur le NOMBRE DE REQUÊTES du
// premier chargement (`scripts/verifier-requetes.mjs`, seuil 14, contrainte
// hébergeur ~20/IP). Un import direct ferait entrer Three.js dans le premier
// chargement et ferait tomber le verrou.
const GalionViewer = defineAsyncComponent(() => import('@/components/GalionViewer.vue'));
// ── LE FOND 3D DE LA PAGE D'ACCUEIL — DÉMONTÉ le 13/09/2026 ────────────────
// Décision de Gaëtan (13/09) : option B, la scène 3D pilotée par le défilement —
// elle ROUVRE explicitement le verdict du 10/09 (« enlève le WebGL qui ressemble
// à rien »). Construite, éprouvée 4 fois sur 4, puis MESURÉE.
//
// ⚠️ ELLE N'EST PLUS MONTÉE, ET CE N'EST PAS UN OUBLI. La mesure A/B du même jour,
// trois essais de chaque côté, aucune mesure qui se recouvre :
//     avec la scène : performance 91 · 92 · 91 | TBT 44-90 ms | LCP ~3 340 ms
//     sans la scène : performance 97 · 96 · 98 | TBT 24-33 ms | LCP ~2 338 ms
// Le montage coûte 6 à 7 points et fait repasser la page SOUS le seuil de 95 que
// la charte s'est fixé. Une régression mesurée ne reste pas en place sans la
// validation de Gaëtan.
//
// LA CAUSE N'EST PAS LA TAILLE DU CHUNK, C'EST SON EXÉCUTION. `defineAsyncComponent`
// et `requestIdleCallback` protègent le chargement BLOQUANT, mais le premier moment
// d'inactivité tombe PENDANT la fenêtre mesurée : les 442,7 Ko de three.js sont donc
// téléchargés, analysés et rendus avant la fin de l'audit. *Un décor paresseux n'est
// paresseux que si on le laisse l'être.* Le composant reste dans le dépôt, intact :
// `src/components/three/ScrollScene.vue`. Pour le rebrancher, remonter la balise
// commentée plus haut dans le gabarit, et refaire la mesure — pas seulement le build.

// 3D : les 6 unités MND (chargé en async : n'alourdit pas le premier rendu).
// Modèles RÉELLEMENT GÉNÉRÉS : image SDXL (ComfyUI local) → objet 3D TRELLIS.2 →
// allègement web. 407 Ko pour les six, contre 938 Ko pour les anciens avatars
// fabriqués en primitives Blender.
// `defineAsyncComponent` était inutilisé depuis le démontage de la scène 3D ; il sert
// de nouveau, à la carte du navire (voir plus bas). `onUnmounted` arrive avec lui, pour
// retirer proprement les écouteurs de geste.
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue';
// Coordonnées publiques : une seule source, `src/config/contact.js`. Les deux
// boutons de la sortie (écrire / appeler) les lisent ici, comme le pied de page,
// la page contact, le dossier et les pages légales.
import { LIEN_COURRIEL, LIEN_TELEPHONE, LIBELLE_ECRIRE, LIBELLE_APPELER } from '@/config/contact.js';

/**
 * DÉCALAGE DE LA 3D HORS DU CHEMIN CRITIQUE (10/09/2026, audit Lighthouse).
 *
 * Mesuré : la scène 3D s'exécutait pendant la fenêtre de Largest Contentful
 * Paint — 9 secondes de travail sur le fil principal, LCP à 6,8 s, score de
 * performance entre 49 et 61 pour une cible de 95. Or ces 2,5 Mo de travail
 * (three.js + six modèles + post-traitement) ne servent à rien avant que le
 * visiteur ait vu le hero.
 *
 * On attend donc le premier moment d'inactivité du navigateur, avec un délai
 * de repli si `requestIdleCallback` n'existe pas. La page est complète et
 * lisible avant : le titre, le sous-titre, le CTA et la Grille TRON sont en
 * HTML et CSS purs.
 */
const unitesPretes = ref(false);

onMounted(() => {
  const reveiller = () => { unitesPretes.value = true; };
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    // Le délai de 2500 ms garantit que la 3D arrive même sur une page qui ne
    // devient jamais inactive (onglet au premier plan, animations continues).
    window.requestIdleCallback(reveiller, { timeout: 2500 });
  } else {
    window.setTimeout(reveiller, 1200);
  }
});

/**
 * LA CARTE DU NAVIRE — chargée au premier GESTE, et pas au premier repos.
 *
 * C'est la leçon mesurée du 13/09/2026, et elle a coûté une scène 3D entière. La scène
 * était « paresseuse » (`defineAsyncComponent` + `requestIdleCallback`) — et pourtant elle
 * coûtait 6 à 7 points de Lighthouse, parce que le premier moment d'inactivité du
 * navigateur tombe PENDANT la fenêtre que l'audit mesure. **Un décor paresseux n'est
 * paresseux que si on le laisse l'être.**
 *
 * Ici, on attend donc un vrai signe de vie : un défilement, un clic, une touche, un
 * contact. Un visiteur qui ne bouge pas n'a aucun besoin de la carte, puisqu'il ne
 * navigue pas. Et celui qui bouge la reçoit tout de suite.
 *
 * ⚠️ PAS DE MINUTERIE DE REPLI, et c'est délibéré : un `setTimeout` de quelques secondes
 * se déclencherait précisément pendant l'audit, et nous ramènerait au défaut qu'on vient
 * de corriger. Si personne ne touche à la page, la carte n'apparaît pas — et ce n'est pas
 * une perte : `/soute` reste liée depuis le pied de page sur toutes les pages du site.
 */
const CarteDuNavire = defineAsyncComponent(() => import('@/components/ui/CarteDuNavire.vue'));
const cartePrete = ref(false);
const GESTES = ['scroll', 'pointerdown', 'keydown', 'touchstart'];

function reveillerCarte() {
  cartePrete.value = true;
  if (typeof window !== 'undefined') {
    GESTES.forEach((g) => window.removeEventListener(g, reveillerCarte));
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return;
  GESTES.forEach((g) => window.addEventListener(g, reveillerCarte, { passive: true }));
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  GESTES.forEach((g) => window.removeEventListener(g, reveillerCarte));
});

// UI Components
import { 
  MagneticButton, 
  TextScramble,
  GlitchText,
  ScrollReveal, 
  SpotlightContainer 
} from '@/components/ui';

// Data

const solutions = [
  {
    title: 'Audit WordPress — 48 h',
    role: 'La sonde',
    price: '149 € – 199 € HT',
    description: 'Je relève sur VOTRE site les failles réelles : version obsolète, plugin vulnérable, absence de mises à jour. Chiffres à l\'appui, avant qu\'un pirate ou Google ne s\'en charge.',
    outputs: [
      'Analyse exécutée sur notre machine, en France — aucun service d\'analyse tiers',
      'Rapport clair, sans jargon, avec les risques en une phrase',
      'Plan chiffré des corrections, devis en option',
      'Résultat sous 48 h'
    ],
    badge: 'POUR COMMENCER',
    // L'audit lit un site PUBLIC : prétendre qu'« aucune donnée ne quitte votre
    // machine » était faux. Formulation corrigée après l'audit Perplexity.
    flux: 'Lecture seule sur un site public. Détail des flux : /flux-de-donnees'
  },
  {
    title: 'Site web',
    role: 'Votre première voile',
    price: 'Dès 2 500 € HT',
    description: 'Vitrine ou refonte : un site qui charge vite, se met à jour sans technicien et fait venir des demandes.',
    outputs: [
      'Jusqu\'à 8 pages · atelier de cadrage inclus',
      'Responsive, SEO technique, RGPD',
      'Formation à l\'administration',
      'Livraison en 4 à 6 semaines'
    ]
  },
  {
    title: 'Application métier',
    role: 'La coque, ajustée à votre métier',
    price: 'Dès 8 000 € HT',
    description: 'Un outil interne taillé sur vos processus, pour supprimer les ressaisies et les fichiers Excel qui circulent.',
    outputs: [
      'Atelier de cadrage préalable obligatoire',
      'Jusqu\'à 10 utilisateurs dans le lot initial',
      'Reprise de vos données existantes',
      'Formation des équipes et maintenance'
    ],
    featured: true,
    badge: 'LE PLUS DEMANDÉ'
  },
  {
    title: 'IA & automatisation locale',
    role: 'La propulsion',
    price: 'Audit IA + prototype dès 1 500 € HT',
    description: 'De l\'IA qui s\'exécute sur votre matériel ou sur le nôtre, en France. Le détail de ce qui sort et de ce qui ne sort pas est publié, sans formule absolue.',
    outputs: [
      'Audit IA + prototype sur un cas d\'usage réel',
      'Hébergement dans votre environnement',
      'Aucune donnée envoyée hors de France',
      'Chiffrage du déploiement à l\'issue de l\'audit'
    ]
  },
  {
    title: 'RAG MÉMOIRE',
    role: 'La cale',
    price: 'Dès 3 000 € HT · 3 niveaux',
    description: 'Un assistant interne qui répond aux questions de votre entreprise à partir de VOS documents — réponses sourcées, zéro hallucination.',
    outputs: [
      'Indexation de vos documents (PDF, Word, mails)',
      'Chaque réponse cite son document d\'origine',
      'Hébergement France, données jamais utilisées pour entraîner',
      'RGPD : suppression sur demande · Découverte 3k · Standard 8k · Sur-mesure 15k'
    ]
  }
];

const stackItems = [
  { category: 'BACKEND', techs: [{ name: 'Symfony 8' }, { name: 'PHP 8.3+' }, { name: 'PostgreSQL' }] },
  { category: 'FRONTEND', techs: [{ name: 'Vue 3' }, { name: 'Three.js' }, { name: 'GSAP' }] },
  { category: 'IA LOCALE', techs: [{ name: 'Ollama', highlight: true }, { name: 'Qwen 3' }, { name: 'RAG Open WebUI' }] },
  { category: 'INFRA', techs: [{ name: 'Docker' }, { name: 'Hébergement FR', highlight: true }, { name: 'Linux' }] }
];


// Déroulé de travail (méthode, présentée sans détour)
const methodSteps = [
  {
    title: 'Audit 48 h',
    text: 'État des lieux factuel — sécurité, performance, automatisation possible — avec les risques en une phrase et un plan chiffré, sans jargon.'
  },
  {
    title: 'Conception du système',
    text: 'Quels agents, quelle mémoire, quelles données : le système multi-agents est conçu pour VOTRE métier, dans votre environnement ou hébergé en France.'
  },
  {
    title: 'Construction',
    text: 'Agents, RAG, interfaces : livrés par étapes visibles et testables, contrôlés par une vérification qualité indépendante à chaque livraison.'
  },
  {
    title: 'Mise en route & suivi',
    text: 'Déploiement, formation de vos équipes, supervision continue. Vous gardez la main : chaque décision est validée par vous.'
  }
];

const methodGuarantees = [
  {
    title: 'Données sous votre contrôle',
    text: 'L\'IA s\'exécute sur votre matériel ou sur le nôtre, en France. Ce qui sort et ce qui ne sort pas est écrit noir sur blanc, sans formule absolue.'
  },
  {
    title: 'Vérification systématique',
    text: 'Chaque livraison passe un contrôle qualité indépendant : sources citées, tests, zéro métrique inventée.'
  },
  {
    title: 'Vous gardez la main',
    text: 'Aucune décision — technique, visuelle, budgétaire — n\'est verrouillée sans votre validation.'
  }
];
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════════════════
   OPQUAST / A11Y
   ═══════════════════════════════════════════════════════════════════════════ */

/* Skip Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--primary);
  color: #000;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 9999;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* Focus Visible (Opquast) */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* Reduced Motion (Opquast) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* HERO */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  position: relative;
  overflow: hidden;
}

.hero__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  /* au-dessus de l'ambient MND (z-index 0) */
  position: relative;
  z-index: 1;
  }

.hero__content {
  max-width: 600px;
}

/* Floating Tech Badges */


/* Button Glow — DS clair : plus de halo émeraude pulsé (D1) */
.btn-glow {
  box-shadow: var(--shadow-md);
}

/* Scroll Indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.scroll-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--primary), transparent);
  animation: scrollLine 2s ease-in-out infinite;
}

@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  50.1% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWWWARDS POLISH - Typography & Spacing
   ═══════════════════════════════════════════════════════════════════════════ */

/* Hero Title - More dramatic sizing */
.hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

/* L'offre en premier écran : sobre, lisible, jamais criarde. Elle passe AVANT
   le titre éditorial parce qu'un visiteur doit savoir en deux secondes ce qu'on
   vend. Les prix sont les prix publics du studio, pas une accroche. */
.hero__offre {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  margin-bottom: 1.25rem;
  padding-left: 0.9rem;
  border-left: 2px solid var(--action);
}

.hero__offre strong {
  color: var(--ink);
  font-weight: 700;
}

/* Improved subtitle contrast */
.hero__subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  color: rgba(229, 229, 229, 0.85); /* Better contrast than text-muted */
  margin-bottom: 2rem;
  max-width: 550px;
}

.hero__subtitle strong {
  color: var(--ink);
  font-weight: 600;
}

/* Status badge polish */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--primary);
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* Neon text glow — supprimé (D1 : plus de halo) */
.neon-text {
  /* halo retiré — le gradient clair fait le travail */
}

/* Hero actions spacing */





.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.3s ease;
}



.hero__quick-nav {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}


.hero__actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Button hover state enhancement */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover::before {
  transform: translateX(100%);
}

/* Section headers polish */
.section-header {
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 0.5rem;
}

.section-header__desc {
  font-size: 1rem;
  color: rgba(229, 229, 229, 0.75);
  margin-top: 0.75rem;
  max-width: 500px;
  line-height: 1.6;
}

/* Mono tag styling */
.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--ink-soft);
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--ink-soft);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

/* pendant l'animation de scramble, pas de couleur d'accent : on hérite */
.status-badge :deep(.text-scramble--active) {
  color: inherit;
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--ink-soft);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero__title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
  max-width: 550px;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

/* Buttons */
.btn-primary {
  padding: 1rem 2rem;
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: transparent;
  color: var(--primary);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 0.8rem;
}

/* METRICS BAR */





/* SOLUTIONS */
.solutions {
  padding: var(--space-xl) 0;
}

.section-header {
  margin-bottom: var(--space-lg);
  max-width: 600px;
}

.section-header--center {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.section-header__desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* PROOF */


.section-header__caveat {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 0.82rem;
  opacity: 0.7;
}

/* PROOF — bandeau preuve ARKADIA en SECTION INVERSÉE.
   « Inversée » veut dire : son texte ne suit PAS le fond de la page, il reste
   clair, et son accent est --accent-inv (que variables.css documente comme
   « sections sur fond encre »). Ce bandeau prenait son fond sur --ink, qui valait
   #1A1A18 (sombre) en D1 mais #EAF0F7 (clair) en D5 : le fond est donc devenu
   clair alors que le texte l'était resté — illisible. Le fond vient désormais de
   --paper-alt, la surface sombre de D5 prévue pour alterner les sections. */
.proof {
  padding: var(--space-xl) 0;
  background: var(--paper-alt);
  border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
}

/* Projet cloture : ni point pulsant ni couleur d'accent — le badge ne doit
   pas suggerer un service encore en ligne. */
.proof__badge--closed {
  color: color-mix(in srgb, var(--ink) 78%, transparent);
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0.25rem 0.6rem;
}

/* Jauges (GaugeCircle) en section inversée — couleurs forcées */
.proof :deep(.gauge__track) {
  stroke: color-mix(in srgb, var(--ink) 16%, transparent) !important;
}

/* Bouton outline inversé : papier sur encre */
.proof .btn-outline {
  color: var(--ink) !important;
  border-color: var(--ink) !important;
  background: transparent !important;
}

/* Gradient du titre ARKADIA : version inversée (clair → vert d'accent) */
.proof .text-gradient {
  background: linear-gradient(135deg, var(--ink), var(--accent-inv));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* SYSTEM CHECK */

.system-check .system-terminal {
  max-width: 700px;
  margin: 0 auto;
}

/* STACK */
.stack {
  padding: var(--space-xl) 0;
  overflow: hidden; /* Contenir les effets de lumière */
}

/* MULTIVERS TEASER */



.universe-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 30%, transparent);
}




/* HERO QUICK NAV */


.quick-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  /* Résidu de la DA Matrix corrigé : c'était un vert néon en dur
     (var(--primary-soft)) dans un thème papier. Remplacé par la version
     douce de l'accent D1 — sinon la couleur jure et ne suit pas le thème. */
  background: var(--primary-soft);
}

/* LA PORTE COMMERCIALE — le lien vers le dossier n'est pas une commodité,
   c'est l'accès à l'offre, aux prix et aux limites. Il se distingue donc des
   autres liens rapides : bordure d'accent, fond teinté, mot mis en avant. */
.quick-link--porte {
  border-color: var(--accent);
  color: var(--ink);
  background: var(--primary-soft);
}

.quick-link--porte strong {
  color: var(--accent);
  font-weight: 700;
}

.quick-link--porte:hover {
  background: var(--accent);
  color: var(--paper);
}

.quick-link--porte:hover strong {
  color: var(--paper);
}



/* CTA FINAL */
.cta-final {
  padding: var(--space-xl) 0;
}

.cta-final__box {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-xl);
  border-radius: 1.5rem;
  border: 1px solid var(--rule);
  text-align: center;
}

.cta-final__box h2 {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.cta-final__box p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  line-height: 1.7;
}

.cta-final__trust {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  list-style: none;
  padding: 0;
}

/* ── LES DEUX BOUTONS DIRECTS DE LA SORTIE ────────────────────────────────────
   Mise en forme SEULEMENT. `.btn-primary` (écrire) et `.btn-outline` (appeler)
   viennent de `global.css`, comme partout ailleurs dans le dépôt : aucune
   couleur nouvelle, aucun jeton redéclaré — le verrou « un seul foyer des
   jetons » lit ce fichier, et une valeur recopiée ici le casserait. */
.cta-final__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: var(--space-sm);
}

@media (max-width: 560px) {
  /* Sous 560 px, deux boutons sur une ligne tombent sous la cible tactile de
     44 px de haut : on les empile, chacun sur toute la largeur. */
  .cta-final__actions > a {
    flex-basis: 100%;
  }
}

.cta-final__trust li {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Solution Card Link Wrapper */
.solution-card__link-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* Hero Title Sub */
.hero__title-sub {
  color: var(--text-muted);
  font-size: 0.85em;
  font-weight: 400;
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWWWARDS MICRO-INTERACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/* Smooth section transitions */
section {
  position: relative;
}

/* Link underline animation */
a:not(.btn-primary):not(.btn-outline):not(.solution-card__link-wrapper):not(.universe-card):not(.quick-link):not(.skip-link) {
  position: relative;
}

/* Card lift on hover */
.solution-card,
.universe-card,
.stack-card {
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
              border-color 0.3s ease,
              box-shadow 0.4s ease;
}

/* Numérotation technique des cartes (D5) : un index monospace remplace les
   emojis d'icône. L'ADN technique vient de la mise en forme, pas d'un pictogramme
   dont le rendu dépend du système d'exploitation du visiteur. */
.solution-card__icon {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--neon-cyan);
  opacity: 0.85;
  transition: color var(--transition-base);
}

/* ── Rôle au chantier naval (D5) : le vocabulaire du navire posé sur l'offre,
   au-dessus du nom commercial qui reste, lui, parfaitement clair. ── */
.solution-card__role {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  margin-bottom: 0.35rem;
}

/* ── LE CHANTIER NAVAL : le renversement du concept, en fin de section offre ── */
.chantier {
  margin-top: 3rem;
  padding: 2rem 2.25rem;
  border: 1px solid var(--rule);
  border-left: 3px solid var(--neon-cyan);
  background: var(--paper-alt);
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

@media (max-width: 860px) {
}

/* Price tag : halo retiré (D1) */

/* Universe card float */
.universe-card:hover {
  transform: translateY(-8px);
}

/* Quick link arrow animation */

.quick-link::after {
  content: '→';
  position: absolute;
  right: -20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.quick-link:hover::after {
  right: 1rem;
  opacity: 1;
}

.quick-link:hover {
  padding-right: 2.5rem;
}

/* Metric value counter glow — supprimé (D1) */

/* Proof metric border animation */
.proof-metric {
  transition: border-color 0.3s ease, background 0.3s ease;
}

/* Stack tech highlight pulse (sans halo) */
.stack-item__tech--highlight {
  animation: techPulse 3s ease-in-out infinite;
}

@keyframes techPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Selection style */
::selection {
  background: var(--primary-soft);
  color: var(--ink);
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* UTILITIES */
.text-gradient {
  background: linear-gradient(135deg, var(--ink), var(--ink-faint));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass {
  /* Style scopé : il l'emporte sur le .glass global. Il servait un blanc à
     55 % (DA claire) — sur le fond noir de D5, c'était un panneau délavé. */
  background: var(--paper-alt);
  border: 1px solid var(--rule);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA MÉTHODE — fonctionnement du studio (remplace la section « cercle » lore,
   09/2026) : message pragmatique, étapes de travail + garanties.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   LE GALION ET LE JEU — 22/09/2026
   Le rendu 3D vit dans GalionViewer.vue (styles scopés). Ici, les sections.
   ═══════════════════════════════════════════════════════════════════════════ */

.galion-section { padding: var(--space-xl) 0; }

.galion-note {
  margin-top: var(--space-sm);
  max-width: 68ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-faint);
}

.jeu { padding: var(--space-xl) 0; }

.jeu__cadre {
  position: relative;
  margin-top: var(--space-md);
  aspect-ratio: 16 / 10;
  max-height: min(82vh, 780px);
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 4px;
}

.jeu__frame { display: block; width: 100%; height: 100%; border: 0; }

.jeu__note {
  margin-top: var(--space-sm);
  max-width: 68ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-faint);
}

@media (max-width: 860px) {
  .jeu__cadre { aspect-ratio: 3 / 4; max-height: none; }
}

.method {
  padding: var(--space-xl) 0;
}

.method__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.method-step {
  height: 100%;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 0.9rem;
  padding: var(--space-md);
}

.method-step__num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--accent);
  margin-bottom: var(--space-xs);
}

.method-step__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: var(--space-xs);
}

.method-step__text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}

.method__guarantees {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
}

.method-guarantee__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-main);
  margin: 0 0 var(--space-xs);
}

.method-guarantee__text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}
/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  
  .hero__actions {
    flex-direction: column;
  }
  
  .cta-final__trust {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero__quick-nav {
    justify-content: center;
  }
}

/* MÉTHODE RESPONSIVE */
@media (max-width: 1024px) {
  .method__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .method__guarantees {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .method__grid {
    grid-template-columns: 1fr;
  }
}
/* ═══════════════════════════════════════════════════════════════════════════
   SIGNATURE ORBITE (2026-10, d'après recherche Awwwards)
   « La technologie peut bouger ; le centre de gravité ne bouge pas. »
   Point émeraude FIXE + anneaux pointillés qui tournent (transform = GPU).
   Décoratif (aria-hidden), zéro WebGL, réduit avec prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════════ */
.hero__orbit {
  position: absolute;
  top: 50%;
  right: clamp(-40px, -2vw, 0px);
  width: clamp(320px, 42vw, 560px);
  aspect-ratio: 1 / 1;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  opacity: 0.85;
}

/* LES 6 LOIS EN 3D — surimpression transparente (fond papier préservé, D1).
   Zone : moitié droite du hero, derrière le contenu texte. */
.hero__lois {
  position: absolute;
  top: 50%;
  right: clamp(-60px, -3vw, 0px);
  width: clamp(420px, 52vw, 820px);
  height: min(88vh, 760px);
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
}
@media (max-width: 1024px) {
}
@media (max-width: 768px) {
  /* mobile : la scène 3D passe en fond discret, le texte reste prioritaire */
  .hero__lois { right: 0; width: 100%; height: 60vh; opacity: 0.4; }
}

/* point central : le centre de gravité — immobile */
.hero__orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  margin: -5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px var(--primary-soft);
  animation: orbit-core-pulse 3.5s ease-in-out infinite;
}

@keyframes orbit-core-pulse {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50%      { transform: scale(1.25); opacity: 1; }
}

/* anneaux pointillés qui tournent — le système recalcule sa trajectoire */
.hero__orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px dashed var(--primary-soft);
  transform: translate(-50%, -50%);
}

@keyframes orbit-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* A11Y : mouvement coupé, motif figé mais présent */
@media (prefers-reduced-motion: reduce) {
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHEMINS VISITEUR (principe 7) : deux portes lisibles sous le CTA
   PME → audit 48 h · TECH → architecture. Discrets, pas de pill tape-à-l'œil.
   ═══════════════════════════════════════════════════════════════════════════ */
.hero__paths {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  margin-top: 2rem;
}

.hero__path {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  /* Pile système (D5) — plus aucune famille réseau en dehors de Fraunces et
     JetBrains Mono. */
  font-family: inherit;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-base);
}

.hero__path:hover {
  color: var(--text-main);
}

.hero__path-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
  border: 1px solid var(--rule);
  padding: 0.15rem 0.45rem;
  border-radius: 0.3rem;
  flex-shrink: 0;
}

.hero__path--cto .hero__path-tag {
  color: var(--ink-soft);
}

/* ═══════════════════════════════════════════════════════════════════════
   OVERRIDES DS CLAIR (D1) — boutons MagneticButton du parcours.
   Le composant appose ses propres couleurs (brique + hover #fff) par-dessus
   .btn-primary/.btn-outline : on force l'état « bouton plein brique » sur
   papier et « outline papier » sur la section inversée (proof).
   ═══════════════════════════════════════════════════════════════════════ */
.btn-primary.magnetic-button {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  color: var(--paper) !important;
}

.btn-primary.magnetic-button:hover {
  background: var(--accent-ink) !important;
  border-color: var(--accent-ink) !important;
  color: var(--paper) !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PREUVE ARKADIA (bande claire, 09/09/2026) — « On l'a fait pour nous-mêmes »
   Section claire : ne PAS reprendre .proof (fond encre) pour éviter deux
   bandeaux sombres consécutifs avec la preuve ARKADIA France PvE.
   ═══════════════════════════════════════════════════════════════════════ */
.preuve-arkadia {
  padding: var(--space-xl) 0;
}

.preuve-arkadia__titre {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.15;
  margin: var(--space-sm) 0 var(--space-md);
}

.preuve-arkadia__desc {
  color: var(--text-muted);
  line-height: 1.75;
  max-width: 62ch;
  margin: 0 0 var(--space-sm);
}

.preuve-arkadia__desc strong {
  color: var(--text-main);
}

.preuve-arkadia__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: var(--space-sm);
}

.preuve-arkadia__actions .btn-primary,
.preuve-arkadia__actions .btn-outline {
  text-decoration: none;
}

@media (max-width: 900px) {
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE PAVILLON (apport ALBATOR, concept D5)
   Son style est défini dans global.css — il sert aussi sur la page Contact,
   dans le bouton d'envoi. Une seule définition, deux usages.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   LE VAISSEAU (concept D5) — ARKADIA SS00999
   Section de récit : l'analogie bateau ↔ ordinateur, puis la fiche réelle.
   ═══════════════════════════════════════════════════════════════════════════ */
.vaisseau {
  padding: var(--space-xl) 0;
}

.vaisseau__figure {
  margin: 2.5rem 0 0;
  position: relative;
  border: 1px solid var(--rule);
  overflow: hidden;
}

.vaisseau__figure img {
  display: block;
  width: 100%;
  height: auto;
}

.vaisseau__figure figcaption {
  padding: 0.7rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.10em;
  color: var(--ink-faint);
  border-top: 1px solid var(--rule);
  background: var(--paper-alt);
}

.vaisseau__figure figcaption strong {
  color: var(--alert);
  font-weight: 700;
}

.vaisseau__bloc {
  margin-top: 3.5rem;
}

.vaisseau__sous-titre {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin-bottom: 0.75rem;
}

.vaisseau__intro {
  max-width: 68ch;
  color: var(--ink-soft);
  line-height: 1.75;
  margin-bottom: 2rem;
}

/* ── La phrase du capitaine : mise en avant, mais jamais criée ── */
.vaisseau__citation {
  margin: 0 0 2.5rem;
  padding: 1.5rem 0 1.5rem 1.75rem;
  border-left: 3px solid var(--accent);
  background: linear-gradient(to right, var(--primary-soft), transparent 70%);
}

.vaisseau__citation p {
  font-size: clamp(1.3rem, 3.2vw, 2rem);
  line-height: 1.25;
  color: var(--ink);
  text-wrap: balance;
}

.vaisseau__citation cite {
  display: block;
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-style: normal;
}

/* La ligne des voiles est la clé de voûte du concept : elle se distingue. */
.vaisseau__rang--clef {
  background: var(--primary-soft);
}

.vaisseau__rang--clef th[scope="row"] {
  color: var(--neon-cyan);
}

/* ── Table d'analogie : à bord / sur la machine / l'effet pour le client ── */
.vaisseau__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.vaisseau__legende {
  caption-side: top;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  text-transform: uppercase;
  padding-bottom: 0.75rem;
}

.vaisseau__table th,
.vaisseau__table td {
  text-align: left;
  vertical-align: top;
  padding: 0.85rem 1rem 0.85rem 0;
  border-bottom: 1px solid var(--rule);
}

.vaisseau__table thead th {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  border-bottom-color: var(--rule-strong);
}

.vaisseau__table tbody th {
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

.vaisseau__table tbody td {
  color: var(--ink-soft);
}

.vaisseau__table tbody td:nth-child(2) {
  color: var(--ink);
}

.vaisseau__table tbody td strong {
  color: var(--ink);
  font-weight: 600;
}

.vaisseau__table tbody tr:hover {
  background: var(--primary-soft);
}

/* ── Fiche technique réelle ── */
.vaisseau__bloc--fiche {
  border-top: 1px solid var(--rule-strong);
  padding-top: 2.5rem;
}

.vaisseau__fiche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0;
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  background: var(--paper-alt);
}

.vaisseau__ligne {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--rule);
  border-right: 1px solid var(--rule);
}

.vaisseau__ligne dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.vaisseau__ligne dd {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.5;
}

.vaisseau__note {
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  max-width: 70ch;
}

/* Note d'alerte : sert à énoncer une limite assumée, pas un argument.
   Bande orange à gauche + fond opaque, pour qu'elle ne passe pas inaperçue
   sans pour autant crier. */
.vaisseau__note--alerte {
  padding: 1rem 1.25rem;
  border-left: 3px solid var(--alert);
  background: var(--paper-alt);
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.7;
  letter-spacing: normal;
  color: var(--ink-soft);
  max-width: 76ch;
  margin-top: 1.5rem;
}

.vaisseau__note--alerte strong {
  color: var(--ink);
}

@media (max-width: 720px) {
  .vaisseau__table {
    font-size: 0.85rem;
  }
  .vaisseau__table thead {
    display: none;   /* sur mobile, les colonnes empilées se lisent sans en-tête */
  }
  .vaisseau__table tbody th,
  .vaisseau__table tbody td {
    display: block;
    padding: 0.35rem 0;
    border-bottom: 0;
  }
  .vaisseau__table tbody tr {
    display: block;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--rule);
  }
}
</style>
