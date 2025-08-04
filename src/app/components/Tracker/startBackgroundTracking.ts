import { gql, ApolloClient } from '@apollo/client';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { Geolocation } from '@capacitor/geolocation';

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

let intervalId: NodeJS.Timeout | null = null;

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

  // Monitor battery level (optional)
  let batteryLevel: number | null = null;
  /*BackgroundGeolocation.onBatteryChange(event => {
    batteryLevel = event.level;
  });*/

  // 🕒 Run every 15 seconds
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const coords = position.coords;

      await client.mutate({
        mutation: LOCATIONTRACKING,
        variables: {
          input: {
            userID: userId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            speed: coords.speed,
            heading: coords.heading,
            accuracy: coords.accuracy,
            batteryLevel: null,
            timestamp: Date.now(),
          },
        },
      });

      console.log('Location sent:', coords.latitude, coords.longitude);
    } catch (error) {
      console.error('Location tracking error:', error);
    }
  }, 15000); // 🔁 15-second interval
};

export const stopBackgroundTracking = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  BackgroundGeolocation.stop();
};
