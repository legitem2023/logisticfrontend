// components/SenderDashboard.tsx
import { Card, CardContent } from "../ui/Card";
import { Clock, MapPin, Bike, CheckCheck } from "lucide-react";

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

export default function SenderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for tablet/desktop */}
<aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-8">Sender Panel</h2>
  <nav className="space-y-6 text-base">
    <div className="text-blue-600 font-semibold border-l-4 border-blue-600 pl-2">Active Deliveries</div>
    <div className="text-gray-500 hover:text-gray-800 cursor-pointer">History</div>
    <div className="text-gray-500 hover:text-gray-800 cursor-pointer">Settings</div>
  </nav>
</aside>


      {/* Main content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Accepted Deliveries</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {acceptedDeliveries.map((delivery) => (
<Card key={delivery.id} className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
  <CardContent className="p-5 space-y-4">
    <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
      <Bike className="w-4 h-4 text-blue-600" />
      <span>Rider: {delivery.rider}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <MapPin className="w-4 h-4 text-green-500" />
      <span>{delivery.pickup}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <MapPin className="w-4 h-4 text-red-500" />
      <span>{delivery.dropoff}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span>ETA: {delivery.eta}</span>
    </div>
    <div className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow">
      {delivery.status}
    </div>
  </CardContent>
</Card>

          ))}
        </div>
      </main>

<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-2 z-50">
  <button className="text-blue-600 font-semibold transition-colors">Active</button>
  <button className="text-gray-500 hover:text-gray-800 transition-colors">History</button>
  <button className="text-gray-500 hover:text-gray-800 transition-colors">Settings</button>
</nav>

    </div>
  );
}
