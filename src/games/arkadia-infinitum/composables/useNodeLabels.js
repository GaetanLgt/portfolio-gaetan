/**
 * useNodeLabels Composable
 * Gère les labels 3D flottants au-dessus des nodes
 */

import * as THREE from 'three';

/**
 * Crée un sprite de texte pour un node
 * @param {Object} node - Données du node
 * @returns {THREE.Sprite} Sprite avec le label
 */
export function createNodeLabel(node) {
  // Canvas pour le texte
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;
  
  // Fond semi-transparent
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  roundRect(context, 0, 0, canvas.width, canvas.height, 16);
  context.fill();
  
  // Bordure colorée
  context.strokeStyle = `#${node.color.toString(16).padStart(6, '0')}`;
  context.lineWidth = 3;
  roundRect(context, 0, 0, canvas.width, canvas.height, 16);
  context.stroke();
  
  // Icône
  context.font = '48px sans-serif';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.fillText(node.icon, 20, 64);
  
  // Nom
  context.font = 'bold 32px "Share Tech Mono", monospace';
  context.fillStyle = `#${node.color.toString(16).padStart(6, '0')}`;
  context.textAlign = 'left';
  context.fillText(node.name, 80, 50);
  
  // Type
  context.font = '18px "Share Tech Mono", monospace';
  context.fillStyle = 'rgba(255, 255, 255, 0.6)';
  context.fillText(node.type, 80, 85);
  
  // Texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  // Material avec transparence
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    depthTest: false,
    sizeAttenuation: true
  });
  
  // Sprite
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4, 1, 1);
  sprite.position.set(
    node.position.x,
    node.position.y + 2.5, // Au-dessus du node
    node.position.z
  );
  
  // Stocker les données pour l'animation
  sprite.userData = {
    nodeId: node.id,
    baseY: node.position.y + 2.5,
    visible: true
  };
  
  return sprite;
}

/**
 * Dessine un rectangle arrondi
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Met à jour les labels pour qu'ils regardent toujours la caméra
 * @param {THREE.Sprite[]} labels - Tableau de sprites labels
 * @param {THREE.Camera} camera - Caméra active
 * @param {number} time - Temps actuel pour l'animation
 */
export function updateLabels(labels, camera, time) {
  labels.forEach((label, index) => {
    // Les sprites regardent automatiquement la caméra
    // On ajoute juste un léger flottement
    const offset = Math.sin(time * 0.001 + index * 0.5) * 0.1;
    label.position.y = label.userData.baseY + offset;
    
    // Ajuster l'opacité en fonction de la distance
    const distance = camera.position.distanceTo(label.position);
    const maxDistance = 30;
    const minDistance = 5;
    
    if (distance < minDistance) {
      label.material.opacity = 0.3;
    } else if (distance > maxDistance) {
      label.material.opacity = 0.2;
    } else {
      label.material.opacity = 0.9;
    }
  });
}

/**
 * Crée tous les labels pour un ensemble de nodes
 * @param {Object[]} nodes - Tableau de nodes
 * @param {THREE.Scene} scene - Scène Three.js
 * @returns {THREE.Sprite[]} Tableau de sprites créés
 */
export function createAllLabels(nodes, scene) {
  const labels = [];
  
  nodes.forEach(node => {
    const label = createNodeLabel(node);
    scene.add(label);
    labels.push(label);
  });
  
  return labels;
}

/**
 * Affiche/masque les labels
 * @param {THREE.Sprite[]} labels - Tableau de sprites
 * @param {boolean} visible - État de visibilité
 */
export function setLabelsVisible(labels, visible) {
  labels.forEach(label => {
    label.visible = visible;
    label.userData.visible = visible;
  });
}

export default {
  createNodeLabel,
  createAllLabels,
  updateLabels,
  setLabelsVisible
};
