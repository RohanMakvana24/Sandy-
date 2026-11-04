import React, { useRef, useState } from 'react';
import { GalleryPortfolioItem } from '../utils/galleryConfig';

export interface GalleryItemProps {
  item: GalleryPortfolioItem;
  index: number;
  onOpenLightbox: (item: GalleryPortfolioItem) => void;
  onCursorMove: (x: number, y: number) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = React.memo(({
  item,
  index,
  onOpenLightbox,
  onCursorMove,
  onCursorEnter,
  onCursorLeave,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    onCursorMove(e.clientX, e.clientY);

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D perspective tilt (-4deg to +4deg)
    const rotateY = ((x - centerX) / centerX) * 4.0;
    const rotateX = -((y - centerY) / centerY) * 4.0;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
      2
    )}deg) scale3d(1.018, 1.018, 1.018)`;
  };

  const handlePointerLeave = () => {
    onCursorLeave();
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Open fullscreen view: ${item.number} — ${item.title}`}
      data-testid={`gallery-item-${item.number}`}
      data-gallery-reveal="item"
      onClick={() => onOpenLightbox(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenLightbox(item);
        }
      }}
      onPointerEnter={onCursorEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden bg-[#151618] border border-[#77795B]/25 rounded-sm transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#989B74] cursor-pointer will-change-transform ${item.colSpanClass}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Aspect Ratio Container */}
      <div className={`relative w-full ${item.aspectRatioClass} overflow-hidden`}>
        {/* Real Haircut Image */}
        <img
          src={item.imageUrl}
          alt={item.altText}
          loading={index < 2 ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Olive-Green Reveal Mask / Ambient Highlight Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171819] via-[#171819]/25 to-transparent opacity-85 group-hover:opacity-70 transition-opacity duration-500"
        />

        {/* Soft Olive-Green Ambient Border Glow on Hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_24px_rgba(119,121,91,0.25)]"
        />

        {/* Top Identification Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#77795B] bg-[#171819]/80 px-2.5 py-1 rounded-xs border border-[#77795B]/30 backdrop-blur-md">
            {item.number}
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#E8DDC8]/75 bg-[#171819]/80 px-2 py-0.5 rounded-xs border border-[#77795B]/25 backdrop-blur-md">
            {item.craftTag}
          </span>
        </div>

        {/* Bottom Editorial Content Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 z-10 flex flex-col justify-end">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#77795B] mb-1">
            {item.categoryLabel}
          </p>

          <div className="flex items-end justify-between gap-4">
            <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold uppercase tracking-[-0.02em] text-[#E8DDC8] transition-transform duration-400 group-hover:translate-x-1">
              {item.title}
            </h3>

            {/* Circular Arrow Indicator */}
            <div
              aria-hidden="true"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#77795B]/35 bg-[#171819]/60 text-[#E8DDC8] transition-all duration-400 group-hover:bg-[#77795B] group-hover:border-[#77795B] group-hover:scale-110"
            >
              <svg
                className="w-4 h-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-[#E8DDC8]/75 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
});

GalleryItem.displayName = 'GalleryItem';
