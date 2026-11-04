import React, { useRef } from 'react';
import { EditorialFeatureRowItem } from '../utils/differenceConfig';

export interface FeatureRowProps {
  item: EditorialFeatureRowItem;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const FeatureRow: React.FC<FeatureRowProps> = React.memo(({
  item,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spotlight-x', `${x}px`);
    el.style.setProperty('--spotlight-y', `${y}px`);
  };

  return (
    <div
      ref={rowRef}
      tabIndex={0}
      role="article"
      aria-label={item.ariaLabel}
      data-testid={`feature-row-${item.number}`}
      data-diff-reveal="feature-row"
      onPointerMove={handlePointerMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`group relative w-full overflow-hidden py-10 sm:py-14 lg:py-16 px-4 sm:px-8 transition-colors duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] ${
        isHovered ? 'bg-[#77795B]/[0.06]' : 'bg-transparent'
      }`}
    >
      {/* Subtle Pointer-Following Olive-Green Spotlight Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{
          background:
            'radial-gradient(circle 380px at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(119, 121, 91, 0.22) 0%, rgba(232, 221, 200, 0.04) 42%, transparent 72%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
        {/* Large Editorial Number */}
        <div className="md:col-span-2 flex items-baseline gap-3">
          <span
            className={`text-sm sm:text-base font-mono tracking-[0.28em] transition-colors duration-400 ${
              isHovered
                ? 'text-[#77795B] font-semibold'
                : 'text-[#E8DDC8]/40 group-hover:text-[#77795B]'
            }`}
          >
            {item.number}
          </span>
          <span
            aria-hidden="true"
            className={`h-[1px] w-6 transition-all duration-400 origin-left ${
              isHovered ? 'bg-[#77795B] scale-x-100' : 'bg-[#77795B]/30 scale-x-50'
            }`}
          />
        </div>

        {/* Oversized Feature Title with ~12px Horizontal Shift */}
        <div className="md:col-span-5">
          <h3
            className={`text-2xl sm:text-3xl lg:text-[2.2rem] font-bold uppercase tracking-[-0.02em] leading-[1.1] transition-all duration-400 ease-out ${
              isHovered
                ? 'text-[#E8DDC8] translate-x-3'
                : 'text-[#E8DDC8]/90 group-hover:text-[#FFFFFF] group-hover:translate-x-3'
            }`}
          >
            {item.title}
          </h3>
        </div>

        {/* Short Supporting Description */}
        <div className="md:col-span-4">
          <p
            className={`text-sm sm:text-base font-normal leading-[1.65] transition-all duration-400 ${
              isHovered
                ? 'text-[#E8DDC8] opacity-100'
                : 'text-[#E8DDC8]/65 group-hover:text-[#E8DDC8] group-hover:opacity-100'
            }`}
          >
            {item.description}
          </p>
        </div>

        {/* Minimal Animated Arrow (Moves diagonally upward on hover) */}
        <div className="md:col-span-1 flex md:justify-end items-center">
          <div
            aria-hidden="true"
            className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#77795B]/25 transition-all duration-400 ease-out ${
              isHovered
                ? 'border-[#77795B] bg-[#77795B]/20 text-[#E8DDC8] -translate-y-1 translate-x-1 rotate-45'
                : 'text-[#E8DDC8]/40 group-hover:border-[#77795B] group-hover:text-[#E8DDC8] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-45'
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Thin Architectural Animated Divider Line */}
      <div
        aria-hidden="true"
        data-diff-reveal="divider-line"
        className={`absolute inset-x-0 bottom-0 h-[1px] transition-colors duration-500 origin-left ${
          isHovered
            ? 'bg-gradient-to-r from-[#989B74] via-[#77795B]/70 to-[#989B74]/30 shadow-[0_0_8px_rgba(152,155,116,0.35)]'
            : 'bg-gradient-to-r from-transparent via-[#77795B]/25 to-transparent'
        }`}
      />
    </div>
  );
});

FeatureRow.displayName = 'FeatureRow';
