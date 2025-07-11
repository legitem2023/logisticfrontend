import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
export default function SlidingForm() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const selectedVehicle = useSelector((state: any) => state.vehicle.selectedVehicle);
  const options = ["Regular", "Priority", "Pooling"];
  useEffect(()=>{
    alert(selectedVehicle);
    
  },[selectedVehicle])
  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg z-20"
      >
        Open Form
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-80"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sliding/Modal Form */}
      <div
        className={`fixed inset-0 flex items-end md:items-center justify-center transition-all duration-300 z-90 ${
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-full md:translate-y-0 md:scale-95 md:opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-full h-1/2 md:h-auto md:w-1/3 bg-white rounded-t-2xl md:rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 transform ${
            open ? "translate-y-0 opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()} // prevent overlay click from closing
        >
          {/* Optional Close Button on desktop */}
          <div className="flex justify-end md:block md:mb-4">
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700 md:absolute md:top-4 md:right-4"
            >
              ✕
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Select Delivery Type</h2>
            <div className="space-y-3">
              {options.map((option) => (
                <button
                  key={option}
                  className={`w-full py-3 rounded-lg border text-center ${
                    selectedOption === option
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              alert(`Selected: ${selectedOption}`);
              setOpen(false);
            }}
            className="mt-6 bg-green-600 text-white py-3 rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
