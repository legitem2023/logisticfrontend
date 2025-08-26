const CACHE_NAME = 'location-tracker-v1';
const API_ENDPOINT = '/api/location';

// Install and activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated');
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'location-sync') {
    event.waitUntil(syncLocations());
  }
});

// Periodic sync (every 15 minutes)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'location-periodic-sync') {
    event.waitUntil(syncLocations());
  }
});

// Push notifications for background updates
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification('Location Tracker', {
        body: data.message,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      })
    );
  }
});

// Sync locations with server
async function syncLocations() {
  try {
    const db = new LocationDB();
    await db.init();
    
    const unsyncedLocations = await db.getUnsyncedLocations();
    
    if (unsyncedLocations.length === 0) {
      return;
    }

    for (const location of unsyncedLocations) {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(location),
        });

        if (response.ok) {
          await db.markAsSynced(location.id);
          console.log('Location synced:', location.id);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to sync location:', error);
        throw error; // Retry on next sync
      }
    }

    await db.clearSyncedLocations();
    
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

// IndexedDB class for service worker
class LocationDB {
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LocationTrackerDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getUnsyncedLocations() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['locations'], 'readonly');
      const store = transaction.objectStore('locations');
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async markAsSynced(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['locations'], 'readwrite');
      const store = transaction.objectStore('locations');
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          data.synced = true;
          store.put(data);
        }
        resolve();
      };
    });
  }

  async clearSyncedLocations() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['locations'], 'readwrite');
      const store = transaction.objectStore('locations');
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          if (Date.now() - cursor.value.createdAt > 7 * 24 * 60 * 60 * 1000) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }
}
