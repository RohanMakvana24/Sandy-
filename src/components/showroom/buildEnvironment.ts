import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SHOWROOM_PRODUCTS, type GroomingProduct } from '../../utils/showroomCatalog';
import { TOUR_STOPS } from '../../utils/showroomNavigation';

export interface ProductPlacement { product: GroomingProduct; object: THREE.Group; position: THREE.Vector3 }
export function buildEnvironment(renderer: THREE.WebGLRenderer, mobile: boolean) {
  const room = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const mat = (color: string, roughness = .5, metalness = .1) => {
    const material = new THREE.MeshStandardMaterial({ color, roughness, metalness }); materials.add(material); return material;
  };
  const black = mat('#171819', .32), olive = mat('#77795B', .46), stone = mat('#E8DDC8', .32), metal = mat('#aaa48b', .26, .8);
  const warm = new THREE.MeshBasicMaterial({ color: '#ffe4b2', toneMapped: false }); materials.add(warm);
  const boxGeo = new THREE.BoxGeometry(1, 1, 1); geometries.add(boxGeo);
  const cylinderGeo = new THREE.CylinderGeometry(1, 1, 1, mobile ? 24 : 48); geometries.add(cylinderGeo);
  function mesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent = room) {
    geometries.add(geometry); const object = new THREE.Mesh(geometry, material); parent.add(object); return object;
  }
  function box(x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, parent = room) {
    const object = mesh(boxGeo, material, parent); object.position.set(x, y, z); object.scale.set(w, h, d); object.receiveShadow = true; return object;
  }
  function cylinder(x: number, y: number, z: number, radius: number, height: number, material: THREE.Material, parent = room) {
    const object = mesh(cylinderGeo, material, parent); object.position.set(x, y, z); object.scale.set(radius, height, radius); return object;
  }
  function textureCanvas(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d')!); const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture); return texture;
  }
  let seed = 42;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const floorTexture = textureCanvas(512, 512, ctx => {
    ctx.fillStyle = '#aaa28e'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2300; i++) {
      ctx.fillStyle = ['#655f51', '#d2c7ae', '#8d8778', '#e0d5bf'][i % 4];
      ctx.beginPath(); ctx.ellipse(random() * 512, random() * 512, 1 + random() * 5, 1 + random() * 2.5, random() * 3, 0, Math.PI * 2); ctx.fill();
    }
  });
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; floorTexture.repeat.set(5, 7);
  const floorMat = mat('#E8DDC8', .29, .15); floorMat.map = floorTexture;
  box(0, -.1, 0, 12, .2, 18, floorMat);
  box(-6, 3, 0, .2, 6, 18, black); box(6, 3, 0, .2, 6, 18, black);
  box(0, 3, -8, 12, 6, .2, black); box(0, 6, 0, 12, .15, 18, black);
  [-5.85, 5.85].forEach(x => box(x, .05, 0, .035, .035, 17, warm));
  box(0, .05, -7.85, 12, .035, .035, warm);

  function arch(width: number, height: number) {
    const radius = width / 2, shoulder = height - radius;
    const shape = new THREE.Shape(); shape.moveTo(-radius, 0); shape.lineTo(radius, 0); shape.lineTo(radius, shoulder);
    shape.absarc(0, shoulder, radius, 0, Math.PI, false); shape.lineTo(-radius, 0); return shape;
  }
  const shell = new THREE.ExtrudeGeometry(arch(2.65, 4.8), { depth: .12, bevelEnabled: false, curveSegments: 24 });
  const archPoints = [new THREE.Vector3(-1.325, .85, .25), new THREE.Vector3(-1.325, 4.325, .25)];
  for (let i = 0; i <= 32; i++) { const a = Math.PI - i / 32 * Math.PI; archPoints.push(new THREE.Vector3(Math.cos(a) * 1.325, 4.325 + Math.sin(a) * 1.325, .25)); }
  archPoints.push(new THREE.Vector3(1.325, .85, .25));
  const archLight = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPoints), 64, .022, 5, false);
  const decorBodies = new Map<THREE.Material, THREE.Matrix4[]>();
  const bottleDark = mat('#25271f', .23, .23), bottleLight = mat('#d9d0b8', .4), bottleOlive = mat('#62664b', .32);
  const labelTexture = textureCanvas(256, 256, ctx => {
    ctx.fillStyle = '#E8DDC8'; ctx.fillRect(0, 0, 256, 256); ctx.fillStyle = '#171819'; ctx.textAlign = 'center';
    ctx.font = '38px Georgia'; ctx.fillText('COLLECTION', 128, 105); ctx.font = '19px sans-serif'; ctx.fillText('CONCEPT / 01', 128, 153);
  });
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: .55 }); materials.add(labelMat);
  const dummy = new THREE.Object3D();
  const addInstance = (material: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number, group: THREE.Group) => {
    dummy.position.set(x, y, z); dummy.scale.set(sx, sy, sz); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); group.updateMatrixWorld(true);
    const matrix = new THREE.Matrix4().multiplyMatrices(group.matrixWorld, dummy.matrix);
    if (!decorBodies.has(material)) decorBodies.set(material, []); decorBodies.get(material)!.push(matrix);
  };
  function shelf(x: number, z: number, rotation: number) {
    const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = rotation; room.add(group);
    const back = mesh(shell, olive, group); back.position.y = .85;
    mesh(archLight, warm, group);
    box(0, .57, .36, 2.65, 1.14, .75, olive, group);
    box(0, .58, .755, .018, .96, .018, metal, group);
    [-.13, .13].forEach(x => box(x, .72, .77, .045, .14, .025, metal, group));
    for (let row = 0; row < 4; row++) {
      const y = 1.18 + row * .86;
      box(0, y, .43, 2.52, .08, .82, stone, group); box(0, y - .055, .83, 2.45, .025, .025, warm, group);
      const count = mobile ? 5 : 7;
      for (let i = 0; i < count; i++) {
        const px = -1.02 + i * 2.04 / (count - 1), height = .33 + random() * .22;
        addInstance([bottleDark, bottleLight, bottleOlive][(row + i) % 3], px, y + .06 + height / 2, .38, .09, height, .09, group);
        addInstance(black, px, y + .08 + height, .38, .055, .1, .055, group);
        box(px, y + height * .45, .477, .115, .14, .012, labelMat, group);
      }
    }
    const light = new THREE.PointLight('#ffe4b8', 12, 4.5, 2); light.position.set(0, 3.4, .9); group.add(light);
  }
  [-3.8, 0, 3.8].forEach(z => { shelf(-5.85, z, Math.PI / 2); shelf(5.85, z, -Math.PI / 2); });
  decorBodies.forEach((matrices, material) => {
    const instances = new THREE.InstancedMesh(cylinderGeo, material, matrices.length);
    matrices.forEach((matrix, i) => instances.setMatrixAt(i, matrix)); room.add(instances);
  });

  // Back-wall signature is original typography, not a modified official logo.
  const signTexture = textureCanvas(1024, 1024, ctx => {
    ctx.fillStyle = '#303126'; ctx.fillRect(0, 0, 1024, 1024); ctx.textAlign = 'center'; ctx.fillStyle = '#E8DDC8';
    ctx.font = '108px Georgia'; ctx.fillText('SANDY', 512, 290); ctx.font = '24px sans-serif'; ctx.fillText("M E N ’ S   S A L O N", 512, 340);
    ctx.font = '72px Georgia'; ctx.fillText('GROOMING', 512, 490); ctx.fillText('ESSENTIALS', 512, 575);
    ctx.font = '25px sans-serif'; ctx.fillText('Professional Care for Modern Men.', 512, 655);
    ctx.font = '18px sans-serif'; ctx.fillText('V I R T U A L   C O L L E C T I O N', 512, 795);
  });
  const signMat = new THREE.MeshStandardMaterial({ map: signTexture, emissiveMap: signTexture, emissive: '#E8DDC8', emissiveIntensity: .28 }); materials.add(signMat);
  const sign = mesh(new THREE.ShapeGeometry(arch(4.7, 5.1)), signMat); sign.position.set(0, .15, -7.82);
  // Shape UVs are world units: explicitly normalize for legible sign artwork.
  const uv = sign.geometry.getAttribute('uv'); const pos = sign.geometry.getAttribute('position');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 2.35) / 4.7, pos.getY(i) / 5.1);
  const backOutline: THREE.Vector3[] = [new THREE.Vector3(-2.35, 0, -7.75), new THREE.Vector3(-2.35, 2.9, -7.75)];
  for (let i = 0; i <= 48; i++) { const a = Math.PI - i / 48 * Math.PI; backOutline.push(new THREE.Vector3(Math.cos(a) * 2.35, 2.9 + Math.sin(a) * 2.35, -7.75)); }
  backOutline.push(new THREE.Vector3(2.35, 0, -7.75));
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(backOutline), 80, .035, 6, false), warm);
  const islandOlive = mat('#454a33', .45), islandRibs = mat('#353a29', .42);
  cylinder(0, .64, 0, 1.65, 1.22, islandOlive);
  for (let i = 0; i < (mobile ? 64 : 100); i++) {
    const angle = i / (mobile ? 64 : 100) * Math.PI * 2;
    cylinder(Math.cos(angle) * 1.66, .64, Math.sin(angle) * 1.66, .026, 1.16, islandRibs);
  }
  cylinder(0, 1.3, 0, 1.78, .12, stone); cylinder(0, .05, 0, 1.7, .035, warm); cylinder(0, 1.22, 0, 1.71, .025, warm);
  cylinder(0, 1.52, -.45, .64, .36, stone);
  const ring = mesh(new THREE.TorusGeometry(2.1, .065, 8, 96), metal); ring.rotation.x = Math.PI / 2; ring.position.set(0, 4.85, 0);
  const ringGlow = mesh(new THREE.TorusGeometry(2.1, .033, 8, 96), warm); ringGlow.rotation.x = Math.PI / 2; ringGlow.position.set(0, 4.8, 0);
  [-1.5, 1.5].forEach(x => box(x, 5.43, 0, .018, 1.1, .018, metal));
  const islandLight = new THREE.PointLight('#ffe6ba', 35, 9, 2); islandLight.position.set(0, 4.3, 0); room.add(islandLight);
  const key = new THREE.SpotLight('#fff0d6', 140, 20, .75, .7, 1.7); key.position.set(0, 5.5, 5); key.target.position.set(0, 0, 0);
  key.castShadow = !mobile; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.001; room.add(key, key.target);
  room.add(new THREE.HemisphereLight('#e8ddc8', '#282a20', .55));
  [-4.2, 4.2].forEach(x => {
    box(x, 5.85, 0, .08, .08, 14, metal);
    [-4, 0, 4].forEach(z => { cylinder(x, 5.7, z, .14, .22, black); cylinder(x, 5.57, z, .1, .015, warm); });
  });
  // Instanced leaves and slender hanging stems, restrained to the ceiling feature.
  const leafShape = new THREE.Shape(); leafShape.moveTo(0, -1); leafShape.quadraticCurveTo(-.8, -.2, 0, 1); leafShape.quadraticCurveTo(.8, -.2, 0, -1);
  const leaves: THREE.Matrix4[] = [], leafGeo = new THREE.ShapeGeometry(leafShape, 5); geometries.add(leafGeo);
  for (let i = 0; i < (mobile ? 35 : 60); i++) {
    const angle = random() * Math.PI * 2, radius = 1.5 + random() * 1.6, x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    const length = .35 + random() * 1.3;
    cylinder(x, 6 - length / 2, z, .008, length, olive);
    for (let j = 0; j < 6; j++) {
      dummy.position.set(x + Math.sin(j * 2) * .1, 5.9 - length * j / 6, z); dummy.rotation.set(.35 + random() * .6, j, .45); dummy.scale.set(.13, .15, .13); dummy.updateMatrix(); leaves.push(dummy.matrix.clone());
    }
  }
  const leafMat = mat('#505939', .7); leafMat.side = THREE.DoubleSide;
  const leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, leaves.length);
  leaves.forEach((m, i) => leafMesh.setMatrixAt(i, m)); room.add(leafMesh);

  const placements: ProductPlacement[] = [];
  function productModel(product: GroomingProduct, position: [number, number, number], scale = 1) {
    const group = new THREE.Group(); group.position.set(...position); group.scale.setScalar(scale); room.add(group);
    const bodyMat = mat(product.color, .24, .15), jar = product.shape === 'jar';
    bodyMat.userData.productBody = true;
    const height = jar ? .25 : .64, radius = jar ? .22 : .13;
    if (product.shape === 'tube') {
      const tubeGeo = new THREE.CylinderGeometry(.15, .11, .6, 16); mesh(tubeGeo, bodyMat, group).position.y = .32;
      box(0, .64, 0, .3, .035, .09, bodyMat, group); cylinder(0, .03, 0, .11, .06, black, group);
    } else {
      const body = cylinder(0, height / 2, 0, radius, height, bodyMat, group); body.castShadow = true;
      cylinder(0, height + .045, 0, jar ? radius * 1.04 : .075, jar ? .06 : .11, black, group);
      if (product.shape === 'pump') { box(.055, height + .14, 0, .2, .045, .05, metal, group); cylinder(0, height + .1, 0, .025, .1, black, group); }
      if (product.shape === 'dropper') cylinder(0, height + .13, 0, .045, .12, black, group);
    }
    const productLabel = textureCanvas(jar ? 768 : 512, jar ? 384 : 640, ctx => {
      const w = ctx.canvas.width, h = ctx.canvas.height;
      ctx.fillStyle = '#f1eadb'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#303528'; ctx.textAlign = 'center';
      ctx.font = `${jar ? 25 : 22}px sans-serif`; ctx.fillText('THE COLLECTION', w / 2, h * .18);
      ctx.fillStyle = '#77795B'; ctx.fillRect(w * .3, h * .29, w * .4, 3); ctx.fillStyle = '#171819';
      const words = product.name.toUpperCase().split(' ');
      ctx.font = `${jar ? 65 : 54}px Georgia`; ctx.fillText(words.slice(0, -1).join(' '), w / 2, h * .5, w * .88);
      ctx.fillText(words.at(-1)!, w / 2, h * .67, w * .88);
      ctx.font = `${jar ? 20 : 18}px sans-serif`; ctx.fillText('CONCEPT PREVIEW', w / 2, h * .86);
    });
    productLabel.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const productLabelMat = new THREE.MeshStandardMaterial({ map: productLabel, roughness: .75, emissiveMap: productLabel, emissive: '#E8DDC8', emissiveIntensity: .1 }); materials.add(productLabelMat);
    const label = box(0, height * .49, radius + .009, jar ? .35 : .23, jar ? .17 : .34, .008, productLabelMat, group);
    label.userData.productId = product.id;
    group.userData.productId = product.id;
    group.traverse(object => { object.userData.productId = product.id; });
    placements.push({ product, object: group, position: group.position.clone().add(new THREE.Vector3(0, .32, 0)) });
  }
  SHOWROOM_PRODUCTS.forEach((p, i) => {
    // Staggered display keeps front labels facing the entrance instead of hiding half the collection in a ring.
    const positions: [number, number, number][] = [[-1.14, 1.37, .65], [-.38, 1.37, 1.05], [.38, 1.37, 1.05], [1.14, 1.37, .65], [-.96, 1.37, -.38], [-.32, 1.73, -.45], [.32, 1.73, -.45], [.96, 1.37, -.38]];
    productModel(p, positions[i], 1.35);
  });
  // Additional clickable real display positions, driven by the same catalogue.
  productModel(SHOWROOM_PRODUCTS[0], [-5.25, 2.98, .15], 1); placements.at(-1)!.object.rotation.y = Math.PI / 2;
  productModel(SHOWROOM_PRODUCTS[2], [5.25, 2.12, .15], 1); placements.at(-1)!.object.rotation.y = -Math.PI / 2;
  productModel(SHOWROOM_PRODUCTS[5], [5.25, 2.12, -3.8], 1.2); placements.at(-1)!.object.rotation.y = -Math.PI / 2;

  // Batch fixed architecture by material. Interactive product groups stay separate for raycasting.
  room.updateMatrixWorld(true);
  const staticMeshes = new Map<THREE.Material, { source: THREE.Mesh; geometry: THREE.BufferGeometry }[]>();
  room.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material) || object.userData.productId) return;
    if (!staticMeshes.has(object.material)) staticMeshes.set(object.material, []);
    const copy = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
    staticMeshes.get(object.material)!.push({ source: object, geometry: copy.applyMatrix4(object.matrixWorld) });
  });
  staticMeshes.forEach((entries, material) => {
    const merged = mergeGeometries(entries.map(entry => entry.geometry));
    if (merged) { entries.forEach(entry => entry.source.removeFromParent()); const batch = mesh(merged, material); batch.receiveShadow = true; batch.castShadow = material !== warm; }
    entries.forEach(entry => entry.geometry.dispose());
  });
  const navigationPoints = TOUR_STOPS.map((stop, index) => {
    const ring = mesh(new THREE.RingGeometry(.2, .26, 32), warm);
    ring.rotation.x = -Math.PI / 2; ring.position.set(stop.position[0], .015, stop.position[2]);
    ring.userData.tourStop = index; return ring;
  });

  // Avoid cubemap rendering and its GPU allocation on mobile / lightweight retries.
  let environment: THREE.WebGLRenderTarget | null = null;
  if (!mobile) {
    const pmrem = new THREE.PMREMGenerator(renderer), studio = new RoomEnvironment();
    try { environment = pmrem.fromScene(studio, .04); } finally { studio.dispose(); pmrem.dispose(); }
  }
  return {
    room, placements, navigationPoints, environment: environment?.texture ?? null,
    dispose() {
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); environment?.dispose();
    },
  };
}
