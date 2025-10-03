interface ItemCardProps {
  title: string;
  status: string;
  type: 'done' | 'approve' | 'reject' | 'process' | 'waiting';
}

export default function ItemCard({ title, status, type }: ItemCardProps) {
  const statusColors = {
    approve: "text-[#1F8E00] bg-[#B2FD9E]",
    done: "text-[#004CB0] bg-[#76B1FF]",
    reject: "text-[#C70000] bg-[#FE9696]",
    process: "text-[#817D24] bg-[#FFF876]",
    waiting: "text-[#5D00AE] bg-[#C17CFE]"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer h-65 min-w-45 flex-shrink-0">
      <div className="w-full h-20 bg-gray-300 rounded-lg mb-4"></div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[type]}`}>
        {status}
      </span>
    </div>
  );
}