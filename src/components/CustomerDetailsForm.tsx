import React, { useState } from 'react';
import {
  BOOKING_SECTION_COPY,
  BookingFormErrors,
  BookingState,
  SALON_CONFIG,
  buildWhatsAppBookingUrl,
  validateBooking,
} from '../utils/bookingConfig';

export interface CustomerDetailsFormProps {
  booking: BookingState;
  onUpdateField: (field: 'fullName' | 'mobile' | 'specialRequests', value: string) => void;
  onBack: () => void;
}

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
  booking,
  onUpdateField,
  onBack,
}) => {
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateBooking(booking);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    const whatsappUrl = buildWhatsAppBookingUrl(
      booking,
      SALON_CONFIG.whatsappNumber
    );

    if (whatsappUrl) {
      setRequestSent(true);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const whatsappUrl = buildWhatsAppBookingUrl(
    booking,
    SALON_CONFIG.whatsappNumber
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Customer booking information form"
      data-testid="customer-details-form"
      className="p-6 sm:p-8 rounded-sm border border-[#77795B]/30 bg-[#151618] flex flex-col"
    >
      <div className="border-b border-[#77795B]/20 pb-4 mb-6">
        <h3 className="text-sm font-mono font-bold uppercase tracking-[0.24em] text-[#989B74]">
          STEP 03 — YOUR DETAILS &amp; CONFIRMATION
        </h3>
        <p className="text-xs text-[#E8DDC8]/60 font-light mt-1">
          Review your selection and request via Sandy Men’s Salon official WhatsApp desk.
        </p>
      </div>

      {/* Read-Only Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xs bg-[#171819] border border-[#77795B]/20">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#989B74] block">
            SERVICE
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#E8DDC8] truncate block">
            {booking.selectedService?.title || 'None selected'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#989B74] block">
            DATE
          </span>
          <span className="text-xs sm:text-sm font-mono text-[#E8DDC8] block">
            {booking.selectedDate || 'No date chosen'}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#989B74] block">
            TIME
          </span>
          <span className="text-xs sm:text-sm font-mono text-[#E8DDC8] block">
            {booking.selectedTimeSlot || 'No slot chosen'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        {/* Full Name */}
        <div>
          <label
            htmlFor="booking-fullname"
            className="block text-xs font-mono uppercase tracking-[0.2em] text-[#989B74] mb-2"
          >
            FULL NAME <span className="text-[#E8DDC8]">*</span>
          </label>
          <input
            id="booking-fullname"
            name="fullName"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            value={booking.fullName}
            onChange={(e) => {
              onUpdateField('fullName', e.target.value);
              if (errors.fullName) {
                setErrors((prev) => ({ ...prev, fullName: undefined }));
              }
            }}
            placeholder="e.g. Aarav Mehta"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullname-error' : undefined}
            data-testid="booking-input-fullname"
            className={`w-full px-4 py-3 rounded-xs border text-sm sm:text-base font-normal bg-[#18191b] text-[#E8DDC8] placeholder:text-[#E8DDC8]/30 focus:outline-none transition-colors ${
              errors.fullName
                ? 'border-red-400 focus:border-red-400'
                : 'border-[#77795B]/40 focus:border-[#989B74]'
            }`}
          />
          {errors.fullName && (
            <p
              id="fullname-error"
              className="mt-1.5 text-xs text-red-300 font-mono"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="booking-mobile"
            className="block text-xs font-mono uppercase tracking-[0.2em] text-[#989B74] mb-2"
          >
            MOBILE NUMBER (INDIAN) <span className="text-[#E8DDC8]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#E8DDC8]/50">
              +91
            </span>
            <input
              id="booking-mobile"
              name="mobile"
              type="tel"
              required
              maxLength={18}
              inputMode="tel"
              autoComplete="tel"
              value={booking.mobile}
              onChange={(e) => {
                onUpdateField('mobile', e.target.value);
                if (errors.mobile) {
                  setErrors((prev) => ({ ...prev, mobile: undefined }));
                }
              }}
              placeholder="98250 12345"
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={errors.mobile ? 'mobile-error' : undefined}
              data-testid="booking-input-mobile"
              className={`w-full pl-14 pr-4 py-3 rounded-xs border text-sm sm:text-base font-mono bg-[#18191b] text-[#E8DDC8] placeholder:text-[#E8DDC8]/30 focus:outline-none transition-colors ${
                errors.mobile
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-[#77795B]/40 focus:border-[#989B74]'
              }`}
            />
          </div>
          {errors.mobile && (
            <p
              id="mobile-error"
              className="mt-1.5 text-xs text-red-300 font-mono"
            >
              {errors.mobile}
            </p>
          )}
        </div>

        {/* Special Requests (Optional) */}
        <div>
          <label
            htmlFor="booking-requests"
            className="block text-xs font-mono uppercase tracking-[0.2em] text-[#989B74] mb-2"
          >
            SPECIAL REQUESTS (OPTIONAL)
          </label>
          <textarea
            id="booking-requests"
            name="specialRequests"
            rows={3}
            maxLength={1000}
            value={booking.specialRequests}
            onChange={(e) => onUpdateField('specialRequests', e.target.value)}
            placeholder="Any specific styling instructions, scalp care notes, or beard trimming preferences..."
            data-testid="booking-input-requests"
            className="w-full px-4 py-3 rounded-xs border border-[#77795B]/40 focus:border-[#989B74] text-sm sm:text-base font-normal bg-[#18191b] text-[#E8DDC8] placeholder:text-[#E8DDC8]/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* WhatsApp Status Disclaimer */}
      <div className="mb-8 p-4 rounded-xs border border-[#77795B]/25 bg-[#171819]">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#989B74] mt-1.5 shrink-0" />
          <div className="text-xs text-[#E8DDC8]/75 leading-relaxed">
            <p className="font-semibold text-[#E8DDC8] mb-0.5">
              {BOOKING_SECTION_COPY.statusMessage}
            </p>
            <p className="font-light">
              Clicking &ldquo;SEND WHATSAPP APPOINTMENT REQUEST&rdquo; will launch your WhatsApp chat with a prefilled appointment specification. Tap Send in WhatsApp to deliver your request. The salon will confirm availability.
            </p>
          </div>
        </div>
      </div>

      {requestSent && (
        <div
          role="status"
          data-testid="booking-request-sent-banner"
          className="mb-6 p-4 rounded-xs border border-[#989B74] bg-[#77795B]/20 text-[#E8DDC8] text-xs sm:text-sm font-mono flex items-center gap-3 animate-in fade-in"
        >
          <svg className="w-5 h-5 text-[#989B74] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>
            Continue in WhatsApp and tap Send in WhatsApp to deliver your appointment request to the Sandy desk.
          </span>
        </div>
      )}

      {(errors.selectedService || errors.selectedTimeSlot) && <p role="alert" className="mb-4 text-sm text-red-300">{errors.selectedService || errors.selectedTimeSlot} Use Back to update your selection.</p>}
      {!whatsappUrl && <p role="alert" className="mb-4 text-sm">Online requests are currently unavailable. Please contact the salon directly.</p>}
      {requestSent && whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block mb-4 underline">Open WhatsApp again</a>}
      {/* Action Buttons: Back + Send WhatsApp Request */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#77795B]/20">
        <button
          type="button"
          onClick={onBack}
          data-testid="booking-back-step3"
          className="w-full sm:w-auto px-6 py-3 rounded-xs border border-[#77795B]/40 hover:border-[#989B74] hover:bg-[#77795B]/20 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#E8DDC8] transition-colors cursor-pointer"
        >
          &larr; BACK TO DATE &amp; TIME
        </button>

        <button
          type="submit"
          disabled={!whatsappUrl}
          data-testid="booking-submit-whatsapp"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xs bg-[#77795B] hover:bg-[#888a68] text-[#E8DDC8] text-xs sm:text-sm font-mono font-bold uppercase tracking-[0.2em] shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex items-center justify-center gap-3"
        >
          <span>SEND WHATSAPP APPOINTMENT REQUEST</span>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </form>
  );
};
