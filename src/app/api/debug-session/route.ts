import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()

  return Response.json({
    hasSession: !!session,
    user: session?.user ?? null,
  })
}
