'use client';

import { useState, useEffect } from "react"; 
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button"; 
import Collapsible from "../ui/Collapsible";
import { Clock, MapPin, Bike, Compass, X, XCircle } from "lucide-react";
import HistoryContainer from "../History/HistoryContainer"; 
import { LocationTracking } from '../../../../graphql/subscription'; // update with correct path

import { CANCELEDDELIVERY } from "../../../../graphql/mutation"; 
import { useMutation, useQuery, useSubscription } from "@apollo/client"; 
import { showToast } from '../../../../utils/toastify'; 
import { GETDISPATCH } from '../../../../graphql/query';
import CreatePackageForm from "./CreatePackageForm";
import { useSelector } from "react-redux";
import { selectTempUserId } from '../../../../Redux/tempUserSlice';
import { formatDate, getMinutesFromNow } from '../../../../utils/decryptToken';
import FilterBar from "../Rider/Filterbar";
import SenderDashboardLoading from "./SenderDashboardLoading";
import dynamic from "next/dynamic";
const SenderMap = dynamic(() => import("./SenderMap"), { ssr: false });


export default function SenderDashboard() {
  const globalUserId = useSelector(selectTempUserId);
  const GlobalactiveIndex = useSelector((state: any) => state.activeIndex.value);
  const [search, setSearch] = useState("");
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Deliveries"); 
  const [showMap, setMap] = useState(false); 
  const [selectedDelivery, setSelectedDelivery] = useState(null); 
 
  const { data: locationData } = useSubscription(LocationTracking, {
    variables: { userId: selectedDelivery?.assignedRiderId },
  });
  console.log(locationData,'x');
  const [cancelDelivery] = useMutation(CANCELEDDELIVERY,{
   onCompleted: () => {
     showToast("Delivery Cancelled", "success");
     refetch();                
   },
   onError: (e: any) => console.log('Finished Error', e)
  })


    const openMap = (delivery: any) => { 
    setSelectedDelivery(delivery); 
      console.log(delivery);
    setMap(true); 
  };
  const { data, loading, error,refetch } = useQuery(GETDISPATCH, {
    variables: { id: globalUserId },
    skip: !globalUserId,
  });

  const acceptedDeliveries = data?.getDispatch.filter((delivery: any) => delivery.deliveryStatus !== "Delivered" && delivery.deliveryStatus !== "Cancelled") || [];

  useEffect(() =>{
   refetch();
  },[GlobalactiveIndex])

  
  // Set deliveries when fetched
  useEffect(() => {
    if (acceptedDeliveries.length) {
      setFilteredDeliveries(acceptedDeliveries);
    }
  }, [acceptedDeliveries]);

  const handleFilter = ({ search, date }: { search: string; date: Date | null }) => {
    let filtered = [...filteredDeliveries];

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

const handleCancel = (data) =>{
  const conf = confirm("Are you sure you want to cancel this delivery?");
  if(conf){
    cancelDelivery({
      variables: {
        deliveryId:data.id,
        riderId:data.assignedRiderId
      }
    })
  }
}

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Sender Panel</h2>
        <nav> 
          <ul className="space-y-4 text-[15px] font-medium">
            {['Deliveries', 'History'].map(tab => (
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

      {/* Main Content */}
      <main className="flex-1 p-0 border-box">
        { activeTab === "Deliveries" && (
         <FilterBar onFilter={handleFilter} />
        )}     
        { loading ? (
          <SenderDashboardLoading/>
        ) : error ? (
          <div className="text-center mt-8 text-red-500">Error loading deliveries</div>
        ) : (
      
          <div className="grid gap-1 md:grid-cols-2 xl:grid-cols-3 p-0">
        
            { activeTab === "Deliveries" &&  filteredDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-5 space-y-4">
                  <div>Created:{formatDate(delivery.createdAt)}</div>
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
                        onClick={() => openMap(delivery)} 
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 customgrad hover:bg-blue-50 hover:border-blue-500">
                        <Compass className="w-4 h-4 mr-1" />Track</Button>
                  </div>)}

                  {delivery.deliveryStatus==='in_transit' && (<div className="flex items-center gap-2 text-sm text-gray-500">
                  <Button
                        onClick={() => handleCancel(delivery)} 
                        variant="outline"
                        className="w-full sm:w-auto transition-all text-white duration-200 bg-red-800 hover:bg-red-200 hover:border-red-500">
                        <XCircle className="w-4 h-4 mr-1" />Cancel</Button>
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
            { activeTab === "History" && <HistoryContainer/>}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-0 z-50">
        {['Deliveries','History'].map(tab => (
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

      {showMap && (
        <div className="fixed h-[100vh] inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 flex flex-col">
          <button
            onClick={() => setMap(false)}
            className="fixed top-5 right-5 z-50 p-1 rounded hover:bg-gray-100 transition"
          >
            <XCircle className="w-5 h-5 text-red-600" />
          </button>
          <div className="w-full h-[100vh] sm:max-w-md bg-white p-0 shadow-lg animate-slide-up overflow-y-auto">
            <SenderMap
              riderId={selectedDelivery.assignedRiderId}
              riderPOS={{
                lat: selectedDelivery.pickupLatitude,
                lng: selectedDelivery.pickupLongitude,
              }}
              senderPOS={{
                lat: selectedDelivery.pickupLatitude,
                lng: selectedDelivery.pickupLongitude, 
              }}
              receiverPOS={{
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
