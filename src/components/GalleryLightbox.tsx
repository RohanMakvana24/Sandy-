import React, { useEffect, useRef } from 'react';
import { GalleryPortfolioItem } from '../utils/galleryConfig';
import { setSmoothScrollLocked } from '../utils/smoothScroll';

export interface GalleryLightboxProps {
  item: GalleryPortfolioItem | null;
  items: readonly GalleryPortfolioItem[];
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    setSmoothScrollLocked(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal for keyboard accessibility
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      setSmoothScrollLocked(false);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const counterText = `${String(currentIndex + 1).padStart(2, '0')} / ${String(
    items.length
  ).padStart(2, '0')}`;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 50) {
      onPrev();
    } else if (diff < -50) {
      onNext();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen preview: ${item.title}`}
      tabIndex={-1}
      data-testid="gallery-lightbox"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171819]/96 backdrop-blur-xl p-4 sm:p-8 outline-none animate-in fade-in duration-300"
    >
      {/* Top Controls Bar */}
      <div className="absolute top-4 sm:top-8 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-[0.28em] text-[#77795B]">
            {item.categoryLabel}
          </span>
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-[#77795B]"
          />
          <span
            data-testid="lightbox-counter"
            className="text-xs font-mono tracking-widest text-[#E8DDC8]"
          >
            {counterText}
          </span>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close fullscreen preview"
          data-testid="lightbox-close"
          className="p-2 sm:p-2.5 rounded-full border border-[#77795B]/30 bg-[#171819]/80 text-[#E8DDC8] hover:border-[#77795B] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#77795B] cursor-pointer"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[78vh] w-full flex flex-col items-center justify-center">
        <img
          src={item.imageUrl}
          alt={item.altText}
          className="max-h-[68vh] w-auto max-w-full object-contain rounded-sm border border-[#77795B]/30 shadow-[0_24px_64px_rgba(0,0,0,0.85)]"
        />

        {/* Caption Bar */}
        <div className="mt-4 sm:mt-6 w-full text-center max-w-2xl px-4">
          <h3
            data-testid="lightbox-title"
            className="text-xl sm:text-2xl font-bold uppercase tracking-[0.04em] text-[#E8DDC8]"
          >
            {item.number} — {item.title}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#E8DDC8]/75 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous portfolio item"
        data-testid="lightbox-prev"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full border border-[#77795B]/30 bg-[#171819]/70 text-[#E8DDC8] hover:border-[#77795B] hover:bg-[#77795B]/20 hover:text-[#FFFFFF] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#77795B] cursor-pointer"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next portfolio item"
        data-testid="lightbox-next"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full border border-[#77795B]/30 bg-[#171819]/70 text-[#E8DDC8] hover:border-[#77795B] hover:bg-[#77795B]/20 hover:text-[#FFFFFF] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#77795B] cursor-pointer"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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
  );
};
