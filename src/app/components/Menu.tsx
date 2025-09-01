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
const [isActive,setActive] = useState(false);
const [loading, setLoading] = useState(true);

useEffect(() => {
const timer = setTimeout(() => setLoading(false), 1500); // 1.5 sec delay
return () => clearTimeout(timer);
}, []);

const isUserActive = ():boolean => {
const result = Cookies.get("token");
return !!result;
};
const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);

if (loading) {
return (
<Loader/>
);
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
<Footer/>
</div>
);
}
}

