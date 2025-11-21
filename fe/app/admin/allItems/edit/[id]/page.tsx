import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/lib/auth";
import EditItems from "@/modules/AllItemsAdmin/EditItems";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditItemPage({ params }: PageProps) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/");
  }

  // TODO: Fetch item data dari API berdasarkan ID
  // const itemData = await fetch(`/api/items/${params.id}`)

  // Dummy data sementara
  const dummyItems = [
    {
      id: 1,
      name: "Osiloskop Analog GW Instek GOS 620",
      inventoryNumber: "INV-2024-001",
      room: "R301",
      laboratory: "Lab Elektronika",
      subject: ["Praktikum Elektronika Dasar", "Praktikum Instrumentasi"],
      session: "2 Session",
      purpose: "Practical Class",
      condition: "Good",
      image: "https://placehold.co/150x150/png?text=Oscilloscope",
    },
    {
      id: 2,
      name: "Multimeter Digital Fluke 87V",
      inventoryNumber: "INV-2024-002",
      room: "R302",
      laboratory: "Lab IDK",
      subject: ["Praktikum Pemrograman Komputer"],
      session: "Session per Hour",
      purpose: "Project",
      condition: "Good",
      image: "https://placehold.co/150x150/png?text=Multimeter",
    },
    {
      id: 3,
      name: "Function Generator 20MHz",
      inventoryNumber: "INV-2024-003",
      room: "R303",
      laboratory: "Lab RPL",
      subject: ["Praktikum Basis Data", "Praktikum Web Programming"],
      session: "2 Session",
      purpose: "Practical Class",
      condition: "Bad",
      image: "https://placehold.co/150x150/png?text=Generator",
    },
  ];

  // Find item berdasarkan ID
  const itemData = dummyItems.find((item) => item.id === parseInt(params.id));

  if (!itemData) {
    redirect("/admin/allItems");
  }

  return <EditItems session={session} itemData={itemData} />;
}
