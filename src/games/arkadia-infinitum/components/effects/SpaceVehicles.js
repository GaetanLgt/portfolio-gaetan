/**
 * SpaceVehicles.js
 * Système de vaisseaux et véhicules procéduraux style Matrix/Cyberpunk
 * Spawn dynamique, patrouilles, effets de lumière
 */

import * as THREE from 'three';

// ============================================================================
// VEHICLE TEMPLATES - Générateurs de géométrie procédurale
// ============================================================================

const VEHICLE_TYPES = {
  // Sentinelle Matrix - squid mécanique
  sentinel: {
    name: 'Sentinel',
    category: 'hostile',
    speed: { min: 8, max: 15 },
    scale: { min: 0.8, max: 1.5 },
    color: 0x880000,
    emissive: 0xff0000,
    glowColor: 0xff0000,
    behavior: 'patrol',
    sound: 'mechanical'
  },
  
  // Hovercraft Nebuchadnezzar style
  hovercraft: {
    name: 'Hovercraft',
    category: 'friendly',
    speed: { min: 5, max: 10 },
    scale: { min: 1.5, max: 2.5 },
    color: 0x333333,
    emissive: 0x00ff00,
    glowColor: 0x00ff00,
    behavior: 'cruise',
    sound: 'hover'
  },
  
  // Spinner Blade Runner style
  spinner: {
    name: 'Spinner',
    category: 'civilian',
    speed: { min: 15, max: 25 },
    scale: { min: 0.5, max: 0.8 },
    color: 0x222222,
    emissive: 0x00ffff,
    glowColor: 0x00ffff,
    behavior: 'traffic',
    sound: 'turbine'
  },
  
  // Cargo ship massif
  cargoShip: {
    name: 'Cargo Ship',
    category: 'industrial',
    speed: { min: 2, max: 5 },
    scale: { min: 3, max: 6 },
    color: 0x1a1a1a,
    emissive: 0xff6600,
    glowColor: 0xff6600,
    behavior: 'slowCruise',
    sound: 'deep'
  },
  
  // Drone de surveillance
  drone: {
    name: 'Surveillance Drone',
    category: 'security',
    speed: { min: 10, max: 20 },
    scale: { min: 0.3, max: 0.5 },
    color: 0x111111,
    emissive: 0xff00ff,
    glowColor: 0xff00ff,
    behavior: 'erratic',
    sound: 'buzz'
  },
  
  // Vaisseau alien/mystérieux
  alienCraft: {
    name: 'Unknown Craft',
    category: 'unknown',
    speed: { min: 20, max: 40 },
    scale: { min: 1, max: 2 },
    color: 0x000000,
    emissive: 0x00ff88,
    glowColor: 0x00ff88,
    behavior: 'teleport',
    sound: 'alien'
  }
};

// ============================================================================
// GEOMETRY GENERATORS - Créer les formes des vaisseaux
// ============================================================================

function createSentinelGeometry() {
  const group = new THREE.Group();
  
  // Corps central (sphère aplatie)
  const bodyGeo = new THREE.SphereGeometry(1, 8, 6);
  bodyGeo.scale(1, 0.5, 1);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x880000,
    metalness: 0.9,
    roughness: 0.3,
    emissive: 0x220000,
    emissiveIntensity: 0.3
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Tentacules mécaniques (8)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const tentacle = createTentacle();
    tentacle.position.x = Math.cos(angle) * 0.8;
    tentacle.position.z = Math.sin(angle) * 0.8;
    tentacle.rotation.z = Math.PI / 4;
    tentacle.rotation.y = angle;
    group.add(tentacle);
  }
  
  // Œil central rouge
  const eyeGeo = new THREE.SphereGeometry(0.3, 16, 16);
  const eyeMat = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.9
  });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.y = 0.2;
  group.add(eye);
  
  // Point light pour l'œil
  const eyeLight = new THREE.PointLight(0xff0000, 1, 10);
  eyeLight.position.copy(eye.position);
  group.add(eyeLight);
  
  return group;
}

function createTentacle() {
  const group = new THREE.Group();
  const segments = 5;
  
  for (let i = 0; i < segments; i++) {
    const size = 0.15 - (i * 0.02);
    const segGeo = new THREE.CylinderGeometry(size, size * 0.8, 0.4, 6);
    const segMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.8,
      roughness: 0.4
    });
    const seg = new THREE.Mesh(segGeo, segMat);
    seg.position.y = -i * 0.35;
    seg.rotation.z = Math.sin(i * 0.5) * 0.2;
    group.add(seg);
  }
  
  // Griffe au bout
  const clawGeo = new THREE.ConeGeometry(0.08, 0.3, 4);
  const clawMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.9,
    roughness: 0.2
  });
  const claw = new THREE.Mesh(clawGeo, clawMat);
  claw.position.y = -segments * 0.35 - 0.15;
  claw.rotation.x = Math.PI;
  group.add(claw);
  
  return group;
}

function createHovercraftGeometry() {
  const group = new THREE.Group();
  
  // Corps principal (forme allongée)
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(0, -2);
  bodyShape.quadraticCurveTo(1.5, -1.5, 1.5, 0);
  bodyShape.quadraticCurveTo(1.5, 1.5, 0, 2);
  bodyShape.quadraticCurveTo(-1.5, 1.5, -1.5, 0);
  bodyShape.quadraticCurveTo(-1.5, -1.5, 0, -2);
  
  const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  bodyGeo.rotateX(Math.PI / 2);
  
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.4
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Cockpit (dôme)
  const cockpitGeo = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  const cockpitMat = new THREE.MeshStandardMaterial({
    color: 0x003300,
    metalness: 0.3,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7
  });
  const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
  cockpit.position.set(0, 0.5, 0.5);
  group.add(cockpit);
  
  // Moteurs (4)
  const enginePositions = [
    { x: 1, z: -1.5 },
    { x: -1, z: -1.5 },
    { x: 0.8, z: 1 },
    { x: -0.8, z: 1 }
  ];
  
  enginePositions.forEach(pos => {
    const engineGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 8);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.3
    });
    const engine = new THREE.Mesh(engineGeo, engineMat);
    engine.position.set(pos.x, -0.3, pos.z);
    group.add(engine);
    
    // Glow du moteur
    const glowGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.3, 8);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(pos.x, -0.55, pos.z);
    group.add(glow);
  });
  
  // Lumières de navigation
  const navLight1 = new THREE.PointLight(0x00ff00, 0.5, 5);
  navLight1.position.set(0, 0, 2);
  group.add(navLight1);
  
  const navLight2 = new THREE.PointLight(0xff0000, 0.3, 3);
  navLight2.position.set(1.5, 0, 0);
  group.add(navLight2);
  
  return group;
}

function createSpinnerGeometry() {
  const group = new THREE.Group();
  
  // Corps (capsule aérodynamique)
  const bodyGeo = new THREE.CapsuleGeometry(0.3, 1, 8, 16);
  bodyGeo.rotateZ(Math.PI / 2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Ailes latérales
  const wingGeo = new THREE.BoxGeometry(0.1, 0.05, 0.8);
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.4
  });
  
  const wingLeft = new THREE.Mesh(wingGeo, wingMat);
  wingLeft.position.set(0, 0, 0.5);
  group.add(wingLeft);
  
  const wingRight = new THREE.Mesh(wingGeo, wingMat);
  wingRight.position.set(0, 0, -0.5);
  group.add(wingRight);
  
  // Phares avant
  const headlightGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  
  const headlight1 = new THREE.Mesh(headlightGeo, headlightMat);
  headlight1.position.set(0.6, 0, 0.15);
  group.add(headlight1);
  
  const headlight2 = new THREE.Mesh(headlightGeo, headlightMat);
  headlight2.position.set(0.6, 0, -0.15);
  group.add(headlight2);
  
  // Feux arrière
  const taillightGeo = new THREE.BoxGeometry(0.05, 0.1, 0.3);
  const taillightMat = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    transparent: true,
    opacity: 0.8
  });
  const taillight = new THREE.Mesh(taillightGeo, taillightMat);
  taillight.position.set(-0.65, 0, 0);
  group.add(taillight);
  
  // Point light pour les phares
  const spotlight = new THREE.SpotLight(0x00ffff, 0.5, 20, Math.PI / 6);
  spotlight.position.set(0.6, 0, 0);
  spotlight.target.position.set(5, -2, 0);
  group.add(spotlight);
  group.add(spotlight.target);
  
  return group;
}

function createCargoShipGeometry() {
  const group = new THREE.Group();
  
  // Corps massif
  const bodyGeo = new THREE.BoxGeometry(8, 2, 3);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.6,
    roughness: 0.5
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Containers sur le dessus
  for (let i = 0; i < 4; i++) {
    const containerGeo = new THREE.BoxGeometry(1.5, 0.8, 2.5);
    const containerMat = new THREE.MeshStandardMaterial({
      color: [0x884400, 0x446688, 0x448844, 0x884488][i],
      metalness: 0.4,
      roughness: 0.6
    });
    const container = new THREE.Mesh(containerGeo, containerMat);
    container.position.set(-2.5 + i * 1.8, 1.4, 0);
    group.add(container);
  }
  
  // Pont de commande
  const bridgeGeo = new THREE.BoxGeometry(1.5, 1.5, 2);
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.3
  });
  const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridge.position.set(3, 1.5, 0);
  group.add(bridge);
  
  // Fenêtres du pont
  const windowGeo = new THREE.PlaneGeometry(1.2, 0.5);
  const windowMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const window1 = new THREE.Mesh(windowGeo, windowMat);
  window1.position.set(3.76, 1.5, 0);
  window1.rotation.y = Math.PI / 2;
  group.add(window1);
  
  // Moteurs arrière (gros)
  for (let i = 0; i < 2; i++) {
    const engineGeo = new THREE.CylinderGeometry(0.6, 0.8, 1.5, 8);
    engineGeo.rotateZ(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.3
    });
    const engine = new THREE.Mesh(engineGeo, engineMat);
    engine.position.set(-4.5, 0, i === 0 ? 1 : -1);
    group.add(engine);
    
    // Flamme du moteur
    const flameGeo = new THREE.ConeGeometry(0.5, 2, 8);
    flameGeo.rotateZ(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.7
    });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(-5.5, 0, i === 0 ? 1 : -1);
    group.add(flame);
  }
  
  // Lumières de signalisation
  const beaconGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  const beacon1 = new THREE.Mesh(beaconGeo, beaconMat);
  beacon1.position.set(3, 2.5, 0);
  group.add(beacon1);
  
  const beacon2 = new THREE.Mesh(beaconGeo, beaconMat.clone());
  beacon2.material.color.setHex(0x00ff00);
  beacon2.position.set(-4, 1.2, 1.5);
  group.add(beacon2);
  
  return group;
}

function createDroneGeometry() {
  const group = new THREE.Group();
  
  // Corps central (octogone)
  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.2
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);
  
  // Bras (4)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const armGeo = new THREE.BoxGeometry(0.5, 0.05, 0.08);
    const armMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.7,
      roughness: 0.4
    });
    const arm = new THREE.Mesh(armGeo, armMat);
    arm.position.x = Math.cos(angle) * 0.35;
    arm.position.z = Math.sin(angle) * 0.35;
    arm.rotation.y = angle;
    group.add(arm);
    
    // Rotors
    const rotorGeo = new THREE.TorusGeometry(0.15, 0.02, 8, 16);
    const rotorMat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.6
    });
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.x = Math.cos(angle) * 0.6;
    rotor.position.z = Math.sin(angle) * 0.6;
    rotor.position.y = 0.1;
    rotor.rotation.x = Math.PI / 2;
    rotor.userData.isRotor = true;
    group.add(rotor);
  }
  
  // Œil/caméra
  const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const eyeMat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.9
  });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.y = -0.1;
  group.add(eye);
  
  // Spotlight
  const spotlight = new THREE.SpotLight(0xff00ff, 0.5, 15, Math.PI / 8);
  spotlight.position.set(0, -0.1, 0);
  spotlight.target.position.set(0, -5, 0);
  group.add(spotlight);
  group.add(spotlight.target);
  
  return group;
}

function createAlienCraftGeometry() {
  const group = new THREE.Group();
  
  // Disque principal
  const discGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 32);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x000000,
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 2
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  group.add(disc);
  
  // Dôme supérieur
  const domeGeo = new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x001100,
    metalness: 0.5,
    roughness: 0.2,
    transparent: true,
    opacity: 0.6
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 0.15;
  group.add(dome);
  
  // Anneau lumineux
  const ringGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.9
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.userData.isRing = true;
  group.add(ring);
  
  // Lumières en dessous
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const lightGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const lightMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88
    });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.x = Math.cos(angle) * 1;
    light.position.z = Math.sin(angle) * 1;
    light.position.y = -0.2;
    group.add(light);
  }
  
  // Point light central
  const centralLight = new THREE.PointLight(0x00ff88, 2, 20);
  centralLight.position.y = -0.5;
  group.add(centralLight);
  
  return group;
}

// ============================================================================
// VEHICLE SPAWNER - Système principal
// ============================================================================

export class SpaceVehicles {
  constructor(scene, options = {}) {
    this.scene = scene;
    
    this.config = {
      maxVehicles: options.maxVehicles || 15,
      spawnRadius: options.spawnRadius || 200,
      minAltitude: options.minAltitude || 30,
      maxAltitude: options.maxAltitude || 100,
      spawnInterval: options.spawnInterval || 3000, // ms
      despawnDistance: options.despawnDistance || 300,
      enabledTypes: options.enabledTypes || ['spinner', 'drone', 'hovercraft', 'cargoShip'],
      ...options
    };
    
    this.vehicles = [];
    this.vehiclePool = new Map(); // Pool de géométries réutilisables
    this.time = 0;
    this.lastSpawn = 0;
    this.paused = false;
    
    // Groupes de véhicules par catégorie
    this.vehicleGroup = new THREE.Group();
    this.vehicleGroup.name = 'spaceVehicles';
    this.scene.add(this.vehicleGroup);
    
    // Pré-générer les géométries
    this.geometryGenerators = {
      sentinel: createSentinelGeometry,
      hovercraft: createHovercraftGeometry,
      spinner: createSpinnerGeometry,
      cargoShip: createCargoShipGeometry,
      drone: createDroneGeometry,
      alienCraft: createAlienCraftGeometry
    };
    
    // Spawn initial
    this.initialSpawn();
  }
  
  initialSpawn() {
    // Spawn quelques véhicules au démarrage
    const initialCount = Math.min(5, this.config.maxVehicles);
    for (let i = 0; i < initialCount; i++) {
      setTimeout(() => this.spawnVehicle(), i * 500);
    }
  }
  
  spawnVehicle(forceType = null) {
    if (this.vehicles.length >= this.config.maxVehicles) return null;
    
    // Choisir un type
    const typeKey = forceType || this.config.enabledTypes[
      Math.floor(Math.random() * this.config.enabledTypes.length)
    ];
    
    const vehicleType = VEHICLE_TYPES[typeKey];
    if (!vehicleType) return null;
    
    // Créer la géométrie
    const generator = this.geometryGenerators[typeKey];
    if (!generator) return null;
    
    const mesh = generator();
    
    // Configurer le véhicule
    const scale = THREE.MathUtils.randFloat(vehicleType.scale.min, vehicleType.scale.max);
    mesh.scale.setScalar(scale);
    
    // Position de spawn (sur les bords de la zone)
    const spawnAngle = Math.random() * Math.PI * 2;
    const spawnRadius = this.config.spawnRadius * 0.8;
    
    mesh.position.set(
      Math.cos(spawnAngle) * spawnRadius,
      THREE.MathUtils.randFloat(this.config.minAltitude, this.config.maxAltitude),
      Math.sin(spawnAngle) * spawnRadius
    );
    
    // Direction vers le centre (avec variation)
    const targetAngle = spawnAngle + Math.PI + (Math.random() - 0.5) * 0.5;
    const speed = THREE.MathUtils.randFloat(vehicleType.speed.min, vehicleType.speed.max);
    
    // Données du véhicule
    const vehicleData = {
      mesh: mesh,
      type: typeKey,
      typeData: vehicleType,
      speed: speed,
      direction: new THREE.Vector3(
        Math.cos(targetAngle),
        (Math.random() - 0.5) * 0.2,
        Math.sin(targetAngle)
      ).normalize(),
      lifetime: 0,
      maxLifetime: 60 + Math.random() * 60, // 60-120 secondes
      behaviorState: {
        phase: 0,
        timer: 0,
        target: null
      }
    };
    
    // Orienter vers la direction de mouvement
    mesh.lookAt(mesh.position.clone().add(vehicleData.direction));
    
    // Ajouter à la scène et au tracking
    this.vehicleGroup.add(mesh);
    this.vehicles.push(vehicleData);
    
    return vehicleData;
  }
  
  despawnVehicle(index) {
    const vehicle = this.vehicles[index];
    if (!vehicle) return;
    
    // Retirer de la scène
    this.vehicleGroup.remove(vehicle.mesh);
    
    // Cleanup
    vehicle.mesh.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    
    // Retirer du tableau
    this.vehicles.splice(index, 1);
  }
  
  update(delta, cameraPosition) {
    if (this.paused) return;
    
    this.time += delta;
    
    // Spawn de nouveaux véhicules
    if (this.time - this.lastSpawn > this.config.spawnInterval / 1000) {
      if (this.vehicles.length < this.config.maxVehicles && Math.random() > 0.3) {
        this.spawnVehicle();
      }
      this.lastSpawn = this.time;
    }
    
    // Mettre à jour chaque véhicule
    for (let i = this.vehicles.length - 1; i >= 0; i--) {
      const vehicle = this.vehicles[i];
      
      // Mettre à jour le comportement
      this.updateVehicleBehavior(vehicle, delta);
      
      // Mettre à jour la position
      vehicle.mesh.position.add(
        vehicle.direction.clone().multiplyScalar(vehicle.speed * delta)
      );
      
      // Animer les éléments spéciaux
      this.animateVehicle(vehicle, delta);
      
      // Vérifier le lifetime / distance
      vehicle.lifetime += delta;
      const distanceFromCenter = vehicle.mesh.position.length();
      
      if (vehicle.lifetime > vehicle.maxLifetime || 
          distanceFromCenter > this.config.despawnDistance) {
        this.despawnVehicle(i);
      }
    }
  }
  
  updateVehicleBehavior(vehicle, delta) {
    const behavior = vehicle.typeData.behavior;
    const state = vehicle.behaviorState;
    
    state.timer += delta;
    
    switch (behavior) {
      case 'patrol':
        // Mouvement en zigzag
        if (state.timer > 2) {
          vehicle.direction.x += (Math.random() - 0.5) * 0.3;
          vehicle.direction.z += (Math.random() - 0.5) * 0.3;
          vehicle.direction.normalize();
          state.timer = 0;
        }
        break;
        
      case 'cruise':
        // Ligne droite avec légère ondulation
        vehicle.mesh.position.y += Math.sin(this.time * 0.5 + state.phase) * 0.02;
        break;
        
      case 'traffic':
        // Suit des couloirs
        if (state.timer > 5 && Math.random() > 0.8) {
          vehicle.direction.y += (Math.random() - 0.5) * 0.5;
          vehicle.direction.clampLength(0.8, 1);
          state.timer = 0;
        }
        break;
        
      case 'slowCruise':
        // Très stable
        break;
        
      case 'erratic':
        // Mouvements imprévisibles
        if (state.timer > 0.5) {
          vehicle.direction.x += (Math.random() - 0.5) * 0.8;
          vehicle.direction.y += (Math.random() - 0.5) * 0.4;
          vehicle.direction.z += (Math.random() - 0.5) * 0.8;
          vehicle.direction.normalize();
          vehicle.mesh.lookAt(vehicle.mesh.position.clone().add(vehicle.direction));
          state.timer = 0;
        }
        break;
        
      case 'teleport':
        // Disparaît et réapparaît
        if (state.timer > 8 && Math.random() > 0.95) {
          const newAngle = Math.random() * Math.PI * 2;
          vehicle.mesh.position.x = Math.cos(newAngle) * this.config.spawnRadius * 0.5;
          vehicle.mesh.position.z = Math.sin(newAngle) * this.config.spawnRadius * 0.5;
          state.timer = 0;
        }
        break;
    }
  }
  
  animateVehicle(vehicle, delta) {
    const typeKey = vehicle.type;
    const mesh = vehicle.mesh;
    
    // Animations spécifiques par type
    switch (typeKey) {
      case 'sentinel':
        // Tentacules qui bougent
        mesh.children.forEach((child, i) => {
          if (i > 0 && i < 9) { // Tentacules
            child.rotation.x = Math.sin(this.time * 2 + i) * 0.2;
          }
        });
        // Œil qui pulse
        const eye = mesh.children.find(c => c.material?.color?.getHex?.() === 0xff0000);
        if (eye) {
          eye.material.opacity = 0.7 + Math.sin(this.time * 5) * 0.3;
        }
        break;
        
      case 'drone':
        // Rotors qui tournent
        mesh.children.forEach(child => {
          if (child.userData.isRotor) {
            child.rotation.z += delta * 20;
          }
        });
        break;
        
      case 'alienCraft':
        // Anneau qui pulse et tourne
        mesh.children.forEach(child => {
          if (child.userData.isRing) {
            child.rotation.z += delta * 2;
            child.material.opacity = 0.6 + Math.sin(this.time * 3) * 0.4;
          }
        });
        break;
        
      case 'cargoShip':
        // Flammes des moteurs qui varient
        mesh.children.forEach(child => {
          if (child.geometry?.type === 'ConeGeometry') {
            child.scale.x = 0.8 + Math.random() * 0.4;
            child.scale.y = 0.8 + Math.random() * 0.4;
          }
        });
        break;
    }
    
    // Légère oscillation pour tous
    mesh.rotation.z = Math.sin(this.time + vehicle.behaviorState.phase) * 0.02;
  }
  
  // ============================================================================
  // CONTROLES
  // ============================================================================
  
  spawnSentinel() {
    return this.spawnVehicle('sentinel');
  }
  
  spawnFleet(type, count = 5) {
    const fleet = [];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const v = this.spawnVehicle(type);
        if (v) fleet.push(v);
      }, i * 200);
    }
    return fleet;
  }
  
  spawnAlienInvasion() {
    // Spawn plusieurs vaisseaux aliens
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const v = this.spawnVehicle('alienCraft');
        if (v) {
          v.speed *= 0.5; // Plus lent pour effet dramatique
        }
      }, i * 1000);
    }
  }
  
  clearAllVehicles() {
    while (this.vehicles.length > 0) {
      this.despawnVehicle(0);
    }
  }
  
  pause() {
    this.paused = true;
  }
  
  resume() {
    this.paused = false;
  }
  
  setMaxVehicles(max) {
    this.config.maxVehicles = max;
    // Despawn si trop
    while (this.vehicles.length > max) {
      this.despawnVehicle(this.vehicles.length - 1);
    }
  }
  
  getVehicleCount() {
    return this.vehicles.length;
  }
  
  getVehiclesByType(type) {
    return this.vehicles.filter(v => v.type === type);
  }
  
  dispose() {
    this.clearAllVehicles();
    this.scene.remove(this.vehicleGroup);
  }
}

export { VEHICLE_TYPES };
export default SpaceVehicles;
