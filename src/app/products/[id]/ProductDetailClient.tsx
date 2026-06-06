"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/lib/store"
import { Heart, Minus, Plus, Truck, Shield, RotateCcw, ChevronDown, ChevronUp } from "lucide-react"
import toast from "react-hot-toast"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice: number | null
  sku: string | null
  images: string
  sizes: string
  colors: string
  inStock: boolean
  category: { name: string; slug: string } | null
}

export default function ProductDetailClient() {
  const params = useParams()
  const addToCart = useCart((s) => s.addToCart)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        const colors = safeJsonParse(data.colors, [])
        if (colors.length > 0) setSelectedColor(colors[0])
        const sizes = safeJsonParse(data.sizes, [])
        if (sizes.length > 0) setSelectedSize(sizes[0])
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="animate-pulse">
            <div className="aspect-[4/5] bg-gray-200 rounded-xl" />
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Product not found.</p>
      </div>
    )
  }

  const images = safeJsonParse(product.images, [])
  const sizes = safeJsonParse(product.sizes, [])
  const colors = safeJsonParse(product.colors, [])

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error("This product is out of stock")
      return
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size")
      return
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select a color")
      return
    }

    addToCart({
      id: `${product.id}-${selectedSize || ""}-${selectedColor || ""}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || "",
      quantity,
      size: selectedSize,
      color: selectedColor,
    })
    toast.success("Added to cart!")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>

          {product.sku && (
            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Size {selectedSize && <span className="text-gray-500 font-normal">— {selectedSize}</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Color {selectedColor && <span className="text-gray-500 font-normal">— {selectedColor}</span>}
              </h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-gray-900 scale-110"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-medium min-w-[2rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setWishlisted(!wishlisted)}
              className={`p-3 border rounded-lg transition-colors ${
                wishlisted
                  ? "border-red-300 text-red-500 bg-red-50"
                  : "border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300"
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full mt-6 bg-gray-900 text-white font-semibold py-3.5 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {product.inStock ? "Add To Cart" : "Out of Stock"}
          </button>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-gray-400" />
              Free shipping on orders over 2,500 EGP
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-gray-400" />
              Secure checkout with Cash on Delivery
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              14-day return policy
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="w-full flex items-center justify-between py-4 text-sm font-medium text-gray-900"
            >
              Product Details
              {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {detailsOpen && (
              <div className="pb-4 text-sm text-gray-600 space-y-1">
                {product.sku && <p>SKU: {product.sku}</p>}
                {product.category && <p>Category: {product.category.name}</p>}
                {sizes.length > 0 && <p>Available Sizes: {sizes.join(", ")}</p>}
                {colors.length > 0 && <p>Available Colors: {colors.join(", ")}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function safeJsonParse(str: string, fallback: any) {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}
