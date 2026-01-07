/**
 * CyberpunkSkyline.js
 * Skyline urbain style Matrix Awakens
 * Buildings procéduraux avec fenêtres émissives et néons
 */

import * as THREE from 'three';

export class CyberpunkSkyline {
  constructor(scene, options = {}) {
    this.scene = scene;
    
    this.config = {
      buildingCount: options.buildingCount || 80,
      radius: options.radius || 150,
      minHeight: options.minHeight || 20,
      maxHeight: options.maxHeight || 80,
      baseColor: options.baseColor || 0x0a0a0a,
      windowColor: options.windowColor || 0x00ff41,
      accentColor: options.accentColor || 0x00ffff,
      neonColors: options.neonColors || [0xff00ff, 0x00ffff, 0xff6600, 0x00ff00],
      fogColor: options.fogColor || 0x001108,
      density: options.density || 0.8,
      ...options
    };

    this.buildings = [];
    this.neonLights = [];
    this.windowLights = [];
    this.time = 0;

    this.init();
  }

  init() {
    this.createSkybox();
    this.createBuildings();
    this.createNeonSigns();
    this.createAtmosphericLights();
  }

  createSkybox() {
    // Gradient sky avec lueur verte à l'horizon
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Gradient vertical
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.4, '#000805');
    gradient.addColorStop(0.7, '#001a0d');
    gradient.addColorStop(0.9, '#002211');
    gradient.addColorStop(1, '#003318');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Ajouter des "étoiles" / points lumineux
    ctx.fillStyle = '#00ff41';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 300;
      const size = Math.random() * 2;
      ctx.globalAlpha = Math.random() * 0.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    
    // Créer une grande sphère pour le ciel
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      fog: false
    });

    this.sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(this.sky);
  }

  createBuildings() {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = 'cyberpunkSkyline';

    for (let i = 0; i < this.config.buildingCount; i++) {
      const building = this.createBuilding(i);
      if (building) {
        buildingGroup.add(building);
        this.buildings.push(building);
      }
    }

    this.scene.add(buildingGroup);
    this.buildingGroup = buildingGroup;
  }

  createBuilding(index) {
    // Position en cercle autour de la scène
    const angle = (index / this.config.buildingCount) * Math.PI * 2;
    const radiusVariation = this.config.radius * (0.8 + Math.random() * 0.4);
    
    const x = Math.cos(angle) * radiusVariation;
    const z = Math.sin(angle) * radiusVariation;

    // Dimensions aléatoires
    const width = 5 + Math.random() * 15;
    const depth = 5 + Math.random() * 15;
    const height = this.config.minHeight + Math.random() * (this.config.maxHeight - this.config.minHeight);

    // Skip certains pour créer des gaps
    if (Math.random() > this.config.density) return null;

    // Géométrie du building
    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    // Material de base sombre
    const material = new THREE.MeshStandardMaterial({
      color: this.config.baseColor,
      metalness: 0.8,
      roughness: 0.4,
      emissive: 0x000500,
      emissiveIntensity: 0.1
    });

    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    building.castShadow = true;
    building.receiveShadow = true;

    // Ajouter des fenêtres émissives
    this.addWindows(building, width, height, depth);

    // Parfois ajouter une antenne ou structure sur le toit
    if (Math.random() > 0.7) {
      this.addRooftopStructure(building, width, depth, height);
    }

    return building;
  }

  addWindows(building, width, height, depth) {
    // Créer une grille de fenêtres sur chaque face
    const windowRows = Math.floor(height / 3);
    const windowCols = Math.floor(width / 2);

    const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
    
    // Face avant et arrière
    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        // Certaines fenêtres allumées aléatoirement
        if (Math.random() > 0.4) {
          const isLit = Math.random() > 0.3;
          const windowColor = isLit 
            ? (Math.random() > 0.8 ? this.config.accentColor : this.config.windowColor)
            : 0x111111;

          const windowMaterial = new THREE.MeshBasicMaterial({
            color: windowColor,
            transparent: true,
            opacity: isLit ? 0.9 : 0.3,
            side: THREE.DoubleSide
          });

          // Face avant
          const windowFront = new THREE.Mesh(windowGeometry, windowMaterial);
          windowFront.position.set(
            -width / 2 + col * 2 + 1.5,
            -height / 2 + row * 3 + 2,
            depth / 2 + 0.01
          );
          building.add(windowFront);

          // Face arrière
          const windowBack = windowFront.clone();
          windowBack.position.z = -depth / 2 - 0.01;
          windowBack.rotation.y = Math.PI;
          building.add(windowBack);

          if (isLit) {
            this.windowLights.push({
              mesh: windowFront,
              originalOpacity: windowMaterial.opacity,
              flickerSpeed: Math.random() * 2
            });
          }
        }
      }
    }
  }

  addRooftopStructure(building, width, depth, height) {
    // Antenne
    const antennaHeight = 5 + Math.random() * 10;
    const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.2, antennaHeight, 8);
    const antennaMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.9,
      roughness: 0.3
    });

    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
    antenna.position.y = height / 2 + antennaHeight / 2;
    building.add(antenna);

    // Light rouge clignotante au sommet
    const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const lightMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.9
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.y = height / 2 + antennaHeight + 0.3;
    building.add(light);

    // Point light pour le glow
    const pointLight = new THREE.PointLight(0xff0000, 0.5, 10);
    pointLight.position.copy(light.position);
    building.add(pointLight);

    this.neonLights.push({
      mesh: light,
      light: pointLight,
      type: 'blink',
      speed: 1 + Math.random() * 2
    });
  }

  createNeonSigns() {
    // Quelques enseignes néon sur certains buildings
    const neonCount = Math.floor(this.config.buildingCount * 0.15);

    for (let i = 0; i < neonCount; i++) {
      const buildingIndex = Math.floor(Math.random() * this.buildings.length);
      const building = this.buildings[buildingIndex];
      if (!building) continue;

      this.addNeonSign(building);
    }
  }

  addNeonSign(building) {
    const color = this.config.neonColors[Math.floor(Math.random() * this.config.neonColors.length)];
    
    // Barre néon horizontale
    const width = 3 + Math.random() * 5;
    const geometry = new THREE.BoxGeometry(width, 0.3, 0.1);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.95
    });

    const neon = new THREE.Mesh(geometry, material);
    
    // Position sur une face du building
    const buildingBox = new THREE.Box3().setFromObject(building);
    const buildingSize = buildingBox.getSize(new THREE.Vector3());
    
    neon.position.set(
      (Math.random() - 0.5) * buildingSize.x * 0.5,
      (Math.random() - 0.3) * buildingSize.y * 0.3,
      buildingSize.z / 2 + 0.2
    );

    building.add(neon);

    // Glow effect avec sprite
    const glowTexture = this.createGlowTexture(color);
    const glowMaterial = new THREE.SpriteMaterial({
      map: glowTexture,
      color: color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(width * 2, 3, 1);
    glow.position.copy(neon.position);
    glow.position.z += 0.5;
    building.add(glow);

    this.neonLights.push({
      mesh: neon,
      glow: glow,
      type: 'pulse',
      speed: 0.5 + Math.random(),
      color: color
    });
  }

  createGlowTexture(color) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    
    const c = new THREE.Color(color);
    gradient.addColorStop(0, `rgba(${c.r * 255}, ${c.g * 255}, ${c.b * 255}, 1)`);
    gradient.addColorStop(0.4, `rgba(${c.r * 255}, ${c.g * 255}, ${c.b * 255}, 0.5)`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  createAtmosphericLights() {
    // Lumières volumétriques dans le ciel
    const atmosphereGroup = new THREE.Group();

    // Quelques spotlights qui balaient le ciel
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const x = Math.cos(angle) * this.config.radius * 0.8;
      const z = Math.sin(angle) * this.config.radius * 0.8;

      const spotlight = new THREE.SpotLight(
        this.config.neonColors[i % this.config.neonColors.length],
        0.3,
        200,
        Math.PI / 8,
        0.5,
        1
      );
      
      spotlight.position.set(x, 0, z);
      spotlight.target.position.set(x * 0.5, 100, z * 0.5);
      
      atmosphereGroup.add(spotlight);
      atmosphereGroup.add(spotlight.target);
    }

    this.scene.add(atmosphereGroup);
    this.atmosphereGroup = atmosphereGroup;
  }

  update(delta) {
    this.time += delta;

    // Animer les lumières néon
    for (const neon of this.neonLights) {
      if (neon.type === 'blink') {
        // Clignotement
        const blink = Math.sin(this.time * neon.speed * Math.PI) > 0.3;
        if (neon.mesh) neon.mesh.visible = blink;
        if (neon.light) neon.light.intensity = blink ? 0.5 : 0;
      } else if (neon.type === 'pulse') {
        // Pulsation douce
        const pulse = 0.7 + Math.sin(this.time * neon.speed) * 0.3;
        if (neon.mesh) neon.mesh.material.opacity = pulse;
        if (neon.glow) neon.glow.material.opacity = pulse * 0.6;
      }
    }

    // Animer quelques fenêtres (flickering)
    for (const window of this.windowLights) {
      if (Math.random() > 0.995) {
        // Flicker aléatoire
        window.mesh.material.opacity = window.originalOpacity * (0.5 + Math.random() * 0.5);
      }
    }

    // Rotation lente du skybox pour effet dynamique
    if (this.sky) {
      this.sky.rotation.y += delta * 0.01;
    }
  }

  // Contrôles dynamiques
  setFogDensity(density) {
    if (this.scene.fog) {
      this.scene.fog.density = density;
    }
  }

  setNeonIntensity(intensity) {
    for (const neon of this.neonLights) {
      if (neon.light) {
        neon.light.intensity = intensity;
      }
    }
  }

  dispose() {
    if (this.buildingGroup) {
      this.buildingGroup.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.scene.remove(this.buildingGroup);
    }

    if (this.sky) {
      this.sky.geometry.dispose();
      this.sky.material.dispose();
      this.scene.remove(this.sky);
    }

    if (this.atmosphereGroup) {
      this.scene.remove(this.atmosphereGroup);
    }
  }
}

export default CyberpunkSkyline;
