"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

interface BorrowHistory {
  id: number;
  itemName: string;
  itemImage: string;
  borrowerName: string;
  borrowerNim: string;
  lab: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  status: "returned" | "late" | "damaged";
}

interface HistoryAdminProps {
  session: Session;
  historyData: BorrowHistory[];
}

export default function HistoryAdmin({
  session,
  historyData,
}: HistoryAdminProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const [selectedDate, setSelectedDate] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDetailClick = (itemName: string) => {
    // Encode item name untuk URL
    const encodedName = encodeURIComponent(itemName);
    router.push(`/admin/historyItems/${encodedName}`);
  };

  // Filter data based on lab, date, and search
  const filteredData = historyData.filter((item) => {
    const searchMatch =
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.borrowerName.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.itemName.localeCompare(b.itemName);
      case "lab":
        return a.lab.localeCompare(b.lab);
      case "condition":
        return a.status.localeCompare(b.status);
      case "status":
      default:
        return new Date(b.returnDate).getTime() - new Date(a.returnDate).getTime();
    }
  });

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image || undefined,
        }}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-68" : "lg:ml-16"
        }`}
      >
        <div className="min-h-screen p-2 pt-20 bg-white">
          <div className="max-w-6xl mx-auto">
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
              <h1 className="text-3xl font-bold text-[#004CB0] mb-4 sm:mb-0">
                History
              </h1>

              {/* Filters */}
              <div className={`flex flex-col sm:flex-row gap-3 ${isSidebarOpen ? 'mr-4' : ''}`}>

                {/* Date Filter */}
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="appearance-none px-5 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-600 text-sm font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="all">Date</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004CB0] pointer-events-none" />
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-5 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-600 text-sm font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="lab">Sort by Lab</option>
                    <option value="condition">Sort by Condition</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004CB0] pointer-events-none" />
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-1.5 border-2 border-[#004CB0] rounded-full text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-48"
                  />
                </div>
              </div>
            </div>

            {/* History Cards Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
              {sortedData.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No history data found</p>
                </div>
              ) : (
                sortedData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleDetailClick(item.itemName)}
                    className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer h-85 w-55"
                  >
                    {/* Item Image */}
                    <div className="flex items-center justify-center mb-4 h-40 w-full rounded-lg p-2">
                      {item.itemImage ? (
                        <Image
                          src={item.itemImage}
                          alt={item.itemName}
                          width={150}
                          height={120}
                          className="object-cover w-full h-full rounded-lg"
                          loading="lazy"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded-lg">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="w-full">
                      <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                        {item.itemName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{item.lab}</p>

                      {/* Detail Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailClick(item.itemName);
                        }}
                        className="px-4 py-0 bg-[#004CB0] text-white text-sm font-medium rounded-full hover:bg-blue-900 transition-colors"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
