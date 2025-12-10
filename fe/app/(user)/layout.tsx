import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserLayout({
  children
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authConfig);
    if (!session) {
        redirect('/');
    }
    if(session.user.role === 'Admin'){
        redirect('/admin')
    }
    return (
        <>
            {children}
        </>
    )
}