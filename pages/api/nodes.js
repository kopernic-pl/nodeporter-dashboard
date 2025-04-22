// Next.js API route for /api/nodes
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';
import logger from '../../utils/logger';
import accessLog from '../../utils/accessLog';

function getKubeConfig() {
  const kc = new KubeConfig();
  const hasInClusterEnv =
    process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT;
  if (hasInClusterEnv) {
    kc.loadFromCluster();
  } else {
    kc.loadFromDefault();
  }

  return kc;
}

function extractNodeItems(nodesRaw) {
  if (!Array.isArray(nodesRaw.items)) {
    throw new Error('Expected nodesRaw.items to be an array, got: ' + typeof nodesRaw.items);
  }
  return nodesRaw.items;
}

export default async function handler(req, res) {
  accessLog(req, res);
  try {
    const kc = getKubeConfig();
    const k8sApi = kc.makeApiClient(CoreV1Api);
    const nodesRaw = await k8sApi.listNode();
    const nodesArr = extractNodeItems(nodesRaw);
    const nodes = nodesArr.map((node) => ({
      name: node.metadata.name,
      status: node.status.conditions.find((c) => c.type === 'Ready')?.status,
      addresses: node.status.addresses,
      capacity: node.status.capacity,
      allocatable: node.status.allocatable,
      labels: node.metadata.labels,
    }));
    res.status(200).json(nodes);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch nodes');
    res.status(500).json({ error: 'Failed to fetch nodes', details: err.message });
  }
}
