'use client';
import { Icon } from '@iconify/react';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '../ui/Card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { VEHICLEQUERY } from '../../../../graphql/query';

export default function VehicleTypes() {
  const { data, loading, error } = useQuery(VEHICLEQUERY);

  if (loading) return <div className="flex items-center justify-center py-10"><Loader2 className="animate-spin w-6 h-6" /></div>;
  if (error) return (
    <div className="text-red-600 flex items-center gap-2 p-4 bg-red-50 rounded-lg">
      <AlertTriangle className="w-5 h-5" />
      Failed to load vehicle types
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.getVehicleTypes?.map((vehicle: any) => (
        <Card key={vehicle.id} className="shadow-lg border rounded-2xl p-4">
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Icon icon={vehicle.icon} style={{ height: '40px', width: '40px' }} />
              <h3 className="text-xl font-semibold">{vehicle.name}</h3>
            </div>
            <p className="text-sm text-gray-600">{vehicle.description}</p>
            <div className="text-sm text-gray-800">
              <p><strong>Capacity:</strong> {vehicle.maxCapacityKg} kg</p>
              <p><strong>Volume:</strong> {vehicle.maxVolumeM3} m³</p>
              <p><strong>Base Rate:</strong> ₱{vehicle.cost}</p>
              <p><strong>Per Km Rate:</strong> ₱{10}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
