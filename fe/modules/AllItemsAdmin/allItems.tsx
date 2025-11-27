"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Plus, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

const dataLab = [
  { id: 1, name: "Elektronika" },
  { id: 2, name: "IDK" },
  { id: 3, name: "TAJ" },
  { id: 4, name: "RPL" },
  { id: 5, name: "TL" },
];

interface RawInventory {
  id: number;
  item_name: string;
  no_item: string;
  condition: string;
  alat_bhp: string;
  labolatory_id: number;
  inventory_galleries: { filepath: string }[];
}

interface Item {
  id: number;
  name: string;
  lab: string;
  labId: number;
  image: string;
  serialNumber: string;
  category: string;
  condition: string;
}

interface AllItemsAdminProps {
  session: Session;
  inventories: RawInventory[];
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

export default function AllItemsAdmin({ session, inventories }: AllItemsAdminProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSidebarOpen } = useAdminSidebar();
  const [selectedLab, setSelectedLab] = useState("semua");
  const [sortBy, setSortBy] = useState("name");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [fetchedItems, setFetchedItems] = useState<Item[]>([]);

  const mappedInventories = useMemo(() => (Array.isArray(inventories) ? inventories : []).map((inv: RawInventory) => ({
    id: inv.id,
    name: inv.item_name,
    lab: dataLab.find(lab => lab.id === inv.labolatory_id)?.name || "Unknown Lab",
    labId: inv.labolatory_id,
    image: inv.inventory_galleries?.[0]?.filepath || "",
    serialNumber: inv.no_item,
    category: inv.alat_bhp || "alat",
    condition: inv.condition || "good",
  })), [inventories]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessNotification(true);
      // Remove success parameter from URL
      router.replace("/admin/allItems");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories`, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const mappedItems: Item[] = data.inventories.map((inv: RawInventory) => ({
            id: inv.id,
            name: inv.item_name,
            lab: dataLab.find(lab => lab.id === inv.labolatory_id)?.name || "Unknown Lab",
            labId: inv.labolatory_id,
            image: inv.inventory_galleries?.[0]?.filepath || "",
            serialNumber: inv.no_item,
            category: inv.alat_bhp || "alat",
            condition: inv.condition || "good",
          }));
          setFetchedItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, [session]);

  const displayItems = fetchedItems.length > 0 ? fetchedItems : mappedInventories;

  const filteredItems = useMemo(() => {
    if (selectedLab === "semua") return displayItems;
    return displayItems.filter(item => item.labId === parseInt(selectedLab));
  }, [displayItems, selectedLab]);

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lab":
        sorted.sort((a, b) => a.labId - b.labId);
        break;
      case "condition":
        sorted.sort((a, b) => a.condition.localeCompare(b.condition));
        break;
      case "status":
      default:
        sorted.sort((a, b) => a.id - b.id);
        break;
    }
    return sorted;
  }, [filteredItems, sortBy]);

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
                    <option value="1">Lab Elektronika</option>
                    <option value="2">Lab IDK</option>
                    <option value="3">Lab TAJ</option>
                    <option value="4">Lab RPL</option>
                    <option value="5">Lab TL</option>
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
              {sortedItems.map((item) => (
                <div
                  key={`${item.id}-${item.serialNumber}`}
                  onClick={() => handleEditClick(item.id)}
                  className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow items-center cursor-pointer h-80 w-50"
                >
                  {/* Item Image */}
                  <div className="flex items-center justify-center mb-4 h-40 w-full rounded-lg p-2">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={150}
                        height={120}
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
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
