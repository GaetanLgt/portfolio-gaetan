<?php
declare(strict_types=1);
// ============================================================================
// contact.php — GL Digital Lab · 25/09/2026
//
// ⭐ POURQUOI CE FICHIER EXISTE. L'audit 360° du 25/09/2026 le met en **priorité 1** :
//    « CTA uniquement mailto ». Et le site lui-même le dit, dans l'acte 8 :
//    *« un lien mailto ne sert à RIEN sur un poste sans logiciel de messagerie configuré ».*
//    Un visiteur qui n'a pas de client mail installé ne pouvait pas écrire au studio.
//
// ⛔ ET PAS DE SERVICE TIERS. L'audit proposait « Formulaire/Calendly » : la seconde moitié est
//    refusée par la règle du studio — *aucune donnée client ne part chez un tiers.* Ce formulaire
//    est hébergé ici, traité ici, envoyé ici. Le site ne fait toujours aucune requête vers un
//    domaine extérieur, et c'est vérifié par le contrôle du site.
//
// ⭐ UN SEUL FICHIER PLUTÔT QUE DEUX. Il SERT la page en GET et il la TRAITE en POST. Un couple
//    « page statique + script » aurait obligé à choisir entre dupliquer le formulaire ou
//    renvoyer le visiteur sur une autre page pour lui dire qu'il manquait un champ. *Une erreur
//    se dit là où elle a été commise.*
//
// ⭐ ET IL MARCHE SANS JAVASCRIPT. C'est un `<form>` HTML ordinaire. Le site annonce déjà
//    « texte lisible sans JavaScript » ; le contact suit la même règle.
//
// CE QU'IL REFUSE DE FAIRE
//   · il n'écrit AUCUN fichier du message sur le serveur : il part par mail et ne reste pas ;
//   · il ne stocke ni IP, ni agent, ni horodatage dans le message ;
//   · il ne dit pas à un robot qu'il a été reconnu (il lui répond comme à un envoi réussi) ;
//   · il n'affiche jamais une donnée saisie sans l'avoir échappée ;
//   · il ne dit jamais « c'est envoyé » quand ça ne l'est pas.
//
// ⚠️ CE QU'IL NE PEUT PAS GARANTIR, et c'est écrit pour ne pas le lui faire dire : que le mail
//    ARRIVE. `mail()` remet à l'agent local, qui remet au serveur d'en face. Un filtre peut
//    refuser. D'où l'adresse en clair sur la page de confirmation.
// ============================================================================

const DESTINATAIRE = 'gtn.langlet+lab@gmail.com';
// ⚠️ L'EXPÉDITEUR DOIT ÊTRE DU DOMAINE. Envoyer « au nom de » Gmail depuis o2switch fait échouer
//    le SPF, et le message part en indésirable — ou n'arrive pas. On envoie depuis le domaine,
//    et la réponse revient au visiteur par `Reply-To`.
const EXPEDITEUR   = 'contact@gldigitallab.fr';
const SUJET_BASE   = 'Prise de contact — GL Digital Lab';
const ADRESSE      = 'gtn.langlet+lab@gmail.com';

const LONGUEURS = ['nom' => 100, 'courriel' => 200, 'structure' => 120, 'besoin' => 5000];

/** Échappement unique de tout ce qui est affiché. */
function h(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Nettoie une valeur : borne la longueur, retire les caractères de contrôle.
 *  ⛔ Retirés PARTOUT : dans un en-tête de courriel, un retour à la ligne permet d'ajouter un
 *     en-tête qu'on n'a pas écrit (injection). */
function propre(string $cle, array $source): string
{
    $v = (string) ($source[$cle] ?? '');
    $v = str_replace(["\r", "\n", "\0", '%0a', '%0d'], ' ', $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, LONGUEURS[$cle] ?? 200, 'UTF-8');
}

$envoye   = false;
$probleme = null;          // le message affiché, en français, jamais un code
$valeurs  = ['nom' => '', 'courriel' => '', 'structure' => '', 'besoin' => ''];

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {

    $valeurs = [
        'nom'       => propre('nom', $_POST),
        'courriel'  => propre('courriel', $_POST),
        'structure' => propre('structure', $_POST),
        'besoin'    => propre('besoin', $_POST),
    ];
    $consentement = ($_POST['consentement'] ?? '') === 'oui';

    // ── Le piège à robots ────────────────────────────────────────────────────
    // ⚠️ Un champ que seul un robot remplit : présent dans le HTML, caché par la feuille de style.
    // ⭐ S'il est rempli, on répond exactement comme si tout s'était bien passé. Dire à un robot
    //    qu'il a été reconnu, c'est lui apprendre à contourner le piège.
    if (trim((string) ($_POST['site'] ?? '')) !== '') {
        $envoye = true;
    } else {
        $manques = [];
        if ($valeurs['nom'] === '')                                        { $manques[] = 'votre nom'; }
        if ($valeurs['besoin'] === '')                                     { $manques[] = 'votre besoin'; }
        if (!filter_var($valeurs['courriel'], FILTER_VALIDATE_EMAIL))       { $manques[] = 'une adresse de courriel valide'; }
        // ⚠️ Le consentement est une case à cocher, pas une phrase en bas de page : le visiteur
        //    doit faire un geste. C'est la seule façon de pouvoir dire qu'il a été informé.
        if (!$consentement)                                                { $manques[] = 'votre accord pour être recontacté'; }

        if ($manques) {
            $probleme = 'Il manque ' . implode(', ', $manques) . '. Rien n’a été envoyé — le texte que vous avez écrit est conservé ci-dessous.';
        } else {
            // ── Un seul envoi par minute et par adresse ──────────────────────
            // ⚠️ Ce n'est pas une protection contre une attaque : c'est contre l'accident et le
            //    clic répété. Le repère vit dans le dossier temporaire du système, pas dans le site.
            $repere = sys_get_temp_dir() . '/gldl-contact-' . sha1((string) ($_SERVER['REMOTE_ADDR'] ?? 'x'));
            if (is_file($repere) && (time() - (int) @filemtime($repere)) < 60) {
                $probleme = 'Un message vient déjà d’être envoyé depuis cette connexion. Patientez une minute avant de réessayer.';
            } else {
                @touch($repere);

                $corps = implode("\n", [
                    'Message reçu depuis gldigitallab.fr', '',
                    'Nom       : ' . $valeurs['nom'],
                    'Courriel  : ' . $valeurs['courriel'],
                    'Structure : ' . ($valeurs['structure'] !== '' ? $valeurs['structure'] : '(non précisée)'),
                    '', 'Besoin :', $valeurs['besoin'], '',
                    '---', 'Répondre à ce message écrit directement à la personne qui l’a envoyé.',
                ]);
                $entetes = implode("\r\n", [
                    'From: GL Digital Lab <' . EXPEDITEUR . '>',
                    'Reply-To: ' . $valeurs['courriel'],
                    'Content-Type: text/plain; charset=UTF-8',
                    'Content-Transfer-Encoding: 8bit',
                    'MIME-Version: 1.0',
                    'X-Mailer: gldigitallab.fr',
                ]);

                $ok = @mail(
                    DESTINATAIRE,
                    '=?UTF-8?B?' . base64_encode(SUJET_BASE . ' — ' . $valeurs['nom']) . '?=',
                    $corps,
                    $entetes,
                    '-f' . EXPEDITEUR
                );

                if ($ok) {
                    $envoye = true;
                    $valeurs = ['nom' => '', 'courriel' => '', 'structure' => '', 'besoin' => ''];
                } else {
                    // ⚠️ ON DIT LA VÉRITÉ MÊME QUAND ELLE EST MAUVAISE. `mail()` qui rend `false`
                    //    veut dire que l'agent local a refusé : le message n'est PAS parti. Afficher
                    //    « merci » ferait attendre une réponse qui ne viendra jamais.
                    //    *Un formulaire qui ment sur la livraison est pire que pas de formulaire.*
                    $probleme = 'L’envoi a échoué sur le serveur — votre message n’est pas parti. Réessayez, ou écrivez directement à l’adresse ci-dessous.';
                }
            }
        }
    }
}
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Écrire au studio — GL Digital Lab</title>
<meta name="description" content="Écrire à GL Digital Lab : développement web et IA locale pour PME. Premier échange gratuit de 30 minutes.">
<meta name="robots" content="noindex,follow">
<link rel="stylesheet" href="css/site.css">
</head>
<body class="page-simple">
<main class="acte" style="min-height:auto">
<h1>Écrire au studio</h1>
<p class="sous">Premier échange gratuit — 30 min.</p>
<p>Dites en quelques lignes ce dont vous avez besoin. Je réponds moi-même, et le premier échange sert à savoir si je suis la bonne personne — pas à vous vendre quelque chose.</p>

<?php if ($envoye): ?>
  <div class="form-message form-message-ok" role="status">
    <p><strong>C’est envoyé.</strong> Je réponds en général sous un jour ou deux.</p>
    <p>Si vous n’avez rien reçu d’ici là, écrivez directement à <strong><?= h(ADRESSE) ?></strong> — un filtre a pu refuser le message, et ce ne serait pas de votre fait.</p>
  </div>
<?php elseif ($probleme !== null): ?>
  <div class="form-message form-message-ko" role="alert">
    <p><?= h($probleme) ?></p>
    <p>L’adresse directe reste <strong><?= h(ADRESSE) ?></strong>.</p>
  </div>
<?php endif; ?>

<?php if (!$envoye): ?>
<!-- ⛔ LE FORMULAIRE DISPARAÎT APRÈS UN ENVOI — et ça n'a pas été écrit du premier coup.
     Trouvé par `outils/eprouver-contact.mjs`, qui a rendu 13/14 : le robot piégé recevait bien
     la réponse d'un succès, **mais le formulaire restait affiché**. Le visiteur qui vient
     d'écrire aurait donc revu un formulaire vide, et aurait pu croire que rien n'était parti —
     puis le renvoyer.
     ⭐ *Un formulaire qui reste après un envoi réussi ne dit pas « c'est fait » : il dit
       « recommence ».* C'est l'épreuve qui l'a vu, pas la relecture. -->
<form method="post" action="contact.php" id="formulaire" class="formulaire">
  <p class="champ">
    <label for="nom">Votre nom <span class="obligatoire" aria-hidden="true">*</span></label>
    <input type="text" id="nom" name="nom" required autocomplete="name" maxlength="100" value="<?= h($valeurs['nom']) ?>">
  </p>
  <p class="champ">
    <label for="courriel">Votre courriel <span class="obligatoire" aria-hidden="true">*</span></label>
    <input type="email" id="courriel" name="courriel" required autocomplete="email" maxlength="200" value="<?= h($valeurs['courriel']) ?>">
  </p>
  <p class="champ">
    <label for="structure">Votre structure <span class="facultatif">(facultatif)</span></label>
    <input type="text" id="structure" name="structure" autocomplete="organization" maxlength="120" value="<?= h($valeurs['structure']) ?>">
  </p>
  <p class="champ">
    <label for="besoin">Votre besoin <span class="obligatoire" aria-hidden="true">*</span></label>
    <textarea id="besoin" name="besoin" rows="7" required maxlength="5000"><?= h($valeurs['besoin']) ?></textarea>
  </p>

  <!-- ⛔ LE PIÈGE À ROBOTS. Caché par la feuille de style, jamais par `hidden` (les robots
       remplissent justement les champs `hidden`). Il est aussi hors du parcours au clavier
       (`tabindex="-1"`) et masqué aux lecteurs d'écran (`aria-hidden`). -->
  <p class="piege" aria-hidden="true">
    <label for="site">Ne remplissez pas ce champ</label>
    <input type="text" id="site" name="site" tabindex="-1" autocomplete="off">
  </p>

  <p class="champ champ-coche">
    <input type="checkbox" id="consentement" name="consentement" value="oui" required>
    <label for="consentement">J’accepte d’être recontacté au sujet de ma demande. <span class="facultatif">Votre message sert uniquement à vous répondre, et il est supprimé au plus tard 3 ans après notre dernier échange.</span></label>
  </p>

  <p class="champ champ-envoi">
    <button type="submit" class="bouton-action">Envoyer le message</button>
    <span class="form-trace">Aucune donnée ne part chez un service tiers : ce formulaire est traité par le site lui-même.</span>
  </p>
</form>
<?php endif; ?>

<div class="form-repli">
  <h2>Vous préférez écrire vous-même ?</h2>
  <p>L’adresse est <strong><?= h(ADRESSE) ?></strong> — elle reste valable, et c’est le même endroit.</p>
  <p><a href="index.html">Retour à l’accueil</a> · <a href="confidentialite.html">Confidentialité</a> · <a href="mentions-legales.html">Mentions légales</a></p>
</div>
</main>
</body>
</html>
