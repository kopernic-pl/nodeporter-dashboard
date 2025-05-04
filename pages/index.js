import React, { useState } from 'react';
import styled from 'styled-components';

const RetroButton = styled.button`
  font-family: 'Press Start 2P', 'VT323', monospace;
  background: var(--retro-btn-bg, #00fff7);
  color: var(--retro-btn-color, #222);
  border: 4px solid var(--retro-btn-border, #ff00c8);
  border-radius: 0;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  margin-bottom: 2rem;
  cursor: pointer;
  box-shadow:
    4px 4px 0 var(--retro-btn-shadow, #ff00c8),
    8px 8px 0 var(--retro-btn-shadow2, #222);
  transition:
    background 0.1s,
    color 0.1s;

  &:active {
    background: var(--retro-btn-active-bg, #ff00c8);
    color: var(--retro-btn-active-color, #00fff7);
    box-shadow:
      2px 2px 0 var(--retro-btn-active-shadow, #00fff7),
      4px 4px 0 var(--retro-btn-shadow2, #222);
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
  box-shadow:
    2px 2px 0 #fff200,
    4px 4px 0 #222;
`;

export default function Home() {
  const [services, setServices] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [nodeSummary, setNodeSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nodesError, setNodesError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);
  const [envType, setEnvType] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  React.useEffect(() => {
    fetch('/api/envtype')
      .then((res) => res.json())
      .then((data) => setEnvType(data.envType))
      .catch(() => setEnvType('unknown'));
  }, []);

  const fetchKubernetesData = async () => {
    setLoading(true);
    setError(null);
    setNodesError(null);
    setFetchTime(null);
    const start = performance.now();
    // Run both fetches in parallel
    const servicesPromise = fetch('/api/services')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch services');
        return response.json();
      })
      .then(setServices)
      .catch((err) => setError(err.message));

    const nodesPromise = fetch('/api/nodes')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch nodes');
        return response.json();
      })
      .then((nodesData) => {
        setNodes(nodesData);
        // Calculate summary
        const numNodes = nodesData.length;
        let totalCPU = 0;
        let totalMemory = 0;
        nodesData.forEach((node) => {
          // CPU is in cores (as string, e.g. "4" or "2000m")
          // Memory is in bytes (as string, e.g. "16383752Ki")
          let cpuVal = node.capacity && node.capacity.cpu ? node.capacity.cpu : '0';
          let memVal = node.capacity && node.capacity.memory ? node.capacity.memory : '0';
          // Convert cpu to millicores
          if (cpuVal.endsWith('m')) {
            totalCPU += parseInt(cpuVal);
          } else {
            totalCPU += parseFloat(cpuVal) * 1000;
          }
          // Convert memory to MiB
          if (memVal.endsWith('Ki')) {
            totalMemory += parseInt(memVal) / 1024;
          } else if (memVal.endsWith('Mi')) {
            totalMemory += parseInt(memVal);
          } else if (memVal.endsWith('Gi')) {
            totalMemory += parseInt(memVal) * 1024;
          } else {
            totalMemory += parseInt(memVal) / (1024 * 1024); // assume bytes
          }
        });
        setNodeSummary({
          numNodes,
          totalCPU: totalCPU / 1000, // show in cores
          totalMemory: Math.round(totalMemory), // show in MiB
        });
      })
      .catch((err) => {
        setNodes([]);
        setNodeSummary(null);
        setNodesError(err.message);
      });

    await Promise.all([servicesPromise, nodesPromise]);
    const elapsed = performance.now() - start;
    setFetchTime(elapsed);
    setLoading(false);
  };

  return (
    <div className="retro-8bit-app">
      {envType && (
        <div
          style={{
            background: envType === 'in-cluster' ? '#00fff7' : '#ff00c8',
            color: envType === 'in-cluster' ? '#111' : '#fff',
            fontFamily: "'Press Start 2P', 'VT323', monospace",
            fontSize: '1rem',
            letterSpacing: '1px',
            textAlign: 'center',
            padding: '0.7rem 0',
            borderBottom: envType === 'in-cluster' ? '4px solid #fff200' : '4px solid #fff200',
            boxShadow: envType === 'in-cluster' ? '0 2px 12px #00fff7' : '0 2px 12px #ff00c8',
            marginBottom: '1.5rem',
            textShadow: envType === 'in-cluster' ? '1px 1px #fff200' : '1px 1px #222',
          }}
        >
          {envType === 'in-cluster' && 'Running in-cluster (production/Kubernetes)'}
          {envType === 'local' && 'Running in local/dev mode'}
          {envType === 'unknown' && 'Environment type: unknown'}
        </div>
      )}
      <h1 className="retro-title">K8s Service Table</h1>
      <RetroButton
        onClick={() => {
          setHasLoaded(true);
          fetchKubernetesData();
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : hasLoaded ? 'Refresh' : 'Load'}
      </RetroButton>
      {nodesError && <RetroError>Nodes error: {nodesError}</RetroError>}
      {nodeSummary && (
        <div
          style={{
            marginBottom: '1rem',
            fontFamily: 'monospace',
            fontSize: '1rem',
            color: '#00fff7',
            textShadow: '1px 1px #222',
          }}
        >
          <b>Cluster Summary:</b> {nodeSummary.numNodes} node{nodeSummary.numNodes === 1 ? '' : 's'}
          , total CPU: {Math.round(nodeSummary.totalCPU)} cores, total Memory:{' '}
          {nodeSummary.totalMemory} MiB
        </div>
      )}
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
              <th>NodePort Link</th>
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
              services.map((svc, idx) => (
                <tr key={svc.metadata.name + idx}>
                  <td>{svc.metadata.name}</td>
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
                    {(() => {
                      if (svc.spec.type === 'NodePort' && nodes && nodes.length > 0) {
                        const node = nodes[0];
                        const internalIP = node.addresses?.find(
                          (addr) => addr.type === 'InternalIP'
                        )?.address;
                        const nodePortObj = svc.spec.ports.find((p) => p.nodePort);
                        if (internalIP && nodePortObj && nodePortObj.nodePort) {
                          const nodeUrl = `http://${internalIP}:${nodePortObj.nodePort}`;
                          return (
                            <a
                              href={nodeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${nodeUrl}`}
                              style={{
                                marginLeft: 2,
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 13L13 7M10 7H13V10"
                                  stroke="#00fff7"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <rect
                                  x="3"
                                  y="3"
                                  width="14"
                                  height="14"
                                  rx="3"
                                  stroke="#00fff7"
                                  strokeWidth="2"
                                />
                              </svg>
                            </a>
                          );
                        }
                      }
                      return null;
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {fetchTime !== null && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            bottom: 0,
            background: 'rgba(34,34,34,0.95)',
            color: '#00fff7',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            padding: '0.6rem 1.2rem',
            borderTopLeftRadius: '8px',
            zIndex: 1000,
            boxShadow: '0 0 8px #00fff7',
          }}
        >
          Fetch time: {(fetchTime / 1000).toFixed(2)}s
        </div>
      )}
    </div>
  );
}
