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

    const dummyMap = L.map(document.createElement('div')); // invisible map

    const control = L.Routing.control({
      waypoints: [
        L.latLng(from.lat, from.lng),
        L.latLng(to.lat, to.lng)
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
    }).addTo(dummyMap);

    control.on('routesfound', function (e: any) {
      const route = e.routes[0];
      const summary = route.summary;
      setDistance(summary.totalDistance / 1000); // in km
      setTime(summary.totalTime / 60); // in minutes
      setError(null);
    });

    control.on('routingerror', function () {
      setError('Failed to calculate route');
      setDistance(null);
      setTime(null);
    });

    return () => {
      dummyMap.remove();
    };
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
