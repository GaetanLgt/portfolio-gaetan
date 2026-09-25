// copier-adresse.js — LE BOUTON « COPIER L'ADRESSE » DE L'ACTE 8 (audit externe du 26/09/2026).
//
// Pourquoi un module à part : comme secteurs.js, il ne dépend de rien, il se lit seul et il se
// retire en supprimant une ligne de `main.js` et un `<button>` du HTML.
//
// ⛔ CE QUE CE MODULE N'EST PAS, ET C'EST LE POINT. L'audit proposait :
//      const lienMail = document.querySelector('.contact a');
//      lienMail.addEventListener('click', (e) => { ... navigator.clipboard.writeText('...');
//                                                  lienMail.textContent = 'Adresse copiée…'; });
//    Trois défauts, et aucun n'est cosmétique :
//      ① il DÉTOURNE le lien : le visiteur qui veut écrire se fait copier l'adresse à la place ;
//      ② il CHANGE le libellé du lien : « Écrire au studio » disparaît, et un lien doit se
//        comprendre hors contexte (WCAG 2.4.4) ;
//      ③ il réécrit l'adresse EN DUR alors qu'elle est déjà dans la page.
//    ⇒ Ici : un bouton distinct, qui ne remplace rien, et l'adresse est LUE dans le DOM.
//
// ⛔ SANS PRESSE-PAPIERS, RIEN NE S'AFFICHE. `navigator.clipboard` n'existe que sur une page
//    sécurisée (HTTPS, ou localhost) et sur un navigateur récent. Le bouton est `hidden` dans le
//    HTML : un bouton qui copie du vide est plus trompeur qu'un bouton absent. Même règle que le
//    tiroir des pôles. Et si le navigateur REFUSE l'écriture (permission, onglet non actif), on
//    n'affiche pas de confirmation non plus — *un message faux est pire que pas de message.*

const DUREE_CONFIRMATION = 6000;

export function preparerCopieAdresse() {
  const btn = document.getElementById('copier-adresse');
  const etat = document.getElementById('copie-etat');
  const lien = document.querySelector('.contact a[href^="mailto:"]');
  if (!btn || !etat || !lien) return;

  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function' || !isSecureContext) return;

  // ⚠️ L'ADRESSE SE LIT, ELLE NE S'ÉCRIT PAS ICI. Le `+` de `gtn.langlet+lab@` et le `?subject=`
  //    encodé sont exactement le genre de chose qu'une recopie à la main finit par perdre.
  const brut = decodeURIComponent(String(lien.getAttribute('href') || '').replace(/^mailto:/i, '').split('?')[0]).trim();
  // ASSERTION DE FORME — même esprit que l'assertion d'un remplacement : si ce qui sort du DOM
  // n'est pas une adresse, on ne montre RIEN plutôt que de copier autre chose.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brut)) return;

  let minuterie = 0;
  btn.hidden = false;
  btn.addEventListener('click', () => {
    // On vide d'abord : sans ça, un second clic identique ne serait pas ré-annoncé.
    etat.textContent = '';
    clearTimeout(minuterie);
    navigator.clipboard.writeText(brut).then(() => {
      etat.textContent = `Adresse copiée : ${brut}`;
      minuterie = setTimeout(() => { etat.textContent = ''; }, DUREE_CONFIRMATION);
    }).catch(() => {
      // refus du navigateur : on ne dit rien, et surtout pas « copié ». Rien à journaliser ici :
      // une erreur console ferait échouer le contrôle du studio, et le visiteur n'y gagnerait rien.
    });
  });
}
