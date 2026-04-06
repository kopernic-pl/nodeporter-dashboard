import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    const errorMsg = faker.lorem.sentence();
    fetch.mockRejectOnce(new Error(errorMsg));
    render(<Home />);
    // Click the "Load" button (initial state)
    await userEvent.click(screen.getByRole('button', { name: /load/i }));
    // Since the UI matches error by regex, we set errorMsg to include 'error'
    expect(await screen.findByText(/failed|error|unable|problem/i)).toBeInTheDocument();
  });

  it('changes button text from Load to Refresh after first click', async () => {
    render(<Home />);
    // Button should initially say "Load"
    const loadButton = screen.getByRole('button', { name: /load/i });
    expect(loadButton).toBeInTheDocument();
    // Click the button
    await userEvent.click(loadButton);
    // After click, should say "Refresh"
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('renders ServiceFilter component', async () => {
    render(<Home />);
    expect(await screen.findByTestId('service-filter')).toBeInTheDocument();
  });

  it('filters ClusterIP services by default', async () => {
    const mockServices = [
      { metadata: { name: 'clusterip-svc' }, spec: { type: 'ClusterIP' } },
      { metadata: { name: 'nodeport-svc' }, spec: { type: 'NodePort' } },
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
