import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useServices } from '../../hooks/useServices';

describe('useServices', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useServices());

    expect(result.current.services).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should fetch services successfully', async () => {
    const mockServices = [
      {
        metadata: { name: 'test-service', namespace: 'default' },
        spec: { type: 'ClusterIP', clusterIP: '10.0.0.1' },
      },
    ];

    fetch.mockResponseOnce(JSON.stringify(mockServices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    // Call refetch within act
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.services).toEqual(mockServices);
    expect(result.current.error).toBe(null);
    expect(fetch).toHaveBeenCalledWith('/api/services');
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch services';
    fetch.mockResponseOnce('', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    // Call refetch within act
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle network error', async () => {
    const errorMessage = 'Network error';
    fetch.mockRejectOnce(new Error(errorMessage));

    const { result } = renderHook(() => useServices());

    // Call refetch within act
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle JSON parsing error', async () => {
    fetch.mockResponseOnce('invalid json', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    // Call refetch within act
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.services).toEqual([]);
    expect(result.current.error).toContain('invalid json response body');
  });

  it('should reset error state on successful fetch after previous error', async () => {
    const mockServices = [
      {
        metadata: { name: 'test-service', namespace: 'default' },
        spec: { type: 'ClusterIP', clusterIP: '10.0.0.1' },
      },
    ];

    // First call fails
    fetch.mockResponseOnce('', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    // First refetch - should fail
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBe('Failed to fetch services');

    // Second call succeeds
    fetch.mockResponseOnce(JSON.stringify(mockServices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Second refetch - should succeed
    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.services).toEqual(mockServices);
    expect(result.current.error).toBe(null);
  });

  it('should handle empty services array', async () => {
    fetch.mockResponseOnce(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should not auto-fetch on initial render', () => {
    fetch.mockResponseOnce(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const { result } = renderHook(() => useServices());

    // Should not have called fetch on initial render
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(null);
  });
});
