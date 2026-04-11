import accessLog from '../../utils/accessLog';

// Mock logger to avoid actual logging during tests
jest.mock('../../utils/logger', () => ({
  info: jest.fn(),
}));

describe('accessLog', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/test',
      headers: {
        'user-agent': 'test-agent',
        referer: 'http://example.com',
      },
      socket: {
        remoteAddress: '127.0.0.1',
      },
    };

    mockRes = {
      statusCode: 200,
      getHeader: jest.fn().mockReturnValue('1024'),
      on: jest.fn(),
    };

    mockNext = jest.fn();
  });

  it('should be a function', () => {
    expect(typeof accessLog).toBe('function');
  });

  it('should call next function when provided', () => {
    accessLog(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not throw when next is not provided', () => {
    expect(() => {
      accessLog(mockReq, mockRes);
    }).not.toThrow();
  });

  it('should set up finish event listener', () => {
    accessLog(mockReq, mockRes, mockNext);
    expect(mockRes.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('should handle request with minimal headers', () => {
    const minimalReq = {
      method: 'POST',
      url: '/api/test',
      headers: {},
      socket: {
        remoteAddress: '192.168.1.1',
      },
    };

    expect(() => {
      accessLog(minimalReq, mockRes, mockNext);
    }).not.toThrow();
  });

  it('should handle response without content-length header', () => {
    mockRes.getHeader = jest.fn().mockReturnValue(null);

    expect(() => {
      accessLog(mockReq, mockRes, mockNext);
    }).not.toThrow();
  });

  it('should handle response without getHeader method', () => {
    delete mockRes.getHeader;

    expect(() => {
      accessLog(mockReq, mockRes, mockNext);
    }).not.toThrow();
  });
});
