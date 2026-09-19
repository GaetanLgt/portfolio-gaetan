<?php
/**
 * ÉPREUVE DE `public/api/etat.php` — jeu d'essai SYNTHÉTIQUE.
 *
 * POURQUOI CE FICHIER. L'endpoint lit le journal d'accès de l'hébergement, qui contient
 * des adresses IP de visiteurs. On ne le teste donc PAS sur le journal réel depuis un
 * poste de travail : on fabrique un journal d'essai dont toutes les adresses viennent
 * des plages réservées à la documentation (RFC 5737 : 192.0.2.0/24, 198.51.100.0/24,
 * 203.0.113.0/24) — **aucune donnée de tiers n'entre dans cette épreuve**.
 *
 * ⚠️ POURQUOI `proc_open` ET NON `shell_exec` — défaut réellement produit ici.
 * Le premier jet construisait une ligne de commande « VAR=valeur php endpoint » et
 * l'envoyait à `shell_exec`. Mesure : *« 'GLDL_JOURNAL_ACCES' n'est pas reconnu en tant
 * que commande interne ou externe »* — 13 épreuves sur 30 en échec, **et pas une seule
 * à cause de l'endpoint**. C'est le motif que ce studio traque : un harnais faux qui
 * accuse le code. `proc_open` prend l'environnement séparé de la commande, et rend les
 * trois flux ainsi que le code de sortie : le harnais cesse de deviner.
 *
 * CE QU'IL ÉPROUVE, ET C'EST LA PARTIE QUI COMPTE : ce que l'endpoint REND.
 *   1.  les 18 moteurs de la liste sont reconnus ;
 *   2.  la sortie ne contient AUCUNE adresse IP, ni en clair ni hachée ;
 *   3.  la sortie ne contient AUCUN chemin de page ;
 *   4.  la sortie ne contient AUCUN User-Agent brut — pas même celui qui n'a pas été
 *       reconnu, que l'outil en ligne de commande affiche et que cet endpoint doit taire ;
 *   5.  un moteur à zéro passage n'est pas listé ;
 *   6.  aucun en-tête CORS ouvert dans le code ;
 *   7.  journal illisible → erreur propre, et surtout PAS des zéros ;
 *   8.  méthode autre que GET → refus ;
 *   9.  cache : le second appel est servi depuis le fichier temporaire ;
 *   10. la sortie est un JSON valide, en UTF-8, aux accents intacts.
 *
 * USAGE : php scripts/epreuve-etat-php.php
 * Sortie 0 = toutes les épreuves passent. 1 = au moins une échoue.
 */

declare(strict_types=1);

$racine = dirname(__DIR__);
$endpoint = $racine . '/public/api/etat.php';
$tmp = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'epreuve-etat-' . getmypid();
@mkdir($tmp, 0700, true);

$journal = $tmp . '/essai.log';
$cache = $tmp . '/cache.json';

/* ── Le journal d'essai : les 18 familles de moteurs + du bruit ─────────────── */
/** Chaque famille de la liste, avec le nom attendu dans la sortie. */
const FAMILLES = [
    'GPTBot/1.0' => 'OpenAI — GPTBot',
    'ChatGPT-User/1.0' => 'OpenAI — ChatGPT-User',
    'OAI-SearchBot/1.0' => 'OpenAI — OAI-SearchBot',
    'ClaudeBot/1.0' => 'Anthropic — ClaudeBot',
    'Claude-User/1.0' => 'Anthropic — Claude-User',
    'PerplexityBot/1.0' => 'Perplexity',
    'Google-Extended' => 'Google — Gemini/Extended',
    'Googlebot/2.1' => 'Google — classique',
    'Applebot/0.1' => 'Apple',
    'CCBot/2.0' => 'Common Crawl',
    'Bytespider' => 'Bytespider (ByteDance)',
    'Amazonbot/0.1' => 'Amazon',
    'meta-externalagent/1.0' => 'Meta — ExternalAgent',
    'cohere-ai' => 'Cohere',
    'YouBot/1.0' => 'You.com',
    'DuckAssistBot/1.0' => 'DuckDuckGo',
    'MistralAI-User/1.0' => 'Mistral',
    'bingbot/2.0' => 'Bing',
];

$lignes = [];
$i = 0;
/* ⚠️ LES COMPTES SONT FABRIQUÉS, PUIS CONSERVÉS — ET C'EST LE CORRECTIF D'UN DÉFAUT
   DU HARNAIS LUI-MÊME. La première version recalculait les passages attendus plus
   loin avec un `$i % 3` sur une AUTRE boucle. Les deux boucles ont divergé dès qu'un
   agent supplémentaire a été ajouté près de la liste (le cas « anthropic-ai », qui
   double légitimement le compte de ClaudeBot) : l'épreuve accusait alors l'endpoint
   d'un écart qu'elle avait fabriqué. *Un harnais qui recalcule ce qu'il vient de
   fabriquer finit par se contredire.* On lit donc le journal d'essai tel qu'il a été
   écrit, plutôt que de refaire le calcul de mémoire. */
$attendu = [];
foreach (FAMILLES as $agent => $nom) {
    $passages = ($i % 3) + 1;   // un compte DIFFÉRENT par famille : le tri devient observable
    $attendu[$nom] = 0;
    for ($p = 0; $p < $passages; $p++) {
        $lignes[] = sprintf(
            '%s - - [19/Sep/2026:08:%02d:33 +0200] "GET /chemin-prive/secret-%d HTTP/1.1" 200 12345 "-" "%s"',
            '192.0.2.' . (($i % 200) + 1), $i % 60, $i, $agent
        );
        $attendu[$nom]++;
        $i++;
    }
}
// Le cas « anthropic-ai » : la liste reconnaît les DEUX motifs par la même expression.
// Il compte donc dans ClaudeBot, et l'attendu doit le savoir — c'est justement le genre
// d'écart que ce harnais doit mesurer, pas subir.
$lignes[] = '192.0.2.201 - - [19/Sep/2026:08:59:00 +0200] "GET /chemin-prive/secret-201 HTTP/1.1" 200 12345 "-" "anthropic-ai/1.0"';
$attendu['Anthropic — ClaudeBot']++;
// Du bruit, et un cas limite : un agent VIDE (que la regex reconnaît mais que la
// liste ne doit pas compter comme un moteur).
$lignes[] = '198.51.100.7 - - [19/Sep/2026:09:00:01 +0200] "GET / HTTP/1.1" 200 4242 "-" "Mozilla/5.0 (Windows NT 10.0) Gecko/20100101 Firefox/130.0"';
$lignes[] = '198.51.100.8 - - [19/Sep/2026:09:00:02 +0200] "GET / HTTP/1.1" 200 4242 "-" "Aspirateur-Inconnu/9.9"';
$lignes[] = '203.0.113.9 - - [19/Sep/2026:09:00:03 +0200] "GET / HTTP/1.1" 200 4242 "-" ""';
$lignes[] = 'ceci n\'est pas une ligne de journal Apache';
file_put_contents($journal, implode("\n", $lignes) . "\n");

/* ── L'appel de l'endpoint, dans un processus PHP à part ────────────────────── */
/**
 * ⚠️ L'ENVIRONNEMENT EST PASSÉ SÉPARÉMENT DE LA COMMANDE (4e argument de `proc_open`).
 * Le journal, le cache et le mode forcé sont des réglages d'EXPLOITATION, jamais des
 * paramètres de requête — et l'endpoint n'en lit aucun de la requête.
 */
function appeler(string $endpoint, string $journal, string $cache, string $methode = 'GET', string $forcer = '1', bool $journalPresent = true): array
{
    $env = [
        'GLDL_JOURNAL_ACCES' => $journalPresent ? $journal : $journal . '-absent',
        'GLDL_ETAT_CACHE' => $cache,
        'GLDL_ETAT_FORCER' => $forcer,
        'REQUEST_METHOD' => $methode,
        'PATH' => (string)getenv('PATH'),
        'SystemRoot' => (string)getenv('SystemRoot'),
    ];
    $descripteurs = [1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
    $proc = proc_open([PHP_BINARY, $endpoint], $descripteurs, $tuyaux, null, $env);
    if (!is_resource($proc)) return ['corps' => '', 'erreur' => 'processus non démarré', 'code' => null];
    $corps = stream_get_contents($tuyaux[1]);
    $erreur = stream_get_contents($tuyaux[2]);
    fclose($tuyaux[1]);
    fclose($tuyaux[2]);
    $code = proc_close($proc);
    return ['corps' => (string)$corps, 'erreur' => (string)$erreur, 'code' => $code];
}

/* ── Les épreuves ──────────────────────────────────────────────────────────── */
$verdicts = [];
$ok = function (bool $condition, string $quoi, string $detail = '') use (&$verdicts): void {
    $verdicts[] = [$condition, $quoi, $detail];
};

$reponse = appeler($endpoint, $journal, $cache);
$corps = $reponse['corps'];
$source = (string)file_get_contents($endpoint);
// Le code source SANS ses commentaires : un en-tête est une instruction, pas une phrase.
$code = preg_replace('#/\*[\s\S]*?\*/#', ' ', $source) ?? $source;
$code = preg_replace('#(^|[^:])//[^\n]*#', '$1 ', $code) ?? $code;

$donnees = json_decode($corps, true);
$ok(is_array($donnees), 'la réponse est un JSON valide', is_array($donnees) ? '' : substr($corps, 0, 140) . ' | ' . substr($reponse['erreur'], 0, 140));
$ok(($donnees['releve'] ?? null) === 'lu', 'le relevé est marqué « lu »', (string)($donnees['releve'] ?? '?'));
$ok(isset($donnees['moteurs']) && is_array($donnees['moteurs']), 'la réponse porte une liste de moteurs');

$moteurs = $donnees['moteurs'] ?? [];
$noms = array_column($moteurs, 'moteur');
$ok(count($moteurs) === count(FAMILLES), 'les ' . count(FAMILLES) . ' familles sont reconnues', count($moteurs) . ' rendue(s)');
$manquantes = array_diff(array_values(FAMILLES), $noms);
$ok(count($manquantes) === 0, 'chaque nom attendu figure dans la sortie', implode(', ', $manquantes));

// 2-4. CE QUE LA SORTIE NE DOIT PAS CONTENIR — le cœur de l'épreuve.
$ok(!preg_match('/\b\d{1,3}(\.\d{1,3}){3}\b/', $corps), 'aucune adresse IP dans la réponse');
$ok(strpos($corps, '192.0.2.') === false, 'aucune adresse IP du journal d\'essai dans la réponse');
$ok(strpos($corps, 'chemin-prive') === false, 'aucun chemin de page dans la réponse');
$ok(stripos($corps, 'Mozilla') === false, 'aucun User-Agent navigateur dans la réponse');
$ok(stripos($corps, 'Aspirateur-Inconnu') === false, 'aucun User-Agent NON reconnu dans la réponse');
$ok(strpos($corps, 'secret-') === false, 'aucun fragment de requête dans la réponse');
$ok(strpos($corps, $journal) === false, 'aucun chemin de fichier du serveur dans la réponse');
$ok(strpos($corps, '192.0.2') === false && strpos($corps, '198.51.100') === false, 'aucune adresse de la documentation non plus');

// La « forme pauvre » : exactement deux clés, et des entiers.
$clesMoteur = $moteurs ? array_keys($moteurs[0]) : [];
sort($clesMoteur);
$ok($clesMoteur === ['moteur', 'passages'], 'chaque entrée ne porte que « moteur » et « passages »', implode(', ', $clesMoteur));
$tousEntiers = array_reduce($moteurs, fn($c, $m) => $c && is_int($m['passages']), true);
$ok($tousEntiers, 'les passages sont des entiers, jamais des chaînes');

// Tri décroissant.
$decroissant = true;
for ($k = 1; $k < count($moteurs); $k++) {
    if ($moteurs[$k - 1]['passages'] < $moteurs[$k]['passages']) $decroissant = false;
}
$ok($decroissant, 'les moteurs sont triés par passages décroissants');

// 5. Aucun moteur à zéro passage n'est listé.
$avecZero = array_filter($moteurs, fn($m) => $m['passages'] === 0);
$ok(count($avecZero) === 0, 'aucun moteur listé avec zéro passage', count($avecZero) . ' trouvé(s)');
// Les passages doivent correspondre EXACTEMENT au journal fabriqué — et l'attendu a
// été CONSERVÉ au moment de la fabrication (`$attendu`), jamais recalculé après.
$comptageJuste = true;
$detailComptage = [];
foreach ($moteurs as $m) {
    if (($attendu[$m['moteur']] ?? null) !== $m['passages']) {
        $comptageJuste = false;
        $detailComptage[] = $m['moteur'] . ' : ' . ($attendu[$m['moteur']] ?? '?') . ' attendu, ' . $m['passages'] . ' rendu';
    }
}
$ok($comptageJuste, 'les compteurs correspondent exactement au journal fabriqué', implode(' ; ', array_slice($detailComptage, 0, 4)));

// 6. En-têtes.
$ok(strpos($code, "header('Content-Type: application/json; charset=utf-8')") !== false, 'en-tête Content-Type JSON déclaré (hors commentaires)');
$ok(stripos($code, 'Access-Control-Allow-Origin') === false, 'AUCUN en-tête CORS ouvert dans le code actif');
$ok(strpos($code, 'nosniff') !== false, 'en-tête X-Content-Type-Options déclaré');
// Aucun paramètre d'entrée libre n'est lu.
$ok(strpos($code, '$_GET') === false, 'aucun paramètre de requête lu ($_GET absent)');
$ok(strpos($code, 'php://input') === false, 'aucun corps de requête lu');

// 7. Journal illisible → erreur propre, PAS des zéros.
$reponseKo = appeler($endpoint, $journal, $cache . '-ko', 'GET', '1', false);
$donneesKo = json_decode($reponseKo['corps'], true);
$ok(is_array($donneesKo), 'journal absent : la réponse reste un JSON valide', substr($reponseKo['corps'], 0, 140) . ' | ' . substr($reponseKo['erreur'], 0, 140));
$ok(($donneesKo['releve'] ?? null) === 'indisponible', 'journal absent : le relevé est marqué « indisponible »', (string)($donneesKo['releve'] ?? '?'));
$ok(($donneesKo['moteurs'] ?? null) === [], 'journal absent : la liste est VIDE et non remplie de zéros');
$ok(strpos($reponseKo['corps'], $journal) === false, 'journal absent : aucun chemin de fichier dans l\'erreur');
$ok($reponseKo['code'] !== 0, 'journal absent : le code de sortie du processus n\'est pas un succès aveugle', 'code ' . var_export($reponseKo['code'], true));

// 8. Méthode refusée.
$reponsePost = appeler($endpoint, $journal, $cache . '-post', 'POST');
$donneesPost = json_decode($reponsePost['corps'], true);
$ok(is_array($donneesPost) && ($donneesPost['releve'] ?? null) === 'indisponible',
    'méthode POST : refusée proprement', substr($reponsePost['corps'], 0, 140));

// 9. Cache.
$second = appeler($endpoint, $journal, $cache, 'GET', '');
$donneesSecond = json_decode($second['corps'], true);
$ok(($donneesSecond['cache'] ?? null) === 'servi', 'le second appel est servi depuis le cache', (string)($donneesSecond['cache'] ?? '?'));
$ok(($donneesSecond['moteurs'] ?? null) === $moteurs, 'le cache rend exactement la même liste');
$ok(is_file($cache), 'le fichier de cache a bien été écrit');

// 10. UTF-8 et accents.
$ok(mb_check_encoding($corps, 'UTF-8'), 'la réponse est de l\'UTF-8 valide');
$ok(strpos($corps, '\\u') === false, 'les accents ne sont pas échappés en \\uXXXX (JSON_UNESCAPED_UNICODE)');
$ok(strpos($corps, '—') !== false, 'les accents et tirets arrivent intacts');

/* ── Rapport ───────────────────────────────────────────────────────────────── */
echo "\n" . str_repeat('=', 74) . "\n";
echo "  ÉPREUVE DE L'ENDPOINT — jeu d'essai synthétique (aucune donnée de visiteur)\n";
echo str_repeat('=', 74) . "\n";
echo '  journal d\'essai : ' . count($lignes) . " ligne(s)\n";
echo '                    ' . count(FAMILLES) . " familles de moteurs + 1 navigateur + 1 robot inconnu\n";
echo "                    + 1 agent vide + 1 ligne illisible\n";
echo '  moteurs rendus  : ' . count($moteurs) . "\n\n";
$echecs = 0;
foreach ($verdicts as [$condition, $quoi, $detail]) {
    if (!$condition) $echecs++;
    echo '  [' . ($condition ? 'ok' : '!!') . ']  ' . $quoi . ($detail !== '' ? '  — ' . $detail : '') . "\n";
}
echo "\n";
echo $echecs === 0 ? "  Toutes les épreuves passent.\n" : "  $echecs épreuve(s) en échec.\n";
echo str_repeat('=', 74) . "\n\n";

foreach (glob($tmp . DIRECTORY_SEPARATOR . '*') ?: [] as $f) @unlink($f);
@rmdir($tmp);
exit($echecs === 0 ? 0 : 1);
