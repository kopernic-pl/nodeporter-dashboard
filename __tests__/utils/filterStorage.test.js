/**
 * Tests for filterStorage utility
 */

import { saveFilters, loadFilters, clearFilters, getDefaultFilters } from '../../utils/filterStorage';

// Mock indexedDB global
const mockDB = {
  transaction: jest.fn(),
};

const mockStore = {
  put: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
};

const mockRequest = {
  result: null,
  error: null,
  onsuccess: null,
  onerror: null,
};

global.indexedDB = {
  open: jest.fn(),
};

describe('filterStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock behavior
    global.indexedDB.open.mockReturnValue(mockRequest);
    
    // Mock successful database setup
    mockDB.transaction.mockReturnValue({
      objectStore: jest.fn().mockReturnValue(mockStore),
    });
    
    mockStore.put.mockReturnValue(mockRequest);
    mockStore.get.mockReturnValue(mockRequest);
    mockStore.delete.mockReturnValue(mockRequest);
  });

  const setupSuccessfulDBOpen = () => {
    // Set up the mock to resolve with the database
    global.indexedDB.open.mockImplementation(() => {
      const request = {
        result: mockDB,
        error: null,
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
      };
      
      // Simulate successful open
      setTimeout(() => {
        if (request.onsuccess) {
          request.onsuccess({ target: { result: mockDB } });
        }
      }, 0);
      
      return request;
    });
  };

  const setupSuccessfulOperation = (mockStoreMethod) => {
    mockStoreMethod.mockImplementation(() => {
      const request = {
        result: undefined,
        error: null,
        onsuccess: null,
        onerror: null,
      };
      
      setTimeout(() => {
        if (request.onsuccess) {
          request.onsuccess({ target: { result: undefined } });
        }
      }, 0);
      
      return request;
    });
  };

  const setupSuccessfulGet = (result) => {
    mockStore.get.mockImplementation(() => {
      const request = {
        result: result,
        error: null,
        onsuccess: null,
        onerror: null,
      };
      
      setTimeout(() => {
        if (request.onsuccess) {
          request.onsuccess({ target: { result } });
        }
      }, 0);
      
      return request;
    });
  };

  const setupDBError = () => {
    global.indexedDB.open.mockImplementation(() => {
      const request = {
        result: null,
        error: new Error('DB error'),
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
      };
      
      setTimeout(() => {
        if (request.onerror) {
          request.onerror({ target: { error: new Error('DB error') } });
        }
      }, 0);
      
      return request;
    });
  };

  describe('getDefaultFilters', () => {
    it('returns default filter settings', () => {
      const defaults = getDefaultFilters();
      
      expect(defaults).toEqual({
        ClusterIP: false,
        NodePort: true,
        LoadBalancer: true,
        ExternalName: true,
      });
    });

    it('returns a new object each time', () => {
      const defaults1 = getDefaultFilters();
      const defaults2 = getDefaultFilters();
      
      expect(defaults1).not.toBe(defaults2);
      expect(defaults1).toEqual(defaults2);
    });
  });

  describe('saveFilters', () => {
    it('saves filters to IndexedDB', async () => {
      const testFilters = { ClusterIP: true, NodePort: false };
      
      setupSuccessfulDBOpen();
      setupSuccessfulOperation(mockStore.put);

      await saveFilters(testFilters);

      expect(global.indexedDB.open).toHaveBeenCalledWith('nodeporterFilters', 1);
      expect(mockStore.put).toHaveBeenCalledWith(testFilters, 'filterSettings');
    });

    it('handles database errors gracefully', async () => {
      const testFilters = { ClusterIP: true };
      
      setupDBError();

      // Should not throw
      await expect(saveFilters(testFilters)).resolves.toBeUndefined();
    });
  });

  describe('loadFilters', () => {
    it('loads filters from IndexedDB', async () => {
      const storedFilters = { ClusterIP: false, NodePort: true };
      
      setupSuccessfulDBOpen();
      setupSuccessfulGet(storedFilters);

      const result = await loadFilters();

      expect(global.indexedDB.open).toHaveBeenCalledWith('nodeporterFilters', 1);
      expect(mockStore.get).toHaveBeenCalledWith('filterSettings');
      expect(result).toEqual(storedFilters);
    });

    it('returns defaults when no filters are stored', async () => {
      setupSuccessfulDBOpen();
      setupSuccessfulGet(undefined);

      const result = await loadFilters();

      expect(result).toEqual(getDefaultFilters());
    });

    it('returns defaults on database errors', async () => {
      setupDBError();

      const result = await loadFilters();

      expect(result).toEqual(getDefaultFilters());
    });
  });

  describe('clearFilters', () => {
    it('clears filters from IndexedDB', async () => {
      setupSuccessfulDBOpen();
      setupSuccessfulOperation(mockStore.delete);

      await clearFilters();

      expect(global.indexedDB.open).toHaveBeenCalledWith('nodeporterFilters', 1);
      expect(mockStore.delete).toHaveBeenCalledWith('filterSettings');
    });

    it('handles clear errors gracefully', async () => {
      setupDBError();

      // Should not throw
      await expect(clearFilters()).resolves.toBeUndefined();
    });
  });
});
