// app/components/SenderShipmentHistory.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { useState } from "react";

const mockShipments = [
  {
    id: "DEL-0001",
    receiver: "Maria Santos",
    dropoff: "Quezon City",
    status: "Delivered",
    date: "2025-07-10",
  },
  {
    id: "DEL-0002",
    receiver: "Juan Dela Cruz",
    dropoff: "Makati City",
    status: "In Transit",
    date: "2025-07-13",
  },
  {
    id: "DEL-0003",
    receiver: "Ana Reyes",
    dropoff: "Taguig City",
    status: "Canceled",
    date: "2025-07-11",
  },
];

export default function SenderShipmentHistory() {
  const [search, setSearch] = useState("");

  const filtered = mockShipments.filter((s) =>
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
