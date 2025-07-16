import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

type Coordinate = {
  lat: number;
  lng: number;
};

type RouteDistanceProps = {
  from: Coordinate;
  to: Coordinate;
};

// Helper function to validate coordinates
const RouteDistance = (coord: Coordinate): boolean => {
  return (
    coord &&
    typeof coord.lat === 'number' &&
    typeof coord.lng === 'number' &&
    !isNaN(coord.lat) &&
    !isNaN(coord.lng) &&
    Math.abs(coord.lat) <= 90 &&
    Math.abs(coord.lng) <= 180
  );
};

export default function RouteDistance({ from, to }: RouteDistanceProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when inputs change
    setDistance(null);
    setTime(null);
    setError(null);

    // Validate inputs
    if (!isValidCoordinate(from) || !isValidCoordinate(to)) {
      setError('Invalid coordinates');
      return;
    }

    // Check if routing library is loaded
    if (!L.Routing?.osrmv1) {
      setError('Routing engine not available');
      return;
    }

    const router = L.Routing.osrmv1();
    let isMounted = true;

    router.route(
      [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      (err: any, routes: any) => {
        if (!isMounted) return;
        
        if (err) {
          setError('Routing error: ' + err.message);
          return;
        }

        if (!routes || routes.length === 0) {
          setError('No route found');
          return;
        }

        const summary = routes[0].summary;
        setDistance(summary.totalDistance / 1000); // Convert to km
        setTime(summary.totalTime / 60); // Convert to minutes
      }
    );

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [from, to]);

  return (
    <div>
      {error ? (
        <p className="error">Error: {error}</p>
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
