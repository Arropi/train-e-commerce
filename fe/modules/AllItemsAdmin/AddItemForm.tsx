"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "../../contexts/AdminSidebarContext";
import { useUploadThing } from "@/lib/uploadthing";

interface AddItemFormProps {
  session: Session;
}

export default function AddItemForm({ session }: AddItemFormProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const { data: sessionData } = useSession();
  const [ error, setError] = useState<string | null>(null);
  const [labs, setLabs] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
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
  const [files, setFiles] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string>("");
  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError(e) {
      console.error("Upload error:", e);
      setError(e.message)
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
      const accessToken = sessionData?.user?.accessToken || session?.user?.accessToken;

      if (!accessToken) return;

      try {
        const [labsRes, roomsRes, subjectsRes] = await Promise.all([
          fetch(`${backendUrl}/laboratories`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`${backendUrl}/rooms`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
          fetch(`${backendUrl}/subjects`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
          }),
        ]);

        if (labsRes.ok) {
          const labsData = await labsRes.json();
          setLabs(labsData.data || labsData.laboratories || []);
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.data || []);
        }

        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          setSubjects(subjectsData.data.map((item: { id: number; subject_name: string }) => ({ id: item.id, name: item.subject_name })) || []);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchData();
  }, [sessionData, session]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      setFiles(file);
      console.log("Selected file:", file);
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subject: formData.subject.filter((s) => s !== subject),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = sessionData?.user?.accessToken || session?.user?.accessToken;
    if (!accessToken) {
      alert("No access token available");
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

    // Map form data to API format
    const createData: {
      item_name: string;
      no_inventory: string;
      room_id: number;
      laboratory_id: number;
      type: string;
      condition: string;
      special_session: boolean;
      subjects: number[];
      img_url?: string;
    } = {
      item_name: formData.name,
      no_inventory: formData.inventoryNumber,
      room_id: parseInt(formData.room),
      laboratory_id: parseInt(formData.laboratory),
      type: formData.purpose === "Practical Class" ? "praktikum" : "projek",
      condition: formData.condition.toLowerCase(),
      special_session: formData.session === "2 Session",
      subjects: formData.subject.map(name => subjects.find(s => s.name === name)?.id).filter(Boolean) as number[],
    };

    if (formData.image && files) {
      try {
        const uploadImage = await startUpload([files]);
        if (!uploadImage || !uploadImage[0] || !uploadImage[0].ufsUrl) {
          setError("Image upload failed");
          return;
        }
        createData.img_url = uploadImage[0].ufsUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to process image");
        return;
      }
    }

    try {
      const response = await fetch(`${backendUrl}/inventories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        alert("Item added successfully!");
        router.push("/admin/allItems?success=true");
      } else {
        const errorData = await response.json();
        alert(`Failed to add item: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    }
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
      {error && (<div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
        {error}
      </div>
      )}
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
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id.toString()}>
                          {room.name}
                        </option>
                      ))}
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
                      {labs.map((lab) => (
                        <option key={lab.id} value={lab.id.toString()}>
                          {lab.name}
                        </option>
                      ))}
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
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
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
