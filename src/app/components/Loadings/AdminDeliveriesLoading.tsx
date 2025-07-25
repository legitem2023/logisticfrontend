'use client';

import  Shimmer  from '../ui/Shimmer';

const AdminDeliveriesLoading = () => {
  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg"
          >
            <div className="p-6 space-y-4 text-sm text-zinc-800">
              {/* Tracking */}
              <div className="flex justify-between items-center">
                <Shimmer className="h-4 w-20 rounded" />
                <Shimmer className="h-4 w-32 rounded" />
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-5 w-40 rounded" />
                <Shimmer className="h-3 w-28 rounded" />
              </div>

              {/* Pickup */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-3 w-full rounded" />
              </div>

              {/* Dropoff */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-3 w-full rounded" />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-6 w-24 rounded-full" />
              </div>

              {/* Rider */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-10 w-full rounded-lg" />
              </div>

              {/* Sender */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-4 w-32 rounded" />
                <Shimmer className="h-3 w-28 rounded" />
              </div>

              {/* Fee */}
              <div className="flex justify-between">
                <Shimmer className="h-4 w-12 rounded" />
                <Shimmer className="h-4 w-16 rounded" />
              </div>

              {/* Payment */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-16 rounded" />
                <div className="flex items-center gap-2">
                  <Shimmer className="h-4 w-20 rounded" />
                  <Shimmer className="h-5 w-12 rounded-full" />
                </div>
              </div>

              {/* Packages */}
              <div className="space-y-2">
                <Shimmer className="h-4 w-24 rounded" />
                <div className="space-y-3 pt-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2 p-3">
                      <Shimmer className="h-3 w-16 rounded" />
                      <Shimmer className="h-3 w-20 rounded" />
                      <Shimmer className="h-3 w-24 rounded" />
                      <Shimmer className="h-2 w-32 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDeliveriesLoading;
