"use client";


import {
  Home,
  Package,
  History,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface SidebarAdminProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function SidebarAdmin({
  isOpen,
  toggleSidebar,
  user = { name: "Muhammad", role: "Admin" },
}: SidebarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin",
    },
    {
      id: "all-items",
      label: "All Items",
      icon: Package,
      path: "/admin/items",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      path: "/admin/history",
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full text-white transition-all duration-300 ease-in-out z-50 ${
          isOpen ? "w-50" : "w-20"
        }`}
        style={{
          backgroundImage: "url('/images/sideBarAdmin.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Header with Logo */}
          <div className="relative py-6 border-b border-white/20">
            {isOpen ? (
              <div className="flex items-center pl-6">
                <Image
                  src="/icons/logoFooter.svg"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <Image
                  src="/icons/logoFooter.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            )}

            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-8 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4 text-[#004CB0]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#004CB0]" />
              )}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center py-3 transition-colors relative ${
                        isActive ? "bg-white/20" : "hover:bg-white/10"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-white"></div>
                      )}
                      <div
                        className={`flex items-center gap-4 ${
                          isActive ? "pl-[20px]" : "pl-6"
                        }`}
                      >
                        <Icon className="w-6 h-6 flex-shrink-0" />
                        {isOpen && (
                          <span className="font-medium text-base">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile at Bottom */}
          <div className="px-6 py-6 border-t border-white/20">
            {isOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-[#004CB0]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-blue-200 truncate">{user.role}</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-[#004CB0]" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
