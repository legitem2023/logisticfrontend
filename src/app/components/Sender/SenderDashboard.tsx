'use client';

import { useState, useEffect } from "react"; 
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button"; 
import Collapsible from "../ui/Collapsible";
import { Clock, MapPin, Bike } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GETDISPATCH } from '../../../../graphql/query';
import CreatePackageForm from "./CreatePackageForm";
import { useSelector } from "react-redux";
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { getMinutesFromNow } from '../../../../utils/decryptToken';
import FilterBar from "../Rider/Filterbar";
import SenderDashboardLoading from "./SenderDashboardLoading";
export default function SenderDashboard() {
  const globalUserId = useSelector(selectTempUserId);

  const [search, setSearch] = useState("");
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);
  const [originalDeliveries, setOriginalDeliveries] = useState<any[]>([]); 

  const { data, loading, error,refetch } = useQuery(GETDISPATCH, {
    variables: { id: globalUserId },
    skip: !globalUserId,
  });

  const acceptedDeliveries = data?.getDispatch || [];

  // Set deliveries when fetched
  useEffect(() => {
    if (acceptedDeliveries.length) {
      setOriginalDeliveries(acceptedDeliveries);
      setFilteredDeliveries(acceptedDeliveries);
    }
  }, [acceptedDeliveries]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    let filtered = [...originalDeliveries];

    if (search) {
      filtered = filtered.filter(delivery =>
        delivery.trackingNumber?.toLowerCase().includes(search.toLowerCase()) ||
        delivery.assignedRider?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (date) {
      const targetDate = new Date(date).toDateString();
      filtered = filtered.filter(delivery => {
        const deliveryDate = new Date(delivery.createdAt).toDateString();
        return deliveryDate === targetDate;
      });
    }

    setFilteredDeliveries(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Sender Panel</h2>
        <nav className="space-y-6 text-base">
          <div className="text-blue-600 font-semibold border-l-4 border-blue-600 pl-2">Active Deliveries</div>
          <div className="text-gray-500 hover:text-gray-800 cursor-pointer">History</div>
          <div className="text-gray-500 hover:text-gray-800 cursor-pointer">Settings</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-0">
        
        {loading ? (
          <SenderDashboardLoading/>
        ) : error ? (
          <div className="text-center mt-8 text-red-500">Error loading deliveries</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-0">
           <FilterBar onFilter={handleFilter} />
            {filteredDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="text-lg font-semibold text-gray-800">{delivery.trackingNumber}</div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Bike className="w-4 h-4 text-blue-600" />
                    <span>Rider: {delivery.assignedRider?.name || "Unassigned"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>{delivery.pickupAddress}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{delivery.dropoffAddress}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      ETA:{" "}
                      {delivery.estimatedDeliveryTime
                        ? getMinutesFromNow(delivery.estimatedDeliveryTime)
                        : "Unknown"}
                    </span>
                  </div>
                  {delivery.deliveryStatus==='in_transit' && (<div className="flex items-center gap-2 text-sm text-gray-500">
                  <Button 
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 customgrad hover:bg-blue-50 hover:border-blue-500">
                        <Compass className="w-4 h-4 mr-1" />Track</Button>
                  </div>)}
                  <div>
                    <Collapsible title={delivery.packages.length > 0?"Package Ready":"Create Package"} defaultOpen={delivery.packages.length > 0?false:true}>
                     <CreatePackageForm
                      deliveryId={delivery.id}
                      Package={delivery.packages}
                      refresh={refetch}
                    />
                    </Collapsible>
                    
                  </div>

                  <div className="inline-block text-xs font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow">
                    {delivery.deliveryStatus}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-2 z-50">
        <button className="text-blue-600 font-semibold transition-colors">Active</button>
        <button className="text-gray-500 hover:text-gray-800 transition-colors">History</button>
        <button className="text-gray-500 hover:text-gray-800 transition-colors">Settings</button>
      </nav>
    </div>
  );
}
