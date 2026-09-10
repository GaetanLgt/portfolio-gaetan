# À FAIRE PAR GAËTAN — passation du 10/09/2026

> Court exprès. Trois actions de cinq minutes, puis cinq décisions. Tout le
> reste est fait et commité.

---

## Les trois choses que je ne peux pas faire à ta place

### 1. Le vrai chiffre de performance (30 secondes)

J'ai mesuré Lighthouse six fois : **le navigateur sans interface de cette
machine n'utilise pas la carte graphique**, et les scores oscillent de 45 à 61
sur un code identique. Je ne peux donc pas te dire si le site tient ta cible
« Lighthouse ≥ 95 ».

Dans **ton Chrome**, avec ta 3080 : `F12` → onglet **Lighthouse** → Analyser.
Regarde surtout **« Other »** dans le détail du fil principal : s'il dépasse
quelques centaines de millisecondes, le tir est à jeter et il faut recommencer.

- Si c'est bon → on peut assumer la scène 3D.
- Si c'est mauvais → je dégrade au premier chargement (pas de post-traitement ni
  de modèles tant que le visiteur n'a pas interagi).

### 2. Regarde le site (2 minutes)

**Je n'ai jamais vu ce site.** Le modèle que j'exécute ne lit pas les images.
J'ai mesuré des pixels, des contrastes, des poids — je n'ai pas d'yeux.

| Page | Adresse |
|---|---|
| Accueil (le concept) | http://localhost:4173/ |
| Dossier professionnel | http://localhost:4173/dossier |
| Offre | http://localhost:4173/services |
| Contact | http://localhost:4173/contact |

Si le serveur d'aperçu s'est arrêté : `cd C:\Users\neosp\code\portfolio-gaetan`
puis `npx vite preview --port 4173`.

Ce que je te propose de regarder en priorité : **le hero** (les six unités
générées), **le fond d'écran** (déjà appliqué), et **la section du vaisseau**.

### 3. Le feu vert de déploiement

**Le site n'est pas déployé.** Il tourne en local. Je ne touche pas à o2switch
sans ton accord, parce que remplacer ta vitrine en ligne par une refonte non
validée n'est pas une décision d'agent.

---

## Cinq décisions qui t'appartiennent

| # | Décision | Contexte |
|---|---|---|
| 1 | **Le nom « SEUIL »** | Proposé par le directeur artistique. **Non appliqué** — il faut une recherche INPI (classes 9, 35, 42), les domaines `.fr`/`.com`, et un dépôt via un conseil en propriété industrielle. |
| 2 | **ARKADIA pour le réseau social ET le vaisseau** | L'audit externe recommande de réserver ARKADIA au produit et de donner au poste un identifiant technique. Le goal actuel en fait le nom du vaisseau. Risque de confusion de marque. |
| 3 | **Citer les œuvres** (Matrix, TRON, Evangelion, Cyberpunk, Albator) | L'audit recommande de ne jamais les nommer dans un support commercial. Aujourd'hui ils vivent dans nos documents **internes** — c'est défendable — et le site n'en nomme aucun. À faire valider par un juriste PI. |
| 4 | **Le budget de 100 000 €** | Ne doit jamais apparaître sur le site (recommandation du directeur artistique). C'est le cas aujourd'hui. |
| 5 | **Le mode sobre et le dossier** | Livrés. Dis-moi s'ils te convainquent ou s'il faut les retoucher. |

---

## Ce qui est livré

- **Le concept** : MND × Matrix × TRON × Evangelion × Cyberpunk × ALBATOR, récit
  « l'IA fait irruption dans notre monde », vocabulaire de bord, chantier naval.
- **Les six unités 3D sont réellement générées** : image SDXL → TRELLIS.2 →
  allègement. **408 Ko pour les six**, contre 938 Ko pour les anciennes
  fabrications maison.
- **Cinq expériences signature** : démarrage mesuré, poste (Grille TRON, console,
  post-traitement), balayage de transition, terminal déterministe, dossier sobre.
- **Le pavillon** hissé aux seuls moments de décision.
- **Le mode sobre** : un interrupteur coupe tous les effets. C'est un argument de
  vente pour les collectivités.
- **Le formulaire de contact est auto-hébergé** : Formspree a été retiré, plus
  aucun transfert de données hors UE.
- **Poids : 878 Ko** mesurés (verrou du mégaoctet tenu). Contrastes : 31 paires
  mesurées, toutes conformes. Accessibilité structurelle : 0 échec sur 4 pages.

## Ce qui n'est PAS fait ou pas prouvé

- **Lighthouse ≥ 95** : non démontrable ici (voir point 1).
- **Opquast ≥ 90 %** : jamais passé règle par règle.
- **Awwwards** : jamais soumis.
- **Contenu sans JavaScript** : seulement partiel — un bloc `noscript` donne les
  prix et le contact, mais le site reste une application montée côté client.
  Le vrai correctif serait du rendu côté serveur.
- **Audio diégétique** : non fait, seule expérience signature manquante.
- **Plan de continuité, sauvegardes, réversibilité contractuelle** : rien de
  formalisé. C'est le point le plus lourd de l'audit externe.
- **Références clients nominatives** : aucune. C'est écrit noir sur blanc sur
  `/dossier`.

---

## Les documents à lire si tu veux aller au fond

| Document | Ce qu'il contient |
|---|---|
| `modeles/decisions-concept-flagship-d5.md` | la doctrine du chantier, **avec la section « ce qui n'est PAS démontré »** |
| `modeles/d5-direction-artistique-claude.md` | la direction artistique complète (17 sections) |
| `forge-ia/notebooklm-arkadia/` | le package d'analyse critique (8 documents, dont l'audit externe) |
| `docs/mesurer-la-performance.md` | pourquoi les scores Lighthouse varient, et comment mesurer correctement |
| `docs/faux-positif-lighthouse-contraste.md` | un faux positif prouvé par les pixels, avec la liste de ce qui a été tenté |
