import { redirect } from "next/navigation";
import { authConfig } from "../../../lib/auth";
import { getServerSession } from "next-auth/next";
import AllItemsAdmin from "../../../modules/AllItemsAdmin/allItems";

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

  // Pass raw inventories data to client component (assuming result is { inventories: [...] })
  const inventories = result.inventories || [];
  console.log("Barang nya: ", inventories);

  return <AllItemsAdmin session={session} inventories={inventories} />;
}
