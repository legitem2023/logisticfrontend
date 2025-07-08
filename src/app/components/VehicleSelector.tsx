'use client';

import { useState } from 'react';
import { Truck, Car, Bike } from 'lucide-react';
import type { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { VEHICLEQUERY } from '../../../graphql/query';
import Loading from './ui/Loading';
type Vehicle = {
  id: string;
  name: string;
  icon: ReactElement;
  description: string;
  price: string;
};
type VehicleType = {
  id: string;
  name: string;
  maxCapacityKg: number;
  maxVolumeM3: number;
  description: string | null;
  createdAt: string; // or number, depending on how you use timestamps
  updatedAt: string; // or number
  icon:string
};

const vehicleOptions: Vehicle[] = [
  {
    id: 'bike',
    name: 'Motorcycle',
    icon: <Bike className="w-6 h-6 text-blue-600" />,
    description: 'Small packages only (max 20kg)',
    price: '₱80 base fare',
  },
  {
    id: 'car',
    name: 'Car',
    icon: <Car className="w-6 h-6 text-yellow-600" />,
    description: 'Up to 100kg — documents, boxes',
    price: '₱150 base fare',
  },
  {
    id: 'van',
    name: 'Van',
    icon: <Truck className="w-6 h-6 text-green-600" />,
    description: 'Large and bulky items (up to 300kg)',
    price: '₱250 base fare',
  },
];

export default function VehicleSelector() {
  const { loading, error, data } = useQuery(VEHICLEQUERY);

  const [selected, setSelected] = useState<string>('bike');
  if (loading) return <Loading lines={4} />;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data.getVehicleTypes);
  // return
  return (
    <div className="relative max-w-md mx-auto p-4 bg-white rounded-2xl shadow space-y-4">

    <div className="space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">🚚 Choose Vehicle Type</h2>
      {data.getVehicleTypes.map((vehicle:VehicleType) => (
        <button
          key={vehicle.id}
          type="button"
          onClick={() => setSelected(vehicle.id)}
          className={`w-full text-left border rounded-xl p-4 flex items-center gap-4 transition ${
            selected === vehicle.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div>{vehicle.icon}</div>
          <div className="flex-1">
            <p className="text-base font-semibold">{vehicle.name}</p>
            <p className="text-sm text-gray-500">{vehicle.description}</p>
          </div>
          <div className="text-sm font-bold text-gray-700">{vehicle.name}</div>
        </button>
      ))}
    </div>
  </div>
  );
}
