"use client";

import { useState } from "react";
import ItemCard from "@/components/ItemCard/ItemCard";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";
import ModalViewAll from "@/components/Modal/ModalViewAll";
import { Reserve, Subject } from "@/types";
import Pagination from "@/components/Pagination/Pagination";

// ✅ Tambahkan field type ke interface
interface Item {
  id: number;
  title: string;
  status: string;
  type:
    | "process"
    | "approve"
    | "waiting_to_be_return"
    | "rejected"
    | "done"
    | "canceled"; // ✅ Tambahkan ini
  image?: string;
  serialNumber?: string;
  date?: string;
  lab?: string;
  purpose?: string;
  session?: string;
  borrower?: string;
  room?: string;
  personInCharge?: string;
  condition?: string;
  subject?: string;
}

interface ViewAllPageProps {
  slug: string;
  inventories: Reserve[];
  subjects: Subject[];
}

export default function ViewAllPage({ slug, inventories, subjects }: ViewAllPageProps) {
  const { openSidebar, isSidebarOpen } = useSidebar();
  const [selectedItem, setSelectedItem] = useState<Reserve | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const pageConfig = {
    ongoing: {
      title: "On Going Items",
      emptyMessage: "No items currently on going.",
    },
    history: {
      title: "History",
      emptyMessage: "No history found.",
    },
  };

  const config = pageConfig[slug as keyof typeof pageConfig];

  const handleItemClick = (item: Reserve) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  // Pagination calculations
  const totalPages = Math.ceil(inventories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventories.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-[#004CB0] mb-6">
              {config.title}
            </h1>

            {inventories.length === 0 ? (
              <p className="text-gray-500">{config.emptyMessage}</p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {currentItems.map((inventory) => (
                    <ItemCard
                      key={inventory.id}
                      item={inventory}
                      onClick={() => handleItemClick(inventory)}
                      variant="grid"
                    />
                  ))}
                </div>

                {/* Pagination - Always show */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  totalItems={inventories.length}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <FloatingButton
        onClick={handleOpenSidebar}
        itemCount={0}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Modal ViewAll - Modal baru */}
      {selectedItem && (
        <ModalViewAll
          subjects={subjects}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedItem}
        />
      )}
    </>
  );
}
