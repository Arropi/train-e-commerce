"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
}

export default function RequestForm({
  isOpen,
  onClose,
  items,
}: RequestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    responsiblePerson: "",
  });

  const [sessionDates, setSessionDates] = useState<{ [key: number]: string }>(
    {}
  );

  const [showNotification, setShowNotification] = useState(false);

  // Function untuk menentukan sesi berdasarkan jam
  const getSessionFromTime = (time: string) => {
    if (!time) return "";

    // Ekstrak jam dari format "07.30" atau "13.30"
    const hourMatch = time.match(/(\d{2})[:.]/);
    if (!hourMatch) return "";

    const hour = parseInt(hourMatch[1]);

    // Hanya 2 sesi: 07.30 = Sesi 1, 13.30 = Sesi 2
    if (hour >= 7 && hour < 13) {
      return "Sesi 1 - 07.30";
    } else if (hour >= 13) {
      return "Sesi 2 - 13.30";
    }

    return time;
  };

  // Group items berdasarkan sesi dan tanggal
  const groupItemsBySession = () => {
    const grouped: {
      [key: string]: {
        session: string;
        date: string;
        items: any[];
      };
    } = {};

    items.forEach((item) => {
      const session = getSessionFromTime(item.selectedTime || "");
      const date = item.selectedDate || "";
      const key = `${session}-${date}`;

      if (!grouped[key]) {
        grouped[key] = {
          session,
          date,
          items: [],
        };
      }

      grouped[key].items.push(item);
    });

    return Object.values(grouped);
  };

  const sessionGroups = groupItemsBySession();

  // Initialize sessionDates ketika modal dibuka
  useEffect(() => {
    if (isOpen && sessionGroups.length > 0) {
      const initialDates: { [key: number]: string } = {};
      sessionGroups.forEach((group, idx) => {
        initialDates[idx] = group.date;
      });
      setSessionDates(initialDates);
    }
  }, [isOpen, items]);

  // Handle perubahan tanggal per sesi
  const handleDateChange = (groupIdx: number, newDate: string) => {
    setSessionDates((prev) => ({
      ...prev,
      [groupIdx]: newDate,
    }));
  };

  // Auto hide notification setelah 3 detik
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    console.log("Items:", items);
    console.log("Session Groups:", sessionGroups);
    console.log("Session Dates:", sessionDates);

    // Tampilkan notifikasi
    setShowNotification(true);

    // Tutup modal setelah delay
    setTimeout(() => {
      onClose();
      // Reset form
      setFormData({
        name: "",
        subject: "",
        responsiblePerson: "",
      });
      setSessionDates({});
    }, 3000);
  };

  return (
    <>
      {/* bg transparan */}
      <div
        className="fixed inset-0 bg-black/35 flex items-center justify-center z-50"
        onClick={onClose}
      />

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[80] animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Pesanan sudah terkirim</span>
          </div>
        </div>
      )}

      {/* Modal Form */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Request Form</h2>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama..."
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih subject...</option>
                <option value="Praktikum Pemrograman Web 2">
                  Praktikum Pemrograman Web 2
                </option>
              </select>
            </div>

            {/* Loop through each session group */}
            {sessionGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="space-y-4 pb-4 border-b last:border-b-0"
              >
                {/* Session and Date untuk group ini */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sesi {groupIdx + 1}
                    </label>
                    <input
                      type="text"
                      value={group.session}
                      readOnly
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                      placeholder="Sesi 2 - 13.30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Peminjaman
                    </label>
                    <input
                      type="date"
                      value={sessionDates[groupIdx] || ""}
                      onChange={(e) =>
                        handleDateChange(groupIdx, e.target.value)
                      }
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Selected Items untuk sesi ini */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barang yang Dipinjam - {group.session}
                  </label>
                  <div className="space-y-2">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg border"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.img_url ?? "/images/osiloskop.png"}
                            alt={item.item_name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            {item.item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.no_item}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Ruang: {item.selectedRoomName ?? "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Penanggung Jawab */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penanggung Jawab Barang
              </label>
              <input
                type="text"
                value={formData.responsiblePerson}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsiblePerson: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama..."
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 border-t flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#1E40AF] text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
