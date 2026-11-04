/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { SandyNavbar } from './components/SandyNavbar';
import { HeroSection } from './components/HeroSection';
import { AboutExperience } from './components/AboutExperience';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseSandy } from './components/WhyChooseSandy';
import { PortfolioGallery } from './components/PortfolioGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingSection } from './components/BookingSection';
import { AppointmentModal } from './components/AppointmentModal';

import { ContactLocationSection } from './components/ContactLocationSection';
import { PremiumFooter } from './components/PremiumFooter';
import {
  initSmoothScroll,
  scrollToTarget,
  setSmoothScrollLocked,
  destroySmoothScroll,
} from './utils/smoothScroll';

export default function App() {
  const [activeNavId, setActiveNavId] = useState<string>('home');
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);

  // Initialize unified Lenis smooth scroll with GSAP ticker sync
  useEffect(() => {
    initSmoothScroll();
    return () => {
      destroySmoothScroll();
    };
  }, []);

  // Lock smooth scroll when booking modal is open
  useEffect(() => {
    setSmoothScrollLocked(bookingModalOpen);
  }, [bookingModalOpen]);

  const handleSelectNav = (id: string) => {
    setActiveNavId(id);
    scrollToTarget(id, { offset: -84 });
  };

  const handleExploreServices = () => {
    setActiveNavId('services');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#services');
    }
    scrollToTarget('services', { offset: -84 });
  };

  const handleBookAppointment = () => {
    setActiveNavId('booking');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', '#booking');
      const bookingEl = document.getElementById('booking');
      if (bookingEl) {
        scrollToTarget('booking', { offset: -84 });
        return;
      }
    }
    setBookingModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#171819] text-[#E8DDC8] selection:bg-[#77795B] selection:text-[#171819]">
      {/* Existing Illuminated 3D Storefront Navigation Bar (Preserved Untouched) */}
      <SandyNavbar
        activeNavId={activeNavId}
        onSelectNav={handleSelectNav}
        onBookAppointment={handleBookAppointment}
      />

      <main>
        {/* Section 01/02: Interactive 3D Luxury Grooming Studio Hero Section */}
        <HeroSection
          onBookExperience={handleBookAppointment}
          onExploreServices={handleExploreServices}
        />

        {/* Section 03: The Sandy Experience — Interactive 3D Barber Scissors & Brand Philosophy */}
        <AboutExperience />

        {/* Section 04: Our Services — Interactive 3D Grooming Services Collection */}
        <ServicesSection />

        {/* Section 05: The Sandy Difference — Interactive Luxury Editorial Experience */}
        <WhyChooseSandy />

        {/* Section 06: Our Work — The Art of Transformation Portfolio Gallery */}
        <PortfolioGallery />

        {/* Section 07: Client Stories — Voices of Confidence Testimonials */}
        <TestimonialsSection
          onBookAppointment={handleBookAppointment}
        />

        {/* Section 08: The Private Booking Experience — Luxury Interactive Appointment System */}
        <BookingSection />

        {/* Section 09: Contact & Location Experience */}
        <ContactLocationSection />
      </main>

      {/* Ultra-Premium Architectural Footer */}
      <PremiumFooter onNavigate={handleSelectNav} />

      {/* Interactive Appointment Booking Modal */}
      <AppointmentModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
