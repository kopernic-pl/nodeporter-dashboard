import { useState, useMemo, useCallback } from 'react';

/**
 * Generic filtering hook for Kubernetes services
 * Supports namespace, service type, and text search filtering
 */
export const useServiceFilters = (services = []) => {
  const [filters, setFilters] = useState({
    namespaces: [],
    types: [],
    searchText: '',
  });

  /**
   * Apply filters to services array
   * All filters are combined with AND logic
   */
  const filteredServices = useMemo(() => {
    if (!Array.isArray(services)) return [];

    return services.filter((service) => {
      // Namespace filter
      if (filters.namespaces.length > 0) {
        const serviceNamespace = service.metadata?.namespace;
        if (!serviceNamespace || !filters.namespaces.includes(serviceNamespace)) {
          return false;
        }
      }

      // Service type filter
      if (filters.types.length > 0) {
        const serviceType = service.spec?.type;
        if (!serviceType || !filters.types.includes(serviceType)) {
          return false;
        }
      }

      // Text search filter (case-insensitive)
      if (filters.searchText && filters.searchText.trim()) {
        const searchTerm = filters.searchText.toLowerCase().trim();
        const serviceName = service.metadata?.name?.toLowerCase() || '';
        const appLabel = service.metadata?.labels?.['app.kubernetes.io/name']?.toLowerCase() || '';

        if (!serviceName.includes(searchTerm) && !appLabel.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [services, filters]);

  /**
   * Get available namespaces from services
   */
  const availableNamespaces = useMemo(() => {
    if (!Array.isArray(services)) return [];
    const namespaces = new Set();
    services.forEach((service) => {
      if (service.metadata?.namespace) {
        namespaces.add(service.metadata.namespace);
      }
    });
    return Array.from(namespaces).sort();
  }, [services]);

  /**
   * Get available service types from services
   */
  const availableTypes = useMemo(() => {
    if (!Array.isArray(services)) return [];
    const types = new Set();
    services.forEach((service) => {
      if (service.spec?.type) {
        types.add(service.spec.type);
      }
    });
    return Array.from(types).sort();
  }, [services]);

  /**
   * Update a specific filter
   */
  const setFilter = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  /**
   * Set multiple filters at once
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      namespaces: [],
      types: [],
      searchText: '',
    });
  }, []);

  /**
   * Clear a specific filter
   */
  const clearFilter = useCallback((filterType) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: filterType === 'searchText' ? '' : [],
    }));
  }, []);

  /**
   * Get filter statistics
   */
  const getFilterStats = useCallback(() => {
    const totalServices = Array.isArray(services) ? services.length : 0;
    const filteredCount = filteredServices.length;
    const activeFiltersCount = [
      filters.namespaces.length > 0,
      filters.types.length > 0,
      filters.searchText && filters.searchText.trim().length > 0,
    ].filter(Boolean).length;

    return {
      totalServices,
      filteredCount,
      activeFiltersCount,
      hasActiveFilters: activeFiltersCount > 0,
      isFiltered: filteredCount < totalServices,
    };
  }, [services, filteredServices.length, filters]);

  /**
   * Check if a service matches current filters
   */
  const serviceMatchesFilters = useCallback(
    (service) => {
      return filteredServices.includes(service);
    },
    [filteredServices]
  );

  return {
    // Data
    filteredServices,
    availableNamespaces,
    availableTypes,

    // Filter state
    filters,

    // Filter actions
    setFilter,
    updateFilters,
    clearFilters,
    clearFilter,

    // Utilities
    getFilterStats,
    serviceMatchesFilters,
  };
};
