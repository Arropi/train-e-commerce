import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import HistoryAdmin from "@/modules/History/historyAdmin";

export default async function HistoryItemsPage() {
  const session = await getServerSession(authConfig);

  // akan redirect jika blm login
  if (!session) {
    redirect("/");
  }

  // TODO: Fetch data dari API
  // const historyData = await fetch('...')

  // Dummy data sementara
  const historyData = [
    {
      id: 1,
      itemName: "Arduino Uno R3",
      itemImage: "https://placehold.co/150x150/png?text=Arduino",
      borrowerName: "John Doe",
      borrowerNim: "1234567890",
      lab: "Lab Elektronika",
      borrowDate: "2024-11-01",
      returnDate: "2024-11-05",
      purpose: "Practical Class",
      status: "returned" as const,
    },
    {
      id: 2,
      itemName: "Raspberry Pi 4",
      itemImage: "https://placehold.co/150x150/png?text=RaspberryPi",
      borrowerName: "Jane Smith",
      borrowerNim: "0987654321",
      lab: "Lab RPL",
      borrowDate: "2024-11-02",
      returnDate: "2024-11-08",
      purpose: "Project",
      status: "late" as const,
    },
    {
      id: 3,
      itemName: "Oscilloscope Digital",
      itemImage: "https://placehold.co/150x150/png?text=Oscilloscope",
      borrowerName: "Bob Johnson",
      borrowerNim: "1122334455",
      lab: "Lab Elektronika",
      borrowDate: "2024-10-28",
      returnDate: "2024-11-01",
      purpose: "Practical Class",
      status: "damaged" as const,
    },
    {
      id: 4,
      itemName: "Multimeter Fluke",
      itemImage: "https://placehold.co/150x150/png?text=Multimeter",
      borrowerName: "Alice Brown",
      borrowerNim: "5566778899",
      lab: "Lab IDK",
      borrowDate: "2024-11-03",
      returnDate: "2024-11-07",
      purpose: "Project",
      status: "returned" as const,
    },
    {
      id: 5,
      itemName: "Soldering Station",
      itemImage: "https://placehold.co/150x150/png?text=Soldering",
      borrowerName: "Charlie Wilson",
      borrowerNim: "9988776655",
      lab: "Lab TAJ",
      borrowDate: "2024-10-30",
      returnDate: "2024-11-04",
      purpose: "Practical Class",
      status: "returned" as const,
    },
  ];

  return <HistoryAdmin session={session} historyData={historyData} />;
}