import React, { useState } from 'react';
import { 
  User, Car, Phone, Mail, MapPin, BadgeInfo, Clock, ChevronRight, Edit3, Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RiderCard = ({ rider, onViewDetails, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({ ...rider });

  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-red-100 text-red-800',
    BUSY: 'bg-orange-100 text-orange-800',
    OFFLINE: 'bg-gray-100 text-gray-800'
  };

  const handleChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      vehicleType: { ...prev.vehicleType, [field]: value }
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) onSave(editableData);
  };

  return (
    <div className="w-full sm:w-80 rounded-xl shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="h-36 relative flex justify-center items-center customgrad">
        {editableData.image ? (
          <img
            src={editableData.image}
            alt={editableData.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-blue-500 border-4 border-white">
            <User size={32} />
          </div>
        )}
        <span 
          className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${
            statusColors[editableData.status] || 'bg-blue-100 text-blue-800'
          }`}
        >
          {editableData.status}
        </span>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-3 right-3 bg-white p-1 rounded-full shadow hover:bg-gray-50"
        >
          {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editableData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="text-lg font-semibold mb-1 text-center border rounded px-2 py-1 w-full"
            />
          ) : (
            <h3 className="text-lg font-semibold mb-1">{editableData.name}</h3>
          )}

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <BadgeInfo size={14} className="mr-1" />
            {editableData.role}
          </span>
        </div>

        <div className="h-px bg-gray-200 my-3"></div>

        <div className="space-y-3 text-sm">
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-500" />
            {isEditing ? (
              <input
                type="email"
                value={editableData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <span>{editableData.email}</span>
            )}
          </div>
          
          {/* Phone */}
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-500" />
            {isEditing ? (
              <input
                type="tel"
                value={editableData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <span>{editableData.phoneNumber}</span>
            )}
          </div>
          
          {/* Vehicle */}
          <div className="flex items-start gap-2">
            <Car size={16} className="text-gray-500 mt-0.5" />
            <div className="w-full">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editableData.vehicleType?.name}
                    onChange={(e) => handleVehicleChange("name", e.target.value)}
                    className="border rounded px-2 py-1 mb-1 w-full"
                    placeholder="Vehicle Type"
                  />
                  <input
                    type="text"
                    value={editableData.licensePlate}
                    onChange={(e) => handleChange("licensePlate", e.target.value)}
                    className="border rounded px-2 py-1 mb-1 w-full"
                    placeholder="License Plate"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editableData.vehicleType?.maxCapacityKg}
                      onChange={(e) => handleVehicleChange("maxCapacityKg", e.target.value)}
                      className="border rounded px-2 py-1 w-1/2"
                      placeholder="Max kg"
                    />
                    <input
                      type="number"
                      value={editableData.vehicleType?.maxVolumeM3}
                      onChange={(e) => handleVehicleChange("maxVolumeM3", e.target.value)}
                      className="border rounded px-2 py-1 w-1/2"
                      placeholder="Max m³"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>{editableData.vehicleType?.name} ({editableData.licensePlate})</p>
                  <p className="text-xs text-gray-500">
                    Max {editableData.vehicleType?.maxCapacityKg}kg · {editableData.vehicleType?.maxVolumeM3}m³
                  </p>
                </>
              )}
            </div>
          </div>
          
          {/* Location */}
          {editableData.currentLatitude && editableData.currentLongitude && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span>
                {editableData.currentLatitude.toFixed(4)}, {editableData.currentLongitude.toFixed(4)}
              </span>
            </div>
          )}
          
          {/* Last Updated */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span>
              {formatDistanceToNow(new Date(editableData.lastUpdatedAt * 1000), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onViewDetails(editableData)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
          >
            <ChevronRight size={16} />
            View Details
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderCard;
