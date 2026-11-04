import React from 'react';
import { BookingState } from '../utils/bookingConfig';

export interface BookingSummaryProps {
  booking: BookingState;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ booking }) => {
  return (
    <div
      role="region"
      aria-label="Live appointment request summary"
      data-testid="booking-summary"
      className="p-6 sm:p-7 rounded-sm border border-[#77795B]/30 bg-[#161719] flex flex-col justify-between shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
    >
      <div>
        <div className="flex items-center justify-between border-b border-[#77795B]/20 pb-4 mb-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.26em] text-[#989B74]">
            APPOINTMENT SPECIFICATION
          </span>
          <span className="text-[10px] font-mono text-[#E8DDC8]/40 uppercase tracking-widest">
            LIVE SUMMARY
          </span>
        </div>

        <dl className="flex flex-col divide-y divide-[#77795B]/15 text-xs sm:text-sm">
          {/* Selected Service */}
          <div className="py-3.5 flex flex-col gap-1">
            <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
              SELECTED EXPERIENCE
            </dt>
            <dd
              data-testid="summary-service"
              className="font-bold text-[#E8DDC8] text-sm sm:text-base tracking-wide"
            >
              {booking.selectedService
                ? `${booking.selectedService.number} — ${booking.selectedService.title}`
                : 'Not selected yet'}
            </dd>
          </div>

          {/* Preferred Date */}
          <div className="py-3.5 flex flex-col gap-1">
            <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
              PREFERRED DATE
            </dt>
            <dd
              data-testid="summary-date"
              className="font-mono text-[#E8DDC8] tracking-wider"
            >
              {booking.selectedDate || 'Select a date in Step 2'}
            </dd>
          </div>

          {/* Preferred Time */}
          <div className="py-3.5 flex flex-col gap-1">
            <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
              REQUESTED TIME
            </dt>
            <dd
              data-testid="summary-time"
              className="font-mono text-[#E8DDC8] tracking-wider"
            >
              {booking.selectedTimeSlot || 'Select a slot in Step 2'}
            </dd>
          </div>

          {/* Customer Info (when in Step 3) */}
          {booking.fullName && (
            <div className="py-3.5 flex flex-col gap-1">
              <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
                CLIENT NAME
              </dt>
              <dd data-testid="summary-client" className="text-[#E8DDC8]">
                {booking.fullName}
              </dd>
            </div>
          )}

          {booking.mobile && (
            <div className="py-3.5 flex flex-col gap-1">
              <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#989B74]">
                CONTACT NUMBER
              </dt>
              <dd data-testid="summary-mobile" className="font-mono text-[#E8DDC8]">
                {booking.mobile}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-6 pt-4 border-t border-[#77795B]/20">
        <p className="text-[10px] font-mono text-[#E8DDC8]/50 uppercase tracking-widest leading-relaxed">
          LOCATION: KALAWAD ROAD, RAJKOT
        </p>
      </div>
    </div>
  );
};
