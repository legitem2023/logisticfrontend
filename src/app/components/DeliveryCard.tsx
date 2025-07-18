import React, { ReactNode } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import Collapsible from './ui/Collapsible';

type Props = {
  pickup: string;
  dropoff: string;
  children: ReactNode;
  assignedDriver?: ReactNode; // <-- New prop
  status?: 'in_progress' | 'completed' | 'pending' | 'cancelled';
};

export default function DeliveryCard({
  pickup,
  dropoff,
  status = 'in_progress',
  children,
  assignedDriver, // <-- Receive it here
}: Props) {
  const statusLabel = {
    in_progress: 'In Progress',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
  }[status];

  const statusColor = {
    in_progress: 'text-yellow-600',
    completed: 'text-green-600',
    pending: 'text-gray-500',
    cancelled: 'text-red-600',
  }[status];

  return (
    <div className="mt-5">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500">Status</p>
        <p className={`text-lg font-semibold ${statusColor}`}>{statusLabel}</p>
      </div>

      <div className="flex items-start gap-4 mb-3">
        <div className="flex flex-col items-center mt-1">
          <MapPin className="text-blue-600" />
          <div className="h-4 w-px bg-gray-300 my-1" />
          <Navigation className="text-green-600" />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-gray-500">Pick-up</p>
            <p className="text-base font-medium">{pickup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Drop-off</p>
            <p className="text-base font-medium">{dropoff}</p>
          </div>
        </div>
      </div>

      {/* Assigned Driver Collapsible */}
      {assignedDriver && (
        <div className="mb-3">
          <Collapsible title="Assigned Driver" defaultOpen={false}>
            {assignedDriver}
          </Collapsible>
        </div>
      )}

      {/* Map Collapsible */}
      {status === 'in_progress' && (
        <Collapsible title="View Map" defaultOpen={false}>
          {children}
        </Collapsible>
      )}
    </div>
  );
}
