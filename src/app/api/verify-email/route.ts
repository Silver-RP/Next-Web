import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ success: false, message: "Cannot find Verify Token" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({ where: { verifyToken: token } });
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { verifyEmail: true, verifyToken: null },
        });

        return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({ success: false, message: "An error occurred while verifying email." }, { status: 500 });
    }
}
