"use client";

import { getDataRooms } from "@/data/rooms";
import { getDataTimeSession } from "@/data/timeSession";
import { Inventory, InventoryCart, Rooms, TimeSession } from "@/types";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SideBarItem {
  id: number;
  item_name?: string;
  no_item?: string;
  img_url?: string | null;
  // gatau lainnya apa
  selectedRoom?: number | null;
  selectedRoomName?: string | null;
  selectedTime?: number | null;
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  rooms: Rooms[]
  timeSessions: TimeSession[]
  items: InventoryCart[];
  selectedItem: any;
  session:Session | null
  openSidebar: (item?: any) => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSelectedItem: (item: any) => void;
  addItem: (inventory_id: number, session_id: number, tanggal: Date) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  refreshCart: () => Promise<void>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [items, setItems] = useState<InventoryCart[]>([]);
  const [rooms, setRooms] = useState<Rooms[]>([]);
  const [timeSessions, setTimeSessions] = useState<TimeSession[]>([]);
  useEffect(() => {
    if(!session) return;
    const fetchData = async () => {
      console.log(session)
      const rooms = await getDataRooms(session?.user.accessToken || "");
      const timeSessions = await getDataTimeSession(session?.user.accessToken || "");
      console.log("Fetched rooms:", rooms);
      console.log("Fetched timeSessions:", timeSessions);
      await loadCartItems();
      setTimeSessions(timeSessions);
      setRooms(rooms);
    };
    fetchData();
  }, [session])
  const loadCartItems = async () => {
    if (!session) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const result = await res.json();
        const data =  result.data as InventoryCart[];
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to load cart items", error);
    }
  }

  const openSidebar = (item?: any) => {
    if (item) setSelectedItem(item);
    setIsSidebarOpen(true);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addItem = async(inventory_id: number, session_id: number, tanggal: Date) => {
    console.log(JSON.stringify({ inventories: [{inventories_id: inventory_id, session_id: session_id, tanggal: tanggal}] }))
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user.accessToken}`,
      },
      body: JSON.stringify({ inventories: [{inventories_id: inventory_id, session_id: session_id, tanggal: tanggal}] }),
    }).then((data) => {
      console.log(data.json())
      if (!data.ok) {
        console.error('Failed to add item to cart')
      }
    });
    await loadCartItems();
    setIsSidebarOpen(true);
  };

  const removeItem = async (id: number) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session?.user.accessToken}`,
      },
    }).then((data) => {
      if (!data.ok) {
        console.error('Failed to remove item from cart')
      }
    });
    await loadCartItems();
  };

  const clear = () => {
    setItems([]);
  };

  const refreshCart = async () => {
    await loadCartItems();
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        items,
        rooms,
        session,
        timeSessions,
        selectedItem,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        setSelectedItem,
        addItem,
        removeItem,
        clear,
        refreshCart,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
