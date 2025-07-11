import React, { useState } from "react";

export default function SlidingForm() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const options = ["Regular", "Priority", "Pooling"];

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
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        } z-10`}
        onClick={() => setOpen(false)}
      />

      {/* Sliding Form */}
      <div
        className={`fixed bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-2xl shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        } z-20`}
      >
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
    </>
  );
}
