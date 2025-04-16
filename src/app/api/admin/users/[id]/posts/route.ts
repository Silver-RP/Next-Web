
import { prisma } from "@/lib/prisma"; 
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const posts = await prisma.post.findMany({
      where: {
        authorId: id, 
      },
    });

    if (posts.length === 0) {
      return NextResponse.json({ success: false, message: "No posts found for this user" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
  }
}
