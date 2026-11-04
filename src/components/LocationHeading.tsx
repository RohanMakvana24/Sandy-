import React from 'react';
import { LOCATION_SECTION_COPY } from '../utils/contactConfig';

export const LocationHeading: React.FC = () => {
  return (
    <div className="flex flex-col items-start gap-4 sm:gap-6 max-w-4xl">
      {/* 1. Small Eyebrow */}
      <div
        data-loc-reveal="eyebrow"
        className="inline-flex items-center gap-3 text-xs sm:text-[13px] font-mono tracking-[0.22em] text-[#969972] uppercase"
      >
        <span
          aria-hidden="true"
          className="w-2.5 h-[2px] bg-[#77795B]"
        />
        <span>{LOCATION_SECTION_COPY.eyebrow}</span>
      </div>

      {/* 2. Main Headline with Masked Reveal */}
      <h2
        className="text-[34px] sm:text-[50px] lg:text-[68px] xl:text-[76px] font-bold tracking-tight text-[#E8DDC8] leading-[1.02]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span className="block overflow-hidden py-1">
          <span
            data-loc-reveal="headline-line"
            className="block text-[#E8DDC8]"
          >
            {LOCATION_SECTION_COPY.headlineLine1}
          </span>
        </span>
        <span className="block overflow-hidden py-1">
          <span
            data-loc-reveal="headline-line"
            className="block text-[#969972]"
          >
            {LOCATION_SECTION_COPY.headlineLine2}
          </span>
        </span>
      </h2>

      {/* 3. Supporting Description */}
      <p
        data-loc-reveal="description"
        className="text-base sm:text-lg lg:text-xl text-[#E8DDC8]/70 font-light max-w-2xl leading-relaxed mt-1"
      >
        {LOCATION_SECTION_COPY.supportingDescription}
      </p>

      {/* 4. Subtle Architectural Accent Line */}
      <div
        data-loc-reveal="accent-line"
        aria-hidden="true"
        className="w-24 sm:w-32 h-[2px] bg-gradient-to-r from-[#77795B] via-[#E8DDC8]/40 to-transparent mt-2 origin-left"
      />
    </div>
  );
};
