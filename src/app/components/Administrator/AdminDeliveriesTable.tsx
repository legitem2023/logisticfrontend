'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GETDELIVERIESADMIN, RIDERS } from '../../../../graphql/query';
import { ASSIGNRIDER } from '../../../../graphql/mutation';

import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

const AdminDeliveriesTable = () => {
  const { data, loading, error } = useQuery(GETDELIVERIESADMIN);
  const { data: ridersData } = useQuery(RIDERS);
  const [assignRider] = useMutation(ASSIGNRIDER,{
    onCompleted:(e)=>{ console.log(e)}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

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
    <div className="w-full p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveries.map((delivery: any) => (
          <Card key={delivery.id} className="shadow-md border border-gray-200 rounded-xl">
            <CardContent className="p-4 space-y-2">
              {/* Delivery Info */}
              <div className="flex justify-between items-center text-sm font-mono text-gray-700">
                <span className="font-semibold">Tracking:</span>
                <span>{delivery.trackingNumber}</span>
              </div>

              <div>
                <p className="text-sm font-medium">Recipient:</p>
                <p className="text-sm text-gray-800">{delivery.recipientName}</p>
                <p className="text-xs text-gray-500">{delivery.recipientPhone}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Pickup:</p>
                <p className="text-xs text-gray-600">{delivery.pickupAddress}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Dropoff:</p>
                <p className="text-xs text-gray-600">{delivery.dropoffAddress}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Status:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{delivery.deliveryStatus}</Badge>
                  {delivery.isCancelled && (
                    <Badge variant="destructive">Cancelled</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Rider:</p>
                {delivery.assignedRider ? (
                  <div className="text-xs text-gray-700">
                    {delivery.assignedRider.name}
                    <br />
                    <span className="text-muted-foreground">
                      {delivery.assignedRider.phoneNumber}
                    </span>
                  </div>
                ) : (
                  <select
                    className="w-full mt-1 text-sm border rounded px-2 py-1"
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignRider(delivery.id, e.target.value);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Select a rider
                    </option>
                    {riders.map((rider: any) => (
                      <option key={rider.id} value={rider.id}>
                        {rider.name} ({rider.phoneNumber})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <p className="text-sm font-medium">Sender:</p>
                <p className="text-xs text-gray-700">{delivery.sender?.name}</p>
                <p className="text-xs text-muted-foreground">{delivery.sender?.phoneNumber}</p>
              </div>

              <div className="flex justify-between text-sm font-medium">
                <span>Fee:</span>
                <span className="text-right">₱{delivery.deliveryFee?.toFixed(2) ?? '0.00'}</span>
              </div>

              <div>
                <p className="text-sm font-medium">Payment:</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-700">{delivery.paymentMethod}</span>
                  <Badge
                    variant={delivery.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                  >
                    {delivery.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDeliveriesTable;
