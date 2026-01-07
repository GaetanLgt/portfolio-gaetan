/**
 * Matrix Awakens Style Effects
 * Index des effets visuels avancés
 */

export { MatrixRain3D } from './MatrixRain3D.js';
export { CyberpunkSkyline } from './CyberpunkSkyline.js';
export { MatrixPostProcessing } from './MatrixPostProcessing.js';
export { SpaceVehicles, VEHICLE_TYPES } from './SpaceVehicles.js';

// Configuration presets
export const EFFECT_PRESETS = {
  // Mode par défaut équilibré
  default: {
    rain: {
      dropCount: 12000,
      dropSpeed: 25,
      splashEnabled: true,
      windStrength: 0.5
    },
    skyline: {
      buildingCount: 60,
      radius: 150,
      density: 0.7
    },
    postProcessing: {
      bloomStrength: 0.8,
      vignetteIntensity: 0.4,
      greenTint: 0.08
    }
  },
  
  // Mode performance (moins de particules)
  performance: {
    rain: {
      dropCount: 6000,
      dropSpeed: 25,
      splashEnabled: false,
      windStrength: 0.3
    },
    skyline: {
      buildingCount: 30,
      radius: 120,
      density: 0.5
    },
    postProcessing: {
      bloomStrength: 0.5,
      vignetteIntensity: 0.3,
      greenTint: 0.05
    }
  },
  
  // Mode cinématique (maximum qualité)
  cinematic: {
    rain: {
      dropCount: 20000,
      dropSpeed: 30,
      splashEnabled: true,
      windStrength: 0.8
    },
    skyline: {
      buildingCount: 100,
      radius: 180,
      density: 0.9
    },
    postProcessing: {
      bloomStrength: 1.2,
      vignetteIntensity: 0.6,
      greenTint: 0.12
    }
  },
  
  // Mode storm (pluie intense)
  storm: {
    rain: {
      dropCount: 25000,
      dropSpeed: 40,
      splashEnabled: true,
      windStrength: 2.0
    },
    skyline: {
      buildingCount: 60,
      radius: 150,
      density: 0.7
    },
    postProcessing: {
      bloomStrength: 0.6,
      vignetteIntensity: 0.5,
      greenTint: 0.05
    }
  }
};
