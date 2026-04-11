import React from 'react';
import styled from 'styled-components';

const IndicatorContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const IndicatorBadge = styled.div`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-accent2);
  color: var(--retro-bg1);
  border: 2px solid var(--retro-accent1);
  border-radius: 0;
  padding: 0.3rem 0.6rem;
  font-size: 0.6rem;
  font-weight: bold;
  box-shadow:
    2px 2px 0 var(--retro-accent1),
    4px 4px 0 var(--retro-bg1);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-accent1);
    color: var(--retro-surface);
    border: 2px solid var(--retro-accent2);
    box-shadow:
      2px 2px 0 var(--retro-accent2),
      4px 4px 0 var(--retro-border);
  }
`;

const FilteredCount = styled.span`
  font-family: 'Press Start 2P', 'VT323', monospace;
  font-size: 0.7rem;
  color: var(--retro-accent2);

  /* Light mode */
  @media (prefers-color-scheme: light) {
    color: var(--retro-accent1);
  }
`;

const FilterIndicator = ({ stats, onClearFilters }) => {
  if (!stats.hasActiveFilters) {
    return null;
  }

  return (
    <IndicatorContainer>
      <IndicatorBadge>FILTERED</IndicatorBadge>
      <FilteredCount>
        {stats.filteredCount} / {stats.totalServices}
      </FilteredCount>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          style={{
            fontFamily: "'Press Start 2P', 'VT323', monospace",
            background: 'var(--retro-accent2)',
            color: 'var(--retro-bg1)',
            border: '2px solid var(--retro-accent1)',
            borderRadius: '0',
            padding: '0.2rem 0.5rem',
            fontSize: '0.5rem',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 var(--retro-accent1), 4px 4px 0 var(--retro-bg1)',
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translate(1px, 1px)';
            e.target.style.boxShadow = '1px 1px 0 var(--retro-accent2), 2px 2px 0 var(--retro-bg1)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translate(0, 0)';
            e.target.style.boxShadow = '2px 2px 0 var(--retro-accent1), 4px 4px 0 var(--retro-bg1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translate(0, 0)';
            e.target.style.boxShadow = '2px 2px 0 var(--retro-accent1), 4px 4px 0 var(--retro-bg1)';
          }}
        >
          CLEAR
        </button>
      )}
    </IndicatorContainer>
  );
};

export default FilterIndicator;
