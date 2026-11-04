import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, X, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import {
  SALON_SERVICES,
  TIME_SLOTS,
  BookingFormInput,
  validateBookingForm,
} from '../utils/navigation';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed?: (booking: BookingFormInput) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
}) => {
  const [form, setForm] = useState<BookingFormInput>({
    fullName: '',
    phone: '',
    service: SALON_SERVICES[0],
    date: '2026-11-05',
    timeSlot: TIME_SLOTS[2],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormInput, string>>>({});
  const [submittedBooking, setSubmittedBooking] = useState<BookingFormInput | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmittedBooking(form);
    if (onConfirmed) {
      onConfirmed(form);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedBooking(null);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#171819] border border-[#E8DDC8]/15 p-6 sm:p-8 text-[#E8DDC8] shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden"
      >
        {/* Top warm LED accent strip */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[2px] bottom-led-strip"
        />

        {/* Ambient overhead warm light wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full opacity-35"
          style={{
            background:
              'radial-gradient(circle, rgba(255,244,222,0.35) 0%, transparent 70%)',
            filter: 'blur(16px)',
          }}
        />

        <div className="relative flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#9ea17c] mb-1">
              Sandy Men&apos;s Salon · Rajkot
            </p>
            <h2
              id="booking-modal-title"
              className="text-2xl font-bold tracking-tight text-[#E8DDC8]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {submittedBooking ? 'Appointment Reserved' : 'Reserve Your Chair'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close appointment modal"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#222425] text-[#E8DDC8]/80 hover:text-[#E8DDC8] hover:bg-[#77795B]/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedBooking ? (
          <div className="space-y-6 py-2">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1f211d] border border-[#77795B]/45">
              <CheckCircle2 className="w-6 h-6 text-[#9ea17c] shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-[#E8DDC8]">
                  We look forward to welcoming you, {submittedBooking.fullName}.
                </p>
                <p className="text-[#E8DDC8]/75">
                  Confirmation SMS sent to <span className="text-[#E8DDC8] font-medium">{submittedBooking.phone}</span>.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm border-y border-[#E8DDC8]/10 py-4">
              <div className="flex justify-between gap-4">
                <span className="text-[#E8DDC8]/60">Grooming Ritual</span>
                <span className="font-medium text-[#E8DDC8] text-right">{submittedBooking.service}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#E8DDC8]/60">Date &amp; Time</span>
                <span className="font-medium text-[#9ea17c] tabular-nums">
                  {submittedBooking.date} · {submittedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#E8DDC8]/60">Flagship Lounge</span>
                <span className="text-[#E8DDC8]/90 inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9ea17c]" />
                  Kalawad Road, Rajkot
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#E8DDC8]/80 hover:text-[#E8DDC8] border border-[#E8DDC8]/15 hover:border-[#E8DDC8]/30 transition-colors"
              >
                Modify Details
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="olive-plaque-btn px-6 py-2.5 rounded-xl text-sm font-semibold text-[#E8DDC8] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="booking-full-name"
                className="block text-xs font-medium text-[#E8DDC8]/80 mb-1.5"
              >
                Client Full Name
              </label>
              <input
                id="booking-full-name"
                type="text"
                value={form.fullName}
                onChange={(e) => {
                  setForm({ ...form, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="e.g. Aarav Jadeja"
                className="w-full rounded-xl bg-[#101112] border border-[#E8DDC8]/15 px-3.5 py-2.5 text-sm text-[#E8DDC8] placeholder:text-[#E8DDC8]/35 focus:outline-none focus:border-[#77795B]"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-[#e5a97c]" role="alert">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-phone"
                className="block text-xs font-medium text-[#E8DDC8]/80 mb-1.5"
              >
                Phone Number (WhatsApp / SMS)
              </label>
              <input
                id="booking-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl bg-[#101112] border border-[#E8DDC8]/15 px-3.5 py-2.5 text-sm text-[#E8DDC8] placeholder:text-[#E8DDC8]/35 focus:outline-none focus:border-[#77795B]"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-[#e5a97c]" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="booking-service"
                className="block text-xs font-medium text-[#E8DDC8]/80 mb-1.5"
              >
                Select Grooming Service
              </label>
              <select
                id="booking-service"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full rounded-xl bg-[#101112] border border-[#E8DDC8]/15 px-3.5 py-2.5 text-sm text-[#E8DDC8] focus:outline-none focus:border-[#77795B]"
              >
                {SALON_SERVICES.map((service) => (
                  <option key={service} value={service} className="bg-[#171819] text-[#E8DDC8]">
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="booking-date"
                  className="block text-xs font-medium text-[#E8DDC8]/80 mb-1.5"
                >
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    id="booking-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl bg-[#101112] border border-[#E8DDC8]/15 px-3.5 py-2.5 text-sm text-[#E8DDC8] tabular-nums focus:outline-none focus:border-[#77795B]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-time"
                  className="block text-xs font-medium text-[#E8DDC8]/80 mb-1.5"
                >
                  Preferred Time Slot
                </label>
                <div className="relative">
                  <select
                    id="booking-time"
                    value={form.timeSlot}
                    onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                    className="w-full rounded-xl bg-[#101112] border border-[#E8DDC8]/15 px-3.5 py-2.5 text-sm text-[#E8DDC8] tabular-nums focus:outline-none focus:border-[#77795B]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#171819] text-[#E8DDC8]">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#E8DDC8]/75 hover:text-[#E8DDC8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="olive-cta-plaque group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#E8DDC8] overflow-hidden transition-all"
              >
                <Calendar className="w-4 h-4 text-[#E8DDC8] shrink-0" />
                <span>Confirm Appointment</span>
                <ArrowRight className="w-4 h-4 text-[#E8DDC8] transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
