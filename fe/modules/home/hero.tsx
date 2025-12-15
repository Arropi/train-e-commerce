"use client";

import { useState } from "react";
import { Session } from "next-auth";
import TopCard from "@/components/TopCard/topCard";
import ItemCard from "@/components/ItemCard/ItemCard";
import Section from "../../components/Section/Section";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";
import ModalViewAll from "@/components/Modal/ModalViewAll";
import { Laboratory, Reserve, Subject } from "@/types";

export default function Hero({ session, laboratories, onGoing, history, subjects }: { session: Session, laboratories: Laboratory[], onGoing: Reserve[], history: Reserve[], subjects: Subject[] }) {
  const [activeCard, setActiveCard] = useState(1);
  const { openSidebar, isSidebarOpen } = useSidebar();

  const [selectedItem, setSelectedItem] = useState<Reserve | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);




  const handleCardHover = (cardId: number) => {
    setActiveCard(cardId);
  };

  // ✅ Update handleItemClick untuk buka modal
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // ✅ Handler untuk tutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenSidebar = () => {
    openSidebar(null);
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ease-in-out relative ${
          isSidebarOpen ? "mr-96" : "mr-0"
        }`}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Top Cards Section */}
            <div className="flex gap-4 mb-8 h-64">
              {laboratories.map((card) => (
                <TopCard
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  iconPath={card.iconPath}
                  labPath={`/lab/${card.id}`}
                  isActive={activeCard === card.id}
                  onHover={handleCardHover}
                />
              ))}
            </div>

            {/* On Going Section */}
            <Section title="On Going" viewAllHref="/viewall/ongoing">
              {onGoing.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </Section>

            {/* History Section */}
            <Section title="History" viewAllHref="/viewall/history">
              {history.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </Section>
          </div>
        </div>
      </div>

      <FloatingButton
        onClick={handleOpenSidebar}
        itemCount={0}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ✅ Modal ViewAll */}
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
