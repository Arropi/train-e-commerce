import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import AddItemForm from "@/modules/AllItemsAdmin/AddItemForm";

export default async function AddItemPage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }

  return <AddItemForm session={session} />;
}