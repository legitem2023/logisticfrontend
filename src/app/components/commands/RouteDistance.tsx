import { useEffect, useState } from 'react';

type Coordinate = {
  lat: number;
  lng: number;
};

type RouteDistanceProps = {
  from: Coordinate;
  to: Coordinate;
};

export default function RouteDistance({ from, to }: RouteDistanceProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code !== 'Ok') {
          throw new Error('Route not found');
        }

        const route = data.routes[0];
        setDistance(route.distance / 1000); // in km
        setTime(route.duration / 60);       // in minutes
      } catch (err: any) {
        console.error(err);
        setError('Failed to calculate route');
      }
    };

    if (from && to) {
      fetchRoute();
    }
  }, [from, to]);

  return (
    <div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : distance !== null && time !== null ? (
        <div>
          <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
          <p><strong>Estimated Time:</strong> {time.toFixed(1)} minutes</p>
        </div>
      ) : (
        <p>Calculating route...</p>
      )}
    </div>
  );
}
