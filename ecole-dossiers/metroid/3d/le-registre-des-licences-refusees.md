# Le registre des licences refusées

*La licence qui compte est celle des poids, pas celle affichée par le dépôt qui les héberge — et le registre du studio se lit avant d'utiliser un modèle 3D, pas après.*

Le studio tient un registre de décision, pas une fiche de veille. Sa règle centrale vient d'un cas mesuré : **le dépôt HuggingFace de Pixal3D affiche « License: mit »**, alors que la licence qui régit les poids est celle de Tencent — « Academic / non-commercial use only » et « Pixal3D IS NOT INTENDED FOR USE WITHIN THE EUROPEAN UNION ». Un outil qui marche mal coûte du temps ; un outil mal licencié coûte un client.

| Élément | Verdict | Clause qui bloque |
|---|---|---|
| Pixal3D (image → 3D) | ⛔ refusé | licence Tencent : non commercial et exclusion de l'Union européenne ; le poids est livré dans le gabarit natif « Trellis.2 + Pixal3D » |
| Meshy, Tripo (services en ligne) | ⛔ refusés | services en ligne ; ce sont les **seuls** nœuds de rig installés |
| Hy3D 3.1, Hunyuan 3D Studio, Rodin WorldGen | ⛔ refusés | pas de poids ouverts, API ou service cloud, images hors machine |
| Modddif (texturage 3D, freemium) | ⛔ refusé | palier gratuit : créations publiées en Creative Commons et utilisées pour l'entraînement ; 30 $/mois sinon — remplacé par le texturage PBR natif de TRELLIS.2 |
| TRELLIS.2 (Microsoft) | ✅ autorisé | MIT, usage commercial explicitement autorisé après retrait des dépendances NVIDIA non commerciales |
| ComfyUI-SplatKit, Modly | ✅ autorisés | MIT |
| AnimoFlow | ⚠️ obligations | AGPL-3.0 : copyleft fort si un service dérivé est distribué |
| ARDY (NVIDIA) | ⚠️ obligations | code Apache-2.0, poids sous NVIDIA Open Model Agreement ; encodeur d'environ 14 Go de VRAM, hors budget |

Une interdiction écrite n'interdit rien, donc le studio l'instrumente : un script (`forge-ia/verifier-licences-workflows.py`) balaie les graphes et sort en code 1 s'il trouve un outil interdit. État relevé : **87 workflows examinés, 1 contaminé** (un nœud Pixal3D laissé en mode 4, donc contourné mais réactivable d'un clic). Les gabarits natifs de ComfyUI qui mettent la chaîne en scène — deux fichiers `.json` et leurs aperçus `.webp` — ont été neutralisés par un suffixe `.interdit` — neutralisation juridique, réversible, et à revérifier après chaque mise à jour de ComfyUI.

## Ce qui est établi

- La règle « on lit la licence du poids, pas celle du dépôt » et le cas Pixal3D (registre des licences, 10/09/2026).
- Toutes les lignes du tableau (registre, 10, 11 et 14/09/2026 ; plan de travail pour Meshy et Tripo).
- Le garde-fou, ses 87 workflows examinés et son unique contamination (registre, 10/09/2026).
- La neutralisation par `.interdit` des quatre gabarits, et le risque de retour à une mise à jour (même source).

## Ce qui n'est pas établi

- La liste des quatre gabarits neutralisés : le registre en nomme deux (`3d_pixal3d_multi_views.json`, `3d_pixal3d_trellis2_image_to_model.json`) et parle de quatre fichiers avec leurs aperçus.
- La question ouverte sur les dépendances NVIDIA de TRELLIS.2 : une issue publique existe sur le dépôt, son contenu n'a **pas pu être lu**. À instruire avant toute livraison client.
- Le sort du workflow contaminé : le nettoyer ou l'assumer est une décision de Gaëtan, non tranchée.

## Sources

- `vault-agence/licences-refusees.md` — le registre complet et ses règles.
- `modeles/plan-de-travail-2026-09-10.md` — Meshy et Tripo, seuls nœuds de rig installés et interdits.
- `modeles/pipeline-3d-trellis2-2026-09-11.md` — rappel de l'interdiction Pixal3D dans la chaîne.

## Renvois

- [[un-modele-3d-n-est-pas-une-ressource-libre]] — le même registre appliqué aux œuvres protégées.
- [[le-squelette-et-l-animation]] — pourquoi les seuls nœuds de rig installés ne peuvent pas servir.
- [[01-la-licence]] — la licence comme objet juridique, côté vault.
