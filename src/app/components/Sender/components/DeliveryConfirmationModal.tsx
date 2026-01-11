import { X } from 'lucide-react';
import ClassicConfirmForm from '../ClassicConfirmForm';
import { Location } from '../types';

interface DeliveryConfirmationModalProps {
  pickup: Location;
  dropoffs: Location[];
  distances: number[];
  useBaseCost: number | null;
  usePerKmCost: number | null;
  onClose: () => void;
  onConfirm: (driverId: any) => Promise<void>;
  isLoading: boolean;
}

const DeliveryConfirmationModal: React.FC<DeliveryConfirmationModalProps> = ({
  pickup,
  dropoffs,
  distances,
  useBaseCost,
  usePerKmCost,
  onClose,
  onConfirm,
  isLoading
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="w-full max-h-[90vh] sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 shadow-lg animate-slide-up overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">Delivery Details</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2 text-sm sm:text-base text-gray-700">
          <ClassicConfirmForm
            order={{
              sender: { name: pickup.name, address: pickup.address },
              recipients: dropoffs.map((r, i) => ({
                name: r.name,
                address: r.address,
                contact: r.contact,
                distanceKm: distances[i].toFixed(2),
              })),
              billing: {
                baseRate: parseFloat(useBaseCost?.toString() || '0'),
                perKmRate: parseFloat(usePerKmCost?.toString() || '0'),
                total: null,
              },
            }}
            onConfirm={onConfirm}
            onLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryConfirmationModal;
