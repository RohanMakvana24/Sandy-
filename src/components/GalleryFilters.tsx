import React from 'react';
import {
  GALLERY_CATEGORIES,
  GalleryCategory,
  GalleryCategoryId,
} from '../utils/galleryConfig';

export interface GalleryFiltersProps {
  categories?: readonly GalleryCategory[];
  activeCategory: GalleryCategoryId;
  onSelectCategory: (id: GalleryCategoryId) => void;
}

export const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  categories = GALLERY_CATEGORIES,
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav
      aria-label="Gallery style categories"
      className="mb-12 sm:mb-16 overflow-x-auto pb-2 scrollbar-none"
    >
      <div
        role="tablist"
        className="flex items-center gap-2 sm:gap-4 border-b border-[#77795B]/25 pb-3 min-w-max"
      >
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-testid={`gallery-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative px-3.5 py-2 text-xs sm:text-sm font-mono uppercase tracking-[0.22em] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#77795B] cursor-pointer ${
                isActive
                  ? 'text-[#E8DDC8] font-semibold'
                  : 'text-[#E8DDC8]/50 hover:text-[#E8DDC8] hover:bg-[#77795B]/[0.08]'
              }`}
            >
              {cat.label}

              {/* Animated Olive-Green Underline */}
              <span
                aria-hidden="true"
                className={`absolute left-0 right-0 -bottom-[13px] h-[2px] bg-[#77795B] transition-all duration-400 ease-out origin-center ${
                  isActive
                    ? 'scale-x-100 opacity-100 shadow-[0_0_10px_rgba(119,121,91,0.7)]'
                    : 'scale-x-0 opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
