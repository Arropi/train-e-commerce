import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import DetailHistory from "@/modules/History/detailHistory";

interface PageProps {
  params: {
    itemName: string;
  };
}

export default async function DetailHistoryPage({ params }: PageProps) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }

  // Decode item name dari URL
  const itemName = decodeURIComponent(params.itemName);

  // TODO: Fetch data dari API berdasarkan itemName
  // const borrowRecords = await fetch(`/api/history/${itemName}`)

  // Dummy data sementara
  const borrowRecords = [
    {
      no: 1,
      borrowerName: "Muhammad Zidan Alhilali",
      borrowerId: "728878134781397",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Monday, 10 November 2025",
    },
    {
      no: 2,
      borrowerName: "Ahmad Sodiq",
      borrowerId: "3712831273",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Monday, 10 November 2025",
    },
    {
      no: 3,
      borrowerName: "Dimas Satriyo",
      borrowerId: "83u218",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Monday, 10 November 2025",
    },
    {
      no: 4,
      borrowerName: "Intan Dwi Asmara",
      borrowerId: "283912739821",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Monday, 10 November 2025",
    },
    {
      no: 1,
      borrowerName: "Muhammad Zidan Alhilali",
      borrowerId: "y37r7r",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Tuesday, 11 November 2025",
    },
    {
      no: 2,
      borrowerName: "Muhammad Zidan Alhilali",
      borrowerId: "ryu82hf834",
      status: "Returned" as const,
      condition: "Good" as const,
      borrowDate: "Tuesday, 11 November 2025",
    },
  ];

  return (
    <DetailHistory
      session={session}
      itemName={itemName}
      borrowRecords={borrowRecords}
    />
  );
}
