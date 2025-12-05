import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SuperAdminProfile from "../../../modules/profileAdmin/superAdmin";

export default async function AdminProfile() {
  const session = await getServerSession(authConfig);
          const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040";
  if (!session) redirect('/');

  const res = await fetch(`${backendUrl}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
  console.log(session)
  if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData?.message || `HTTP ${res.status}: Failed to fetch profile`
          );
        }

        const data = await res.json();
        const user = data.datas;
  
  
  return (
    <>
        <SuperAdminProfile role={user.role} email={session.user.email ?? ''} name={session.user.name ?? ''} lab={user.lab_name} />
    </>
  );
}