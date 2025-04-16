import { NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; 


export async function GET(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  const userId = getUserIdFromToken(token);
  if (!userId) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });

  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: {
      products: {
        include: {
          product: true, 
        },
      },
    },
  });

  return NextResponse.json({ success: true, cart });
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();
  if (!productId || quantity <= 0) {
    return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
  }

  const userId = getUserIdFromToken(token);
  if (!userId) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
  }

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  const existingItem = await prisma.cartProduct.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await prisma.cartProduct.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartProduct.create({
      data: { cartId: cart.id, productId, quantity },
    });
  }

  return NextResponse.json({ success: true, message: "Added to cart" });
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const userId = getUserIdFromToken(token);
    if (!userId) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });

    const { productId, quantity } = await req.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    await prisma.cart.update({
      where: { userId },
      data: {
        products: {
          updateMany: {
            where: { productId },
            data: { quantity },
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const userId = getUserIdFromToken(token);
    if (!userId) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 });
    }

    await prisma.cart.update({
      where: { userId },
      data: {
        products: {
          deleteMany: { productId },
        },
      },
    });

    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
