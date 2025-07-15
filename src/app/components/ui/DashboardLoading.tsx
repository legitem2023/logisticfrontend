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
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate 2 second loading time
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shimmer width="16px" height="16px" rounded="full" />
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for tablet/desktop */}
      <aside className="hidden md:block md:w-64 bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-6">Sender Panel</h2>
        <nav className="space-y-4 text-gray-600">
          <div className="text-blue-600 font-medium">Active Deliveries</div>
          <div>History</div>
          <div>Settings</div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Accepted Deliveries</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {acceptedDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bike className="w-4 h-4 text-blue-500" />
                  <span>Rider: {delivery.rider}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span>{delivery.pickup}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>{delivery.dropoff}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {delivery.eta}</span>
                </div>
                <div className="text-sm font-medium text-white w-fit px-3 py-1 rounded-full bg-blue-600">
                  {delivery.status}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around p-2">
        <button className="text-blue-600 font-semibold">Active</button>
        <button className="text-gray-600">History</button>
        <button className="text-gray-600">Settings</button>
      </nav>
    </div>
  );
}
