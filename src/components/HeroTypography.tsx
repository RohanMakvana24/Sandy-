import React from 'react';
import { HERO_COPY } from '../utils/heroKinematics';
import { HeroActions, HeroActionsProps } from './HeroActions';

export interface HeroTypographyProps extends HeroActionsProps {}

export const HeroTypography: React.FC<HeroTypographyProps> = React.memo(({
  onBookExperience,
  onExploreServices,
  activePreset,
  onChangePreset,
}) => {
  return (
    <div className="relative z-10 flex flex-col justify-center max-w-xl lg:max-w-[580px]">
      {/* Small Eyebrow Label */}
      <div className="js-hero-eyebrow flex items-center gap-3 mb-3 sm:mb-5">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#989B74]">
          {HERO_COPY.eyebrow}
        </span>
      </div>

      {/* Main Oversized Editorial Headline with Line-by-Line Reveal Masks */}
      <h1
        className="font-bold tracking-[-0.03em] leading-[0.94] mb-4 sm:mb-6 select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 6.2vw, 5.4rem)',
        }}
      >
        <span className="block overflow-hidden pb-0.5 sm:pb-1">
          <span className="js-hero-line-inner block text-[#E8DDC8]">
            {HERO_COPY.headlineLine1}
          </span>
        </span>
        <span className="block overflow-hidden pb-1">
          <span
            className="js-hero-line-inner block text-[#989B74]"
            style={{
              textShadow:
                '0 4px 24px rgba(119, 121, 91, 0.25), -1px 2px 0 rgba(20, 21, 16, 0.85)',
            }}
          >
            {HERO_COPY.headlineLine2}
          </span>
        </span>
      </h1>

      {/* Supporting Editorial Description */}
      <p className="js-hero-description text-sm sm:text-base lg:text-[18px] leading-[1.6] text-[#E8DDC8]/78 font-normal max-w-[46ch] mb-6 sm:mb-9">
        {HERO_COPY.description}
      </p>

      {/* Primary & Secondary Call-To-Action Buttons + 3D Posture Selector */}
      <HeroActions
        onBookExperience={onBookExperience}
        onExploreServices={onExploreServices}
        activePreset={activePreset}
        onChangePreset={onChangePreset}
      />
    </div>
  );
});

HeroTypography.displayName = 'HeroTypography';
