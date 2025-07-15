import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PartyDetails = {
  name: string;
  address: string;
  contact: string;
};

type BillingDetails = {
  distanceKm: number | null;
  baseRate: number;
  perKmRate: number;
  total: number | null;
};

type Props = {
  sender: PartyDetails;
  recipient: PartyDetails;
  billing: BillingDetails;
  onTrackClick: () => void;
};

const DeliveryDetailCard: React.FC<Props> = ({ sender, recipient, billing, onTrackClick }) => {
  return (
    <Card className="w-full max-w-2xl p-4 space-y-6">
      <CardContent className="space-y-4">

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Sender Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Sender</h3>
            <p><span className="font-medium">Name:</span> {sender.name}</p>
            <p><span className="font-medium">Address:</span> {sender.address}</p>
            <p><span className="font-medium">Contact:</span> {sender.contact}</p>
          </div>

          {/* Recipient Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Recipient</h3>
            <p><span className="font-medium">Name:</span> {recipient.name}</p>
            <p><span className="font-medium">Address:</span> {recipient.address}</p>
            <p><span className="font-medium">Contact:</span> {recipient.contact}</p>
          </div>
        </div>

        {/* Tracking Button */}
        <div className="text-center">
          <Button onClick={onTrackClick}>Calculate Distance & Billing</Button>
        </div>

        {/* Billing Details */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Billing Summary</h3>
          {billing.total !== null ? (
            <div className="space-y-1">
              <p><span className="font-medium">Distance:</span> {billing.distanceKm?.toFixed(2)} km</p>
              <p><span className="font-medium">Base Rate:</span> ₱{billing.baseRate}</p>
              <p><span className="font-medium">Per Km Rate:</span> ₱{billing.perKmRate}</p>
              <p className="font-bold"><span>Total:</span> ₱{billing.total.toFixed(2)}</p>
            </div>
          ) : (
            <p className="italic text-gray-500">Distance and billing not yet calculated.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDetailCard;
