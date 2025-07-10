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
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  if (loading) return <Loading lines={4} />;
  if (error) return <p>Error: {error.message}</p>;

  const toggleDetails = (vehicleId: string) => {
    setExpandedDetails(prev => (prev === vehicleId ? null : vehicleId));
  };

  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">
      <div className="space-y-3 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2">🚚 Choose Vehicle Type</h2>
        {data.getVehicleTypes.map((vehicle: VehicleType) => {
          const isSelected = selected === vehicle.id;
          const showDetails = expandedDetails === vehicle.id;

          return (
            <div key={vehicle.id} className="border rounded-xl overflow-hidden">
              <div
                onClick={() => setSelected(vehicle.id)}
                className={`relative w-full text-left p-4 flex items-center gap-4 cursor-pointer transition ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {/* Check icon */}
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
              </div>

              {/* Toggle Additional Services Button */}
              <button
                onClick={() => toggleDetails(vehicle.id)}
                className="w-full px-4 py-2 text-sm text-left bg-gray-50 hover:bg-gray-100 border-t border-gray-200 text-green-700 font-medium"
              >
                {showDetails ? 'Hide Additional Services' : 'Show Additional Services'}
              </button>

              {/* Collapsible Section */}
              {showDetails && (
                <div className="p-4 bg-green-50 text-sm text-gray-700 space-y-2">
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
