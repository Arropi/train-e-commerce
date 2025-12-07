"use client";

import { useState, useEffect } from "react";
import { Inventory, Reserve, Rooms, TimeSession } from "@/types";
import { useSidebar } from "@/contexts/SidebarContext";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Inventory | null;
  tanggal: Date
  allInventories?: Inventory[];
  reservesItem: Reserve[] | null
  rooms: Rooms[] 
  timeSessions: TimeSession[]
}


export default function ItemModal({
  isOpen,
  onClose,
  item,
  tanggal,
  allInventories = [], 
  reservesItem,
  rooms,
  timeSessions
}: ItemModalProps) {
  const [selectedInventoryBySession, setSelectedInventoryBySession] = useState<Record<number, Inventory[]>>(
    {}
  ); // ✅ Store selections per session
  const [selectedTime, setSelectedTime] = useState<number | undefined>();
  const { addItem } = useSidebar();
  
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
  
  // ✅ Reset selection saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedInventoryBySession({});
      setSelectedTime(timeSessions.find(ts => ts.special_session === item?.special_session)?.id)
    }
  }, [isOpen, item, timeSessions]);
  
  if (!isOpen || !item) return null;

  const sessionHere = timeSessions.filter(ts => ts.special_session === item.special_session)
  // ✅ NEW: Get all available units dengan nama yang sama
  const availableUnits = allInventories.filter(
    (inv) =>
      inv.item_name?.toLowerCase() === item.item_name?.toLowerCase() 
  );
  
  const handleAddItem = () => {
    // ✅ Add items from all selected sessions
    const hasSelections = Object.keys(selectedInventoryBySession).length > 0 && 
                          Object.values(selectedInventoryBySession).some(items => items.length > 0);
    
    if (!hasSelections) {
      alert("Please select at least one inventory unit and time");
      return;
    }

    // Add items for each session
    Object.entries(selectedInventoryBySession).forEach(([sessionId, inventories]) => {
      inventories.forEach(inv => {
        addItem(inv.id, Number(sessionId), tanggal);
      });
    });
    
    onClose();
  };
  const checkAvailability = (invId: number) => {
    return reservesItem?.some(reserve => reserve.inventories.id === invId && reserve.session_id === selectedTime);
  }
  
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
          <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden">
            <img
              src={item.inventory_galleries[0]?.filepath ?? "/images/osiloskop.png"}
              alt={item.item_name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#004CB0] mb-2 text-center max-w-48 mx-auto leading-tight">
            {item.item_name}
          </h2>

          {/* jam milih */}
          <div className="flex justify-center items-center gap-12 mb-4 text-sm overflow-x-auto scrollbar-hide">
            {
              sessionHere.map((ts) => {
                return (
                  <button
                  key={ts.id}
                  onClick={() => setSelectedTime(ts.id)}
                  type="button"
                  className={`px-4 py-2 font-bold transition-all border-b-2 ${
                    selectedTime === ts.id
                      ? "border-[#004CB0] text-[#004CB0]"
                      : "border-transparent text-gray-600 hover:text-[#004CB0] hover:border-[#004CB0] transition-all duration-300 ease-in-out"
                  }`}
                >
                  {ts.start}
                </button>
                )
              }
            )
            }
          </div>

          {/* ✅ NEW: Pilihan Ruang + Nomor Inventaris (ganti room list) */}
          <div className="space-y-2 mb-6">
            {availableUnits.map((inv) => {
              const roomName = rooms.find(room => room.id === inv.room_id)?.name;
              const currentSessionInventories = selectedTime ? (selectedInventoryBySession[selectedTime] || []) : [];
              const isChecked = currentSessionInventories.some(selected => selected.id === inv.id);
              
              return (
              <label
                key={inv.id}
                className="flex items-center justify-between p-2 rounded border border-transparent hover:border-gray-100 cursor-pointer"
              >
                <div>
                  <div className="text-sm text-black font-bold">
                    {roomName || "Ruang HU 201"}
                  </div>
                  <div className="text-xs text-black font-medium">
                    {inv.no_item}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    disabled={checkAvailability(inv.id)}
                    type="checkbox"
                    name="inventory"
                    value={inv.id}
                    checked={isChecked}
                    onChange={(e) => {
                      if (!checkAvailability(inv.id) && selectedTime) {
                        const isSelected = e.target.checked;
                        const currentSelections = selectedInventoryBySession[selectedTime] || [];
                        
                        if (isSelected) {
                          setSelectedInventoryBySession({
                            ...selectedInventoryBySession,
                            [selectedTime]: [...currentSelections, inv]
                          });
                        } else {
                          setSelectedInventoryBySession({
                            ...selectedInventoryBySession,
                            [selectedTime]: currentSelections.filter(selected => selected.id !== inv.id)
                          });
                        }
                      }
                    }}
                    className="hidden"
                  />
                  <div
                    onClick={() => {
                      if (!checkAvailability(inv.id) && selectedTime) {
                        const currentSelections = selectedInventoryBySession[selectedTime] || [];
                        const isSelected = currentSelections.some(selected => selected.id === inv.id);
                        
                        if (isSelected) {
                          setSelectedInventoryBySession({
                            ...selectedInventoryBySession,
                            [selectedTime]: currentSelections.filter(selected => selected.id !== inv.id)
                          });
                        } else {
                          setSelectedInventoryBySession({
                            ...selectedInventoryBySession,
                            [selectedTime]: [...currentSelections, inv]
                          });
                        }
                      }
                    }}
                    className={`w-4 h-4 rounded-full border-2 border-[#004CB0] flex items-center justify-center ${
                      checkAvailability(inv.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {isChecked && (
                      <div className="w-2 h-2 bg-[#004CB0] rounded-full"></div>
                    )}
                  </div>
                </div>
              </label>
            )})}
          </div>
          <div className="flex justify-end">
          <button
            onClick={handleAddItem}
            className="w-25 bg-[#004CB0] text-white py-0 text-md rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-300"
            disabled={Object.keys(selectedInventoryBySession).length === 0 || !selectedTime}
          >
            Add
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
