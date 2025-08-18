"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Package, Calendar, FileText, CheckCircle } from "lucide-react";

export type ProofOfPickupProps = {
  createdAt: string;
  customerName: string;
  customerSignature: string;
  id: string;
  numberOfPackages: number;
  packageCondition: string;
  pickupAddress: string;
  pickupDateTime: string;
  pickupLatitude: number;
  pickupLongitude: number;
  proofPhotoUrl: string;
  remarks: string;
  status: string;
  updatedAt: string;
};

export default function ProofOfPickupCard({
  createdAt,
  customerName,
  customerSignature,
  numberOfPackages,
  packageCondition,
  pickupAddress,
  pickupDateTime,
  proofPhotoUrl,
  remarks,
  status,
}: ProofOfPickupProps) {
  const date = new Date(Number(pickupDateTime)).toLocaleString();

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          {customerName}
        </h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Pickup Details */}
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-blue-500" />
          {pickupAddress}
        </p>
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-500" />
          {date}
        </p>
        <p className="flex items-center gap-2">
          <Package size={16} className="text-orange-500" />
          {numberOfPackages} package(s) - {packageCondition}
        </p>
        {remarks && (
          <p className="flex items-center gap-2">
            <FileText size={16} className="text-gray-500" />
            {remarks}
          </p>
        )}
      </div>

      {/* Proof Images */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Proof Photo</p>
          <Image
            src={proofPhotoUrl}
            alt="Proof of Pickup"
            width={200}
            height={150}
            className="rounded-xl object-cover border border-gray-200"
          />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Customer Signature</p>
          <Image
            src={customerSignature}
            alt="Customer Signature"
            width={200}
            height={150}
            className="rounded-xl object-contain bg-gray-50 border border-gray-200"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
        <CheckCircle size={14} className="text-green-500" />
        <span>Created: {new Date(Number(createdAt)).toLocaleString()}</span>
      </div>
    </div>
  );
}
