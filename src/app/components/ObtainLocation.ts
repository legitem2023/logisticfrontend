export const startWatchingLocation = () =>{
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    return;
  }

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
      const timestamp = position.timestamp;

      console.log('--- Location Data ---');
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);
      console.log('Altitude:', altitude);
      console.log('Accuracy (horizontal):', accuracy);
      console.log('Accuracy (vertical):', altitudeAccuracy);
      console.log('Heading:', heading);
      console.log('Speed:', speed);
      console.log('Timestamp:', new Date(timestamp).toISOString());
      console.log('----------------------');

      // Optional: send this to your backend or state manager
      // sendLocationToServer({ latitude, longitude, ... })
    },
    (error) => {
      console.error('Error getting location:', error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
    console.log('Stopped watching location.');
  };
}
