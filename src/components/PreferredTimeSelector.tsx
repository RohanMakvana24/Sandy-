import React from 'react';
import {
  BOOKING_SECTION_COPY,
  SALON_REQUEST_TIMESLOTS,
} from '../utils/bookingConfig';

export interface PreferredTimeSelectorProps {
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
  slots?: readonly string[];
}

export const PreferredTimeSelector: React.FC<PreferredTimeSelectorProps> = ({
  selectedTimeSlot,
  onSelectTimeSlot,
  slots = SALON_REQUEST_TIMESLOTS,
}) => {
  return (
    <div
      role="group"
      aria-label="Preferred appointment time selection"
      data-testid="preferred-time-selector"
      className="p-5 sm:p-6 rounded-sm border border-[#77795B]/25 bg-[#151618] flex flex-col justify-between"
    >
      <div>
        <div className="border-b border-[#77795B]/20 pb-4 mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#989B74] block">
            REQUESTED TIME WINDOW
          </span>
          <h4 className="text-base sm:text-lg font-bold uppercase tracking-[0.06em] text-[#E8DDC8]">
            SELECT PREFERRED SLOT
          </h4>
        </div>

        {/* Clear Request Disclaimer */}
        <p className="text-xs text-[#E8DDC8]/65 font-light leading-relaxed mb-5 italic">
          &ldquo;{BOOKING_SECTION_COPY.disclaimer}&rdquo;
        </p>

        {/* Grid of Selectable Timeslots */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {slots.map((slot) => {
            const isSelected = selectedTimeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                data-testid={`timeslot-btn-${slot.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => onSelectTimeSlot(slot)}
                className={`py-3 px-3 rounded-xs border text-xs sm:text-sm font-mono tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer ${
                  isSelected
                    ? 'bg-[#989B74] border-[#989B74] text-[#171819] font-bold shadow-[0_0_12px_rgba(152,155,116,0.45)]'
                    : 'border-[#77795B]/30 bg-transparent text-[#E8DDC8]/85 hover:border-[#77795B]/70 hover:bg-[#77795B]/15 hover:text-[#E8DDC8]'
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#77795B]/15 text-[10px] font-mono text-[#989B74] uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#989B74]" />
        <span>STUDIO HOURS: 10:30 AM — 08:30 PM IST</span>
      </div>
    </div>
  );
};
