"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Heart,
  Package,
  ArrowRight,
  Clock,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size: string | null
  color: string | null
  image: string | null
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function AccountDashboardClient() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/wishlist"),
        ])
        if (ordersRes.ok) {
          const data = await ordersRes.json()
          setOrders(data)
        }
        if (wishlistRes.ok) {
          const data = await wishlistRes.json()
          setWishlistCount(data.length)
        }
      } catch {
        console.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {session?.user?.name || "Valued Customer"}
        </h1>
        <p className="text-zinc-500 mt-1">Here&apos;s your account overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-zinc-500">Total Orders</p>
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-zinc-900" />
          </div>
          <div>
            <p className="text-2xl font-bold">{wishlistCount}</p>
            <p className="text-sm text-zinc-500">Wishlist Items</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Orders
          </h2>
          {orders.length > 0 && (
            <Link
              href="/account/orders"
              className="text-sm font-medium text-zinc-900 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {recentOrders.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center">
            <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500">No orders yet</p>
            <Link
              href="/products"
              className="inline-block mt-3 text-sm font-medium text-zinc-900 underline"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="font-mono text-xs text-zinc-900 hover:underline"
                      >
                        #{order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {new Date(order.createdAt).toLocaleDateString("en-EG")}
                    </td>
                    <td className="py-3 px-4 text-zinc-600">{order.items.length}</td>
                    <td className="py-3 px-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.status] || "bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">All Orders</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/account/wishlist"
          className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5" />
            <span className="font-medium">Wishlist</span>
          </div>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
