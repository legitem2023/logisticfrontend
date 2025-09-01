'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { selectRole } from '../../../Redux/roleSlice';
import Navigation from './Navigation';
import Footer from './Footer';
import { ActiveContentDisplay } from './ActiveContentDisplay';
import Loader from './Loadings/Loading';
export default function Menu() {
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);
  const useRole = useSelector(selectRole);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 sec delay
    return () => clearTimeout(timer);
  }, []);



useEffect(() => {
    // The httpOnly cookie is automatically sent with fetch requests
    fetch('/api/protected', {
      credentials: 'include' // Important: includes cookies
    })
      .then(response => {
        if (response.status === 401) {
          // Handle unauthorized access
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {console.log(data.user);
                    return data.user
                    })
      .catch(error => console.error('Error:', error))
      .finally(() => setLoading(false));
  }, []);


  
  const isUserActive = (): boolean => {
    //const token = Cookies.get('token');
    //return !!token;
    return fetch('/api/protected', {
      credentials: 'include' // Important: includes cookies
    })
      .then(response => {
        if (response.status === 401) {
          // Handle unauthorized access
          throw new Error('Unauthorized');
        }
        return response.json();
      })
      .then(data => {console.log(data.user);
                    return data.user
                    })
      .catch(error => console.error('Error:', error))
      .finally(() => setLoading(false));
  };

  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

  if (loading) {
    return (
      <Loader/>
    );
  } else {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation userRole={useRole} isUserActive={isUserActive} />
      <main className="p-0">
        <ActiveContentDisplay
          activeTab={GlobalactiveIndex}
          useRole={useRole}
          isUserActive={isUserActive}
        />
      </main>
      <Footer/>
    </div>
  );    
  }
}
