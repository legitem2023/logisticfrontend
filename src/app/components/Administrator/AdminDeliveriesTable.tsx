'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GETDELIVERIESADMIN, RIDERS } from '../../../../graphql/query';
import { ASSIGNRIDER } from '../../../../graphql/mutation';
import AdminDeliveriesLoading from "./AdminDeliveriesLoading";
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

import { PackageCheck, User, Phone, MapPin, Truck, BadgeCheck, CreditCard } from "lucide-react";
import Collapsible from "../ui/Collapsible"; // adjust path as needed

const AdminDeliveriesTable = () => {
  const { data, loading, error } = useQuery(GETDELIVERIESADMIN);
  const { data: ridersData } = useQuery(RIDERS);
  const [assignRider] = useMutation(ASSIGNRIDER, {
    onCompleted: (e) => {
      console.log(e);
    },
  });

  const handleAssignRider = async (deliveryId: string, riderId: string) => {
    try {
      await assignRider({
        variables: {
          deliveryId,
          riderId,
        },
        refetchQueries: [GETDELIVERIESADMIN],
      });
    } catch (err) {
      console.error('Failed to assign rider:', err);
    }
  };

  if (loading) return <AdminDeliveriesLoading />;

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error fetching deliveries: {error.message}
      </div>
    );
  }

  const deliveries = data?.getDeliveries ?? [];
  const riders = ridersData?.getRiders ?? [];

  return (
    <div className="w-full p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {deliveries.map((delivery: any) => (
          <Card key={delivery.id} className="border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
  <CardContent className="p-6 space-y-4 text-sm text-zinc-800">
    
    <div className="flex justify-between items-center font-mono text-xs text-zinc-500">
      <span className="font-semibold">📦 Tracking:</span>
      <span>{delivery.trackingNumber}</span>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <User size={14} /> Recipient
      </p>
      <p>{delivery.recipientName}</p>
      <p className="text-xs text-zinc-400 flex items-center gap-1"><Phone size={12} /> {delivery.recipientPhone}</p>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <MapPin size={14} /> Pickup
      </p>
      <p className="text-xs text-zinc-500">{delivery.pickupAddress}</p>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <MapPin size={14} /> Dropoff
      </p>
      <p className="text-xs text-zinc-500">{delivery.dropoffAddress}</p>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <BadgeCheck size={14} /> Status
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{delivery.deliveryStatus}</Badge>
        {delivery.isCancelled && (
          <Badge variant="destructive">Cancelled</Badge>
        )}
      </div>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <Truck size={14} /> Rider
      </p>
      {delivery.assignedRider ? (
        <div className="text-sm text-zinc-700">
          {delivery.assignedRider.name}
          <br />
          <span className="text-xs text-zinc-400">
            {delivery.assignedRider.phoneNumber}
          </span>
        </div>
      ) : (
        <select
          className="w-full mt-1 text-sm border border-zinc-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              handleAssignRider(delivery.id, e.target.value);
            }
          }}
        >
          <option value="" disabled>Select a rider</option>
          {riders.map((rider: any) => (
            <option key={rider.id} value={rider.id}>
              {rider.name} ({rider.phoneNumber})
            </option>
          ))}
        </select>
      )}
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <User size={14} /> Sender
      </p>
      <p className="text-sm text-zinc-700">{delivery.sender?.name}</p>
      <p className="text-xs text-zinc-400">{delivery.sender?.phoneNumber}</p>
    </div>

    <div className="flex justify-between text-sm font-medium text-zinc-700">
      <span>Fee</span>
      <span className="text-right">₱{delivery.deliveryFee?.toFixed(2) ?? '0.00'}</span>
    </div>

    <div>
      <p className="text-[13px] font-semibold text-zinc-700 flex items-center gap-1">
        <CreditCard size={14} /> Payment
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-600">{delivery.paymentMethod}</span>
        <Badge variant={delivery.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
          {delivery.paymentStatus}
        </Badge>
      </div>
    </div>

    {/* 📦 Packages */}
    {delivery.packages?.length > 0 && (
      <Collapsible title={`Packages (${delivery.packages.length})`}>
        <div className="space-y-3 pt-2">
          {delivery.packages.map((pkg: any, index: number) => (
            <div key={index} className="border rounded-lg p-3 text-sm text-zinc-600 bg-zinc-50 shadow-sm">
              <p><strong>Type:</strong> {pkg.packageType}</p>
              <p><strong>Weight:</strong> {pkg.weight}kg</p>
              <p><strong>Dimensions:</strong> {pkg.dimensions}</p>
              <p className="text-xs text-zinc-400 italic">{pkg.specialInstructions}</p>
            </div>
          ))}
        </div>
      </Collapsible>
    )}

  </CardContent>
</Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDeliveriesTable;
