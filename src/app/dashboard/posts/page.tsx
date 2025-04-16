import { prisma } from "@/lib/prisma";
import PostsTable from "./PostsTable";
import { Suspense } from "react";
import Link from "next/link";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string, keyword?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 10;
  const keyword = searchParams.keyword || "";

  let totalPosts = 0;
  let posts = [];
  let totalPages = 0;

  await prisma.$disconnect();
  await prisma.$connect();

  if (keyword) {
    posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      },
      include: { 
        author: { 
          select: { id: true, name: true, email: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    totalPosts = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    });
  } else {
    totalPosts = await prisma.post.count();
    
    posts = await prisma.post.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { 
        author: { 
          select: { id: true, name: true, email: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  totalPages = Math.ceil(totalPosts / pageSize);

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
          <h3>Posts</h3>
          <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
            <li>
              <Link href="/dashboard">
                <div className="text-tiny">Dashboard</div>
              </Link>
            </li>
            <li>
              <i className="icon-chevron-right">▸</i>
            </li>
            <li>
              <div className="text-tiny">Posts</div>
            </li>
          </ul>
        </div>
        <Suspense fallback={<p>Loading posts...</p>}>
          <PostsTable 
            posts={posts} 
            currentPage={page} 
            totalPages={totalPages} 
          />
        </Suspense>
      </div>
    </div>
  );
}