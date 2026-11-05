import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOCATION_SECTION_COPY } from '../utils/contactConfig';
import { FooterNavigation } from './FooterNavigation';
import { FooterBottomBar } from './FooterBottomBar';

gsap.registerPlugin(ScrollTrigger);

interface PremiumFooterProps {
  onNavigate?: (id: string) => void;
}

export const PremiumFooter: React.FC<PremiumFooterProps> = ({ onNavigate }) => {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footerEl = footerRef.current;
    if (!footerEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // 1. Ambient architectural lighting appears
      scrollTl.fromTo(
        '[data-footer-reveal="ambient-light"]',
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );

      // 2. Navigation grid & logo illuminate
      scrollTl.fromTo(
        '[data-footer-reveal="nav-grid"]',
        { y: 24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.8'
      );

      // 3. Oversized brand signature reveals
      scrollTl.fromTo(
        '[data-footer-reveal="oversized-brand"]',
        { yPercent: 40, autoAlpha: 0, letterSpacing: '-0.08em' },
        {
          yPercent: 0,
          autoAlpha: 1,
          letterSpacing: '-0.04em',
          duration: 1.1,
          ease: 'power3.out',
        },
        '-=0.6'
      );

      // 4. Divider line animates
      scrollTl.fromTo(
        '[data-footer-reveal="divider"]',
        { scaleX: 0, autoAlpha: 0 },
        { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      );

      // 5. Bottom bar becomes visible
      scrollTl.fromTo(
        '[data-footer-reveal="bottom-bar"]',
        { y: 12, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }, footerEl);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      aria-label="Sandy Men's Salon Architectural Signature Footer"
      className="relative w-full bg-[#131415] text-[#E8DDC8] overflow-hidden pt-20 sm:pt-28 pb-12 select-none"
    >
      {/* Top Architectural Signboard LED Strip (#E8DDC8 / #77795B) */}
      <div
        data-footer-reveal="divider"
        aria-hidden="true"
        className="w-full h-[2px] signboard-led-strip absolute top-0 inset-x-0 origin-center"
      />

      {/* Ambient Architectural Lighting Field */}
      <div
        data-footer-reveal="ambient-light"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1100px] h-[400px] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255, 244, 222, 0.08) 0%, rgba(119, 121, 91, 0.12) 40%, transparent 80%)',
          }}
        />
        <div
          className="absolute bottom-0 right-10 w-[450px] h-[300px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse, rgba(119, 121, 91, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Structural Container */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 flex flex-col justify-between">
        {/* Upper Navigation, Brand Philosophy & Social Rows */}
        <FooterNavigation onNavigate={onNavigate} />

        {/* Full salon name in the editorial brand signature */}
        <div className="relative w-full overflow-hidden py-10 sm:py-16 lg:py-20 flex items-center justify-center border-b border-[#77795B]/20">
          {/* Subtle Ambient LED Backlight behind letters */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40"
          >
            <div className="w-3/4 h-24 rounded-full bg-gradient-to-r from-transparent via-[#E8DDC8]/15 to-transparent blur-2xl" />
          </div>

          <div
            data-footer-reveal="oversized-brand"
            className="w-full text-center tracking-tighter"
            aria-label="Sandy Men's Salon"
          >
            <span
              className="inline-block text-[clamp(4rem,20vw,17rem)] leading-[0.85] font-bold text-transparent bg-clip-text select-none"
              style={{
                fontFamily: 'var(--font-display)',
                backgroundImage:
                  'linear-gradient(180deg, #FFFFFF 0%, #E8DDC8 40%, #D8CEB8 75%, #77795B 100%)',
                filter: 'drop-shadow(0 15px 35px rgba(0, 0, 0, 0.9))',
                WebkitTextStroke: '1px rgba(232, 221, 200, 0.18)',
              }}
            >
              {LOCATION_SECTION_COPY.oversizedBrandText.replace(/\.$/, '')}
            </span>
            <span
              className="block mt-5 sm:mt-8 text-[clamp(1.25rem,4.5vw,4rem)] leading-tight font-medium tracking-[0.2em] text-[#E8DDC8]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              MEN&apos;S SALON
            </span>
          </div>
        </div>

        {/* Bottom Bar: Dynamic Copyright & Back to Top */}
        <FooterBottomBar />
      </div>
    </footer>
  );
};
