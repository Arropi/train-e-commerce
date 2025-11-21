"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { InventoryCart, InventoryReserves, Rooms, Subject, TimeSession } from "@/types";
import { useSession } from "next-auth/react";
import { getDataSubjects } from "@/data/subjects";

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryCart[];
  timeSession: TimeSession[]
  rooms: Rooms[]
}

interface FormsServe extends InventoryCart {
  key: number
}

export default function RequestForm({
  isOpen,
  onClose,
  items,
  rooms,
  timeSession
}: RequestFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user.name,
    subject: "",
    responsiblePerson: "",
  });
  const [showIndex, setShowIndex] = useState<number>(0)
  const [subjects, setSubjects] = useState<Subject[]>()
  const xSlideStart = useRef(0)
  const xSlideEnd = useRef(0)
  const [activeInventory, setActiveInventory] = useState<FormsServe>()
  const [sessionDates, setSessionDates] = useState<{ [key: number]: string }>(
    {}
  );

  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
      if(!session) return;
      if (session?.user?.name) {
        setFormData(prev => ({
          ...prev,
          name: session.user.name
        }));
      }
      const fetchData = async () => {
        const res = await getDataSubjects(session.user.accessToken)
        setSubjects(res)
      };
      fetchData();
    }, [session])
  const handleSlideIn = (e: React.TouchEvent) =>{
    xSlideStart.current = e.touches[0].clientX
  }
  const handleSlideOut = (e: React.TouchEvent) => {
    xSlideEnd.current = e.touches[0].clientX
  }
  const handleEndOut = () => {
    const gap = xSlideStart.current - xSlideEnd.current
    if(gap > 50 && showIndex < items.length) {
      setShowIndex(showIndex + 1)
    } else if( gap < -50 && showIndex !== 0 ) {
      setShowIndex(showIndex - 1)
    }
  }
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
  console.log(items)

  // Function untuk menentukan sesi berdasarkan jam
  const getSessionFromTime = (time: number) => {
    if (!time) return "";
    return timeSession.find(t=> t.id === time)?.start

    // // Ekstrak jam dari format "07.30" atau "13.30"
    // const hourMatch = time.match(/(\d{2})[:.]/);
    // if (!hourMatch) return "";

    // const hour = parseInt(hourMatch[1]);

    // // Hanya 2 sesi: 07.30 = Sesi 1, 13.30 = Sesi 2
    // if (hour >= 7 && hour < 13) {
    //   return "Sesi 1 - 07.30";
    // } else if (hour >= 13) {
    //   return "Sesi 2 - 13.30";
    // }

    // return time;
  };

  const formattingItemToServe = () => {
    const group = items.map((it, idx) => {
      return {
        ...it,
        key: idx,
        inventories_id: it.inventories.id,
        tanggal: it.tanggal,
        pic: null,
        subject_id: null
      } as FormsServe
    })
    return group
  }

  // Group items berdasarkan sesi dan tanggal
  const groupItemsBySession = () => {
    const grouped: {
      [key: string]: {
        // session: string;
        date: string;
        items: InventoryCart[];
      };
    } = {};

    items.forEach((item) => {
      const session = getSessionFromTime(item.session_id)
      const date = item.tanggal || "";
      const key = `${session}-${date}`;
      console.log('Key nya: ', key)

      if (!grouped[key]) {
        grouped[key] = {
          // session,
          date: date.toString().split('T')[0],
          items: [],
        };
      }
      console.log(grouped)
      grouped[key].items.push(item);
    });


    return Object.values(grouped);
  };

  const sessionGroups = groupItemsBySession();
  const formattingGroups = formattingItemToServe()
  console.log('Hasil format: ', formattingGroups)
  console.log('Hasil groupping: ', sessionGroups)
  console.log('Session dates saat ini: ', sessionDates)

  // Initialize sessionDates ketika modal dibuka
  useEffect(() => {
    if (isOpen && items) {
      const initialDates: { [key: number]: string } = {};
      sessionGroups.forEach((group, idx) => {
        initialDates[idx] = group.date;
      });
      setSessionDates(initialDates);
      handleActiveInventory()
    }
  }, [isOpen, items]);

  // Handle perubahan tanggal per sesi
  const handleDateChange = (groupIdx: number, newDate: string) => {
    setSessionDates((prev) => ({
      ...prev,
      [groupIdx]: newDate,
    }));
  };
  const handleActiveInventory = () => {
    const formattingGroups = formattingItemToServe()
    const inventoryServe = formattingGroups.find((fg) => fg.key === showIndex)
    setActiveInventory(inventoryServe)
  }

  useEffect(()=>{
    const formattingGroups = formattingItemToServe()
    const inventoryServe = formattingGroups.find((fg) => fg.key === showIndex)
    setActiveInventory(inventoryServe)
  }, [showIndex])

  // Auto hide notification setelah 3 detik
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const isLoading = !session || !subjects;

  if (!isOpen) return null;

  if (isLoading) {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  console.log(subjects)
  console.log(activeInventory?.inventories.inventory_subjects)
  activeInventory?.inventories.inventory_subjects.map((subject) => {
    console.log(subject)
    console.log(subjects.find((s) => s.id === subject.subject_id))
  })

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

  console.log(showIndex)
  console.log('Now active: ', activeInventory)

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
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto scrollbar-hide"
          onTouchStart={handleSlideIn}
          onTouchMove={handleSlideOut}
          onTouchEnd={handleEndOut}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-[#1E40AF]">Request Form</h2>
          </div>

          { activeInventory? 
            <div className="p-6 space-y-4 relative">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name?? "Anonymous"}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                readOnly
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
                {!subjects ? (
                  <option>Loading...</option>
                ) : (
                  activeInventory.inventories.inventory_subjects?.map((subject) => (
                    <option value={subject.id} key={subject.id}>
                      {subjects.find((s) => s.id === subject.subject_id)?.subject_name}
                    </option>
                  ))
                )}
              </select>
            </div>

           
            
              <div
                key={activeInventory.key}
                className="space-y-4 pb-4 border-b last:border-b-0"
              >
                {/* Session and Date untuk group ini */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sesi {activeInventory.session_id}
                    </label>
                    <input
                      type="text"
                      value={`Sesi - ${timeSession.find(ts => ts.id ===activeInventory.session_id)?.start?? "Tidak Ditemukan"}`}
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
                      readOnly
                      value={activeInventory.tanggal.toString().split('T')[0] || ""}
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Selected Items untuk sesi ini */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barang yang Dipinjam - {timeSession.find(ts => ts.id === activeInventory.session_id)?.start}
                  </label>
                  <div className="space-y-2">
                      <div
                        className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg border"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={activeInventory.inventories.inventory_galleries[0].filepath ?? "/images/osiloskop.png"}
                            alt={activeInventory.inventories.item_name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            {activeInventory.inventories.item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activeInventory.inventories.no_item}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Ruang: {rooms.find((r) => r.id === activeInventory.inventories.room_id)?.name ?? "-"}
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
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
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {items.map((_, i) => {
                const active = showIndex === i
                console.log(active)
                return (
                <button
                  key={i}
                  onClick={() => setShowIndex(i)}
                  className={`
                    w-2.5 h-2.5 rounded-full transition 
                    ${active ? "bg-[#004CB0]" : "bg-[#9A9A9A]"}
                  `}
                />
              )
              })}
            </div>
          </div>
          :  <div>
            <h1>Maaf belum ada yang dimasukkan ke dalam cart</h1>
          </div>
          }
          {/* <div className="p-6 space-y-4">
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

            {sessionGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="space-y-4 pb-4 border-b last:border-b-0"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sesi {groupIdx + 1}
                    </label>
                    <input
                      type="text"
                      value={`Sesi - ${timeSession.find(ts => ts.id ===group.items[groupIdx].session_id)?.start?? "Tidak Ditemukan"}`}
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
                      readOnly
                      value={sessionDates[groupIdx] || ""}
                      onChange={(e) =>
                        handleDateChange(groupIdx, e.target.value)
                      }
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barang yang Dipinjam - {timeSession.find(ts => ts.id === group.items[groupIdx].session_id)?.start}
                  </label>
                  <div className="space-y-2">
                    {group.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 text-black bg-gray-50 rounded-lg border"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.inventories.inventory_galleries[0].filepath ?? "/images/osiloskop.png"}
                            alt={item.inventories.item_name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            {item.inventories.item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.inventories.no_item}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Ruang: {rooms.find((r) => r.id === item.inventories.room_id)?.name ?? "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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

          </div> */}

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
