import { Reserve } from "@/types";

interface ItemCardProps {
  item: Reserve;
  onClick: (item: Reserve) => void;
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
  const switchStatus = (status: string) => {
    switch (status) {
      case "approve":
        return "Approve";
      case "done":
        return "Done";
      case "rejected":
        return "Rejected";
      case "process":
        return "Process";
      case "waiting_to_be_return":
        return "Waiting to be Return";
      case "canceled":
        return "Canceled";
      default:
        return status;
    }
  };

  return (
    <div
      className="bg-white px-4 py-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
      style={{ height: "260px", minWidth: width }}
      onClick={() => onClick(item)}
    >
      {/* ✅ Update image section */}
      <div className="w-full h-20 bg-gray-300 rounded-lg mb-4 flex-shrink-0 overflow-hidden">
        {item.inventories.inventory_galleries[0].filepath ? (
          <img
            src={item.inventories.inventory_galleries[0].filepath}
            alt={item.inventories.item_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 rounded-lg"></div>
        )}
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-2 line-clamp-2 flex-grow">
        {item.inventories.item_name}
      </h3>
      <span
        className={`text-xs px-3 py-1.5 rounded-full ${
          statusColors[item.status] || "bg-gray-100 text-gray-800"
        } inline-block w-fit`}
      >
        {switchStatus(item.status)}
      </span>
    </div>
  );
}
