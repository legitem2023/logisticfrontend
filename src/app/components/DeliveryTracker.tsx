import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GETDELIVERIESADMIN } from '../../../graphql/query';
import HomeDataCarousel from './HomeDataCarousel';
import { mockItems } from './json/mockItems';

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
    <div className="min-h-screen bg-gray-50">
      {/* Carousel Section */}
      <div className="relative">
        <HomeDataCarousel items={mockItems} />
      </div>

      {/* Tracking Section */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Track Your Shipment</h2>
            <p className="text-gray-600 mt-2">Enter your tracking number to get real-time updates</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number"
                className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-darkgreen to-green-600 hover:from-darkgreen hover:to-green-700 text-white font-medium py-4 px-10 rounded-lg transition-colors flex items-center justify-center min-w-[160px] text-lg"
            >
              <i className="fas fa-search mr-3"></i>
              Track Package
            </button>
          </form>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
              {/* Status Header with custom gradient */}
              <div className={`p-6 customgrad text-white`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Delivery Status</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20">
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
                  <h3 className="text-lg font-medium text-green-800 mb-3">Recipient Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Name:</span> {delivery.recipientName}</p>
                    <p><span className="font-semibold">Phone:</span> {delivery.recipientPhone}</p>
                    <p><span className="font-semibold">Delivery Address:</span> {delivery.dropoffAddress}</p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Delivery Information</h3>
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
                  <h3 className="text-lg font-medium text-green-800 mb-3">Package Details</h3>
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
                    <h3 className="text-lg font-medium text-green-800 mb-3">Delivery Agent</h3>
                    <div className="flex items-center">
                      <div className="bg-green-200 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-user text-green-700"></i>
                      </div>
                      <div>
                        <p className="font-semibold">{delivery.assignedRider.name}</p>
                        <p>{delivery.assignedRider.phoneNumber}</p>
                        {delivery.deliveryStatus === 'OUT_FOR_DELIVERY' && (
                          <p className="text-sm text-green-600 mt-1">
                            <i className="fas fa-map-marker-alt mr-1"></i> Your package is in transit
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Progress - Fixed to not look floating */}
              <div className="px-6 pb-6">
                <h3 className="text-lg font-medium text-green-800 mb-4">Delivery Progress</h3>
                <div className="relative">
                  <div className="absolute left-0 right-0 top-4 h-1 bg-gray-300">
                    <div 
                      className={`h-1 ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-green-500 w-full' : delivery.deliveryStatus === 'OUT_FOR_DELIVERY' ? 'bg-green-500 w-2/3' : 'bg-green-500 w-1/3'}`}
                    ></div>
                  </div>
                  <div className="flex justify-between relative">
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus !== 'PENDING' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        <i className="fas fa-check text-xs"></i>
                      </div>
                      <span className="text-xs mt-1 text-center">Order<br />Confirmed</span>
                    </div>
                    
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${['OUT_FOR_DELIVERY', 'DELIVERED'].includes(delivery.deliveryStatus) ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        <i className="fas fa-shipping-fast text-xs"></i>
                      </div>
                      <span className="text-xs mt-1 text-center">Out for<br />Delivery</span>
                    </div>
                    
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${delivery.deliveryStatus === 'DELIVERED' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                        <i className="fas fa-home text-xs"></i>
                      </div>
                      <span className="text-xs mt-1">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Initial State */}
          {!searched && !loading && data && (
            <div className="mt-12 text-center py-12 bg-white rounded-xl shadow-md">
              <div className="text-green-700 mb-4">
                <i className="fas fa-box-open text-5xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-700">Track Your Delivery</h3>
              <p className="text-gray-500 mt-2">Enter your tracking number to check the status of your delivery</p>
            </div>
          )}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Express Delivery</h3>
              <p className="text-gray-600">Fast and reliable delivery services with real-time tracking for all your packages.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-warehouse"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Warehousing</h3>
              <p className="text-gray-600">Secure storage solutions with inventory management for businesses of all sizes.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl text-center">
              <div className="text-green-600 text-4xl mb-4">
                <i className="fas fa-globe"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">International Shipping</h3>
              <p className="text-gray-600">Global logistics solutions with customs clearance and door-to-door delivery.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-darkgreen to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-200">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-green-200">Monthly Deliveries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-200">Delivery Agents</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-200">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Ship with Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who trust us with their delivery needs. 
            Get started today with our fast, reliable, and affordable logistics solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-darkgreen to-green-600 hover:from-darkgreen hover:to-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Get a Quote
            </button>
            <button className="bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-3 px-8 rounded-lg transition-colors">
              Create Account
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default DeliveryTracker;
