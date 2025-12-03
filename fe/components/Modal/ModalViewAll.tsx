"use client";

import { updateReserves } from "@/action/action";
import { useSidebar } from "@/contexts/SidebarContext";
import { Reserve, Subject } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast/Toast";
import Image from "next/image";

interface ModalViewAllProps {
  isOpen: boolean;
  onClose: () => void;
  item: Reserve
  subjects: Subject[]
}

export default function ModalViewAll({
  isOpen,
  onClose,
  item,
  subjects
}: ModalViewAllProps) {
  const { rooms, timeSessions } = useSidebar()
  const [pendingAction, setPendingAction] = useState<{
    type: string;
    label: string;
    handler: (() => Promise<void>) | null;
  } | null>(null);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error" | "warning">("success");
  const [notificationMessage, setNotificationMessage] = useState("");
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

  const switchStatus = (status: string) => {
    switch (status) {
      case "approve":
        return "Approve";
      case "done":
        return "Done";
      case "rejected":
        return "Rejected";
      case "process":
        return "Process";
      case "waiting_to_be_return":
        return "Waiting to be Return";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  if (!isOpen) {
    // Tetap render Toast meskipun modal tertutup agar notifikasi terlihat setelah menutup modal
    return (
      <Toast
        message={notificationMessage}
        type={notificationType}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        duration={3000}
      />
    );
  }

  // Status colors 
  const statusColors: Record<string, string> = {
    approve: "text-[#1F8E00] bg-[#B2FD9E]",
    done: "text-[#004CB0] bg-[#76B1FF]",
    rejected: "text-[#C70000] bg-[#FE9696]", 
    process: "text-[#817D24] bg-[#FFF876]",
    waiting_to_be_return: "text-[#5D00AE] bg-[#C17CFE]", 
    canceled: "text-[#6B7280] bg-[#E5E7EB]", 
  };

  // Fungsi untuk render button berdasarkan type
  const renderActionButtons = () => {
    switch (item.status) {
      case "process": // in Form Review
        return (
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.status] || statusColors.process
              }`}
            >
              {switchStatus(item.status)}
            </span>
            <button
              onClick={() =>
                setPendingAction({
                  type: "cancel",
                  label: "Cancel",
                  handler: async () => {
                    await updateReserves(item.id, "canceled");
                  },
                })
              }
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
                statusColors[item.status] || statusColors.approve
              }`}
            >
              {switchStatus(item.status)}
            </span>
            <button
              onClick={() =>
                setPendingAction({
                  type: "bring_back",
                  label: "Bring back Item",
                  handler: async () => {
                    await updateReserves(item.id, "waiting_to_be_return");
                  },
                })
              }
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
                statusColors[item.status] || statusColors.waiting_to_be_return
              }`}
            >
              {switchStatus(item.status)}
            </span>
          </div>
        );

      case "rejected": // Rejected
        return (
          <div className="flex justify-start items-center gap-4">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.status] || statusColors.rejected
              }`}
            >
              {switchStatus(item.status)}
            </span>
          </div>
        );

      case "done": // Done
        return (
          <div className="flex justify-start items-center gap-4">
            <span
              className={`text-sm font-semibold px-6 py-2 rounded-full ${
                statusColors[item.status] || statusColors.done
              }`}
            >
              {switchStatus(item.status)}
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
            {item.inventories.inventory_galleries?.[0]?.filepath ? (
              <Image
                width={128}
                height={128}
                src={item.inventories.inventory_galleries[0].filepath}
                alt={item.inventories.item_name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-5xl">📦</span>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-center mb-2">{item.inventories.item_name}</h2>

          {item.inventories.no_item && (
            <p className="text-base text-gray-600">{item.inventories.no_item}</p>
          )}
        </div>

        {/* Information Grid */}
        <div className="space-y-6">
          {/* Date & Lab */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Date</p>
              <p className="text-base text-gray-700">{item.tanggal.split("T")[0] || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Lab</p>
              <p className="text-base text-gray-700">{item.inventories.labolatories.name || "-"}</p>
            </div>
          </div>

          {/* Purpose & Session */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Purpose
              </p>
              <p className="text-base text-gray-700">{item.inventories.type || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Session
              </p>
              <p className="text-base text-gray-700">{timeSessions.find(session => session.id === item.session_id)?.start || "-"}</p>
            </div>
          </div>

          {/* Peminjam & Room */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Peminjam
              </p>
              <p className="text-base text-gray-700">{item?.reserve_user_created?.username || "-"}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">Room</p>
              <p className="text-base text-gray-700">{rooms.find(room => room.id === item.inventories.room_id)?.name || "-"}</p>
            </div>
          </div>

          {/* Person In Charge & Condition */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Person In Charge
              </p>
              <p className="text-base text-gray-700">
                {item.pic || "-"}
              </p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Condition
              </p>
              <p className="text-base text-gray-700">{item.inventories.condition || "-"}</p>
            </div>
          </div>

          {/* Subject (Full Width) */}
          {item.subject_id && (
            <div>
              <p className="text-base font-semibold text-gray-900 mb-2">
                Subject
              </p>
              <p className="text-base text-gray-700">{subjects.find(subject => subject.id === item.subject_id)?.subject_name || "-"}</p>
            </div>
          )}
        </div>

        {/* Action Buttons - Dynamic based on type */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {renderActionButtons()}

          {/* Toast */}
          <Toast
            message={notificationMessage}
            type={notificationType}
            isVisible={showNotification}
            onClose={() => setShowNotification(false)}
            duration={3000}
          />
        </div>

        {/* Confirmation Modal (popup) */}
        {pendingAction && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setPendingAction(null)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-gray-200"
            >
              <p className="text-sm text-gray-800">Apakah anda yakin ingin <span className="font-semibold">{pendingAction.label}</span> barang?</p>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setPendingAction(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (!pendingAction?.handler) return;
                    try {
                      await pendingAction.handler();
                      setNotificationType("success");
                      setNotificationMessage(
                        pendingAction.type === "cancel"
                          ? "Reservasi berhasil dibatalkan"
                          : "Barang berhasil dikembalikan ke status waiting to be return"
                      );
                      setShowNotification(true);
                      setPendingAction(null);
                      onClose();
                      setTimeout(() => window.location.reload(), 1200);
                    } catch (err) {
                      console.error(err);
                      setNotificationType("error");
                      setNotificationMessage("Terjadi kesalahan. Silakan coba lagi.");
                      setShowNotification(true);
                      setPendingAction(null);
                    }
                  }}
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-900"
                >
                  Ya, Konfirmasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
