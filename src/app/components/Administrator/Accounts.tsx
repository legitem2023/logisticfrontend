'use client';

import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  X, 
  User,
  Car,
  Mail,
  BadgeInfo,
  Clock,
  Shield,
  ChevronRight,
  Calendar
} from "lucide-react";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../../graphql/subscription';
import { RIDERS } from '../../../../graphql/query';
import Image from "next/image";

type Rider = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  phone?: string;
  vehicleType?: {
    name: string;
    maxCapacityKg: number;
    maxVolumeM3: number;
  };
  licensePlate?: string;
  status?: string;
  lastUpdatedAt?: string;
  createdAt?: string;
  role?: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const Accounts = () => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const { loading, error, data } = useQuery(RIDERS);
  const { data: subscriptionData } = useSubscription(LocationTracking);

  const baseRiders: Rider[] = data?.getRiders?.map((r: any) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    avatarUrl: r.image,
    phone: r.phoneNumber,
    vehicleType: r.vehicleType,
    licensePlate: r.licensePlate,
    status: r.status,
    lastUpdatedAt: r.lastUpdatedAt,
    createdAt: r.createdAt,
    role: r.role,
    location: {
      latitude: r.currentLatitude || 0,
      longitude: r.currentLongitude || 0,
    },
  })) || [];

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
          }
        : r
    );
  }, [baseRiders, subscriptionData]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
        <p className="text-lg font-medium text-gray-600">Loading riders...</p>
      </div>
    </div>
  );

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

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-red-100 text-red-800',
    BUSY: 'bg-orange-100 text-orange-800',
    OFFLINE: 'bg-gray-100 text-gray-800'
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6">Active Riders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedRiders.map((rider: Rider) => (
            <div
              key={rider.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-lg cursor-pointer border border-gray-100"
              onClick={() => setSelectedRider(rider)}
            >
              {/* Card Header with Avatar */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative flex justify-center items-center">
                {rider.avatarUrl ? (
                  <Image
                    src={rider.avatarUrl}
                    alt={rider.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-500 font-bold text-2xl border-4 border-white">
                    {rider.name.charAt(0)}
                  </div>
                )}
                {rider.status && (
                  <span className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[rider.status] || 'bg-blue-100 text-blue-800'}`}>
                    {rider.status}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">{rider.name}</h3>
                  {rider.role && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                      <BadgeInfo className="w-3 h-3 mr-1" />
                      {rider.role}
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="truncate">{rider.email || 'No email'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{rider.phone || 'No phone'}</span>
                  </div>
                  
                  {rider.vehicleType && (
                    <div className="flex items-start">
                      <Car className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p>{rider.vehicleType.name} {rider.licensePlate && `(${rider.licensePlate})`}</p>
                        <p className="text-xs text-gray-500">
                          Capacity: {rider.vehicleType.maxCapacityKg}kg · {rider.vehicleType.maxVolumeM3}m³
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="truncate">
                      {rider.location.latitude.toFixed(4)}, {rider.location.longitude.toFixed(4)}
                    </span>
                  </div>
                  
                  {rider.lastUpdatedAt && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        Updated {new Date(rider.lastUpdatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRider(rider);
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
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

            <div className="space-y-6">
              {/* Rider Info */}
              <div className="flex items-center space-x-4">
                {selectedRider.avatarUrl ? (
                  <Image
                    src={selectedRider.avatarUrl}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    alt={selectedRider.name}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl border-4 border-blue-50">
                    {selectedRider.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedRider.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedRider.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedRider.role}
                      </span>
                    )}
                    {selectedRider.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedRider.status]}`}>
                        {selectedRider.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedRider.phone || 'Not available'}</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{selectedRider.email || 'Not available'}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Car className="w-4 h-4 mr-2 text-blue-500" />
                    Vehicle Information
                  </h4>
                  <div className="space-y-2">
                    {selectedRider.vehicleType ? (
                      <>
                        <p className="flex items-center">
                          <span className="w-4 h-4 mr-2"></span>
                          <span>{selectedRider.vehicleType.name}</span>
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <span className="w-4 h-4 mr-2"></span>
                          <span>Plate: {selectedRider.licensePlate || 'Not available'}</span>
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <span className="w-4 h-4 mr-2"></span>
                          <span>Capacity: {selectedRider.vehicleType.maxCapacityKg}kg</span>
                        </p>
                        <p className="flex items-center text-sm text-gray-600">
                          <span className="w-4 h-4 mr-2"></span>
                          <span>Volume: {selectedRider.vehicleType.maxVolumeM3}m³</span>
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500">No vehicle information</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    Current Location
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="w-4 h-4 mr-2"></span>
                      <span>Latitude: {selectedRider.location.latitude.toFixed(6)}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-4 h-4 mr-2"></span>
                      <span>Longitude: {selectedRider.location.longitude.toFixed(6)}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Account Information
                  </h4>
                  <div className="space-y-2">
                    {selectedRider.createdAt && (
                      <p className="flex items-center text-sm">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>Joined: {new Date(selectedRider.createdAt).toLocaleDateString()}</span>
                      </p>
                    )}
                    {selectedRider.lastUpdatedAt && (
                      <p className="flex items-center text-sm">
                        <span className="w-4 h-4 mr-2"></span>
                        <span>Last active: {new Date(selectedRider.lastUpdatedAt).toLocaleString()}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
        </div>
      )}
    </>
  );
};

export default Accounts;
