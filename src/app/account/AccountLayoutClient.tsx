"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  LogOut,
  User,
} from "lucide-react"
import { SessionProvider } from "next-auth/react"

function AccountSidebar() {
  const { data: session } = useSession()

  const links = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "Orders", icon: ShoppingBag },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  ]

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="md:sticky md:top-24 space-y-1">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 border-b border-zinc-200">
          <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-semibold">
            {session?.user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  )
}

function AccountLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <AccountSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}

export default function AccountLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AccountLayoutContent>{children}</AccountLayoutContent>
    </SessionProvider>
  )
}
