'use client';
import React, { useEffect, useState } from 'react';
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
  const [isActive, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5 sec delay
    return () => clearTimeout(timer);
  }, []);
/*
  useEffect(() => {
    // Ask your backend (api/protected) if the httpOnly cookie is valid
    const checkAuth = async () => {
      try {
  //      const res = await fetch("/api/protected", {
  //        credentials: "include", // send cookies
 //       });
//console.log(res);
       if (res.ok) {
          setActive(true); // cookie valid
        } else {
          setActive(false); // cookie invalid / missing
        }
      } catch (err) {
        console.error("Failed to check auth:", err);
        setActive(false);
      }
    };

   // checkAuth();
  }, []);
*/
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation userRole={useRole} isUserActive={isActive} />
        <main className="p-0">
          <ActiveContentDisplay
            activeTab={GlobalactiveIndex}
            useRole={useRole}
            isUserActive={isActive}
          />
        </main>
        <Footer />
      </div>
    );
  }
}
