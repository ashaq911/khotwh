"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface Category {
  id: string
  name: string
}

export default function AdminEditProductClient() {
  const params = useParams()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    categoryId: "",
    images: "",
    sizes: "",
    colors: "",
    inStock: true,
    isNew: false,
    isFeatured: false,
  })

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((product) => {
        const parseArray = (val: string) => {
          try {
            const arr = JSON.parse(val)
            return Array.isArray(arr) ? arr.join(", ") : val
          } catch {
            return val
          }
        }
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          compareAtPrice: product.compareAtPrice?.toString() || "",
          sku: product.sku || "",
          categoryId: product.categoryId || "",
          images: parseArray(product.images || "[]"),
          sizes: parseArray(product.sizes || "[]"),
          colors: parseArray(product.colors || "[]"),
          inStock: product.inStock ?? true,
          isNew: product.isNew ?? false,
          isFeatured: product.isFeatured ?? false,
        })
      })
      .catch(() => toast.error("Failed to load product"))
      .finally(() => setLoading(false))
  }, [params.id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast.error("Name and price are required")
      return
    }

    setSubmitting(true)
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        sku: form.sku,
        categoryId: form.categoryId || null,
        images: JSON.stringify(
          form.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        ),
        sizes: JSON.stringify(
          form.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        ),
        colors: JSON.stringify(
          form.colors
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        ),
        inStock: form.inStock,
        isNew: form.isNew,
        isFeatured: form.isFeatured,
      }

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success("Product updated successfully")
        router.push("/admin/products")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update product")
      }
    } catch {
      toast.error("Failed to update product")
    } finally {
      setSubmitting(false)
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
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>

      <div>
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-zinc-500 mt-1">{form.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare at Price</label>
            <input
              type="number"
              name="compareAtPrice"
              value={form.compareAtPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Image URLs (comma-separated)</label>
            <input
              type="text"
              name="images"
              value={form.images}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Colors (comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={form.colors}
              onChange={handleChange}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="inStock"
              checked={form.inStock}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={form.isNew}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Featured</span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {submitting ? "Saving..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
