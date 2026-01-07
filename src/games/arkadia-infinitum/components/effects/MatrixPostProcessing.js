/**
 * MatrixPostProcessing.js
 * Effets post-processing style Matrix Awakens
 * Bloom, chromatic aberration, film grain, vignette
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Custom Matrix shader pour vignette + aberration chromatique + grain
const MatrixShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'time': { value: 0 },
    'vignetteIntensity': { value: 0.4 },
    'chromaticAberration': { value: 0.003 },
    'scanlineIntensity': { value: 0.1 },
    'noiseIntensity': { value: 0.05 },
    'greenTint': { value: 0.1 },
    'resolution': { value: new THREE.Vector2(1, 1) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float vignetteIntensity;
    uniform float chromaticAberration;
    uniform float scanlineIntensity;
    uniform float noiseIntensity;
    uniform float greenTint;
    uniform vec2 resolution;
    
    varying vec2 vUv;
    
    // Pseudo-random noise
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Chromatic aberration
      float aberration = chromaticAberration;
      vec2 direction = uv - 0.5;
      float dist = length(direction);
      
      float r = texture2D(tDiffuse, uv + direction * aberration * dist).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - direction * aberration * dist).b;
      
      vec3 color = vec3(r, g, b);
      
      // Green tint (Matrix style)
      color.g += color.r * greenTint;
      color.g += color.b * greenTint * 0.5;
      
      // Scanlines
      float scanline = sin(uv.y * resolution.y * 2.0) * 0.5 + 0.5;
      color *= 1.0 - scanlineIntensity * (1.0 - scanline);
      
      // Film grain
      float noise = random(uv + time) * noiseIntensity;
      color += noise - noiseIntensity * 0.5;
      
      // Vignette
      float vignette = 1.0 - dist * vignetteIntensity * 1.5;
      vignette = clamp(vignette, 0.0, 1.0);
      vignette = smoothstep(0.0, 1.0, vignette);
      color *= vignette;
      
      // Slight color grading - push shadows to green
      color.rgb = pow(color.rgb, vec3(1.0, 0.95, 1.05));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

// Glitch shader pour effet bullet time / déconnexion
const GlitchShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'time': { value: 0 },
    'amount': { value: 0.0 },
    'speed': { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float amount;
    uniform float speed;
    
    varying vec2 vUv;
    
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vUv;
      
      if (amount > 0.0) {
        // Horizontal displacement
        float displacement = (random(vec2(floor(uv.y * 20.0), floor(time * speed * 10.0))) - 0.5) * amount * 0.1;
        uv.x += displacement;
        
        // RGB split on glitch
        float r = texture2D(tDiffuse, uv + vec2(amount * 0.01, 0.0)).r;
        float g = texture2D(tDiffuse, uv).g;
        float b = texture2D(tDiffuse, uv - vec2(amount * 0.01, 0.0)).b;
        
        // Random blocks
        if (random(vec2(floor(uv.y * 10.0), floor(time * speed * 5.0))) > 0.95) {
          uv.x += (random(vec2(time, uv.y)) - 0.5) * amount * 0.2;
        }
        
        vec4 color = vec4(r, g, b, 1.0);
        
        // Occasional white flash
        if (random(vec2(time * speed, 0.0)) > 0.98) {
          color.rgb += amount * 0.5;
        }
        
        gl_FragColor = color;
      } else {
        gl_FragColor = texture2D(tDiffuse, uv);
      }
    }
  `
};

export class MatrixPostProcessing {
  constructor(renderer, scene, camera, options = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    this.config = {
      bloomStrength: options.bloomStrength || 0.8,
      bloomRadius: options.bloomRadius || 0.5,
      bloomThreshold: options.bloomThreshold || 0.3,
      vignetteIntensity: options.vignetteIntensity || 0.4,
      chromaticAberration: options.chromaticAberration || 0.002,
      scanlineIntensity: options.scanlineIntensity || 0.08,
      noiseIntensity: options.noiseIntensity || 0.04,
      greenTint: options.greenTint || 0.08,
      ...options
    };

    this.time = 0;
    this.glitchAmount = 0;
    this.glitchTarget = 0;

    this.init();
  }

  init() {
    const size = this.renderer.getSize(new THREE.Vector2());
    
    // Composer principal
    this.composer = new EffectComposer(this.renderer);

    // Render pass de base
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Bloom pass (Unreal style)
    this.bloomPass = new UnrealBloomPass(
      size,
      this.config.bloomStrength,
      this.config.bloomRadius,
      this.config.bloomThreshold
    );
    this.composer.addPass(this.bloomPass);

    // Matrix shader pass
    this.matrixPass = new ShaderPass(MatrixShader);
    this.matrixPass.uniforms.vignetteIntensity.value = this.config.vignetteIntensity;
    this.matrixPass.uniforms.chromaticAberration.value = this.config.chromaticAberration;
    this.matrixPass.uniforms.scanlineIntensity.value = this.config.scanlineIntensity;
    this.matrixPass.uniforms.noiseIntensity.value = this.config.noiseIntensity;
    this.matrixPass.uniforms.greenTint.value = this.config.greenTint;
    this.matrixPass.uniforms.resolution.value = size;
    this.composer.addPass(this.matrixPass);

    // Glitch pass (désactivé par défaut)
    this.glitchPass = new ShaderPass(GlitchShader);
    this.glitchPass.uniforms.amount.value = 0;
    this.composer.addPass(this.glitchPass);

    // Handle resize
    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const size = this.renderer.getSize(new THREE.Vector2());
    this.composer.setSize(size.x, size.y);
    this.matrixPass.uniforms.resolution.value = size;
    this.bloomPass.resolution.set(size.x, size.y);
  }

  update(delta) {
    this.time += delta;
    
    // Update time uniforms
    this.matrixPass.uniforms.time.value = this.time;
    this.glitchPass.uniforms.time.value = this.time;
    
    // Smooth glitch transition
    this.glitchAmount += (this.glitchTarget - this.glitchAmount) * delta * 5;
    this.glitchPass.uniforms.amount.value = this.glitchAmount;
  }

  render() {
    this.composer.render();
  }

  // === Contrôles dynamiques ===
  
  setBloomStrength(strength) {
    this.bloomPass.strength = strength;
  }

  setBloomThreshold(threshold) {
    this.bloomPass.threshold = threshold;
  }

  setVignetteIntensity(intensity) {
    this.matrixPass.uniforms.vignetteIntensity.value = intensity;
  }

  setChromaticAberration(amount) {
    this.matrixPass.uniforms.chromaticAberration.value = amount;
  }

  setScanlineIntensity(intensity) {
    this.matrixPass.uniforms.scanlineIntensity.value = intensity;
  }

  setNoiseIntensity(intensity) {
    this.matrixPass.uniforms.noiseIntensity.value = intensity;
  }

  setGreenTint(amount) {
    this.matrixPass.uniforms.greenTint.value = amount;
  }

  // === Effets spéciaux ===

  triggerGlitch(intensity = 1.0, duration = 0.5) {
    this.glitchTarget = intensity;
    setTimeout(() => {
      this.glitchTarget = 0;
    }, duration * 1000);
  }

  // Bullet time effect
  enableBulletTime() {
    this.setBloomStrength(1.5);
    this.setChromaticAberration(0.008);
    this.setScanlineIntensity(0.02);
  }

  disableBulletTime() {
    this.setBloomStrength(this.config.bloomStrength);
    this.setChromaticAberration(this.config.chromaticAberration);
    this.setScanlineIntensity(this.config.scanlineIntensity);
  }

  // Red pill effect (vision thermique)
  enableRedPillVision() {
    this.setGreenTint(-0.1); // Inverse le tint
    this.matrixPass.uniforms.greenTint.value = -0.15;
    this.bloomPass.strength = 1.2;
    // Teinte rouge via post-process
  }

  disableRedPillVision() {
    this.setGreenTint(this.config.greenTint);
    this.bloomPass.strength = this.config.bloomStrength;
  }

  // Preset: Cinematic
  setCinematicMode() {
    this.setBloomStrength(1.0);
    this.setVignetteIntensity(0.6);
    this.setChromaticAberration(0.004);
    this.setScanlineIntensity(0.05);
    this.setNoiseIntensity(0.06);
  }

  // Preset: Clean
  setCleanMode() {
    this.setBloomStrength(0.5);
    this.setVignetteIntensity(0.2);
    this.setChromaticAberration(0.001);
    this.setScanlineIntensity(0.02);
    this.setNoiseIntensity(0.02);
  }

  // Preset: Heavy Matrix
  setHeavyMatrixMode() {
    this.setBloomStrength(1.2);
    this.setVignetteIntensity(0.5);
    this.setChromaticAberration(0.005);
    this.setScanlineIntensity(0.15);
    this.setNoiseIntensity(0.08);
    this.setGreenTint(0.15);
  }

  dispose() {
    this.composer.dispose();
    window.removeEventListener('resize', () => this.onResize());
  }
}

export default MatrixPostProcessing;
