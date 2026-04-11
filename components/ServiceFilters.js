import React from 'react';

/**
 * Basic filter UI component to demonstrate the filtering API
 * This is a simple implementation - can be enhanced with better styling
 */
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

  const handleSearchChange = (e) => {
    setFilter('searchText', e.target.value);
  };

  if (availableNamespaces.length === 0 && availableTypes.length === 0) {
    return null;
  }

  return (
    <div
      className="service-filters"
      style={{
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h3 style={{ margin: 0 }}>Filters</h3>
        <div>
          {stats.hasActiveFilters && (
            <span style={{ marginRight: '10px', fontSize: '14px' }}>
              Showing {stats.filteredCount} of {stats.totalServices} services
            </span>
          )}
          {stats.hasActiveFilters && (
            <button onClick={clearFilters} style={{ padding: '5px 10px', fontSize: '12px' }}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Text Search */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Search Service Names:
        </label>
        <input
          type="text"
          value={filters.searchText || ''}
          onChange={handleSearchChange}
          placeholder="Search by service name..."
          style={{ width: '300px', padding: '5px' }}
        />
      </div>

      {/* Namespace Filters */}
      {availableNamespaces.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Namespaces:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableNamespaces.map((namespace) => (
              <label
                key={namespace}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={filters.namespaces?.includes(namespace) || false}
                  onChange={() => handleNamespaceChange(namespace)}
                  style={{ marginRight: '5px' }}
                />
                {namespace}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Service Type Filters */}
      {availableTypes.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Service Types:
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {availableTypes.map((type) => (
              <label
                key={type}
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type) || false}
                  onChange={() => handleTypeChange(type)}
                  style={{ marginRight: '5px' }}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceFilters;
