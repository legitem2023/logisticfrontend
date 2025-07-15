import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

export type LocationData = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
};

export const startWatchingLocation = (
  onLocationUpdate: (location: LocationData) => void
): (() => void) | void => {
  if (Capacitor.isNativePlatform()) {
    // Mobile (native)
    let watchId: string;

    const start = async () => {
      watchId = await Geolocation.watchPosition({}, (position, err) => {
        if (err) {
          console.error("Native location error:", err);
          return;
        }
        if (position) {
          const {
            latitude,
            longitude,
            accuracy,
            altitude,
            speed,
            heading,
            altitudeAccuracy,
          } = position.coords;

          onLocationUpdate({
            latitude,
            longitude,
            altitude: altitude ?? null,
            accuracy,
            altitudeAccuracy: altitudeAccuracy ?? null,
            heading: heading ?? null,
            speed: speed ?? null,
            timestamp: position.timestamp,
          });
        }
      });
    };

    start();

    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  } else if ("geolocation" in navigator) {
    // Web browser
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          altitude,
          accuracy,
          altitudeAccuracy,
          heading,
          speed,
        } = position.coords;

        onLocationUpdate({
          latitude,
          longitude,
          altitude,
          accuracy,
          altitudeAccuracy,
          heading,
          speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error("Browser location error:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  } else {
    console.error("Geolocation not supported");
  }
};
