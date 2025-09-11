'use client';

import React, { useState, useMemo } from "react";
import { 
  X,
  MessageSquare,
  Phone
} from "lucide-react";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../../graphql/subscription';
import { ACCOUNTS } from '../../../../graphql/query';
import Image from "next/image";
import RiderCard from './RiderCard'; // Import the card component
import RiderProfileCard from './RiderProfileCard'; // Import the profile card component
import FilterBar from "../Rider/Filterbar";
import ShimmerRiderCard from "./ShimmerRiderCard";
type Rider = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  phone?: string;
  phoneNumber?: string;
  license?:string;
  vehicleTypeId?:string
  vehicleType?: {
    name: string;
    maxCapacityKg: number;
    maxVolumeM3: number;
  };
  licensePlate?: string;
  status?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  lastUpdatedAt?: string;
  createdAt?: string;
  role?: string;
  image?: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const Accounts = () => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const { loading, error, data } = useQuery(ACCOUNTS);
  const { data: subscriptionData } = useSubscription(LocationTracking);

  const baseRiders: Rider[] = useMemo(() => data?.getUsers?.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    avatarUrl: r.image,
    phone: r.phoneNumber,
    phoneNumber: r.phoneNumber,
    vehicleTypeId:r.vehicleTypeId,
    vehicleType: r.vehicleType,
    licensePlate: r.licensePlate,
    license:r.license,
    status: r.status,
    currentLatitude: r.currentLatitude,
    currentLongitude: r.currentLongitude,
    lastUpdatedAt: r.lastUpdatedAt,
    createdAt: r.createdAt,
    role: r.role,
    image: r.image,
    location: {
      latitude: r.currentLatitude || 0,
      longitude: r.currentLongitude || 0,
    },
  })) || [], [data]);

  // Apply real-time updates
  const updatedRiders = useMemo(() => {
    if (!subscriptionData?.LocationTracking) return baseRiders;

    const { riderId, latitude, longitude } = subscriptionData.LocationTracking;

    return baseRiders.map((r) =>
      r.id === riderId
        ? {
            ...r,
            location: {
              latitude,
              longitude,
            },
            currentLatitude: latitude,
            currentLongitude: longitude
          }
        : r
    );
  }, [baseRiders, subscriptionData]);

const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    let filtered = [...baseRiders];

    if (search) {
      filtered = filtered.filter(delivery =>
        delivery.name?.toLowerCase().includes(search.toLowerCase())
        
      );
    }
}
/*  
  if (loading) return (
    <div className="w-full mx-auto p-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-6">
          {Array(10).map((rider: any,idx:number) => (
           <ShimmerRiderCard key={idx}/>
          ))}
        </div>
      </div>
  );
  */

  if (error) return (
    <div className="bg-rose-50 border-l-4 border-rose-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <X className="h-5 w-5 text-rose-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-rose-700">
            Error loading riders: {error.message}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full mx-auto p-0">
        <FilterBar onFilter={handleFilter} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-6">
          {loading?(<ShimmerRiderCard/>):updatedRiders.map((rider: Rider) => (
            <RiderCard 
              key={rider.id}
              rider={rider}
              onViewDetails={() => setSelectedRider(rider)}
              onSave={() => setSelectedRider(rider)}
              />
          ))}
        </div>
      </div>

      {/* Slide-Up Drawer */}
      {selectedRider && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSelectedRider(null)}>
          <div 
            className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Rider Details</h3>
              <button 
                onClick={() => setSelectedRider(null)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
        
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              {selectedRider.phone && (
                <>
                  <a
                    href={`tel:${selectedRider.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg"
                  >
                    <Phone className="w-5 h-5" />
                    Call Rider
                  </a>
                  <a
                    href={`sms:${selectedRider.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Send Message
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Accounts;
