"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Check, X } from "lucide-react";
import Image from "next/image";
import ModalAdminDashboard from "@/components/Modal/ModalAdminDashboard";
import ModalBorrowedItem from "@/components/Modal/ModalBorrowedItem";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";
import { Reserve, TimeSession } from "../../types";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import SkeletonTable from "@/components/Loading/SkeletonTable";
import SkeletonCard from "@/components/Loading/SkeletonCard";
import Toast from "@/components/Toast/Toast";

interface OrderDetail {
  id: number;
  name: string;
  item: string;
  date: string;
  lab: string;
  serialNumber: string;
  purpose: string;
  session: string;
  borrower: string;
  room: string;
  personInCharge: string;
  condition: string;
  subject: string;
  image?: string;
}

interface BorrowedItem {
  id: number;
  item_name: string;
  no_item: string;
  img_url: string;
  lab: string;
  borrower: string;
  condition: "good" | "bad";
}

interface BorrowedItemDetail extends BorrowedItem {
  borrowed_date: string;
  session: string;
  room: string;
  personInCharge: string;
  purpose: string;
  subject: string;
  inventory_id: number;
}

interface HeroAdminProps {
  orders: Reserve[];
  borrowedItems: BorrowedItem[];
  labAdmin: string;
}

export default function HeroAdmin({
  orders = [],
  labAdmin = "",
}: HeroAdminProps) {
  const { isSidebarOpen } = useAdminSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBorrowedModalOpen, setIsBorrowedModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [selectedBorrowedItem, setSelectedBorrowedItem] =
    useState<BorrowedItemDetail | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: session } = useSession();
  const [fetchedOrders, setFetchedOrders] = useState<Reserve[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<{ [key: number]: "good" | "bad" }>({});
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const [showConditionConfirm, setShowConditionConfirm] = useState(false);
  const [pendingConditionItemId, setPendingConditionItemId] = useState<number | null>(null);
  const [pendingCondition, setPendingCondition] = useState<"good" | "bad" | null>(null);
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning">("success");

  // subjectsData used to map subject ids to names; fetched in useEffect below
  const [subjectsData, setSubjectsData] = useState<{ [key: number]: string }>({});
  // laboratoriesData used to map laboratory ids to names; fetched in useEffect below
  const [laboratoriesData, setLaboratoriesData] = useState<{ [key: number]: string }>({});
  // roomsData used to map room ids to names; fetched in useEffect below
  const [roomsData, setRoomsData] = useState<{ [key: number]: string }>({});
  // timeSessionsData used to map time session ids to start times; fetched in useEffect below
  const [timeSessionsData, setTimeSessionsData] = useState<{ [key: number]: string }>({});
  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingLabs, setLoadingLabs] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingTimeSessions, setLoadingTimeSessions] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const isLoading = loadingSubjects || loadingLabs || loadingRooms || loadingTimeSessions || loadingOrders;

  const ordersToUse = fetchedOrders

  // Toast helper function
  const showToast = (message: string, type: "success" | "error" | "warning") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Function to fetch fresh data from API
  const fetchOrders = async () => {
    if (!session?.user?.accessToken) return;
    
    setLoadingOrders(true);
    try {
      const reserve = await fetch(`${
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
      }/reserves/admin/ongoing`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        cache: "no-store",
      });
      
      if (reserve.ok) {
        const data = await reserve.json();
        setFetchedOrders(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleApprove = (orderId: number) => {
    setPendingOrderId(orderId);
    setPendingAction('approve');
    setShowApproveConfirm(true);
  };

  const handleReject = (orderId: number) => {
    setPendingOrderId(orderId);
    setPendingAction('reject');
    setShowRejectConfirm(true);
  };

  const executeApprove = async () => {
    if (!pendingOrderId) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/${pendingOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ status: "approve" }),
      });
      console.log(await response.json())
      if (response.ok) {
        showToast("Request approved!", "success");
        // Trigger refresh
        setRefreshKey(prev => prev + 1);
      } else {
        showToast("Failed to approve", "error");
      }
    } catch (error) {
      console.error("Error approving:", error);
      showToast("Error approving request", "error");
    }
    setShowApproveConfirm(false);
    setPendingOrderId(null);
    setPendingAction(null);
  };

  const executeReject = async () => {
    if (!pendingOrderId) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/${pendingOrderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      console.log(await response.json())
      if (response.ok) {
        showToast("Request rejected!", "error");
        // Trigger refresh
        setRefreshKey(prev => prev + 1);
      } else {
        showToast("Failed to reject", "error");
      }
    } catch (error) {
      console.error("Error rejecting:", error);
      showToast("Error rejecting request", "error");
    }
    setShowRejectConfirm(false);
    setPendingOrderId(null);
    setPendingAction(null);
  };

  const executeConditionUpdate = async () => {
    if (!pendingConditionItemId || !pendingCondition) return;
    
    try {
      // Find the inventory id from the borrowed items
      const item = borrowedItemsDetail.find(i => i.id === pendingConditionItemId);
      if (!item) {
        showToast("Item tidak ditemukan", "error");
        return;
      }
      
      // Update inventory condition
      const inventoryResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories/${item.inventory_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ condition: pendingCondition }),
      });
      
      // Update reserve status to done
      const reserveResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/${pendingConditionItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ status: "done" }),
      });
      
      if (inventoryResponse.ok && reserveResponse.ok) {
        showToast("Kondisi barang berhasil diupdate dan status diubah menjadi done!", "success");
        // Trigger refresh
        setRefreshKey(prev => prev + 1);
      } else {
        showToast("Gagal update kondisi atau status", "error");
      }
    } catch (error) {
      console.error("Error updating condition:", error);
      showToast("Error updating condition", "error");
    }
    setShowConditionConfirm(false);
    setPendingConditionItemId(null);
    setPendingCondition(null);
  };

  console.log("Orders in HeroAdmin:", orders);

  // Filter orders yang pending (status "process")
  const pendingOrders = useMemo(() => ordersToUse.filter(order => order.status === 'process'), [ordersToUse]);

  // Map pendingOrders ke OrderDetail
  const ordersDetail: OrderDetail[] = useMemo(() => pendingOrders.map((reserve) => ({
    id: reserve.id,
    name: reserve.reserve_user_created?.first_name && reserve.reserve_user_created?.last_name
      ? `${reserve.reserve_user_created.first_name} ${reserve.reserve_user_created.last_name}`
      : reserve.reserve_user_created?.username || "Unknown",
    item: reserve.inventories?.item_name || "Unknown Item",
    date: reserve.tanggal ? new Date(reserve.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Unknown Date",
    lab: laboratoriesData[reserve.inventories?.labolatory_id] || "Unknown Lab",
    serialNumber: reserve.inventories?.no_item || "N/A",
    purpose: reserve.inventories?.type || "N/A",
    session: timeSessionsData[reserve.session_id ?? -1] || "N/A",
    borrower: reserve.reserve_user_created?.first_name && reserve.reserve_user_created?.last_name
      ? `${reserve.reserve_user_created.first_name} ${reserve.reserve_user_created.last_name}`
      : reserve.reserve_user_created?.username || "Unknown",
    room: roomsData[reserve.inventories?.room_id?? -1] || "Unknown Room",
    personInCharge: reserve.pic || "N/A",
    condition: reserve.inventories?.condition || "N/A",
    subject: subjectsData[reserve.subject_id ?? -1] || "N/A",
    image: reserve.inventories?.inventory_galleries?.[0]?.filepath || "/images/default_img_card.webp", // fallback default image
  })), [pendingOrders, subjectsData, laboratoriesData, roomsData, timeSessionsData]);

  // Filter orders yang sedang dipinjam (status "waiting_to_be_return")
  const borrowedOrders = useMemo(() => ordersToUse.filter(order => order.status === 'waiting_to_be_return'), [ordersToUse]);

  // Map borrowedOrders ke BorrowedItemDetail
  const borrowedItemsDetail: BorrowedItemDetail[] = useMemo(() => borrowedOrders.map((reserve) => ({
    id: reserve.id,
    item_name: reserve.inventories?.item_name || "Unknown Item",
    no_item: reserve.inventories?.no_item || "N/A",
    img_url: reserve.inventories?.inventory_galleries?.[0]?.filepath || reserve.inventories?.img_url || "/images/default_img_card.webp",
    lab: laboratoriesData[reserve.inventories?.labolatory_id] || "Unknown Lab",
    borrower: reserve.reserve_user_created?.first_name && reserve.reserve_user_created?.last_name
      ? `${reserve.reserve_user_created.first_name} ${reserve.reserve_user_created.last_name}`
      : reserve.reserve_user_created?.username || "Unknown",
    condition: reserve.inventories?.condition || "good",
    borrowed_date: reserve.tanggal ? new Date(reserve.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Unknown Date",
    session: timeSessionsData[reserve.session_id ?? -1] || "N/A",
    room: roomsData[reserve.inventories?.room_id ?? -1] || "Unknown Room",
    personInCharge: reserve.pic || "N/A",
    purpose: reserve.inventories?.type || "N/A",
    subject: subjectsData[reserve.subject_id ?? -1] || "N/A",
    inventory_id: reserve.inventories?.id || 0,
  })), [borrowedOrders, subjectsData, laboratoriesData, roomsData, timeSessionsData]);

  // gunakan data dari API jika ada, kosong jika tidak
  const displayBorrowedItems = borrowedItemsDetail;

  // Group orders by room
  const ordersByRoom = useMemo(() => {
    const grouped: { [roomName: string]: OrderDetail[] } = {};
    
    ordersDetail.forEach(order => {
      const roomName = order.room || "Unknown Room";
      if (!grouped[roomName]) {
        grouped[roomName] = [];
      }
      grouped[roomName].push(order);
    });
    
    return grouped;
  }, [ordersDetail]);

  const roomNames = useMemo(() => Object.keys(ordersByRoom).sort(), [ordersByRoom]);

  console.log("Orders Detail:", ordersDetail);
  console.log("Subjects Data:", subjectsData);
  console.log("Fetched Orders:", fetchedOrders);
  console.log("Sample inventory_subjects:", fetchedOrders[0]?.inventories?.inventory_subjects);
  console.log("Orders by Room:", ordersByRoom);

  const handleDetailsClick = (orderId: number) => {
    const order = ordersDetail.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };

  const handleBorrowedItemDetailsClick = (itemId: number) => {
    const item = borrowedItemsDetail.find((i) => i.id === itemId);
    if (item) {
      setSelectedBorrowedItem(item);
      setIsBorrowedModalOpen(true);
    }
  };

  const handleConditionChange = (itemId: number, condition: "good" | "bad") => {
    setPendingConditionItemId(itemId);
    setPendingCondition(condition);
    setShowConditionConfirm(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const closeBorrowedModal = () => {
    setIsBorrowedModalOpen(false);
    setSelectedBorrowedItem(null);
  };

  useEffect(() => {
    const initialConditions: { [key: number]: "good" | "bad" } = {};
    borrowedItemsDetail.forEach(item => {
      initialConditions[item.id] = item.condition;
    });
    setSelectedConditions(initialConditions);
  }, [borrowedItemsDetail]);

  // Refetch data when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      fetchOrders();
    }
  }, [refreshKey, session?.user?.accessToken]);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [session?.user?.accessToken]);

  // Fetch subjects data
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoadingSubjects(true);
      try {
        const response = await fetch(`${
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
        }/subjects`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const subjectsMap: { [key: number]: string } = {};
          data.data.forEach((subject: any) => {
            subjectsMap[subject.id] = subject.subject_name;
          });
          setSubjectsData(subjectsMap);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [session?.user?.accessToken]);

  // Fetch laboratories data
  useEffect(() => {
    const fetchLaboratories = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoadingLabs(true);
      try {
        const response = await fetch(`${
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
        }/laboratories`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const labsMap: { [key: number]: string } = {};
          data.data.forEach((lab: any) => {
            labsMap[lab.id] = lab.name;
          });
          setLaboratoriesData(labsMap);
        }
      } catch (error) {
        console.error("Error fetching laboratories:", error);
      } finally {
        setLoadingLabs(false);
      }
    };

    fetchLaboratories();
  }, [session?.user?.accessToken]);

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoadingRooms(true);
      try {
        const response = await fetch(`${
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
        }/rooms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const roomsMap: { [key: number]: string } = {};
          data.data.forEach((room: any) => {
            roomsMap[room.id] = room.name;
          });
          setRoomsData(roomsMap);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
  }, [session?.user?.accessToken]);

  // Fetch time sessions data
  useEffect(() => {
    const fetchTimeSessions = async () => {
      if (!session?.user?.accessToken) return;
      
      setLoadingTimeSessions(true);
      try {
        const response = await fetch(`${
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
        }/time-sessions`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          cache: "no-store",
        });
        
        if (response.ok) {
          const data = await response.json();
          const timeSessionsMap: { [key: number]: string } = {};
          data.data.forEach((timeSession: TimeSession) => {
            timeSessionsMap[timeSession.id] = timeSession.start;
          });
          setTimeSessionsData(timeSessionsMap);
        }
      } catch (error) {
        console.error("Error fetching time sessions:", error);
      } finally {
        setLoadingTimeSessions(false);
      }
    };

    fetchTimeSessions();
  }, [session?.user?.accessToken]);



  // Show full page loading spinner when initially loading
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <div className={`min-h-screen p-2 pt-20 bg-white transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-72" : "lg:ml-20"
      }`}>
        <div className="max-w-6xl mx-auto">
          { (
            <>
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#004CB0]">
                  Dashboard Admin Lab { labAdmin}
                </h1>
              </div>

              {/* Group by Room */}
              {loadingOrders ? (
                <>
                  <SkeletonTable />
                  <SkeletonTable />
                </>
              ) : ordersDetail.length > 0 ? (
                roomNames.map((roomName) => (
                  <div key={roomName} className="mb-8">
                    {/* Room Header */}
                    <div className="mb-4 flex items-center gap-2">
                      <h2 className="text-md font-semibold text-black">
                        {roomName}
                      </h2>
                      <span className="text-sm text-gray-500">
                        ({ordersByRoom[roomName].length} items)
                      </span>
                    </div>

                    {/* Table Container */}
                    <div className={`bg-white rounded-xl overflow-hidden mb-4 overflow-x-auto ${isSidebarOpen ? 'mr-4' : ''}`}>
                      {/* Table Header */}
                      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 font-semibold text-gray-500">
                        <div className="col-span-1"></div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-4">Barang</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Action</div>
                      </div>

                      {/* Orders for this room */}
                      {ordersByRoom[roomName].map((order) => (
                      <React.Fragment key={order.id}>
                        <div
                          className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50"
                        >
                          <div className="col-span-1">
                            <input
                              type="checkbox"
                              className="hidden"
                            />
                          </div>
                          <div className="col-span-3 text-sm text-gray-800">
                            {order.name}
                          </div>
                          <div className="col-span-4 text-sm text-gray-800">
                            {order.item}
                          </div>
                          <div className="col-span-2 text-sm text-gray-800">
                            {order.date}
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <button onClick={() => handleReject(order.id)} className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                              <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                            </button>
                            <button onClick={() => handleApprove(order.id)} className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                              <Check
                                className="w-6 h-6 text-green-500"
                                strokeWidth={2.5}
                              />
                            </button>
                            <button
                              onClick={() => handleDetailsClick(order.id)}
                              className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                        {/* Mobile View */}
                        <div
                          className="md:hidden px-4 py-4 border-b border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="checkbox"
                              className="hidden"
                            />
                            <div className="flex-1 ml-3">
                              <p className="font-medium text-gray-800">{order.name}</p>
                              <p className="text-sm text-gray-600">{order.item}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => handleReject(order.id)} className="p-1.5 rounded-full hover:bg-red-50 transition-colors">
                              <X className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                            </button>
                            <button onClick={() => handleApprove(order.id)} className="p-1.5 rounded-full hover:bg-green-50 transition-colors">
                              <Check
                                className="w-6 h-6 text-green-500"
                                strokeWidth={2.5}
                              />
                            </button>
                            <button
                              onClick={() => handleDetailsClick(order.id)}
                              className="px-4 py-1.5 border-2 border-[#004CB0] text-[#004CB0] rounded-xl text-sm font-medium hover:bg-[#004CB0] hover:text-white transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No pending requests</p>
                </div>
              )}

              {/* Sedang dipinjam section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#004CB0] mb-4">On Loan</h2>

                {loadingOrders ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : displayBorrowedItems.length > 0 ? (
                  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center ${isSidebarOpen ? 'mr-4' : ''}`}>
                    {displayBorrowedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-shadow h-[280px] ${isSidebarOpen ? 'w-[330px]' : 'w-[380px]'}`}
                      >
                        {/* Header with Image and Title side by side */}
                        <div className="flex items-start gap-4 mb-4">
                          {/* Item Image */}
                          <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center">
                            <Image
                              src={item.img_url || "/images/default_img_card.webp"}
                              alt={item.item_name}
                              width={96}
                              height={96}
                              className="object-contain"
                              unoptimized
                            />
                          </div>

                          {/* Item Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 overflow-hidden text-ellipsis">
                              {item.item_name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.lab}</p>
                          </div>
                        </div>

                        {/* Divider */}
                        <hr className="border-gray-300 my-4" />

                        {/* Borrower Info */}
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-sm font-semibold text-gray-700 truncate mr-2">
                            
                            {item.borrower}
                          </p>
                          <button
                            onClick={() => handleBorrowedItemDetailsClick(item.id)}
                            className="px-4 py-1 bg-[#004CB0] text-white rounded-full text-xs hover:bg-blue-900 transition-colors whitespace-nowrap"
                          >
                            Details
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 justify-end mt-8">
                          <button
                            onClick={() => handleConditionChange(item.id, "bad")}
                            className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-red-700 transition-colors duration-200"
                          >
                            Bad Condition
                          </button>
                          <button
                            onClick={() => handleConditionChange(item.id, "good")}
                            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-green-700 transition-colors duration-200"
                          >
                            Good Condition
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">No items currently on loan</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal untuk Orders */}
      <ModalAdminDashboard
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />

      {/* Modal untuk Borrowed Items */}
      <ModalBorrowedItem
        isOpen={isBorrowedModalOpen}
        onClose={closeBorrowedModal}
        item={selectedBorrowedItem}
      />

      {/* Confirmation Dialog for Approve */}
      {showApproveConfirm && pendingOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Konfirmasi Persetujuan
                </h3>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowApproveConfirm(false);
                    setPendingOrderId(null);
                    setPendingAction(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={executeApprove}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Reject */}
      {showRejectConfirm && pendingOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-red-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Konfirmasi Penolakan
                </h3>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowRejectConfirm(false);
                    setPendingOrderId(null);
                    setPendingAction(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={executeReject}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Tolak
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Condition Update */}
      {showConditionConfirm && pendingConditionItemId && pendingCondition && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="mb-4">
                {pendingCondition === "good" ? (
                  <svg
                    className="w-16 h-16 mx-auto text-green-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-16 h-16 mx-auto text-red-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Konfirmasi Update Kondisi
                </h3>
                <p className="text-gray-600">
                  Update kondisi barang menjadi{" "}
                  <span className="font-semibold text-[#004CB0]">
                    {pendingCondition === "good" ? "Good" : "Bad"}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowConditionConfirm(false);
                    setPendingConditionItemId(null);
                    setPendingCondition(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={executeConditionUpdate}
                  className={`px-6 py-2 text-white rounded-lg transition-colors ${
                    pendingCondition === "good"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
    </>
  );
}
