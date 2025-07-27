'use client'

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { RIDERS } from '../../../../graphql/query';
import RiderDrawer from './RiderDrawer';

interface Rider {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isOnline: boolean;
  lastUpdatedAt: string;
}

const RiderList = () => {
  const { loading, error, data } = useQuery(RIDERS);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const riders: Rider[] = data?.getRiders?.map((rider: any) => {
    const lastUpdated = new Date(rider.lastUpdatedAt).getTime();
    const now = Date.now();
    const isOnline = now - lastUpdated < 2 * 60 * 1000; // 2 minutes

    return {
      id: rider.id,
      name: rider.name,
      avatarUrl: rider.image,
      phone: rider.phoneNumber,
      location: {
        latitude: rider.currentLatitude || 0,
        longitude: rider.currentLongitude || 0,
      },
      isOnline,
      lastUpdatedAt: rider.lastUpdatedAt,
    };
  }) ?? [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching riders.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {riders.map((rider) => (
        <div
          key={rider.id}
          onClick={() => setSelectedRider(rider)}
          className="bg-white shadow-md rounded-xl p-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4">
            <img
              src={rider.avatarUrl || '/placeholder-avatar.png'}
              alt={rider.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{rider.name}</span>
              <span className="text-sm text-gray-500">{rider.phone}</span>
              <span
                className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full w-fit ${
                  rider.isOnline
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {rider.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      ))}

      {selectedRider && (
        <RiderDrawer
          rider={selectedRider}
          onClose={() => setSelectedRider(null)}
        />
      )}
    </div>
  );
};

export default RiderList;
