import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DEFAULT_TESTIMONIALS,
  TESTIMONIALS_SECTION_COPY,
  TestimonialItem,
} from '../utils/testimonialsConfig';
import { TestimonialsHeading } from './TestimonialsHeading';
import { TestimonialCarousel } from './TestimonialCarousel';
import { TestimonialCTA } from './TestimonialCTA';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TestimonialsSectionProps {
  testimonials?: readonly TestimonialItem[];
  onBookAppointment: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  onBookAppointment,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [isPausedByUser, setIsPausedByUser] = useState<boolean>(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      scrollTl
        .fromTo(
          '[data-testi-reveal="eyebrow"]',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '[data-testi-reveal="headline-line"]',
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
          '[data-testi-reveal="description"]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          '[data-testid="testimonial-carousel"]',
          { scale: 0.94, autoAlpha: 0, y: 32 },
          {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .fromTo(
          '[data-testi-reveal="cta-block"]',
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '[data-testi-reveal="cta-line"]',
          { yPercent: 104, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power4.out',
          },
          '-=0.6'
        );
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const [isIntersecting, setIsIntersecting] = useState<boolean>(true);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(() =>
    typeof document !== 'undefined' ? !document.hidden : true
  );

  // Viewport intersection observer to eliminate off-screen timer execution
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '100px 0px 100px 0px' }
    );
    observer.observe(el);

    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Autoplay progression (every 6 seconds, paused on hover/user interaction/offscreen/tab hidden)
  useEffect(() => {
    if (!isAutoplay || isPausedByUser || !isIntersecting || !isTabVisible) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoplay, isPausedByUser, isIntersecting, isTabVisible, testimonials.length]);

  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDirtyRef = useRef(false);

  // Pointer position tracking for subtle spotlight movement (RAF-throttled)
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerPosRef.current = { x: nx, y: ny };

    if (!isPointerDirtyRef.current) {
      isPointerDirtyRef.current = true;
      requestAnimationFrame(() => {
        isPointerDirtyRef.current = false;
        setPointerPos(pointerPosRef.current);
      });
    }
  };

  const handlePointerLeave = () => {
    pointerPosRef.current = { x: 0, y: 0 };
    setPointerPos({ x: 0, y: 0 });
    setIsPausedByUser(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id={TESTIMONIALS_SECTION_COPY.sectionId}
      ref={sectionRef}
      data-testid="testimonials-section"
      aria-label="07 / Client Stories — Voices of Confidence Testimonials"
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsPausedByUser(true)}
      onPointerLeave={handlePointerLeave}
      className="relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden py-24 sm:py-36 lg:py-44"
    >
      {/* Top Hairline Transition from Phase 6 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />

      {/* Atmospheric Ambient Lighting Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 30%, rgba(119, 121, 91, 0.12) 0%, rgba(23, 24, 25, 0) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* Section Header: 07 / CLIENT STORIES */}
        <TestimonialsHeading />

        {/* 3D Perspective Testimonial Carousel */}
        <TestimonialCarousel
          items={testimonials}
          currentIndex={currentIndex}
          isAutoplay={isAutoplay}
          onPrev={handlePrev}
          onNext={handleNext}
          onToggleAutoplay={() => setIsAutoplay((prev) => !prev)}
          onSelectIndex={(idx) => setCurrentIndex(idx)}
          pointerPos={pointerPos}
        />

        {/* Special Bottom Booking CTA */}
        <TestimonialCTA onBookAppointment={onBookAppointment} />
      </div>

      {/* Bottom Hairline Divider for Next Section Continuity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />
    </section>
  );
};
