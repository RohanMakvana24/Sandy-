import React from 'react';
import { EXPERIENCE_COPY } from '../utils/experienceKinematics';

export const ExperienceHeading: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-end gap-6 lg:gap-12">
      {/* Left: Eyebrow + Oversized Masked Editorial Headline */}
      <div className="lg:col-span-7">
        <div className="js-exp-eyebrow inline-flex items-center gap-3 mb-4 sm:mb-5">
          <span
            aria-hidden="true"
            className="w-8 sm:w-10 h-[1.5px] bg-[#77795B]"
          />
          <span
            className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-[#989B74]"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {EXPERIENCE_COPY.eyebrow}
          </span>
        </div>

        <h2
          className="font-bold uppercase tracking-[-0.035em] leading-[0.94] text-[#E8DDC8]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.45rem, 5.4vw + 0.6rem, 5.25rem)',
          }}
        >
          <span className="block overflow-hidden pb-1">
            <span className="js-exp-line-inner block text-[#E8DDC8]">
              {EXPERIENCE_COPY.headlineLine1}
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span className="js-exp-line-inner block text-[#77795B]">
              {EXPERIENCE_COPY.headlineLine2}
            </span>
          </span>
        </h2>
      </div>

      {/* Right: Supporting Editorial Statement */}
      <div className="lg:col-span-5 lg:pb-2">
        <p
          className="js-exp-statement text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.68] text-[#E8DDC8]/78 font-normal max-w-[46ch]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {EXPERIENCE_COPY.supportingStatement}
        </p>
      </div>
    </div>
  );
};
