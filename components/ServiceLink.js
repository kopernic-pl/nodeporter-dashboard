import React from 'react';
import ExternalLinkIcon from './ExternalLinkIcon';

const ServiceLink = ({ service, nodes = [] }) => {
  // Handle LoadBalancer type
  if (service.spec.type === 'LoadBalancer') {
    const lbIngress = service.status?.loadBalancer?.ingress?.[0];
    const lbHost = lbIngress?.ip || lbIngress?.hostname;
    
    if (lbHost) {
      const portObj = service.spec.ports?.[0];
      const port = portObj?.nodePort || portObj?.targetPort || portObj?.port;
      const protocol = portObj?.port === 443 ? 'https' : 'http';
      const url = port ? `${protocol}://${lbHost}:${port}` : `${protocol}://${lbHost}`;
      
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open LoadBalancer: ${url}`}
        >
          <ExternalLinkIcon size={16} />
        </a>
      );
    }
  }

  // Handle NodePort type
  if (service.spec.type === 'NodePort' && nodes.length > 0) {
    const node = nodes[0];
    const internalIP = node.addresses?.find(
      (addr) => addr.type === 'InternalIP'
    )?.address;
    const nodePortObj = service.spec.ports.find((p) => p.nodePort);

    if (internalIP && nodePortObj?.nodePort) {
      const url = `http://${internalIP}:${nodePortObj.nodePort}`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open NodePort: ${url}`}
        >
          <ExternalLinkIcon size={16} />
        </a>
      );
    }
  }

  return null;
};

export default ServiceLink;
