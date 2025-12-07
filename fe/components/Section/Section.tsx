import { ReactNode } from "react";
import Link from "next/link";

interface SectionProps {
  title: string;
  children: ReactNode;
  viewAllHref?: string;
}

export default function Section({
  title,
  children,
  viewAllHref,
}: SectionProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-gray-900">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="relative text-[#004CB0] hover:text-blue-900 font-medium no-underline bg-[linear-gradient(90deg,#004CB0,#004CB0)] bg-no-repeat bg-left-bottom bg-[length:0%_2px] hover:bg-[length:100%_2px] transition-all duration-200"
          >
            View All →
          </Link>
        )}
      </div>

      <div
        className="overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex gap-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
