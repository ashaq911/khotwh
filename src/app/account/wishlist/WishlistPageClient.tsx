"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    images: string
    inStock: boolean
  }
}

export default function WishlistPageClient() {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleRemove(id: string) {
    try {
      const res = await fetch(`/api/wishlist?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <Heart className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-zinc-500 mb-6">Save items you love to your wishlist.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Wishlist</h1>
        <p className="text-zinc-500 mt-1">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const images = (() => {
            try {
              return JSON.parse(item.product.images)
            } catch {
              return []
            }
          })()
          const imgSrc = Array.isArray(images) && images.length > 0 ? images[0] : null

          return (
            <div
              key={item.id}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden"
            >
              <Link href={`/products/${item.product.id}`}>
                <div className="aspect-square bg-zinc-50 relative">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  {!item.product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 space-y-3">
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-medium text-sm hover:underline">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="font-semibold text-sm">{formatPrice(item.product.price)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 border border-zinc-200 rounded-lg py-2 text-sm font-medium hover:bg-zinc-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
