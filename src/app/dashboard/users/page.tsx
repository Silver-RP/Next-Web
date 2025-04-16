import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";
import { Suspense } from "react";
import Link from "next/link";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 10;

  const totalUsers = await prisma.user.count();
  const totalPages = Math.ceil(totalUsers / pageSize);

  await prisma.$disconnect();
  await prisma.$connect();

  const users = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      posts: true, 
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  const usersWithVerifiedCounts = users.map(user => {
    const actualPostCount = user.posts.length;
    
    const { posts, ...userWithoutPosts } = user;
    
    return {
      ...userWithoutPosts,
      totalPosts: actualPostCount,
    };
  });

  return (
    <div className="main-content-inner">
      <div className="main-content-wrap">
        <div className="flex items-center flex-wrap justify-between gap20 mb-27">
          <h3>Users</h3>
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
              <div className="text-tiny">Users</div>
            </li>
          </ul>
        </div>
        <Suspense fallback={<p>Loading users...</p>}>
          <UsersTable users={usersWithVerifiedCounts} currentPage={page} totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}