// Next.js API route for /api/services
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

function getKubeConfig() {
  const kc = new KubeConfig();
  const hasInClusterEnv = process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT;
  if (hasInClusterEnv) {
    kc.loadFromCluster();
  } else {
    kc.loadFromDefault();
  }
  return kc;
}

export default async function handler(req, res) {
  try {
    const kc = getKubeConfig();
    const k8sApi = kc.makeApiClient(CoreV1Api);
    const servicesRaw = await k8sApi.listServiceForAllNamespaces();
    if (!servicesRaw.items || !Array.isArray(servicesRaw.items)) {
      throw new Error('Unexpected response structure from k8sApi.listServiceForAllNamespaces');
    }
    res.status(200).json(servicesRaw.items);
  } catch (err) {
    console.error('Failed to fetch services:', err);
    res.status(500).json({ error: 'Failed to fetch services', details: err.message });
  }
}
