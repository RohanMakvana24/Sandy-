import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ChairViewPreset, HERO_COPY } from '../utils/heroKinematics';

export interface HeroActionsProps {
  onBookExperience: () => void;
  onExploreServices: () => void;
  activePreset: ChairViewPreset;
  onChangePreset: (preset: ChairViewPreset) => void;
}

const STUDIO_PRESETS: { id: ChairViewPreset; label: string }[] = [
  { id: 'signature', label: 'Signature ¾' },
  { id: 'recline', label: 'Royal Recline' },
  { id: 'profile', label: 'Side Profile' },
];

export const HeroActions: React.FC<HeroActionsProps> = ({
  onBookExperience,
  onExploreServices,
  activePreset,
  onChangePreset,
}) => {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Primary & Secondary Call-To-Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Primary CTA: BOOK YOUR EXPERIENCE */}
        <button
          type="button"
          onClick={onBookExperience}
          className="js-hero-cta olive-plaque-btn group relative inline-flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-[14px] text-[#E8DDC8] font-semibold text-xs sm:text-[12.5px] tracking-[0.13em] uppercase whitespace-nowrap shrink-0 overflow-hidden transition-all duration-300 hover:-translate-y-[1.5px] active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {/* Directional warm light sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E8DDC8]/22 to-transparent skew-x-[-20deg] transition-transform duration-700 ease-out group-hover:translate-x-full"
          />
          <span className="relative z-10">{HERO_COPY.primaryCta}</span>
          <ArrowRight className="w-4 h-4 text-[#E8DDC8] transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
        </button>

        {/* Secondary CTA: EXPLORE SERVICES */}
        <a
          href="#services"
          onClick={(e) => {
            e.preventDefault();
            onExploreServices();
          }}
          className="js-hero-cta group relative inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3.5 sm:py-4 rounded-[14px] bg-[#1a1c1d] border border-[#E8DDC8]/30 hover:border-[#E8DDC8]/60 text-[#E8DDC8] hover:text-[#FFFFFF] font-semibold text-xs sm:text-[12.5px] tracking-[0.13em] uppercase whitespace-nowrap shrink-0 transition-all duration-200 hover:-translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span>{HERO_COPY.secondaryCta}</span>
          <ArrowUpRight className="w-4 h-4 text-[#77795B] group-hover:text-[#E8DDC8] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
        </a>
      </div>

      {/* Unboxed Interactive 3D Chair Angle Selector */}
      <div
        role="group"
        aria-label="3D Barber Chair Studio Angle"
        className="js-hero-cta flex flex-wrap items-center gap-4 pt-1"
      >
        {STUDIO_PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChangePreset(preset.id)}
              aria-pressed={isSelected}
              className={`relative pb-1 text-xs font-medium tracking-[0.08em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8] rounded ${
                isSelected
                  ? 'text-[#989B74]'
                  : 'text-[#E8DDC8]/50 hover:text-[#E8DDC8]'
              }`}
            >
              <span>{preset.label}</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#77795B] transition-transform duration-200 origin-left ${
                  isSelected ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
