'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Bell } from 'lucide-react'
import { GETNOTIFICATION } from '../../../graphql/query'

export default function NotificationDropdown({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data, loading, error } = useQuery(GETNOTIFICATION, {
    variables: { getNotificationsId: userId },
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const notifications = data?.getNotifications || []

  // Extract dropdown content to avoid duplication
  const dropdownContent = (
    <>
      <div className="px-4 py-2 font-semibold text-gray-700 border-b">  
        Notifications  
      </div>  
      <ul className="max-h-64 overflow-y-auto divide-y sm:max-h-64">  
        {loading ? (  
          <li className="px-4 py-3 text-sm text-gray-500">Loading...</li>  
        ) : error ? (  
          <li className="px-4 py-3 text-sm text-red-500">  
            Error loading notifications  
          </li>  
        ) : notifications.length > 0 ? (  
          notifications.map((notif: any) => (  
            <li key={notif.id} className="px-4 py-3 hover:bg-gray-50">  
              <p className="text-sm text-gray-800">{notif.message}</p>  
              <span className="text-xs text-gray-500">  
                {new Date(notif.createdAt).toLocaleString()}  
              </span>  
            </li>  
          ))  
        ) : (  
          <li className="px-4 py-3 text-sm text-center text-gray-500">  
            No new notifications  
          </li>  
        )}  
      </ul>
    </>
  )

  return (
    <div className="absolute top-4 right-4 z-90" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-white p-2 rounded-full backdrop-blur bg-white/40 border border-gray-200 shadow-lg hover:bg-white/60 transition"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {open && (
          <>
            {/* Desktop version - remains unchanged */}
            <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg overflow-hidden hidden sm:block">  
              {dropdownContent}
            </div>

            {/* Mobile version - slide up from bottom */}
            <div className="fixed inset-0 z-50 sm:hidden">
              {/* Backdrop overlay */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setOpen(false)}
              />
              
              {/* Slide-up panel */}
              <div className="fixed inset-x-0 bottom-0 bg-white border-t rounded-t-xl max-h-[70vh] overflow-y-auto animate-slide-up">
                <div className="sticky top-0 bg-white flex justify-between items-center px-4 py-2 border-b">
                  <div className="font-semibold text-gray-700">Notifications</div>
                  <button 
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div>
                  {dropdownContent}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
