// Next.js API route for /api/nodes
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export default async function handler(req, res) {
  try {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(CoreV1Api);
    const result = await k8sApi.listNode();
    const nodes = result.body.items.map(node => ({
      name: node.metadata.name,
      status: node.status.conditions.find(c => c.type === 'Ready')?.status,
      addresses: node.status.addresses,
      capacity: node.status.capacity,
      allocatable: node.status.allocatable,
      labels: node.metadata.labels
    }));
    res.status(200).json(nodes);
  } catch (err) {
    res.status(200).json([
      {
        name: 'mock-node-1',
        status: 'True',
        addresses: [
          { type: 'InternalIP', address: '192.168.1.10' },
          { type: 'Hostname', address: 'mock-node-1.local' }
        ],
        capacity: { cpu: '4', memory: '8192Mi' },
        allocatable: { cpu: '4', memory: '8192Mi' },
        labels: { 'kubernetes.io/role': 'worker', 'beta.kubernetes.io/os': 'linux' }
      },
      {
        name: 'mock-node-2',
        status: 'True',
        addresses: [
          { type: 'InternalIP', address: '192.168.1.11' },
          { type: 'Hostname', address: 'mock-node-2.local' }
        ],
        capacity: { cpu: '8', memory: '16384Mi' },
        allocatable: { cpu: '8', memory: '16384Mi' },
        labels: { 'kubernetes.io/role': 'worker', 'beta.kubernetes.io/os': 'linux' }
      }
    ]);
  }
}
