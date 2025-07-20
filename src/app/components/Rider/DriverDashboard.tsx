'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { DELIVERIES } from '../../../../graphql/query';
import { showToast } from '../../../../utils/toastify';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import HistoryContainer from '../History/HistoryContainer';

import {
  MapPin,
  Clock,
  CheckCircle,
  PackageCheck,
  Compass,
  X
} from 'lucide-react';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { data, loading, error } = useQuery(DELIVERIES);

  const openDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowDetails(true);
  };

  const handleGetIp = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowMap(true);
  };

  const closeModals = () => {
    setShowDetails(false);
    setShowMap(false);
    setSelectedDelivery(null);
  };

  const filteredDeliveries = data?.deliveries?.filter((delivery: any) => {
    if (activeTab === 'Ongoing') return delivery.status === 'Ongoing';
    if (activeTab === 'Completed') return delivery.status === 'Completed';
    return true;
  });

  const tabs = ['Ongoing', 'Completed'];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Driver Panel</h2>
        <ul className="space-y-3">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-4 py-2 rounded-lg transition ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">{activeTab} Deliveries</h1>
        </div>

        {loading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">Error loading deliveries</p>}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDeliveries?.map((delivery: any) => (
            <Card
              key={delivery.id}
              className="bg-white shadow-xl rounded-2xl border hover:shadow-2xl transition-all duration-300"
            >
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="text-lg font-semibold text-gray-800">
                  {delivery.trackingNumber}
                </div>
                <div className="text-sm text-gray-600">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  From: {delivery.pickupAddress}
                </div>
                <div className="text-sm text-gray-600">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  To: {delivery.dropoffAddress}
                </div>
                <div className="flex justify-between mt-2">
                  <Badge
                    variant={delivery.status === 'Completed' ? 'success' : 'default'}
                  >
                    {delivery.status}
                  </Badge>
                  <Badge variant="secondary">
                    <Clock className="w-4 h-4 mr-1" />
                    {delivery.date}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openDetails(delivery)}
                    className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => handleGetIp(delivery)}
                    variant="outline"
                    className="flex items-center gap-1 border-indigo-500 text-indigo-700 hover:bg-indigo-100"
                  >
                    <Compass className="w-4 h-4" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Details Modal */}
      {showDetails && selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
            <p><strong>Tracking #:</strong> {selectedDelivery.trackingNumber}</p>
            <p><strong>Pickup:</strong> {selectedDelivery.pickupAddress}</p>
            <p><strong>Dropoff:</strong> {selectedDelivery.dropoffAddress}</p>
            <p><strong>Status:</strong> {selectedDelivery.status}</p>
            <p><strong>Date:</strong> {selectedDelivery.date}</p>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMap && selectedDelivery && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={closeModals}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Map View</h2>
            {/* Placeholder Map */}
            <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center">
              Map goes here
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
