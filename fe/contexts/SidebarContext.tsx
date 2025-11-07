"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  selectedItem: any;
  openSidebar: (item?: any) => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setSelectedItem: (item: any) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openSidebar = (item?: any) => {
    console.log("openSidebar called with:", item);
    if (item) setSelectedItem(item);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        selectedItem,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        setSelectedItem,
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
