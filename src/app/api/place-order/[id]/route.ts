import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }
    let userId;
    const { id } = params;
    try {
        const decoded: any = jwt.verify(token, SECRET);
        userId = decoded.id;
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 403 });
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                shippingInfo: true,
            },
        });

        if (!order) {
            return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
        }

        return new Response(
            JSON.stringify({ success: true, order: { ...order, orderItems: order.items } }),
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching order:", error);
        return new Response(
            JSON.stringify({ success: false, message: "An error occurred while fetching the order" }),
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    console.log("ID:", id);
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    try {
        const order = await prisma.order.findUnique({ where: { id } });

        if (!order) {
            return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
        }
        const cancelledOrder = await prisma.order.update({
            where: { id },
            data: { 
                status: "cancelled",
                cancelledAt: new Date()
            },

        });

        if (!cancelledOrder) {
            return new Response(JSON.stringify({ success: false, message: "Failed to cancel order" }), { status: 500 });
        }



        return new Response(JSON.stringify({ success: true, order }), { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return new Response(
            JSON.stringify({ success: false, message: "An error occurred while fetching the order" }),
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id;
    const { status } = await req.json();
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
