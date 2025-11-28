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
  labolatory_id: number | null;
  laboratory_id?: number | null;
  img_url: string | null;
  subject_id: number[];
  inventory_subjects: Array<{
    id: number;
    inventory_id: number;
    subject_id: number;
    deleted_at: string | null;
    created_at?: string;
    updated_at?: string;
  }>;
  inventory_galleries?: Array<{
    filepath: string;
  }>;
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

  console.log("Inventory data:", inventory);
  console.log("Laboratory ID from inventory (labolatory_id):", inventory.labolatory_id);
  console.log("Laboratory ID from inventory (laboratory_id):", inventory.laboratory_id);

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
    if (labsRes.ok) {
      const labsData = await labsRes.json();
      labs = labsData.data || labsData.laboratories || [];
    }
  } catch (error) {
    console.error("Failed to fetch laboratories:", error);
  }

  try {
    if (roomsRes.ok) {
      const roomsData = await roomsRes.json();
      rooms = roomsData.data || roomsData.rooms || [];
    }
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }

  try {
    if (subjectsRes.ok) {
      const subjectsData = await subjectsRes.json();
      subjects = subjectsData.data ? subjectsData.data.map((item: { id: number; subject_name: string }) => ({ id: item.id, name: item.subject_name })) : [];
    }
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  // Log fetched labs data
  console.log("Fetched labs from API:", labs);
  console.log("Labs count:", labs.length);

  console.log("Final data before mapping:", { labs, rooms, subjects });
  console.log("Inventory subjects from inventory:", inventory.inventory_subjects);

  // Map inventory data to component format
  const itemData = {
    id: inventory.id,
    name: inventory.item_name,
    inventoryNumber: inventory.no_item,
    room: inventory.room_id?.toString() || "",
    laboratory: inventory.labolatory_id?.toString() || inventory.laboratory_id?.toString() || "",
    subject: inventory.inventory_subjects 
      ? (() => {
          // Get only the latest version of each subject (by subject_id)
          const latestSubjects = inventory.inventory_subjects.reduce((acc: any, sub: any) => {
            if (!acc[sub.subject_id] || new Date(sub.created_at) > new Date(acc[sub.subject_id].created_at)) {
              acc[sub.subject_id] = sub;
            }
            return acc;
          }, {});
          
          return Object.values(latestSubjects)
            .filter((sub: any) => !sub.deleted_at)
            .map((sub: any) => {
              const subject = subjects.find((s: { id: number; name: string }) => s.id === sub.subject_id);
              console.log(`Mapping subject_id ${sub.subject_id} to:`, subject);
              return subject ? subject.name : `Subject ${sub.subject_id}`;
            });
        })()
      : [],
    session: inventory.special_session ? "Session per Hour" : "2 Session",
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
