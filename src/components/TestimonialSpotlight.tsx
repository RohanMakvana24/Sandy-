import React from 'react';

export interface TestimonialSpotlightProps {
  pointerX: number;
  pointerY: number;
}

/**
 * Architectural ambient olive-green spotlight behind the active testimonial.
 * Created with pure CSS radial gradients and transforms — zero WebGL overhead.
 */
export const TestimonialSpotlight: React.FC<TestimonialSpotlightProps> = React.memo(({
  pointerX,
  pointerY,
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Central Ambient Backlight Glow behind Active Card */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[680px] h-[480px] sm:h-[680px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(119, 121, 91, 0.20) 0%, rgba(232, 221, 200, 0.04) 45%, transparent 72%)',
          filter: 'blur(40px)',
          transform: `translate(-50%, -50%) translate3d(${pointerX * 24}px, ${
            pointerY * 18
          }px, 0)`,
          transition: 'transform 0.4s ease-out',
        }}
      />
    </div>
  );
});

TestimonialSpotlight.displayName = 'TestimonialSpotlight';
