import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  onScrollDown?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = React.memo(({ onScrollDown }) => {
  return (
    <div className="js-hero-scroll-indicator relative z-10 w-full max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 pt-2 pb-5 flex items-center justify-between gap-4 text-xs text-[#E8DDC8]/55">
      {/* Left Decorative Architectural Metadata */}
      <div className="hidden sm:flex items-center gap-2.5 tracking-[0.14em] uppercase text-[11px]">
        <span className="text-[#989B74] font-semibold">BESPOKE GROOMING LOUNGE</span>
        <span aria-hidden="true">·</span>
        <span>KALAWAD ROAD, RAJKOT</span>
      </div>

      {/* Center Minimal Interactive Scroll Trigger */}
      <button
        type="button"
        onClick={onScrollDown}
        aria-label="Scroll down to explore studio transition"
        className="mx-auto sm:mx-0 group inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-[#E8DDC8]/70 hover:text-[#E8DDC8] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8] rounded px-2 py-1"
      >
        <span>SCROLL TO EXPLORE</span>
        <ChevronDown className="w-4 h-4 text-[#989B74] group-hover:text-[#E8DDC8] transition-transform duration-300 group-hover:translate-y-0.5" />
      </button>

      {/* Right Interactive 3D Hint */}
      <div className="hidden md:flex items-center gap-2 tracking-[0.14em] uppercase text-[11px] text-[#E8DDC8]/50">
        <span>INTERACTIVE 3D STUDIO</span>
        <span aria-hidden="true">·</span>
        <span className="text-[#989B74] tabular-nums">RAJKOT, IN</span>
      </div>
    </div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';
