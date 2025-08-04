import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';

const startBackgroundTracking = (userId: string) => {
  BackgroundGeolocation.ready({
    reset: true,
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 50,
    stopOnTerminate: false,
    startOnBoot: true,
    autoSync: true,
    url: 'https://logisticbackend-bkc3.onrender.com/graphql', // your GraphQL endpoint
    httpRootProperty: 'variables.input',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      input: {
        userID: userId, // sent along with every location update
      },
    },
  }).then(state => {
    if (!state.enabled) {
      BackgroundGeolocation.start();
    }
  });

  // Optional: listen to locations locally
  BackgroundGeolocation.onLocation(location => {
    console.log('BG Location:', location);
  });
};
