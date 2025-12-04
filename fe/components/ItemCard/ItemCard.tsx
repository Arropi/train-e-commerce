import { Reserve } from "@/types";

interface ItemCardProps {
  item: Reserve;
  onClick: (item: Reserve) => void;
  width?: string;
  variant?: "grid" | "horizontal";
}

export default function ItemCard({
  item,
  onClick,
  width = "220px",
  variant = "horizontal",
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

  const isGrid = variant === "grid";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col overflow-hidden ${
        isGrid ? "w-full" : "flex-shrink-0"
      }`}
      style={isGrid ? {} : { width }}
      onClick={() => onClick(item)}
    >
      {/* Image Section */}
      <div
        className={`relative w-full bg-gray-50 flex items-center justify-center ${
          isGrid ? "aspect-square p-4" : "h-48 p-3"
        }`}
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {item.inventories.inventory_galleries?.[0]?.filepath ? (
            <img
              src={item.inventories.inventory_galleries[0].filepath}
              alt={item.inventories.item_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-xl"></div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className={`font-bold text-gray-800 mb-2 line-clamp-2 ${
            isGrid ? "text-md min-h-[1.2rem] mb-0" : "text-sm min-h-[2.5rem]"
          }`}
        >
          {item.inventories.item_name}
        </h3>
        {isGrid && <p className="text-sm text-gray-500 mb-6"></p>}

        {/* Status Badge */}
        <div className={isGrid ? "mt-auto" : ""}>
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
              statusColors[item.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {switchStatus(item.status)}
          </span>
        </div>
      </div>
    </div>
  );
}
