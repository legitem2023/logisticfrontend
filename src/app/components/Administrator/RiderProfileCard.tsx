import React from 'react';
import { 
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

const RiderProfileCard = ({ rider, onViewDetails }) => {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    INACTIVE: 'bg-red-100 text-red-800 border-red-200',
    BUSY: 'bg-orange-100 text-orange-800 border-orange-200',
    OFFLINE: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const status = statusColors[rider.status] || 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <div className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden bg-white border border-gray-100">
      {/* Header with Gradient Background */}
      <div 
        className="pt-8 pb-12 px-6 text-center relative"
        style={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}
      >
        {/* Avatar with Status Badge */}
        <div className="relative inline-block">
          {rider.image ? (
            <img 
              src={rider.image}
              alt={rider.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-purple-600 border-4 border-white/30">
              <User size={32} />
            </div>
          )}
          {/* Status Badge */}
          <span 
            className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2 border-white ${status.split(' ')[0]}`}
          ></span>
        </div>

        <h3 className="text-xl font-semibold text-white mt-4 mb-1">{rider.name}</h3>
        <p className="text-white/80">{rider.role}</p>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Details Sections */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <Mail className="w-4 h-4 mr-2 text-blue-500" />
              Email
            </div>
            <p className="text-gray-800">{rider.email}</p>
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <Phone className="w-4 h-4 mr-2 text-blue-500" />
              Phone
            </div>
            <p className="text-gray-800">{rider.phoneNumber}</p>
          </div>

          {/* Vehicle */}
          <div>
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <Car className="w-4 h-4 mr-2 text-blue-500" />
              Vehicle
            </div>
            <p className="font-semibold text-gray-800">{rider.vehicleType.name}</p>
            <div className="text-sm text-gray-500 mt-1">
              <p>Plate: {rider.licensePlate}</p>
              <p>Capacity: {rider.vehicleType.maxCapacityKg}kg · {rider.vehicleType.maxVolumeM3}m³</p>
            </div>
          </div>

          {/* Location */}
          {rider.currentLatitude && rider.currentLongitude && (
            <div>
              <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                Location
              </div>
              <p className="text-gray-800">
                {rider.currentLatitude.toFixed(4)}, {rider.currentLongitude.toFixed(4)}
              </p>
            </div>
          )}

          {/* Status */}
          <div>
            <div className="flex items-center text-sm font-medium text-gray-500 mb-1">
              <Shield className="w-4 h-4 mr-2 text-blue-500" />
              Status
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status}`}>
              {rider.status}
            </span>
          </div>
        </div>

        {/* Footer with Date and Button */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            Joined {format(new Date(rider.createdAt), 'MMM d, yyyy')}
          </div>
          <button
            onClick={() => onViewDetails(rider)}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            View Full Profile
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderProfileCard;
