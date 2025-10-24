"use client";

import { Providers } from "@/features/providers";
import "./globals.css";
import FooterComponent from "../components/Footer/footer";
import Sidebar from "@/modules/SideBar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const noFooterPages = [
    "/",
    "/login",
    "/register",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
  ];

  const sidebarPages = ["/dashboard", "/lab", "/viewall", "/home"];

  const shouldShowFooter = !noFooterPages.includes(pathname);
  const shouldShowSidebar = sidebarPages.some((page) =>
    pathname.startsWith(page)
  );

  return (
    <>
      <div>
        {children}
        {shouldShowFooter && <FooterComponent />}
      </div>

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
    <html lang="id">
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
