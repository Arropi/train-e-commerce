"use client";

import { Home, Package, History, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

interface SidebarAdminProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export default function SidebarAdmin({
  user = { name: "Muhammad", role: "Admin" },
}: SidebarAdminProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useAdminSidebar();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleProfileClick = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleLogout = () => signOut();

  const handleGoToProfile = () => router.push("/admin/profileAdmin");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        !(event.target as Element).closest(".profile-menu")
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        !(event.target as Element).closest(".profile-menu")
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileMenuOpen]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin",
      isActive: (path: string) => path === "/admin",
    },
    {
      id: "all-items",
      label: "All Items",
      icon: Package,
      path: "/admin/allItems",
      isActive: (path: string) => path.startsWith("/admin/allItems"),
    },
    {
      id: "history",
      label: "History",
      icon: History,
      path: "/admin/historyItems",
      isActive: (path: string) => path.startsWith("/admin/historyItems"),
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
          isSidebarOpen ? "w-64 lg:w-64" : "w-64 lg:w-20"
        } ${
          isSidebarOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"
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
            {isSidebarOpen ? (
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
              className="absolute -right-12 top-4 w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                width="54"
                height="52"
                viewBox="0 0 54 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-13 h-13"
              >
                <path
                  d="M0 0H34C45.0457 0 54 8.95431 54 20V32C54 43.0457 45.0457 52 34 52H0V0Z"
                  fill="#004CB0"
                />
                <g clipPath="url(#clip0_1330_1689)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M27.7003 18.1526C27.467 18.1463 27.2336 18.143 27.0003 18.1426C25.5074 18.1426 24.0346 18.2769 22.5674 18.4398C21.7649 18.533 21.0175 18.895 20.4469 19.4669C19.8762 20.0389 19.5159 20.7871 19.4246 21.5898C19.2689 23.0469 19.1431 24.5141 19.1431 25.9998C19.1431 27.4855 19.2689 28.9526 19.4246 30.4098C19.5159 31.2125 19.8762 31.9607 20.4469 32.5327C21.0175 33.1046 21.7649 33.4666 22.5674 33.5598C24.0346 33.7226 25.5074 33.8569 27.0003 33.8569C27.2346 33.8569 27.4679 33.8536 27.7003 33.8469V18.1526ZM27.0003 16.3569C28.5931 16.3569 30.146 16.4998 31.6288 16.6641C32.836 16.8019 33.9607 17.3455 34.8187 18.2058C35.6767 19.0661 36.2172 20.1922 36.3517 21.3998C36.5089 22.8755 36.6431 24.4184 36.6431 25.9998C36.6431 27.5812 36.5089 29.1241 36.3517 30.5998C36.2169 31.8069 35.6765 32.9325 34.8188 33.7925C33.9611 34.6525 32.837 35.196 31.6303 35.3341C30.146 35.4998 28.5931 35.6426 27.0003 35.6426C25.4074 35.6426 23.8546 35.4998 22.3717 35.3355C21.1643 35.1976 20.0395 34.6539 19.1815 33.7932C18.3234 32.9326 17.7831 31.8062 17.6489 30.5984C17.4917 29.1255 17.3574 27.5826 17.3574 25.9998C17.3574 24.4169 17.4917 22.8755 17.6489 21.3998C17.7833 20.1924 18.3236 19.0665 19.1813 18.2062C20.039 17.3459 21.1633 16.8022 22.3703 16.6641C23.8546 16.4998 25.4074 16.3569 27.0003 16.3569ZM30.5003 21.0855H33.0717C33.2611 21.0855 33.4428 21.1608 33.5768 21.2947C33.7107 21.4287 33.786 21.6104 33.786 21.7998C33.786 21.9892 33.7107 22.1709 33.5768 22.3049C33.4428 22.4388 33.2611 22.5141 33.0717 22.5141H30.5003C30.3108 22.5141 30.1292 22.4388 29.9952 22.3049C29.8612 22.1709 29.786 21.9892 29.786 21.7998C29.786 21.6104 29.8612 21.4287 29.9952 21.2947C30.1292 21.1608 30.3108 21.0855 30.5003 21.0855ZM33.0717 24.5855H30.5003C30.3108 24.5855 30.1292 24.6608 29.9952 24.7947C29.8612 24.9287 29.786 25.1104 29.786 25.2998C29.786 25.4892 29.8612 25.6709 29.9952 25.8049C30.1292 25.9388 30.3108 26.0141 30.5003 26.0141H33.0717C33.2611 26.0141 33.4428 25.9388 33.5768 25.8049C33.7107 25.6709 33.786 25.4892 33.786 25.2998C33.786 25.1104 33.7107 24.9287 33.5768 24.7947C33.4428 24.6608 33.2611 24.5855 33.0717 24.5855Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1330_1689">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(17 16)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.isActive(pathname);

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
                        {isSidebarOpen && (
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
          <div className="px-6 py-6 border-t border-white/20 relative">
            {isSidebarOpen ? (
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
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
              <div
                className="flex justify-center cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-[#004CB0]" />
                  )}
                </div>
              </div>
            )}

            {/* Profile Menu Dropdown */}
            {isProfileMenuOpen && (
              <div className="profile-menu absolute bottom-full left-6 mb-2 bg-white rounded-lg shadow-lg py-2 w-48 z-50">
                <button
                  onClick={handleGoToProfile}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700"
                >
                  <svg
                    className="w-5 h-5 text-[#004CB0]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
