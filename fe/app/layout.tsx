"use client";

import { Providers } from "@/features/providers";
import "./globals.css";
import FooterComponent from "../components/Footer/footer";
import Sidebar from "@/modules/SideBar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const normalizedPath = pathname.toLowerCase();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // ✅ Halaman tanpa footer (termasuk semua route admin)
  const noFooterPages = [
    "/",
    "/login",
    "/register",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
  ];

  // ✅ Check jika route adalah admin route
  const isAdminRoute = normalizedPath.startsWith("/admin");

  // ✅ Halaman dengan Sidebar User (bukan Sidebar Admin!)
  const sidebarPages = ["/home", "/lab", "/viewall"];

  const shouldShowFooter = !noFooterPages.includes(pathname) && !isAdminRoute; // ✅ Tidak tampil footer di semua route admin

  const shouldShowSidebar =
    sidebarPages.some((page) => normalizedPath.startsWith(page)) &&
    !isAdminRoute; // ✅ Tidak tampil sidebar user di route admin

  return (
    <>
      <div>
        {children}
        {shouldShowFooter && <FooterComponent />}
      </div>

      {/* Sidebar User - hanya tampil di /home, /lab, /viewall (bukan di admin) */}
      {shouldShowSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <Providers>
          <SidebarProvider>
            <LayoutContent>{children}</LayoutContent>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
