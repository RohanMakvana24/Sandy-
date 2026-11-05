import React from 'react';
import { GalleryPortfolioItem } from '../utils/galleryConfig';
import { GalleryItem } from './GalleryItem';

export interface GalleryGridProps {
  items: readonly GalleryPortfolioItem[];
  onOpenLightbox: (item: GalleryPortfolioItem) => void;
  onCursorMove: (x: number, y: number) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  onOpenLightbox,
  onCursorMove,
  onCursorEnter,
  onCursorLeave,
}) => {
  return (
    <div
      role="region"
      aria-label="Haircut and Grooming Photography Gallery"
      data-testid="gallery-grid"
      className="portfolio-grid"
    >
      {items.map((item, index) => (
        <GalleryItem
          key={item.id}
          item={item}
          index={index}
          onOpenLightbox={onOpenLightbox}
          onCursorMove={onCursorMove}
          onCursorEnter={onCursorEnter}
          onCursorLeave={onCursorLeave}
        />
      ))}
    </div>
  );
};
