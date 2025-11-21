"use client";

import { use, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";

interface AddItemFormProps {
  session: Session;
}

export default function AddItemForm({ session }: AddItemFormProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const [formData, setFormData] = useState({
    name: "",
    inventoryNumber: "",
    room: "",
    laboratory: "",
    subject: [] as string[],
    session: "2 Session",
    purpose: "Practical Class",
    condition: "Good",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  useEffect(()=> {
    const fetchData = async() => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const result = await res.json();
        console.log("Inventories Data: ", result)
      }
    }
    fetchData();
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subject: formData.subject.filter((s) => s !== subject),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Implement API call to add item
    console.log("Form data:", formData);

    // Simulate API call and redirect with success message
    setTimeout(() => {
      router.push("/admin/allItems?success=true");
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image?? undefined,
        }}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-96" : "ml-36"
        }`}
      >
        <div className="min-h-screen p-2 pt-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 mt-8 -ml-30">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="text-2xl font-bold text-[#004CB0] hover:text-blue-700 transition-colors"
                >
                  All Items
                </button>
                <span className="text-2xl text-gray-400">›</span>
                <h2 className="text-3xl font-bold text-[#004CB0]">Add</h2>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden relative">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-gray-300">
                        <Upload className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer text-[#004CB0] text-sm font-medium hover:underline flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Image
                      src="/icons/pensil.svg"
                      alt="Edit Icon"
                      width={20}
                      height={20}
                      className="text-[#004CB0]"
                    />
                    <span>Add</span>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Add item"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
                      required
                    />
                  </div>

                  {/* Inventory Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Inventory Number
                    </label>
                    <input
                      type="text"
                      placeholder="Add inventory number"
                      value={formData.inventoryNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inventoryNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
                      required
                    />
                  </div>

                  {/* Room */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Room
                    </label>
                    <select
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-white"
                      required
                    >
                      <option value="">Choose room</option>
                      <option value="R301">R301</option>
                      <option value="R302">R302</option>
                      <option value="R303">R303</option>
                    </select>
                  </div>

                  {/* Session */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Session
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, session: "2 Session" })
                        }
                        className={`flex-1 px-4 py-3 rounded-full font-medium transition-colors ${
                          formData.session === "2 Session"
                            ? "bg-[#BACEEA] text-[#004CB0]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        2 Session
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            session: "Session per Hour",
                          })
                        }
                        className={`flex-1 px-4 py-3 rounded-full font-medium transition-colors ${
                          formData.session === "Session per Hour"
                            ? "bg-[#BACEEA] text-[#004CB0]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Session per Hour
                      </button>
                    </div>
                  </div>

                  {/* Laboratory */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Laboratory
                    </label>
                    <select
                      value={formData.laboratory}
                      onChange={(e) =>
                        setFormData({ ...formData, laboratory: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-white"
                      required
                    >
                      <option value="">Choose lab</option>
                      <option value="idk">Lab IDK</option>
                      <option value="elektronika">Lab Elektronika</option>
                      <option value="rpl">Lab RPL</option>
                      <option value="taj">Lab TAJ</option>
                    </select>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            purpose: "Practical Class",
                          })
                        }
                        className={`flex-1 px-4 py-3 rounded-full font-medium transition-colors ${
                          formData.purpose === "Practical Class"
                            ? "bg-[#BACEEA] text-[#004CB0]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Practical Class
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, purpose: "Project" })
                        }
                        className={`flex-1 px-4 py-3 rounded-full font-medium transition-colors ${
                          formData.purpose === "Project"
                            ? "bg-[#BACEEA] text-[#004CB0]"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Project
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <select
                      value=""
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          !formData.subject.includes(e.target.value)
                        ) {
                          setFormData({
                            ...formData,
                            subject: [...formData.subject, e.target.value],
                          });
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-white"
                    >
                      <option value="">Add Subject</option>
                      <option value="Praktikum Pemrograman Komputer">
                        Praktikum Pemrograman Komputer
                      </option>
                      <option value="Praktikum Basis Data">
                        Praktikum Basis Data
                      </option>
                      <option value="Praktikum Jaringan Komputer">
                        Praktikum Jaringan Komputer
                      </option>
                      <option value="Praktikum Sistem Operasi">
                        Praktikum Sistem Operasi
                      </option>
                      <option value="Praktikum Web Programming">
                        Praktikum Web Programming
                      </option>
                      <option value="Praktikum Mobile Programming">
                        Praktikum Mobile Programming
                      </option>
                    </select>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.subject.map((subject) => (
                        <span
                          key={subject}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {subject}
                          <button
                            type="button"
                            onClick={() => removeSubject(subject)}
                            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition
                    </label>
                    <div className="flex gap-3">
                      {["Good", "Bad"].map((cond) => (
                        <button
                          key={cond}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, condition: cond })
                          }
                          className={`flex-1 px-6 py-3 rounded-full font-medium transition-colors ${
                            formData.condition === cond
                              ? "bg-[#BACEEA] text-[#004CB0]"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#004CB0] text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
