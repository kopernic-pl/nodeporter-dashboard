import React from 'react';
import styled from 'styled-components';

const FilterButton = styled.button`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-accent2);
  color: var(--retro-bg1);
  border: 4px solid var(--retro-accent1);
  border-radius: 0;
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  cursor: pointer;
  box-shadow:
    2px 2px 0 var(--retro-accent1),
    4px 4px 0 var(--retro-bg1);
  transition:
    background 0.1s,
    color 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:active {
    background: var(--retro-accent1);
    color: var(--retro-accent2);
    box-shadow:
      1px 1px 0 var(--retro-accent2),
      2px 2px 0 var(--retro-bg1);
    transform: translate(1px, 1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-accent1);
    color: var(--retro-surface);
    border: 4px solid var(--retro-accent2);
    box-shadow:
      2px 2px 0 var(--retro-accent2),
      4px 4px 0 var(--retro-border);

    &:active {
      background: var(--retro-accent2);
      color: var(--retro-touch);
      box-shadow:
        1px 1px 0 var(--retro-accent1),
        2px 2px 0 var(--retro-border);
      transform: translate(1px, 1px);
    }
  }
`;

const FilterIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    style={{ display: 'inline-block' }}
  >
    <path d="M1 2h10v1H1V2zm0 3h3v1H1V5zm0 3h7v1H1V8zm0 3h5v1H1v-1z" />
  </svg>
);

const FilterToggleButton = ({ showFilters, onClick, disabled, ...props }) => (
  <FilterButton onClick={onClick} disabled={disabled} {...props}>
    <FilterIcon />
    {showFilters ? 'Hide Filters' : 'Show Filters'}
  </FilterButton>
);

export default FilterToggleButton;
