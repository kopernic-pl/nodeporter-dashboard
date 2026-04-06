/**
 * Tests for useServiceFilters hook
 */

import { renderHook, act } from '@testing-library/react';
import { useServiceFilters } from '../../hooks/useServiceFilters';
import * as filterStorage from '../../utils/filterStorage';

// Mock the filterStorage module
jest.mock('../../utils/filterStorage');

describe('useServiceFilters', () => {
  const mockLoadFilters = filterStorage.loadFilters;
  const mockSaveFilters = filterStorage.saveFilters;
  const mockGetDefaultFilters = filterStorage.getDefaultFilters;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock behavior
    mockGetDefaultFilters.mockReturnValue({
      ClusterIP: false,
      NodePort: true,
      LoadBalancer: true,
      ExternalName: true,
    });

    mockLoadFilters.mockResolvedValue({
      ClusterIP: false,
      NodePort: true,
      LoadBalancer: true,
      ExternalName: true,
    });

    mockSaveFilters.mockResolvedValue();
  });

  describe('initialization', () => {
    it('loads filters on mount', async () => {
      const { result } = renderHook(() => useServiceFilters());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBe(null);

      // Wait for async operations
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockLoadFilters).toHaveBeenCalledTimes(1);
    });

    it('handles load errors gracefully', async () => {
      const testError = new Error('Load failed');
      mockLoadFilters.mockRejectedValue(testError);

      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(testError);
      expect(result.current.filters).toEqual(mockGetDefaultFilters());
    });

    it('uses defaults when load fails', async () => {
      mockLoadFilters.mockRejectedValue(new Error('Load failed'));

      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.filters).toEqual(mockGetDefaultFilters());
    });
  });

  describe('updateFilter', () => {
    it('updates filter setting', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.updateFilter('ClusterIP', true);
      });

      expect(result.current.filters.ClusterIP).toBe(true);
      expect(mockSaveFilters).toHaveBeenCalledWith(
        expect.objectContaining({ ClusterIP: true })
      );
    });

    it('saves updated filters to storage', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.updateFilter('NodePort', false);
      });

      expect(mockSaveFilters).toHaveBeenCalledWith(
        expect.objectContaining({ NodePort: false })
      );
    });

    it('handles save errors gracefully', async () => {
      mockSaveFilters.mockRejectedValue(new Error('Save failed'));

      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Should not throw
      expect(() => {
        act(() => {
          result.current.updateFilter('ClusterIP', true);
        });
      }).not.toThrow();
    });
  });

  describe('resetFilters', () => {
    it('resets to default filters', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Change some filters first
      act(() => {
        result.current.updateFilter('ClusterIP', true);
        result.current.updateFilter('NodePort', false);
      });

      // Reset filters
      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters).toEqual(mockGetDefaultFilters());
      expect(mockSaveFilters).toHaveBeenCalledWith(mockGetDefaultFilters());
    });
  });

  describe('filterServices', () => {
    const mockServices = [
      { spec: { type: 'ClusterIP' }, metadata: { name: 'svc1' } },
      { spec: { type: 'NodePort' }, metadata: { name: 'svc2' } },
      { spec: { type: 'LoadBalancer' }, metadata: { name: 'svc3' } },
      { spec: { type: 'ExternalName' }, metadata: { name: 'svc4' } },
      { metadata: { name: 'svc5' } }, // No type
    ];

    it('filters services based on current settings', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // With default settings (ClusterIP hidden)
      const filtered = result.current.filterServices(mockServices);
      
      expect(filtered).toHaveLength(4);
      expect(filtered.map(s => s.metadata.name)).toEqual([
        'svc2', 'svc3', 'svc4', 'svc5'
      ]);
    });

    it('shows all services when all filters are enabled', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Enable ClusterIP
      act(() => {
        result.current.updateFilter('ClusterIP', true);
      });

      const filtered = result.current.filterServices(mockServices);
      
      expect(filtered).toHaveLength(5);
    });

    it('handles empty service array', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const filtered = result.current.filterServices([]);
      
      expect(filtered).toHaveLength(0);
    });

    it('handles null/undefined services array', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.filterServices(null)).toEqual([]);
      expect(result.current.filterServices(undefined)).toEqual([]);
    });

    it('shows services with unknown type', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      const filtered = result.current.filterServices([
        { metadata: { name: 'no-type' } },
        { spec: { type: 'UnknownType' }, metadata: { name: 'unknown' } },
      ]);
      
      expect(filtered).toHaveLength(2);
    });
  });

  describe('getVisibleTypesCount', () => {
    it('returns count of visible service types', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Default: 3 visible (NodePort, LoadBalancer, ExternalName)
      expect(result.current.getVisibleTypesCount()).toBe(3);

      act(() => {
        result.current.updateFilter('ClusterIP', true);
      });

      expect(result.current.getVisibleTypesCount()).toBe(4);
    });
  });

  describe('hasActiveFilters', () => {
    it('returns false when filters match defaults', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.hasActiveFilters()).toBe(false);
    });

    it('returns true when filters differ from defaults', async () => {
      const { result } = renderHook(() => useServiceFilters());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      act(() => {
        result.current.updateFilter('ClusterIP', true);
      });

      expect(result.current.hasActiveFilters()).toBe(true);
    });
  });
});
