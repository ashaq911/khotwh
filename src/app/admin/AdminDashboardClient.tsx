"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Eye,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  name: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/users"),
        ])

        if (productsRes.ok) {
          const data = await productsRes.json()
          const products = Array.isArray(data) ? data : data.products || []
          setStats((s) => ({ ...s, totalProducts: products.length }))
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json()
          const orders = Array.isArray(data) ? data : []
          setRecentOrders(orders.slice(0, 5))
          const revenue = orders.reduce(
            (sum: number, o: Order) =>
              o.status === "DELIVERED" ? sum + o.total : sum,
            0
          )
          setStats((s) => ({
            ...s,
            totalOrders: orders.length,
            totalRevenue: revenue,
          }))
        }
        if (usersRes.ok) {
          const data = await usersRes.json()
          const users = Array.isArray(data) ? data : []
          setStats((s) => ({ ...s, totalUsers: users.length }))
        }
      } catch {
        console.error("Failed to load admin dashboard data")
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

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your store.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Product</span>
          </div>
          <Eye className="w-4 h-4 text-zinc-400" />
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">View Orders</span>
          </div>
          <Eye className="w-4 h-4 text-zinc-400" />
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-zinc-500">
            No orders yet
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Order</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4 font-mono text-xs">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4">{order.name}</td>
                    <td className="py-3 px-4 text-zinc-600">
                      {new Date(order.createdAt).toLocaleDateString("en-EG")}
                    </td>
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
    </div>
  )
}
