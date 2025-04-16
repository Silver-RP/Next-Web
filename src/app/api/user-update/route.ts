import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const SECRET_KEY = process.env.JWT_SECRET as string;
        if (!SECRET_KEY) {
            throw new Error("Missing JWT_SECRET in environment variables");
        }

        const decoded: any = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
        }

        const { name, phone, password, new_password, new_password_confirmation } = await req.json();

        if (!/^\d{10}$/.test(phone)) {
            return NextResponse.json({ success: false, message: "Invalid phone number. It must be 10 digits." }, { status: 400 });
        }

        if (password || new_password || new_password_confirmation) {
            if (!password || !new_password || !new_password_confirmation) {
                return NextResponse.json({ success: false, message: "All password fields are required" }, { status: 400 });
            }
            if (new_password !== new_password_confirmation) {
                return NextResponse.json({ success: false, message: "New passwords do not match" }, { status: 400 });
            }
            if (new_password.length < 6) {
                return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 });
            }
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const updateData: any = {
            name,
            phone,
          };

          if (password && new_password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              return NextResponse.json({ success: false, message: "Invalid password" }, { status: 400 });
            }
            const hashedPassword = await bcrypt.hash(new_password, 10);
            updateData.password = hashedPassword;
          }
          
          await prisma.user.update({
            where: { id: userId },
            data: updateData,
          });
          

        return NextResponse.json({ success: true, message: "User information updated successfully" });
    } catch (error) {
        console.error("Error updating user info:", error);
        return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 });
    }
}
