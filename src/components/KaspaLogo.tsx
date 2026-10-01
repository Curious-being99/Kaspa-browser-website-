import React from 'react';

interface KaspaLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const KaspaLogo: React.FC<KaspaLogoProps> = ({ 
  className = 'w-8 h-8', 
  size,
  alt = 'Kaspa Browser Logo'
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <img
      src="/logo-square.png"
      alt={alt}
      className={`object-cover object-center select-none aspect-square ${className}`}
      style={style}
      loading="eager"
      decoding="async"
      onError={(e) => {
        const target = e.currentTarget;
        target.onerror = null;
        if (!target.src.endsWith('/logo.png')) {
          target.src = '/logo.png';
        }
      }}
    />
  );
};

