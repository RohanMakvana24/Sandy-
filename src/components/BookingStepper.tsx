import React from 'react';
import { BOOKING_SECTION_COPY } from '../utils/bookingConfig';

export interface BookingStepperProps {
  currentStep: 1 | 2 | 3;
  onSelectStep: (step: 1 | 2 | 3) => void;
  canNavigateToStep2: boolean;
  canNavigateToStep3: boolean;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({
  currentStep,
  onSelectStep,
  canNavigateToStep2,
  canNavigateToStep3,
}) => {
  const steps = BOOKING_SECTION_COPY.steps;

  return (
    <nav
      aria-label="Booking steps"
      className="mb-10 sm:mb-14 border-b border-[#77795B]/25 pb-6"
    >
      <ol className="grid grid-cols-3 gap-2 sm:gap-6">
        {steps.map((st) => {
          const isCurrent = st.number === currentStep;
          const isCompleted = st.number < currentStep;
          const isClickable =
            st.number === 1 ||
            (st.number === 2 && canNavigateToStep2) ||
            (st.number === 3 && canNavigateToStep3);

          return (
            <li key={st.number} className="relative">
              <button
                type="button"
                onClick={() => isClickable && onSelectStep(st.number as 1 | 2 | 3)}
                disabled={!isClickable}
                aria-current={isCurrent ? 'step' : undefined}
                data-testid={`booking-step-btn-${st.number}`}
                className={`w-full text-left transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-45'
                }`}
              >
                {/* Step indicator bar */}
                <div
                  aria-hidden="true"
                  className={`h-1 w-full mb-3 rounded-full transition-all duration-400 ${
                    isCurrent
                      ? 'bg-[#989B74] shadow-[0_0_10px_rgba(152,155,116,0.65)]'
                      : isCompleted
                      ? 'bg-[#77795B]'
                      : 'bg-[#77795B]/20'
                  }`}
                />

                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-[11px] sm:text-xs font-mono font-bold tracking-widest ${
                      isCurrent
                        ? 'text-[#E8DDC8]'
                        : isCompleted
                        ? 'text-[#989B74]'
                        : 'text-[#E8DDC8]/35'
                    }`}
                  >
                    0{st.number}
                  </span>
                  <span
                    className={`hidden sm:inline-block text-xs font-bold uppercase tracking-[0.16em] truncate ${
                      isCurrent
                        ? 'text-[#E8DDC8]'
                        : isCompleted
                        ? 'text-[#E8DDC8]/75'
                        : 'text-[#E8DDC8]/35'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span
                    className={`inline-block sm:hidden text-[10px] font-bold uppercase tracking-[0.12em] truncate ${
                      isCurrent ? 'text-[#E8DDC8]' : 'text-[#E8DDC8]/35'
                    }`}
                  >
                    {st.short}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
