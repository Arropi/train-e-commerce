"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SideBarItem {
  id: number;
  item_name?: string;
  no_item?: string;
  img_url?: string | null;
  // gatau lainnya apa
  selectedRoom?: number | null;
  selectedRoomName?: string | null;
  selectedTime?: string | null;
}

interface SidebarContextType {
  isSidebarOpen: boolean;
  items: SideBarItem[];
  selectedItem: any;
  openSidebar: (item?: any) => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSelectedItem: (item: any) => void;
  addItem: (item: SideBarItem) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [items, setItems] = useState<SideBarItem[]>([]);

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

  const addItem = (item: SideBarItem) => {
    setItems((prev) => {
      // dedupe berdasarkan ide + room + time (dapat diubah sesuai kebutuhan)
      const exist = prev.find(
        (p) =>
          p.id === item.id &&
          p.selectedRoom === item.selectedRoom &&
          p.selectedTime === item.selectedTime
      );
      if (exist) return prev;
      return [...prev, item];
    });
    setIsSidebarOpen(true);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clear = () => {
    setItems([]);
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        items,
        selectedItem,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        setSelectedItem,
        addItem,
        removeItem,
        clear,
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
