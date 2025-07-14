// components/DriverDashboard.tsx
import { useState,useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { useMutation, useQuery } from "@apollo/client";
import { DELIVERIES } from "../../../../graphql/query";
import { MapPin, Clock, CheckCircle, PackageCheck } from "lucide-react";
import Loading from "../ui/Loading";
import Cookies from 'js-cookie';
import { decryptToken,capitalize,formatDate } from '../../../../utils/decryptToken';
import { ACCEPTDELIVERY } from "../../../../graphql/mutation";

export default function DriverDashboard() {
  const [AcceptDelivery] = useMutation(ACCEPTDELIVERY,{
    onCompleted: () => {
      console.log("Delivery accepted successfully");
    },
  });
  const [useID, setID] = useState();
  const [delivery, setDelivery] = useState<any>(null);

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setID(payload.userId);
        }
      } catch (err) {
        console.error('Error getting role:', err);
        setID(null);
      }
    };
    getRole();
  }, []);

  const { data, loading, error } = useQuery(DELIVERIES, {
    variables: { id: useID }
  });

  if (loading || !data) return null;

  const mockShipment = data.getRidersDelivery.map((delivery: any) => {
    const status = capitalize(delivery.deliveryStatus);
    return {
      id: delivery.trackingNumber,
      sender: delivery.id,
      pickup: delivery.pickupAddress,
      dropoff: delivery.dropoffAddress,
      status: status,
      date: formatDate(delivery.createdAt),
    };
  });

  const handleAccept = (id: string,riderId: string) => {
    console.log(id,riderId,AcceptDelivery);
    AcceptDelivery({ variables: { 
      deliveryId: id,
      riderId: riderId
     } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar for desktop/tablet */}
      <aside className="hidden md:block md:w-64 bg-white shadow p-4">
        <h2 className="text-xl font-semibold mb-6">Driver Panel</h2>
        <nav>
          <ul className="space-y-4">
            <li className="font-medium text-blue-600">My Deliveries</li>
            <li className="text-gray-600">History</li>
            <li className="text-gray-600">Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Assigned Deliveries</h1>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? <Loading lines={4}/> : mockShipment.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PackageCheck className="w-4 h-4" />
                  <span>{d.customer}</span>
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
                  <span>ETA: {d.eta}</span>
                </div>
                <Button className="w-full" onClick={() => handleAccept(d.id,useID)}>
                  Accept Delivery
                </Button>
                {/* {d.status === "assigned" ? (
                  <Button
                    className="w-full"
                    onClick={() => handleAccept(d.id)}
                  >
                    Accept Delivery
                  </Button>
                ) : (
                  <div className="text-green-600 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Accepted
                  </div>
                )} */}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow border-t flex justify-around p-2">
        <button className="text-blue-600 font-semibold">Deliveries</button>
        <button className="text-gray-600">History</button>
        <button className="text-gray-600">Settings</button>
      </nav>
    </div>
  );
}
