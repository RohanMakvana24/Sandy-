import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ExperienceScrollOptions {
  sectionEl: HTMLElement;
  sceneContainerEl: HTMLElement | null;
  onScrollProgress: (progress: number) => void;
}

/**
 * Sets up the Section 03 (The Sandy Experience) GSAP ScrollTrigger animations
 * without hijacking user scroll or conflicting with the Hero section's ScrollTrigger.
 */
export function initExperienceScrollAnimation({
  sectionEl,
  sceneContainerEl,
  onScrollProgress,
}: ExperienceScrollOptions): () => void {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    onScrollProgress(0.5);
    return () => {};
  }

  const ctx = gsap.context(() => {
    // 1. Coordinated Section Entrance Timeline (Heading + 3D Scissors + Brand Philosophy Blocks)
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      defaults: { ease: 'power3.out' },
    });

    const eyebrow = Array.from(sectionEl.querySelectorAll('.js-exp-eyebrow'));
    if (eyebrow.length > 0) {
      introTl.fromTo(
        eyebrow,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        0
      );
    }

    const headlineLines = Array.from(
      sectionEl.querySelectorAll('.js-exp-line-inner')
    );
    if (headlineLines.length > 0) {
      introTl.fromTo(
        headlineLines,
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.68, stagger: 0.1 },
        0.06
      );
    }

    const statement = Array.from(
      sectionEl.querySelectorAll('.js-exp-statement')
    );
    if (statement.length > 0) {
      introTl.fromTo(
        statement,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.58 },
        0.18
      );
    }

    if (sceneContainerEl) {
      introTl.fromTo(
        sceneContainerEl,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.78, ease: 'power2.out' },
        0.22
      );
    }

    const philosophyBlocks = Array.from(
      sectionEl.querySelectorAll('.js-exp-philosophy-block')
    );
    if (philosophyBlocks.length > 0) {
      introTl.fromTo(
        philosophyBlocks,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
        0.34
      );
    }

    // 2. Continuous Scroll-Driven 3D Scissors Rotation, Blade Articulation & Camera Proximity
    ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        onScrollProgress(self.progress);
      },
    });
  }, sectionEl);

  return () => ctx.revert();
}
