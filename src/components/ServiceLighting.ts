import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface ServiceLightingRig {
  ambientLight: THREE.HemisphereLight;
  keySpotLight: THREE.SpotLight;
  oliveRimLight: THREE.SpotLight;
  lowerFillLight: THREE.DirectionalLight;
  updateLighting: (
    keyIntensity: number,
    oliveIntensity: number,
    camX: number
  ) => void;
  dispose: () => void;
}

/**
 * Creates the cinematic luxury studio lighting rig for Phase 4:
 * - Soft overhead spotlight (#E8DDC8)
 * - Muted olive-green rim lighting (#77795B)
 * - Realistic metallic reflections (RoomEnvironment PMREM)
 * - Subtle ambient fill lighting (#171819 base)
 * - Controlled highlights without neon or exaggerated bloom
 */
export function createServiceLightingRig(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  targetPos: THREE.Vector3
): ServiceLightingRig {
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  const ambientLight = new THREE.HemisphereLight(0xe8ddc8, 0x171819, 0.88);
  scene.add(ambientLight);

  // Soft Overhead Key Spotlight (Warm Ivory #E8DDC8)
  const keySpotLight = new THREE.SpotLight(
    0xe8ddc8,
    38,
    14,
    Math.PI / 4.0,
    0.68,
    1.4
  );
  keySpotLight.position.set(1.9, 3.3, 2.9);
  keySpotLight.target.position.copy(targetPos);
  scene.add(keySpotLight);
  scene.add(keySpotLight.target);

  // Mehndi Olive Rim Light (#77795B)
  const oliveRimLight = new THREE.SpotLight(
    0x77795b,
    30,
    12,
    Math.PI / 3.4,
    0.75,
    1.3
  );
  oliveRimLight.position.set(-2.5, 1.7, -2.1);
  oliveRimLight.target.position.copy(targetPos);
  scene.add(oliveRimLight);
  scene.add(oliveRimLight.target);

  // Specular Lower Fill (Warm Ivory #E8DDC8)
  const lowerFillLight = new THREE.DirectionalLight(0xe8ddc8, 1.38);
  lowerFillLight.position.set(0.9, -1.8, 2.2);
  scene.add(lowerFillLight);

  const updateLighting = (
    keyIntensity: number,
    oliveIntensity: number,
    camX: number
  ) => {
    keySpotLight.intensity = keyIntensity;
    oliveRimLight.intensity = oliveIntensity;
    keySpotLight.position.x = 1.9 + camX * 1.5;
  };

  const dispose = () => {
    envTarget.dispose();
    pmremGenerator.dispose();
  };

  return {
    ambientLight,
    keySpotLight,
    oliveRimLight,
    lowerFillLight,
    updateLighting,
    dispose,
  };
}
