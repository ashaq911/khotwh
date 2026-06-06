import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { items, email, name, phone, address, city, governorate, notes, paymentMethod } = body;

    if (!items || !items.length || !email || !name || !address || !city || !governorate) {
      return NextResponse.json(
        { error: "Missing required fields: items, email, name, address, city, governorate" },
        { status: 400 }
      );
    }

    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
        image: item.image || (product.images && product.images[0]) || null,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        email,
        name,
        phone: phone || null,
        address,
        city,
        governorate,
        notes: notes || null,
        paymentMethod: paymentMethod || "cod",
        total,
        status: "pending",
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
