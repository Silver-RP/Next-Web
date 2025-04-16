"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "@/context/NotificationContext";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: Author | null;
}


export default function PostsTable({
  posts,
  currentPage,
  totalPages,
}: {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showNotification } = useNotification() as unknown as {
    showNotification: (message: string, type: string) => void;
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/dashboard/posts?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Failed to delete post.", "error");
        return;
      }

      showNotification("Post deleted successfully.", "success");
      router.refresh(); // Cập nhật lại danh sách
    } catch (error) {
      showNotification((error as any) || "Failed to delete post.", "error");
    }
  };

  return (
    <div className="wg-box">
      <div className="flex items-center justify-between gap10 flex-wrap">
        <div className="wg-filter flex-grow">
          <form className="form-search">
            <fieldset className="name">
              <input type="text" placeholder="Search here..." required />
            </fieldset>
            <div className="button-submit">
              <button type="submit">
                <i className="icon-search"></i>
              </button>
            </div>
          </form>
        </div>
        <Link
          className="tf-button style-1 w208"
          href="/dashboard/posts/add-post"
        >
          <i className="icon-plus"></i>Add new
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="fs-5">#</th>
            <th className="fs-5">Title</th>
            <th className="fs-5">Image</th>
            <th className="fs-5">Author</th>
            <th className="fs-5">Created At</th>
            <th className="fs-5">Updated At</th>
            <th className="fs-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>
                  <img src={post.coverImage ?? ''} alt={post.title} className="image" />
                </td>
                <td>
                  {typeof post.author === "string"
                    ? post.author
                    : (post.author && post.author.name) || "Unknown"}
                </td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-4">
                    <Link href={`/dashboard/posts/edit-post/${post.id}`}>
                      <div className="item edit">
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ fontSize: "18px", color: "#007bff" }}
                        />
                      </div>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="item delete"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "red" }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No posts found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={Number(searchParams.get("page")) === page}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
