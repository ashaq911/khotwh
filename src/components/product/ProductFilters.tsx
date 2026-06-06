"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { Search } from "lucide-react"

const categories = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "accessories", label: "Accessories" },
  { value: "kids", label: "Kids" },
]

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
]

export default function ProductFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      params.set("page", "1")
      return params.toString()
    },
    [searchParams]
  )

  const handleCategoryChange = (slug: string, checked: boolean) => {
    if (checked) {
      router.push(pathname + "?" + createQueryString("category", slug))
    } else {
      router.push(pathname + "?" + createQueryString("category", ""))
    }
  }

  const handleSortChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("sort", value))
  }

  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "newest"
  const currentSearch = searchParams.get("search") || ""

  return (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Search</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const q = data.get("search") as string
            router.push(pathname + "?" + createQueryString("search", q))
          }}
          className="relative"
        >
          <input
            name="search"
            defaultValue={currentSearch}
            placeholder="Search products..."
            className="w-full rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-10 text-sm placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
              <input
                type="checkbox"
                checked={currentCategory === cat.value}
                onChange={(e) => handleCategoryChange(cat.value, e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
              />
              {cat.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900">
              <input
                type="radio"
                name="sort"
                checked={currentSort === opt.value}
                onChange={() => handleSortChange(opt.value)}
                className="h-4 w-4 border-zinc-300 text-primary focus:ring-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {currentCategory || currentSort !== "newest" || currentSearch ? (
        <button
          onClick={() => router.push(pathname)}
          className="w-full rounded-md border border-zinc-300 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
        >
          Clear Filters
        </button>
      ) : null}
    </aside>
  )
}
