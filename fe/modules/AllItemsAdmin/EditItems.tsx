"use client";

import { useState, useEffect } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";
import { useUploadThing } from "@/lib/uploadthing";

interface EditItemsProps {
  session: Session;
  itemData: {
    id: number;
    name: string;
    inventoryNumber: string;
    room: string;
    laboratory: string;
    subject: string[];
    session: string;
    purpose: string;
    condition: string;
    image: string;
  };
}

interface UpdateData {
  item_name: string;
  no_inventory: string;
  room_id: number;
  laboratory_id: number;
  type: string;
  condition: string;
  special_session: boolean;
  subjects: number[];
  img_url?: string;
}

export default function EditItems({ session, itemData }: EditItemsProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const { data: sessionData } = useSession();
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [labs, setLabs] = useState<{ id: number; name: string }[]>([]);
  const [adminLabName, setAdminLabName] = useState<string>("");
  const [isOtherRoom, setIsOtherRoom] = useState(false);
  const [otherRoomName, setOtherRoomName] = useState("");
  const [isOtherSubject, setIsOtherSubject] = useState(false);
  const [otherSubjectInput, setOtherSubjectInput] = useState("");
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    const fetchData = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
      const accessToken = sessionData?.user?.accessToken || session?.user?.accessToken;

      if (!accessToken) return;

      try {
        // Fetch admin profile dulu
        const profileRes = await fetch(`${backendUrl}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const user = profileData.datas || profileData.data || profileData.user || profileData;
          console.log("Admin profile data:", user);
          setAdminLabName(user.lab_name);
        }

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
    
    // Set initial form data from itemData when component mounts
    setFormData({
      name: itemData.name,
      inventoryNumber: itemData.inventoryNumber,
      room: itemData.room,
      laboratory: itemData.laboratory,
      subject: itemData.subject || [],
      session: itemData.session,
      purpose: itemData.purpose,
      condition: itemData.condition,
      image: null,
    });
  }, [sessionData, session, itemData]);

  const [formData, setFormData] = useState({
    name: itemData.name,
    inventoryNumber: itemData.inventoryNumber,
    room: itemData.room,
    laboratory: itemData.laboratory,
    subject: itemData.subject || [],
    session: itemData.session,
    purpose: itemData.purpose,
    condition: itemData.condition,
    image: null as File | null,
  });

  const [files, setFiles] = useState<File | null>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError(e) {
      console.error("Upload error:", e);
      setNotification({
        show: true,
        type: "error",
        message: e.message,
      });
    },
  });

  const [imagePreview, setImagePreview] = useState<string>(itemData.image);

  // Debug logs
  console.log("ItemData received:", itemData);
  console.log("Form Data Laboratory:", formData.laboratory);
  console.log("Available Labs:", labs);

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

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subject: formData.subject.filter((s) => s !== subject),
    });
  };

  const handleRoomChange = (value: string) => {
    if (value === "lainnya") {
      setIsOtherRoom(true);
      setFormData({ ...formData, room: "" });
    } else {
      setIsOtherRoom(false);
      setOtherRoomName("");
      setFormData({ ...formData, room: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi field kosong
    if (!formData.name.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Item name is required",
      });
      return;
    }

    if (!formData.inventoryNumber.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Inventory number is required",
      });
      return;
    }

    if (!formData.room && !isOtherRoom) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select a room",
      });
      return;
    }

    if (isOtherRoom && !otherRoomName.trim()) {
      setNotification({
        show: true,
        type: "error",
        message: "Please enter room name",
      });
      return;
    }

    if (formData.subject.length === 0) {
      setNotification({
        show: true,
        type: "error",
        message: "Please select at least one subject",
      });
      return;
    }

    // Check if any field has changed
    const hasChanged =
      formData.name !== itemData.name ||
      formData.inventoryNumber !== itemData.inventoryNumber ||
      formData.room !== itemData.room ||
      formData.laboratory !== itemData.laboratory ||
      JSON.stringify(formData.subject.sort()) !== JSON.stringify(itemData.subject.sort()) ||
      formData.session !== itemData.session ||
      formData.purpose !== itemData.purpose ||
      formData.condition !== itemData.condition ||
      formData.image !== null;

    if (!hasChanged) {
      setNotification({
        show: true,
        type: "error",
        message: "No changes detected",
      });
      return;
    }

    const accessToken = sessionData?.user?.accessToken || session?.user?.accessToken;
    if (!accessToken) {
      setNotification({
        show: true,
        type: "error",
        message: "No access token available",
      });
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

    // Handle creating new room/subjects if needed
    let mergedSubjects = [...subjects];
    let finalRoomId: number;

    try {
      // Create new subjects if provided
      const newSubjects = formData.subject.filter(
        (entry) => !mergedSubjects.some((s) => s.id.toString() === entry || s.name === entry)
      );

      if (newSubjects.length > 0) {
        const subjectsRes = await fetch(`${backendUrl}/subjects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ subject_name: newSubjects }),
        });

        if (!subjectsRes.ok) {
          const err = await subjectsRes.json().catch(() => ({}));
          setNotification({
            show: true,
            type: "error",
            message: `Failed to create subjects: ${err.message || subjectsRes.statusText}`,
          });
          return;
        }

        const createdSubjects = await subjectsRes.json();
        const createdArray = createdSubjects.data || createdSubjects;
        if (Array.isArray(createdArray)) {
          const formatted = createdArray.map((s: any) => ({ id: s.id, name: s.subject_name || s.name }));
          setSubjects((prev) => [...prev, ...formatted]);
          mergedSubjects = [...mergedSubjects, ...formatted];
        }
      }

      // Create new room if provided
      if (isOtherRoom) {
        if (!otherRoomName.trim()) {
          setNotification({
            show: true,
            type: "error",
            message: "Please enter room name",
          });
          return;
        }

        const roomRes = await fetch(`${backendUrl}/rooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ room_name: otherRoomName }),
        });

        if (!roomRes.ok) {
          const err = await roomRes.json().catch(() => ({}));
          setNotification({
            show: true,
            type: "error",
            message: `Failed to create room: ${err.message || roomRes.statusText}`,
          });
          return;
        }

        const createdRoom = await roomRes.json();
        const roomData = createdRoom.data || createdRoom;
        const newRoom = Array.isArray(roomData) ? roomData[0] : roomData;
        if (newRoom && newRoom.id) {
          setRooms((prev) => [...prev, { id: newRoom.id, name: newRoom.room_name || newRoom.name }]);
          finalRoomId = newRoom.id;
          setFormData({ ...formData, room: newRoom.id.toString() });
          setIsOtherRoom(false);
          setOtherRoomName("");
        } else {
          setNotification({
            show: true,
            type: "error",
            message: "Failed to get new room ID",
          });
          return;
        }
      } else {
        finalRoomId = parseInt(formData.room);
        if (isNaN(finalRoomId)) {
          setNotification({
            show: true,
            type: "error",
            message: "Invalid room selection",
          });
          return;
        }
      }
    } catch (error) {
      console.error("Error creating related data:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to create related resources",
      });
      return;
    }

    // Map form data to API format
    const updateData: UpdateData = {
      item_name: formData.name,
      no_inventory: formData.inventoryNumber,
      room_id: finalRoomId,
      laboratory_id: parseInt(lab?.id.toString() || "0"),
      type: formData.purpose === "Practical Class" ? "praktikum" : "projek",
      condition: formData.condition.toLowerCase(),
      special_session: formData.session === "Session per Hour",
      subjects: formData.subject
        .map((entry) => {
          const byId = mergedSubjects.find((s) => s.id.toString() === entry);
          if (byId) return byId.id;
          const byName = mergedSubjects.find((s) => s.name === entry);
          if (byName) return byName.id;
          return undefined;
        })
        .filter(Boolean) as number[],
    };

    // Handle image if uploaded
    if (formData.image && files) {
      try {
        const uploadImage = await startUpload([files]);
        if (!uploadImage || !uploadImage[0] || !uploadImage[0].ufsUrl) {
          setNotification({
            show: true,
            type: "error",
            message: "Image upload failed",
          });
          return;
        }
        updateData.img_url = uploadImage[0].ufsUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        setNotification({
          show: true,
          type: "error",
          message: "Failed to process image",
        });
        return;
      }
    }

    try {
      const response = await fetch(`${backendUrl}/inventories/${itemData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push("/admin/allItems?updated=true");
      } else {
        const errorData = await response.json();
        setNotification({
          show: true,
          type: "error",
          message: `Failed to update item: ${errorData.message || 'Unknown error'}`,
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setNotification({
        show: true,
        type: "error",
        message: "Error updating item",
      });
    }
  };

  const lab = labs.find(l => l.name === adminLabName);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-slide-down">
          <div
            className={`${
              notification.type === "success"
                ? "bg-green-500"
                : "bg-red-500"
            } text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image || undefined,
        }}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-56" : "lg:ml-16"
        }`}
      >
        <div className="min-h-screen p-2 pt-20 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="text-2xl font-bold text-[#004CB0] hover:text-blue-700 transition-colors"
                >
                  All Items
                </button>
                <span className="text-2xl text-gray-400">›</span>
                <h2 className="text-3xl font-bold text-[#004CB0]">Edit</h2>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8">
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden relative border-2">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="text-gray-300">
                        <Upload className="w-8 h-8 sm:w-12 sm:h-12" />
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
                    <span>Edit</span>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                    {!isOtherRoom ? (
                      <select
                        value={formData.room}
                        onChange={(e) => handleRoomChange(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-white"
                        required
                      >
                        <option value="">Choose room</option>
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id.toString()}>
                            {room.name}
                          </option>
                        ))}
                        <option value="lainnya">Lainnya</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter room name"
                          value={otherRoomName}
                          onChange={(e) => setOtherRoomName(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtherRoom(false);
                            setOtherRoomName("");
                            setFormData({ ...formData, room: "" });
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Session */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Session
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-gray-200 cursor-not-allowed"
                      required
                      disabled
                    >
                      <option value={lab ? lab.id.toString() : ""}>{lab ? lab.name : "Choose lab"}</option>
                      {labs.map((labItem) => (
                        <option key={labItem.id} value={labItem.id.toString()}>
                          {labItem.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Purpose
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                    {!isOtherSubject ? (
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value === "lainnya") {
                            setIsOtherSubject(true);
                          } else if (
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
                        <option value="lainnya">Lainnya</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter subject name and press Enter"
                          value={otherSubjectInput}
                          onChange={(e) => setOtherSubjectInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (otherSubjectInput.trim() && !formData.subject.includes(otherSubjectInput.trim())) {
                                setFormData({
                                  ...formData,
                                  subject: [...formData.subject, otherSubjectInput.trim()],
                                });
                                setOtherSubjectInput("");
                              }
                            }
                          }}
                          className="flex-1 px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsOtherSubject(false);
                            setOtherSubjectInput("");
                          }}
                          className="px-4 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
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
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 mt-6 sm:mt-8">
                  <button
                    onClick={() => router.back()}
                    className="px-6 sm:px-8 py-3 border-2 border-[#004CB0] text-[#004CB0] rounded-full font-medium cursor-pointer hover:bg-[#004CB0] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 sm:px-8 py-3 bg-[#004CB0] text-white rounded-full font-medium hover:bg-blue-900 cursor-pointer transition-colors"
                  >
                    Save Changes
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
