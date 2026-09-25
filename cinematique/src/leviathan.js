// leviathan.js — LE LÉVIATHAN, modélisé en primitives.
//
// ⭐ POURQUOI ICI ET PAS AILLEURS. Le canon (brief v2 §2) dit : « Léviathan devant la proue et
// au loin ». Dans `main.js` il n'était qu'**une sphère de 26 unités** — un placeholder, pas une
// créature. Et les trois tentatives de génération d'image ont montré que `RealVisXL` rend un
// dinosaure terrestre avec des montagnes dès qu'on prononce « léviathan » (voir
// `refs/NOTE-CANON-3D-2026-09-26.md`). ⇒ On MODÉLISE, comme le kraken et comme l'armure.
//
// Palette : NOIR · VERT · ARGENT. La créature est sombre ; ce qui la révèle, ce sont ses
// **veines bioluminescentes vertes** — la seule lumière est celle du navire, et celle-ci en fait
// partie. Aucune image, aucune texture, aucune dépendance.

export function construireLeviathan(THREE, vert = 0x2ce39b) {
  const groupe = new THREE.Group();

  const chair = new THREE.MeshStandardMaterial({ color: 0x0e1726, metalness: 0.55, roughness: 0.62 });
  const veine = new THREE.MeshStandardMaterial({ color: vert, emissive: new THREE.Color(vert), emissiveIntensity: 2.6, roughness: 0.35 });

  // ------------------------- le corps : une courbe, pas un bloc -------------------------
  // ⭐ Un léviathan de l'espace est un SERPENT : trois ondulations, une queue qui s'effile.
  const courbe = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.0, -0.6, 0.0),
    new THREE.Vector3(-3.2, 0.5, 0.9),
    new THREE.Vector3(-1.4, -0.4, -0.5),
    new THREE.Vector3(0.4, 0.7, 0.6),
    new THREE.Vector3(2.2, -0.3, -0.2),
    new THREE.Vector3(3.6, 0.4, 0.4),
    new THREE.Vector3(4.8, 0.0, 0.0),
  ]);
  const corps = new THREE.Mesh(new THREE.TubeGeometry(courbe, 90, 0.42, 12, false), chair);
  corps.scale.set(1, 1, 1);
  groupe.add(corps);

  // la queue s'effile : un cône dans l'axe de la fin de la courbe
  const bout = courbe.getPointAt(0);
  const queue = new THREE.Mesh(new THREE.ConeGeometry(0.40, 1.6, 10), chair);
  queue.position.copy(bout);
  queue.rotation.z = Math.PI / 2;
  groupe.add(queue);

  // ------------------------------- la tête -------------------------------
  const tete = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 1), chair);
  tete.scale.set(1.5, 0.85, 0.9);
  tete.position.set(5.35, 0.0, 0.0);
  groupe.add(tete);

  // la gueule, entrouverte
  const gueule = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.16, 0.5), chair);
  gueule.position.set(5.9, -0.22, 0.0);
  gueule.rotation.z = 0.12;
  groupe.add(gueule);

  // ⭐ les deux yeux : verts. Le vert dit la vie — et ici, la créature est vivante.
  for (const s of [-1, 1]) {
    const oeil = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), veine);
    oeil.position.set(5.5, 0.18, s * 0.30);
    groupe.add(oeil);
  }

  // ------------------- les veines bioluminescentes, le long du dos -------------------
  const n = 46;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const p = courbe.getPointAt(t);
    for (const s of [-1, 1]) {
      const point = new THREE.Mesh(new THREE.SphereGeometry(0.055 + 0.02 * Math.sin(t * 12), 6, 5), veine);
      point.position.set(p.x, p.y + 0.30, p.z + s * 0.28);
      groupe.add(point);
    }
  }

  return groupe;
}
