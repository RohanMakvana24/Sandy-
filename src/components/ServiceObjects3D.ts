import * as THREE from 'three';
import { Service3DObjectType } from '../utils/servicesKinematics';
import { createGroomingToolsAssembly } from './BarberScissorsModel';

export interface ServiceCollection3D {
  rootGroup: THREE.Group;
  stageGroup: THREE.Group;
  backdropHaloGroup: THREE.Group;
  objectGroups: Record<Service3DObjectType, THREE.Group>;
  animateActiveObject: (
    type: Service3DObjectType,
    elapsed: number,
    scrollProgress: number
  ) => void;
  dispose: () => void;
}

/**
 * Creates a rounded rectangular ExtrudeGeometry centered at origin.
 */
function createRoundedSlab(
  w: number,
  h: number,
  d: number,
  r: number,
  bevel = 0.012
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2 - r;
  const hh = h / 2 - r;

  shape.moveTo(-hw, -h / 2);
  shape.lineTo(hw, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -hh);
  shape.lineTo(w / 2, hh);
  shape.quadraticCurveTo(w / 2, h / 2, hw, h / 2);
  shape.lineTo(-hw, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, hh);
  shape.lineTo(-w / 2, -hh);
  shape.quadraticCurveTo(-w / 2, -h / 2, -hw, -h / 2);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.005, d - bevel * 2),
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: r * 0.65,
    bevelThickness: bevel,
    curveSegments: 16,
  });
  geo.center();
  return geo;
}

/**
 * Generates an embossed apothecary bottle label texture in strict brand colors.
 */
function createApothecaryLabelTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#151618';
    ctx.fillRect(0, 0, 512, 256);

    // Top & bottom muted olive borders
    ctx.strokeStyle = '#77795B';
    ctx.lineWidth = 6;
    ctx.strokeRect(12, 16, 488, 224);

    ctx.strokeStyle = 'rgba(230, 215, 188, 0.45)';
    ctx.lineWidth = 2;
    ctx.strokeRect(22, 26, 468, 204);

    // Center brand typography on front face (u = 0.5 -> x = 256)
    ctx.fillStyle = '#989B74';
    ctx.font = '600 18px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SANDY MEN’S SALON · RAJKOT', 256, 78);

    ctx.fillStyle = '#E8DDC8';
    ctx.font = '700 34px Outfit, sans-serif';
    ctx.fillText('BOTANICAL ELIXIR', 256, 128);

    ctx.fillStyle = '#E8DDC8';
    ctx.font = '500 16px Outfit, sans-serif';
    ctx.fillText('REVITALIZING SCALP & HAIR SPA SERUM', 256, 168);

    ctx.fillStyle = '#77795B';
    ctx.fillRect(196, 190, 120, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

/**
 * Builds and caches all 6 luxury 3D grooming service objects in a single scene graph
 * so switching services is instantaneous with zero runtime geometry allocation or WebGL stalls.
 */
export function createServiceCollection3D(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): ServiceCollection3D {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  const enableShadow = (mesh: THREE.Mesh) => {
    if (!isSoftwareGl) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    return mesh;
  };

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const labelTex = createApothecaryLabelTexture(maxAnisotropy);

  // --- Shared PBR Studio Materials (Strict Palette: #171819, #77795B, #E8DDC8, #E8DDC8) ---
  const surgicalSteelMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe8ddc8,
      metalness: 0.96,
      roughness: 0.12,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    })
  );

  const matteOnyxMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x191a1c,
      metalness: 0.18,
      roughness: 0.32,
      clearcoat: 0.22,
      clearcoatRoughness: 0.34,
    })
  );

  const glossObsidianGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x1d1f1c,
      metalness: 0.08,
      roughness: 0.1,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
    })
  );

  const mutedOliveAnodizedMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x77795b,
      metalness: 0.68,
      roughness: 0.26,
      clearcoat: 0.3,
      clearcoatRoughness: 0.22,
    })
  );

  const warmChampagneBrassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6d7bc,
      metalness: 0.92,
      roughness: 0.16,
    })
  );

  const botanicalElixirMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x989b74,
      metalness: 0.15,
      roughness: 0.18,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
    })
  );

  const ivoryCreamMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe8ddc8,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    })
  );

  const bottleLabelMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.36,
      metalness: 0.12,
    })
  );

  const rootGroup = new THREE.Group();
  const stageGroup = new THREE.Group();
  rootGroup.add(stageGroup);

  // ============================================================================
  // 01 — SIGNATURE HAIRCUT: JAPANESE CONVEX BARBER SHEARS
  // ============================================================================
  const scissorsAssembly = createGroomingToolsAssembly(renderer, isSoftwareGl);
  // Hide the backdrop ring inside scissorsAssembly since we have a shared collection halo
  scissorsAssembly.backdropRingGroup.visible = false;
  scissorsAssembly.scissorsGroup.position.set(-0.08, 0.06, 0.06);
  scissorsAssembly.combGroup.position.set(-0.14, -0.32, -0.32);
  const scissorsObjGroup = scissorsAssembly.rootGroup;
  scissorsObjGroup.scale.setScalar(0.84);
  stageGroup.add(scissorsObjGroup);

  // ============================================================================
  // 02 — BEARD STYLING: LUXURY ARTICULATED STRAIGHT RAZOR (CUT-THROAT SHAVETTE)
  // ============================================================================
  const razorObjGroup = new THREE.Group();
  razorObjGroup.visible = false;
  stageGroup.add(razorObjGroup);

  const razorPivotGroup = new THREE.Group();
  razorPivotGroup.position.set(-0.18, -0.14, 0);
  razorObjGroup.add(razorPivotGroup);

  // Sculpted Anodized Olive & Matte Onyx Handle Scales (Left & Right Plates)
  const scaleShape = new THREE.Shape();
  scaleShape.moveTo(-0.08, -0.055);
  scaleShape.quadraticCurveTo(0.48, -0.095, 1.18, -0.045);
  scaleShape.quadraticCurveTo(1.32, 0.0, 1.18, 0.065);
  scaleShape.quadraticCurveTo(0.48, 0.095, -0.08, 0.055);
  scaleShape.quadraticCurveTo(-0.15, 0.0, -0.08, -0.055);

  const scaleGeo = trackGeo(
    new THREE.ExtrudeGeometry(scaleShape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      curveSegments: 24,
    })
  );
  scaleGeo.translate(0, 0, -0.008);

  const handleGroup = new THREE.Group();
  handleGroup.rotation.z = -0.32;
  razorPivotGroup.add(handleGroup);

  for (const side of [-1, 1] as const) {
    const scaleMesh = enableShadow(new THREE.Mesh(scaleGeo, matteOnyxMat));
    scaleMesh.position.z = side * 0.032;
    handleGroup.add(scaleMesh);

    // Muted Olive Inlay Crest on Outer Scale Face
    const inlayGeo = trackGeo(createRoundedSlab(0.82, 0.048, 0.008, 0.018, 0.003));
    const inlayMesh = new THREE.Mesh(inlayGeo, mutedOliveAnodizedMat);
    inlayMesh.position.set(0.54, 0.005, side * 0.042);
    handleGroup.add(inlayMesh);
  }

  // Rear Spacer Wedge & Champagne Brass Rivets
  const spacerGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.055, 20));
  const spacerMesh = new THREE.Mesh(spacerGeo, mutedOliveAnodizedMat);
  spacerMesh.rotation.x = Math.PI / 2;
  spacerMesh.position.set(1.16, 0.008, 0);
  handleGroup.add(spacerMesh);

  const rearRivetGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.095, 20));
  const rearRivet = new THREE.Mesh(rearRivetGeo, warmChampagneBrassMat);
  rearRivet.rotation.x = Math.PI / 2;
  rearRivet.position.set(1.16, 0.008, 0);
  handleGroup.add(rearRivet);

  // Articulated Hollow-Ground Damascus / Surgical Steel Razor Blade & Monkey-Tail Tang
  const razorBladeGroup = new THREE.Group();
  razorBladeGroup.rotation.z = 0.52;
  razorPivotGroup.add(razorBladeGroup);

  const bladeShape = new THREE.Shape();
  // Monkey-tail tang (x = -0.45..0) -> Shank (0..0.28) -> Hollow-ground broad blade (0.28..1.28)
  bladeShape.moveTo(-0.44, 0.035);
  bladeShape.quadraticCurveTo(-0.22, -0.025, 0.0, -0.022);
  bladeShape.lineTo(0.28, -0.020);
  // Dropped beard-shaping cutting edge (y = -0.145)
  bladeShape.lineTo(0.32, -0.135);
  bladeShape.quadraticCurveTo(0.78, -0.152, 1.24, -0.125); // Razor-sharp bellied edge
  // Barber's notch / Dutch point at tip
  bladeShape.quadraticCurveTo(1.29, -0.05, 1.22, 0.048);
  // Thick spine back
  bladeShape.lineTo(0.28, 0.048);
  bladeShape.lineTo(0.0, 0.032);
  bladeShape.quadraticCurveTo(-0.24, 0.018, -0.44, 0.035);

  const razorBladeGeo = trackGeo(
    new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.016,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      curveSegments: 24,
    })
  );
  razorBladeGeo.translate(0, 0, -0.008);

  // Taper cutting edge (y < -0.06) to a surgical 0.2x thickness
  const rbPos = razorBladeGeo.getAttribute('position');
  for (let i = 0; i < rbPos.count; i++) {
    const y = rbPos.getY(i);
    const x = rbPos.getX(i);
    if (x > 0.28 && y < -0.04) {
      const edgeFrac = Math.min(1, (-0.04 - y) / 0.11);
      rbPos.setZ(i, rbPos.getZ(i) * (1 - edgeFrac * 0.78));
    }
  }
  rbPos.needsUpdate = true;
  razorBladeGeo.computeVertexNormals();

  const razorBladeMesh = enableShadow(new THREE.Mesh(razorBladeGeo, surgicalSteelMat));
  razorBladeGroup.add(razorBladeMesh);

  // Thick Polished Spine Rib along top of Razor Blade
  const spineRibGeo = trackGeo(new THREE.CylinderGeometry(0.016, 0.018, 0.96, 20));
  const spineRib = enableShadow(new THREE.Mesh(spineRibGeo, warmChampagneBrassMat));
  spineRib.rotation.z = Math.PI / 2;
  spineRib.position.set(0.75, 0.046, 0);
  razorBladeGroup.add(spineRib);

  // Central Machined Pivot Pin & Olive Washer
  const pivotPin = new THREE.Mesh(rearRivetGeo, warmChampagneBrassMat);
  pivotPin.rotation.x = Math.PI / 2;
  razorPivotGroup.add(pivotPin);

  const pivotWasherGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.088, 24));
  const pivotWasher = new THREE.Mesh(pivotWasherGeo, mutedOliveAnodizedMat);
  pivotWasher.rotation.x = Math.PI / 2;
  razorPivotGroup.add(pivotWasher);

  // ============================================================================
  // 03 — HAIR SPA: PREMIUM BOTANICAL ELIXIR SERUM BOTTLE & PIPETTE DROPPER
  // ============================================================================
  const bottleObjGroup = new THREE.Group();
  bottleObjGroup.visible = false;
  stageGroup.add(bottleObjGroup);

  const flaconGroup = new THREE.Group();
  flaconGroup.position.set(0, -0.58, 0);
  bottleObjGroup.add(flaconGroup);

  const bottleProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.42, 0.0),
    new THREE.Vector2(0.45, 0.04),
    new THREE.Vector2(0.45, 0.76),
    new THREE.Vector2(0.42, 0.85),
    new THREE.Vector2(0.20, 0.98),
    new THREE.Vector2(0.17, 1.04),
    new THREE.Vector2(0.17, 1.18),
    new THREE.Vector2(0.0, 1.18),
  ];
  const flaconGeo = trackGeo(new THREE.LatheGeometry(bottleProfile, 48));
  const flaconMesh = enableShadow(new THREE.Mesh(flaconGeo, glossObsidianGlassMat));
  flaconGroup.add(flaconMesh);

  // Heavy Champagne-Gold Base Pedestal Ring
  const basePedestalGeo = trackGeo(new THREE.CylinderGeometry(0.448, 0.448, 0.045, 48));
  const basePedestal = new THREE.Mesh(basePedestalGeo, warmChampagneBrassMat);
  basePedestal.position.y = 0.024;
  flaconGroup.add(basePedestal);

  // Wrap-Around Embossed Apothecary Label Cylinder
  const labelCylGeo = trackGeo(
    new THREE.CylinderGeometry(0.454, 0.454, 0.52, 48, 1, true)
  );
  const labelCyl = new THREE.Mesh(labelCylGeo, bottleLabelMat);
  labelCyl.rotation.y = -Math.PI / 2;
  labelCyl.position.y = 0.42;
  flaconGroup.add(labelCyl);

  // Upper & Lower Muted Olive Label Trim Rings
  for (const yRing of [0.16, 0.68]) {
    const trimRingGeo = trackGeo(new THREE.TorusGeometry(0.454, 0.008, 12, 48));
    const trimRing = new THREE.Mesh(trimRingGeo, mutedOliveAnodizedMat);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = yRing;
    flaconGroup.add(trimRing);
  }

  // Elevated Pipette Dropper Assembly (poised slightly above bottle neck to reveal serum pipette)
  const dropperGroup = new THREE.Group();
  dropperGroup.position.set(0, 1.24, 0);
  flaconGroup.add(dropperGroup);

  // Knurled Champagne-Gold Dropper Collar
  const dropperCollarGeo = trackGeo(new THREE.CylinderGeometry(0.21, 0.21, 0.16, 36));
  const dropperCollar = enableShadow(new THREE.Mesh(dropperCollarGeo, warmChampagneBrassMat));
  dropperGroup.add(dropperCollar);

  const collarBandGeo = trackGeo(new THREE.TorusGeometry(0.212, 0.010, 12, 36));
  const collarBand = new THREE.Mesh(collarBandGeo, mutedOliveAnodizedMat);
  collarBand.rotation.x = Math.PI / 2;
  dropperGroup.add(collarBand);

  // Sculpted Muted-Olive Soft-Touch Dropper Bulb
  const bulbGeo = trackGeo(new THREE.CapsuleGeometry(0.135, 0.18, 16, 32));
  const bulbMesh = enableShadow(new THREE.Mesh(bulbGeo, mutedOliveAnodizedMat));
  bulbMesh.position.y = 0.18;
  dropperGroup.add(bulbMesh);

  // Glass Pipette Stem & Suspended Botanical Elixir Droplet
  const pipetteGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.016, 0.42, 20));
  const pipetteMesh = new THREE.Mesh(pipetteGeo, surgicalSteelMat);
  pipetteMesh.position.y = -0.22;
  dropperGroup.add(pipetteMesh);

  const dropletGeo = trackGeo(new THREE.SphereGeometry(0.032, 20, 20));
  const dropletMesh = new THREE.Mesh(dropletGeo, botanicalElixirMat);
  dropletMesh.scale.set(0.85, 1.28, 0.85);
  dropletMesh.position.y = -0.45;
  dropperGroup.add(dropletMesh);

  // ============================================================================
  // 04 — HAIR STYLING: PROFESSIONAL SUPERSONIC ARCHITECTURAL HAIR DRYER
  // ============================================================================
  const dryerObjGroup = new THREE.Group();
  dryerObjGroup.visible = false;
  stageGroup.add(dryerObjGroup);

  const dryerPivot = new THREE.Group();
  dryerPivot.position.set(0, 0.16, 0);
  dryerObjGroup.add(dryerPivot);

  // Outer Matte-Onyx Supersonic Turbine Barrel (aligned along X axis)
  const outerBarrelGeo = trackGeo(
    new THREE.CylinderGeometry(0.34, 0.34, 0.76, 48, 1, true)
  );
  const outerBarrel = enableShadow(new THREE.Mesh(outerBarrelGeo, matteOnyxMat));
  outerBarrel.rotation.z = Math.PI / 2;
  dryerPivot.add(outerBarrel);

  // Inner Acoustic Tunnel Cylinder (creates real hollow supersonic ring!)
  const innerTunnelGeo = trackGeo(
    new THREE.CylinderGeometry(0.17, 0.17, 0.78, 36, 1, true)
  );
  const innerTunnel = new THREE.Mesh(innerTunnelGeo, mutedOliveAnodizedMat);
  innerTunnel.rotation.z = Math.PI / 2;
  dryerPivot.add(innerTunnel);

  // Rear Anodized Muted-Olive & Warm-Champagne Concentric Torus Rings (x = -0.38)
  const rearOliveTorusGeo = trackGeo(new THREE.TorusGeometry(0.255, 0.085, 24, 48));
  const rearOliveTorus = enableShadow(
    new THREE.Mesh(rearOliveTorusGeo, mutedOliveAnodizedMat)
  );
  rearOliveTorus.rotation.y = Math.PI / 2;
  rearOliveTorus.scale.set(1.0, 1.0, 0.55);
  rearOliveTorus.position.x = -0.38;
  dryerPivot.add(rearOliveTorus);

  const rearGoldRingGeo = trackGeo(new THREE.TorusGeometry(0.255, 0.012, 16, 48));
  const rearGoldRing = new THREE.Mesh(rearGoldRingGeo, warmChampagneBrassMat);
  rearGoldRing.rotation.y = Math.PI / 2;
  rearGoldRing.position.x = -0.43;
  dryerPivot.add(rearGoldRing);

  // Front Beveled Barrel Face Ring (x = +0.38)
  const frontBevelTorus = enableShadow(
    new THREE.Mesh(rearOliveTorusGeo, matteOnyxMat)
  );
  frontBevelTorus.rotation.y = Math.PI / 2;
  frontBevelTorus.scale.set(1.0, 1.0, 0.55);
  frontBevelTorus.position.x = 0.38;
  dryerPivot.add(frontBevelTorus);

  const frontGoldCollar = new THREE.Mesh(rearGoldRingGeo, warmChampagneBrassMat);
  frontGoldCollar.rotation.y = Math.PI / 2;
  frontGoldCollar.position.x = 0.43;
  dryerPivot.add(frontGoldCollar);

  // Magnetic Wide Styling Concentrator Nozzle (x = +0.44 -> +0.82)
  const nozzleGeo = trackGeo(createRoundedSlab(0.32, 0.54, 0.14, 0.04, 0.015));
  const nozzleMesh = enableShadow(new THREE.Mesh(nozzleGeo, matteOnyxMat));
  nozzleMesh.rotation.y = Math.PI / 2;
  nozzleMesh.position.set(0.58, 0, 0);
  dryerPivot.add(nozzleMesh);

  const nozzleTipRimGeo = trackGeo(createRoundedSlab(0.34, 0.56, 0.025, 0.04, 0.006));
  const nozzleTipRim = new THREE.Mesh(nozzleTipRimGeo, mutedOliveAnodizedMat);
  nozzleTipRim.rotation.y = Math.PI / 2;
  nozzleTipRim.position.set(0.73, 0, 0);
  dryerPivot.add(nozzleTipRim);

  // Ergonomic Balanced Handle Column & Tactile Control Studs
  const dryerHandleGroup = new THREE.Group();
  dryerHandleGroup.position.set(-0.04, -0.62, 0);
  dryerHandleGroup.rotation.z = -0.14;
  dryerPivot.add(dryerHandleGroup);

  const handleShaftGeo = trackGeo(new THREE.CylinderGeometry(0.115, 0.105, 0.92, 32));
  const handleShaft = enableShadow(new THREE.Mesh(handleShaftGeo, matteOnyxMat));
  dryerHandleGroup.add(handleShaft);

  // Brushed Olive Acoustic Filter Mesh Cage at Base of Handle
  const filterCageGeo = trackGeo(new THREE.CylinderGeometry(0.108, 0.106, 0.24, 32));
  const filterCage = enableShadow(new THREE.Mesh(filterCageGeo, mutedOliveAnodizedMat));
  filterCage.position.y = -0.32;
  dryerHandleGroup.add(filterCage);

  const handleCollarRingGeo = trackGeo(new THREE.TorusGeometry(0.116, 0.010, 12, 32));
  const handleCollarRing = new THREE.Mesh(handleCollarRingGeo, warmChampagneBrassMat);
  handleCollarRing.rotation.x = Math.PI / 2;
  handleCollarRing.position.y = 0.26;
  dryerHandleGroup.add(handleCollarRing);

  // Tactile Airflow & Temperature Control Buttons on Handle Back
  for (let b = 0; b < 2; b++) {
    const btnGeo = trackGeo(new THREE.CylinderGeometry(0.024, 0.024, 0.025, 20));
    const btnMesh = new THREE.Mesh(
      btnGeo,
      b === 0 ? warmChampagneBrassMat : mutedOliveAnodizedMat
    );
    btnMesh.rotation.z = Math.PI / 2;
    btnMesh.position.set(-0.112, 0.14 - b * 0.085, 0);
    dryerHandleGroup.add(btnMesh);
  }

  // ============================================================================
  // 05 — FACIAL & SKIN CARE: LUXURY SKINCARE VESSEL & FLOATING SPATULA
  // ============================================================================
  const skincareObjGroup = new THREE.Group();
  skincareObjGroup.visible = false;
  stageGroup.add(skincareObjGroup);

  const jarGroup = new THREE.Group();
  jarGroup.position.set(-0.06, -0.38, 0);
  skincareObjGroup.add(jarGroup);

  // Heavy Beveled Double-Walled Onyx & Olive Cosmetic Jar
  const jarProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.56, 0.0),
    new THREE.Vector2(0.62, 0.06),
    new THREE.Vector2(0.62, 0.48),
    new THREE.Vector2(0.58, 0.52),
    new THREE.Vector2(0.48, 0.52),
    new THREE.Vector2(0.48, 0.60),
    new THREE.Vector2(0.0, 0.60),
  ];
  const jarGeo = trackGeo(new THREE.LatheGeometry(jarProfile, 48));
  const jarMesh = enableShadow(new THREE.Mesh(jarGeo, glossObsidianGlassMat));
  jarGroup.add(jarMesh);

  // Recessed Muted-Olive Center Belly Band Around Jar
  const jarBellyGeo = trackGeo(new THREE.CylinderGeometry(0.625, 0.625, 0.22, 48));
  const jarBelly = enableShadow(new THREE.Mesh(jarBellyGeo, mutedOliveAnodizedMat));
  jarBelly.position.y = 0.27;
  jarGroup.add(jarBelly);

  for (const yTrim of [0.16, 0.38]) {
    const jarGoldRingGeo = trackGeo(new THREE.TorusGeometry(0.626, 0.009, 12, 48));
    const jarGoldRing = new THREE.Mesh(jarGoldRingGeo, warmChampagneBrassMat);
    jarGoldRing.rotation.x = Math.PI / 2;
    jarGoldRing.position.y = yTrim;
    jarGroup.add(jarGoldRing);
  }

  // Rich Whipped Ivory Botanical Cream Swirl Inside the Open Jar
  const creamDomeGeo = trackGeo(new THREE.SphereGeometry(0.45, 32, 20));
  const creamDome = new THREE.Mesh(creamDomeGeo, ivoryCreamMat);
  creamDome.scale.set(1.0, 0.28, 1.0);
  creamDome.position.y = 0.58;
  jarGroup.add(creamDome);

  // Floating Brushed Champagne-Gold & Onyx Lid Poised Above the Jar
  const jarLidGroup = new THREE.Group();
  jarLidGroup.position.set(0.18, 0.86, -0.08);
  jarLidGroup.rotation.set(0.22, -0.18, -0.28);
  jarGroup.add(jarLidGroup);

  const lidCylGeo = trackGeo(new THREE.CylinderGeometry(0.58, 0.60, 0.16, 48));
  const lidCyl = enableShadow(new THREE.Mesh(lidCylGeo, warmChampagneBrassMat));
  jarLidGroup.add(lidCyl);

  const lidTopInlayGeo = trackGeo(new THREE.CylinderGeometry(0.48, 0.48, 0.168, 48));
  const lidTopInlay = new THREE.Mesh(lidTopInlayGeo, matteOnyxMat);
  jarLidGroup.add(lidTopInlay);

  // Sculpted Chrome & Olive Facial Applicator Spatula Poised Beside Jar
  const spatulaGroup = new THREE.Group();
  spatulaGroup.position.set(0.68, 0.38, 0.22);
  spatulaGroup.rotation.set(0.15, -0.25, 0.42);
  jarGroup.add(spatulaGroup);

  const spatulaStemGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.016, 0.72, 20));
  const spatulaStem = enableShadow(new THREE.Mesh(spatulaStemGeo, surgicalSteelMat));
  spatulaGroup.add(spatulaStem);

  const spatulaPaddleGeo = trackGeo(new THREE.SphereGeometry(0.068, 24, 24));
  const spatulaPaddle = enableShadow(new THREE.Mesh(spatulaPaddleGeo, warmChampagneBrassMat));
  spatulaPaddle.scale.set(0.85, 1.45, 0.25);
  spatulaPaddle.position.y = 0.38;
  spatulaGroup.add(spatulaPaddle);

  // ============================================================================
  // 06 — HAIR COLOR: ATELIER MIXING BOWL & PRECISION TINT BRUSH
  // ============================================================================
  const colorBowlObjGroup = new THREE.Group();
  colorBowlObjGroup.visible = false;
  stageGroup.add(colorBowlObjGroup);

  const bowlGroup = new THREE.Group();
  bowlGroup.position.set(-0.05, -0.36, 0);
  bowlGroup.rotation.x = 0.16;
  colorBowlObjGroup.add(bowlGroup);

  // Sculpted Apothecary Mixing Bowl Lathe Profile
  const bowlProfile = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.42, 0.0),
    new THREE.Vector2(0.46, 0.04),
    new THREE.Vector2(0.58, 0.28),
    new THREE.Vector2(0.68, 0.56),
    new THREE.Vector2(0.64, 0.58),
    new THREE.Vector2(0.52, 0.30),
    new THREE.Vector2(0.38, 0.08),
    new THREE.Vector2(0.0, 0.08),
  ];
  const bowlGeo = trackGeo(new THREE.LatheGeometry(bowlProfile, 48));
  const bowlMesh = enableShadow(new THREE.Mesh(bowlGeo, matteOnyxMat));
  bowlGroup.add(bowlMesh);

  // Muted Olive Anodized Rim & Base Grip Ring on Mixing Bowl
  const bowlRimGeo = trackGeo(new THREE.TorusGeometry(0.66, 0.022, 16, 48));
  const bowlRim = enableShadow(new THREE.Mesh(bowlRimGeo, mutedOliveAnodizedMat));
  bowlRim.rotation.x = Math.PI / 2;
  bowlRim.position.y = 0.57;
  bowlGroup.add(bowlRim);

  const bowlBaseRingGeo = trackGeo(new THREE.TorusGeometry(0.44, 0.018, 14, 48));
  const bowlBaseRing = new THREE.Mesh(bowlBaseRingGeo, warmChampagneBrassMat);
  bowlBaseRing.rotation.x = Math.PI / 2;
  bowlBaseRing.position.y = 0.025;
  bowlGroup.add(bowlBaseRing);

  // Side Ergonomic Grip Handle on Mixing Bowl
  const sideGripGeo = trackGeo(createRoundedSlab(0.28, 0.055, 0.24, 0.03, 0.012));
  const sideGrip = enableShadow(new THREE.Mesh(sideGripGeo, mutedOliveAnodizedMat));
  sideGrip.rotation.z = -0.18;
  sideGrip.position.set(-0.74, 0.52, 0);
  bowlGroup.add(sideGrip);

  // Satin Color Emulsion Fill Inside Mixing Bowl
  const emulsionGeo = trackGeo(new THREE.CylinderGeometry(0.54, 0.38, 0.14, 40));
  const emulsionMesh = new THREE.Mesh(emulsionGeo, botanicalElixirMat);
  emulsionMesh.position.y = 0.24;
  bowlGroup.add(emulsionMesh);

  // Precision Salon Tinting Brush Poised Across the Mixing Bowl
  const tintBrushGroup = new THREE.Group();
  tintBrushGroup.position.set(0.14, 0.64, 0.06);
  tintBrushGroup.rotation.set(0.12, -0.22, -0.58);
  bowlGroup.add(tintBrushGroup);

  // Tapered Sectioning Tail & Handle
  const brushTailGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.004, 0.96, 20));
  const brushTail = enableShadow(new THREE.Mesh(brushTailGeo, matteOnyxMat));
  brushTail.position.y = 0.32;
  tintBrushGroup.add(brushTail);

  // Champagne-Gold Ferrule Collar
  const brushFerruleGeo = trackGeo(createRoundedSlab(0.36, 0.095, 0.045, 0.02, 0.008));
  const brushFerrule = enableShadow(
    new THREE.Mesh(brushFerruleGeo, warmChampagneBrassMat)
  );
  brushFerrule.position.y = -0.18;
  tintBrushGroup.add(brushFerrule);

  const brushPaddleGeo = trackGeo(createRoundedSlab(0.42, 0.11, 0.052, 0.02, 0.008));
  const brushPaddle = enableShadow(
    new THREE.Mesh(brushPaddleGeo, mutedOliveAnodizedMat)
  );
  brushPaddle.position.y = -0.24;
  tintBrushGroup.add(brushPaddle);

  // 22 Sculpted Synthetic Tint Bristle Tufts
  for (let b = 0; b < 22; b++) {
    const bx = -0.18 + (b / 21) * 0.36;
    const tuftGeo = trackGeo(new THREE.CylinderGeometry(0.006, 0.004, 0.16, 8));
    const tuftMesh = new THREE.Mesh(tuftGeo, ivoryCreamMat);
    tuftMesh.position.set(bx, -0.36, 0);
    tintBrushGroup.add(tuftMesh);
  }

  // ============================================================================
  // SHARED ARCHITECTURAL STUDIO HALO RING BEHIND ACTIVE INSTRUMENT
  // ============================================================================
  const backdropHaloGroup = new THREE.Group();
  backdropHaloGroup.position.set(0, 0.0, -0.68);
  rootGroup.add(backdropHaloGroup);

  const halo1Geo = trackGeo(new THREE.TorusGeometry(0.76, 0.003, 12, 96));
  const halo1 = new THREE.Mesh(halo1Geo, mutedOliveAnodizedMat);
  backdropHaloGroup.add(halo1);

  const halo2Geo = trackGeo(new THREE.TorusGeometry(0.86, 0.002, 12, 96));
  const halo2 = new THREE.Mesh(halo2Geo, warmChampagneBrassMat);
  backdropHaloGroup.add(halo2);

  for (let n = 0; n < 4; n++) {
    const ang = (n / 4) * Math.PI * 2 + Math.PI / 4;
    const markerGeo = trackGeo(new THREE.OctahedronGeometry(0.014, 0));
    const marker = new THREE.Mesh(
      markerGeo,
      n % 2 === 0 ? warmChampagneBrassMat : mutedOliveAnodizedMat
    );
    marker.position.set(Math.cos(ang) * 0.86, Math.sin(ang) * 0.86, 0);
    backdropHaloGroup.add(marker);
  }

  const objectGroups: Record<Service3DObjectType, THREE.Group> = {
    scissors: scissorsObjGroup,
    razor: razorObjGroup,
    bottle: bottleObjGroup,
    dryer: dryerObjGroup,
    skincare: skincareObjGroup,
    colorbowl: colorBowlObjGroup,
  };

  const animateActiveObject = (
    type: Service3DObjectType,
    elapsed: number,
    scrollProgress: number
  ) => {
    const wave = Math.sin(elapsed * 1.6);
    if (type === 'scissors') {
      const spread = 0.22 + Math.sin(elapsed * 1.4 + scrollProgress * Math.PI) * 0.08;
      scissorsAssembly.upperBladeGroup.rotation.z = spread * 0.5;
      scissorsAssembly.lowerBladeGroup.rotation.z = -spread * 0.5;
      scissorsAssembly.combGroup.position.y = -0.32 - wave * 0.025;
    } else if (type === 'razor') {
      razorBladeGroup.rotation.z = 0.52 + wave * 0.06;
      handleGroup.rotation.z = -0.32 - wave * 0.03;
    } else if (type === 'bottle') {
      dropperGroup.position.y = 1.24 + wave * 0.04;
      dropperGroup.rotation.y = elapsed * 0.35;
    } else if (type === 'dryer') {
      nozzleMesh.position.x = 0.58 + wave * 0.02;
      nozzleTipRim.position.x = 0.73 + wave * 0.02;
    } else if (type === 'skincare') {
      jarLidGroup.position.y = 0.86 + wave * 0.035;
      spatulaGroup.position.y = 0.38 - wave * 0.03;
    } else if (type === 'colorbowl') {
      tintBrushGroup.rotation.z = -0.58 + wave * 0.06;
      tintBrushGroup.position.y = 0.64 + wave * 0.025;
    }
  };

  return {
    rootGroup,
    stageGroup,
    backdropHaloGroup,
    objectGroups,
    animateActiveObject,
    dispose: () => {
      scissorsAssembly.dispose();
      labelTex.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
