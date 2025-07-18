import React from 'react'
import Shimmer from './Shimmer';

const ConfirmationLoading = () => {

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-300 rounded-xl shadow-md space-y-6">
      <Shimmer width="300px" height="28px" /> {/* Title */}

      {/* Sender section */}
      <div className="space-y-2">
        <Shimmer width="100px" height="20px" />
        <Shimmer width="60%" height="16px" />
        <Shimmer width="70%" height="16px" />
      </div>

      {/* Recipients */}
      <div className="space-y-4">
        <Shimmer width="100px" height="20px" />
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="p-3 border border-gray-200 rounded-md bg-white space-y-1">
            <Shimmer width="50%" height="14px" />
            <Shimmer width="60%" height="14px" />
            <Shimmer width="40%" height="14px" />
          </div>
        ))}
      </div>

      {/* Billing */}
      <div className="p-4 border border-gray-200 bg-white rounded-md space-y-3">
        <Shimmer width="150px" height="18px" />
        <div className="grid grid-cols-2 gap-2">
          <Shimmer width="100%" height="14px" />
          <Shimmer width="100%" height="14px" />
          <Shimmer width="100%" height="14px" />
          <Shimmer width="100%" height="14px" />
        </div>
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex justify-between items-center border-t pt-2">
            <div className="space-y-1">
              <Shimmer width="100px" height="12px" />
              <Shimmer width="80px" height="10px" />
            </div>
            <Shimmer width="40px" height="16px" />
          </div>
        ))}
        <div className="flex justify-between border-t pt-3">
          <Shimmer width="60px" height="16px" />
          <Shimmer width="80px" height="16px" />
        </div>
      </div>

      {/* Driver dropdown */}
      <div>
        <Shimmer width="150px" height="18px" className="mb-2" />
        <Shimmer width="100%" height="38px" />
      </div>

      {/* Button */}
      <Shimmer width="100%" height="42px" />
    </div>
  );
}
export default ConfirmationLoading