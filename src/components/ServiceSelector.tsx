import React from 'react';
import { GroomingServiceItem } from '../utils/servicesKinematics';

export interface ServiceSelectorProps {
  services: readonly GroomingServiceItem[];
  activeIndex: number;
  onSelectService: (index: number) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  activeIndex,
  onSelectService,
}) => {
  return (
    <nav
      role="tablist"
      aria-label="Sandy Men's Salon Service Navigation"
      className="flex flex-col divide-y divide-[#77795B]/20 border-t border-b border-[#77795B]/25"
    >
      {services.map((service, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <button
            key={service.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={`service-panel-${service.id}`}
            id={`service-tab-${service.id}`}
            data-testid={`service-item-${service.number}`}
            data-services-reveal="service-row"
            onMouseEnter={() => onSelectService(idx)}
            onFocus={() => onSelectService(idx)}
            onClick={() => onSelectService(idx)}
            className={`group relative w-full text-left py-6 sm:py-7 px-3 sm:px-5 transition-all duration-300 focus:outline-none cursor-pointer ${
              isSelected
                ? 'bg-[#77795B]/[0.09]'
                : 'hover:bg-[#77795B]/[0.04]'
            }`}
          >
            {/* Animated Olive-Green Active Indicator */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[#77795B] transition-all duration-500 origin-center ${
                isSelected
                  ? 'scale-y-100 opacity-100 shadow-[0_0_12px_rgba(119,121,91,0.65)]'
                  : 'scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-40'
              }`}
            />

            <div className="flex items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-4 sm:gap-6">
                {/* Large Service Number */}
                <span
                  className={`text-xs sm:text-sm font-mono tracking-[0.24em] transition-colors duration-300 ${
                    isSelected
                      ? 'text-[#77795B] font-semibold'
                      : 'text-[#E8DDC8]/40 group-hover:text-[#77795B]/80'
                  }`}
                >
                  {service.number}
                </span>

                {/* Elegant Service Name with Horizontal Hover Shift */}
                <span
                  className={`text-xl sm:text-2xl lg:text-[1.7rem] font-bold tracking-[0.02em] transition-all duration-300 ${
                    isSelected
                      ? 'text-[#E8DDC8] translate-x-1.5'
                      : 'text-[#E8DDC8]/70 group-hover:text-[#E8DDC8] group-hover:translate-x-1'
                  }`}
                >
                  {service.title}
                </span>
              </div>

              {/* Minimal Counter Tag */}
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.22em] transition-all duration-300 ${
                  isSelected
                    ? 'text-[#77795B] opacity-100 translate-x-0'
                    : 'text-[#E8DDC8]/30 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                }`}
              >
                {isSelected ? 'ACTIVE 3D' : 'SELECT'}
              </span>
            </div>

            {/* Active Service Description */}
            <div
              id={`service-panel-${service.id}`}
              role="tabpanel"
              aria-labelledby={`service-tab-${service.id}`}
              className={`grid transition-all duration-400 ease-out ${
                isSelected
                  ? 'grid-rows-[1fr] opacity-100 mt-3'
                  : 'grid-rows-[0fr] opacity-0 mt-0'
              }`}
            >
              <div className="overflow-hidden pl-8 sm:pl-11 pr-2">
                <p
                  data-testid={
                    isSelected ? 'active-service-description' : undefined
                  }
                  className="text-sm sm:text-base font-normal leading-[1.65] text-[#E8DDC8]/80"
                >
                  {service.description}
                </p>
              </div>
            </div>

            {/* Animated Micro-Underline on Hover/Selection */}
            <div
              aria-hidden="true"
              className={`h-[1px] w-full bg-gradient-to-r from-[#989B74]/60 via-[#77795B]/30 to-transparent transition-all duration-500 origin-left mt-4 ${
                isSelected ? 'scale-x-100 opacity-80' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-30'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
};
