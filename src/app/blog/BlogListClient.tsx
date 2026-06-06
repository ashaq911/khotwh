"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, ArrowRight, FileText } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  author: string
  createdAt: string
}

export default function BlogListClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold">Khotwh Blog</h1>
        <p className="text-zinc-500 mt-2 max-w-md mx-auto">
          Style inspiration, fashion tips, and the latest trends from Egypt.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-zinc-500">Check back soon for new articles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="aspect-[16/9] bg-zinc-100 overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-semibold leading-snug hover:underline">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 hover:underline"
                >
                  READ & SHOP <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
