# La contrainte engendre la forme

*Une machine limitée ne produit pas seulement des compromis : elle produit une échelle, un style et parfois un genre.*

## L'idée

La contrainte n'est pas l'ennemie de la forme, elle en est la cause. Trois cas, mesurés ou documentés.

**La mémoire de la machine.** Mesure du studio : avec `qwen3.5:9b` chargé il reste 1 668 Mo de VRAM libres ;
`qwen3-coder-16k` plus ComfyUI tombent à 437 Mo. Un modèle de travail et une génération 3D ne cohabitent pas.
La réponse choisie n'est pas « faire moins bien » : on **sérialise** les travaux, et le **low-poly devient un
choix de production** — 2 500 faces soigneusement décimées battent 115 866 faces illisibles sur le web.

**Le point de vue.** Le Speed Booster, envisagé pour *Metroid Prime*, a été écarté : inadapté à la vue
subjective et à l'échelle des environnements. Et aucun *Metroid* n'est sorti sur Nintendo 64, faute d'idées
arrêtées sur la manette.

**Le support.** Trois parties sur disquette Famicom au Japon ; un mot de passe de 24 lettres sur la NES.

## Ce qui est établi

- Mesure de VRAM : `qwen3.5:9b` chargé, **1 668 Mo** libres ; `qwen3-coder-16k` + ComfyUI, **437 Mo** (plancher) (`modeles/methode-creation-jeu-video.md` § 5).
- « Le low-poly est un choix de production, pas un pis-aller » : 2 500 faces décimées contre 115 866 (même document, § 4).
- Le **Speed Booster** a été écarté de *Metroid Prime*, jugé inadapté à la vue subjective et à l'échelle des environnements (`06-les-mecaniques-et-le-genre` § 7).
- Pas de *Metroid* sur Nintendo 64 : Sakamoto ne voyait pas comment utiliser la manette, et une autre société a refusé le projet (même note).
- *Metroid* (1986) : trois parties sur disquette Famicom au Japon ; mot de passe de 24 lettres sur NES (même note, § 4).
- Les mesures de VRAM sont **rattachées à une machine** : EVA-01, 10 Go (`AGENTS.md`, interdit n° 2).

## Ce qui n'est pas établi

- Le lien de **cause** entre le support et le mot de passe n'est écrit par aucune source lue : la note `06` constate deux systèmes de sauvegarde, elle n'explique pas le passage de l'un à l'autre.
- Le mot « genre » n'est pas un terme des sources : il vient du cadrage de ce dossier.
- Aucune source lue ne mesure l'effet esthétique de la contrainte de VRAM sur les rendus obtenus.

## Sources

- `modeles/methode-creation-jeu-video.md` § 4 et § 5 — GL Digital Lab, 10/09/2026.
- `06-les-mecaniques-et-le-genre.md` § 4 et § 7 — vault Metroid, 14/09/2026.
- `AGENTS.md` — GL Digital Lab, interdit n° 2.

## Renvois

- [[la-tranche-verticale-avant-la-promesse]]
- [[06-les-mecaniques-et-le-genre]]
