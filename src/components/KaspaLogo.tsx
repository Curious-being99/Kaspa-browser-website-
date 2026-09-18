import React from 'react';

interface KaspaLogoProps {
  className?: string;
  size?: number;
}

export const KaspaLogo: React.FC<KaspaLogoProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Kaspa Logo"
    >
      {/* Kaspa Turquoise Circle Background */}
      <circle cx="250" cy="250" r="236" fill="#49C3B4" />
      
      {/* Kaspa Official White K Icon Geometry */}
      <g stroke="#FFFFFF" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round">
        {/* Right vertical pillar */}
        <line x1="318" y1="135" x2="318" y2="365" />
        
        {/* Upper diagonal stroke */}
        <line x1="172" y1="160" x2="278" y2="250" />
        
        {/* Lower diagonal stroke */}
        <line x1="172" y1="340" x2="278" y2="250" />
      </g>
    </svg>
  );
};
