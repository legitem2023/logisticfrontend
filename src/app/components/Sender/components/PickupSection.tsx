import { Home, MapPin } from 'lucide-react';
import { Location } from '../types';

interface PickupSectionProps {
  pickup: Location;
  onOpenLocationDetails: () => void;
}

const PickupSection: React.FC<PickupSectionProps> = ({
  pickup,
  onOpenLocationDetails
}) => {
  return (
    <div className="bg-green-50 p-5 rounded-xl mb-6 border border-green-100">
      <h2 className="text-lg font-semibold mb-3 flex items-center text-green-800">
        <MapPin className="h-5 w-5 mr-2" />
        Pickup Location
      </h2>
      <button
        type="button"
        onClick={onOpenLocationDetails}
        className="w-full text-left p-4 border-2 border-dashed border-green-300 rounded-xl mb-3 hover:bg-green-100 flex items-center"
      >
        {pickup.address ? (
          <span className="text-green-500 truncate flex-1">{pickup.address}</span>
        ) : (
          <span className="text-green-500 flex-1">Enter pickup address</span>
        )}
        <Home className="h-5 w-5 text-green-500 ml-2" />
      </button>
    </div>
  );
};

export default PickupSection;
