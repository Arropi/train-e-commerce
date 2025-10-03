"use client";

import { useState } from "react";
import Image from "next/image";

interface SidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
  selectedItem?: any;
}

export default function Sidebar({ isOpen = false, toggleSidebar, selectedItem }: SidebarProps) {
  // Local state jika tidak ada props yang diberikan
  const [localIsOpen, setLocalIsOpen] = useState(false);
  
  // Gunakan props jika tersedia, atau state lokal jika tidak
  const sidebarOpen = toggleSidebar ? isOpen : localIsOpen;
  const handleToggle = toggleSidebar || (() => setLocalIsOpen(!localIsOpen));

  return (
    <>
      {/* Overlay backdrop - tampil saat sidebar terbuka */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={handleToggle}
        />
      )}

      {/* Detail sidebar */}
      <div 
        className={`fixed top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-[#1E40AF] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-medium">Detail</h2>
          <button onClick={handleToggle} className="p-1">
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                d="M12.954 11.616l2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.746-.016l8.34 8.341zm3.461 3.462l3.074-1.729c.6-.336.929-.812.929-1.34 0-.527-.329-1.004-.928-1.34l-2.783-1.563-3.133 3.132 2.841 2.84zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.445-8.445-8.581-7.888zm8.9 8.889l-8.293 8.293c.196.058.41.092.64.092h14.653c.913 0 1.728-.488 2.195-1.312l-9.195-7.073z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedItem ? (
            <div>
              <div className="flex mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-4">
                  {selectedItem.image ? (
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedItem.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">Lab {selectedItem.lab}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${
                    selectedItem.available 
                      ? "bg-[#B2FD9E] text-[#1F8E00]" 
                      : "bg-[#FE9696] text-[#C70000]"
                  }`}>
                    {selectedItem.available ? "Available" : "Not Available"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-3">Detail Barang</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{selectedItem.serialNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Merk</p>
                    <p className="font-medium">{selectedItem.brand || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{selectedItem.available ? "Tersedia" : "Tidak Tersedia"}</p>
                  </div>
                </div>
              </div>

              {/* Button at bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <button 
                  className="bg-[#1E40AF] text-white py-3 px-6 rounded-md w-full font-medium"
                  onClick={() => console.log('Next action for item', selectedItem.id)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="my-10 text-center">
                <p className="text-lg text-[#1E40AF] font-medium">Anda belum menambahkan barang</p>
              </div>
              
              {/* Next button - same as in item detail */}
              <div className="absolute bottom-6 left-6 right-6">
                <button 
                  className="bg-[#1E40AF] text-white py-3 px-6 rounded-md w-full font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}