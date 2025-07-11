import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SlidingForm() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const options = ["Regular", "Priority", "Pooling"];

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg"
      >
        Open Form
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Sliding Form */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "50%" }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 h-1/2 bg-white rounded-t-2xl shadow-lg p-6 flex flex-col justify-between"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
