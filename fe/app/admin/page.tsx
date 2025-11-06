"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HeroAdmin from "../../modules/homeAdmin/heroAdmin";
import SidebarAdmin from "../../modules/sideBarAdmin/sideBarAdmin";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    <>
      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image,
        }}
      />

      {/* Main Content - with margin to account for sidebar */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <HeroAdmin />
      </div>
    </>
  );
}
