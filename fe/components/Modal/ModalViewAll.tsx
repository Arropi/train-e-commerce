"use client";

import { X, Check } from "lucide-react";
import { useEffect } from "react";

interface ModalViewAllProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    title: string;
    status: string;
    type:
      | "process"
      | "approve"
      | "waiting_to_be_return"
      | "rejected"
      | "done"
      | "canceled";
    serialNumber?: string;
    image?: string;
    date?: string;
    lab?: string;
    purpose?: string;
    session?: string;
    borrower?: string;
    room?: string;
    personInCharge?: string;
    condition?: string;
    subject?: string;
  };
}

export default function ModalViewAll({
  isOpen,
  onClose,
  item,
}: ModalViewAllProps) {
  // Lock body scroll ketika modal terbuka
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Status colors - ✅ Update key sesuai dengan type
  const statusColors: Record<string, string> = {
    approve: "text-[#1F8E00] bg-[#B2FD9E]",
    done: "text-[#004CB0] bg-[#76B1FF]",
    rejected: "text-[#C70000] bg-[#FE9696]", // ✅ Tambahkan key rejected
    process: "text-[#817D24] bg-[#FFF876]",
    waiting_to_be_return: "text-[#5D00AE] bg-[#C17CFE]", // ✅ Tambahkan key waiting_to_be_return
    canceled: "text-[#6B7280] bg-[#E5E7EB]", // ✅ Tambahkan key canceled
  };

  // Fungsi untuk render button berdasarkan type
  const renderActionButtons = () => {
    switch (item.type) {
      case "process": // in Form Review
        return (
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.type] || statusColors.process
              }`}
            >
              {item.status}
            </span>
            <button
              onClick={onClose}
              className="px-6 py-1 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        );

      case "approve": // On Going
        return (
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.type] || statusColors.approve
              }`}
            >
              {item.status}
            </span>
            <button
              onClick={() => {
                // Handle bring back item
                console.log("Bring back item:", item.id);
                onClose();
              }}
              className="px-6 py-1 border-2 border-[#004CB0] text-[#004CB0] rounded-lg hover:bg-[#004CB0] hover:text-white transition-colors font-semibold"
            >
              Bring back Item
            </button>
          </div>
        );

      case "waiting_to_be_return": // Waiting to be Return
        return (
          <div className="flex justify-start items-center gap-4">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.type] || statusColors.waiting_to_be_return
              }`}
            >
              {item.status}
            </span>
          </div>
        );

      case "rejected": // Rejected
        return (
          <div className="flex justify-start items-center gap-4">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.type] || statusColors.rejected
              }`}
            >
              {item.status}
            </span>
          </div>
        );

      case "done": // Done
        return (
          <div className="flex justify-start items-center gap-4">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.type] || statusColors.done
              }`}
            >
              {item.status}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[1.5rem] max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide no-scrollbar border-[3px] border-[#004CB0] p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Header dengan Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 flex items-center justify-center mb-6">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-5xl">📦</span>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-center mb-2">{item.title}</h2>

          {item.serialNumber && (
            <p className="text-base text-gray-600">{item.serialNumber}</p>
          )}
        </div>

        {/* Information Grid */}
        <div className="space-y-6">
          {/* Date & Lab */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Date</p>
              <p className="text-base text-gray-700">{item.date || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Lab</p>
              <p className="text-base text-gray-700">{item.lab || "-"}</p>
            </div>
          </div>

          {/* Purpose & Session */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Purpose
              </p>
              <p className="text-base text-gray-700">{item.purpose || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Session
              </p>
              <p className="text-base text-gray-700">{item.session || "-"}</p>
            </div>
          </div>

          {/* Peminjam & Room */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Peminjam
              </p>
              <p className="text-base text-gray-700">{item.borrower || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Room</p>
              <p className="text-base text-gray-700">{item.room || "-"}</p>
            </div>
          </div>

          {/* Person In Charge & Condition */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Person In Charge
              </p>
              <p className="text-base text-gray-700">
                {item.personInCharge || "-"}
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Condition
              </p>
              <p className="text-base text-gray-700">{item.condition || "-"}</p>
            </div>
          </div>

          {/* Subject (Full Width) */}
          {item.subject && (
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Subject
              </p>
              <p className="text-base text-gray-700">{item.subject}</p>
            </div>
          )}
        </div>

        {/* Action Buttons - Dynamic based on type */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}
