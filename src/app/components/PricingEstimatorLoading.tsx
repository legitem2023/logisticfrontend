// components/PricingEstimatorLoading.tsx
import {
  Calculator,
  DollarSign,
  Route,
  Package,
  Truck,
  Home,
  MapPin,
} from 'lucide-react';
import Shimmer from './ui/Shimmer';

const PricingEstimatorLoading = () => {
  return (
    <div className="w-full mx-auto bg-white mt-5 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="customgrad p-6 text-white">
        <div className="flex items-center">
          <Calculator className="h-8 w-8 mr-3" />
          <Shimmer width="250px" height="32px" />
        </div>
        <Shimmer width="200px" height="20px" className="mt-2" />
      </div>

      <div className="p-6">
        {/* Pickup Location */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Home className="h-4 w-4 mr-1 text-gray-700" />
            <Shimmer width="120px" height="20px" />
          </div>
          <Shimmer height="48px" rounded />
        </div>

        {/* Dropoff Location */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-700" />
            <Shimmer width="130px" height="20px" />
          </div>
          <Shimmer height="48px" rounded />
        </div>

        {/* Vehicle Selection */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Truck className="h-4 w-4 mr-1 text-gray-700" />
            <Shimmer width="100px" height="20px" />
          </div>
          <Shimmer height="48px" rounded />
        </div>

        {/* Estimated Cost Display */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Route className="h-4 w-4 mr-1 text-gray-700" />
              <Shimmer width="80px" height="16px" />
            </div>
            <Shimmer width="60px" height="16px" />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1 text-gray-700" />
              <Shimmer width="70px" height="16px" />
            </div>
            <Shimmer width="40px" height="16px" />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-1 text-gray-700" />
              <Shimmer width="100px" height="16px" />
            </div>
            <Shimmer width="50px" height="16px" />
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-blue-200">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-blue-700" />
              <Shimmer width="120px" height="20px" />
            </div>
            <Shimmer width="70px" height="20px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingEstimatorLoading;
