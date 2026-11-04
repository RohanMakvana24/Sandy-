import React, { useRef } from 'react';
import { TestimonialItem } from '../utils/testimonialsConfig';
import { TestimonialCard } from './TestimonialCard';
import { TestimonialSpotlight } from './TestimonialSpotlight';
import { CarouselNavigation } from './CarouselNavigation';

export interface TestimonialCarouselProps {
  items: readonly TestimonialItem[];
  currentIndex: number;
  isAutoplay: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoplay: () => void;
  onSelectIndex: (index: number) => void;
  pointerPos: { x: number; y: number };
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  items,
  currentIndex,
  isAutoplay,
  onPrev,
  onNext,
  onToggleAutoplay,
  onSelectIndex,
  pointerPos,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 45) {
      onPrev();
    } else if (diff < -45) {
      onNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Customer Testimonials Carousel"
      data-testid="testimonial-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden py-10 sm:py-16"
    >
      {/* Cinematic Ambient Spotlight behind the active card */}
      <TestimonialSpotlight
        pointerX={pointerPos.x}
        pointerY={pointerPos.y}
      />

      {/* 3D Perspective Stage Container */}
      <div
        className="relative w-full h-[440px] sm:h-[480px] lg:h-[520px] flex items-center justify-center"
        style={{
          perspective: '1400px',
          transformStyle: 'preserve-3d',
        }}
      >
        {items.map((item, index) => {
          // Calculate relative circular offset (-2, -1, 0, 1, 2)
          let offset = index - currentIndex;
          const half = Math.floor(items.length / 2);
          if (offset > half) offset -= items.length;
          if (offset < -half) offset += items.length;

          return (
            <TestimonialCard
              key={item.id}
              item={item}
              isActive={index === currentIndex}
              positionOffset={offset}
              onClick={() => onSelectIndex(index)}
            />
          );
        })}
      </div>

      {/* Navigation Controls: Arrows, Slide Indicators & Autoplay Toggle */}
      <CarouselNavigation
        currentIndex={currentIndex}
        totalCount={items.length}
        isAutoplay={isAutoplay}
        onPrev={onPrev}
        onNext={onNext}
        onToggleAutoplay={onToggleAutoplay}
        onSelectIndex={onSelectIndex}
      />
    </div>
  );
};
