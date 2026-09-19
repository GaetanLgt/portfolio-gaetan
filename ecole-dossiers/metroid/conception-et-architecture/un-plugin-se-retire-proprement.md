# Un plugin se retire proprement

*L'enregistrement d'un plugin est un effet qui se dénoue : ce qu'il ajoute doit disparaître avec lui.*

## L'idée

Le harnais du studio repose sur une règle simple et sévère : il n'y a **pas de cœur privilégié à corriger**. Toute
capacité est un plugin monté à côté des autres, et *les enregistrements sont des effets qui se dénouent quand leur
plugin se décharge.* Le registre d'outils, la boucle d'agent, le journal de session : tout est plugin, donc tout
est remplaçable par configuration.

Cette règle n'est pas une élégance d'architecture, c'est ce qui rend la composition possible. Une ligne qui laisse
derrière elle un minuteur, un écouteur ou un style ne peut plus être retirée sans redémarrer le processus — et un
système qu'on ne peut pas démonter sans l'arrêter n'est pas composable, il est soudé.

Il en découle deux disciplines : **chaque effet appartient à sa fibre** — services, écouteurs, minuteurs, outils,
interfaces se rangent sous celui qui les a posés — et **une capacité va dans un fichier de composition**, jamais
dans une sonde temporaire. Limite à connaître plutôt qu'à subir : un profil à usage unique applique ses couches
une seule fois au démarrage, car remplacer ses dépendances après qu'il a pris son travail invaliderait son cycle
de vie.

## Ce qui est établi

- « Plugins contribute services, typed events, and reversible effects to a shared context » et « registrations are effects that unwind when their plugin unloads » (`docs/architecture.md`, DeepSeek Harness, lu le 14/09/2026).
- « There is no privileged core to patch: you extend dsh by mounting a plugin beside the others » (même document).
- Une capacité appartient à un fichier de composition, pas à une sonde : « it is for probing, not for shipping a capability » (skill `editing-cordis-compositions`).
- Le profil `web` est rechargé à chaud ; les profils à usage unique appliquent leurs couches une seule fois, « replacing a one-shot application's dependencies after it owns work would invalidate that lifecycle » (`docs/architecture.md`).
- Règle de prudence avant toute modification de composition : sauvegarder, valider, documenter le retour arrière (`AGENTS.md`, « Auto-référentialité »).

## Ce qui n'est pas établi

- Aucune épreuve du studio ne vérifie qu'un plugin **se retire** proprement : la règle est celle du harnais, pas un résultat mesuré ici.
- Aucun décompte des effets non dénoués n'existe : on ne sait pas s'il en reste (non vérifié).
- Le coût réel d'un redémarrage de harnais n'est pas mesuré, seulement décrit comme coupant les sessions et les plugins dynamiques (`AGENTS.md`).

## Sources

- `docs/architecture.md` — checkout `C:\Users\neosp\Desktop\deepseek-harness\`, lu le 14/09/2026.
- Skill `editing-cordis-compositions` — preset `cordis` du harnais.
- `AGENTS.md` § « Auto-référentialité » — GL Digital Lab.

## Renvois

- [[un-service-qui-publie-appartient-a-l-hote]]
- [[11-sources-et-verification]]
