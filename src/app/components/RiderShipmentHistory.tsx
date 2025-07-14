// app/components/RiderShipmentHistory.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "@./ui/Badge";
import { CalendarIcon, EyeIcon, DollarSign } from "lucide-react";
import { useState } from "react";

const mockDeliveries = [
  {
    id: "RID-DEL-2025-001",
    pickup: "Binondo, Manila",
    dropoff: "Pasig City",
    status: "Delivered",
    date: "2025-07-10",
    earnings: 180,
  },
  {
    id: "RID-DEL-2025-002",
    pickup: "Makati City",
    dropoff: "San Juan City",
    status: "Canceled",
    date: "2025-07-12",
    earnings: 0,
  },
  {
    id: "RID-DEL-2025-003",
    pickup: "Taguig City",
    dropoff: "Caloocan City",
    status: "Delivered",
    date: "2025-07-13",
    earnings: 210,
  },
];

export default function RiderShipmentHistory() {
  const [search, setSearch] = useState("");

  const filtered = mockDeliveries.filter((d) =>
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Input
          placeholder="Search Delivery ID"
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
        {filtered.map((delivery) => (
          <Card key={delivery.id}>
            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <div>
                <div className="text-sm text-muted-foreground">{delivery.date}</div>
                <div className="font-semibold">{delivery.id}</div>
                <div className="text-sm">
                  From: {delivery.pickup} → To: {delivery.dropoff}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    delivery.status === "Delivered"
                      ? "success"
                      : delivery.status === "Canceled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {delivery.status}
                </Badge>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ₱{delivery.earnings}
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" /> View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
