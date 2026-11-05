import React from 'react';
import { ArrowUp } from 'lucide-react';
import { SALON_LOCATION_CONFIG } from '../utils/contactConfig';
import { scrollToTarget } from '../utils/smoothScroll';

export const FooterBottomBar: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    scrollToTarget(document.documentElement, { offset: 0, duration: 1.2 });
  };

  return (
    <div
      data-footer-reveal="bottom-bar"
      className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DDC8]/50 font-mono"
    >
      {/* Copyright Notice */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-center sm:text-left">
        <span>
          &copy; {currentYear} {SALON_LOCATION_CONFIG.salonName}.
        </span>
        <span aria-hidden="true">·</span>
        <span>All Rights Reserved.</span>
        <span aria-hidden="true" className="hidden sm:inline">
          ·
        </span>
        <span className="hidden sm:inline">
          {SALON_LOCATION_CONFIG.city}, {SALON_LOCATION_CONFIG.state}
        </span>
      </div>

      {/* Back to Top Button */}
      <button
        type="button"
        onClick={handleScrollTop}
        aria-label="Back to top of page"
        className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#77795B]/30 hover:border-[#E8DDC8]/50 bg-[#171819] hover:bg-[#77795B]/20 text-[#E8DDC8]/70 hover:text-[#E8DDC8] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
      >
        <span className="text-[11px] tracking-wider uppercase">
          Back to Top
        </span>
        <ArrowUp className="w-3.5 h-3.5 text-[#969972] group-hover:text-[#E8DDC8] group-hover:-translate-y-0.5 transition-all" />
      </button>
    </div>
  );
};
