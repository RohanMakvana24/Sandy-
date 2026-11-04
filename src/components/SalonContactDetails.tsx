import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  SALON_LOCATION_CONFIG,
  getVerifiedContactRows,
  ContactRowItem,
} from '../utils/contactConfig';

export const SalonContactDetails: React.FC = () => {
  const contactRows = getVerifiedContactRows(SALON_LOCATION_CONFIG);

  return (
    <div
      data-loc-reveal="details-panel"
      className="flex flex-col justify-between h-full space-y-8"
    >
      {/* Brand Location Header */}
      <div className="space-y-2">
        <div className="text-xs font-mono tracking-[0.2em] text-[#969972] uppercase">
          ATELIER &amp; STUDIO
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E8DDC8]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {SALON_LOCATION_CONFIG.salonName}
        </h3>
        <p className="text-sm sm:text-base text-[#E8DDC8]/65 font-light">
          {SALON_LOCATION_CONFIG.address}, {SALON_LOCATION_CONFIG.city},{' '}
          {SALON_LOCATION_CONFIG.state}, {SALON_LOCATION_CONFIG.country}
        </p>
      </div>

      {/* Editorial Horizontal Contact Rows */}
      <div
        role="list"
        aria-label="Salon Contact and Visiting Information"
        className="divide-y divide-[#77795B]/20 border-y border-[#77795B]/20"
      >
        {contactRows.map((row: ContactRowItem) => {
          const isClickable = Boolean(row.href);

          const content = (
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 py-4 sm:py-5 group-hover:translate-x-1 transition-transform duration-200">
              {/* Row Left: Index + Label */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0 min-w-[160px]">
                <span className="text-xs font-mono tabular-nums text-[#969972]">
                  {row.index}
                </span>
                <span className="text-xs sm:text-[13px] font-semibold tracking-wider text-[#E8DDC8]/75 uppercase">
                  {row.label}
                </span>
              </div>

              {/* Row Right: Value + Subtext + Optional Arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-1 text-right">
                <div className="text-left sm:text-right">
                  <div className="text-sm sm:text-base font-medium text-[#E8DDC8] group-hover:text-[#E8DDC8] transition-colors">
                    {row.value}
                  </div>
                  {row.subText && (
                    <div className="text-xs text-[#E8DDC8]/50 mt-0.5">
                      {row.subText}
                    </div>
                  )}
                </div>

                {isClickable && (
                  <span
                    aria-hidden="true"
                    className="flex items-center justify-center w-6 h-6 rounded-full text-[#969972] group-hover:text-[#E8DDC8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2"
                  >
                    {row.isExternal ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>
            </div>
          );

          if (isClickable && row.href) {
            return (
              <a
                key={row.id}
                role="listitem"
                data-loc-reveal="contact-row"
                href={row.href}
                target={row.isExternal ? '_blank' : undefined}
                rel={row.isExternal ? 'noopener noreferrer' : undefined}
                className="group block relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8] px-2 -mx-2 rounded transition-colors hover:bg-[#77795B]/10"
                aria-label={`${row.label}: ${row.value}${
                  row.isExternal ? ' (opens in new window)' : ''
                }`}
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={row.id}
              role="listitem"
              data-loc-reveal="contact-row"
              className="group block relative px-2 -mx-2"
            >
              {content}
            </div>
          );
        })}
      </div>

      {/* Walk-in & Reservation Advisory */}
      <div className="pt-2 flex items-center justify-between text-xs text-[#E8DDC8]/55 font-mono">
        <span>TIMEZONE: ASIA/KOLKATA</span>
        <span>EXPERIENCE BY APPOINTMENT</span>
      </div>
    </div>
  );
};
