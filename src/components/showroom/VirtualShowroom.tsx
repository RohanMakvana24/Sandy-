import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildEnvironment } from './buildEnvironment';
import { EYE_HEIGHT, moveSafely, safePosition, TOUR_STOPS } from '../../utils/showroomNavigation';
import type { Category } from '../../utils/showroomCatalog';

export interface CameraCommand { serial: number; stop?: number; productId?: string; productPosition?: [number, number, number]; restore?: boolean; move?: number; turn?: number; zoom?: number }
export type ShowroomFailure = 'unsupported' | 'context-lost' | 'load-error';
interface Props {
  category: Category | 'all'; command: CameraCommand; free: boolean; reduced: boolean;
  onAdd: (id: string, origin: { x: number; y: number }) => void;
  onSelect: (id: string, position?: [number, number, number]) => void; onHover: (id: string | null) => void; onReady: () => void; onFailure: (reason: ShowroomFailure) => void;
  lowQuality: boolean;
  onTourStop: (stop: number) => void;
}
function Room(props: Props) {
  const { gl, camera, scene, invalidate } = useThree();
  const data = useRef<ReturnType<typeof buildEnvironment>>(null);
  const latest = useRef(props); latest.current = props;
  const positionGoal = useRef(new THREE.Vector3(0, EYE_HEIGHT, 7.6));
  const yaw = useRef(0), pitch = useRef(0), yawGoal = useRef(0), pitchGoal = useRef(0);
  const inspectionTarget = useRef<THREE.Vector3 | null>(null);
  const saved = useRef<{ position: THREE.Vector3; yaw: number; pitch: number }>(null);
  const keys = useRef(new Set<string>()), velocity = useRef(new THREE.Vector2());
  const route = useRef<THREE.Vector3[]>([]);
  const raycaster = useRef(new THREE.Raycaster());
  const active = useRef(true);
  const facing = (target: THREE.Vector3, from: THREE.Vector3) => {
    const direction = target.clone().sub(from); yawGoal.current = Math.atan2(-direction.x, -direction.z);
    pitchGoal.current = Math.atan2(direction.y, Math.hypot(direction.x, direction.z));
  };
  function navigate(destination: THREE.Vector3, target?: THREE.Vector3) {
    const safe = safePosition(destination); destination.set(safe.x, EYE_HEIGHT, safe.z);
    const start = camera.position.clone(); const vector = destination.clone().sub(start);
    const t = THREE.MathUtils.clamp(-(start.x * vector.x + start.z * vector.z) / Math.max(.001, vector.x ** 2 + vector.z ** 2), 0, 1);
    const closest = start.clone().addScaledVector(vector, t);
    route.current = [];
    if (Math.hypot(closest.x, closest.z) < 2.3 && start.distanceTo(destination) > .5) {
      const a = Math.atan2(start.z, start.x), b = Math.atan2(destination.z, destination.x);
      const delta = Math.atan2(Math.sin(b - a), Math.cos(b - a));
      route.current.push(new THREE.Vector3(Math.cos(a) * 2.85, EYE_HEIGHT, Math.sin(a) * 2.85));
      const steps = Math.ceil(Math.abs(delta) / .35);
      for (let i = 1; i <= steps; i++) route.current.push(new THREE.Vector3(Math.cos(a + delta * i / steps) * 2.85, EYE_HEIGHT, Math.sin(a + delta * i / steps) * 2.85));
    }
    route.current.push(destination.clone()); positionGoal.current.copy(route.current.shift()!);
    if (target) facing(target, destination);
    if (latest.current.reduced) { camera.position.copy(destination); route.current = []; positionGoal.current.copy(destination); yaw.current = yawGoal.current; pitch.current = pitchGoal.current; }
    invalidate();
  }
  useEffect(() => {
    let built: ReturnType<typeof buildEnvironment>;
    try { built = buildEnvironment(gl, props.lowQuality); } catch (error) { console.error('Unable to initialize the grooming showroom', error); props.onFailure('load-error'); return; }
    data.current = built; scene.add(built.room); scene.environment = built.environment;
    scene.background = new THREE.Color('#171819'); scene.environmentIntensity = .45;
    camera.position.set(0, EYE_HEIGHT, latest.current.reduced ? 7.6 : 8.1); camera.rotation.order = 'YXZ';
    positionGoal.current.set(0, EYE_HEIGHT, 7.6); facing(new THREE.Vector3(0, 2.4, -4), positionGoal.current);
    yaw.current = yawGoal.current; pitch.current = pitchGoal.current;
    const canvas = gl.domElement;
    let hoveredId: string | null = null;
    const highlight = (id: string | null) => {
      if (hoveredId === id) return;
      hoveredId = id;
      built.placements.forEach(p => p.object.traverse(object => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial && object.material.userData.productBody) {
          object.material.emissive.set('#77795B'); object.material.emissiveIntensity = p.product.id === id ? .13 : 0;
        }
      })); invalidate();
    };
    let pointer: { x: number; y: number; startX: number; startY: number; moved: boolean; id: number } | null = null;
    const hitAt = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      raycaster.current.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera);
      return raycaster.current.intersectObjects([...built.placements.map(p => p.object), ...built.navigationPoints], true)[0];
    };
    const down = (event: PointerEvent) => { if (!event.isPrimary) return; canvas.focus(); pointer = { x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false, id: event.pointerId }; canvas.setPointerCapture(event.pointerId); };
    const move = (event: PointerEvent) => {
      if (pointer && pointer.id === event.pointerId) {
        const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
        if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 4) pointer.moved = true;
        if (pointer.moved) { yawGoal.current -= dx * .004; pitchGoal.current = THREE.MathUtils.clamp(pitchGoal.current - dy * .003, -.48, .65); }
        pointer.x = event.clientX; pointer.y = event.clientY; invalidate();
      } else {
        const hit = hitAt(event); const id = hit?.object.userData.productId || null;
        latest.current.onHover(id); highlight(id); canvas.style.cursor = id || hit?.object.userData.tourStop !== undefined ? 'pointer' : 'grab';
      }
    };
    let selectTimer: ReturnType<typeof setTimeout> | undefined;
    let lastTap: { id: string; x: number; y: number; time: number } | null = null;
    const up = (event: PointerEvent) => {
      if (!pointer || event.pointerId !== pointer.id) return;
      if (!pointer.moved) {
        const hit = hitAt(event);
        if (hit?.object.userData.productId) {
          const id = hit.object.userData.productId as string;
          const point = hit.object.getWorldPosition(new THREE.Vector3()).toArray() as [number, number, number];
          const now = performance.now();
          if (lastTap && lastTap.id === id && now - lastTap.time < 340 && Math.hypot(event.clientX-lastTap.x,event.clientY-lastTap.y) < 24) {
            clearTimeout(selectTimer); lastTap = null;
            latest.current.onAdd(id, { x: event.clientX, y: event.clientY });
          } else {
            clearTimeout(selectTimer);
            lastTap = { id, x: event.clientX, y: event.clientY, time: now };
            selectTimer = setTimeout(() => { lastTap = null; latest.current.onSelect(id, point); }, 340);
          }
        }
        else if (hit?.object.userData.tourStop !== undefined) latest.current.onTourStop(hit.object.userData.tourStop);
        else if (latest.current.free) {
          const floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), point = new THREE.Vector3();
          if (raycaster.current.ray.intersectPlane(floor, point) && point.distanceTo(camera.position) < 15) navigate(point);
        }
      }
      pointer = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (camera instanceof THREE.PerspectiveCamera) { camera.fov = THREE.MathUtils.clamp(camera.fov + event.deltaY * .025, 32, 75); camera.updateProjectionMatrix(); invalidate(); }
    };
    canvas.addEventListener('wheel', wheel, { passive: false });
    const cancel = () => { pointer = null; };
    const leave = () => { latest.current.onHover(null); highlight(null); };
    const keydown = (event: KeyboardEvent) => {
      if (document.activeElement !== canvas || !latest.current.free) return;
      if (['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); keys.current.add(event.key); invalidate(); }
    };
    const keyup = (event: KeyboardEvent) => keys.current.delete(event.key);
    const blur = () => { keys.current.clear(); pointer = null; };
    const visibility = () => { active.current = !document.hidden; blur(); if (active.current) invalidate(); };
    const lost = (event: Event) => { event.preventDefault(); latest.current.onFailure('context-lost'); };
    canvas.tabIndex = 0; canvas.setAttribute('aria-label', 'Virtual grooming showroom. Drag to look, select a product, or use the product list. In free explore use W A S D to move.');
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', cancel); canvas.addEventListener('pointerleave', leave); canvas.addEventListener('blur', blur);
    canvas.addEventListener('webglcontextlost', lost);
    window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', blur); document.addEventListener('visibilitychange', visibility);
    latest.current.onReady(); invalidate();
    return () => {
      clearTimeout(selectTimer);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', cancel); canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('blur', blur); canvas.removeEventListener('webglcontextlost', lost);
      window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', blur); document.removeEventListener('visibilitychange', visibility);
      scene.remove(built.room); scene.environment = null; built.dispose(); data.current = null;
    };
  }, [gl, camera, scene, invalidate]);
  useEffect(() => {
    const built = data.current; if (!built) return;
    built.placements.forEach(p => p.object.traverse(object => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshBasicMaterial) { object.material.color.set(props.category === 'all' || props.category === p.product.category ? '#ffffff' : '#66685c'); return; }
      if (!(object instanceof THREE.Mesh) || !(object.material instanceof THREE.MeshStandardMaterial) || !object.material.userData.productBody) return;
      object.material.emissive.set(props.category === 'all' || props.category === p.product.category ? '#77795B' : '#000000'); object.material.emissiveIntensity = 0;
      object.material.color.set(object.material.userData.baseColor || p.product.color).multiplyScalar(props.category === 'all' || props.category === p.product.category ? 1 : .4);
    })); invalidate();
  }, [props.category, invalidate]);
  useEffect(() => {
    const command = props.command, built = data.current; if (!built) return;
    if (command.zoom && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.clamp(camera.fov + command.zoom, 32, 75); camera.updateProjectionMatrix(); invalidate();
    } else if (command.restore && saved.current) {
      navigate(saved.current.position.clone()); yawGoal.current = saved.current.yaw; pitchGoal.current = saved.current.pitch; saved.current = null; inspectionTarget.current = null;
    } else if (command.productId) {
      const candidates = built.placements.filter(p => p.product.id === command.productId);
      const anchor = inspectionTarget.current || new THREE.Vector3(0, 1.7, 0);
      const placement = candidates.reduce<(typeof candidates)[number] | undefined>((best, item) => !best || item.position.distanceToSquared(anchor) < best.position.distanceToSquared(anchor) ? item : best, undefined);
      if (!placement) return;
      if (!saved.current) saved.current = { position: camera.position.clone(), yaw: yawGoal.current, pitch: pitchGoal.current };
      const target = command.productPosition ? new THREE.Vector3(...command.productPosition) : placement.position;
      inspectionTarget.current = target.clone();
      const direction = camera.position.clone().sub(target); direction.y = 0; direction.normalize();
      const dest = target.clone().addScaledVector(direction, 2.2); dest.y = EYE_HEIGHT;
      navigate(dest, target);
    } else if (command.stop !== undefined) {
      if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 62; camera.updateProjectionMatrix(); }
      saved.current = null; inspectionTarget.current = null; const stop = TOUR_STOPS[command.stop]; navigate(new THREE.Vector3(...stop.position), new THREE.Vector3(...stop.target));
    } else if (command.move) {
      const dest = camera.position.clone().add(new THREE.Vector3(-Math.sin(yawGoal.current), 0, -Math.cos(yawGoal.current)).multiplyScalar(command.move)); navigate(dest);
    } else if (command.turn) { yawGoal.current += command.turn; invalidate(); }
  }, [props.command]);
  useEffect(() => { if (!props.free) keys.current.clear(); }, [props.free]);
  useFrame((_, elapsed) => {
    if (!active.current) return;
    const dt = Math.min(elapsed, .04), damping = props.reduced ? 1 : 1 - Math.exp(-dt * 3.5);
    const input = keys.current;
    const forward = Number(input.has('w') || input.has('ArrowUp')) - Number(input.has('s') || input.has('ArrowDown'));
    const strafe = Number(input.has('d') || input.has('ArrowRight')) - Number(input.has('a') || input.has('ArrowLeft'));
    velocity.current.lerp(new THREE.Vector2(strafe, forward).normalize().multiplyScalar(1.7), damping);
    if (props.free && velocity.current.length() > .01) {
      route.current = [];
      const x = camera.position.x + (-Math.sin(yaw.current) * velocity.current.y + Math.cos(yaw.current) * velocity.current.x) * dt;
      const z = camera.position.z + (-Math.cos(yaw.current) * velocity.current.y - Math.sin(yaw.current) * velocity.current.x) * dt;
      const safe = moveSafely(camera.position, { x, z }); camera.position.set(safe.x, EYE_HEIGHT, safe.z); positionGoal.current.copy(camera.position);
    }
    const next = camera.position.clone().lerp(positionGoal.current, damping), safe = moveSafely(camera.position, next);
    camera.position.set(safe.x, EYE_HEIGHT, safe.z);
    if (camera.position.distanceTo(positionGoal.current) < .08 && route.current.length) positionGoal.current.copy(route.current.shift()!);
    const deltaYaw = Math.atan2(Math.sin(yawGoal.current - yaw.current), Math.cos(yawGoal.current - yaw.current));
    yaw.current += deltaYaw * damping; pitch.current += (pitchGoal.current - pitch.current) * damping;
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');
    if (camera.position.distanceTo(positionGoal.current) > .002 || route.current.length || Math.abs(deltaYaw) > .001 || Math.abs(pitchGoal.current - pitch.current) > .001 || velocity.current.length() > .01) invalidate();
  });
  return null;
}
export default function VirtualShowroom(props: Props) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => { const change = () => setVisible(!document.hidden); document.addEventListener('visibilitychange', change); return () => document.removeEventListener('visibilitychange', change); }, []);
  // Fiber mounts fallback inside <canvas> even when WebGL works. Keep it passive:
  // reporting failure from a fallback effect would close every supported showroom.
  return <Canvas className="boutique-canvas" camera={{ fov: 62, near: .1, far: 40 }} dpr={props.lowQuality ? [1, 1.25] : [1, 2]} shadows={!props.lowQuality}
    frameloop={visible ? 'demand' : 'never'} gl={{ antialias: !props.lowQuality, powerPreference: 'default' }} onCreated={({ gl }) => { gl.shadowMap.type = THREE.PCFShadowMap; }} fallback={<p>3D requires a browser with WebGL 2 support. Use the product list to browse.</p>}>
    <Room {...props} />
  </Canvas>;
}
