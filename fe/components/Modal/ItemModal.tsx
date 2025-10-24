"use client";

import { useState } from "react";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    image: string;
    lab: string;
    available: boolean;
  } | null;
}

export default function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  if (!isOpen || !item) return null;

  const handleAddItem = () => {
    if (selectedRoom && selectedTime) {
      console.log("Adding item:", {
        item: item.name,
        room: selectedRoom,
        time: selectedTime,
      });
      onClose();
    } else {
      alert("Pilih ruang dan waktu terlebih dahulu");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
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
              src={item.image}
              alt={item.name}
              className="max-h-full object-contain"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#004CB0] mb-2 text-center max-w-48 mx-auto leading-tight">
            {item.name}
          </h2>

          {/* jam milih */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <button
              onClick={() => setSelectedTime("07.30")}
              className={`px-4 py-2 font-bold transition-all border-b-2 ${
                selectedTime === "07.30"
                  ? "border-[#004CB0] text-[#004CB0]"
                  : "border-transparent text-gray-600 hover:text-[#004CB0]"
              }`}
            >
              07.30
            </button>
            <button
              onClick={() => setSelectedTime("13.30")}
              className={`px-4 py-2 font-bold transition-all border-b-2 ${
                selectedTime === "13.30"
                  ? "border-[#004CB0] text-[#004CB0]"
                  : "border-transparent text-gray-600 hover:text-[#004CB0]"
              }`}
            >
              13.30
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {[1, 2, 3, 4].map((room) => (
              <div
                key={room}
                className="flex items-center justify-between p-2"
              >
                <span className="text-sm text-black font-bold">
                  Ruang HU 20{room}
                  <br />
                  <span className="text-xs text-black font-medium">728781347819397</span>
                </span>
                <input
                  type="radio"
                  name="room"
                  value={room}
                  checked={selectedRoom === room}
                  onChange={() => setSelectedRoom(room)}
                  className="w-4 h-4 text-[#004CB0]"
                  style={{ accentColor: '#004CB0' }}
                />
              </div>
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
