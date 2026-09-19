<?php
/**
 * L'état du studio — volet VIVANT : quels moteurs d'IA sont passés nous lire.
 *
 * POURQUOI CE SCRIPT EXISTE
 *   La page /etat-du-studio montre deux choses, et il ne faut pas les confondre :
 *     · le RELEVÉ DU BUILD, figé par `scripts/generer-etat.mjs` au moment du build ;
 *     · le RELEVÉ VIVANT, c'est-à-dire ce fichier.
 *
 *   Le second répond à une question qu'aucun compteur JavaScript ne peut voir :
 *   un robot d'IA ne rend pas la page, ne télécharge pas le script d'analyse et
 *   n'exécute rien. **Il restera à zéro pour toujours, quoi qu'on mesure côté
 *   navigateur.** La seule source qui le voit passer est le JOURNAL D'ACCÈS du
 *   serveur : chaque visite y laisse une ligne, robot compris.
 *
 * ⛔ CE QUE CE SCRIPT NE RENDRA JAMAIS — ET CE N'EST PAS NÉGOCIABLE
 *   Le journal d'accès est un fichier nominatif : il contient des ADRESSES IP de
 *   visiteurs, les CHEMINS de page demandés et les User-Agents bruts. Ce script
 *   en lit tout, et n'en rend RIEN :
 *     · jamais d'adresse IP, ni en clair, ni hachée, ni tronquée ;
 *     · jamais de chemin de page, ni le nombre de pages distinctes par moteur ;
 *     · jamais de User-Agent brut — même pas la chaîne inconnue qui n'a pas été
 *       reconnue, alors que l'outil en ligne de commande, lui, l'affiche : ici, la
 *       sortie est PUBLIQUE ;
 *     · jamais de code HTTP, ni d'horodatage par moteur.
 *   Sortie : des COMPTEURS AGRÉGÉS, et rien d'autre. La forme est volontairement
 *   pauvre — `{"moteur": "…", "passages": n}` — parce qu'un compteur agrégé ne
 *   permet pas de remonter à une personne, alors qu'un tableau de chemins, si.
 *
 * ⚠️ LA LISTE DES MOTEURS EST PORTÉE, PAS INVENTÉE
 *   Les dix-huit motifs sont ceux de `outils-pilotage/compter-moteurs-ia.mjs`
 *   (GL Digital Lab, 19/09/2026), recopiés ici à l'identique. Ce fichier-là est
 *   l'original ; si un moteur s'ajoute là-bas, il s'ajoute ici le jour même, sinon
 *   les deux relevés divergeront sans le dire.
 *
 * ⚠️ LE SEUIL DE RECONNAISSANCE EST DÉCLARATIF
 *   On identifie un moteur par son User-Agent, et **un robot peut mentir sur son
 *   nom**. Ce relevé compte des passages, il ne prouve pas une identité — et il ne
 *   dit rien des CITATIONS : un moteur qui passe n'est pas un moteur qui cite.
 *
 * AUCUN PARAMÈTRE D'ENTRÉE. La méthode est refusée si ce n'est pas GET, la chaîne
 * de requête est ignorée, et rien de ce que le client envoie n'entre dans le calcul.
 *
 * RÉPONSE MISE EN CACHE — 15 minutes, en fichier temporaire.
 *   Le journal d'accès se compte en dizaines de mégaoctets. Le relire à chaque
 *   appel d'une page publique serait une faute : sur un hébergement mutualisé,
 *   c'est le meilleur moyen de se faire limiter, et c'est du calcul offert à qui
 *   veut nous faire dépenser. La lecture du journal est donc bornée en lignes, et
 *   le résultat est resservi pendant un quart d'heure.
 *
 * EN CAS D'ÉCHEC — journal absent, illisible, ou aucun moteur reconnu
 *   Erreur propre en JSON, code HTTP 503, et `"releve": "indisponible"`.
 *   ⚠️ DISTINCTION IMPORTANTE, et c'est celle qui a dicté cette forme :
 *   « je n'ai pas pu lire » n'est PAS « il n'y a personne ». Le second cas (journal
 *   lu, zéro moteur reconnu) est un RÉSULTAT et rend 200 avec une liste vide.
 *   La page, elle, dit « relevé indisponible » dans le premier cas et affiche ses
 *   compteurs du build dans le second — jamais des zéros à la place d'une panne.
 *
 * VARIABLES D'ENVIRONNEMENT — réservées à l'exploitation, jamais à un visiteur
 *   GLDL_JOURNAL_ACCES : chemin du journal à lire. Sert aux essais, et à l'exploitation
 *                        le jour où l'hébergeur déplace le fichier. Ce n'est PAS un
 *                        paramètre de requête, et le chemin n'est jamais rendu.
 *   GLDL_ETAT_CACHE     : chemin du fichier de cache temporaire.
 *   GLDL_ETAT_FORCER    : « 1 » pour ignorer le cache (mesure à la demande).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
// Pas de `Access-Control-Allow-Origin` : ce relevé n'a aucune raison d'être lu
// depuis un autre site. L'absence d'en-tête vaut refus pour un navigateur.
header('Cache-Control: public, max-age=300');

// ── Réglages ────────────────────────────────────────────────────────────────
const CACHE_SECONDES = 900;        // 15 minutes
const MAX_LIGNES     = 400000;     // borne de lecture : au-delà, on le DIT

/**
 * Les moteurs d'IA, et à quoi on les reconnaît.
 * Recopiés de `outils-pilotage/compter-moteurs-ia.mjs` — voir l'en-tête.
 * `cle` est un identifiant stable, sans accent ni espace : il ne sert qu'au tri.
 */
const MOTEURS = [
    ['gptbot',          'OpenAI — GPTBot',          '/GPTBot/i'],
    ['chatgpt-user',    'OpenAI — ChatGPT-User',    '/ChatGPT-User/i'],
    ['oai-searchbot',   'OpenAI — OAI-SearchBot',   '/OAI-SearchBot/i'],
    ['claudebot',       'Anthropic — ClaudeBot',    '/ClaudeBot|anthropic-ai/i'],
    ['claude-user',     'Anthropic — Claude-User',  '/Claude-User/i'],
    ['perplexity',      'Perplexity',               '/PerplexityBot/i'],
    ['google-extended', 'Google — Gemini/Extended', '/Google-Extended/i'],
    ['googlebot',       'Google — classique',       '/Googlebot/i'],
    ['apple',           'Apple',                    '/Applebot/i'],
    ['common-crawl',    'Common Crawl',             '/CCBot/i'],
    ['bytespider',      'Bytespider (ByteDance)',   '/Bytespider/i'],
    ['amazon',          'Amazon',                   '/Amazonbot/i'],
    ['meta',            'Meta — ExternalAgent',     '/meta-externalagent|FacebookBot/i'],
    ['cohere',          'Cohere',                   '/cohere-ai|cohere-training/i'],
    ['you',             'You.com',                  '/YouBot/i'],
    ['duckduckgo',      'DuckDuckGo',               '/DuckAssistBot|DuckDuckBot/i'],
    ['mistral',         'Mistral',                  '/MistralAI-User/i'],
    ['bing',            'Bing',                     '/bingbot/i'],
];

/**
 * La ligne « combined » d'Apache, telle que l'outil en ligne de commande la lit.
 * 1.2.3.4 - - [19/Sep/2026:08:12:33 +0200] "GET /dossier HTTP/1.1" 200 12345 "-" "Agent/1.0"
 * ⚠️ Les groupes capturés ne sont utilisés QUE pour l'agent (le 6e). Les autres
 *    (IP, horodatage, requête, code, taille) sont capturés pour que la ligne soit
 *    reconnue, et ne sortent jamais de cette fonction.
 */
const LIGNE_COMBINED = '/^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]*)"\s+(\d{3})\s+(\S+)\s+"[^"]*"\s+"([^"]*)"/';
const AGENT = 6;
const REQUETE = 3;
const QUAND = 2;

/**
 * Répond et termine.
 *
 * ⚠️ LE CODE DE SORTIE DU PROCESSUS SUIT LE CODE HTTP, ET C'EST UNE CORRECTION
 * MESURÉE DU 19/09/2026 — pas une coquetterie.
 *
 * Défaut constaté en éprouvant ce fichier depuis la ligne de commande : un endpoint
 * qui répond 503 se terminait avec le **code de sortie 0**. En HTTP, rien ne casse —
 * le client lit le statut. Mais un relevé de supervision, un `curl --fail`, ou toute
 * vérification qui regarde le code de sortie du processus voyait un **succès** sur une
 * panne déclarée. C'est le motif exact que ce studio traque : *un contrôle qui ne peut
 * pas échouer n'est pas un contrôle* — et un processus qui sort toujours en 0 ne peut
 * pas échouer.
 *
 * `exit(1)` après un code HTTP >= 400 ne change rien pour le navigateur (la réponse est
 * déjà écrite, les en-têtes déjà envoyés) et rend la panne visible à ce qui l'observe.
 */
function repondre(int $code, array $charge): void
{
    http_response_code($code);
    echo json_encode($charge, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    // `exit(1)` n'est atteint qu'en erreur : une réponse 200 termine normalement.
    exit($code >= 400 ? 1 : 0);
}

/** Erreur propre : jamais de détail technique, jamais de chemin de fichier rendu. */
function indisponible(string $quoi): void
{
    repondre(503, [
        'releve'   => 'indisponible',
        'moteurs'  => [],
        'erreur'   => $quoi,
        'mesure_a' => gmdate('c'),
    ]);
}

// ── 1. Méthode ──────────────────────────────────────────────────────────────
// Aucun paramètre d'entrée n'est lu : ni GET, ni POST, ni en-tête du client.
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    repondre(405, ['releve' => 'indisponible', 'moteurs' => [], 'erreur' => 'Méthode non autorisée.']);
}

// ── 2. Cache ────────────────────────────────────────────────────────────────
$cache = getenv('GLDL_ETAT_CACHE') ?: (sys_get_temp_dir() . '/gldl-etat-moteurs.json');
$forcer = getenv('GLDL_ETAT_FORCER') === '1';

if (!$forcer && is_readable($cache) && (time() - (int)@filemtime($cache)) < CACHE_SECONDES) {
    $contenu = @file_get_contents($cache);
    if ($contenu !== false) {
        $charge = json_decode($contenu, true);
        if (is_array($charge) && isset($charge['moteurs']) && $charge['releve'] === 'lu') {
            $charge['cache'] = 'servi';
            repondre(200, $charge);
        }
    }
}

// ── 3. Trouver le journal d'accès ───────────────────────────────────────────
/**
 * Le journal d'accès de l'hébergement mutualisé. On ne le DEVINE pas au hasard :
 * on essaie les emplacements connus, dans l'ordre, et on retient le premier
 * lisible. `realpath` résout les liens symboliques — cPanel expose souvent
 * `access-logs/` comme un lien vers les journaux du domaine.
 *
 * ⚠️ Le chemin retenu n'est JAMAIS rendu dans la réponse : un chemin de fichier
 *    sur un site public, c'est une indication de plus pour qui cherche.
 */
function trouverJournal(): ?string
{
    $piste = getenv('GLDL_JOURNAL_ACCES');
    $candidats = [];
    if ($piste) {
        $candidats[] = $piste;
    }

    $domaines = ['gldigitallab.fr', 'www.gldigitallab.fr'];
    foreach (['/access-logs', '/logs/access-logs', '/logs', '/usr/local/apache/domlogs', '/var/log/apache2'] as $base) {
        foreach ($domaines as $d) {
            $candidats[] = $base . '/' . $d;
            $candidats[] = $base . '/' . $d . '.log';
        }
        $candidats[] = $base;
    }
    // Positionné par cPanel : le dossier personnel de l'hébergement.
    $home = getenv('HOME');
    if ($home) {
        foreach (['/access-logs', '/logs/access-logs'] as $sous) {
            foreach ($domaines as $d) {
                $candidats[] = $home . $sous . '/' . $d;
            }
        }
    }

    foreach ($candidats as $c) {
        if ($c !== '' && @is_file($c) && @is_readable($c)) {
            return realpath($c) ?: $c;
        }
    }
    return null;
}

/**
 * Compte les passages, PAR MOTEUR, en ne gardant que des entiers.
 * Aucun tableau de chemins, aucune IP, aucun agent brut n'est conservé : la
 * mémoire du processus ne contient elle-même que des compteurs.
 */
function compter(string $chemin): array
{
    $compteurs = array_fill_keys(array_column(MOTEURS, 0), 0);
    $lignes = 0;
    $illisibles = 0;
    $tronque = false;

    $fh = @fopen($chemin, 'rb');
    if ($fh === false) {
        return ['ok' => false, 'raison' => 'journal illisible', 'compteurs' => $compteurs, 'lignes' => 0, 'tronque' => false];
    }

    // Lecture LIGNE À LIGNE : un journal de 30 Mo ne doit jamais être chargé d'un
    // bloc. C'est la différence entre lire un journal et faire exploser un quota
    // de mémoire — sur mutualisé, la seconde option se paie.
    while (($ligne = fgets($fh)) !== false) {
        $lignes++;
        if ($lignes > MAX_LIGNES) { $tronque = true; break; }
        $ligne = rtrim($ligne, "\r\n");
        if ($ligne === '') { continue; }
        $m = [];
        if (preg_match(LIGNE_COMBINED, $ligne, $m) !== 1) { $illisibles++; continue; }
        $agent = $m[AGENT];
        if ($agent === '') { continue; }
        foreach (MOTEURS as [$cle, , $motif]) {
            if (preg_match($motif, $agent) === 1) {
                $compteurs[$cle]++;
                break;   // un moteur, un incrément : jamais deux sur la même ligne
            }
        }
    }
    fclose($fh);

    return ['ok' => true, 'compteurs' => $compteurs, 'lignes' => $lignes, 'illisibles' => $illisibles, 'tronque' => $tronque];
}

$journal = trouverJournal();
if ($journal === null) {
    // Le journal est absent ou non lisible : on le DIT, on n'invente pas des zéros.
    indisponible('Le journal d\'accès n\'est pas lisible depuis le serveur.');
}

$releve = compter($journal);
if (!$releve['ok']) {
    indisponible('Le journal d\'accès n\'a pas pu être ouvert.');
}

// ── 4. Mise en forme — la forme pauvre, et c'est délibéré ───────────────────
$moteurs = [];
foreach (MOTEURS as [$cle, $nom]) {
    // Un moteur à zéro passage N'EST PAS LISTÉ. Le lister reviendrait à publier
    // l'inventaire de ce qu'on surveille sans qu'il soit venu — et la page dit
    // déjà, en clair, que l'absence de ligne n'est pas une absence de visite.
    if ($releve['compteurs'][$cle] === 0) { continue; }
    $moteurs[] = ['moteur' => $nom, 'passages' => $releve['compteurs'][$cle]];
}
usort($moteurs, static fn(array $a, array $b) => $b['passages'] <=> $a['passages']);

$charge = [
    'releve'   => 'lu',
    'mesure_a' => gmdate('c'),          // heure du serveur, en UTC, ISO 8601
    'cache'    => 'frais',
    'moteurs'  => $moteurs,
];

// Le cache est écrit de façon atomique : un écrivain concurrent ne doit pas
// laisser derrière lui un fichier à moitié écrit que le prochain appel lirait.
$tmp = $cache . '.' . getmypid() . '.tmp';
if (@file_put_contents($tmp, json_encode($charge, JSON_UNESCAPED_UNICODE), LOCK_EX) !== false) {
    @rename($tmp, $cache);
} else {
    @unlink($tmp);
}

repondre(200, $charge);
