'use client';
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { useMutation, useQuery } from "@apollo/client";
import { DELIVERIES } from "../../../../graphql/query";
import HistoryContainer from "../History/HistoryContainer";
import { MapPin, Clock, CheckCircle, PackageCheck, X } from "lucide-react";
import DashboardLoading from "../ui/DashboardLoading";
import Cookies from "js-cookie";
import { decryptToken, capitalize, formatDate } from "../../../../utils/decryptToken";
import { ACCEPTDELIVERY } from "../../../../graphql/mutation";

export default function DriverDashboard() {
  const [acceptDelivery] = useMutation(ACCEPTDELIVERY, {
    onCompleted: () => {
      console.log("Delivery accepted successfully");
    },
    onError: (e: any) => {
      console.log('Acceptance Error', e);
    }
  });
  const [useID, setID] = useState();
  const [activeTab, setActiveTab] = useState("Deliveries");

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
      id: delivery.trackingNumber,
      sender: delivery.recipientName,
      pickup: delivery.pickupAddress,
      dropoff: delivery.dropoffAddress,
      status: status,
      date: formatDate(delivery.createdAt),
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
      <aside className="hidden md:block md:w-64 bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-6">Driver Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li
              onClick={() => setActiveTab("Deliveries")}
              className={`cursor-pointer ${activeTab === "Deliveries"
                ? "font-medium text-blue-600"
                : "text-gray-600"
                }`}
            >
              My Deliveries
            </li>
            <li
              onClick={() => setActiveTab("History")}
              className={`cursor-pointer ${activeTab === "History"
                ? "font-medium text-blue-600"
                : "text-gray-600"
                }`}
            >
              History
            </li>
            <li
              onClick={() => setActiveTab("Settings")}
              className={`cursor-pointer ${activeTab === "Settings"
                ? "font-medium text-blue-600"
                : "text-gray-600"
                }`}
            >
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-0">
        {activeTab === "Deliveries" && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 p-1">
              {mockShipment.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PackageCheck className="w-4 h-4" />
                      <span>{d.sender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <p className="text-sm">{d.pickup}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <p className="text-sm">{d.dropoff}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>ETA: {d.eta || "N/A"}</span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAccept(`${d.id}`, `${useID}`)}
                    >
                      Accept Delivery
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openDetails(d)}
                    >
                      Show Details
                    </Button>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow border-t flex justify-around p-2">
        <button
          className={activeTab === "Deliveries"
            ? "text-blue-600 font-semibold"
            : "text-gray-600"}
          onClick={() => setActiveTab("Deliveries")}
        >
          Deliveries
        </button>
        <button
          className={activeTab === "History"
            ? "text-blue-600 font-semibold"
            : "text-gray-600"}
          onClick={() => setActiveTab("History")}
        >
          History
        </button>
        <button
          className={activeTab === "Settings"
            ? "text-blue-600 font-semibold"
            : "text-gray-600"}
          onClick={() => setActiveTab("Settings")}
        >
          Settings
        </button>
      </nav>

      {/* Slide-up modal for delivery details */}
      {showDetails && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl p-4 shadow-lg animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delivery Details</h2>
              <button onClick={closeDetails}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Tracking #:</strong> {selectedDelivery.id}</p>
              <p><strong>Sender:</strong> {selectedDelivery.sender}</p>
              <p><strong>Pickup Address:</strong> {selectedDelivery.pickup}</p>
              <p><strong>Dropoff Address:</strong> {selectedDelivery.dropoff}</p>
              <p><strong>Status:</strong> {selectedDelivery.status}</p>
              <p><strong>Date:</strong> {selectedDelivery.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
