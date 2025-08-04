import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';
import { openDB } from 'idb';

const dbPromise = openDB('locationDB', 1, {
  upgrade(db) {
    db.createObjectStore('locations', { autoIncrement: true });
    db.createObjectStore('user', { keyPath: 'id' });
  }
});

export async function startBackgroundTracking(userId) {
  // Store user ID
  const db = await dbPromise;
  await db.put('user', { id: 'current', userId });

  // Configure background tracking
  await BackgroundGeolocation.addWatcher({
    backgroundMessage: "Tracking your location",
    backgroundTitle: "MotoGo Active",
    requestPermissions: true,
    distanceFilter: 50,
  }, async (location, error) => {
    if (error) {
      console.error('Background error:', error);
      return;
    }

    const locationData = {
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: new Date().toISOString()
    };

    await db.add('locations', locationData);
    await sendLocationToAPI(locationData);
  });
}

async function sendLocationToAPI(data) {
  try {
    // Replace with your GraphQL mutation
    const response = await fetch('/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation TrackLocation($input: LocationInput!) {
            trackLocation(input: $input) {
              success
            }
          }
        `,
        variables: { input: data }
      })
    });
    
    if (!response.ok) throw new Error('Failed to send');
  } catch (error) {
    console.error('API Error:', error);
  }
}      }
    );

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
