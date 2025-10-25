"use client"
import { useState } from "react";
import ItemModal from "../../components/Modal/ItemModal";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import { useSidebar } from "../../contexts/SidebarContext";
import { Inventory } from "@/types";


interface LabPageProps {
  slug: string;
  inventories: Inventory[]; // terima data inventories dari server page
}

export default function LabPage({ slug, inventories }: LabPageProps) {
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openSidebar, isSidebarOpen } = useSidebar();

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  const dataLab = [
    { id: 1, name: "Elektronika" },
    { id: 2, name: "IDK" },
    { id: 3, name: "TAJ" },
    { id: 4, name: "RPL" },
    { id: 5, name: "TL" },
  ];

  const handleItemClick = (item: Inventory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  
  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="p-6 min-h-screen bg-gray-50">
          <h1 className="text-2xl font-bold text-[#004CB0] mb-6">
            Lab {dataLab.find((item) => item.id === Number(slug))?.name}
          </h1>

          {/* Grid Kartu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(inventories ?? []).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleItemClick(item)}
              >
                <div className="p-4">
                  <div className="flex justify-center items-center mb-3">
                    <div className="w-full h-24 flex items-center justify-center">
                      <img
                        src={
                          item.img_url
                            ? item.img_url
                            : "/icons/osiloskop.png"
                        }
                        alt={item.item_name}
                        className="max-h-full object-contain"
                      />
                    </div>
                  </div>

                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    {item.item_name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">{item.no_item}</p>

                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs ${
                        item.condition === "good"
                          ? "bg-[#B2FD9E] text-[#1F8E00]"
                          : "bg-[#FE9696] text-[#C70000]"
                      }`}
                    >
                      {item.condition}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ItemModal isOpen={isModalOpen} onClose={closeModal} item={selectedItem} />

      <FloatingButton onClick={handleOpenSidebar} isSidebarOpen={isSidebarOpen} />
    </>
  );
}
