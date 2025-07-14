'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'

const notifications = [
  { id: 1, message: 'New order received!', time: '2 mins ago' },
  { id: 2, message: 'Package delivered successfully.', time: '10 mins ago' },
  { id: 3, message: 'Driver is en route.', time: '30 mins ago' },
]

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
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

  return (
    <div className="absolute top-4 right-4 z-90" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg overflow-hidden">
            <div className="px-4 py-2 font-semibold text-gray-700 border-b">
              Notifications
            </div>
            <ul className="max-h-64 overflow-y-auto divide-y">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <li key={notif.id} className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-center text-gray-500">
                  No new notifications
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
