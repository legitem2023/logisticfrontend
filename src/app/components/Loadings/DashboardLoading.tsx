'use client';

import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import Shimmer from "../ui/Shimmer";
import { Clock, Compass, FileText } from "lucide-react";

export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Loading */}
      <aside className="hidden md:block md:w-64 bg-white/70 backdrop-blur-lg border-r border-gray-200 shadow-md p-6 rounded-r-3xl">
        <div className="h-10 w-3/4 mb-10">
          <Shimmer />
        </div>
        <nav>
          <ul className="space-y-4">
            {['Deliveries', 'Dispatch', 'History'].map((tab, i) => (
              <li key={i} className="h-10 w-full rounded-lg">
                <Shimmer />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Loading */}
      <main className="flex-1">
        {/* FilterBar Loading */}
        <div className=" customgrad p-4 backdrop-blur-md border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex-1 h-10 rounded-lg">
              <Shimmer />
            </div>
            <div className="w-32 h-10 rounded-lg">
              <Shimmer />
            </div>
          </div>
        </div>

        {/* Cards Loading */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-0">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border border-gray-200 rounded-2xl">
              <CardContent className="p-4 space-y-4">
                {/* Tracking Number */}
                <div className="h-6 w-3/4">
                  <Shimmer />
                </div>

                {/* Addresses */}
                <div className="space-y-2">
                  <div className="h-4 w-full">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-5/6">
                    <Shimmer />
                  </div>
                </div>

                {/* ETA */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full">
                    <Shimmer />
                  </div>
                  <div className="h-4 w-1/2">
                    <Shimmer />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="h-9 w-full rounded-md">
                    <Shimmer />
                  </div>
                  <div className="h-9 w-full rounded-md">
                    <Shimmer />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Mobile Nav Loading */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around z-50">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 w-full flex items-center justify-center">
            <div className="h-6 w-3/4">
              <Shimmer />
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
