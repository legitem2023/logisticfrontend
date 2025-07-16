import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

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
    if (!from || !to) return;

    // Create routing service
    const router = L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1'
    });

    // Create Waypoints instead of LatLng
    const waypoints = [
      L.Routing.waypoint(L.latLng(from.lat, from.lng)), // FIXED: Use Waypoint
      L.Routing.waypoint(L.latLng(to.lat, to.lng))      // FIXED: Use Waypoint
    ];

    router.route(waypoints, (err, routes) => {
      if (err) {
        setError('Failed to calculate route');
        setDistance(null);
        setTime(null);
        return;
      }

      if (routes && routes.length > 0) {
        const summary = routes[0].summary;
        setDistance(summary.totalDistance / 1000); // Convert to km
        setTime(summary.totalTime / 60); // Convert to minutes
        setError(null);
      }
    });
  }, [from, to]);

  return (
    <div className="route-calculator">
      {error ? (
        <p className="error">Error: {error}</p>
      ) : distance !== null && time !== null ? (
        <div>
          <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
          <p><strong>Travel Time:</strong> {time.toFixed(1)} minutes</p>
        </div>
      ) : (
        <p>Calculating route...</p>
      )}
    </div>
  );
}
