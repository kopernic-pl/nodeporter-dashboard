import React from 'react';

const EnvironmentBanner = ({ envType }) => {
  if (!envType) {
    return null;
  }

  let backgroundColor;
  let textColor;
  let borderColor;
  let boxShadowColor;
  let textShadowColor;
  let message;

  switch (envType) {
    case 'in-cluster':
      backgroundColor = '#00fff7'; // cyan
      textColor = '#111'; // dark
      borderColor = '#fff200'; // yellow
      boxShadowColor = '#00fff7'; // cyan
      textShadowColor = '#fff200'; // yellow
      message = 'Running in-cluster (production/Kubernetes)';
      break;
    case 'local':
      backgroundColor = '#ff00c8'; // magenta
      textColor = '#fff'; // white
      borderColor = '#fff200'; // yellow
      boxShadowColor = '#ff00c8'; // magenta
      textShadowColor = '#222'; // dark
      message = 'Running in local/dev mode';
      break;
    default: // 'unknown' or any other case
      backgroundColor = '#888'; // grey or some neutral color
      textColor = '#fff';
      borderColor = '#555';
      boxShadowColor = '#888';
      textShadowColor = '#333';
      message = 'Environment type: unknown';
      break;
  }

  const bannerStyle = {
    background: backgroundColor,
    color: textColor,
    fontFamily: "'Press Start 2P', 'VT323', monospace",
    fontSize: '1rem',
    letterSpacing: '1px',
    textAlign: 'center',
    padding: '0.7rem 0',
    borderBottom: `4px solid ${borderColor}`,
    boxShadow: `0 2px 12px ${boxShadowColor}`,
    marginBottom: '1.5rem',
    textShadow: `1px 1px ${textShadowColor}`,
  };

  return <div style={bannerStyle}>{message}</div>;
};

export default EnvironmentBanner;
