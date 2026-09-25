// kraken.js — LA FIGURE DE PROUE : un kraken à tête de mort, en primitives.
//
// ⭐ POURQUOI CE FICHIER EXISTE, ET CE QU'IL A COÛTÉ.
// La canon de Néo (22/09/2026) dit : « la figure de proue est UN KRAKEN À TÊTE DE MORT — le
// crâne EST la tête du kraken, les tentacules en naissent, et les deux yeux du crâne sont ses
// deux yeux. » L'or ne sert qu'aux yeux et au pavillon.
//
// ⛔ TROIS TENTATIVES DE GÉNÉRATION ONT ÉCHOUÉ AVANT CE FICHIER (voir
//    `refs/NOTE-CANON-3D-2026-09-26.md`) : scène entière → bois, mer, ciel vert, crâne séparé ;
//    proue masquée « tête de kraken » → une bête, pas un crâne ; proue masquée « crâne » →
//    forme pâle mal raccordée. `RealVisXL` est un modèle photographique : il ne connaît pas
//    notre canon, et il rend une mer dès qu'on prononce « navire ».
//    ⇒ Un kraken à tête de mort se MODÉLISE. C'est ce que fait ce fichier, comme `armure.js`
//      fait l'armure — la même méthode, celle qui ne dépend d'aucun modèle.
//
// ⚠️ Aucune image, aucune texture, aucune dépendance : des géométries three.js et deux
//    matériaux. Le poids ajouté au site est de quelques kilo-octets de code.

export function construireKraken(THREE, or = 0xffe650) {
  const groupe = new THREE.Group();

  // le métal sombre de la coque, et l'os
  // ⚠️ L'OS EST SOMBRE, ET C'EST MESURÉ. Première version : `0xcfd6dd`, un gris clair. Sur la
  //    capture, le crâne est devenu L'OBJET LE PLUS LUMINEUX de la scène — une balle blanche
  //    qui domine le navire. La palette est NOIR · VERT · ARGENT : l'os est donc gris-argent
  //    SOMBRE, et c'est la faible lumière qui le révèle, pas sa couleur propre.
  const os = new THREE.MeshStandardMaterial({ color: 0x6e7885, metalness: 0.35, roughness: 0.55 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x141b26, metalness: 0.9, roughness: 0.42 });
  // ⭐ L'OR NE SERT QU'AUX YEUX (canon § « l'or ne sert qu'aux yeux et au pavillon »)
  const lueur = new THREE.MeshStandardMaterial({ color: or, emissive: new THREE.Color(or), emissiveIntensity: 2.4, roughness: 0.3 });

  // ---------------------------- le crâne EST la tête ----------------------------
  const crane = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, 1), os);
  crane.scale.set(1, 0.92, 1.12);           // un crâne est plus long que haut
  crane.position.set(0, 0, 0.06);
  groupe.add(crane);

  const machoire = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.42), os);
  machoire.position.set(0, -0.42, 0.2);
  machoire.rotation.x = 0.16;
  groupe.add(machoire);

  // la mâchoire inférieure, légèrement ouverte, et ses dents
  for (const s of [-1, 1]) {
    const rangee = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.05, 0.06), os);
    rangee.position.set(s * 0.13, -0.33, 0.38);
    groupe.add(rangee);
  }

  // ⭐ LES DEUX YEUX DU CRÂNE SONT SES DEUX YEUX — et ils sont en or.
  //    ⚠️ Deuxième correction de la journée : à `z 0.52`, les yeux étaient À L'INTÉRIEUR du
  //    crâne (rayon 0,52 × échelle 1,12 = 0,58) — invisibles, donc le canon n'était pas
  //    respecté à l'écran tout en l'étant dans le code. *Un élément juste placé au mauvais
  //    endroit est un élément absent.* Ils sortent maintenant devant l'orbite.
  for (const s of [-1, 1]) {
    const orbite = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), metal);
    orbite.position.set(s * 0.24, 0.08, 0.44);
    groupe.add(orbite);
    const oeil = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 10), lueur);
    oeil.position.set(s * 0.24, 0.07, 0.62);
    groupe.add(oeil);
  }

  // ------------------- les tentacules NAISSENT du crâne -------------------
  // ⭐ « les tentacules en naissent » : ils partent de la BASE du crâne, pas du navire.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const depart = new THREE.Vector3(Math.cos(a) * 0.30, -0.42, Math.sin(a) * 0.18);
    const courbe = new THREE.CatmullRomCurve3([
      depart,
      new THREE.Vector3(Math.cos(a) * 0.75, -0.78, Math.sin(a) * 0.45 + 0.15),
      new THREE.Vector3(Math.cos(a) * 1.05, -1.12, Math.sin(a) * 0.75 + 0.30),
      new THREE.Vector3(Math.cos(a) * 1.15, -1.50, Math.sin(a) * 0.95 + 0.45),
    ]);
    const tentacule = new THREE.Mesh(new THREE.TubeGeometry(courbe, 18, 0.075, 7, false), metal);
    groupe.add(tentacule);
    // la pointe s'affine : un petit cône, dans l'axe de la fin de la courbe
    const fin = courbe.getPointAt(1);
    const pointe = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.3, 7), metal);
    pointe.position.copy(fin);
    pointe.rotation.x = Math.PI;
    groupe.add(pointe);
  }

  // le kraken regarde DEVANT : c'est une figure de proue, pas un ornement
  groupe.rotation.y = Math.PI; // le nez vers -x, comme la coque
  return groupe;
}
