// background-tracker.ts
import { registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { LocationTracker } from './graphql/mutations';

// Dynamically register the plugin
const BackgroundGeolocation = registerPlugin('BackgroundGeolocation');

export class BackgroundTracker {
  private watcherId: string | null = null;

  async startTracking(userId: string) {
    await this.storeUserId(userId);

    this.watcherId = await BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: "Tracking your location for deliveries",
        backgroundTitle: "MotoGo Active",
        requestPermissions: true,
        distanceFilter: 50,
        stopOnTerminate: false,
        startOnBoot: true
      },
      (location: any, error: any) => {
        if (error) {
          console.error('Background error:', error);
          return;
        }

        this.sendLocation({
          userId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date(location.time).toISOString()
        });
      }
    );

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        console.log('App came to foreground');
      }
    });
  }

  private async storeUserId(userId: string) {
    const db = await this.getDB();
    await db.put('user-store', { id: 'current', userId });
  }

  private async sendLocation(data: any) {
    try {
      await LocationTracker({
        variables: {
          input: {
            ...data,
            userID: data.userId
          }
        }
      });
    } catch (error) {
      console.error('Background send failed:', error);
      await this.cacheLocation(data);
    }
  }

  private async cacheLocation(data: any) {
    const db = await this.getDB();
    await db.put('location-cache', {
      id: Date.now(),
      data,
      timestamp: new Date().toISOString()
    });
  }

  private getDB() {
    return openDB('tracking-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('user-store')) {
          db.createObjectStore('user-store', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('location-cache')) {
          db.createObjectStore('location-cache', { keyPath: 'id' });
        }
      }
    });
  }

  async stopTracking() {
    if (this.watcherId) {
      await BackgroundGeolocation.removeWatcher({ id: this.watcherId });
    }
  }
}    );

    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        console.log('App came to foreground');
      }
    });
  }

  private async storeUserId(userId: string) {
    const db = await this.getDB();
    await db.put('user-store', { id: 'current', userId });
  }

  private async sendLocation(data: any) {
    try {
      await LocationTracker({
        variables: {
          input: {
            ...data,
            userID: data.userId
          }
        }
      });
    } catch (error) {
      console.error('Background send failed:', error);
      await this.cacheLocation(data);
    }
  }

  private async cacheLocation(data: any) {
    const db = await this.getDB();
    await db.put('location-cache', {
      id: Date.now(),
      data,
      timestamp: new Date().toISOString()
    });
  }

  private getDB() {
    return openDB('tracking-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('user-store')) {
          db.createObjectStore('user-store', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('location-cache')) {
          db.createObjectStore('location-cache', { keyPath: 'id' });
        }
      }
    });
  }

  async stopTracking() {
    if (this.watcherId) {
      await BackgroundGeolocation.removeWatcher({ id: this.watcherId });
    }
  }
}
