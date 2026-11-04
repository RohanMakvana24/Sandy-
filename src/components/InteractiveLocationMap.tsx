import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { SALON_LOCATION_CONFIG } from '../utils/contactConfig';
import { DirectionsButton } from './DirectionsButton';

export const InteractiveLocationMap: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  const embedUrl = SALON_LOCATION_CONFIG.googleMapsEmbedUrl;
  const isEmbedConfigured = Boolean(embedUrl && embedUrl.trim().length > 0);

  return (
    <div
      data-loc-reveal="map-container"
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] rounded-[24px] overflow-hidden bg-[#151617] border border-[#77795B]/35 shadow-[0_16px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between"
      style={{
        boxShadow:
          '0 20px 50px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(232, 221, 200, 0.12)',
      }}
    >
      {/* Subtle Olive-Green Ambient Glow Behind the Map */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 bg-gradient-to-tr from-[#77795B]/15 via-transparent to-[#E8DDC8]/10 opacity-70 blur-xl"
      />

      {/* Decorative Outer Hairline Corner Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#77795B]/60 z-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#77795B]/60 z-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#77795B]/60 z-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#77795B]/60 z-20"
      />

      {/* Map Content / Embed Area */}
      <div className="relative w-full flex-1 overflow-hidden bg-[#121314]">
        {isEmbedConfigured && !loadError ? (
          <>
            {/* Loading Skeleton */}
            {!isLoaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#171819] text-[#E8DDC8]/60 space-y-3"
              >
                <div className="w-8 h-8 rounded-full border-2 border-[#77795B]/40 border-t-[#E8DDC8] animate-spin" />
                <span className="text-xs font-mono tracking-widest uppercase">
                  Rendering Location Coordinates…
                </span>
              </div>
            )}

            <iframe
              title={`Google Map for ${SALON_LOCATION_CONFIG.salonName} in Rajkot, Gujarat`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoaded(true)}
              onError={() => setLoadError(true)}
              className={`w-full h-full border-0 filter grayscale contrast-125 invert-[0.92] hue-rotate-180 transition-opacity duration-700 ${
                isLoaded ? 'opacity-90' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          /* Graceful Fallback if Embed is not configured */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#171819] text-[#E8DDC8]/70 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#77795B]/20 border border-[#77795B]/40 flex items-center justify-center text-[#969972]">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-[#E8DDC8]">
                {SALON_LOCATION_CONFIG.salonName}
              </h4>
              <p className="text-sm text-[#E8DDC8]/60 max-w-sm">
                {SALON_LOCATION_CONFIG.address}, {SALON_LOCATION_CONFIG.city}
              </p>
            </div>
            <a
              href={SALON_LOCATION_CONFIG.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#969972] hover:text-[#E8DDC8] underline underline-offset-4"
            >
              <span>View Coordinates on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Floating Architectural Atelier Pin Badge */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#171819]/90 backdrop-blur-md border border-[#77795B]/40 shadow-lg text-[#E8DDC8]">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#77795B]/25 text-[#969972]">
              <MapPin className="w-4 h-4" />
            </span>
            <div className="pr-1 text-left">
              <div className="text-xs font-bold tracking-tight text-[#E8DDC8]">
                {SALON_LOCATION_CONFIG.salonName}
              </div>
              <div className="text-[11px] font-mono text-[#E8DDC8]/60">
                Kalawad Rd · Rajkot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Strip with Real Directions Button */}
      <div className="relative z-20 px-5 sm:px-6 py-4 bg-[#141516]/95 border-t border-[#77795B]/25 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-[#E8DDC8]/70">
          <Navigation className="w-3.5 h-3.5 text-[#969972] shrink-0" />
          <span>Rajkot, Gujarat · Verified Destination</span>
        </div>

        <DirectionsButton className="w-full sm:w-auto" />
      </div>
    </div>
  );
};
