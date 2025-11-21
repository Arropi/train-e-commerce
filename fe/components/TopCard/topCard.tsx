import Link from "next/link";

interface TopCardProps {
  id: number;
  title: string;
  iconPath: string;
  isActive: boolean;
  onHover: (id: number) => void;
  labPath?: string; 
}

export default function TopCard({
  id,
  title,
  iconPath,
  isActive,
  onHover,
  labPath = "/dashboard", 
}: TopCardProps) {
  // Split title menjadi "Laboratorium" dan nama lab
  const formatTitle = (text: string) => {
    const parts = text.split(" ");
    if (parts.length >= 2 && parts[0] === "Laboratorium") {
      return (
        <>
          {parts[0]}
          <br />
          {parts.slice(1).join(" ")}
        </>
      );
    }
    return text;
  };

  return (
    <Link
      href={labPath}
      className={`bg-white rounded-xl shadow-md cursor-pointer transition-all duration-400 ease-in-out
        flex-1 block
        ${
          isActive
            ? "flex-[2.5] bg-blue-50 border-4 border-[#004CB0] shadow-lg"
            : "flex-[0.3] border border-transparent hover:shadow-lg"
        }
      `}
      onMouseEnter={() => onHover(id)}
    >
      <div
        className={`p-6 h-full flex flex-col justify-center items-center transition-all duration-400 ${
          isActive ? "gap-2" : "gap-0"
        }`}
      >
        <div
          className={`flex items-center justify-center transition-all duration-500
          ease-in-out
          ${
            isActive
              ? "w-16 h-16 opacity-100 scale-100"
              : "w-0 h-0 opacity-0 overflow-hidden scale-0"
          }`}
        >
          {/* buat icon */}
          <img src={iconPath} alt={title} className="w-12 h-12" />
        </div>

        {/* Text Content */}
        <h3
          className={`
          text-lg font-semibold text-center
          transition-all duration-500
          whitespace-nowrap
          ${isActive ? "text-[#004CB0] rotate-0" : "text-gray-700 rotate-90"}`}
        >
          Laboratorium <br />{title}
        </h3>
      </div>
    </Link>
  );
}