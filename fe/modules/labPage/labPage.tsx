"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ItemModal from "../../components/Modal/ItemModal";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import FilterBar from "../../components/FilterBar/FilterBar";
import { useSidebar } from "../../contexts/SidebarContext";
import { Inventory, Laboratory, Reserve, Rooms, Subject, TimeSession } from "@/types";
import { useSession } from "next-auth/react";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import Pagination from "@/components/Pagination/Pagination";

interface LabPageProps {
  slug: string;
  inventories: Inventory[];
  laboratories: Laboratory[];
  subjects: Subject[];
  rooms: Rooms[];
  timeSessions: TimeSession[];
  reserves: Reserve[]
}

export default function LabPage({ slug, inventories, laboratories, subjects, rooms, timeSessions, reserves }: LabPageProps) {
  const {data: session, status} = useSession()
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservesItem, setReservesItem] = useState<Reserve[] | null>(reserves);
  const [filteredInventories, setFilteredInventories] = useState<Inventory[]>(inventories);
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { openSidebar, isSidebarOpen } = useSidebar();
  const handleOpenSidebar = () => {
    openSidebar(null);
  };
  console.log("Tanggal terpili: ", date)
  useEffect(() => {
    setIsLoading(true);
    const res = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories/${slug}?tanggal=${date}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      cache: "no-store",
    });
    res.then(async(response) => {
      if (response.ok) {
        const result = await response.json();
        setFilteredInventories(result.inventories);
      }
    }).finally(() => {
      setIsLoading(false);
    });

    const fetchReserves = async() => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/${slug}?tanggal=${date}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const result = await res.json();
        console.log(result)
        setReservesItem(result.data);
      }
    };
    fetchReserves();
  }, [date])
  console.log(filteredInventories)
  console.log(reservesItem)

  const handleItemClick = (item: Inventory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    let filtered = inventories;

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(
        (item) =>{
          const room_name = rooms.find((room) => room.id === item.room_id);
          return room_name?.name.toLowerCase().charAt(0) === filters.location.toLowerCase().charAt(0)
        }
      );
    }

    // Filter by lab
    

    // Filter by date (jika ada field date di inventory)
    if (filters.date) {
      setDate(filters.date);
    }

    // Filter by search term
    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.item_name
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          item.no_item?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredInventories(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Function untuk determine availability
  const getAvailabilityStatus = (item: Inventory) => {
    const isAvailable = item.status === "Available";

    return {
      text: isAvailable ? "Available" : "Not Available",
      bgColor: isAvailable ? "bg-[#A0FFFD]" : "bg-[#FFBA5A]",
      textColor: isAvailable ? "text-[#007F7C]" : "text-[#F73939]",
    };
  };

  // nampilin satu barang nya
  const getUniqueItems = (items: Inventory[]) => {
    const result: Inventory[] = []
    let uniqueMap = new Map<string, Inventory>();

    items.forEach((item) => {
      const itemName = item.item_name?.toLowerCase() || "";
      if(!result.includes(item)) {
        result.push(item)
      }
      // Hanya simpan item pertama dengan nama yang sama
      if (!uniqueMap.has(itemName)) {
        uniqueMap.set(itemName, item);
      } else {
        if (item.status === "Available") {
          const data = uniqueMap.get(itemName)
          if(data?.status !== "Available"){
            uniqueMap.set(itemName, item);
          }
        }
        
        const existingItem = uniqueMap.get(itemName)
      }
    });
    console.log("Unique Map: ", uniqueMap)
    return Array.from(uniqueMap.values());
  };

  // menghitung jumlah item berdasarkan nama
  const getItemCount = (itemName: string) => {
    return filteredInventories.filter(
      (inv) => inv.item_name?.toLowerCase() === itemName.toLowerCase()
    ).length;
  };

  const uniqueItems = getUniqueItems(filteredInventories);
  console.log(uniqueItems)

  const currentLab = laboratories.find((lab) => lab.id === Number(slug));

  // Pagination calculations
  const totalPages = Math.ceil(uniqueItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = uniqueItems.slice(indexOfFirstItem, indexOfLastItem);

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
        <div className="p-6 min-h-screen bg-gray-50">
          <h1 className="text-2xl font-bold text-[#004CB0] mb-6">
            Lab {currentLab?.title}
          </h1>

          {/* FilterBar Component */}
          <FilterBar onFilterChange={handleFilterChange} />

          {/* Grid Kartu */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
              {currentItems.map((item) => {
              const availability = getAvailabilityStatus(item);
              const itemCount = getItemCount(item.item_name || "");

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                  onClick={() => handleItemClick(item)}
                >
                  {/* Image Section - Square */}
                  <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={
                          item.inventory_galleries[0]?.filepath ? item.inventory_galleries[0].filepath : "/images/default_img_card.webp"
                        }
                        alt={item.item_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-md font-bold text-gray-800 mb-0 line-clamp-2 min-h-[1.2rem]">
                      {item.item_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {currentLab?.title || "No Lab"}
                    </p>

                    {/* Status Badge */}
                    <div className="mt-auto">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${availability.bgColor} ${availability.textColor}`}
                      >
                        {availability.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Pagination - Always show */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={uniqueItems.length}
            />
            </>
          )}

          {/* No results message */}
          {!isLoading && uniqueItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Tidak ada barang yang sesuai dengan filter
              </p>
            </div>
          )}
        </div>
      </div>

      <ItemModal
        tanggal={date}
        isOpen={isModalOpen}
        onClose={closeModal}
        item={selectedItem}
        allInventories={filteredInventories}
        rooms={rooms}
        reservesItem={reservesItem}
        timeSessions={timeSessions}
      />

      <FloatingButton
        onClick={handleOpenSidebar}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
}
