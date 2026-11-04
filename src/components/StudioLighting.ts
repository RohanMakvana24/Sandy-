import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface StudioLightingRig {
  keySpotLight: THREE.SpotLight;
  keySpotTarget: THREE.Object3D;
  oliveRimLight: THREE.SpotLight;
  warmFillLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  floorGroup: THREE.Group;
  dispose: () => void;
}

/**
 * Generates a seamless radial studio spotlight pool + contact shadow texture
 * that fades to 100% transparent before reaching the canvas boundary.
 */
function createSeamlessStudioFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);

    // 1. Soft outer studio spotlight floor reflection pool (fades to 0 alpha at edges)
    const poolGrad = ctx.createRadialGradient(256, 256, 30, 256, 256, 248);
    poolGrad.addColorStop(0, 'rgba(152, 155, 116, 0.16)');
    poolGrad.addColorStop(0.38, 'rgba(119, 121, 91, 0.09)');
    poolGrad.addColorStop(0.68, 'rgba(30, 32, 28, 0.04)');
    poolGrad.addColorStop(1, 'rgba(23, 24, 25, 0)');
    ctx.fillStyle = poolGrad;
    ctx.fillRect(0, 0, 512, 512);

    // 2. Deep contact shadow directly beneath the hydraulic base & footrest
    const shadowGrad = ctx.createRadialGradient(256, 256, 12, 256, 256, 145);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    shadowGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.78)');
    shadowGrad.addColorStop(0.78, 'rgba(0, 0, 0, 0.25)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = shadowGrad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createStudioLighting(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): StudioLightingRig {
  // 1. Studio PBR Environment Map for realistic chrome & leather specular reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.58;
  pmremGenerator.dispose();

  // 2. Hemisphere Fill Light (Warm Ivory sky #E8DDC8 / Deep Glossy Black ground #171819)
  const hemiLight = new THREE.HemisphereLight(0xe8ddc8, 0x171819, 0.5);
  hemiLight.position.set(0, 6, 0);
  scene.add(hemiLight);

  // 3. Overhead Warm Ivory Studio Key Spotlight (#E8DDC8)
  const keySpotLight = new THREE.SpotLight(0xe8ddc8, 34, 16, Math.PI / 4.2, 0.65, 1.5);
  keySpotLight.position.set(2.2, 4.6, 2.8);
  const keySpotTarget = new THREE.Object3D();
  keySpotTarget.position.set(0, 0.85, 0);
  scene.add(keySpotTarget);
  keySpotLight.target = keySpotTarget;

  if (!isSoftwareGl) {
    keySpotLight.castShadow = true;
    keySpotLight.shadow.mapSize.width = 1024;
    keySpotLight.shadow.mapSize.height = 1024;
    keySpotLight.shadow.camera.near = 1.2;
    keySpotLight.shadow.camera.far = 10;
    keySpotLight.shadow.bias = -0.0005;
    keySpotLight.shadow.normalBias = 0.02;
  }
  scene.add(keySpotLight);

  // 4. Mehndi Olive Directional Rim Spotlight (#77795B)
  const oliveRimLight = new THREE.SpotLight(0x77795b, 26, 14, Math.PI / 3.2, 0.75, 1.4);
  oliveRimLight.position.set(-3.0, 2.8, -2.2);
  const rimTarget = new THREE.Object3D();
  rimTarget.position.set(0, 1.0, 0);
  scene.add(rimTarget);
  oliveRimLight.target = rimTarget;
  scene.add(oliveRimLight);

  // 5. Front-Left Soft Warm Ivory Fill Light for Leather Definition (#E8DDC8)
  const warmFillLight = new THREE.DirectionalLight(0xe8ddc8, 1.25);
  warmFillLight.position.set(-2.4, 2.2, 3.4);
  scene.add(warmFillLight);

  // 6. Seamless Grounded Turntable Rings & Radial Contact Shadow Pool
  const floorGroup = new THREE.Group();

  const floorTexture = createSeamlessStudioFloorTexture();
  const floorPlaneGeo = new THREE.PlaneGeometry(3.5, 3.5);
  const floorPlaneMat = new THREE.MeshBasicMaterial({
    map: floorTexture,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });
  const floorPlane = new THREE.Mesh(floorPlaneGeo, floorPlaneMat);
  floorPlane.rotation.x = -Math.PI / 2;
  floorPlane.position.y = 0.002;
  floorGroup.add(floorPlane);

  // Precision architectural turntable ring inlay in Mehndi Olive (#77795B)
  const outerRingGeo = new THREE.RingGeometry(1.12, 1.138, 64);
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: 0x77795b,
    transparent: true,
    opacity: 0.42,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = -Math.PI / 2;
  outerRing.position.y = 0.005;
  floorGroup.add(outerRing);

  const innerRingGeo = new THREE.RingGeometry(0.84, 0.85, 64);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0xe8ddc8,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.x = -Math.PI / 2;
  innerRing.position.y = 0.006;
  floorGroup.add(innerRing);

  scene.add(floorGroup);

  return {
    keySpotLight,
    keySpotTarget,
    oliveRimLight,
    warmFillLight,
    hemiLight,
    floorGroup,
    dispose: () => {
      envTexture.dispose();
      floorTexture.dispose();
      floorPlaneGeo.dispose();
      floorPlaneMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
    },
  };
}
