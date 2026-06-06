"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
  _count: {
    orders: number
  }
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-zinc-500 mt-1">{users.length} users</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Email</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Role</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500">Orders</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="py-3 px-4 font-medium">{user.name || "—"}</td>
                  <td className="py-3 px-4 text-zinc-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-600">
                    {new Date(user.createdAt).toLocaleDateString("en-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{user._count?.orders ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
