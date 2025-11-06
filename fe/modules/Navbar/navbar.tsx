"use client";

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const getUserRole = () => {
    // Ngambil role
    if (session?.user?.role) {
      return session.user.role;
    }

    // kalo gada role
    return "Pengguna";
  };

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-12">
        <Link href="/home" className="flex items-center">
          <img src="/icons/logoLabTedi.svg" alt="logo lab" className="h-5" />
        </Link>

        <ul className="hidden md:flex space-x-10">
          <li>
            <Link
              href="/home"
              className="text-gray-700 hover:text-[#004CB0] font-medium text-base"
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right mr-2">
          <h3 className="font-medium text-gray-700">
            {session?.user?.name || "Nama Pengguna"}
          </h3>

          <p className="text-sm text-gray-500">{getUserRole()}</p>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="h-10 w-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#004CB0] transition-colors focus:outline-none focus:border-[#004CB0]"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile picture"
                width={40}
                height={40}
                className="object-cover"
                unoptimized // Mengatasi error domains
              />
            ) : (
              // Fallback image jika tidak ada profile picture
              <img
                src="/icons/profile.svg"
                alt="Default profile"
                className="h-full w-full object-cover"
              />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={handleClickOutside}
              ></div>

              {/* Dropdown Content */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
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
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-[#004CB0]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
