import React from 'react';
import {
  ExperienceFocusMode,
  PHILOSOPHY_BLOCKS,
} from '../utils/experienceKinematics';

export interface ExperiencePhilosophyProps {
  activeFocus: ExperienceFocusMode;
  onSelectFocus: (mode: ExperienceFocusMode) => void;
}

export const ExperiencePhilosophy: React.FC<ExperiencePhilosophyProps> = ({
  activeFocus,
  onSelectFocus,
}) => {
  return (
    <div
      role="region"
      aria-label="Sandy Men's Salon Brand Philosophy"
      className="w-full pt-1 sm:pt-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-14">
        {PHILOSOPHY_BLOCKS.map((item) => {
          const isActive = activeFocus === item.id;
          return (
            <article
              key={item.id}
              onMouseEnter={() => onSelectFocus(item.id)}
              onClick={() => onSelectFocus(item.id)}
              className="js-exp-philosophy-block group relative cursor-pointer pt-5 sm:pt-6 transition-colors duration-300"
            >
              {/* Animated Editorial Divider Line with Olive-Green Hover & Active Accent */}
              <div
                aria-hidden="true"
                className="relative w-full h-[1px] bg-[#E8DDC8]/14 overflow-hidden mb-5 sm:mb-6"
              >
                <span
                  className={`js-exp-divider-line block h-full transition-all duration-500 origin-left ${
                    isActive
                      ? 'w-full bg-[#77795B]'
                      : 'w-12 bg-[#77795B]/75 group-hover:w-full group-hover:bg-[#77795B]'
                  }`}
                />
              </div>

              {/* Numbered Editorial Heading (01 — PRECISION, etc.) */}
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h3
                  className={`text-sm sm:text-[15px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive
                      ? 'text-[#E8DDC8]'
                      : 'text-[#E8DDC8]/90 group-hover:text-[#FFFFFF]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="text-[#77795B] font-mono tabular-nums mr-2">
                    {item.number}
                  </span>
                  <span className="text-[#77795B] mr-2">—</span>
                  <span>{item.title}</span>
                </h3>

                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#77795B] scale-125'
                      : 'bg-[#77795B]/35 group-hover:bg-[#77795B]'
                  }`}
                />
              </div>

              {/* Concise Editorial Copy */}
              <p
                className={`text-[14.5px] sm:text-[15.5px] leading-[1.65] transition-colors duration-300 max-w-[36ch] ${
                  isActive
                    ? 'text-[#E8DDC8]/88'
                    : 'text-[#E8DDC8]/68 group-hover:text-[#E8DDC8]/85'
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
