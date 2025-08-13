'use client'

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Bell, Trash2 } from 'lucide-react';
import { GETNOTIFICATION } from '../../../graphql/query';
import { capitalize, formatDate } from "../../../utils/decryptToken";
import { Badge } from './ui/Badge'
import { READNOTIFICATION, DELETENOTIFICATION } from '../../../graphql/mutation';
import { useSelector,useDispatch } from "react-redux";
import { setActiveIndex } from '../../../Redux/activeIndexSlice';

export default function NotificationDropdown({ userId }: { userId: string | null }) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()

  const { data, loading, error } = useQuery(GETNOTIFICATION, {
    variables: { getNotificationsId: userId },
    skip: !userId,
    fetchPolicy: 'cache-and-network'
  })

  const [readNotification] = useMutation(READNOTIFICATION, {
    refetchQueries: userId ? [{
      query: GETNOTIFICATION,
      variables: { getNotificationsId: userId },
    }] : [],
  })

  const [deleteNotification] = useMutation(DELETENOTIFICATION, {
    onError: (err: any) => {
      console.log(err);
    },
    refetchQueries: userId ? [{
      query: GETNOTIFICATION,
      variables: { getNotificationsId: userId },
    }] : [],
  })

  const handleDelete = (id: string) => {
    deleteNotification({ variables: { notificationId: id } });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!userId) setOpen(false)
  }, [userId])

  const notifications = data?.getNotifications || []
  const unreadNotifications = notifications.filter((notif: any) => !notif.isRead)
  const hasNotifications = notifications.length > 0
  const hasUnread = unreadNotifications.length > 0

  const handleNotificationClick = (id: string) => {
    if (userId) {
      readNotification({ variables: { notificationId: id } })
      dispatch(setActiveIndex(2))
    }
  }

  const sortedNotifications = [...notifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const dropdownContent = (
    <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
      {!userId ? (
        <li className="px-4 py-3 text-sm text-center text-gray-500">
          Please sign in to view notifications
        </li>
      ) : loading ? (
        <li className="px-4 py-3 text-sm text-gray-500">Loading...</li>
      ) : error ? (
        <li className="px-4 py-3 text-sm text-red-500">
          Error loading notifications
        </li>
      ) : hasNotifications ? (
        sortedNotifications.map((notif: any) => (
          <li
            key={notif.id}
            className="px-4 py-3 hover:bg-gray-100 transition flex justify-between items-start gap-2"
          >
            <div
              className="flex-1 cursor-pointer"
              onClick={() => handleNotificationClick(notif.id)}
            >
              <p className={`text-sm font-medium ${notif.isRead ? 'text-gray-500' : 'text-gray-900 font-bold'}`}>
                {notif.message}
              </p>
              <span className={`text-xs text-gray-500 block mt-1 ${notif.isRead ? '' : 'font-bold'}`}>
                {formatDate(notif.createdAt)}
              </span>
            </div>
            <button
              onClick={() => handleDelete(notif.id)}
              className="text-gray-400 hover:text-red-600"
              title="Delete notification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))
      ) : (
        <li className="px-4 py-3 text-sm text-center text-gray-500">
          No notifications available
        </li>
      )}
    </ul>
  )

  return (
    <div className="z-50" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => userId && setOpen(!open)}
          className={`p-2 rounded-full border border-gray-200 shadow-xl transition ${
            userId
              ? 'bg-white/30 backdrop-blur hover:bg-white/50 cursor-pointer'
              : 'bg-gray-100 cursor-not-allowed'
          }`}
          aria-label="Notifications"
          disabled={!userId}
        >
          {userId && hasUnread ? (
            <>
              <Bell className="w-5 h-5 text-red-500" />
              <Badge className="absolute top-[-5px] right-[-15px] bg-red-500 text-white">
                {unreadNotifications.length}
              </Badge>
            </>
          ) : (
            <Bell className={`w-5 h-5 ${userId ? 'text-gray-600' : 'text-gray-400'}`} />
          )}
        </button>

        {open && (
          <>
            {/* Desktop */}
            <div className="absolute right-0 mt-2 w-80 bg-white/60 backdrop-blur border border-gray-200 rounded-2xl shadow-2xl overflow-hidden hidden sm:block">
              {dropdownContent}
            </div>

            {/* Mobile */}
            <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)]"
                onClick={() => setOpen(false)}
              />
              <div className="relative bg-white/70 backdrop-blur-xl border-t border-gray-200 rounded-t-2xl shadow-2xl max-h-[76vh] min-h-[75vh] w-full overflow-y-auto">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                  <div className="text-lg font-semibold text-gray-800">
                    Notifications
                  </div>
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
