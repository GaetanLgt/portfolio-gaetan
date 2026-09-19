# Un worker ne voit que son périmètre

*Un exécutant à qui l'on donne tout le contexte reçoit surtout du bruit : instruction ciblée, visibilité limitée.*

## L'idée

Donner à un exécutant l'accès à tout n'est pas une générosité, c'est une faute de conception. Le
principe retenu est double : **une instruction ciblée** et **une visibilité limitée** — pas de
contexte global partagé. Le coordinateur sait tout ; le worker sait ce qu'il doit faire.

Le studio applique la même idée hors du logiciel : les artefacts s'écrivent sur disque et seules des
références légères remontent. Un worker ne « raconte » pas son travail dans un message qu'un autre
résumera — il le dépose. La mémoire est un fichier, pas une conversation.

La contrepartie doit être dite, parce qu'elle se paie : un exécutant qui ne voit pas la conversation
ne peut pas lever une ambiguïté. Son instruction doit donc être **autonome** — complète, datée, avec
son périmètre et son critère d'acceptation. Un périmètre borné n'est tenable que si la consigne est
entière.

La même frontière vaut pour les outils : une sonde posée sur un système vivant se retire quand on a
fini. Elle sert à regarder, pas à rester.

## Ce qui est établi

- « Donner à chaque worker une instruction ciblée + une visibilité limitée : pas de contexte global partagé (leçon Conductor `access_list`) » (`ARCHITECTURE-FUGU-GL.md` § 1).
- Les workers écrivent leurs artefacts **sur disque** et ne renvoient que des références légères (même note, § 3).
- Une sonde de montage se démonte quand on a fini : « it is a probe, not a capability to leave behind » (skill `editing-cordis-compositions`, preset `cordis` du harnais).
- Une sonde évalue du code contre le runtime vivant et disparaît au redémarrage : « for probing, not for shipping a capability » (même source).

## Ce qui n'est pas établi

- Aucune mesure du studio ne compare un worker à contexte large et un worker à périmètre borné : la leçon vient de la littérature (Conductor, Fugu) et n'a pas été reproduite ici.
- L'`access_list` n'est pas implémentée dans le harnais : le studio lit le principe, il ne l'exécute pas — c'est une cible déclarée.
- Rien ne dit quelle **taille** de périmètre est la bonne : le principe est qualitatif.

## Sources

- `ARCHITECTURE-FUGU-GL.md` § 1 et § 3 — GL Digital Lab, 09-10/2026.
- Skill `editing-cordis-compositions` — preset `cordis` du harnais, lu le 14/09/2026.

## Renvois

- [[separer-orchestration-et-execution]]
- [[11-sources-et-verification]]
