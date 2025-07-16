// app/components/ConfirmationModal.tsx
"use client";

import React from "react";

interface ConfirmationModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * ConfirmationModal Component
 * A reusable modal for confirming user actions.
 * It replaces native browser `confirm()` for better UI/UX and compatibility.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!show) {
    return null; // Don't render if not visible
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Confirm Action
        </h2>
        <p className="text-gray-700 mb-6 text-center">{message}</p>
        <div className="flex justify-around space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
