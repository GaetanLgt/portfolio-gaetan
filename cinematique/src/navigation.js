// navigation.js — LE MENU ET LA NAVIGATION INTERNE
// =================================================
// Écrit le 28/09/2026, pour la refonte de la barre.
//
// ⛔ CE FICHIER EXISTE PARCE QUE LA NAVIGATION DISPARAISSAIT SUR MOBILE.
//    Mesuré le 28/09/2026 sur la copie de production, à 900 px et à 390 px :
//    `@media (max-width:1100px){.barre nav a{display:none}}` effaçait les sept liens
//    et **rien ne les remplaçait**. Aucune boîte, aucun déclencheur.
//    ⭐ Le studio avait déjà écrit la règle qui condamne ce motif — à propos de
//    l'interrupteur d'animations — sans l'appliquer à la navigation elle-même.
//
// IL FAIT QUATRE CHOSES, ET RIEN DE PLUS :
//   ① ouvrir/fermer le menu (clic, clavier, voile) ;
//   ② marquer l'acte courant (`aria-current`) ;
//   ③ fermer le menu après un clic sur une destination ;
//   ④ garantir qu'un lien vers un acte amène VRAIMENT à cet acte.
//
// ⛔ CE QU'IL NE FAIT PAS : il ne touche ni aux repères de progression (`nav.reperes`),
//    ni à l'interrupteur d'animations, ni au tiroir des pôles. Ils marchent, ils restent.
// ⛔ ET IL NE PREND AUCUNE COULEUR : la palette est un canon, pas une décision de script.

(function () {
  'use strict';

  const barre   = document.querySelector('header.barre');
  const bouton  = document.getElementById('btn-menu');
  const menu    = document.getElementById('menu-principal');
  const voile   = document.getElementById('voile-menu');
  if (!barre || !bouton || !menu) return;   // page sans barre : on ne fait rien, sans erreur

  // ⭐ LA HAUTEUR DE LA BARRE EST MESURÉE, PAS ÉCRITE.
  //    Le menu se place sous la barre avec `top: var(--hauteur-barre)`. Une valeur écrite à
  //    la main (70px) deviendrait fausse dès qu'on change le padding ou la police — et le
  //    menu se poserait à cheval sur la barre. *Un chiffre écrit à la main redevient faux
  //    sans le dire.* On la mesure donc, et on la remesure au redimensionnement.
  function mesurerBarre() {
    document.documentElement.style.setProperty('--hauteur-barre', barre.offsetHeight + 'px');
  }
  mesurerBarre();
  addEventListener('resize', mesurerBarre, { passive: true });
  // ⚠️ La police arrive après le premier rendu : la hauteur change une fois de plus.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(mesurerBarre);

  // ── ① OUVRIR / FERMER ──────────────────────────────────────────────────────
  const estOuvert = () => bouton.getAttribute('aria-expanded') === 'true';

  function ouvrir() {
    bouton.setAttribute('aria-expanded', 'true');
    bouton.setAttribute('aria-label', 'Fermer le menu');
    menu.classList.add('ouvert');
    if (voile) voile.hidden = false;
    // ⚠️ On NE déplace PAS le focus dans le menu : le bouton reste la commande, et un
    //    lecteur d'écran qui perd son focus au clic ne sait plus où il est.
    //    `aria-expanded` suffit à annoncer l'état.
  }

  function fermer(rendreLeFocus) {
    if (!estOuvert()) return;
    bouton.setAttribute('aria-expanded', 'false');
    bouton.setAttribute('aria-label', 'Ouvrir le menu');
    menu.classList.remove('ouvert');
    if (voile) voile.hidden = true;
    // ⭐ On rend le focus au bouton SI la fermeture vient du clavier (Échap) : sinon le
    //    focus resterait sur un élément devenu invisible. Sur un clic, non — l'utilisateur
    //    a désigné un lien, et lui voler son focus serait pire.
    if (rendreLeFocus) bouton.focus();
  }

  bouton.addEventListener('click', () => (estOuvert() ? fermer(false) : ouvrir()));
  if (voile) voile.addEventListener('click', () => fermer(false));

  // ── ③ FERMER APRÈS AVOIR CHOISI UNE DESTINATION ────────────────────────────
  // ⚠️ Sans ça, le menu reste ouvert par-dessus la section qu'on vient de rejoindre :
  //    le visiteur clique, la page défile, et il ne voit rien d'autre que le menu.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) fermer(false);
  });

  // ── LE CLAVIER ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && estOuvert()) { fermer(true); return; }

    // ⭐ LE PIÈGE À FOCUS, ET IL EST OBLIGATOIRE ICI.
    //    Le menu est un panneau qui recouvre la page. Sans piège, la tabulation sort du
    //    menu et va se promener dans une page qu'on ne voit pas — *un utilisateur au
    //    clavier se retrouve à taper dans le vide.*
    if (e.key === 'Tab' && estOuvert()) {
      const focusables = menu.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const premier = focusables[0], dernier = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    }
  });

  // ⚠️ Si la fenêtre repasse au-dessus du seuil pendant que le menu est ouvert, on ferme.
  //    Sinon l'état « ouvert » survit à un redimensionnement et le voile reste posé sur un
  //    menu redevenu barre horizontale — *un voile sans menu est un écran noir.*
  const large = matchMedia('(min-width:1101px)');
  const surLarge = (e) => { if (e.matches) fermer(false); };
  if (large.addEventListener) large.addEventListener('change', surLarge);
  else if (large.addListener) large.addListener(surLarge);

  // ── ② MARQUER L'ACTE COURANT ───────────────────────────────────────────────
  // ⭐ `aria-current="page"` ET la classe CSS : le repère visuel seul ne dit rien à un
  //    lecteur d'écran, et il ne dit rien non plus à qui ne distingue pas le cyan.
  // ⚠️ On réutilise le calcul DÉJÀ fait par la page (la fonction `acteCourant` du main.js
  //    n'est pas exportée) : on lit donc la position des sections, sans dupliquer la logique
  //    de défilement — c'est la même source que les repères.
  const liens = [...menu.querySelectorAll('a[href^="#acte-"]')];
  if (!liens.length) return;

  const sections = liens
    .map((a) => ({ lien: a, section: document.querySelector(a.getAttribute('href')) }))
    .filter((p) => p.section);

  let dernierMarque = null;
  function marquer() {
    // La section dont le haut est le plus proche du haut de fenêtre sans le dépasser.
    const seuil = innerHeight * 0.35;
    let courant = sections[0];
    for (const p of sections) {
      if (p.section.getBoundingClientRect().top <= seuil) courant = p;
    }
    if (!courant || courant === dernierMarque) return;
    dernierMarque = courant;
    for (const p of sections) p.lien.removeAttribute('aria-current');
    courant.lien.setAttribute('aria-current', 'page');
  }

  let attente = false;
  addEventListener('scroll', () => {
    if (attente) return;
    attente = true;
    requestAnimationFrame(() => { attente = false; marquer(); });
  }, { passive: true });
  marquer();

  // ── ④ LE LIEN AMÈNE VRAIMENT À L'ACTE ─────────────────────────────────────
  // ⚠️ CE QUE ÇA CORRIGE, ET C'EST UN DÉFAUT MESURÉ AILLEURS DANS CE SITE.
  //    La page a une barre FIXE en haut. Un lien d'ancre place la section tout en haut
  //    de la fenêtre — donc **sous la barre**, qui la recouvre. L'acte 8 mesurait
  //    3 581 px sur mobile : son titre disparaissait derrière la barre à chaque clic.
  //    ⇒ on décale le défilement de la hauteur RÉELLE de la barre.
  //    ⛔ Sans `scroll-margin-top`, c'est un `scrollIntoView` qui écrase le défilement
  //      doux déclaré en CSS (`scroll-behavior:smooth`) — on préfère donc la marge, qui
  //      laisse le navigateur faire son travail.
  function poserLesMarges() {
    const h = barre.offsetHeight + 8;   // 8 px d'air, pour que le titre ne colle pas au bord
    document.documentElement.style.setProperty('--marge-ancre', h + 'px');
  }
  poserLesMarges();
  addEventListener('resize', poserLesMarges, { passive: true });

  // La marge est appliquée par une balise <style> minimale : on ne peut pas la déclarer en
  // CSS parce qu'elle dépend d'une mesure, et on ne veut pas toucher au CSS du site ici.
  const style = document.createElement('style');
  style.textContent = 'section.acte{scroll-margin-top:var(--marge-ancre,78px)}';
  document.head.append(style);
})();
