'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { useSelector, useDispatch } from "react-redux";
import { setActiveIndex } from '../../../Redux/activeIndexSlice';

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) {
      return
    }
    Cookies.remove('token') // Clear the auth token
    window.location.reload();
    dispatch(setActiveIndex(12));
  }

  return (
    <Button className="w-full text-white bg-red-600 hover:bg-red-700" onClick={handleLogout}>
      Logout
    </Button>
  )
}
