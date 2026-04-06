import { useState, useEffect, useCallback } from 'react';
import { loadFilters, saveFilters, getDefaultFilters } from '../utils/filterStorage';

/**
 * Custom hook for managing service filter state and persistence
 * @returns {Object} Filter state and utilities
 */
export function useServiceFilters() {
  const [filters, setFilters] = useState(getDefaultFilters());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load filters from IndexedDB on component mount
  useEffect(() => {
    let isMounted = true;

    const loadStoredFilters = async () => {
      try {
        const storedFilters = await loadFilters();
        if (isMounted) {
          setFilters(storedFilters);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load service filters:', err);
          setError(err);
          // Fall back to defaults
          setFilters(getDefaultFilters());
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStoredFilters();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update filter setting
  const updateFilter = useCallback((serviceType, isVisible) => {
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [serviceType]: isVisible,
      };
      
      // Save to IndexedDB asynchronously
      saveFilters(newFilters).catch(err => {
        console.error('Failed to save service filters:', err);
      });
      
      return newFilters;
    });
  }, []);

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    const defaultFilters = getDefaultFilters();
    setFilters(defaultFilters);
    saveFilters(defaultFilters).catch(err => {
      console.error('Failed to reset service filters:', err);
    });
  }, []);

  // Filter services based on current filter settings
  const filterServices = useCallback((services) => {
    if (!Array.isArray(services)) return [];
    
    return services.filter(service => {
      const serviceType = service.spec?.type;
      if (!serviceType) return true; // Show services with unknown type
      
      return filters[serviceType] !== false; // Show if not explicitly hidden
    });
  }, [filters]);

  // Get visible service types count
  const getVisibleTypesCount = useCallback(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  // Check if any filters are active (different from defaults)
  const hasActiveFilters = useCallback(() => {
    const defaults = getDefaultFilters();
    return Object.keys(filters).some(key => filters[key] !== defaults[key]);
  }, [filters]);

  return {
    filters,
    isLoading,
    error,
    updateFilter,
    resetFilters,
    filterServices,
    getVisibleTypesCount,
    hasActiveFilters,
  };
}
