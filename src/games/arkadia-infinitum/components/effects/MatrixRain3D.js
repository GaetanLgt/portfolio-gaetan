/**
 * MatrixRain3D.js
 * Système de pluie 3D style Matrix Awakens
 * Particules volumétriques avec splash au sol et reflets
 */

import * as THREE from 'three';

export class MatrixRain3D {
  constructor(scene, options = {}) {
    this.scene = scene;
    
    // Configuration
    this.config = {
      dropCount: options.dropCount || 15000,
      areaSize: options.areaSize || 100,
      dropSpeed: options.dropSpeed || 25,
      dropLength: options.dropLength || 0.8,
      color: options.color || 0x00ff41,
      secondaryColor: options.secondaryColor || 0x00ffff,
      groundLevel: options.groundLevel || 0,
      splashEnabled: options.splashEnabled !== false,
      glowIntensity: options.glowIntensity || 0.6,
      windStrength: options.windStrength || 0.5,
      ...options
    };

    this.rainDrops = null;
    this.splashParticles = [];
    this.splashPool = [];
    this.time = 0;
    this.windOffset = { x: 0, z: 0 };
    
    this.init();
  }

  init() {
    this.createRainDrops();
    this.createSplashPool();
    this.createGroundReflection();
  }

  createRainDrops() {
    // Géométrie des gouttes (lignes verticales)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.dropCount * 6); // 2 points par ligne
    const colors = new Float32Array(this.config.dropCount * 6);
    const velocities = new Float32Array(this.config.dropCount * 3);
    const randomOffsets = new Float32Array(this.config.dropCount);

    const color = new THREE.Color(this.config.color);
    const colorAlt = new THREE.Color(this.config.secondaryColor);

    for (let i = 0; i < this.config.dropCount; i++) {
      const i6 = i * 6;
      const i3 = i * 3;

      // Position de départ aléatoire
      const x = (Math.random() - 0.5) * this.config.areaSize;
      const y = Math.random() * 50 + 10;
      const z = (Math.random() - 0.5) * this.config.areaSize;

      // Point haut de la goutte
      positions[i6] = x;
      positions[i6 + 1] = y;
      positions[i6 + 2] = z;

      // Point bas de la goutte (crée la traînée)
      positions[i6 + 3] = x;
      positions[i6 + 4] = y + this.config.dropLength;
      positions[i6 + 5] = z;

      // Couleur avec variation
      const useAltColor = Math.random() > 0.85;
      const c = useAltColor ? colorAlt : color;
      const intensity = 0.5 + Math.random() * 0.5;

      // Point haut plus lumineux
      colors[i6] = c.r * intensity;
      colors[i6 + 1] = c.g * intensity;
      colors[i6 + 2] = c.b * intensity;

      // Point bas plus sombre (effet de traînée)
      colors[i6 + 3] = c.r * intensity * 0.3;
      colors[i6 + 4] = c.g * intensity * 0.3;
      colors[i6 + 5] = c.b * intensity * 0.3;

      // Vélocité individuelle
      velocities[i3] = (Math.random() - 0.5) * 0.5; // Légère dérive X
      velocities[i3 + 1] = this.config.dropSpeed * (0.8 + Math.random() * 0.4);
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.5; // Légère dérive Z

      // Offset aléatoire pour variation
      randomOffsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Stocker les données pour l'animation
    this.velocities = velocities;
    this.randomOffsets = randomOffsets;
    this.initialPositions = positions.slice();

    // Material avec glow
    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.rainDrops = new THREE.LineSegments(geometry, material);
    this.rainDrops.frustumCulled = false;
    this.scene.add(this.rainDrops);
  }

  createSplashPool() {
    // Pool de particules de splash réutilisables
    const splashGeometry = new THREE.CircleGeometry(0.1, 8);
    const splashMaterial = new THREE.MeshBasicMaterial({
      color: this.config.color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    for (let i = 0; i < 200; i++) {
      const splash = new THREE.Mesh(splashGeometry, splashMaterial.clone());
      splash.rotation.x = -Math.PI / 2;
      splash.position.y = this.config.groundLevel + 0.01;
      splash.visible = false;
      splash.userData = {
        active: false,
        life: 0,
        maxLife: 0.5,
        scale: 1
      };
      this.splashPool.push(splash);
      this.scene.add(splash);
    }
  }

  createGroundReflection() {
    // Plan réfléchissant pour simuler le sol mouillé
    const reflectionGeometry = new THREE.PlaneGeometry(
      this.config.areaSize,
      this.config.areaSize
    );
    
    const reflectionMaterial = new THREE.MeshStandardMaterial({
      color: 0x001100,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.3,
      envMapIntensity: 0.5
    });

    this.groundReflection = new THREE.Mesh(reflectionGeometry, reflectionMaterial);
    this.groundReflection.rotation.x = -Math.PI / 2;
    this.groundReflection.position.y = this.config.groundLevel - 0.1;
    this.groundReflection.receiveShadow = true;
    // this.scene.add(this.groundReflection); // Optionnel, peut interférer avec la grid existante
  }

  spawnSplash(x, z) {
    if (!this.config.splashEnabled) return;

    // Trouver une particule inactive
    const splash = this.splashPool.find(s => !s.userData.active);
    if (!splash) return;

    splash.position.x = x;
    splash.position.z = z;
    splash.scale.set(0.1, 0.1, 0.1);
    splash.material.opacity = 0.8;
    splash.visible = true;
    splash.userData.active = true;
    splash.userData.life = 0;
    splash.userData.maxLife = 0.3 + Math.random() * 0.3;
    splash.userData.scale = 0.5 + Math.random() * 1;
  }

  update(delta, cameraPosition) {
    if (!this.rainDrops) return;

    this.time += delta;

    // Effet de vent dynamique
    this.windOffset.x = Math.sin(this.time * 0.5) * this.config.windStrength;
    this.windOffset.z = Math.cos(this.time * 0.3) * this.config.windStrength * 0.5;

    const positions = this.rainDrops.geometry.attributes.position.array;
    const halfArea = this.config.areaSize / 2;

    for (let i = 0; i < this.config.dropCount; i++) {
      const i6 = i * 6;
      const i3 = i * 3;

      // Vélocité avec vent
      const vx = this.velocities[i3] + this.windOffset.x;
      const vy = this.velocities[i3 + 1];
      const vz = this.velocities[i3 + 2] + this.windOffset.z;

      // Mise à jour position (point haut)
      positions[i6] += vx * delta;
      positions[i6 + 1] -= vy * delta;
      positions[i6 + 2] += vz * delta;

      // Mise à jour position (point bas)
      positions[i6 + 3] += vx * delta;
      positions[i6 + 4] -= vy * delta;
      positions[i6 + 5] += vz * delta;

      // Reset quand la goutte touche le sol
      if (positions[i6 + 1] < this.config.groundLevel) {
        // Spawn splash
        if (Math.random() > 0.7) {
          this.spawnSplash(positions[i6], positions[i6 + 2]);
        }

        // Repositionner en haut, centré sur la caméra
        const newX = cameraPosition.x + (Math.random() - 0.5) * this.config.areaSize;
        const newZ = cameraPosition.z + (Math.random() - 0.5) * this.config.areaSize;
        const newY = 40 + Math.random() * 20;

        positions[i6] = newX;
        positions[i6 + 1] = newY;
        positions[i6 + 2] = newZ;
        positions[i6 + 3] = newX;
        positions[i6 + 4] = newY + this.config.dropLength;
        positions[i6 + 5] = newZ;
      }

      // Wrap around si trop loin de la caméra
      if (Math.abs(positions[i6] - cameraPosition.x) > halfArea) {
        positions[i6] = cameraPosition.x + (Math.random() - 0.5) * this.config.areaSize;
        positions[i6 + 3] = positions[i6];
      }
      if (Math.abs(positions[i6 + 2] - cameraPosition.z) > halfArea) {
        positions[i6 + 2] = cameraPosition.z + (Math.random() - 0.5) * this.config.areaSize;
        positions[i6 + 5] = positions[i6 + 2];
      }
    }

    this.rainDrops.geometry.attributes.position.needsUpdate = true;

    // Update splashes
    this.updateSplashes(delta);
  }

  updateSplashes(delta) {
    for (const splash of this.splashPool) {
      if (!splash.userData.active) continue;

      splash.userData.life += delta;
      const progress = splash.userData.life / splash.userData.maxLife;

      if (progress >= 1) {
        splash.visible = false;
        splash.userData.active = false;
        continue;
      }

      // Animation de ripple
      const scale = splash.userData.scale * (0.5 + progress * 2);
      splash.scale.set(scale, scale, scale);
      splash.material.opacity = 0.8 * (1 - progress);
    }
  }

  // Setters pour contrôle dynamique
  setIntensity(intensity) {
    // 0 à 1, modifie l'opacité et la vitesse
    if (this.rainDrops) {
      this.rainDrops.material.opacity = 0.3 + intensity * 0.5;
    }
    this.config.dropSpeed = 15 + intensity * 20;
  }

  setColor(color) {
    this.config.color = color;
    // Mettre à jour les couleurs des gouttes nécessiterait de recréer le buffer
  }

  setWindStrength(strength) {
    this.config.windStrength = strength;
  }

  toggleSplashes(enabled) {
    this.config.splashEnabled = enabled;
  }

  dispose() {
    if (this.rainDrops) {
      this.rainDrops.geometry.dispose();
      this.rainDrops.material.dispose();
      this.scene.remove(this.rainDrops);
    }

    for (const splash of this.splashPool) {
      splash.geometry.dispose();
      splash.material.dispose();
      this.scene.remove(splash);
    }

    if (this.groundReflection) {
      this.groundReflection.geometry.dispose();
      this.groundReflection.material.dispose();
      this.scene.remove(this.groundReflection);
    }
  }
}

export default MatrixRain3D;
