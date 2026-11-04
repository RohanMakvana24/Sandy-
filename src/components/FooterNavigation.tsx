import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  SALON_LOCATION_CONFIG,
  LOCATION_SECTION_COPY,
  FOOTER_NAV_LINKS,
  FooterNavLink,
} from '../utils/contactConfig';
import { IlluminatedFooterSignage } from './IlluminatedFooterSignage';

interface FooterNavigationProps {
  onNavigate?: (id: string) => void;
}

export const FooterNavigation: React.FC<FooterNavigationProps> = ({
  onNavigate,
}) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: FooterNavLink
  ) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(item.id);
      return;
    }
    if (typeof document !== 'undefined') {
      const target = document.getElementById(item.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', item.href);
      }
    }
  };

  return (
    <div
      data-footer-reveal="nav-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-[#77795B]/25"
    >
      {/* Column 1: Brand & Craftsmanship Philosophy (lg:col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        <IlluminatedFooterSignage
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />

        <div className="space-y-2">
          <div
            className="text-sm font-semibold tracking-wider text-[#E8DDC8] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {LOCATION_SECTION_COPY.footerBrandTagline}
          </div>
          <p className="text-sm text-[#E8DDC8]/60 leading-relaxed font-light max-w-sm">
            {LOCATION_SECTION_COPY.footerBrandSub} A modern sanctuary dedicated
            to the discipline of precision barbering and bespoke gentleman&apos;s
            grooming in Rajkot.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 text-xs font-mono text-[#969972]">
          <span className="w-2 h-2 rounded-full bg-[#77795B]" />
          <span>RAJKOT · GUJARAT · INDIA</span>
        </div>
      </div>

      {/* Column 2: Quick Navigation (lg:col-span-3) */}
      <div className="lg:col-span-3 space-y-4">
        <h4 className="text-xs font-mono tracking-[0.2em] text-[#969972] uppercase">
          NAVIGATION
        </h4>
        <nav
          aria-label="Footer Section Navigation"
          className="grid grid-cols-1 gap-2.5"
        >
          {FOOTER_NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className="group inline-flex items-center gap-2 text-sm text-[#E8DDC8]/75 hover:text-[#E8DDC8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E8DDC8] rounded py-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#77795B]/40 group-hover:bg-[#E8DDC8] transition-colors" />
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {/* Column 3: Atelier Hours & Location (lg:col-span-3) */}
      <div className="lg:col-span-3 space-y-4">
        <h4 className="text-xs font-mono tracking-[0.2em] text-[#969972] uppercase">
          STUDIO HOURS
        </h4>
        <div className="space-y-3 text-sm text-[#E8DDC8]/70">
          {SALON_LOCATION_CONFIG.hoursBreakdown.map((slot) => (
            <div key={slot.days} className="space-y-0.5">
              <div className="text-xs text-[#E8DDC8]/50 uppercase tracking-wide">
                {slot.days}
              </div>
              <div className="font-mono text-[#E8DDC8] text-xs sm:text-sm tabular-nums">
                {slot.hours}
              </div>
            </div>
          ))}
          <div className="pt-2 text-xs text-[#969972] font-mono leading-relaxed">
            Reserved sessions prioritize requested appointments. Walk-in service
            subject to studio capacity.
          </div>
        </div>
      </div>

      {/* Column 4: Verified Contact & Social Connect (lg:col-span-2) */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="text-xs font-mono tracking-[0.2em] text-[#969972] uppercase">
          CONNECT
        </h4>
        <div className="space-y-3">
          {/* Phone */}
          {SALON_LOCATION_CONFIG.phone && (
            <a
              href={`tel:${SALON_LOCATION_CONFIG.phone.replace(/[^\d+]/g, '')}`}
              className="group block text-xs sm:text-sm text-[#E8DDC8]/75 hover:text-[#E8DDC8] transition-colors font-mono tabular-nums"
              aria-label={`Call salon at ${SALON_LOCATION_CONFIG.displayPhone}`}
            >
              <span className="block text-[11px] text-[#E8DDC8]/45 uppercase font-sans">
                Direct Line
              </span>
              <span className="group-hover:underline">
                {SALON_LOCATION_CONFIG.displayPhone}
              </span>
            </a>
          )}

          {/* WhatsApp */}
          {SALON_LOCATION_CONFIG.whatsapp && (
            <a
              href={`https://wa.me/${SALON_LOCATION_CONFIG.whatsapp.replace(
                /\D/g,
                ''
              )}?text=${encodeURIComponent(
                "Hello Sandy Men's Salon, I would like to inquire about appointments."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#E8DDC8]/75 hover:text-[#E8DDC8] transition-colors"
              aria-label="Direct WhatsApp message (opens in new tab)"
            >
              <span>WhatsApp Inquiries</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#969972] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          )}

          {/* Instagram — only shown when configured */}
          {SALON_LOCATION_CONFIG.instagramUrl &&
            SALON_LOCATION_CONFIG.instagramHandle && (
              <div className="pt-2">
                <a
                  href={SALON_LOCATION_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#969972] hover:text-[#E8DDC8] transition-colors"
                  aria-label={`Follow Sandy Men's Salon on Instagram at ${SALON_LOCATION_CONFIG.instagramHandle} (opens in new tab)`}
                >
                  <span className="font-mono">
                    {SALON_LOCATION_CONFIG.instagramHandle}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
