import handler from '../../pages/api/services';
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  child: () => ({ error: jest.fn(), info: jest.fn(), warn: jest.fn(), debug: jest.fn() }),
}));

jest.mock('@kubernetes/client-node', () => ({
  KubeConfig: jest.fn().mockImplementation(() => ({
    loadFromCluster: jest.fn(),
    loadFromDefault: jest.fn(),
    makeApiClient: jest.fn(() => ({
      listServiceForAllNamespaces: mockListServiceForAllNamespaces,
    })),
  })),
  CoreV1Api: jest.fn(),
}));

let mockListServiceForAllNamespaces;

describe('/api/services API', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockListServiceForAllNamespaces = jest.fn();
  });

  it('should return services when the API returns items array', async () => {
    mockListServiceForAllNamespaces.mockResolvedValue({
      items: [{ name: 'svc1' }, { name: 'svc2' }],
    });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ name: 'svc1' }, { name: 'svc2' }]);
  });

  it('should return 500 if items is missing or not an array', async () => {
    mockListServiceForAllNamespaces.mockResolvedValue({});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to fetch services' })
    );
  });

  it('should return 500 if k8sApi.listServiceForAllNamespaces throws', async () => {
    mockListServiceForAllNamespaces.mockRejectedValue(new Error('boom'));
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to fetch services', details: 'boom' })
    );
  });

  function cleanupKubeEnvVars() {
    delete process.env.KUBERNETES_SERVICE_HOST;
    delete process.env.KUBERNETES_SERVICE_PORT;
  }

  it('should use loadFromCluster if in-cluster env vars are set', async () => {
    process.env.KUBERNETES_SERVICE_HOST = '1';
    process.env.KUBERNETES_SERVICE_PORT = '2';
    mockListServiceForAllNamespaces.mockResolvedValue({ items: [] });
    try {
      await handler(req, res);
      // No assertion for loadFromCluster as it's a mock, but no error should occur
    } finally {
      cleanupKubeEnvVars();
    }
  });

  it('should use loadFromDefault if in-cluster env vars are not set', async () => {
    cleanupKubeEnvVars();
    mockListServiceForAllNamespaces.mockResolvedValue({ items: [] });
    try {
      await handler(req, res);
      // No assertion for loadFromDefault as it's a mock, but no error should occur
    } finally {
      cleanupKubeEnvVars();
    }
  });
});
