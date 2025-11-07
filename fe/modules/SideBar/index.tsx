"use client";

import Image from "next/image";
import { useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import RequestForm from "@/components/ModalForm/ModalForm";

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({
  isOpen = false,
  toggleSidebar,
}: SidebarProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // konsumsi context
  const {
    isSidebarOpen,
    toggleSidebar: ctxToggle,
    items = [],
    removeItem,
  } = useSidebar();

  // fallback: props jika diberikan, else gunakan context
  const sidebarOpen = typeof isOpen === "boolean" ? isOpen : isSidebarOpen;
  const handleToggle = toggleSidebar ?? ctxToggle;

  return (
    <>
      <div
        className={`fixed top-4 bottom-4 w-96 bg-white shadow-2xl z-50 transition-all duration-300 ease-in-out border border-gray-200 rounded-lg ${
          sidebarOpen ? "right-4" : "-right-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#1E40AF] text-white p-4 flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logoKeranjang.svg"
              alt="Detail Icon"
              width={24}
              height={24}
              className="object-contain"
            />
            <h2 className="text-xl font-bold">Detail</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggle}
              className="p-1 hover:bg-blue-900 rounded-full"
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
        </div>

        {/* Content */}
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 pb-24">
                <p className="text-lg text-[#1E40AF] font-medium text-center">
                  Nothing here
                </p>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Pilih item untuk melihat detail
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={`${it.id}-${it.selectedRoom ?? "nr"}-${
                      it.selectedTime ?? "nt"
                    }`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="w-14 h-14 bg-white rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={it.img_url ?? "/images/osiloskop.png"}
                        alt={it.item_name}
                        className="object-contain max-h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-800">
                        {it.item_name ?? it.no_item}
                      </div>
                      <div className="text-xs text-gray-500">{it.no_item}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        Ruang: {it.selectedRoomName ?? it.selectedRoom ?? "-"} ·
                        Jam: {it.selectedTime ?? "-"}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t rounded-b-lg">
            <button
              className="bg-[#1E40AF] text-white py-3 px-6 rounded-lg w-full font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setIsFormOpen(true)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <RequestForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        items={items}
      />
    </>
  );
}
