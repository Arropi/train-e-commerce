import { Providers } from "@/features/providers";
import { AdminSidebarProvider } from "@/contexts/AdminSidebarContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AdminSidebarProvider>
        <div className="min-h-screen bg-gray-50">
          {/* Hanya render children tanpa Navbar, Footer, atau Sidebar User */}
          {children}
        </div>
      </AdminSidebarProvider>
    </Providers>
  );
}
