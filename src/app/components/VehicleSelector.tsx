'use client';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { VEHICLEQUERY } from '../../../graphql/query';
import Loading from './ui/Loading';

type VehicleType = {
  id: string;
  name: string;
  maxCapacityKg: number;
  maxVolumeM3: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  icon: string;
  cost: number;
};

export default function VehicleSelector() {
  const { loading, error, data } = useQuery(VEHICLEQUERY);
  const [selected, setSelected] = useState<string>('bike');
  const [collapsed, setCollapsed] = useState<string | null>(null);

  if (loading) return <Loading lines={4} />;
  if (error) return <p>Error: {error.message}</p>;

  const toggleCollapse = (vehicleId: string) => {
    if (selected === vehicleId && collapsed === vehicleId) {
      setCollapsed(null);
    } else {
      setSelected(vehicleId);
      setCollapsed(vehicleId);
    }
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
      <div className="space-y-3 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">🚚 Choose Vehicle Type</h2>
        {data.getVehicleTypes.map((vehicle: VehicleType) => {
          const isSelected = selected === vehicle.id;
          const isExpanded = collapsed === vehicle.id;

          return (
            <div key={vehicle.id}>
              <button
                type="button"
                onClick={() => toggleCollapse(vehicle.id)}
                className={`relative w-full text-left border rounded-xl p-4 flex items-center gap-4 transition ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {/* Check indicator with icon */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Icon icon="mdi:check" className="text-sm" />
                  </div>
                )}

                <div>
                  <Icon icon={vehicle.icon} style={{ height: '40px', width: '40px' }} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold">{vehicle.name}</p>
                  <p className="text-sm text-gray-500">{vehicle.description}</p>
                </div>
                <div className="text-sm font-bold text-gray-700">{vehicle.cost}</div>
              </button>

              {/* Collapsible section */}
              {isExpanded && (
                <div className="p-4 border border-t-0 border-green-200 bg-green-50 rounded-b-xl text-sm text-gray-700 space-y-2">
                  <p><strong>Additional Services:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Loading assistance</li>
                    <li>Packaging materials</li>
                    <li>Insurance options</li>
                    <li>Driver tracking</li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
