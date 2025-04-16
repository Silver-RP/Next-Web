
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();  
        const { email, token, password, password_confirmation } = body;

        if (email) {
            if (!email) {
                return new Response(
                    JSON.stringify({ success: false, message: "Email is required" }),
                    { status: 400 }
                );
            }

            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return new Response(
                    JSON.stringify({ success: false, message: "No user found with that email" }),
                    { status: 400 }
                );
            }

            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpires = new Date(Date.now() + 3600000); 

            await prisma.user.update({
                where: { email },
                data: { resetToken, resetTokenExpires },
            });

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const resetLink = `${process.env.NEXT_PUBLIC_CLIENT_URL}/reset-password/${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset',
                text: `
                    You are receiving this email because you requested a password reset.
                    Click the following link to reset your password: ${resetLink}
                `,
            };

            try {
                await transporter.sendMail(mailOptions);
                return new Response(
                    JSON.stringify({ success: true, message: 'Password reset email sent successfully' }),
                    { status: 200 }
                );
            } catch (error) {
                console.error('Error sending reset password email:', error);
                return new Response(
                    JSON.stringify({ success: false, message: 'An unexpected error occurred. Please try again later.' }),
                    { status: 500 }
                );
            }
        }

        // Handle password reset logic
        if (token) {
            if (!token || !password || !password_confirmation) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Password and confirmation are required' }),
                    { status: 400 }
                );
            }

            if (password !== password_confirmation) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Passwords do not match' }),
                    { status: 400 }
                );
            }

            if (password.length < 6) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Password must be at least 6 characters long' }),
                    { status: 400 }
                );
            }

            const user = await prisma.user.findFirst({ where: { resetToken: token } });

            if (!user) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Invalid or expired token' }),
                    { status: 400 }
                );
            }

            if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Token has expired' }),
                    { status: 400 }
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedPassword,
                    resetToken: null, 
                    resetTokenExpires: null,
                },
            });

            return new Response(
                JSON.stringify({ success: true, message: 'Password updated successfully' }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: false, message: 'Method Not Allowed' }),
            { status: 405 }
        );
    } catch (error) {
        console.error('Error parsing the body:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Invalid JSON format' }),
            { status: 400 }
        );
    }
}
