import { useEffect, useRef, useState } from 'react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !from || !to) return;

    if (leafletMap.current) {
      leafletMap.current.remove();
    }

    const map = L.map(mapRef.current).setView([from.lat, from.lng], 13);
    leafletMap.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      show: false,
      createMarker: () => undefined,
    })
      .on('routesfound', function (e: any) {
        const summary = e.routes[0].summary;
        setDistance((summary.totalDistance / 1000)); // in km
        setTime((summary.totalTime / 60)); // in minutes
      })
      .addTo(map);

    return () => {
      map.remove();
    };
  }, [from, to]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '300px', width: '100%' }} />
      {distance !== null && time !== null && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Distance:</strong> {distance.toFixed(2)} km</p>
          <p><strong>Estimated Time:</strong> {time.toFixed(1)} minutes</p>
        </div>
      )}
    </div>
  );
}
