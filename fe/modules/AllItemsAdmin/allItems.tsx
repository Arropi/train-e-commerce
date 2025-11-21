"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Plus, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

interface Item {
  id: number;
  name: string;
  lab: string;
  image: string;
  serialNumber: string;
  category: string;
  condition: "good" | "bad" | "fair" | "excellent";
  status: "available" | "on_loan" | "maintenance";
}

interface AllItemsAdminProps {
  session: Session;
  items: Item[];
}

// Success Notification Component (inline)
function SuccessNotification({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-slide-down">
      <div className="bg-green-500 text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3">
        <CheckCircle className="w-6 h-6" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

export default function AllItemsAdmin({ session, items }: AllItemsAdminProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSidebarOpen } = useAdminSidebar();
  const [selectedLab, setSelectedLab] = useState("semua");
  const [sortBy, setSortBy] = useState("name");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessNotification(true);
      // Remove success parameter from URL
      router.replace("/admin/allItems");
    }
  }, [searchParams, router]);

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter((item) => {
      if (selectedLab === "semua") return true;
      return item.lab === selectedLab;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "lab":
          return a.lab.localeCompare(b.lab);
        case "condition":
          return a.condition.localeCompare(b.condition);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const handleAddClick = () => {
    router.push("/admin/allItems/add");
  };

  const handleEditClick = (itemId: number) => {
    router.push(`/admin/allItems/edit/${itemId}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Success Notification */}
      {showSuccessNotification && (
        <SuccessNotification
          message="Barang berhasil ditambahkan!"
          onClose={() => setShowSuccessNotification(false)}
        />
      )}

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
            {/* Header and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h1 className="text-3xl font-bold text-[#004CB0] mb-4 sm:mb-0">All Items</h1>

              {/* Filters */}
              <div className={`flex flex-col sm:flex-row gap-4 ${isSidebarOpen ? 'mr-4' : ''}`}>
                {/* Lab Filter */}
                <div className="relative">
                  <select
                    value={selectedLab}
                    onChange={(e) => setSelectedLab(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="semua">Semua lab</option>
                    <option value="Lab IDK">Lab IDK</option>
                    <option value="Lab Elektronika">Lab Elektronika</option>
                    <option value="Lab RPL">Lab RPL</option>
                    <option value="Lab TAJ">Lab TAJ</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="lab">Sort by Lab</option>
                    <option value="condition">Sort by Condition</option>
                    <option value="status">Sort by Status</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Items Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
              {filteredAndSortedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleEditClick(item.id)}
                  className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer"
                >
                  {/* Item Image */}
                  <div className="flex items-center justify-center mb-4 h-40 w-full rounded-lg p-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={150}
                      height={120}
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Item Info and Edit Button */}
                  <div className="w-full">
                    <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{item.lab}</p>

                    {/* Edit Button - Left Aligned */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(item.id);
                      }}
                      className="px-4 py-0 bg-[#004CB0] text-white text-sm font-medium rounded-full hover:bg-blue-900 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Add Button */}
            <button
              onClick={handleAddClick}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-[#004CB0] text-white rounded-full shadow-lg hover:bg-blue-900 transition-all hover:scale-110 flex items-center justify-center z-50"
            >
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
