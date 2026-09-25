// secteurs.mjs — LE TIROIR DES PÔLES D'EXPERTISE (proposé par Gaëtan, 26/09/2026).
//
// Pourquoi un fichier à part : le tiroir ne dépend d'aucun autre module, et un module séparé
// se lit, se teste et se retire seul. `main.js` l'importe en une ligne.
//
// ⛔ CE QUI A ÉTÉ CORRIGÉ AVANT L'INTÉGRATION, ET POURQUOI :
//    · le mot interdit du studio, dans la carte IA : il est dans la liste noire du contrôle
//      (`tests/controle.mjs`) et la page aurait ÉCHOUÉ. Remplacé par « locaux » — le mot juste,
//      et celui qui est vrai. ⚠️ Il a fallu le retirer DEUX fois : de la carte, puis d'ICI, parce
//      que ce commentaire le réécrivait pour l'expliquer. *Un commentaire fait partie du fichier.*
//    · `role="dialog"` + `aria-modal="true"` SANS PIÈGE DE FOCUS est une demi-accessibilité :
//      un lecteur d'écran annonce un dialogue modal, puis le clavier sort du dialogue. Le piège
//      est ajouté ici (Tab et Maj+Tab restent dans le tiroir).
//    · `document.body.style.overflow = 'hidden'` retire le défilement À TOUT LE MONDE, y compris
//      au clavier. On le pose, et on le RETIRE à la fermeture — vérifié plus bas.

export function preparerSecteurs() {
  const btn = document.getElementById('btn-secteurs');
  const tiroir = document.getElementById('tiroir-secteurs');
  const fermer = document.getElementById('fermer-secteurs');
  const devis = document.getElementById('lien-devis-direct');
  if (!btn || !tiroir || !fermer) return;

  // ⛔ Le tiroir est `hidden` DANS LE HTML : sans JavaScript, il n'existe pas à l'écran, et le
  //    bouton ne fait rien. Pas de contenu piégé derrière un script qui n'a pas tourné.
  function ouvrir() {
    tiroir.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    fermer.focus();
  }
  function fermerTiroir() {
    tiroir.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.removeProperty('overflow');
    btn.focus();
  }

  btn.addEventListener('click', () => {
    if (tiroir.hidden) { ouvrir(); document.body.style.overflow = 'hidden'; }
    else fermerTiroir();
  });
  fermer.addEventListener('click', fermerTiroir);
  // ⛔ Le clic sur le fond FERME : un tiroir modal dont on ne sort qu'au bouton est un piège.
  tiroir.addEventListener('click', (e) => { if (e.target === tiroir) fermerTiroir(); });
  addEventListener('keydown', (e) => {
    if (tiroir.hidden) return;
    if (e.key === 'Escape') { fermerTiroir(); return; }
    // ⭐ LE PIÈGE DE FOCUS — ce que `aria-modal` promet et que le code proposé ne tenait pas.
    if (e.key !== 'Tab') return;
    const focusables = tiroir.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return;
    const premier = focusables[0], dernier = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  });
  // le lien vers l'acte 8 ferme le tiroir, sinon on arrive sur la page avec un tiroir ouvert
  devis?.addEventListener('click', fermerTiroir);
  // et si le visiteur quitte la page par le clavier (lien vers l'acte 8), on rend le défilement
  devis?.addEventListener('blur', () => { if (!tiroir.hidden) document.body.style.removeProperty('overflow'); });
}
