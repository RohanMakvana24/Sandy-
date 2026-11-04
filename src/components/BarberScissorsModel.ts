import * as THREE from 'three';

export interface GroomingToolsAssembly {
  rootGroup: THREE.Group;
  scissorsGroup: THREE.Group;
  upperBladeGroup: THREE.Group;
  lowerBladeGroup: THREE.Group;
  pivotScrewMesh: THREE.Object3D;
  combGroup: THREE.Group;
  backdropRingGroup: THREE.Group;
  dispose: () => void;
}

/**
 * Generates a procedural brushed surgical steel & subtle Damascus grain bump map
 * so the scissor blades exhibit realistic anisotropic product-photography reflections.
 */
function createBrushedSteelBumpMap(maxAnisotropy: number): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, width, height);

    let seed = 73;
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    // Fine longitudinal brushed steel micro-striations
    for (let i = 0; i < 2200; i++) {
      const x = nextRand() * width;
      const y = nextRand() * height;
      const len = 35 + nextRand() * 90;
      const shade = Math.floor(95 + nextRand() * 70);
      ctx.strokeStyle = `rgba(${shade}, ${shade}, ${shade}, 0.35)`;
      ctx.lineWidth = 0.8 + nextRand() * 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y + (nextRand() - 0.5) * 2);
      ctx.stroke();
    }
  }

  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 1);
  bumpMap.anisotropy = maxAnisotropy;
  return bumpMap;
}

/**
 * Helper to create a smooth variable-radius 3D tube along a CatmullRomCurve3.
 */
function createVariableShankGeometry(
  points: THREE.Vector3[],
  radii: number[],
  scaleY = 1.0,
  scaleZ = 0.62,
  tubularSegments = 32,
  radialSegments = 20
): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
  const frames = curve.computeFrenetFrames(tubularSegments, false);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const sampleRadius = (t: number): number => {
    const scaled = t * (radii.length - 1);
    const idx = Math.min(Math.floor(scaled), radii.length - 2);
    const frac = scaled - idx;
    const s = frac * frac * (3 - 2 * frac);
    return radii[idx] * (1 - s) + radii[idx + 1] * s;
  };

  for (let i = 0; i <= tubularSegments; i++) {
    const u = i / tubularSegments;
    const P = curve.getPointAt(u);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    let r = sampleRadius(u);
    if (i === 0 || i === tubularSegments) r *= 0.5;

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2;
      const cos = -Math.cos(v);
      const sin = Math.sin(v);

      const vx = P.x + r * (cos * N.x * scaleY + sin * B.x * scaleZ);
      const vy = P.y + r * (cos * N.y * scaleY + sin * B.y * scaleZ);
      const vz = P.z + r * (cos * N.z * scaleY + sin * B.z * scaleZ);

      positions.push(vx, vy, vz);
      uvs.push(u, j / radialSegments);
    }
  }

  const stride = radialSegments + 1;
  for (let i = 0; i < tubularSegments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates a precision convex hollow-ground Japanese scissor blade geometry
 * extending from the pivot housing (x = -0.10) out to the needle tip (x = +1.36).
 */
function createConvexScissorBladeGeometry(isUpperBlade: boolean): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const dir = isUpperBlade ? 1 : -1;

  if (isUpperBlade) {
    // Upper blade: straight honed cutting edge along bottom (y ~ -0.012 -> 0), curved spine along top
    shape.moveTo(-0.12, -0.025);
    shape.lineTo(0.08, -0.016);
    shape.quadraticCurveTo(0.72, -0.008, 1.36, 0.002); // Needle tip
    shape.quadraticCurveTo(1.12, 0.058, 0.62, 0.095);  // Tapered convex spine
    shape.quadraticCurveTo(0.18, 0.118, -0.04, 0.098); // Pivot shoulder
    shape.quadraticCurveTo(-0.13, 0.055, -0.12, -0.025);
  } else {
    // Lower blade: cutting edge along top (y ~ +0.012 -> 0), curved spine along bottom
    shape.moveTo(-0.12, 0.025);
    shape.lineTo(0.08, 0.016);
    shape.quadraticCurveTo(0.72, 0.008, 1.36, -0.002); // Needle tip
    shape.quadraticCurveTo(1.12, -0.058, 0.62, -0.095); // Tapered convex spine
    shape.quadraticCurveTo(0.18, -0.118, -0.04, -0.098);
    shape.quadraticCurveTo(-0.13, -0.055, -0.12, 0.025);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.018,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.009,
    bevelThickness: 0.008,
    curveSegments: 28,
  });

  // Taper blade thickness toward the needle tip (x > 0.2) for authentic surgical steel profile
  const pos = geo.getAttribute('position');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i) - 0.009;
    if (x > 0.05) {
      const tipTaper = Math.max(0.24, 1 - ((x - 0.05) / 1.35) * 0.72);
      z *= tipTaper;
    }
    // Sharpen cutting edge bevel (near y = 0)
    const distFromEdge = Math.abs(y * dir);
    if (x > 0.05 && distFromEdge < 0.032) {
      const edgeTaper = 0.25 + (distFromEdge / 0.032) * 0.75;
      z *= edgeTaper;
    }
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

export function createGroomingToolsAssembly(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): GroomingToolsAssembly {
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
  const brushedBumpMap = createBrushedSteelBumpMap(maxAnisotropy);

  // --- PBR Materials (Strict Brand Palette: #171819, #77795B, #E8DDC8, #E8DDC8) ---
  const surgicalSteelMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe8ddc8,
      metalness: 0.96,
      roughness: 0.14,
      bumpMap: brushedBumpMap,
      bumpScale: 0.004,
      clearcoat: 0.35,
      clearcoatRoughness: 0.12,
    })
  );

  const mirrorHonedEdgeMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe8ddc8,
      metalness: 0.99,
      roughness: 0.06,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
    })
  );

  const mutedOliveAnodizedMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x77795b,
      metalness: 0.68,
      roughness: 0.28,
      clearcoat: 0.28,
      clearcoatRoughness: 0.24,
    })
  );

  const warmChampagneBrassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6d7bc,
      metalness: 0.9,
      roughness: 0.18,
    })
  );

  const carbonOnyxCombMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x1a1b1d,
      metalness: 0.18,
      roughness: 0.32,
      clearcoat: 0.24,
      clearcoatRoughness: 0.35,
    })
  );

  const rootGroup = new THREE.Group();
  const scissorsGroup = new THREE.Group();
  scissorsGroup.position.set(0.05, 0.12, 0.15);
  rootGroup.add(scissorsGroup);

  const upperBladeGroup = new THREE.Group();
  const lowerBladeGroup = new THREE.Group();
  scissorsGroup.add(upperBladeGroup);
  scissorsGroup.add(lowerBladeGroup);

  // ============================================================================
  // 1. UPPER SCISSOR BLADE + CRANE OFFSET THUMB SHANK + THUMB RING
  // ============================================================================
  const upperBladeGeo = trackGeo(createConvexScissorBladeGeometry(true));
  const upperBladeMesh = enableShadow(new THREE.Mesh(upperBladeGeo, surgicalSteelMat));
  upperBladeMesh.position.z = 0.015;
  upperBladeGroup.add(upperBladeMesh);

  // Mirror-Polished Honed Bevel Accent Strip along Upper Blade Edge
  const upperEdgePts = [
    new THREE.Vector3(0.04, -0.012, 0.024),
    new THREE.Vector3(0.68, -0.005, 0.018),
    new THREE.Vector3(1.33, 0.002, 0.008),
  ];
  const upperEdgeGeo = trackGeo(
    createVariableShankGeometry(upperEdgePts, [0.009, 0.007, 0.002], 1.2, 0.35, 24, 12)
  );
  const upperEdgeMesh = new THREE.Mesh(upperEdgeGeo, mirrorHonedEdgeMat);
  upperBladeGroup.add(upperEdgeMesh);

  // Ergonomic Offset Thumb Shank (curves from pivot x=-0.06 back to thumb ring x=-0.76, y=-0.26)
  const thumbShankPts = [
    new THREE.Vector3(-0.04, 0.02, 0.015),
    new THREE.Vector3(-0.24, -0.04, 0.016),
    new THREE.Vector3(-0.48, -0.14, 0.018),
    new THREE.Vector3(-0.72, -0.25, 0.018),
  ];
  const thumbShankGeo = trackGeo(
    createVariableShankGeometry(thumbShankPts, [0.044, 0.032, 0.026, 0.024], 1.0, 0.55, 28, 20)
  );
  const thumbShankMesh = enableShadow(new THREE.Mesh(thumbShankGeo, surgicalSteelMat));
  upperBladeGroup.add(thumbShankMesh);

  // Sculpted Elliptical Thumb Ring + Muted Olive Inner Comfort Liner
  const thumbRingGroup = new THREE.Group();
  thumbRingGroup.position.set(-0.92, -0.32, 0.018);
  thumbRingGroup.rotation.z = 0.24;
  thumbRingGroup.scale.set(1.22, 0.94, 1.0);

  const outerRingGeo = trackGeo(new THREE.TorusGeometry(0.175, 0.028, 20, 48));
  const thumbOuterRing = enableShadow(new THREE.Mesh(outerRingGeo, surgicalSteelMat));
  thumbRingGroup.add(thumbOuterRing);

  const innerOliveLinerGeo = trackGeo(new THREE.TorusGeometry(0.150, 0.012, 16, 48));
  const thumbInnerLiner = new THREE.Mesh(innerOliveLinerGeo, mutedOliveAnodizedMat);
  thumbRingGroup.add(thumbInnerLiner);

  upperBladeGroup.add(thumbRingGroup);

  // ============================================================================
  // 2. LOWER SCISSOR BLADE + FINGER SHANK + FINGER RING + PINKY TANG REST
  // ============================================================================
  const lowerBladeGeo = trackGeo(createConvexScissorBladeGeometry(false));
  const lowerBladeMesh = enableShadow(new THREE.Mesh(lowerBladeGeo, surgicalSteelMat));
  lowerBladeMesh.position.z = -0.015;
  lowerBladeGroup.add(lowerBladeMesh);

  // Mirror-Polished Honed Bevel Strip along Lower Blade Edge
  const lowerEdgePts = [
    new THREE.Vector3(0.04, 0.012, -0.005),
    new THREE.Vector3(0.68, 0.005, -0.005),
    new THREE.Vector3(1.33, -0.002, -0.004),
  ];
  const lowerEdgeGeo = trackGeo(
    createVariableShankGeometry(lowerEdgePts, [0.009, 0.007, 0.002], 1.2, 0.35, 24, 12)
  );
  const lowerEdgeMesh = new THREE.Mesh(lowerEdgeGeo, mirrorHonedEdgeMat);
  lowerBladeGroup.add(lowerEdgeMesh);

  // Ergonomic Finger Shank (curves from pivot x=-0.04 back to finger ring x=-0.68, y=+0.19)
  const fingerShankPts = [
    new THREE.Vector3(-0.04, -0.02, -0.015),
    new THREE.Vector3(-0.24, 0.05, -0.016),
    new THREE.Vector3(-0.48, 0.13, -0.016),
    new THREE.Vector3(-0.70, 0.20, -0.016),
  ];
  const fingerShankGeo = trackGeo(
    createVariableShankGeometry(fingerShankPts, [0.044, 0.032, 0.026, 0.024], 1.0, 0.55, 28, 20)
  );
  const fingerShankMesh = enableShadow(new THREE.Mesh(fingerShankGeo, surgicalSteelMat));
  lowerBladeGroup.add(fingerShankMesh);

  // Machined Champagne-Brass Bumper Stopper Pin between Handle Shanks
  const stopperPinGeo = trackGeo(new THREE.CylinderGeometry(0.012, 0.014, 0.09, 16));
  const stopperPin = new THREE.Mesh(stopperPinGeo, warmChampagneBrassMat);
  stopperPin.rotation.z = 0.25;
  stopperPin.position.set(-0.62, 0.09, -0.015);
  lowerBladeGroup.add(stopperPin);

  const stopperTipGeo = trackGeo(new THREE.SphereGeometry(0.016, 16, 16));
  const stopperTip = new THREE.Mesh(stopperTipGeo, mutedOliveAnodizedMat);
  stopperTip.position.set(-0.632, 0.045, -0.015);
  lowerBladeGroup.add(stopperTip);

  // Sculpted Finger Ring + Muted Olive Inner Comfort Liner
  const fingerRingGroup = new THREE.Group();
  fingerRingGroup.position.set(-0.88, 0.24, -0.016);
  fingerRingGroup.rotation.z = -0.18;
  fingerRingGroup.scale.set(1.18, 0.96, 1.0);

  const fingerOuterRing = enableShadow(new THREE.Mesh(outerRingGeo, surgicalSteelMat));
  fingerRingGroup.add(fingerOuterRing);

  const fingerInnerLiner = new THREE.Mesh(innerOliveLinerGeo, mutedOliveAnodizedMat);
  fingerRingGroup.add(fingerInnerLiner);

  lowerBladeGroup.add(fingerRingGroup);

  // Curved Japanese Pinky Tang (Finger Rest) + Turned Champagne Collar Ferrule
  const ferruleGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.018, 0.045, 20));
  const ferrule = new THREE.Mesh(ferruleGeo, warmChampagneBrassMat);
  ferrule.rotation.z = Math.PI / 2 - 0.35;
  ferrule.position.set(-1.09, 0.29, -0.016);
  lowerBladeGroup.add(ferrule);

  const tangPts = [
    new THREE.Vector3(-1.10, 0.29, -0.016),
    new THREE.Vector3(-1.22, 0.34, -0.016),
    new THREE.Vector3(-1.33, 0.42, -0.016),
    new THREE.Vector3(-1.38, 0.51, -0.016),
  ];
  const tangGeo = trackGeo(
    createVariableShankGeometry(tangPts, [0.018, 0.015, 0.012, 0.016], 1.0, 0.85, 22, 16)
  );
  const tangMesh = enableShadow(new THREE.Mesh(tangGeo, surgicalSteelMat));
  lowerBladeGroup.add(tangMesh);

  // ============================================================================
  // 3. CENTRAL MACHINED TENSION PIVOT SCREW ASSEMBLY
  // ============================================================================
  const pivotScrewGroup = new THREE.Group();
  pivotScrewGroup.position.set(0, 0, 0);
  scissorsGroup.add(pivotScrewGroup);

  // Stepped Anodized Olive Bearing Washer
  const washerGeo = trackGeo(new THREE.CylinderGeometry(0.056, 0.062, 0.054, 32));
  const washerMesh = enableShadow(new THREE.Mesh(washerGeo, mutedOliveAnodizedMat));
  washerMesh.rotation.x = Math.PI / 2;
  pivotScrewGroup.add(washerMesh);

  // Raised Warm-Champagne Knurled Tension Dial Cap
  const dialCapGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.046, 0.068, 32));
  const dialCap = enableShadow(new THREE.Mesh(dialCapGeo, warmChampagneBrassMat));
  dialCap.rotation.x = Math.PI / 2;
  pivotScrewGroup.add(dialCap);

  // Precision Machined Tension Slot Across Screw Head
  const slotGeo = trackGeo(new THREE.BoxGeometry(0.072, 0.010, 0.074));
  const slotMesh = new THREE.Mesh(slotGeo, carbonOnyxCombMat);
  slotMesh.rotation.z = 0.45;
  pivotScrewGroup.add(slotMesh);

  // ============================================================================
  // 4. SECONDARY CARBON-ONYX & MUTED OLIVE PRECISION GROOMING COMB
  // ============================================================================
  const combGroup = new THREE.Group();
  combGroup.position.set(-0.08, -0.34, -0.42);
  combGroup.rotation.set(0.18, 0.35, 0.24);
  rootGroup.add(combGroup);

  // Sculpted Comb Spine Backbar (#171819 Carbon Onyx)
  const combSpineGeo = trackGeo(new THREE.BoxGeometry(1.72, 0.082, 0.028));
  const combSpine = enableShadow(new THREE.Mesh(combSpineGeo, carbonOnyxCombMat));
  combSpine.position.set(0, 0.14, 0);
  combGroup.add(combSpine);

  // Muted Olive Green (#77795B) Precision Inlay Strip Along Comb Spine
  const spineOliveBarGeo = trackGeo(new THREE.BoxGeometry(1.56, 0.022, 0.032));
  const spineOliveBar = new THREE.Mesh(spineOliveBarGeo, mutedOliveAnodizedMat);
  spineOliveBar.position.set(0, 0.145, 0);
  combGroup.add(spineOliveBar);

  // Warm Champagne Calibration Dots on Comb Spine
  for (let d = -3; d <= 3; d++) {
    const dotGeo = trackGeo(new THREE.CylinderGeometry(0.006, 0.006, 0.034, 12));
    const dotMesh = new THREE.Mesh(dotGeo, warmChampagneBrassMat);
    dotMesh.rotation.x = Math.PI / 2;
    dotMesh.position.set(d * 0.21, 0.145, 0);
    combGroup.add(dotMesh);
  }

  // Left & Right End Guard Teeth (thicker end posts)
  for (const side of [-1, 1] as const) {
    const endPostGeo = trackGeo(new THREE.BoxGeometry(0.028, 0.32, 0.024));
    const endPost = enableShadow(new THREE.Mesh(endPostGeo, carbonOnyxCombMat));
    endPost.position.set(side * 0.846, 0.02, 0);
    combGroup.add(endPost);
  }

  // 36 Individually Sculpted Tapered Comb Teeth (Coarse on left, fine on right)
  const totalTeeth = 36;
  for (let t = 0; t < totalTeeth; t++) {
    const frac = t / (totalTeeth - 1);
    const xPos = -0.80 + frac * 1.60;
    const isFineSide = frac > 0.5;
    const toothWidth = isFineSide ? 0.012 : 0.016;
    const toothGeo = trackGeo(
      new THREE.CylinderGeometry(toothWidth * 0.65, toothWidth * 0.35, 0.25, 8)
    );
    const toothMesh = enableShadow(new THREE.Mesh(toothGeo, carbonOnyxCombMat));
    toothMesh.scale.set(1.0, 1.0, 0.7);
    toothMesh.position.set(xPos, -0.02, 0);
    combGroup.add(toothMesh);
  }

  // ============================================================================
  // 5. SUBTLE STUDIO ARCHITECTURAL CALIBRATION HALO (Framing Behind Tools)
  // ============================================================================
  const backdropRingGroup = new THREE.Group();
  backdropRingGroup.position.set(0, 0.04, -0.68);
  rootGroup.add(backdropRingGroup);

  const ring1Geo = trackGeo(new THREE.TorusGeometry(1.12, 0.003, 12, 96));
  const ring1 = new THREE.Mesh(ring1Geo, mutedOliveAnodizedMat);
  backdropRingGroup.add(ring1);

  const ring2Geo = trackGeo(new THREE.TorusGeometry(1.26, 0.002, 12, 96));
  const ring2 = new THREE.Mesh(ring2Geo, warmChampagneBrassMat);
  backdropRingGroup.add(ring2);

  return {
    rootGroup,
    scissorsGroup,
    upperBladeGroup,
    lowerBladeGroup,
    pivotScrewMesh: pivotScrewGroup,
    combGroup,
    backdropRingGroup,
    dispose: () => {
      brushedBumpMap.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
