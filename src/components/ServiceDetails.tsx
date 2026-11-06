import React from 'react';
import { GroomingServiceItem } from '../utils/servicesKinematics';

export interface ServiceDetailsProps {
  service: GroomingServiceItem;
  services: readonly GroomingServiceItem[];
  activeIndex: number;
  onSelectService: (index: number) => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  service,
  services,
  activeIndex,
  onSelectService,
}) => {
  return (
    <footer className="mt-4 pt-5 border-t border-[#77795B]/25 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#77795B] mb-1">
          YOUR GROOMING EXPERIENCE
        </p>
        <p
          data-testid="stage-active-craft-detail"
          className="text-xs sm:text-sm text-[#E8DDC8]/75 leading-relaxed"
        >
          {service.description}
        </p>
      </div>

      {/* Tactile Numbered Minimal Service Counter & Quick Switcher */}
      <div
        aria-label="Quick switch 3D grooming object"
        className="flex items-center gap-1.5 self-start sm:self-auto"
      >
        {services.map((srv, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => onSelectService(idx)}
              aria-label={`Inspect ${srv.title} 3D object`}
              className={`px-2.5 py-1.5 text-[10px] font-mono tracking-[0.18em] border transition-all duration-200 cursor-pointer ${
                active
                  ? 'border-[#77795B] bg-[#77795B]/25 text-[#E8DDC8] shadow-[0_0_8px_rgba(119,121,91,0.35)]'
                  : 'border-[#77795B]/25 bg-transparent text-[#E8DDC8]/55 hover:border-[#77795B]/60 hover:text-[#E8DDC8]'
              }`}
            >
              {srv.number}
            </button>
          );
        })}
      </div>
    </footer>
  );
};
