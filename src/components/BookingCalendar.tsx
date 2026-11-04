import React, { useMemo, useState } from 'react';
import { getKolkataDateString, SALON_CONFIG } from '../utils/bookingConfig';

export interface BookingCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateString: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const todayStr = useMemo(() => getKolkataDateString(), []);
  const todayDate = useMemo(() => new Date(`${todayStr}T00:00:00`), [todayStr]);

  // Calendar view month & year state (defaults to today's month in Asia/Kolkata)
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (selectedDate) {
      return new Date(`${selectedDate}T00:00:00`);
    }
    return todayDate;
  });

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const monthName = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(viewDate);
  }, [viewDate]);

  // Max advance date limit
  const maxAdvanceDate = useMemo(() => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() + SALON_CONFIG.maxAdvanceDays);
    return d;
  }, [todayDate]);

  // Generate calendar days for current viewMonth
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: Array<{
      dayNumber: number | null;
      dateString: string;
      isPast: boolean;
      isBeyondMax: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    // Prefix empty slots for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({
        dayNumber: null,
        dateString: '',
        isPast: true,
        isBeyondMax: true,
        isSelected: false,
        isToday: false,
      });
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dayDate = new Date(viewYear, viewMonth, day);
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const dateStr = `${viewYear}-${mm}-${dd}`;

      const isPast = dayDate < todayDate;
      const isBeyondMax = dayDate > maxAdvanceDate;
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === todayStr;

      days.push({
        dayNumber: day,
        dateString: dateStr,
        isPast,
        isBeyondMax,
        isSelected,
        isToday,
      });
    }

    return days;
  }, [viewYear, viewMonth, todayDate, maxAdvanceDate, selectedDate, todayStr]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div
      role="group"
      aria-label="Appointment date selector"
      data-testid="booking-calendar"
      className="p-5 sm:p-6 rounded-sm border border-[#77795B]/25 bg-[#151618] flex flex-col"
    >
      {/* Month & Year Navigation */}
      <div className="flex items-center justify-between border-b border-[#77795B]/20 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#989B74] block">
            ASIA/KOLKATA TIMEZONE
          </span>
          <h4
            data-testid="calendar-month-heading"
            className="text-base sm:text-lg font-bold uppercase tracking-[0.06em] text-[#E8DDC8]"
          >
            {monthName}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            data-testid="calendar-prev-month"
            className="p-2 rounded-xs border border-[#77795B]/30 hover:border-[#989B74] hover:bg-[#77795B]/20 text-[#E8DDC8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            data-testid="calendar-next-month"
            className="p-2 rounded-xs border border-[#77795B]/30 hover:border-[#989B74] hover:bg-[#77795B]/20 text-[#E8DDC8] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekdays.map((wd) => (
          <span
            key={wd}
            className="text-[10px] font-mono uppercase tracking-widest text-[#989B74]"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {calendarDays.map((slot, idx) => {
          if (!slot.dayNumber) {
            return (
              <div
                key={`empty-${idx}`}
                aria-hidden="true"
                className="h-10 sm:h-11"
              />
            );
          }

          const isDisabled = slot.isPast || slot.isBeyondMax;

          return (
            <button
              key={slot.dateString}
              type="button"
              disabled={isDisabled}
              data-testid={`calendar-day-${slot.dayNumber}`}
              onClick={() => onSelectDate(slot.dateString)}
              className={`h-10 sm:h-11 rounded-xs text-xs sm:text-sm font-mono font-medium transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#989B74] ${
                isDisabled
                  ? 'text-[#E8DDC8]/20 bg-transparent cursor-not-allowed'
                  : slot.isSelected
                  ? 'bg-[#989B74] text-[#171819] font-bold shadow-[0_0_12px_rgba(152,155,116,0.5)]'
                  : slot.isToday
                  ? 'border border-[#989B74]/60 text-[#E8DDC8] hover:bg-[#77795B]/20 cursor-pointer'
                  : 'text-[#E8DDC8]/85 hover:bg-[#77795B]/25 hover:text-[#E8DDC8] cursor-pointer'
              }`}
            >
              {slot.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};
