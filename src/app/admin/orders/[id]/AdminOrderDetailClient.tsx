"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, MapPin, CreditCard, User } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

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
  name: string
  email: string
  phone: string | null
  total: number
  status: string
  paymentMethod: string
  address: string
  city: string
  governorate: string
  notes: string | null
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

const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]

export default function AdminOrderDetailClient() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/orders/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setOrder(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [params.id])

  async function handleStatusChange(newStatus: string) {
    if (!order) return
    try {
      const res = await fetch(`/api/admin/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      })
      if (res.ok) {
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
        toast.success(`Status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
        <Package className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order not found</h2>
        <Link href="/admin/orders" className="text-sm text-zinc-900 underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-sm font-medium rounded-full px-3 py-1.5 border-none outline-none cursor-pointer ${
                statusColors[order.status] || "bg-zinc-100 text-zinc-800"
              }`}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Customer</p>
              <p className="text-sm text-zinc-600">{order.name}</p>
              <p className="text-sm text-zinc-600">{order.email}</p>
              {order.phone && <p className="text-sm text-zinc-600">{order.phone}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Shipping Address</p>
              <p className="text-sm text-zinc-600">{order.address}</p>
              <p className="text-sm text-zinc-600">
                {order.city}, {order.governorate}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-zinc-400 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Payment Method</p>
              <p className="text-sm text-zinc-600">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Items ({order.items.length})</h2>
        <div className="space-y-3">
          {order.items.map((item) => {
            const images = item.image ? JSON.parse(item.image) : []
            const imgSrc = Array.isArray(images) && images.length > 0 ? images[0] : null
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white border border-zinc-200 rounded-xl p-4"
              >
                <div className="w-16 h-16 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{item.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-1">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Subtotal</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-zinc-200">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <p className="font-medium text-sm mb-1">Order Notes</p>
          <p className="text-sm text-zinc-600">{order.notes}</p>
        </div>
      )}
    </div>
  )
}
