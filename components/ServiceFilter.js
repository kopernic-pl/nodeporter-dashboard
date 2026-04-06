import React from 'react';
import styled from 'styled-components';
import { useServiceFilters } from '../hooks/useServiceFilters';

// Base filter container with retro styling
const FilterContainer = styled.div`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-surface);
  border: 4px solid var(--retro-border);
  box-shadow: 0 0 16px var(--retro-shadow1);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 0;
  width: 100%;
  max-width: 700px;

  /* Light mode */
  @media (prefers-color-scheme: light) {
    box-shadow: 0 0 16px var(--retro-accent1);
  }
`;

// Filter title
const FilterTitle = styled.div`
  font-size: 1rem;
  color: var(--retro-accent2);
  margin-bottom: 1rem;
  text-shadow: 1px 1px var(--retro-bg1);
  text-align: center;

  /* Light mode */
  @media (prefers-color-scheme: light) {
    text-shadow: 1px 1px var(--retro-surface);
  }
`;

// Checkbox container
const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

// Individual checkbox container
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// Custom styled checkbox
const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 3px solid var(--retro-accent1);
  background: var(--retro-bg1);
  cursor: pointer;
  position: relative;
  transition: all 0.1s ease;

  &:checked {
    background: var(--retro-accent2);
    border-color: var(--retro-accent2);
    box-shadow: inset 0 0 0 3px var(--retro-bg1);
  }

  &:hover {
    border-color: var(--retro-accent2);
    box-shadow: 0 0 8px var(--retro-accent2);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    &:checked {
      box-shadow: inset 0 0 0 3px var(--retro-surface);
    }
  }
`;

// Reset button
const ResetButton = styled.button.attrs({ type: 'button' })`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-bg1);
  color: var(--retro-accent1);
  border: 2px solid var(--retro-accent1);
  padding: 0.4rem 0.8rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.1s ease;
  margin-top: 1rem;

  &:hover {
    background: var(--retro-accent1);
    color: var(--retro-bg1);
    box-shadow: 2px 2px 0 var(--retro-accent2);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 1px 1px 0 var(--retro-accent2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-surface);
    color: var(--retro-accent1);

    &:hover {
      background: var(--retro-accent1);
      color: var(--retro-text);
    }
  }
`;

// Loading indicator
const LoadingText = styled.div`
  text-align: center;
  color: var(--retro-accent2);
  font-size: 0.9rem;
  padding: 1rem;

  /* Light mode */
  @media (prefers-color-scheme: light) {
    color: var(--retro-accent2);
  }
`;

// Service type configuration
const SERVICE_TYPES = [
  { key: 'ClusterIP', label: 'ClusterIP' },
  { key: 'NodePort', label: 'NodePort' },
  { key: 'LoadBalancer', label: 'LoadBalancer' },
  { key: 'ExternalName', label: 'ExternalName' },
];

/**
 * ServiceFilter component for filtering Kubernetes services by type
 */
export default function ServiceFilter() {
  const { filters, isLoading, error, updateFilter, resetFilters, hasActiveFilters } = useServiceFilters();

  if (isLoading) {
    return (
      <FilterContainer>
        <LoadingText>Loading filters...</LoadingText>
      </FilterContainer>
    );
  }

  if (error) {
    return (
      <FilterContainer>
        <LoadingText>Filter unavailable</LoadingText>
      </FilterContainer>
    );
  }

  const handleFilterChange = (serviceType, isChecked) => {
    updateFilter(serviceType, isChecked);
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <FilterContainer data-testid="service-filter">
      <FilterTitle>Filter Services</FilterTitle>
      <CheckboxGroup>
        {SERVICE_TYPES.map(({ key, label }) => (
          <CheckboxContainer key={key}>
            <StyledCheckbox
              id={`filter-${key}`}
              checked={filters[key] !== false}
              onChange={(e) => handleFilterChange(key, e.target.checked)}
              aria-checked={filters[key] !== false}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFilterChange(key, !filters[key]);
                }
              }}
            />
            <label 
              htmlFor={`filter-${key}`}
              style={{
                fontSize: '0.9rem',
                color: 'var(--retro-text)',
                cursor: 'pointer',
                userSelect: 'none',
                textShadow: '1px 1px var(--retro-bg1)',
              }}
            >
              {label}
            </label>
          </CheckboxContainer>
        ))}
      </CheckboxGroup>
      {hasActiveFilters() && (
        <div style={{ textAlign: 'center' }}>
          <ResetButton onClick={handleReset}>
            Reset Filters
          </ResetButton>
        </div>
      )}
    </FilterContainer>
  );
}
