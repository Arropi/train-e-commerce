import Hero from "@/modules/home/hero";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../../../modules/Navbar/navbar";
import { getDataRooms } from "../../../data/rooms";
import { getDataSubjects } from "../../../data/subjects";
import { getDataLaboratory } from "../../../data/laboratory";

export default async function Home() {
  const session = await getServerSession(authConfig);
  
  console.log(session);
  if (!session) redirect("/");
  const rooms = await getDataRooms(session.user.accessToken);
  const subjects = await getDataSubjects(session.user.accessToken);
  const laboratories = await getDataLaboratory(session.user.accessToken);
  console.log(laboratories);
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

  return (
    <>
      {/* Navbar tetap tidak bergeser */}
      <Navbar />
      
      {/* Hero akan bergeser - wrapper ada di dalam Hero component */}
      <Hero session={session} laboratories={laboratories} onGoing={dataOngoing.data} history={dataHistory.data} subjects={subjects}/>
    </>
  );
}
