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

  useEffect(() => {
    if (!from || !to) return;

    const router = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false
    });

    router.on('routesfound', function (e: any) {
      const summary = e.routes[0].summary;
      setDistance(summary.totalDistance / 1000); // in km
      setTime(summary.totalTime / 60); // in minutes
    });

    // Trigger routing without map
    (router as any)._router.route([
      L.latLng(from.lat, from.lng),
      L.latLng(to.lat, to.lng)
    ], (err: any, routes: any) => {
      if (!err && routes && routes.length > 0) {
        const summary = routes[0].summary;
        setDistance(summary.totalDistance / 1000); // km
        setTime(summary.totalTime / 60); // minutes
      }
    });
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
