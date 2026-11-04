import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChairViewPreset, clampNormalized } from '../utils/heroKinematics';
import { HeroTypography } from './HeroTypography';
import { BarberChairScene } from './BarberChairScene';
import { ScrollIndicator } from './ScrollIndicator';

gsap.registerPlugin(ScrollTrigger);

export interface HeroSectionProps {
  onBookExperience: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookExperience,
  onExploreServices,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgGlowRef = useRef<HTMLDivElement | null>(null);
  const typographyColRef = useRef<HTMLDivElement | null>(null);

  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [entranceProgress, setEntranceProgress] = useState<number>(1);
  const [activePreset, setActivePreset] = useState<ChairViewPreset>('signature');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile/tablet viewport for responsive 3D camera framing
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Choreographed GSAP Entrance Sequence & ScrollTrigger Experience
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setEntranceProgress(1);
      return;
    }

    const animState = { lightAndCamera: 0.25 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // 1 & 2. Hero studio ambient background glow fades in smoothly
      if (bgGlowRef.current) {
        tl.fromTo(
          bgGlowRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.85 },
          0
        );
      }

      // 3 & 4. Overhead spotlight illuminates chair & 3D chair emerges with gentle camera glide
      tl.to(
        animState,
        {
          lightAndCamera: 1,
          duration: 1.15,
          ease: 'power2.out',
          onUpdate: () => {
            setEntranceProgress(animState.lightAndCamera);
          },
        },
        0.05
      );

      // 5. Eyebrow & Main headline reveal line-by-line using masked text animation
      const eyebrow = Array.from(sectionEl.querySelectorAll('.js-hero-eyebrow'));
      if (eyebrow.length > 0) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.12
        );
      }

      const headlineLines = Array.from(
        sectionEl.querySelectorAll('.js-hero-line-inner')
      );
      if (headlineLines.length > 0) {
        tl.fromTo(
          headlineLines,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.72, stagger: 0.12 },
          0.18
        );
      }

      // 6. Supporting description fades in with slight upward movement
      const desc = Array.from(sectionEl.querySelectorAll('.js-hero-description'));
      if (desc.length > 0) {
        tl.fromTo(
          desc,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.36
        );
      }

      // 7. CTA buttons appear sequentially
      const ctas = Array.from(sectionEl.querySelectorAll('.js-hero-cta'));
      if (ctas.length > 0) {
        tl.fromTo(
          ctas,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
          0.44
        );
      }

      // 8. Scroll indicator becomes visible
      const scrollInd = Array.from(
        sectionEl.querySelectorAll('.js-hero-scroll-indicator')
      );
      if (scrollInd.length > 0) {
        tl.fromTo(
          scrollInd,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.58
        );
      }

      // GSAP ScrollTrigger — Smooth scroll-driven 3D chair rotation & headline transition
      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          if (typographyColRef.current) {
            gsap.set(typographyColRef.current, {
              y: self.progress * -36,
              opacity: Math.max(0.25, 1 - self.progress * 0.65),
            });
          }
          if (!isScrollDirtyRef.current) {
            isScrollDirtyRef.current = true;
            requestAnimationFrame(() => {
              isScrollDirtyRef.current = false;
              setScrollProgress(self.progress);
            });
          }
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDirtyRef = useRef(false);
  const isScrollDirtyRef = useRef(false);
  const spotlightElRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const normX = clampNormalized(((e.clientX - rect.left) / rect.width) * 2 - 1);
    const normY = clampNormalized(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerPosRef.current = { x: normX, y: normY };

    if (spotlightElRef.current) {
      spotlightElRef.current.style.transform = `translate3d(${normX * -18}px, ${normY * -14}px, 0)`;
    }

    if (!isPointerDirtyRef.current) {
      isPointerDirtyRef.current = true;
      requestAnimationFrame(() => {
        isPointerDirtyRef.current = false;
        setPointer(pointerPosRef.current);
      });
    }
  };

  const handlePointerLeave = () => {
    pointerPosRef.current = { x: 0, y: 0 };
    if (spotlightElRef.current) {
      spotlightElRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
    setPointer({ x: 0, y: 0 });
  };

  const handleScrollDown = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({
      top: Math.round(window.innerHeight * 0.85),
      behavior: 'smooth',
    });
  };

  const handleExploreServicesClick = () => {
    setActivePreset((prev) => (prev === 'recline' ? 'profile' : 'recline'));
    onExploreServices();
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="The Art of Precision — 3D Luxury Grooming Studio"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full min-h-screen bg-[#171819] pt-[74px] sm:pt-[98px] lg:pt-[112px] flex flex-col justify-between overflow-hidden"
    >
      {/* Studio Ambient Lighting Backdrop & Subtle Parallax Glow (No Box Grid Lines) */}
      <div
        ref={bgGlowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Overhead Warm Studio Spotlight Pool behind the 3D Chair */}
        <div
          ref={spotlightElRef}
          className="absolute top-[10%] right-[2%] lg:right-[8%] w-[360px] sm:w-[580px] h-[360px] sm:h-[580px] rounded-full transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translate3d(${pointer.x * -18}px, ${pointer.y * -14}px, 0)`,
            background:
              'radial-gradient(circle, rgba(232, 221, 200, 0.075) 0%, rgba(119, 121, 91, 0.065) 42%, transparent 72%)',
            filter: 'blur(26px)',
          }}
        />
      </div>

      {/* Main Split Desktop / Balanced Stacked Mobile Hero Content Grid */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto flex-1 px-5 sm:px-8 lg:px-14 py-4 sm:py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-4 sm:gap-6 lg:gap-8">
        {/* LEFT COLUMN: Editorial Typography & CTAs */}
        <div
          ref={typographyColRef}
          className="lg:col-span-6 xl:col-span-5 order-1"
        >
          <HeroTypography
            onBookExperience={onBookExperience}
            onExploreServices={handleExploreServicesClick}
            activePreset={activePreset}
            onChangePreset={setActivePreset}
          />
        </div>

        {/* RIGHT / CENTER COLUMN: Interactive 3D Barber Chair Studio */}
        <div className="lg:col-span-6 xl:col-span-7 order-2 relative w-full h-[330px] sm:h-[440px] lg:h-[580px] flex items-center justify-center">
          <BarberChairScene
            pointerX={pointer.x}
            pointerY={pointer.y}
            scrollProgress={scrollProgress}
            entranceProgress={entranceProgress}
            activePreset={activePreset}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Bottom Minimal Scroll Indicator */}
      <ScrollIndicator onScrollDown={handleScrollDown} />
    </section>
  );
};
