"use client";

import { useEffect, useState } from "react";
import Navbar from "@/modules/Navbar/navbar";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useSidebar } from "@/contexts/SidebarContext";
import LabPage from "@/modules/labPage/labPage";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";


export default function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const session = await getServerSession(authConfig);
      console.log("Session in Lab Page:", session);
      const resolvedParams = await params;
      const data = await fetch('localhost:4040/inventories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.user.accessToken}}`,
        },
      });
      const items = await data.json();
      console.log("Fetched items:", items);
      setSlug(resolvedParams.slug);
      
    };
    getParams();
  }, [params]);

  

  return (
    <>
      <Navbar />
      <LabPage slug={slug} />
    </>
  );
}
