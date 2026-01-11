import { Home, Phone, User } from 'lucide-react';
import { Location, ActiveLocation } from '../types';

interface AddressDetailsFieldsProps {
  activeLocation: ActiveLocation;
  currentLocation: Location;
  onPickupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropoffChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddressDetailsFields: React.FC<AddressDetailsFieldsProps> = ({
  activeLocation,
  currentLocation,
  onPickupChange,
  onDropoffChange
}) => {
  return (
    <div className="space-y-6">
      {/* House Number & Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
            <Home className="h-4 w-4 mr-1 text-gray-500" />
            House Number
          </label>
          <div className="relative">
            <input
              type="text"
              name="houseNumber"
              value={currentLocation.houseNumber}
              onChange={(e) =>
                activeLocation.type === 'pickup'
                  ? onPickupChange(e)
                  : onDropoffChange(activeLocation.index!, e)
              }
              className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
              placeholder="No."
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Home className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
            <Phone className="h-4 w-4 mr-1 text-gray-500" />
            Contact Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="contact"
              value={currentLocation.contact}
              onChange={(e) =>
                activeLocation.type === 'pickup'
                  ? onPickupChange(e)
                  : onDropoffChange(activeLocation.index!, e)
              }
              className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
              placeholder="Phone number"
              inputMode="tel"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Phone className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium mb-2 flex items-center text-gray-700">
          <User className="h-4 w-4 mr-1 text-gray-500" />
          Recipient Name
        </label>
        <div className="relative">
          <input
            type="text"
            name="name"
            value={currentLocation.name}
            onChange={(e) =>
              activeLocation.type === 'pickup'
                ? onPickupChange(e)
                : onDropoffChange(activeLocation.index!, e)
            }
            className="w-full p-3 border border-gray-300 rounded-xl pl-10 shadow-sm focus:ring-2 focus:ring-blue-400 transition text-base"
            placeholder="Full name"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsFields;
