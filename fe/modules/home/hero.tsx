"use client";

import { useState } from "react";
import { Session } from "next-auth";
import TopCard from "@/components/TopCard/topCard";
import ItemCard from "@/components/ItemCard/ItemCard";
import Section from "../../components/Section/Section";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";
import ModalViewAll from "@/components/Modal/ModalViewAll"; // ✅ Import modal

export default function Hero({ session }: { session: Session }) {
  const [activeCard, setActiveCard] = useState(0);
  const { openSidebar, isSidebarOpen } = useSidebar();

  // ✅ State untuk modal
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topCards = [
    {
      id: 0,
      title: "Laboratorium Elektronika",
      iconPath: "/icons/logo elektronika.svg",
      labPath: "/lab/1",
    },
    {
      id: 1,
      title: "Laboratorium IDK",
      iconPath: "/icons/lab_idk.svg",
      labPath: "/lab/2",
    },
    {
      id: 2,
      title: "Laboratorium TAJ",
      iconPath: "/icons/lab_taj.svg",
      labPath: "/lab/3",
    },
    {
      id: 3,
      title: "Laboratorium RPL",
      iconPath: "/icons/lab_rpl.svg",
      labPath: "/lab/4",
    },
    {
      id: 4,
      title: "Laboratorium TL",
      iconPath: "/icons/lab_tl.svg",
      labPath: "/lab/5",
    },
  ];

  // ✅ Pastikan SEMUA item memiliki image
  const ongoingItems = [
    {
      id: 1,
      title: "Osiloskop Analog GW Instek GOS 620",
      status: "Approved",
      type: "approve" as const,
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      serialNumber: "728878134781397",
      date: "1/10/2025",
      lab: "Lab Elektronika",
      purpose: "Project",
      session: "Session 2 - 12.30",
      borrower: "Muhammad Zidan Alhilal",
      room: "HU 201",
      personInCharge: "Gibran Rakabuming Raka",
      condition: "Good",
      subject: "Praktikum Pemrograman Web 2",
    },
    {
      id: 2,
      title: "Multimeter Digital Fluke 87V",
      status: "Rejected",
      type: "rejected" as const,
      image: "/images/logoUGM.png",
      serialNumber: "MLT-2023-002",
      date: "2/10/2025",
      lab: "Lab Elektronika",
      purpose: "Praktikum",
      session: "Session 1 - 07.30",
      borrower: "Ahmad Dahlan",
      room: "HU 202",
      personInCharge: "Soekarno Hatta",
      condition: "Fair",
      subject: "Praktikum Elektronika Dasar",
    },
    {
      id: 3,
      title: "Function Generator 20MHz",
      status: "Process",
      type: "process" as const,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      serialNumber: "FGN-2023-003",
      date: "3/10/2025",
      lab: "Lab Telekomunikasi",
      purpose: "Penelitian",
      session: "Session 2 - 12.30",
      borrower: "Budi Santoso",
      room: "HU 203",
      personInCharge: "Tan Malaka",
      condition: "Good",
      subject: "Penelitian Sinyal Digital",
    },
    {
      id: 4,
      title: "Logic Analyzer 16 Channel",
      status: "Waiting to be Return",
      type: "waiting_to_be_return" as const,
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      serialNumber: "LGA-2023-004",
      date: "4/10/2025",
      lab: "Lab Komputer",
      purpose: "Project",
      session: "Session 1 - 07.30",
      borrower: "Citra Dewi",
      room: "HU 204",
      personInCharge: "Ki Hajar Dewantara",
      condition: "Excellent",
      subject: "Praktikum Sistem Digital",
    },
    {
      id: 5,
      title: "Signal Generator RF",
      status: "Approved",
      type: "approve" as const,
      image: "/images/logoUGM.png",
      serialNumber: "SGN-2023-005",
      date: "5/10/2025",
      lab: "Lab IDK",
      purpose: "Praktikum",
      session: "Session 2 - 12.30",
      borrower: "Dewi Sartika",
      room: "HU 201",
      personInCharge: "R.A. Kartini",
      condition: "Good",
      subject: "Praktikum RF Communication",
    },
    {
      id: 6,
      title: "Spectrum Analyzer",
      status: "Rejected",
      type: "rejected" as const,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      serialNumber: "SPA-2023-006",
      date: "6/10/2025",
      lab: "Lab Telekomunikasi",
      purpose: "Penelitian",
      session: "Session 1 - 07.30",
      borrower: "Eko Prasetyo",
      room: "HU 202",
      personInCharge: "Cut Nyak Dien",
      condition: "Good",
      subject: "Penelitian Spektrum Frekuensi",
    },
    {
      id: 7,
      title: "Power Supply DC 0-30V",
      status: "Waiting to be Return",
      type: "waiting_to_be_return" as const,
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      serialNumber: "PWS-2023-007",
      date: "7/10/2025",
      lab: "Lab Elektronika",
      purpose: "Project",
      session: "Session 2 - 12.30",
      borrower: "Fajar Nugroho",
      room: "HU 203",
      personInCharge: "Diponegoro",
      condition: "Excellent",
      subject: "Praktikum Power Electronics",
    },
  ];

  const doneItems = [
    {
      id: 8,
      title: "Oscilloscope Digital 200MHz",
      status: "Done",
      type: "done" as const,
      image: "/images/logoUGM.png",
      serialNumber: "OSD-2023-008",
      date: "20/09/2025",
      lab: "Lab IDK",
      purpose: "Penelitian",
      session: "Session 1 - 07.30",
      borrower: "Gita Savitri",
      room: "HU 201",
      personInCharge: "Sultan Agung",
      condition: "Excellent",
      subject: "Penelitian Modulasi Digital",
    },
    {
      id: 9,
      title: "Network Analyzer",
      status: "Done",
      type: "done" as const,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      serialNumber: "NWA-2023-009",
      date: "21/09/2025",
      lab: "Lab Telekomunikasi",
      purpose: "Praktikum",
      session: "Session 2 - 12.30",
      borrower: "Hadi Wijaya",
      room: "HU 202",
      personInCharge: "Bung Tomo",
      condition: "Good",
      subject: "Praktikum Jaringan Komunikasi",
    },
    {
      id: 10,
      title: "Signal Generator 6GHz",
      status: "Done",
      type: "done" as const,
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      serialNumber: "SGN-2023-010",
      date: "22/09/2025",
      lab: "Lab Elektronika",
      purpose: "Project",
      session: "Session 1 - 07.30",
      borrower: "Indra Kusuma",
      room: "HU 203",
      personInCharge: "Gatot Subroto",
      condition: "Good",
      subject: "Final Project Telekomunikasi",
    },
    {
      id: 11,
      title: "Logic Probe Digital",
      status: "Done",
      type: "done" as const,
      image: "/images/logoUGM.png",
      serialNumber: "LGP-2023-011",
      date: "23/09/2025",
      lab: "Lab Komputer",
      purpose: "Praktikum",
      session: "Session 2 - 12.30",
      borrower: "Joko Santoso",
      room: "HU 204",
      personInCharge: "Ahmad Yani",
      condition: "Fair",
      subject: "Praktikum Sistem Digital Lanjut",
    },
    {
      id: 12,
      title: "Function Generator 50MHz",
      status: "Done",
      type: "done" as const,
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      serialNumber: "FGN-2023-012",
      date: "24/09/2025",
      lab: "Lab IDK",
      purpose: "Penelitian",
      session: "Session 1 - 07.30",
      borrower: "Kartika Sari",
      room: "HU 201",
      personInCharge: "Sudirman",
      condition: "Excellent",
      subject: "Penelitian Gelombang Sinyal",
    },
    {
      id: 13,
      title: "Multimeter Analog",
      status: "Done",
      type: "done" as const,
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      serialNumber: "MLA-2023-013",
      date: "25/09/2025",
      lab: "Lab Elektronika",
      purpose: "Praktikum",
      session: "Session 2 - 12.30",
      borrower: "Lestari Dewi",
      room: "HU 202",
      personInCharge: "Soeharto",
      condition: "Good",
      subject: "Praktikum Pengukuran Elektronika",
    },
    {
      id: 14,
      title: "Digital Caliper Precision",
      status: "Done",
      type: "done" as const,
      image: "/images/logoUGM.png", 
      serialNumber: "DCP-2023-014",
      date: "26/09/2025",
      lab: "Lab Telekomunikasi",
      purpose: "Project",
      session: "Session 1 - 07.30",
      borrower: "Maya Putri",
      room: "HU 203",
      personInCharge: "Mohammad Hatta",
      condition: "Excellent",
      subject: "Final Project Instrumentasi",
    },
  ];

  const handleCardHover = (cardId: number) => {
    setActiveCard(cardId);
  };

  // ✅ Update handleItemClick untuk buka modal
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ✅ Handler untuk tutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Cards Section */}
            <div className="flex gap-4 mb-8 h-64 overflow-x-auto scrollbar-hide">
              {topCards.map((card) => (
                <TopCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  iconPath={card.iconPath}
                  labPath={card.labPath}
                  isActive={activeCard === card.id}
                  onHover={handleCardHover}
                />
              ))}
            </div>

            {/* On Going Section */}
            <Section title="On Going" viewAllHref="/viewAll/ongoing">
              {ongoingItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </Section>

            {/* History Section */}
            <Section title="History" viewAllHref="/viewAll/history">
              {doneItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </Section>
          </div>
        </div>
      </div>

      <FloatingButton
        onClick={handleOpenSidebar}
        itemCount={0}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ✅ Modal ViewAll */}
      {selectedItem && (
        <ModalViewAll
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedItem}
        />
      )}
    </>
  );
}
