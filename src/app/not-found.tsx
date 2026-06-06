import Link from "next/link"
import { Home, Search } from "lucide-react"

export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-8xl font-bold text-gray-200">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page not found</h2>
      <p className="text-gray-500 mt-2 text-center max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <div className="flex gap-4 mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Home
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    </div>
  )
}
