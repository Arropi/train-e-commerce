"use client";

import { useState } from "react";
import { Session } from "next-auth";
import TopCard from "@/components/TopCard/topCard";
import ItemCard from "@/components/ItemCard/ItemCard";
import Section from "../../components/Section/Section";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Hero({ session }: { session: Session }) {
  const [activeCard, setActiveCard] = useState(0);
  const { openSidebar, isSidebarOpen } = useSidebar();

  const topCards = [
    {
      id: 0,
      title: "Laboratorium Elektronika",
      iconPath: "/icons/logo elektronika.svg",
      labPath: "/lab/1",
    },
    {
      id: 1,
      title: "Laboratorium IDK",
      iconPath: "/icons/lab_idk.svg",
      labPath: "/lab/2",
    },
    {
      id: 2,
      title: "Laboratorium TAJ",
      iconPath: "/icons/lab_taj.svg",
      labPath: "/lab/3",
    },
    {
      id: 3,
      title: "Laboratorium RPL",
      iconPath: "/icons/lab_rpl.svg",
      labPath: "/lab/4",
    },
    {
      id: 4,
      title: "Laboratorium TL",
      iconPath: "/icons/lab_tl.svg",
      labPath: "/lab/5",
    },
  ];

  const ongoingItems = [
    { id: 1, title: "Barang 1", status: "Approved", type: "approve" },
    { id: 2, title: "Barang 2", status: "Rejected", type: "reject" },
    { id: 3, title: "Barang 3", status: "Process", type: "process" },
    { id: 4, title: "Barang 4", status: "Waiting to be Return", type: "waiting" },
    { id: 5, title: "Barang 5", status: "Approved", type: "approve" },
    { id: 6, title: "Barang 6", status: "Rejected", type: "reject" },
    { id: 7, title: "Barang 7", status: "Waiting to be Return", type: "waiting" },
  ];

  const doneItems = [
    { id: 1, title: "Barang 1", status: "Done", type: "done" },
    { id: 2, title: "Barang 2", status: "Done", type: "done" },
    { id: 3, title: "Barang 3", status: "Done", type: "done" },
    { id: 4, title: "Barang 4", status: "Done", type: "done" },
    { id: 5, title: "Barang 5", status: "Done", type: "done" },
    { id: 6, title: "Barang 6", status: "Done", type: "done" },
    { id: 7, title: "Barang 7", status: "Done", type: "done" },
  ];

  const handleCardHover = (cardId: number) => {
    setActiveCard(cardId);
  };

  const handleViewAllOngoing = () => {
    console.log("View all ongoing items");
  };

  const handleViewAllDone = () => {
    console.log("View all done items");
  };

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  return (
    <>
      {/* Wrapper yang bergeser saat sidebar terbuka */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Cards Section */}
            <div className="flex gap-4 mb-8 h-64">
              {topCards.map((card) => (
                <TopCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  iconPath={card.iconPath}
                  labPath={card.labPath}
                  isActive={activeCard === card.id}
                  onHover={handleCardHover}
                />
              ))}
            </div>

            {/* On Going Section */}
            <Section title="On Going" onViewAll={handleViewAllOngoing}>
              {ongoingItems.map((item) => (
                <div key={item.id}>
                  <ItemCard
                    title={item.title}
                    status={item.status}
                    type={item.type as "done" | "approve" | "reject" | "process" | "waiting"}
                  />
                </div>
              ))}
            </Section>

            {/* Done Section */}
            <Section title="History" onViewAll={handleViewAllDone}>
              {doneItems.map((item) => (
                <div key={item.id}>
                  <ItemCard title={item.title} status={item.status} type="done" />
                </div>
              ))}
            </Section>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <FloatingButton
        onClick={handleOpenSidebar}
        itemCount={0}
        isSidebarOpen={isSidebarOpen}
      />
    </>
  );
}
