"use client";

import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Card, CardContent } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { CalendarIcon, EyeIcon, DollarSign } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectTempUserId } from '../../../Redux/tempUserSlice';
import { GETDISPATCH } from '../../../graphql/query';



export default function RiderShipmentHistory() {
  const [search, setSearch] = useState("");
  const globalUserId = useSelector(selectTempUserId);

  const { data, loading, error } = useQuery(GETDISPATCH, {
    variables: { getDispatchId: globalUserId },
    skip: !globalUserId,
  });

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading dispatch history</div>;
  if (!data?.getDispatch) return <div className="p-6">No dispatch found.</div>;

  const delivery = data.getDispatch;

  const filtered = [delivery].filter((d) =>
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
        {filtered.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  {new Date(d.createdAt).toLocaleDateString()}
                </div>
                <div className="font-semibold">{d.id}</div>
                <div className="text-sm">
                  From: {d.pickupAddress} → To: {d.dropoffAddress}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    d.deliveryStatus === "Delivered"
                      ? "success"
                      : d.deliveryStatus === "Canceled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {d.deliveryStatus}
                </Badge>
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ₱{d.deliveryFee || 0}
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
