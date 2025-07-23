'use client';

import { Card, CardContent } from '../ui/Card';
import Shimmer from '../ui/Shimmer';

export default function AdminDeliveriesLoading() {
  return (
    <div className="w-full p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="shadow-md border border-gray-200 rounded-xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <Shimmer className="w-24 h-4 rounded-md" />
                <Shimmer className="w-32 h-4 rounded-md" />
              </div>

              <div>
                <Shimmer className="w-20 h-4 mb-1" />
                <Shimmer className="w-40 h-4" />
                <Shimmer className="w-24 h-3 mt-1" />
              </div>

              <div>
                <Shimmer className="w-16 h-4 mb-1" />
                <Shimmer className="w-56 h-3" />
              </div>

              <div>
                <Shimmer className="w-20 h-4 mb-1" />
                <Shimmer className="w-48 h-3" />
              </div>

              <div>
                <Shimmer className="w-16 h-4 mb-1" />
                <div className="flex gap-2">
                  <Shimmer className="w-16 h-5 rounded-full" />
                  <Shimmer className="w-20 h-5 rounded-full" />
                </div>
              </div>

              <div>
                <Shimmer className="w-14 h-4 mb-1" />
                <Shimmer className="w-40 h-3" />
                <Shimmer className="w-32 h-3 mt-1" />
              </div>

              <div className="flex justify-between">
                <Shimmer className="w-16 h-4" />
                <Shimmer className="w-20 h-4" />
              </div>

              <div>
                <Shimmer className="w-20 h-4 mb-1" />
                <div className="flex gap-2 items-center">
                  <Shimmer className="w-24 h-4" />
                  <Shimmer className="w-16 h-5 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
