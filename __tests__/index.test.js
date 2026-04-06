import React from 'react';
import { render, screen } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import Home from '../pages/index';

// Mock the useServiceFilters hook
jest.mock('../hooks/useServiceFilters', () => ({
  useServiceFilters: () => ({
    filters: {
      ClusterIP: false,
      NodePort: true,
      LoadBalancer: true,
      ExternalName: true,
    },
    isLoading: false,
    error: null,
    updateFilter: jest.fn(),
    resetFilters: jest.fn(),
    filterServices: (services) => services.filter(svc => 
      svc.spec?.type !== 'ClusterIP' // Mock default behavior
    ),
    getVisibleTypesCount: () => 3,
    hasActiveFilters: () => false,
  }),
}));

// Mock ServiceFilter component
jest.mock('../components/ServiceFilter', () => {
  return function MockServiceFilter() {
    return <div data-testid="service-filter">Service Filter</div>;
  };
});

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

  it('renders ServiceFilter component', async () => {
    render(<Home />);
    expect(await screen.findByTestId('service-filter')).toBeInTheDocument();
  });

  it('filters ClusterIP services by default', async () => {
    const mockServices = [
      { 
        metadata: { name: 'clusterip-svc' }, 
        spec: { 
          type: 'ClusterIP',
          ports: [{ port: 80, protocol: 'TCP' }]
        } 
      },
      { 
        metadata: { name: 'nodeport-svc' }, 
        spec: { 
          type: 'NodePort',
          ports: [{ port: 80, protocol: 'TCP', nodePort: 30080 }]
        } 
      },
    ];
    
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ envType: 'local' }));
    fetch.mockResponseOnce(JSON.stringify(mockServices));
    fetch.mockResponseOnce(JSON.stringify([]));

    render(<Home />);
    
    // Wait for services to load and filter
    await screen.findByText('nodeport-svc');
    
    // ClusterIP service should be filtered out (not visible)
    expect(screen.queryByText('clusterip-svc')).not.toBeInTheDocument();
  });
});
