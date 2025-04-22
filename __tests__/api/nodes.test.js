import handler from '../../pages/api/nodes';
let mockListNode;

jest.mock('@kubernetes/client-node', () => ({
  KubeConfig: jest.fn().mockImplementation(() => ({
    loadFromCluster: jest.fn(),
    loadFromDefault: jest.fn(),
    makeApiClient: jest.fn(() => ({
      listNode: mockListNode
    }))
  })),
  CoreV1Api: jest.fn()
}));

describe('/api/nodes API', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockListNode = jest.fn();
  });

  function cleanupKubeEnvVars() {
    delete process.env.KUBERNETES_SERVICE_HOST;
    delete process.env.KUBERNETES_SERVICE_PORT;
  }

  it('should return nodes when the API returns items array', async () => {
    mockListNode.mockResolvedValue({
      items: [
        {
          metadata: { name: 'node1', labels: { role: 'worker' } },
          status: {
            conditions: [{ type: 'Ready', status: 'True' }],
            addresses: [{ type: 'InternalIP', address: '10.0.0.1' }],
            capacity: { cpu: '4', memory: '16Gi' },
            allocatable: { cpu: '4', memory: '16Gi' }
          }
        },
        {
          metadata: { name: 'node2', labels: { role: 'master' } },
          status: {
            conditions: [{ type: 'Ready', status: 'False' }],
            addresses: [{ type: 'InternalIP', address: '10.0.0.2' }],
            capacity: { cpu: '8', memory: '32Gi' },
            allocatable: { cpu: '8', memory: '32Gi' }
          }
        }
      ]
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        name: 'node1',
        status: 'True',
        addresses: [{ type: 'InternalIP', address: '10.0.0.1' }],
        capacity: { cpu: '4', memory: '16Gi' },
        allocatable: { cpu: '4', memory: '16Gi' },
        labels: { role: 'worker' }
      },
      {
        name: 'node2',
        status: 'False',
        addresses: [{ type: 'InternalIP', address: '10.0.0.2' }],
        capacity: { cpu: '8', memory: '32Gi' },
        allocatable: { cpu: '8', memory: '32Gi' },
        labels: { role: 'master' }
      }
    ]);
  });

  it('should return 500 if items is missing or not an array', async () => {
    mockListNode.mockResolvedValue({});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to fetch nodes' }));
  });

  it('should return 500 if k8sApi.listNode throws', async () => {
    mockListNode.mockRejectedValue(new Error('boom'));
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to fetch nodes', details: 'boom' }));
  });

  it('should use loadFromCluster if in-cluster env vars are set', async () => {
    process.env.KUBERNETES_SERVICE_HOST = '1';
    process.env.KUBERNETES_SERVICE_PORT = '2';
    mockListNode.mockResolvedValue({ items: [] });
    try {
      await handler(req, res);
    } finally {
      cleanupKubeEnvVars();
    }
  });

  it('should use loadFromDefault if in-cluster env vars are not set', async () => {
    cleanupKubeEnvVars();
    mockListNode.mockResolvedValue({ items: [] });
    try {
      await handler(req, res);
    } finally {
      cleanupKubeEnvVars();
    }
  });
});
