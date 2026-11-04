import React from 'react';
import { SERVICES_SECTION_COPY } from '../utils/servicesKinematics';

export interface ServicesHeaderProps {
  exhibitionTitle?: string;
  subtitle?: string;
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  description?: string;
}

export const ServicesHeader: React.FC<ServicesHeaderProps> = ({
  exhibitionTitle = SERVICES_SECTION_COPY.exhibitionTitle,
  subtitle = SERVICES_SECTION_COPY.subtitle,
  eyebrow = SERVICES_SECTION_COPY.eyebrow,
  headlineLine1 = SERVICES_SECTION_COPY.headlineLine1,
  headlineLine2 = SERVICES_SECTION_COPY.headlineLine2,
  description = SERVICES_SECTION_COPY.supportingDescription,
}) => {
  return (
    <header className="mb-14 sm:mb-20 lg:mb-24">
      {/* Editorial Exhibition Badge & Subtitle */}
      <div
        data-services-reveal="concept-badge"
        className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#77795B]/20 pb-4"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[#77795B] animate-pulse"
          />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.28em] text-[#E8DDC8]">
            {exhibitionTitle}
          </span>
        </div>
        <p className="text-xs sm:text-sm font-light italic tracking-wide text-[#E8DDC8]/65">
          &ldquo;{subtitle}&rdquo;
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div className="max-w-3xl">
          {/* Section Eyebrow Label */}
          <div
            data-services-reveal="eyebrow"
            className="mb-5 inline-flex items-center gap-3.5"
          >
            <span
              aria-hidden="true"
              className="h-[1px] w-9 bg-[#77795B]"
            />
            <span
              data-testid="services-eyebrow"
              className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#77795B]"
            >
              {eyebrow}
            </span>
          </div>

          {/* Oversized Editorial Heading with Line-by-Line Reveals */}
          <h2
            data-testid="services-headline"
            className="font-extrabold uppercase tracking-[-0.035em] leading-[0.96] text-[#E8DDC8]"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.6rem)' }}
          >
            <span className="block overflow-hidden pb-1">
              <span
                data-services-reveal="headline-line"
                className="block will-change-transform"
              >
                {headlineLine1}
              </span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span
                data-services-reveal="headline-line"
                className="block sm:whitespace-nowrap will-change-transform"
              >
                <span className="text-[#77795B]">{headlineLine2}</span>
              </span>
            </span>
          </h2>
        </div>

        {/* Supporting Description */}
        <p
          data-services-reveal="description"
          data-testid="services-supporting-description"
          className="max-w-md text-base sm:text-lg lg:text-xl font-normal leading-[1.65] text-[#E8DDC8]/78 lg:pb-2"
        >
          &ldquo;{description}&rdquo;
        </p>
      </div>
    </header>
  );
};
