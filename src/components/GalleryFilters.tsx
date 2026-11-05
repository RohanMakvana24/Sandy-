import React from 'react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryCategoryId } from '../utils/galleryConfig';

export interface GalleryFiltersProps {
  categories?: readonly GalleryCategory[];
  activeCategory: GalleryCategoryId;
  onSelectCategory: (id: GalleryCategoryId) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({ categories = GALLERY_CATEGORIES, activeCategory, onSelectCategory }) => (
  <nav aria-label="Gallery style categories" className="portfolio-filters">
    {categories.map(category => <button key={category.id} type="button"
      aria-pressed={category.id === activeCategory}
      data-testid={`gallery-filter-${category.id}`} onClick={() => onSelectCategory(category.id)}>
      {category.label}
    </button>)}
  </nav>
);
