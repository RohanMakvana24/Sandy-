import React from 'react';
import { TestimonialItem } from '../utils/testimonialsConfig';

export interface TestimonialCardProps {
  item: TestimonialItem;
  isActive: boolean;
  positionOffset: number; // -1 for prev, 0 for active, 1 for next, etc.
  onClick: () => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({
  item,
  isActive,
  positionOffset,
  onClick,
}) => {
  // Compute subtle 3D perspective rotation, scale, and translateZ based on positionOffset
  let transformStyle = '';
  let opacityStyle = 1;
  let zIndex = 20;

  if (positionOffset === 0) {
    transformStyle = 'translateX(0%) translateZ(80px) rotateY(0deg) scale(1)';
    opacityStyle = 1;
    zIndex = 30;
  } else if (positionOffset === -1) {
    transformStyle = 'translateX(-78%) translateZ(-60px) rotateY(16deg) scale(0.88)';
    opacityStyle = 0.55;
    zIndex = 15;
  } else if (positionOffset === 1) {
    transformStyle = 'translateX(78%) translateZ(-60px) rotateY(-16deg) scale(0.88)';
    opacityStyle = 0.55;
    zIndex = 15;
  } else if (positionOffset < -1) {
    transformStyle = 'translateX(-140%) translateZ(-160px) rotateY(26deg) scale(0.72)';
    opacityStyle = 0;
    zIndex = 5;
  } else {
    transformStyle = 'translateX(140%) translateZ(-160px) rotateY(-26deg) scale(0.72)';
    opacityStyle = 0;
    zIndex = 5;
  }

  return (
    <div
      role="article"
      tabIndex={isActive ? 0 : -1}
      aria-hidden={!isActive}
      aria-label={`Testimonial from ${item.clientName}`}
      data-testid={isActive ? 'active-testimonial-card' : undefined}
      onClick={!isActive ? onClick : undefined}
      className={`absolute inset-0 m-auto w-full max-w-[620px] h-auto min-h-[380px] sm:min-h-[420px] p-8 sm:p-12 rounded-sm border transition-all duration-700 ease-out will-change-transform flex flex-col justify-between ${
        isActive
          ? 'bg-[#1b1c1e] border-[#989B74]/60 shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_24px_rgba(119,121,91,0.18)] cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#989B74]'
          : 'bg-[#151618] border-[#77795B]/20 hover:border-[#77795B]/45 cursor-pointer select-none pointer-events-auto'
      }`}
      style={{
        transform: transformStyle,
        opacity: opacityStyle,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Top Header: Service Tag & Architectural Quotation Mark */}
      <div>
        <div className="flex items-center justify-between border-b border-[#77795B]/20 pb-4 mb-6">
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.24em] text-[#989B74]">
            {item.serviceTag}
          </span>

          {/* Minimal Muted Olive Star Rating (No bright yellow stars) */}
          <div
            aria-label={`${item.rating} out of 5 stars`}
            className="flex items-center gap-1 text-[#989B74]"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < item.rating ? 'fill-[#989B74]' : 'fill-[#77795B]/30'
                }`}
                viewBox="0 0 24 24"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        </div>

        {/* Large Editorial Quotation Mark */}
        <div
          aria-hidden="true"
          className="text-4xl sm:text-5xl font-serif text-[#77795B]/45 leading-none mb-3 select-none"
        >
          &ldquo;
        </div>

        {/* Review Quote Text */}
        <p className="text-base sm:text-lg lg:text-xl font-normal leading-[1.65] text-[#E8DDC8]/90">
          {item.quote}
        </p>
      </div>

      {/* Bottom Metadata: Client Attribution & Verified Source */}
      <div className="pt-6 border-t border-[#77795B]/20 mt-6 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.06em] text-[#E8DDC8]">
            {item.clientName}
          </h3>
          {item.clientSubtitle && (
            <p className="text-xs text-[#E8DDC8]/55 font-light tracking-wide mt-0.5">
              {item.clientSubtitle}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74] px-2 py-0.5 rounded-xs border border-[#77795B]/30 bg-[#171819]/60">
            {item.source}
          </span>
          {item.dateLabel && (
            <p className="text-[10px] font-mono text-[#E8DDC8]/40 mt-1">
              {item.dateLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
