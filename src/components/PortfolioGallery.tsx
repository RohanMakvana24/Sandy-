import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  DEFAULT_PORTFOLIO_ITEMS,
  GALLERY_SECTION_COPY,
  GalleryCategoryId,
  GalleryPortfolioItem,
} from '../utils/galleryConfig';
import { GalleryHeading } from './GalleryHeading';
import { GalleryFilters } from './GalleryFilters';
import { GalleryGrid } from './GalleryGrid';
import { MagneticGalleryCursor } from './MagneticGalleryCursor';
import { GalleryLightbox } from './GalleryLightbox';
import './PortfolioGallery.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioGalleryProps {
  portfolioItems?: readonly GalleryPortfolioItem[];
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  portfolioItems = DEFAULT_PORTFOLIO_ITEMS,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<GalleryCategoryId>('all');
  const [selectedLightboxItem, setSelectedLightboxItem] =
    useState<GalleryPortfolioItem | null>(null);

  // Magnetic cursor state with RAF throttled updates
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);
  const cursorTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isCursorDirtyRef = useRef(false);

  const handleCursorMove = useCallback((x: number, y: number) => {
    cursorTargetRef.current = { x, y };
    if (!isCursorDirtyRef.current) {
      isCursorDirtyRef.current = true;
      requestAnimationFrame(() => {
        isCursorDirtyRef.current = false;
        setCursorPos(cursorTargetRef.current);
      });
    }
  }, []);

  const handleCursorEnter = useCallback(() => setCursorVisible(true), []);
  const handleCursorLeave = useCallback(() => setCursorVisible(false), []);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return portfolioItems;
    return portfolioItems.filter((item) => item.category === activeCategory);
  }, [portfolioItems, activeCategory]);

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      scrollTl
        .fromTo(
          '[data-gallery-reveal="eyebrow"]',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '[data-gallery-reveal="headline-line"]',
          { yPercent: 108, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .fromTo(
          '[data-gallery-reveal="description"]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          '[data-gallery-reveal="item"]',
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.45'
        );
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  // Lightbox handlers
  const handleOpenLightbox = (item: GalleryPortfolioItem) => {
    setSelectedLightboxItem(item);
    setCursorVisible(false);
  };

  const handleCloseLightbox = () => {
    setSelectedLightboxItem(null);
  };

  const handleNextLightbox = () => {
    if (!selectedLightboxItem) return;
    const currentIndex = filteredItems.findIndex(
      (i) => i.id === selectedLightboxItem.id
    );
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedLightboxItem(filteredItems[nextIndex]);
  };

  const handlePrevLightbox = () => {
    if (!selectedLightboxItem) return;
    const currentIndex = filteredItems.findIndex(
      (i) => i.id === selectedLightboxItem.id
    );
    const prevIndex =
      (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedLightboxItem(filteredItems[prevIndex]);
  };

  return (
    <section
      id={GALLERY_SECTION_COPY.sectionId}
      ref={sectionRef}
      data-testid="portfolio-gallery-section"
      aria-label="06 / Our Work — The Art of Transformation Portfolio Gallery"
      className="portfolio-section relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden"
    >
      {/* Top Hairline Transition from Phase 5 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />

      {/* Atmospheric Ambient Lighting Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 82% 38%, rgba(119, 121, 91, 0.12) 0%, rgba(232, 221, 200, 0.02) 42%, transparent 72%)',
        }}
      />

      {/* Desktop Magnetic Gallery Cursor */}
      <MagneticGalleryCursor
        visible={cursorVisible}
        x={cursorPos.x}
        y={cursorPos.y}
        text="VIEW"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* Section Header: 06 / OUR WORK */}
        <GalleryHeading />

        {/* Category Filter Tabs */}
        <div className="portfolio-toolbar">
        <GalleryFilters
          activeCategory={activeCategory}
          onSelectCategory={(id) => setActiveCategory(id)}
        />
        <span className="portfolio-count" aria-live="polite">{String(filteredItems.length).padStart(2, '0')} LOOKS</span>
        </div>

        {/* Asymmetric Masonry Gallery Grid */}
        <GalleryGrid
          items={filteredItems}
          onOpenLightbox={handleOpenLightbox}
          onCursorMove={handleCursorMove}
          onCursorEnter={handleCursorEnter}
          onCursorLeave={handleCursorLeave}
        />
        <div className="portfolio-footer"><span>A SIGNATURE IN EVERY DETAIL.</span><span>AI-created style inspiration</span></div>
      </div>

      {/* Fullscreen Cinematic Lightbox Modal */}
      <GalleryLightbox
        item={selectedLightboxItem}
        items={filteredItems}
        isOpen={Boolean(selectedLightboxItem)}
        onClose={handleCloseLightbox}
        onNext={handleNextLightbox}
        onPrev={handlePrevLightbox}
      />

      {/* Bottom Hairline Divider for Next Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />
    </section>
  );
};
