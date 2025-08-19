import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GETDELIVERIESADMIN } from '../../../graphql/query';
import HomeDataCarousel from './HomeDataCarousel';

const DeliveryTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const { loading, error, data } = useQuery(GETDELIVERIESADMIN);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearched(true);
    }
  };

  // Filter deliveries by tracking number
  const filteredDeliveries = data?.getDeliveries?.filter(
    (delivery: any) => delivery.trackingNumber === trackingNumber.toUpperCase()
  ) || [];

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color and text
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'OUT_FOR_DELIVERY': return 'bg-amber-100 text-amber-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'Delivered';
      case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
      case 'PENDING': return 'Processing';
      case 'FAILED': return 'Delivery Attempt Failed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section with Carousel */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Deliveries</h1>
              <p className="text-xl mb-8 opacity-90">Real-time tracking for all your packages with premium delivery service</p>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number"
                    className="w-full px-5 py-3 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center min-w-[140px]"
                >
                  <i className="fas fa-search mr-2"></i>
                  Track
                </button>
              </form>
            </div>
            
            <div className="lg:w-1/2 w-full max-w-2xl">
              <HomeDataCarousel />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {loading && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        {filteredDeliveries.map((delivery: any) => (
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
                <h3 className="text-lg font-medium text-blue-800 mb-3">Recipient Information</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {delivery.recipientName}</p>
                  <p><span className="font-semibold">Phone:</span> {delivery.recipientPhone}</p>
                  <p><span className="font-semibold">Delivery Address:</span> {delivery.dropoffAddress}</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-3">Delivery Information</h3>
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
                <h3 className="text-lg font-medium text-blue-800 mb-3">Package Details</h3>
                {delivery.packages.map((pkg: any) => (
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
                  <h3 className="text-lg font-medium text-blue-800 mb-3">Delivery Agent</h3>
                  <div className="flex items-center">
                    <div className="bg-blue-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-user text-blue-700"></i>
                    </div>
                    <div>
                      <p className="font-semibold">{delivery.assignedRider.name}</p>
                      <p>{delivery.assignedRider.phoneNumber}</p>
                      {delivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                        <p className="text-sm text-blue-600 mt-1">
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
              <h3 className="text-lg font-medium text-blue-800 mb-4">Delivery Progress</h3>
              <div className="flex items-center justify-between relative">
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus !== 'PENDING' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-xs mt-1">Order Confirmed</span>
                </div>
                
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.deliveryStatus) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <span className="text-xs mt-1">Out for Delivery</span>
                </div>
                
                <div className="flex flex-col items-center z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    <i className="fas fa-home"></i>
                  </div>
                  <span className="text-xs mt-1">Delivered</span>
                </div>
                
                <div className="absolute top-4 left-16 right-16 h-1 bg-gray-300">
                  <div 
                    className={`h-1 ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-blue-500 w-full' : delivery.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-blue-500 w-1/2' : 'bg-blue-500 w-0'}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Initial State */}
        {!searched && !loading && data && (
          <div className="mt-12 text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-blue-700 mb-4">
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
