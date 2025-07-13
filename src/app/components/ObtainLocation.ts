// ObtainLocation.ts
export const startWatchingLocation = (onLocationUpdate: (location: any) => void) => {
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

      onLocationUpdate({
        latitude,
        longitude,
        altitude,
        accuracy,
        altitudeAccuracy,
        heading,
        speed,
        timestamp,
        batteryLevel: null, // fallback if needed
      });
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
};
