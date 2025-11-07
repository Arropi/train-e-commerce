"use client";

import { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Order {
  id: number;
  name: string;
  item: string;
  date: string;
  lab: string;
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

export default function HeroAdmin() {
  const [selectedLab, setSelectedLab] = useState("semua");
  const [sortBy, setSortBy] = useState("date");

  // Mock data orders
  const orders: Order[] = [
    {
      id: 1,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 2,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 3,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 4,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 5,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 6,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
    {
      id: 7,
      name: "Muhammad Zidan Alhilal",
      item: "Osiloskop Analog GW Instek GOS 620",
      date: "1/10/2025",
      lab: "IDK",
    },
  ];

  // Mock data borrowed items
  const borrowedItems: BorrowedItem[] = [
    {
      id: 1,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW08",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "bad",
    },
    {
      id: 2,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW09",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "good",
    },
    {
      id: 3,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW10",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "good",
    },
    {
      id: 4,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW11",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "good",
    },
    {
      id: 5,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW12",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "good",
    },
    {
      id: 6,
      item_name: "Osiloskop Analog GW Instek GOS 620",
      no_item: "IDK-KACIIW13",
      img_url: "/images/osiloskop.png",
      lab: "Lab RPL",
      borrower: "Muhammad Zidan Alhilal",
      condition: "good",
    },
  ];

  const session1 = orders.slice(0, 7);
  const session2 = orders.slice(7);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#004CB0]">
            Dashboard Admin Lab IDK
          </h1>

          {/* Filters */}
          <div className="flex gap-4">
            {/* Lab Filter */}
            <div className="relative">
              <select
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
              >
                <option value="semua">Semua lab</option>
                <option value="idk">Lab IDK</option>
                <option value="elektronika">Lab Elektronika</option>
                <option value="taj">Lab TAJ</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="item">Sort by Item</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-500">
            <div className="col-span-1"></div>
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Barang</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Action</div>
          </div>

          {/* Session 1 */}
          <div className="border-b-2 border-gray-200">
            <div className="px-6 py-3 ">
              <h3 className="font-bold text-gray-700">1</h3>
            </div>
            {session1.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50"
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-[#004CB0] focus:ring-[#004CB0]"
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
                  <button className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Session 2 */}
          {session2.length > 0 && (
            <div>
              <div className="px-6 py-3">
                <h3 className="font-bold text-gray-700">2</h3>
              </div>
              {session2.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50"
                >
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-gray-300 text-[#004CB0] focus:ring-[#004CB0]"
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
                    <button className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sedang dipinjam section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#004CB0] mb-4">
            On Loan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {borrowedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header with Image and Title side by side */}
                <div className="flex items-start gap-4 mb-4 px-5 py-5">
                  {/* Item Image */}
                  <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center">
                    <Image
                      src={item.img_url}
                      alt={item.item_name}
                      width={80}
                      height={80}
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
                  <button className="flex px-4 py-0.5 bg-[#004CB0] text-white rounded-full text-xs hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Details
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-end mt-10">
                  <button className="flex px-3 py-1 items-center border-1 border-[#004CB0] text-[#004CB0] rounded-full text-xs font-medium hover:bg-[#004CB0] hover:text-white transition-colors">
                    Bad Condition
                  </button>
                  <button className="flex px-3 py-1 items-center  bg-[#C5D9F5] text-[#004CB0] rounded-full text-xs font-medium hover:bg-[#A8C7F0] transition-colors">
                    Good Condition
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}