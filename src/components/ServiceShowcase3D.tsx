import React from 'react';
import {
  GroomingServiceItem,
  Service3DObjectType,
} from '../utils/servicesKinematics';
import { ServicesShowcaseScene } from './ServicesShowcaseScene';

export interface ServiceShowcase3DProps {
  activeService: GroomingServiceItem;
  activeIndex: number;
  pointerX: number;
  pointerY: number;
  scrollProgress: number;
  isMobile: boolean;
  glbModelOverrides?: Partial<Record<Service3DObjectType, string>>;
}

export const ServiceShowcase3D: React.FC<ServiceShowcase3DProps> = ({
  activeService,
  activeIndex,
  pointerX,
  pointerY,
  scrollProgress,
  isMobile,
  glbModelOverrides,
}) => {
  return (
    <div
      data-testid="service-showcase-3d"
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] flex items-center justify-center"
    >
      {/* Soft Studio Radial Pedestal Glow Behind Active 3D Object */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(119, 121, 91, 0.22) 0%, rgba(255, 244, 222, 0.05) 44%, rgba(23, 24, 25, 0) 72%)',
        }}
      />

      {/* Single Optimized Real-Time 3D Canvas */}
      <div className="relative z-10 w-full h-full">
        <ServicesShowcaseScene
          activeService={activeService}
          activeIndex={activeIndex}
          pointerX={pointerX}
          pointerY={pointerY}
          scrollProgress={scrollProgress}
          isMobile={isMobile}
          glbModelOverrides={glbModelOverrides}
        />
      </div>

      {/* Top-Left Active Service Heading Badge over Stage */}
      <div className="pointer-events-none absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col gap-1">
        <span
          data-testid="stage-active-heading"
          className="text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-[0.26em] text-[#989B74]"
        >
          {activeService.fullHeading}
        </span>
        <span
          data-testid="stage-active-instrument"
          className="text-xs sm:text-sm font-medium uppercase tracking-[0.16em] text-[#E8DDC8]/90"
        >
          {activeService.instrumentLabel}
        </span>
      </div>
    </div>
  );
};
