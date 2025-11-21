"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import Image from "next/image";
import ModalAdminDashboard from "@/components/Modal/ModalAdminDashboard";
import ModalBorrowedItem from "@/components/Modal/ModalBorrowedItem";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

interface Order {
  id: number;
  name: string;
  item: string;
  date: string;
  lab: string;
}

interface OrderDetail {
  id: number;
  name: string;
  item: string;
  date: string;
  lab: string;
  serialNumber: string;
  purpose: string;
  session: string;
  borrower: string;
  room: string;
  personInCharge: string;
  condition: string;
  subject: string;
  image?: string;
}

interface BorrowedItem {
  id: number;
  item_name: string;
  no_item: string;
  img_url: string;
  lab: string;
  borrower: string;
  condition: "good" | "bad";
}

interface BorrowedItemDetail extends BorrowedItem {
  borrowed_date: string;
  session: string;
  room: string;
  expected_return_date: string;
  purpose: string;
  subject: string;
}

interface HeroAdminProps {
  orders: Order[];
  borrowedItems: BorrowedItem[];
}

export default function HeroAdmin({
  orders = [],
  borrowedItems = [],
}: HeroAdminProps) {
  const { isSidebarOpen } = useAdminSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBorrowedModalOpen, setIsBorrowedModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedBorrowedItem, setSelectedBorrowedItem] =
    useState<BorrowedItemDetail | null>(null);


  const ordersDetail: OrderDetail[] = [
    {
      id: 1,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "Lab Elektronika",
      serialNumber: "728878134781397",
      purpose: "Project",
      session: "Session 2 - 12.30",
      borrower: "Muhammad Zidan Alhilal",
      room: "HU 201",
      personInCharge: "Gibran Rakabuming Raka",
      condition: "Good",
      subject: "Praktikum Pemrograman Web 2",
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Muhammad Zidan Alhilal",
      item: "Multimeter Digital Fluke 87V",
      date: "2/10/2025",
      lab: "Lab Elektronika",
      serialNumber: "MLT-2023-002",
      purpose: "Praktikum",
      session: "Session 1 - 07.30",
      borrower: "Ahmad Dahlan",
      room: "HU 202",
      personInCharge: "Soekarno Hatta",
      condition: "Fair",
      subject: "Praktikum Elektronika Dasar",
      image:
        "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Muhammad Zidan Alhilal",
      item: "Function Generator 20MHz",
      date: "3/10/2025",
      lab: "Lab Telekomunikasi",
      serialNumber: "FGN-2023-003",
      purpose: "Penelitian",
      session: "Session 2 - 12.30",
      borrower: "Budi Santoso",
      room: "HU 203",
      personInCharge: "Tan Malaka",
      condition: "Good",
      subject: "Penelitian Sinyal Digital",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Muhammad Zidan Alhilal",
      item: "Logic Analyzer 16 Channel",
      date: "4/10/2025",
      lab: "Lab Komputer",
      serialNumber: "LGA-2023-004",
      purpose: "Project",
      session: "Session 1 - 07.30",
      borrower: "Citra Dewi",
      room: "HU 204",
      personInCharge: "Ki Hajar Dewantara",
      condition: "Excellent",
      subject: "Praktikum Sistem Digital",
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: "Muhammad Zidan Alhilal",
      item: "Signal Generator RF",
      date: "5/10/2025",
      lab: "Lab IDK",
      serialNumber: "SGN-2023-005",
      purpose: "Praktikum",
      session: "Session 2 - 12.30",
      borrower: "Dewi Sartika",
      room: "HU 201",
      personInCharge: "R.A. Kartini",
      condition: "Good",
      subject: "Praktikum RF Communication",
      image:
        "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: "Muhammad Zidan Alhilal",
      item: "Spectrum Analyzer",
      date: "6/10/2025",
      lab: "Lab Telekomunikasi",
      serialNumber: "SPA-2023-006",
      purpose: "Penelitian",
      session: "Session 1 - 07.30",
      borrower: "Eko Prasetyo",
      room: "HU 202",
      personInCharge: "Cut Nyak Dien",
      condition: "Good",
      subject: "Penelitian Spektrum Frekuensi",
      image:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
    },
    {
      id: 7,
      name: "Muhammad Zidan Alhilal",
      item: "Power Supply DC 0-30V",
      date: "7/10/2025",
      lab: "Lab Elektronika",
      serialNumber: "PWS-2023-007",
      purpose: "Project",
      session: "Session 2 - 12.30",
      borrower: "Fajar Nugroho",
      room: "HU 203",
      personInCharge: "Diponegoro",
      condition: "Excellent",
      subject: "Praktikum Power Electronics",
      image:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
    },
  ];

  // ✅ Dummy data untuk borrowed items dengan detail lengkap
  const dummyBorrowedItemsDetail: BorrowedItemDetail[] = [
    {
      id: 1,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW08",
      img_url:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "bad",
      borrowed_date: "1/11/2025",
      session: "Session 1 - 07.30",
      room: "HU 201",
      expected_return_date: "8/11/2025",
      purpose: "Praktikum",
      subject: "Praktikum Elektronika Digital",
    },
    {
      id: 2,
      item_name: "Multimeter Digital Fluke 87V",
      no_item: "IDK-KACIIW09",
      img_url:
        "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
      lab: "Lab Elektronika",
      borrower: "Ahmad Dahlan",
      condition: "good",
      borrowed_date: "2/11/2025",
      session: "Session 2 - 12.30",
      room: "HU 202",
      expected_return_date: "9/11/2025",
      purpose: "Project",
      subject: "Final Project Instrumentasi",
    },
    {
      id: 3,
      item_name: "Function Generator 20MHz",
      no_item: "IDK-KACIIW10",
      img_url:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      lab: "Lab Telekomunikasi",
      borrower: "Budi Santoso",
      condition: "good",
      borrowed_date: "3/11/2025",
      session: "Session 1 - 07.30",
      room: "HU 203",
      expected_return_date: "10/11/2025",
      purpose: "Penelitian",
      subject: "Penelitian Sinyal Analog",
    },
    {
      id: 4,
      item_name: "Logic Analyzer 16 Channel",
      no_item: "IDK-KACIIW11",
      img_url:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      lab: "Lab Komputer",
      borrower: "Citra Dewi",
      condition: "good",
      borrowed_date: "4/11/2025",
      session: "Session 2 - 12.30",
      room: "HU 204",
      expected_return_date: "11/11/2025",
      purpose: "Praktikum",
      subject: "Praktikum Sistem Digital",
    },
    {
      id: 5,
      item_name: "Signal Generator RF 6GHz",
      no_item: "IDK-KACIIW12",
      img_url:
        "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
      lab: "Lab IDK",
      borrower: "Dewi Sartika",
      condition: "good",
      borrowed_date: "5/11/2025",
      session: "Session 1 - 07.30",
      room: "HU 201",
      expected_return_date: "12/11/2025",
      purpose: "Project",
      subject: "Final Project RF Communication",
    },
    {
      id: 6,
      item_name: "Spectrum Analyzer Pro",
      no_item: "IDK-KACIIW13",
      img_url:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      lab: "Lab Telekomunikasi",
      borrower: "Eko Prasetyo",
      condition: "good",
      borrowed_date: "6/11/2025",
      session: "Session 2 - 12.30",
      room: "HU 202",
      expected_return_date: "13/11/2025",
      purpose: "Penelitian",
      subject: "Penelitian Spektrum Frekuensi",
    },
    {
      id: 7,
      item_name: "Power Supply DC 0-30V",
      no_item: "IDK-KACIIW14",
      img_url:
        "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
      lab: "Lab Elektronika",
      borrower: "Fajar Nugroho",
      condition: "good",
      borrowed_date: "7/11/2025",
      session: "Session 1 - 07.30",
      room: "HU 203",
      expected_return_date: "14/11/2025",
      purpose: "Praktikum",
      subject: "Praktikum Power Electronics",
    },
    {
      id: 8,
      item_name: "Network Analyzer 8GHz",
      no_item: "IDK-KACIIW15",
      img_url:
        "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
      lab: "Lab IDK",
      borrower: "Hadi Wijaya",
      condition: "good",
      borrowed_date: "8/11/2025",
      session: "Session 2 - 12.30",
      room: "HU 204",
      expected_return_date: "15/11/2025",
      purpose: "Project",
      subject: "Final Project Jaringan Komunikasi",
    },
    {
      id: 9,
      item_name: "Digital Caliper Precision",
      no_item: "IDK-KACIIW16",
      img_url:
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
      lab: "Lab RPL",
      borrower: "Maya Putri",
      condition: "bad",
      borrowed_date: "9/11/2025",
      session: "Session 1 - 07.30",
      room: "HU 201",
      expected_return_date: "16/11/2025",
      purpose: "Praktikum",
      subject: "Praktikum Metrologi",
    },
  ];

  // ✅ Gunakan dummy data jika borrowedItems kosong
  const displayBorrowedItems =
    borrowedItems.length > 0
      ? borrowedItems.map((item) => {
          const detail = dummyBorrowedItemsDetail.find((d) => d.id === item.id);
          return detail || { ...item, ...dummyBorrowedItemsDetail[0] };
        })
      : dummyBorrowedItemsDetail;

  const session1 = ordersDetail.slice(0, 7);
  const session2 = ordersDetail.slice(7);

  const handleDetailsClick = (orderId: number) => {
    const order = ordersDetail.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleBorrowedItemDetailsClick = (itemId: number) => {
    const item = dummyBorrowedItemsDetail.find((i) => i.id === itemId);
    if (item) {
      setSelectedBorrowedItem(item);
      setIsBorrowedModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const closeBorrowedModal = () => {
    setIsBorrowedModalOpen(false);
    setSelectedBorrowedItem(null);
  };

  return (
    <>
      <div className="min-h-screen p-2 pt-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#004CB0]">
              Dashboard Admin Lab IDK
            </h1>
          </div>

          {/* Table Container */}
          <div className={`bg-white rounded-xl overflow-hidden mb-8 overflow-x-auto ${isSidebarOpen ? 'mr-4' : ''}`}>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-500">
              <div className="col-span-1"></div>
              <div className="col-span-3">Name</div>
              <div className="col-span-4">Barang</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Action</div>
            </div>

            {/* Session 1 */}
            <div className="">
              <div className="px-6 py-3 ">
                <h3 className="font-bold text-gray-700">1</h3>
              </div>
              {session1.map((order) => (
                <React.Fragment key={order.id}>
                  <div
                    className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-[#004CB0] text-[#004CB0] focus:ring-[#004CB0] focus:ring-2 cursor-pointer accent-[#004CB0]"
                      />
                    </div>
                    <div className="col-span-3 text-sm text-gray-800">
                      {order.name}
                    </div>
                    <div className="col-span-4 text-sm text-gray-800">
                      {order.item}
                    </div>
                    <div className="col-span-2 text-sm text-gray-800">
                      {order.date}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <button className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                        <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                        <Check
                          className="w-6 h-6 text-green-500"
                          strokeWidth={2.5}
                        />
                      </button>
                      <button
                        onClick={() => handleDetailsClick(order.id)}
                        className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                  {/* Mobile View */}
                  <div
                    className="md:hidden px-4 py-4 border-b border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-[#004CB0] text-[#004CB0] focus:ring-[#004CB0] focus:ring-2 cursor-pointer accent-[#004CB0]"
                      />
                      <div className="flex-1 ml-3">
                        <p className="font-medium text-gray-800">{order.name}</p>
                        <p className="text-sm text-gray-600">{order.item}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                        <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                        <Check
                          className="w-6 h-6 text-green-500"
                          strokeWidth={2.5}
                        />
                      </button>
                      <button
                        onClick={() => handleDetailsClick(order.id)}
                        className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Session 2 */}
            {session2.length > 0 && (
              <div>
                <div className="px-6 py-3">
                  <h3 className="font-bold text-gray-700">2</h3>
                </div>
                {session2.map((order) => (
                  <React.Fragment key={order.id}>
                    <div
                      className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50"
                    >
                      <div className="col-span-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-2 border-[#004CB0] text-[#004CB0] focus:ring-[#004CB0] focus:ring-2 cursor-pointer accent-[#004CB0]"
                        />
                      </div>
                      <div className="col-span-3 text-sm text-gray-800">
                        {order.name}
                      </div>
                      <div className="col-span-4 text-sm text-gray-800">
                        {order.item}
                      </div>
                      <div className="col-span-2 text-sm text-gray-800">
                        {order.date}
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <button className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                          <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                          <Check
                            className="w-6 h-6 text-green-500"
                            strokeWidth={2.5}
                          />
                        </button>
                        <button
                          onClick={() => handleDetailsClick(order.id)}
                          className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                    {/* Mobile View */}
                    <div
                      className="md:hidden px-4 py-4 border-b border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-2 border-[#004CB0] text-[#004CB0] focus:ring-[#004CB0] focus:ring-2 cursor-pointer accent-[#004CB0]"
                        />
                        <div className="flex-1 ml-3">
                          <p className="font-medium text-gray-800">{order.name}</p>
                          <p className="text-sm text-gray-600">{order.item}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                          <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                        </button>
                        <button className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                          <Check
                            className="w-6 h-6 text-green-500"
                            strokeWidth={2.5}
                          />
                        </button>
                        <button
                          onClick={() => handleDetailsClick(order.id)}
                          className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Sedang dipinjam section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#004CB0] mb-4">On Loan</h2>

            {displayBorrowedItems.length > 0 ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
                {displayBorrowedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow h-[280px] ${isSidebarOpen ? 'w-[330px]' : 'w-[380px]'}`}
                  >
                    {/* Header with Image and Title side by side */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Item Image */}
                      <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center">
                        <Image
                          src={item.img_url}
                          alt={item.item_name}
                          width={96}
                          height={96}
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 overflow-hidden text-ellipsis">
                          {item.item_name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.lab}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-300 my-4" />

                    {/* Borrower Info */}
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-700 truncate mr-2">
                        {item.borrower}
                      </p>
                      <button
                        onClick={() => handleBorrowedItemDetailsClick(item.id)}
                        className="px-4 py-1 bg-[#004CB0] text-white rounded-full text-xs hover:bg-blue-900 transition-colors whitespace-nowrap"
                      >
                        Details
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end mt-8">
                      <button className="px-3 py-1 border border-[#004CB0] text-[#004CB0] rounded-full text-xs font-medium hover:bg-[#004CB0] hover:text-white transition-colors">
                        Bad Condition
                      </button>
                      <button className="px-3 py-1 bg-[#C5D9F5] text-[#004CB0] rounded-full text-xs font-medium hover:bg-[#A8C7F0] transition-colors">
                        Good Condition
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No items currently on loan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal untuk Orders */}
      <ModalAdminDashboard
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />

      {/* Modal untuk Borrowed Items */}
      <ModalBorrowedItem
        isOpen={isBorrowedModalOpen}
        onClose={closeBorrowedModal}
        item={selectedBorrowedItem}
      />
    </>
  );
}
