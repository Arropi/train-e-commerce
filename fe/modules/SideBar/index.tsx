"use client";

import { useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({
  isOpen = false,
  toggleSidebar,
}: SidebarProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);

  const sidebarOpen = toggleSidebar ? isOpen : localIsOpen;
  const handleToggle = toggleSidebar || (() => setLocalIsOpen(!localIsOpen));

  return (
    <div
      className={`fixed top-4 bottom-4 w-96 bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out border border-gray-200 rounded-lg ${
        sidebarOpen ? "right-4" : "-right-full"
      }`}
    >
      {/* Header */}
      <div className="bg-[#1E40AF] text-white p-4 flex justify-between items-center rounded-t-lg">
        <h2 className="text-xl font-medium">Detail</h2>
        <button
          onClick={handleToggle}
          className="p-1 hover:bg-blue-600 rounded"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="h-full flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24">
          <p className="text-lg text-[#1E40AF] font-medium text-center">
            Nothing here
          </p>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Pilih item untuk melihat detail
          </p>
        </div>

        {/* Next Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t rounded-b-lg">
          <button
            className="bg-[#1E40AF] text-white py-3 px-6 rounded-lg w-full font-medium hover:bg-blue-700 transition-colors"
            onClick={() => {
              console.log("Next button clicked");
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
