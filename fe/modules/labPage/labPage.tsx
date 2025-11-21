"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import ItemModal from "../../components/Modal/ItemModal";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import FilterBar from "../../components/FilterBar/FilterBar";
import { useSidebar } from "../../contexts/SidebarContext";
import { Inventory, Laboratory, Reserve, Rooms, Subject, TimeSession } from "@/types";
import { useSession } from "next-auth/react";

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
  const { openSidebar, isSidebarOpen } = useSidebar();
  const handleOpenSidebar = () => {
    openSidebar(null);
  };
  console.log("Tanggal terpili: ", date)
  useEffect(() => {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {(uniqueItems ?? []).map((item) => {
              const availability = getAvailabilityStatus(item);
              const itemCount = getItemCount(item.item_name || "");

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="p-4">
                    <div className="flex justify-center items-center mb-3">
                      <div className="w-full h-24 flex items-center justify-center">
                        <Image
                          src={
                            item.inventory_galleries[0]?.filepath ? item.inventory_galleries[0].filepath : "/icons/osiloskop.png"
                          }
                          alt={item.item_name}
                          width={90}
                          height={90}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 mb-1">
                      {item.item_name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                        {currentLab?.title || "No Lab"}
                    </p>

                    {/* ✅ Tampilkan Available/Not Available */}
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${availability.bgColor} ${availability.textColor}`}
                      >
                        {availability.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No results message */}
          {uniqueItems.length === 0 && (
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
