import * as THREE from 'three';
import { createSeatedClientRig, SeatedClientRig } from './SeatedClientModel';

export interface BarberChairAssembly {
  rootGroup: THREE.Group;
  chairGroup: THREE.Group;
  reclinePivot: THREE.Group;
  headrestGroup: THREE.Group;
  floatingAccentsGroup: THREE.Group;
  clientRig: SeatedClientRig;
  dispose: () => void;
}

/**
 * Generates procedural diamond-quilted & pebble-grained luxury leather textures
 * (albedo map + bump/roughness map) with zero external file dependencies.
 */
function createLeatherTextures(maxAnisotropy: number): {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;

  // 1. Albedo Canvas (Deep Onyx #171819 with subtle warm-olive stitch threads)
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d');

  // 2. Bump Canvas (Grayscale heightmap for quilted channels + leather grain)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx && bCtx) {
    aCtx.fillStyle = '#191a1c';
    aCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#d8d8d8';
    bCtx.fillRect(0, 0, size, size);

    // Fine pebble leather micro-grain (deterministic PRNG)
    let seed = 42;
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < 4500; i++) {
      const x = nextRand() * size;
      const y = nextRand() * size;
      const r = 1 + nextRand() * 2.2;
      const shade = Math.floor(175 + nextRand() * 55);
      bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Diamond Quilted Seam Creases
    const step = 64;
    bCtx.strokeStyle = '#404040';
    bCtx.lineWidth = 5;
    aCtx.strokeStyle = '#111213';
    aCtx.lineWidth = 3;

    for (let offset = -size; offset <= size * 2; offset += step) {
      // Diagonal /
      bCtx.beginPath();
      bCtx.moveTo(offset, 0);
      bCtx.lineTo(offset + size, size);
      bCtx.stroke();

      aCtx.beginPath();
      aCtx.moveTo(offset, 0);
      aCtx.lineTo(offset + size, size);
      aCtx.stroke();

      // Diagonal \
      bCtx.beginPath();
      bCtx.moveTo(offset, size);
      bCtx.lineTo(offset + size, 0);
      bCtx.stroke();

      aCtx.beginPath();
      aCtx.moveTo(offset, size);
      aCtx.lineTo(offset + size, 0);
      aCtx.stroke();
    }

    // Subtle Muted Olive-Ivory Double Stitch Dashes alongside seams
    aCtx.strokeStyle = 'rgba(155, 158, 122, 0.32)';
    aCtx.lineWidth = 1;
    aCtx.setLineDash([4, 4]);
    for (let offset = -size; offset <= size * 2; offset += step) {
      aCtx.beginPath();
      aCtx.moveTo(offset + 3, 0);
      aCtx.lineTo(offset + size + 3, size);
      aCtx.stroke();
    }
    aCtx.setLineDash([]);
  }

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.RepeatWrapping;
  albedoMap.repeat.set(2.5, 2.5);
  albedoMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2.5, 2.5);
  bumpMap.anisotropy = maxAnisotropy;

  return { albedoMap, bumpMap };
}

/**
 * Helper to create a rounded rectangular ExtrudeGeometry centered at origin.
 */
function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  bevelThickness = 0.025
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const w = width / 2 - radius;
  const h = height / 2 - radius;

  shape.moveTo(-w, -height / 2);
  shape.lineTo(w, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -h);
  shape.lineTo(width / 2, h);
  shape.quadraticCurveTo(width / 2, height / 2, w, height / 2);
  shape.lineTo(-w, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, h);
  shape.lineTo(-width / 2, -h);
  shape.quadraticCurveTo(-width / 2, -height / 2, -w, -height / 2);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - bevelThickness * 2),
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: radius * 0.65,
    bevelThickness,
    curveSegments: 12,
  });
  geo.center();
  return geo;
}

export function createBarberChairAssembly(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  onModelLoaded?: () => void
): BarberChairAssembly {
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

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const { albedoMap, bumpMap } = createLeatherTextures(maxAnisotropy);

  // --- PBR Materials Library (Strict Brand Palette: #171819, #77795B, #E8DDC8, #E8DDC8) ---
  const quiltedLeatherMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: albedoMap,
      bumpMap,
      bumpScale: 0.016,
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.26,
      clearcoatRoughness: 0.38,
    })
  );

  const smoothBolsterLeatherMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x18191b,
      bumpMap,
      bumpScale: 0.006,
      roughness: 0.36,
      metalness: 0.1,
      clearcoat: 0.32,
      clearcoatRoughness: 0.32,
    })
  );

  const polishedChromeMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe8ddc8,
      metalness: 0.96,
      roughness: 0.12,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    })
  );

  const darkGunmetalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e2022,
      metalness: 0.84,
      roughness: 0.28,
    })
  );

  const mutedOliveAnodizedMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x77795b,
      metalness: 0.62,
      roughness: 0.32,
      clearcoat: 0.25,
      clearcoatRoughness: 0.3,
    })
  );

  const warmChampagneTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6d7bc,
      metalness: 0.88,
      roughness: 0.22,
    })
  );

  const rootGroup = new THREE.Group();
  const chairGroup = new THREE.Group();
  rootGroup.add(chairGroup);

  const enableShadow = (mesh: THREE.Mesh) => {
    if (!isSoftwareGl) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    return mesh;
  };

  // ============================================================================
  // 1. HEAVY HYDRAULIC BASE & PUMP PEDAL ASSEMBLY (Grounded at y = 0)
  // ============================================================================
  const basePoints = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.68, 0.0),
    new THREE.Vector2(0.68, 0.025),
    new THREE.Vector2(0.63, 0.055),
    new THREE.Vector2(0.42, 0.11),
    new THREE.Vector2(0.22, 0.16),
    new THREE.Vector2(0.16, 0.23),
    new THREE.Vector2(0.14, 0.25),
    new THREE.Vector2(0.0, 0.25),
  ];
  const basePlateGeo = trackGeo(new THREE.LatheGeometry(basePoints, 48));
  const basePlateMesh = enableShadow(new THREE.Mesh(basePlateGeo, polishedChromeMat));
  chairGroup.add(basePlateMesh);

  // Base Floor Rubber Gasket Ring + Olive Trim Collar
  const gasketGeo = trackGeo(new THREE.TorusGeometry(0.675, 0.018, 12, 48));
  const gasketMesh = new THREE.Mesh(gasketGeo, darkGunmetalMat);
  gasketMesh.rotation.x = Math.PI / 2;
  gasketMesh.position.y = 0.018;
  chairGroup.add(gasketMesh);

  const baseOliveRingGeo = trackGeo(new THREE.TorusGeometry(0.42, 0.012, 12, 48));
  const baseOliveRing = new THREE.Mesh(baseOliveRingGeo, mutedOliveAnodizedMat);
  baseOliveRing.rotation.x = Math.PI / 2;
  baseOliveRing.position.y = 0.112;
  chairGroup.add(baseOliveRing);

  // Telescoping Hydraulic Column & Shroud
  const outerColumnGeo = trackGeo(new THREE.CylinderGeometry(0.125, 0.138, 0.34, 32));
  const outerColumn = enableShadow(new THREE.Mesh(outerColumnGeo, darkGunmetalMat));
  outerColumn.position.y = 0.36;
  chairGroup.add(outerColumn);

  const innerPistonGeo = trackGeo(new THREE.CylinderGeometry(0.085, 0.085, 0.32, 32));
  const innerPiston = enableShadow(new THREE.Mesh(innerPistonGeo, polishedChromeMat));
  innerPiston.position.y = 0.56;
  chairGroup.add(innerPiston);

  // Foot Hydraulic Pump Lever & Step Pad
  const pumpRodGeo = trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 0.42, 16));
  const pumpRod = enableShadow(new THREE.Mesh(pumpRodGeo, polishedChromeMat));
  pumpRod.rotation.z = Math.PI / 3.1;
  pumpRod.rotation.y = -0.55;
  pumpRod.position.set(-0.24, 0.31, -0.18);
  chairGroup.add(pumpRod);

  const pumpPedalGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.11, 20));
  const pumpPedal = enableShadow(new THREE.Mesh(pumpPedalGeo, mutedOliveAnodizedMat));
  pumpPedal.rotation.x = Math.PI / 2;
  pumpPedal.rotation.z = -0.55;
  pumpPedal.position.set(-0.38, 0.22, -0.28);
  chairGroup.add(pumpPedal);

  // Under-Seat Cast Iron & Olive Swivel Yoke Cradle
  const yokeGeo = trackGeo(createRoundedBoxGeometry(0.68, 0.11, 0.62, 0.04, 0.02));
  const yokeMesh = enableShadow(new THREE.Mesh(yokeGeo, darkGunmetalMat));
  yokeMesh.position.set(0, 0.69, -0.02);
  chairGroup.add(yokeMesh);

  // ============================================================================
  // 2. PLUSH QUILTED BLACK LEATHER SEAT CUSHION & SIDE BOLSTERS
  // ============================================================================
  const seatGroup = new THREE.Group();
  seatGroup.position.set(0, 0.81, 0.02);
  chairGroup.add(seatGroup);

  // Main Center Quilted Seat Cushion
  const mainSeatGeo = trackGeo(createRoundedBoxGeometry(0.84, 0.16, 0.78, 0.07, 0.035));
  const mainSeatMesh = enableShadow(new THREE.Mesh(mainSeatGeo, quiltedLeatherMat));
  seatGroup.add(mainSeatMesh);

  // Left & Right Raised Thigh Side Bolsters
  const thighBolsterGeo = trackGeo(createRoundedBoxGeometry(0.14, 0.19, 0.76, 0.055, 0.025));
  const leftThighBolster = enableShadow(new THREE.Mesh(thighBolsterGeo, smoothBolsterLeatherMat));
  leftThighBolster.position.set(-0.41, 0.025, 0);
  seatGroup.add(leftThighBolster);

  const rightThighBolster = enableShadow(new THREE.Mesh(thighBolsterGeo, smoothBolsterLeatherMat));
  rightThighBolster.position.set(0.41, 0.025, 0);
  seatGroup.add(rightThighBolster);

  // Muted Olive Green (#77795B) Perimeter Piping Welt around the Seat
  const seatWeltGeo = trackGeo(createRoundedBoxGeometry(0.96, 0.022, 0.81, 0.04, 0.01));
  const seatWelt = new THREE.Mesh(seatWeltGeo, mutedOliveAnodizedMat);
  seatWelt.position.set(0, -0.068, 0);
  seatGroup.add(seatWelt);

  // ============================================================================
  // 3. SCULPTED SWAN-NECK CAST CHROME ARMRESTS & PADDED ARM CUSHIONS
  // ============================================================================
  const buildArmrestSide = (side: -1 | 1) => {
    const armSideGroup = new THREE.Group();
    const xPos = side * 0.54;

    // Rear Vertical Chrome Stanchion Pillar
    const rearPillarGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.038, 0.42, 24));
    const rearPillar = enableShadow(new THREE.Mesh(rearPillarGeo, polishedChromeMat));
    rearPillar.position.set(xPos, 0.98, -0.24);
    armSideGroup.add(rearPillar);

    // Front Sweeping Swan-Neck Chrome Column
    const frontPillarGeo = trackGeo(new THREE.CylinderGeometry(0.034, 0.042, 0.40, 24));
    const frontPillar = enableShadow(new THREE.Mesh(frontPillarGeo, polishedChromeMat));
    frontPillar.rotation.x = 0.14;
    frontPillar.position.set(xPos, 0.97, 0.25);
    armSideGroup.add(frontPillar);

    // Lower Chrome Side Skirt Plate with Olive Inlay Badge
    const sidePlateGeo = trackGeo(createRoundedBoxGeometry(0.055, 0.13, 0.68, 0.03, 0.015));
    const sidePlate = enableShadow(new THREE.Mesh(sidePlateGeo, polishedChromeMat));
    sidePlate.position.set(xPos, 0.80, 0.0);
    armSideGroup.add(sidePlate);

    const sideOliveInlayGeo = trackGeo(createRoundedBoxGeometry(0.062, 0.045, 0.46, 0.015, 0.008));
    const sideOliveInlay = new THREE.Mesh(sideOliveInlayGeo, mutedOliveAnodizedMat);
    sideOliveInlay.position.set(xPos, 0.80, 0.0);
    armSideGroup.add(sideOliveInlay);

    // Plush Upholstered Leather Armrest Pad
    const armPadGeo = trackGeo(createRoundedBoxGeometry(0.145, 0.085, 0.74, 0.04, 0.022));
    const armPad = enableShadow(new THREE.Mesh(armPadGeo, smoothBolsterLeatherMat));
    armPad.position.set(xPos, 1.19, 0.03);
    armSideGroup.add(armPad);

    // Front Cast-Chrome Scroll Knuckle Cap
    const knuckleGeo = trackGeo(new THREE.SphereGeometry(0.058, 24, 24));
    const knuckle = enableShadow(new THREE.Mesh(knuckleGeo, polishedChromeMat));
    knuckle.scale.set(1.1, 0.85, 1.3);
    knuckle.position.set(xPos, 1.165, 0.39);
    armSideGroup.add(knuckle);

    // Warm Champagne Accent Stud on Front Knuckle
    const studGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.022, 0.095, 20));
    const stud = new THREE.Mesh(studGeo, warmChampagneTrimMat);
    stud.rotation.z = Math.PI / 2;
    stud.position.set(xPos, 1.165, 0.41);
    armSideGroup.add(stud);

    chairGroup.add(armSideGroup);
  };

  buildArmrestSide(-1);
  buildArmrestSide(1);

  // Side Recline Lever Handle (Right Side)
  const leverShaftGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 16));
  const leverShaft = enableShadow(new THREE.Mesh(leverShaftGeo, polishedChromeMat));
  leverShaft.rotation.x = -Math.PI / 5;
  leverShaft.position.set(0.61, 0.92, -0.12);
  chairGroup.add(leverShaft);

  const leverKnobGeo = trackGeo(new THREE.SphereGeometry(0.028, 20, 20));
  const leverKnob = enableShadow(new THREE.Mesh(leverKnobGeo, mutedOliveAnodizedMat));
  leverKnob.position.set(0.61, 1.03, -0.20);
  chairGroup.add(leverKnob);

  // ============================================================================
  // 4. ARTICULATED RECLINING BACKREST & ADJUSTABLE HEADREST (reclinePivot)
  // ============================================================================
  const reclinePivot = new THREE.Group();
  reclinePivot.position.set(0, 0.88, -0.34);
  reclinePivot.rotation.x = -0.18; // Default ergonomic lounge angle
  chairGroup.add(reclinePivot);

  // Outer Sculpted Rear Backrest Shell (Gloss Onyx + Olive Frame)
  const rearShellGeo = trackGeo(createRoundedBoxGeometry(0.86, 0.86, 0.11, 0.09, 0.025));
  const rearShell = enableShadow(new THREE.Mesh(rearShellGeo, darkGunmetalMat));
  rearShell.position.set(0, 0.46, -0.05);
  reclinePivot.add(rearShell);

  // Muted Olive Backrest Perimeter Trim Frame
  const backOliveFrameGeo = trackGeo(createRoundedBoxGeometry(0.89, 0.88, 0.06, 0.09, 0.015));
  const backOliveFrame = enableShadow(new THREE.Mesh(backOliveFrameGeo, mutedOliveAnodizedMat));
  backOliveFrame.position.set(0, 0.46, -0.025);
  reclinePivot.add(backOliveFrame);

  // Main Quilted Leather Backrest Cushion
  const backCushionGeo = trackGeo(createRoundedBoxGeometry(0.80, 0.82, 0.14, 0.08, 0.035));
  const backCushion = enableShadow(new THREE.Mesh(backCushionGeo, quiltedLeatherMat));
  backCushion.position.set(0, 0.46, 0.04);
  reclinePivot.add(backCushion);

  // 4 Sculpted Horizontal Ergonomic Ribbed Bolsters on Backrest
  for (let i = 0; i < 4; i++) {
    const ribGeo = trackGeo(createRoundedBoxGeometry(0.72, 0.145, 0.075, 0.04, 0.022));
    const ribMesh = enableShadow(new THREE.Mesh(ribGeo, quiltedLeatherMat));
    ribMesh.position.set(0, 0.18 + i * 0.185, 0.095);
    reclinePivot.add(ribMesh);
  }

  // Left & Right Vertical Chrome Backrest Frame Bars
  for (const side of [-1, 1] as const) {
    const barGeo = trackGeo(new THREE.CylinderGeometry(0.026, 0.032, 0.78, 20));
    const barMesh = enableShadow(new THREE.Mesh(barGeo, polishedChromeMat));
    barMesh.position.set(side * 0.445, 0.45, -0.01);
    reclinePivot.add(barMesh);
  }

  // --- Adjustable Telescoping Headrest Assembly ---
  const headrestGroup = new THREE.Group();
  headrestGroup.position.set(0, 0.80, 0.01);
  reclinePivot.add(headrestGroup);

  // Twin Chrome Guide Rods & Collar Bushings
  for (const side of [-1, 1] as const) {
    const bushingGeo = trackGeo(new THREE.CylinderGeometry(0.024, 0.028, 0.04, 20));
    const bushing = new THREE.Mesh(bushingGeo, warmChampagneTrimMat);
    bushing.position.set(side * 0.16, 0.0, 0);
    headrestGroup.add(bushing);

    const rodGeo = trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 16));
    const rod = enableShadow(new THREE.Mesh(rodGeo, polishedChromeMat));
    rod.position.set(side * 0.16, 0.10, 0);
    headrestGroup.add(rod);
  }

  // Sculpted Wrap-Around Leather Headrest Cushion
  const headrestPillowGeo = trackGeo(createRoundedBoxGeometry(0.50, 0.21, 0.13, 0.06, 0.03));
  const headrestPillow = enableShadow(new THREE.Mesh(headrestPillowGeo, smoothBolsterLeatherMat));
  headrestPillow.position.set(0, 0.22, 0.03);
  headrestGroup.add(headrestPillow);

  // Muted Olive Headrest Center Accent Band
  const headrestBandGeo = trackGeo(createRoundedBoxGeometry(0.515, 0.032, 0.138, 0.02, 0.008));
  const headrestBand = new THREE.Mesh(headrestBandGeo, mutedOliveAnodizedMat);
  headrestBand.position.set(0, 0.22, 0.028);
  headrestGroup.add(headrestBand);

  // ============================================================================
  // 5. ARTICULATED FORWARD CALF PAD & CAST-CHROME FOOTREST PLATFORM
  // ============================================================================
  const legrestGroup = new THREE.Group();
  legrestGroup.position.set(0, 0.73, 0.42);
  chairGroup.add(legrestGroup);

  // Twin Angled Chrome Support Struts
  for (const side of [-1, 1] as const) {
    const strutGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.020, 0.68, 20));
    const strut = enableShadow(new THREE.Mesh(strutGeo, polishedChromeMat));
    strut.rotation.x = -0.48;
    strut.position.set(side * 0.31, -0.28, 0.16);
    legrestGroup.add(strut);
  }

  // Padded Quilted Leather Calf Support Cushion
  const calfPadGeo = trackGeo(createRoundedBoxGeometry(0.68, 0.26, 0.09, 0.04, 0.022));
  const calfPad = enableShadow(new THREE.Mesh(calfPadGeo, quiltedLeatherMat));
  calfPad.rotation.x = -0.48;
  calfPad.position.set(0, -0.18, 0.12);
  legrestGroup.add(calfPad);

  // Cast-Chrome Ribbed Footrest Deck Plate (Grounded near floor at y ~ 0.12)
  const footplateGeo = trackGeo(createRoundedBoxGeometry(0.68, 0.042, 0.34, 0.04, 0.012));
  const footplate = enableShadow(new THREE.Mesh(footplateGeo, polishedChromeMat));
  footplate.rotation.x = 0.08;
  footplate.position.set(0, -0.58, 0.42);
  legrestGroup.add(footplate);

  // Non-Slip Olive & Gunmetal Tread Ribs on Footrest
  for (let r = -2; r <= 2; r++) {
    const treadGeo = trackGeo(new THREE.BoxGeometry(0.54, 0.012, 0.024));
    const treadMat = r === 0 ? mutedOliveAnodizedMat : darkGunmetalMat;
    const tread = new THREE.Mesh(treadGeo, treadMat);
    tread.rotation.x = 0.08;
    tread.position.set(0, -0.556 - r * 0.004, 0.42 + r * 0.048);
    legrestGroup.add(tread);
  }

  // Forward Chrome Peg-Leg Support under Footrest
  const frontPegGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.028, 0.14, 20));
  const frontPeg = enableShadow(new THREE.Mesh(frontPegGeo, polishedChromeMat));
  frontPeg.position.set(0, -0.66, 0.52);
  legrestGroup.add(frontPeg);

  // ============================================================================
  // 6. REALISTIC SEATED 3D GENTLEMAN CLIENT IN THE BARBER CHAIR
  // ============================================================================
  const clientRig = createSeatedClientRig(renderer, isSoftwareGl, onModelLoaded);
  chairGroup.add(clientRig.lowerBodyGroup);
  reclinePivot.add(clientRig.upperBodyGroup);

  // ============================================================================
  // 7. SUBTLE ARCHITECTURAL STUDIO BACKDROP HALO RING (Framed Behind Chair)
  // ============================================================================
  const floatingAccentsGroup = new THREE.Group();
  floatingAccentsGroup.position.set(0, 1.02, -0.78);
  rootGroup.add(floatingAccentsGroup);

  // Subtle Vertical Architectural Halo Ring Behind the Chair Silhouette
  const haloRing1Geo = trackGeo(new THREE.TorusGeometry(1.18, 0.004, 12, 96));
  const haloRing1 = new THREE.Mesh(haloRing1Geo, mutedOliveAnodizedMat);
  floatingAccentsGroup.add(haloRing1);

  const haloRing2Geo = trackGeo(new THREE.TorusGeometry(1.32, 0.0025, 12, 96));
  const haloRing2 = new THREE.Mesh(haloRing2Geo, warmChampagneTrimMat);
  floatingAccentsGroup.add(haloRing2);

  // Subtle Floating Metallic Calibration Nodes around the Backdrop Halo
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.35;
    const nodeGeo = trackGeo(new THREE.OctahedronGeometry(0.018, 0));
    const nodeMesh = new THREE.Mesh(
      nodeGeo,
      i % 2 === 0 ? warmChampagneTrimMat : mutedOliveAnodizedMat
    );
    nodeMesh.position.set(
      Math.cos(angle) * 1.32,
      Math.sin(angle) * 1.32,
      0
    );
    floatingAccentsGroup.add(nodeMesh);
  }

  return {
    rootGroup,
    chairGroup,
    reclinePivot,
    headrestGroup,
    floatingAccentsGroup,
    clientRig,
    dispose: () => {
      clientRig.dispose();
      albedoMap.dispose();
      bumpMap.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
