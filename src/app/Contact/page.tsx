'use client';
import Image from 'next/image';
import Navigation from "../components/Navigation';
import LogisticContactFormPage from "../components/LogisticContactFormPage";
import { setRole, clearRole, selectRole } from '../../../Redux/roleSlice';
import { useDispatch,useSelector } from 'react-redux';
import Cookies from 'js-cookie';
export default function Page() {
const useRole = useSelector(selectRole); 
const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation
      userRole={useRole}
      isUserActive={isUserActive}/>       
      {/* Sidebar with tab content */}
      <LogisticContactFormPage />
    </div>
  );
}
