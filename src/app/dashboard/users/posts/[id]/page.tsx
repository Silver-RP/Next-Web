import { prisma } from "@/lib/prisma";
import PostsTable from "./PostsTable";
import { Suspense } from "react";
import Link from "next/link";

export default async function UserPostsPage({ params }: { params: { id: string } }) {
  const userId = params.id;

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: {
      author: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
          <h3>User Posts</h3>
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
              <div className="text-tiny">User Posts</div>
            </li>
          </ul>
        </div>
        <Suspense fallback={<p>Loading posts...</p>}>
          <PostsTable posts={posts} currentPage={0} totalPages={0} />
        </Suspense>
      </div>
    </div>
  );
}
