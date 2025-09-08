"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { LocationDB } from '@/lib/database';
import { LocationData } from '@/types';
import { decryptToken } from '../../../utils/decryptToken';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentLocation } from '../../../Redux/locationSlice';

// Battery-friendly configuration
const LOCATION_CONFIG = {
  ACTIVE: {
    enableHighAccuracy: true,
    maximumAge: 10000, // 10 seconds
    timeout: 10000,
  },
  BACKGROUND: {
    enableHighAccuracy: false, // Lower accuracy in background
    maximumAge: 60000, // 1 minute
    timeout: 15000,
  },
  BATTERY_SAVER: {
    enableHighAccuracy: false,
    maximumAge: 120000, // 2 minutes
    timeout: 20000,
  }
};

export default function LocationTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [appState, setAppState] = useState<'active' | 'background' | 'hidden'>('active');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const dbRef = useRef<LocationDB | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const dispatch = useDispatch();
  // Memoized functions to avoid dependency issues
  const setupBatteryMonitoring = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        // @ts-expect-error - Battery API is experimental
        const battery = await navigator.getBattery();
        setBatteryLevel(battery.level * 100);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
        });
      } catch (error) {
        console.log('Battery API not supported');
      }
    }
  }, []);

  const getCurrentConfig = useCallback(() => {
    // If battery is critically low, use battery saver regardless of app state
    if (batteryLevel !== null && batteryLevel < 20) {
      return LOCATION_CONFIG.BATTERY_SAVER;
    }

    // Use appropriate config based on app state
    switch (appState) {
      case 'active':
        return LOCATION_CONFIG.ACTIVE;
      case 'background':
      case 'hidden':
        return LOCATION_CONFIG.BACKGROUND;
      default:
        return LOCATION_CONFIG.ACTIVE;
    }
  }, [appState, batteryLevel]);

  const getTokenFromAPI = useCallback(async (): Promise<string> => {
    const response = await fetch('/api/protected', {
      credentials: 'include' // Important: includes cookies
    });
    
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    const data = await response.json();
    const token = data?.user;
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return token;
  }, []);

  const sendLocation = useCallback(async (location: LocationData) => {
    try {
      const token = await getTokenFromAPI();
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

      } else {
        // Store offline
        await dbRef.current?.addLocation({
          ...locationWithToken,
          synced: false,
          createdAt: Date.now(),
        });
        console.log('Location stored offline');

        // Register for background sync
        if ('serviceWorker' in navigator && 'sync' in navigator.serviceWorker) {
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
      // Store for later retry without token (will need to fetch token when syncing)
      await dbRef.current?.addLocation({
        ...location,
        synced: false,
        createdAt: Date.now(),
      });
    }
  }, [getTokenFromAPI]);

  const restartTrackingWithConfig = useCallback((state: string) => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      startTrackingWithConfig(state);
    }
  }, []);

  const startTrackingWithConfig = useCallback((state: string) => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported by this browser');
      return;
    }

    const config = getCurrentConfig();

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const now = Date.now();
          
          // Throttle updates in background mode
          if (state !== 'active' && (now - lastUpdateRef.current) < 30000) {
            return; // Skip update if less than 30 seconds since last update in background
          }

          lastUpdateRef.current = now;
        
          try {
            dispatch(setCurrentLocation({
              longitude:position.coords.longitude,
              latitude:position.coords.latitude
            }))
            const token = await getTokenFromAPI();
            const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
            const payload = await decryptToken(token, secret);
            const location: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              heading: position.coords.heading,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              timestamp: position.timestamp,
              userId: payload.userId,
              token:token
            };

            await sendLocation(location);
          } catch (error) {
            console.error('Failed to get token or process location:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          // If we get a timeout error in background, try with less frequent updates
          if (error.code === error.TIMEOUT && state !== 'active') {
            setTimeout(() => restartTrackingWithConfig('background'), 5000);
          }
        },
        config
      );

      setIsTracking(true);
      //console.log('Location tracking started in mode:', state);
    } catch (error) {
      console.error('Failed to start tracking:', error);
    }
  }, [getCurrentConfig, sendLocation, restartTrackingWithConfig, getTokenFromAPI]);

  const startTracking = useCallback(() => {
    startTrackingWithConfig(appState);
  }, [appState, startTrackingWithConfig]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    console.log('Location tracking stopped');
  }, []);

  useEffect(() => {
    // Initialize database
    dbRef.current = new LocationDB();
    dbRef.current.init();

    // Check for service worker support
    const hasServiceWorker = 'serviceWorker' in navigator;

    // Register service worker
    if (hasServiceWorker) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(console.error);
    }

    // Setup visibility change detection
    const handleVisibilityChange = () => {
      const newState = document.hidden ? 'background' : 'active';
      setAppState(newState);
      console.log('App state changed to:', newState);
      
      // Restart tracking with appropriate config
      if (isTracking) {
        restartTrackingWithConfig(newState);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Detect page hide/show (for mobile)
    const handlePageHide = () => {
      setAppState('hidden');
      if (isTracking) {
        restartTrackingWithConfig('background');
      }
    };

    const handlePageShow = () => {
      setAppState('active');
      if (isTracking) {
        restartTrackingWithConfig('active');
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    // Setup battery monitoring
    setupBatteryMonitoring();

    // Start tracking immediately
    startTracking();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      stopTracking();
    };
  }, [startTracking, stopTracking, restartTrackingWithConfig, setupBatteryMonitoring, isTracking]);

  // ✅ Auto-run tracking, no UI
  return null;
}
