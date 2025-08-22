'use client';
import React from 'react';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { selectRole } from '../../../Redux/roleSlice';
import Navigation from './Navigation';
import { ActiveContentDisplay } from './ActiveContentDisplay';

export default function Menu() {
  const dispatch = useDispatch();
  const globalUserId = useSelector(selectTempUserId);
  const useRole = useSelector(selectRole);
  
  const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };

  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation
        userRole={useRole}
        isUserActive={isUserActive}
      />
      <main className="p-0">
        <ActiveContentDisplay 
          activeTab={GlobalactiveIndex} 
          useRole={useRole} 
          isUserActive={isUserActive} 
        />
      </main>
    </div>
  );
}
