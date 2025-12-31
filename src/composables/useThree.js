import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

export function useThree() {
  const canvasRef = ref(null);
  const scene = ref(null);
  const camera = ref(null);
  const renderer = ref(null);
  let animationId = null;

  const initScene = () => {
    if (!canvasRef.value) return;

    // Scene
    scene.value = new THREE.Scene();

    // Camera
    camera.value = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.value.position.z = 5;

    // Renderer
    renderer.value = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      alpha: true,
      antialias: true
    });
    renderer.value.setSize(window.innerWidth, window.innerHeight);
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  const handleResize = () => {
    if (!camera.value || !renderer.value) return;

    camera.value.aspect = window.innerWidth / window.innerHeight;
    camera.value.updateProjectionMatrix();
    renderer.value.setSize(window.innerWidth, window.innerHeight);
  };

  const animate = (callback) => {
    const tick = () => {
      if (callback) {
        callback();
      }

      if (renderer.value && scene.value && camera.value) {
        renderer.value.render(scene.value, camera.value);
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();
  };

  onMounted(() => {
    initScene();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (renderer.value) {
      renderer.value.dispose();
    }
  });

  return {
    canvasRef,
    scene,
    camera,
    renderer,
    animate
  };
}
