import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const keyword = searchParams.get("keyword");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

        if (!keyword) {
            return NextResponse.json(
                { success: false, message: "Keyword is required" },
                { status: 400 }
            );
        }

        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { content: { contains: keyword, mode: "insensitive" } },
                ],
            },
            include: {
                author: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const totalPosts = await prisma.post.count({
            where: {
                OR: [
                    { title: { contains: keyword, mode: "insensitive" } },
                    { content: { contains: keyword, mode: "insensitive" } },
                ],
            }
        });

        const totalPages = Math.ceil(totalPosts / pageSize);

        return NextResponse.json({ 
            success: true, 
            data: posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalPosts,
                pageSize
            }
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}