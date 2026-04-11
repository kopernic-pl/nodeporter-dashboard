import React from 'react';
import ServiceLink from './ServiceLink';

const ServicesTable = ({ services, nodes, loading }) => {
  return (
    <div className="retro-table-container">
      <table className="retro-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Namespace</th>
            <th>Type</th>
            <th>ClusterIP</th>
            <th>Ports</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 && !loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No services loaded
              </td>
            </tr>
          ) : (
            services.map((svc) => (
              <tr key={svc.metadata.uid || `${svc.metadata.namespace}/${svc.metadata.name}`}>
                <td>{svc.metadata.labels?.['app.kubernetes.io/name'] || svc.metadata.name}</td>
                <td>{svc.metadata.namespace}</td>
                <td>{svc.spec.type}</td>
                <td>{svc.spec.clusterIP}</td>
                <td>
                  {svc.spec.ports.map((p, i) => (
                    <span
                      key={i}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2em' }}
                    >
                      {p.port}/{p.protocol}
                      {p.nodePort ? ` (NodePort: ${p.nodePort})` : ''}
                      {i < svc.spec.ports.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td>
                  <ServiceLink service={svc} nodes={nodes} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;
