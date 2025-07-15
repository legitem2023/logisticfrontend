// components/SenderDashboard.tsx
import { Card, CardContent } from "../ui/Card";
import { Clock, MapPin, Bike, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Shimmer from "../ui/Shimmer"; // Import the Shimmer component

const acceptedDeliveries = [
  {
    id: "d001",
    pickup: "Warehouse A, Quezon City",
    dropoff: "Makati Business Center",
    status: "In Transit",
    eta: "20 mins",
    rider: "Mark Reyes",
  },
  {
    id: "d002",
    pickup: "Caloocan Hub",
    dropoff: "SM Pasig",
    status: "Accepted",
    eta: "35 mins",
    rider: "Anna Lopez",
  },
];

export default function DashboardLoading() {
  
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar shimmer */}
        <aside className="hidden md:block md:w-64 bg-white shadow p-4">
          <Shimmer width="150px" height="32px" className="mb-6" />
          <div className="space-y-4">
            <Shimmer height="24px" />
            <Shimmer height="24px" />
            <Shimmer height="24px" />
          </div>
        </aside>

        {/* Main content shimmer */}
        <main className="flex-1 p-4">
          <Shimmer width="250px" height="32px" className="mb-6" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shimmer width="16px" height="16px" rounded />
                    <Shimmer width="70%" height="16px" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shimmer width="16px" height="16px" className="rounded-full" />
                    <Shimmer width="100%" height="16px" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shimmer width="16px" height="16px" className="rounded-full" />
                    <Shimmer width="90%" height="16px" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shimmer width="16px" height="16px" className="rounded-full" />
                    <Shimmer width="40%" height="16px" />
                  </div>
                  <Shimmer width="100px" height="24px" rounded />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        {/* Mobile nav shimmer */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around p-2">
          <Shimmer width="60px" height="24px" />
          <Shimmer width="60px" height="24px" />
          <Shimmer width="60px" height="24px" />
        </nav>
      </div>
    );
  

  
}
