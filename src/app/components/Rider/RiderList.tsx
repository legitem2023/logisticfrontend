'use client';

import React, { useState, useMemo } from "react";
import { MapPin, Phone, MessageSquare, X } from "lucide-react";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../../graphql/subscription';
import { RIDERS } from '../../../../graphql/query';

type Rider = {
  id: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

const RiderList = () => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  const { loading, error, data } = useQuery(RIDERS);
  const { data: subscriptionData } = useSubscription(LocationTracking);

  
  const baseRiders: Rider[] = data.getRiders.map((r: any) => ({
    id: r.id,
    name: r.name,
    avatarUrl: r.image,
    phone: r.phoneNumber,
    location: {
      latitude: r.currentLatitude || 0,
      longitude: r.currentLongitude || 0,
    },
  }));

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
if (loading) return <div>Loading riders...</div>;
if (error) return <div>Error loading riders: {error.message}</div>;

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {updatedRiders.map((rider: Rider) => (
            <div
              key={rider.id}
              className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 transition hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedRider(rider)}
            >
              {rider.avatarUrl ? (
                <img
                  src={rider.avatarUrl}
                  alt={rider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {rider.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium">{rider.name}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-rose-500" />
                  {rider.location.latitude.toFixed(4)},{" "}
                  {rider.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-Up Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          selectedRider ? "visible bg-black/50" : "invisible"
        }`}
        onClick={() => setSelectedRider(null)}
      >
        <div
          className={`absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ${
            selectedRider ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Rider Details</h3>
            <button onClick={() => setSelectedRider(null)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {selectedRider && (
            <div className="space-y-4">
              {/* Rider Info */}
              <div className="flex items-center space-x-4">
                {selectedRider.avatarUrl ? (
                  <img
                    src={selectedRider.avatarUrl}
                    className="w-14 h-14 rounded-full object-cover"
                    alt={selectedRider.name}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
                    {selectedRider.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{selectedRider.name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedRider.id}</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="text-sm text-gray-700">
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-rose-500" />
                  Latitude: {selectedRider.location.latitude.toFixed(5)}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Longitude: {selectedRider.location.longitude.toFixed(5)}
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="flex space-x-4 pt-2">
                <a
                  href={`tel:${selectedRider.phone || ""}`}
                  className="flex-1 inline-flex justify-center items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call
                </a>
                <a
                  href={`sms:${selectedRider.phone || ""}`}
                  className="flex-1 inline-flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RiderList;
