import { redirect } from "next/navigation";
import { authConfig } from "../../../lib/auth";
import { getServerSession } from "next-auth/next";
import AllItemsAdmin from "../../../modules/AllItemsAdmin/allItems";

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

export default async function AllItemsPage() {
  const session = await getServerSession(authConfig);

  // akan redirect jika blm login
  if (!session || !session.user) {
    redirect("/");
  }

  // tempat buat fetch data
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/");
  }

  const result = await res.json();

  // Map API data to component format
  const items = result.inventories?.map((inventory: InventoryData) => ({
    id: inventory.id,
    name: inventory.item_name,
    lab: inventory.laboratory_id ? getLabName(inventory.laboratory_id) : "Unknown Lab",
    image: inventory.img_url || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop", // fallback image
    serialNumber: inventory.no_item,
    category: inventory.type || "Unknown",
    condition: mapCondition(inventory.condition),
    status: "available" as const, // Default status, you might want to add status logic later
  })) || [];

  // Helper function to map lab ID to lab name
  function getLabName(labId: number): string {
    const labMap: { [key: number]: string } = {
      1: "Lab IDK",
      2: "Lab Elektronika", 
      3: "Lab RPL",
      4: "Lab TAJ",
    };
    return labMap[labId] || "Unknown Lab";
  }

  // Helper function to map condition
  function mapCondition(condition: string): "good" | "bad" | "fair" | "excellent" {
    const conditionMap: { [key: string]: "good" | "bad" | "fair" | "excellent" } = {
      "good": "good",
      "bad": "bad", 
      "fair": "fair",
      "excellent": "excellent",
    };
    return conditionMap[condition.toLowerCase()] || "good";
  }

  return <AllItemsAdmin session={session} items={items} />;
}
