import React from 'react';

const ExternalLinkIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      '--icon-stroke': 'var(--retro-text)',
      '--icon-hover': 'var(--retro-accent1)'
    }}
    className="external-link-icon"
  >
    <style jsx global>{`
      .external-link-icon {
        transition: stroke 0.2s ease;
      }
      .external-link-icon path,
      .external-link-icon rect {
        stroke: var(--icon-stroke);
      }
      a:hover .external-link-icon path,
      a:hover .external-link-icon rect {
        stroke: var(--icon-hover);
      }
    `}</style>
    <path
      d="M7 13L13 7M10 7H13V10"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      rx="3"
      strokeWidth="2"
    />
  </svg>
);

export default ExternalLinkIcon;
