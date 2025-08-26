"use client";

import { useEffect, useRef, useState } from 'react';
import { LocationDB } from '@/lib/database';
import { LocationData } from '@/types';

declare global {
  interface Window {
    LocationTracker: any;
  }
}

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
    setServiceWorkerSupported(
      'serviceWorker' in navigator && 
      'SyncManager' in window
    );

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(console.error);
    }

    // Cleanup
    return () => {
      stopTracking();
    };
  }, []);

  const startTracking = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    try {
      // Request permissions
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'denied') {
        alert('Location permission denied. Please enable it in browser settings.');
        return;
      }

      // Request background sync permission
      if ('periodicSync' in navigator) {
        try {
          const status = await navigator.permissions.query({
            name: 'periodic-background-sync' as any,
          });
          if (status.state === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            await registration.periodicSync.register('location-periodic-sync', {
              minInterval: 15 * 60 * 1000, // 15 minutes
            });
          }
        } catch (error) {
          console.log('Periodic sync not supported:', error);
        }
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
          alert(`Location error: ${error.message}`);
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
        if (serviceWorkerSupported) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('location-sync');
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

  return (
    <div className="location-tracker">
      <h2>Background Location Tracker</h2>
      
      <div className="status">
        <p>Tracking: {isTracking ? 'Active' : 'Inactive'}</p>
        <p>Background Sync: {serviceWorkerSupported ? 'Supported' : 'Not Supported'}</p>
        {lastLocation && (
          <p>
            Last Location: {lastLocation.latitude.toFixed(6)}, {lastLocation.longitude.toFixed(6)}
          </p>
        )}
      </div>

      <div className="controls">
        {!isTracking ? (
          <button onClick={startTracking} className="start-btn">
            Start Background Tracking
          </button>
        ) : (
          <button onClick={stopTracking} className="stop-btn">
            Stop Tracking
          </button>
        )}
      </div>

      <div className="info">
        <p>This PWA will continue tracking in the background even when the browser is closed.</p>
        <p>Make sure to "Install" the app for best background performance.</p>
      </div>
    </div>
  );
}
