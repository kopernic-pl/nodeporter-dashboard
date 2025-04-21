import React, { useState } from 'react';
import styled from 'styled-components';

const RetroButton = styled.button`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: #00fff7;
  color: #222;
  border: 4px solid #ff00c8;
  border-radius: 0;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  box-shadow: 4px 4px 0 #ff00c8, 8px 8px 0 #222;
  transition: background 0.1s, color 0.1s;

  &:active {
    background: #ff00c8;
    color: #00fff7;
    box-shadow: 2px 2px 0 #00fff7, 4px 4px 0 #222;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RetroError = styled.div`
  color: #fff;
  background: #ff003c;
  border: 3px solid #fff200;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-family: 'Press Start 2P', 'VT323', monospace;
  font-size: 0.9rem;
  text-shadow: 1px 1px #222;
  box-shadow: 2px 2px 0 #fff200, 4px 4px 0 #222;
`;

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retro-8bit-app">
      <h1 className="retro-title">K8s Service Table</h1>
      <RetroButton onClick={fetchServices} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh'}
      </RetroButton>
      {error && <RetroError>{error}</RetroError>}
      <div className="retro-table-container">
        <table className="retro-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Namespace</th>
              <th>Type</th>
              <th>ClusterIP</th>
              <th>Ports</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && !loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No services loaded</td>
              </tr>
            ) : (
              services.map((svc, idx) => (
                <tr key={svc.metadata.name + idx}>
                  <td>{svc.metadata.name}</td>
                  <td>{svc.metadata.namespace}</td>
                  <td>{svc.spec.type}</td>
                  <td>{svc.spec.clusterIP}</td>
                  <td>
                    {svc.spec.ports.map((p, i) => (
                      <span key={i}>
                        {p.port}/{p.protocol}{p.nodePort ? ` (NodePort: ${p.nodePort})` : ''}{i < svc.spec.ports.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
