import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DEFAULT_GROOMING_SERVICES,
  GroomingServiceItem,
  Service3DObjectType,
} from '../utils/servicesKinematics';
import { ServicesHeader } from './ServicesHeader';
import { ServiceSelector } from './ServiceSelector';
import { ServiceShowcase3D } from './ServiceShowcase3D';
import { ServiceDetails } from './ServiceDetails';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ServicesSectionProps {
  /**
   * Optional configurable services list so salon offerings can be updated before launch.
   */
  services?: readonly GroomingServiceItem[];
  /**
   * Optional GLB URLs keyed by 3D object type (`scissors`, `razor`, `bottle`, `dryer`, `skincare`, `colorbowl`).
   */
  glbModelOverrides?: Partial<Record<Service3DObjectType, string>>;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = DEFAULT_GROOMING_SERVICES,
  glbModelOverrides,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pointer, setPointer] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const safeIndex =
    services.length > 0 ? Math.min(activeIndex, services.length - 1) : 0;
  const activeService = services[safeIndex] ?? DEFAULT_GROOMING_SERVICES[0];

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // GSAP ScrollTrigger Entrance + Continuous Scroll Progress Tracking
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setScrollProgress(0.5);
      return;
    }

    const ctx = gsap.context(() => {
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      introTl
        .fromTo(
          '[data-services-reveal="eyebrow"]',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '[data-services-reveal="headline-line"]',
          { yPercent: 108, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .fromTo(
          '[data-services-reveal="description"]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          '[data-services-reveal="service-row"]',
          { x: -24, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.07,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .fromTo(
          '[data-services-reveal="canvas-stage"]',
          { scale: 0.94, autoAlpha: 0, y: 24 },
          {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
          },
          '-=0.75'
        );

      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          if (!isScrollDirtyRef.current) {
            isScrollDirtyRef.current = true;
            requestAnimationFrame(() => {
              isScrollDirtyRef.current = false;
              setScrollProgress(self.progress);
            });
          }
        },
      });
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDirtyRef = useRef(false);
  const isScrollDirtyRef = useRef(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerPosRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
      if (!isPointerDirtyRef.current) {
        isPointerDirtyRef.current = true;
        requestAnimationFrame(() => {
          isPointerDirtyRef.current = false;
          setPointer(pointerPosRef.current);
        });
      }
    },
    []
  );

  const handlePointerLeave = useCallback(() => {
    pointerPosRef.current = { x: 0, y: 0 };
    setPointer({ x: 0, y: 0 });
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      data-testid="services-section"
      aria-label="04 / Our Expertise — Crafted For The Modern Man"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Top Seamless Hairline Transition from Section 03 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />

      {/* Restrained Ambient Studio Lighting Glow (#77795B & #E8DDC8 only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 74% 56%, rgba(119, 121, 91, 0.14) 0%, rgba(255, 244, 222, 0.03) 34%, rgba(23, 24, 25, 0) 68%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* TOP — SECTION INTRODUCTION (04 / OUR SERVICES — THE ART OF GROOMING) */}
        <ServicesHeader />

        {/* SPLIT-SCREEN INTERACTIVE SERVICE GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* LEFT COLUMN: Interactive Service Navigation */}
          <div className="lg:col-span-6">
            <ServiceSelector
              services={services}
              activeIndex={safeIndex}
              onSelectService={(idx) => setActiveIndex(idx)}
            />
          </div>

          {/* RIGHT COLUMN: Real-Time 3D Showcase & Specifications */}
          <div
            data-services-reveal="canvas-stage"
            className="lg:col-span-6 lg:sticky lg:top-28 flex flex-col"
          >
            <ServiceShowcase3D
              activeService={activeService}
              activeIndex={safeIndex}
              pointerX={pointer.x}
              pointerY={pointer.y}
              scrollProgress={scrollProgress}
              isMobile={isMobile}
              glbModelOverrides={glbModelOverrides}
            />

            <ServiceDetails
              service={activeService}
              services={services}
              activeIndex={safeIndex}
              onSelectService={(idx) => setActiveIndex(idx)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Hairline Divider for Future Section Transition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />
    </section>
  );
};
