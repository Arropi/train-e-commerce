"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { InventoryCart, ReserveFormInput, Rooms, Subject, TimeSession } from "@/types";
import { useSession } from "next-auth/react";
import { getDataSubjects } from "@/data/subjects";
import { postReserves } from "@/action/action";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/navigation";

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
  const { refreshCart, closeSidebar } = useSidebar();
  const router = useRouter();
  const [formData, setFormData] = useState<ReserveFormInput[]>([]);
  const [showIndex, setShowIndex] = useState<number>(0)
  const [subjects, setSubjects] = useState<Subject[]>()
  const xCoordinate = useRef(0)
  const yCoordinate = useRef(0)
  const touchTime = useRef(0)
  const yRestraint = 75
  const xRestraint = 50
  const allowedTime = 300
  
  
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
      if(!session) return;
      const initial = items.map((item) => ({
        inventories_id:item.inventories.id,
        pic: null,
        subject_id: null,
        tanggal: item.tanggal,
        session_id: item.session_id
      }))
      setFormData(initial)
      const fetchData = async () => {
        const res = await getDataSubjects(session.user.accessToken)
        setSubjects(res)
      };
      fetchData();
    }, [session, items])

  const handleSlideStart = (e: React.TouchEvent) =>{
    xCoordinate.current = e.touches[0].clientX
    yCoordinate.current = e.touches[0].clientY
    touchTime.current = Date.now()
  }

  const handleSlideEnd = (e: React.TouchEvent) => {
    const touchClient = e.changedTouches[0]
    const distX = touchClient.clientX - xCoordinate.current
    const distY = touchClient.clientY - yCoordinate.current
    const elapsedTime = Date.now() - touchTime.current

    if (elapsedTime > allowedTime) return
    if (Math.abs(distX) < xRestraint || Math.abs(distY) > yRestraint) return

    if (distX > 0) {
      setShowIndex((prev) => (prev === 0 ? prev : prev - 1))
    } else {
      setShowIndex((prev) => (prev === items.length -1 ? prev : prev + 1))
    }
  }
  console.log(items.length)
 
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

  const updateFormByIndex = (index: number, field: keyof ReserveFormInput, value: ReserveFormInput[keyof ReserveFormInput]) => {
    console.log('Updating form at index:', index, 'field:', field, 'value:', value);
    setFormData(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };


  const formattingGroups = formattingItemToServe()
  console.log('Hasil format: ', formattingGroups)

  // Initialize sessionDates ketika modal dibuka
  useEffect(() => {
    if (isOpen && items) {
      console.log('Masuk kesini')
    }
  }, [isOpen, items]);

  

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

  console.log("Value Subject: ", )

  const handleSubmit = async() => {
    console.log("Form submitted:", formData);
    console.log("Items:", items);

    // Tampilkan notifikasi
    setShowNotification(true);
    
    try {
      const result = await postReserves(formData);
      
      if (result && !result.success) {
        console.error('Submit failed:', result.error);
      } else {
        // Refresh cart dan close sidebar
        await refreshCart();
        closeSidebar();
        
        // Delay untuk menampilkan notifikasi, lalu reload page
        setTimeout(() => {
          onClose();
          router.refresh(); // Refresh current page
          window.location.reload(); // Force reload untuk memastikan data ter-update
        }, 2000);
      }
    } catch (error) {
      console.log('Redirect atau error:', error);
    }
  };
  
  console.log(showIndex)
  const activeInventory = formData[showIndex]
  console.log(formData)
  const informationCard = items.find((i)=> i.inventories.id === activeInventory.inventories_id)
  if (!informationCard) {
    return(
      <h1>Data Logic Error</h1>
    )
  }
  console.log('Information card: ',informationCard)
  console.log('Now active: ', activeInventory)
  console.log('Available subjects from API: ', subjects)
  console.log('Inventory subjects for this item: ', informationCard.inventories.inventory_subjects)
  
  // Debug mapping
  console.log('Subject mapping check:')
  informationCard.inventories.inventory_subjects.forEach(invSubject => {
    const foundSubject = subjects?.find(s => s.id === invSubject.subject_id)
    console.log(`Subject ID ${invSubject.subject_id} -> Found:`, foundSubject)
  })
  // {!formData.length ? ( 
  //   (
  //     <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
  //       <div className="text-white">Loading form...</div>
  //     </div>
  //   )
  // ): }
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
          onTouchStart={handleSlideStart}
          onTouchEnd={handleSlideEnd}
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
                value={session.user.name?? "Anonymous"}
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
                value={activeInventory.subject_id?? 0}
                onChange={(e) =>{
                  console.log(e.target.value) 
                  updateFormByIndex(showIndex, "subject_id", Number(e.target.value))
                }
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih subject...</option>
                {!subjects ? (
                  <option>Loading...</option>
                ) : (
                  informationCard.inventories.inventory_subjects.map((inventorySubject) => (
                    <option value={inventorySubject.subject_id} key={inventorySubject.id}>
                      {subjects.find((s) => s.id === inventorySubject.subject_id)?.subject_name}
                    </option>
                  ))
                )}
              </select>
            </div>

           
            
              <div
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
                            src={informationCard.inventories.inventory_galleries[0].filepath ?? "/images/osiloskop.png"}
                            alt={informationCard.inventories.item_name}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            {informationCard.inventories.item_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {informationCard.inventories.no_item}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Ruang: {rooms.find((r) => r.id === informationCard.inventories.room_id)?.name ?? "-"}
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
                value={activeInventory.pic?? ""}
                onChange={(e) =>
                  updateFormByIndex(showIndex, "pic", e.target.value)
                }
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama..."
              />
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {formData.map((_, i) => {
                const active = showIndex === i
                return (
                <button
                  key={_.inventories_id}
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
