// Nanhi Kaliyan (Little Buds) — Dynamic Vector Flower Logo
// Pure SVG with layered petals, sun rays, smiling face, and open-close cycle animation.

window.createKaliFlowerSVG = function (size = 180, isAnimated = true) {
  const animClass = isAnimated ? 'animate-bud-cycle' : '';
  const petalLeftAnim = isAnimated ? 'animate-petal-left' : '';
  const petalRightAnim = isAnimated ? 'animate-petal-right' : '';
  const sunAnim = isAnimated ? 'animate-sun-glow' : '';

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="kali-flower-svg ${animClass}" style="overflow: visible; filter: drop-shadow(0 10px 20px rgba(123, 201, 111, 0.2));">
      <defs>
        <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD86B" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#FFD86B" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#FFD86B" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="petalGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFA8BD" />
          <stop offset="100%" stop-color="#FF8FA8" />
        </linearGradient>
        <linearGradient id="petalGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFB6C9" />
          <stop offset="100%" stop-color="#FF9AB3" />
        </linearGradient>
        <linearGradient id="centerBudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFB6C9" />
          <stop offset="100%" stop-color="#FF9AB3" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8EE080" />
          <stop offset="100%" stop-color="#6FBE63" />
        </linearGradient>
      </defs>

      <!-- 1. SUN & GLOW RAYS (BEHIND) -->
      <g class="kali-sun-group ${sunAnim}">
        <circle cx="100" cy="72" r="46" fill="url(#sunGlowGrad)" />
        <circle cx="100" cy="72" r="26" fill="#FFD86B" />
        <!-- Sun Rays -->
        <line x1="100" y1="36" x2="100" y2="28" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="126" y1="46" x2="132" y2="40" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="136" y1="72" x2="144" y2="72" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="126" y1="98" x2="132" y2="104" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="74" y1="46" x2="68" y2="40" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="64" y1="72" x2="56" y2="72" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
        <line x1="74" y1="98" x2="68" y2="104" stroke="#FFD86B" stroke-width="4.5" stroke-linecap="round" />
      </g>

      <!-- 2. SOFT SOIL MOUND (BASE) -->
      <ellipse cx="100" cy="178" rx="42" ry="7" fill="#E6D3B3" opacity="0.6" />

      <!-- 3. STEM & CALYX BASE -->
      <path d="M100 156 Q100 172 100 176" stroke="#5EAA52" stroke-width="8" stroke-linecap="round" />

      <!-- 4. GREEN LEAVES SPREADING GENTLY -->
      <g class="kali-leaves">
        <!-- Left Leaf -->
        <path d="M96 160 C70 162 44 140 40 114 C48 110 74 122 96 152 Z" fill="url(#leafGrad)" />
        <path d="M52 124 Q72 136 94 154" stroke="#529846" stroke-width="2" stroke-linecap="round" opacity="0.7" />
        <!-- Right Leaf -->
        <path d="M104 160 C130 162 156 140 160 114 C152 110 126 122 104 152 Z" fill="url(#leafGrad)" />
        <path d="M148 124 Q128 136 106 154" stroke="#529846" stroke-width="2" stroke-linecap="round" opacity="0.7" />
      </g>

      <!-- 5. INNER CROWN BLOSSOM TIP (YELLOW) -->
      <path d="M100 84 L90 98 L110 98 Z" fill="#FFE699" />

      <!-- 6. LEFT UNFOLDING PETAL -->
      <path class="kali-petal-left ${petalLeftAnim}" d="M100 154 C74 154 58 134 60 102 C62 82 82 74 100 94 Z" fill="url(#petalGradLeft)" />

      <!-- 7. RIGHT UNFOLDING PETAL -->
      <path class="kali-petal-right ${petalRightAnim}" d="M100 154 C126 154 142 134 140 102 C138 82 118 74 100 94 Z" fill="url(#petalGradRight)" />

      <!-- 8. MAIN CENTER SMILING BUD -->
      <path class="kali-center-bud" d="M100 156 C78 156 68 136 70 110 C72 88 90 78 100 86 C110 78 128 88 130 110 C132 136 122 156 100 156 Z" fill="url(#centerBudGrad)" />

      <!-- 9. CUTE SMILING FACE -->
      <!-- Eyes -->
      <ellipse cx="88" cy="116" rx="4.5" ry="5.5" fill="#3A3A4A" />
      <circle cx="89.5" cy="114" r="1.8" fill="#FFFFFF" />
      <ellipse cx="112" cy="116" rx="4.5" ry="5.5" fill="#3A3A4A" />
      <circle cx="113.5" cy="114" r="1.8" fill="#FFFFFF" />
      
      <!-- Rosy Cheeks -->
      <ellipse cx="80" cy="123" rx="5.5" ry="3.5" fill="#FF708F" opacity="0.65" />
      <ellipse cx="120" cy="123" rx="5.5" ry="3.5" fill="#FF708F" opacity="0.65" />
      
      <!-- Gentle Smile -->
      <path d="M94 122 Q100 128 106 122" stroke="#3A3A4A" stroke-width="2.5" stroke-linecap="round" fill="none" />
      
      <!-- Dewdrop Sparkle on Left Petal -->
      <circle cx="76" cy="98" r="2.8" fill="#FFFFFF" opacity="0.9" />
    </svg>
  `;
};
