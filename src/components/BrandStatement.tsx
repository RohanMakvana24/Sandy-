import React from 'react';
import { DIFFERENCE_SECTION_COPY } from '../utils/differenceConfig';

export interface BrandStatementProps {
  label?: string;
  line1?: string;
  line2?: string;
}

export const BrandStatement: React.FC<BrandStatementProps> = ({
  label = DIFFERENCE_SECTION_COPY.bottomStatementLabel,
  line1 = DIFFERENCE_SECTION_COPY.bottomStatementLine1,
  line2 = DIFFERENCE_SECTION_COPY.bottomStatementLine2,
}) => {
  return (
    <div
      data-testid="difference-brand-statement"
      data-diff-reveal="statement-block"
      className="relative mt-24 sm:mt-32 lg:mt-40 pt-16 sm:pt-24 border-t border-[#77795B]/20 overflow-hidden"
    >
      {/* Restrained Olive Ambient Light Behind Statement */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(119, 121, 91, 0.16) 0%, rgba(232, 221, 200, 0.03) 48%, transparent 72%)',
          filter: 'blur(32px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Architectural Olive Line */}
        <div
          aria-hidden="true"
          className="mb-6 h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#77795B] to-transparent"
        />

        {/* Small Upper Eyebrow Label */}
        <span
          data-testid="brand-statement-label"
          className="mb-6 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.32em] text-[#77795B]"
        >
          {label}
        </span>

        {/* Large Typography: YOUR STYLE. OUR PASSION. */}
        <h3
          data-testid="brand-statement-heading"
          className="font-extrabold uppercase tracking-[-0.035em] leading-[0.94] text-[#E8DDC8]"
          style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.8rem)' }}
        >
          <span className="block overflow-hidden pb-1">
            <span
              data-diff-reveal="statement-line"
              className="block will-change-transform"
            >
              {line1}
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span
              data-diff-reveal="statement-line"
              className="block will-change-transform text-[#77795B]"
            >
              {line2}
            </span>
          </span>
        </h3>
      </div>
    </div>
  );
};
