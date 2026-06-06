import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await prisma.$connect()
    const count = await prisma.product.count()
    return NextResponse.json({ connected: true, productCount: count })
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: error.message,
      code: error.code,
      name: error.name,
    }, { status: 500 })
  }
}
