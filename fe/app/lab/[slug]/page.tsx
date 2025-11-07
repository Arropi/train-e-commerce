
import Navbar from "@/modules/Navbar/navbar";
import LabPage from "@/modules/labPage/labPage";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import FilterBar from "../../../components/FilterBar/FilterBar";

export default async function ItemPage({ params }: { params: { slug: string } }) {
  const { slug } = (await params) as { slug: string };

  const session = await getServerSession(authConfig);
  if (!session) redirect("/");


  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // handle error singkat (bisa redirect atau render fallback)
    redirect("/"); 
  }

  const result = await res.json();

  // langsung pass params.slug (tanpa useState/useEffect) ke client component
  return (
    <>
      <Navbar />
      <LabPage slug={slug} inventories={result.inventories} />
    </>
  );
}
