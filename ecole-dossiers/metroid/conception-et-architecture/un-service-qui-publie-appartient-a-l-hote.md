# Un service qui publie appartient à l'hôte

*Une ligne qui publie un service ne peut pas rester dans un preset : la deuxième session entrerait en collision avec la première.*

## L'idée

Un harnais à plugins a deux plans, et le choix ne se fait pas au feeling : il se fait sur la question « est-ce
que cette chose doit être **partagée** ? » Le **plan hôte** porte les registres, tout ce qui traverse les sessions
(persistance, réglages, identifiants, télémétrie), la pile de bac à sable et d'approbation, la route des modèles
et le registre des sous-agents — une seule instance pour le processus.

Le **plan preset** porte ce qu'*une* session apporte à ces registres : ses outils, sa persona, sa politique de
compaction — une instance par session, démontée avec elle. D'où la règle la plus contre-intuitive du lot : **une
ligne qui publie un service ne peut pas rester dans un preset.** Sans realm d'isolement, le service atterrit dans
le realm global du processus : la deuxième session entre en collision avec la première, et le montage le refuse.

L'exemple travaillé est celui des sous-agents : le registre répond à des requêtes inter-sessions pour l'hôte, donc
une copie par session affamerait cette ligne *et* entrerait en collision. Le preset apporte les **outils** de
délégation ; le registre reste côté hôte. Quand un preset possède réellement un service, il enferme le fournisseur
**et tous ses consommateurs** dans un même groupe portant un realm d'isolement.

## Ce qui est établi

- Les deux plans et leur critère : « the choice is not about how agent-related something feels — it is about whether the thing must be shared » (skill `editing-cordis-compositions`, « Decide the plane first »).
- « A row that publishes a service may not sit loose in a preset » : sans realm `isolate`, le second montage entre en collision et le montage le refuse (même source, « The rule that catches people »).
- Un service dont un consommateur vit hors du plan agent ne peut pas descendre dans un preset (même source).
- Message d'audit du montage : « a preset service must sit behind an isolate realm or move to the host composition » (même source, « Verifying a change »).
- Le harnais n'a « pas de cœur privilégié à corriger » : tout est plugin, y compris le registre d'outils et la boucle d'agent (`docs/architecture.md`).

## Ce qui n'est pas établi

- La collision n'a **pas** été reproduite ici sur une deuxième session réelle : elle est décrite par la documentation et par l'audit de montage.
- Le nombre de services réellement publiés par les presets du studio n'est pas compté (non vérifié).
- Le comportement d'un realm à libellé partagé n'est rapporté que tel que la source l'énonce : un libellé ne mutualise pas les instances, et `provide()` lève sur la seconde inscription.

## Sources

- Skill `editing-cordis-compositions` — preset `cordis` du harnais, lu le 14/09/2026.
- `docs/architecture.md` — DeepSeek Harness, checkout local, lu le 14/09/2026.
- `AGENTS.md` § « Auto-référentialité » — GL Digital Lab.

## Renvois

- [[un-plugin-se-retire-proprement]]
- [[11-sources-et-verification]]
