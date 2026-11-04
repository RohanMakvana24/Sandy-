import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export interface SeatedClientRig {
  lowerBodyGroup: THREE.Group;
  upperBodyGroup: THREE.Group;
  chestBreathGroup: THREE.Group;
  headGroup: THREE.Group;
  dispose: () => void;
}

/**
 * Rotates `bone` in world space so the vector from `bone` to `childBone`
 * aligns with `targetWorldDir`.
 */
function aimBoneWorld(
  root: THREE.Object3D,
  bone: THREE.Object3D | undefined,
  childBone: THREE.Object3D | undefined,
  targetWorldDir: THREE.Vector3
): void {
  if (!bone || !childBone) return;
  root.updateMatrixWorld(true);

  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  bone.getWorldPosition(p0);
  childBone.getWorldPosition(p1);

  const curDir = p1.sub(p0).normalize();
  const desired = targetWorldDir.clone().normalize();
  const rotWorld = new THREE.Quaternion().setFromUnitVectors(curDir, desired);

  const parentQuat = new THREE.Quaternion();
  if (bone.parent) {
    bone.parent.getWorldQuaternion(parentQuat);
  }
  const boneWorldQuat = new THREE.Quaternion();
  bone.getWorldQuaternion(boneWorldQuat);

  const newWorldQuat = rotWorld.multiply(boneWorldQuat);
  bone.quaternion.copy(parentQuat.invert().multiply(newWorldQuat));
  root.updateMatrixWorld(true);
}

/**
 * Recolors the embedded suit/footwear/headwear texture on a 2D canvas so any pink/magenta
 * garment pixels become bespoke Charcoal-Black (#1d1f21) & Muted Olive Green (#77795B)
 * while preserving every real fabric wrinkle, button, stitch, and white dress shirt collar.
 */
function recolorGarmentTextureToBrandPalette(
  origTex: THREE.Texture,
  mode: 'top' | 'bottom' | 'footwear' | 'headwear',
  maxAnisotropy: number
): THREE.CanvasTexture | null {
  const img = origTex.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap | undefined;
  if (!img || !('width' in img) || img.width === 0) return null;

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(img as CanvasImageSource, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (mode === 'headwear') {
      // Dark espresso hair & charcoal-olive hat trim
      if (g > r && g > b) {
        const scale = 0.35 + lum * 0.75;
        data[i] = Math.min(255, Math.floor(119 * scale));
        data[i + 1] = Math.min(255, Math.floor(121 * scale));
        data[i + 2] = Math.min(255, Math.floor(91 * scale));
      } else {
        const v = Math.floor(lum * 44 + 12);
        data[i] = v + 2;
        data[i + 1] = v + 1;
        data[i + 2] = v;
      }
      continue;
    }

    if (mode === 'footwear') {
      // Deep burnished onyx-black dress shoes
      const v = Math.floor(lum * 46 + 10);
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v + 2;
      continue;
    }

    if (mode === 'bottom') {
      // Tailored charcoal-black wool trousers
      const v = Math.floor(lum * 52 + 14);
      data[i] = v;
      data[i + 1] = v + 1;
      data[i + 2] = v + 3;
      continue;
    }

    // For 'top': distinguish white shirt (high r,g,b with low saturation) vs vest (magenta) vs jacket (salmon)
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

    if (lum > 0.78 && sat < 0.16) {
      // Crisp warm ivory dress shirt (#E8DDC8)
      data[i] = Math.min(255, Math.floor(lum * 245));
      data[i + 1] = Math.min(255, Math.floor(lum * 240));
      data[i + 2] = Math.min(255, Math.floor(lum * 232));
    } else if (b > g + 8 && r > g + 25) {
      // Waistcoat / Vest -> Muted Olive Green (#77795B)
      const scale = 0.35 + lum * 0.85;
      data[i] = Math.min(255, Math.floor(119 * scale));
      data[i + 1] = Math.min(255, Math.floor(121 * scale));
      data[i + 2] = Math.min(255, Math.floor(91 * scale));
    } else {
      // Suit Jacket & Lapels -> Bespoke Charcoal-Black (#1c1e20)
      const v = Math.floor(lum * 56 + 14);
      data[i] = v;
      data[i + 1] = v + 1;
      data[i + 2] = v + 2;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const newTex = new THREE.CanvasTexture(canvas);
  newTex.colorSpace = THREE.SRGBColorSpace;
  newTex.flipY = origTex.flipY;
  newTex.wrapS = origTex.wrapS;
  newTex.wrapT = origTex.wrapT;
  newTex.anisotropy = maxAnisotropy;
  newTex.needsUpdate = true;
  return newTex;
}

/**
 * Loads the real rigged 3D gentleman model (/models/readyplayer.glb),
 * styles his bespoke suit in Sandy Men's Salon brand colors (#171819 & #77795B),
 * and poses his humanoid skeleton naturally inside the luxury barber chair.
 */
export function createSeatedClientRig(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  onModelLoaded?: () => void
): SeatedClientRig {
  const lowerBodyGroup = new THREE.Group();
  const upperBodyGroup = new THREE.Group();
  const chestBreathGroup = new THREE.Group();
  const headGroup = new THREE.Group();

  const customTextures: THREE.Texture[] = [];

  let loadedScene: THREE.Group | null = null;
  let headBoneRef: THREE.Object3D | null = null;
  let spine2BoneRef: THREE.Object3D | null = null;
  let baseHeadQuat: THREE.Quaternion | null = null;
  let isDisposed = false;

  const loader = new GLTFLoader();
  loader.load(
    '/models/readyplayer.glb',
    (gltf) => {
      if (isDisposed) return;

      const model = gltf.scene;
      loadedScene = model;

      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

      model.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.frustumCulled = false;
          if (!isSoftwareGl) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }

          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (!mat) return;

          if (mat.name === 'Wolf3D_Headwear' && mat.map) {
            const recolored = recolorGarmentTextureToBrandPalette(
              mat.map,
              'headwear',
              maxAnisotropy
            );
            if (recolored) {
              customTextures.push(recolored);
              mat.map = recolored;
            }
          } else if (mat.name === 'Wolf3D_Beard') {
            mat.color.setHex(0x28221e);
            mat.roughness = 0.5;
          } else if (mat.name === 'Wolf3D_Outfit_Top' && mat.map) {
            const recolored = recolorGarmentTextureToBrandPalette(
              mat.map,
              'top',
              maxAnisotropy
            );
            if (recolored) {
              customTextures.push(recolored);
              mat.map = recolored;
            }
          } else if (mat.name === 'Wolf3D_Outfit_Bottom' && mat.map) {
            const recolored = recolorGarmentTextureToBrandPalette(
              mat.map,
              'bottom',
              maxAnisotropy
            );
            if (recolored) {
              customTextures.push(recolored);
              mat.map = recolored;
            }
          } else if (mat.name === 'Wolf3D_Outfit_Footwear' && mat.map) {
            const recolored = recolorGarmentTextureToBrandPalette(
              mat.map,
              'footwear',
              maxAnisotropy
            );
            if (recolored) {
              customTextures.push(recolored);
              mat.map = recolored;
            }
          }

          if (mat.map) mat.map.anisotropy = maxAnisotropy;
          if (mat.normalMap) mat.normalMap.anisotropy = maxAnisotropy;
          if (mat.roughnessMap) mat.roughnessMap.anisotropy = maxAnisotropy;
          mat.needsUpdate = true;
        }
      });

      // Scale & position the rigged 3D gentleman so his hips sit on the leather seat cushion,
      // back rests against the quilted backrest, arms rest on the padded armrests,
      // and shoes rest on the chrome footrest.
      model.scale.setScalar(1.24);
      model.position.set(0, -0.34, -0.09);

      const getNode = (name: string): THREE.Object3D | undefined =>
        model.getObjectByName(name);

      const hips = getNode('Hips');
      const spine = getNode('Spine');
      const spine1 = getNode('Spine1');
      const spine2 = getNode('Spine2');
      const neck = getNode('Neck');
      const head = getNode('Head');

      if (hips) hips.rotateX(-0.15);
      if (spine) spine.rotateX(-0.04);
      if (spine1) spine1.rotateX(-0.04);
      if (spine2) spine2.rotateX(-0.02);
      if (neck) neck.rotateX(0.16);
      if (head) head.rotateX(0.06);

      // Pose thighs forward along the seat cushion
      aimBoneWorld(
        model,
        getNode('LeftUpLeg'),
        getNode('LeftLeg'),
        new THREE.Vector3(0.07, -0.05, 0.98)
      );
      aimBoneWorld(
        model,
        getNode('RightUpLeg'),
        getNode('RightLeg'),
        new THREE.Vector3(-0.07, -0.05, 0.98)
      );

      // Pose lower legs down along the padded calf rest toward the chrome footrest
      aimBoneWorld(
        model,
        getNode('LeftLeg'),
        getNode('LeftFoot'),
        new THREE.Vector3(0.01, -0.88, 0.48)
      );
      aimBoneWorld(
        model,
        getNode('RightLeg'),
        getNode('RightFoot'),
        new THREE.Vector3(-0.01, -0.88, 0.48)
      );

      // Pose feet flat on the footrest platform
      aimBoneWorld(
        model,
        getNode('LeftFoot'),
        getNode('LeftToeBase'),
        new THREE.Vector3(0.05, -0.15, 0.98)
      );
      aimBoneWorld(
        model,
        getNode('RightFoot'),
        getNode('RightToeBase'),
        new THREE.Vector3(-0.05, -0.15, 0.98)
      );

      // Pose upper arms down and outward toward the rear of the padded leather armrests
      aimBoneWorld(
        model,
        getNode('LeftArm'),
        getNode('LeftForeArm'),
        new THREE.Vector3(0.68, -0.68, 0.26)
      );
      aimBoneWorld(
        model,
        getNode('RightArm'),
        getNode('RightForeArm'),
        new THREE.Vector3(-0.68, -0.68, 0.26)
      );

      // Pose forearms resting forward along the leather armrest pads
      aimBoneWorld(
        model,
        getNode('LeftForeArm'),
        getNode('LeftHand'),
        new THREE.Vector3(0.04, -0.04, 0.99)
      );
      aimBoneWorld(
        model,
        getNode('RightForeArm'),
        getNode('RightHand'),
        new THREE.Vector3(-0.04, -0.04, 0.99)
      );

      // Relax wrists & palms onto the armrest surface
      const leftHand = getNode('LeftHand');
      const rightHand = getNode('RightHand');
      if (leftHand) {
        leftHand.rotateZ(-0.35);
        leftHand.rotateX(0.15);
      }
      if (rightHand) {
        rightHand.rotateZ(0.35);
        rightHand.rotateX(0.15);
      }

      if (head) {
        headBoneRef = head;
        baseHeadQuat = head.quaternion.clone();
      }
      if (spine2) {
        spine2BoneRef = spine2;
      }

      model.updateMatrixWorld(true);
      lowerBodyGroup.add(model);

      if (onModelLoaded) {
        onModelLoaded();
      }
    },
    undefined,
    () => {
      // Fallback handled gracefully if asset fails
    }
  );

  // Sync subtle headGroup / chestBreathGroup updates from the scene animation loop
  const syncProxyMesh = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  syncProxyMesh.frustumCulled = false;
  syncProxyMesh.onBeforeRender = () => {
    if (headBoneRef && baseHeadQuat) {
      const eulerOffset = new THREE.Euler(
        headGroup.rotation.x * 0.6,
        headGroup.rotation.y * 0.8,
        0,
        'YXZ'
      );
      const qOffset = new THREE.Quaternion().setFromEuler(eulerOffset);
      headBoneRef.quaternion.copy(baseHeadQuat).multiply(qOffset);
    }
    if (spine2BoneRef) {
      spine2BoneRef.scale.set(
        chestBreathGroup.scale.x,
        chestBreathGroup.scale.y,
        chestBreathGroup.scale.z
      );
    }
  };
  lowerBodyGroup.add(syncProxyMesh);

  return {
    lowerBodyGroup,
    upperBodyGroup,
    chestBreathGroup,
    headGroup,
    dispose: () => {
      isDisposed = true;
      syncProxyMesh.geometry.dispose();
      (syncProxyMesh.material as THREE.Material).dispose();
      customTextures.forEach((t) => t.dispose());
      if (loadedScene) {
        loadedScene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const m = obj as THREE.Mesh;
            m.geometry?.dispose();
            if (Array.isArray(m.material)) {
              m.material.forEach((mat) => mat.dispose());
            } else {
              m.material?.dispose();
            }
          }
        });
      }
    },
  };
}
