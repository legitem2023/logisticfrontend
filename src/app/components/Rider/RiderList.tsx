'use client';

import React, { useState, useMemo } from "react";
import { MapPin, Phone, MessageSquare, X, ChevronDown, ChevronUp, Sparkles, Shield, Star, Clock, Bike } from "lucide-react";
import { gql, useQuery, useSubscription } from '@apollo/client';
import { LocationTracking } from '../../../../graphql/subscription';
import { RIDERS } from '../../../../graphql/query';
import { motion, AnimatePresence } from "framer-motion";

type Rider = {
  id: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  rating?: number;
  deliveryCount?: number;
  averageSpeed?: number;
  vehicle?: string;
  status?: 'available' | 'busy' | 'offline';
  location: {
    latitude: number;
    longitude: number;
  };
};

const statusColors = {
  available: 'bg-emerald-100 text-emerald-800',
  busy: 'bg-amber-100 text-amber-800',
  offline: 'bg-gray-100 text-gray-800'
};

const RiderList = () => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [expandedView, setExpandedView] = useState(false);

  const { loading, error, data } = useQuery(RIDERS);
  const { data: subscriptionData } = useSubscription(LocationTracking);

  const baseRiders: Rider[] = data?.getRiders.map((r: any) => ({
    id: r.id,
    name: r.name,
    avatarUrl: r.image,
    phone: r.phoneNumber,
    rating: Math.min(5, Math.max(3.5, Math.random() * 5)).toFixed(1),
    deliveryCount: Math.floor(Math.random() * 500),
    averageSpeed: Math.floor(15 + Math.random() * 20),
    vehicle: ['Motorcycle', 'Bicycle', 'Scooter', 'E-bike'][Math.floor(Math.random() * 4)],
    status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'offline',
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="animate-pulse flex flex-col items-center">
        <Bike className="w-12 h-12 text-amber-500 animate-bounce" />
        <p className="mt-4 text-lg font-medium text-gray-600">Loading rider data...</p>
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

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rider Dashboard</h1>
            <p className="text-gray-500 mt-1">Real-time tracking of delivery partners</p>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-2 rounded-full">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Live Tracking</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {updatedRiders.map((rider: Rider) => (
            <motion.div
              key={rider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => {
                setSelectedRider(rider);
                setExpandedView(true);
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {rider.avatarUrl ? (
                      <img
                        src={rider.avatarUrl}
                        alt={rider.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
                        {rider.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rider.name}</h3>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[rider.status || 'available']}`}>
                        {rider.status?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-amber-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{rider.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Bike className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{rider.vehicle}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{rider.deliveryCount}+ deliveries</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1 text-rose-500" />
                  <span className="truncate">
                    {rider.location.latitude.toFixed(4)}, {rider.location.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Slide-Up Drawer */}
      <AnimatePresence>
        {selectedRider && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setExpandedView(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: expandedView ? "10%" : "70%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-2 w-16 bg-gray-200 rounded-full mx-auto mt-3" />

              <div className="overflow-y-auto" style={{ maxHeight: '90vh' }}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Rider Profile</h2>
                      <p className="text-gray-500">Detailed information and actions</p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setExpandedView(!expandedView)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                      >
                        {expandedView ? <ChevronDown /> : <ChevronUp />}
                      </button>
                      <button 
                        onClick={() => setExpandedView(false)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                      >
                        <X />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="flex items-center space-x-6">
                        {selectedRider.avatarUrl ? (
                          <img
                            src={selectedRider.avatarUrl}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                            alt={selectedRider.name}
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                            {selectedRider.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{selectedRider.name}</h3>
                          <div className="flex items-center mt-1">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedRider.status || 'available']}`}>
                              {selectedRider.status?.toUpperCase()}
                            </div>
                            <div className="flex items-center ml-4">
                              <Star className="w-5 h-5 text-amber-400 fill-current" />
                              <span className="ml-1 font-medium">{selectedRider.rating}</span>
                              <span className="text-gray-500 text-sm ml-1">({selectedRider.deliveryCount} deliveries)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">CURRENT LOCATION</h4>
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-rose-500 mr-2" />
                            <div>
                              <p className="font-medium">{selectedRider.location.latitude.toFixed(5)}</p>
                              <p className="font-medium">{selectedRider.location.longitude.toFixed(5)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">VEHICLE INFO</h4>
                          <div className="flex items-center">
                            <Bike className="w-5 h-5 text-blue-500 mr-2" />
                            <div>
                              <p className="font-medium">{selectedRider.vehicle}</p>
                              <p className="text-sm text-gray-500">Avg. speed: {selectedRider.averageSpeed} km/h</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">PERFORMANCE</h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Shield className="w-5 h-5 text-emerald-500 mr-2" />
                              <div>
                                <p className="font-medium">{selectedRider.deliveryCount} deliveries</p>
                                <p className="text-sm text-gray-500">Completed</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-5 h-5 text-purple-500 mr-2" />
                              <div>
                                <p className="font-medium">98%</p>
                                <p className="text-sm text-gray-500">On time</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">RIDER ID</h4>
                          <div className="font-mono text-sm bg-white p-2 rounded-md border border-gray-200">
                            {selectedRider.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-80 space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-800 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          <a
                            href={`tel:${selectedRider.phone || ""}`}
                            className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <Phone className="w-5 h-5 text-blue-600 mr-3" />
                              <span className="font-medium">Call Rider</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </a>
                          <a
                            href={`sms:${selectedRider.phone || ""}`}
                            className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center">
                              <MessageSquare className="w-5 h-5 text-blue-600 mr-3" />
                              <span className="font-medium">Send Message</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </a>
                          <button className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                              <span className="font-medium">View on Map</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h4>
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <Bike className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Delivery completed</p>
                              <p className="text-sm text-gray-500">Order #4582 • 15 min ago</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-amber-100 p-2 rounded-full mr-3">
                              <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="font-medium">Status changed to Busy</p>
                              <p className="text-sm text-gray-500">25 min ago</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-emerald-100 p-2 rounded-full mr-3">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium">Location updated</p>
                              <p className="text-sm text-gray-500">32 min ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RiderList;
