import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  // Debug: return JSON instead of redirecting
  if (pathname === "/debug-middleware") {
    return NextResponse.json({
      hasSession: isLoggedIn,
      user: req.auth?.user ?? null,
      url: req.url,
      pathname,
    })
  }

  if (pathname.startsWith("/account") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url))
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/debug-middleware"],
}
