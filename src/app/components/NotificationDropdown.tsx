'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Bell } from 'lucide-react'
import { GETNOTIFICATION } from '../../../graphql/query'
import {  capitalize, formatDate } from "../../../utils/decryptToken"; 
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

  const dropdownContent = (
    <>
      
      <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
        {loading ? (
          <li className="px-4 py-3 text-sm text-gray-500">Loading...</li>
        ) : error ? (
          <li className="px-4 py-3 text-sm text-red-500">Error loading notifications</li>
        ) : notifications.length > 0 ? (
          notifications.map((notif: any) => (
            <li
              key={notif.id}
              className="px-4 py-3 hover:bg-gray-100 transition"
            >
              <p className="text-sm font-medium text-gray-800">{notif.message}</p>
              <span className="text-xs text-gray-500 block mt-1">
                {formatDate(notif.createdAt)}
              </span>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-sm text-center text-gray-500">No new notifications</li>
        )}
      </ul>
    </>
  )

  return (
    <div className="absolute top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full border border-gray-200 shadow-xl bg-white/30 backdrop-blur hover:bg-white/50 transition"
        >
          <Bell className="w-5 h-5 text-gray-800" />
        </button>

        {open && (
          <>
            {/* Desktop */}
            <div className="absolute right-0 mt-2 w-80 bg-white/60 backdrop-blur border border-gray-200 rounded-2xl shadow-2xl overflow-hidden hidden sm:block">
              {dropdownContent}
            </div>

            {/* Mobile */}
            <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"
                onClick={() => setOpen(false)}
              ></div>

              {/* Slide-up panel */}
              <div className={`relative bg-white/70 backdrop-blur-xl border-t border-gray-200 rounded-t-2xl shadow-2xl max-h-[76vh] min-h-[75vh]  w-full overflow-y-auto transform transition-transform duration-1000 ${open ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                   <div className="text-lg font-semibold text-gray-800">Notifications</div>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-gray-800 text-xl"
                  >
                    &times;
                  </button>
                </div>
                {dropdownContent}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
