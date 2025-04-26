import handler from '../../pages/api/envtype';

describe('/api/envtype API', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      on: jest.fn(), // mock for .on()
    };
  });

  it('should return "in-cluster" when KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT are set', () => {
    process.env.KUBERNETES_SERVICE_HOST = '1';
    process.env.KUBERNETES_SERVICE_PORT = '2';
    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ envType: 'in-cluster' });
    delete process.env.KUBERNETES_SERVICE_HOST;
    delete process.env.KUBERNETES_SERVICE_PORT;
  });

  it('should return "local" when only KUBERNETES_SERVICE_HOST is set', () => {
    process.env.KUBERNETES_SERVICE_HOST = '1';
    delete process.env.KUBERNETES_SERVICE_PORT;
    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ envType: 'local' });
    delete process.env.KUBERNETES_SERVICE_HOST;
  });

  it('should return "local" when only KUBERNETES_SERVICE_PORT is set', () => {
    delete process.env.KUBERNETES_SERVICE_HOST;
    process.env.KUBERNETES_SERVICE_PORT = '2';
    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ envType: 'local' });
    delete process.env.KUBERNETES_SERVICE_PORT;
  });

  it('should return "local" when KUBERNETES_SERVICE_HOST and KUBERNETES_SERVICE_PORT are not set', () => {
    delete process.env.KUBERNETES_SERVICE_HOST;
    delete process.env.KUBERNETES_SERVICE_PORT;
    handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ envType: 'local' });
  });
});
