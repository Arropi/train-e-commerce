import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import HistoryAdmin from "@/modules/History/historyAdmin";

interface ReserveData {
  reserve_id: number;
  item_name: string;
  img_url: string | null;
  borrower_name: string;
  borrower_nim: string;
  lab: string;
  tanggal: string;
  status: string;
  subject: string;
  session: string;
  purpose: string;
}

export default async function HistoryItemsPage() {
  const session = await getServerSession(authConfig);

  // akan redirect jika blm login
  if (!session) {
    redirect("/");
  }

  // Fetch data dari API
  const today = new Date().toISOString().split('T')[0];
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reserves/?tanggal=${today}`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });
  const data = await res.json();
  const historyData = data.data
    .filter((item: ReserveData) => item.status === 'done')
    .map((item: ReserveData) => ({
      id: item.reserve_id,
      itemName: item.item_name,
      itemImage: item.img_url || "https://placehold.co/150x150/png?text=Item",
      borrowerName: item.borrower_name,
      borrowerNim: item.borrower_nim,
      lab: item.lab,
      borrowDate: new Date(item.tanggal).toISOString().split('T')[0],
      returnDate: new Date(item.tanggal).toISOString().split('T')[0], // assume same
      purpose: item.purpose,
      status: 'returned' as const,
    }));

  return <HistoryAdmin session={session} historyData={historyData} />;
}