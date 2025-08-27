import { StoredLocation } from '@/types';

const DB_NAME = 'LocationTrackerDB';
const DB_VERSION = 1;
const STORE_NAME = 'locations';

export class LocationDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB initialization error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('IndexedDB upgrade needed, creating object store');
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
          console.log('Object store and indexes created');
        }
      };
    });
  }

  async addLocation(location: Omit<StoredLocation, 'id'>): Promise<number> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const locationWithMetadata = {
        ...location,
        createdAt: Date.now(),
        synced: false,
      };
      
      console.log('Adding location to IndexedDB:', locationWithMetadata);
      
      const request = store.add(locationWithMetadata);

      request.onerror = () => {
        console.error('Error adding location:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const id = request.result as number;
        console.log('Location saved successfully with ID:', id);
        resolve(id);
      };
    });
  }

  async getUnsyncedLocations(): Promise<StoredLocation[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(false));

      request.onerror = () => {
        console.error('Error getting unsynced locations:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const locations = request.result;
        console.log(`Found ${locations.length} unsynced locations:`, locations);
        resolve(locations);
      };
    });
  }

  async markAsSynced(id: number): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => {
        console.error('Error getting location for sync marking:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const data = request.result;
        if (data) {
          console.log('Marking location as synced:', data);
          data.synced = true;
          const updateRequest = store.put(data);
          
          updateRequest.onerror = () => {
            console.error('Error updating sync status:', updateRequest.error);
            reject(updateRequest.error);
          };
          
          updateRequest.onsuccess = () => {
            console.log('Location marked as synced successfully');
            resolve();
          };
        } else {
          console.warn('Location not found for ID:', id);
          resolve();
        }
      };
    });
  }

  async clearSyncedLocations(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('synced');
      const request = index.openCursor(IDBKeyRange.only(true));

      request.onerror = () => {
        console.error('Error clearing synced locations:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          const ageInDays = (Date.now() - cursor.value.createdAt) / (24 * 60 * 60 * 1000);
          console.log(`Checking location ID ${cursor.value.id}, age: ${ageInDays.toFixed(2)} days`);
          
          if (Date.now() - cursor.value.createdAt > 7 * 24 * 60 * 60 * 1000) {
            console.log('Deleting old synced location:', cursor.value);
            cursor.delete();
          }
          cursor.continue();
        } else {
          console.log('Finished clearing old synced locations');
          resolve();
        }
      };
    });
  }

  // Optional: Add a method to view all locations for debugging
  async getAllLocations(): Promise<StoredLocation[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => {
        console.error('Error getting all locations:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const locations = request.result;
        console.log(`All locations in database (${locations.length} total):`, locations);
        resolve(locations);
      };
    });
  }
      }
