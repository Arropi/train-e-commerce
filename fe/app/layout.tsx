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

  // ✅ Halaman tanpa footer
  const noFooterPages = [
    "/",
    "/login",
    "/register",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
    "/admin",
  ];

  // ✅ Halaman dengan Sidebar User (bukan Sidebar Admin!)
  const sidebarPages = ["/home", "/lab", "/viewall"];

  const shouldShowFooter = !noFooterPages.includes(pathname);
  const shouldShowSidebar = sidebarPages.some((page) =>
    normalizedPath.startsWith(page)
  );

  return (
    <>
      <div>
        {children}
        {shouldShowFooter && <FooterComponent />}
      </div>

      {/* Sidebar User - hanya tampil di /home, /lab, /viewall */}
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
