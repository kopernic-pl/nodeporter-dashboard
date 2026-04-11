import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceLink from '../../components/ServiceLink';

// Mock ExternalLinkIcon
jest.mock('../../components/ExternalLinkIcon', () => {
  return function MockExternalLinkIcon({ size }) {
    return <div data-testid="external-link-icon" data-size={size} />;
  };
});

describe('ServiceLink', () => {
  const mockService = {
    spec: {
      type: 'LoadBalancer',
      ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
    },
    status: {
      loadBalancer: {
        ingress: [{ ip: '192.168.1.100' }]
      }
    }
  };

  const mockNodes = [
    {
      addresses: [
        { type: 'InternalIP', address: '10.0.0.1' },
        { type: 'ExternalIP', address: '203.0.113.1' }
      ]
    }
  ];

  it('renders LoadBalancer link with IP', () => {
    render(<ServiceLink service={mockService} nodes={mockNodes} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://192.168.1.100:30080');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('title', 'Open LoadBalancer: http://192.168.1.100:30080');
    
    const icon = screen.getByTestId('external-link-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', '16');
  });

  it('renders LoadBalancer link with hostname', () => {
    const serviceWithHostname = {
      ...mockService,
      status: {
        loadBalancer: {
          ingress: [{ hostname: 'lb.example.com' }]
        }
      }
    };

    render(<ServiceLink service={serviceWithHostname} nodes={mockNodes} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://lb.example.com:30080');
  });

  it('renders LoadBalancer link with HTTPS for port 443', () => {
    const serviceWithHttps = {
      ...mockService,
      spec: {
        ...mockService.spec,
        ports: [{ port: 443, nodePort: 30443, targetPort: 8443 }]
      }
    };

    render(<ServiceLink service={serviceWithHttps} nodes={mockNodes} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://192.168.1.100:30443');
  });

  it('renders LoadBalancer link without port when port is not available', () => {
    const serviceWithoutPort = {
      ...mockService,
      spec: {
        type: 'LoadBalancer',
        ports: []
      }
    };

    render(<ServiceLink service={serviceWithoutPort} nodes={mockNodes} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://192.168.1.100');
  });

  it('renders NodePort link when nodes are available', () => {
    const nodePortService = {
      spec: {
        type: 'NodePort',
        ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
      }
    };

    render(<ServiceLink service={nodePortService} nodes={mockNodes} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://10.0.0.1:30080');
    expect(link).toHaveAttribute('title', 'Open NodePort: http://10.0.0.1:30080');
  });

  it('does not render NodePort link when no nodes are available', () => {
    const nodePortService = {
      spec: {
        type: 'NodePort',
        ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
      }
    };

    render(<ServiceLink service={nodePortService} nodes={[]} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render NodePort link when node has no InternalIP', () => {
    const nodePortService = {
      spec: {
        type: 'NodePort',
        ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
      }
    };

    const nodesWithoutInternalIP = [
      {
        addresses: [
          { type: 'ExternalIP', address: '203.0.113.1' }
        ]
      }
    ];

    render(<ServiceLink service={nodePortService} nodes={nodesWithoutInternalIP} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render NodePort link when service has no nodePort', () => {
    const serviceWithoutNodePort = {
      spec: {
        type: 'NodePort',
        ports: [{ port: 80, targetPort: 8080 }]
      }
    };

    render(<ServiceLink service={serviceWithoutNodePort} nodes={mockNodes} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render LoadBalancer link when no ingress is available', () => {
    const serviceWithoutIngress = {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
      },
      status: {
        loadBalancer: {
          ingress: []
        }
      }
    };

    render(<ServiceLink service={serviceWithoutIngress} nodes={mockNodes} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render LoadBalancer link when ingress has no IP or hostname', () => {
    const serviceWithEmptyIngress = {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, nodePort: 30080, targetPort: 8080 }]
      },
      status: {
        loadBalancer: {
          ingress: [{}]
        }
      }
    };

    render(<ServiceLink service={serviceWithEmptyIngress} nodes={mockNodes} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('returns null for unsupported service type', () => {
    const unsupportedService = {
      spec: {
        type: 'ClusterIP',
        ports: [{ port: 80, targetPort: 8080 }]
      }
    };

    render(<ServiceLink service={unsupportedService} nodes={mockNodes} />);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles missing nodes prop gracefully', () => {
    render(<ServiceLink service={mockService} />);
    
    // Should still work for LoadBalancer type
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://192.168.1.100:30080');
  });
});
