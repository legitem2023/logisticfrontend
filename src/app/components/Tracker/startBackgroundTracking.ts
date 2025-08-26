import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { gql, ApolloClient } from '@apollo/client';

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

export const LOCATIONTRACKING = gql`
  mutation LocationTracking($input: LocationTrackingInput) {
    locationTracking(input: $input) {
      userID
      latitude
      longitude
      speed
      heading
      accuracy
      batteryLevel
      timestamp
    }
  }
`;

let watchId: string | number | null = null;

export const startBackgroundTracking = (
  userId: string,
  client: ApolloClient<any>,
  onError?: (error: Error) => void
): (() => void) | void => {
  const MIN_UPDATE_INTERVAL = 15000; // 15 seconds
  let lastUpdateTime = 0;

  const handleUpdate = async (position: Position | GeolocationPosition) => {
    const now = Date.now();
    if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) return;
    
    lastUpdateTime = now;
    
    const coords = 'coords' in position ? position.coords : position;
    const timestamp = 'timestamp' in position ? position.timestamp : now;
    
    try {
      await client.mutate({
        mutation: LOCATIONTRACKING,
        variables: {
          input: {
            userID: userId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed || 0,
            heading: coords.heading || 0,
            accuracy: coords.accuracy,
            batteryLevel: null,
            timestamp,
          },
        },
      });
      
      console.log('Location sent:', coords.latitude, coords.longitude);
    } catch (error) {
      console.error('Location tracking error:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // Setup background service for native platforms
  if (Capacitor.isNativePlatform()) {
    const setupBackgroundTracking = async () => {
      try {
        await BackgroundGeolocation.ready({
          reset: true,
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: -1,
          stopOnTerminate: false,
          startOnBoot: true,
          foregroundService: true,
        });

        await BackgroundGeolocation.start();

        // Start watching position
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

    setupBackgroundTracking();

    return () => {
      if (typeof watchId === 'string') {
        Geolocation.clearWatch({ id: watchId });
      }
      BackgroundGeolocation.stop();
    };
  } 
  // Web platform
  else if ('geolocation' in navigator) {
    const handleError = (error: GeolocationPositionError) => {
      onError?.(new Error(error.message));
    };

    watchId = navigator.geolocation.watchPosition(
      handleUpdate,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (typeof watchId === 'number') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  } 
  // Geolocation not supported
  else {
    const error = new Error('Geolocation not supported');
    onError?.(error);
    console.error(error.message);
  }
};

export const stopBackgroundTracking = () => {
  if (typeof watchId === 'string') {
    Geolocation.clearWatch({ id: watchId });
  } else if (typeof watchId === 'number') {
    navigator.geolocation.clearWatch(watchId);
  }
  
  if (Capacitor.isNativePlatform()) {
    BackgroundGeolocation.stop();
  }
  
  watchId = null;
};
