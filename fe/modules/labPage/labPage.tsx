"use client";
import { useState } from "react";
import ItemModal from "../../components/Modal/ItemModal";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import FilterBar from "../../components/FilterBar/FilterBar";
import { useSidebar } from "../../contexts/SidebarContext";
import { Inventory } from "@/types";

interface LabPageProps {
  slug: string;
  inventories: Inventory[];
}

export default function LabPage({ slug, inventories }: LabPageProps) {
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredInventories, setFilteredInventories] = useState(inventories);
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

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    let filtered = inventories;

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(
        (item) =>
          item.location?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Filter by lab
    if (filters.lab && filters.lab !== "semua") {
      filtered = filtered.filter(
        (item) => item.lab?.toLowerCase() === filters.lab.toLowerCase()
      );
    }

    // Filter by date (jika ada field date di inventory)
    if (filters.date) {
      filtered = filtered.filter((item) => item.date === filters.date);
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.item_name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.no_item?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredInventories(filtered);
  };

  // Function untuk determine availability
  const getAvailabilityStatus = (item: Inventory) => {
    const isAvailable = item.condition?.toLowerCase() === "good";

    return {
      text: isAvailable ? "Available" : "Not Available",
      bgColor: isAvailable ? "bg-[#A0FFFD]" : "bg-[#FFBA5A]",
      textColor: isAvailable ? "text-[#007F7C]" : "text-[#F73939]",
    };
  };

  // nampilin satu barang nya
  const getUniqueItems = (items: Inventory[]) => {
    const uniqueMap = new Map<string, Inventory>();

    items.forEach((item) => {
      const itemName = item.item_name?.toLowerCase() || "";

      // Hanya simpan item pertama dengan nama yang sama
      if (!uniqueMap.has(itemName)) {
        uniqueMap.set(itemName, item);
      }
    });

    return Array.from(uniqueMap.values());
  };

  // menghitung jumlah item berdasarkan nama
  const getItemCount = (itemName: string) => {
    return filteredInventories.filter(
      (inv) => inv.item_name?.toLowerCase() === itemName.toLowerCase()
    ).length;
  };

  const uniqueItems = getUniqueItems(filteredInventories);

  const currentLab = dataLab.find((lab) => lab.id === Number(slug));

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

          {/* FilterBar Component */}
          <FilterBar onFilterChange={handleFilterChange} />

          {/* Grid Kartu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {(uniqueItems ?? []).map((item) => {
              const availability = getAvailabilityStatus(item);
              const itemCount = getItemCount(item.item_name || "");

              return (
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
                            item.img_url ? item.img_url : "/icons/osiloskop.png"
                          }
                          alt={item.item_name}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                        {currentLab?.name || "No Lab"}
                    </p>

                    {/* ✅ Tampilkan Available/Not Available */}
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${availability.bgColor} ${availability.textColor}`}
                      >
                        {availability.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {uniqueItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada barang yang sesuai dengan filter
              </p>
            </div>
          )}
        </div>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
        allInventories={filteredInventories}
      />

      <FloatingButton
        onClick={handleOpenSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
}
