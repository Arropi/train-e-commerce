import { redirect } from "next/dist/server/api-utils";
import { authConfig } from "../../../lib/auth";
import { getServerSession } from "next-auth/next";
import AllItemsAdmin from "../../../modules/AllItemsAdmin/allItems";

export default async function AllItemsPage() {
  const session = await getServerSession(authConfig);

  // akan redirect jika blm login
  if (!session) {
    redirect("/");
  }

  // tempat buat fetch data

  // dummy data sementara
  const item = [
    {
      id: 1,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW08",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 2,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW09",
      category: "Measurement",
      condition: "good" as const,
      status: "on_loan" as const,
    },
    {
      id: 3,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW10",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 4,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW11",
      category: "Measurement",
      condition: "excellent" as const,
      status: "available" as const,
    },
    {
      id: 5,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW12",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 6,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW13",
      category: "Measurement",
      condition: "good" as const,
      status: "maintenance" as const,
    },
    {
      id: 7,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW14",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 8,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW15",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 9,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW16",
      category: "Measurement",
      condition: "good" as const,
      status: "available" as const,
    },
    {
      id: 10,
      name: "Osiloskop Analog GW Instek GOS 620",
      lab: "Lab RPL",
      image:
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
      serialNumber: "IDK-KACIIW17",
      category: "Measurement",
      condition: "fair" as const,
      status: "available" as const,
    },
  ];

  return <AllItemsAdmin session={session} items={item} />;
}
