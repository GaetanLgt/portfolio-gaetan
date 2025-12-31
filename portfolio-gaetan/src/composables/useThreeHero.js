import * as THREE from 'three';

export function useThreeHero(container) {
  // Scene setup
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 30;
  
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Colors
  const cyan = new THREE.Color(0x06b6d4);
  const violet = new THREE.Color(0x8b5cf6);
  const teal = new THREE.Color(0x14b8a6);

  // Particle system - Grid Matrix effect
  const particlesCount = 2000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    
    // Grid-like distribution with some randomness
    const gridSize = 100;
    positions[i3] = (Math.random() - 0.5) * gridSize;
    positions[i3 + 1] = (Math.random() - 0.5) * gridSize;
    positions[i3 + 2] = (Math.random() - 0.5) * gridSize;
    
    // Random colors between cyan, violet, teal
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) {
      color = cyan;
    } else if (colorChoice < 0.7) {
      color = violet;
    } else {
      color = teal;
    }
    
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    
    sizes[i] = Math.random() * 2 + 0.5;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material for better particles
  const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uPixelRatio;
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        
        // Subtle floating animation
        pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.5;
        pos.x += cos(uTime * 0.3 + position.z * 0.1) * 0.3;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation
        gl_PointSize = size * uPixelRatio * (50.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        // Circular particle with soft edges
        float distanceToCenter = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.3, 0.5, distanceToCenter);
        
        if (alpha < 0.01) discard;
        
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Grid lines for depth
  const gridHelper = new THREE.GridHelper(100, 50, 0x06b6d4, 0x1a1a24);
  gridHelper.position.y = -20;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Central glowing orb
  const orbGeometry = new THREE.IcosahedronGeometry(3, 4);
  const orbMaterial = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  scene.add(orb);

  // Inner orb
  const innerOrbGeometry = new THREE.IcosahedronGeometry(2, 2);
  const innerOrbMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    transparent: true,
    opacity: 0.5
  });
  const innerOrb = new THREE.Mesh(innerOrbGeometry, innerOrbMaterial);
  scene.add(innerOrb);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  
  const handleMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    targetRotation.x = mouse.y * 0.3;
    targetRotation.y = mouse.x * 0.3;
  };
  
  window.addEventListener('mousemove', handleMouseMove);

  // Resize handler
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    particlesMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  };
  
  window.addEventListener('resize', handleResize);

  // Animation loop
  let animationId;
  const clock = new THREE.Clock();
  
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update shader time
    particlesMaterial.uniforms.uTime.value = elapsedTime;
    
    // Rotate particles slowly
    particles.rotation.y = elapsedTime * 0.02;
    
    // Rotate orbs
    orb.rotation.x = elapsedTime * 0.1;
    orb.rotation.y = elapsedTime * 0.15;
    innerOrb.rotation.x = -elapsedTime * 0.15;
    innerOrb.rotation.z = elapsedTime * 0.1;
    
    // Smooth camera follow mouse
    camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05;
    
    renderer.render(scene, camera);
  };
  
  animate();

  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationId);
    
    // Dispose resources
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    orbGeometry.dispose();
    orbMaterial.dispose();
    innerOrbGeometry.dispose();
    innerOrbMaterial.dispose();
    renderer.dispose();
    
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
}
