"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

function getCallbackUrl() {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    return params.get("callbackUrl") || "/"
  }
  return "/"
}

export default function LoginPageClient() {
  const router = useRouter()
  const [callbackUrl, setCallbackUrl] = useState("/")

  useEffect(() => {
    setCallbackUrl(getCallbackUrl())
  }, [])

  const [form, setForm] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error("Invalid email or password")
        setLoading(false)
        return
      }
      toast.success("Welcome back!")
      await router.push(callbackUrl)
      router.refresh()
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Sign In</h1>
        <p className="text-gray-500 text-center mt-2 text-sm">Welcome back to Khotwh</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button type="button" onClick={() => toast("Password reset link sent to your email (demo)")}
              className="text-sm text-gray-600 hover:text-gray-900 underline">Forgot password?</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-gray-900 underline hover:text-gray-700">Create one</Link>
        </p>
      </div>
    </div>
  )
}
