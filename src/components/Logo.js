import React from 'react';

function Logo({ size = 38, variant = 'full', className = '' }) {
  // Variantes : 'full' (avec texte), 'icon' (seulement l'icône)
  
  const logoSvg = (
    <svg
      viewBox="0 0 100 100"
      width={size * 0.7}
      height={size * 0.7}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Forme de l'œil - comme GODEYES */}
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="#1a5490" stroke="white" strokeWidth="2.5"/>
      {/* Iris */}
      <circle cx="50" cy="50" r="10" fill="#f5ab35"/>
      {/* Pupille */}
      <circle cx="50" cy="50" r="4" fill="white"/>
      {/* Rayons - style GODEYES */}
      <line x1="50" y1="15" x2="50" y2="25" stroke="white" strokeWidth="2"/>
      <line x1="75" y1="30" x2="68" y2="38" stroke="white" strokeWidth="2"/>
      <line x1="75" y1="70" x2="68" y2="62" stroke="white" strokeWidth="2"/>
      <line x1="50" y1="85" x2="50" y2="75" stroke="white" strokeWidth="2"/>
      <line x1="25" y1="30" x2="32" y2="38" stroke="white" strokeWidth="2"/>
      <line x1="25" y1="70" x2="32" y2="62" stroke="white" strokeWidth="2"/>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div
        className={`logo-icon-wrapper ${className}`}
        style={{
          width: size,
          height: size,
          background: '#e74c3c',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
        }}
      >
        {logoSvg}
      </div>
    );
  }

  // Version complète avec texte
  return (
    <div
      className={`logo-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: '#e74c3c',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
        }}
      >
        {logoSvg}
      </div>
      <span
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: '18px',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #1a5490, #e74c3c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        CIVIALERT
      </span>
    </div>
  );
}

export default Logo;