import React from 'react';
import { 
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  BadgeInfo,
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RiderCard = ({ rider, onViewDetails }) => {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-red-100 text-red-800',
    BUSY: 'bg-orange-100 text-orange-800',
    OFFLINE: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="w-80 rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div 
        className="h-36 relative flex justify-center items-center"
        style={{ background: 'linear-gradient(135deg, #1890ff 0%, #673ab7 100%)' }}
      >
        {rider.image ? (
          <img
            src={rider.image}
            alt={rider.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-500 border-4 border-white">
            <User size={32} />
          </div>
        )}
        <span 
          className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
            statusColors[rider.status] || 'bg-blue-100 text-blue-800'
          }`}
        >
          {rider.status}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-1">{rider.name}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <BadgeInfo size={14} className="mr-1" />
            {rider.role}
          </span>
        </div>

        <div className="h-px bg-gray-200 my-3"></div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            <span>{rider.email}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-500" />
            <span>{rider.phoneNumber}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <Car size={16} className="text-gray-500 mt-0.5" />
            <div>
              <p>{rider.vehicleType.name} ({rider.licensePlate})</p>
              <p className="text-xs text-gray-500">
                Max {rider.vehicleType.maxCapacityKg}kg · {rider.vehicleType.maxVolumeM3}m³
              </p>
            </div>
          </div>
          
          {rider.currentLatitude && rider.currentLongitude && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span>
                {rider.currentLatitude.toFixed(4)}, {rider.currentLongitude.toFixed(4)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>
              {formatDistanceToNow(new Date(rider.lastUpdatedAt * 1000), { addSuffix: true })}
            </span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(rider)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
        >
          <ChevronRight size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default RiderCard;
