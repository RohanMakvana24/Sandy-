import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import {
  NAV_ITEMS,
  isNavbarScrolled,
  resolveActiveNavId,
} from '../utils/navigation';
import { IlluminatedLogo } from './IlluminatedLogo';
import { setSmoothScrollLocked } from '../utils/smoothScroll';

interface SandyNavbarProps {
  activeNavId?: string;
  onSelectNav?: (id: string) => void;
  onBookAppointment: () => void;
}

/**
 * Custom Calendar icon matching the reference image:
 * Rounded calendar with two top rings, horizontal header bar, and 6 date dots.
 */
const ReferenceCalendarIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
    <line x1="8" y1="2.5" x2="8" y2="6.5" />
    <line x1="16" y1="2.5" x2="16" y2="6.5" />
    <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
    <circle cx="8.5" cy="13.5" r="0.85" fill="currentColor" stroke="none" />
    <circle cx="12" cy="13.5" r="0.85" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="13.5" r="0.85" fill="currentColor" stroke="none" />
    <circle cx="8.5" cy="17" r="0.85" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="0.85" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="17" r="0.85" fill="currentColor" stroke="none" />
  </svg>
);

export const SandyNavbar: React.FC<SandyNavbarProps> = ({
  activeNavId: controlledActiveId,
  onSelectNav,
  onBookAppointment,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(() =>
    typeof window !== 'undefined' ? resolveActiveNavId(window.location.hash) : 'home'
  );
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [ledReady, setLedReady] = useState<boolean>(true);

  const navRootRef = useRef<HTMLElement | null>(null);
  const logoWrapRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const activeId = controlledActiveId ?? internalActiveId;

  // Sticky scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(isNavbarScrolled(window.scrollY, 24));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setInternalActiveId(resolveActiveNavId(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // GSAP realistic LED warm-up entrance animation
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setLedReady(true);
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => setLedReady(true),
      });

      if (stripRef.current) {
        tl.fromTo(
          stripRef.current,
          { opacity: 0.3, scaleX: 0.96 },
          { opacity: 1, scaleX: 1, duration: 0.55 },
          0
        );
      }

      if (logoWrapRef.current) {
        tl.fromTo(
          logoWrapRef.current,
          { opacity: 0.35, filter: 'brightness(0.6)' },
          { opacity: 1, filter: 'brightness(1)', duration: 0.7, ease: 'power3.out' },
          0.08
        );
      }
    }, navRootRef);

    return () => ctx.revert();
  }, []);

  // Lock body scroll when fullscreen mobile menu is open
  useEffect(() => {
    setSmoothScrollLocked(mobileMenuOpen);
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      setSmoothScrollLocked(false);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id: string, href: string) => {
    setInternalActiveId(id);
    if (onSelectNav) {
      onSelectNav(id);
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', href);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={navRootRef}
        data-scrolled={isScrolled ? 'true' : 'false'}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 select-none ${
          isScrolled ? 'backdrop-blur-md' : ''
        }`}
      >
        {/* Main Dimensional Signboard Surface (#171819) */}
        <div
          className={`signboard-surface relative w-full transition-all duration-300 ${
            isScrolled
              ? 'h-[62px] sm:h-[84px] lg:h-[96px]'
              : 'h-[66px] sm:h-[92px] lg:h-[108px]'
          }`}
        >
          {/* Three-Zone Architectural Navigation Container */}
          <div className="relative z-10 w-full max-w-[1380px] mx-auto h-full px-4 sm:px-8 lg:px-14 flex items-center justify-between gap-4 sm:gap-6 lg:gap-10">
            {/* LEFT: 3D Illuminated Sandy Men's Salon Logo */}
            <div ref={logoWrapRef} className="shrink-0">
              <IlluminatedLogo
                ledReady={ledReady}
                compact={isScrolled}
                onClick={() => handleNavClick('home', '#home')}
              />
            </div>

            {/* CENTER: Raised 3D Navigation Links */}
            <nav
              aria-label="Primary Salon Navigation"
              className="hidden lg:flex items-center justify-center gap-8 xl:gap-11 shrink-0"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id, item.href);
                    }}
                    className={`group relative py-2 text-[17px] xl:text-[18px] font-medium tracking-[-0.01em] whitespace-nowrap shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]/60 rounded ${
                      isActive
                        ? 'nav-item-3d-active'
                        : 'nav-item-3d hover:-translate-y-[1px]'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>

                    {/* Raised 3D Muted Olive Green Underline Bar */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -left-[4%] -right-[4%] -bottom-[2px] h-[3px] rounded-[1px] olive-bar-3d transition-all duration-200 origin-left ${
                        isActive
                          ? 'scale-x-100 opacity-100'
                          : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-90'
                      }`}
                    />
                  </a>
                );
              })}
            </nav>

            {/* RIGHT: Sculptural 3D Olive Green Book Appointment Button & Mobile Menu Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onBookAppointment}
                className="hidden sm:inline-flex olive-plaque-btn group relative items-center gap-2.5 lg:gap-3 px-5 lg:px-6 py-2.5 lg:py-3 rounded-[16px] text-[#E8DDC8] font-medium text-[14.5px] lg:text-[15.5px] tracking-[-0.01em] whitespace-nowrap shrink-0 overflow-hidden transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {/* Directional warm LED light sweep on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E8DDC8]/20 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full"
                />
                <ReferenceCalendarIcon className="w-[18px] h-[18px] text-[#E8DDC8] shrink-0" />
                <span className="relative z-10">
                  Book Appointment
                </span>
                <ArrowRight className="w-4 h-4 text-[#E8DDC8] shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-architectural-menu"
                className="lg:hidden relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#202223] border border-[#77795B]/55 text-[#E8DDC8] hover:border-[#E8DDC8]/60 transition-all shadow-[-2px_3px_8px_rgba(0,0,0,0.85)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8DDC8]" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8DDC8]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Crisp Warm-White Bottom Architectural LED Line */}
        <div
          ref={stripRef}
          aria-hidden="true"
          className="w-full h-[2px] signboard-led-strip origin-center"
        />
      </header>

      {/* Fullscreen Dark Architectural Mobile Navigation Overlay */}
      <div
        id="mobile-architectural-menu"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-30 lg:hidden bg-[#141516]/98 backdrop-blur-xl transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-3'
        }`}
      >
        <div className="relative h-full flex flex-col justify-between pt-[86px] sm:pt-[116px] pb-8 px-6 sm:px-10 overflow-y-auto">
          <nav aria-label="Mobile Salon Navigation" className="space-y-2">
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={`mobile-${item.id}`}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.id, item.href);
                  }}
                  className={`group flex items-center justify-between py-3.5 px-4 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-[#77795B]/20 border-[#77795B]/60 text-[#E8DDC8]'
                      : 'bg-[#1a1b1d]/70 border-[#E8DDC8]/8 text-[#E8DDC8]/85 hover:border-[#77795B]/45 hover:text-[#E8DDC8]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-xs font-mono tabular-nums text-[#969972]">
                      0{index + 1}
                    </span>
                    <span
                      className="text-lg font-semibold tracking-tight"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`h-2 w-6 rounded-full transition-all ${
                      isActive
                        ? 'olive-bar-3d opacity-100'
                        : 'bg-[#77795B]/30 opacity-0 group-hover:opacity-70'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#E8DDC8]/12 space-y-5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookAppointment();
              }}
              className="w-full olive-plaque-btn group relative flex items-center justify-center gap-3 py-4 px-6 rounded-[18px] text-[#E8DDC8] font-semibold text-base tracking-tight overflow-hidden"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <ReferenceCalendarIcon className="w-5 h-5 text-[#E8DDC8] shrink-0" />
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 text-[#E8DDC8] transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#E8DDC8]/65">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#969972]" />
                Kalawad Road, Rajkot, Gujarat
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Clock className="w-3.5 h-3.5 text-[#969972]" />
                10:00 AM – 09:30 PM
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <Phone className="w-3.5 h-3.5 text-[#969972]" />
                +91 98250 77420
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
