"use client";

import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, DownloadIcon, EyeIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useQuery } from '@apollo/client';
import { DELIVERIES } from '../../../graphql/query'
import { decryptToken,capitalize } from '../../../utils/decryptToken';

export default function SenderShipmentHistory() {
  const [useID, setID] = useState();
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
        if (token && secret) {
          const payload = await decryptToken(token, secret);
          setID(payload.userID);
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
      receiver: delivery.recipientName,
      dropoff: delivery.dropoffAddress,
      status: status,
      date: delivery.createdAt,
    };
  });

  const filtered = mockShipment.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Input
            placeholder="Search by Delivery ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Filter by Date
          </Button>
        </div>

        <div className="grid gap-4">
          {filtered.map((shipment) => (
            <Card key={shipment.id}>
              <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {shipment.date}
                  </div>
                  <div className="font-semibold">{shipment.id}</div>
                  <div className="text-sm">To: {shipment.receiver} ({shipment.dropoff})</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
  variant={
    shipment.status === "Delivered"
      ? "success"        // ✅ green
      : shipment.status === "In Transit"
      ? "secondary"      // ✅ gray-blue
      : shipment.status === "Pending"
      ? "outline"        // ✅ neutral outline
      : shipment.status === "Canceled"
      ? "destructive"    // ✅ red
      : "default"
  }
>
  {shipment.status}
</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      setSelectedShipment(shipment);
                      setDrawerOpen(true);
                    }}
                  >
                    <EyeIcon className="w-4 h-4" /> View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <DownloadIcon className="w-4 h-4" /> Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sliding Drawer (Bottom) */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white shadow-t-lg transform transition-transform duration-300 ease-in-out z-50
            ${drawerOpen ? "translate-y-0" : "translate-y-full"}
            h-1/2 sm:h-[300px] rounded-t-2xl border-t
          `}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Shipment Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDrawerOpen(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
          {selectedShipment && (
            <div className="p-4 space-y-3 text-sm overflow-y-auto">
              <div><strong>Tracking ID:</strong> {selectedShipment.id}</div>
              <div><strong>Receiver:</strong> {selectedShipment.receiver}</div>
              <div><strong>Drop-off Address:</strong> {selectedShipment.dropoff}</div>
              <div><strong>Status:</strong> {selectedShipment.status}</div>
              <div><strong>Date:</strong> {selectedShipment.date}</div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {drawerOpen && (
        <div
          className="absolute top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.5)] z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
