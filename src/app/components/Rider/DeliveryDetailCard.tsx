import React from "react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

import dynamic from 'next/dynamic';
const RouteDistance = dynamic(() => import('../commands/RouteDistance'), { ssr: false });
import {
  User,
  MapPin,
  Phone,
  Truck,
  Calculator,
  Receipt,
  CheckSquare,
  Package,
  Scale,
  Ruler,
  Layers,
  BookOpen
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

type Coordinates = {
  pickLat:number;
  pickLng:number;
  dropLat:number;
  dropLng:number;
}

type Packages = {
  packageType: string;
  weight: number;
  dimensions: string;
  specialInstructions: string;
};

type Indicator = {
  loadingText:string;
  enable:boolean;
}

type Props = {
  sender: PartyDetails;
  recipient: PartyDetails;
  billing: BillingDetails;
  coordinates:Coordinates;
  packages: Packages[];
  Indicator:Indicator;
  onAcceptClick: () => void;
  onSkipClick: () => void;
};

const LabelRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <p className="flex items-start gap-3 text-sm text-gray-700">
    <span className="pt-0.5">{icon}</span>
    <span>
      <span className="font-semibold text-gray-800">{label}:</span>{" "}
      {value}
    </span>
  </p>
);

const DeliveryDetailCard: React.FC<Props> = ({
  sender,
  recipient,
  billing,
  coordinates,
  packages,
  Indicator,
  onAcceptClick,
  onSkipClick
}) => {

  return (
    <Card className="w-full max-w-2xl p-[2px] sm:p-2 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-white shadow-xl border border-gray-200">
  <CardContent className="space-y-2 p-0">
    {/* Sender and Recipient Info */}
    <div className="grid gap-2">
      {/* Sender */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-4 shadow-sm hover:shadow-md transition w-[100%]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-indigo-600">
          <User className="w-5 h-5" /> Sender
        </h3>
        <div className="space-y-2">
          <LabelRow
            icon={<User className="w-4 h-4 text-indigo-400" />}
            label="Name"
            value={sender.name}
          />
          <LabelRow
            icon={<MapPin className="w-4 h-4 text-indigo-400" />}
            label="Address"
            value={sender.address}
          />
          <LabelRow
            icon={<Phone className="w-4 h-4 text-indigo-400" />}
            label="Contact"
            value={sender.contact}
          />
        </div>
      </div>

      {/* Recipient */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-4 shadow-sm hover:shadow-md transition w-[100%]">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-green-600 ">
          <Truck className="w-5 h-5" /> Recipient
        </h3>
        <div className="space-y-2">
          <LabelRow
            icon={<User className="w-4 h-4 text-green-400" />}
            label="Name"
            value={recipient.name}
          />
          <LabelRow
            icon={<MapPin className="w-4 h-4 text-green-400" />}
            label="Address"
            value={recipient.address}
          />
          <LabelRow
            icon={<Phone className="w-4 h-4 text-green-400" />}
            label="Contact"
            value={recipient.contact}
          />
        </div>
      </div>
    </div>
     {/* Package */}
<div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-4 shadow-sm hover:shadow-md transition w-[100%]">
  <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-green-600">
    <Package className="w-5 h-5" /> Package(s)
  </h3>
  {packages.map((pkg, index) => (
    <div key={index} className="space-y-2 mb-4">
      <LabelRow
        icon={<Layers className="w-4 h-4 text-green-400" />}
        label="Type"
        value={pkg.packageType}
      />
      <LabelRow
        icon={<Scale className="w-4 h-4 text-green-400" />}
        label="Weight"
        value={`${pkg.weight} kg`}
      />
      <LabelRow
        icon={<Ruler className="w-4 h-4 text-green-400" />}
        label="Dimensions"
        value={pkg.dimensions}
      />
      <LabelRow
        icon={<BookOpen className="w-4 h-4 text-green-400" />}
        label="Instructions"
        value={pkg.specialInstructions}
      />
    </div>
  ))}
</div>

    {/* Billing */}
    <div className="border-t pt-2">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-rose-600">
        <Receipt className="w-5 h-5" /> Billing Summary
      </h3>

      {billing.total !== null ? (
        <div className="space-y-2 text-sm pl-1 text-gray-800">
          <p>
            <span className="font-medium">Distance:</span>{" "}
            {billing.distanceKm?.toFixed(2)} km
          </p>
          <p>
            <span className="font-medium">Base Rate:</span> ₱
            {billing.baseRate}
          </p>
          <p>
            <span className="font-medium">Per Km Rate:</span> ₱
            {billing.perKmRate}
          </p>
          <p className="text-lg font-bold text-rose-700">
            <span>Total:</span> ₱{billing.total.toFixed(2)}
          </p>
        </div>
      ) : (
        <div className="italic text-gray-400 pl-1">     
          <RouteDistance 
              from={{ lat: coordinates.pickLat, lng: coordinates.pickLng }}
              to={{ lat: coordinates.dropLat, lng: coordinates.dropLng }}
              baseRate={billing.baseRate}
              perKmRate={billing.perKmRate}
           />
        </div>
      )}

      <div className="text-center flex flex-row gap-2 mt-3">
        <Button
          disabled={Indicator.enable}
          onClick={onAcceptClick}
          className="flex-1 flex items-center gap-2 px-2 py-2 rounded-full bg-gradient-to-r from-green-800 to-green-500 text-white shadow-lg hover:brightness-110 transition"
        >
          <CheckSquare className="w-4 h-4" /> { Indicator.loadingText }
        </Button>
        <Button
          onClick={onSkipClick}
          className="flex-1 flex items-center gap-2 px-2 py-2 rounded-full bg-gradient-to-r from-red-800 to-red-500 text-white shadow-lg hover:brightness-110 transition"
        >
          <CheckSquare className="w-4 h-4" /> Skip
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
  );
};

export default DeliveryDetailCard;
