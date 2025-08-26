"use client";

import { useEffect, useRef, useState } from 'react';
import { LocationDB } from '@/lib/database';
import { LocationData } from '@/types';

export default function LocationTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocationData | null>(null);
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const dbRef = useRef<LocationDB | null>(null);

  useEffect(() => {
    // Initialize database
    dbRef.current = new LocationDB();
    dbRef.current.init();

    // Check for service worker support
    const hasServiceWorker = 'serviceWorker' in navigator;
    const hasBackgroundSync = 'SyncManager' in window;
    setServiceWorkerSupported(hasServiceWorker && hasBackgroundSync);

    // Register service worker
    if (hasServiceWorker) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(console.error);
    }

    // Start tracking immediately
    startTracking();

    // Cleanup
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported by this browser');
      return;
    }

    try {
      // Request permissions
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        console.warn('Location permission denied');
        return;
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            timestamp: position.timestamp,
          };

          setLastLocation(location);
          await sendLocation(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 10000,
        }
      );

      setIsTracking(true);
      console.log('Location tracking started');
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    console.log('Location tracking stopped');
  };

  const sendLocation = async (location: LocationData) => {
    try {
      // Get token from cookies or storage
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No authentication token found');
      }

      const locationWithToken = { ...location, token };

      if (navigator.onLine) {
        // Try to send immediately
        const response = await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationWithToken),
        });

        if (!response.ok) {
          throw new Error('Failed to send location');
        }

        console.log('Location sent successfully');
      } else {
        // Store offline
        await dbRef.current?.addLocation({
          ...locationWithToken,
          synced: false,
          createdAt: Date.now(),
        });
        console.log('Location stored offline');

        // Register for background sync
        if (serviceWorkerSupported && 'sync' in navigator.serviceWorker) {
          try {
            const registration = await navigator.serviceWorker.ready;
            if (registration.sync) {
              await registration.sync.register('location-sync');
              console.log('Background sync registered');
            }
          } catch (syncError) {
            console.log('Background sync not supported:', syncError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to send location:', error);
      // Store for later retry
      await dbRef.current?.addLocation({
        ...location,
        token: document.cookie
          .split('; ')
          .find(row => row.startsWith('token='))
          ?.split('=')[1],
        synced: false,
        createdAt: Date.now(),
      });
    }
  };

  // ✅ Auto-run tracking, no UI
  return null;
}
