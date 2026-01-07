/**
 * useNodeShapes Composable
 * Gère les différentes formes 3D selon le type de node
 */

import * as THREE from 'three';
import { NODE_TYPES } from '../data/nodes.js';

/**
 * Configuration des formes par type de node
 */
export const SHAPE_CONFIG = {
  [NODE_TYPES.ARCHITECT]: {
    geometry: 'dodecahedron', // Forme complexe pour Neo
    scale: 1.2,
    detail: 1,
    wireframe: true,
    emissiveIntensity: 0.5
  },
  [NODE_TYPES.HEADQUARTERS]: {
    geometry: 'box', // Cube pour le bâtiment
    scale: 1.3,
    wireframe: true,
    emissiveIntensity: 0.4
  },
  [NODE_TYPES.AGENT_ORCHESTRATOR]: {
    geometry: 'octahedron', // Diamant pour JARVIS
    scale: 1.1,
    detail: 0,
    wireframe: true,
    emissiveIntensity: 0.6
  },
  [NODE_TYPES.AGENT_OPERATIONAL]: {
    geometry: 'icosahedron', // Sphère complexe pour agents
    scale: 1.0,
    detail: 1,
    wireframe: true,
    emissiveIntensity: 0.3
  },
  [NODE_TYPES.AGENT_DEVLAB]: {
    geometry: 'tetrahedron', // Pyramide pour Dev Lab
    scale: 0.9,
    detail: 0,
    wireframe: true,
    emissiveIntensity: 0.3
  },
  [NODE_TYPES.AGENT_FINANCE]: {
    geometry: 'cylinder', // Cylindre pour finance
    scale: 0.9,
    wireframe: true,
    emissiveIntensity: 0.3
  },
  [NODE_TYPES.PROJECT]: {
    geometry: 'torus', // Anneau pour projets
    scale: 1.0,
    wireframe: true,
    emissiveIntensity: 0.4
  },
  [NODE_TYPES.STACK]: {
    geometry: 'torusKnot', // Nœud complexe pour stacks
    scale: 0.6,
    wireframe: true,
    emissiveIntensity: 0.3
  },
  [NODE_TYPES.SERVICE]: {
    geometry: 'cone', // Cône pour services
    scale: 1.0,
    wireframe: true,
    emissiveIntensity: 0.4
  }
};

// Configuration par défaut
const DEFAULT_CONFIG = {
  geometry: 'icosahedron',
  scale: 1.0,
  detail: 1,
  wireframe: true,
  emissiveIntensity: 0.3
};

/**
 * Crée une géométrie selon le type spécifié
 * @param {string} geometryType - Type de géométrie
 * @param {number} scale - Échelle
 * @param {number} detail - Niveau de détail
 * @returns {THREE.BufferGeometry}
 */
export function createGeometry(geometryType, scale = 1, detail = 1) {
  switch (geometryType) {
    case 'box':
      return new THREE.BoxGeometry(scale, scale, scale);
    
    case 'sphere':
      return new THREE.SphereGeometry(scale * 0.5, 16, 16);
    
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(scale * 0.5, detail);
    
    case 'octahedron':
      return new THREE.OctahedronGeometry(scale * 0.5, detail);
    
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(scale * 0.5, detail);
    
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(scale * 0.5, detail);
    
    case 'torus':
      return new THREE.TorusGeometry(scale * 0.5, scale * 0.15, 8, 24);
    
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(scale * 0.3, scale * 0.1, 64, 8);
    
    case 'cone':
      return new THREE.ConeGeometry(scale * 0.4, scale * 0.8, 8);
    
    case 'cylinder':
      return new THREE.CylinderGeometry(scale * 0.3, scale * 0.3, scale * 0.8, 8);
    
    default:
      return new THREE.IcosahedronGeometry(scale * 0.5, detail);
  }
}

/**
 * Crée un mesh pour un node avec la forme appropriée
 * @param {Object} node - Données du node
 * @returns {THREE.Mesh}
 */
export function createNodeMesh(node) {
  // Récupérer la config selon le nodeType
  const config = SHAPE_CONFIG[node.nodeType] || DEFAULT_CONFIG;
  
  // Créer la géométrie
  const geometry = createGeometry(
    config.geometry,
    config.scale,
    config.detail || 1
  );
  
  // Créer le matériau
  const material = new THREE.MeshPhongMaterial({
    color: node.color,
    emissive: node.color,
    emissiveIntensity: config.emissiveIntensity,
    transparent: true,
    opacity: 0.8,
    wireframe: config.wireframe,
    side: THREE.DoubleSide
  });
  
  // Créer le mesh
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(node.position.x, node.position.y, node.position.z);
  mesh.userData = { 
    nodeId: node.id, 
    nodeType: node.nodeType,
    originalScale: config.scale
  };
  
  // Ajouter un core interne lumineux
  const coreGeometry = createGeometry(config.geometry, config.scale * 0.4, 0);
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: node.color,
    emissive: node.color,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  mesh.add(core);
  
  // Ajouter un anneau orbital
  const ringGeometry = new THREE.TorusGeometry(config.scale * 0.7, 0.02, 8, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: node.color,
    transparent: true,
    opacity: 0.5
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  ring.userData.isRing = true;
  mesh.add(ring);
  
  return mesh;
}

/**
 * Crée tous les meshes pour un ensemble de nodes
 * @param {Object[]} nodes - Tableau de nodes
 * @param {THREE.Scene} scene - Scène Three.js
 * @returns {THREE.Mesh[]} Tableau de meshes créés
 */
export function createAllNodeMeshes(nodes, scene) {
  const meshes = [];
  
  nodes.forEach((node, index) => {
    const mesh = createNodeMesh(node);
    mesh.userData.index = index;
    scene.add(mesh);
    meshes.push(mesh);
  });
  
  return meshes;
}

/**
 * Anime les nodes (rotation, pulsation, etc.)
 * @param {THREE.Mesh[]} meshes - Tableau de meshes
 * @param {Object[]} nodes - Données des nodes
 * @param {number} time - Temps actuel
 * @param {number} delta - Delta time
 */
export function animateNodes(meshes, nodes, time, delta) {
  meshes.forEach((mesh, i) => {
    // Rotation
    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.002;
    
    // Flottement vertical
    mesh.position.y = nodes[i].position.y + Math.sin(time * 0.001 + i) * 0.3;
    
    // Pulsation
    const scale = mesh.userData.originalScale * (1 + Math.sin(time * 0.002 + i * 0.5) * 0.1);
    mesh.scale.setScalar(scale);
    
    // Rotation de l'anneau orbital
    mesh.children.forEach(child => {
      if (child.userData?.isRing) {
        child.rotation.z += 0.01;
      }
    });
  });
}

export default {
  SHAPE_CONFIG,
  createGeometry,
  createNodeMesh,
  createAllNodeMeshes,
  animateNodes
};
