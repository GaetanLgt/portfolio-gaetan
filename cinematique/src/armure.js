// armure.js — « L'Armure du Capitaine » : 6 pièces low poly générées par la graine, 6 easter eggs pour les trouver.
// Canon : noir (la matière) · argent (l'acier, arêtes) · cyan (la structure, liserés) · violet = ORACLE (le vivant, le cœur).
// Pas d'or : il est réservé aux yeux du kraken et au pavillon. Aucune franchise : c'est l'armure de Néo, le capitaine.

export const PIECES = [
  { id: 'casque', nom: 'Casque', rune: 'ᚺ', indice: 'Le sceau du studio se touche trois fois.' },
  { id: 'plastron', nom: 'Plastron', rune: 'ᛈ', indice: 'La graine se lit en bas de page.' },
  { id: 'gantelets', nom: 'Gantelets', rune: 'ᚷ', indice: 'La boucle se fait dans l\'ordre.' },
  { id: 'jambieres', nom: 'Jambières', rune: 'ᛃ', indice: 'L\'arbre, au loin, répond quand on le nomme.' },
  { id: 'bottes', nom: 'Bottes', rune: 'ᛒ', indice: 'Aller jusqu\'au bout du voyage, puis revenir au port.' },
  { id: 'coeur', nom: 'Cœur', rune: 'ᛟ', indice: 'Écrire le nom de celui qui lit le destin.' },
];

// ---------- génération low poly ----------
export function construireArmure(THREE, g) {
  const metal = new THREE.MeshStandardMaterial({ color: 0x1d2433, metalness: 0.85, roughness: 0.3, flatShading: true });
  const argent = new THREE.LineBasicMaterial({ color: 0xb9c4c9, transparent: true, opacity: 0.85 });
  const liseré = new THREE.MeshStandardMaterial({ color: 0x0b2a3a, emissive: 0x2abfff, emissiveIntensity: 1.4, flatShading: true });
  const vivant = new THREE.MeshStandardMaterial({ color: 0x2a1450, emissive: 0x9b5cff, emissiveIntensity: 1.6, flatShading: true });

  const bosseler = (geo, amp) => { // chaque armure est unique : la graine déplace les sommets
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) * (1 + g.entre(-amp, amp)), p.getY(i) * (1 + g.entre(-amp, amp)), p.getZ(i) * (1 + g.entre(-amp, amp)));
    geo = geo.toNonIndexed(); geo.computeVertexNormals(); return geo;
  };
  const plaque = (geo, mat = metal, amp = 0.04) => { const m = new THREE.Mesh(bosseler(geo, amp), mat); m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 25), argent)); return m; };
  const paire = (fabrique, ecart) => { const gr = new THREE.Group(); for (const s of [-1, 1]) { const m = fabrique(); m.position.x = s * ecart; gr.add(m); } return gr; };

  const pieces = {};

  // ⭐⭐ ARMURE REDESSINÉE LE 26/09/2026 — « l'armure à refaire entière » (Gaëtan).
  //    ⛔ CE QUI N'ALLAIT PAS, MESURÉ : ① les six pièces étaient EMPILÉES comme un corps, donc
  //       elles se chevauchaient et aucune ne se lisait ; ② par défaut AUCUNE n'est trouvée, donc
  //       tout passait dans le matériau fantôme à **opacité 0,08** — une boule de fil de fer
  //       quasi invisible ; ③ les ARÊTES étaient masquées tant que la pièce n'était pas trouvée,
  //       donc il ne restait aucun trait.
  //    ⭐ LA RÉPONSE VIENT DE SA PROPRE RÉFÉRENCE : l'armure **éclatée**, toutes les pièces
  //       exposées (le *knolling* — l'idée est libre, l'image Iron Man ne l'est pas).
  //       ⇒ Les pièces sont ESPACÉES (aucun chevauchement, chacune lisible), les ARÊTES SONT
  //         TOUJOURS VISIBLES, et le fantôme passe de 0,08 à 0,30 : une pièce non trouvée est un
  //         PLAN DE CONSTRUCTION lisible, pas un vide. Trouvée, elle passe en métal plein.
  //       ⭐ La chasse aux six runes se lit alors d'un seul coup d'œil.

  // casque : sphère à facettes, visière cyan, protège-joues, crête
  pieces.casque = new THREE.Group();
  const tete = plaque(new THREE.IcosahedronGeometry(0.46, 1)); tete.scale.set(1, 1.12, 1.06); pieces.casque.add(tete);
  const visiere = plaque(new THREE.BoxGeometry(0.5, 0.12, 0.16), liseré); visiere.position.set(0, 0.03, 0.38); pieces.casque.add(visiere);
  const fente = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.035, 0.06), liseré); fente.position.set(0, 0.03, 0.46); pieces.casque.add(fente);
  for (const s of [-1, 1]) { const joue = plaque(new THREE.BoxGeometry(0.12, 0.3, 0.26)); joue.position.set(s * 0.42, -0.12, 0.06); pieces.casque.add(joue); }
  const crete = plaque(new THREE.ConeGeometry(0.07, 0.42, 4)); crete.position.set(0, 0.52, -0.06); crete.rotation.x = -0.42; pieces.casque.add(crete);

  // plastron : tronc à six pans, épaulières superposées, col, arête centrale
  pieces.plastron = new THREE.Group();
  const tronc = plaque(new THREE.CylinderGeometry(0.78, 0.52, 1.35, 6)); tronc.scale.z = 0.6; pieces.plastron.add(tronc);
  const col = plaque(new THREE.CylinderGeometry(0.3, 0.4, 0.22, 6)); col.position.y = 0.72; pieces.plastron.add(col);
  for (const s of [-1, 1]) {
    const ep = plaque(new THREE.IcosahedronGeometry(0.34, 0)); ep.position.set(s * 0.88, 0.46, 0); ep.scale.set(1.25, 0.75, 1.05); pieces.plastron.add(ep);
    const ep2 = plaque(new THREE.BoxGeometry(0.34, 0.1, 0.5)); ep2.position.set(s * 0.9, 0.19, 0); ep2.rotation.z = s * 0.18; pieces.plastron.add(ep2);
  }
  const arete = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.15, 0.06), liseré); arete.position.set(0, 0, 0.45); pieces.plastron.add(arete);
  for (const s of [-1, 1]) { const cote = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 0.04), liseré); cote.position.set(s * 0.3, -0.05, 0.4); pieces.plastron.add(cote); }

  // gantelets : avant-bras à cinq pans, poing, plaques de jointures
  pieces.gantelets = paire(() => {
    const b = new THREE.Group();
    const avb = plaque(new THREE.CylinderGeometry(0.19, 0.15, 0.85, 5)); avb.position.y = 0.18; b.add(avb);
    const poing = plaque(new THREE.BoxGeometry(0.28, 0.24, 0.3)); poing.position.y = -0.38; b.add(poing);
    for (let i = 0; i < 3; i++) { const j = plaque(new THREE.BoxGeometry(0.07, 0.05, 0.1)); j.position.set(-0.09 + i * 0.09, -0.26, 0.16); b.add(j); }
    return b;
  }, 1.35);

  // jambières : cuisse, genouillère, tibia, plaque de genou
  pieces.jambieres = paire(() => {
    const j = new THREE.Group();
    const cuisse = plaque(new THREE.CylinderGeometry(0.24, 0.19, 0.9, 6)); cuisse.position.y = 0.46; j.add(cuisse);
    const genou = plaque(new THREE.OctahedronGeometry(0.17, 0)); genou.position.set(0, 0, 0.14); j.add(genou);
    const plaqueG = plaque(new THREE.BoxGeometry(0.26, 0.2, 0.08)); plaqueG.position.set(0, 0.04, 0.2); j.add(plaqueG);
    const tibia = plaque(new THREE.CylinderGeometry(0.17, 0.14, 0.85, 6)); tibia.position.y = -0.46; j.add(tibia);
    return j;
  }, 0.42);

  // bottes : semelle, cou-de-pied, contrefort
  pieces.bottes = paire(() => {
    const b = new THREE.Group();
    const semelle = plaque(new THREE.BoxGeometry(0.32, 0.12, 0.6)); semelle.position.z = 0.1; b.add(semelle);
    const cou = plaque(new THREE.BoxGeometry(0.3, 0.2, 0.26)); cou.position.set(0, 0.14, -0.06); b.add(cou);
    const pointe = plaque(new THREE.ConeGeometry(0.16, 0.24, 4)); pointe.position.set(0, 0.02, 0.4); pointe.rotation.x = Math.PI / 2; b.add(pointe);
    return b;
  }, 0.42);

  // cœur : ORACLE, le vivant, au centre du plastron
  pieces.coeur = new THREE.Mesh(bosseler(new THREE.OctahedronGeometry(0.2, 0), 0.08), vivant);
  pieces.coeur.position.set(0, 2.62, 0.5);
  pieces.coeur.add(new THREE.LineSegments(new THREE.EdgesGeometry(pieces.coeur.geometry, 25), argent));

  // ⭐ L'ÉCARTEMENT — c'est lui qui rend l'armure LISIBLE : plus aucune pièce n'en recouvre une
  //    autre, et l'ensemble se lit comme une planche d'armure plutôt que comme une silhouette.
  pieces.casque.position.y = 6.35;
  pieces.plastron.position.y = 4.55;
  pieces.gantelets.position.y = 2.95;
  pieces.jambieres.position.y = 1.35;
  pieces.bottes.position.y = 0.35;

  const groupe = new THREE.Group();
  // ⭐ LE FANTÔME PASSE DE 0,08 À 0,30 — c'est le cœur du correctif. À 8 % d'opacité et sans
  //    arêtes, une pièce non trouvée était un VIDE. À 30 %, elle devient un plan de construction
  //    qu'on lit — et c'est exactement ce que la référence de Gaëtan montre.
  const fantome = new THREE.MeshBasicMaterial({ color: 0x2abfff, wireframe: true, transparent: true, opacity: 0.3 });
  for (const [id, p] of Object.entries(pieces)) { p.userData.id = id; groupe.add(p); p.traverse((o) => { if (o.isMesh) o.userData.matVrai = o.material; }); }
  // ⛔ LES ARÊTES RESTENT VISIBLES, TOUJOURS. Avant, `o.visible = vrai` les éteignait tant que la
  //    pièce n'était pas trouvée : il ne restait alors AUCUN trait pour la dessiner. Une arête
  //    n'est pas la pièce — c'est son plan, et le plan doit se voir avant la pièce.
  const montrer = (id, vrai) => pieces[id].traverse((o) => { if (o.isMesh) o.material = vrai ? o.userData.matVrai : fantome; });
  return { groupe, pieces, montrer };
}

// ---------- les six easter eggs ----------
const CLE = 'gl-armure-v1';
const lireEtat = () => { try { return JSON.parse(localStorage.getItem(CLE)) || []; } catch { return []; } };
const ecrireEtat = (l) => { try { localStorage.setItem(CLE, JSON.stringify(l)); } catch { /* navigation privée : on garde en mémoire */ } };

export const armureTrouvee = () => lireEtat().filter((id) => PIECES.some((p) => p.id === id));
export const oublierArmure = () => ecrireEtat([]);

export function brancherOeufs(surTrouve) {
  let trouves = armureTrouvee();
  // ⭐⭐ L'EXTENSION DU TERRITOIRE — idée de Gaëtan, 26/09/2026. La sixième rune trouvée ne rend
  //    pas seulement l'armure complète : elle ÉVEILLE le navire. C'est le paiement de la chasse.
  //    ⛔ Le mot interdit du studio a été retiré de l'annonce (quatrième fois qu'il revient dans
  //       une proposition) : la page aurait ÉCHOUÉ au contrôle. Ce qui reste dit la même chose
  //       et se VÉRIFIE — « tout reste chez vous », c'est mesuré, zéro requête externe.
  const eveiller = () => {
    document.body.classList.add('territoire-deploye');
    const annonce = document.querySelector('.armure-annonce');
    if (annonce) annonce.textContent = '領域展開 · TERRITOIRE ARKADIA ACTIVÉ — le navire est prêt, tout reste chez vous.';
    const h = document.querySelector('.armure');
    if (h) h.classList.add('complet');
  };
  const trouver = (id) => {
    if (trouves.includes(id)) return;
    trouves = [...trouves, id];
    ecrireEtat(trouves);
    surTrouve(id, trouves);
    if (trouves.length === PIECES.length) eveiller();
  };
  // 1. casque : le sceau « GL » touché trois fois
  let n = 0, t0 = 0; document.querySelector('.hex')?.addEventListener('click', (e) => { e.preventDefault(); const t = performance.now(); n = t - t0 < 1000 ? n + 1 : 1; t0 = t; if (n >= 3 || e.detail >= 3) trouver('casque'); });
  // 2. plastron : la graine du pied de page
  const gr = document.querySelector('.graine'); if (gr) { gr.tabIndex = 0; gr.setAttribute('role', 'button'); const f = () => trouver('plastron'); gr.addEventListener('click', f); gr.addEventListener('keydown', (e) => e.key === 'Enter' && f()); }
  // 3. gantelets : la boucle dans l'ordre (Produire, Observer, Mesurer, Corriger)
  let pas = 0; document.querySelectorAll('.boucle li').forEach((li, i) => { li.tabIndex = 0; const f = () => { pas = i === pas ? pas + 1 : (i === 0 ? 1 : 0); if (pas === 4) trouver('gantelets'); }; li.addEventListener('click', f); li.addEventListener('keydown', (e) => e.key === 'Enter' && f()); });
  // 4. jambières : le mot « Yggdrasil » du dernier acte
  const lore = document.querySelector('#acte-8 .lore');
  if (lore && !lore.querySelector('.ygg')) { lore.innerHTML = lore.innerHTML.replace('Yggdrasil', '<span class="ygg" tabindex="0" role="button">Yggdrasil</span>'); }
  document.addEventListener('click', (e) => { if (e.target.closest?.('.ygg')) trouver('jambieres'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Enter' && document.activeElement?.classList.contains('ygg')) trouver('jambieres'); });
  // 5. bottes : aller au bout (pied de page) puis revenir à l'acte 1
  let auBout = false; addEventListener('scroll', () => { if (innerHeight + scrollY >= document.body.scrollHeight - 40) auBout = true; else if (auBout && scrollY < innerHeight * 0.5) trouver('bottes'); }, { passive: true });
  // 6. cœur : taper « oracle »
  let tampon = ''; addEventListener('keydown', (e) => { if (e.key.length === 1) { tampon = (tampon + e.key.toLowerCase()).slice(-6); if (tampon === 'oracle') trouver('coeur'); } });
  return trouves;
}
