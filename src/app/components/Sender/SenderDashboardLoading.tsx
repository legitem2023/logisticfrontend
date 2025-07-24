'use client';

import { Card, CardContent } from "../ui/Card";
import Shimmer from "../ui/Shimmer";
const SenderDashboardLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Loading */}
      <aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
        <div className="h-8 w-3/4 mb-8">
          <Shimmer />
        </div>
        <nav className="space-y-6 text-base">
          <div className="h-6 w-full">
            <Shimmer />
          </div>
          <div className="h-6 w-3/4">
            <Shimmer />
          </div>
          <div className="h-6 w-3/4">
            <Shimmer />
          </div>
        </nav>
      </aside>

      {/* Main Content - Loading */}
      <main className="flex-1 p-0">

        {/* Cards Loading */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-0">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md">
              <CardContent className="p-5 space-y-4">
                <div className="h-6 w-3/4">
                  <Shimmer />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-1/2">
                    <Shimmer />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-full">
                    <Shimmer />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-full">
                    <Shimmer />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-1/2">
                    <Shimmer />
                  </div>
                </div>

                <div className="h-10 w-full">
                  <Shimmer />
                </div>

                <div className="h-6 w-24 rounded-full">
                  <Shimmer />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Mobile Nav - Loading */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-2 z-50">
        <div className="h-6 w-16">
          <Shimmer />
        </div>
        <div className="h-6 w-16">
          <Shimmer />
        </div>
        <div className="h-6 w-16">
          <Shimmer />
        </div>
      </nav>
    </div>
  );
}

export default SenderDashboardLoading;
