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
          {children}
        </div>
      </AdminSidebarProvider>
    </Providers>
  );
}
