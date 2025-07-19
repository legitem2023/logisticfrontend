'use client';
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import RiderMap from "./RiderMap";
import { showToast } from '../../../../utils/toastify';
import { Card, CardContent } from "../ui/Card";
import { useMutation, useQuery } from "@apollo/client";
import { DELIVERIES } from "../../../../graphql/query";
import HistoryContainer from "../History/HistoryContainer";
import { MapPin, Clock, CheckCircle, PackageCheck, X, Compass } from "lucide-react";
import DashboardLoading from "../ui/DashboardLoading";
import Cookies from "js-cookie";
import { decryptToken, capitalize, formatDate } from "../../../../utils/decryptToken";
import { ACCEPTDELIVERY } from "../../../../graphql/mutation";
import DeliveryDetailCard from "./DeliveryDetailCard";
export default function DriverDashboard() {
  const [acceptDelivery] = useMutation(ACCEPTDELIVERY,{
    onCompleted: () => {
      showToast("Delivery accepted successfully","success");
    },
    onError: (e: any) => {
      console.log('Acceptance Error', e);
    }
  });

  const [useID, setID] = useState();
  const [activeTab, setActiveTab] = useState("Deliveries");
  const [showMap,setMap] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

  const openDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowDetails(true);    
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedDelivery(null);
  };

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get("token");
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setID(payload.userId);
        }
      } catch (err) {
        console.error("Error getting role:", err);
        setID(null);
      }
    };
    getRole();
  }, []);

  const { data, loading } = useQuery(DELIVERIES, {
    variables: { id: useID },
  });

  if (loading || !data) return <DashboardLoading />;
  const mockShipment = data.getRidersDelivery.map((delivery: any) => {
    const status = capitalize(delivery.deliveryStatus);
    return {
      id: delivery.id,
      sender: delivery.sender.name,
      phoneNumber:delivery.sender.phoneNumber,
      pickupAddress: delivery.pickupAddress,
      pickupLatitude:delivery.pickupLatitude,
      pickupLongitude:delivery.pickupLongitude,
      recipientName:delivery.recipientName,
      recipientPhone:delivery.recipientPhone,
      dropoffAddress: delivery.dropoffAddress,
      dropoffLatitude:delivery.dropoffLatitude,
      dropoffLongitude:delivery.dropoffLongitude,
      deliveryStatus: status,
      estimatedDeliveryTime: formatDate(delivery.estimatedDeliveryTime),
    };
  });

  const handleAccept = async (id: string, riderId: string) => {
    await acceptDelivery({
      variables: {
        deliveryId: id,
        riderId: riderId,
      },
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for desktop/tablet */}
<aside className="hidden md:block md:w-64 bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-inner p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-8">Driver Panel</h2>
  <nav>
    <ul className="space-y-6 text-base">
      {["Deliveries", "History", "Settings"].map(tab => (
        <li
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`cursor-pointer transition-all duration-150 ${
            activeTab === tab
              ? "text-blue-600 font-semibold border-l-4 border-blue-600 pl-2"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          {tab}
        </li>
      ))}
    </ul>
  </nav>
</aside>


      {/* Main content */}
      <main className="flex-1 p-0">
        {activeTab === "Deliveries" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-1">
              {mockShipment.map((d) => (
                  <Card key={d.id} className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 ">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <PackageCheck className="w-4 h-4 text-blue-600" />
                        <span>{d.sender}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <p className="text-sm">{d.pickupAddress}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <p className="text-sm">{d.dropoffAddress}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>ETA: {d.estimatedDeliveryTime || "N/A"}</span>
                      </div>
                      <div className="flex flex-row gap-2">
                        <Button
                        variant="outline"
                        className="flex-1 w-full transition-all duration-200 hover:scale-[1.02] hover:shadow"
                        onClick={() => openDetails(d)}
                      >
                        Show Details
                      </Button>
                        <Button
                        variant="outline"
                        className="flex-1 w-full transition-all duration-200 hover:scale-[1.02] hover:shadow"
                        onClick={() => {
                          setMap(true);
                          console.log("Navigate",d);
                        }}
                        ><Compass className="w-4 h-4 text-black-800"/>Navigate</Button>
                      </div>
                      
                    </CardContent>
                  </Card>

              ))}
            </div>
          </>
        )}

        {activeTab === "History" && (
          <div>
            <HistoryContainer />
          </div>
        )}

        {activeTab === "Settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </main>

      {/* Bottom nav for mobile */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-300 shadow-inner flex justify-around p-2 z-50">
  {["Deliveries", "History", "Settings"].map(tab => (
    <button
      key={tab}
      className={`transition-colors duration-150 ${
        activeTab === tab ? "text-blue-600 font-semibold" : "text-gray-500"
      }`}
      onClick={() => setActiveTab(tab)}
    >
      {tab}
    </button>
  ))}
</nav>

      {/* Slide-up modal for delivery details */}
      {showDetails && selectedDelivery && (
<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ">
  <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-lg animate-slide-up overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg sm:text-xl font-semibold">Delivery Details</h2>
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
          pickLat:selectedDelivery.pickupLatitude,
          pickLng:selectedDelivery.pickupLongitude,
          dropLat:selectedDelivery.dropoffLatitude,
          dropLng:selectedDelivery.dropoffLongitude,
        }}
        onTrackClick={() => {
          // call distance calculation function here
        }}
        onAcceptClick={() => {
          handleAccept(selectedDelivery.id,useID);
        }}
      />
    </div>
  </div>
</div>
      )}
   {/* Slide-up modal for Navigation */} 
      {showMap && (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 ">
        <div className="w-full max-h-[100vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-lg animate-slide-up overflow-y-auto">
          <RiderMap/>
        </div>
      </div>)
      }
    </div>
  );
}
