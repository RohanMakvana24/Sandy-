import React from 'react';
import { TESTIMONIALS_SECTION_COPY } from '../utils/testimonialsConfig';

export interface TestimonialsHeadingProps {
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
}

export const TestimonialsHeading: React.FC<TestimonialsHeadingProps> = ({
  eyebrow = TESTIMONIALS_SECTION_COPY.eyebrow,
  headlineLine1 = TESTIMONIALS_SECTION_COPY.headlineLine1,
  headlineLine2 = TESTIMONIALS_SECTION_COPY.headlineLine2,
  description = TESTIMONIALS_SECTION_COPY.supportingDescription,
}) => {
  return (
    <header className="mb-14 sm:mb-20 lg:mb-24">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-12">
        <div className="max-w-4xl">
          {/* Eyebrow Label */}
          <div
            data-testi-reveal="eyebrow"
            className="mb-5 inline-flex items-center gap-3.5"
          >
            <span
              aria-hidden="true"
              className="h-[1px] w-9 bg-[#77795B]"
            />
            <span
              data-testid="testimonials-eyebrow"
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#989B74]"
            >
              {eyebrow}
            </span>
          </div>

          {/* Oversized Massive Headline */}
          <h2
            data-testid="testimonials-headline"
            className="font-extrabold uppercase tracking-[-0.038em] leading-[0.93] text-[#E8DDC8]"
            style={{ fontSize: 'clamp(2.5rem, 6.2vw, 5.6rem)' }}
          >
            <span className="block overflow-hidden pb-1 sm:pb-2">
              <span
                data-testi-reveal="headline-line"
                className="block will-change-transform"
              >
                THE <span className="text-[#77795B]">{headlineLine1.replace('THE ', '')}</span>
              </span>
            </span>
            <span className="block overflow-hidden pb-1 sm:pb-2">
              <span
                data-testi-reveal="headline-line"
                className="block will-change-transform"
              >
                {headlineLine2}
              </span>
            </span>
          </h2>
        </div>

        {/* Supporting Description */}
        <p
          data-testi-reveal="description"
          data-testid="testimonials-supporting-description"
          className="max-w-md text-base sm:text-lg lg:text-xl font-normal leading-[1.65] text-[#E8DDC8]/78 lg:pb-3"
        >
          &ldquo;{description}&rdquo;
        </p>
      </div>
    </header>
  );
};
