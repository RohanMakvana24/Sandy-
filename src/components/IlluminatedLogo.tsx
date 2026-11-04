import React from 'react';

interface IlluminatedLogoProps {
  onClick?: () => void;
  compact?: boolean;
  ledReady?: boolean;
}

/**
 * Single vector geometry layer for the Sandy Men's Salon signboard lockup:
 * - Left: Square outlined "sb" monogram frame (x=6..82, y=6..82, height=76)
 * - Inside Square: Perfectly centered and proportioned "sb" monogram
 * - Right Top: "Sand" + seamless custom extended-descender "y" whose tail drops to y=82
 * - Right Bottom: "Men's Salon" tucked cleanly beneath "and" (y=81.5), aligned with the bottom of the square frame
 */
const BrandSignageGeometry: React.FC = () => (
  <g>
    {/* Square Outlined "sb" Monogram Frame (76x76 square from y=6 to y=82) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6H82V82H6V6ZM12.8 12.8V75.2H75.2V12.8H12.8Z"
    />

    {/* "sb" Monogram Centered Inside the Square Frame */}
    <text
      x="44"
      y="59.5"
      textAnchor="middle"
      fontFamily="Outfit, sans-serif"
      fontWeight="600"
      fontSize="46"
      letterSpacing="-0.03em"
    >
      sb
    </text>

    {/* "Sand" Main Lettering */}
    <text
      x="98"
      y="56.5"
      fontFamily="Outfit, sans-serif"
      fontWeight="600"
      fontSize="55"
      letterSpacing="-0.02em"
    >
      Sand
    </text>

    {/* Seamless Extended-Descender "y" (sits right next to 'd' at x=223 and extends down to y=82 beside "Salon") */}
    <path d="M223.5 28.5 H232.0 L240.2 51.5 L248.4 28.5 H256.8 L236.2 82.0 H227.8 L235.8 60.2 L223.5 28.5 Z" />

    {/* "Men's Salon" Subtitle Tucked Cleanly Under "and" (from x=119 to x=222, baseline y=81.5) */}
    <text
      x="118"
      y="81.5"
      fontFamily="Outfit, sans-serif"
      fontWeight="600"
      fontSize="19"
      letterSpacing="0.01em"
    >
      Men&apos;s Salon
    </text>
  </g>
);

export const IlluminatedLogo: React.FC<IlluminatedLogoProps> = ({
  onClick,
  compact = false,
  ledReady = true,
}) => {
  return (
    <a
      href="#home"
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label="Sandy Men's Salon — Home"
      className="group relative inline-flex items-center select-none shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]/70 rounded-lg py-0.5"
    >
      {/* Crisp 3D Illuminated Acrylic Signboard SVG */}
      <svg
        viewBox="0 0 268 88"
        role="img"
        aria-hidden="true"
        className={`overflow-visible transition-all duration-500 ${
          compact
            ? 'h-[36px] sm:h-[54px] lg:h-[64px] w-auto'
            : 'h-[40px] sm:h-[58px] lg:h-[72px] w-auto'
        } ${ledReady ? 'opacity-100' : 'opacity-50'}`}
      >
        <defs>
          {/* Warm Ivory Internally Illuminated Acrylic Front Face */}
          <linearGradient id="warmLedFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E8DDC8" />
            <stop offset="100%" stopColor="#D9CEB8" />
          </linearGradient>

          {/* Clean Cast Shadow + Subtle Warm Ivory Backlight Glow */}
          <filter id="clean3dGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="-2.5" dy="3.5" stdDeviation="2.2" floodColor="rgba(0, 0, 0, 0.85)" />
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="rgba(232, 221, 200, 0.28)" />
          </filter>
        </defs>

        <g filter="url(#clean3dGlow)">
          {/* 3D Acrylic Sidewall Return Layers (Warm Champagne-Bronze Bevel, Not Muddy Black) */}
          <g transform="translate(-2.4, 2.4)" fill="#4a4033">
            <BrandSignageGeometry />
          </g>
          <g transform="translate(-1.6, 1.6)" fill="#756652">
            <BrandSignageGeometry />
          </g>
          <g transform="translate(-0.8, 0.8)" fill="#b09c80">
            <BrandSignageGeometry />
          </g>

          {/* Illuminated Warm-White Acrylic Front Face */}
          <g fill="url(#warmLedFace)">
            <BrandSignageGeometry />
          </g>
        </g>
      </svg>

      <span className="sr-only">sb Sandy Men&apos;s Salon</span>
    </a>
  );
};
