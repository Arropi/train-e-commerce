"use client";

import { useState, useEffect } from "react";
import { Inventory } from "@/types";
import { useSidebar } from "@/contexts/SidebarContext";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Inventory | null;
}

export default function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  // selectedRoom is an object { id, name } or null
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const { addItem } = useSidebar();

  // daftar ruang (ganti dengan data dari backend jika ada)
  const rooms = [
    { id: 1, name: "Ruang HU 201" },
    { id: 2, name: "Ruang HU 202" },
    { id: 3, name: "Ruang HU 203" },
    { id: 4, name: "Ruang HU 204" },
  ];

  // ✅ Lock body scroll ketika modal terbuka
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

  const handleAddItem = () => {
    if (!selectedRoom || !selectedTime) {
      alert("Please select room and time");
      return;
    }

    const payload = {
      ...item,
      selectedRoom: selectedRoom.id,
      selectedRoomName: selectedRoom.name,
      selectedTime,
    };

    addItem(payload);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/35 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white overflow-y-auto scrollbar-hide rounded-2xl p-6 max-w-md w-full mx-4 max-h-lvh"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg">
            <img
              src={item.img_url ?? "/images/osiloskop.png"}
              alt={item.item_name}
              className="max-h-full object-contain"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#004CB0] mb-2 text-center max-w-48 mx-auto leading-tight">
            {item.item_name}
          </h2>

          {/* jam milih */}
          <div className="flex justify-center items-center gap-12 mb-4 text-sm">
            <button
              onClick={() => setSelectedTime("07.30")}
              type="button"
              className={`px-4 py-2 font-bold transition-all border-b-2 ${
                selectedTime === "07.30"
                  ? "border-[#004CB0] text-[#004CB0]"
                  : "border-transparent text-gray-600 hover:text-[#004CB0] hover:border-[#004CB0] transition-all duration-300 ease-in-out"
              }`}
            >
              07.30
            </button>
            <button
              onClick={() => setSelectedTime("13.30")}
              type="button"
              className={`px-4 py-2 font-bold transition-all border-b-2 ${
                selectedTime === "13.30"
                  ? "border-[#004CB0] text-[#004CB0]"
                  : "border-transparent text-gray-600 hover:text-[#004CB0] hover:border-[#004CB0] transition-all duration-300 ease-in-out"
              }`}
            >
              13.30
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {rooms.map((r) => (
              <label
                key={r.id}
                className="flex items-center justify-between p-2 rounded border border-transparent hover:border-gray-100"
              >
                <div>
                  <div className="text-sm text-black font-bold">{r.name}</div>
                  <div className="text-xs text-black font-medium">
                    {item.no_item}
                  </div>
                </div>
                <input
                  type="radio"
                  name="room"
                  value={r.id}
                  checked={selectedRoom?.id === r.id}
                  onChange={() => setSelectedRoom(r)}
                  className="w-4 h-4 text-[#004CB0]"
                  style={{ accentColor: "#004CB0" }}
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-[#004CB0] text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-300"
            disabled={!selectedRoom || !selectedTime}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
