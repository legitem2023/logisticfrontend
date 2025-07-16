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

export default function RouteDistance({ from, to }: RouteDistanceProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    if (!from || !to || !L.Routing) return;

    const router = L.Routing.osrmv1(); // Use the routing engine directly

    router.route(
      [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      (err: any, routes: any) => {
        if (!err && routes && routes.length > 0) {
          const summary = routes[0].summary;
          setDistance(summary.totalDistance / 1000); // km
          setTime(summary.totalTime / 60); // minutes
        } else {
          console.error("Routing error:", err);
        }
      }
    );
  }, [from, to]);

  return (
    <div>
      {distance !== null && time !== null ? (
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
