import React from 'react';
import { TESTIMONIALS_SECTION_COPY } from '../utils/testimonialsConfig';

export interface TestimonialCTAProps {
  onBookAppointment: () => void;
}

export const TestimonialCTA: React.FC<TestimonialCTAProps> = ({
  onBookAppointment,
}) => {
  const { smallLabel, mainHeadingLine1, mainHeadingLine2, buttonText } =
    TESTIMONIALS_SECTION_COPY.bottomCta;

  return (
    <div
      data-testid="testimonials-bottom-cta"
      data-testi-reveal="cta-block"
      className="relative mt-24 sm:mt-32 lg:mt-40 pt-16 sm:pt-24 border-t border-[#77795B]/25 overflow-hidden"
    >
      {/* Restrained Olive Ambient Light Pool */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(119, 121, 91, 0.16) 0%, rgba(255, 244, 222, 0.03) 48%, transparent 72%)',
          filter: 'blur(36px)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Subtle Architectural Olive Line */}
        <div
          aria-hidden="true"
          className="mb-6 h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#989B74] to-transparent"
        />

        {/* Small Upper Eyebrow Label */}
        <span
          data-testid="testimonials-cta-label"
          className="mb-6 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.32em] text-[#989B74]"
        >
          {smallLabel}
        </span>

        {/* Large Typography: READY FOR YOUR SIGNATURE LOOK? */}
        <h3
          data-testid="testimonials-cta-heading"
          className="font-extrabold uppercase tracking-[-0.035em] leading-[0.94] text-[#E8DDC8] mb-10"
          style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)' }}
        >
          <span className="block overflow-hidden pb-1">
            <span
              data-testi-reveal="cta-line"
              className="block will-change-transform"
            >
              {mainHeadingLine1}
            </span>
          </span>
          <span className="block overflow-hidden pb-1">
            <span
              data-testi-reveal="cta-line"
              className="block will-change-transform text-[#989B74]"
            >
              {mainHeadingLine2}
            </span>
          </span>
        </h3>

        {/* Premium Olive-Green CTA Button connected to booking appointment modal */}
        <button
          type="button"
          onClick={onBookAppointment}
          data-testid="testimonials-book-btn"
          className="group relative inline-flex items-center gap-4 px-8 py-4 sm:px-10 sm:py-4.5 rounded-sm bg-[#77795B] text-[#E8DDC8] text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:bg-[#888a68] hover:shadow-[0_16px_36px_rgba(119,121,91,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8] cursor-pointer"
        >
          <span>{buttonText}</span>
          <div
            aria-hidden="true"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#171819]/40 border border-[#E8DDC8]/30 transition-transform duration-300 group-hover:translate-x-1"
          >
            <svg
              className="w-3.5 h-3.5 text-[#E8DDC8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
};
