"use client";

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
      className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#1E40AF] text-white p-4 rounded-l-lg shadow-lg hover:bg-blue-700 transition-all z-20 flex flex-col items-center gap-2"
      aria-label="Open sidebar"
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    </button>
  );
}
