"use client";

import Image from "next/image";

interface FloatingButtonProps {
  onClick: () => void;
  itemCount?: number;
  isSidebarOpen?: boolean;
}

export default function FloatingButton({
  onClick,
  isSidebarOpen = false,
}: FloatingButtonProps) {
  if (isSidebarOpen) return null;

  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#1E40AF] text-white p-4 rounded-l-lg shadow-lg hover:bg-blue-900 transition-all z-20 flex flex-col items-center gap-2"
      aria-label="Open sidebar"
    >
      <Image 
      src="/icons/logoCartTutup.svg"
      alt="Cart Icon"
      width={25}
      height={25}
      className="object-contain"
      />
    </button>
  );
}
