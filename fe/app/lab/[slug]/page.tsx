
import Navbar from "@/modules/Navbar/navbar";
import LabPage from "@/modules/labPage/labPage";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDataLaboratory } from "@/data/laboratory";
import { getDataSubjects } from "@/data/subjects";
import { getDataRooms } from "@/data/rooms";
import { format } from "date-fns";
import { Inventory } from "@/types";
import { getDataTimeSession } from "@/data/timeSession";

export default async function ItemPage({ params }: { params: { slug: string } }) {
  const { slug } = (await params) as { slug: string };

  const session = await getServerSession(authConfig);
  if (!session) redirect("/");
  const today = format(new Date(), "yyyy-MM-dd")
  const [laboratories, subjects, rooms, inventories, timeSessions, reserves] = await Promise.all([
    getDataLaboratory(session.user.accessToken),
    getDataSubjects(session.user.accessToken),
    getDataRooms(session.user.accessToken),
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/inventories/${slug}?tanggal=${today}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    }).then((res) => res.json()),
    getDataTimeSession(session.user.accessToken),
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4040"}/reserves/${slug}?tanggal=${today}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
      cache: "no-store",
    }).then((res) => res.json()),
  ]);
  const result = {} as any
  inventories.inventories.forEach((items: Inventory)=>{
    // console.log("Items Iterasi: ", items)
    if(!result[items.item_name.toLowerCase()]){
      result[items.item_name.toLowerCase()] = {
        item_name: items.item_name,
        details: [],
        status: "Not Available"
      }
    }
    if(items.status === "Available") {
      result[items.item_name.toLowerCase()]["status"] = "Available"
    }
    result[items.item_name.toLowerCase()]["details"].push({
      id: items.id,
      no_item: items.no_item,
      special_session: items.special_session,
    })
  })

  return (
    <>
      <Navbar />
      <LabPage slug={slug} inventories={inventories.inventories} laboratories={laboratories} subjects={subjects} rooms={rooms} timeSessions={timeSessions} reserves={reserves.data}/>
    </>
  );
}
