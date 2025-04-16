import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  let userId;
  try {
    const decoded: any = jwt.verify(token, SECRET);
    userId = decoded.id;
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        shippingInfo: true,
      },
    });

    return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while fetching orders" }),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const {
    cartItems,
    name,
    phone,
    city,
    addressDetails,
    paymentMethod,
    shippingMethod,
    shippingFee,
    totalAmount,
    totalOrderValue,
  } = await req.json();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  let userId;
  try {
    const decoded: any = jwt.verify(token, SECRET);
    userId = decoded.id;
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 403 });
  }

  if (!cartItems || !userId || !name || !phone || !city || !addressDetails || !paymentMethod) {
    return new Response(
      JSON.stringify({ success: false, message: "Missing required fields" }),
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          paymentMethod,
          shippingMethod,
          shippingFee,
          totalAmount,
          totalOrderValue,
          items: {
            create: cartItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
          shippingInfo: {
            create: {
              name,
              phone,
              city,
              addressDetails,
            },
          },
        },
      });
      

    return new Response(JSON.stringify({ success: true, order }), { status: 200 });
  } catch (error) {
    console.error("Error placing order:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while placing the order" }),
      { status: 500 }
    );
  }
}
