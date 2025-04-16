import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET(req: NextRequest) {
    try {
        const users = await prisma.user.findMany({
            include: {
                posts: true,
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });

        const usersWithVerifiedCounts = users.map(user => ({
            ...user,
            postsCount: user.posts.length, 
            _count: {
                posts: user.posts.length
            }
        }));

        return NextResponse.json({ success: true, data: usersWithVerifiedCounts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred." },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, role = "user", password, password_confirmation } = body;

        if (!name || !email || !phone) {
            return NextResponse.json({ success: false, message: "Name, email, and phone are required" }, { status: 400 });
        }

        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            return NextResponse.json({ success: false, message: "Invalid phone number. It must be 10 digits." }, { status: 400 });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
        }

        if (password !== password_confirmation) {
            return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
        }

        // if (password.length < 6) {
        //     return NextResponse.json({ success: false, message: "Password must be at least 6 characters long" }, { status: 400 });
        // }

        if (!/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password)) {
            return NextResponse.json(
                { success: false, message: "Password must be at least 8 characters long, include at least one uppercase letter and one special character." },
                { status: 400 }
            );
        }

        const hashedPassword = crypto.createHash("sha256").update(password || Math.random().toString(36).slice(-8)).digest("hex");

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role,
            },
        });

        if (!newUser) {
            return NextResponse.json({ success: false, message: "Failed to add user, please try again" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "User added successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error during user addition:", error);
        return NextResponse.json({ success: false, message: "An unexpected error occurred. Please try again later." }, { status: 500 });
    }
}

