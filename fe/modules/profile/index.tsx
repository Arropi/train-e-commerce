"use client"

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  // nyesuaiin data profil nya
  const profileData = {
    name: session?.user?.name || "Gatau siapa",
    nim: "24/536179/SV/24400",
    email: session?.user?.email || "afjnaskjfn@gmail.com",
    prodi: "Teknologi Rekayasa Ancaman",
  };
 
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Profile Header */}
      <div className="flex items-center mt-10 ml-10 gap-3">
        <svg
          className="w-8 h-8 text-[#004CB0]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
        <h2 className="text-2xl font-semibold text-[#004CB0]">Profile</h2>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl font-medium text-gray-500">
                  {profileData.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleEdit}
            className="mt-4 flex items-center text-[#004CB0] hover:text-blue-700"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-md p-8 mt-6">
          <h3 className="text-xl font-semibold text-[#004CB0] mb-6">
            Informasi Detail
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div>
              <p className="text-gray-500 text-sm mb-1">Nama Lengkap</p>
              <p className="text-gray-800 font-medium">{profileData.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">NIM</p>
              <p className="text-gray-800 font-medium">{profileData.nim}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Email</p>
              <p className="text-gray-800 font-medium">{profileData.email}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm mb-1">Prodi</p>
              <p className="text-gray-800 font-medium">{profileData.prodi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}