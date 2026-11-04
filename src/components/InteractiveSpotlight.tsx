import React, { useEffect, useRef } from 'react';

export interface InteractiveSpotlightProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Architectural cursor-following spotlight rig for Phase 5.
 * Tracks pointer position across the entire section and applies a subtle,
 * physically restrained olive-green radial glow (#77795B / #989B74)
 * that enhances contrast without resembling a neon or gaming effect.
 * Automatically disabled on touch-only devices.
 */
export const InteractiveSpotlight: React.FC<InteractiveSpotlightProps> = ({
  containerRef,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    if (!container || !spotlight) return;

    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window);

    if (isTouch) {
      spotlight.style.display = 'none';
      return;
    }

    let rafId = 0;
    let isRunning = false;
    let isIntersecting = false;
    let targetX = container.clientWidth * 0.5;
    let targetY = container.clientHeight * 0.3;
    let currentX = targetX;
    let currentY = targetY;

    const updatePosition = () => {
      if (!isIntersecting) {
        isRunning = false;
        return;
      }
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.085;
      currentY += dy * 0.085;
      spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        isRunning = false;
      }
    };

    const startLoopIfNeeded = () => {
      if (!isRunning && isIntersecting) {
        isRunning = true;
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startLoopIfNeeded();
        } else {
          cancelAnimationFrame(rafId);
          isRunning = false;
        }
      },
      { rootMargin: '80px 0px 80px 0px' }
    );
    observer.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      startLoopIfNeeded();
    };

    container.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        ref={spotlightRef}
        className="absolute -top-[320px] -left-[320px] w-[640px] h-[640px] rounded-full will-change-transform opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(119, 121, 91, 0.18) 0%, rgba(255, 244, 222, 0.03) 45%, transparent 70%)',
          filter: 'blur(36px)',
        }}
      />
    </div>
  );
};
