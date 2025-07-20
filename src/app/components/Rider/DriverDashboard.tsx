'use client';

import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { showToast } from "../../../../utils/toastify";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useMutation, useQuery } from "@apollo/client";
import { DELIVERIES } from "../../../../graphql/query";
import HistoryContainer from "../History/HistoryContainer";
import { MapPin, Clock, CheckCircle, PackageCheck, X, Compass } from 'lucide-react';

const DriverDashboard = () => {
  const { data, loading, error } = useQuery(DELIVERIES);
  const [activeTab, setActiveTab] = useState("Active Deliveries");
  const [map, setMap] = useState(false);
  const [details, setDetails] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    if (error) {
      showToast("Error fetching deliveries", "error");
    }
  }, [error]);

  const openDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setDetails(true);
  };

  const handleGetIp = (delivery: any) => {
    setSelectedDelivery(delivery);
    setMap(true);
  };

  const filteredDeliveries = data?.deliveries || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white/40 backdrop-blur-lg border-r border-gray-200 shadow-xl p-6 rounded-tr-3xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Driver Panel</h2>
        <ul className="space-y-2">
          {["Active Deliveries", "History"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-3 py-2 rounded-lg transition-all duration-150 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {activeTab === "Active Deliveries" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredDeliveries.map((delivery: any) => (
                <Card
                  key={delivery.id}
                  className="bg-white/90 shadow-xl  border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">{delivery.trackingNumber}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        From: <span className="font-medium">{delivery.pickupAddress}</span>
                        <br />
                        To: <span className="font-medium">{delivery.dropoffAddress}</span>
                      </div>
                      <Badge variant="outline" className="mt-2">{delivery.status}</Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium shadow hover:scale-105 transition duration-200 rounded-xl"
                        onClick={() => openDetails(delivery)}
                      >
                        Show Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 w-full border-indigo-500 text-indigo-700 hover:bg-indigo-100 transition duration-200 rounded-xl"
                        onClick={() => handleGetIp(delivery)}
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "History" && (
          <div className="mt-6">
            <HistoryContainer />
          </div>
        )}
      </main>

      {/* Details Modal */}
      {details && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
              <button onClick={() => setDetails(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>Tracking Number:</strong> {selectedDelivery.trackingNumber}</p>
              <p><strong>Pickup:</strong> {selectedDelivery.pickupAddress}</p>
              <p><strong>Dropoff:</strong> {selectedDelivery.dropoffAddress}</p>
              <p><strong>Status:</strong> {selectedDelivery.status}</p>
              <p><strong>Notes:</strong> {selectedDelivery.notes || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {map && selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] overflow-hidden">
            <button
              onClick={() => setMap(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            {/* Embed your map iframe or map component here */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
              Map Preview Here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
