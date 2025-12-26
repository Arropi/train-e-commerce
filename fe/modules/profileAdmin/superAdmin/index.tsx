"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";
import { Laboratory } from "@/types";

export default function SuperAdminProfile(profileProps: {
  name: string;
  lab: string;
  email: string;
  role: string;
}) {
  const { data: session, status } = useSession();

  // toast
  interface ToastItem {
    id: string;
    message: string;
    type?: "success" | "error" | "info";
  }

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (
    message: string,
    type: ToastItem["type"] = "info",
    ttl = 3500
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((s) => [...s, { id, message, type }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), ttl);
  };

  function ToastContainer() {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 flex items-center gap-3"
            style={{ willChange: "transform, opacity" }}
          >
            {t.type === "success" ? (
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : t.type === "error" ? (
              <svg
                className="w-6 h-6 text-red-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-[#004CB0] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <div
              className={`text-sm font-medium ${
                t.type === "success"
                  ? "text-[#004CB0]"
                  : t.type === "error"
                  ? "text-red-600"
                  : "text-[#004CB0]"
              }`}
            >
              {t.message}
            </div>
          </div>
        ))}
      </div>
    );
  }
  // --- end inline toast ---

  // Local profile state (initialized from props)
  const [profile, setProfile] = useState({
    name: profileProps.name ?? "",
    role: profileProps.role ?? "",
    email: profileProps.email ?? "",
    lab: profileProps.lab ?? "",
  });

  // Form state for editing
  const [form, setForm] = useState({
    role: profileProps.role ?? "",
    lab: profileProps.lab ?? "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isLoading = false;
  const [error, setError] = useState<string | null>(null);

  // Sidebar user state
  const [sidebarUser, setSidebarUser] = useState({
    name: "",
    role: "",
    avatar: "",
  });

  // Fetch profile for sidebar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.accessToken) return;
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
        const res = await fetch(`${backendUrl}/user`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.datas ?? data.data ?? data.user ?? data;
          setSidebarUser({
            name: user?.name ?? user?.username ?? "Unknown",
            role: user?.role ?? "Admin",
            avatar: user?.avatar ?? session?.user?.image ?? "",
          });
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, session]);

  // Add-admin modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    lab: 0,
  });
  console.log('data yang akan dikirim: ',newAdmin)

  // Labs untuk pilihan lab admin
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [labsFetched, setLabsFetched] = useState(false);
  
  useEffect(() => {
    if (!session?.user?.accessToken || labsFetched) return;
    
    const fetchLabs = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
        const res = await fetch(`${backendUrl}/laboratories`, {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`, 
          },
          cache: 'no-store'
        }); 
        if (res.ok) {
          const data = await res.json();
          const formattedLabs = data.data.map((lab: any) => ({
            ...lab,
            title: lab.name
          }));
          setLabs(formattedLabs);
          setLabsFetched(true);
        }
      } catch (err) {
        console.error("Fetch labs error:", err);
      }
    };
    
    fetchLabs();
  }, [session?.user?.accessToken, labsFetched]);
  console.log('labs: ', labs);

  // State untuk sidebar
  const { isSidebarOpen } = useAdminSidebar();

  // Sync local state when parent props change
  useEffect(() => {
    setProfile({
      name: profileProps.name ?? "",
      role: profileProps.role ?? "",
      email: profileProps.email ?? "",
      lab: profileProps.lab ?? "",
    });
    setForm({
      role: profileProps.role ?? "",
      lab: profileProps.lab ?? "",
    });
  }, [
    profileProps.name,
    profileProps.role,
    profileProps.email,
    profileProps.lab,
  ]);

  // repurpose the button to open the Add Admin modal (per request)
  const handleEdit = () => {
    setNewAdmin({ email: "", lab: 0 });
    setIsAddModalOpen(true);
    setError(null);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleNewAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === "lab") {
      setNewAdmin((p) => ({ ...p, [name]: Number(value) }));
      return;
    }
    setNewAdmin((p) => ({ ...p, [name]: value }));
  };

  const handleAddAdmin = async () => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      showToast("Unauthorized", "error");
      return;
    }

    // basic validation
    if (!newAdmin.email || !newAdmin.lab) {
      showToast("Please fill in all fields", "error");
      return;
    }

    // email format validation - hanya email UGM
    const emailRegex = /@(mail\.)?ugm\.ac\.id$/i;
    if (!emailRegex.test(newAdmin.email)) {
      showToast(
        "Email must be in the format @ugm.ac.id or @mail.ugm.ac.id",
        "error"
      );
      return;
    }

    // Cek apakah email yang diinput adalah email admin sendiri
    if (newAdmin.email.toLowerCase() === session?.user?.email?.toLowerCase()) {
      showToast(
        "Can't add your own email as admin",
        "error"
      );
      return;
    }

    setIsSaving(true);
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

      const res = await fetch(`${backendUrl}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({
          email: newAdmin.email,
          lab_id: newAdmin.lab,
        }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("POST response bukan JSON:", text.substring(0, 500));
        const errorLog = `Response Error: ${text.substring(0, 200)}`;
        showToast(`Backend error: ${errorLog}`, "error");
        setIsSaving(false);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Backend error response:", errorData);
        const errorMessage = errorData?.message || errorData?.error || `HTTP ${res.status}: Failed to add admin`;
        showToast(errorMessage, "error");
        setIsSaving(false);
        return;
      }

      const data = await res.json();
      showToast("Admin added successfully", "success");
      setIsAddModalOpen(false);
      setNewAdmin({ email: "", lab: 0 });
    } catch (err: unknown) {
      console.error("Add admin error:", err);
      let errorMessage = "Failed to add admin";
      if (err instanceof Error) {
        errorMessage = err.message;
        // Tampilkan stack trace jika ada
        if (err.stack) {
          console.error("Error stack:", err.stack);
        }
      }
      showToast(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ role: profile.role, lab: profile.lab });
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      setError("Unauthorized");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

      const res = await fetch(`${backendUrl}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify({ role: form.role, lab_id: form.lab }),
      });

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("PUT response bukan JSON:", text.substring(0, 500));
        throw new Error("Backend tidak mengembalikan JSON saat update.");
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.message || `HTTP ${res.status}: Failed to update profile`
        );
      }

      const data = await res.json();
      // support multiple response shapes
      const user = data.datas ?? data.data ?? data.user ?? data;

      // update local profile state
      setProfile((p) => ({
        ...p,
        role: user?.role ?? form.role,
        lab: user?.lab ?? form.lab,
        name: user?.name ?? user?.username ?? p.name,
        email: user?.email ?? p.email,
      }));

      setIsEditing(false);
      // use UI toast instead of native alert
      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      console.error("Update profile error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      showToast(
        err instanceof Error ? err.message : "Failed to update profile",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Sidebar Admin */}
      <SidebarAdmin user={sidebarUser} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
        }`}
      >
        {/* Toasts (inline) */}
        <ToastContainer />

        {/* Add Admin Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[9998] flex items-start justify-center p-6">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeAddModal}
            />
            <div className="relative bg-white rounded-2xl w-full max-w-2xl p-8 z-10 shadow-lg mt-20">
              <h3 className="text-2xl font-semibold text-[#004CB0] mb-6">
                Add New Admin
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Email UGM
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={handleNewAdminChange}
                    placeholder="name@ugm.ac.id or name@mail.ugm.ac.id"
                    className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">
                    Choose Laboratory
                  </label>
                  <div className="relative">
                    <select
                      name="lab"
                      value={newAdmin.lab}
                      onChange={handleNewAdminChange}
                      className="w-full px-4 py-3 pr-10 border rounded-lg border-gray-300 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent cursor-pointer"
                    >
                      <option value="">Choose laboratory...</option>
                      {labs.map((l) => (
                        <option key={l.id} value={l.id}>
                          Lab {l.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeAddModal}
                    disabled={isSaving}
                    className="px-6 py-2 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200 text-gray-700 rounded-lg font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#004CB0] text-white hover:bg-blue-900 transition-colors duration-200 rounded-lg font-medium disabled:opacity-50"
                  >
                    {isSaving ? "Adding..." : "Add Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mt-20 px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Tombol toggle sidebar */}
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#004CB0]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#004CB0]">
                Profile
              </h2>
            </div>

            {/* Button Tambah Admin */}
            <div className="flex justify-center sm:justify-end">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#004CB0] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-[#004CB0] text-white rounded-full hover:bg-blue-900 transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
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
                  Add Admin
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content - Fixed width container */}
        <div className="max-w-4xl mx-auto mt-8 px-6">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#004CB0]">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="profile"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-3xl font-medium text-gray-500">
                    {profile.name?.charAt(0) ??
                      session?.user?.name?.charAt(0) ??
                      "U"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 p-8 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" />
            <h3 className="text-xl font-semibold text-[#004CB0] mb-6">
              Detail Information
            </h3>

            {isLoading && (
              <p className="text-sm text-gray-500 mb-4">Memuat data...</p>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-gray-500 text-sm mb-1">Name</p>
                <p className="text-gray-800 font-medium">
                  {profile.name || session?.user?.name || "Gatau siapa"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Lab</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="lab"
                    value={form.lab}
                    onChange={handleChange}
                    placeholder="Masukkan Lab"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile.lab || (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="text-gray-800 font-medium line-clamp-2">
                  {profile.email}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Role</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="prodi"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Masukkan Program Studi"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile.role || (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
