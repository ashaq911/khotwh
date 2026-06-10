export const dynamic = "force-dynamic"

import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminLayoutClient from "./AdminLayoutClient"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>
}
