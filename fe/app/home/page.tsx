import Hero from "@/modules/home/hero";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../../modules/Navbar/navbar";
import { getDataRooms } from "../../data/rooms";
import { getDataSubjects } from "../../data/subjects";
import { getDataLaboratory } from "../../data/laboratory";

export default async function Home() {
  const session = await getServerSession(authConfig);
  
  console.log(session);
  if (!session) redirect("/");
  const rooms = await getDataRooms(session.user.accessToken);
  const subjects = await getDataSubjects(session.user.accessToken);
  const laboratories = await getDataLaboratory(session.user.accessToken);
  console.log(laboratories);

  return (
    <>
      {/* Navbar tetap tidak bergeser */}
      <Navbar />
      
      {/* Hero akan bergeser - wrapper ada di dalam Hero component */}
      <Hero session={session} laboratories={laboratories} />
    </>
  );
}
