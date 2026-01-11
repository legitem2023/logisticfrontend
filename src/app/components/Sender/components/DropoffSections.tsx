import { MapPin, PlusCircle, X } from 'lucide-react';
import { Location, ActiveLocation } from '../types';

interface DropoffSectionsProps {
  dropoffs: Location[];
  onOpenLocationDetails: (type: 'dropoff', index: number) => void;
  onAddDropoff: () => void;
  onRemoveDropoff: (index: number) => void;
}

const DropoffSections: React.FC<DropoffSectionsProps> = ({
  dropoffs,
  onOpenLocationDetails,
  onAddDropoff,
  onRemoveDropoff
}) => {
  return (
    <div className="bg-orange-50 p-5 rounded-xl mb-6 border border-orange-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold flex items-center text-orange-800">
          <MapPin className="h-5 w-5 mr-2" />
          Drop-off Locations
        </h2>
        <button
          type="button"
          onClick={onAddDropoff}
          className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-orange-600 transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Dropoff
        </button>
      </div>

      {dropoffs.map((dropoff, index) => (
        <div key={index} className="mb-3 last:mb-0">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onOpenLocationDetails('dropoff', index)}
              className="flex-1 text-left p-4 border-2 border-dashed border-orange-300 rounded-xl hover:bg-orange-100 flex items-center max-w-[100%] w-[auto]"
            >
              {dropoff.address ? (
                <span className="text-orange-500 truncate flex-1">{dropoff.address}</span>
              ) : (
                <span className="text-orange-500 flex-1">Enter drop-off address #{index + 1}</span>
              )}
              <div className="bg-orange-100 text-orange-800 rounded-full px-2 py-1 text-xs ml-2">
                #{index + 1}
              </div>
            </button>
            {dropoffs.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDropoff(index)}
                className="ml-[-20px] text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DropoffSections;
