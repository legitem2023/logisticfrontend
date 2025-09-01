'use client';
import Image from 'next/image';
import SenderSignupForm from "../../components/SenderSignupForm";
import Navigation from '../../components/Navigation';
import Footer from "../../components/Footer";

import { setRole, clearRole, selectRole } from '../../../../Redux/roleSlice';
import { useDispatch,useSelector } from 'react-redux';
import Cookies from 'js-cookie';
export default function Page() {
 const useRole = useSelector(selectRole); 
const isActiveUser = useSelector((state:any) => state.isActiveUser.isActiveUser);
 const isUserActive = (): boolean => {
    const token = Cookies.get('token');
    return !!token;
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation
      is_Active={isActiveUser}
      userRole={useRole}
      isUserActive={isUserActive}/>        
      {/* Sidebar with tab content */}
      <SenderSignupForm />
     <Footer/>
    </div>
  );
}
