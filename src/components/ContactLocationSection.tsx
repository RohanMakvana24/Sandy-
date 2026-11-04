import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATION_SECTION_COPY } from '../utils/contactConfig';
import { LocationHeading } from './LocationHeading';
import { SalonContactDetails } from './SalonContactDetails';
import { InteractiveLocationMap } from './InteractiveLocationMap';

gsap.registerPlugin(ScrollTrigger);

export const ContactLocationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

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

      // 1. Eyebrow appears
      scrollTl.fromTo(
        '[data-loc-reveal="eyebrow"]',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }
      );

      // 2. Main headline reveals line by line
      scrollTl.fromTo(
        '[data-loc-reveal="headline-line"]',
        { yPercent: 105, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // 3. Supporting description fades upward
      scrollTl.fromTo(
        '[data-loc-reveal="description"]',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      );

      // 4. Accent line illuminates
      scrollTl.fromTo(
        '[data-loc-reveal="accent-line"]',
        { scaleX: 0, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, duration: 0.65, ease: 'power3.out' },
        '-=0.4'
      );

      // 5. Details panel emerges with subtle depth
      scrollTl.fromTo(
        '[data-loc-reveal="details-panel"]',
        { y: 28, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );

      // 6. Map container reveals
      scrollTl.fromTo(
        '[data-loc-reveal="map-container"]',
        { y: 32, scale: 0.98, autoAlpha: 0 },
        {
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
        },
        '-=0.6'
      );

      // 7. Contact rows appear sequentially
      scrollTl.fromTo(
        '[data-loc-reveal="contact-row"]',
        { x: -12, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={LOCATION_SECTION_COPY.sectionId}
      ref={sectionRef}
      aria-label="09 / Visit Sandy — Your Next Destination"
      className="relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Top Hairline Transition from Booking Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/40 to-transparent"
      />

      {/* Subtle Ambient Architectural Lighting Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 75% 45%, rgba(119, 121, 91, 0.08) 0%, rgba(23, 24, 25, 0) 70%), radial-gradient(ellipse 50% 40% at 20% 70%, rgba(255, 244, 222, 0.04) 0%, rgba(23, 24, 25, 0) 65%)',
        }}
      />

      {/* Main Spacious Container */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 flex flex-col gap-12 sm:gap-16 lg:gap-20">
        {/* Section Heading */}
        <LocationHeading />

        {/* Split-Screen Location & Map Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Salon Information & Editorial Rows */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <SalonContactDetails />
          </div>

          {/* Right Column: Interactive Map & Directions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <InteractiveLocationMap />
          </div>
        </div>
      </div>
    </section>
  );
};
