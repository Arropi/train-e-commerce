import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import HistoryAdmin from "@/modules/History/historyAdmin";

interface BorrowHistory {
  id: number;
  itemName: string;
  itemImage: string;
  borrowerName: string;
  borrowerNim: string;
  lab: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  status: "returned" | "late" | "damaged";
}

interface Lab {
  id: number;
  name: string;
}

interface Reserve {
  id: number;
  pic: string;
  status: string;
  tanggal: string;
  session_id: number;
  inventories_id: number;
  user_id: number;
  subject_id: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  inventories: {
    id: number;
    item_name: string;
    no_item: string;
    condition: string;
    alat_bhp: string;
    type: string;
    no_inv_ugm: string | null;
    information: string | null;
    special_session: boolean;
    room_id: number | null;
    labolatory_id: number | null;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    inventory_galleries: Array<{
      id: number;
      inventory_id: number;
      filepath: string;
      filename: string | null;
      created_at: string;
      updated_at: string | null;
      deleted_at: string | null;
    }>;
    inventory_subjects: Array<{
      id: number;
      inventory_id: number;
      subject_id: number;
      created_at: string;
      updated_at: string | null;
      deleted_at: string | null;
    }>;
  };
  reserve_user_created: {
    id: number;
    username: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    email_verified_at: string | null;
    password: string | null;
    nim: string | null;
    prodi: string | null;
    img_url: string | null;
    role: string;
    login_status: string;
    last_login: string | null;
    remember_token: string | null;
    created_at: string | null;
    updated_at: string | null;
    lab_id: number | null;
  };
}

export default async function HistoryItemsPage() {
  const session = await getServerSession(authConfig);

  // akan redirect jika blm login
  if (!session) {
    redirect("/");
  }

  // Data lab yang tersedia
  const dataLab: Lab[] = [
    { id: 1, name: "Elektronika" },
    { id: 2, name: "IDK" },
    { id: 3, name: "TAJ" },
    { id: 4, name: "RPL" },
    { id: 5, name: "TL" },
  ];

  try {
    // Fetch reserves data
    const reservesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/admin`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    if (!reservesResponse.ok) {
      console.error('Failed to fetch reserves data');
      return <HistoryAdmin session={session} historyData={[]} />;
    }

    const reservesData = await reservesResponse.json();

    // Fetch laboratories data
    const labsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/laboratories`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    let labsMap = new Map<number, string>();
    if (labsResponse.ok) {
      const labsData = await labsResponse.json();
      labsData.data?.forEach((lab: Lab) => {
        labsMap.set(lab.id, lab.name);
      });
    } else {
      // Fallback to hardcoded data
      dataLab.forEach((lab: Lab) => {
        labsMap.set(lab.id, lab.name);
      });
    }

    // Fetch subjects data
    const subjectsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/subjects`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    let subjectsMap = new Map<number, string>();
    if (subjectsResponse.ok) {
      const subjectsData = await subjectsResponse.json();
      subjectsData.data?.forEach((subject: { id: number; subject_name: string }) => {
        subjectsMap.set(subject.id, subject.subject_name);
      });
    }

    // Filter reserves with status "done" and map to BorrowHistory format
    const historyData: BorrowHistory[] = reservesData.data
      .filter((reserve: Reserve) => reserve.status === 'done')
      .map((reserve: Reserve) => ({
        id: reserve.id,
        itemName: reserve.inventories?.item_name || "Unknown Item",
        itemImage: reserve.inventories?.inventory_galleries?.[0]?.filepath || "/images/default_img_card.webp",
        borrowerName: reserve.reserve_user_created?.first_name && reserve.reserve_user_created?.last_name
          ? `${reserve.reserve_user_created.first_name} ${reserve.reserve_user_created.last_name}`
          : reserve.reserve_user_created?.username || "Unknown",
        borrowerNim: reserve.reserve_user_created?.nim || "",
        lab: labsMap.get(reserve.inventories?.labolatory_id || 0) || "Unknown Lab",
        borrowDate: reserve.tanggal ? new Date(reserve.tanggal).toLocaleDateString('id-ID') : "Unknown Date",
        returnDate: reserve.updated_at ? new Date(reserve.updated_at).toLocaleDateString('id-ID') : "Unknown Date",
        purpose: reserve.inventories?.type || "Unknown Purpose",
        status: "returned" as const,
      }));

    return <HistoryAdmin session={session} historyData={historyData} />;
  } catch (error) {
    console.error('Error fetching history data:', error);
    return <HistoryAdmin session={session} historyData={[]} />;
  }
}