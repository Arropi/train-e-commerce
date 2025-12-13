"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SidebarAdmin from "@/modules/sideBarAdmin/sideBarAdmin";
import { useAdminSidebar } from "@/contexts/AdminSidebarContext";

interface BorrowRecord {
  no: number;
  borrowerName: string;
  borrowerId: string;
  status: "Returned" | "Late" | "Damaged";
  condition: "Good" | "Bad";
  borrowDate: string;
  // Additional fields for detail view
  itemName: string;
  itemImage: string;
  itemSerialNumber: string;
  lab: string;
  purpose: string;
  session: string;
  room: string;
  personInCharge: string;
  subject: string;
  returnDate: string;
}

type BorrowDetail = BorrowRecord;

interface DetailHistoryProps {
  session: Session;
  itemName: string;
  borrowRecords: BorrowRecord[];
}

export default function DetailHistory({
  session,
  itemName,
  borrowRecords,
}: DetailHistoryProps) {
  const router = useRouter();
  const { isSidebarOpen } = useAdminSidebar();
  const [selectedDetail, setSelectedDetail] = useState<BorrowDetail | null>(
    null
  );
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        // Check if click is not on Details button
        const target = event.target as HTMLElement;
        if (!target.closest("button[data-detail-button]")) {
          setSelectedDetail(null);
          setActiveDetailId(null);
        }
      }
    };

    if (selectedDetail) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedDetail]);

  const handleHistoryClick = () => {
    router.push("/admin/historyItems");
  };

  const handleDetailClick = (record: BorrowRecord) => {
    // Jika detail yang sama diklik lagi, tutup detail
    if (activeDetailId === record.borrowerId) {
      setSelectedDetail(null);
      setActiveDetailId(null);
      return;
    }

    // Use data from the record directly
    const fullDetail: BorrowDetail = {
      ...record,
    };

    setSelectedDetail(fullDetail);
    setActiveDetailId(record.borrowerId);
  };

  // Group records by date
  const groupedRecords = borrowRecords.reduce((acc, record) => {
    const date = record.borrowDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, BorrowRecord[]>);

  return (
    <div className="flex min-h-screen bg-white">
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
          isSidebarOpen ? "lg:ml-68" : "lg:ml-16"
        }`}
      >
        <div className={`min-h-screen p-2 pt-20 bg-white relative ${isSidebarOpen ? 'mr-4' : ''}`}>
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb Header */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={handleHistoryClick}
                className="text-2xl font-bold text-[#004CB0] hover:text-blue-900 transition-colors"
              >
                History
              </button>
              <ChevronRight className="w-6 h-6 text-gray-400" />
              <h1 className="text-3xl font-bold text-[#004CB0]">{itemName}</h1>
            </div>

            {/* Table Header */}
            <div className="bg-[#004CB0] text-white rounded-t-3xl px-6 py-4 hidden md:block">
              <div className="grid grid-cols-[60px_250px_2fr_1fr_1fr_120px] gap-4 font-semibold">
                <div className="text-left">No</div>
                <div className="text-left">Name</div>
                <div className="text-left">NIM</div>
                <div className="text-left">Status</div>
                <div className="text-left">Condition</div>
                <div className="text-left"></div>
              </div>
            </div>

            {/* Mobile Table Header */}
            <div className="bg-[#004CB0] text-white rounded-t-3xl px-6 py-4 md:hidden">
              <div className="grid grid-cols-[60px_1fr_120px] gap-4 font-semibold">
                <div className="text-left">No</div>
                <div className="text-left">Name</div>
                <div className="text-left"></div>
              </div>
            </div>

            {/* Table Content */}
            <div className="bg-white rounded-b-3xl">
              {Object.entries(groupedRecords).map(([date, records], idx) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="px-6 py-3">
                    <p className="font-bold text-xl text-gray-700 text-left">
                      Date: {date}
                    </p>
                  </div>

                  {/* Records for this date */}
                  {records.map((record, recordIdx) => (
                    <div
                      key={record.no}
                      className={`px-6 py-4 ${
                        recordIdx !== records.length - 1 ||
                        idx !== Object.entries(groupedRecords).length - 1
                          ? ""
                          : ""
                      } hover:bg-gray-50 transition-colors`}
                    >
                      <div className="hidden md:grid grid-cols-[60px_250px_2fr_1fr_1fr_120px] gap-4 items-center">
                        <div className="text-left text-gray-700">
                          {record.no}
                        </div>
                        <div className="text-left text-gray-700">
                          {record.borrowerName}
                        </div>
                        <div className="text-left">
                          <span className="text-black">
                            {record.borrowerId}
                          </span>
                        </div>
                        <div className="text-left">
                          {record.status}
                        </div>
                        <div className="text-left">
                          {record.condition}
                        </div>
                        <div className="text-left">
                          <button
                            data-detail-button
                            onClick={() => handleDetailClick(record)}
                            className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                              activeDetailId === record.borrowerId
                                ? "bg-[#BACEEA] border-1 border-[#BACEEA] text-[#004CB0]"
                                : "border-1 border-[#004CB0] text-[#004CB0] hover:bg-[#BACEEA] hover:text-[#004CB0] hover:border-[#BACEEA]"
                            }`}
                          >
                            Details
                          </button>
                        </div>
                      </div>

                      {/* Mobile Row */}
                      <div className="grid grid-cols-[60px_1fr_120px] gap-4 items-center md:hidden">
                        <div className="text-left text-gray-700">
                          {record.no}
                        </div>
                        <div className="text-left text-gray-700">
                          <div>
                            {record.borrowerName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {record.borrowerId}
                          </div>
                          <div className="text-xs text-gray-500">
                            Status: {record.status} | Condition: {record.condition}
                          </div>
                        </div>
                        <div className="text-left">
                          <button
                            data-detail-button
                            onClick={() => handleDetailClick(record)}
                            className={`px-3 py-1 rounded-xl text-sm font-medium transition-colors ${
                              activeDetailId === record.borrowerId
                                ? "bg-[#BACEEA] border-1 border-[#BACEEA] text-[#004CB0]"
                                : "border-1 border-[#004CB0] text-[#004CB0] hover:bg-[#BACEEA] hover:text-[#004CB0] hover:border-[#BACEEA]"
                            }`}
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {borrowRecords.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No borrow records found
                </div>
              )}
            </div>
          </div>

          {/* Floating Detail Card - Fixed Position di tengah, ke kiri dari button Details */}
          {selectedDetail && (
            <div
              ref={cardRef}
              className={`fixed top-1/2 left-1/2 md:left-auto ${isSidebarOpen ? 'md:right-[200px]' : 'md:right-[180px]'} -translate-x-1/2 md:-translate-x-0 -translate-y-1/3 z-50 w-[90vw] max-w-[420px] md:w-[420px]`}
            >
              {/* Detail Card dengan border biru */}
              <div className="bg-white rounded-[60px] border-2 border-[#004CB0] overflow-hidden">
                {/* Item Image and Name */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-4 px-10 mb-4 mt-15">
                    <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <Image
                        src={selectedDetail.itemImage}
                        alt={selectedDetail.itemName}
                        width={60}
                        height={60}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-md text-gray-800 mb-1 line-clamp-2 leading-tight">
                        {selectedDetail.itemName}
                      </h3>
                      <p className="text-gray-600 text-xs font-medium truncate">
                        {selectedDetail.itemSerialNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Content */}
                <div className="px-10 py-10 space-y-4">
                  {/* Date & Return Date */}
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Borrow Date</p>
                      <p className=" text-gray-800 text-sm">
                        {selectedDetail.borrowDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Return Date</p>
                      <p className=" text-gray-800 text-sm">
                        {selectedDetail.returnDate}
                      </p>
                    </div>
                  </div>

                  {/* Lab & Purpose */}
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Lab</p>
                      <p className=" text-gray-800 text-sm">
                        {selectedDetail.lab}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Purpose</p>
                      <p className=" text-gray-800 text-sm">
                        {selectedDetail.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Peminjam & Room */}
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Borrower</p>
                      <p className=" text-gray-800 text-sm truncate">
                        {selectedDetail.borrowerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Room</p>
                      <p className=" text-gray-800 text-sm">
                        {selectedDetail.room}
                      </p>
                    </div>
                  </div>

                  {/* Person In Charge & Condition */}
                  <div className="grid grid-cols-2 gap-x-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Person In Charge
                      </p>
                      <p className=" text-gray-800 text-sm truncate">
                        {selectedDetail.personInCharge}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Condition</p>
                      <div>{selectedDetail.condition}</div>
                    </div>
                  </div>

                  {/* Subject - Full width */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subject</p>
                    <p className=" text-gray-800 text-sm">
                      {selectedDetail.subject}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
