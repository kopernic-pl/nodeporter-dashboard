import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import Home from '../pages/index';

describe('Home page', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
  });

  it.each([
    ['in-cluster', /Running in-cluster/i],
    ['local', /Running in local\/dev mode/i],
    ['unknown', /Environment type: unknown/i],
  ])('shows correct banner for envType=%s', async (envType, expectedText) => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType }));
    render(<Home />);
    expect(await screen.findByText(expectedText)).toBeInTheDocument();
  });

  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
  });

  it('shows "No services loaded" when empty', async () => {
    render(<Home />);
    expect(await screen.findByText(/No services loaded/i)).toBeInTheDocument();
  });

  it('shows an error message if the fetch fails', async () => {
    const errorMsg = `Test error: ${faker.lorem.words(3)}`;
    fetch.mockRejectOnce(new Error(errorMsg));
    render(<Home />);
    // Since data loads automatically, just wait for the error message
    expect(await screen.findByText(errorMsg, { exact: false })).toBeInTheDocument();
  });

  it('shows Refresh button after auto-load completes', async () => {
    render(<Home />);
    // Wait for the Refresh button to appear after auto-load
    expect(await screen.findByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('loads and displays services and nodes data successfully', async () => {
    const mockServices = [
      {
        metadata: {
          name: 'test-service',
          namespace: 'default',
          labels: { 'app.kubernetes.io/name': 'test-app' }
        },
        spec: {
          type: 'ClusterIP',
          clusterIP: '10.96.0.1',
          ports: [
            { port: 80, protocol: 'TCP', nodePort: 30080 },
            { port: 443, protocol: 'TCP' }
          ]
        }
      }
    ];

    const mockNodes = [
      {
        metadata: { name: 'node-1' },
        capacity: {
          cpu: '4',
          memory: '16384Mi'
        }
      },
      {
        metadata: { name: 'node-2' },
        capacity: {
          cpu: '2000m',
          memory: '8Gi'
        }
      }
    ];

    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify(mockServices))
      .mockResponseOnce(JSON.stringify(mockNodes));

    render(<Home />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('test-app')).toBeInTheDocument();
    });

    expect(screen.getByText('default')).toBeInTheDocument();
    expect(screen.getAllByText('ClusterIP')).toHaveLength(2); // header + data
    expect(screen.getByText('10.96.0.1')).toBeInTheDocument();
    // Verify the service data is rendered in the table
    expect(screen.getByText('test-app')).toBeInTheDocument();
  });

  it('calculates and displays node summary correctly', async () => {
    const mockNodes = [
      {
        metadata: { name: 'node-1' },
        capacity: {
          cpu: '4',
          memory: '16384Mi'
        }
      },
      {
        metadata: { name: 'node-2' },
        capacity: {
          cpu: '2000m',
          memory: '8Gi'
        }
      }
    ];

    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([])) // services
      .mockResponseOnce(JSON.stringify(mockNodes));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Cluster Summary:/)).toBeInTheDocument();
    });

    // 4 cores + 2 cores (2000m = 2 cores) = 6 cores total
    expect(screen.getByText(/2 nodes/)).toBeInTheDocument();
    expect(screen.getByText(/total CPU: 6 cores/)).toBeInTheDocument();
    // 16384 MiB + 8192 MiB (8Gi = 8192 MiB) = 24576 MiB total
    expect(screen.getByText(/total Memory: 24576 MiB/)).toBeInTheDocument();
  });

  it('handles nodes error and displays error message', async () => {
    const nodesError = new Error('Failed to fetch nodes');
    
    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([])) // services
      .mockRejectOnce(nodesError);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Nodes error:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Nodes error: Failed to fetch nodes/)).toBeInTheDocument();
  });

  it('shows loading state when refreshing data', async () => {
    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([]))
      .mockResponseOnce(JSON.stringify([]));

    render(<Home />);

    // Wait for initial load to complete
    const refreshButton = await screen.findByRole('button', { name: /refresh/i });
    
    // Mock slow response to test loading state
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve([]) }), 100)));
    fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve([]) }), 100)));

    fireEvent.click(refreshButton);

    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(refreshButton).toBeDisabled();
  });

  it('displays fetch time after data loads', async () => {
    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([]))
      .mockResponseOnce(JSON.stringify([]));

    render(<Home />);

    // Wait for fetch time to appear
    await waitFor(() => {
      expect(screen.getByText(/Fetch time:/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles envType fetch error gracefully', async () => {
    fetch.resetMocks();
    fetch
      .mockRejectOnce(new Error('Network error'))
      .mockResponseOnce(JSON.stringify([]))
      .mockResponseOnce(JSON.stringify([]));

    render(<Home />);

    // Should show unknown environment when envType fetch fails
    await waitFor(() => {
      expect(screen.getByText(/Environment type: unknown/i)).toBeInTheDocument();
    });
  });

  it('renders services with different CPU and memory formats', async () => {
    const mockNodes = [
      {
        metadata: { name: 'node-1' },
        capacity: {
          cpu: '1000m',
          memory: '16384Ki'
        }
      },
      {
        metadata: { name: 'node-2' },
        capacity: {
          cpu: '2',
          memory: '16777216' // bytes
        }
      }
    ];

    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([])) // services
      .mockResponseOnce(JSON.stringify(mockNodes));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Cluster Summary:/)).toBeInTheDocument();
    });

    // 1000m = 1 core, 2 cores = 2 cores, total = 3 cores
    expect(screen.getByText(/total CPU: 3 cores/)).toBeInTheDocument();
    // 16384Ki = 16 MiB, 16777216 bytes = 16 MiB, total = 32 MiB
    expect(screen.getByText(/total Memory: 32 MiB/)).toBeInTheDocument();
  });

  it('handles empty node capacity gracefully', async () => {
    const mockNodes = [
      {
        metadata: { name: 'node-1' },
        capacity: {}
      },
      {
        metadata: { name: 'node-2' },
        capacity: null
      }
    ];

    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify([])) // services
      .mockResponseOnce(JSON.stringify(mockNodes));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Cluster Summary:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/2 nodes/)).toBeInTheDocument();
    expect(screen.getByText(/total CPU: 0 cores/)).toBeInTheDocument();
    expect(screen.getByText(/total Memory: 0 MiB/)).toBeInTheDocument();
  });

  it('displays service name fallback when no app label exists', async () => {
    const mockServices = [
      {
        metadata: {
          name: 'plain-service',
          namespace: 'default'
        },
        spec: {
          type: 'ClusterIP',
          clusterIP: '10.96.0.1',
          ports: [{ port: 80, protocol: 'TCP' }]
        }
      }
    ];

    fetch.resetMocks();
    fetch
      .mockResponseOnce(JSON.stringify({ envType: 'local' }))
      .mockResponseOnce(JSON.stringify(mockServices))
      .mockResponseOnce(JSON.stringify([])); // nodes

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('plain-service')).toBeInTheDocument();
    });
  });
});
