"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, FileText } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image: string | null
  author: string
  createdAt: string
}

export default function BlogPostClient() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!params.slug) return
    fetch(`/api/blog/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setPost(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <FileText className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Post not found</h2>
        <Link href="/blog" className="text-sm text-zinc-900 underline">
          Back to blog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to blog
      </Link>

      <article className="space-y-8">
        {post.image && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("en-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>
        </div>

        <div className="prose prose-zinc max-w-none leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  )
}
