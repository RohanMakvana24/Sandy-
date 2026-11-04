import React from 'react';
import {
  DEFAULT_GROOMING_SERVICES,
  GroomingServiceItem,
} from '../utils/servicesKinematics';

export interface ServiceSelectionProps {
  services?: readonly GroomingServiceItem[];
  selectedService: GroomingServiceItem | null;
  onSelectService: (service: GroomingServiceItem) => void;
  onContinue: () => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services = DEFAULT_GROOMING_SERVICES,
  selectedService,
  onSelectService,
  onContinue,
}) => {
  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-baseline justify-between border-b border-[#77795B]/20 pb-3">
        <h3 className="text-sm font-mono font-bold uppercase tracking-[0.24em] text-[#989B74]">
          STEP 01 — SELECT YOUR SERVICE
        </h3>
        <span className="text-xs text-[#E8DDC8]/55 font-light">
          Choose 1 of {services.length} experiences
        </span>
      </div>

      {/* Interactive Luxury Service Tiles */}
      <div
        role="radiogroup"
        aria-label="Grooming services"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
      >
        {services.map((item) => {
          const isSelected = selectedService?.id === item.id;

          return (
            <div
              key={item.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              data-testid={`booking-service-tile-${item.number}`}
              onClick={() => onSelectService(item)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onSelectService(item);
                }
              }}
              className={`group relative p-5 sm:p-6 rounded-sm border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#989B74] cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#77795B]/20 border-[#989B74] shadow-[0_12px_32px_rgba(0,0,0,0.6),0_0_16px_rgba(152,155,116,0.22)]'
                  : 'bg-[#151618] border-[#77795B]/25 hover:border-[#77795B]/60 hover:bg-[#77795B]/[0.06]'
              }`}
            >
              {/* Animated Selection Radio Stud */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-baseline gap-3">
                  <span
                    className={`text-xs font-mono tracking-widest ${
                      isSelected ? 'text-[#989B74] font-bold' : 'text-[#E8DDC8]/40'
                    }`}
                  >
                    {item.number}
                  </span>
                  <h4
                    className={`text-base sm:text-lg font-bold uppercase tracking-[0.04em] ${
                      isSelected ? 'text-[#E8DDC8]' : 'text-[#E8DDC8]/90'
                    }`}
                  >
                    {item.title}
                  </h4>
                </div>

                <div
                  aria-hidden="true"
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#989B74] bg-[#989B74]'
                      : 'border-[#77795B]/40 bg-transparent group-hover:border-[#989B74]/70'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-[#171819]" />
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#E8DDC8]/70 leading-relaxed font-light mb-4">
                {item.description}
              </p>

              <div className="pt-3 border-t border-[#77795B]/15 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
                <span>{item.instrumentLabel.split(' ')[0]} SPEC</span>
                <span className="text-[#E8DDC8]/50">
                  {isSelected ? 'SELECTED' : 'SELECT'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedService}
          data-testid="booking-continue-step1"
          className={`px-8 py-3.5 rounded-sm text-xs font-mono font-bold uppercase tracking-[0.22em] transition-all duration-300 flex items-center gap-3 ${
            selectedService
              ? 'bg-[#77795B] text-[#E8DDC8] hover:bg-[#888a68] shadow-[0_8px_20px_rgba(0,0,0,0.5)] cursor-pointer'
              : 'bg-[#77795B]/20 text-[#E8DDC8]/35 border border-[#77795B]/20 cursor-not-allowed'
          }`}
        >
          <span>PROCEED TO DATE &amp; TIME</span>
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
