import { useState, useEffect } from 'react';
import { Vehicle } from '../types';

interface UseDeliveryCalculationProps {
  data: any;
}

export const useDeliveryCalculation = ({ data }: UseDeliveryCalculationProps) => {
  const [selected, setSelected] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [useBaseCost, setBaseCost] = useState<number | null>(null);
  const [usePerKmCost, setPerKmCost] = useState<number | null>(null);
  const [distances, setDistances] = useState<number[]>([]);
  const [vehicleName, setVehicleName] = useState<string[]>([]);
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);

  useEffect(() => {
    if (data?.getVehicleTypes?.length > 0 && !selected) {
      const firstVehicle = data.getVehicleTypes[0];
      setSelected(firstVehicle.id);
      setBaseCost(firstVehicle.cost);
      setPerKmCost(firstVehicle.perKmRate);
      setVehicleName([firstVehicle.name]);
      setSelectedVehicle(firstVehicle.name);
    }
  }, [data, selected]);

  const vehicleDetails = (id: string, vehicleData: Vehicle) => {
    setSelected(id);
    setBaseCost(vehicleData.cost);
    setPerKmCost(vehicleData.perKmRate);
    setVehicleName([vehicleData.name]);
    setSelectedVehicle(vehicleData.name);
  };

  const toggleDetails = (vehicleId: string) => {
    setExpandedDetails(prev => (prev === vehicleId ? null : vehicleId));
  };

  return {
    selected,
    selectedVehicle,
    useBaseCost,
    usePerKmCost,
    distances,
    vehicleName,
    expandedDetails,
    vehicleDetails,
    toggleDetails,
    setDistances
  };
};

export default useDeliveryCalculation;
