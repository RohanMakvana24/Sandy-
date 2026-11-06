import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BOOKING_SECTION_COPY,
  BookingState,
  getKolkataDateString,
  isRequestSlotAvailable,
} from '../utils/bookingConfig';
import {
  DEFAULT_GROOMING_SERVICES,
  GroomingServiceItem,
} from '../utils/servicesKinematics';
import { BookingHeader } from './BookingHeader';
import { BookingStepper } from './BookingStepper';
import { ServiceSelection } from './ServiceSelection';
import { BookingCalendar } from './BookingCalendar';
import { PreferredTimeSelector } from './PreferredTimeSelector';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { BookingSummary } from './BookingSummary';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface BookingSectionProps {
  initialServiceId?: string;
  requestVersion?: number;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  initialServiceId,
  requestVersion,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Initialize booking state
  const [booking, setBooking] = useState<BookingState>(() => {
    const today = getKolkataDateString();
    let initialService: GroomingServiceItem | null = null;
    if (initialServiceId) {
      initialService =
        DEFAULT_GROOMING_SERVICES.find((s) => s.id === initialServiceId) ||
        null;
    }

    return {
      step: 1,
      selectedService: initialService,
      selectedDate: today,
      selectedTimeSlot: '',
      fullName: '',
      mobile: '',
      specialRequests: '',
    };
  });

  useEffect(() => {
    const service = DEFAULT_GROOMING_SERVICES.find(s => s.id === initialServiceId);
    if (service) setBooking(prev => ({ ...prev, selectedService: service, step: 2 }));
  }, [initialServiceId, requestVersion]);
  // GSAP Entrance Timeline
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      scrollTl
        .fromTo(
          '[data-booking-reveal="eyebrow"]',
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }
        )
        .fromTo(
          '[data-booking-reveal="headline-line"]',
          { yPercent: 108, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .fromTo(
          '[data-booking-reveal="description"]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        )
        .fromTo(
          '[data-testid="booking-studio-container"]',
          { scale: 0.96, autoAlpha: 0, y: 32 },
          {
            scale: 1,
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out',
          },
          '-=0.5'
        );
    }, sectionEl);

    return () => {
      ctx.revert();
    };
  }, []);

  const canNavigateToStep2 = Boolean(booking.selectedService);
  const canNavigateToStep3 =
    Boolean(booking.selectedService) &&
    Boolean(booking.selectedDate) &&
    isRequestSlotAvailable(booking.selectedDate, booking.selectedTimeSlot);

  const handleSelectService = (service: GroomingServiceItem) => {
    setBooking((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  const handleSelectDate = (date: string) => {
    setBooking((prev) => ({
      ...prev,
      selectedDate: date,
      selectedTimeSlot: '',
    }));
  };

  const handleSelectTimeSlot = (slot: string) => {
    setBooking((prev) => ({
      ...prev,
      selectedTimeSlot: slot,
    }));
  };

  const handleUpdateField = (
    field: 'fullName' | 'mobile' | 'specialRequests',
    value: string
  ) => {
    setBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section
      id={BOOKING_SECTION_COPY.sectionId}
      ref={sectionRef}
      data-testid="booking-section"
      aria-label="08 / Private Booking Experience — Sandy Men's Salon"
      className="relative w-full bg-[#171819] text-[#E8DDC8] overflow-hidden py-24 sm:py-36 lg:py-44"
    >
      {/* Top Hairline Transition from Phase 7 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />

      {/* Atmospheric Ambient Lighting Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 25%, rgba(119, 121, 91, 0.12) 0%, rgba(23, 24, 25, 0) 70%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-14">
        {/* Section Header */}
        <BookingHeader />

        {/* Stepper Progress Bar */}
        <BookingStepper
          currentStep={booking.step}
          onSelectStep={(step) => setBooking((prev) => ({ ...prev, step }))}
          canNavigateToStep2={canNavigateToStep2}
          canNavigateToStep3={canNavigateToStep3}
        />

        {/* Main Studio Booking Grid: Left Form Area + Right Sticky Summary */}
        <div
          data-testid="booking-studio-container"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* LEFT INTERACTION PANE */}
          <div className="lg:col-span-8 flex flex-col">
            {/* STEP 01 — SERVICE SELECTION */}
            {booking.step === 1 && (
              <div className="animate-in fade-in duration-400">
                <ServiceSelection
                  selectedService={booking.selectedService}
                  onSelectService={handleSelectService}
                  onContinue={() => setBooking((prev) => ({ ...prev, step: 2 }))}
                />
              </div>
            )}

            {/* STEP 02 — CHOOSE DATE & TIME */}
            {booking.step === 2 && (
              <div className="animate-in fade-in duration-400 flex flex-col">
                <div className="mb-6 flex items-baseline justify-between border-b border-[#77795B]/20 pb-3">
                  <h3 className="text-sm font-mono font-bold uppercase tracking-[0.24em] text-[#989B74]">
                    STEP 02 — CHOOSE DATE &amp; TIME
                  </h3>
                  <span className="text-xs text-[#E8DDC8]/55 font-light">
                    India Standard Time (IST)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <BookingCalendar
                    selectedDate={booking.selectedDate}
                    onSelectDate={handleSelectDate}
                  />

                  <PreferredTimeSelector
                    selectedTimeSlot={booking.selectedTimeSlot}
                    selectedDate={booking.selectedDate}
                    onSelectTimeSlot={handleSelectTimeSlot}
                  />
                </div>

                {/* Back & Continue Buttons */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#77795B]/20">
                  <button
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, step: 1 }))}
                    data-testid="booking-back-step2"
                    className="px-6 py-3 rounded-xs border border-[#77795B]/40 hover:border-[#989B74] hover:bg-[#77795B]/20 text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#E8DDC8] transition-colors cursor-pointer"
                  >
                    &larr; BACK TO SERVICES
                  </button>

                  <button
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, step: 3 }))}
                    disabled={!isRequestSlotAvailable(booking.selectedDate, booking.selectedTimeSlot)}
                    data-testid="booking-continue-step2"
                    className={`px-8 py-3.5 rounded-xs text-xs font-mono font-bold uppercase tracking-[0.22em] transition-all flex items-center gap-3 ${
                      booking.selectedDate && booking.selectedTimeSlot
                        ? 'bg-[#77795B] text-[#E8DDC8] hover:bg-[#888a68] shadow-[0_8px_20px_rgba(0,0,0,0.5)] cursor-pointer'
                        : 'bg-[#77795B]/20 text-[#E8DDC8]/35 border border-[#77795B]/20 cursor-not-allowed'
                    }`}
                  >
                    <span>CONTINUE TO DETAILS</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 03 — YOUR DETAILS & CONFIRMATION */}
            {booking.step === 3 && (
              <div className="animate-in fade-in duration-400">
                <CustomerDetailsForm
                  booking={booking}
                  onUpdateField={handleUpdateField}
                  onBack={() => setBooking((prev) => ({ ...prev, step: 2 }))}
                />
              </div>
            )}
          </div>

          {/* RIGHT STICKY APPOINTMENT SUMMARY PANE */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <BookingSummary booking={booking} />
          </div>
        </div>
      </div>

      {/* Bottom Hairline Divider for Next Section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#77795B]/35 to-transparent"
      />
    </section>
  );
};
