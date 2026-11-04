import React, { useEffect, useRef } from 'react';

export interface MagneticGalleryCursorProps {
  visible: boolean;
  x: number;
  y: number;
  text?: string;
}

/**
 * Desktop circular magnetic gallery cursor:
 * - Muted Olive Green background (#77795B)
 * - Warm Off-White text (#E8DDC8)
 * - Minimal arrow icon
 * - Smooth magnetic tracking via spring/linear interpolation
 * Automatically hidden on touch devices and inactive states.
 */
export const MagneticGalleryCursor: React.FC<MagneticGalleryCursorProps> = ({
  visible,
  x,
  y,
  text = 'VIEW',
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const targetPosRef = useRef({ x, y });
  const posRef = useRef({ currentX: x, currentY: y });

  useEffect(() => {
    targetPosRef.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    if (!visible) return;

    let rafId = 0;
    const el = cursorRef.current;
    if (!el) return;

    const tick = () => {
      const pos = posRef.current;
      const target = targetPosRef.current;
      pos.currentX += (target.x - pos.currentX) * 0.16;
      pos.currentY += (target.y - pos.currentY) * 0.16;
      el.style.transform = `translate3d(${pos.currentX}px, ${pos.currentY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-50 flex items-center justify-center w-20 h-20 rounded-full bg-[#77795B] text-[#E8DDC8] shadow-[0_12px_32px_rgba(0,0,0,0.65)] transition-opacity duration-300 ease-out will-change-transform ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
      style={{
        border: '1px solid rgba(232, 221, 200, 0.35)',
      }}
    >
      <div className="flex flex-col items-center justify-center text-center leading-none">
        <span className="text-[10px] font-mono font-bold tracking-[0.24em] mb-1">
          {text}
        </span>
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </div>
  );
};
