"use client";

import { useEffect, useState } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
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

// Notification Component
function Notification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-slide-down">
      <div
        className={`${
          type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3`}
      >
        {type === "error" ? (
          <AlertCircle className="w-6 h-6" />
        ) : (
          <CheckCircle className="w-6 h-6" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

export default function AddItemForm({ session }: AddItemFormProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const { data: sessionData } = useSession();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [labs, setLabs] = useState<{ id: number; name: string }[]>([]);
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [isOtherRoom, setIsOtherRoom] = useState(false);
  const [otherRoomName, setOtherRoomName] = useState("");
  const [isOtherSubject, setIsOtherSubject] = useState(false);
  const [otherSubjectInput, setOtherSubjectInput] = useState("");
  const [adminLabName, setAdminLabName] = useState<string>("");
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
      setNotificationMessage(e.message);
      setNotificationType("error");
      setShowNotification(true);
    },
  });

  // Fetch admin profile dan data lainnya
  useEffect(() => {
    const fetchData = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
      const accessToken =
        sessionData?.user?.accessToken || session?.user?.accessToken;

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

        // Kemudian fetch data lainnya
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
          const formattedLabs: { id: number; name: string }[] = [];
          for (const lab of labsData.data) {
            const formattingLab = { id: lab.id, name: lab.name };
            formattedLabs.push(formattingLab);
          }
          setLabs(formattedLabs);
        }

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.data || []);
        }

        if (subjectsRes.ok) {
          const subjectsData = await subjectsRes.json();
          setSubjects(
            subjectsData.data.map(
              (item: { id: number; subject_name: string }) => ({
                id: item.id,
                name: item.subject_name,
              })
            ) || []
          );
        }

        // Auto-fill laboratory field setelah data labs di-fetch
        
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    fetchData();
  }, [sessionData, session]);
  console.log(adminLabName)

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
      setNotificationMessage("Item name is required");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    if (!formData.inventoryNumber.trim()) {
      setNotificationMessage("Inventory number is required");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    if (!formData.room && !isOtherRoom) {
      setNotificationMessage("Please select a room");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    if (isOtherRoom && !otherRoomName.trim()) {
      setNotificationMessage("Please enter room name");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    // if (!formData.laboratory) {
    //   setNotificationMessage("Please select a laboratory");
    //   setNotificationType("error");
    //   setShowNotification(true);
    //   return;
    // }

    if (formData.subject.length === 0) {
      setNotificationMessage("Please select at least one subject");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    const accessToken =
      sessionData?.user?.accessToken || session?.user?.accessToken;
    if (!accessToken) {
      setNotificationMessage("No access token available");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

    console.log("ini admin", adminLabName);

    // If user provided other subjects/room, create them first on the backend
    // keep a local merged copy of subjects so newly created subjects' ids
    // are immediately available for mapping into createData
    let mergedSubjects = [...subjects];
    let finalRoomId: number;

    try {
      // Determine which entries in formData.subject are new names (not existing ids or names)
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
          setNotificationMessage(
            `Failed to create subjects: ${err.message || subjectsRes.statusText}`
          );
          setNotificationType("error");
          setShowNotification(true);
          return;
        }

        const createdSubjects = await subjectsRes.json();
        // Expect createdSubjects.data or createdSubjects to contain created items
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
          setNotificationMessage("Please enter room name");
          setNotificationType("error");
          setShowNotification(true);
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
          setNotificationMessage(`Failed to create room: ${err.message || roomRes.statusText}`);
          setNotificationType("error");
          setShowNotification(true);
          return;
        }

        const createdRoom = await roomRes.json();
        console.log("Created room response:", createdRoom);
        const roomData = createdRoom.data || createdRoom;
        console.log("Room data extracted:", roomData);
        // If backend returns single object or array, handle common shapes
        const newRoom = Array.isArray(roomData) ? roomData[0] : roomData;
        if (newRoom && newRoom.id) {
          // Update rooms list and set selected room id for the inventory create
          setRooms((prev) => [...prev, { id: newRoom.id, name: newRoom.room_name || newRoom.name }]);
          finalRoomId = newRoom.id;
          setFormData({ ...formData, room: newRoom.id.toString() });
          setIsOtherRoom(false);
          setOtherRoomName("");
        } else {
          setNotificationMessage("Failed to get new room ID");
          setNotificationType("error");
          setShowNotification(true);
          return;
        }
      } else {
        console.log("formData.room value:", formData.room);
        console.log("formData.room type:", typeof formData.room);
        finalRoomId = parseInt(formData.room);
        console.log("parsed finalRoomId:", finalRoomId);
        if (isNaN(finalRoomId)) {
          console.error("Failed to parse room ID from formData.room:", formData.room);
          setNotificationMessage("Invalid room selection");
          setNotificationType("error");
          setShowNotification(true);
          return;
        }
      }
    } catch (error) {
      console.error("Error creating related data:", error);
      setNotificationMessage("Failed to create related resources");
      setNotificationType("error");
      setShowNotification(true);
      return;
    }

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

    if (formData.image && files) {
      try {
        const uploadImage = await startUpload([files]);
        if (!uploadImage || !uploadImage[0] || !uploadImage[0].ufsUrl) {
          setNotificationMessage("Image upload failed");
          setNotificationType("error");
          setShowNotification(true);
          return;
        }
        createData.img_url = uploadImage[0].ufsUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        setNotificationMessage("Failed to process image");
        setNotificationType("error");
        setShowNotification(true);
        return;
      }
    }
    console.log("Create data:", createData);
    console.log("Form data:", formData);

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
        setNotificationMessage("Item added successfully!");
        setNotificationType("success");
        setShowNotification(true);
        setTimeout(() => {
          router.push("/admin/allItems?success=true");
        }, 1000);
      } else {
        const errorData = await response.json();
        setNotificationMessage(`Failed to add item: ${errorData.message || "Unknown error"}`);
        setNotificationType("error");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      setNotificationMessage("Error adding item");
      setNotificationType("error");
      setShowNotification(true);
    }
  };
  const lab = labs.find(lab => lab.name === adminLabName)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image ?? undefined,
        }}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        <div className="min-h-screen p-6 pt-20">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full px-4 py-3 border-2 border-[#004CB0] rounded-full focus:outline-none focus:ring-2 focus:ring-[#004CB0] appearance-none bg-gray-200 cursor-not-allowed"
                      required
                      disabled
                    >
                      <option value={lab ? lab.id.toString() : ""}>{lab ? lab.name : "Choose lab"}</option>
                      {labs.map((lab) => {
                        return (
                        <option key={lab.id} value={lab.id.toString()} defaultValue={"1"}>
                          {lab.name}
                        </option>
                        )
                      }
                      )}
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
                  <div className="md:col-span-2">
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
                          <option key={subject.id} value={subject.name.toString()}>
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition
                    </label>
                    <div className="flex gap-3 max-w-md">
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
