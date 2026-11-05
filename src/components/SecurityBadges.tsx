import React from 'react';

interface SecurityBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 1. Badge: 100% SECURE
 * Photorealistic 3D Gold Starburst Medal with Padlock and Metallic Sheen
 */
export const Badge100Secure: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_0_14px_rgba(234,179,8,0.55)] hover:scale-105 transition-all duration-300 cursor-pointer`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="100% Secure Transaction Seal"
    >
      <defs>
        {/* Multi-stop Luxury Metallic Gold Gradient */}
        <linearGradient id="pca-gold-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="18%" stopColor="#ECC251" />
          <stop offset="38%" stopColor="#BE891E" />
          <stop offset="55%" stopColor="#FFF2A3" />
          <stop offset="72%" stopColor="#A87515" />
          <stop offset="90%" stopColor="#6C4504" />
          <stop offset="100%" stopColor="#ECC251" />
        </linearGradient>

        <linearGradient id="pca-gold-sheen-1" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE79A" />
          <stop offset="25%" stopColor="#C99427" />
          <stop offset="50%" stopColor="#FFF8CC" />
          <stop offset="75%" stopColor="#9C6B0F" />
          <stop offset="100%" stopColor="#FFE07A" />
        </linearGradient>

        <radialGradient id="pca-gold-radial-1" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFDE8" />
          <stop offset="30%" stopColor="#F5C747" />
          <stop offset="65%" stopColor="#C68E1E" />
          <stop offset="100%" stopColor="#7E520A" />
        </radialGradient>

        <radialGradient id="pca-padlock-dial" cx="42%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#2D271D" />
          <stop offset="60%" stopColor="#17130C" />
          <stop offset="100%" stopColor="#080705" />
        </radialGradient>

        {/* Text Paths */}
        <path id="pca-text-upper-1" d="M 33,100 A 67,67 0 0,1 167,100" />
        <path id="pca-text-lower-1" d="M 38,105 A 62,62 0 0,0 162,105" />
      </defs>

      {/* 24-point Outer Starburst Medal */}
      <path
        d="M 100.00 4.00 L 111.09 15.73 L 124.85 7.27 L 132.53 21.47 L 148.00 16.86 L 151.74 32.56 L 167.88 32.12 L 167.44 48.26 L 183.14 52.00 L 178.53 67.47 L 192.73 75.15 L 184.27 88.91 L 196.00 100.00 L 184.27 111.09 L 192.73 124.85 L 178.53 132.53 L 183.14 148.00 L 167.44 151.74 L 167.88 167.88 L 151.74 167.44 L 148.00 183.14 L 132.53 178.53 L 124.85 192.73 L 111.09 184.27 L 100.00 196.00 L 88.91 184.27 L 75.15 192.73 L 67.47 178.53 L 52.00 183.14 L 48.26 167.44 L 32.12 167.88 L 32.56 151.74 L 16.86 148.00 L 21.47 132.53 L 7.27 124.85 L 15.73 111.09 L 4.00 100.00 L 15.73 88.91 L 7.27 75.15 L 21.47 67.47 L 16.86 52.00 L 32.56 48.26 L 32.12 32.12 L 48.26 32.56 L 52.00 16.86 L 67.47 21.47 L 75.15 7.27 L 88.91 15.73 Z"
        fill="url(#pca-gold-grad-1)"
        stroke="#E5B942"
        strokeWidth="1.5"
      />
      {/* Inner Starburst Facet */}
      <path
        d="M 100.00 9.00 L 110.70 18.70 L 123.55 12.10 L 131.38 24.24 L 145.50 21.19 L 149.92 34.95 L 164.35 35.65 L 165.05 50.08 L 178.81 54.50 L 175.76 68.62 L 187.90 76.45 L 181.30 89.30 L 191.00 100.00 L 181.30 110.70 L 187.90 123.55 L 175.76 131.38 L 178.81 145.50 L 165.05 149.92 L 164.35 164.35 L 149.92 165.05 L 145.50 178.81 L 131.38 175.76 L 123.55 187.90 L 110.70 181.30 L 100.00 191.00 L 89.30 181.30 L 76.45 187.90 L 68.62 175.76 L 54.50 178.81 L 50.08 165.05 L 35.65 164.35 L 34.95 149.92 L 21.19 145.50 L 24.24 131.38 L 12.10 123.55 L 18.70 110.70 L 9.00 100.00 L 18.70 89.30 L 12.10 76.45 L 24.24 68.62 L 21.19 54.50 L 34.95 50.08 L 35.65 35.65 L 50.08 34.95 L 54.50 21.19 L 68.62 24.24 L 76.45 12.10 L 89.30 18.70 Z"
        fill="url(#pca-gold-sheen-1)"
        opacity="0.9"
      />

      {/* Concentric Gold Rims */}
      <circle cx="100" cy="100" r="76" fill="none" stroke="#7A4E08" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="73" fill="url(#pca-gold-radial-1)" stroke="#FFE899" strokeWidth="2" />
      <circle cx="100" cy="100" r="69" fill="none" stroke="#8A5A0A" strokeWidth="1" strokeDasharray="2,3" />

      {/* Inner Mirror Gold Disc */}
      <circle cx="100" cy="100" r="51" fill="url(#pca-gold-grad-1)" stroke="#5B3903" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="48" fill="url(#pca-gold-radial-1)" stroke="#FFF2B2" strokeWidth="1" />

      {/* Curved Text: 100% SECURE */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="12.5"
        fontWeight="900"
        fill="#1C1404"
        letterSpacing="2"
      >
        <textPath href="#pca-text-upper-1" startOffset="50%" textAnchor="middle">
          ★ 100% SECURE ★
        </textPath>
      </text>

      {/* Lower Curved Text: GUARANTEED */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="900"
        fill="#1C1404"
        letterSpacing="2.5"
      >
        <textPath href="#pca-text-lower-1" startOffset="50%" textAnchor="middle">
          ★ GUARANTEED ★
        </textPath>
      </text>

      {/* Center 3D Padlock */}
      <g transform="translate(100, 99)">
        {/* Shackle */}
        <path
          d="M -13,-4 V -16 C -13,-25 13,-25 13,-16 V -4"
          fill="none"
          stroke="#1F1A12"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M -13,-4 V -16 C -13,-25 13,-25 13,-16 V -4"
          fill="none"
          stroke="url(#pca-gold-sheen-1)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M -11,-16 C -11,-23 11,-23 11,-16"
          fill="none"
          stroke="#FFFDF0"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Lock Body */}
        <rect
          x="-19"
          y="-6"
          width="38"
          height="31"
          rx="6"
          fill="#1C1710"
          stroke="#8A5C0E"
          strokeWidth="1.5"
        />
        <rect x="-17" y="-4" width="34" height="27" rx="4.5" fill="url(#pca-padlock-dial)" />
        <rect x="-16" y="-3" width="32" height="12" rx="3" fill="url(#pca-gold-sheen-1)" opacity="0.2" />

        {/* Keyhole */}
        <circle cx="0" cy="6" r="4" fill="url(#pca-gold-grad-1)" stroke="#523807" strokeWidth="0.8" />
        <polygon points="-2.5,6 2.5,6 1.5,15 -1.5,15" fill="url(#pca-gold-grad-1)" stroke="#523807" strokeWidth="0.8" />
        <circle cx="0" cy="6" r="2.2" fill="#0C0A06" />
        <polygon points="-1.2,6 1.2,6 0.8,13 -0.8,13" fill="#0C0A06" />
      </g>
    </svg>
  );
};

/**
 * 2. Badge: TRUSTED BY CUSTOMERS
 * Photorealistic Gold & Onyx Medallion with Certified 3D Checkmark
 */
export const BadgeTrustedCustomers: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_0_14px_rgba(234,179,8,0.55)] hover:scale-105 transition-all duration-300 cursor-pointer`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trusted by Customers Certified Seal"
    >
      <defs>
        <linearGradient id="pca-gold-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="22%" stopColor="#E9BC46" />
          <stop offset="45%" stopColor="#BD861B" />
          <stop offset="68%" stopColor="#FFF2A3" />
          <stop offset="85%" stopColor="#9C6B0F" />
          <stop offset="100%" stopColor="#7A4F06" />
        </linearGradient>

        <radialGradient id="pca-onyx-center" cx="44%" cy="36%" r="65%">
          <stop offset="0%" stopColor="#252A36" />
          <stop offset="50%" stopColor="#121620" />
          <stop offset="100%" stopColor="#06080B" />
        </radialGradient>

        {/* Text Paths */}
        <path id="pca-text-upper-2" d="M 32,100 A 68,68 0 0,1 168,100" />
        <path id="pca-text-lower-2" d="M 37,105 A 63,63 0 0,0 163,105" />
      </defs>

      {/* 32-petal Scalloped Gold Medal Edge */}
      <path
        d="M 100.00 5.00 L 108.63 12.42 L 118.53 6.83 L 125.55 15.79 L 136.35 12.23 L 141.48 22.39 L 152.78 21.01 L 155.83 31.98 L 167.18 32.82 L 168.02 44.17 L 178.99 47.22 L 177.61 58.52 L 187.77 63.65 L 184.21 74.45 L 193.17 81.47 L 187.58 91.37 L 195.00 100.00 L 187.58 108.63 L 193.17 118.53 L 184.21 125.55 L 187.77 136.35 L 177.61 141.48 L 178.99 152.78 L 168.02 155.83 L 167.18 167.18 L 155.83 168.02 L 152.78 178.99 L 141.48 177.61 L 136.35 187.77 L 125.55 184.21 L 118.53 193.17 L 108.63 187.58 L 100.00 195.00 L 91.37 187.58 L 81.47 193.17 L 74.45 184.21 L 63.65 187.77 L 58.52 177.61 L 47.22 178.99 L 44.17 168.02 L 32.82 167.18 L 31.98 155.83 L 21.01 152.78 L 22.39 141.48 L 12.23 136.35 L 15.79 125.55 L 6.83 118.53 L 12.42 108.63 L 5.00 100.00 L 12.42 91.37 L 6.83 81.47 L 15.79 74.45 L 12.23 63.65 L 22.39 58.52 L 21.01 47.22 L 31.98 44.17 L 32.82 32.82 L 44.17 31.98 L 47.22 21.01 L 58.52 22.39 L 63.65 12.23 L 74.45 15.79 L 81.47 6.83 L 91.37 12.42 Z"
        fill="url(#pca-gold-grad-2)"
        stroke="#E6BB46"
        strokeWidth="1.5"
      />

      {/* Outer Polished Gold Ring */}
      <circle cx="100" cy="100" r="82" fill="none" stroke="#7A500A" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="79" fill="url(#pca-gold-grad-2)" stroke="#FFF2B2" strokeWidth="1.5" />

      {/* Inner Onyx Disc */}
      <circle cx="100" cy="100" r="54" fill="#0C0E12" stroke="#E6BB46" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="51" fill="url(#pca-onyx-center)" stroke="#FFE894" strokeWidth="1" />

      {/* Text Upper: TRUSTED */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="13"
        fontWeight="900"
        fill="#140E02"
        letterSpacing="2.5"
      >
        <textPath href="#pca-text-upper-2" startOffset="50%" textAnchor="middle">
          ★ TRUSTED ★
        </textPath>
      </text>

      {/* Text Lower: BY CUSTOMERS */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="10"
        fontWeight="900"
        fill="#140E02"
        letterSpacing="2"
      >
        <textPath href="#pca-text-lower-2" startOffset="50%" textAnchor="middle">
          BY CUSTOMERS
        </textPath>
      </text>

      {/* Two Lateral Stars */}
      <g fill="url(#pca-gold-grad-2)">
        <polygon points="58,100 60,95 65,95 61,92 63,87 58,90 53,87 55,92 51,95 56,95" />
        <polygon points="142,100 144,95 149,95 145,92 147,87 142,90 137,87 139,92 135,95 140,95" />
      </g>

      {/* Center 3D Checkmark */}
      <g transform="translate(100, 100)">
        {/* Soft shadow */}
        <path
          d="M -24,2 L -8,18 L 24,-16"
          fill="none"
          stroke="#000000"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        {/* Gold backing */}
        <path
          d="M -24,0 L -8,16 L 24,-18"
          fill="none"
          stroke="url(#pca-gold-grad-2)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crisp White core */}
        <path
          d="M -24,-1 L -8,15 L 24,-19"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Top highlight shine */}
        <path
          d="M -22,-2 L -8,12 L 22,-20"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/**
 * 3. Badge: SECURE CHECKOUT
 * Photorealistic 3D Gold Seal with 256-Bit SSL Protection
 */
export const BadgeSecureCheckout: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`${className} shrink-0 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_0_14px_rgba(234,179,8,0.55)] hover:scale-105 transition-all duration-300 cursor-pointer`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Secure Checkout 256-Bit SSL Encryption"
    >
      <defs>
        <linearGradient id="pca-gold-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9D1" />
          <stop offset="18%" stopColor="#E7BA41" />
          <stop offset="42%" stopColor="#BA841A" />
          <stop offset="65%" stopColor="#FFF3AA" />
          <stop offset="85%" stopColor="#A16E10" />
          <stop offset="100%" stopColor="#6E4504" />
        </linearGradient>

        <radialGradient id="pca-gold-radial-3" cx="42%" cy="34%" r="68%">
          <stop offset="0%" stopColor="#FFFDE8" />
          <stop offset="30%" stopColor="#F4C74A" />
          <stop offset="68%" stopColor="#C58D1D" />
          <stop offset="100%" stopColor="#7E5208" />
        </radialGradient>

        {/* Text Paths */}
        <path id="pca-text-upper-3" d="M 30,100 A 70,70 0 0,1 170,100" />
        <path id="pca-text-lower-3" d="M 36,104 A 64,64 0 0,0 164,104" />
      </defs>

      {/* 24-point Starburst */}
      <path
        d="M 100.00 4.00 L 111.09 15.73 L 124.85 7.27 L 132.53 21.47 L 148.00 16.86 L 151.74 32.56 L 167.88 32.12 L 167.44 48.26 L 183.14 52.00 L 178.53 67.47 L 192.73 75.15 L 184.27 88.91 L 196.00 100.00 L 184.27 111.09 L 192.73 124.85 L 178.53 132.53 L 183.14 148.00 L 167.44 151.74 L 167.88 167.88 L 151.74 167.44 L 148.00 183.14 L 132.53 178.53 L 124.85 192.73 L 111.09 184.27 L 100.00 196.00 L 88.91 184.27 L 75.15 192.73 L 67.47 178.53 L 52.00 183.14 L 48.26 167.44 L 32.12 167.88 L 32.56 151.74 L 16.86 148.00 L 21.47 132.53 L 7.27 124.85 L 15.73 111.09 L 4.00 100.00 L 15.73 88.91 L 7.27 75.15 L 21.47 67.47 L 16.86 52.00 L 32.56 48.26 L 32.12 32.12 L 48.26 32.56 L 52.00 16.86 L 67.47 21.47 L 75.15 7.27 L 88.91 15.73 Z"
        fill="url(#pca-gold-grad-3)"
        stroke="#E6BB46"
        strokeWidth="1.5"
      />
      <path
        d="M 100.00 10.00 L 110.57 19.69 L 123.29 13.07 L 131.00 25.17 L 145.00 22.06 L 149.31 35.74 L 163.64 36.36 L 164.26 50.69 L 177.94 55.00 L 174.83 69.00 L 186.93 76.71 L 180.31 89.43 L 190.00 100.00 L 180.31 110.57 L 186.93 123.29 L 174.83 131.00 L 177.94 145.00 L 164.26 149.31 L 163.64 163.64 L 149.31 164.26 L 145.00 177.94 L 131.00 174.83 L 123.29 186.93 L 110.57 180.31 L 100.00 190.00 L 89.43 180.31 L 76.71 186.93 L 69.00 174.83 L 55.00 177.94 L 50.69 164.26 L 36.36 163.64 L 35.74 149.31 L 22.06 145.00 L 25.17 131.00 L 13.07 123.29 L 19.69 110.57 L 10.00 100.00 L 19.69 89.43 L 13.07 76.71 L 25.17 69.00 L 22.06 55.00 L 35.74 50.69 L 36.36 36.36 L 50.69 35.74 L 55.00 22.06 L 69.00 25.17 L 76.71 13.07 L 89.43 19.69 Z"
        fill="url(#pca-gold-grad-3)"
        opacity="0.9"
      />

      {/* Channel and Mirror Discs */}
      <circle cx="100" cy="100" r="77" fill="none" stroke="#754904" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="74" fill="url(#pca-gold-radial-3)" stroke="#FFF4B8" strokeWidth="2" />
      <circle cx="100" cy="100" r="69" fill="none" stroke="#7A4E08" strokeWidth="1" strokeDasharray="2,3" />

      {/* Inner Mirror Disc */}
      <circle cx="100" cy="100" r="51" fill="url(#pca-gold-grad-3)" stroke="#5E3802" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="48" fill="url(#pca-gold-radial-3)" stroke="#FFF6C2" strokeWidth="1" />

      {/* Curved Text: SECURE CHECKOUT */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="11.5"
        fontWeight="900"
        fill="#181103"
        letterSpacing="2"
      >
        <textPath href="#pca-text-upper-3" startOffset="50%" textAnchor="middle">
          ★ SECURE CHECKOUT ★
        </textPath>
      </text>

      {/* Lower Curved Text: 256-BIT ENCRYPTION */}
      <text
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontSize="9.5"
        fontWeight="900"
        fill="#181103"
        letterSpacing="1.5"
      >
        <textPath href="#pca-text-lower-3" startOffset="50%" textAnchor="middle">
          ★ 256-BIT SSL ★
        </textPath>
      </text>

      {/* Center Golden Padlock */}
      <g transform="translate(100, 99)">
        {/* Shackle */}
        <path
          d="M -12,-3 V -15 C -12,-24 12,-24 12,-15 V -3"
          fill="none"
          stroke="#2B1D04"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M -12,-3 V -15 C -12,-24 12,-24 12,-15 V -3"
          fill="none"
          stroke="url(#pca-gold-grad-3)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M -10,-15 C -10,-22 10,-22 10,-15"
          fill="none"
          stroke="#FFFBE0"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Padlock Body */}
        <rect
          x="-18"
          y="-5"
          width="36"
          height="29"
          rx="5"
          fill="#1C1405"
          stroke="#875A0E"
          strokeWidth="1.5"
        />
        <rect x="-16" y="-3" width="32" height="25" rx="4" fill="url(#pca-gold-radial-3)" />
        <rect x="-15" y="-2" width="30" height="10" rx="2.5" fill="#FFFCE8" opacity="0.4" />

        {/* Keyhole */}
        <circle cx="0" cy="7" r="3.5" fill="#1C1304" />
        <polygon points="-2,7 2,7 1.2,15 -1.2,15" fill="#1C1304" />
      </g>
    </svg>
  );
};

/**
 * Composite SecurityBadges component
 * Renders the 3 badges side by side with responsive sizing, 100% transparent backgrounds, and hover effects
 */
export const SecurityBadges: React.FC<SecurityBadgeProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const badgeClass = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center justify-center gap-3 sm:gap-4 py-1.5 px-2 ${className}`}
      title="Pagos y Plataforma Protegida con Encriptación SSL de 256 Bits y Garantía Oficial"
    >
      <Badge100Secure className={badgeClass} />
      <BadgeTrustedCustomers className={badgeClass} />
      <BadgeSecureCheckout className={badgeClass} />
    </div>
  );
};

export default SecurityBadges;
