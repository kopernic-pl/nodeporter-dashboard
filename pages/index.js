import React, { useState } from 'react';
import FetchTime from '../components/FetchTime';
import EnvironmentBanner from '../components/EnvironmentBanner';
import Button from '../components/Button';
import Error from '../components/Error';
import ClusterSummary from '../components/ClusterSummary';

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
      {/* Environment Banner */}
      <EnvironmentBanner envType={envType} />
      <h1 className="retro-title">K8s Service Table</h1>
      <Button
        onClick={() => {
          setHasLoaded(true);
          fetchKubernetesData();
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : hasLoaded ? 'Refresh' : 'Load'}
      </Button>
      {nodesError && <Error>Nodes error: {nodesError}</Error>}
      {nodeSummary && (
        <ClusterSummary>
          <b>Cluster Summary:</b> {nodeSummary.numNodes} node{nodeSummary.numNodes === 1 ? '' : 's'}
          , total CPU: {Math.round(nodeSummary.totalCPU)} cores, total Memory:{' '}
          {nodeSummary.totalMemory} MiB
        </ClusterSummary>
      )}
      {error && <Error>{error}</Error>}
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
                                className="retro-nodeport-icon"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7 13L13 7M10 7H13V10"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <rect x="3" y="3" width="14" height="14" rx="3" strokeWidth="2" />
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
      <FetchTime fetchTime={fetchTime} />
    </div>
  );
}
