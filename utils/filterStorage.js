/**
 * IndexedDB utility for storing and retrieving service filter preferences
 * Separated from main page logic for better maintainability
 */

const DB_NAME = 'nodeporterFilters';
const STORE_NAME = 'serviceFilters';
const KEY = 'filterSettings';

// Default filter settings
const DEFAULT_FILTERS = {
  ClusterIP: false,  // Hidden by default
  NodePort: true,    // Visible by default
  LoadBalancer: true, // Visible by default
  ExternalName: true, // Visible by default
};

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBDatabase>} Database instance
 */
async function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save filter preferences to IndexedDB
 * @param {Object} filters - Filter settings object
 * @returns {Promise<void>}
 */
export async function saveFilters(filters) {
  try {
    const db = await initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(filters, KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to save filters to IndexedDB:', error);
    // Silently fail to not break the UI
  }
}

/**
 * Load filter preferences from IndexedDB
 * @returns {Promise<Object>} Filter settings object
 */
export async function loadFilters() {
  try {
    const db = await initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result || { ...DEFAULT_FILTERS });
      };
    });
  } catch (error) {
    console.warn('Failed to load filters from IndexedDB, using defaults:', error);
    return { ...DEFAULT_FILTERS };
  }
}

/**
 * Clear all filter preferences from IndexedDB
 * @returns {Promise<void>}
 */
export async function clearFilters() {
  try {
    const db = await initDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(KEY);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn('Failed to clear filters from IndexedDB:', error);
  }
}

/**
 * Get default filter settings
 * @returns {Object} Default filter settings
 */
export function getDefaultFilters() {
  return { ...DEFAULT_FILTERS };
}
