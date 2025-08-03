import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';
import { App } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';

class LocationService {
  private isTracking = false;
  private watcherId: string | null = null;

  async startTracking(userId: string) {
    if (this.isTracking) return;

    // Configure background tracking
    await BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: "MotoGo is tracking your location for deliveries",
        backgroundTitle: "MotoGo Active Tracking",
        requestPermissions: true,
        stale: false,
        distanceFilter: 50, // Update every 50 meters
        stopOnTerminate: false, // Continue after app close
        startOnBoot: true,    // Start on device reboot
      },
      (location) => {
        this.sendLocationToServer(userId, {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          speed: location.speed,
          heading: location.heading,
          timestamp: new Date(location.time).getTime(),
          batteryLevel: null
        });
      }
    ).then((id) => {
      this.watcherId = id;
      this.isTracking = true;
    });

    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        // App came to foreground - get fresh location
        this.getCurrentLocation(userId);
      }
    });
  }

  async stopTracking() {
    if (this.watcherId) {
      await BackgroundGeolocation.removeWatcher({ id: this.watcherId });
      this.isTracking = false;
      this.watcherId = null;
    }
  }

  private async sendLocationToServer(userId: string, location: any) {
    try {
      // Your existing mutation logic here
      await LocationTracker({
        variables: {
          input: {
            ...location,
            userID: userId
          }
        }
      });
    } catch (error) {
      console.error('Location update failed:', error);
      // Implement retry logic or local storage fallback
    }
  }

  private async getCurrentLocation(userId: string) {
    const position = await Geolocation.getCurrentPosition();
    this.sendLocationToServer(userId, {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: new Date().getTime(),
      batteryLevel: null
    });
  }
}

export const locationService = new LocationService();
