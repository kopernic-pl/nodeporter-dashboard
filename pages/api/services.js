// Next.js API route for /api/services
export default function handler(req, res) {
  const mockedServices = [
    {
      metadata: { name: 'service-1', namespace: 'default' },
      spec: { type: 'ClusterIP', clusterIP: '10.0.0.1', ports: [{ port: 80, protocol: 'TCP' }] },
      status: { loadBalancer: {} }
    },
    {
      metadata: { name: 'service-2', namespace: 'default' },
      spec: { type: 'NodePort', clusterIP: '10.0.0.2', ports: [{ port: 8080, protocol: 'TCP', nodePort: 30036 }] },
      status: { loadBalancer: {} }
    }
  ];
  res.status(200).json(mockedServices);
}
