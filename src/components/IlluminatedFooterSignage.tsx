import React from 'react';

interface IlluminatedFooterSignageProps {
  className?: string;
  onClick?: () => void;
}

const FooterSignageGeometry: React.FC = () => (
  <g>
    {/* Square Outlined "sb" Monogram Frame (76x76 square from y=6 to y=82) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 6H82V82H6V6ZM12.8 12.8V75.2H75.2V12.8H12.8Z"
    />

    {/* "sb" Monogram Centered Inside Square Frame */}
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

    {/* Seamless Extended-Descender "y" */}
    <path d="M223.5 28.5 H232.0 L240.2 51.5 L248.4 28.5 H256.8 L236.2 82.0 H227.8 L235.8 60.2 L223.5 28.5 Z" />

    {/* "Men's Salon" Subtitle Tucked Under "and" */}
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

export const IlluminatedFooterSignage: React.FC<IlluminatedFooterSignageProps> = ({
  className = '',
  onClick,
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
      aria-label="Sandy Men's Salon — Return to top of page"
      className={`group relative inline-flex items-center select-none shrink-0 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DDC8]/70 rounded-xl transition-all ${className}`}
    >
      {/* Majestic 3D Illuminated Acrylic Signboard SVG */}
      <svg
        viewBox="0 0 268 88"
        role="img"
        aria-hidden="true"
        className="overflow-visible h-[52px] sm:h-[68px] lg:h-[84px] w-auto transition-transform duration-300 group-hover:scale-[1.02]"
      >
        <defs>
          {/* Warm-White Internally Illuminated Acrylic Front Face */}
          <linearGradient id="footerWarmLedFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#E8DDC8" />
            <stop offset="100%" stopColor="#F5E8CE" />
          </linearGradient>

          {/* Architectural Cast Shadow + Warm Backlight Diffusion Glow */}
          <filter id="footerSignGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="-3" dy="4" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.9)" />
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="rgba(255, 244, 222, 0.32)" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(119, 121, 91, 0.25)" />
          </filter>
        </defs>

        <g filter="url(#footerSignGlow)">
          {/* 3D Acrylic Return Bevel Layers */}
          <g transform="translate(-3.2, 3.2)" fill="#362f25">
            <FooterSignageGeometry />
          </g>
          <g transform="translate(-2.4, 2.4)" fill="#4e4335">
            <FooterSignageGeometry />
          </g>
          <g transform="translate(-1.6, 1.6)" fill="#786853">
            <FooterSignageGeometry />
          </g>
          <g transform="translate(-0.8, 0.8)" fill="#b8a385">
            <FooterSignageGeometry />
          </g>

          {/* Illuminated Warm-White Acrylic Front Face */}
          <g fill="url(#footerWarmLedFace)">
            <FooterSignageGeometry />
          </g>
        </g>
      </svg>
      <span className="sr-only">Sandy Men&apos;s Salon Home</span>
    </a>
  );
};
