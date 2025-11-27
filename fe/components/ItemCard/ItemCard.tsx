interface ItemCardProps {
  item: {
    id: number;
    title: string;
    status: string;
    type: "done" | "approve" | "rejected" | "process" | "waiting_to_be_return" | "canceled";
    image?: string; // ✅ Tambahkan image field
  };
  onClick: (item: ItemCardProps['item']) => void;
  width?: string;
}

export default function ItemCard({
  item,
  onClick,
  width = "180px",
}: ItemCardProps) {
  const statusColors: Record<string, string> = {
    approve: "text-[#1F8E00] bg-[#B2FD9E]",
    done: "text-[#004CB0] bg-[#76B1FF]",
    rejected: "text-[#C70000] bg-[#FE9696]",
    process: "text-[#817D24] bg-[#FFF876]",
    waiting_to_be_return: "text-[#5D00AE] bg-[#C17CFE]",
    canceled: "text-gray-600 bg-gray-300",
  };

  return (
    <div
      className="bg-white px-4 py-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
      style={{ height: "260px", minWidth: width }}
      onClick={() => onClick(item)}
    >
      {/* ✅ Update image section */}
      <div className="w-full h-20 bg-gray-300 rounded-lg mb-4 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-lg"></div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-2 line-clamp-2 flex-grow">
        {item.title}
      </h3>
      <span
        className={`text-xs px-3 py-1.5 rounded-full ${
          statusColors[item.type] || "bg-gray-100 text-gray-800"
        } inline-block w-fit`}
      >
        {item.status}
      </span>
    </div>
  );
}
