"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface BorrowDetail {
  no: number;
  borrowerName: string;
  borrowerId: string;
  status: "Returned" | "Late" | "Damaged";
  condition: "Good" | "Bad";
  borrowDate: string;
  itemName: string;
  itemImage: string;
  itemSerialNumber: string;
  lab: string;
  purpose: string;
  session: string;
  room: string;
  personInCharge: string;
  subject: string;
}

interface ModalBorrowDetailProps {
  isOpen: boolean;
  onClose: () => void;
  detail: BorrowDetail | null;
}

export default function ModalBorrowDetail({
  isOpen,
  onClose,
  detail,
}: ModalBorrowDetailProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !detail) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Returned":
        return (
          <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {status}
          </span>
        );
      case "Late":
        return (
          <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {status}
          </span>
        );
      case "Damaged":
        return (
          <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const getConditionBadge = (condition: string) => {
    return condition === "Good" ? (
      <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        {condition}
      </span>
    ) : (
      <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        {condition}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Item Image and Name */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
            <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image
                src={detail.itemImage}
                alt={detail.itemName}
                width={96}
                height={96}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#004CB0] mb-2">
                {detail.itemName}
              </h2>
              <p className="text-gray-600 font-medium">
                {detail.itemSerialNumber}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {/* Date */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-semibold text-gray-800">{detail.borrowDate}</p>
            </div>

            {/* Lab */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Lab</p>
              <p className="font-semibold text-gray-800">{detail.lab}</p>
            </div>

            {/* Purpose */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Purpose</p>
              <p className="font-semibold text-gray-800">{detail.purpose}</p>
            </div>

            {/* Session */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Session</p>
              <p className="font-semibold text-gray-800">{detail.session}</p>
            </div>

            {/* Peminjam */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Peminjam</p>
              <p className="font-semibold text-gray-800">
                {detail.borrowerName}
              </p>
            </div>

            {/* Room */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Room</p>
              <p className="font-semibold text-gray-800">{detail.room}</p>
            </div>

            {/* Person In Charge */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Person In Charge</p>
              <p className="font-semibold text-gray-800">
                {detail.personInCharge}
              </p>
            </div>

            {/* Condition */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Condition</p>
              <div>{getConditionBadge(detail.condition)}</div>
            </div>

            {/* Subject */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Subject</p>
              <p className="font-semibold text-gray-800">{detail.subject}</p>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <div>{getStatusBadge(detail.status)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
