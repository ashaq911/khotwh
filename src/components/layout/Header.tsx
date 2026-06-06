"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Menu, X, User, Heart, ShoppingBag, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/store"
import { cn } from "@/lib/utils"

const COUNTDOWN_TARGET = 6 * 60 * 60

const categories = [
  {
    name: "Women",
    slug: "women",
    children: [
      "T-shirt", "Top", "Long Sleeve", "Jacket", "Sweatshirts",
      "Shirts & Blouses", "Pullover", "Cardigan", "Set & Dress",
      "Pants", "Skirts",
    ],
  },
  { name: "Men", slug: "men", children: ["T-Shirts", "Pants", "Shorts", "Shirts", "Sweatshirts", "Sets", "Pullover"] },
  { name: "Kids", slug: "kids", children: [] },
  { name: "Accessories", slug: "accessories", children: ["Bags", "Belts", "Scarves", "Socks"] },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_TARGET)
  const [mounted, setMounted] = useState(false)
  const totalItems = useCart((s) => s.totalItems())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, "0")}س ${String(m).padStart(2, "0")}د ${String(sec).padStart(2, "0")}ث`
  }

  const cartCount = mounted ? totalItems : 0

  return (
    <header className={cn("sticky top-0 z-50 w-full bg-white transition-shadow", scrolled && "shadow-md")}>
      {/* Top bar */}
      <div className="bg-secondary py-1.5 text-center text-xs font-medium text-white">
        شحن مجاني لو اشتريت بـ 2,500 ج.م &mdash; <span className="text-primary-light" dir="ltr">{formatTime(timeLeft)}</span>
      </div>

      {/* Middle */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-secondary">
          Khotwh
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex md:flex-1 md:max-w-md md:mx-8">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-zinc-300 bg-zinc-50 py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden md:block text-zinc-600 hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden text-zinc-600 hover:text-primary transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/account/wishlist" className="text-zinc-600 hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative text-zinc-600 hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenu(true)}
            className="lg:hidden text-zinc-600 hover:text-primary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search - mobile */}
      {searchOpen && (
        <div className="border-t border-zinc-200 px-4 py-2 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-zinc-300 bg-zinc-50 py-2 pl-4 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="hidden border-t border-zinc-200 bg-white lg:block">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-1 px-4">
          {categories.map((cat) => (
            <li key={cat.slug} className="group relative">
              <Link
                href={`/products?category=${cat.slug}`}
                className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
              >
                {cat.name}
                {cat.children.length > 0 && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
              {cat.children.length > 0 && (
                <div className="absolute left-0 top-full z-40 hidden w-max min-w-[200px] rounded-b-lg border border-zinc-200 bg-white p-4 shadow-lg group-hover:block">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {cat.children.map((child) => (
                      <Link
                        key={child}
                        href={`/products?category=${cat.slug}&subcategory=${child.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-sm text-zinc-600 hover:text-primary transition-colors"
                      >
                        {child}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
          <li>
            <Link
              href="/products?sort=newest"
              className="block px-4 py-3 text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
            >
              New Arrivals
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="block px-4 py-3 text-sm font-medium text-zinc-700 hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile slide-out */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenu(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
              <span className="text-lg font-bold">Menu</span>
              <button onClick={() => setMobileMenu(false)} className="text-zinc-500 hover:text-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenu(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                    {cat.children.length > 0 && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-zinc-200 pl-3">
                        {cat.children.map((child) => (
                          <li key={child}>
                            <Link
                              href={`/products?category=${cat.slug}&subcategory=${child.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={() => setMobileMenu(false)}
                              className="block rounded-md px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-primary transition-colors"
                            >
                              {child}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/products?sort=newest"
                    onClick={() => setMobileMenu(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-primary transition-colors"
                  >
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    onClick={() => setMobileMenu(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="border-t border-zinc-200 px-4 py-4">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenu(false)}
                className="flex items-center gap-2 text-sm text-zinc-600 hover:text-primary transition-colors"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
