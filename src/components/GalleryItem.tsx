import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GalleryPortfolioItem } from '../utils/galleryConfig';

export interface GalleryItemProps {
  item: GalleryPortfolioItem;
  index: number;
  onOpenLightbox: (item: GalleryPortfolioItem) => void;
  onCursorMove: (x: number, y: number) => void;
  onCursorEnter: () => void;
  onCursorLeave: () => void;
}

export const GalleryItem: React.FC<GalleryItemProps> = React.memo(({ item, index, onOpenLightbox }) => (
  <button type="button" className="portfolio-card" data-gallery-reveal="item"
    data-testid={`gallery-item-${item.number}`} aria-label={`Open fullscreen view: ${item.title}`}
    onClick={() => onOpenLightbox(item)}>
    <div className="portfolio-card-photo">
      <img src={item.imageUrl} alt={item.altText} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" />
      <span className="portfolio-card-number">/ {item.number}</span>
      <span className="portfolio-card-open" aria-hidden="true"><ArrowUpRight size={20} /></span>
      <span className="portfolio-card-hint" aria-hidden="true">EXPLORE THE LOOK</span>
    </div>
    <div className="portfolio-card-caption">
      <span className="portfolio-card-category">{item.categoryLabel}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  </button>
));
GalleryItem.displayName = 'GalleryItem';
