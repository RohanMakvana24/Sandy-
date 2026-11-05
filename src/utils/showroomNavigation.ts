export type Point = { x: number; z: number };
export const EYE_HEIGHT = 2.15;
export const TOUR_STOPS = [
  { label: 'Welcome area', position: [0, EYE_HEIGHT, 7.6], target: [0, 2.4, -4] },
  { label: 'Central collection', position: [0, EYE_HEIGHT, 3.4], target: [0, 1.65, 0] },
  { label: 'Hair care shelves', position: [-3.15, EYE_HEIGHT, 2.7], target: [-5.25, 2.4, 0] },
  { label: 'Beard care collection', position: [3.15, EYE_HEIGHT, 2.7], target: [5.25, 2.4, 0] },
  { label: 'Styling essentials', position: [2.9, EYE_HEIGHT, -3.6], target: [5.25, 2.4, -3.8] },
] as const;
export function safePosition(point: Point): Point {
  const x = Math.max(-4.15, Math.min(4.15, point.x));
  const z = Math.max(-6.7, Math.min(8.1, point.z));
  const distance = Math.hypot(x, z);
  if (distance < 2.15) return distance < .0001 ? { x: 0, z: 2.15 } : { x: x / distance * 2.15, z: z / distance * 2.15 };
  return { x, z };
}
// Substeps prevent a long frame or a tour transition tunnelling through the island.
export function moveSafely(from: Point, to: Point): Point {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.z - from.z) / .12));
  let current = from;
  const dx = (to.x - from.x) / steps, dz = (to.z - from.z) / steps;
  for (let i = 0; i < steps; i++) current = safePosition({ x: current.x + dx, z: current.z + dz });
  return current;
}
