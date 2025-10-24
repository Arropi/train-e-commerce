"use client";

import { Providers } from "@/features/providers";
import "./globals.css";
import FooterComponent from "../components/Footer/footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Tambahkan path yang sesuai dengan halaman login Anda
  const noFooterPages = [
    "/",
    "/login",
    "/register",
    "/auth/signin",
    "/auth/signup",
    "/auth/login",
  ];

  const shouldShowFooter = !noFooterPages.includes(pathname);

  // Debug console
  console.log("Current pathname:", pathname);
  console.log("Should show footer:", shouldShowFooter);

  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
        {shouldShowFooter && <FooterComponent />}
      </body>
    </html>
  );
}
