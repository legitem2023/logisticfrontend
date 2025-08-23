// components/AdminDeliveriesLoading.tsx
import { Card, CardContent } from '../ui/Card';
import { PackageCheck, User, Phone, MapPin, Truck, BadgeCheck, CreditCard } from "lucide-react";
import Shimmer from '../ui/Shimmer';

const AdminDeliveriesLoading = () => {
  // Create 6 skeleton cards (typical loading amount)
  const skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="w-full p-0">
      {/* Filter Bar Loading */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-zinc-200">
        <div className="flex flex-col md:flex-row gap-3">
          <Shimmer height="40px" width="100%" rounded />
          <Shimmer height="40px" width="140px" rounded />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
        {skeletonCards.map((index) => (
          <Card key={index} className="border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg">
            <CardContent className="p-6 space-y-4">
              {/* Tracking Number */}
              <div className="flex justify-between items-center">
                <Shimmer width="80px" height="16px" />
                <Shimmer width="120px" height="16px" />
              </div>

              {/* Recipient Info */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <User size={14} className="text-zinc-700" />
                  <Shimmer width="60px" height="14px" />
                </div>
                <Shimmer width="100%" height="14px" className="mb-1" />
                <Shimmer width="80%" height="12px" />
              </div>

              {/* Pickup Address */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={14} className="text-zinc-700" />
                  <Shimmer width="60px" height="14px" />
                </div>
                <Shimmer width="100%" height="12px" />
              </div>

              {/* Dropoff Address */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={14} className="text-zinc-700" />
                  <Shimmer width="70px" height="14px" />
                </div>
                <Shimmer width="100%" height="12px" />
              </div>

              {/* Status Badges */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <BadgeCheck size={14} className="text-zinc-700" />
                  <Shimmer width="50px" height="14px" />
                </div>
                <div className="flex gap-2">
                  <Shimmer width="70px" height="24px" />
                </div>
              </div>

              {/* Rider Assignment */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Truck size={14} className="text-zinc-700" />
                  <Shimmer width="50px" height="14px" />
                </div>
                <Shimmer height="40px" rounded />
              </div>

              {/* Sender Info */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <User size={14} className="text-zinc-700" />
                  <Shimmer width="60px" height="14px" />
                </div>
                <Shimmer width="80%" height="14px" className="mb-1" />
                <Shimmer width="60%" height="12px" />
              </div>

              {/* Pricing Details */}
              <div className="border rounded-xl p-4 shadow-sm bg-white space-y-3">
                <div className="flex justify-between">
                  <Shimmer width="70px" height="16px" />
                  <Shimmer width="50px" height="16px" />
                </div>
                <div className="flex justify-between">
                  <Shimmer width="60px" height="16px" />
                  <Shimmer width="40px" height="16px" />
                </div>
                <div className="flex justify-between">
                  <Shimmer width="80px" height="16px" />
                  <Shimmer width="60px" height="16px" />
                </div>
                
                <hr className="my-2 border-zinc-200" />
                
                <div className="flex justify-between">
                  <Shimmer width="50px" height="18px" />
                  <Shimmer width="70px" height="18px" />
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <CreditCard size={14} className="text-zinc-700" />
                  <Shimmer width="70px" height="14px" />
                </div>
                <div className="flex items-center gap-2">
                  <Shimmer width="100px" height="16px" />
                  <Shimmer width="70px" height="24px"/>
                </div>
              </div>

              {/* Packages Section */}
              <div>
                <Shimmer width="120px" height="20px" className="mb-2" />
                <div className="space-y-2 pt-2">
                  <div className="border rounded-lg p-3 space-y-2">
                    <Shimmer width="100%" height="14px" />
                    <Shimmer width="80%" height="14px" />
                    <Shimmer width="90%" height="14px" />
                    <Shimmer width="70%" height="12px" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDeliveriesLoading;
