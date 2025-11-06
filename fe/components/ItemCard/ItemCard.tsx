interface ItemCardProps {
  item: {
    id: number;
    title: string;
    status: string;
    type: "done" | "approve" | "rejected" | "process" | "waiting_to_be_return" | "canceled";
  };
  onClick: (item: any) => void;
}

export default function ItemCard({ item, onClick }: ItemCardProps) {
  const statusColors = {
    approve: "text-[#1F8E00] bg-[#B2FD9E]",
    done: "text-[#004CB0] bg-[#76B1FF]",
    rejected: "text-[#C70000] bg-[#FE9696]", // ✅ Tambahkan key rejected
    process: "text-[#817D24] bg-[#FFF876]",
    waiting_to_be_return: "text-[#5D00AE] bg-[#C17CFE]", // ✅ Tambahkan key waiting_to_be_return
    canceled: "text-[#6B7280] bg-[#E5E7EB]",
  };

  return (
    <div
      className="bg-white px-4 py-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all  duration-200 cursor-pointer flex flex-col"
      style={{ height: "260px", minWidth: "180px" }}
      onClick={() => onClick(item)}
    >
      <div className="w-full h-20 bg-gray-300 rounded-lg mb-4 flex-shrink-0"></div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2 line-clamp-2 flex-grow">
        {item.title}
      </h3>
      <span
        className={`text-xs px-3 py-1.5 rounded-full ${
          statusColors[item.type]
        } inline-block w-fit`}
      >
        {item.status}
      </span>
    </div>
  );
}
