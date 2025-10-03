"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();

  const getUserRole = () => {
    // Ngambil role
    if (session?.user?.role) {
      return session.user.role;
    }

    // kalo gada role
    return "Mahasiswa";
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
              href="/dashboard"
              className="text-gray-700 hover:text-[#004CB0] font-medium text-base"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#004CB0] font-medium text-base"
            >
              About
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
        <div className="h-10 w-10 rounded-full overflow-hidden">
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
        </div>
      </div>
    </nav>
  );
}
