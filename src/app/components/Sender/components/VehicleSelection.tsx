import { Icon } from '@iconify/react';
import { Truck } from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleSelectionProps {
  vehicles: Vehicle[];
  selected: string;
  expandedDetails: string | null;
  onVehicleSelect: (id: string, data: Vehicle) => void;
  onToggleDetails: (vehicleId: string) => void;
}

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
  vehicles,
  selected,
  expandedDetails,
  onVehicleSelect,
  onToggleDetails
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl mb-8 border border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold mb-5 flex items-center text-gray-900">
        <Truck className="h-6 w-6 mr-3 text-indigo-600" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Vehicle Type
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {vehicles.map((vehicle) => {
          const isSelected = selected === vehicle.id;
          const showDetails = expandedDetails === vehicle.id;
          
          return (
            <div key={vehicle.id} className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
              isSelected
                ? 'border-indigo-500 shadow-lg'
                : 'border-gray-300 hover:border-gray-400'
              }`}>
              <div
                onClick={() => onVehicleSelect(vehicle.id, vehicle)}
                className={`relative w-full text-left p-5 flex items-center gap-5 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-800 bg-gradient-to-r from-indigo-50 to-purple-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                    <Icon icon="mdi:check" className="text-sm" />
                  </div>
                )}

                <div className="p-2 bg-white rounded-lg shadow-inner">
                  <Icon 
                    icon={vehicle.icon} 
                    className="text-indigo-600" 
                    style={{ height: '42px', width: '42px' }} 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">{vehicle.name}</p>
                  <p className="text-sm text-gray-800">{vehicle.description}</p>
                </div>
                <div className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ₱ {vehicle.cost}
                </div>
              </div>

              <button
                onClick={() => onToggleDetails(vehicle.id)}
                type="button"
                className="w-full px-5 py-2.5 text-sm text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-t border-gray-300 text-indigo-700 font-medium flex items-center justify-between"
              >
                <span>{showDetails ? 'Hide Additional Services' : 'Show Additional Services'}</span>
                <Icon 
                  icon={showDetails ? "mdi:chevron-up" : "mdi:chevron-down"} 
                  className="h-5 w-5 text-indigo-600"
                />
              </button>

              {showDetails && (
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 text-sm text-gray-900 space-y-3 border-t border-indigo-100">
                  <p className="font-semibold text-indigo-800">Premium Services:</p>
                  <ul className="space-y-2.5">
                    <li className="flex items-start">
                      <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-900">Professional loading assistance</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-900">Premium packaging materials</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-900">Comprehensive insurance options</span>
                    </li>
                    <li className="flex items-start">
                      <Icon icon="mdi:check-circle" className="h-4 w-4 mt-0.5 mr-2 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-900">Real-time driver tracking</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleSelection;
