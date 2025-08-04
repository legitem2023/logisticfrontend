import { gql, ApolloClient } from '@apollo/client';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

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

export const startBackgroundTracking = async (
  userId: string,
  client: ApolloClient<any>
) => {
  await BackgroundGeolocation.ready({
    reset: true,
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 1,
    stopOnTerminate: false,
    startOnBoot: true,
    autoSync: true,
    batchSync: true, // allow queued syncing
    maxBatchSize: 10,
    url: 'https://logisticbackend-bkc3.onrender.com/graphql',
    httpRootProperty: 'variables.input',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      input: {
        userID: userId,
      },
    },
  });

  BackgroundGeolocation.onLocation(async location => {
    const coords = location.coords;

    try {
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
            batteryLevel: location.battery.level,
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      console.error('Mutation error, will retry when online:', error);
    }
  });

  BackgroundGeolocation.start();
};
