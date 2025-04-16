import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password, password_confirmation, phone } = await req.json();

        if (!name || !email || !password || !phone || !password_confirmation) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 });
        }


        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Email already exists" }, { status: 400 });
        }


        if (!/^\d{10}$/.test(phone)) {
            return NextResponse.json({ success: false, message: "Invalid phone number. It must be 10 digits." }, { status: 400 });
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



        const hashedPassword = await bcrypt.hash(password, 10);

        const verifyToken = crypto.randomBytes(32).toString("hex");

        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                verifyEmail: false,
                verifyToken: verifyToken,
            },
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "Failed to register user, please try again" }, { status: 400 });
        }

        const verifyLink = `${process.env.NEXT_PUBLIC_CLIENT_URL}/verify-email/${verifyToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            text: `SILVER SHOP: Click this link to verify your email: ${verifyLink}`,
        });

        return NextResponse.json({ success: true, message: "User registered successfully. Verification email sent." });
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json({ success: false, message: "An unexpected error occurred. Please try again later." }, { status: 500 });
    }
}
