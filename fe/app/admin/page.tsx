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
  const rejectedItems = data.data.filter( (item: any) => item.status  === 'rejected')
  console.log("Ini ketolak: ", rejectedItems)
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
  if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData?.message || `HTTP ${res.status}: Failed to fetch profile`
          );
        }

        const dataUser = await res.json();
        const user = dataUser.datas;

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
        <HeroAdmin orders={data.data} borrowedItems={[]} labAdmin={user.lab_name} />
      </div>
    </div>
  );
}
