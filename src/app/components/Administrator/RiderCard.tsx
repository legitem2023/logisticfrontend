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
  RectangleHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { VEHICLEQUERY } from "../../../../graphql/query";
import { EDITRIDER } from "../../../../graphql/mutation";

import { Select } from "../ui/Select";

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
  
  //  if (onSave) onSave(editableData);
   await editRider({
     variables:{
       input:editData
     }
   })
  };

  const lastUpdatedDate = toValidDate(editableData.lastUpdatedAt);

  const Accountrole = [
    { name: "Sender" },
    { name: "Rider" }
  ];

  return (
    <div className="w-full sm:w-96 shadow-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-md transition-transform duration-300">
      {/* Header */}
      <div className="h-40 relative flex flex-col items-left justify-center bg-gradient-to-r from-green-800 to-green-600">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNiI+PHBhdGggZD0iTTM2IDM0QzM2IDMxLjggMzcuOCAzMCA0MCAzMFM0NCAzMS44IDQ0IDM0QzQ0IDM2LjIgNDIuMiAzOCA0MCAzOFM0MCAzNi4yIDQwIDM0WiIvPjwvZz48L3N2Zz4=')]"></div>
        </div>

        {editableData.image ? (
          <img
            src={editableData.image}
            alt={editableData.name}
            className="w-24 h-24 ml-10 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
          />
        ) : (
          <div className="w-24 h-24 ml-10 rounded-full bg-white flex items-center justify-center text-green-700 border-4 border-white shadow-lg relative z-10">
            <User size={36} />
          </div>
        )}

        <span
          className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-sm font-bold shadow-md ${
            statusColors[editableData.status] || "bg-blue-100 text-blue-800"
          }`}
        >
          {editableData.status}
        </span>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-3 right-3 bg-white p-1 rounded-full shadow hover:bg-gray-50 transition"
        >
          {isEditing ? <Check size={18} /> : <Edit3 size={18} />}
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        <div className="flex flex-col">
          <div>
          {isEditing ? (
            <input
              type="text"
              value={editableData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="text-slate-400 text-xl font-semibold border rounded px-2 py-1 w-full"
            />
          ) : (
            <span className="text-xl font-bold text-slate-900">
              {editableData.name || "Unnamed Rider"}
            </span>
          )}
          </div>
          <div>
          {isEditing ? (
            <Select
              id="role"
              name="role"
              defaultValue={editableData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              required
              className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400 mt-2 w-full"
            >
              <option value="">Select a Role</option>
              {Accountrole.map((role: any, id: number) => (
                <option key={id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Select>
          ) : (
            <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <BadgeInfo size={14} className="mr-1" />
              {editableData.role || "Rider"}
            </span>
          )}
          </div>
        </div>

        <div className="border-t border-slate-600"></div>

        {/* Info Section with Left Labels */}
        <div className="space-y-3 text-sm text-slate-600">
          {/* Email */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <Mail size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="email"
                  value={editableData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{editableData.email || "No email"}</span>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <Phone size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="tel"
                  value={editableData.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <span>{editableData.phoneNumber || "No phone"}</span>
              )}
            </div>
          </div>

          {/* Vehicle */}
          <div className="flex items-start">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <Car size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <Select
                  id="vehicleType"
                  name="vehicleType"
                  value={editableData.vehicleType?.name}
                  onChange={(e) => handleChange("vehicleTypeId", e.target.value)}
                  required
                  className="pl-2 border-gray-300 focus:border-green-500 focus:ring-green-400"
                >
                  <option value="">Select a vehicle type</option>
                  {data.getVehicleTypes.map((vehicle: any) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <span>{editableData.vehicleTypeId}</span>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <Gauge size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              <span className="text-xs text-slate-500">
                Max {editableData.vehicleType?.maxCapacityKg ?? "—"}kg ·{" "}
                {editableData.vehicleType?.maxVolumeM3 ?? "—"}m³
              </span>
            </div>
          </div>

          {/* Plate */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <RectangleHorizontal size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.licensePlate || ""}
                  onChange={(e) => handleChange("licensePlate", e.target.value)}
                  className="border rounded px-2 py-1 w-full"
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
              <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
                <MapPin size={16} className="text-emerald-600" />
              </span>
              <div className="flex-1">
                {Number(editableData.currentLatitude).toFixed(4)},{" "}
                {Number(editableData.currentLongitude).toFixed(4)}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center">
            <span className="w-10 flex items-center gap-1 font-medium text-slate-500">
              <Clock size={16} className="text-emerald-600" />
            </span>
            <div className="flex-1">
              {lastUpdatedDate
                ? formatDistanceToNow(lastUpdatedDate, { addSuffix: true })
                : "No update time"}
            </div>
          </div>
        </div>

        {/* License Image */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 font-medium mb-2">Driver’s License</p>
          {editableData.license ? (
            <div className="relative group rounded-xl overflow-hidden shadow-md border border-slate-200">
              <img
                src={editableData.license}
                alt="License"
                className="w-full h-48 object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
          ) : isEditing ? (
            <input
              type="text"
              value={editableData.license || ""}
              onChange={(e) => handleChange("license", e.target.value)}
              placeholder="Paste license image URL"
              className="border rounded px-2 py-1 w-full"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center border border-dashed border-slate-300 rounded-xl text-slate-400">
              No license image
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onViewDetails?.(editableData)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-emerald-600 text-emerald-600 bg-white hover:bg-emerald-50 transition font-medium"
          >
            <ChevronRight size={16} />
            View Details
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium"
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
