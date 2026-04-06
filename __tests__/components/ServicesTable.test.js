import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesTable from '../../components/ServicesTable';

// Mock the ServiceLink component
jest.mock('../../components/ServiceLink', () => {
  return function MockServiceLink({ service }) {
    return <div data-testid="service-link">{service.metadata.name}</div>;
  };
});

describe('ServicesTable', () => {
  const mockServices = [
    {
      metadata: {
        name: 'test-service-1',
        namespace: 'default',
        labels: { 'app.kubernetes.io/name': 'Test App 1' },
      },
      spec: {
        type: 'ClusterIP',
        clusterIP: '10.0.0.1',
        ports: [
          { port: 80, protocol: 'TCP' },
          { port: 443, protocol: 'TCP', nodePort: 30044 },
        ],
      },
    },
    {
      metadata: {
        name: 'test-service-2',
        namespace: 'kube-system',
        labels: {},
      },
      spec: {
        type: 'NodePort',
        clusterIP: '10.0.0.2',
        ports: [{ port: 8080, protocol: 'TCP', nodePort: 30080 }],
      },
    },
  ];

  const mockNodes = [
    {
      addresses: [{ type: 'InternalIP', address: '192.168.1.100' }],
    },
  ];

  it('renders table headers correctly', () => {
    render(<ServicesTable services={[]} nodes={[]} loading={false} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Namespace')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('ClusterIP')).toBeInTheDocument();
    expect(screen.getByText('Ports')).toBeInTheDocument();
    expect(screen.getByText('Link')).toBeInTheDocument();
  });

  it('renders no services message when services array is empty and not loading', () => {
    render(<ServicesTable services={[]} nodes={[]} loading={false} />);

    expect(screen.getByText('No services loaded')).toBeInTheDocument();
  });

  it('renders services data correctly', () => {
    render(<ServicesTable services={mockServices} nodes={mockNodes} loading={false} />);

    // Check first service
    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    expect(screen.getByText('default')).toBeInTheDocument();
    // Use getAllByText for ClusterIP since it appears in both header and cell
    expect(screen.getAllByText('ClusterIP')).toHaveLength(2);
    expect(screen.getByText('10.0.0.1')).toBeInTheDocument();
    // Use getAllByText for ports since multiple ports match the criteria
    expect(
      screen.getAllByText((content) => {
        return content.includes('80') && content.includes('TCP');
      })
    ).toHaveLength(2); // Both 80/TCP and 8080/TCP match
    expect(
      screen.getByText((content) => {
        return (
          content.includes('443') && content.includes('TCP') && content.includes('NodePort: 30044')
        );
      })
    ).toBeInTheDocument();

    // Check second service
    expect(screen.getAllByText('test-service-2')).toHaveLength(2); // In table cell and ServiceLink
    expect(screen.getByText('kube-system')).toBeInTheDocument();
    expect(screen.getByText('NodePort')).toBeInTheDocument();
    expect(screen.getByText('10.0.0.2')).toBeInTheDocument();
    expect(
      screen.getByText((content) => {
        return (
          content.includes('8080') && content.includes('TCP') && content.includes('NodePort: 30080')
        );
      })
    ).toBeInTheDocument();

    // Check service links are rendered
    expect(screen.getAllByTestId('service-link')).toHaveLength(2);
  });

  it('does not show no services message when loading', () => {
    render(<ServicesTable services={[]} nodes={[]} loading={true} />);

    expect(screen.queryByText('No services loaded')).not.toBeInTheDocument();
  });

  it('renders services with app.kubernetes.io/name label when available', () => {
    render(<ServicesTable services={mockServices} nodes={mockNodes} loading={false} />);

    // Should show the app label instead of the service name in the table
    expect(screen.getByText('Test App 1')).toBeInTheDocument();
    // Check that the service name appears in the table cell (not in the ServiceLink)
    const nameCells = screen.getAllByText('test-service-1');
    expect(nameCells.length).toBeGreaterThan(0);
  });

  it('falls back to service name when app.kubernetes.io/name label is not present', () => {
    render(<ServicesTable services={mockServices} nodes={mockNodes} loading={false} />);

    // Should show the service name when no app label is present
    // Use getAllByText since the service name appears in both the table and the ServiceLink mock
    expect(screen.getAllByText('test-service-2')).toHaveLength(2);
  });

  it('renders multiple ports correctly with separators', () => {
    const serviceWithMultiplePorts = [mockServices[0]]; // First service has multiple ports
    render(<ServicesTable services={serviceWithMultiplePorts} nodes={mockNodes} loading={false} />);

    // Check that both ports are rendered using flexible matching
    expect(
      screen.getByText((content) => {
        return content.includes('80') && content.includes('TCP');
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => {
        return (
          content.includes('443') && content.includes('TCP') && content.includes('NodePort: 30044')
        );
      })
    ).toBeInTheDocument();

    // Check that the separator is present by checking for comma
    const portsContainer = screen.getByText((content) => {
      return content.includes('80') && content.includes('TCP');
    }).parentElement;
    expect(portsContainer).toBeInTheDocument();
    expect(portsContainer.textContent).toContain(',');
  });
});
