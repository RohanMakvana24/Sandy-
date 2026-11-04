import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === 'undefined') return null;
  if (lenisInstance) return lenisInstance;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    return null;
  }

  const lenis = new Lenis({
    lerp: 0.082,
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.25,
    syncTouch: false,
    autoResize: true,
  });

  lenisInstance = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function getSmoothScroll(): Lenis | null {
  return lenisInstance;
}

export function scrollToTarget(
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
): void {
  if (typeof window === 'undefined') return;

  const offset = options?.offset ?? -84;
  const duration = options?.duration ?? 1.15;
  const immediate = options?.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  const el =
    typeof target === 'string'
      ? document.querySelector(target.startsWith('#') ? target : `#${target}`)
      : target;

  if (el) {
    const elTop = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: Math.max(0, elTop),
      behavior: immediate ? 'auto' : 'smooth',
    });
  }
}

export function setSmoothScrollLocked(locked: boolean): void {
  if (!lenisInstance) return;
  if (locked) {
    lenisInstance.stop();
  } else {
    lenisInstance.start();
  }
}

export function destroySmoothScroll(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
