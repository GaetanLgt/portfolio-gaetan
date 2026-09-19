# Séparer l'orchestration de l'exécution

*Celui qui décide qui fait quoi n'a pas besoin d'être celui qui fait le mieux : router et exécuter sont deux savoirs.*

## L'idée

Un système qui confie tout à un seul exécutant mélange deux métiers : décider *qui* fait quoi, et *faire*. Le
studio les sépare, et il a les deux moitiés écrites.

La moitié théorique vient de l'architecture d'agents : « séparer le savoir d'orchestration du savoir
d'exécution — le coordinateur n'a pas besoin d'être le modèle le plus fort ; il doit bien router. » La moitié
pratique est une règle de la maison : si une tâche correspond à un agent du registre, elle passe par son outil
dédié — *ne pas réinventer ce qui existe déjà.*

Cette règle n'est pas née d'un principe, mais d'un échec mesuré : un agent a reconstruit par essais-erreurs un
pipeline **déjà documenté**, a fait tomber ComfyUI quatre fois, et a failli réactiver un modèle neutralisé pour
raison juridique. Rien de tout cela n'était un problème de compétence : c'était un problème de routage.

Deux garde-fous l'accompagnent : un plafond de tours par mission, et une détection de non-convergence. Et une
limite de bon sens — l'orchestration coûte cher, elle se réserve aux missions à forte valeur ; une demande
simple part vers une seule Loi.

## Ce qui est établi

- « Séparer le savoir d'orchestration du savoir d'exécution : le coordinateur n'a pas besoin d'être le modèle le plus fort ; il doit bien router » (`ARCHITECTURE-FUGU-GL.md` § 1).
- « Si une tâche correspond à un agent du registre → l'exécuter via l'outil dédié. Ne pas réinventer ce qui existe déjà » (`AGENTS.md`, règle d'or).
- L'échec qui a produit la règle : pipeline déjà écrit reconstruit par essais-erreurs, ComfyUI tombé quatre fois, template à neutralisation juridique presque réactivé (même fichier, § « LIRE, pas deviner »).
- Anti-boucles : plafond de tours par mission, superviseur de non-convergence, et « ne pas fuguiser à l'excès » sur les demandes simples (`ARCHITECTURE-FUGU-GL.md` § 3).
- L'orchestrateur-worker coûte ×4 à ×15 en tokens : à réserver aux missions à forte valeur (même note, § 1, citant Anthropic).

## Ce qui n'est pas établi

- Le rapport ×4 à ×15 vient d'une source externe (Anthropic) : il n'a pas été mesuré sur cette machine.
- Le studio ne mesure pas encore le coût par mission, ni la part des demandes routées vers une seule Loi (`ARCHITECTURE-FUGU-GL.md` § 5).
- « Agent compétent » n'a pas de critère écrit : la table de routage est le seul arbitre, et elle a déjà été prise en défaut une fois (« relis ce document » part sur Réalisation).

## Sources

- `ARCHITECTURE-FUGU-GL.md` § 1, 3 et 5 — GL Digital Lab, 09-10/2026.
- `AGENTS.md` — règle d'or, § « LIRE, pas deviner », table de routage et routage mesuré du 10/09/2026.

## Renvois

- [[un-worker-ne-voit-que-son-perimetre]]
- [[11-sources-et-verification]]
