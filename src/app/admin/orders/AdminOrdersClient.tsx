"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag, Eye } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

interface Order {
  id: string
  name: string
  total: number
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        )
        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Failed to update status")
    }
  }

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-zinc-500 mt-1">{orders.length} orders</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Order ID</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Total</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                <th className="text-right py-3 px-4 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
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
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-none outline-none cursor-pointer ${
                        statusColors[order.status] || "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
