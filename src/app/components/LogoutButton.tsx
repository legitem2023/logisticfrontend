'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (!confirmLogout) {
      return
    }
    Cookies.remove('token') // Clear the auth token
    window.location.reload();
  }

  return (
    <Button className="w-full text-white bg-red-600 hover:bg-red-700" onClick={handleLogout}>
      Logout
    </Button>
  )
}
