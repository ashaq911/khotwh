"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  images: string
  sku: string | null
  inStock: boolean
  isNew: boolean
  sizes: string
  colors: string
  category: { name: string; slug: string } | null
}

interface Category {
  id: string
  name: string
  slug: string
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export default function ProductsContentClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const category = searchParams.get("category") || ""
  const search = searchParams.get("search") || ""
  const sort = searchParams.get("sort") || "newest"
  const page = parseInt(searchParams.get("page") || "1")

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set("category", category)
      if (search) params.set("search", search)
      if (sort) params.set("sort", sort)
      params.set("page", String(page))
      params.set("limit", "12")

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, search, sort, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    router.push(`/products?${params.toString()}`)
  }

  function safeJsonParse(str: string, fallback: any) {
    try { return JSON.parse(str) } catch { return fallback }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          {!loading && <p className="text-gray-500 mt-1">Showing {products.length} of {total} products</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: "1" })}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`w-64 shrink-0 ${sidebarOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto lg:static lg:z-auto lg:bg-transparent" : "hidden lg:block"}`}>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden mb-4 flex items-center gap-2 text-sm text-gray-500">
              <X className="w-4 h-4" /> Close
            </button>
          )}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParams({ search: (e.target as HTMLInputElement).value, page: "1" })
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={category === ""}
                  onChange={() => updateParams({ category: "", page: "1" })}
                  className="accent-gray-900"
                />
                All Categories
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat.slug}
                    onChange={() => updateParams({ category: cat.slug, page: "1" })}
                    className="accent-gray-900"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200 rounded-xl" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {products.map((product) => {
                  const images = safeJsonParse(product.images, [])
                  const sizes = safeJsonParse(product.sizes, [])
                  const colors = safeJsonParse(product.colors, [])
                  return (
                    <Link key={product.id} href={`/products/${product.id}`} className="group">
                      <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative">
                        {images[0] ? (
                          <Image src={images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                        )}
                        {product.isNew && <span className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded">New</span>}
                        {!product.inStock && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">Out of stock</span>}
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 uppercase">{product.category?.name || "Category"}</p>
                        <h3 className="text-sm font-medium text-gray-900 mt-0.5">{product.name}</h3>
                        {product.sku && <p className="text-xs text-gray-400">SKU: {product.sku}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-xs text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</span>
                          )}
                        </div>
                        {sizes.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {sizes.slice(0, 4).map((s: string) => (
                              <span key={s} className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-gray-500">{s}</span>
                            ))}
                          </div>
                        )}
                        {colors.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {colors.slice(0, 4).map((c: string) => (
                              <span key={c} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c.toLowerCase() }} />
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button onClick={() => updateParams({ page: String(page - 1) })} disabled={page <= 1} className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => updateParams({ page: String(p) })} className={`w-9 h-9 text-sm rounded-lg border ${p === page ? "bg-gray-900 text-white border-gray-900" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => updateParams({ page: String(page + 1) })} disabled={page >= pages} className="p-2 border border-gray-300 rounded-lg disabled:opacity-30 hover:bg-gray-50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
