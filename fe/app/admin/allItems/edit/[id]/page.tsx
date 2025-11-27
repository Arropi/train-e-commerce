import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import EditItems from "@/modules/AllItemsAdmin/EditItems";

interface PageProps {
  params: {
    id: string;
  };
}

interface InventoryData {
  id: number;
  item_name: string;
  no_item: string;
  condition: string;
  type: string;
  special_session: string;
  room_id: number | null;
  laboratory_id: number | null;
  img_url: string | null;
  subject_id: number[];
}

export default async function EditItemPage({ params }: PageProps) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user) {
    redirect("/");
  }

  // Await params in Next.js 15
  const { id } = await params;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";

  // Fetch all inventories
  const inventoryRes = await fetch(`${backendUrl}/inventories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  });

  if (!inventoryRes.ok) {
    redirect("/");
  }

  const inventoryResult = await inventoryRes.json();

  // Find item by ID
  const inventory = inventoryResult.inventories?.find((item: InventoryData) => item.id === parseInt(id));

  if (!inventory) {
    redirect("/admin/allItems");
  }

  // Fetch dropdown data
  const [labsRes, roomsRes, subjectsRes] = await Promise.all([
    fetch(`${backendUrl}/laboratories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    }),
    fetch(`${backendUrl}/rooms`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    }),
    fetch(`${backendUrl}/subjects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    }),
  ]);

  // Handle potential fetch failures gracefully
  let labs = [];
  let rooms = [];
  let subjects = [];

  try {
    labs = labsRes.ok ? (await labsRes.json()).data || (await labsRes.json()).laboratories || [] : [];
  } catch (error) {
    console.error("Failed to fetch laboratories:", error);
  }

  try {
    rooms = roomsRes.ok ? (await roomsRes.json()).rooms || [] : [];
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }

  try {
    subjects = subjectsRes.ok ? (await subjectsRes.json()).subjects || [] : [];
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  // Fallback dummy data if API fails (for testing)
  if (labs.length === 0) {
    labs = [
      { id: 1, name: "Lab Elektronika" },
      { id: 2, name: "Lab RPL" },
      { id: 3, name: "Lab IDK" },
      { id: 4, name: "Lab TAJ" }
    ];
  }

  if (rooms.length === 0) {
    rooms = [
      { id: 1, name: "Room 301" },
      { id: 2, name: "Room 302" },
      { id: 3, name: "Room 303" },
      { id: 4, name: "Room 304" }
    ];
  }

  if (subjects.length === 0) {
    subjects = [
      { id: 1, name: "Praktikum Pemrograman Komputer" },
      { id: 2, name: "Praktikum Basis Data" },
      { id: 3, name: "Praktikum Jaringan Komputer" },
      { id: 4, name: "Praktikum Sistem Operasi" }
    ];
  }

  console.log("Fetched data:", { labs, rooms, subjects });

  // Map inventory data to component format
  const itemData = {
    id: inventory.id,
    name: inventory.item_name,
    inventoryNumber: inventory.no_item,
    room: inventory.room_id?.toString() || "",
    laboratory: inventory.laboratory_id?.toString() || "",
    subject: inventory.inventory_subjects.filter((sub: { subject_id: number; deleted_at: string | null }) => !sub.deleted_at).map((sub: { subject_id: number; deleted_at: string | null }) => {
      const subject = subjects.find((s: { id: number; name: string }) => s.id === sub.subject_id);
      return subject ? subject.name : `Subject ${sub.subject_id}`;
    }),
    session: inventory.special_session ? "2 Session" : "Session per Hour",
    purpose: inventory.type === "praktikum" ? "Practical Class" : "Project",
    condition: mapCondition(inventory.condition),
    image: inventory.inventory_galleries?.[0]?.filepath || "https://placehold.co/150x150/png?text=Item",
  };

  return (
    <EditItems
      session={session}
      itemData={itemData}
    />
  );
}

// Helper functions
function mapCondition(condition: string): "Good" | "Bad" | "Fair" | "Excellent" {
  const conditionMap: { [key: string]: "Good" | "Bad" | "Fair" | "Excellent" } = {
    "good": "Good",
    "bad": "Bad", 
    "fair": "Fair",
    "excellent": "Excellent",
  };
  return conditionMap[condition.toLowerCase()] || "Good";
}
