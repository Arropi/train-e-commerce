"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Plus, CheckCircle, Search } from "lucide-react";
import Image from "next/image";
import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import { Laboratory } from "../../types";

interface RawInventory {
  id: number;
  item_name: string;
  no_item: string;
  condition: string;
  alat_bhp: string;
  type: string;
  labolatory_id: number;
  room_id: number | null;
  inventory_galleries: { filepath: string }[];
  rooms?: { id: number; name: string } | null;
}

interface Item {
  id: number;
  name: string;
  lab: string;
  labId: number;
  roomId: number | null;
  roomName: string;
  image: string;
  serialNumber: string;
  category: string;
  condition: string;
  type: string;
}

interface AllItemsAdminProps {
  session: Session;
  inventories: RawInventory[];
  laboratories: Laboratory[]
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

export default function AllItemsAdmin({ session, inventories , laboratories}: AllItemsAdminProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSidebarOpen } = useAdminSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("semua");
  const [selectedPurpose, setSelectedPurpose] = useState("semua");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("Item successfully added");
  const [fetchedItems, setFetchedItems] = useState<Item[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [adminLabId, setAdminLabId] = useState<number | null>(null);

  const isLoading = loadingRooms || loadingItems;

  const mappedInventories = useMemo(() => (Array.isArray(inventories) ? inventories : []).map((inv: RawInventory) => ({
    id: inv.id,
    name: inv.item_name,
    lab: laboratories.find(lab => lab.id === inv.labolatory_id)?.title || "Lab",
    labId: inv.labolatory_id,
    roomId: inv.room_id || null,
    roomName: inv.rooms?.name || "No Room",
    image: inv.inventory_galleries?.[0]?.filepath || "",
    serialNumber: inv.no_item,
    category: inv.alat_bhp || "alat",
    condition: inv.condition || "good",
    type: inv.type || "praktikum",
  })), [inventories, laboratories]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setNotificationMessage("Item successfully added");
      setShowSuccessNotification(true);
      // Remove success parameter from URL
      router.replace("/admin/allItems");
    } else if (searchParams.get("updated") === "true") {
      setNotificationMessage("Item successfully updated");
      setShowSuccessNotification(true);
      // Remove updated parameter from URL
      router.replace("/admin/allItems");
    }
  }, [searchParams, router]);

  // Extract lab_id dari JWT token
  useEffect(() => {
    if (session?.user?.accessToken) {
      try {
        const payload = JSON.parse(atob(session.user.accessToken.split('.')[1]));
        setAdminLabId(payload.lab_id || null);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [session]);

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      setLoadingRooms(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/rooms`, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setRooms(data.data || data.rooms || []);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [session]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories`, {
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Filter items berdasarkan lab_id admin
          const filteredInventories = adminLabId 
            ? data.inventories.filter((inv: RawInventory) => inv.labolatory_id === adminLabId)
            : data.inventories;
          
          const mappedItems: Item[] = filteredInventories.map((inv: RawInventory) => ({
            id: inv.id,
            name: inv.item_name,
            lab: laboratories.find(lab => lab.id === inv.labolatory_id)?.title || "Lab",
            labId: inv.labolatory_id,
            roomId: inv.room_id || null,
            roomName: inv.rooms?.name || "No Room",
            image: inv.inventory_galleries?.[0]?.filepath || "",
            serialNumber: inv.no_item,
            category: inv.alat_bhp || "alat",
            condition: inv.condition || "good",
            type: inv.type || "praktikum",
          }));
          setFetchedItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoadingItems(false);
      }
    };
    if (adminLabId !== null) {
      fetchItems();
    }
  }, [session, adminLabId, laboratories]);

  // Filter mapped inventories by admin lab_id
  const filteredMappedInventories = useMemo(() => {
    if (!adminLabId) return mappedInventories;
    return mappedInventories.filter(item => item.labId === adminLabId);
  }, [mappedInventories, adminLabId]);

  const displayItems = fetchedItems.length > 0 ? fetchedItems : filteredMappedInventories;

  const filteredAndSearchedItems = useMemo(() => {
    let filtered = displayItems;
    
    // Filter by room
    if (selectedRoom !== "semua") {
      filtered = filtered.filter(item => item.roomId === parseInt(selectedRoom));
    }
    
    // Filter by purpose
    if (selectedPurpose !== "semua") {
      filtered = filtered.filter(item => item.type === selectedPurpose);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [displayItems, selectedRoom, selectedPurpose, searchQuery]);

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
          message={notificationMessage}
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

              {/* Search and Filters */}
              <div className={`flex flex-col sm:flex-row gap-4 ${isSidebarOpen ? 'mr-4' : ''}`}>
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-[#004CB0] rounded-full text-gray-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-64"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0]" />
                </div>

                {/* Purpose Filter */}
                <div className="relative">
                  <select
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="semua">Purpose</option>
                    <option value="praktikum">Partial Class</option>
                    <option value="projek">Project</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
                </div>

                {/* Room Filter */}
                <div className="relative">
                  <select
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="appearance-none px-4 py-2 pr-10 border-2 border-[#004CB0] rounded-full text-gray-500 font-medium bg-white cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#004CB0] w-full sm:w-auto"
                  >
                    <option value="semua">All Rooms</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id.toString()}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#004CB0] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Items Grid */}
            {isLoading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
                {filteredAndSearchedItems.map((item) => (
                <div
                  key={`${item.id}-${item.serialNumber}`}
                  onClick={() => handleEditClick(item.id)}
                  className="bg-white rounded-3xl shadow-md p-6 hover:shadow-lg transition-shadow items-center cursor-pointer h-85 w-55"
                >
                  {/* Item Image */}
                  <div className="flex items-center justify-center mb-4 h-40 w-full rounded-lg p-2">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
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
            )}

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
