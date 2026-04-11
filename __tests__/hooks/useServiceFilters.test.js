import { renderHook, act } from '@testing-library/react';
import { useServiceFilters } from '../../hooks/useServiceFilters';

describe('useServiceFilters', () => {
  const mockServices = [
    {
      metadata: {
        name: 'web-service',
        namespace: 'default',
        labels: { 'app.kubernetes.io/name': 'web-app' },
      },
      spec: {
        type: 'ClusterIP',
        clusterIP: '10.0.0.1',
        ports: [{ port: 80, protocol: 'TCP' }],
      },
    },
    {
      metadata: {
        name: 'api-service',
        namespace: 'default',
        labels: { 'app.kubernetes.io/name': 'api-app' },
      },
      spec: {
        type: 'NodePort',
        clusterIP: '10.0.0.2',
        ports: [{ port: 8080, protocol: 'TCP', nodePort: 30080 }],
      },
    },
    {
      metadata: {
        name: 'db-service',
        namespace: 'kube-system',
        labels: {},
      },
      spec: {
        type: 'ClusterIP',
        clusterIP: '10.0.0.3',
        ports: [{ port: 5432, protocol: 'TCP' }],
      },
    },
    {
      metadata: {
        name: 'external-service',
        namespace: 'production',
        labels: { 'app.kubernetes.io/name': 'external-app' },
      },
      spec: {
        type: 'LoadBalancer',
        clusterIP: '10.0.0.4',
        ports: [{ port: 443, protocol: 'TCP' }],
      },
    },
  ];

  beforeEach(() => {
    // Reset any state between tests
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return all services when no filters are applied', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      expect(result.current.filteredServices).toHaveLength(4);
      expect(result.current.filteredServices).toEqual(mockServices);
    });

    it('should return empty array when services is empty', () => {
      const { result } = renderHook(() => useServiceFilters([]));

      expect(result.current.filteredServices).toHaveLength(0);
      expect(result.current.availableNamespaces).toEqual([]);
      expect(result.current.availableTypes).toEqual([]);
    });

    it('should handle null/undefined services gracefully', () => {
      const { result: result1 } = renderHook(() => useServiceFilters(null));
      const { result: result2 } = renderHook(() => useServiceFilters(undefined));

      expect(result1.current.filteredServices).toHaveLength(0);
      expect(result2.current.filteredServices).toHaveLength(0);
    });

    it('should extract available namespaces and types', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      expect(result.current.availableNamespaces).toEqual(['default', 'kube-system', 'production']);
      expect(result.current.availableTypes).toEqual(['ClusterIP', 'LoadBalancer', 'NodePort']);
    });
  });

  describe('namespace filtering', () => {
    it('should filter by single namespace', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('namespaces', ['default']);
      });

      expect(result.current.filteredServices).toHaveLength(2);
      expect(result.current.filteredServices.map((s) => s.metadata.name)).toEqual([
        'web-service',
        'api-service',
      ]);
    });

    it('should filter by multiple namespaces', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('namespaces', ['default', 'kube-system']);
      });

      expect(result.current.filteredServices).toHaveLength(3);
      expect(result.current.filteredServices.map((s) => s.metadata.name)).toEqual([
        'web-service',
        'api-service',
        'db-service',
      ]);
    });

    it('should return empty result for non-existent namespace', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('namespaces', ['non-existent']);
      });

      expect(result.current.filteredServices).toHaveLength(0);
    });

    it('should clear namespace filter', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('namespaces', ['default']);
      });
      expect(result.current.filteredServices).toHaveLength(2);

      act(() => {
        result.current.clearFilter('namespaces');
      });
      expect(result.current.filteredServices).toHaveLength(4);
    });
  });

  describe('service type filtering', () => {
    it('should filter by single service type', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('types', ['ClusterIP']);
      });

      expect(result.current.filteredServices).toHaveLength(2);
      expect(result.current.filteredServices.map((s) => s.metadata.name)).toEqual([
        'web-service',
        'db-service',
      ]);
    });

    it('should filter by multiple service types', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('types', ['ClusterIP', 'NodePort']);
      });

      expect(result.current.filteredServices).toHaveLength(3);
      expect(result.current.filteredServices.map((s) => s.metadata.name)).toEqual([
        'web-service',
        'api-service',
        'db-service',
      ]);
    });

    it('should return empty result for non-existent service type', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('types', ['ExternalName']);
      });

      expect(result.current.filteredServices).toHaveLength(0);
    });
  });

  describe('text search filtering', () => {
    it('should filter by service name (case-insensitive)', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', 'WEB');
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0].metadata.name).toBe('web-service');
    });

    it('should filter by app label (case-insensitive)', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', 'API');
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0].metadata.name).toBe('api-service');
    });

    it('should find services by partial name match', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', 'service');
      });

      expect(result.current.filteredServices).toHaveLength(4); // All contain 'service'
    });

    it('should handle empty search text', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', '');
      });

      expect(result.current.filteredServices).toHaveLength(4);
    });

    it('should handle whitespace-only search text', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', '   ');
      });

      expect(result.current.filteredServices).toHaveLength(4);
    });

    it('should return empty result for non-matching search', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', 'nonexistent');
      });

      expect(result.current.filteredServices).toHaveLength(0);
    });
  });

  describe('combined filtering', () => {
    it('should combine namespace and type filters with AND logic', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.updateFilters({
          namespaces: ['default'],
          types: ['ClusterIP'],
        });
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0].metadata.name).toBe('web-service');
    });

    it('should combine all three filter types', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.updateFilters({
          namespaces: ['default'],
          types: ['NodePort'],
          searchText: 'api',
        });
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0].metadata.name).toBe('api-service');
    });

    it('should return empty when filters have no overlap', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.updateFilters({
          namespaces: ['kube-system'],
          types: ['NodePort'],
        });
      });

      expect(result.current.filteredServices).toHaveLength(0);
    });
  });

  describe('filter management', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.updateFilters({
          namespaces: ['default'],
          types: ['ClusterIP'],
          searchText: 'web',
        });
      });
      expect(result.current.filteredServices).toHaveLength(1);

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filteredServices).toHaveLength(4);
      expect(result.current.filters).toEqual({
        namespaces: [],
        types: [],
        searchText: '',
      });
    });

    it('should update individual filters', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('namespaces', ['default']);
      });
      expect(result.current.filters.namespaces).toEqual(['default']);

      act(() => {
        result.current.setFilter('types', ['NodePort']);
      });
      expect(result.current.filters.types).toEqual(['NodePort']);

      act(() => {
        result.current.setFilter('searchText', 'test');
      });
      expect(result.current.filters.searchText).toBe('test');
    });
  });

  describe('filter statistics', () => {
    it('should return correct statistics when no filters are applied', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      const stats = result.current.getFilterStats();

      expect(stats).toEqual({
        totalServices: 4,
        filteredCount: 4,
        activeFiltersCount: 0,
        hasActiveFilters: false,
        isFiltered: false,
      });
    });

    it('should return correct statistics when filters are applied', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.updateFilters({
          namespaces: ['default'],
          types: ['ClusterIP'],
          searchText: '',
        });
      });

      const stats = result.current.getFilterStats();

      expect(stats).toEqual({
        totalServices: 4,
        filteredCount: 1,
        activeFiltersCount: 2,
        hasActiveFilters: true,
        isFiltered: true,
      });
    });

    it('should count search text as active filter only when non-empty', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      act(() => {
        result.current.setFilter('searchText', '');
      });
      let stats = result.current.getFilterStats();
      expect(stats.activeFiltersCount).toBe(0);

      act(() => {
        result.current.setFilter('searchText', 'test');
      });
      stats = result.current.getFilterStats();
      expect(stats.activeFiltersCount).toBe(1);
    });
  });

  describe('service matching utility', () => {
    it('should correctly identify if service matches current filters', () => {
      const { result } = renderHook(() => useServiceFilters(mockServices));

      const webService = mockServices[0];
      const dbService = mockServices[2];

      // No filters - all services match
      expect(result.current.serviceMatchesFilters(webService)).toBe(true);
      expect(result.current.serviceMatchesFilters(dbService)).toBe(true);

      act(() => {
        result.current.setFilter('namespaces', ['default']);
      });

      expect(result.current.serviceMatchesFilters(webService)).toBe(true);
      expect(result.current.serviceMatchesFilters(dbService)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle services with missing metadata', () => {
      const servicesWithMissingData = [
        { spec: { type: 'ClusterIP' } }, // Missing metadata
        { metadata: { name: 'test' }, spec: {} }, // Missing type
        mockServices[0], // Valid service
      ];

      const { result } = renderHook(() => useServiceFilters(servicesWithMissingData));

      act(() => {
        result.current.setFilter('namespaces', ['default']);
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0]).toBe(mockServices[0]);
    });

    it('should handle services with missing spec', () => {
      const servicesWithMissingSpec = [
        { metadata: { name: 'test', namespace: 'default' } }, // Missing spec
        mockServices[0], // Valid service
      ];

      const { result } = renderHook(() => useServiceFilters(servicesWithMissingSpec));

      act(() => {
        result.current.setFilter('types', ['ClusterIP']);
      });

      expect(result.current.filteredServices).toHaveLength(1);
      expect(result.current.filteredServices[0]).toBe(mockServices[0]);
    });
  });
});
