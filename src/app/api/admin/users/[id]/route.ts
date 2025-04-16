import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params; 
        if (!id) return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, phone: true, role: true },
        });

        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
      if (!id) return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
  
      const body = await req.json();
      const { name, email, phone, role, password, password_confirmation } = body;
  
      // Validate input
      if (!name || !email || !phone || !role) {
        return NextResponse.json({ success: false, message: "Name, email, phone, and role are required" }, { status: 400 });
      }
  
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(phone)) {
        return NextResponse.json({ success: false, message: "Invalid phone number. It must be 10 digits." }, { status: 400 });
      }
  
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
      }
  
      let updatedPassword = undefined;
  
      if (password && password === password_confirmation) {
        if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password)) {
          return NextResponse.json(
            { success: false, message: "Password must be at least 8 characters long, include at least one uppercase letter and one special character." },
            { status: 400 }
          );
        }
        updatedPassword = crypto.createHash("sha256").update(password).digest("hex");
      }
  
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          role,
          password: updatedPassword || undefined, 
        },
      });
  
      return NextResponse.json({ success: true, message: "User updated successfully.", data: updatedUser }, { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ success: false, message: "User ID is required" }, { status:400 });

        const body = await req.json();
        const { blocked } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { blocked },
        });

        return NextResponse.json({ success: true, message: `User ${blocked ? "blocked" : "unblocked"} successfully.`, data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ success: false, message: "Failed to update user status." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.delete({
        where: { id },
    });

    if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
}


