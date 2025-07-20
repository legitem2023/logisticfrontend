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

// export const startWatchingLocation = (
//   onLocationUpdate: (location: LocationData) => void
// ): (() => void) | void => {
//   const MIN_UPDATE_INTERVAL = 5000; // 5 seconds
//   let lastUpdateTime = 0;

//   const handleUpdate = (position: Position) => {
//     const now = Date.now();
//     if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) return; // Throttle updates

//     lastUpdateTime = now;

//     const {
//       latitude,
//       longitude,
//       accuracy,
//       altitude,
//       speed,
//       heading,
//       altitudeAccuracy,
//     } = position.coords;

//     onLocationUpdate({
//       latitude,
//       longitude,
//       altitude: altitude ?? null,
//       accuracy,
//       altitudeAccuracy: altitudeAccuracy ?? null,
//       heading: heading ?? null,
//       speed: speed ?? null,
//       timestamp: position.timestamp,
//     });
//   };

//   if (Capacitor.isNativePlatform()) {
//     // Native mobile
//     let watchId: string;

//     const start = async () => {
//       watchId = await Geolocation.watchPosition(
//         { enableHighAccuracy: true },
//         (position, err) => {
//           if (err) {
//             console.error('Native location error:', err);
//             return;
//           }
//           if (position) handleUpdate(position);
//         }
//       );
//     };

//     start();

//     return () => {
//       if (watchId) Geolocation.clearWatch({ id: watchId });
//     };
//   } else if ('geolocation' in navigator) {
//     // Web browser
//     const watchId = navigator.geolocation.watchPosition(
//       handleUpdate,
//       (error) => console.error('Browser location error:', error),
//       {
//         enableHighAccuracy: true,
//         maximumAge: 0,
//         timeout: 10000,
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   } else {
//     console.error('Geolocation not supported');
//   }
// };
export const startWatchingLocation = (
  onLocationUpdate: (location: LocationData) => void,
  onError?: (error: Error) => void
): (() => void) | void => {
  const MIN_UPDATE_INTERVAL = 5000; // 5 seconds
  let lastUpdateTime = 0;

  const handleUpdate = (position: Position | GeolocationPosition) => {
    const now = Date.now();
    if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) return;

    lastUpdateTime = now;

    const coords = 'coords' in position ? position.coords : position;
    const timestamp = 'timestamp' in position ? position.timestamp : now;

    onLocationUpdate({
      latitude: coords.latitude,
      longitude: coords.longitude,
      altitude: coords.altitude ?? null,
      accuracy: coords.accuracy,
      altitudeAccuracy: coords.altitudeAccuracy ?? null,
      heading: coords.heading ?? null,
      speed: coords.speed ?? null,
      timestamp,
    });
  };

  if (Capacitor.isNativePlatform()) {
    let watchId: string;

    const start = async () => {
      try {
        watchId = await Geolocation.watchPosition(
          { enableHighAccuracy: true },
          (position, err) => {
            if (err) {
              onError?.(new Error(err.message));
              return;
            }
            if (position) handleUpdate(position);
          }
        );
      } catch (err) {
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    };

    start();

    return () => {
      if (watchId) Geolocation.clearWatch({ id: watchId });
    };
  } else if ('geolocation' in navigator) {
    const handleError = (error: GeolocationPositionError) => {
      onError?.(new Error(error.message));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleUpdate,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  } else {
    const error = new Error('Geolocation not supported');
    onError?.(error);
    console.error(error.message);
  }
};