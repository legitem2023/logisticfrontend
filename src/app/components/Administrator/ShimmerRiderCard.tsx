// components/ui/ShimmerRiderCard.tsx
import React from "react";
import Shimmer  from "../ui/Shimmer";

const ShimmerRiderCard: React.FC = () => {
  return (
    <div className="w-full sm:w-96 shadow-2xl overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-md">
      {/* Header Shimmer */}
      <div className="h-40 relative bg-gray-200">
        <div className="absolute top-10 left-10">
          <Shimmer width={96} height={96} borderRadius="50%" />
        </div>
        <div className="absolute bottom-3 right-3">
          <Shimmer width={60} height={24} borderRadius="9999px" />
        </div>
      </div>

      {/* Body Shimmer */}
      <div className="p-6 space-y-4">
        {/* Name and Role */}
        <div className="space-y-2">
          <Shimmer width="70%" height={28} />
          <Shimmer width="40%" height={24} />
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Info Section Shimmer */}
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center">
              <Shimmer width={16} height={16} className="mr-2" />
              <Shimmer width="80%" height={20} />
            </div>
          ))}
        </div>

        {/* License Image Shimmer */}
        <div className="mt-4">
          <Shimmer width="40%" height={16} className="mb-2" />
          <Shimmer width="100%" height={192} borderRadius="12px" />
        </div>

        {/* Buttons Shimmer */}
        <div className="mt-6 flex gap-3">
          <Shimmer width="50%" height={40} borderRadius="12px" />
          <Shimmer width="50%" height={40} borderRadius="12px" />
        </div>
      </div>
    </div>
  );
};
export default ShimmerRiderCard;
