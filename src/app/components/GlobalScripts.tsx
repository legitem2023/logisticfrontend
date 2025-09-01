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
import { setIsActiveUser } from '../../../Redux/isActiveUserSlice';
export default function GlobalScripts() {
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);
  const useRole = useSelector(selectRole);
  const active = useSelector((state:any) => state.isActiveUser);
  // Get user role from token via API
  console.log(active,"session cookie");
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
        const token = data?.user;
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
        //console.log(data.user,"Towken");
        if (token && secret) {
          const isValidToken = (data?.user && typeof data.user === "string" && data.user.length > 20) ? true: false;
          const payload = await decryptToken(token, secret);
          dispatch(setRole(payload.role));
          dispatch(setTempUserId(payload.userId));
          dispatch(setUsername(payload.name));
          dispatch(setIsActiveUser(isValidToken));
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
