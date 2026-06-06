"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice: number | null
  sku: string | null
  images: string
  inStock: boolean
  category: { name: string } | null
  createdAt: string
}

export default function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryFilter) params.set("category", categoryFilter)
    params.set("limit", "100")

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, categoryFilter])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success("Product deleted")
      } else {
        toast.error("Failed to delete product")
      }
    } catch {
      toast.error("Failed to delete product")
    }
  }

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
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-zinc-500 mt-1">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm flex-1"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug || cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Product</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Price</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Stock</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Category</th>
                <th className="text-right py-3 px-4 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const images = (() => {
                  try {
                    return JSON.parse(product.images)
                  } catch {
                    return []
                  }
                })()
                const imgSrc = Array.isArray(images) && images.length > 0 ? images[0] : null
                return (
                  <tr key={product.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                          {imgSrc ? (
                            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-zinc-500">
                      {product.sku || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-zinc-400 line-through ml-1">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {product.category?.name || "-"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
