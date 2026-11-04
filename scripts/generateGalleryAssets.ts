import fs from 'node:fs';
import path from 'node:path';

interface GallerySvgSpec {
  filename: string;
  width: number;
  height: number;
  label: string;
  category: string;
  subtitle: string;
  silhouetteType: 'crop' | 'fade' | 'pompadour' | 'beard' | 'styling' | 'transformation';
  accentGradient: string;
}

const specs: GallerySvgSpec[] = [
  {
    filename: 'textured_crop.svg',
    width: 800,
    height: 1060,
    label: '01 — TEXTURED CROP',
    category: 'HAIRCUTS / FADES',
    subtitle: 'Blunt forward fringe with micro-scissor point texture and mid-drop fade.',
    silhouetteType: 'crop',
    accentGradient: '#77795B',
  },
  {
    filename: 'classic_taper.svg',
    width: 800,
    height: 960,
    label: '02 — CLASSIC TAPER FADE',
    category: 'FADE STYLES',
    subtitle: 'Low-compression temple taper blended seamlessly into tailored neckline.',
    silhouetteType: 'fade',
    accentGradient: '#989B74',
  },
  {
    filename: 'modern_pompadour.svg',
    width: 800,
    height: 1120,
    label: '03 — MODERN POMPADOUR',
    category: 'HAIR STYLING',
    subtitle: 'High-volume architectural sweep with matte clay finish and disconnected side part.',
    silhouetteType: 'pompadour',
    accentGradient: '#77795B',
  },
  {
    filename: 'precision_beard.svg',
    width: 1200,
    height: 800,
    label: '04 — PRECISION BEARD STYLING',
    category: 'BEARD GROOMING',
    subtitle: 'Razor-defined cheek line, contoured jawline gradation, and botanical oil treatment.',
    silhouetteType: 'beard',
    accentGradient: '#989B74',
  },
  {
    filename: 'contemporary_styling.svg',
    width: 800,
    height: 1000,
    label: '05 — CONTEMPORARY HAIR STYLING',
    category: 'HAIR STYLING',
    subtitle: 'Natural flow scissor sculpture styled with sea salt mist and diffuser airflow.',
    silhouetteType: 'styling',
    accentGradient: '#77795B',
  },
  {
    filename: 'signature_transformation.svg',
    width: 1400,
    height: 920,
    label: '06 — SIGNATURE TRANSFORMATION',
    category: 'TRANSFORMATIONS',
    subtitle: 'Complete bespoke redesign tailored to facial geometry, density, and lifestyle.',
    silhouetteType: 'transformation',
    accentGradient: '#989B74',
  },
];

function generateSvg(spec: GallerySvgSpec): string {
  const { width, height, label, category, subtitle, silhouetteType, accentGradient } = spec;

  // Generate stylized editorial silhouette vector paths for each haircut type
  let silhouetteSvg = '';

  if (silhouetteType === 'crop') {
    silhouetteSvg = `
      <!-- Textured Crop Profile Silhouette -->
      <path d="M ${width * 0.28} ${height * 0.72} 
               C ${width * 0.26} ${height * 0.62}, ${width * 0.32} ${height * 0.44}, ${width * 0.38} ${height * 0.36}
               C ${width * 0.42} ${height * 0.28}, ${width * 0.50} ${height * 0.25}, ${width * 0.62} ${height * 0.26}
               C ${width * 0.72} ${height * 0.28}, ${width * 0.78} ${height * 0.34}, ${width * 0.80} ${height * 0.46}
               C ${width * 0.81} ${height * 0.56}, ${width * 0.74} ${height * 0.66}, ${width * 0.72} ${height * 0.78}
               L ${width * 0.68} ${height * 0.92}
               L ${width * 0.34} ${height * 0.92} Z"
            fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.35" />
      <!-- Textured forward fringe lines -->
      <path d="M ${width * 0.42} ${height * 0.32} L ${width * 0.45} ${height * 0.38}
               M ${width * 0.48} ${height * 0.30} L ${width * 0.50} ${height * 0.39}
               M ${width * 0.54} ${height * 0.29} L ${width * 0.56} ${height * 0.38}
               M ${width * 0.60} ${height * 0.30} L ${width * 0.62} ${height * 0.39}"
            stroke="#989B74" stroke-width="3" stroke-linecap="round" stroke-opacity="0.75" />
      <!-- High skin fade stipple field -->
      <path d="M ${width * 0.32} ${height * 0.54} Q ${width * 0.36} ${height * 0.62} ${width * 0.40} ${height * 0.72}"
            stroke="${accentGradient}" stroke-width="1.5" stroke-dasharray="4 6" stroke-opacity="0.6" />
    `;
  } else if (silhouetteType === 'fade') {
    silhouetteSvg = `
      <!-- Classic Taper Fade Silhouette -->
      <path d="M ${width * 0.30} ${height * 0.74}
               C ${width * 0.28} ${height * 0.58}, ${width * 0.34} ${height * 0.40}, ${width * 0.42} ${height * 0.32}
               C ${width * 0.52} ${height * 0.24}, ${width * 0.66} ${height * 0.25}, ${width * 0.76} ${height * 0.35}
               C ${width * 0.82} ${height * 0.45}, ${width * 0.80} ${height * 0.60}, ${width * 0.76} ${height * 0.75}
               L ${width * 0.68} ${height * 0.92}
               L ${width * 0.34} ${height * 0.92} Z"
            fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.4" />
      <!-- Clean contour taper lines -->
      <path d="M ${width * 0.38} ${height * 0.42} C ${width * 0.48} ${height * 0.34}, ${width * 0.62} ${height * 0.36}, ${width * 0.72} ${height * 0.44}"
            fill="none" stroke="#FFF4DE" stroke-width="2" stroke-opacity="0.5" />
      <path d="M ${width * 0.36} ${height * 0.52} C ${width * 0.46} ${height * 0.46}, ${width * 0.60} ${height * 0.48}, ${width * 0.70} ${height * 0.56}"
            fill="none" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.65" />
    `;
  } else if (silhouetteType === 'pompadour') {
    silhouetteSvg = `
      <!-- Modern Architectural Pompadour Silhouette -->
      <path d="M ${width * 0.30} ${height * 0.76}
               C ${width * 0.28} ${height * 0.60}, ${width * 0.34} ${height * 0.42}, ${width * 0.38} ${height * 0.30}
               C ${width * 0.42} ${height * 0.18}, ${width * 0.60} ${height * 0.16}, ${width * 0.74} ${height * 0.26}
               C ${width * 0.82} ${height * 0.36}, ${width * 0.80} ${height * 0.58}, ${width * 0.74} ${height * 0.76}
               L ${width * 0.66} ${height * 0.92}
               L ${width * 0.34} ${height * 0.92} Z"
            fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.4" />
      <!-- High volume sweeping waves -->
      <path d="M ${width * 0.40} ${height * 0.28} Q ${width * 0.56} ${height * 0.18} ${width * 0.70} ${height * 0.28}"
            fill="none" stroke="#FFF4DE" stroke-width="3" stroke-linecap="round" stroke-opacity="0.75" />
      <path d="M ${width * 0.42} ${height * 0.35} Q ${width * 0.58} ${height * 0.26} ${width * 0.72} ${height * 0.36}"
            fill="none" stroke="#989B74" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.7" />
    `;
  } else if (silhouetteType === 'beard') {
    silhouetteSvg = `
      <!-- Precision Beard & Jawline Sculpting Profile -->
      <path d="M ${width * 0.32} ${height * 0.68}
               C ${width * 0.36} ${height * 0.48}, ${width * 0.46} ${height * 0.34}, ${width * 0.58} ${height * 0.32}
               C ${width * 0.70} ${height * 0.34}, ${width * 0.78} ${height * 0.46}, ${width * 0.82} ${height * 0.62}
               C ${width * 0.84} ${height * 0.76}, ${width * 0.74} ${height * 0.86}, ${width * 0.60} ${height * 0.90}
               C ${width * 0.48} ${height * 0.92}, ${width * 0.38} ${height * 0.84}, ${width * 0.32} ${height * 0.68} Z"
            fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.4" />
      <!-- Razor sharp cheek line -->
      <path d="M ${width * 0.44} ${height * 0.54} Q ${width * 0.54} ${height * 0.60} ${width * 0.66} ${height * 0.64}"
            fill="none" stroke="#FFF4DE" stroke-width="3" stroke-linecap="round" stroke-opacity="0.8" />
      <path d="M ${width * 0.40} ${height * 0.68} Q ${width * 0.56} ${height * 0.78} ${width * 0.72} ${height * 0.72}"
            fill="none" stroke="#989B74" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.75" />
    `;
  } else if (silhouetteType === 'styling') {
    silhouetteSvg = `
      <!-- Contemporary Flow & Texture Silhouette -->
      <path d="M ${width * 0.28} ${height * 0.76}
               C ${width * 0.26} ${height * 0.56}, ${width * 0.32} ${height * 0.38}, ${width * 0.42} ${height * 0.28}
               C ${width * 0.54} ${height * 0.20}, ${width * 0.68} ${height * 0.22}, ${width * 0.78} ${height * 0.32}
               C ${width * 0.84} ${height * 0.44}, ${width * 0.82} ${height * 0.62}, ${width * 0.74} ${height * 0.78}
               L ${width * 0.68} ${height * 0.92}
               L ${width * 0.32} ${height * 0.92} Z"
            fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.4" />
      <!-- Dynamic layered feather strokes -->
      <path d="M ${width * 0.38} ${height * 0.36} C ${width * 0.48} ${height * 0.30}, ${width * 0.62} ${height * 0.32}, ${width * 0.70} ${height * 0.38}"
            fill="none" stroke="#FFF4DE" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.75" />
      <path d="M ${width * 0.42} ${height * 0.46} C ${width * 0.50} ${height * 0.40}, ${width * 0.60} ${height * 0.42}, ${width * 0.68} ${height * 0.48}"
            fill="none" stroke="#989B74" stroke-width="2" stroke-linecap="round" stroke-opacity="0.65" />
    `;
  } else {
    // Full Signature Transformation
    silhouetteSvg = `
      <!-- Signature Transformation Comparative Silhouette -->
      <g transform="translate(-${width * 0.16}, 0)">
        <path d="M ${width * 0.44} ${height * 0.76}
                 C ${width * 0.42} ${height * 0.58}, ${width * 0.48} ${height * 0.38}, ${width * 0.56} ${height * 0.30}
                 C ${width * 0.66} ${height * 0.22}, ${width * 0.78} ${height * 0.24}, ${width * 0.86} ${height * 0.36}
                 C ${width * 0.92} ${height * 0.48}, ${width * 0.90} ${height * 0.64}, ${width * 0.82} ${height * 0.80}
                 L ${width * 0.76} ${height * 0.92}
                 L ${width * 0.48} ${height * 0.92} Z"
              fill="#121315" stroke="${accentGradient}" stroke-width="2" stroke-opacity="0.4" />
      </g>
      <g transform="translate(${width * 0.16}, 0)">
        <path d="M ${width * 0.44} ${height * 0.76}
                 C ${width * 0.42} ${height * 0.58}, ${width * 0.48} ${height * 0.34}, ${width * 0.58} ${height * 0.26}
                 C ${width * 0.68} ${height * 0.20}, ${width * 0.82} ${height * 0.22}, ${width * 0.90} ${height * 0.34}
                 C ${width * 0.94} ${height * 0.46}, ${width * 0.92} ${height * 0.64}, ${width * 0.84} ${height * 0.80}
                 L ${width * 0.78} ${height * 0.92}
                 L ${width * 0.50} ${height * 0.92} Z"
              fill="#151719" stroke="#989B74" stroke-width="2" stroke-opacity="0.6" />
      </g>
      <!-- Center transformation dividing hairline -->
      <line x1="${width * 0.5}" y1="${height * 0.18}" x2="${width * 0.5}" y2="${height * 0.84}"
            stroke="#989B74" stroke-width="1.5" stroke-dasharray="6 8" stroke-opacity="0.7" />
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dark Studio Vignette Gradient -->
    <radialGradient id="studioVignette" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#1f2123" />
      <stop offset="55%" stop-color="#171819" />
      <stop offset="100%" stop-color="#0f1011" />
    </radialGradient>

    <!-- Olive Ambient Highlight -->
    <radialGradient id="oliveRim" cx="72%" cy="28%" r="48%">
      <stop offset="0%" stop-color="rgba(119, 121, 91, 0.28)" />
      <stop offset="65%" stop-color="rgba(119, 121, 91, 0.04)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>

    <!-- Warm Key Highlight -->
    <radialGradient id="warmKey" cx="30%" cy="20%" r="52%">
      <stop offset="0%" stop-color="rgba(255, 244, 222, 0.14)" />
      <stop offset="55%" stop-color="rgba(255, 244, 222, 0.02)" />
      <stop offset="100%" stop-color="transparent" />
    </radialGradient>

    <!-- Subtle Hairline Grid Pattern -->
    <pattern id="precisionGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(119, 121, 91, 0.06)" stroke-width="1" />
      <line x1="0" y1="0" x2="0" y2="60" stroke="rgba(119, 121, 91, 0.06)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Deep Glossy Black Background -->
  <rect width="100%" height="100%" fill="url(#studioVignette)" />

  <!-- Subtle Studio Grid -->
  <rect width="100%" height="100%" fill="url(#precisionGrid)" opacity="0.65" />

  <!-- Ambient Light Pools -->
  <rect width="100%" height="100%" fill="url(#oliveRim)" />
  <rect width="100%" height="100%" fill="url(#warmKey)" />

  <!-- Geometric Architectural Calibration Rings -->
  <g opacity="0.28">
    <circle cx="${width * 0.5}" cy="${height * 0.48}" r="${Math.min(width, height) * 0.36}" fill="none" stroke="${accentGradient}" stroke-width="1" stroke-dasharray="4 8" />
    <circle cx="${width * 0.5}" cy="${height * 0.48}" r="${Math.min(width, height) * 0.42}" fill="none" stroke="#FFF4DE" stroke-width="0.75" />
    <line x1="${width * 0.5 - 28}" y1="${height * 0.48}" x2="${width * 0.5 + 28}" y2="${height * 0.48}" stroke="#989B74" stroke-width="1" />
    <line x1="${width * 0.5}" y1="${height * 0.48 - 28}" x2="${width * 0.5}" y2="${height * 0.48 + 28}" stroke="#989B74" stroke-width="1" />
  </g>

  <!-- Central Silhouette Composition -->
  ${silhouetteSvg}

  <!-- Top Editorial Identification Overlay -->
  <g transform="translate(36, 48)">
    <text x="0" y="0" font-family="'Courier New', monospace" font-size="11" font-weight="600" fill="#989B74" letter-spacing="3.2">SANDY MEN'S SALON · RAJKOT</text>
    <text x="0" y="24" font-family="'Outfit', 'Helvetica Neue', sans-serif" font-size="13" font-weight="700" fill="#F5F0E8" letter-spacing="2.6">${category}</text>
  </g>

  <!-- Bottom Architectural Frame Badge -->
  <g transform="translate(36, ${height - 48})">
    <rect x="-12" y="-32" width="${width - 48}" height="42" fill="rgba(23, 24, 25, 0.72)" stroke="rgba(119, 121, 91, 0.32)" stroke-width="1" rx="2" />
    <text x="6" y="-12" font-family="'Outfit', 'Helvetica Neue', sans-serif" font-size="14" font-weight="700" fill="#FFF4DE" letter-spacing="1.5">${label}</text>
    <text x="${width - 80}" y="-12" text-anchor="end" font-family="'Courier New', monospace" font-size="10" fill="#989B74" letter-spacing="2">35MM · 8K</text>
  </g>

  <!-- Outer Architectural Hairline Border -->
  <rect x="12" y="12" width="${width - 24}" height="${height - 24}" fill="none" stroke="rgba(119, 121, 91, 0.28)" stroke-width="1" />
</svg>`;
}

const outDir = path.resolve('public/assets/gallery');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

specs.forEach((spec) => {
  const svg = generateSvg(spec);
  fs.writeFileSync(path.join(outDir, spec.filename), svg, 'utf-8');
});

console.log('Successfully generated 6 luxury portfolio SVG assets in', outDir);
