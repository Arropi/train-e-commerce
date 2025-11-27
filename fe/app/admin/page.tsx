import { redirect } from "next/navigation";
import HeroAdmin from "../../modules/homeAdmin/heroAdmin";
import SidebarAdmin from "../../modules/sideBarAdmin/sideBarAdmin";
import { getServerSession } from "next-auth";
import { authConfig } from "../../lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/");

  const reserve = await fetch(`${
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"
  }/reserves/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  });
  const data = await reserve.json();
  console.log("RESERVE ADMIN: ", data);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <SidebarAdmin
        user={{
          name: session?.user?.name || "Admin",
          role: "Admin",
          avatar: session?.user?.image || undefined,
        }}
      />

      {/* Main Content */}
      <div className="flex-1">
        <HeroAdmin orders={data.data} borrowedItems={[]} />
      </div>
    </div>
  );
}
