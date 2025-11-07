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
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
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
        image: "/images/logoUGM.png",
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
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
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
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
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
      {
        id: 5,
        title: "Signal Generator RF",
        status: "On Going",
        type: "approve",
        image: "/images/logoUGM.png",
        serialNumber: "SGN-2023-005",
        date: "5/10/2025",
        lab: "Lab IDK",
        purpose: "Praktikum",
        session: "Session 2 - 12.30",
        borrower: "Dewi Sartika",
        room: "HU 201",
        personInCharge: "R.A. Kartini",
        condition: "Good",
        subject: "Praktikum RF Communication",
      },
      {
        id: 6,
        title: "Spectrum Analyzer",
        status: "Rejected",
        type: "rejected",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
        serialNumber: "SPA-2023-006",
        date: "6/10/2025",
        lab: "Lab Telekomunikasi",
        purpose: "Penelitian",
        session: "Session 1 - 07.30",
        borrower: "Eko Prasetyo",
        room: "HU 202",
        personInCharge: "Cut Nyak Dien",
        condition: "Good",
        subject: "Penelitian Spektrum Frekuensi",
      },
      {
        id: 7,
        title: "Power Supply DC 0-30V",
        status: "Waiting to be Return",
        type: "waiting_to_be_return",
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
        serialNumber: "PWS-2023-007",
        date: "7/10/2025",
        lab: "Lab Elektronika",
        purpose: "Project",
        session: "Session 2 - 12.30",
        borrower: "Fajar Nugroho",
        room: "HU 203",
        personInCharge: "Diponegoro",
        condition: "Excellent",
        subject: "Praktikum Power Electronics",
      },
    ],
    history: [
      {
        id: 8,
        title: "Power Supply DC 0-30V",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
        serialNumber: "PWS-2023-008",
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
        id: 9,
        title: "Oscilloscope Digital 200MHz",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
        serialNumber: "OSD-2023-009",
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
      {
        id: 10,
        title: "Network Analyzer",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
        serialNumber: "NWA-2023-010",
        date: "22/09/2025",
        lab: "Lab Telekomunikasi",
        purpose: "Praktikum",
        session: "Session 2 - 12.30",
        borrower: "Hadi Wijaya",
        room: "HU 203",
        personInCharge: "Bung Tomo",
        condition: "Good",
        subject: "Praktikum Jaringan Komunikasi",
      },
      {
        id: 11,
        title: "Signal Generator 6GHz",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
        serialNumber: "SGN-2023-011",
        date: "23/09/2025",
        lab: "Lab Elektronika",
        purpose: "Project",
        session: "Session 1 - 07.30",
        borrower: "Indra Kusuma",
        room: "HU 204",
        personInCharge: "Gatot Subroto",
        condition: "Good",
        subject: "Final Project Telekomunikasi",
      },
      {
        id: 12,
        title: "Logic Probe Digital",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
        serialNumber: "LGP-2023-012",
        date: "24/09/2025",
        lab: "Lab Komputer",
        purpose: "Praktikum",
        session: "Session 2 - 12.30",
        borrower: "Joko Santoso",
        room: "HU 201",
        personInCharge: "Ahmad Yani",
        condition: "Fair",
        subject: "Praktikum Sistem Digital Lanjut",
      },
      {
        id: 13,
        title: "Function Generator 50MHz",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop",
        serialNumber: "FGN-2023-013",
        date: "25/09/2025",
        lab: "Lab IDK",
        purpose: "Penelitian",
        session: "Session 1 - 07.30",
        borrower: "Kartika Sari",
        room: "HU 202",
        personInCharge: "Sudirman",
        condition: "Excellent",
        subject: "Penelitian Gelombang Sinyal",
      },
      {
        id: 14,
        title: "Multimeter Analog",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1617382734744-675b0b0ac5f9?w=400&h=400&fit=crop",
        serialNumber: "MLA-2023-014",
        date: "26/09/2025",
        lab: "Lab Elektronika",
        purpose: "Praktikum",
        session: "Session 2 - 12.30",
        borrower: "Lestari Dewi",
        room: "HU 203",
        personInCharge: "Soeharto",
        condition: "Good",
        subject: "Praktikum Pengukuran Elektronika",
      },
      {
        id: 15,
        title: "Digital Caliper Precision",
        status: "Done",
        type: "done",
        image:
          "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=400&fit=crop",
        serialNumber: "DCP-2023-015",
        date: "27/09/2025",
        lab: "Lab Telekomunikasi",
        purpose: "Project",
        session: "Session 1 - 07.30",
        borrower: "Maya Putri",
        room: "HU 204",
        personInCharge: "Mohammad Hatta",
        condition: "Excellent",
        subject: "Final Project Instrumentasi",
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
