'use client';

import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import Shimmer from "../ui/Shimmer";

export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Shimmer */}
      <aside className="hidden md:block md:w-64 bg-white/70 backdrop-blur-lg border-r border-gray-200 shadow-md p-6 rounded-r-3xl">
        <Shimmer className="h-8 w-3/4 rounded mb-10" />
        <nav>
          <ul className="space-y-4">
            {[1, 2, 3].map((item) => (
              <li key={item}>
                <Shimmer className="h-10 rounded-lg" />
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Shimmer */}
      <main className="flex-1">
        {/* Filter Bar Shimmer */}
        <div className="customgrad h-[100px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 shadow-sm">
          <Shimmer className="flex-1 h-12 rounded" />
          <Shimmer className="w-full md:w-48 h-12 rounded" />
        </div>

        {/* Delivery Cards Shimmer */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="border border-gray-200 rounded-2xl">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Shimmer className="h-6 w-3/4 rounded" />
                  <div className="space-y-2">
                    <Shimmer className="h-4 w-full rounded" />
                    <Shimmer className="h-4 w-5/6 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shimmer className="h-4 w-4 rounded-full" />
                    <Shimmer className="h-4 w-1/2 rounded" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <div className="h-15 w-full" disabled>
                      <Shimmer className="w-full h-full" />
                    </div>
                    <div className="h-15 w-full" disabled>
                      <Shimmer className="w-full h-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Mobile Navigation Shimmer */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-2 z-50">
        {[1, 2, 3].map((item) => (
          <Shimmer key={item} className="h-10 w-1/4 rounded" />
        ))}
      </nav>
    </div>
  );
}
