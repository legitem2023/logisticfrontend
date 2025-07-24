'use client';

import { useState, useEffect } from "react"; 
import 'react-datepicker/dist/react-datepicker.css';


import { useSelector } from 'react-redux';

import { selectTempUserId } from '../../../../Redux/tempUserSlice';


import { Button } from "../ui/Button"; 
import { showToast } from '../../../../utils/toastify'; 
import { Card, CardContent } from "../ui/Card"; 

import { useMutation, useQuery } from "@apollo/client"; 
import { DELIVERIES } from "../../../../graphql/query"; 
import HistoryContainer from "../History/HistoryContainer"; 
import { Clock, X, Compass,FileText } from "lucide-react"; 
import {DashboardLoading} from "../Loadings/DashboardLoading"; 
import {  capitalize, formatDate } from "../../../../utils/decryptToken"; 
import { ACCEPTDELIVERY } from "../../../../graphql/mutation"; 
import DeliveryDetailCard from "./DeliveryDetailCard"; 
import dynamic from "next/dynamic"; 
import FilterBar from "./Filterbar";
const RiderMap = dynamic(() => import("./RiderMap"), { ssr: false });

export default function DriverDashboard() { 
  
  const globalUserId = useSelector(selectTempUserId);
  const [activeTab, setActiveTab] = useState("Deliveries"); 
  const [showMap, setMap] = useState(false); 
  const [showDetails, setShowDetails] = useState(false); 
  const [selectedDelivery, setSelectedDelivery] = useState(null); 
  const [search, setSearch] = useState("");
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [originalDeliveries, setOriginalDeliveries] = useState([]);

  const openDetails = (delivery: any) => { 
    setSelectedDelivery(delivery); 
    setShowDetails(true); 
  };

  const closeDetails = () => { 
    setShowDetails(false); 
    setSelectedDelivery(null); 
  };

  const { data, loading ,refetch} = useQuery(DELIVERIES, { 
    variables: { getRidersDeliveryId: globalUserId }, 
    skip: !globalUserId, 
  });

const [acceptDelivery] = useMutation(ACCEPTDELIVERY, { 
    onCompleted: () => {
      showToast("Delivery accepted successfully", "success");
      refetch();
    }, 
    onError: (e: any) => console.log('Acceptance Error', e) 
  });
  
useEffect(() => {
  if (data) {
    const mockShipment = data.getRidersDelivery.filter((delivery: any) => delivery.deliveryStatus !== "Delivered" && delivery.deliveryStatus !== "Cancelled").map((delivery: any) => ({
      trackingNumber: delivery.trackingNumber, 
      id: delivery.id, 
      sender: delivery.sender.name, 
      phoneNumber: delivery.sender.phoneNumber, 
      pickupAddress: delivery.pickupAddress, 
      pickupLatitude: delivery.pickupLatitude, 
      pickupLongitude: delivery.pickupLongitude, 
      recipientName: delivery.recipientName, 
      recipientPhone: delivery.recipientPhone, 
      dropoffAddress: delivery.dropoffAddress, 
      dropoffLatitude: delivery.dropoffLatitude, 
      dropoffLongitude: delivery.dropoffLongitude, 
      deliveryStatus: capitalize(delivery.deliveryStatus), 
      estimatedDeliveryTime: formatDate(delivery.estimatedDeliveryTime), 
      earnings: "120.00", 
      packages: delivery.packages
    }));
    setOriginalDeliveries(mockShipment);
    setFilteredDeliveries(mockShipment);
  }
}, [data]);

  if (loading || !data) return <DashboardLoading />;

const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
  // Reset to original data if filters are empty
  if (!search && !date) {
    setFilteredDeliveries(originalDeliveries);
    return;
  }

  const result = filteredDeliveries.filter((d) => {
    // Search filter (case insensitive)
    const searchMatch = search 
      ? d.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.recipientName.toLowerCase().includes(search.toLowerCase()) ||
        d.sender.toLowerCase().includes(search.toLowerCase())
      : true;

    // Date filter
    const dateMatch = date
      ? new Date(d.estimatedDeliveryTime).toDateString() === date.toDateString()
      : true;

    return searchMatch && dateMatch;
  });

  setFilteredDeliveries(result);
  
  // Optional: Show message when no results found
  if (result.length === 0) {
    // showToast("No deliveries match your filters", "info");
  }
};

  const handleGetIp = (delivery: any) => { 
    setSelectedDelivery(delivery); 
    setMap(true); 
  };

  const handleAccept = async (id: string, riderId: string) => { 
    await acceptDelivery({ 
      variables: { deliveryId: id, riderId: riderId } 
    });
  };
console.log(filteredDeliveries);
  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row"> 
      <aside className="hidden md:block md:w-64 bg-white/70 backdrop-blur-lg border-r border-gray-200 shadow-md p-6 rounded-r-3xl"> 
        <h2 className="text-2xl font-bold text-gray-800 mb-10 tracking-tight">🚚 Driver Panel</h2> 
        <nav> 
          <ul className="space-y-4 text-[15px] font-medium">
            {['Deliveries','Dispatch', 'History'].map(tab => (
              <li
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer rounded-lg px-3 py-2 transition-all duration-200 ${
                  activeTab === tab
                    ? 'customgrad text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </li>
            ))}
          </ul> 
        </nav> 
      </aside>
      
      <main className="flex-1">
        {activeTab === "Deliveries" && (
          <>
            <FilterBar onFilter={handleFilter} />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-0">
              {filteredDeliveries.length > 0? filteredDeliveries?.map((delivery) => (
                <Card key={delivery.id} className="transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] border border-gray-200 rounded-2xl">
                  <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                    <div>
                      <div className="text-lg font-semibold text-gray-800">{delivery.trackingNumber}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="font-medium">From:</span> {delivery.pickupAddress}<br />
                        <span className="font-medium">To:</span> {delivery.dropoffAddress}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="italic">ETA: {delivery.estimatedDeliveryTime || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 bg-orange-500 hover:bg-blue-50 hover:border-blue-500"
                        onClick={() => openDetails(delivery)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        disabled={delivery.deliveryStatus === "Pending"}
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 customgrad hover:bg-blue-50 hover:border-blue-500"
                        onClick={() => handleGetIp(delivery)}
                      >
                        <Compass className="w-4 h-4 mr-1" /> {delivery.deliveryStatus === "Pending" ? "Accept Delivery" : "Track"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )):(<h1 className="text-2xl font-bold text-gray-800 mb-4">No Deliveries...</h1>)}
            </div>
          </>
        )}

        {activeTab === "History" && <HistoryContainer />}

        {activeTab === "Dispatch" && (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around z-50">
        {['Deliveries','Dispatch','History'].map(tab => (
          <button
            key={tab}
            className={`flex flex-col items-center transition p-2 w-[100%] h-[100%] ${
              activeTab === tab ? 'customgrad text-white-100 font-semibold' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {showDetails && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl animate-slide-up overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">📦 Delivery Details</h2>
              <button onClick={closeDetails} className="p-1 rounded hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <DeliveryDetailCard
                sender={{
                  name: selectedDelivery.sender,
                  address: selectedDelivery.pickupAddress,
                  contact: selectedDelivery.phoneNumber,
                }}
                recipient={{
                  name: selectedDelivery.recipientName,
                  address: selectedDelivery.dropoffAddress,
                  contact: selectedDelivery.recipientPhone,
                }}
                billing={{
                  distanceKm: null,
                  baseRate: 50,
                  perKmRate: 10,
                  total: null,
                }}
                coordinates={{
                  pickLat: selectedDelivery.pickupLatitude,
                  pickLng: selectedDelivery.pickupLongitude,
                  dropLat: selectedDelivery.dropoffLatitude,
                  dropLng: selectedDelivery.dropoffLongitude,
                }}
                onTrackClick={() => {}}
                onAcceptClick={() => {handleAccept(selectedDelivery.id, globalUserId);}}
              />
            </div>
          </div>
        </div>
      )}

      {showMap && selectedDelivery && (
        <div className="fixed h-[100vh] inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 flex flex-col">
          <button
            onClick={() => setMap(false)}
            className="fixed top-5 right-5 z-50 p-1 rounded hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-full h-[100vh] sm:max-w-md bg-white p-0 shadow-lg animate-slide-up overflow-y-auto">
            <RiderMap
              deliveryId={selectedDelivery.id}
              coordinates={{
                lat: selectedDelivery.dropoffLatitude,
                lng: selectedDelivery.dropoffLongitude,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
