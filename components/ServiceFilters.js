fimport React from 'react';
import styled from 'styled-components';

/**
 * Filter UI component for namespace and service type filtering
 * Filters are applied automatically when checkboxes are clicked
 */
const FilterContainer = styled.div`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-surface);
  color: var(--retro-text);
  border: 4px solid var(--retro-accent1);
  border-radius: 0;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow:
    4px 4px 0 var(--retro-accent1),
    8px 8px 0 var(--retro-bg1);

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-surface);
    color: var(--retro-text);
    border: 6px double var(--retro-border);
    box-shadow: 0 0 24px var(--retro-accent1);
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0;
    color: var(--retro-accent2);
    font-size: 1rem;

    /* Light mode */
    @media (prefers-color-scheme: light) {
      color: var(--retro-accent1);
    }
  }
`;

const FilterStats = styled.span`
  font-size: 0.7rem;
  color: var(--retro-accent2);
  margin-right: 1rem;

  /* Light mode */
  @media (prefers-color-scheme: light) {
    color: var(--retro-accent1);
  }
`;

const ClearButton = styled.button`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-accent2);
  color: var(--retro-bg1);
  border: 2px solid var(--retro-accent1);
  border-radius: 0;
  padding: 0.3rem 0.8rem;
  font-size: 0.6rem;
  cursor: pointer;
  box-shadow:
    2px 2px 0 var(--retro-accent1),
    4px 4px 0 var(--retro-bg1);
  transition:
    background 0.1s,
    color 0.1s;

  &:active {
    background: var(--retro-accent1);
    color: var(--retro-accent2);
    box-shadow:
      1px 1px 0 var(--retro-accent2),
      2px 2px 0 var(--retro-bg1);
    transform: translate(1px, 1px);
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-accent1);
    color: var(--retro-surface);
    border: 2px solid var(--retro-accent2);
    box-shadow:
      2px 2px 0 var(--retro-accent2),
      4px 4px 0 var(--retro-border);

    &:active {
      background: var(--retro-accent2);
      color: var(--retro-touch);
      box-shadow:
        1px 1px 0 var(--retro-accent1),
        2px 2px 0 var(--retro-border);
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.8rem;
    font-weight: bold;
    color: var(--retro-accent2);
    font-size: 0.8rem;

    /* Light mode */
    @media (prefers-color-scheme: light) {
      color: var(--retro-accent1);
    }
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.7rem;
  color: var(--retro-text);
  background: var(--retro-bg1);
  border: 2px solid var(--retro-accent2);
  padding: 0.4rem 0.8rem;
  box-shadow:
    2px 2px 0 var(--retro-accent1),
    4px 4px 0 var(--retro-bg1);
  transition:
    background 0.1s,
    border-color 0.1s;

  &:hover {
    border-color: var(--retro-accent1);
  }

  input[type='checkbox'] {
    margin-right: 0.5rem;
    cursor: pointer;
  }

  /* Light mode */
  @media (prefers-color-scheme: light) {
    background: var(--retro-surface);
    border: 2px solid var(--retro-border);
    box-shadow:
      2px 2px 0 var(--retro-bg2),
      4px 4px 0 var(--retro-bg1);

    &:hover {
      border-color: var(--retro-accent1);
    }
  }
`;

const ServiceFilters = ({
  availableNamespaces,
  availableTypes,
  filters,
  setFilter,
  clearFilters,
  getFilterStats,
}) => {
  const stats = getFilterStats();

  const handleNamespaceChange = (namespace) => {
    const currentNamespaces = filters.namespaces || [];
    const newNamespaces = currentNamespaces.includes(namespace)
      ? currentNamespaces.filter((n) => n !== namespace)
      : [...currentNamespaces, namespace];
    setFilter('namespaces', newNamespaces);
  };

  const handleTypeChange = (type) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    setFilter('types', newTypes);
  };

  if (availableNamespaces.length === 0 && availableTypes.length === 0) {
    return null;
  }

  return (
    <FilterContainer>
      <FilterHeader>
        <h3>FILTERS</h3>
        <div>
          {stats.hasActiveFilters && (
            <FilterStats>
              {stats.filteredCount} / {stats.totalServices} SERVICES
            </FilterStats>
          )}
          {stats.hasActiveFilters && <ClearButton onClick={clearFilters}>CLEAR ALL</ClearButton>}
        </div>
      </FilterHeader>

      {/* Namespace Filters */}
      {availableNamespaces.length > 0 && (
        <FilterSection>
          <label>NAMESPACES:</label>
          <CheckboxGroup>
            {availableNamespaces.map((namespace) => (
              <CheckboxLabel key={namespace}>
                <input
                  type="checkbox"
                  checked={filters.namespaces?.includes(namespace) || false}
                  onChange={() => handleNamespaceChange(namespace)}
                />
                {namespace}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterSection>
      )}

      {/* Service Type Filters */}
      {availableTypes.length > 0 && (
        <FilterSection>
          <label>SERVICE TYPES:</label>
          <CheckboxGroup>
            {availableTypes.map((type) => (
              <CheckboxLabel key={type}>
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type) || false}
                  onChange={() => handleTypeChange(type)}
                />
                {type}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FilterSection>
      )}
    </FilterContainer>
  );
};

export default ServiceFilters;
