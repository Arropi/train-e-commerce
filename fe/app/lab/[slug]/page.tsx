"use client";

import { useEffect, useState } from "react";
import Navbar from "../../../modules/Navbar/navbar";
import ItemModal from "../../../components/Modal/ItemModal";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";

export default function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openSidebar, isSidebarOpen } = useSidebar();

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  const dataLab = [
    {
      id: 1,
      name: "Elektronika",
    },
    {
      id: 2,
      name: "IDK",
    },
    {
      id: 3,
      name: "TAJ",
    },
    {
      id: 4,
      name: "RPL",
    },
    {
      id: 5,
      name: "TL",
    },
  ];

  // Dummy array untuk membuat grid 15 kartu kosong (3 baris x 5 kolom)
  const dummyCards = Array(15).fill(null);

  const handleItemClick = (index: number) => {
    const item = {
      name: "Osiloskop Analog GW Instek GOS 620",
      image: "/icons/osiloskop.png",
      lab: "Lab RPL",
      available: index % 7 !== 0,
    };
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  return (
    <>
      <Navbar />

      {/* Wrapper yang bergeser saat sidebar terbuka */}
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
            {dummyCards.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleItemClick(index)}
              >
                <div className="p-4">
                  {/* Image Container */}
                  <div className="flex justify-center items-center mb-3">
                    <div className="w-full h-24 flex items-center justify-center">
                      <img
                        src="/icons/osiloskop.png"
                        alt="Item preview"
                        className="max-h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <h3 className="text-sm font-medium text-gray-800 mb-1">
                    Osiloskop Analog GW Instek GOS 620
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">Lab RPL</p>

                  {/* Status Badge */}
                  <div>
                    {index % 7 === 0 ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-[#FE9696] text-[#C70000]">
                        Not Available
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-[#B2FD9E] text-[#1F8E00]">
                        Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <FloatingButton
        onClick={handleOpenSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Modal */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
      />
    </>
  );
}
