"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

export default function SuperAdminProfile(profileProps: {
  name: string;
  nim: string;
  email: string;
  prodi: string;
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
            <div className={`text-sm font-medium ${
              t.type === "success"
                ? "text-[#004CB0]"
                : t.type === "error"
                ? "text-red-600"
                : "text-[#004CB0]"
            }`}>
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
    nim: profileProps.nim ?? "",
    email: profileProps.email ?? "",
    prodi: profileProps.prodi ?? "",
  });

  // Form state for editing
  const [form, setForm] = useState({
    nim: profileProps.nim ?? "",
    prodi: profileProps.prodi ?? "",
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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
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
    lab: "",
    password: "",
  });

  // Dummy labs for UI testing (no backend fetching)
  const [labs] = useState<string[]>(["Lab Komputer", "Lab Fisika", "Lab Kimia"]);

  // State untuk sidebar
  const { isSidebarOpen } = useAdminSidebar();

  // Sync local state when parent props change
  useEffect(() => {
    setProfile({
      name: profileProps.name ?? "",
      nim: profileProps.nim ?? "",
      email: profileProps.email ?? "",
      prodi: profileProps.prodi ?? "",
    });
    setForm({
      nim: profileProps.nim ?? "",
      prodi: profileProps.prodi ?? "",
    });
  }, [
    profileProps.name,
    profileProps.nim,
    profileProps.email,
    profileProps.prodi,
  ]);

  // repurpose the button to open the Add Admin modal (per request)
  const handleEdit = () => {
    setNewAdmin({ email: "", lab: "", password: "" });
    setIsAddModalOpen(true);
    setError(null);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const handleNewAdminChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setNewAdmin((p) => ({ ...p, [name]: value }));
  };

  const handleAddAdmin = async () => {
    if (status !== "authenticated" || !session?.user?.accessToken) {
      showToast("Unauthorized", "error");
      return;
    }

    // basic validation
    if (!newAdmin.email || !newAdmin.lab || !newAdmin.password) {
      showToast("Harap isi semua field", "error");
      return;
    }

    // email format validation
    const emailRegex = /@(gmail\.com|mail\.ugm\.ac\.id)$/;
    if (!emailRegex.test(newAdmin.email)) {
      showToast("Email harus berformat @gmail.com atau @mail.ugm.ac.id", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Simulate success for testing without fetching
      await new Promise((r) => setTimeout(r, 400));
      showToast("Admin added", "success");
      setIsAddModalOpen(false);
      setNewAdmin({ email: "", lab: "", password: "" });
    } catch (err: unknown) {
      console.error("Add admin error:", err);
      showToast(err instanceof Error ? err.message : "Gagal menambahkan admin", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({ nim: profile.nim, prodi: profile.prodi });
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
        body: JSON.stringify({ nim: form.nim, prodi: form.prodi }),
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
        nim: user?.nim ?? form.nim,
        prodi: user?.prodi ?? form.prodi,
        name: user?.name ?? user?.username ?? p.name,
        email: user?.email ?? p.email,
      }));

      setIsEditing(false);
      // use UI toast instead of native alert
      showToast("Profil berhasil diupdate!", "success");
    } catch (err: unknown) {
      console.error("Update profile error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      showToast(
        err instanceof Error ? err.message : "Gagal memperbarui profil",
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
            <div className="relative bg-white rounded-2xl w-full max-w-3xl p-8 z-10 shadow-lg">
              <h3 className="text-2xl font-semibold text-[#004CB0] mb-6">
                Add Admin
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    New admin email
                  </p>
                  <input
                    name="email"
                    type="email"
                    value={newAdmin.email}
                    onChange={handleNewAdminChange}
                    placeholder="Add email..."
                    className="w-full px-4 py-3 border rounded-full border-[#0A58CA] focus:outline-none"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Lab buat admin barunya
                  </p>
                  <div className="relative">
                    <select
                      name="lab"
                      value={newAdmin.lab}
                      onChange={handleNewAdminChange}
                      className="w-full px-4 py-3 pr-10 border rounded-full border-[#0A58CA] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#004CB0]"
                    >
                      <option value="">Choose lab nya</option>
                      {labs.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
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
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Your password
                  </p>
                  <input
                    name="password"
                    value={newAdmin.password}
                    onChange={handleNewAdminChange}
                    type="password"
                    placeholder="Enter your password..."
                    className="w-full px-4 py-3 border rounded-full border-[#0A58CA] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddAdmin}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#004CB0] text-white rounded-full"
                  >
                    Add
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
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#004CB0]">Profile</h2>
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
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-[#004CB0] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan"}
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
                  Tambah Admin
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
              Informasi Detail
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
                <p className="text-gray-500 text-sm mb-1">Nama Lengkap</p>
                <p className="text-gray-800 font-medium">
                  {profile.name || session?.user?.name || "Gatau siapa"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Lab</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="nim"
                    value={form.nim}
                    onChange={handleChange}
                    placeholder="Masukkan NIM"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile.nim || (
                      <span className="text-gray-400 italic">Belum diisi</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Email</p>
                <p className="text-gray-800 font-medium">{profile.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm mb-1">Role</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="prodi"
                    value={form.prodi}
                    onChange={handleChange}
                    placeholder="Masukkan Program Studi"
                    className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004CB0] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile.prodi || (
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