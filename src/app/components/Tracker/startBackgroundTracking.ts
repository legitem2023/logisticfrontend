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

let intervalId: any = null;

export const startBackgroundTracking = async (
  userId: string,
  client: ApolloClient<any>
) => {
  await BackgroundGeolocation.ready({
    reset: true,
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: -1, // disable distance-based filtering
    stopOnTerminate: false,
    startOnBoot: true,
    autoSync: false, // handled manually
  });

  // Start background geolocation service
  BackgroundGeolocation.start();

  // Optional: listen for battery level updates (to include in mutation)
  let batteryLevel = null;
  BackgroundGeolocation.onBatteryChange(event => {
    batteryLevel = event.level;
  });

  // 🔁 Start sending coordinates every 15 seconds
  intervalId = setInterval(async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
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
            batteryLevel: batteryLevel ?? null,
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      console.error('Error tracking location:', error);
    }
  }, 15000); // 15 seconds
};

export const stopBackgroundTracking = () => {
  if (intervalId) clearInterval(intervalId);
  BackgroundGeolocation.stop();
};
