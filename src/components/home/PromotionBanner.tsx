import Link from "next/link"
import { Tag } from "lucide-react"

export default function PromotionBanner() {
  return (
    <section className="bg-gradient-to-r from-red-600 via-red-500 to-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-white/20 p-3 rounded-full">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Buy 2 Get 1 Free</h2>
              <p className="text-red-100 mt-1">On all accessories. Mix and match your style!</p>
            </div>
          </div>
          <Link
            href="/products?category=accessories"
            className="inline-flex items-center gap-2 bg-white text-red-600 font-semibold px-8 py-3 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Shop Accessories
          </Link>
        </div>
      </div>
    </section>
  )
}
