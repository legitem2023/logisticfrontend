// components/GlobalScripts.jsx
/*
'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useSubscription } from '@apollo/client';
import { LOCATIONTRACKING } from '../../../graphql/mutation';
import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken } from '../../../utils/decryptToken';
import { startWatchingLocation } from './ObtainLocation';
import { setCurrentLocation } from '../../../Redux/locationSlice';
import { setTempUserId, selectTempUserId } from '../../../Redux/tempUserSlice';
import { setUsername } from '../../../Redux/usernameSlice';
import { setRole, selectRole } from '../../../Redux/roleSlice';

// Throttle function implementation
function throttle(func, limit) {
  let timeoutId = null;
  let lastRan = 0;

  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export default function GlobalScripts() {
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);
  const useRole = useSelector(selectRole);

  const [LocationTracker] = useMutation(LOCATIONTRACKING, {
    onCompleted: (data) => {
      console.log("Location tracking mutation success:", data);
    },
    onError: (err) => {
      console.error("Location tracking error:", err.message);
    },
  });


 
  // Get user role from token
  useEffect(() => {
    const getRole = async () => {
      try {
        const token = fetch('/api/protected', {
                        credentials: 'include' // Important: includes cookies
                      }).then(response => {
                   if (response.status === 401) {
                      // Handle unauthorized access
                       throw new Error('Unauthorized');
                    }
                    return response.json();
                   }).then(data => {
                    return data?.user; 
                   }).catch(error => console.error('Error:', error)).finally(() => {});
        //Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          dispatch(setRole(payload.role));
          dispatch(setTempUserId(payload.userId));
          dispatch(setUsername(payload.name));
        }
      } catch (err) {
        console.error('Error getting role:', err);
      }
    };
    getRole();
  }, [dispatch]);

  // Location tracking
  useEffect(() => {
    if (!globalUserId) return;

    const throttledUpdate = throttle((location) => {
      dispatch(setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      }));
      
      LocationTracker({
        variables: {
          input: {
            accuracy: location.accuracy,
            batteryLevel: null,
            heading: location.heading,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            timestamp: location.timestamp.toString(),
            userID: globalUserId,
          },
        },
      }).catch((error) => {
        console.error('Location tracking failed:', error);
      });
    }, 10000);

    const stopWatching = startWatchingLocation(throttledUpdate);

    return () => {
      if (typeof stopWatching === 'function') {
        stopWatching();
      }
    };
  }, [globalUserId, dispatch, LocationTracker]);

  // Location subscription
  useSubscription(LocationTracking, {
    variables: { userID: globalUserId },
  });

  // This component doesn't render anything
  return null;
}
*/

// components/GlobalScripts.jsx
'use client';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { useMutation, useSubscription } from '@apollo/client';
//import { LOCATIONTRACKING } from '../../../graphql/mutation';
//import { LocationTracking } from '../../../graphql/subscription';
import { decryptToken } from '../../../utils/decryptToken';
//import { startWatchingLocation } from './ObtainLocation';
import { setCurrentLocation } from '../../../Redux/locationSlice';
import { setTempUserId, selectTempUserId } from '../../../Redux/tempUserSlice';
import { setUsername } from '../../../Redux/usernameSlice';
import { setRole, selectRole } from '../../../Redux/roleSlice';

export default function GlobalScripts() {
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);
  const useRole = useSelector(selectRole);

  // Get user role from token via API
  useEffect(() => {
    const getRole = async () => {
      try {
        const response = await fetch('/api/protected', {
          credentials: 'include' // Important: includes cookies
        });
        
        if (response.status === 401) {
          // Handle unauthorized access
          throw new Error('Unauthorized');
        }
        
        const data = await response.json();
        const token = data?.token || data?.user?.token;
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
        
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          dispatch(setRole(payload.role));
          dispatch(setTempUserId(payload.userId));
          dispatch(setUsername(payload.name));
        }
      } catch (err) {
        console.error('Error getting role:', err);
      }
    };
    getRole();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}
