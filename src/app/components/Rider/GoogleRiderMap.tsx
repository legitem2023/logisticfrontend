/// <reference types="@types/google.maps" />

import { useEffect, useRef } from "react";

export default function GoogleRiderMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 14.5995, lng: 120.9842 },
      zoom: 13,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: { lat: 14.5995, lng: 120.9842 },
        destination: { lat: 14.676, lng: 121.0437 },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
