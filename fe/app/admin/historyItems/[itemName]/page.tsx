import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import DetailHistory from "@/modules/History/detailHistory";

interface PageProps {
  params: {
    itemName: string;
  };
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

export default async function DetailHistoryPage({ params }: PageProps) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }

  // Decode item name dari URL
  const itemName = decodeURIComponent(params.itemName);

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
      return <DetailHistory session={session} itemName={itemName} borrowRecords={[]} />;
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

    // Fetch rooms data
    const roomsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/rooms`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: 'no-store'
    });

    let roomsMap = new Map<number, string>();
    if (roomsResponse.ok) {
      const roomsData = await roomsResponse.json();
      roomsData.data?.forEach((room: { id: number; name: string }) => {
        roomsMap.set(room.id, room.name);
      });
    }

    // Filter reserves with status "done" and matching item name, then map to BorrowRecord format
    const borrowRecords = reservesData.data
      .filter((reserve: Reserve) => reserve.status === 'done' && reserve.inventories?.item_name === itemName)
      .map((reserve: Reserve, index: number) => ({
        no: index + 1,
        borrowerName: reserve.reserve_user_created?.first_name && reserve.reserve_user_created?.last_name
          ? `${reserve.reserve_user_created.first_name} ${reserve.reserve_user_created.last_name}`
          : reserve.reserve_user_created?.username || "Unknown",
        borrowerId: reserve.reserve_user_created?.nim || reserve.reserve_user_created?.id?.toString() || "N/A",
        status: "Returned" as const,
        condition: (reserve.inventories?.condition === "good" ? "Good" : "Bad") as "Good" | "Bad",
        borrowDate: reserve.tanggal ? new Date(reserve.tanggal).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : "Unknown Date",
        // Additional fields for detail view
        itemName: reserve.inventories?.item_name || itemName,
        itemImage: reserve.inventories?.inventory_galleries?.[0]?.filepath || "",
        itemSerialNumber: reserve.inventories?.no_item || "N/A",
        lab: labsMap.get(reserve.inventories?.labolatory_id || 0) || "Unknown Lab",
        purpose: reserve.inventories?.type || "Unknown Purpose",
        session: `Session ${reserve.session_id || "N/A"}`,
        room: roomsMap.get(reserve.inventories?.room_id || 0) || "Unknown Room",
        personInCharge: reserve.pic || "N/A",
        subject: reserve.inventories?.inventory_subjects?.map(sub => subjectsMap.get(sub.subject_id) || `Subject ${sub.subject_id}`).join(", ") || "N/A",
        returnDate: reserve.updated_at ? new Date(reserve.updated_at).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : "Unknown Date",
      }));

    return (
      <DetailHistory
        session={session}
        itemName={itemName}
        borrowRecords={borrowRecords}
      />
    );
  } catch (error) {
    console.error('Error fetching detail history data:', error);
    return <DetailHistory session={session} itemName={itemName} borrowRecords={[]} />;
  }
}
