'use client'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  console.log("Providers is running");
  return <SessionProvider>{children}</SessionProvider>
}