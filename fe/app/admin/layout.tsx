import { Providers } from "@/features/providers";
import { AdminSidebarProvider } from "@/contexts/AdminSidebarContext";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  if(!session){
    redirect('/login')
  }
  if(session.user.role !== 'Admin'){
    redirect('/home')
  }
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
