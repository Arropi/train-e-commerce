import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import ViewAllPage from "@/modules/viewall";
import { notFound, redirect } from "next/navigation";
import Navbar from "../../../modules/Navbar/navbar";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ViewAllServerPage({ params }: PageProps) {
  const { slug } = params;
  const session = await getServerSession(authConfig);

  // Validasi slug
  if (!["ongoing", "history"].includes(slug)) {
    notFound();
  }

  if (!session) {
    redirect("/login");
  }

  // Dummy data dengan informasi lengkap
  const dummyData = {
    ongoing: [
      {
        id: 1,
        title: "Osiloskop Analog GW Instek GOS 620",
        status: "in Form Review",
        type: "process",
        image: "/images/oscilloscope.jpg",
        serialNumber: "728878134781397",
        date: "1/10/2025",
        lab: "Lab Elektronika",
        purpose: "Project",
        session: "Session 2 - 12.30",
        borrower: "Muhammad Zidan Alhilal",
        room: "HU 201",
        personInCharge: "Gibran Rakabuming Raka",
        condition: "Good",
        subject: "Praktikum Pemrograman Web 2",
      },
      {
        id: 2,
        title: "Multimeter Digital Fluke 87V",
        status: "On Going",
        type: "approve",
        serialNumber: "MLT-2023-002",
        date: "2/10/2025",
        lab: "Lab Elektronika",
        purpose: "Praktikum",
        session: "Session 1 - 07.30",
        borrower: "Ahmad Dahlan",
        room: "HU 202",
        personInCharge: "Soekarno Hatta",
        condition: "Fair",
        subject: "Praktikum Elektronika Dasar",
      },
      {
        id: 3,
        title: "Function Generator 20MHz",
        status: "Waiting to be Return",
        type: "waiting_to_be_return",
        serialNumber: "FGN-2023-003",
        date: "3/10/2025",
        lab: "Lab Telekomunikasi",
        purpose: "Penelitian",
        session: "Session 2 - 12.30",
        borrower: "Budi Santoso",
        room: "HU 203",
        personInCharge: "Tan Malaka",
        condition: "Good",
        subject: "Penelitian Sinyal Digital",
      },
      {
        id: 4,
        title: "Logic Analyzer 16 Channel",
        status: "Rejected",
        type: "rejected",
        serialNumber: "LGA-2023-004",
        date: "4/10/2025",
        lab: "Lab Komputer",
        purpose: "Project",
        session: "Session 1 - 07.30",
        borrower: "Citra Dewi",
        room: "HU 204",
        personInCharge: "Ki Hajar Dewantara",
        condition: "Excellent",
        subject: "Praktikum Sistem Digital",
      },
    ],
    history: [
      {
        id: 5,
        title: "Power Supply DC 0-30V",
        status: "Done",
        type: "done",
        serialNumber: "PWS-2023-005",
        date: "20/09/2025",
        lab: "Lab Elektronika",
        purpose: "Praktikum",
        session: "Session 2 - 12.30",
        borrower: "Dewi Sartika",
        room: "HU 201",
        personInCharge: "R.A. Kartini",
        condition: "Good",
        subject: "Praktikum Rangkaian Listrik",
      },
      {
        id: 6,
        title: "Oscilloscope Digital 200MHz",
        status: "Done",
        type: "done",
        serialNumber: "OSD-2023-006",
        date: "21/09/2025",
        lab: "Lab Telekomunikasi",
        purpose: "Penelitian",
        session: "Session 1 - 07.30",
        borrower: "Eko Prasetyo",
        room: "HU 202",
        personInCharge: "Cut Nyak Dien",
        condition: "Excellent",
        subject: "Penelitian Modulasi Sinyal",
      },
    ],
  };

  const inventories = dummyData[slug as keyof typeof dummyData] || [];

  return (
    <>
      <Navbar />
      <ViewAllPage slug={slug} inventories={inventories} />
    </>
  );
}
