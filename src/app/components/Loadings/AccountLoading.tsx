import React from "react";

const AccountLoading = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white  shadow-md overflow-hidden border border-gray-200">
      {/* Header Shimmer */}
      <div className="h-40 relative flex flex-col items-left justify-center bg-gray-300">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-gray-400"></div>
        </div>
      </div>

      {/* Avatar Shimmer */}
      <div className="relative -top-12 left-6 w-24 h-24 rounded-full bg-gray-300 border-4 border-white"></div>

      {/* Content Shimmer */}
      <div className="px-6 pb-6 relative -top-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-7 bg-gray-300 rounded w-1/3"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>

        <div className="flex justify-between">
          <div className="h-10 bg-gray-300 rounded w-24"></div>
          <div className="h-10 bg-gray-300 rounded w-24"></div>
        </div>
      </div>

      {/* Shimmer Animation Overlay */}
      <div className="shimmer-overlay"></div>
    </div>
  );
};

export default React.memo(AccountLoading);
