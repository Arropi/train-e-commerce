import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import ViewAllPage from "@/modules/viewall";
import { notFound, redirect } from "next/navigation";
import Navbar from "../../../../modules/Navbar/navbar";
import { getDataSubjects } from "@/data/subjects";
import { getDataRooms } from "@/data/rooms";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ViewAllServerPage({ params }: PageProps) {
  const { slug } = (await params) as { slug: string };
  const session = await getServerSession(authConfig);
  
  // Validasi slug
  if (!["ongoing", "history"].includes(slug)) {
    notFound();
  }
  
  if (!session) {
    redirect("/login");
  }
  const subjects = await getDataSubjects(session.user.accessToken);
  const rooms = await getDataRooms(session.user.accessToken);
  const dataOngoing = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reserves/user/ongoing`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  }).then(res => res.json());
  console.log("Data ongoing: ", dataOngoing);
  const dataHistory = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reserves/user/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  }).then(res => res.json());
  console.log("Data history: ", dataHistory);

  // Dummy data dengan informasi lengkap


  const inventories = slug === "ongoing" ? dataOngoing : dataHistory;

  return (
    <>
      <Navbar />
      <ViewAllPage slug={slug} inventories={inventories.data} subjects={subjects} rooms={rooms} />
    </>
  );
}
