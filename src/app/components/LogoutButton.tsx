/*'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux"
import { setActiveIndex } from '../../../Redux/activeIndexSlice'
import { persistor } from '../../../Redux/store' // Import the persistor

export default function LogoutButton() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    const confirmLogout = confirm('Are you sure you want to logout?')
    if (!confirmLogout) {
      return
    }
    
    setIsLoggingOut(true)
    
    try {
      // Clear the auth token
      Cookies.remove('token')
      
      // Dispatch the action to update Redux state
      dispatch(setActiveIndex(12))
      
      // Since we're only persisting activeIndex, we can use flush instead of purge
      // This writes the current state to storage immediately
      await persistor.flush()
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirect to login or home page
      //router.push('/login')
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback to reload if something goes wrong
      window.location.reload()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button 
      className={`w-full text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
        isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </>
      ) : (
        'Logout'
      )}
    </button>
  )
}

'use client'

import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux"
import { setActiveIndex } from '../../../Redux/activeIndexSlice'
import { persistor } from '../../../Redux/store'

export default function LogoutButton() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    const confirmLogout = confirm('Are you sure you want to logout?')
    if (!confirmLogout) {
      return
    }
    
    setIsLoggingOut(true)
    
    try {
      // Clear all authentication-related cookies
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      Cookies.remove('session')
      
      // Clear localStorage and sessionStorage (optional)
      localStorage.clear()
      sessionStorage.clear()
      
      // Dispatch the action to update Redux state
      dispatch(setActiveIndex(12))
      
      // Flush Redux persistor to save state immediately
      await persistor.flush()
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirect to home page or login
      window.location.href = '/' // or '/login'
      
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback - just reload the page
      window.location.reload()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <button 
      className={`w-full text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
        isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </>
      ) : (
        'Logout'
      )}
    </button>
  )
}
*/
// components/LogoutButton.tsx
'use client';
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useDispatch } from "react-redux"
import { setActiveIndex } from '../../../Redux/activeIndexSlice'
import { persistor } from '../../../Redux/store' // Import the persistor

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
 const router = useRouter()
  const dispatch = useDispatch()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    const confirmLogout = confirm('Are you sure you want to logout?')
    if (!confirmLogout) {
      return
    }
    
    setIsLoggingOut(true)
    
    await signOut({
      redirect: true,
      callbackUrl: '/', // Redirect to home after logout
    });
  };

  return (
    <button 
      className={`w-full text-white bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center ${
        isLoggingOut ? 'opacity-70 cursor-not-allowed' : ''
      }`}

      disabled={isLoggingOut}
      onClick={handleLogout}>
      Logout
    </button>
  );
}
