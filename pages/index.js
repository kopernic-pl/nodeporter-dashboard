import React, { useState, useCallback } from 'react';
import FetchTime from '../components/FetchTime';
import EnvironmentBanner from '../components/EnvironmentBanner';
import Button from '../components/Button';
import Error from '../components/Error';
import ClusterSummary from '../components/ClusterSummary';
import ServicesTable from '../components/ServicesTable';
import ServiceFilters from '../components/ServiceFilters';
import FilterButton from '../components/FilterButton';
import FilterIndicator from '../components/FilterIndicator';
import { useServices } from '../hooks/useServices';
import { useServiceFilters } from '../hooks/useServiceFilters';

export default function Home() {
  const { services, loading, error, refetch: refetchServices } = useServices();
  const {
    filteredServices,
    availableNamespaces,
    availableTypes,
    filters,
    setFilter,
    clearFilters,
    getFilterStats,
  } = useServiceFilters(services);
  const [nodes, setNodes] = useState([]);
  const [nodeSummary, setNodeSummary] = useState(null);
  const [nodesError, setNodesError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);
  const [envType, setEnvType] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    fetch('/api/envtype')
      .then((res) => res.json())
      .then((data) => setEnvType(data.envType))
      .catch(() => setEnvType('unknown'));
  }, []);

  const fetchKubernetesData = useCallback(async () => {
    setRefreshing(true);
    setNodesError(null);
    setFetchTime(null);
    const start = performance.now();

    // Fetch nodes data only (services are handled by useServices hook)
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

    // Fetch services data using the hook's refetch function
    const servicesPromise = refetchServices();

    try {
      await Promise.all([nodesPromise, servicesPromise]);
      const elapsed = performance.now() - start;
      setFetchTime(elapsed);
    } finally {
      setRefreshing(false);
    }
  }, [refetchServices]);

  React.useEffect(() => {
    // Auto-load data on component mount
    fetchKubernetesData();
    setHasLoaded(true);
  }, [fetchKubernetesData]);

  return (
    <div className="retro-8bit-app">
      {/* Environment Banner */}
      <EnvironmentBanner envType={envType} />
      <h1 className="retro-title">K8s Service Table</h1>
      {hasLoaded && (
        <Button onClick={fetchKubernetesData} disabled={refreshing}>
          {refreshing ? 'Loading...' : 'Refresh'}
        </Button>
      )}
      {nodesError && <Error>Nodes error: {nodesError}</Error>}
      {nodeSummary && (
        <ClusterSummary>
          <b>Cluster Summary:</b> {nodeSummary.numNodes} node{nodeSummary.numNodes === 1 ? '' : 's'}
          , total CPU: {Math.round(nodeSummary.totalCPU)} cores, total Memory:{' '}
          {nodeSummary.totalMemory} MiB
        </ClusterSummary>
      )}
      {error && <Error>{error}</Error>}
      {(availableNamespaces.length > 0 || availableTypes.length > 0) && (
        <FilterButton
          showFilters={showFilters}
          onClick={() => setShowFilters(!showFilters)}
          disabled={refreshing}
        />
      )}
      {!showFilters && <FilterIndicator stats={getFilterStats()} onClearFilters={clearFilters} />}
      {showFilters && (
        <ServiceFilters
          availableNamespaces={availableNamespaces}
          availableTypes={availableTypes}
          filters={filters}
          setFilter={setFilter}
          clearFilters={clearFilters}
          getFilterStats={getFilterStats}
        />
      )}
      <ServicesTable services={filteredServices} nodes={nodes} loading={loading} />
      <FetchTime fetchTime={fetchTime} />
    </div>
  );
}
