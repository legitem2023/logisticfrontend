// app/components/SenderShipmentHistory.tsx
"use client";

import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { useState,useEffect } from "react";
import Cookies from 'js-cookie';
import { useMutation, useSubscription, useQuery } from '@apollo/client';
import { DELIVERIES } from '../../../graphql/query'
import { capitalize, decryptToken } from '../../../utils/decryptToken';

export default function SenderShipmentHistory() {
  const [useID,setID] = useState();
  
useEffect(() => {
    const getRole = async () => {
      try {
        const token = Cookies.get('token');
        const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string; // expose in env as NEXT_PUBLIC_*
        
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
  });

  const { data, loading, error } = useQuery(DELIVERIES, {
  variables: {
    id: useID
  }
});
  
const [search, setSearch] = useState("");
if(loading) return

 const mockShipment = data.getRidersDelivery.map((delivery: any) => {
  return {
    id: delivery.trackingNumber,
    receiver: delivery.recipientName,
    dropoff: delivery.dropoffAddress,
    status: delivery.deliveryStatus,
    date: delivery.createdAt,
  };
});
  const filtered = mockShipment.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
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
                      ? "success"
                      : shipment.status === "In Transit"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {shipment.status}
                </Badge>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
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
    </div>
  );
}
