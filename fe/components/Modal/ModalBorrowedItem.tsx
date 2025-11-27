"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface BorrowedItemDetail {
  id: number;
  item_name: string;
  no_item: string;
  img_url: string;
  lab: string;
  borrower: string;
  condition: "good" | "bad";
  borrowed_date: string;
  sessionId: number;
  room: string;
  personInCharge: string;
  purpose: string;
  subject: string;
}

interface ModalBorrowedItemProps {
  isOpen: boolean;
  onClose: () => void;
  item: BorrowedItemDetail | null;
}

export default function ModalBorrowedItem({
  isOpen,
  onClose,
  item,
}: ModalBorrowedItemProps) {
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

  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative border-2 border-[#004CB0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header with Image and Title */}
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center">
              {item.img_url ? (
                <Image
                  src={item.img_url}
                  alt={item.item_name}
                  width={96}
                  height={96}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {item.item_name}
              </h2>
              <p className="text-gray-600 font-medium">{item.no_item}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
            {/* Row 1: Borrowed Date & Lab */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">
                  Borrowed Date
                </h3>
                <p className="text-gray-800">{item.borrowed_date}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Lab</h3>
                <p className="text-gray-800">{item.lab}</p>
              </div>
            </div>

            {/* Row 2: Purpose & Session */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Purpose</h3>
                <p className="text-gray-800">{item.purpose}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Session</h3>
                <p className="text-gray-800">{item.sessionId}</p>
              </div>
            </div>

            {/* Row 3: Borrower & Room */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Borrower</h3>
                <p className="text-gray-800">{item.borrower}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Room</h3>
                <p className="text-gray-800">{item.room}</p>
              </div>
            </div>

            {/* Row 4: Expected Return & Condition */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">
                  Person In Charge
                </h3>
                <p className="text-gray-800">{item.personInCharge}</p>
              </div>
              <div>
                <h3 className="text-gray-600 font-semibold mb-1">Condition</h3>
                <p
                  className={`font-medium ${
                    item.condition === "good"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.condition === "good" ? "Good" : "Bad"}
                </p>
              </div>
            </div>

            {/* Row 5: Subject (Full Width) */}
            <div>
              <h3 className="text-gray-600 font-semibold mb-1">Subject</h3>
              <p className="text-gray-800">{item.subject}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
