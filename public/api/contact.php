<?php
/**
 * Formulaire de contact — endpoint auto-hébergé (GL Digital Lab)
 *
 * REMPLACE FORMSPREE (10/09/2026). Le formulaire envoyait jusqu'ici le nom,
 * l'e-mail et le message du visiteur à Formspree, société américaine : un
 * transfert de données hors Union européenne qui n'était déclaré nulle part et
 * qui contredisait l'argument de souveraineté du site. Ici, tout reste sur
 * l'hébergement o2switch, en France.
 *
 * Ce que fait ce script :
 *   - refuse tout ce qui n'est pas un POST JSON ;
 *   - valide et borne chaque champ ;
 *   - rejette les robots par trois moyens simples (piège à champ, délai
 *     minimal de remplissage, limitation par adresse IP) ;
 *   - envoie UN e-mail à un destinataire FIXE — jamais un relais ouvert ;
 *   - répond en JSON, sans jamais exposer d'erreur technique au visiteur.
 *
 * Ce qu'il ne fait PAS, volontairement : aucune base de données, aucun
 * journal du contenu des messages, aucun cookie, aucun service tiers.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

// ── Réglages ────────────────────────────────────────────────────────────────
// NB : une constante PHP ne peut pas contenir d'appel de fonction (erreur
// fatale « Constant expression contains invalid operations ») — d'où la
// variable simple pour le chemin du fichier de limitation.
const DESTINATAIRE   = 'gtn.langlet+lab@gmail.com';
const EXPEDITEUR     = 'no-reply@gldigitallab.fr';   // doit exister sur le domaine
const DELAI_MINIMUM  = 2;      // secondes entre l'affichage et l'envoi (anti-robot)
const MAX_PAR_HEURE  = 5;      // envois maximum par adresse IP et par heure

$FICHIER_LIMITE = sys_get_temp_dir() . '/gldl-contact-limite.json';

/** Répond et termine. */
function repondre(int $code, array $charge): void
{
    http_response_code($code);
    echo json_encode($charge, JSON_UNESCAPED_UNICODE);
    exit;
}

// ── 1. Méthode ──────────────────────────────────────────────────────────────
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    repondre(405, ['ok' => false, 'erreur' => 'Méthode non autorisée.']);
}

// ── 2. Corps JSON ───────────────────────────────────────────────────────────
$brut = file_get_contents('php://input') ?: '';
if (strlen($brut) > 20000) {              // garde-fou : charge anormalement grosse
    repondre(413, ['ok' => false, 'erreur' => 'Message trop volumineux.']);
}
$donnees = json_decode($brut, true);
if (!is_array($donnees)) {
    repondre(400, ['ok' => false, 'erreur' => 'Requête illisible.']);
}

/** Nettoie une valeur texte : une seule ligne pour les champs courts. */
function texte(array $d, string $cle, int $max, bool $uneLigne = true): string
{
    $v = trim((string)($d[$cle] ?? ''));
    if ($uneLigne) {
        $v = preg_replace('/[\r\n\t]+/', ' ', $v) ?? '';
    }
    // On retire les octets de contrôle, on garde les accents et les emojis.
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr($v, 0, $max);
}

// ── 3. Pièges anti-robots ───────────────────────────────────────────────────
// Champ appât : invisible dans la page, un humain ne le remplit jamais.
if (trim((string)($donnees['site_web'] ?? '')) !== '') {
    repondre(200, ['ok' => true]);        // on ne dit pas au robot qu'il est démasqué
}

// Délai minimal : un formulaire rempli en moins de deux secondes est un robot.
$horodatage = (int)($donnees['horodatage'] ?? 0);
$maintenant = (int)round(microtime(true) * 1000);
if ($horodatage > 0 && ($maintenant - $horodatage) < DELAI_MINIMUM * 1000) {
    repondre(200, ['ok' => true]);
}

// ── 4. Validation ───────────────────────────────────────────────────────────
$nom     = texte($donnees, 'name', 100);
$email   = texte($donnees, 'email', 160);
$projet  = texte($donnees, 'project', 80);
$budget  = texte($donnees, 'budget', 40);
$delai   = texte($donnees, 'deadline', 40);
$message = texte($donnees, 'message', 5000, false);

$erreurs = [];
if (mb_strlen($nom) < 2) {
    $erreurs['name'] = 'Merci d\'indiquer votre nom.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs['email'] = 'Cette adresse e-mail ne semble pas valide.';
}
if (mb_strlen($message) < 10) {
    $erreurs['message'] = 'Décrivez votre besoin en quelques mots (10 caractères minimum).';
}
if ($erreurs) {
    repondre(422, ['ok' => false, 'erreur' => 'Certains champs demandent une correction.', 'champs' => $erreurs]);
}

// ── 5. Limitation par IP ────────────────────────────────────────────────────
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'inconnue');
$empreinte = hash('sha256', $ip . '|gldl');   // on ne stocke pas l'IP en clair
$limites = [];
if (is_readable($FICHIER_LIMITE)) {
    $contenu = file_get_contents($FICHIER_LIMITE);
    $limites = $contenu ? (json_decode($contenu, true) ?: []) : [];
}
$maintenant_s = time();
$limites = array_filter($limites, static fn($t) => $maintenant_s - (int)$t < 3600);
if (count(array_filter($limites, static fn($t, $k) => $k === $empreinte, ARRAY_FILTER_USE_BOTH)) >= MAX_PAR_HEURE) {
    repondre(429, ['ok' => false, 'erreur' => 'Trop d\'envois depuis votre connexion. Réessayez dans une heure ou appelez-nous.']);
}
$limites[] = $maintenant_s;
@file_put_contents($FICHIER_LIMITE, json_encode(array_slice($limites, -500)), LOCK_EX);

// ── 6. Composition et envoi de l'e-mail ─────────────────────────────────────
$sujet = sprintf('[GL Digital Lab] %s — %s', $nom, $projet !== '' ? $projet : 'demande de contact');

$corps = implode("\n", array_filter([
    'Nouvelle demande depuis gldigitallab.fr',
    str_repeat('-', 48),
    'Nom      : ' . $nom,
    'E-mail   : ' . $email,
    $projet  !== '' ? 'Projet   : ' . $projet  : null,
    $budget  !== '' ? 'Budget   : ' . $budget  : null,
    $delai   !== '' ? 'Délai    : ' . $delai   : null,
    str_repeat('-', 48),
    $message,
    str_repeat('-', 48),
    'Reçu le  : ' . date('d/m/Y à H:i'),
    'Source   : formulaire auto-hébergé (aucun sous-traitant)',
]));

$entetes = implode("\r\n", [
    'From: GL Digital Lab <' . EXPEDITEUR . '>',
    'Reply-To: ' . sprintf('%s <%s>', preg_replace('/[<>"]/', '', $nom), $email),
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: GL-Digital-Lab-Contact',
]);

$envoye = @mail(
    DESTINATAIRE,
    '=?UTF-8?B?' . base64_encode($sujet) . '?=',
    $corps,
    $entetes,
    '-f' . EXPEDITEUR
);

if (!$envoye) {
    // On ne révèle pas la panne technique au visiteur : on lui donne une porte
    // de sortie qui marche toujours.
    repondre(502, [
        'ok' => false,
        'erreur' => 'L\'envoi a échoué. Écrivez directement à ' . DESTINATAIRE . ' ou appelez le 06 86 47 46 10.',
    ]);
}

repondre(200, ['ok' => true, 'message' => 'Message envoyé. Réponse sous 24 h.']);
