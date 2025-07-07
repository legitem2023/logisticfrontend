'use client';

import { useEffect, useRef } from 'react';

const sender = { lat: 14.5995, lng: 120.9842 };
const receiver = { lat: 14.8874, lng: 120.3666 };

export default function DeliveryGoogleMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map>();
  const directionsRenderer = useRef<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (!window.google || !mapRef.current || mapInstance.current) return;

    // Create the map
    const map = new google.maps.Map(mapRef.current, {
      center: sender,
      zoom: 10,
    });
    mapInstance.current = map;

    // Add sender marker
    new google.maps.Marker({
      position: sender,
      map,
      icon: {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHYgpRPaXFg8x_RiFJXQRSXfxzmP8Ci1E18Q&s',
        scaledSize: new google.maps.Size(30, 30),
      },
      title: 'Rider',
    });

    // Add receiver marker
    new google.maps.Marker({
      position: receiver,
      map,
      icon: {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8ctukBNdRmOgtQjXzS2YP55ik9J2YtXFZg&s',
        scaledSize: new google.maps.Size(30, 30),
      },
      title: 'Dropzone',
    });

    // Add route
    const directionsService = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    directionsRenderer.current.setMap(map);

    directionsService.route(
      {
        origin: sender,
        destination: receiver,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.current!.setDirections(result);
        } else {
          console.error('Failed to fetch directions', status);
        }
      }
    );
  }, []);

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`}
        strategy="beforeInteractive"
      />
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100vh',
          maxHeight: '100dvh',
          position: 'relative',
          zIndex: 0,
        }}
      />
    </>
  );
}
