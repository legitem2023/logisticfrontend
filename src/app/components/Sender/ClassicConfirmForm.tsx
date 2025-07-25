"use client";
import { useQuery } from "@apollo/client";
import { RIDERS } from "../../../../graphql/query";
import { useState } from "react";
import { UserCheck } from "lucide-react";
import ConfirmationLoading from "../Loadings/ConfirmationLoading";

export default function ClassicConfirmForm({ order, onConfirm ,onLoading }) {
  const { data,loading,error} = useQuery(RIDERS);
  const [selectedDriver, setSelectedDriver] = useState("");
  if (loading) return <ConfirmationLoading/>
 //console.log(onLoading,"<==");
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-300 rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 tracking-tight border-b pb-2">
        Confirm Delivery Order
      </h1>

      {/* Order Info Section */}
      <div className="grid gap-4 text-sm text-gray-700">
        <div className="space-y-1">
          <h2 className="font-semibold text-gray-800 text-base mb-1">Sender</h2>
          <p><strong>Name:</strong> {order.sender.name}</p>
          <p><strong>Address:</strong> {order.sender.address}</p>
        </div>

        {/* Recipients List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800 text-base mb-1">Recipients</h2>
          {order.recipients.map((recipient, idx) => (
            <div key={idx} className="border border-gray-200 p-3 rounded-md bg-white text-sm">
              <p><strong>Name:</strong> {recipient.name}</p>
              <p><strong>Address:</strong> {recipient.address}</p>
              <p><strong>Contact:</strong> {recipient.contact}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Billing Info */}
{/* Billing Section */}
<div className="bg-white border border-gray-200 rounded-lg p-4 text-sm">
  <h3 className="font-medium text-gray-800 mb-3">Billing Summary</h3>

  <div className="grid grid-cols-2 gap-2 mb-4">
    <p><strong>Base Rate:</strong></p>
    <p>₱{order.billing.baseRate}</p>
    <p><strong>Per Km Rate:</strong></p>
    <p>₱{order.billing.perKmRate}</p>
  </div>

  {/* Per Recipient Cost (optional, if distance is provided) */}
  {order.recipients.map((recipient, idx) => (
    <div
      key={idx}
      className="flex justify-between items-center border-t pt-2 mt-2 text-gray-700"
    >
      <div>
        <p className="font-medium">{recipient.name}</p>
        {recipient.distanceKm !== undefined && (
          <p className="text-xs text-gray-500">
            Distance: {recipient.distanceKm} km
          </p>
        )}
      </div>
      {recipient.distanceKm !== undefined ? (
        <span>
          ₱{(recipient.distanceKm * order.billing.perKmRate).toFixed(2)}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">—</span>
      )}
    </div>
  ))}

  {/* Total Calculation */}
  <div className="border-t pt-3 mt-4 flex justify-between text-base font-semibold text-gray-900">
    <span>Total</span>
    <span>
      ₱
      {order.billing.total ??
        (
          order.billing.baseRate +
          order.recipients.reduce(
            (sum, r) => sum + ((r.distanceKm || 0) * order.billing.perKmRate),
            0
          )
        )}
    </span>
  </div>
</div>

      {/* Confirm Button */}
      <button
        disabled={onLoading}
        onClick={() => {
            onConfirm(selectedDriver);
        }}
        className="w-full customgrad hover:bg-blue-700 text-white py-2 px-4 rounded-sm flex items-center justify-center gap-2 transition"
      >
        <UserCheck className="w-5 h-5" />
        Confirm
      </button>
    </div>
  );
}
