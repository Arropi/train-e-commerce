import Profile from "@/modules/profile";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Navbar from "@/modules/Navbar/navbar";
import FooterComponent from "../../components/Footer/footer";

export default async function ProfilePage() {
  const session = await getServerSession(authConfig);
  console.log(session)
  
  // Redirect ke halaman login jika tidak ada session
  if (!session) redirect('/');
  
  return (
    <>
      <Navbar />
      <Profile />
    </>
  );
}