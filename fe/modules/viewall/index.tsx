"use client";

import { useState, useMemo, useEffect } from "react";
import ItemCard from "@/components/ItemCard/ItemCard";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";
import ModalViewAll from "@/components/Modal/ModalViewAll";
import { Reserve, Rooms, Subject } from "@/types";
import Pagination from "@/components/Pagination/Pagination";
import { CalendarIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Image from "next/image";

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
  rooms: Rooms[]
}

export default function ViewAllPage({ slug, inventories, subjects, rooms }: ViewAllPageProps) {
  const { openSidebar, isSidebarOpen } = useSidebar();
  const [selectedItem, setSelectedItem] = useState<Reserve | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { data: session } = useSession();
  
  // Filter states
  const [selectedLocation, setSelectedLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [laboratoriesData, setLaboratoriesData] = useState<{ [key: number]: string }>({});

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    const locationValue = value === "all" ? "" : value;
    setSelectedLocation(locationValue);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Fetch laboratories data
  useEffect(() => {
    const fetchLaboratories = async () => {
      if (!session?.user?.accessToken) return;
      
      try {
        const response = await fetch(`${
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
        }/laboratories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const labsMap: { [key: number]: string } = {};
          data.data.forEach((lab: any) => {
            labsMap[lab.id] = lab.name;
          });
          setLaboratoriesData(labsMap);
        }
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      }
    };

    fetchLaboratories();
  }, [session?.user?.accessToken]);

  // Hardcoded locations sama seperti FilterBar
  const locations = ["Herman Yohanes", "Grafika"];

  // Filter inventories
  const filteredInventories = useMemo(() => {
    return inventories.filter((item) => {
      // Location filter - match dengan value "h" atau "g"
      let locationMatch = true;
      if (selectedLocation) {
        const itemLab = laboratoriesData[item.inventories?.labolatory_id || 0];
        if (selectedLocation === "h") {
          const room_name = rooms.find((room) => room.id === item.inventories.room_id)?.name || "";
          locationMatch = room_name.toLowerCase().charAt(0) === "h";
        } else if (selectedLocation === "g") {
          const room_name = rooms.find((room) => room.id === item.inventories.room_id)?.name || "";
          locationMatch = room_name.toLowerCase().charAt(0) === "g";
        }
      }

      // Date filter
      let dateMatch = true;
      if (date) {
        const itemDate = item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : "";
        const selectedDateStr = format(date, "yyyy-MM-dd");
        dateMatch = itemDate === selectedDateStr;
      }

      // Search filter
      const searchMatch =
        searchQuery === "" ||
        item.inventories?.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reserve_user_created?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reserve_user_created?.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reserve_user_created?.username?.toLowerCase().includes(searchQuery.toLowerCase());

      return locationMatch && dateMatch && searchMatch;
    });
  }, [inventories, selectedLocation, date, searchQuery, laboratoriesData]);

  // Pagination calculations with filtered data
  const totalPages = Math.ceil(filteredInventories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventories.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLocation, date, searchQuery]);

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="w-full">
            {/* Header with Title */}
            <h1 className="text-2xl font-bold text-[#004CB0] mb-6">
              {config.title}
            </h1>

            {/* Filters - Same style as FilterBar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Filter Group - Kiri */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                {/* Location Filter */}
                <Select 
                  onValueChange={handleLocationChange} 
                  value={selectedLocation || "all"}
                >
                  <SelectTrigger className="w-full sm:w-[180px] !h-10 border-[#1E40AF] border-2 text-gray-500 rounded-xl">
                    <SelectValue placeholder="Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="h">Herman Yohanes</SelectItem>
                    <SelectItem value="g">Grafika</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center justify-between w-full sm:w-[180px] border-2 border-[#1E40AF] rounded-xl px-3 text-gray-500 h-10 hover:bg-gray-50 transition-colors">
                      {date ? format(date, "dd/MM/yyyy") : "dd/mm/yyyy"}
                      <CalendarIcon className="ml-2 h-4 w-4 text-[#1E40AF]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search Bar - Kanan */}
              <div className="relative w-full lg:w-[320px]">
                <Image
                  src="/icons/searchLogo.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full border-[#1E40AF] border-2 text-black rounded-xl h-10 pl-10 pr-4"
                />
              </div>
            </div>

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {currentItems.length} of {filteredInventories.length} items
              {filteredInventories.length !== inventories.length && 
                ` (filtered from ${inventories.length} total)`
              }
            </div>

            {filteredInventories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {inventories.length === 0 
                    ? config.emptyMessage 
                    : "No items match your filters"
                  }
                </p>
                {(selectedLocation || date || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedLocation("");
                      setDate(undefined);
                      setSearchQuery("");
                    }}
                    className="mt-4 px-6 py-2 bg-[#004CB0] text-white rounded-full text-sm font-medium hover:bg-blue-900 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
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
                  totalItems={filteredInventories.length}
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
