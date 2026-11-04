import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/barbers');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

interface BarberCardData {
  id: string;
  name: string;
  role: string;
  passNumber: string;
  experience: string;
  specialties: [string, string, string];
  initials: string;
  portraitSvg: string;
}

const barbers: BarberCardData[] = [
  {
    id: 'barber-01',
    name: 'SANDY V.',
    role: 'FOUNDER & MASTER ART DIRECTOR',
    passNumber: 'SMS-2026-01',
    experience: '12+ YEARS MASTERY',
    specialties: [
      'Precision Scissor Architecture',
      'Bespoke Beard Sculpting & Razor Line',
      'Executive Styling Consultation',
    ],
    initials: 'SV',
    portraitSvg: `
      <!-- Stylized Barber 1 Portrait (Sandy V. - Classic Groomed Pompadour & Beard) -->
      <defs>
        <linearGradient id="pGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2c26"/>
          <stop offset="60%" stop-color="#18191a"/>
          <stop offset="100%" stop-color="#101112"/>
        </linearGradient>
        <radialGradient id="faceGlow1" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#E8DDC8" stop-opacity="0.88"/>
          <stop offset="65%" stop-color="#b8ae9c" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#3d3e38" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
      <rect width="680" height="680" fill="url(#pGrad1)" rx="24"/>
      <!-- Soft Rim Light -->
      <circle cx="340" cy="300" r="260" fill="#77795B" opacity="0.18" filter="blur(30px)"/>
      <!-- Suit & Collar -->
      <path d="M180,680 L230,510 L300,530 L340,620 L380,530 L450,510 L500,680 Z" fill="#141516"/>
      <path d="M230,510 L340,630 L450,510 L410,480 L340,540 L270,480 Z" fill="#202224" stroke="#77795B" stroke-width="2"/>
      <!-- Dress Shirt Collar & Tie -->
      <polygon points="305,480 340,540 325,600 300,490" fill="#E8DDC8"/>
      <polygon points="375,480 340,540 355,600 380,490" fill="#E8DDC8"/>
      <polygon points="332,535 348,535 344,680 336,680" fill="#77795B"/>
      <!-- Neck -->
      <rect x="305" y="420" width="70" height="90" fill="#d2c5b0" rx="10"/>
      <path d="M305,430 C325,480 355,480 375,430 Z" fill="#b0a490" opacity="0.6"/>
      <!-- Face Silhouette -->
      <path d="M260,260 C255,360 270,450 340,465 C410,450 425,360 420,260 C420,200 410,180 340,180 C270,180 260,200 260,260 Z" fill="url(#faceGlow1)"/>
      <!-- Sculpted Full Beard in Dark Charcoal -->
      <path d="M265,340 C275,440 305,475 340,480 C375,475 405,440 415,340 C410,360 395,385 375,395 C355,405 325,405 305,395 C285,385 270,360 265,340 Z" fill="#1c1d1e"/>
      <!-- Moustache -->
      <path d="M305,380 C325,372 335,385 340,390 C345,385 355,372 375,380 C360,392 345,398 340,402 C335,398 320,392 305,380 Z" fill="#171819"/>
      <!-- Sharp Pompadour Haircut -->
      <path d="M245,250 C235,170 270,110 340,105 C415,100 445,160 435,240 C425,180 400,140 340,140 C280,140 255,180 245,250 Z" fill="#18191a" stroke="#77795B" stroke-width="2"/>
      <path d="M265,165 C310,125 380,120 425,170 C400,135 350,125 295,145 Z" fill="#31332c"/>
      <!-- Eyes & Brow in Editorial Shadow -->
      <path d="M285,280 Q310,270 330,285" stroke="#222320" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M350,285 Q370,270 395,280" stroke="#222320" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Nose bridge -->
      <path d="M340,280 L335,335 L348,340" stroke="#9e9482" stroke-width="3" fill="none" stroke-linecap="round"/>
    `,
  },
  {
    id: 'barber-02',
    name: 'ARJUN MEHTA',
    role: 'SENIOR GROOMING SPECIALIST',
    passNumber: 'SMS-2026-02',
    experience: '8 YEARS CRAFT',
    specialties: [
      'Low & Mid Skin Fades',
      'Textured Crop & Fringe Work',
      'Traditional Hot Towel Shave',
    ],
    initials: 'AM',
    portraitSvg: `
      <!-- Stylized Barber 2 Portrait (Arjun Mehta - Textured Fade & Stubble) -->
      <defs>
        <linearGradient id="pGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#222521"/>
          <stop offset="60%" stop-color="#18191a"/>
          <stop offset="100%" stop-color="#101112"/>
        </linearGradient>
        <radialGradient id="faceGlow2" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#E8DDC8" stop-opacity="0.88"/>
          <stop offset="65%" stop-color="#b6ab98" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#363832" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
      <rect width="680" height="680" fill="url(#pGrad2)" rx="24"/>
      <!-- Soft Olive Backlight -->
      <circle cx="340" cy="310" r="250" fill="#77795B" opacity="0.16" filter="blur(28px)"/>
      <!-- Minimalist Black Jacket -->
      <path d="M170,680 L230,520 L340,560 L450,520 L510,680 Z" fill="#151617"/>
      <path d="M230,520 L340,640 L450,520 L400,490 L340,540 L280,490 Z" fill="#222425" stroke="#77795B" stroke-width="2"/>
      <polygon points="310,500 340,550 370,500 340,515" fill="#E8DDC8"/>
      <!-- Neck -->
      <rect x="305" y="420" width="70" height="90" fill="#d2c5b0" rx="8"/>
      <!-- Face -->
      <path d="M265,270 C260,370 275,445 340,460 C405,445 420,370 415,270 C415,210 405,190 340,190 C275,190 265,210 265,270 Z" fill="url(#faceGlow2)"/>
      <!-- Sharp Trimmed Line Beard -->
      <path d="M272,360 C280,435 305,465 340,470 C375,465 400,435 408,360 C400,380 385,405 340,410 C295,405 280,380 272,360 Z" fill="#1c1d1e"/>
      <!-- Textured Crop Hair with Low Fade -->
      <path d="M255,270 C245,210 260,150 340,135 C420,150 435,210 425,270 C410,210 390,165 340,160 C290,165 270,210 255,270 Z" fill="#18191a" stroke="#77795B" stroke-width="2"/>
      <path d="M280,165 C320,145 360,145 400,165 L390,185 C360,170 320,170 290,185 Z" fill="#3a3d34"/>
      <!-- Modern Eyebrow line -->
      <path d="M290,290 Q315,280 330,295" stroke="#222320" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M350,295 Q365,280 390,290" stroke="#222320" stroke-width="6" fill="none" stroke-linecap="round"/>
    `,
  },
  {
    id: 'barber-03',
    name: 'DEVANG RATHOD',
    role: 'BEARD ARCHITECT & COLORIST',
    passNumber: 'SMS-2026-03',
    experience: '9 YEARS CRAFT',
    specialties: [
      'Razor Line Sculpting',
      'Beard Tonal Blending & Dye',
      'Restorative Scalp Ritual',
    ],
    initials: 'DR',
    portraitSvg: `
      <!-- Stylized Barber 3 Portrait (Devang Rathod - Sculpted Beard & Leather Apron) -->
      <defs>
        <linearGradient id="pGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2d2a24"/>
          <stop offset="60%" stop-color="#18191a"/>
          <stop offset="100%" stop-color="#101112"/>
        </linearGradient>
        <radialGradient id="faceGlow3" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#E8DDC8" stop-opacity="0.88"/>
          <stop offset="65%" stop-color="#b6aa94" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#3d372c" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
      <rect width="680" height="680" fill="url(#pGrad3)" rx="24"/>
      <circle cx="340" cy="300" r="260" fill="#77795B" opacity="0.18" filter="blur(30px)"/>
      <!-- Artisan Leather Barber Apron with Cross Straps -->
      <path d="M190,680 L230,510 L450,510 L490,680 Z" fill="#1b1a18"/>
      <polygon points="250,510 270,510 320,680 300,680" fill="#4a3e2e" stroke="#77795B" stroke-width="1.5"/>
      <polygon points="430,510 410,510 360,680 380,680" fill="#4a3e2e" stroke="#77795B" stroke-width="1.5"/>
      <!-- Metallic shears pocket accent -->
      <rect x="320" y="580" width="40" height="45" fill="#242220" stroke="#77795B" stroke-width="1.5" rx="4"/>
      <line x1="330" y1="565" x2="338" y2="585" stroke="#E8DDC8" stroke-width="2.5"/>
      <line x1="345" y1="565" x2="338" y2="585" stroke="#E8DDC8" stroke-width="2.5"/>
      <!-- Neck -->
      <rect x="305" y="420" width="70" height="90" fill="#d2c5b0" rx="8"/>
      <!-- Face -->
      <path d="M260,265 C255,365 270,450 340,465 C410,450 425,365 420,265 C420,205 410,185 340,185 C270,185 260,205 260,265 Z" fill="url(#faceGlow3)"/>
      <!-- Heavy Sculpted Executive Beard -->
      <path d="M262,340 C270,455 300,485 340,490 C380,485 410,455 418,340 C410,365 390,395 340,402 C290,395 270,365 262,340 Z" fill="#19191a"/>
      <!-- Slick Side Part Hair -->
      <path d="M245,250 C235,175 270,120 340,115 C415,110 445,170 435,245 C420,185 390,145 340,145 C290,145 260,185 245,250 Z" fill="#161718" stroke="#77795B" stroke-width="2"/>
      <path d="M280,135 Q340,125 410,155" stroke="#77795B" stroke-width="4" fill="none"/>
    `,
  },
  {
    id: 'barber-04',
    name: 'KAVYA PATEL',
    role: 'CREATIVE STYLIST & DIRECTOR',
    passNumber: 'SMS-2026-04',
    experience: '10 YEARS MASTERY',
    specialties: [
      'Contemporary Flow Styling',
      'Modern Shear-Over-Comb',
      'Hair Health & Density Therapy',
    ],
    initials: 'KP',
    portraitSvg: `
      <!-- Stylized Barber 4 Portrait (Kavya Patel - Flow Style & Turtleneck) -->
      <defs>
        <linearGradient id="pGrad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#272a26"/>
          <stop offset="60%" stop-color="#18191a"/>
          <stop offset="100%" stop-color="#101112"/>
        </linearGradient>
        <radialGradient id="faceGlow4" cx="50%" cy="45%" r="45%">
          <stop offset="0%" stop-color="#E8DDC8" stop-opacity="0.88"/>
          <stop offset="65%" stop-color="#b8ad9b" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#363a32" stop-opacity="0.2"/>
        </radialGradient>
      </defs>
      <rect width="680" height="680" fill="url(#pGrad4)" rx="24"/>
      <circle cx="340" cy="300" r="260" fill="#77795B" opacity="0.18" filter="blur(30px)"/>
      <!-- Luxury Knit Black Turtleneck -->
      <path d="M190,680 L240,510 L340,525 L440,510 L490,680 Z" fill="#131415"/>
      <rect x="290" y="440" width="100" height="85" fill="#1c1d1f" rx="14" stroke="#77795B" stroke-width="1.5"/>
      <!-- Face -->
      <path d="M265,270 C260,370 275,445 340,455 C405,445 420,370 415,270 C415,205 405,185 340,185 C275,185 265,205 265,270 Z" fill="url(#faceGlow4)"/>
      <!-- Light Stubble Shadow -->
      <path d="M280,380 C290,440 315,455 340,458 C365,455 390,440 400,380 C390,395 370,410 340,412 C310,410 290,395 280,380 Z" fill="#242526" opacity="0.55"/>
      <!-- Wavy Flow Hairstyle -->
      <path d="M245,255 C235,160 275,95 340,90 C420,90 445,150 440,245 C420,175 390,135 340,135 C285,135 255,175 245,255 Z" fill="#171819" stroke="#77795B" stroke-width="2"/>
      <path d="M255,185 C295,120 375,115 425,160 C380,125 315,125 255,185 Z" fill="#36382f"/>
    `,
  },
];

function generateFrontCardSvg(b: BarberCardData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1440" width="1024" height="1440">
  <defs>
    <!-- Matte Luxury Carbon Gradient -->
    <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1d1f"/>
      <stop offset="50%" stop-color="#171819"/>
      <stop offset="100%" stop-color="#121314"/>
    </linearGradient>

    <!-- Metallic Gold/Olive Accent Gradient -->
    <linearGradient id="oliveGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9ba074"/>
      <stop offset="50%" stop-color="#77795B"/>
      <stop offset="100%" stop-color="#555740"/>
    </linearGradient>

    <!-- Subtle Vignette Frame -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>
  </defs>

  <!-- CARD BASE SURFACE (#171819) -->
  <rect width="1024" height="1440" rx="36" fill="url(#cardBg)"/>

  <!-- OUTER ARCHITECTURAL BORDER (#77795B) -->
  <rect x="24" y="24" width="976" height="1392" rx="26" fill="none" stroke="#77795B" stroke-width="3" stroke-opacity="0.55"/>
  <rect x="36" y="36" width="952" height="1368" rx="20" fill="none" stroke="#E8DDC8" stroke-width="1" stroke-opacity="0.18"/>

  <!-- TOP LANYARD CUTOUT SLOT (Elongated Pill Slot at x=512, y=70) -->
  <g transform="translate(512, 72)">
    <!-- Slot shadow/recess -->
    <rect x="-92" y="-18" width="184" height="36" rx="18" fill="#0d0e0f"/>
    <!-- Slot metallic grommet outline -->
    <rect x="-92" y="-18" width="184" height="36" rx="18" fill="none" stroke="#8e9196" stroke-width="4"/>
    <rect x="-88" y="-14" width="176" height="28" rx="14" fill="#080809" stroke="#333538" stroke-width="2"/>
    <!-- Rivet dots on sides -->
    <circle cx="-112" cy="0" r="5" fill="#77795B"/>
    <circle cx="112" cy="0" r="5" fill="#77795B"/>
  </g>

  <!-- TOP BRANDING HEADER -->
  <g transform="translate(68, 140)">
    <!-- Official sb monogram emblem -->
    <rect x="0" y="0" width="76" height="76" rx="12" fill="#151617" stroke="#77795B" stroke-width="2.5"/>
    <text x="38" y="52" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="34" font-weight="800" text-anchor="middle" letter-spacing="-1">sb</text>

    <!-- Sandy Men's Salon Logotype -->
    <text x="96" y="38" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="32" font-weight="700" letter-spacing="0.5">SANDY</text>
    <text x="96" y="66" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" letter-spacing="3.5">MEN'S SALON · RAJKOT</text>

    <!-- Right Header Badges: PASS ID & VERIFIED SEAL -->
    <g transform="translate(710, 8)">
      <rect x="0" y="0" width="176" height="34" rx="8" fill="#202224" stroke="#77795B" stroke-width="1.5"/>
      <text x="88" y="22" fill="#E8DDC8" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="2">STAFF PASS</text>
      <text x="88" y="56" fill="#9ba074" font-family="monospace" font-size="11" text-anchor="middle" letter-spacing="1.5">${b.passNumber}</text>
    </g>
  </g>

  <!-- CENTER PORTRAIT HERO FRAME -->
  <g transform="translate(68, 240)">
    <!-- Framing Background and Shadow -->
    <rect x="0" y="0" width="888" height="660" rx="20" fill="#101112" stroke="#77795B" stroke-width="2"/>
    <rect x="8" y="8" width="872" height="644" rx="16" fill="none" stroke="#E8DDC8" stroke-width="1" stroke-opacity="0.15"/>

    <!-- Embedded Barber Portrait (Centered at 104, 0) -->
    <g transform="translate(104, 0)">
      ${b.portraitSvg}
    </g>

    <!-- Vignette & Gradient Overlays for seamless luxury integration -->
    <rect x="0" y="0" width="888" height="660" rx="20" fill="url(#vignette)" pointer-events="none"/>
    <rect x="0" y="480" width="888" height="180" rx="20" fill="url(#cardBg)" opacity="0.85" pointer-events="none"/>

    <!-- Corner Framing Accents in Mehndi Olive -->
    <path d="M12,32 L12,12 L32,12" stroke="#9ba074" stroke-width="3" fill="none"/>
    <path d="M876,32 L876,12 L856,12" stroke="#9ba074" stroke-width="3" fill="none"/>
    <path d="M12,628 L12,648 L32,648" stroke="#9ba074" stroke-width="3" fill="none"/>
    <path d="M876,628 L876,648 L856,648" stroke="#9ba074" stroke-width="3" fill="none"/>

    <!-- Experience Badge Overlay on Portrait -->
    <g transform="translate(32, 600)">
      <rect x="0" y="0" width="190" height="32" rx="6" fill="#171819" fill-opacity="0.9" stroke="#77795B" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="4" fill="#9ba074"/>
      <text x="32" y="21" fill="#E8DDC8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">${b.experience}</text>
    </g>
  </g>

  <!-- LOWER INFORMATION & TYPOGRAPHY SECTION -->
  <g transform="translate(76, 940)">
    <!-- Small Category Eyebrow -->
    <text x="0" y="0" fill="#9ba074" font-family="'Outfit', sans-serif" font-size="15" font-weight="700" letter-spacing="4">OFFICIAL MASTER BARBER</text>

    <!-- Large Barber Name (Warm Ivory #E8DDC8) -->
    <text x="0" y="56" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="62" font-weight="800" letter-spacing="-1">${b.name}</text>

    <!-- Professional Role Subtitle -->
    <text x="0" y="98" fill="#E8DDC8" fill-opacity="0.75" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="600" letter-spacing="2.5">${b.role}</text>

    <!-- Horizontal Decorative Divider -->
    <line x1="0" y1="126" x2="872" y2="126" stroke="#77795B" stroke-width="1.5" stroke-opacity="0.45"/>
    <polygon points="436,122 440,126 436,130 432,126" fill="#9ba074"/>

    <!-- Specialties Preview Row -->
    <g transform="translate(0, 160)">
      <text x="0" y="0" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="2.5">PRIMARY SPECIALTY</text>
      <text x="0" y="28" fill="#E8DDC8" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="500">${b.specialties[0]}</text>
    </g>
    <g transform="translate(460, 160)">
      <text x="0" y="0" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" letter-spacing="2.5">AUTHENTICATION</text>
      <text x="0" y="28" fill="#E8DDC8" font-family="monospace" font-size="15" font-weight="600">CERTIFIED BESPOKE MASTER</text>
    </g>
  </g>

  <!-- BOTTOM CARD FOOTER (Barcode, Microprint, Official Sandy Signature) -->
  <g transform="translate(76, 1260)">
    <!-- Realistic Barcode Graphic -->
    <g transform="translate(0, 10)">
      <!-- Barcode background -->
      <rect x="0" y="0" width="280" height="68" fill="#121314" stroke="#77795B" stroke-width="1" rx="6"/>
      <!-- Vertical lines pattern -->
      <g fill="#E8DDC8" transform="translate(16, 10)">
        <rect x="0" y="0" width="4" height="34"/>
        <rect x="6" y="0" width="2" height="34"/>
        <rect x="11" y="0" width="5" height="34"/>
        <rect x="18" y="0" width="2" height="34"/>
        <rect x="23" y="0" width="6" height="34"/>
        <rect x="32" y="0" width="3" height="34"/>
        <rect x="38" y="0" width="2" height="34"/>
        <rect x="44" y="0" width="5" height="34"/>
        <rect x="52" y="0" width="2" height="34"/>
        <rect x="58" y="0" width="4" height="34"/>
        <rect x="65" y="0" width="7" height="34"/>
        <rect x="75" y="0" width="2" height="34"/>
        <rect x="81" y="0" width="5" height="34"/>
        <rect x="89" y="0" width="3" height="34"/>
        <rect x="95" y="0" width="2" height="34"/>
        <rect x="101" y="0" width="6" height="34"/>
        <rect x="110" y="0" width="4" height="34"/>
        <rect x="118" y="0" width="2" height="34"/>
        <rect x="124" y="0" width="5" height="34"/>
        <rect x="132" y="0" width="3" height="34"/>
        <rect x="138" y="0" width="4" height="34"/>
        <rect x="145" y="0" width="2" height="34"/>
        <rect x="151" y="0" width="6" height="34"/>
        <rect x="160" y="0" width="3" height="34"/>
        <rect x="166" y="0" width="2" height="34"/>
        <rect x="172" y="0" width="5" height="34"/>
        <rect x="180" y="0" width="2" height="34"/>
        <rect x="186" y="0" width="4" height="34"/>
        <rect x="194" y="0" width="3" height="34"/>
        <rect x="200" y="0" width="5" height="34"/>
        <rect x="208" y="0" width="2" height="34"/>
        <rect x="214" y="0" width="6" height="34"/>
        <rect x="223" y="0" width="4" height="34"/>
        <rect x="230" y="0" width="2" height="34"/>
        <rect x="236" y="0" width="5" height="34"/>
        <rect x="244" y="0" width="4" height="34"/>
      </g>
      <text x="140" y="58" fill="#9ba074" font-family="monospace" font-size="10" text-anchor="middle" letter-spacing="3">${b.passNumber}</text>
    </g>

    <!-- Sandy Signature & Location Coordinates -->
    <g transform="translate(320, 22)">
      <text x="0" y="0" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="17" font-weight="700" letter-spacing="1.5">SANDY MEN'S SALON</text>
      <text x="0" y="24" fill="#E8DDC8" fill-opacity="0.55" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500">KALAWAD ROAD · RAJKOT · GUJARAT</text>
      <text x="0" y="46" fill="#9ba074" font-family="monospace" font-size="11" letter-spacing="2">AUTHENTIC CRAFTSMANSHIP</text>
    </g>

    <!-- Holographic Micro-Seal Emblem -->
    <g transform="translate(800, 44)">
      <circle cx="20" cy="0" r="26" fill="#151617" stroke="#77795B" stroke-width="2"/>
      <circle cx="20" cy="0" r="20" fill="none" stroke="#E8DDC8" stroke-width="1" stroke-opacity="0.3"/>
      <polygon points="20,-12 24,-4 32,-4 26,2 28,10 20,6 12,10 14,2 8,-4 16,-4" fill="#9ba074"/>
    </g>
  </g>
</svg>`;
}

function generateBackCardSvg(b: BarberCardData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1440" width="1024" height="1440">
  <defs>
    <!-- Matte Luxury Dark Background -->
    <linearGradient id="backBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#191a1c"/>
      <stop offset="50%" stop-color="#151617"/>
      <stop offset="100%" stop-color="#101112"/>
    </linearGradient>

    <!-- Guilloche Security Pattern -->
    <pattern id="secGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#77795B" stroke-width="0.75" stroke-opacity="0.14"/>
    </pattern>
  </defs>

  <!-- CARD BASE SURFACE (#171819) -->
  <rect width="1024" height="1440" rx="36" fill="url(#backBg)"/>

  <!-- Subtle Security Pattern Field -->
  <rect x="24" y="24" width="976" height="1392" rx="26" fill="url(#secGrid)"/>

  <!-- OUTER ARCHITECTURAL BORDER (#77795B) -->
  <rect x="24" y="24" width="976" height="1392" rx="26" fill="none" stroke="#77795B" stroke-width="3" stroke-opacity="0.55"/>
  <rect x="36" y="36" width="952" height="1368" rx="20" fill="none" stroke="#E8DDC8" stroke-width="1" stroke-opacity="0.18"/>

  <!-- TOP LANYARD CUTOUT SLOT (Matching Front) -->
  <g transform="translate(512, 72)">
    <rect x="-92" y="-18" width="184" height="36" rx="18" fill="#0d0e0f"/>
    <rect x="-92" y="-18" width="184" height="36" rx="18" fill="none" stroke="#8e9196" stroke-width="4"/>
    <rect x="-88" y="-14" width="176" height="28" rx="14" fill="#080809" stroke="#333538" stroke-width="2"/>
    <circle cx="-112" cy="0" r="5" fill="#77795B"/>
    <circle cx="112" cy="0" r="5" fill="#77795B"/>
  </g>

  <!-- TOP HEADER: SALON IDENTITY -->
  <g transform="translate(512, 160)" text-anchor="middle">
    <text x="0" y="0" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" letter-spacing="4">BESPOKE MEN'S GROOMING LOUNGE</text>
    <text x="0" y="44" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="38" font-weight="800" letter-spacing="2">SANDY MEN'S SALON</text>
    <line x1="-180" y1="64" x2="180" y2="64" stroke="#77795B" stroke-width="1.5" stroke-opacity="0.6"/>
  </g>

  <!-- CENTER CREST: PROMINENT SB EMBLEM WITH METALLIC RING -->
  <g transform="translate(512, 420)">
    <!-- Decorative Concentric Rings -->
    <circle cx="0" cy="0" r="140" fill="#121314" stroke="#77795B" stroke-width="3" stroke-opacity="0.7"/>
    <circle cx="0" cy="0" r="126" fill="none" stroke="#E8DDC8" stroke-width="1.5" stroke-opacity="0.25"/>
    <circle cx="0" cy="0" r="112" fill="#171819" stroke="#77795B" stroke-width="2" stroke-dasharray="6,4"/>

    <!-- Prominent Monogram -->
    <rect x="-48" y="-48" width="96" height="96" rx="16" fill="#151617" stroke="#77795B" stroke-width="2.5"/>
    <text x="0" y="16" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="48" font-weight="800" text-anchor="middle" letter-spacing="-1">sb</text>

    <!-- Surrounding Circular Microprint -->
    <text x="0" y="80" fill="#9ba074" font-family="monospace" font-size="11" text-anchor="middle" letter-spacing="3">VERIFIED MASTER CRAFT</text>
    <text x="0" y="-70" fill="#9ba074" font-family="monospace" font-size="11" text-anchor="middle" letter-spacing="3">RAJKOT · INDIA</text>
  </g>

  <!-- BARBER VERIFIED PROFILE BLOCK -->
  <g transform="translate(512, 630)" text-anchor="middle">
    <text x="0" y="0" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="34" font-weight="700" letter-spacing="0.5">${b.name}</text>
    <text x="0" y="32" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="600" letter-spacing="2">${b.role}</text>
    <text x="0" y="60" fill="#E8DDC8" fill-opacity="0.5" font-family="monospace" font-size="13" letter-spacing="2">PASS ID: ${b.passNumber} · ${b.experience}</text>
  </g>

  <!-- SPECIALTIES / MASTERIES LIST (3 Elegant Cards) -->
  <g transform="translate(104, 750)">
    <rect x="0" y="0" width="816" height="340" rx="16" fill="#121314" stroke="#77795B" stroke-width="1.5"/>

    <text x="40" y="44" fill="#9ba074" font-family="'Outfit', sans-serif" font-size="14" font-weight="700" letter-spacing="3">CORE SPECIALTIES &amp; PROTOCOLS</text>

    <!-- Specialty 1 -->
    <g transform="translate(40, 80)">
      <circle cx="12" cy="14" r="5" fill="#77795B"/>
      <text x="32" y="20" fill="#E8DDC8" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="600">${b.specialties[0]}</text>
      <text x="32" y="44" fill="#E8DDC8" fill-opacity="0.55" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">Bespoke customized technique executing flawless geometry.</text>
    </g>

    <!-- Specialty 2 -->
    <g transform="translate(40, 160)">
      <circle cx="12" cy="14" r="5" fill="#77795B"/>
      <text x="32" y="20" fill="#E8DDC8" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="600">${b.specialties[1]}</text>
      <text x="32" y="44" fill="#E8DDC8" fill-opacity="0.55" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">Artisanal razor precision with steam-distilled eucalyptus finish.</text>
    </g>

    <!-- Specialty 3 -->
    <g transform="translate(40, 240)">
      <circle cx="12" cy="14" r="5" fill="#77795B"/>
      <text x="32" y="20" fill="#E8DDC8" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="600">${b.specialties[2]}</text>
      <text x="32" y="44" fill="#E8DDC8" fill-opacity="0.55" font-family="'Plus Jakarta Sans', sans-serif" font-size="13">Tailored grooming consultation matching bone structure and profile.</text>
    </g>
  </g>

  <!-- BOTTOM VERIFICATION QR / SECURITY STRIP -->
  <g transform="translate(104, 1130)">
    <rect x="0" y="0" width="816" height="110" rx="12" fill="#171819" stroke="#77795B" stroke-width="1.5"/>

    <!-- Simulated Security QR Code Pattern -->
    <g transform="translate(24, 18)" fill="#E8DDC8">
      <rect x="0" y="0" width="74" height="74" fill="#0d0e0f"/>
      <!-- QR Position markers -->
      <rect x="6" y="6" width="22" height="22" fill="#9ba074"/>
      <rect x="10" y="10" width="14" height="14" fill="#0d0e0f"/>
      <rect x="46" y="6" width="22" height="22" fill="#9ba074"/>
      <rect x="50" y="10" width="14" height="14" fill="#0d0e0f"/>
      <rect x="6" y="46" width="22" height="22" fill="#9ba074"/>
      <rect x="10" y="50" width="14" height="14" fill="#0d0e0f"/>
      <!-- Random QR blocks -->
      <rect x="32" y="12" width="6" height="6"/>
      <rect x="32" y="24" width="8" height="6"/>
      <rect x="14" y="32" width="6" height="8"/>
      <rect x="36" y="36" width="8" height="8"/>
      <rect x="52" y="32" width="10" height="6"/>
      <rect x="32" y="48" width="6" height="10"/>
      <rect x="44" y="52" width="12" height="6"/>
      <rect x="62" y="56" width="6" height="10"/>
    </g>

    <!-- Security Text & Verification Code -->
    <g transform="translate(124, 34)">
      <text x="0" y="0" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">AUTHENTICATED DIGITAL STAFF CREDENTIAL</text>
      <text x="0" y="24" fill="#9ba074" font-family="monospace" font-size="12" letter-spacing="2">HASH: 9A8F-4B2E-SMS-RAJKOT-VERIFIED</text>
      <text x="0" y="44" fill="#E8DDC8" fill-opacity="0.45" font-family="'Plus Jakarta Sans', sans-serif" font-size="11">Scan via internal terminal to verify current shift and appointments.</text>
    </g>
  </g>

  <!-- FOOTER PLEDGE STATEMENT -->
  <g transform="translate(512, 1330)" text-anchor="middle">
    <text x="0" y="0" fill="#E8DDC8" font-family="'Outfit', sans-serif" font-size="18" font-weight="800" letter-spacing="3">"NOT JUST A CUT. A STATEMENT."</text>
    <text x="0" y="26" fill="#9ba074" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" letter-spacing="2.5">SANDY MEN'S SALON · RAJKOT · EST. 2021</text>
  </g>
</svg>`;
}

function generateStrapSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 1024" width="256" height="1024">
  <defs>
    <!-- Mehndi Olive Base with Fabric Grain -->
    <linearGradient id="strapGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4e503a"/>
      <stop offset="12%" stop-color="#77795B"/>
      <stop offset="50%" stop-color="#888b67"/>
      <stop offset="88%" stop-color="#77795B"/>
      <stop offset="100%" stop-color="#4e503a"/>
    </linearGradient>

    <!-- Woven Stitching Pattern -->
    <pattern id="stitch" width="8" height="8" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="8" y2="8" stroke="#363827" stroke-width="1.2"/>
      <line x1="0" y1="8" x2="8" y2="0" stroke="#9ba074" stroke-width="0.6" stroke-opacity="0.4"/>
    </pattern>
  </defs>

  <!-- STRAP BASE -->
  <rect width="256" height="1024" fill="url(#strapGrad)"/>
  <rect width="256" height="1024" fill="url(#stitch)" opacity="0.35"/>

  <!-- DARK REINFORCED BORDER EDGES -->
  <rect x="0" y="0" width="14" height="1024" fill="#2d2f21"/>
  <rect x="242" y="0" width="14" height="1024" fill="#2d2f21"/>
  <line x1="18" y1="0" x2="18" y2="1024" stroke="#E8DDC8" stroke-width="1.5" stroke-dasharray="8,6" stroke-opacity="0.6"/>
  <line x1="238" y1="0" x2="238" y2="1024" stroke="#E8DDC8" stroke-width="1.5" stroke-dasharray="8,6" stroke-opacity="0.6"/>

  <!-- REPEATING REVERSIBLE SANDY BRANDING -->
  <g fill="#E8DDC8" font-family="'Outfit', sans-serif" font-weight="800" font-size="28" letter-spacing="5" text-anchor="middle">
    <!-- Block 1 -->
    <g transform="translate(128, 120) rotate(-90)">
      <text x="0" y="0">SANDY MEN'S SALON</text>
    </g>
    <circle cx="128" cy="270" r="10" fill="#171819" stroke="#E8DDC8" stroke-width="2"/>
    <text x="128" y="275" font-size="12" fill="#E8DDC8">sb</text>

    <!-- Block 2 -->
    <g transform="translate(128, 440) rotate(-90)">
      <text x="0" y="0">SANDY MEN'S SALON</text>
    </g>
    <circle cx="128" cy="590" r="10" fill="#171819" stroke="#E8DDC8" stroke-width="2"/>
    <text x="128" y="595" font-size="12" fill="#E8DDC8">sb</text>

    <!-- Block 3 -->
    <g transform="translate(128, 760) rotate(-90)">
      <text x="0" y="0">SANDY MEN'S SALON</text>
    </g>
    <circle cx="128" cy="910" r="10" fill="#171819" stroke="#E8DDC8" stroke-width="2"/>
    <text x="128" y="915" font-size="12" fill="#E8DDC8">sb</text>
  </g>
</svg>`;
}

// Generate all files
for (const b of barbers) {
  const frontSvg = generateFrontCardSvg(b);
  const backSvg = generateBackCardSvg(b);
  fs.writeFileSync(path.join(outDir, `${b.id}-front.svg`), frontSvg, 'utf-8');
  fs.writeFileSync(path.join(outDir, `${b.id}-back.svg`), backSvg, 'utf-8');
  console.log(`Generated ${b.id}-front.svg and ${b.id}-back.svg`);
}

fs.writeFileSync(path.join(outDir, 'sandy-strap.svg'), generateStrapSvg(), 'utf-8');
console.log('Generated sandy-strap.svg');
