"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroAdmin from "../../modules/homeAdmin/heroAdmin";
import SidebarAdmin from "../../modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();

  // Redirect jika belum login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Jika belum login, return null (sedang redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image || undefined,
        }}
      />

      {/* Main Content - responsive dengan margin berdasarkan sidebar state */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-74" : "lg:ml-16"
        }`}
      >
        <HeroAdmin orders={[]} borrowedItems={[]} />
      </div>
    </div>
  );
}
