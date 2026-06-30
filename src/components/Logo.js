import React from 'react';

function Logo({ size = 38, variant = 'full' }) {
  const logoSvg = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={size * 0.6} height={size * 0.6}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div style={{
        width: size,
        height: size,
        background: '#e74c3c',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {logoSvg}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <div style={{
        width: size,
        height: size,
        background: '#e74c3c',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {logoSvg}
      </div>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '18px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #1a5490, #e74c3c)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        CIVIALERT
      </span>
    </div>
  );
}

export default Logo;