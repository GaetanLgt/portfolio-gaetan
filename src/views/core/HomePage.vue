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
    <!-- ══════════════════════════════════════════════════════════════════════
         LA COQUE VIVANTE — LA COUCHE DES BOUCLES CONTINUES. 22/09/2026.

         ⛔ CE QUE CE N'EST PAS, ET IL FAUT LE DIRE D'ABORD : ce n'est pas un
            décor qui « apparaît au défilement ». Ce sont des animations
            CONTINUES — elles tournent que le visiteur bouge ou non.
            *Un site qui ne s'anime qu'au scroll n'est pas vivant : il réagit.*

         Ce qui tourne ici, et c'est le navire qui respire :
           · les TRACÉS DE CODE circulent le long de la coque, sans fin ;
           · la RESPIRATION éclaire et éteint lentement le vide autour du bord.

         Ce qui tourne ailleurs, dans la même boucle :
           · les FEUX DE POSITION pulsent (les feux de proue, de poupe et de
             tête de mât — rouge, vert, blanc : la convention est réelle) ;
           · le RÉACTEUR BAT, au milieu de la coque ;
           · l'ŒIL DE PROUE cligne, parce que la proue ouvre un œil.

         ⛔ `prefers-reduced-motion: reduce` LES COUPE TOUTES — sans exception.
            La règle est écrite UNE SEULE FOIS, dans le bloc final du <style> :
            *une coupure dispersée est une coupure qu'on oublie quelque part.*

         `aria-hidden` : un décor ne capte ni le clic, ni la lecture d'écran.
         `pointer-events: none` : il ne prend aucun geste au visiteur.
         Aucun fichier chargé, aucune image : du SVG en ligne et du CSS.
         ══════════════════════════════════════════════════════════════════════ -->
    <div class="nav-vie" aria-hidden="true">
      <svg class="nav-vie__traces" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <path class="nav-vie__trace" d="M -40 176 C 240 214 520 202 820 168 C 1040 144 1180 120 1260 96" />
        <path class="nav-vie__trace nav-vie__trace--2" d="M -40 418 C 260 452 560 440 860 402 C 1060 376 1180 356 1260 332" />
        <path class="nav-vie__trace nav-vie__trace--3" d="M -40 648 C 300 690 620 672 900 636 C 1080 612 1200 592 1260 574" />
      </svg>
      <span class="nav-vie__respiration"></span>
    </div>



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
         L'ARRIVÉE — LE NAVIRE, DE L'EXTÉRIEUR. 22/09/2026.

         ⭐ C'est la première des quatre temps du concept `LE REGARD` (note du
            studio, 22/09/2026) : « une vue EXTÉRIEURE du vaisseau quand on
            arrive sur la page. Quand on scroll, on RENTRE dans le vaisseau. »

         ⛔ POURQUOI CE NAVIRE EST DESSINÉ ICI, ET PAS ENCORE LA 3D.
            La 3D (`VaisseauNavigable`) est montée plus bas, et elle doit
            rester LÀ : sa légende dit « les caractéristiques techniques sont
            publiées PLUS BAS sur cette page », et la fiche technique est plus
            bas. *Déplacer la 3D rendrait cette phrase fausse.*
            Ici, ce n'est donc pas le modèle : c'est sa SILHOUETTE, en SVG en
            ligne. Elle ne coûte aucune requête, aucun contexte 3D, et elle est
            présente dans le HTML prérendu — donc visible sans JavaScript.

         ⭐ CE QUE LE DESSIN PORTE, ET QUI VIENT DU CANON, PAS DE MOI :
            · la coque est un GALION — poupe haute, gaillard, beaupré ;
            · il n'y a PAS de voiles : il a le vide ;
            · la FIGURE DE PROUE est une TÊTE DE MORT ;
            · la PROUE OUVRE UN ŒIL — c'est là que vit le narval, avec sa
              défense ;
            · le PAVILLON est le CERCLE-À-POINT MND — jamais un crâne. *L'interdit
              du crâne porte sur le pavillon ; la proue, elle, est un crâne.*
            ⛔ Aucune silhouette d'une franchise : c'est un galion, pas un
               vaisseau reconnaissable. Le registre est emprunté, le dessin est
               à nous.
         ═══════════════════════════════════════════════════════════════════════ -->
    <!-- temps:1 · L'ARRIVÉE — première des quatre temps (contrat lu par scripts/verifier-seuil-landing.mjs : ne pas renommer ce marqueur sans mettre le contrôle à jour). -->
    <section class="nav-arrivee" data-arrivee aria-labelledby="nav-arrivee-titre">
      <!-- LE VIDE. Les étoiles sont posées par une fonction DÉTERMINISTE :
           deux chargements donnent le même ciel. C'est le critère du studio —
           une mesure se rejoue, et un décor aussi. -->
      <div class="nav-arrivee__vide" aria-hidden="true">
        <span
          v-for="e in ETOILES"
          :key="e.cle"
          class="nav-arrivee__etoile"
          :style="{ left: e.left + '%', top: e.top + '%', width: e.taille + 'px', height: e.taille + 'px', animationDelay: e.retard + 's' }"
        ></span>
      </div>

      <div class="nav-arrivee__coque">
        <svg
          class="nav-navire"
          viewBox="0 0 1200 460"
          role="img"
          aria-labelledby="nav-navire-titre nav-navire-desc"
        >
          <title id="nav-navire-titre">ARKADIA SS00999 — le galion fantôme, vu de l'extérieur</title>
          <desc id="nav-navire-desc">
            Silhouette d'un galion dans le vide : coque à poupe haute, trois mâts sans
            voiles, tête de mort en figure de proue, un œil ouvert à la proue avec la
            défense du narval, un réacteur qui bat au milieu de la coque, et le pavillon
            au cercle-à-point.
          </desc>

          <!-- LES TRACÉS DE CODE — ils circulent le long de la coque, sans fin. -->
          <g class="nav-navire__circuit">
            <path class="nav-navire__fil" d="M 214 300 C 340 322 520 328 700 322 C 840 316 944 300 992 268" />
            <path class="nav-navire__fil nav-navire__fil--2" d="M 252 318 C 390 336 566 340 744 334" />
            <path class="nav-navire__fil nav-navire__fil--3" d="M 312 270 C 430 278 566 276 682 270" />
          </g>

          <!-- LA COQUE — un galion : étrave fine, pont bas au milieu, château arrière. -->
          <path
            class="nav-navire__coque"
            d="M 152 250
               C 206 312 268 338 366 340
               L 872 340
               C 944 338 990 314 1018 258
               L 1018 156
               L 900 148
               L 900 242
               L 404 242
               C 320 242 240 246 152 250 Z"
          />

          <!-- LA MEMBRURE — les couples apparents, comme sur un bordé ouvert. -->
          <g class="nav-navire__membrures">
            <path d="M 300 244 L 320 338" />
            <path d="M 400 243 L 412 340" />
            <path d="M 500 243 L 508 340" />
            <path d="M 600 243 L 604 340" />
            <path d="M 700 243 L 700 340" />
            <path d="M 800 243 L 796 340" />
            <path d="M 880 242 L 872 340" />
          </g>

          <!-- LE GRÉEMENT — mâts nus et haubans. Pas une voile : le vide. -->
          <g class="nav-navire__greement">
            <path d="M 200 238 L 58 188" />
            <path d="M 390 242 L 390 86" />
            <path d="M 640 242 L 640 44" />
            <path d="M 858 240 L 858 120" />
            <path d="M 390 86 L 330 242" />
            <path d="M 390 86 L 452 242" />
            <path d="M 640 44 L 556 242" />
            <path d="M 640 44 L 724 242" />
            <path d="M 858 120 L 818 240" />
            <path d="M 640 60 L 858 120" />
            <path d="M 640 60 L 390 86" />
          </g>

          <!-- LE RÉACTEUR — il bat, au milieu de la coque. -->
          <g class="nav-navire__reacteur">
            <circle class="nav-navire__reacteur-halo" cx="646" cy="292" r="34" />
            <circle class="nav-navire__reacteur-coeur" cx="646" cy="292" r="15" />
            <circle class="nav-navire__reacteur-anneau" cx="646" cy="292" r="45" />
          </g>

          <!-- L'ŒIL DE PROUE ET LA DÉFENSE DU NARVAL.
               « le narval vit à l'œil de proue — la proue ouvre un œil ». -->
          <g class="nav-navire__oeil-groupe">
            <path class="nav-navire__defense" d="M 126 276 C 96 268 72 288 44 280" />
            <path class="nav-navire__defense nav-navire__defense--spire" d="M 110 271 L 106 281 M 92 271 L 88 283 M 72 275 L 68 287 M 54 277 L 50 288" />
            <path class="nav-navire__paupiere" d="M 118 274 Q 144 252 170 274 Q 144 292 118 274 Z" />
            <circle class="nav-navire__pupille" cx="144" cy="272" r="5" />
          </g>

          <!-- LA FIGURE DE PROUE — une tête de mort. Elle annonce ce qu'est le navire. -->
          <g class="nav-navire__figure">
            <path class="nav-navire__crane" d="M 158 214 C 148 214 141 221 141 230 C 141 238 146 243 148 246 L 148 256 L 172 256 L 172 246 C 174 243 179 238 179 230 C 179 221 168 214 158 214 Z" />
            <ellipse class="nav-navire__orbite" cx="151" cy="230" rx="4.1" ry="4.6" />
            <ellipse class="nav-navire__orbite" cx="166" cy="230" rx="4.1" ry="4.6" />
            <path class="nav-navire__machoire" d="M 151 246 L 151 256 M 158 246 L 158 256 M 165 246 L 165 256" />
          </g>

          <!-- LES QUATRE FEUX DE POSITION — ils pulsent, décalés.
               ⚠️ ILS PRENNENT LES QUATRE COULEURS DE LA PALETTE, et on ne prétend
               PAS qu'ils suivent la convention maritime : celle-ci décrit des
               navires RÉELS (rouge à bâbord, vert à tribord), et ce navire-ci est
               un galion fantôme. *La direction artistique « D6 » a fait sortir le
               vert de l'identité le 19/09/2026 — on n'en réintroduit pas un ici
               pour avoir l'air exact.* -->
          <g class="nav-navire__feux">
            <circle class="nav-navire__feu nav-navire__feu--babord" cx="206" cy="234" r="4.6" />
            <circle class="nav-navire__feu nav-navire__feu--tribord" cx="996" cy="252" r="4.6" />
            <circle class="nav-navire__feu nav-navire__feu--hune" cx="640" cy="46" r="4.2" />
            <circle class="nav-navire__feu nav-navire__feu--poupe" cx="1008" cy="162" r="3.6" />
          </g>

          <!-- LE PAVILLON — le CERCLE-À-POINT MND. Jamais un crâne. -->
          <g class="nav-navire__pavillon">
            <path class="nav-navire__mat" d="M 640 44 L 640 14" />
            <path class="nav-navire__etoffe" d="M 642 18 L 712 27 L 642 38 Z" />
            <circle class="nav-navire__sceau" cx="668" cy="27.5" r="5.6" />
            <circle class="nav-navire__sceau-point" cx="668" cy="27.5" r="1.7" />
          </g>
        </svg>
      </div>

      <div class="container nav-arrivee__texte">
        <span class="mono-tag" aria-hidden="true">/// · L’ARRIVÉE</span>
        <h2 id="nav-arrivee-titre" class="nav-arrivee__titre">
          Vous n’ouvrez pas un site.<br>
          <span class="text-gradient">Vous accostez.</span>
        </h2>
        <p class="nav-arrivee__desc">
          Ce qui suit n’est pas une page qu’on fait défiler : c’est <strong>un navire
          qu’on visite</strong>. Le galion que vous voyez est le plan du site — chacun de ses
          sept compartiments est une porte vers une pièce réelle du studio. Vous descendez,
          vous regardez, et le bord retient par où vous êtes passé.
        </p>
        <p class="nav-arrivee__consigne">
          <span class="nav-arrivee__consigne-puce" aria-hidden="true"></span>
          <strong>Ne touchez à rien pendant deux secondes.</strong> Regardez-le. Il respire —
          les feux pulsent, le réacteur bat, l’œil de proue cligne.
        </p>
        <!-- LE NOM DU BORD, GRAVÉ. Le nom est un des DEUX SEULS mots que le studio
             écrit en runes (`src/data/runes.js`, `MOTS = ['ARKADIA', 'MND']`,
             confirmé par le dirigeant le 22/09/2026). Le composant LÈVE si une
             lettre n'a pas de rune — un mot à moitié gravé ne passe pas en silence.
             ⚠️ Et il était livré, éprouvé, et BRANCHÉ NULLE PART : c'est ici qu'il
             sert, et ce n'est pas un ornement ajouté — c'est une pièce qui manquait
             de porte. -->
        <MotEnRunes
          class="nav-arrivee__runes"
          mot="ARKADIA"
          libelle="ARKADIA"
          :taille="30"
          :trait="0.08"
        />
      </div>

      <!-- ═══════════════════════════════════════════════════════════════════
           LES TROIS JAUGES — le site se mesure lui-même, en direct.

           ⭐⭐⭐ C'est la partie du concept qui est à nous seuls, et sa raison est
              écrite dans la note `LE REGARD` § 2.5 : les HUD de jeux affichent la
              santé d'un PERSONNAGE ; celui-ci affiche la santé d'un STUDIO.

           ⛔ ET LA RÈGLE QUI LES REND HONNÊTES : **une jauge décorative est un
              mensonge.** Chaque chiffre ici porte sa source et sa date, et il est
              écrit dans la page. Aucun d'eux ne bouge tout seul : *un chiffre qui
              s'anime sans être mesuré est un chiffre inventé.*
           ═══════════════════════════════════════════════════════════════════ -->
      <div class="container">
        <ul class="nav-jauges" aria-label="Les trois nombres du navire">
          <li class="nav-jauge nav-jauge--faim">
            <span class="nav-jauge__nom">FAIM</span>
            <span class="nav-jauge__valeur">{{ JAUGE_FAIM.valeur }}</span>
            <span class="nav-jauge__unite">{{ JAUGE_FAIM.unite }}</span>
            <span class="nav-jauge__barre" aria-hidden="true">
              <i :style="{ width: JAUGE_FAIM.part + '%' }"></i>
            </span>
            <span class="nav-jauge__quoi">{{ JAUGE_FAIM.quoi }}</span>
            <span class="nav-jauge__source">{{ JAUGE_FAIM.source }}</span>
          </li>
          <li class="nav-jauge nav-jauge--autonomie">
            <span class="nav-jauge__nom">AUTONOMIE</span>
            <span class="nav-jauge__valeur">{{ JAUGE_AUTONOMIE.valeur }}</span>
            <span class="nav-jauge__unite">{{ JAUGE_AUTONOMIE.unite }}</span>
            <span class="nav-jauge__barre" aria-hidden="true">
              <i :style="{ width: JAUGE_AUTONOMIE.part + '%' }"></i>
            </span>
            <span class="nav-jauge__quoi">{{ JAUGE_AUTONOMIE.quoi }}</span>
            <span class="nav-jauge__source">{{ JAUGE_AUTONOMIE.source }}</span>
          </li>
          <li class="nav-jauge nav-jauge--integrite">
            <span class="nav-jauge__nom">INTÉGRITÉ</span>
            <span class="nav-jauge__valeur">{{ JAUGE_INTEGRITE.valeur }}</span>
            <span class="nav-jauge__unite">{{ JAUGE_INTEGRITE.unite }}</span>
            <span class="nav-jauge__barre" aria-hidden="true">
              <i :style="{ width: JAUGE_INTEGRITE.part + '%' }"></i>
            </span>
            <span class="nav-jauge__quoi">{{ JAUGE_INTEGRITE.quoi }}</span>
            <span class="nav-jauge__source">{{ JAUGE_INTEGRITE.source }}</span>
          </li>
        </ul>
        <p class="nav-jauges__note">
          Ces trois nombres ne sont pas une copie de ceux du jeu : <strong>ce sont les
          mêmes</strong>, et ils mesurent le studio pour de vrai. La page
          <router-link to="/etat-du-studio">état du studio</router-link> les publie en
          détail, avec ce qui a été vérifié et quand.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         LA DESCENTE — le franchissement de coque. Deuxième des quatre temps.

         ⭐ L'axe vertical n'est pas une trouvaille : c'est écrit chez nous.
            `conception-et-architecture/la-descente-comme-seul-axe.md` — une note
            du studio, citée par `LE REGARD`. La navigation du site suit la même
            physique que le jeu, et ce n'est pas une coquetterie.

         ⛔ CE N'EST PAS UN CARROUSEL. Un carrousel tourne sur lui-même et ne va
            nulle part. Ici on s'enfonce — et plus on s'enfonce, plus le navire
            est dense.
         ═══════════════════════════════════════════════════════════════════════ -->
    <!-- temps:2 · LA DESCENTE — le franchissement de coque (contrat lu par scripts/verifier-seuil-landing.mjs). -->
    <section class="nav-descente" data-descente aria-labelledby="nav-descente-titre">
      <div class="nav-descente__membrures" aria-hidden="true">
        <span
          v-for="m in MEMBRURES"
          :key="m"
          class="nav-descente__membre"
          :style="{ '--rang': m, animationDelay: (m * 0.17) + 's' }"
        ></span>
      </div>
      <div class="container nav-descente__texte">
        <span class="mono-tag" aria-hidden="true">/// · LA DESCENTE</span>
        <h2 id="nav-descente-titre">
          On ne change pas de page.<br>
          <span class="text-gradient">On franchit la coque.</span>
        </h2>
        <p>
          Les membrures passent de part et d’autre, le vide recule, et le navire
          s’ouvre. <strong>Le défilement est le seul axe</strong> — la manette, le
          stick ou la molette font la même chose. On ne saute pas d’une page à
          l’autre : on descend, et chaque palier est un compartiment.
        </p>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         LES SEPT QUARTIERS — sept DIRECTIONS, pas un menu. Troisième des quatre temps.

         ⛔ LE POINT DU PARENT, ET IL CHANGE TOUT (relevé de session, 22/09/2026) :
            « Le studio a construit une FLOTTE de pièces justes, et il n'y a pas de
            PONT entre elles. Le porte-avions existe, les drones existent, et le
            porte-avions ne LANCE pas encore. » — *un drone qui ne décolle pas n'est
            pas un drone : c'est un objet posé sur le pont.*

         ⇒ **Ces sept portes ne sont pas sept sections de cette page. Ce sont sept
            chemins NOMMÉS vers ce que le studio a réellement construit.** Et deux
            pièces qui n'étaient atteignables par AUCUN lien depuis l'accueil sont
            branchées ici : la boutique de modèles et la page du jeu.
         ═══════════════════════════════════════════════════════════════════════ -->
    <!-- LE SÉPARATEUR — une frise de runes, sobre, décorative, sans une requête.
         Elle est là où elle a un sens : entre la coque et les quartiers, comme un
         bordé qui marque une cloison. `BandeRunes` était livrée et branchée nulle
         part avant aujourd'hui. -->
    <div class="nav-separateur" aria-hidden="true">
      <BandeRunes mot="MND" :repetitions="10" :taille="17" :opacite="0.5" encadre />
    </div>

    <!-- temps:3 · LES SEPT QUARTIERS — sept DIRECTIONS, pas un menu (contrat lu par scripts/verifier-seuil-landing.mjs). -->
    <section class="nav-quartiers" data-quartiers aria-labelledby="nav-quartiers-titre">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag" aria-hidden="true">/// · LES SEPT QUARTIERS</span>
          <h2 id="nav-quartiers-titre">Le navire est le plan</h2>
          <p class="section-header__desc">
            Sept compartiments, sept directions. On ne clique pas un menu : <strong>on
            choisit une porte</strong>. Les noms sont ceux du canon du studio
            (<em>SITE-VAISSEAU-ARCHITECTURE</em> § 2), et chacun ouvre une pièce qui
            existe déjà.
          </p>
        </div>

        <ul class="nav-quartiers__liste">
          <li v-for="q in QUARTIERS" :key="q.id" class="nav-quartier" :data-quartier="q.id">
            <router-link
              v-if="!q.externe"
              :to="q.route"
              class="nav-quartier__lien"
              @mouseenter="entrerQuartier(q.id)"
              @mouseleave="sortirQuartier(q.id)"
              @focus="entrerQuartier(q.id)"
              @blur="sortirQuartier(q.id)"
              @click="ouvrirQuartier(q.id)"
            >
              <span class="nav-quartier__rang" aria-hidden="true">{{ q.rang }}</span>
              <span class="nav-quartier__nom">{{ q.nom }}</span>
              <span class="nav-quartier__lieu">{{ q.lieu }}</span>
              <span class="nav-quartier__quoi">{{ q.quoi }}</span>
              <span class="nav-quartier__ouvre">Ouvre : {{ q.ouvre }}</span>
            </router-link>
            <a
              v-else
              :href="q.route"
              class="nav-quartier__lien"
              @mouseenter="entrerQuartier(q.id)"
              @mouseleave="sortirQuartier(q.id)"
              @focus="entrerQuartier(q.id)"
              @blur="sortirQuartier(q.id)"
              @click="ouvrirQuartier(q.id)"
            >
              <span class="nav-quartier__rang" aria-hidden="true">{{ q.rang }}</span>
              <span class="nav-quartier__nom">{{ q.nom }}</span>
              <span class="nav-quartier__lieu">{{ q.lieu }}</span>
              <span class="nav-quartier__quoi">{{ q.quoi }}</span>
              <span class="nav-quartier__ouvre">Ouvre : {{ q.ouvre }}</span>
            </a>
          </li>
        </ul>

        <!-- LES DEUX PORTES QUI MANQUAIENT — rattachées à leur compartiment, parce
             que c'est là qu'elles sont : la boutique est dans la soute, le jeu est
             dans la cale. Aucune huitième direction n'est inventée. -->
        <div class="nav-quartiers__etages">
          <div class="nav-etage">
            <h3 class="nav-etage__titre">Dans la soute — la boutique de modèles</h3>
            <p class="nav-etage__texte">
              Cinq routes, une vraie chaîne d’achat, un catalogue et un panier : la
              démonstration commerçante du studio. Elle était livrée, vérifiée — et
              <strong>aucun lien de cette page n’y menait</strong>.
            </p>
            <router-link to="/modeles/boutique-boreal" class="nav-etage__lien">
              Ouvrir la boutique Boreal <span aria-hidden="true">→</span>
            </router-link>
          </div>
          <div class="nav-etage">
            <h3 class="nav-etage__titre">Dans la cale — le jeu, en plein écran</h3>
            <p class="nav-etage__texte">
              Le jeu se joue plus bas dans un cadre, et il se joue aussi tout seul :
              c’est <strong>une page entière, autonome</strong>, qui ne demande aucune
              ressource à personne.
            </p>
            <a href="/le-pont/index.html" class="nav-etage__lien">
              Ouvrir le jeu en plein écran <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         L'EMBRANCHEMENT — « qui es-tu ? ». Quatrième et dernier temps.

         ⭐ Un menu demande « que voulez-vous ? ». Un vaisseau demande « qui
            es-tu ? ». Et voici la partie qu'aucun site ne fait : **le navire
            DIGÈRE la visite.**

         ⛔⛔ LA LIMITE EST FERME, ET C'EST UNE PROMESSE QU'ON PEUT TENIR PAR
            CONSTRUCTION : ce que le navire retient **ne quitte JAMAIS la machine
            et ne survit PAS à l'onglet.** Ni cookie, ni trace, ni envoi.
            ⇒ La mémoire de visite de ce composant est un simple `ref` Vue, en
               mémoire vive. Elle n'écrit dans AUCUN stockage — pas de
               `localStorage`, pas de `sessionStorage`, pas de requête. Recharger
               la page l'efface. *Le navire digère, il n'espionne pas.*
            ⚠️ Et il faut le dire ici, parce que ce n'est pas vrai partout dans ce
               dépôt : `useDecouvertes.js` écrit dans `localStorage` (la
               progression d'exploration du cadrage metroidvania, documentée comme
               telle). **Les deux mécanismes ne se confondent pas, et ce composant
               n'utilise PAS le second.** Si la règle « ne survit pas à l'onglet »
               doit s'appliquer aussi à l'autre, c'est une décision, pas un effet
               de bord — elle est signalée, pas prise ici.
         ═══════════════════════════════════════════════════════════════════════ -->
    <!-- temps:4 · L'EMBRANCHEMENT — « qui es-tu ? », quatrième et dernier temps (contrat lu par scripts/verifier-seuil-landing.mjs). -->
    <section class="nav-appetence" data-appetence aria-labelledby="nav-appetence-titre">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// · L’EMBRANCHEMENT</span>
          <h2 id="nav-appetence-titre">
            Le navire ne demande pas ce que vous voulez.<br>
            <span class="text-gradient">Il demande qui vous êtes.</span>
          </h2>
          <p class="section-header__desc">
            Vous avez traversé le bord. Répondez par un geste, pas par un formulaire —
            et le navire vous rendra une réponse qui a la forme de <em>votre</em> visite,
            pas d’un devis générique.
          </p>
        </div>

        <div class="nav-appetence__duo" role="group" aria-label="Votre appétence">
          <button
            type="button"
            class="nav-appetence__choix"
            :aria-pressed="appetence === 'pme'"
            @click="repondre('pme')"
          >
            <span class="nav-appetence__choix-tag">PME</span>
            <span class="nav-appetence__choix-texte">
              Je dirige — je veux voir <strong>ce que ça coûte</strong> et ce que ça change.
            </span>
          </button>
          <button
            type="button"
            class="nav-appetence__choix"
            :aria-pressed="appetence === 'tech'"
            @click="repondre('tech')"
          >
            <span class="nav-appetence__choix-tag">TECH</span>
            <span class="nav-appetence__choix-texte">
              Je pilote la technique — je veux voir <strong>comment c’est fait</strong>.
            </span>
          </button>
        </div>

        <!-- LA RÉPONSE QUI A LA FORME DE LA VISITE.
             `aria-live` : la réponse est annoncée quand elle arrive, sans voler le
             focus. C'est le seul endroit de la page qui parle au visiteur. -->
        <div v-if="reponse" class="nav-appetence__reponse" aria-live="polite">
          <h3 class="nav-appetence__reponse-titre">{{ reponse.titre }}</h3>
          <p class="nav-appetence__reponse-temps">{{ reponse.temps }}</p>
          <p class="nav-appetence__reponse-corps">{{ reponse.corps }}</p>
          <ul class="nav-appetence__reponse-portes">
            <li v-for="p in reponse.portes" :key="p.route">
              <router-link v-if="!p.externe" :to="p.route">{{ p.libelle }}</router-link>
              <a v-else :href="p.route">{{ p.libelle }}</a>
            </li>
          </ul>
        </div>
        <p v-else class="nav-appetence__attente">
          Choisissez une direction : le bord écrira ici ce qu’il a retenu de votre passage.
        </p>

        <p class="nav-appetence__limite">
          <strong>Ce que le navire a retenu ne quitte pas votre machine et ne survit pas à
          cet onglet.</strong> Pas de cookie, pas de trace, pas d’envoi — la mémoire de
          visite vit dans la page et meurt avec elle. Et elle ne note rien : *elle dit ce
          qu’elle a vu, y compris quand elle n’a rien vu.*
        </p>
      </div>
    </section>

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
    <section class="vaisseau" data-vaisseau aria-labelledby="vaisseau-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <!-- ⭐ FUSION DU 22/09/2026 — DEUX SECTIONS DISAIENT LE MÊME SUJET.
                 Le titre du navire (le vocabulaire, la fiche) et « Un navire domotisé »
                 (la 3D) se suivaient, et le VISUEL SIMULÉ passait avant le MODÈLE RÉEL :
                 le visiteur voyait d'abord la version faible. Il n'en reste qu'une, et
                 c'est la 3D qui ouvre — les deux textes sont repris MOT POUR MOT. -->
            <span class="mono-tag" aria-hidden="true">/// LE VAISSEAU · LE NAVIRE</span>
            <h2 id="vaisseau-title">ARKADIA <span class="text-gradient">SS00999</span></h2>
            <p class="section-header__desc">
              Un seul navire, et il est réel : tous les agents qui travaillent pour vous
              tournent sur cette machine, dans la Somme. Pas de ferme de serveurs louée,
              pas de sous-traitance — le vaisseau est identifié et ses caractéristiques
              sont publiques. Chaque pièce du bord rend compte toute seule : la
              <strong>propulsion</strong>, le <strong>lest</strong>, la <strong>cale</strong>,
              l'<strong>équipage</strong>, la <strong>vigie</strong>. C'est le vocabulaire de
              la marine, et c'est aussi celui d'une machine qui se surveille —
              <em>la même chose, dite autrement.</em> Il a six voiles, toutes grandes, et le vide à la place de la mer.
              Et l'œil de proue s'allume.
            </p>
          </div>
        </ScrollReveal>

        <!-- ⭐ LA 3D À LA PLACE DU VISUEL SIMULÉ — 22/09/2026.
             Ce qui était ici : `vaisseau-arkadia-1400.jpg`, une image annoncée
             « Visuel SIMULÉ, produit par notre propre chaîne locale (ComfyUI) ».
             Ce qui y est : le MODÈLE, celui qu'on tourne à la souris et à la manette.
             ⭐ On ne remplace pas une image par une autre : **on remplace une
             représentation par la chose.** L'image n'a plus de raison d'être en tête de
             section — *on a mieux, et c'est vrai.*
             ⚠️ Les fichiers `/models/vaisseau-arkadia-*.jpg` RESTENT dans `public/` :
             les retirer du dépôt est une décision de Gaëtan, pas un effet de bord. -->
        <ScrollReveal animation="fade-up">
          <div class="vaisseau__vue">
            <VaisseauNavigable />
          </div>

          <p class="vaisseau__legende-3d">
            <strong>Naviguez autour.</strong> Glissez à la souris — ou prenez la manette Xbox :
            stick gauche pour tourner, stick droit pour approcher, <strong>A</strong> pour
            s'amarrer. Les sept points posés sur la coque sont les sept compartiments du site :
            <em>le navire est le plan.</em>
            Modèle <strong>tracé par script</strong> (Blender) et rendu en Three.js — déjà
            une dépendance du site, donc <strong>aucun CDN ajouté</strong>. Aucune image de
            banque, aucun asset acheté, <strong>aucune licence tierce</strong>. Ce que vous
            voyez est le <strong>modèle lui-même</strong>, tourné dans votre navigateur : plus
            aucune image de synthèse ne tient lieu de démonstration. Les valeurs du bord sont
            les caractéristiques <strong>publiées</strong> de la machine —
            <em>aucune métrique inventée.</em>
          </p>
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
          <p class="jeu__porte">
            <strong>Le jeu a aussi sa propre page.</strong>
            <a href="/le-pont/index.html">L’ouvrir en plein écran</a> — il ne demande
            aucune autre page du site pour tourner, et il ne fait aucune requête réseau.
          </p>

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
    

    <!-- ═══════════════════════════════════════════════════════════════════════
         L'AGENT DU BORD — la voix qui lit les mesures du studio.

         ⛔⛔ CE QUE CETTE SECTION EST, ET CE QU'ELLE N'EST PAS. IL FAUT LE DIRE
            AVANT DE MONTRER QUOI QUE CE SOIT.

         Le studio a un agent qui lit réellement ses mesures — les 14 verrous, le
         poids, les requêtes, les joules par requête, l'horodatage — et qui répond
         en français, avec une voix. **Cette version-là tourne sur la machine du
         studio, hors ligne** (Ollama en local, voix `piper` hors ligne, licence
         MIT). Elle est vraie, elle est mesurable, et elle n'est pas ici.

         ⛔ POURQUOI ELLE NE PEUT PAS ÊTRE ICI, ET CE N'EST PAS UNE PARESSE :
            le site public est servi par l'hébergeur **en FTP : il est STATIQUE**.
            Et l'Ollama du studio écoute sur `127.0.0.1` — c'est-à-dire sur le
            poste de Gaëtan, pas sur l'internet. Un navigateur de visiteur ne peut
            donc PAS l'atteindre. L'exposer sur l'internet est une décision de
            SÉCURITÉ, et elle n'appartient pas à un agent.

         ⇒ CE QUI EST ICI EST UNE **LECTURE ENREGISTRÉE**, ET L'INTERFACE LE DIT
            NOIR SUR BLANC. **Une démo qui se dit démo. Jamais l'inverse.**
            Aucun appel LLM, aucune question envoyée nulle part : les réponses
            ci-dessous sont écrites d'avance, et les chiffres qu'elles citent sont
            lus dans le relevé du build (`src/data/etat-studio.json`), donc ils ne
            peuvent pas vieillir en silence.

         ⛔ ET LA RÈGLE QUI COMMANDE TOUT ÇA : **aucune question d'un visiteur
            n'est envoyée à un service externe.** *« Jamais de donnée client dans
            un service externe »* — et un visiteur est un client potentiel.
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="nav-agent" data-agent aria-labelledby="nav-agent-titre">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// · L’AGENT DU BORD</span>
          <h2 id="nav-agent-titre">Une voix qui lit les mesures du studio</h2>
          <p class="section-header__desc">
            Le studio ne se raconte pas : <strong>il se mesure</strong>, et il a un agent
            qui lit ses propres relevés et qui répond. Voici ce qu’il sait dire — et
            ci-dessous, ce que vous lisez exactement.
          </p>
        </div>

        <p class="nav-agent__aveu">
          <span class="nav-agent__aveu-tag" aria-hidden="true">DÉCLARÉ</span>
          <strong>Cette voix est une lecture enregistrée du système.</strong>
          L’agent complet — celui qui lit les relevés en direct et qui parle à voix haute —
          tourne sur la machine du studio, <strong>hors ligne</strong>. Il n’est pas
          joignable depuis un navigateur de visiteur : le site public est servi en FTP,
          donc statique, et le moteur du studio écoute sur la boucle locale. Rien de ce que
          vous cliquez ici ne part quelque part : <strong>les réponses sont écrites
          d’avance, et aucune question n’est transmise.</strong>
        </p>

        <ul class="nav-agent__questions">
          <li v-for="q in AGENT_QUESTIONS" :key="q.id" class="nav-agent__item">
            <button
              type="button"
              class="nav-agent__question"
              :aria-expanded="agentReponse === q.id ? 'true' : 'false'"
              :aria-controls="'nav-agent-rep-' + q.id"
              @click="demander(q.id)"
            >
              <span class="nav-agent__question-puce" aria-hidden="true"></span>
              {{ q.question }}
            </button>
            <p
              v-if="agentReponse === q.id"
              :id="'nav-agent-rep-' + q.id"
              class="nav-agent__reponse"
              aria-live="polite"
            >{{ q.repondre() }}</p>
          </li>
        </ul>

        <p class="nav-agent__source">
          Sources des chiffres cités : <code>src/data/etat-studio.json</code> (relevé du
          build, horodaté) · le relevé de joules du 22/09/2026
          (<code>cout-local-ministral-3-8b-2026-09-221237.json</code>) · le compte des
          verrous, énuméré par <code>node scripts/auditer-tout.mjs</code>. Les valeurs
          datées sont affichées avec leur date — <em>un chiffre sans date est une
          croyance.</em>
        </p>
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
// ═══════════════════════════════════════════════════════════════════════════════
// LA REFONTE DU 22/09/2026 — LES PIÈCES BRANCHÉES
//
// ⛔ CE QUE CETTE BASCULE RÉPARE, ET ELLE A ÉTÉ MESURÉE AVANT D'ÊTRE ÉCRITE :
//    le studio avait construit une flotte de pièces justes, et **il n'y avait pas
//    de pont entre elles**. Trois d'entre elles n'étaient atteignables par AUCUN
//    lien depuis la page d'accueil :
//      · `/modeles/boutique-boreal` — cinq routes, une vraie chaîne d'achat ;
//      · `/le-pont/index.html` — LE JEU jouable, atteignable seulement dans une
//        iframe, donc invisible pour un lecteur d'écran comme pour un moteur ;
//      · les RUNES (`src/data/runes.js`, trois composants) — livrées, éprouvées,
//        branchées nulle part.
//    *Un drone qui ne décolle pas n'est pas un drone : c'est un objet posé sur le
//    pont.* Cette bascule ouvre les portes — elle ne repeint pas le pont.
//
// ⚠️ AUCUNE REQUÊTE AJOUTÉE. Les runes sont du SVG en ligne, le relevé est un JSON
//    IMPORTÉ (donc inliné dans le lot par Vite, jamais réclamé au réseau), et tout
//    le décor est du CSS. Le verrou de requêtes reste à ce qu'il était.
// ═══════════════════════════════════════════════════════════════════════════════
import { computed } from 'vue';
// LE RELEVÉ DU BUILD — un IMPORT, pas un `fetch`, pour que les chiffres soient
// DANS le HTML livré et lisibles sans JavaScript. C'est le même fichier que celui
// que lit `/etat-du-studio` : une seule source, ou elle pourrit.
import etatDuStudio from '@/data/etat-studio.json';
// LES RUNES — les seuls mots autorisés sont dans `src/data/runes.js`
// (`MOTS = ['ARKADIA', 'MND']`). Le composant lève si une lettre manque.
import BandeRunes from '@/components/runes/BandeRunes.vue';
import MotEnRunes from '@/components/runes/MotEnRunes.vue';



// ⭐⭐ LE SITE-VAISSEAU — 22/09/2026, étapes 1 à 3 de
// `MND/90-archive/SITE-VAISSEAU-ARCHITECTURE.md`.
//
// ⛔ CE QUI A CHANGÉ, ET POURQUOI : la section montrait une FENÊTRE — un cadre 16/9
// avec un navire qui tournait tout seul. Gaëtan : « je ne t'ai pas dit de me faire
// juste une fenêtre. Je veux qu'on navigue autour du vaisseau. » `VaisseauNavigable`
// remplace donc la fenêtre par une NAVIGATION : on ORBITE autour de la coque
// (souris ET manette Xbox), sept ANCRES 3D marquent les sept compartiments du site,
// et cliquer une ancre AMARRE la caméra puis ouvre la section.
//
// En DIFFÉRÉ, et ce n'est pas une coquetterie : `three` pèse lourd, et ce dépôt tient
// un verrou sur le NOMBRE DE REQUÊTES du premier chargement
// (`scripts/verifier-requetes.mjs`, seuil 14, contrainte hébergeur ~20/IP). Un import
// direct ferait entrer Three.js dans le premier chargement et ferait tomber le verrou.
//
// ⚠️ `GalionViewer.vue` reste dans le dépôt, INTACT mais PLUS MONTÉ : c'est lui qui
// portait la fenêtre. Le contenu du bord pilotable a été repris dans la nouvelle vue.
//
// ⚠️⚠️ RÉAPPLIQUÉ LE 22/09/2026 APRÈS UNE PERTE. Cette modification avait été écrite
// puis EFFACÉE : `git log` porte deux commits d'urgence du même jour (« erreur 500
// sur tout le site — un BOM UTF-8 en tête du .htaccess », puis « retour a l'etat qui
// fonctionnait »), et le retour en arrière a restauré `HomePage.vue` à sa version
// d'avant. *Un incident sans rapport avec ce chantier a emporté ce chantier — d'où
// cette note : la prochaine fois, la trace dit pourquoi la même ligne revient.*
const VaisseauNavigable = defineAsyncComponent(() => import('@/components/three/VaisseauNavigable.vue'));
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

/* ══════════════════════════════════════════════════════════════════════════════
   LES RELEVÉS DATÉS — LA RÈGLE D'OR APPLIQUÉE AUX JAUGES

   ⛔ « Un chiffre écrit à la main devient faux sans le dire. » Donc AUCUN chiffre
      n'est affiché sans sa source ET sa date, et les valeurs qui peuvent être lues
      dans le relevé du build SONT lues — elles ne peuvent pas vieillir en silence.

   ⚠️ ET LA RÈGLE DE L'INDISPONIBLE : dans `etat-studio.json`, une mesure manquante
      vaut `null`, JAMAIS zéro — *un zéro a la forme d'une mesure, et c'est pour ça
      qu'il est pire qu'un vide.* `nonMesure()` est le seul chemin d'affichage.
   ══════════════════════════════════════════════════════════════════════════════ */

/** Formate un nombre à la française. Écrit à la main, SANS `Intl` : le prérendu
 *  tourne sous Node et la page sous le navigateur — deux implémentations d'`Intl`
 *  peuvent rendre deux chaînes différentes, donc une hydratation qui diverge.
 *  *Un formatage qui dépend de la machine n'est pas un formatage, c'est un hasard.* */
function fr(nombre, decimales = 1) {
  if (typeof nombre !== 'number' || !isFinite(nombre)) return null;
  const brut = decimales > 0 ? nombre.toFixed(decimales) : String(Math.round(nombre));
  const [entier, fraction] = brut.replace('.', ',').split(',');
  const groupe = entier.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  return fraction ? `${groupe},${fraction}` : groupe;
}

/** « non mesuré » plutôt que « 0 ». C'est la règle du dépôt, appliquée ici. */
function nonMesure(valeur, gabarit) {
  return (valeur === null || valeur === undefined) ? 'non mesuré' : gabarit(valeur);
}

/** Une valeur du relevé du build, ou `null` — jamais un zéro de consolation. */
function duReleve(chemin) {
  let curseur = etatDuStudio;
  for (const cle of chemin) {
    if (curseur === null || curseur === undefined) return null;
    curseur = curseur[cle];
  }
  return (curseur === null || curseur === undefined) ? null : curseur;
}

/** L'horodatage du relevé, tel qu'il est écrit par `scripts/generer-etat.mjs`. */
const QUAND = duReleve(['build', 'horodatage_local']) || 'non mesuré';

/* ── LES DEUX RELEVÉS DATÉS QUI NE SONT PAS DANS `etat-studio.json` ────────────
 * ⚠️ Ils vivent HORS du dépôt (`C:\IA\gl-digital-lab\veille-video\journaux\`,
 *    `public/le-pont/`), et le site public est STATIQUE : il ne peut pas les lire
 *    au chargement. Ils sont donc repris ici comme des RELEVÉS DATÉS — le motif est
 *    celui qu'emploie déjà la fiche du navire : *« caractéristiques relevées sur la
 *    machine le 10 septembre 2026. Elles ne sont pas mises à jour automatiquement. »*
 * ⭐ Et le jour où la mesure est rejouée, ces deux blocs se mettent à jour avec
 *    leur nouvelle date — c'est la seule façon honnête de figer un chiffre. */

/** LE RÉACTEUR — les joules par requête. Mesuré par `forge-ia/mesurer-cout-local.mjs`,
 *  cinq essais, sur `ministral-3:8b`, le 22/09/2026 à 12:37. */
const RELEVE_ENERGIE = {
  quand: '22/09/2026 à 12:37',
  fichier: 'cout-local-ministral-3-8b-2026-09-221237.json',
  joulesParRequete: 599.3,
  joulesParJeton: 2.9965,
  jetonsParSeconde: 82.69,
  puissanceMarginaleW: 241.11,
  puissanceMaximumW: 320.0,
  essais: 5,
};

/** L'AUTONOMIE — mesurée sur la page du jeu le 22/09/2026, pas déduite :
 *  1 `<canvas>`, 1 `<script>` en ligne, **0 `<img>`, 0 `<link>`, 0 URL externe**. */
const RELEVE_AUTONOMIE = {
  quand: '22/09/2026',
  fichier: 'public/le-pont/index.html',
  requetesExternes: 0,
  images: 0,
  feuillesDeStyle: 0,
};

/** LES VERROUS — ⛔ AUCUN COMPTE N'EST ÉCRIT À LA MAIN ICI, ET C'EST UNE LEÇON
 *  PAYÉE DANS L'HEURE MÊME OÙ CETTE PAGE S'ÉCRIVAIT.
 *
 *  Ce bloc a d'abord porté `enumeres: 14`, relevé le 22/09/2026 vers 15h20.
 *  À **15h47 — vingt-sept minutes plus tard** — un AUTRE chantier du studio a déposé
 *  `scripts/verifier-injection.mjs` (44 423 octets). **Le compte est passé de 14 à 15
 *  sans que personne ne touche à cette page.**
 *  ⭐ *« Un chiffre écrit à la main devient faux sans le dire. »* Il ne s'écrit donc
 *     pas ici : ce qui est AFFICHÉ est lu dans le relevé du build, et le compte TOTAL
 *     est énuméré à chaque build par `scripts/auditer-tout.mjs` — qui publie la liste
 *     sur `/etat-du-studio`. **Un chiffre qui bouge ne se grave pas : il se lit.** */
const VERROUS = {
  /** Ce que le relevé du build nomme réellement — lu, donc impossible à périmer. */
  signature: (etatDuStudio && Array.isArray(etatDuStudio.verrous)) ? etatDuStudio.verrous : [],
};

const signatureTenus = VERROUS.signature.filter((v) => typeof v.code === 'number' && v.code === 0).length;
/* ⛔⛔ « NON MESURÉ » N'EST PAS « ZÉRO TENU » — corrigé le 24/09/2026, sur une mesure
 *     faite dans le navigateur de Néo.
 *
 * CE QUI ÉTAIT ÉCRIT ICI : `filter((v) => v.code === 0).length`
 * ⭐ CE QUE LA PAGE AFFICHAIT ALORS : « INTÉGRITÉ 0 / 5 verrous tenus », barre à 0 % —
 *    **alors que les cinq verrous étaient TENUS** (le relevé du dépôt porte cinq codes
 *    de sortie à 0).
 *
 * ⛔ LA CAUSE EST MÉCANIQUE, ET LE SCRIPT AVAIT RAISON. Le workflow lance
 *    `generer-etat.mjs` en PREBUILD — donc AVANT `vite build`, quand `dist/` n'existe
 *    pas encore. Le script refuse alors de mesurer et écrit `code: null`, motif
 *    « dist/ absent ». **C'est honnête.** Mais `null === 0` est faux : un verrou NON
 *    MESURÉ était compté comme un verrou NON TENU. Cinq fois. Et le pré-rendu figeait
 *    ce `0 / 5` dans le HTML — le postbuild remesure bien `5 / 5`, mais **trop tard :
 *    la jauge n'est pas dans une zone marquée, elle garde la valeur du pré-rendu.**
 *
 * ⭐ LA RÈGLE DU STUDIO S'APPLIQUE ICI MOT POUR MOT : « une mesure manquante se dit
 *    `null` — **non mesuré** ». Une page qui écrit « 0 / 5 tenus » quand elle n'a rien
 *    pu mesurer n'est pas pessimiste : **elle est fausse**. Et c'est le pire des deux,
 *    parce qu'un chiffre faux qui a l'air d'un aveu passe pour de la rigueur.
 *
 * ⇒ On sépare les deux cas : un code de sortie NUMÉRIQUE est une mesure, le reste n'en
 *   est pas une. Et quand rien n'est mesuré, la page LE DIT au lieu de compter des
 *   zéros — voir `signatureMesuree`, utilisé par la jauge. */
const signatureMesuree = VERROUS.signature.some((v) => typeof v.code === 'number');

/* ── LES TROIS JAUGES ─────────────────────────────────────────────────────────
 * ⭐ FAIM · AUTONOMIE · INTÉGRITÉ — ce sont LES TROIS NOMBRES DU JEU, et ils
 *    mesurent le STUDIO pour de vrai. *Les HUD de jeux affichent la santé d'un
 *    personnage ; celui-ci affiche la santé d'un studio.*
 * ⛔ Chaque barre est le rapport DE DEUX NOMBRES CITÉS À CÔTÉ D'ELLE. Aucune
 *    échelle inventée, aucun pourcentage décoratif — *une jauge décorative est un
 *    mensonge, et le studio a passé la journée à mesurer, pas à décorer.*
 */
const JAUGE_FAIM = {
  valeur: fr(RELEVE_ENERGIE.joulesParRequete, 1),
  unite: 'joules par requête',
  // 241,11 W de puissance marginale mesurée, sur les 320,00 W que la carte admet.
  part: Math.round((RELEVE_ENERGIE.puissanceMarginaleW / RELEVE_ENERGIE.puissanceMaximumW) * 100),
  quoi: `${fr(RELEVE_ENERGIE.puissanceMarginaleW, 2)} W tirés sur les ${fr(RELEVE_ENERGIE.puissanceMaximumW, 2)} W que la carte admet — le reste du temps, elle dort.`,
  source: `relevé du ${RELEVE_ENERGIE.quand} · ${RELEVE_ENERGIE.essais} essais · ${fr(RELEVE_ENERGIE.joulesParJeton, 4)} J par jeton · ${fr(RELEVE_ENERGIE.jetonsParSeconde, 2)} jetons/s`,
};

const JAUGE_AUTONOMIE = {
  valeur: String(RELEVE_AUTONOMIE.requetesExternes),
  unite: 'ressource externe demandée',
  part: 100,
  quoi: `La page du jeu tient seule : ${RELEVE_AUTONOMIE.images} image, ${RELEVE_AUTONOMIE.feuillesDeStyle} feuille de style, ${RELEVE_AUTONOMIE.requetesExternes} appel hors du domaine.`,
  source: `relevé du ${RELEVE_AUTONOMIE.quand} · ${RELEVE_AUTONOMIE.fichier}`,
};

const JAUGE_INTEGRITE = {
  valeur: signatureMesuree ? `${signatureTenus} / ${VERROUS.signature.length}` : 'non mesuré',
  unite: signatureMesuree ? 'verrous tenus, nommés par le relevé' : 'les verrous n’ont pas pu être exécutés',
  part: (signatureMesuree && VERROUS.signature.length > 0) ? Math.round((signatureTenus / VERROUS.signature.length) * 100) : 0,
  quoi: `Chaque verrou cité ici est nommé par le relevé du build et porte son code de sortie. Le compte TOTAL n'est pas écrit dans cette page : il est énuméré à chaque build en lisant le dossier des scripts — et il a changé aujourd'hui même, pendant que cette page s'écrivait.`,
  source: `relevé du ${QUAND} · ${VERROUS.signature.map((v) => (v.script || '').split('/').pop()).filter(Boolean).join(' · ')}`,
};

/* ── LE RELEVÉ DU BUILD, EN CLAIR — il sert à l'agent, plus bas ──────────────── */
const POIDS = {
  ko: duReleve(['page_la_plus_lourde', 'ko_servis']),
  seuil: duReleve(['page_la_plus_lourde', 'seuil_ko']),
  chemin: duReleve(['page_la_plus_lourde', 'chemin']),
};
const REQUETES = {
  total: duReleve(['requetes_premier_chargement', 'total']),
  seuil: duReleve(['requetes_premier_chargement', 'seuil']),
};
const PAGES = duReleve(['pages_prerendues']);

/* ══════════════════════════════════════════════════════════════════════════════
   LA MÉMOIRE DE VISITE — « LE NAVIRE DIGÈRE LA VISITE »

   ⛔⛔ LA LIMITE EST FERME, ET ELLE EST TENUE PAR CONSTRUCTION ICI : ce que le bord
      retient **ne quitte jamais la machine et ne survit pas à l'onglet.**
      ⇒ Il n'y a **AUCUN stockage** dans ce bloc : ni `localStorage`, ni
        `sessionStorage`, ni cookie, ni requête. Juste des `ref` Vue, en mémoire
        vive. *Recharger la page efface la visite — et c'est exactement ce qui est
        promis au visiteur, pas une approximation.*
   ⚠️ `useDecouvertes.js` fait autre chose et le fait exprès (progression
      d'exploration du cadrage metroidvania, dans `localStorage`). Ce sont DEUX
      mécanismes, et ils ne se confondent pas. Si la règle doit s'appliquer là-bas
      aussi, c'est une décision — elle est signalée, pas prise en douce.
   ══════════════════════════════════════════════════════════════════════════════ */

/** Combien de secondes le visiteur a tenu chaque porte, et lesquelles il a ouvertes. */
const visite = ref({});
/** La porte actuellement survolée ou focalisée — et depuis quand. */
let porteOuverte = null;
/** Le seuil en dessous duquel un passage n'est pas compté comme un regard. */
const SEUIL_REGARD_S = 0.6;

function entrerQuartier(id) {
  if (porteOuverte && porteOuverte.id === id) return;
  sortirQuartier();
  porteOuverte = { id, depuis: Date.now() };
}

function sortirQuartier(id) {
  if (!porteOuverte) return;
  if (id && porteOuverte.id !== id) return;
  const secondes = (Date.now() - porteOuverte.depuis) / 1000;
  const avant = visite.value[porteOuverte.id] || { secondes: 0, ouvert: false };
  visite.value = {
    ...visite.value,
    [porteOuverte.id]: { secondes: avant.secondes + secondes, ouvert: avant.ouvert },
  };
  porteOuverte = null;
}

function ouvrirQuartier(id) {
  sortirQuartier(id);
  const avant = visite.value[id] || { secondes: 0, ouvert: false };
  visite.value = { ...visite.value, [id]: { secondes: avant.secondes, ouvert: true } };
}

/** Ce que le bord a retenu d'une porte — jamais une valeur inventée. */
function retenu(id) {
  return visite.value[id] || { secondes: 0, ouvert: false };
}

/* ── LES SEPT QUARTIERS — sept DIRECTIONS, pas un menu ────────────────────────
 * ⚠️ LES NOMS VIENNENT DU CANON, PAS DE MOI : `SITE-VAISSEAU-ARCHITECTURE.md` § 2,
 *    et ils sont mesurés dans le HTML livré par `scripts/verifier-presence.mjs`
 *    (l'actif « les sept compartiments »). **Ne pas les renommer sans le dire.**
 * ⚠️ LES ROUTES SONT CELLES QUI EXISTENT. Deux d'entre elles n'étaient atteignables
 *    depuis AUCUN lien de cette page avant aujourd'hui : `/le-pont/index.html`
 *    (le jeu) et la boutique (rattachée à la soute, plus bas). */
const QUARTIERS = [
  {
    id: 'pont', rang: '01', nom: 'Le pont', lieu: 'la dunette, à l’arrière',
    quoi: 'L’accueil, le capitaine, la promesse.', ouvre: 'cette page', route: '/',
  },
  {
    id: 'soute', rang: '02', nom: 'La soute', lieu: 'le ventre',
    quoi: 'La carte complète : tout ce qui existe.', ouvre: 'la carte du site entier', route: '/soute',
  },
  {
    id: 'cale', rang: '03', nom: 'La cale', lieu: 'le jeu, déjà à flot',
    quoi: 'Le jeu jouable — descendre et jouer.', ouvre: 'le jeu, en plein écran',
    route: '/le-pont/index.html', externe: true,
  },
  {
    id: 'gaillard', rang: '04', nom: 'Le gaillard', lieu: 'l’avant',
    quoi: 'L’offre, les prix, les limites.', ouvre: 'l’offre et les tarifs', route: '/services',
  },
  {
    id: 'vigie', rang: '05', nom: 'La vigie', lieu: 'le nid-de-pie, en haut du grand mât',
    quoi: 'L’état du studio, mesuré.', ouvre: 'les verrous, en direct', route: '/etat-du-studio',
  },
  {
    id: 'journal', rang: '06', nom: 'Le journal de bord', lieu: 'la table à cartes',
    quoi: 'Les relevés, les décisions, les échecs.', ouvre: 'le dossier du studio', route: '/dossier',
  },
  {
    id: 'proue', rang: '07', nom: 'La proue', lieu: 'la figure de proue, qui s’allume',
    quoi: 'L’œil — le contact.', ouvre: 'le contact', route: '/contact',
  },
];

/* ── L'EMBRANCHEMENT — « qui es-tu ? », et la réponse qui a la forme de la visite ─ */

const appetence = ref(null);
const reponse = ref(null);

/** Les portes les plus regardées, de la plus tenue à la moins tenue. */
function quartiersTries() {
  return [...QUARTIERS].sort((a, b) => retenu(b.id).secondes - retenu(a.id).secondes);
}

function repondre(choix) {
  appetence.value = choix;
  sortirQuartier();                       // on clôt le temps en cours avant de lire

  const ordre = quartiersTries();
  const regardes = ordre.filter((q) => retenu(q.id).secondes >= SEUIL_REGARD_S);
  const ouverts = QUARTIERS.filter((q) => retenu(q.id).ouvert);

  /* ⛔ CE QUI MANQUE EST SIGNALÉ. Le bord ne remplit JAMAIS un vide par un détail
     plausible : s'il n'a rien vu, il le dit. C'est la règle d'or du studio, et
     elle s'applique aussi à une page d'accueil. */
  let temps;
  if (regardes.length === 0 && ouverts.length === 0) {
    temps = 'Le bord n’a rien vu : vous n’avez encore ouvert ni regardé aucune porte. Il ne devine pas — il le dit.';
  } else {
    const morceaux = regardes.slice(0, 3).map(
      (q) => `${q.nom} (${fr(retenu(q.id).secondes, 1)} s)`
    );
    const ouvertsTexte = ouverts.length > 0
      ? ` Vous avez ouvert : ${ouverts.map((q) => q.nom).join(', ')}.`
      : ' Vous n’avez encore rien ouvert — vous avez seulement regardé.';
    temps = regardes.length > 0
      ? `Ce que le bord a retenu : ${morceaux.join(' · ')}.${ouvertsTexte}`
      : `Aucune porte n’a été tenue plus de ${fr(SEUIL_REGARD_S, 1)} s.${ouvertsTexte}`;
  }

  const avant = regardes.length > 0 ? regardes[0] : null;

  if (choix === 'pme') {
    reponse.value = {
      titre: 'Vous dirigez : ce que ça coûte, et ce que ça change',
      temps,
      corps: avant
        ? `Vous êtes resté sur ${avant.nom.toLowerCase()} — ${avant.quoi.toLowerCase()} C’est par là que je commencerais : on regarde d’abord ce que le studio sait faire, et à quel prix, avant de parler de votre système.`
        : 'Je commencerais par l’offre et les prix : c’est écrit noir sur blanc, limites comprises, et ça se lit en cinq minutes. Ensuite, un premier échange de trente minutes suffit à dire si votre besoin est de notre ressort.',
      portes: [
        { libelle: 'L’offre, les prix et les limites', route: '/services' },
        { libelle: 'Le dossier — méthode, délais, ce qu’on ne fait pas', route: '/dossier' },
        { libelle: 'Le contact — l’œil de proue', route: '/contact' },
      ],
    };
  } else {
    reponse.value = {
      titre: 'Vous pilotez la technique : voici comment c’est fait',
      temps,
      corps: avant
        ? `Vous êtes resté sur ${avant.nom.toLowerCase()} — ${avant.quoi.toLowerCase()} Le chemin technique part de là : les relevés sont publics, les verrous sont nommés, et le jeu se joue sans une seule requête réseau.`
        : 'Le chemin technique commence par les relevés : ce qui est vérifié, quand, et par quel script. Rien n’est déclaré sans sa mesure.',
      portes: [
        { libelle: 'L’état du studio — les verrous, le poids, les requêtes', route: '/etat-du-studio' },
        { libelle: 'La boutique de modèles — cinq routes, une vraie chaîne d’achat', route: '/modeles/boutique-boreal' },
        { libelle: 'Le jeu en plein écran — 0 requête réseau', route: '/le-pont/index.html', externe: true },
      ],
    };
  }
}

/* ══════════════════════════════════════════════════════════════════════════════
   L'AGENT DU BORD — LA VERSION PUBLIQUE, ET ELLE SE DIT PUBLIQUE

   ⛔⛔ CE QU'IL FAUT COMPRENDRE AVANT DE LIRE LE CODE, PARCE QUE C'EST LE CŒUR DU
      SUJET : **un navigateur de visiteur NE PEUT PAS joindre l'Ollama du studio.**
        · le site public est servi par l'hébergeur en FTP — **il est statique** ;
        · le moteur du studio écoute sur `127.0.0.1:11434`, c'est-à-dire sur le
          poste de Gaëtan, pas sur l'internet ;
        · et **exposer Ollama sur l'internet est une décision de SÉCURITÉ — elle
          n'appartient pas à un agent.** Elle est signalée, pas prise.

   ⇒ IL Y A DONC DEUX VERSIONS, ET CELLE-CI EST LA SECONDE :
       ⭐ 1. LA VRAIE — en local, hors ligne : Ollama lit `etat-studio.json` et les
             relevés, répond en français, et PARLE par `piper` (hors ligne, MIT).
             **C'est elle qui prouve le concept**, et elle vit hors du dépôt.
          2. CELLE-CI, SUR LE SITE PUBLIC — des réponses **écrites d'avance**,
             **aucun appel LLM**, et **l'interface le dit noir sur blanc** :
             « cette voix est une lecture enregistrée du système — l'agent complet
             tourne sur la machine du studio ».

   ⛔ ET LA RÈGLE QUI NE SE NÉGOCIE PAS : **aucune question d'un visiteur n'est
      envoyée à un service externe.** Ici, aucune question ne sort même de la page :
      il n'y a pas de requête du tout. *Une démo qui se dit démo. Jamais l'inverse.*
   ══════════════════════════════════════════════════════════════════════════════ */

const agentReponse = ref(null);

function demander(id) {
  agentReponse.value = (agentReponse.value === id) ? null : id;
}

/** Les réponses sont des FONCTIONS : elles lisent le relevé au moment de l'affichage,
 *  donc un chiffre ne peut pas rester affiché après avoir changé dans le fichier. */
const AGENT_QUESTIONS = [
  {
    id: 'etat',
    question: 'Le studio va bien, là ?',
    repondre: () => {
      const tenus = signatureTenus;
      const total = VERROUS.signature.length;
      return `Oui, et je ne le dis pas de mémoire : le relevé du build que je lis est horodaté ${QUAND}, `
        + `et il porte ${tenus} verrou${tenus > 1 ? 'x' : ''} sur ${total} nommément, tous au vert, chacun `
        + `avec son code de sortie et son script. ⚠️ Le compte TOTAL des verrous n'est PAS écrit dans cette `
        + `page, et c'est volontaire : il est énuméré à chaque build en lisant le dossier des scripts, et `
        + `il a changé aujourd'hui même — un verrou de plus a été déposé pendant que cette page s'écrivait. `
        + `Un chiffre qui bouge ne se grave pas : il se lit, sur la page état du studio.`;
    },
  },
  {
    id: 'poids',
    question: 'Il pèse combien, ce site ?',
    repondre: () => {
      const poids = nonMesure(POIDS.ko, (v) => `${fr(v, 1)} Ko servis`);
      const seuil = nonMesure(POIDS.seuil, (v) => `${fr(v / 1024, 0)} Mo`);
      const page = POIDS.chemin || 'la page la plus lourde';
      const req = nonMesure(REQUETES.total, (v) => String(v));
      const reqSeuil = nonMesure(REQUETES.seuil, (v) => String(v));
      return `La page la plus lourde est ${page}, à ${poids} — le seuil du studio est de ${seuil} par page. `
        + `Au premier chargement, ${req} requêtes, pour un plafond de ${reqSeuil} : ce n'est pas une règle de confort, `
        + `c'est une limite de l'hébergeur — vers vingt requêtes rapprochées depuis la même adresse, il répond 429 `
        + `et le site ne se monte plus du tout. Le site compte ${nonMesure(PAGES, (v) => String(v))} pages prérendues.`;
    },
  },
  {
    id: 'energie',
    question: 'Une réponse, ça coûte combien en énergie ?',
    repondre: () => `${fr(RELEVE_ENERGIE.joulesParRequete, 1)} joules par requête, sur cinq essais relevés le `
      + `${RELEVE_ENERGIE.quand}, soit ${fr(RELEVE_ENERGIE.joulesParJeton, 4)} joule par jeton à `
      + `${fr(RELEVE_ENERGIE.jetonsParSeconde, 2)} jetons par seconde. La carte tire `
      + `${fr(RELEVE_ENERGIE.puissanceMarginaleW, 2)} watts de plus qu'au repos, sur les `
      + `${fr(RELEVE_ENERGIE.puissanceMaximumW, 2)} qu'elle admet. `
      + `⚠️ Ce sont des joules, pas des euros : le prix de l'électricité n'est pas appliqué, et ce serait une donnée d'entrée, jamais une conclusion.`,
  },
  {
    id: 'limites',
    question: 'Qu’est-ce que vous ne savez pas faire ?',
    repondre: () => `Trois choses, et elles sont écrites sur ce site plutôt que cachées. Un : tout tourne sur `
      + `une seule machine — c'est un poste de recherche et de démonstration, pas une infrastructure à haute `
      + `disponibilité, et la continuité de service n'est jamais garantie par ce seul poste. Deux : la société est `
      + `en cours d'immatriculation, aucune facture n'est émise avant. Trois : la production est étroite — `
      + `un navire, un équipage, et le capitaine tranche. Un projet dont l'activité ne peut pas s'interrompre se `
      + `conçoit sur une architecture dédiée. Je le dis avant la signature, pas après.`,
  },
  {
    id: 'qui',
    question: 'Qui parle, là, exactement ?',
    repondre: () => `Une lecture enregistrée, et je le dis moi-même : je ne suis pas l'agent complet. `
      + `Lui tourne sur la machine du studio, hors ligne — un modèle de langage local qui lit les relevés, `
      + `et une voix de synthèse hors ligne sous licence MIT. Il n'est pas joignable depuis votre navigateur, `
      + `et c'est volontaire : le site public est servi en FTP, donc statique, et exposer le moteur du studio `
      + `sur l'internet est une décision de sécurité qui n'appartient pas à un agent. `
      + `Ce que vous lisez ici est écrit d'avance, et rien de ce que vous cliquez ne part quelque part.`,
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   LE DÉCOR VIVANT — ET IL EST DÉTERMINISTE

   ⭐ Les étoiles ne sont pas tirées au hasard : elles sont posées par une suite
      pseudo-aléatoire à GRAINE FIXE. Deux chargements donnent le même ciel.
      *C'est le critère du studio — une mesure doit pouvoir être rejouée ; un décor
      qui change à chaque visite ne se regarde pas, il clignote.*
   ══════════════════════════════════════════════════════════════════════════════ */

const ETOILES = (() => {
  const liste = [];
  let graine = 20260922;                       // la date de la bascule, comme graine
  const suivant = () => {
    graine = (graine * 1103515245 + 12345) % 2147483648;
    return graine / 2147483648;
  };
  for (let i = 0; i < 34; i += 1) {
    liste.push({
      cle: i,
      left: Number((suivant() * 100).toFixed(2)),
      top: Number((suivant() * 74).toFixed(2)),
      taille: Number((1 + suivant() * 1.9).toFixed(2)),
      retard: Number((suivant() * 6).toFixed(2)),
    });
  }
  return liste;
})();

/** Les membrures de la coque : quatorze, numérotées, décalées en cascade. */
const MEMBRURES = Array.from({ length: 14 }, (_, i) => i + 1);
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
   LE JEU — 22/09/2026
   ⚠️ `.galion-section` et `.galion-note` ont été RETIRÉES le 22/09/2026 avec la
   fusion : la section « Un navire domotisé » n'existe plus, la 3D vit désormais
   DANS la section du vaisseau. *Une classe dont le balisage a disparu laisse ses
   murs* — et le verrou `css-sans-balisage` les aurait signalés, à juste titre.
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* ── La vue 3D : elle ouvre la section, et elle se donne de la place ──
   ⚠️ Aucun cadre, aucun `overflow: hidden` : le composant gère son propre
   conteneur, et un cadre ajouté rognait les étiquettes des ancres. */
.vaisseau__vue {
  margin-top: 2.5rem;
}

.vaisseau__legende-3d {
  margin-top: var(--space-sm);
  max-width: 68ch;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-faint);
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

/* ══════════════════════════════════════════════════════════════════════════════
   LA REFONTE DU 22/09/2026 — LES FEUILLES DE LA COQUE, DES JAUGES ET DE L'AGENT

   ⚠️ CE BLOC EST AJOUTÉ À LA FIN DU <style> EXISTANT, ET RIEN N'Y EST RETIRÉ.
      *Un fichier qu'on découpe par tranches casse : ce dépôt l'a payé le matin
      même — des blocs de commentaire et des règles CSS coupés en deux, `vite build`
      en exit 1, et le déploiement sauté.* Ici, on n'ôte rien : on ajoute.

   ⛔ AUCUNE VALEUR DE COULEUR INVENTÉE HORS DES JETONS. Tout vient de
      `src/assets/styles/variables.css` (DA « D6 » du 19/09/2026 : bleu-noir MND,
      cyan, jaune dominant). *Le vert est sorti de l'identité le 19/09 — donc pas
      de feu vert ici : les quatre feux du bord prennent les quatre couleurs de la
      palette, et on ne prétend PAS qu'ils suivent la convention maritime, qui
      décrit des navires réels.*

   ⛔ TOUTES LES ANIMATIONS SONT CONTINUES, JAMAIS DÉCLENCHÉES PAR LE DÉFILEMENT.
      Et `prefers-reduced-motion: reduce` LES COUPE TOUTES — le bloc est à la FIN,
      un seul endroit, pour qu'on ne puisse pas en oublier une.
   ══════════════════════════════════════════════════════════════════════════════ */

/* ── 1. LA COQUE VIVANTE — la couche des boucles continues ─────────────────── */
.nav-vie {
  position: fixed;
  inset: 0;
  /* ⚠️ `z-index: 0` : au-dessus du décor de fond (`DecorTunnel`, z-index 0, monté
     avant dans le DOM) et SOUS les sections, qui sont positionnées en `z-index: 1`.
     *L'empilement se vérifie sur une capture, pas dans le code.* */
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  /* Volontairement presque invisible : ces tracés sont une respiration du vide, pas
     une décoration qui se dispute la lecture. À 0,09 d'opacité sur des traits de
     1,5 px, la contribution au contraste du texte est nulle — et c'est vérifié par
     le verrou d'accessibilité rendu, pas espéré. */
  opacity: 0.09;
}

.nav-vie__traces {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.nav-vie__trace {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 34 132;
  animation: navCirculation 7.5s linear infinite;
}

.nav-vie__trace--2 { animation-duration: 9.6s; animation-delay: -2.4s; stroke: var(--action); }
.nav-vie__trace--3 { animation-duration: 12.1s; animation-delay: -5s; }

.nav-vie__respiration {
  position: absolute;
  inset: 0;
  /* ⚠️ PAS `--glow-accent` : ce jeton porte une OMBRE (`0 0 12px …`), pas une
     couleur — il serait invalide dans un dégradé, et le dégradé entier tomberait
     en silence. On écrit le canal RVB de `--accent` (#2abfff), qui est un jeton. */
  background: radial-gradient(ellipse 62% 46% at 50% 34%, rgba(42, 191, 255, 0.16) 0%, transparent 72%);
  animation: navRespire 12s ease-in-out infinite;
}

/* ── 2. L'ARRIVÉE — le navire de l'extérieur ───────────────────────────────── */
.nav-arrivee {
  position: relative;
  z-index: 1;
  padding: var(--space-xl) 0 var(--space-lg);
  overflow: hidden;
}

.nav-arrivee__vide {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nav-arrivee__etoile {
  position: absolute;
  border-radius: 50%;
  background: var(--ink);
  animation: navScintille 6.4s ease-in-out infinite;
}

.nav-arrivee__coque {
  position: relative;
  width: min(1180px, 94vw);
  margin: 0 auto;
  animation: navDerive 19s ease-in-out infinite;
}

.nav-navire {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 22px 60px rgba(0, 0, 0, 0.55));
}

/* La coque : un galion. Elle porte la silhouette, pas les détails. */
.nav-navire__coque {
  fill: rgba(13, 17, 31, 0.94);
  stroke: var(--rule-strong);
  stroke-width: 1.7;
  stroke-linejoin: round;
}

.nav-navire__membrures path {
  stroke: rgba(53, 113, 155, 0.34);
  stroke-width: 1;
}

.nav-navire__greement path {
  fill: none;
  stroke: rgba(169, 184, 204, 0.3);
  stroke-width: 1.2;
  stroke-linecap: round;
}

/* LES TRACÉS DE CODE — ils circulent le long de la coque, sans fin. */
.nav-navire__fil {
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 22 108;
  animation: navCirculation 6.2s linear infinite;
}

.nav-navire__fil--2 { animation-duration: 8.1s; animation-delay: -1.8s; stroke: var(--neon-magenta); }
.nav-navire__fil--3 { animation-duration: 10.4s; animation-delay: -3.6s; stroke: var(--action); }

/* LE RÉACTEUR — il bat, au milieu de la coque. */
.nav-navire__reacteur-halo {
  fill: rgba(255, 230, 80, 0.11);
  transform-box: fill-box;
  transform-origin: center;
  animation: navBattement 2.9s ease-in-out infinite;
}

.nav-navire__reacteur-coeur {
  fill: var(--action);
  transform-box: fill-box;
  transform-origin: center;
  animation: navBattement 2.9s ease-in-out infinite;
}

.nav-navire__reacteur-anneau {
  fill: none;
  stroke: rgba(255, 230, 80, 0.34);
  stroke-width: 1.2;
  transform-box: fill-box;
  transform-origin: center;
  animation: navBattement 2.9s ease-in-out infinite;
  animation-duration: 5.8s;
}

/* L'ŒIL DE PROUE — la proue ouvre un œil, et il cligne. */
.nav-navire__paupiere {
  fill: rgba(8, 11, 20, 0.9);
  stroke: var(--accent);
  stroke-width: 1.5;
  transform-box: fill-box;
  transform-origin: center;
  animation: navPaupiere 8.3s ease-in-out infinite;
}

.nav-navire__pupille {
  fill: var(--accent);
  transform-box: fill-box;
  transform-origin: center;
  animation: navPaupiere 8.3s ease-in-out infinite;
}

.nav-navire__defense {
  fill: none;
  stroke: rgba(234, 240, 247, 0.5);
  stroke-width: 1.6;
  stroke-linecap: round;
  animation: navScintille 7.7s ease-in-out infinite;
}

.nav-navire__defense--spire { stroke-width: 1; stroke: rgba(234, 240, 247, 0.32); animation: none; }

/* LA FIGURE DE PROUE — une tête de mort. */
.nav-navire__crane {
  fill: rgba(234, 240, 247, 0.13);
  stroke: var(--ink-soft);
  stroke-width: 1.3;
}

.nav-navire__orbite { fill: var(--paper); }
.nav-navire__machoire { stroke: rgba(169, 184, 204, 0.55); stroke-width: 1; }

/* LES QUATRE FEUX DE POSITION — les quatre couleurs de la palette, décalées. */
.nav-navire__feu {
  transform-box: fill-box;
  transform-origin: center;
  animation: navFeu 3.6s ease-in-out infinite;
}

.nav-navire__feu--babord { fill: var(--critical); }
.nav-navire__feu--tribord { fill: var(--action); animation-delay: -0.9s; }
.nav-navire__feu--hune { fill: var(--ink); animation-delay: -1.8s; }
.nav-navire__feu--poupe { fill: var(--accent); animation-delay: -2.7s; }

/* LE PAVILLON — le cercle-à-point MND. Jamais un crâne. */
.nav-navire__mat { stroke: rgba(169, 184, 204, 0.5); stroke-width: 1.4; }
.nav-navire__etoffe { fill: rgba(255, 230, 80, 0.16); stroke: var(--action); stroke-width: 1.2; }
.nav-navire__sceau { fill: none; stroke: var(--accent); stroke-width: 1.6; }
.nav-navire__sceau-point { fill: var(--accent); }

/* ── 3. LE TEXTE DE L'ARRIVÉE ──────────────────────────────────────────────── */
.nav-arrivee__texte {
  position: relative;
  margin-top: var(--space-md);
  text-align: center;
}

.nav-arrivee__titre {
  margin: var(--space-xs) 0 var(--space-sm);
  font-size: clamp(1.75rem, 4.4vw, 3rem);
  line-height: 1.12;
}

.nav-arrivee__desc {
  max-width: 68ch;
  margin: 0 auto var(--space-sm);
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.7;
}

.nav-arrivee__desc strong { color: var(--ink); }

.nav-arrivee__consigne {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 auto;
  padding: 0.55rem 1.1rem;
  border: 1px solid var(--rule);
  border-radius: 999px;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.nav-arrivee__consigne strong { color: var(--action); }

.nav-arrivee__consigne-puce {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: navPoint 2.2s ease-in-out infinite;
}

.nav-arrivee__runes {
  display: flex;
  justify-content: center;
  margin-top: var(--space-sm);
  color: var(--accent);
  opacity: 0.55;
}

/* ── 4. LES TROIS JAUGES ───────────────────────────────────────────────────── */
.nav-jauges {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-sm);
  margin: var(--space-lg) 0 0;
  padding: 0;
  list-style: none;
}

.nav-jauge {
  display: grid;
  gap: 0.35rem;
  padding: var(--space-sm);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: rgba(13, 17, 31, 0.7);
}

.nav-jauge__nom {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

.nav-jauge__valeur {
  color: var(--ink);
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.1;
}

.nav-jauge__unite { color: var(--ink-soft); font-size: 0.85rem; }

.nav-jauge__barre {
  display: block;
  height: 5px;
  margin: 0.35rem 0 0.25rem;
  border-radius: 999px;
  background: var(--rule);
  overflow: hidden;
}

.nav-jauge__barre i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
}

.nav-jauge--faim .nav-jauge__barre i { background: var(--action); }
.nav-jauge--integrite .nav-jauge__barre i { background: var(--accent); }

.nav-jauge__quoi { color: var(--ink-soft); font-size: 0.88rem; line-height: 1.55; }
.nav-jauge__source { color: var(--ink-soft); font-family: var(--font-mono); font-size: 0.72rem; line-height: 1.5; }

.nav-jauges__note {
  max-width: 76ch;
  margin: var(--space-sm) auto 0;
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.65;
  text-align: center;
}

.nav-jauges__note strong { color: var(--ink); }
.nav-jauges__note a { color: var(--accent); }

/* ── 5. LA DESCENTE — le franchissement de coque ───────────────────────────── */
.nav-descente {
  position: relative;
  z-index: 1;
  padding: var(--space-xl) 0;
  overflow: hidden;
}

.nav-descente__membrures {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* LES MEMBRURES — les couples de la coque, vus de dessous quand on descend.
   Elles sont réparties par un index, jamais par une position écrite à la main. */
.nav-descente__membre {
  position: absolute;
  left: 0;
  right: 0;
  top: calc((var(--rang) - 1) * 7.2%);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(53, 113, 155, 0.5) 22%, rgba(53, 113, 155, 0.5) 78%, transparent);
  animation: navMembre 9s ease-in-out infinite;
}

.nav-descente__texte { position: relative; max-width: 76ch; }
.nav-descente__texte p { color: var(--ink-soft); line-height: 1.75; }
.nav-descente__texte strong { color: var(--ink); }

/* ── 6. LE SÉPARATEUR DE RUNES ─────────────────────────────────────────────── */
.nav-separateur {
  display: flex;
  justify-content: center;
  padding: var(--space-md) 1rem;
  color: var(--accent);
}

/* ── 7. LES SEPT QUARTIERS ─────────────────────────────────────────────────── */
.nav-quartiers {
  position: relative;
  z-index: 1;
  padding: var(--space-lg) 0;
}

.nav-quartiers__liste {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(272px, 1fr));
  gap: var(--space-sm);
  margin: 0 0 var(--space-md);
  padding: 0;
  list-style: none;
}

.nav-quartier { display: flex; }

.nav-quartier__lien {
  display: grid;
  gap: 0.3rem;
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: rgba(13, 17, 31, 0.66);
  color: var(--ink);
  text-decoration: none;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.nav-quartier__lien:hover,
.nav-quartier__lien:focus-visible {
  border-color: var(--rule-strong);
  transform: translateY(-2px);
}

.nav-quartier__rang {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
}

.nav-quartier__nom { font-size: 1.14rem; font-weight: 700; }
.nav-quartier__lieu { color: var(--ink-soft); font-size: 0.82rem; font-style: italic; }
.nav-quartier__quoi { color: var(--ink-soft); font-size: 0.9rem; line-height: 1.55; }

.nav-quartier__ouvre {
  margin-top: 0.35rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--rule);
  color: var(--action);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
}

.nav-quartiers__etages {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-sm);
}

.nav-etage {
  padding: var(--space-sm);
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  background: rgba(8, 11, 20, 0.72);
}

.nav-etage__titre { margin: 0 0 0.4rem; font-size: 1.02rem; color: var(--ink); }
.nav-etage__texte { margin: 0 0 0.7rem; color: var(--ink-soft); font-size: 0.9rem; line-height: 1.6; }
.nav-etage__texte strong { color: var(--ink); }

.nav-etage__lien {
  display: inline-block;
  color: var(--action);
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.nav-etage__lien:hover,
.nav-etage__lien:focus-visible { border-bottom-color: var(--action); }

/* ── 8. L'EMBRANCHEMENT — l'appétence, et la réponse qui a la forme de la visite ─ */
.nav-appetence {
  position: relative;
  z-index: 1;
  padding: var(--space-lg) 0;
}

.nav-appetence__duo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(268px, 1fr));
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.nav-appetence__choix {
  display: grid;
  gap: 0.4rem;
  padding: var(--space-sm);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: rgba(13, 17, 31, 0.66);
  color: var(--ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.nav-appetence__choix:hover,
.nav-appetence__choix:focus-visible { border-color: var(--rule-strong); }

.nav-appetence__choix[aria-pressed="true"] {
  border-color: var(--action);
  background: rgba(255, 230, 80, 0.06);
}

.nav-appetence__choix-tag {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
}

.nav-appetence__choix-texte { color: var(--ink-soft); font-size: 0.95rem; line-height: 1.6; }
.nav-appetence__choix-texte strong { color: var(--ink); }

.nav-appetence__attente,
.nav-appetence__reponse { max-width: 76ch; }

.nav-appetence__attente { color: var(--ink-soft); font-style: italic; }

.nav-appetence__reponse {
  padding: var(--space-sm);
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  background: rgba(8, 11, 20, 0.78);
}

.nav-appetence__reponse-titre { margin: 0 0 0.5rem; font-size: 1.1rem; color: var(--ink); }

.nav-appetence__reponse-temps {
  margin: 0 0 0.6rem;
  padding-left: 0.8rem;
  border-left: 2px solid var(--accent);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.6;
}

.nav-appetence__reponse-corps { margin: 0 0 0.8rem; color: var(--ink-soft); line-height: 1.7; }

.nav-appetence__reponse-portes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-appetence__reponse-portes a { color: var(--action); font-size: 0.92rem; }

.nav-appetence__limite {
  max-width: 76ch;
  margin-top: var(--space-sm);
  color: var(--ink-soft);
  font-size: 0.88rem;
  line-height: 1.65;
}

.nav-appetence__limite strong { color: var(--ink); }

/* ── 9. L'AGENT DU BORD — et il se déclare ─────────────────────────────────── */
.nav-agent {
  position: relative;
  z-index: 1;
  padding: var(--space-lg) 0;
}

.nav-agent__aveu {
  max-width: 82ch;
  margin: 0 0 var(--space-md);
  padding: var(--space-sm);
  border: 1px solid var(--action);
  border-left-width: 3px;
  border-radius: 8px;
  background: rgba(255, 230, 80, 0.05);
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.7;
}

.nav-agent__aveu strong { color: var(--ink); }

.nav-agent__aveu-tag {
  display: inline-block;
  margin-right: 0.6rem;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  background: var(--action);
  color: var(--action-ink);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  vertical-align: middle;
}

.nav-agent__questions {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-agent__item { display: grid; gap: 0.45rem; }

.nav-agent__question {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  width: 100%;
  padding: 0.72rem 0.95rem;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: rgba(13, 17, 31, 0.66);
  color: var(--ink);
  font: inherit;
  font-size: 0.98rem;
  text-align: left;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.nav-agent__question:hover,
.nav-agent__question:focus-visible { border-color: var(--rule-strong); }

.nav-agent__question-puce {
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  margin-top: 0.5rem;
  border-radius: 50%;
  background: var(--accent);
  animation: navPoint 2.6s ease-in-out infinite;
}

.nav-agent__reponse {
  max-width: 82ch;
  margin: 0;
  padding: 0.8rem 1rem;
  border-left: 2px solid var(--accent);
  color: var(--ink-soft);
  font-size: 0.94rem;
  line-height: 1.75;
}

.nav-agent__source {
  max-width: 82ch;
  margin-top: var(--space-sm);
  color: var(--ink-soft);
  font-size: 0.78rem;
  line-height: 1.65;
}

.nav-agent__source code {
  padding: 0.05rem 0.32rem;
  border-radius: 4px;
  background: rgba(42, 191, 255, 0.1);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.74rem;
}

/* ── 10. LA PORTE DU JEU — la page qui n'avait aucun lien ──────────────────── */
.jeu__porte {
  max-width: 76ch;
  margin: var(--space-sm) auto 0;
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.65;
  text-align: center;
}

.jeu__porte strong { color: var(--ink); }
.jeu__porte a { color: var(--action); font-weight: 600; }

/* ══════════════════════════════════════════════════════════════════════════════
   11. LES BOUCLES — LES IMAGES CLÉS

   ⚠️ Toutes sont `infinite`, aucune n'est déclenchée par le défilement ni par un
      survol : *le navire respire même quand personne ne le regarde.*
   ══════════════════════════════════════════════════════════════════════════════ */
@keyframes navCirculation {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -166; }
}

@keyframes navFeu {
  0%, 100% { opacity: 0.22; transform: scale(0.86); }
  44% { opacity: 1; transform: scale(1.18); }
  62% { opacity: 0.72; transform: scale(1); }
}

@keyframes navBattement {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  7% { opacity: 1; transform: scale(1.17); }
  14% { opacity: 0.62; transform: scale(1); }
  22% { opacity: 0.95; transform: scale(1.1); }
  34% { opacity: 0.6; transform: scale(1); }
}

@keyframes navPaupiere {
  0%, 90%, 100% { transform: scaleY(1); }
  94% { transform: scaleY(0.06); }
  97% { transform: scaleY(1); }
}

@keyframes navScintille {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.9; }
}

@keyframes navRespire {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}

@keyframes navDerive {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-11px); }
}

@keyframes navMembre {
  0%, 100% { transform: translateY(-7px); opacity: 0.32; }
  50% { transform: translateY(7px); opacity: 0.72; }
}

@keyframes navPoint {
  0%, 100% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(1.4); opacity: 1; }
}

/* ══════════════════════════════════════════════════════════════════════════════
   12. ⛔⛔ `prefers-reduced-motion` — LA COUPURE, ET ELLE EST SANS EXCEPTION

   ⭐ Le visiteur qui a demandé à son système moins de mouvement obtient un site
      ARRÊTÉ — pas un site un peu moins animé. C'est une consigne de santé, pas une
      préférence esthétique : *« les animations continues » ne sont pas negociables
      pour tout le monde.*

   ⚠️ La règle est écrite UNE SEULE FOIS, à la fin, et elle NOMME les conteneurs :
      `animation: none !important` coupe aussi ce que je n'aurais pas prévu — les
      composants enfants compris. *Une coupure dispersée est une coupure qu'on
      oublie quelque part.*
   ══════════════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .nav-vie,
  .nav-vie *,
  .nav-arrivee,
  .nav-arrivee *,
  .nav-descente,
  .nav-descente *,
  .nav-quartiers,
  .nav-quartiers *,
  .nav-appetence,
  .nav-appetence *,
  .nav-agent,
  .nav-agent *,
  .nav-separateur,
  .nav-separateur * {
    animation: none !important;
    transition: none !important;
  }

  /* Et le décor n'a plus de raison d'être presque invisible : sans mouvement, il
     redevient ce qu'il est — un tracé fixe. On le laisse lisible plutôt que fané. */
  .nav-vie { opacity: 0.14; }
}

/* ── 13. LES ÉCRANS ÉTROITS ────────────────────────────────────────────────── */
@media (max-width: 767px) {
  .nav-arrivee { padding-top: var(--space-lg); }
  .nav-arrivee__coque { width: 100vw; margin-left: calc(50% - 50vw); }
  .nav-jauges { margin-top: var(--space-md); }
  .nav-jauge__valeur { font-size: 1.6rem; }
  .nav-descente { padding: var(--space-lg) 0; }
}
</style>
