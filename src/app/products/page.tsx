export const dynamic = "force-dynamic"

import { Suspense } from "react"
import ProductsContentClient from "./ProductsContentClient"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="animate-pulse text-gray-400 text-center py-20">Loading products...</div></div>}>
      <ProductsContentClient />
    </Suspense>
  )
}
