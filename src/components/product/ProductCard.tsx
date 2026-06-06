"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart, type CartItem } from "@/lib/store"
import { formatPrice, cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { ShoppingBag } from "lucide-react"

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  sku: string | null
  images: string
  sizes: string
  colors: string
  categoryId: string | null
  category: { id: string; name: string; slug: string } | null
  tags: string
  inStock: boolean
  isNew: boolean
  isFeatured: boolean
  createdAt: string
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCart((s) => s.addToCart)

  let images: string[] = []
  try {
    images = JSON.parse(product.images)
  } catch {
    images = []
  }

  let sizes: string[] = []
  try {
    sizes = JSON.parse(product.sizes)
  } catch {
    sizes = []
  }

  let colors: { name: string; hex: string }[] = []
  try {
    colors = JSON.parse(product.colors)
  } catch {
    colors = []
  }

  const imageSrc = images[0] || "/placeholder.svg"

  const handleAddToCart = () => {
    if (!product.inStock) return
    const item: CartItem = {
      id: `${product.id}-${Date.now()}`,
      name: product.name,
      price: product.price,
      image: imageSrc,
      quantity: 1,
      size: sizes[0] || null,
      color: colors[0]?.name || null,
      productId: product.id,
    }
    addToCart(item)
    toast.success("Added to cart!")
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">
            New &#x1F31F;
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded bg-white px-3 py-1 text-sm font-medium text-zinc-800">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            {product.category.name}
          </span>
        )}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.sku && (
          <p className="text-xs text-zinc-400">SKU: {product.sku}</p>
        )}

        <div className="flex items-center gap-2">
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <>
              <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
              <span className="text-xs text-zinc-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-zinc-900">{formatPrice(product.price)}</span>
          )}
        </div>

        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sizes.map((size) => (
              <span
                key={size}
                className="rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        {colors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="inline-block h-3.5 w-3.5 rounded-full border border-zinc-300"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            "mt-auto flex w-full items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-colors",
            product.inStock
              ? "bg-secondary text-white hover:bg-secondary-light"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400"
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {product.inStock ? "Add To Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  )
}
