"use client"

import Image from "next/image"
import { Plus, Minus, Trash2 } from "lucide-react"
import { useCart, type CartItem } from "@/lib/store"
import { formatPrice } from "@/lib/utils"

export default function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 border-b border-zinc-200 py-4 last:border-b-0">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-zinc-900">{item.name}</h3>
          {(item.size || item.color) && (
            <p className="mt-0.5 text-xs text-zinc-500">
              {item.size && <span>Size: {item.size}</span>}
              {item.size && item.color && <span> | </span>}
              {item.color && <span>Color: {item.color}</span>}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (item.quantity <= 1) {
                  removeFromCart(item.productId, item.size, item.color)
                } else {
                  updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-zinc-900">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              onClick={() => removeFromCart(item.productId, item.size, item.color)}
              className="text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
