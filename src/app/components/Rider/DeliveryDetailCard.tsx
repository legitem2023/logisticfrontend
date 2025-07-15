import React from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

import {
  User,
  MapPin,
  Phone,
  Truck,
  Calculator,
  Receipt,
} from "lucide-react";

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

const LabelRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <p className="flex items-start gap-2">
    {icon}
    <span>
      <span className="font-medium">{label}:</span> {value}
    </span>
  </p>
);

const DeliveryDetailCard: React.FC<Props> = ({ sender, recipient, billing, onTrackClick }) => {
  return (
    <Card className="w-full max-w-2xl p-4 space-y-6">
      <CardContent className="space-y-4">

        {/* Sender and Recipient Info */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Sender */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <User className="w-5 h-5" /> Sender
            </h3>
            <LabelRow icon={<User className="w-4 h-4 text-gray-500" />} label="Name" value={sender.name} />
            <LabelRow icon={<MapPin className="w-4 h-4 text-gray-500" />} label="Address" value={sender.address} />
            <LabelRow icon={<Phone className="w-4 h-4 text-gray-500" />} label="Contact" value={sender.contact} />
          </div>

          {/* Recipient */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5" /> Recipient
            </h3>
            <LabelRow icon={<User className="w-4 h-4 text-gray-500" />} label="Name" value={recipient.name} />
            <LabelRow icon={<MapPin className="w-4 h-4 text-gray-500" />} label="Address" value={recipient.address} />
            <LabelRow icon={<Phone className="w-4 h-4 text-gray-500" />} label="Contact" value={recipient.contact} />
          </div>
        </div>

        {/* Tracking Button */}
        <div className="text-center">
          <Button onClick={onTrackClick} className="flex items-center gap-2 mx-auto">
            <Calculator className="w-4 h-4" /> Calculate Distance & Billing
          </Button>
        </div>

        {/* Billing */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Receipt className="w-5 h-5" /> Billing Summary
          </h3>

          {billing.total !== null ? (
            <div className="space-y-1 pl-1">
              <p><span className="font-medium">Distance:</span> {billing.distanceKm?.toFixed(2)} km</p>
              <p><span className="font-medium">Base Rate:</span> ₱{billing.baseRate}</p>
              <p><span className="font-medium">Per Km Rate:</span> ₱{billing.perKmRate}</p>
              <p className="font-bold"><span>Total:</span> ₱{billing.total.toFixed(2)}</p>
            </div>
          ) : (
            <p className="italic text-gray-500 pl-1">Distance and billing not yet calculated.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDetailCard;
