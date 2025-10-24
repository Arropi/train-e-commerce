import Hero from "@/modules/home/hero";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "../../modules/Navbar/navbar";

export default async function Home() {
  const session = await getServerSession(authConfig);
  console.log(session);
  if (!session) redirect("/");
  return (
    <>
      {/* Navbar tetap tidak bergeser */}
      <Navbar />
      
      {/* Hero akan bergeser - wrapper ada di dalam Hero component */}
      <Hero session={session} />
    </>
  );
}
