export const startTrackingLocation = (everyMs = 5000) => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser.');
    return;
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed } = position.coords;
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

        // You can send this to your backend here
        // sendLocationToServer({ latitude, longitude, ... })
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initial call
  getLocation();

  // Repeat every 5 seconds
  const intervalId = setInterval(getLocation, everyMs);

  return () => clearInterval(intervalId); // Call this to stop tracking
}
