import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DIFFERENCE_SECTION_COPY,
  EDITORIAL_FEATURE_ROWS,
  EditorialFeatureRowItem,
} from '../utils/differenceConfig';
import { EditorialHeading } from './EditorialHeading';
import { FeatureRow } from './FeatureRow';
import { InteractiveSpotlight } from './InteractiveSpotlight';
import { BrandStatement } from './BrandStatement';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface WhyChooseSandyProps {
  /**
   * Optional custom feature rows for editorial flexibility.
   */
  items?: readonly EditorialFeatureRowItem[];
}

export const WhyChooseSandy: React.FC<WhyChooseSandyProps> = ({
  items = EDITORIAL_FEATURE_ROWS,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Section label and heading line-by-line masked reveals
      scrollTl
        .fromTo(
          '[data-diff-reveal="eyebrow"]',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '[data-diff-reveal="headline-line"]',
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
          '[data-diff-reveal="description"]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        // 2. Feature rows enter sequentially
        .fromTo(
          '[data-diff-reveal="feature-row"]',
          { y: 32, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power3.out',
          },
          '-=0.45'
        )
        // 3. Divider lines animate from left to right
        .fromTo(
          '[data-diff-reveal="divider-line"]',
          { scaleX: 0, autoAlpha: 0 },
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.1,
            ease: 'power3.inOut',
          },
          '-=0.7'
        )
        // 4. Final brand statement reveals gracefully
        .fromTo(
          '[data-diff-reveal="statement-block"]',
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '[data-diff-reveal="statement-line"]',
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

  return (
    <section
      id={DIFFERENCE_SECTION_COPY.sectionId}
      ref={sectionRef}
      data-testid="difference-section"
      aria-label="05 / The Sandy Difference — Not Just A Cut. A Statement."
      className="relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden py-24 sm:py-36 lg:py-44"
    >
      {/* Top Hairline Divider Transition from Services Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />

      {/* Subtle Static Architectural Lighting Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 25%, rgba(119, 121, 91, 0.10) 0%, rgba(23, 24, 25, 0) 70%)',
        }}
      />

      {/* Signature Interactive Cursor Spotlight Rig */}
      <InteractiveSpotlight containerRef={sectionRef} />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* Section Header: 05 / THE SANDY DIFFERENCE */}
        <EditorialHeading />

        {/* Four Horizontal Editorial Feature Rows */}
        <div
          role="region"
          aria-label="Sandy Men's Salon Core Principles"
          className="flex flex-col border-t border-[#77795B]/25 divide-y-0"
        >
          {items.map((item, idx) => (
            <FeatureRow
              key={item.id}
              item={item}
              isHovered={hoveredIndex === idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
            />
          ))}
        </div>

        {/* Bottom Closing Brand Statement: YOUR STYLE. OUR PASSION. */}
        <BrandStatement />
      </div>

      {/* Bottom Hairline Divider for Next Section Continuity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />
    </section>
  );
};
