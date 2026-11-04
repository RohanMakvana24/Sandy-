import React from 'react';

export interface CarouselNavigationProps {
  currentIndex: number;
  totalCount: number;
  isAutoplay: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoplay: () => void;
  onSelectIndex: (index: number) => void;
}

export const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  currentIndex,
  totalCount,
  isAutoplay,
  onPrev,
  onNext,
  onToggleAutoplay,
  onSelectIndex,
}) => {
  return (
    <div
      data-testid="carousel-navigation"
      aria-label="Testimonials Carousel Controls"
      className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 z-30 relative max-w-xl mx-auto px-4"
    >
      {/* Prev / Next Arrow Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous testimonial"
          data-testid="testimonial-prev-btn"
          className="p-3 sm:p-3.5 rounded-full border border-[#77795B]/30 bg-[#171819]/80 text-[#E8DDC8] hover:border-[#989B74] hover:bg-[#77795B]/20 hover:text-[#E8DDC8] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next testimonial"
          data-testid="testimonial-next-btn"
          className="p-3 sm:p-3.5 rounded-full border border-[#77795B]/30 bg-[#171819]/80 text-[#E8DDC8] hover:border-[#989B74] hover:bg-[#77795B]/20 hover:text-[#E8DDC8] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div
        role="tablist"
        aria-label="Testimonial slides"
        className="flex items-center gap-2"
      >
        {Array.from({ length: totalCount }).map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => onSelectIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] ${
                isActive
                  ? 'w-8 bg-[#989B74] shadow-[0_0_8px_rgba(152,155,116,0.6)]'
                  : 'w-2 bg-[#77795B]/30 hover:bg-[#77795B]/60'
              }`}
            />
          );
        })}
      </div>

      {/* Autoplay Pause / Play Control */}
      <button
        type="button"
        onClick={onToggleAutoplay}
        aria-label={isAutoplay ? 'Pause auto-scroll' : 'Start auto-scroll'}
        data-testid="testimonial-autoplay-toggle"
        className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74] hover:text-[#E8DDC8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isAutoplay ? 'bg-[#989B74] animate-pulse' : 'bg-[#77795B]/40'
          }`}
        />
        {isAutoplay ? 'AUTOPLAY ON' : 'PAUSED'}
      </button>
    </div>
  );
};
