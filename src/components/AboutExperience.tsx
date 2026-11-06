import React, { useEffect, useRef, useState } from 'react';
import { clampNormalized } from '../utils/heroKinematics';
import { ExperienceFocusMode } from '../utils/experienceKinematics';
import { ExperienceHeading } from './ExperienceHeading';
import { lazy } from 'react';
import { DeferredScene } from './DeferredScene';
const GroomingToolsScene = lazy(() => import('./GroomingToolsScene').then(m => ({ default: m.GroomingToolsScene })));
import { ExperiencePhilosophy } from './ExperiencePhilosophy';
import { initExperienceScrollAnimation } from './ExperienceScrollAnimation';

export const AboutExperience: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneWrapRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDirtyRef = useRef(false);

  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState<number>(0.45);
  const [focusMode, setFocusMode] = useState<ExperienceFocusMode>('precision');
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport, { passive: true });
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    return initExperienceScrollAnimation({
      sectionEl: sectionRef.current,
      sceneContainerEl: sceneWrapRef.current,
      onScrollProgress: setScrollProgress,
    });
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const normX = clampNormalized(((e.clientX - rect.left) / rect.width) * 2 - 1);
    const normY = clampNormalized(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerPosRef.current = { x: normX, y: normY };

    if (spotlightRef.current) {
      spotlightRef.current.style.transform = `translate3d(${normX * -16}px, ${normY * -12}px, 0)`;
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
    if (spotlightRef.current) {
      spotlightRef.current.style.transform = 'translate3d(0px, 0px, 0)';
    }
    setPointer({ x: 0, y: 0 });
  };

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="03 / The Sandy Experience — Beyond The Ordinary"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full bg-[#171819] py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Subtle Studio Spotlight Atmosphere Behind Central 3D Shears */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          ref={spotlightRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] rounded-full transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translate3d(${pointer.x * -16}px, ${pointer.y * -12}px, 0)`,
            background:
              'radial-gradient(circle, rgba(232, 221, 200, 0.055) 0%, rgba(119, 121, 91, 0.06) 44%, transparent 72%)',
            filter: 'blur(28px)',
          }}
        />
      </div>

      {/* Spacious Editorial Container */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-5 sm:px-8 lg:px-14 flex flex-col justify-between gap-6 sm:gap-8 lg:gap-10">
        {/* TOP — SECTION INTRODUCTION */}
        <ExperienceHeading />

        {/* CENTER — INTERACTIVE 3D GROOMING OBJECT (BARBER SCISSORS & COMB) */}
        <div ref={sceneWrapRef} className="relative w-full flex flex-col items-center">
          <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[370px] flex items-center justify-center">
            <DeferredScene><GroomingToolsScene
              pointerX={pointer.x}
              pointerY={pointer.y}
              scrollProgress={scrollProgress}
              focusMode={focusMode}
              isMobile={isMobile}
            /></DeferredScene>
          </div>

          {/* Minimal Interactive Instrument Mode Selector */}
          <div
            role="group"
            aria-label="3D Grooming Instrument Focus"
            className="w-full flex items-center justify-center lg:justify-end gap-5 pt-2 text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em]"
          >
            {(
              [
                { id: 'precision', label: '01 · Blade Edge' },
                { id: 'style', label: '02 · Open Cut' },
                { id: 'experience', label: '03 · Studio Pair' },
              ] as const
            ).map((mode) => {
              const isSelected = focusMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFocusMode(mode.id)}
                  aria-pressed={isSelected}
                  className={`py-1 border-b transition-all duration-200 cursor-pointer focus:outline-none ${
                    isSelected
                      ? 'border-[#989B74] text-[#E8DDC8]'
                      : 'border-transparent text-[#E8DDC8]/45 hover:text-[#E8DDC8]/80'
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM — BRAND PHILOSOPHY (THREE EDITORIAL BLOCKS) */}
        <ExperiencePhilosophy
          activeFocus={focusMode}
          onSelectFocus={setFocusMode}
        />
      </div>
    </section>
  );
};
