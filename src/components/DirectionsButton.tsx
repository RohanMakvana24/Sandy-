import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SALON_LOCATION_CONFIG, LOCATION_SECTION_COPY } from '../utils/contactConfig';

interface DirectionsButtonProps {
  className?: string;
  onClick?: () => void;
}

export const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  className = '',
  onClick,
}) => {
  const directionsUrl = SALON_LOCATION_CONFIG.googleMapsDirectionsUrl;
  const isAvailable = Boolean(directionsUrl && directionsUrl.trim().length > 0);

  if (!isAvailable) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[16px] bg-[#222426] border border-[#77795B]/30 text-[#E8DDC8]/50 text-sm font-medium ${className}`}
      >
        <span>Directions URL Pending Configuration</span>
      </div>
    );
  }

  return (
    <a
      href={directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="Get Directions to Sandy Men's Salon on Google Maps (opens in a new tab)"
      className={`group relative inline-flex items-center justify-between gap-4 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[16px] text-[#E8DDC8] font-semibold text-sm sm:text-base tracking-wide uppercase overflow-hidden transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8] ${className}`}
      style={{
        fontFamily: 'var(--font-display)',
        background: 'linear-gradient(180deg, #848766 0%, #77795B 60%, #686A4F 100%)',
        border: '1px solid rgba(255, 244, 222, 0.28)',
        boxShadow:
          'inset 0 1px 0 rgba(255, 244, 222, 0.32), -1.5px 2.5px 0 #464835, -3px 8px 20px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Directional Warm LED Light Sweep on Hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E8DDC8]/25 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full"
      />

      <span className="relative z-10 tracking-wider">
        {LOCATION_SECTION_COPY.directionsButtonText}
      </span>

      <span
        aria-hidden="true"
        className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#171819]/40 border border-[#E8DDC8]/20 text-[#E8DDC8] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
      >
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </a>
  );
};
