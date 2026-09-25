// graine.mjs — GL Digital Lab · site cinématique · 25/09/2026
// UNE graine décide de tout ce qui est aléatoire dans le site, et seulement de ça.
// Même graine => même site, octet pour octet. Aucune dépendance. Node et navigateur.

// Hachage d'une étiquette en 32 bits (FNV-1a) : chaque usage a sa propre sous-graine.
export function hacher(texte) {
  let h = 0x811c9dc5;
  for (const c of String(texte)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

// Générateur mulberry32 : rapide, déterministe, suffisant pour du visuel (PAS pour de la sécurité).
export function generateur(seed) {
  let a = seed >>> 0;
  const suivant = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    reel: suivant,                                      // [0,1[
    entre: (min, max) => min + (max - min) * suivant(), // [min,max[
    entier: (min, max) => min + Math.floor((max - min + 1) * suivant()), // [min,max]
    choisir: (liste) => liste[Math.floor(suivant() * liste.length)],
    melanger: (liste) => { const l = [...liste]; for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(suivant() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; } return l; },
  };
}

// La graine maîtresse et ses sous-graines nommées. Changer l'étiquette = changer un seul usage.
export function creerGraine(maitresse = 42) {
  const pour = (etiquette) => generateur(hacher(`${maitresse}:${etiquette}`));
  const graineComfy = (etiquette) => hacher(`${maitresse}:comfy:${etiquette}`) % 2147483647; // borne ComfyUI
  return { maitresse, pour, graineComfy };
}

// Palette canon : la graine peut NUANCER, jamais sortir du canon (et jamais vers le vert).
export const CANON = { fond: '#080b14', fond2: '#0d111f', cyan: '#2abfff', jaune: '#ffe650', oracle: '#9b5cff' };
export function nuance(hex, g, ampleur = 0.04) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * (1 + g.entre(-ampleur, ampleur)))));
  let r = f(n >> 16), v = f((n >> 8) & 255), b = f(n & 255);
  if (v > r && v > b) v = Math.max(r, b);               // garde-fou : jamais une dominante verte
  return '#' + [r, v, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}
