"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, FileText, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

interface BlogPost {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
}

export default function AdminBlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "Khotwh",
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/blog")
      if (res.ok) {
        const data = await res.json()
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setForm({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      author: "Khotwh",
      published: false,
    })
    setEditingId(null)
    setShowForm(false)
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!form.title || !form.content) {
      toast.error("Title and content are required")
      return
    }

    setSubmitting(true)
    try {
      const slug =
        form.slug ||
        form.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-")
          .replace(/^-+|-+$/g, "")

      const url = editingId
        ? `/api/admin/blog`
        : `/api/admin/blog`
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId && { id: editingId }),
          title: form.title,
          slug,
          content: form.content,
          excerpt: form.excerpt,
          image: form.image || null,
          author: form.author,
          published: form.published,
        }),
      })

      if (res.ok) {
        toast.success(editingId ? "Post updated" : "Post created")
        resetForm()
        await fetchPosts()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save post")
      }
    } catch {
      toast.error("Failed to save post")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEdit(post: BlogPost) {
    try {
      const res = await fetch(`/api/blog/${post.slug}`)
      if (res.ok) {
        const data = await res.json()
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || "",
          image: data.image || "",
          author: data.author,
          published: data.published,
        })
        setEditingId(data.id)
        setShowForm(true)
      }
    } catch {
      toast.error("Failed to load post")
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/blog`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast.success("Post deleted")
        await fetchPosts()
      } else {
        toast.error("Failed to delete post")
      }
    } catch {
      toast.error("Failed to delete post")
    }
  }

  async function handleTogglePublished(post: BlogPost) {
    try {
      const res = await fetch(`/api/admin/blog`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          published: !post.published,
        }),
      })
      if (res.ok) {
        toast.success(`Post ${post.published ? "unpublished" : "published"}`)
        await fetchPosts()
      }
    } catch {
      toast.error("Failed to update post")
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
          <h1 className="text-2xl font-semibold">Blog</h1>
          <p className="text-zinc-500 mt-1">{posts.length} posts</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4"
        >
          <h2 className="font-semibold">
            {editingId ? "Edit Post" : "New Post"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Content *</label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={8}
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-zinc-900 resize-none font-mono text-xs"
                required
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Published</span>
          </label>
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-zinc-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 && !showForm ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <FileText className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-500">No posts yet</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Title</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Slug</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Date</th>
                <th className="text-right py-3 px-4 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="py-3 px-4 font-medium">{post.title}</td>
                  <td className="py-3 px-4 font-mono text-xs text-zinc-500">{post.slug}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {post.published ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {new Date(post.createdAt).toLocaleDateString("en-EG")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleTogglePublished(post)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
