import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    const formattedPosts = posts.map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));


    return NextResponse.json({ success: true, data: formattedPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = getUserIdFromToken(token) as unknown as { id: string }; 
    console.log("Decoded token id:", decoded);
    if (!decoded || typeof decoded !== "string" || !decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 });
    }

    const { title, content, coverImage } = body;

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (coverImage && !isValidURL(coverImage)) {
      return NextResponse.json({ success: false, message: "Invalid cover image URL" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        coverImage,
        authorId: decoded,
      },
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
