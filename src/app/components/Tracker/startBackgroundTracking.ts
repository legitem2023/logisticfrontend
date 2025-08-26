import { gql, ApolloClient } from '@apollo/client';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { startWatchingLocation, LocationData } from './startWatchingLocation';

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

let stopWatching: (() => void) | null = null;

export const startBackgroundTracking = async (
  userId: string,
  client: ApolloClient<any>
) => {
  // Set up background service (required to keep app alive in background)
  await BackgroundGeolocation.ready({
    reset: true,
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: -1, // disable movement filtering
    stopOnTerminate: false,
    startOnBoot: true,
    foregroundService: true, // Android: keeps service alive visibly
  });

  // Start the background geolocation system
  await BackgroundGeolocation.start();

  // 📍 Start watching location instead of setInterval
  stopWatching = startWatchingLocation(
    async (location: LocationData) => {
      try {
        await client.mutate({
          mutation: LOCATIONTRACKING,
          variables: {
            input: {
              userID: userId,
              latitude: location.latitude,
              longitude: location.longitude,
              speed: location.speed,
              heading: location.heading,
              accuracy: location.accuracy,
              batteryLevel: null,
              timestamp: location.timestamp,
            },
          },
        });

        console.log('Location sent:', location.latitude, location.longitude);
      } catch (error) {
        console.error('Location tracking error:', error);
      }
    },
    (error: Error) => {
      console.error('Location watch error:', error);
    }
  );
};

export const stopBackgroundTracking = () => {
  if (stopWatching) {
    stopWatching();
    stopWatching = null;
  }
  BackgroundGeolocation.stop();
};
