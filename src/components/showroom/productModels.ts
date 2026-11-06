import * as THREE from 'three';
import type { GroomingProduct } from '../../utils/showroomCatalog';

/** Shared, volumetric packaging: photographs remain in the product detail UI. */
export function createProductFactory(renderer: THREE.WebGLRenderer, mobile: boolean) {
  const templates = new Map<string, THREE.Group>();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const segments = mobile ? 32 : 64;
  const material = (color: string, roughness: number, metalness = 0) => {
    const value = new THREE.MeshPhysicalMaterial({ color, roughness, metalness, clearcoat: .65, clearcoatRoughness: .22 });
    materials.add(value); return value;
  };
  const cap = material('#191b19', .3, .12);
  const gold = material('#b8a078', .29, .78);
  const nozzle = material('#30332c', .3, .15);
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext('2d')!;
  const gradient = shadowContext.createRadialGradient(64, 64, 10, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,.48)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
  shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas); textures.add(shadowTexture);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false }); materials.add(shadowMaterial);
  function mesh(group: THREE.Group, geometry: THREE.BufferGeometry, mat: THREE.Material, y = 0) {
    geometries.add(geometry); const object = new THREE.Mesh(geometry, mat); object.position.y = y;
    object.castShadow = !mobile; object.receiveShadow = true; group.add(object); return object;
  }
  function lathe(group: THREE.Group, points: [number, number][], mat: THREE.Material) {
    return mesh(group, new THREE.LatheGeometry(points.map(([radius, y]) => new THREE.Vector2(radius, y)), segments), mat);
  }
  function cylinder(group: THREE.Group, radius: number, height: number, y: number, mat: THREE.Material) {
    return mesh(group, new THREE.CylinderGeometry(radius, radius, height, segments), mat, y);
  }
  function labelTexture(product: GroomingProduct) {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ede5d4'; ctx.fillRect(0, 0, 1024, 1024);
    ctx.strokeStyle = '#b29a74'; ctx.lineWidth = 5; ctx.strokeRect(27, 27, 970, 970);
    ctx.textAlign = 'center'; ctx.fillStyle = '#262a23';
    ctx.font = '112px Georgia'; ctx.fillText('SANDY', 512, 228);
    ctx.fillStyle = '#b29a74'; ctx.fillRect(420, 325, 184, 4);
    ctx.fillStyle = '#262a23'; ctx.font = '88px Georgia';
    const words = product.name.toUpperCase().split(' ');
    ctx.fillText(words.slice(0, -1).join(' '), 512, 510, 880);
    ctx.fillText(words.at(-1)!, 512, 610, 880);
    ctx.font = '25px sans-serif'; ctx.fillText('G R O O M I N G   C O L L E C T I O N', 512, 790, 850);
    ctx.fillStyle = '#b29a74'; ctx.fillRect(420, 866, 184, 3);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy()); textures.add(texture);
    const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: .65, metalness: .025 }); materials.add(mat); return mat;
  }
  function build(product: GroomingProduct) {
    const group = new THREE.Group(); group.name = product.name + ' / 3D packaging';
    const jar = product.shape === 'jar', dropper = product.shape === 'dropper', tube = product.shape === 'tube';
    const bodyColor = product.id === 'beard-oil' ? '#6d3919' : product.id === 'hair-serum' ? '#53603a' : product.color;
    const body = material(bodyColor, dropper ? .19 : .32, dropper ? .08 : .04);
    body.userData.productBody = true; body.userData.baseColor = bodyColor;
    if (tube) { body.clearcoat = .18; body.roughness = .44; }
    const label = labelTexture(product);
    let radius = .13, height = .71;
    if (jar) {
      radius = .235; height = .34;
      lathe(group, [[0,0],[.19,0],[.222,.012],[.235,.035],[.235,.235],[.226,.255],[0,.255]], body);
      lathe(group, [[0,.25],[.23,.25],[.245,.265],[.245,.32],[.23,.34],[0,.34]], cap);
      cylinder(group, .236, .008, .252, gold);
      const rim = mesh(group, new THREE.TorusGeometry(.225, .004, 6, segments), gold, .333); rim.rotation.x = Math.PI / 2;
    } else if (tube) {
      radius = .155; height = .72;
      // An oval, tapered tube with actual side thickness and a sealed top edge.
      const tubeBody = lathe(group, [[0,.065],[.105,.065],[.125,.09],[.148,.48],[.16,.65],[.158,.69],[0,.69]], body);
      tubeBody.scale.z = .55;
      const seal = mesh(group, new THREE.BoxGeometry(.318,.018,.027), body, .69);
      seal.receiveShadow = true;
      cylinder(group, .108, .07, .035, cap).scale.z = .78;
      const tubeLabel = mesh(group, new THREE.LatheGeometry([new THREE.Vector2(.132,.16),new THREE.Vector2(.158,.54)],segments,-1.07,2.14), label); tubeLabel.scale.z = .556;
    } else {
      const bodyHeight = dropper ? .45 : product.shape === 'spray' ? .65 : .55;
      radius = dropper ? .128 : .14;
      lathe(group, [[0,0],[radius*.84,0],[radius,.018],[radius,bodyHeight-.045],[radius*.92,bodyHeight-.018],[.073,bodyHeight+.02],[.073,bodyHeight+.065],[0,bodyHeight+.065]], body);
      if (dropper) {
        cylinder(group, .079, .075, bodyHeight+.065, gold);
        lathe(group, [[0,bodyHeight+.102],[.052,bodyHeight+.102],[.055,bodyHeight+.19],[.045,bodyHeight+.225],[.02,bodyHeight+.238],[0,bodyHeight+.24]], cap);
        height = bodyHeight+.24;
      } else if (product.shape === 'pump') {
        cylinder(group, .078, .075, bodyHeight+.07, gold);
        cylinder(group, .035, .075, bodyHeight+.14, cap);
        const pump = mesh(group, new THREE.BoxGeometry(.22,.038,.072), cap, bodyHeight+.185); pump.position.x = .055;
        height = bodyHeight+.205;
      } else {
        cylinder(group, .087, .055, bodyHeight+.06, gold);
        cylinder(group, .055, .07, bodyHeight+.117, cap);
        const hole = mesh(group, new THREE.CylinderGeometry(.009,.009,.008,12), nozzle, bodyHeight+.12); hole.rotation.x = Math.PI/2; hole.position.z = .055;
        height = bodyHeight+.155;
      }
    }
    if (!tube) {
      const labelHeight = jar ? .185 : dropper ? .275 : .36;
      mesh(group, new THREE.CylinderGeometry(radius+.0015,radius+.0015,labelHeight,segments,1,true,-1.08,2.16), label, jar ? .135 : dropper ? .235 : .29);
    }
    const contact = mesh(group,new THREE.PlaneGeometry(radius*3.2,radius*3.2),shadowMaterial,.002);
    contact.rotation.x = -Math.PI/2; contact.castShadow = false; contact.receiveShadow = false; contact.raycast = () => {};
    group.userData.height = height;
    group.traverse(object => { object.userData.productId = product.id; });
    return group;
  }
  return {
    create(product: GroomingProduct) {
      if (!templates.has(product.id)) templates.set(product.id, build(product));
      const instance = templates.get(product.id)!.clone(true);
      instance.traverse(object => { if (object instanceof THREE.Mesh && object.material === shadowMaterial) object.raycast = () => {}; });
      return instance;
    },
    dispose() { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); },
  };
}
