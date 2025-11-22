import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  User,
  Car,
  Phone,
  Mail,
  MapPin,
  BadgeInfo,
  Clock,
  ChevronRight,
  Edit3,
  Check,
  Gauge,
  RectangleHorizontal,
  Camera
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { VEHICLEQUERY } from "../../../../graphql/query";
import { EDITRIDER } from "../../../../graphql/mutation";
import { Select } from "../ui/Select";
import { useDispatch, useSelector } from 'react-redux';
import { selectRole } from '../../../../Redux/roleSlice';

// Safely convert many timestamp shapes to a valid Date or return null
function toValidDate(input) {
  if ((input === null || input === undefined || input === "") && input !== 0) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "object") {
    if (typeof input?.toDate === "function") {
      const d = input.toDate();
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof input?.seconds === "number") {
      const ms = input.seconds * 1000 + (input.nanoseconds ? input.nanoseconds / 1e6 : 0);
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  if (typeof input === "number" || (typeof input === "string" && input.trim() !== "")) {
    const num = Number(input);
    if (!Number.isNaN(num)) {
      const ms = num < 1e12 ? num * 1000 : num;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  if (typeof input === "string") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

const RiderCard = ({ rider, onViewDetails, onSave }) => {
  const useRole = useSelector(selectRole);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({ ...rider });
  const { loading: vehicloading, error, data } = useQuery(VEHICLEQUERY);
  const [editRider] = useMutation(EDITRIDER,{
    onCompleted:(e:any) =>{
      console.log(e);
    },
    onError:(e:any) =>{
      console.log(e);
    }
  })
  if (vehicloading) return;

  const statusColors = {
    available: "bg-green-100 text-green-800",
    inactive: "bg-red-100 text-red-800",
    busy: "bg-orange-100 text-orange-800",
    offline: "bg-gray-100 text-gray-800",
  };

  const handleChange = (field, value) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      vehicleType: { ...prev.vehicleType, [field]: value },
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    const editData = {
      id: editableData.id,
      name: editableData.name,
      email: editableData.email,
      phoneNumber: editableData.phoneNumber,
      vehicleTypeId: editableData.vehicleTypeId,
      licensePlate: editableData.licensePlate,
      role: editableData.role
    }
  
   await editRider({
     variables:{
       input:editData
     }
   })
  };

  const lastUpdatedDate = toValidDate(editableData.lastUpdatedAt);

  const Accountrole = [
    { name: "Administrator" },
    { name: "Sender" },
    { name: "Rider" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white  shadow-md overflow-hidden border border-gray-200">
      {/* Cover Photo - Facebook style */}
      <div className="h-40 customgrad relative">
        <div className="absolute bottom-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[editableData.status] || "bg-blue-100 text-blue-800"}`}>
            {editableData.status}
          </span>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 pb-4 -mt-16 relative">
        <div className="flex justify-between items-end mb-4">
          <div className="relative">
            {editableData.image ? (
              <img
                src={editableData.image}
                alt={editableData.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-md">
                <User size={40} />
              </div>
            )}
 
          </div>
          
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gray-200 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-300 transition flex items-center gap-1"
          >
            {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
            <span className="text-sm font-medium">{isEditing ? "Editing" : "Edit"}</span>
          </button>
        </div>

        <div className="mb-2">
          {isEditing ? (
            <input
              type="text"
              value={editableData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="text-xl font-bold border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h2 className="text-xl font-bold text-gray-900">{editableData.name || "Unnamed Rider"}</h2>
          )}
        </div>

        <div>
          {isEditing && useRole!=="Administrator" ? (
            <Select
              id="role"
              name="role"
              defaultValue={editableData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              required
              className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 w-full text-sm"
            >
              <option value="">Select a Role</option>
              {Accountrole.map((role: any, id: number) => (
                <option key={id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Select>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <BadgeInfo size={12} className="mr-1" />
              {editableData.role || "Rider"}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Info Section */}
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Contact Information</h3>

        <div className="space-y-3 text-sm text-gray-600">
          {/* Email */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <Mail size={16} className="text-blue-500" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="email"
                  value={editableData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              ) : (
                <span>{editableData.email || "No email"}</span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <Phone size={16} className="text-blue-500" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="tel"
                  value={editableData.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              ) : (
                <span>{editableData.phoneNumber || "No phone"}</span>
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div className="flex items-start">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <Car size={16} className="text-blue-500" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <Select
                  id="vehicleType"
                  name="vehicleType"
                  value={editableData.vehicleType?.name}
                  onChange={(e) => handleChange("vehicleTypeId", e.target.value)}
                  required
                  className="border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 w-full text-sm"
                >
                  <option value="">Select a vehicle type</option>
                  {data.getVehicleTypes.map((vehicle: any) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <span>{editableData.vehicleType?.name}</span>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <Gauge size={16} className="text-blue-500" />
            </span>
            <div className="flex-1 text-xs text-gray-500">
              Max {editableData.vehicleType?.maxCapacityKg ?? "—"}kg ·{" "}
              {editableData.vehicleType?.maxVolumeM3 ?? "—"}m³
            </div>
          </div>

          {/* Plate */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <RectangleHorizontal size={16} className="text-blue-500" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.licensePlate || ""}
                  onChange={(e) => handleChange("licensePlate", e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="License Plate"
                />
              ) : (
                <span>{editableData.licensePlate || "—"}</span>
              )}
            </div>
          </div>

          {/* Location */}
          {editableData.currentLatitude != null && editableData.currentLongitude != null && (
            <div className="flex items-center">
              <span className="w-10 flex items-center gap-1 text-gray-500">
                <MapPin size={16} className="text-blue-500" />
              </span>
              <div className="flex-1 text-sm">
                {Number(editableData.currentLatitude).toFixed(4)},{" "}
                {Number(editableData.currentLongitude).toFixed(4)}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 text-gray-500">
              <Clock size={16} className="text-blue-500" />
            </span>
            <div className="flex-1 text-sm">
              {lastUpdatedDate
                ? formatDistanceToNow(lastUpdatedDate, { addSuffix: true })
                : "No update time"}
            </div>
          </div>
        </div>

        {/* License Image */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Drivers License</h3>
          {editableData.license ? (
            <div className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img
                src={editableData.license}
                alt="License"
                className="w-full h-48 object-cover"
              />
            </div>
          ) : isEditing ? (
            <input
              type="text"
              value={editableData.license || ""}
              onChange={(e) => handleChange("license", e.target.value)}
              placeholder="Paste license image URL"
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          ) : (
            <div className="w-full h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
              No license image
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onViewDetails?.(editableData)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition font-medium text-sm"
          >
            <span>View Details</span>
            <ChevronRight size={16} />
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium text-sm"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(RiderCard);
