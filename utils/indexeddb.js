import { openDB } from 'idb';

const DB_NAME = 'nodeporter-user-prefs';
const STORE = 'hidden-namespaces';

export async function getHiddenNamespaces() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });
  return (await db.get(STORE, 'namespaces')) || [];
}

export async function setHiddenNamespaces(namespaces) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE);
    },
  });
  await db.put(STORE, namespaces, 'namespaces');
}
