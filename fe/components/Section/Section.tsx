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
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
