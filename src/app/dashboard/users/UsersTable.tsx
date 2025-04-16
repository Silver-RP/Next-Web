"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNotification } from "../../../context/NotificationContext";
import {
  faBan,
  faLockOpen,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

interface User {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  avatar: string;
  totalOrders: number;
  totalPosts: number; // Thêm thuộc tính này
  blocked: boolean;
  role: string;
}

export default function UsersTable({
  users,
  currentPage,
  totalPages,
}: {
  users: User[];
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
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleBlockUser = async (id: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocked: !isBlocked }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(
          data.message || "Failed to update user status.",
          "error"
        );
        return;
      }

      showNotification(
        `User ${!isBlocked ? "blocked" : "unblocked"} successfully.`,
        "success"
      );
      router.refresh();
    } catch (error: any) {
      showNotification(
        error.message || "Failed to update user status.",
        "error"
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification(data.message || "Failed to delete user.", "error");
        return;
      }

      showNotification("User deleted successfully.", "success");
      router.push("/dashboard/users");
    } catch (error) {
      showNotification((error as any) || "Failed to delete user.", "error");
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
          href="/dashboard/users/add-user"
        >
          <i className="icon-plus"></i>Add new
        </Link>
      </div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="fs-5">#</th>
            <th className="fs-5">User</th>
            <th className="fs-5">Phone</th>
            <th className="fs-5">Email</th>
            <th className="text-center fs-5">Total Posts</th>
            <th className="fs-5">Blocked</th>
            <th className="fs-5">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td className="pname">
                  <div>
                    <img src={user.avatar} alt={user.name} className="image" />
                  </div>
                  <div className="d-flex flex-column">
                    <span className="body-title-2">{user.name}</span>
                    <span className="body-title-2 mt-2 opacity-50">
                      {user.role}
                    </span>
                  </div>
                </td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td className="text-center ps-5 ">
                  <Link href={`/dashboard/users/posts/${user.id}`} style={{color: " rgb(85, 173, 17)", fontSize: "16px", fontWeight: "bold"}}>
                  {user.totalPosts || 0}{" "}
                  </Link>
                </td>
                <td>
                  {user.blocked ? (
                    <span className="bg-danger rounded-3 p-2 text-white">
                      Blocked
                    </span>
                  ) : (
                    <span className="bg-success rounded-3 p-2 text-white">
                      Active
                    </span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-4">
                    <Link href={`/dashboard/users/edit-user/${user.id}`}>
                      <div className="item edit">
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ fontSize: "18px", color: "#007bff" }}
                        />
                      </div>
                    </Link>

                    {!user.blocked ? (
                      <FontAwesomeIcon
                        icon={faLockOpen}
                        onClick={() => handleBlockUser(user.id, user.blocked)}
                        className="text-success cursor-pointer"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faBan}
                        onClick={() => handleBlockUser(user.id, user.blocked)}
                        className="text-danger cursor-pointer"
                      />
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
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
                No users found
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
