'use client'
import LogisticsFAQPage from "../components/LogisticsFAQPage";
import Navigation from '../components/Navigation';
import { setRole, clearRole, selectRole } from '../../../Redux/roleSlice';
import { useDispatch,useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Footer from "../components/Footer";

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
      <LogisticsFAQPage/>
     <Footer/>
    </div>
  );
}
