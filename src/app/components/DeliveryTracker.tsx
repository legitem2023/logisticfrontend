import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GETDELIVERIESADMIN } from '../../../graphql/query';

const DeliveryTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { loading, error, data } = useQuery(GETDELIVERIESADMIN);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearched(true);
    }
  };

  // Filter deliveries by tracking number
  const filteredDeliveries = data?.getDeliveries?.filter(
    delivery => delivery.trackingNumber === trackingNumber.toUpperCase()
  ) || [];

  // Format date function
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color and text
  const getStatusColor = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY': return 'bg-amber-100 text-amber-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'DELIVERED': return 'Delivered';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'PENDING': return 'Processing';
      case 'FAILED': return 'Delivery Attempt Failed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-t-xl shadow-lg overflow-hidden">
          <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Premium Delivery Tracker</h1>
            <p className="opacity-90">Track your deliveries with precision and style</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-6 shadow-md">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number"
                className="w-full px-5 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[140px]"
            >
              <i className="fas fa-search mr-2"></i>
              Track Package
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading delivery information...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-5xl mb-4">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700">Error Loading Data</h3>
            <p className="text-gray-500 mt-2">Please try again later</p>
          </div>
        )}

        {/* No Results State */}
        {searched && !loading && filteredDeliveries.length === 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-gray-400 text-5xl mb-4">
              <i className="fas fa-box-open"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700">No Delivery Found</h3>
            <p className="text-gray-500 mt-2">Please check your tracking number and try again</p>
          </div>
        )}

        {/* Results */}
        {filteredDeliveries.map(delivery => (
          <div key={delivery.id} className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Status Header */}
            <div className={`p-6 ${getStatusColor(delivery.deliveryStatus)}`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Delivery Status</h2>
                <span className="px-3 py-1 rounded-full text-sm font-medium">
                  {getStatusText(delivery.deliveryStatus)}
                </span>
              </div>
              <p className="mt-2">
                Tracking Number: <span className="font-mono font-semibold">{delivery.trackingNumber}</span>
              </p>
            </div>

            {/* Delivery Details */}
            <div className="p-6 grid md:grid-cols-2 gap-6">
              {/* Recipient Info */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-800 mb-3">Recipient Information</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {delivery.recipientName}</p>
                  <p><span className="font-semibold">Phone:</span> {delivery.recipientPhone}</p>
                  <p><span className="font-semibold">Delivery Address:</span> {delivery.dropoffAddress}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-800 mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  {delivery.estimatedDeliveryTime && (
                    <p><span className="font-semibold">Estimated Delivery:</span> {formatDate(delivery.estimatedDeliveryTime)}</p>
                  )}
                  {delivery.actualDeliveryTime && (
                    <p><span className="font-semibold">Delivered At:</span> {formatDate(delivery.actualDeliveryTime)}</p>
                  )}
                  <p><span className="font-semibold">Delivery Fee:</span> ${delivery.deliveryFee}</p>
                  <p><span className="font-semibold">Payment Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${delivery.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {delivery.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-800 mb-3">Package Details</h3>
                {delivery.packages.map((pkg) => (
                  <div key={pkg.id} className="space-y-2">
                    <p><span className="font-semibold">Type:</span> {pkg.packageType}</p>
                    <p><span className="font-semibold">Weight:</span> {pkg.weight} kg</p>
                    <p><span className="font-semibold">Dimensions:</span> {pkg.dimensions}</p>
                    {pkg.specialInstructions && (
                      <p><span className="font-semibold">Special Instructions:</span> {pkg.specialInstructions}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Rider Information */}
              {delivery.assignedRider && (
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-emerald-800 mb-3">Delivery Agent</h3>
                  <div className="flex items-center">
                    <div className="bg-emerald-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-user text-emerald-700"></i>
                    </div>
                    <div>
                      <p className="font-semibold">{delivery.assignedRider.name}</p>
                      <p>{delivery.assignedRider.phoneNumber}</p>
                      {delivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                        <p className="text-sm text-emerald-600 mt-1">
                          <i className="fas fa-map-marker-alt mr-1"></i> Your package is in transit
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Progress */}
            <div className="px-6 pb-6">
              <h3 className="text-lg font-medium text-emerald-800 mb-4">Delivery Progress</h3>
              <div className="flex items-center justify-between relative">
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus !== 'PENDING' ? 'bg-emerald-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-xs mt-1">Order Confirmed</span>
                </div>
                
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.deliveryStatus) ? 'bg-emerald-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <span className="text-xs mt-1">Out for Delivery</span>
                </div>
                
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-emerald-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-home"></i>
                  </div>
                  <span className="text-xs mt-1">Delivered</span>
                </div>
                
                <div className="absolute top-4 left-16 right-16 h-1 bg-gray-300">
                  <div 
                    className={`h-1 ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-emerald-500 w-full' : delivery.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-emerald-500 w-1/2' : 'bg-emerald-500 w-0'}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Initial State */}
        {!searched && !loading && data && (
          <div className="mt-12 text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-emerald-700 mb-4">
              <i className="fas fa-box-open text-5xl"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700">Track Your Delivery</h3>
            <p className="text-gray-500 mt-2">Enter your tracking number to check the status of your delivery</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default DeliveryTracker;
